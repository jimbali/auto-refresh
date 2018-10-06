document.addEventListener('DOMContentLoaded', function() {
    var start = document.getElementById('start-refreshing');
    start.addEventListener('click', function() {
        chrome.runtime.sendMessage({message: "startRefreshing"});
    });
    var stop = document.getElementById('stop-refreshing');
    stop.addEventListener('click', function() {
        chrome.runtime.sendMessage({message: "stopRefreshing"});
    });
    var backgroundPage = chrome.extension.getBackgroundPage();
    window.addEventListener('input', function (e) {
        if (e.target.id == 'search-text') {
            onTextChanged(e);
        } else if (e.target.id == 'cookie-to-clear') {
            backgroundPage.cookieToClear = e.target.value;
        }
    }, false);
    updateSearchText(backgroundPage.selectedText ? backgroundPage.selectedText : "");
    updateCookieText(backgroundPage.cookieToClear ? backgroundPage.cookieToClear : "");
});

function updateSearchText(txt) {
    document.getElementById('search-text').value = txt;
}

function updateCookieText(txt) {
    document.getElementById('cookie-to-clear').value = txt;
}

function onTextChanged(e) {
    var backgroundPage = chrome.extension.getBackgroundPage();
    backgroundPage.selectedText = e.target.value;
}

