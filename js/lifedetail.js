+ function($) {
  $(function() {
    var $header = $('.header'),
      $content = $('.content');
    var url = 'http://121.40.135.115:8080/fotile-api-0.0.2/test/wantFeel/detail';

    function GetQueryString(name)
    {
      var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
      var r = window.location.search.substr(1).match(reg);
      if(r!=null)return  unescape(r[2]); return null;
    }
    var id = GetQueryString("id");
    var id=439
    $.ajax({
      url: 'http://121.40.135.115:8080/fotile-api-0.0.2/wantFeel/detail',
      type: 'POST', //GET
      data: JSON.stringify({ id: id }),
      timeout: 5000, //超时时间
      contentType: "application/json;charset=utf-8",
      dataType: 'json', //返回的数据格式：json/xml/html/script/jsonp/text
      success: function(data, textStatus, jqXHR) {
        callback(data);
      },
      error: function(xhr, textStatus) {
        console.log('错误')
        console.log(JSON.stringify(xhr))
        console.log(JSON.stringify(textStatus))
      }
    })

    function callback(res) {
      if (res.status !== 200) {
        alert(res.errorMessage)
        return;
      }
      var data = res.data;
      console.log(data);
      $header.find('.header__main h3').text(data.longTitle || data.shortTitle || ' ');
      $api.imgAdapt($header.find('.header__main .img'), data.coverPicture.path)
      $header.find('.view-count strong').text(data.viewCount);
      $header.find('.comment-count strong').text(data.commentCount);
      $header.find('.favorite-count strong').text(data.favoriteCount);

      /*title取值*/
      var txt=data.title;
      if(txt==undefined){
        $('head title').text("生活志");
      }else {
        $('head title').text(data.title);
      }

      /* 时间戳格式转换 */
      var timestamp=data.createat;
      function add0(m){return m<10?'0'+m:m }
      function format(timestamp)
      {
        var time = new Date(timestamp);
        var year = time.getFullYear();
        var month = time.getMonth()+1;
        var date = time.getDate();
        var hours = time.getHours();
        var minutes = time.getMinutes();
        var seconds = time.getSeconds();
        return year+'.'+add0(month)+'.'+add0(date);
      }
      $header.find('.lifetime').text(format(timestamp));

      $content.append(data.content);
    };

    $.loadComment({"pageNum":1,"pageSize":5,"refId":434,"type":10,"userId":81177}, 1);
  });
}(jQuery);
