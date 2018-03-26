$(function () {
    $.ajaxSetup({
        headers: { // 默认添加请求头
            "userId":userid,
            "tel":tel,
            "Access-Token": token,
            "deviceType":web,
            "version":v421
        }
    });
});