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
        } else if (e.target.id == 'rpm') {
            backgroundPage.maxRate = e.target.value;
        }
    }, false);
    updateElement(backgroundPage.selectedText ? backgroundPage.selectedText : "", 'search-text');
    updateElement(backgroundPage.cookieToClear ? backgroundPage.cookieToClear : "", 'cookie-to-clear');
    updateElement(backgroundPage.maxRate ? backgroundPage.maxRate : "", 'rpm');
});

function updateElement(txt, elementId) {
    document.getElementById(elementId).value = txt;
}

function onTextChanged(e) {
    var backgroundPage = chrome.extension.getBackgroundPage();
    backgroundPage.selectedText = e.target.value;
}
