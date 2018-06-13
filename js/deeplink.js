+function () {
    function deeplink(obj, id, action) {

        console.log(obj);

        /*页面参数（页面类型+id）*/
        var id = obj.id;
        var action = obj.action;
        var weburl = obj.weburl;
        var imageURL = "";
        var shareTitle = "";
        var shareSubTitle = "";
        var iostype = "";
        var urlright = "?action=" + encodeURIComponent(action) +
            "&id=" + encodeURIComponent(id) +
            "&weburl=" + encodeURIComponent(weburl) +
            "&imageURL=" + encodeURIComponent(imageURL) +
            "&shareTitle=" + encodeURIComponent(shareTitle) +
            "&shareSubTitle=" + encodeURIComponent(shareSubTitle) +
            "&iostype=" + encodeURIComponent(iostype);

        /*判断是IOS还是Android机型*/
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        // console.log('是否是Android：' + isAndroid);
        // console.log('是否是iOS：' + isiOS);

        /*判断是否微信浏览器内打开*/
        function isWeiXin() {
            var ua = window.navigator.userAgent.toLowerCase();
            // console.log(ua);//mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
            if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                return true;
            } else {
                return false;
            }
        }

        if (isWeiXin()) {
            console.log(" 是来自微信内置浏览器");

            //记录是否阻止滚动
            var disableScroll = false;
            //如果弹出对话框时，底层的视图就不让滚动了
            document.addEventListener("touchmove", function (e) {
                if (disableScroll) {
                    e.preventDefault();
                }
            }, false);

            $(".deeplikopen").unbind().click(function (e) {
                e.stopPropagation();
                /*弹出浏览器打开提示*/
                var alertstr = "<div class='blackbg'><div class='reminder'>" +
                    "<img src='../img/arrowdashed.png' >" +
                    "<p class='title'>在微信中无法下载？</p>" +
                    "<p>请点击右上角，选择在浏览器或Safari中打开。</p>" +
                    "</div></div>";
                $("body").prepend(alertstr);
                $("html,body").css({"height": "100%", "position": "relative", "overflow": "hidden"}); //禁用滚动条
                disableScroll = true;//禁止滚动

                /*隐藏提示*/
                $(document).unbind().click(function () {
                    $(".blackbg").remove();
                    $("html,body").css({"height": "auto", "position": "static", "overflow": "auto"}); //启用滚动条
                    disableScroll = false;//允许滚动
                });
                $(".reminder").click(function (event) {
                    event.stopPropagation();//阻止冒泡
                });
            })

        } else {
            console.log("不是来自微信内置浏览器");
            window.onload=function() {
                var deeplinkurl = "fotile://api.fotilestyle.com/" + urlright;
                alert(deeplinkurl);
                window.location.href = deeplinkurl;
                /***打开app的协议，Android***/
                window.setTimeout(function () {
                    if (isiOS == true) {/*ios手机*/
                        window.location.href = "https://gio.ren/re0Y923";
                    } else if (isAndroid == true) {/*Android手机*/
                        window.location.href = "https://gio.ren/rBZ2ApB";
                    }
                }, 1000);
            };
            $(".deeplikopen").unbind().click(function (e) {
                /*深链接打开*/
                var deeplinkurl = "fotile://api.fotilestyle.com/" + urlright;
                alert(deeplinkurl);
                window.location.href = deeplinkurl;
                /***打开app的协议，Android***/
                window.setTimeout(function () {
                    if (isiOS == true) {/*ios手机*/
                        window.location.href = "https://gio.ren/re0Y923";
                    } else if (isAndroid == true) {/*Android手机*/
                        window.location.href = "https://gio.ren/rBZ2ApB";
                    }
                }, 1000);

            })

        }

    }

    $.deeplink = deeplink;

}();