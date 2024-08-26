# 概要

買い物リストアプリです。  
身内しか公開していません。  
Google認証は高価なAppleデベロッパーに登録しないといけないのでやめました。

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
