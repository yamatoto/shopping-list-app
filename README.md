# 概要

買い物リストアプリです。  
身内しか公開していません。  
Google認証は高価なAppleデベロッパーに登録しないといけないのでやめました。

# 実装予定

| 機能               | 重要度 | コスト | 備考                         |
|------------------|---|-----|----------------------------|
| 数量設定             | 高 | 少   |                            |
| リアルタイム更新         | 高 | 高   |                            |
| レンダリング見直し・修正     | 高  | 高   |                            |
| 通知処理             | 高 | 高   |                            |
| 要望form・一覧画面      | 高 | 高   |                            |
| 更新予定画面           | 中 | 小   |                            |
| 詳細画面             | 高 | 高   | カテゴライズ、メモ、更新処理             |
| カテゴリー表示          | 高 | 少   | アコーディオン、カテゴリごとの追加          |
| 一括状態更新           | 中 | 少   |                            |
| 欲しいものタブ          | 中 | 少   | 欲しい人でフィルタ                  |
| 削除ボタンやめて横スワイプで削除 | 中 | 高   |                            |
| ユーザー認証情報のグルーバル保持 | 中 | 小   |                            |
| デザイン修正           | 低  | 小   |                            |
| 画像添付             | 低 | 中   |                            |
| 検索               | 低 | 高   |                            |

# 実機確認

実機で開発者モードを有効にしておく。

```shell
$ yarn start
```

Expo GoアプリでQRコードを読み込む。

# 身内アプリ配布

```shell
$ yarn pub
```

https://expo.dev/accounts/yamato1987/projects/shopping-list-app/updates  
最新のビルドを選択して、Previewをクリックすると、QRコードが表示されるので共有

# 機密ファイル

google-services.json, GoogleService-Info.plistは機密情報を含むため、リポジトリには含めない。  

secretに登録する  
https://docs.expo.dev/build-reference/variables/#how-to-upload-a-secret-file-and-use-it-in-my-app-config

更新したい時

```shell
$ eas secret:list
$ eas secret:delete --id xxx
```

# 環境変数

```shell
$ eas secret:push --scope project --env-file .env
```

https://docs.expo.dev/build-reference/variables/

## その他

```shell
# 実機エラーログ表示
$ adb logcat 'ReactNativeJS:E *:S'
```
