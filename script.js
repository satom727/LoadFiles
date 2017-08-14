/*chrome.browserAction.onClicked.addListener(function(tab){
    chrome.tabs.executeScript(null, {file: "script.js"});
  });*/
$(function() {
  var zip = new JSZip();
  chrome.runtime.onMessage.addListener(function(message,sender,sendResponse ) {
    if(message.ALL){
      console.log(message.ALL);
      loadFiles(0);
    }else if(message.js){
      console.log(message.js);
      loadFiles(1);

    }else if(message.css){
      console.log(message.css);
      loadFiles(2);

    }else if(message.img){
      console.log(message.img);
      loadFiles(3);
    }
  });

  function loadFiles(tagSelecter){
    var srcList = [];
    switch(tagSelecter){
      case 0:
      srcList = defineSrcScriptTag();
      srcList = srcList + defineSrcImgTag();
      srcList = srcList + defineSrcLinkTag();
      break;
      case 1:
      srcList = defineSrcScriptTag();
      break;
      case 2:
      srcList = defineSrcLinkTag();
      break;
      case 3:
      srcList = defineSrcImgTag();
      break;
      default:
      srcList = defineSrcScriptTag();
      break;
    }

    var srcListLen = srcList.length;
    //ajax修了判定用
    var deferreds = [];
    //アプリケーションディレクトリ判別用
    var hostUrl = window.location.origin;
    var rootDir = hostUrl + "/";
    var rootLen = rootDir.length;

    for(var i=0;i<srcListLen;i++){
      var deferred = downloadFile(srcList[i]).done(function(xhr) {
        var path = xhr.responseURL.substring(rootLen);
        var index = path.lastIndexOf("/");
        makeJsZIP(path,xhr.response);
      });
      deferreds.push(deferred);
    }
    $.when.apply($, deferreds).done(function() {
        // すべてのダウンロードが完了したら実行される
        var zipFile = zip.generate({ type: 'blob' });
        saveAs(zipFile, "loadFiles.zip");
      });
  }
  //tagnameからurlファイルパス取得
  function defineSrcScriptTag(){
    var srcTag  = document.getElementsByTagName("script");
    var srcList = [];
    var srcTagLen = srcTag.length;
    for (var i = srcTagLen - 1; i >= 0; i--) {
      srcList[i] = srcTag[i].src;
    };
    return srcList;
  }

  function defineSrcImgTag(){
    var srcTag  = document.getElementsByTagName("img");
    var srcList = [];
    var srcTagLen = srcTag.length;
    for (var i = srcTagLen - 1; i >= 0; i--) {
      srcList[i] = srcTag[i].src;
    };
    return srcList;
  }
  function defineSrcLinkTag(){
    var srcTag  = document.getElementsByTagName("link");
    var srcList = [];
    var srcTagLen = srcTag.length;
    for (var i = srcTagLen - 1; i >= 0; i--) {
      if(srcTag[i].type =="text/css"){
        srcList[i] = srcTag[i].href;
      }
    };
    return srcList;
  }
  //ajaxでファイル取得
  function downloadFile(url){
   var xhr = new XMLHttpRequest(),
   deferred = new $.Deferred();
  // ダウンロードが完了したら実行される
  xhr.addEventListener('load', function() {
    xhr.response; // ダウンロードしたデータ
    deferred.resolve(xhr);
  });
  xhr.open('POST', url, true);
  xhr.responseType = 'arraybuffer';
  xhr.send();
  return deferred.promise();
}

function makeJsZIP(fileName,content){
  zip.file(fileName,content);
}
}());