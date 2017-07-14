/*id传值*/
function foo() {
    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    }

    var id = GetQueryString("id");
    var id = 662;
    var urlstr = "mapcourse.html?id=" + id;
    console.log(urlstr);
    window.location.replace(urlstr);
    return false;
}

$(function () {
    var $header = $('.header');
    var $content = $('.content');
    var $buyedit = $('.buynow-div');

    function GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return unescape(r[2]);
        return null;
    }

    var id = GetQueryString("id");
    var id = 662;

    $api.post('http://121.40.135.115:8080/fotile-api-0.0.2//curriculumn/detail ',
        {id: id},
        function (data) {
            data = data.data;
            console.log(data);
            $api.imgAdapt($header.find('.header__main .img'), data.picture.path);

            $header.find('h3').text(data.curriculumName);
            $header.find('.view-count').text(data.viewCount);
            $header.find('.favorite-count').text(data.likeCount);
            $header.find('.course-des').text(data.curriculumDesc);

            $('.address span').text(data.store.detailAddress);
            $('.tel span').text(data.store.tel);
            $('.tel a').attr('href', 'tel:' + data.store.tel);
            $('.service-time time').text(data.store.serviceTime);
            $('.overplus').text(parseInt(data.totalCount) - parseInt(data.currentCount));
            $('.total').text(data.totalCount);
            $('.food-type span').text(data.styleType);

            /*title取值*/
            var txt = data.title;
            if (txt == undefined) {
                $('head title').text("课程详情");
            } else {
                $('head title').text(data.title);
            }

            /* 时间戳格式转换 */
            var starttime = data.startTime;
            var endtime = data.endTime;

            function add0(m) {
                return m < 10 ? '0' + m : m
            }

            function datatime(starttime) {
                var time = new Date(starttime);
                var month = time.getMonth() + 1;
                var date = time.getDate();
                var week = time.getDay();
                switch (time.getDay()) {
                    case 0:
                        week = "日";
                        break
                    case 1:
                        week = "一";
                        break
                    case 2:
                        week = "二";
                        break
                    case 3:
                        week = "三";
                        break
                    case 4:
                        week = "四";
                        break
                    case 5:
                        week = "五";
                        break
                    case 6:
                        week = "六";
                        break
                }
                ;
                return add0(month) + '月' + add0(date) + '日 周' + week;

            }
            function datatime2(starttime) {
                var time = new Date(starttime);
                var year = time.getYear()+1900;
                var month = time.getMonth() + 1;
                var date = time.getDate();
                var week = time.getDay();
                switch (time.getDay()) {
                    case 0:
                        week = "日";
                        break
                    case 1:
                        week = "一";
                        break
                    case 2:
                        week = "二";
                        break
                    case 3:
                        week = "三";
                        break
                    case 4:
                        week = "四";
                        break
                    case 5:
                        week = "五";
                        break
                    case 6:
                        week = "六";
                        break
                }
                ;
                return add0(year) + '年' +add0(month) + '月' + add0(date) + '日 周' + week + ' ';

            }
            function hourtime(starttime, endtime) {
                var time = new Date(starttime);
                var hours = time.getHours();
                var minutes = time.getMinutes();
                var time2 = new Date(endtime);
                var hours2 = time2.getHours();
                var minutes2 = time2.getMinutes();
                return hours + ':' + minutes + '-' + hours2 + ':' + minutes2;

            }

            $content.find('.course-time-date').text(datatime(starttime));
            $content.find('.course-time-hour').text(hourtime(starttime, endtime));

            /*数量加减  计算总数时把注释掉的地方取消*/
                var oUl=document.getElementsByClassName('numbox')[0];
                var aLi=oUl.getElementsByTagName('li');
                var aEm=document.getElementsByTagName('em');
                var oStrong=document.getElementsByTagName('strong')[0];
                var total=0;
                var countprice=0;
                var max=0;
                var price=data.price;
                for (var i = 0; i < aLi.length; i++) {
                    shop(aLi[i]);
                }

                function shop(obj,num){
                    console.log(data);
                    var aInp=obj.getElementsByTagName('input');
                    var aSpan=obj.getElementsByTagName('span');
                    var num=parseInt(aSpan[0].innerHTML);
                    aInp[0].onclick=function(){
                        if(num<=0)return;
                        num--;
                        aSpan[0].innerHTML=num;
                        // aSpan[1].innerHTML=price+'元';
                        // aSpan[2].innerHTML=num*price+'元';
                        total--;
                        countprice-=price;
                        aEm[0].innerHTML=total;
                        oStrong.innerHTML=countprice;
                        setmax();
                    };
                    aInp[1].onclick=function(){
                        num++;
                        aSpan[0].innerHTML=num;
                        // aSpan[1].innerHTML=price+'元';
                        // aSpan[2].innerHTML=num*price+'元';
                        total++;
                        countprice+=price;
                        // aEm[0].innerHTML=total;
                        oStrong.innerHTML=countprice;
                        //setmax();
                    };

                }
                // function setmax(){
                //     max=0;
                //     for (var i = 0; i < aLi.length; i++) {
                //         var aSpan=aLi[i].getElementsByTagName('span');
                //         if(aSpan[0].innerHTML>0){
                //             if(max<parseFloat(aSpan[1].innerHTML)){
                //                 max=parseFloat(aSpan[1].innerHTML);
                //             }
                //         }
                //         aEm[1].innerHTML=max;
                //     }
                //
                // }


            $api.imgAdapt($buyedit.find('.titlepic'), data.picture.path);
            $buyedit.find('.titletxt').text(data.curriculumName);
            $buyedit.find('.editlist .time').text(datatime2(starttime)+data.store.serviceTime);
            $buyedit.find('.editlist .name').text(data.store.storeName);
            $buyedit.find('.editlist .place').text(data.store.detailAddress);
            $buyedit.find('.editlist .lightgrey b').text(parseInt(data.totalCount) - parseInt(data.currentCount));
            $buyedit.find('.ttprice s b').text(data.price);

            switch (data.status) {
                case 'NEW': // 起售

                case 'PRE': // 预售
                    $('.buy b').text(parseInt(data.price).toFixed(2));
                    $('.dis').hide();
                    break;
                case 'EXD': // 已失效
                    $('.able').hide();
                    $('.dis').text('已开课');
                    $('.buy-box').css('background', '#676a6c')
                    break;
                case 'DON': //已售罄
                    $('.able').hide();
                    $('.dis').text('已售罄');
                    $('.buy-box').css('background', '#676a6c')
                    break;
                case 'DBL': // 不可用
                    $('.able').hide();
                    $('.dis').text('不可用');
                    $('.buy-box').css('background', '#676a6c')
                    break;
                default:
                    console.log('no');

            }


            data.cooks.forEach(function (item, index) {
                var cooker = $('<section class="author teacher">\
                <div class="clearfix">\
                  <p class="author__info">\
                    <img src="' + item.picture.path + '">\
                    <span>\
                      <b>' + item.cookName + '</b>\
                      <strong class="text-overflow say">' + item.remark + '</strong>\
                    </span></p>\
                  <button class="red-btn add-care" data-follow="' + item.isFollow + '" data-id="' + item.id + '">' + (item.isFollow ? "已关注" : "加关注") + '</button>\
                </div>\
              </section>');
                $('.teacher-box').append(cooker);
            });

            data.menuList.forEach(function (item, index) {
                var img = $('<figure>\
              <img src="' + item.picture.path + '">\
              <figcaption>' + item.remark + '</figcaption>\
            </figure>');
                $('.site-pic').append(img);
            });


            //与app交互
            $("#addToCart").on("click",function () {
                $api.toast('加购物车', 2000);
                ft.addToCart({
                    refid:data.id,
                    type:1,
                    count:data.count
                },function (result) {
                    if(result.errorCode=="1"){
                        $api.toast('调用成功', 2000);
                    }else if(result.errorCode == "0"){
                        $api.toast('调用取消', 2000);
                    }else if(result.errorCode=="-1"){
                        $api.toast('调用失败', 2000);
                    }else if(result.errorCode=="-2"){
                        $api.toast('版本不支持', 2000);
                    }
                })
            });
            $("#selectCoupon").on("click",function () {
                alert("选择优惠券");
                $api.toast('选择优惠券', 2000);
                ft.selectCoupon(function (result) {
                    if(result.errorCode=="1"){
                        $api.toast('调用成功', 2000);
                    }else if(result.errorCode == "0"){
                        $api.toast('调用取消', 2000);
                    }else if(result.errorCode=="-1"){
                        $api.toast('调用失败', 2000);
                    }else if(result.errorCode=="-2"){
                        $api.toast('版本不支持', 2000);
                    }
                })
            });
            $("#purchase").on("click",function () {
                alert("立即购买");
                $api.toast('直接购买', 2000);
                ft.purchase({
                    title:data.curriculumName,
                    imagePath:data.picture.path,
                    oldPrice :"388",
                    newPrice:"88",
                    number:parseInt(data.totalCount) - parseInt(data.currentCount),
                    statsTime:data.startDate,
                    address :data.store.detailAddress,
                    voucherNumber:"2017050314064800075791",
                    productId:data.id
                },function (result) { })
            })

        });

    $.loadComment({"pageNum": 1, "pageSize": 5, "refId": 434, "type": 2, "userId": 81177}, 1);

    $('.course-info').on('click', '.add-care', function (e) {
        var id = $(e.target).data('id'),
            follow = $(e.target).data('follow');
        if (follow) {
            $api.post('http://121.40.135.115:8080/fotile-api-0.0.2/follow/cookCancel', {
                "refId": id,
                "type": 2,
                "userId": 85507
            }, function (data) {
                $(e.target).data('follow', false).text('加关注');
            });
        } else {
            $api.post('http://121.40.135.115:8080/fotile-api-0.0.2/follow/cook', {
                "refId": id,
                "type": 2,
                "userId": 85507
            }, function (data) {
                $(e.target).data('follow', true).text('已关注');
            });
        }
    });

    $('.able').on('click', function (e) {
        var id = $(e.target).data('id');
        $api.post('http://121.40.135.115:8080/fotile-api-0.0.2/shoppingCart/create', {
            "count": 2,
            "refId": 662,
            "type": 1,
            "userId": 41
        });
    });

    $('.buynow').on('click', function() {
        $('.dark-bg').show();
        $('.buynow-div').show();
    });
    $('#close-div').on('click', function() {
        $('.dark-bg').hide();
        $('.buynow-div').hide();
    });
    $('.editpic').on('click', function() {
        $('.editarea').show();
    });
    $('.editarea button').on('click',function () {
        $('#remarks').text($('.editarea textarea').val());
        $('.editarea').hide();
    })

});
