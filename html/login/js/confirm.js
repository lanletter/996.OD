var confirm=function () {
    $("body").append(
        '<div id="mask" class="mask works-mask">' +
        '<div class="mask-content">' +
        '<p class="del-p">您确定要删除图片吗？</p>' +
        '<p class="check-p">' +
        '<span class="del-com wsdel-ok">确定</span>' +
        '<span class="wsdel-no">取消</span>' +
        '</p></div></div>');
    $("#mask").css("display","block");
    $(".wsdel-ok").click(function () {
        $("#mask").css("display","none");
        $this.userId = userid;
        $this.getAddress(this.userId);
    });
    $(".wsdel-no").click(function () {
        $("#mask").css("display","none");
    })
};



