'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.ok(html.startsWith('<!doctype html>'), 'HTML document is required');
assert.ok(html.includes('lang="ja"'), 'Japanese document language is required');
assert.ok(!/<script\b[^>]*\bsrc\s*=/i.test(html), 'Scripts must be bundled');
assert.ok(!/<link\b[^>]*rel="stylesheet"/i.test(html), 'Styles must be bundled');
assert.ok(fs.existsSync(path.join(root, '.nojekyll')), '.nojekyll must be included');

const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m => m[1]);
assert.equal(scripts.length, 3, 'Three bundled game scripts are expected');
scripts.forEach((source, i) => new vm.Script(source, {filename: `game-part-${i + 1}.js`}));

// Run only the DOM-independent game engine and question bank.
const context = vm.createContext({});
vm.runInContext(scripts[0], context, {timeout: 5000});
vm.runInContext(scripts[1], context, {timeout: 5000});
const C = context.StudyCore;
const bank = context.StudyQuestions;
C.validateBank(bank);
assert.equal(bank.length, 45);
for (const unit of ['fraction', 'ratio', 'proportion']) {
  for (const level of ['support', 'standard', 'challenge']) {
    assert.equal(bank.filter(q => q.unit === unit && q.level === level).length, 5);
    const selected = C.chooseQuestions(bank, {units: [unit], learning: level, seed: 123});
    assert.equal(selected.length, 5);
    assert.equal(new Set(selected.map(q => q.id)).size, 5);
  }
}

const race = new C.Race({assist: true, cpu: 'normal', seed: 123}, bank);
race.uiTick(3.1);
let questionCount = 0;
for (let i = 0; i < 600 * 60; i++) {
  if (race.state === 'RACING') race.step();
  else if (race.state === 'QUIZ') {
    questionCount++;
    const frozen = JSON.stringify({cars: race.cars, time: race.time});
    for (let j = 0; j < 60; j++) race.step();
    assert.equal(JSON.stringify({cars: race.cars, time: race.time}), frozen);
    race.select(race.questions[race.quizIndex].correctChoiceId);
    assert.equal(race.answer(), true);
    assert.equal(race.answer(), false);
    assert.equal(race.acknowledge(), true);
    assert.equal(race.acknowledge(), false);
  } else if (race.state === 'RESUME_COUNTDOWN') race.uiTick(3.1);
  if (race.state === 'RESULT') break;
}
assert.equal(race.state, 'RESULT', 'The race must finish');
assert.equal(race.player.laps, 3);
assert.equal(questionCount, 5);
assert.equal(race.answers.length, 5);
assert.ok(race.answers.every(a => a.outcome === 'correct' && a.rewardApplied));
console.log(`PASS: standalone HTML, 45 questions, 3 laps, 5 quizzes, pause and reward checks (${race.time.toFixed(2)} simulation seconds).`);
