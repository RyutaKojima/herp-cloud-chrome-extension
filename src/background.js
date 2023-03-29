/**
 * 拡張機能がインストール/アップデートされたときに発生するイベント
 */
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        const optionPageUrl = chrome.runtime.getURL('options_page/index.html');

        chrome.tabs.create({
            active: true,
            url: optionPageUrl,
        });
    }
});
