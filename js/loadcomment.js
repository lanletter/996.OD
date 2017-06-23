+ function() {

  function loadComment(obj, pageNum) {
    obj.pageNum = pageNum
    $api.post('http://121.40.135.115:8080/fotile-api-0.0.2/comment/list', obj,
      function(res) {
        callback(res);
      }
    )

    function callback(res) {
      var data = res.data;
      if (data.length == 0 && obj.pageNum == 1) {
        var noComment = '<div class="ft-comment__header clearfix left-right">\
          <span class="left">评论 <i></i></span>\
          <a href="#""><span class="right comment"></span></a>\
        </div><p>暂无评论，快去抢沙发吧</p>';
        $('.ft-comment').empty().append($(noComment));
        return;
      }
      if (obj.pageNum > 1 && data.length > 0) {
        var template = '<div class="ft-comment__header clearfix left-right">\
          <span class="left">评论 <i>' + data.length + '</i></span>\
          <a href="#""><span class="right comment"></span></a>\
        </div>\
        <ul>\
          {{#data}}\
          <li class="ft-comment__content left-right clearfix">\
            <img src="{{userInfomation.titlePicture}}" class="header-pic left">\
            <p class="right">\
              <span class="title-box clearfix left-right">\
                <span class="left name">{{createby}}</span>\
                <span class="right time"> <time>{{createat}}</time></span>\
              </span>\
              <span class="text">\
                {{content}}\
              </span>\
              {{#commentPictureList}}\
               <img src="{{picture.path}}">\
              {{/commentPictureList}}\
              <button class="reply">回复TA</button>\
              <button class="more">查看更多</button>\
            </p>\
          </li>\
          {{/data}}\
        </ul>';

        res.data.forEach(function(item, index) {
          item.createat = new Date(item.createat).app();
        });
        Mustache.parse(template);
        var rendered = Mustache.render(template, res);
        $('.ft-comment').empty().append($(rendered));
      }
    }

    $(window).off('scroll').on('scroll', $api.throttle(function() {
      var scrollTop = $(this).scrollTop();　　
      var scrollHeight = $(document).height();　　
      var windowHeight = $(this).height();　　
      if (scrollTop + windowHeight == scrollHeight) {
        pageNum += 1;
        loadComment(obj, pageNum);
      }
    }, 500, 200000))
  }

  $.loadComment = loadComment;
}();
