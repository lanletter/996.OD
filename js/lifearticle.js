+ function($) {
  $(function() {

    (function () {
      var video = $('#videobox video')[0],
          playBtn = $('#videobox .play');
      playBtn.on('click', function() {
        $(this).hide();
        var vheight=$("#videobox video").height();
        $('#vd').css({"position":"absolute","left":"0"});
        $("#videobox").animate({height: vheight-1+"px",}, 1000 );
        $("#scroll").animate({top: vheight-1,}, 1000 );
        video.play();
        video.controls=true;
      });

      video.addEventListener('ended',function(){
        playBtn.show();
        video.controls=false;
      },false);
      video.addEventListener('pause',function(){
        playBtn.show();
        video.controls=false;
      },false);
    })();

    var $header = $('.header'),
        $content = $('.content');

    function GetQueryString(name)
    {
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if(r!=null)return  unescape(r[2]); return null;
    }
    var id = GetQueryString("id");
    var id=439;
    $.ajax({
      url: 'http://121.40.135.115:8080/fotile-api-0.0.2/wantFeel/detail',
      type: 'POST',
      data: JSON.stringify({ id: 439 }),
      timeout: 5000, //超时时间
      contentType: "application/json;charset=utf-8",
      dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
      success: function(data, textStatus, jqXHR) {
        callback(data);
      },
      error: function(xhr, textStatus) {
        console.log('错误');
        console.log(JSON.stringify(xhr));
        console.log(JSON.stringify(textStatus))
      }
    });

    function callback(res) {
      if (res.status !== 200) {
        alert(res.errorMessage);
        return;
      }
      var data = res.data;
      console.log(data);



      $api.imgAdapt($header.find('.header__main .img'), data.coverPicture.path);
      $header.find('.header__main h3').text(data.longTitle || data.shortTitle || ' ');
      $header.find('.view-count strong').text(data.viewCount);
      $header.find('.comment-count strong').text(data.commentCount);
      $header.find('.favorite-count strong').text(data.favoriteCount);
      $('#videobox').find('#vd').attr('src', data.video.path);
      $content.append(data.content);

      /*title取值*/
      var txt=data.title;
      if(txt==undefined){
        $('head title').text("生活志");
      }else {
        $('head title').text(data.title);
      }

      data.cookList.forEach(function(item, index) {
        var el = $('<div class="clearfix">\
                  <p class="author__info">\
                    <img src="'+item.picture.path+'">\
                    <span>' + item.cookName + '</span>\
                    </p>\
                  <!-- <button class="red-btn add-care" data-follow="' + item.isFollow + '" data-id="' + item.id + '">' + (item.isFollow ? "已关注" : "加关注") + '</button> -->\
                </div>');
        $('.authorbox').append(el);
      });

      data.recommendWantFeelList.forEach(function(item, index) {
        var el = $('<li class="recommend__info">\
            <a href="' + item.url + '"><img src="' + item.picture.path + '"></a>\
            <div>\
              <h5>' + item.longTitle + '</h5>\
              <span> <i>' + item.tags + '</i>#/<time>' +  (new Date(item.createat)).pattern("yyyy.MM.dd")+ '</time></span>\
            </div>\
          </li>');
        $('.recommend ul').append(el);
      });

      $('.add-care').data('id', data.id).data('follow', false);

    }

    $('.authorbox').on('click', '.add-care', function(e) {
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


    //app交互——获取登录状态
    $('.header__opt').on('click', '#star', function(e) {
      ft.isLogin(function (result) {
        var errorcode = result.errorCode.toString();
        if (errorcode == "1") {
          $api.toast('登陆成功', 2000);
          userid = result.data.userId.toString();
          //alert(userid);
          var id = $(e.target).data('id'),
              follow = $(e.target).attr('class');
          if (follow == "favorite-count") {
            $api.post('http://121.40.135.115:8080/fotile-api-0.0.2/favorite/create', {
              "refId": id,
              "type": 1,
              "userId": 85507
            }, function (data) {
              console.log(data);
              console.log("111");
              $("#star").addClass("favorite-count2");
              $("#star").removeClass("favorite-count");
            });
          } else if(follow == "favorite-count2") {
            $api.post('http://121.40.135.115:8080/fotile-api-0.0.2/favorite/cancel', {
              "refId": id,
              "type": 1,
              "userId": 85507
            }, function (data) {
              console.log(data);
              console.log("222");
              $("#star").addClass("favorite-count");
              $("#star").removeClass("favorite-count2");
            });
          }
          //location.reload();
        } else if (errorCode == "0") {
          $api.toast('登陆取消', 2000);
        } else if (errorCode == "-1") {
          $api.toast('登陆失败', 2000);
        } else if (errorCode == "-2") {
          $api.toast('登陆不支持', 2000);
        }
      })
    });

    // $('.header__opt').on('click', '#star', function(e) {
    //   //$(e.target).toggleClass("favorite-count2");
    //   var id = $(e.target).data('id'),
    //       follow = $(e.target).attr('class');
    //   if (follow == "favorite-count") {
    //     $api.post('http://121.40.135.115:8080/fotile-api-0.0.2/favorite/create', {
    //       "refId": id,
    //       "type": 1,
    //       "userId": 85507
    //     }, function (data) {
    //       console.log(data);
    //       console.log("111");
    //       $("#star").addClass("favorite-count2");
    //       $("#star").removeClass("favorite-count");
    //     });
    //   } else if(follow == "favorite-count2") {
    //     $api.post('http://121.40.135.115:8080/fotile-api-0.0.2/favorite/cancel', {
    //       "refId": id,
    //       "type": 1,
    //       "userId": 85507
    //     }, function (data) {
    //       console.log(data);
    //       console.log("222");
    //       $("#star").addClass("favorite-count");
    //       $("#star").removeClass("favorite-count2");
    //     });
    //   }
    // });

    $.loadComment({"pageNum":1,"pageSize":5,"refId":434,"type":4,"userId":81177}, 1);
  });
}(jQuery);