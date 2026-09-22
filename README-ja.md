# X One Click Button

[English](https://github.com/hakhatz2486/x-one-click-button/blob/main/README.md) | 日本語

X(Twitter)のポストやフォロー中・フォロワー一覧に、アカウント操作用のボタンを追加するユーザースクリプトです。
Xのメニューと確認ダイアログを自動操作し、ミュート、ブロック、フォロー解除などをワンクリックで実行できます。

## スクリーンショット

![他アカウントのポストに追加されるMute/Blockボタン](https://raw.githubusercontent.com/hakhatz2486/x-one-click-button/main/images/post-mute-block-buttons.png)

![自分のポストに追加されるDeleteボタン](https://raw.githubusercontent.com/hakhatz2486/x-one-click-button/main/images/own-post-delete-button.png)

![フォロー中一覧に追加されるUnfollowボタン](https://raw.githubusercontent.com/hakhatz2486/x-one-click-button/main/images/following-list-buttons.png)

![フォロワー一覧に追加されるUnfollow/Blockボタン](https://raw.githubusercontent.com/hakhatz2486/x-one-click-button/main/images/follower-list-buttons.png)

## 機能

| 対象画面             | 追加されるボタン     | 動作                                             |
| -------------------- | -------------------- | ------------------------------------------------ |
| 他アカウントのポスト | `Mute`/`Block`     | 「ミュート」/「ブロック」                                   |
| 他アカウントのポスト | `👎️(低評価)`         | 「このポストに興味がない」/「このポストは役に立ちませんでした」(検索結果) |
| 自分のポスト         | `Delete`             | 「削除」                                         |
| フォロー中一覧       | `Unfollow`           | 対象アカウントのフォローを解除                   |
| フォロワー一覧       | `Unfollow`/`Block` | 対象アカウントをフォロワーから削除またはブロック |

- 日本語・英語表示のXに対応
- XのSPA遷移や動的なリスト描画に追従

## 導入

1. ユーザースクリプトマネージャーをブラウザへインストールします。
2. Greasy Forkの [X One Click Button](https://greasyfork.org/ja/scripts/587690-x-one-click-button) からインストールします。
3. `x.com`を再読み込みします。

## 使用

インストール後、対応画面を開くとXの標準操作ボタン付近にカスタムボタンが表示されます。
目的のボタンをクリックすると、Xのメニュー選択と確認操作が自動的に実行されます。

フォロワー一覧の`Unfollow`は、自分がそのアカウントをフォロー解除する操作ではなく、対象アカウントを自分のフォロワーから削除する操作です。

## 注意事項

- 確認ダイアログはスキップし、実行されますます。クリック前に対象アカウントと操作内容を必ず確認してください。
- 実行したフォロー解除、フォロワー削除、ミュート、ブロックは自動では元に戻りません。
- Xの画面構造や表示文言が変更されると、ボタンの表示や操作が動作しなくなる場合があります。
- 本スクリプトはXの画面を操作するもので、APIは使用しません。

## 変更履歴

[CHANGELOG-ja.md](https://github.com/hakhatz2486/x-one-click-button/blob/main/CHANGELOG-ja.md)を参照してください。

## ライセンス

[MIT License](https://github.com/hakhatz2486/x-one-click-button/blob/main/LICENSE)
