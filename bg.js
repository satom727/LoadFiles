//from popup.js to script.js
chrome.runtime.onMessage.addListener(function( message, sender, sendResponse ) {
    var tabid = message.TabId;
    if(message.clickedAll){
        chrome.tabs.sendMessage(tabid,{ALL: "ALL"});
    }else if(message.clickedJs){
        chrome.tabs.sendMessage(tabid,{ js: "js" });
    }else if(message.clickedCss){
        chrome.tabs.sendMessage(tabid,{ css: "css" });
    }else if(message.clickedImg){
        chrome.tabs.sendMessage(tabid,{ img: "img" });
    }
});