# 概要

買い物リストアプリです。

# 実装予定

| 機能                    | 重要度 | コスト | 備考                         |
|-----------------------|-----|-----|----------------------------|
| 開発・本番モード切替            | 高   | 中   |                            |
| リアルタイム通知、push通知       | 高   | 高   |                            |
| レンダリング見直し・修正          | 中   | 高   |                            |
| 数量設定                  | 高   | 少   |                            |
| 詳細画面                  | 高   | 中   | カテゴライズ、メモ、更新処理             |
| カテゴリー表示               | 高   | 少   | アコーディオン、カテゴリごとの追加          |
| 一括状態更新                | 中   | 少   |                            |
| 欲しいものタブ               | 中   | 少   | 欲しい人でフィルタ                  |
| 削除ボタンやめて横スワイプで削除      | 中   | 高   |                            |
| ユーザー認証情報のグルーバル保持      | 中   | 小   |                            |
| セッション切れたらログイン画面リダイレクト | 中   | 中   |                            |
| 画像添付                  | 低   | 中   |                            |
| 検索                    | 低   | 高   |                            |
| 設定タブ                  | 低   | 高   | 共有設定、ユーザー登録、認証 、通知設定、テーマ設定 |
| CI/CD                 | 低   | 中   |                            |
| テストコード                | 低   | 高   |                            |

# 実機確認

実機で開発者モードを有効にしておく。

```shell
$ expo run:android --device
$ expo run:ios --device
```

# ios開発

```shell
Command `pod install` failed.
└─ Cause: Failed to load 'hermes-engine' podspec: 
[!] Invalid `hermes-engine.podspec` file: undefined method `visionos' for #<Pod::Specification name="hermes-engine/Pre-built">.
```

このエラーになったら

```shell
$ sudo gem install cocoapods
$ npx expo install --fix
$ cd ios
$ rm Podfile.lock
$ pod install
```
