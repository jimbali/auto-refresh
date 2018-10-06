window.autoRefresh = new AutoRefresh();

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.message == "clearAndRefresh") {
        autoRefresh.clearAndRefresh(request.params.cookieToClear);
    } else if (request.message == "isTextVisible") {
        var vis = autoRefresh.stringIsVisible(request.params.txt);
        sendResponse({textIsVisible: vis});
    } else if (request.message == "getTextSelection") {
        var txt = window.getSelection().toString();
        sendResponse({textSelection: txt});
    }
});

if (document.readyState === 'interactive' || document.readyState === 'complete') {
    onReady();
} else {
    document.addEventListener('DOMContentLoaded', onReady);
}

function onReady() {
    chrome.runtime.sendMessage({message: "pageLoaded"});
}

/// AutoRefresh prototype ///
function AutoRefresh() {
}

AutoRefresh.prototype.stringIsVisible = function(txt) {
    var queue = [document.body];
    var curr;

    while (curr = queue.pop()) {
        if (!curr.textContent.match(txt)) continue;
        for (var i = 0; i < curr.childNodes.length; ++i) {
            switch (curr.childNodes[i].nodeType) {
                case Node.TEXT_NODE : // 3
                    if (curr.childNodes[i].textContent.match(txt)) {
                        return true;
                    }
                    break;
                case Node.ELEMENT_NODE : // 1
                    queue.push(curr.childNodes[i]);
                    break;
            }
        }
    }
    return false;
};

AutoRefresh.prototype.deleteCookie = function(name) {
    var value = "";
    var date = new Date();
    date.setTime(date.getTime()+(-10*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
    document.cookie = name+"="+value+expires+"; path=/";
};

AutoRefresh.prototype.clearAndRefresh = function(cookieToClear) {
    if (cookieToClear) {
        this.deleteCookie(cookieToClear);
    }
    window.location.reload(true);
};
