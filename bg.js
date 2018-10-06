var refreshing = false;
var cookieToClear;
var selectedText;

chrome.contextMenus.create({
    "title": "Refresh Until Gone",
    "contexts": ["page", "selection", "image", "link"],
    "onclick" : function(info, tab) {
        selectedText = info.selectionText;
        refreshUntilGone();
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == "pageLoaded") {
        if (refreshing) {
            refreshIfTextVisible();
        }
    } else if (request.message == "startRefreshing") {
        refreshUntilGone();
    } else if (request.message == "stopRefreshing") {
        refreshing = false;
    }
});

function refreshUntilGone() {
    refreshing = true;
    refreshIfTextVisible();
}

function refreshIfTextVisible() {
    chrome.tabs.query({
        "active": true,
        "currentWindow": true
    }, function (tabs) {
        if (tabs.length === 0)
            return;
        // Check if text is visible
        console.log("Selected Text: " + selectedText);
        chrome.tabs.sendMessage(tabs[0].id, {message: "isTextVisible", params: {txt: selectedText}}, function(response) {
            if (response.textIsVisible) {
                chrome.tabs.sendMessage(tabs[0].id, {message: "clearAndRefresh", params: {cookieToClear: cookieToClear}});
            } else {
                refreshing = false;
            }
        });
    });
}
