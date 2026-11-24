# スタディレーサーズ

小学6年生の算数を組み込んだ、見下ろし2Dレーシングゲームの第2版です。キーボードとタッチ操作に対応します。

- プレイヤー1台＋CPU3台、3周、算数5問。
- 直線、S字、折り返しが特徴の3コース。走り方が異なる3台から選択。
- 分数の乗除・比・比例の計45問を収録。
- 正解でブーストエネルギーを獲得。第2・第4問ではアイテムも獲得。
- 問題を考える間は全車が停止。時間制限はありません。
- 学習難易度・CPU難易度・運転アシストを個別に設定できます。
- ヒント、サポート用の図、復習、端末内の履歴保存に対応。

## GitHub Pagesで公開する

公開すると、児童は公開URLを開いてログインなしで遊べます。ゲームは静的HTMLだけで動き、外部APIやデータベースは不要です。

既に公開中のリポジトリを使う場合は、「第2版に更新する」の手順へ進みます。

### 1 リポジトリを用意する

1. GitHubへログインし、新しいリポジトリを作ります。
2. 名前の例は `study-racers` です。
3. 公開用として **Public** を選びます。
4. **Add a README file** を有効にして作成すると、最初から `main` ブランチができます。

GitHub Freeでは公開リポジトリでGitHub Pagesを利用できます。既存リポジトリを使う場合は、そのリポジトリの公開範囲とPages設定を確認してください。

### 2 公開元を設定する

リポジトリの **Settings → Pages → Build and deployment → Source** で **GitHub Actions** を選びます。

### 3 ファイルをアップロードする

1. このZIPを展開します。
2. リポジトリの **Code → Add file → Upload files** を開きます。
3. 展開したフォルダの「中身」をアップロードします。ZIP自体や外側のフォルダごとではありません。
4. `.github` と `scripts` は、中の構造を保ったままフォルダごとアップロードします。
5. **Commit changes** で `main` に保存します。最初の公開が自動で始まります。

リポジトリの最上位が次の構成になっていれば準備完了です。

```text
index.html
.nojekyll
.gitignore
README.md
.github/
  workflows/
    pages.yml
scripts/
  check.cjs
```

`index.html` が余分なフォルダの中に入らないようにしてください。アップロード時にREADMEの置換を求められた場合は、このゲームのREADMEに更新します。

### 4 公開URLを確認する

1. **Actions → Publish Study Racers** を開きます。
2. `Check the HTML game` と `Publish to GitHub Pages` が緑色になるまで待ちます。
3. 実行結果の `github-pages` のURL、または **Settings → Pages** の **Visit site** を開きます。

URLは通常 `https://あなたのGitHubユーザー名.github.io/リポジトリ名/` です。上記は形式の説明です。実際のURLはGitHubの表示から確認してください。

初回に自動実行されなかった場合は、**Actions → Publish Study Racers → Run workflow** でブランチ `main` を選んで実行します。

## 第2版に更新する

公開中の `ryo609bass2/study-racers` では、最上位の `index.html` と `scripts/check.cjs` を同じコミットで更新します。既存の `.github/workflows/main.yml` がテストと公開を行います。公開URLは [スタディレーサーズ](https://ryo609bass2.github.io/study-racers/) です。

`index.html` はCSS・プログラム・問題を含む単一ファイルです。手元で試すときは、ZIPを展開して `index.html` をブラウザで開きます。元の開発フォルダで `node bundle.cjs` を実行すると、`release/index.html` を再生成できます。公開用フォルダでは `node scripts/check.cjs` で全9通りの自動完走を確認できます。

## 操作

| キー | 操作 |
|---|---|
| ← → / A D | ハンドル |
| ↑ / W | アクセル |
| ↓ / S | ブレーキ |
| Space | ブースト、エネルギー40使用 |
| E | アイテム |
| R | コースに戻る |
| Esc | 一時停止 |
| 1・2・3 | 答えを選択 |

タッチ端末では、画面下の左右ボタン、アクセル、ブレーキを押して運転します。コース外からは「コースに戻る」を使えます。運転アシストをオンにすると、アクセルを押し続けずに走れます。

## 保存される情報

設定と直近20レースの結果を、利用者の端末・ブラウザ内に保存します。ゲームのプログラムは氏名や成績をサーバーへ送信しません。共有PCでは、そのブラウザを使う人の記録がまとめて表示されます。

同じGitHub PagesのURLを同じブラウザで開いた場合、第1版の履歴を「旧スクールサーキット」として表示します。手元のファイル版や別のURLの履歴は、それぞれの保存場所に残ります。

## 公開がうまくいかないとき

- **Pagesの項目がない**：リポジトリの管理権限と利用プランを確認してください。
- **Configure GitHub Pagesで失敗**：Settings → Pages の Source をGitHub Actionsに設定し、失敗した実行の Re-run jobs を選びます。
- **Check the HTML gameで失敗**：`index.html` と `scripts/check.cjs` が正しい場所にあるか確認します。ログには失敗した確認内容が表示されます。
- **公開が承認待ち**：リポジトリの環境保護ルールに従い、管理者が承認してください。
- **404になる**：Actionsの公開完了を確認し、Settings → Pagesに表示されたURLを使います。
- **更新が見えない**：公開処理が完了してからブラウザを再読み込みします。
- **main以外を使用している**：ワークフローの `branches: [main]` と `refs/heads/main` の両方を対象のブランチ名に合わせます。

## ローカルでの確認

`index.html` をブラウザで開くと遊べます。Node.jsがある環境では `node scripts/check.cjs` で、HTML・問題数・3周5問・停止中の状態保持・報酬の重複防止を確認できます。

学校端末での性能や児童の試遊による難易度調整は、利用する環境で確認してください。

## GitHub公式の手順

- [GitHub Pagesの公開元を設定する](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
- [GitHub ActionsでGitHub Pagesを公開する](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)
