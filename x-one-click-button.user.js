// ==UserScript==
// @name           X One Click Button
// @name:ja        X One Click Button
// @namespace      https://github.com/hakhatz2486/x-one-click-button
// @version        1.0.0
// @description    Perform actions such as blocking, muting, and unfollowing with a single click on X (Twitter) posts and following/follower lists.
// @description:ja X(Twitter)のポストやフォロー中/フォロワーの一覧に対し、ブロック、ミュート、フォロー解除等の操作をワンクリックで実行できます。
// @author         hakhatz2486
// @homepageURL    https://github.com/hakhatz2486/x-one-click-button
// @supportURL     https://github.com/hakhatz2486/x-one-click-button/issues
// @license        MIT
// @match          https://x.com/*
// @match          https://twitter.com/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=x.com
// @grant          none
// @run-at         document-end
// ==/UserScript==

(function () {
    "use strict";

    function isElementVisible(element) {
        return element.isConnected && element.getClientRects().length > 0;
    }

    function getVisibleElements(selector) {
        return new Set(
            [...document.querySelectorAll(selector)].filter(isElementVisible),
        );
    }

    // 操作前から表示されていた要素を除外し、新しく表示された要素を待機する。
    async function waitForNewElement(selector, excluded, timeout = 2000) {
        return new Promise((resolve) => {
            let timeoutId;
            const findElement = () =>
                [...document.querySelectorAll(selector)].find(
                    (element) =>
                        !excluded.has(element) && isElementVisible(element),
                );
            const observer = new MutationObserver(() => {
                const element = findElement();
                if (element) finish(element);
            });
            const finish = (element) => {
                observer.disconnect();
                clearTimeout(timeoutId);
                resolve(element);
            };

            const element = findElement();
            if (element) {
                finish(element);
                return;
            }

            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ["class", "style", "aria-hidden"],
                childList: true,
                subtree: true,
            });

            timeoutId = setTimeout(() => finish(null), timeout);
        });
    }

    // アクションごとのキーワードと設定
    const ACTION_CONFIG = {
        block: {
            keywords: ["ブロック", "block"],
            excludedKeywords: ["ブロック解除", "ブロックを解除", "unblock"],
            needsConfirm: true,
            hoverColor: "rgb(249, 24, 128)", // ピンク/赤系
            hoverBg: "rgba(249, 24, 128, 0.1)",
        },
        mute: {
            keywords: ["ミュート", "mute"],
            excludedKeywords: ["ミュート解除", "ミュートを解除", "unmute"],
            needsConfirm: false,
            hoverColor: "rgb(29, 155, 240)", // 青系
            hoverBg: "rgba(29, 155, 240, 0.1)",
        },
        unfollow: {
            keywords: ["フォロー解除", "unfollow", "フォローを解除"],
            needsConfirm: true,
            hoverColor: "rgb(255, 173, 31)", // オレンジ系
            hoverBg: "rgba(255, 173, 31, 0.1)",
        },
        removeFollower: {
            keywords: ["フォロワーを削除", "remove this follower"],
            needsConfirm: true,
            hoverColor: "rgb(255, 173, 31)", // オレンジ系
            hoverBg: "rgba(255, 173, 31, 0.1)",
        },
    };

    let actionInProgress = false;

    function matchesAction(text, config) {
        const normalizedText = text.toLocaleLowerCase();
        const isExcluded = config.excludedKeywords?.some((keyword) =>
            normalizedText.includes(keyword.toLocaleLowerCase()),
        );
        if (isExcluded) return false;

        return config.keywords.some((keyword) =>
            normalizedText.includes(keyword.toLocaleLowerCase()),
        );
    }

    // UIのクリックを自動化してアクションを実行する共通関数
    async function executeAction(menuBtn, actionType) {
        const config = ACTION_CONFIG[actionType];
        try {
            // 1. 三点リーダー（もっと見る）をクリック
            const existingMenus = getVisibleElements('[role="menu"]');
            menuBtn.click();

            // 2. 今回のクリックで開いたドロップダウンメニューを待機
            const menu = await waitForNewElement(
                '[role="menu"]',
                existingMenus,
            );
            if (!menu) {
                document.body.click();
                return false;
            }

            // メニュー項目の描画を少し待つ
            await new Promise((resolve) => setTimeout(resolve, 100));

            // 対象の項目を探してクリック
            let targetMenuItem = null;
            const items = menu.querySelectorAll('[role="menuitem"]');
            for (const item of items) {
                if (matchesAction(item.textContent, config)) {
                    targetMenuItem = item;
                    break;
                }
            }

            if (!targetMenuItem) {
                document.body.click(); // メニューに項目が存在しない場合は閉じる
                return false;
            }

            // 3. 必要な場合は今回表示された確認ダイアログだけを操作する
            if (config.needsConfirm) {
                const confirmSelector =
                    '[data-testid="confirmationSheetConfirm"]';
                const existingConfirmButtons =
                    getVisibleElements(confirmSelector);
                targetMenuItem.click();
                const confirmButton = await waitForNewElement(
                    confirmSelector,
                    existingConfirmButtons,
                );
                if (!confirmButton) {
                    document.body.click(); // ダイアログを閉じる
                    return false;
                }
                confirmButton.click();
            } else {
                targetMenuItem.click();
                // 確認が不要な場合（ミュートなど）は処理完了を少し待つ
                await new Promise((resolve) => setTimeout(resolve, 300));
            }

            return true;
        } catch (e) {
            console.error(`DOM click ${actionType} failed:`, e);
            document.body.click(); // エラー時にUIをリセット
            return false;
        }
    }

    async function executeCurrentMenuAction(container, selector, actionType) {
        const menuBtn = container.querySelector(selector);
        if (!menuBtn) return false;
        return executeAction(menuBtn, actionType);
    }

    // フォロー中一覧の標準ボタンを使ってフォロー解除する
    async function executeUnfollowButton(cell) {
        try {
            // Reactの再描画後も現在の標準ボタンを使う。
            const unfollowBtn = cell.querySelector(
                'button[data-testid$="-unfollow"]',
            );
            if (!unfollowBtn) return false;

            const confirmSelector = '[data-testid="confirmationSheetConfirm"]';
            const existingConfirmButtons = getVisibleElements(confirmSelector);
            unfollowBtn.click();

            const confirmButton = await waitForNewElement(
                confirmSelector,
                existingConfirmButtons,
            );
            if (!confirmButton) {
                document.body.click();
                return false;
            }

            confirmButton.click();
            return true;
        } catch (e) {
            console.error("DOM click unfollow failed:", e);
            document.body.click();
            return false;
        }
    }

    // カスタムボタンを生成するヘルパー関数
    function createActionButton(text, actionType, onClick) {
        const config = ACTION_CONFIG[actionType];
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `custom-btn-${actionType}`;
        btn.textContent = text;

        const baseStyle = `
            background-color: transparent;
            border: 1px solid currentColor;
            border-radius: 9999px;
            color: inherit;
            opacity: 0.6;
            font-size: 13px;
            font-weight: bold;
            cursor: pointer;
            padding: 0 12px;
            height: 30px;
            margin-right: 8px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s;
            user-select: none;
            white-space: nowrap;
        `;
        btn.style.cssText = baseStyle;

        btn.onmouseover = () => {
            if (btn.disabled) return;
            btn.style.opacity = "1";
            btn.style.backgroundColor = config.hoverBg;
            btn.style.color = config.hoverColor;
            btn.style.borderColor = config.hoverColor;
        };

        btn.onmouseout = () => {
            if (btn.textContent === text) {
                // 配置先で上書きした余白などを維持し、ホバー項目だけ戻す。
                btn.style.opacity = "0.6";
                btn.style.backgroundColor = "transparent";
                btn.style.color = "inherit";
                btn.style.borderColor = "currentColor";
            }
        };

        btn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (actionInProgress) return;
            actionInProgress = true;

            const parent = btn.parentElement;
            const actionButtons = document.querySelectorAll(
                'button[class^="custom-btn-"]',
            );
            actionButtons.forEach((button) => (button.disabled = true));

            btn.textContent = "Processing...";
            btn.style.opacity = "0.5";

            let success = false;
            let targetEl = null;
            try {
                success = await onClick();

                if (success) {
                    btn.textContent = "Done";
                    btn.style.opacity = "1";
                    btn.style.color = config.hoverColor;
                    btn.style.borderColor = config.hoverColor;
                    btn.style.backgroundColor = config.hoverBg;

                    // 処理対象のコンテナ（ツイートまたはユーザーセル）を半透明に
                    targetEl = parent;
                    while (
                        targetEl &&
                        !targetEl.getAttribute("data-custom-action-added")
                    ) {
                        targetEl = targetEl.parentElement;
                    }
                    if (targetEl) {
                        targetEl.style.opacity = "0.3";
                        targetEl.style.pointerEvents = "none";
                    }
                } else {
                    btn.textContent = "Failed";
                    btn.style.opacity = "1";
                    btn.style.color = "red";
                    btn.style.borderColor = "red";
                }
            } catch (error) {
                console.error(`Custom ${actionType} action failed:`, error);
                btn.textContent = "Failed";
                btn.style.opacity = "1";
                btn.style.color = "red";
                btn.style.borderColor = "red";
            } finally {
                actionInProgress = false;
                document
                    .querySelectorAll('button[class^="custom-btn-"]')
                    .forEach((button) => {
                        const isCompletedTarget =
                            success && targetEl?.contains(button);
                        button.disabled = Boolean(isCompletedTarget);
                    });
            }
        };

        return btn;
    }

    // 各要素にボタンを追加する処理
    function addActionButtons() {
        // 1. タイムライン等のツイートに対する処理
        const tweets = document.querySelectorAll(
            'article[data-testid="tweet"]:not([data-custom-action-added])',
        );
        tweets.forEach((tweet) => {
            const caret = tweet.querySelector('[data-testid="caret"]');
            if (!caret) return;

            const targetContainer = caret.parentElement;
            if (!targetContainer) return;

            tweet.setAttribute("data-custom-action-added", "true");

            const blockBtn = createActionButton("Block", "block", () =>
                executeCurrentMenuAction(
                    tweet,
                    '[data-testid="caret"]',
                    "block",
                ),
            );
            const muteBtn = createActionButton("Mute", "mute", () =>
                executeCurrentMenuAction(
                    tweet,
                    '[data-testid="caret"]',
                    "mute",
                ),
            );

            targetContainer.insertBefore(blockBtn, caret);
            targetContainer.insertBefore(muteBtn, blockBtn);
        });

        // 2. フォロー中・フォロワー一覧のユーザーセルに対する処理
        const currentPage = location.pathname.split("/").filter(Boolean).at(-1);
        const isFollowingPage = currentPage === "following";
        const isFollowersPage = currentPage === "followers";
        const userCells = document.querySelectorAll('[data-testid="UserCell"]');
        userCells.forEach((cell) => {
            const existingUnfollowBtn = cell.querySelector(
                ".custom-btn-unfollow",
            );
            const existingRemoveFollowerBtn = cell.querySelector(
                ".custom-btn-removeFollower",
            );
            const existingBlockBtn = cell.querySelector(".custom-btn-block");

            if (isFollowingPage) {
                // SPA遷移でフォロワー一覧用ボタンが残っていた場合は置き換える。
                if (
                    existingUnfollowBtn &&
                    !existingRemoveFollowerBtn &&
                    !existingBlockBtn
                ) {
                    return;
                }
                existingUnfollowBtn?.remove();
                existingRemoveFollowerBtn?.remove();
                existingBlockBtn?.remove();

                // フォロー中一覧には三点メニューがなく、標準の解除ボタンがある。
                const nativeUnfollowBtn = cell.querySelector(
                    'button[data-testid$="-unfollow"]',
                );
                if (!nativeUnfollowBtn) return;

                const targetContainer = nativeUnfollowBtn.parentElement;
                if (!targetContainer) return;

                cell.setAttribute("data-custom-action-added", "true");

                const unfollowBtn = createActionButton(
                    "Unfollow",
                    "unfollow",
                    () => executeUnfollowButton(cell),
                );

                targetContainer.style.setProperty(
                    "display",
                    "inline-flex",
                    "important",
                );
                targetContainer.style.setProperty(
                    "flex-direction",
                    "row",
                    "important",
                );
                targetContainer.style.setProperty(
                    "flex-wrap",
                    "nowrap",
                    "important",
                );
                targetContainer.style.setProperty(
                    "align-items",
                    "center",
                    "important",
                );
                targetContainer.style.setProperty("gap", "8px", "important");
                unfollowBtn.style.marginRight = "0";
                targetContainer.appendChild(unfollowBtn);
                return;
            }

            // フォロワー一覧では「フォロワーを削除」だけを対象にする。
            const expectedActionBtn = isFollowersPage
                ? existingRemoveFollowerBtn
                : existingUnfollowBtn;
            if (expectedActionBtn && existingBlockBtn) return;

            const oldActionButtons = [
                existingUnfollowBtn,
                existingRemoveFollowerBtn,
            ].filter(Boolean);
            const oldContainers = new Set(
                oldActionButtons.map((button) => button.parentElement),
            );
            oldActionButtons.forEach((button) => button.remove());
            oldContainers.forEach((container) => {
                container?.style.removeProperty("display");
                container?.style.removeProperty("flex-direction");
                container?.style.removeProperty("flex-wrap");
                container?.style.removeProperty("align-items");
                container?.style.removeProperty("gap");
            });
            existingBlockBtn?.remove();

            const menuBtn = cell.querySelector('[aria-haspopup="menu"]');
            if (!menuBtn) return;

            const targetContainer = menuBtn.parentElement;
            if (!targetContainer) return;

            cell.setAttribute("data-custom-action-added", "true");

            const blockBtn = createActionButton("Block", "block", () =>
                executeCurrentMenuAction(
                    cell,
                    '[aria-haspopup="menu"]',
                    "block",
                ),
            );
            const actionType = isFollowersPage ? "removeFollower" : "unfollow";
            const unfollowBtn = createActionButton("Unfollow", actionType, () =>
                executeCurrentMenuAction(
                    cell,
                    '[aria-haspopup="menu"]',
                    actionType,
                ),
            );

            targetContainer.insertBefore(blockBtn, menuBtn);
            targetContainer.insertBefore(unfollowBtn, blockBtn);
        });
    }

    let addButtonsScheduled = false;
    function scheduleAddActionButtons() {
        if (addButtonsScheduled) return;
        addButtonsScheduled = true;
        requestAnimationFrame(() => {
            addButtonsScheduled = false;
            addActionButtons();
        });
    }

    const observer = new MutationObserver((mutations) => {
        if (mutations.some((mutation) => mutation.addedNodes.length > 0)) {
            scheduleAddActionButtons();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // 初期実行
    addActionButtons();
})();
