/*
$('all').on("click",function(){
    console.log("pop");
    return executeScripts([
    {
      file: "js/jquery-2.1.1.min.js"
  }, {
      file: "js/content_scripts/inspect_element.js"
  }
  ]);
});
    chrome.tabs.executeScript(null, {file: "scriptAll.js"});
    */
//to bg.js
window.addEventListener('load', function() {
  var tabid;
  chrome.tabs.query({active:true,  windowId: chrome.windows.WINDOW_ID_CURRENT}, function(tabs){
    tabid = tabs[0].id;
  });
  document.getElementById('all').addEventListener('click', function() {
    chrome.runtime.sendMessage({ TabId:tabid ,clickedAll: "clickedAll" });
  });
  document.getElementById('js').addEventListener('click', function() {
    chrome.runtime.sendMessage({ TabId:tabid ,clickedJs: "clickedJs" });
  });
  document.getElementById('css').addEventListener('click', function() {
    chrome.runtime.sendMessage({ TabId:tabid ,clickedCss: "clickedCss" });
  });
  document.getElementById('img').addEventListener('click', function() {
    chrome.runtime.sendMessage({ TabId:tabid ,clickedImg: "clickedImg" });
  });
}, false);