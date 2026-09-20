# X One Click Button

English | [日本語](https://github.com/hakhatz2486/x-one-click-button/blob/main/README-ja.md)

A userscript that adds account-action buttons to X (Twitter) posts and following/follower lists.
It automates X menus and confirmation dialogs, allowing you to mute, block, unfollow, and remove followers with a single click.

## Features

| Screen                | Added buttons          | Action                                                       |
| --------------------- | ----------------------- | ------------------------------------------------------------ |
| Other accounts' posts | `Mute` / `Block`       | "Mute" / "Block"                                             |
| Other accounts' posts | `👎️ (Not interested)`  | "Not interested in this post" / "This post wasn't helpful" (search results) |
| Your own posts        | `Delete`                | "Delete"                                                      |
| Following list        | `Unfollow`              | Unfollow the selected account                                 |
| Follower list         | `Unfollow` / `Block`    | Remove the selected account from your followers or block it  |

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

- Confirmation dialogs are automatically accepted. Verify the target account before clicking an action button.
- Unfollowing, removing followers, muting, and blocking are not automatically reversible.
- The script may stop working if X changes its DOM structure or menu labels.
- This script operates through the X interface and does not use the X API or API keys.

## Changelog

See [CHANGELOG.md](https://github.com/hakhatz2486/x-one-click-button/blob/main/CHANGELOG.md).

## License

[MIT License](https://github.com/hakhatz2486/x-one-click-button/blob/main/LICENSE)
