# X One Click Button

English | [日本語](https://github.com/hakhatz2486/x-one-click-button/blob/main/README-ja.md)

A userscript that adds account-action buttons to X (Twitter) posts and following/follower lists.
It automates X menus and confirmation dialogs, allowing you to mute, block, unfollow, and remove followers with a single click.

## Features

### Other accounts' posts

![Mute/Block buttons added to other accounts' posts](https://raw.githubusercontent.com/hakhatz2486/x-one-click-button/main/images/post-mute-block-buttons.png)

Adds `Mute` and `Block` buttons to other accounts' posts, letting you perform "Mute" and "Block" respectively.
It also adds a `👎️ (Not interested)` button, which selects "Not interested in this post" on the For You timeline, or "This post wasn't helpful" on search results.

### Your own posts

![Delete button added to your own posts](https://raw.githubusercontent.com/hakhatz2486/x-one-click-button/main/images/own-post-delete-button.png)

Adds a `Delete` button to your own posts, letting you delete the post.

### Following list

![Unfollow button added to the following list](https://raw.githubusercontent.com/hakhatz2486/x-one-click-button/main/images/following-list-buttons.png)

Adds an `Unfollow` button to the following list, letting you unfollow the selected account.

### Follower list

![Unfollow/Block buttons added to the follower list](https://raw.githubusercontent.com/hakhatz2486/x-one-click-button/main/images/follower-list-buttons.png)

Adds `Unfollow` and `Block` buttons to the follower list, letting you remove the selected account from your followers or block it.

- Supports Japanese and English X menus
- Follows X SPA navigation and dynamic list rendering

## Installation

1. Install a userscript manager in your browser.
2. Install from the [X One Click Button](https://greasyfork.org/en/scripts/587690-x-one-click-button) page on Greasy Fork.
3. Reload `x.com`.

## Usage

After installation, custom buttons appear near X's standard controls on supported screens.
Click an action button to automatically select the X menu item and confirm the action.

On the follower list, `Unfollow` removes the selected account from your followers; it does not unfollow that account from your own account.

## Notes

- Confirmation dialogs are skipped, and the action executes automatically. Verify the target account before clicking an action button.
- Unfollowing, removing followers, muting, and blocking are not automatically reversible.
- The script may stop working if X changes its DOM structure or menu labels.
- This script operates through the X interface and does not use the X API or API keys.

## Changelog

See [CHANGELOG.md](https://github.com/hakhatz2486/x-one-click-button/blob/main/CHANGELOG.md).

## License

[MIT License](https://github.com/hakhatz2486/x-one-click-button/blob/main/LICENSE)
