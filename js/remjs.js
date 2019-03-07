// rem 适配手机屏幕
;(function (win) {
  var doc = win.document,
    docEle = doc.documentElement;
  var tid;
  document.body.style.opacity = 0;
  
  function refreshRem () {
    var width = docEle.getBoundingClientRect().width
    if (width > 750) width = 750;
    var rem = width / 7.5;
    docEle.style.fontSize = rem + 'px';
    document.body.style.opacity = 1;
  }
  
  win.addEventListener('resize', function() {
    clearTimeout(tid);
    tid = setTimeout(refreshRem, 500);
  }, false);
  win.addEventListener('pageshow', function(e) {
    if (e.persisted) {
      clearTimeout(tid);
      tid = setTimeout(refreshRem, 500);
    }
  }, false);
  setTimeout(refreshRem, 500);
})(window)