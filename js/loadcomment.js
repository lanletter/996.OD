+function () {
    var isEmpty = false;
    var homeurl = window.location.href;
    var token;

    function loadComment(obj, pageNum, type, id, userId) {
        console.log(obj);
        obj.pageNum = pageNum;
        var typecook = $.cookie('typecook');
        var idcook = $.cookie('idcook');
        var cookstring = typecook + idcook;
        var userid = obj.userId;
        // alert(userid);
        // var userid = 121547;//测试环境
        // var userid = 94138;//预发布环境
        console.log(cookstring);

        $api.post(urlport + 'comment/list', obj,
            function (res) {
                callback(res);
            }
        );

        function callback(res) {
            var data = res.data;
            console.log(data);
            isEmpty = data.length == 0;

            if (data.length == 0 && obj.pageNum == 1) {
                $("#loading").hide();
                var noComment = '\
                <div id="ft-header" class="ft-comment__header clearfix left-right">\
                  <div class="leavewords comment">\
                      <img src="">\
                      <div>快来分享你的作品、感想</div>\
                  </div>\
                  <div class="leavewords nocomment">\
                    <span>登录</span>\
                    <div>请登录后发表评论</div>\
                  </div>\
                  <img src="../img/sofa.png" class="sofa">\
                  <p class="welcome">暂无评论，快来成为第一个评论的用户吧！</p>\
                </div>\
                <form id="picForm"><div id="leave-words" class="leave-words"><div class="boxpl">\
                  <img id="waiting" src="../img/waiting.png" style="display:none;width: 2.85rem;height: 0.84rem;position: absolute;top: 50%;left: 50%;margin: -0.84rem 0 0 -1.425rem;z-index: 999999;">\
                  <p class="bgfff"></p>\
                  <textarea placeholder="请输入最新评论..." maxlength="200" onchange="this.value=this.value.substring(0, 200)" onkeydown="this.value=this.value.substring(0, 200)" onkeyup="this.value=this.value.substring(0, 200)"></textarea>\
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
                        <p class="del-p">您确定要删除图片吗？</p>\
                        <p class="check-p"><span class="del-com wsdel-no">取消</span><span class="wsdel-ok">确定</span></p>\
                      </div>\
                    </aside>\
                    <script src="../js/imgUp.js"></script>\
                    <script>\
                        $(function(){\
                            $("#file").takungaeImgup({\
                                formData: { "path": "Content/Images/", "name": "uploadpic" },\
                                url: urlport+"picture/uploadPictureBase64", \
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
                  <div id="commit" class="buttons commit">提交</div>\
                  <div class="buttons backto">返回详情</div>\
                </div>\
                </div></form>';

                Mustache.parse(noComment);
                var rendered0 = Mustache.render(noComment, res);
                $('.ft-comment').empty().append($(rendered0));

                /*判断是否登录*/
                islogin();

                /*留言*/
                $('.leavewords').unbind().click(function (e) {
                    if (device == "ios" || device == "android") {
                        ft.isLogin(function (result) {
                            var errorcode = result.errorCode.toString();
                            // alert("errorcode："+errorcode);
                            if (errorcode == "1") {
                                userid = result.data.userId.toString();
                                if (userid !== "1" && userid !== 1) {
                                    token = result.data.token.toString();
                                }
                                $('#leave-words').show();
                                $(".btnbox").hide();//积分购买样式兼容
                                test1(userid);
                            } else if (errorCode == "0") {
                                $api.toast('登陆取消', 2000);
                            } else if (errorCode == "-1") {
                                $api.toast('登陆失败', 2000);
                            } else if (errorCode == "-2") {
                                $api.toast('登陆不支持', 2000);
                            }
                        });
                    } else {
                        deeplinkFC()
                        // $('#leave-words').show();
                        // test1(userid);
                    }
                });

                /*取消留言*/
                $('.backto').on('click', function () {
                    $('#leave-words').hide();
                    $(".btnbox").show();//积分购买样式兼容
                    isdelete();
                });

                function test1(userid) {
                    $('#commit').unbind().click(function (e) {
                        var words = $('#leave-words'),
                            content = words.find('textarea').val();
                        var picid = $('#ssr .picid');
                        var picarr = [];

                        var commentPictureIdLists = '';
                        for (var i = 0; i < picid.size(); i++) {
                            //picarr[i] = picid.eq(i).attr("id");
                            commentPictureIdLists += '&commentPictureIdList=' + picid.eq(i).attr("id");
                        }
                        console.log(picid);
                        console.log(picarr);
                        console.log(content);
                        if (!content) {
                            alert('请输入新评论');
                            e.preventDefault();
                            return false;
                        }
                        // alert(content);
                        // alert("refId:"+obj.refId+"type:"+obj.type+"userId:"+userid+"parentId:"+0+"content:"+content);
                        var url = urlport + "comment/createGet?";
                        var contenturl = "content=" + textareaTo(content);
                        var refIdurl = "&refId=" + obj.refId;
                        var typeurl = "&type=" + obj.type;
                        var userIdurl = "&userId=" + userid;
                        var parentidurl = "&parentId=" + 0;
                        // alert(url+contenturl+refIdurl+typeurl+userIdurl+parentidurl+commentPictureIdLists);

                        $.ajax({
                            type: "get",
                            url: url + contenturl + refIdurl + typeurl + userIdurl + parentidurl + commentPictureIdLists,
                            // data: JSON.stringify({
                            //     "commentPictureIdList": picarr,
                            //     "content": content,
                            //     "refId": obj.refId,
                            //     "type": obj.type,
                            //     "userId": userid,
                            //     "parentId": 0
                            // }),
                            // contentType: "application/json;charset=UTF-8",
                            // dataType: 'json',
                            async: false,
                            success: function (data) {
                                console.log('成功');
                                callback(data);
                            },
                            error: function () {
                                console.log('错误');
                            },
                            complete: function () {
                                $('#leave-words').hide();
                                $(".btnbox").show();//积分购买样式兼容
                                refresh(homeurl);
                            }
                        });

                        function callback(res) {
                            // if(res.status == 501){
                            //     alert("此用户已被禁言");
                            //     return;
                            // }
                            if (res.status !== 200) {
                                alert(res.errorMessage);
                                return;
                            }
                            var data = res.data;
                            console.log(data);
                            $api.toast('评论创建成功！', 3000);
                        }
                    });
                }
            }

            if (obj.pageNum >= 1 && data.length > 0) {
                /*判断是否加载完全*/
                obj.pageNum = pageNum + 1;
                $api.post(urlport + 'comment/list', obj,
                    function (res) {
                        console.log(res);
                        if (res.data.length == 0) {
                            $("#loading .nomore").show();
                            $("#loading .btnload").hide();
                            $("#loading .imgift").hide();
                        }
                    }
                );

                var template = '\
                <div class="loadbox">\
                    <div id="ft-header" class="ft-comment__header clearfix left-right">\
                      <div class="leavewords comment">\
                          <img src="">\
                          <div>快来分享你的作品、感想</div>\
                      </div>\
                      <div class="leavewords nocomment">\
                        <span>登录</span>\
                        <div>请登录后发表评论</div>\
                      </div>\
                    </div>\
                    <form id="picForm"><div id="leave-words" class="leave-words"><div class="boxpl">\
                      <img id="waiting" src="../img/waiting.png" style="display:none;width: 2.85rem;height: 0.84rem;position: absolute;top: 50%;left: 50%;margin: -0.84rem 0 0 -1.425rem;z-index: 999999;">\
                      <p class="bgfff"></p>\
                      <textarea placeholder="请输入最新评论..." maxlength="200" onchange="this.value=this.value.substring(0, 200)" onkeydown="this.value=this.value.substring(0, 200)" onkeyup="this.value=this.value.substring(0, 200)"></textarea>\
                      <div class="imgup">\
                        <div class="img-box full">\
                          <section class="img-section">\
                            <div id="ssr" class="z_photo upimg-div clear">\
                              <section class="z_file fl">\
                                <div class="add-img"></div>\
                                <input type="file" name="file" id="file" class="file" value="" accept="image/jpg,image/jpeg,image/png,image/bmp" multiple />\
                              </section>\
                            </div>\
                          </section>\
                        </div>\
                        <aside class="mask works-mask">\
                          <div class="mask-content">\
                            <p class="del-p">您确定要删除图片吗？</p>\
                            <p class="check-p"><span class="del-com wsdel-ok">确定</span><span class="wsdel-no">取消</span></p>\
                          </div>\
                        </aside>\
                      </div>\
                      <div id="commit" class="buttons commit">提交</div>\
                      <div class="buttons backto">返回详情</div>\
                    </div></div></form>\
                    <ul class="ft-comment-ul">\
                      {{#data}}\
                      <li class="ft-comment__content left-right clearfix">\
                        <div class="boxright"> \
                            <div class="parentdiv">\
                                <div class="header-pic userurl"><img src="{{userInfomation.titlePicture}}"></div>\
                                <span style="display: none;">{{userId}}</span>\
                                <p class="titles">\
                                  <span class="key"><span class="Id">{{id}}</span><span class="refId">{{refId}}</span><span class="type">{{type}}</span><span class="userId"><b>{{userId}}</b></span><span class="parentId">{{parentId}}</span><span class="isLike"><b>{{isLike}}</b></span><span class="otstatus"><b>{{otstatus}}</b></span><span class="status"><b>{{status}}</b></span></span>\
                                  <span class="title-box clearfix left-right">\
                                    <span class="left name">{{userInfomation.nickName}}</span>\
                                  </span>\
                                  <span class="time">\
                                    {{createat}}\
                                  </span>\
                                  <a class="delete" id="delete{{id}}">删除</a>\
                                </p>\
                                <p class="texts">\
                                    {{{content}}}\
                                </p>\
                                <p class="imglist center">\
                                  {{#commentPictureList}}\
                                    <img class="pimg img" alt="" src="{{picture.path2}}">\
                                    <img class="pimg img" style="display: none;" alt="" src="{{picture.path}}">\
                                  {{/commentPictureList}}\
                                  <span class="onlyone" style="display:none;">{{commentPictureList.length}}</span>\
                                </p>\
                                <p class="bottom">\
                                  <span class="key"><span class="Id">{{id}}</span><span class="refId">{{refId}}</span><span class="type">{{type}}</span><span class="userId"><b>{{userId}}</b></span><span class="parentId">{{parentId}}</span><span class="isLike"><b>{{isLike}}</b></span><span class="otstatus"><b>{{otstatus}}</b></span><span class="status"><b>{{status}}</b></span></span>\
                                  <span class="reply rpbutton" id="reply{{id}}">回复</span>\
                                  <span class="dot"></span>\
                                  <a class="praise">{{likeCount}}</a>\
                                </p>\
                            </div>\
                            <div class="words sondiv">\
                              {{#sonCommentList}}\
                                <div class="son-comments" style="display: none;">\
                                  <p class="right">\
                                    <span class="key"><span class="Id">{{id}}</span><span class="refId">{{refId}}</span><span class="type">{{type}}</span><span class="userId"><b>{{userId}}</b></span><span class="parentId">{{parentId}}</span><span class="isLike"><b>{{isLike}}</b></span><span class="otstatus"><b>{{otstatus}}</b></span><span class="status"><b>{{status}}</b></span></span>\
                                    <span class="title-box">\
                                        <span class="name"><b>{{userInfomation.nickName}}回复</b>@{{parentUserInfomation.nickName}}</span>\
                                        <span class="text">\
                                            {{{content}}}\
                                        </span>\
                                    </span>\
                                  </p>\
                                  <p class="bottom">\
                                      <span class="key"><span class="Id">{{id}}</span><span class="refId">{{refId}}</span><span class="type">{{type}}</span><span class="userId"><b>{{userId}}</b></span><span class="parentId">{{parentId}}</span><span class="isLike"><b>{{isLike}}</b></span><span class="otstatus"><b>{{otstatus}}</b></span><span class="status"><b>{{status}}</b></span></span>\
                                      <a class="praise">{{likeCount}}</a>\
                                      <span class="dot"></span>\
                                      <span class="reply rpbutton" id="reply{{id}}">回复</span>\
                                      <span class="delete" id="delete{{id}}">删除</span>\
                                      <span class="time"> <time>{{createat}}</time></span>\
                                  </p>\
                                  <p class="center">\
                                    {{#commentPictureList}}\
                                    <img src="{{picture.path}}">\
                                    {{/commentPictureList}}\
                                  </p>\
                                </div>\
                              {{/sonCommentList}}\
                                <div class="review">\
                                  查看全部评论\
                                </div>\
                            </div>\
                        </div>\
                      </li>\
                      {{/data}}\
                    </ul>\
                    <form id="picForm2"><div id="leave-words2" style="z-index:999999;">\
                      <div id="bgfff"></div>\
                      <div class="topborder">\
                          <div class="boxhf">\
                              <textarea class="textarea" placeholder="请输入最新评论..." maxlength="200" onchange="this.value=this.value.substring(0, 200)" onkeydown="this.value=this.value.substring(0, 200)" onkeyup="this.value=this.value.substring(0, 200)"></textarea>\
                              <div id="commit2" class="commit">回复</div>\
                          </div>\
                      </div>\
                    </div></form>\
                    <div id="outerdiv" style="position:fixed;top:0;left:0;background:rgba(0,0,0,0.7);z-index:999999;width:100%;height:100%;display:none;"><div id="innerdiv" style="position:absolute;"><img id="bigimg" src="" /></div></div>\
                <div id="scripts">\
                <script src="../js/imgUp.js"></script>\
                <script>\
                    /*上传图片*/\
                        $(function(){\
                            $("#file").takungaeImgup({\
                                formData: { "path": "Content/Images/", "name": "uploadpic" },\
                                url: urlport+"picture/uploadPictureBase64", \
                                success: function (data) {\
                                console.log(data);\
                                },\
                                error: function (err) {\
                                    alert(err);\
                                }\
                        });\
                        })\
                </script>\
                <script src="../js/BigPictureOpen.js"></script>\
                <script>\
                    /*默认显示2条二级评论*/\
                        $(".words").each(function(){\
                            $(this).children(".son-comments").eq(0).children(".right").css("border","none");\
                            $(this).children(".son-comments").eq(0).css("display","block");\
                            $(this).children(".son-comments").eq(1).css("display","block");\
                            $(this).children(".son-comments").eq(0).addClass("Noslide");\
                            $(this).children(".son-comments").eq(1).addClass("Noslide");\
                            if($(this).children(".son-comments").length<3){\
                             $(this).children(".review").css("display","none");\
                            }\
                        });\
                    /*判断是否有图片*/\
                        $(".imglist").each(function(){\
                            if($(this).children(".img").length>0){\
                             $(this).css({"padding-top":"-0.04rem","margin-bottom":"0.6rem"});\
                            }\
                        });\
                    /*图片点击放大*/\
                        $(function(){\
                            $(".pimg").click(function(){\
                                var _this = $(this).next();\
                                imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);\
                            });\
                        });\
                    /*选中单张图片*/\
                        var $onlyone = $(".onlyone:contains(1)").parent();\
                        $onlyone.find("img").removeClass("img");\
                </script>\
                </div>\
                </div>\
                ';

                res.data.forEach(function (item, index) {
                    item.createat = new Date(item.createat).app();
                });

                res.data.forEach(function (item, index) {
                    item.sonCommentList.forEach(function (item, index) {
                        item.createat = new Date(item.createat).app();
                    });
                });

                /*图片尺寸压缩*/
                res.data.forEach(function (item, index) {
                    if (item.commentPictureList !== null) {
                        item.commentPictureList.forEach(function (item, index) {
                            // console.log(item.picture.path);
                            var imgUrl = item.picture.path;
                            var ifurl = imgUrl.indexOf("https://oss.fotilestyle.com");
                            if (ifurl == 0) {
                                //表示imgUrl是以https:oss.fotilestyle.com开头
                                var pos = imgUrl.indexOf('?');
                                if (pos > 0) {//如果？存在
                                    var result = imgUrl.substring(0, pos);
                                } else {//？不存在
                                    var result = imgUrl;
                                }
                                // console.log(result);
                                var imgUrl2 = result + "?x-oss-process=image/format,jpg/interlace,1/resize,m_lfit,h_181,w_267/auto-orient,0";
                                // console.log(imgUrl2);
                                item.picture.path2 = imgUrl2;
                            } else if (ifurl == -1) {
                                item.picture.path2 = imgUrl;
                            }
                        });
                    }
                });

                Mustache.parse(template);
                var rendered = Mustache.render(template, res);
                // $('.ft-comment').empty().append($(rendered));
                $('.ft-comment').append($(rendered));
                $(".ft-comment").prepend($("#ft-header"));
                $(".ft-comment").append($("#picForm"));
                $(".ft-comment").append($("#picForm2"));
                $(".ft-comment").append($("#outerdiv"));
                // $(".ft-comment").append($("#loading"));
                $(".ft-comment").append($("#script"));
                $(".loadbox #ft-header").remove();
                $(".loadbox #picForm").remove();
                $(".loadbox #picForm2").remove();
                $(".loadbox #outerdiv").remove();
                // $(".loadbox #loading").remove();
                $(".loadbox #scripts").remove();


                var windowHeightReal = window.screen.height;
                if (device == "ios" && windowHeightReal == 812) {
                    //iphoneX
                    $("#leave-words2 .topborder").css({"position": "absolute", "bottom": "1rem"});
                }


                /*判断是否登录*/
                islogin();

                /*留言*/
                $('.leavewords').unbind().click(function (e) {
                    if (device == "ios" || device == "android") {
                        ft.isLogin(function (result) {
                            var errorcode = result.errorCode.toString();
                            // alert("errorcode："+errorcode);
                            if (errorcode == "1") {
                                userid = result.data.userId.toString();
                                if (userid !== "1" && userid !== 1) {
                                    token = result.data.token.toString();
                                }
                                $('#leave-words').show();
                                $(".btnbox").hide();//积分购买样式兼容
                                test2(userid);
                            } else if (errorCode == "0") {
                                $api.toast('登陆取消', 2000);
                            } else if (errorCode == "-1") {
                                $api.toast('登陆失败', 2000);
                            } else if (errorCode == "-2") {
                                $api.toast('登陆不支持', 2000);
                            }
                        });
                    } else {
                        deeplinkFC()
                        // $('#leave-words').show();
                        // test2(userid);
                    }
                });

                /*取消留言*/
                $('.backto').on('click', function () {
                    $('#leave-words').hide();
                    $(".btnbox").show();//积分购买样式兼容
                    isdelete();
                });
                $('#bgfff').on('click', function () {
                    $('#leave-words2').hide();
                    $(".btnbox").show();//积分购买样式兼容
                    isdelete();
                });

                function test2(userid) {
                    $('#commit').unbind().click(function (e) {
                        var words = $('#leave-words'),
                            content = words.find('textarea').val();
                        var picid = $('#ssr .picid');
                        var picarr = [];

                        var commentPictureIdLists = '';
                        for (var i = 0; i < picid.size(); i++) {
                            //picarr[i] = picid.eq(i).attr("id");
                            commentPictureIdLists += '&commentPictureIdList=' + picid.eq(i).attr("id");
                        }
                        // console.log(picid);
                        // console.log(picarr);
                        // console.log(content);
                        if (!content) {
                            alert('请输入新评论');
                            e.preventDefault();
                            return;
                        }
                        // alert(content);
                        // alert("refId:"+obj.refId+"type:"+obj.type+"userId:"+userid+"parentId:"+0+"content:"+content);
                        var url = urlport + "comment/createGet?";
                        var contenturl = "content=" + textareaTo(content);
                        var refIdurl = "&refId=" + obj.refId;
                        var typeurl = "&type=" + obj.type;
                        var userIdurl = "&userId=" + userid;
                        var parentidurl = "&parentId=" + 0;
                        // alert(url + contenturl + refIdurl + typeurl + userIdurl + parentidurl + commentPictureIdLists);

                        $.ajax({
                            type: "get",
                            url: url + contenturl + refIdurl + typeurl + userIdurl + parentidurl + commentPictureIdLists,
                            // data: JSON.stringify({
                            //     "commentPictureIdList": picarr,
                            //     "content": content,
                            //     "refId": obj.refId,
                            //     "type": obj.type,
                            //     "userId": userid,
                            //     "parentId": 0
                            // }),
                            // contentType: "application/json;charset=UTF-8",
                            // dataType: 'json',
                            async: false,
                            success: function (data) {
                                console.log('成功');
                                callback(data);
                            },
                            error: function () {
                                console.log('错误');
                            },
                            complete: function () {
                                $('#leave-words').hide();
                                $(".btnbox").show();//积分购买样式兼容
                                refresh(homeurl);
                            }
                        });

                        function callback(res) {
                            if (res.status !== 200) {
                                alert(res.errorMessage);
                                return;
                            }
                            var data = res.data;
                            console.log(data);
                            $api.toast('评论创建成功！', 3000);
                        }
                    });
                }

                // $(document).click(function (e) {
                //     console.log(e);
                // })
                $('.userurl').unbind().click(function (e) {
                    var imguserid = $(e.target).next().text();     // e.target表示被点击的目标
                    console.log(imguserid);
                    if (device == "ios" || device == "android") {
                        ft.tutorInfo({
                            id: imguserid,
                            type: 1
                        }, function (result) {
                        })
                    } else {
                        deeplinkFC();
                        // window.location.href = "home-user.html?id="+imguserid;
                    }
                });

                $('.rpbutton').unbind().click(function (e) {
                    $("#leave-words2 .textarea").focus();//默认选中
                    if (device == "ios" || device == "android") {
                        $(e.target).attr("id");     // e.target表示被点击的目标
                        var $come = $(e.target).siblings(".key");//数据来自于
                        parentid = $come.find('.Id').text();
                        ft.isLogin(function (result) {
                            var errorcode = result.errorCode.toString();
                            // alert("errorcode："+errorcode);
                            if (errorcode == "1") {
                                userid = result.data.userId.toString();
                                if (userid !== "1" && userid !== 1) {
                                    token = result.data.token.toString();
                                }
                                $('#leave-words2').show();
                                $(".btnbox").hide();//积分购买样式兼容
                                test(parentid, userid);
                            } else if (errorCode == "0") {
                                $api.toast('登陆取消', 2000);
                            } else if (errorCode == "-1") {
                                $api.toast('登陆失败', 2000);
                            } else if (errorCode == "-2") {
                                $api.toast('登陆不支持', 2000);
                            }
                        });
                    } else {
                        deeplinkFC();
                        // var targetid = $(e.target).attr("id");     // e.target表示被点击的目标
                        // var $come = $(e.target).siblings(".key");//数据来自于
                        // parentid = $come.find('.Id').text();
                        // // alert(parentid);
                        // $('#leave-words2').show();
                        // test(parentid, userid);
                    }
                });

                function test(parentid, userid) {
                    $("#leave-words2 .textarea").focus();//默认选中
                    /*键盘控制*/
                    $("#leave-words2 .textarea").bind("keydown", function (e) {
                        // 兼容FF和IE和Opera
                        var theEvent = e || window.event;
                        var code = theEvent.keyCode || theEvent.which || theEvent.charCode;
                        if (code == 13) {
                            //回车执行查询
                            return false;
                            //             if (confirm("确定提交评论吗？")) {
                            //                 $("#commit2").unbind().click();
                            //             }
                            //             else {
                            //                 return;
                            //             }
                        }
                    });

                    $('#commit2').unbind().click(function (e) {
                        var words = $('#leave-words2');
                        var content = words.find('.textarea').val();
                        console.log(content);
                        if (!content) {
                            alert('请输入新评论');
                            e.preventDefault();
                            return;
                        }
                        // alert(content);
                        // alert("refId:" + obj.refId + "type:" + obj.type + "userId:" + userid + "parentId:" + parentid);
                        var url = urlport + "comment/createGet?";
                        var contenturl = "content=" + textareaTo(content);
                        var refIdurl = "&refId=" + obj.refId;
                        var typeurl = "&type=" + obj.type;
                        var userIdurl = "&userId=" + userid;
                        var parentidurl = "&parentId=" + parentid;
                        // alert(url+contenturl+refIdurl+typeurl+userIdurl+parentidurl);
                        $.ajax({
                            type: "get",
                            url: url + contenturl + refIdurl + typeurl + userIdurl + parentidurl,
                            // data: JSON.stringify({
                            //     "content": content,
                            //     "refId": obj.refId,
                            //     "type": obj.type,
                            //     "userId": userid,
                            //     "parentId": parentid
                            // }),
                            // contentType: "application/json;charset=UTF-8",
                            //dataType: 'json',
                            async: false,
                            success: function (data) {
                                console.log('创建成功！');
                                callback(data);

                            },
                            error: function () {
                                console.log('创建失败！');
                            },
                            complete: function () {
                                $('#leave-words2').hide();
                                $(".btnbox").show();//积分购买样式兼容
                                refresh(homeurl);
                            }
                        });

                        function callback(res) {
                            if (res.status !== 200) {
                                alert(res.errorMessage);
                                return;
                            }
                            var data = res.data;
                            console.log(data);
                            $api.toast('评论创建成功！', 3000);
                        }


                    });
                }

                /*查看回复*/
                $('.review').unbind().click(function (e) {
                    var $soncomments = $(e.target).parent().find(".son-comments");//选中当前二级评论
                    if ($(e.target).text() !== "收起评论") {
                        $soncomments.not(".Noslide").css("display", "block");
                        $(e.target).text("收起评论");
                    } else if ($(e.target).text() == "收起评论") {
                        $soncomments.not(".Noslide").css("display", "none");
                        $(e.target).text("查看全部评论")
                    }
                });

                /*是否出现删除按钮 */
                if (userid !== 1) {
                    console.log($(".userId :contains(" + userid + ")").text());
                    var $delete = $(".userId :contains(" + userid + ")");
                    var $nodelete1 = $(".otstatus :contains(2)");
                    $delete.parent().parent().siblings(".delete").css("display", "inline-block");
                    $nodelete1.parent().parent().siblings(".delete").css("display", "none");
                } else {
                    $(".delete").css("display", "none");
                }

                /*公共：是否出现删除按钮*/
                function isdelete() {
                    var $delete = $(".userId :contains(" + userid + ")");
                    var $nodelete1 = $(".otstatus :contains(2)");
                    $delete.parent().parent().siblings(".delete").css("display", "inline-block");
                    $nodelete1.parent().parent().siblings(".delete").css("display", "none");
                }

                /*删除 */
                $('.delete').unbind().click(function (e) {
                    // alert("触发按钮");
                    if (confirm("确定要删除评论吗？")) {
                        $(e.target).attr("id");     // e.target表示被点击的目标
                        var $come = $(e.target).siblings(".key");//数据来自于
                        var deleteid = $come.find('.Id').text();
                        // alert("userId:" + userid + "deleteid:" + deleteid);
                        $.ajax({
                            type: 'POST',
                            url: urlport + "comment/del",
                            datatype: "json",
                            data: JSON.stringify({
                                userId: userid,
                                id: deleteid
                            }),
                            contentType: 'application/json;charset=UTF-8',
                            success: function (ret) {
                                // console.log(ret);
                                // alert(JSON.stringify(ret));
                                refresh(homeurl);
                            }
                        });
                    } else {
                        return;
                    }
                });

                /*判断点赞 */
                if (userid !== 1 || cookstring !== NaN) {
                    console.log($(".isLike :contains(1)").text());
                    var $like = $(".isLike :contains(1)");
                    var $unlike = $(".isLike :contains(0)");
                    $like.parent().parent().siblings(".praise").addClass("praisebg2");
                    $unlike.parent().parent().siblings(".praise").addClass("praisebg");
                } else {
                    $(".praise").addClass("praisebg");
                }

                /*点赞*/
                $('.praise').bind('click', function (e) {
                    var $come = $(e.target).siblings(".key");//数据来自于
                    var ispraise = $(e.target).attr('class');
                    if (ispraise == "praise praisebg") {
                        $(e.target).remove("praisebg");
                        $(e.target).addClass("praisebg2");
                        var oldnum = $(e.target).text();
                        $(e.target).text(parseInt(oldnum) + 1);
                        $api.post(urlport + 'like/create', {
                            "refId": $come.find('.Id').text(),
                            "type": 9,
                            "userId": userid
                        }, function (data) {
                            console.log(data);
                            $.cookie('typecook', $come.find('.type').text());
                            $.cookie('idcook', $come.find('.userId b').text());
                        });
                    } else if (ispraise == "praisebg2") {
                        return;
                    }
                    $(this).unbind("click");
                });
            }

            /*判断是否登录*/
            function islogin() {
                if (userid == 1) {
                    $(".nocomment").show();
                    $(".comment").hide();
                } else {
                    $(".comment").show();
                    $(".nocomment").hide();
                    $.ajax({
                        type: 'POST',
                        url: urlport + "user/getTitlePictureByUserId",
                        datatype: "json",
                        data: JSON.stringify({
                            "userId": userid
                        }),
                        contentType: 'application/json;charset=UTF-8',
                        success: function (info) {
                            console.log(info);
                            $(".comment img").attr("src", info.data);
                        }
                    });
                }
            }

            /*跳转链接*/
            function refresh(homeurl) {
                // alert(homeurl);
                window.location.href = homeurl;
                window.event.returnValue = false;
            }

            function textareaTo(str) {
                var reg = new RegExp("\n", "g");
                var regSpace = new RegExp(" ", "g");

                str = str.replace(reg, "<br>");
                str = str.replace(regSpace, "nbsp;");

                return str;
            }

            function deeplinkFC() {
                function GetQueryString(name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]);
                    return null;
                }

                var id = GetQueryString("id");

                function GetPageName() {
                    var url = window.location.href;//获取完整URL
                    var tmp = location.pathname.replace(/(.+)[＼＼/]/, "");//获取带后缀的文件名称
                    name = tmp.replace(/.html/, "");//获取不带后缀的文件名称
                    return name;
                }

                // alert(GetPageName());
                /*页面参数（页面类型+id）*/
                var id = id;
                var refid = id;
                var action = GetPageName();
                var weburl = window.location.protocol + "//" + window.location.host + window.location.pathname + "?id=" + id;
                var imageURL = "";
                var shareTitle = "";
                var shareSubTitle = "";
                var iostype = "";

                console.log({
                    "id": id,
                    "action": action,
                    "weburl": weburl,
                    "refid": refid,
                    "imageURL": imageURL,
                    "shareTitle": shareTitle,
                    "shareSubTitle": shareSubTitle,
                    "iostype": iostype
                });

                var urlright = "?action=" + encodeURIComponent(action) +
                    "&id=" + encodeURIComponent(id) +
                    "&weburl=" + encodeURIComponent(weburl) +
                    "&refid=" + encodeURIComponent(refid) +
                    "&imageURL=" + encodeURIComponent(imageURL) +
                    "&shareTitle=" + encodeURIComponent(shareTitle) +
                    "&shareSubTitle=" + encodeURIComponent(shareSubTitle) +
                    "&iostype=" + encodeURIComponent(iostype);

                /*判断是IOS还是Android机型*/
                var u = navigator.userAgent;
                var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
                var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                // console.log('是否是Android：' + isAndroid);
                // console.log('是否是iOS：' + isiOS);

                /*判断是否微信浏览器内打开*/
                function isWeiXin() {
                    var ua = window.navigator.userAgent.toLowerCase();
                    // console.log(ua);//mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
                    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
                        return true;
                    } else {
                        return false;
                    }
                }

                if (isWeiXin()) {
                    console.log(" 是来自微信内置浏览器");
                    /*弹出浏览器打开提示*/
                    var alertstr = "<div class='blackbg'><div class='reminder'>" +
                        "<img src='../img/arrowdashed.png' >" +
                        "<p class='title'>在微信中无法打开？</p>" +
                        "<p>请点击右上角，选择在浏览器或Safari中打开。</p>" +
                        "</div></div>";
                    $("body").prepend(alertstr);
                    $("html,body").css({"height": "100%", "position": "relative", "overflow": "hidden"}); //禁用滚动条

                    /*隐藏提示*/
                    $(".blackbg").unbind().click(function () {
                        $(".blackbg").remove();
                        $("html,body").css({"height": "auto", "position": "static", "overflow": "auto"}); //启用滚动条
                    });
                    $(".reminder").click(function (event) {
                        event.stopPropagation();//阻止冒泡
                    });

                } else {
                    console.log("不是来自微信内置浏览器");
                    /*深链接打开*/
                    var deeplinkurl = "fotile://api.fotilestyle.com/" + urlright;
                    // alert(deeplinkurl);
                    window.location.href = deeplinkurl;
                    /***打开app的协议***/
                    window.setTimeout(function () {
                        if (isiOS == true) {/*ios手机*/
                            window.location.href = "https://gio.ren/re0Y923";
                        } else if (isAndroid == true) {/*Android手机*/
                            window.location.href = "https://gio.ren/rBZ2ApB";
                        }
                    }, 1000);

                }

            }
        }

        /*下拉加载*/
        // var isEmpty = true;
        // function haha() {
        //     var scrollTop = $(this).scrollTop();
        //     var windowHeight = $(this).height();
        //     var scrollHeight = $(document).height();
        //     if (scrollTop + windowHeight == scrollHeight) {
        //         pageNum = pageNum + 1;
        //         loadComment(obj, pageNum);
        //     }
        //     isEmpty = true;
        // }
        // window.onscroll = function () {
        //     if (isEmpty) {
        //         setTimeout(haha, 1000);
        //         isEmpty = false;
        //     }
        // };
        var isEmpty = true;
        var windowHeight = $(window).height();
        var windowHeightReal = window.screen.height;
//      alert(windowHeight);
//      alert(windowHeightReal);
        if (device == "ios" && windowHeight !== windowHeightReal && windowHeightReal !== 812) {
//          alert("ios");
            $(window).off('scroll').on('scroll', $api.throttle(function () {
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(document).height();
                if (scrollTop + windowHeightReal == scrollHeight) {
                    if (isEmpty) return;
                    pageNum = pageNum + 1;
                    loadComment(obj, pageNum);
                }
            }, 500))
        } else if (device == "ios" && windowHeight !== windowHeightReal && windowHeightReal == 812) {
            // alert("X");
            $(window).off('scroll').on('scroll', $api.throttle(function () {
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(document).height();
//              alert(scrollTop + windowHeightReal - 34);
//				alert(scrollHeight);
                if (scrollTop + windowHeightReal - 34 == scrollHeight) {
                    if (isEmpty) return;
                    pageNum = pageNum + 1;
                    loadComment(obj, pageNum);
                }
            }, 500))
        } else {
            $(window).off('scroll').on('scroll', $api.throttle(function () {
                var scrollTop = $(this).scrollTop();
                var scrollHeight = $(document).height();
                if (scrollTop + windowHeight == scrollHeight) {
                    if (isEmpty) return;
                    pageNum = pageNum + 1;
                    loadComment(obj, pageNum);
                }
            }, 500))
        }


        /*点击按钮加载*/
        // $("#loading .btnload").bind('click', function (e) {
        //     pageNum = pageNum + 1;
        //     loadComment(obj, pageNum);
        // })

    }

    $.loadComment = loadComment;

}();