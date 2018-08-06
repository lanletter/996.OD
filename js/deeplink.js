+function () {

    /*获取url*/

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    var id = GetQueryString("id");
    var device = GetQueryString("device");

    if (device == null || device == "null") {
        function GetPageName() {
            var url = window.location.href;//获取完整URL
            var tmp = location.pathname.replace(/(.+)[＼＼/]/, "");//获取带后缀的文件名称
            name = tmp.replace(/.html/, "");//获取不带后缀的文件名称
            return name;
        }

        // alert(GetPageName());
        /*页面参数（页面类型+id）*/
        var id = id;
        var refid = id;
        var action = GetPageName();
        var weburl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?id=" +id;
        var imageURL = "";
        var shareTitle = "";
        var shareSubTitle = "";
        var iostype = "";


        console.log({
            "id": id,
            "action": action,
            "weburl": weburl,
            "refid": refid,
            "imageURL": imageURL,
            "shareTitle": shareTitle,
            "shareSubTitle": shareSubTitle,
            "iostype": iostype
        });

        var urlright = "?action=" + encodeURIComponent(action) +
            "&id=" + encodeURIComponent(id) +
            "&weburl=" + encodeURIComponent(weburl) +
            "&refid=" + encodeURIComponent(refid) +
            "&imageURL=" + encodeURIComponent(imageURL) +
            "&shareTitle=" + encodeURIComponent(shareTitle) +
            "&shareSubTitle=" + encodeURIComponent(shareSubTitle) +
            "&iostype=" + encodeURIComponent(iostype);


        /*判断是IOS还是Android机型*/
        var u = navigator.userAgent;
        var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        console.log('是否是Android：' + isAndroid);
        console.log('是否是iOS：' + isiOS);

        /*下载*/
        $("#download").unbind().click(function (e) {
            if (isiOS == true) {/*ios手机*/
                window.location.href = "https://gio.ren/re0Y923";
            } else if (isAndroid == true) {/*Android手机*/
                window.location.href = "https://gio.ren/rBZ2ApB";
            }
        });

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
                    "<p class='title'>在微信中无法打开？</p>" +
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
            // alert("不是app内");
            setTimeout(function () {
                openlink();
            }, 0);
            $(".deeplikopen").unbind().click(function (e) {
                openlink();
            });

            function openlink() {
                /*深链接打开*/
                var deeplinkurl = "fotile://api.fotilestyle.com/" + urlright;
                // alert(deeplinkurl);
                /***打开app的协议***/
                window.location.href = deeplinkurl;

                // /*跳转成功后阻止浏览器继续跳转*/
                // $(window).blur(function(){
                //     clearTimeout(t);
                //     return;
                // });
                // /***打开app失败后***/
                // var t = setTimeout(function() {
                //     if (isiOS == true) {/*ios手机*/
                //         window.location.href = "https://gio.ren/re0Y923";
                //     } else if (isAndroid == true) {/*Android手机*/
                //         window.location.href = "https://gio.ren/rBZ2ApB";
                //     }
                // }, 5000);
            }

        }

    } else {
        // alert("是app内");
       console.log(device);
    }

}();