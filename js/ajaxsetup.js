$(function () {
    $.ajaxSetup({
        headers: { // 默认添加请求头
            "userId": userid ,
            "token=": "Access-Token"
        }
    });
});