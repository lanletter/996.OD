$(function () {
    //读取cookies
    function getCookie(name)
    {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");

        if(arr=document.cookie.match(reg))

            return unescape(arr[2]);
        else
            return null;
    }
    var userid = getCookie("userid");
    var token = getCookie("token");
    // console.log({ // 默认添加请求头
    //     "userId": userid,
    //     "token": token,
    //     "deviceType": "web",
    //     "version":"v437"
    // });
    $.ajaxSetup({
        headers: { // 默认添加请求头
            "userId": userid,
            "token": token,
            "deviceType":"web",
            "version":"v436"
        }
    });
});