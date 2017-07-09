+function () {
    var isEmpty = false;

    function loadComment(obj, pageNum) {
        obj.pageNum = pageNum;
        $api.post('http://121.40.135.115:8080/fotile-api-0.0.2/comment/list', obj,
            function (res) {
                callback(res);
            }
        );
        function callback(res) {
            var data = res.data;
            console.log(data);
            isEmpty = data.length == 0;
            if (data.length == 0 && obj.pageNum == 1) {
                var noComment = '<div class="ft-comment__header clearfix left-right">\
          <span class="left">评论 <i></i></span>\
          <a href="#" class="leavewords"><span class="right comment"></span></a>\
          <br/>\
          <p>暂无评论，快去抢沙发吧</p>\
        </div>';
                $('.ft-comment').empty().append($(noComment));
                return;
            }
            if (obj.pageNum > 1 && data.length > 0) {
                var template = '<div class="ft-comment__header clearfix left-right">\
          <span class="left">评论 <i>' + data.length + '</i></span>\
          <a href="#" class="leavewords"><span class="right comment"></span></a>\
        </div>\
        <form id="picForm"><div class="leave-words">\
          <textarea placeholder="请输入最新评论"></textarea>\
          <div class="imgup">\
            <div class="img-box full">\
              <section class="img-section">\
                <div id="ssr" class="z_photo upimg-div clear">\
                  <section class="z_file fl">\
                    <img src="../img/add.png" class="add-img">\
                    <input type="file" name="file" id="file" class="file" value="" accept="image/jpg,image/jpeg,image/png,image/bmp" multiple />\
                  </section>\
                </div>\
              </section>\
            </div>\
            <aside class="mask works-mask">\
              <div class="mask-content">\
                <p class="del-p">您确定要删除作品图片吗？</p>\
                <p class="check-p"><span class="del-com wsdel-ok">确定</span><span class="wsdel-no">取消</span></p>\
              </div>\
            </aside>\
            <script src="../js/jquery.min.js"></script>\
            <script src="../js/imgPluginNew.js"></script>\
            <script>\
                $(function(){\
                    $("#file").takungaeImgup({\
                        formData: { "path": "Content/Images/", "name": "uploadpic" },\
                        url: "http://192.168.2.49:8089/fotile/picture/uploadPictureBase64", \
                        success: function (data) {\
                        console.log(data);\
                        },\
                        error: function (err) {\
                            alert(err);\
                        }\
                    });\
                })\
            </script>\
          </div>\
          <button class="commit red-btn">提交</button>\
          <button class="backto red-btn">取消</button>\
        </div></form>\
        <ul>\
          {{#data}}\
          <li class="ft-comment__content left-right clearfix">\
            <img src="{{userInfomation.titlePicture}}" class="header-pic left">\
            <p class="right">\
              <span class="title-box clearfix left-right">\
                <span class="left name">{{createby}}</span>\
              </span>\
              <span class="text">\
                {{content}}\
              </span>\
            </p>\
            <p class="center">\
              {{#commentPictureList}}\
               <img src="{{picture.path}}">\
              {{/commentPictureList}}\
            </p>\
            <p class="bottom">\
              <button class="praise">点赞({{isLike}})</button>\
              <button class="review">评论({{sonCommentList.length}})</button>\
              <button class="reply">回复TA</button>\
              <span class="time"> <time>{{createat}}</time></span>\
            </p>\
            <p class="words">\
              {{#sonCommentList}}\
                <div class="son-comments add">\
                  <img src="{{userInfomation.titlePicture}}" class="header-pic left">\
                  <p class="right">\
                    <span class="title-box clearfix left-right">\
                    <span class="left name">{{createby}}<b>回复</b><a>@{{parentUserInfomation.nickName}}</a></span>\
                    </span>\
                    <span class="text">\
                              {{content}}\
                    </span>\
                    <button class="praise">点赞({{isLike}})</button>\
                    <span class="time"> <time>{{createat}}</time></span>\
                  </p>\
                  <p class="center">\
                    {{#commentPictureList}}\
                    <img src="{{picture.path}}">\
                    {{/commentPictureList}}\
                  </p>\
                </div>\
              {{/sonCommentList}}\
            </p>\
          </li>\
          {{/data}}\
        </ul>';

                res.data.forEach(function (item, index) {
                    item.createat = new Date(item.createat).app();
                    item.sonCommentList.forEach(function (item, index) {
                        item.createat = new Date(item.createat).app();
                    });
                });

                Mustache.parse(template);
                var rendered = Mustache.render(template, res);
                $('.ft-comment').empty().append($(rendered));

                /*留言*/
                $('.leavewords').on('click', function () {
                    $('.leave-words').show();
                });

                $('.commit').on('click', function () {
                    var words = $('.leave-words'),
                        content = words.find('textarea').val().trim();
                    var arr=new Array();
                    var ssr=document.getElementById("ssr").getElementsByClassName("up-img");
                    for(var i=0;i<ssr.length;i++){
                        arr.push(ssr[i]);
                    }
                    console.log(arr);
                    if (!content) {
                        alert('请输入新评论');
                        return;
                    }
                    $api.post('http://121.40.135.115:8080/fotile-api-0.0.2/comment/list', {
                        content: content,
                    }, function (data) {
                        $('.leave-words').hide();
                        $api.toast('提交成功！', 3000);
                        location.reload();
                    })
                });
                $('.backto').on('click', function () {
                    $('.leave-words').hide();
                });

                /*查看回复*/
                $('.review').on('click', function () {
                    $('.add').show();
                });
            }
        }

        $(window).off('scroll').on('scroll', $api.throttle(function () {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if (scrollTop + windowHeight == scrollHeight) {
                if (isEmpty) return;
                pageNum += 1;
                loadComment(obj, pageNum);
            }
        }, 500, 200000))
    }

    $.loadComment = loadComment;
}();
