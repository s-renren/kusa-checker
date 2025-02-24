<h1 align="center">kusa-checker</h1>

## 毎日のコーディングを始めるきっかけを作るDiscord Bot

### 機能
 - 朝9時にメッセージ
 - 草が生えていない場合、11時、13時、15時、21時にメッセージを送信
 - ```/kusa```を使用すると、現在のcontribution数を取得
 - ```/coding```を使用すると、ユーザーにロールを付与し、定期メッセージが送信されないように
 - 日付が変わるタイミングでロールを自動削除

### 技術スタック
 - Deno
 - Discordeno

#### Deploy
 - Deno Deploy

## 使用手順
### Discord Botを対象サーバーに招待
#### Botには以下の権限を付与してください。
 - Sned Messages
 - Read Message History


```$ deno --version```で```deno 1.40.0```以上を推奨
### リポジトリをクローン
```sh
$ git clone https://github.com/s-renren/kusa-checker.git
$ cd kusa-checker
$ rm -rf .git # 既存のコミット履歴を削除したい場合に使用
$ git init
```
### 環境変数ファイルを作成
```sh
$ touch .env.local
```
 - 環境変数の設定
```sh
DISCORD_TOKEN = 
GITHUB_ACCESS_TOKEN = 
GUILD_ID = 
CHANNEL_ID = 
ROLE_ID = 
USER_ID = 
```
 - DISCORD_TOKEN: Discord Bot作成時に取得した値
 - GITHUB_ACCESS_TOKEN: GitHub の Personal access token
 - GUILD_ID, CHANNEL_ID, ROLE_ID, USER_ID: それぞれ、DiscordのサーバーID、チャンネルID、ロールID, ユーザーID
 - Discord Botを招待時、サーバーの管理からBotに対してロール管理の権限を付与してください。
 - ロールは別途自身で作成してください。

### ローカルでのBotの起動
```sh
$ deno task dev
```

## デプロイ
 - **Deno Deploy**でデプロイ可能
 - **エントリーポイントは```main.ts```を指定**
 - ```local.env```と同じ値を環境変数に指定



