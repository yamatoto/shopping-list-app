# 概要

買い物リストアプリです。  
身内にしかアプリ配布していません。  
Google認証は高価なAppleデベロッパーに登録しないといけないのでやめました。

# 技術スタック

- React Native
- Expo
- Firebase
  - firestore
  - auth

# 機能

- 買い物リストを登録できる
- 直近で買うものといつも買うもの（定番）でタブが分かれている
  - どちらからも登録ができ、ボタンひとつでもう片方へ登録もできる 
- 購入予定数量を登録できる
- どこで買う予定かメモができる
- 商品名の更新ができる
- 横スライドで削除ができる
- 削除してもアーカイブリストに保存される
- 買い物の商品のカテゴリ分けができる
- カテゴリでアコーディオン開閉ができる
- 家族間で共有できる
  - 登録・更新した際にリアルタイムで家族の画面へ反映・通知がされる

# demo

https://github.com/user-attachments/assets/c48b38bf-e92a-44fa-8c18-e6ec8573d65c

# 実機確認

実機で開発者モードを有効にしておく。

```shell
$ yarn dev
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
