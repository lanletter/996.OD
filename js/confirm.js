$(".delete").onclick = function() {
    var div = document.createElement("div");
    div.innerHTML =
        '<div id="mask" class=" works-mask">' +
        '<div class="mask-content">' +
        '<p class="del-p">您确定要删除图片吗？</p>' +
        '<p class="check-p">' +
        '<span class="del-com wsdel-ok">确定</span>' +
        '<span class="wsdel-no">取消</span>' +
        '</p></div></div>';
    document.body.appendChild(div);

    var mask = document.getElementById("mask");
    mask.style.display = 'block';

};
