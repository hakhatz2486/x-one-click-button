# X One Click Button

English | [日本語](https://github.com/hakhatz2486/x-one-click-button/blob/main/README-ja.md)

A userscript that adds account-action buttons to X (Twitter) posts and following/follower lists.
It automates X menus and confirmation dialogs, allowing you to mute, block, unfollow, and remove followers with a single click.

## Features

| Screen | Added buttons | Action |
| --- | --- | --- |
| Post timeline | `Mute` / `Block` | Mute or block the post author |
| Following list | `Unfollow` | Unfollow the selected account |
| Follower list | `Unfollow` / `Block` | Remove the selected account from your followers or block it |

- Supports Japanese and English X menus
- Follows X SPA navigation and dynamic list rendering
- Excludes inverse actions such as `Unblock` and `Unmute`
- Prevents multiple actions from running at the same time

## Installation

1. Install a userscript manager such as [Tampermonkey](https://www.tampermonkey.net/).
2. Open the [X One Click Button](https://greasyfork.org/en/scripts/587690-x-one-click-button) script page on Greasy Fork.
3. Click **Install this script**, then confirm the installation in your userscript manager.
4. Reload `x.com` or `twitter.com`.

## Usage

After installation, custom buttons appear near X's standard controls on supported screens.
Click an action button to automatically select the X menu item and confirm the action.

On the follower list, `Unfollow` removes the selected account from your followers; it does not unfollow that account from your own account.

## Notes

- Confirmation dialogs are automatically accepted. Verify the target account before clicking an action button.
- Unfollowing, removing followers, muting, and blocking are not automatically reversible.
- The script may stop working if X changes its DOM structure or menu labels.
- This script operates through the X interface and does not use the X API or API keys.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

[MIT License](LICENSE)
