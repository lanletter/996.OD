+ function($) {
  $(function() {
    var $header = $('.header'),
      $content = $('.content');
    // var url = 'http://121.40.135.115:8080/fotile-api-0.0.2/test/wantFeel/detail';

    $.ajax({
      url: 'http://121.40.135.115:8080/fotile-api-0.0.2/test/wantFeel/detail',
      type: 'POST', //GET
      data: JSON.stringify({ "userName": "test", "address": "gz", id: 123 }),
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
      $header.find('.header__main h3').text(data.longTitle || data.shortTitle || ' ');
      $api.imgAdapt($header.find('.header__main .img'), data.coverPicture.path)
      $header.find('.view-count strong').text(data.viewCount);
      $header.find('.comment-count strong').text(data.commentCount);
      $header.find('.favorite-count strong').text(data.favoriteCount);

      $content.append(data.content);
    }

    $.loadComment({"pageNum":1,"pageSize":5,"refId":434,"type":5,"userId":81177}, 1);
  });
}(jQuery);
