/*id传值*/
function foo() {
    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    var id = GetQueryString("id");
    var id=15;
    var urlstr = "mapsite.html?id="+id;
    window.location.replace(urlstr);
    return false;
}

$(function () {

    function GetQueryString(name)
    {
        var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if(r!=null)return  unescape(r[2]); return null;
    }
    var id = GetQueryString("id");
    var id=15;
    $api.post('http://121.40.135.115:8080/fotile-api-0.0.2/store/detail', {
        id: id
    }, function(res) {
        data = res.data;
        console.log(data);
        var $header = $('.header');
        $api.imgAdapt($header.find('.header__main .site-img'), data.titlePicture.path, 4/3);
        $header.find('h3').text(data.storeName);
        $header.find('.view-count').text(data.viewCount);
        $header.find('.favorite-count').text(data.likeCount);
        $header.find('.des').text(data.storeDesc);
        $header.find('.address span').text(data.detailAddress);
        $header.find('.tel span').text(data.tel);
        $header.find('.tel a').attr('href', 'tel:' + data.tel);
        $header.find('.service-time time').text(data.serviceTime);

        /*title取值*/
        var txt=data.title;
        if(txt==undefined){
            $('head title').text("场馆详情");
        }else {
            $('head title').text(data.title);
        }

        data.storeServices.forEach(function(item, index) {
            var item = $('<li>' + item.serviceName + '</li>');
            $('.site-service ul').append(item);
        });

        /*菜谱图集*/
        data.storePictures.forEach(function(item, index) {
            var img = $('<figure>\
                <img src="' + item.picture.path + '">\
                <figcaption>' + item.remark + '</figcaption>\
              </figure>');
            $('.site-pic').append(img);
        });
    });

    $('.mark').on('click', function() {
        $('.order-pop').show();
    });

    $.loadComment({
        "pageNum": 1,
        "pageSize": 5,
        "refId": 434,
        "type": 8,
        "userId": 81177
    }, 1);

    + function() {
        var curr = new Date().getFullYear();

        var opt = {
            display: "bottom",
            lang: "zh",
            maxDate: new Date(2100, 3, 10, 9, 22),
            minDate: new Date(),
            mode: "scroller",
            preset: "datetime",
            stepMinute: 5,
            theme: "ios"
        };

        $('.order-time').val('').scroller('destroy').scroller(opt);
    }();

    + function() {
        $('.order-type').on('click', 'button', function(e) {
            $('.order-type button').removeClass('check');
            $(e.target).addClass('check');
        })
    }();

    $('.do-order').on('click', function() {
        var orderInfo = $('.pop'),
            name = orderInfo.find('.name').val().trim(),
            tel = orderInfo.find('.tel').val().trim(),
            type = orderInfo.find('.order-type .check').text(),
            time = orderInfo.find('.order-time').val().trim(),
            des = orderInfo.find('.des').val();
        if (!name) {
            alert('请输入姓名');
            return;
        }

        if (!tel || !/^1[35847][0-9]{9}$/.test(tel)) {
            alert('请正确输入联系方式');
            return;
        }

        if (orderInfo.find('.order-type .check').length == 0) {
            alert('请选择预约类型');
            return;
        }

        if (!time) {
            alert('请选择预约时间');
            return;
        }

        $api.post('http://121.40.135.115:8080/fotile-api-0.0.2/test/user/appoint', {
            name: name,
            phoneNum: tel,
            orderType: type,
            orderDate: time,
            des: des
        }, function(data) {
            $('.order-pop').hide();
            $api.toast('提交成功！感谢您的预约，我们将在24小时内与您电话联系！谢谢！', 3000)
        })
    });
    $('.close').on('click', function () {
        $('.order-pop').hide();
    })
});