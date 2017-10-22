/** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
 可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
 Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
 * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
 * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
 * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
 * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
 */
Date.prototype.pattern=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "日",
        "1" : "一",
        "2" : "二",
        "3" : "三",
        "4" : "四",
        "5" : "五",
        "6" : "六"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "星期" : "周") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};

Date.prototype.app=function() {
    var time = this.getTime();
    var now = new Date().getTime();
    var dif = now - time;
    if (dif < 0) return '刚刚';
    if (dif < 10*60*1000) {
        return '刚刚';
    } else if (dif < 60*60*1000) {
        return Math.floor(dif/(1000*60))+'分钟前';
    } else if (dif < 24*60*60*1000) {
        return Math.floor(dif/(1000*60*60))+'小时前';
    } else if (dif < 7*24*60*60*1000) {
        return Math.floor(dif/(1000*60*60*24))+'天前';
    } else {
        if (this.getYear() == new Date().getYear()) {
            return (this.getMonth()+1)+'.'+this.getDate();
        } else {
            return this.getFullYear()+'.'+(this.getMonth()+1)+'.'+this.getDate();
        }
    }
}

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