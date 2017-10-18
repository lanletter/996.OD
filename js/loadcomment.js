+function () {
    var isEmpty = false;
    var homeurl = window.location.href;

    function loadComment(obj, pageNum, type, id, userId) {
        console.log(obj);
        obj.pageNum = pageNum;
        var userid = obj.userId;
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
                var noComment = '\
                <div class="ft-comment__header clearfix left-right">\
                  <span class="left">用户评论<i></i></span>\
                  <button href="#" class="leavewords right comment"></button>\
                  <br/>\
                  <p>暂无评论，快去抢沙发吧</p>\
                </div>\
                <form id="picForm"><div id="leave-words" class="leave-words">\
                  <p class="bgfff"></p>\
                  <textarea placeholder="请输入最新评论..."></textarea>\
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
                    <script src="../js/jquery.min.js"></script>\
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
                  <div class="buttons backto">取消</div>\
                </div></form>';

                Mustache.parse(noComment);
                var rendered0 = Mustache.render(noComment, res);
                $('.ft-comment').empty().append($(rendered0));

                /*留言*/
                $('.leavewords').on('click', function (e) {
                    if (device == "ios" || device == "android") {
                        ft.isLogin(function (result) {
                            var errorcode = result.errorCode.toString();
                            //alert(errorcode);
                            if (errorcode == "1") {
                                userid = result.data.userId.toString();
                                $('#leave-words').show();
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
                        // window.location.href="http://download.fotilestyle.com/?utm-source=share";

                        userid = 120520;
                        $('#leave-words').show();
                        test1(userid);
                    }
                });

                /*取消留言*/
                $('.backto').on('click', function () {
                    $('#leave-words').hide();
                    // refresh(homeurl);
                });

                function test1(userid) {
                    $('#commit').on('click', function (e) {
                        var words = $('#leave-words'),
                            content = words.find('textarea').val().trim();
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
                            return;
                        }
                        //alert("refId:"+obj.refId+"type:"+obj.type+"userId:"+userid+"parentId:"+0);
                        var url = urlport + "comment/createGet?";
                        var contenturl = "content=" + content;
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
                var template = '\
                <div class="ft-comment__header clearfix left-right">\
                  <span class="left">用户评论</span>\
                  <button href="#" class="leavewords right comment"></button>\
                </div>\
                <form id="picForm"><div id="leave-words" class="leave-words">\
                  <p class="bgfff"></p>\
                  <textarea placeholder="请输入最新评论..."></textarea>\
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
                        <p class="check-p"><span class="del-com wsdel-ok">确定</span><span class="wsdel-no">取消</span></p>\
                      </div>\
                    </aside>\
                    <script src="../js/jquery.min.js"></script>\
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
                  <div class="buttons backto">取消</div>\
                </div></form>\
                <ul id="ft-comment-ul">\
                  {{#data}}\
                  <li class="ft-comment__content left-right clearfix">\
                    <img src="{{userInfomation.titlePicture}}" class="header-pic left">\
                    <p class="right">\
                      <span class="title-box clearfix left-right">\
                        <span class="left name">{{userInfomation.nickName}}</span>\
                      </span>\
                      <span class="text">\
                        {{content}}\
                      </span>\
                    </p>\
                    <p id="imglist" class="center">\
                      {{#commentPictureList}}\
                        <img class="pimg img" alt="" src="{{picture.path}}">\
                      {{/commentPictureList}}\
                      <span class=onlyone style="display:none;">{{commentPictureList.length}}</span>\
                    </p>\
                    <p class="bottom">\
                      <span class="key"><span class="Id">{{id}}</span><span class="refId">{{refId}}</span><span class="type">{{type}}</span><span class="parentId">{{parentId}}</span><span class="isLike"><b>{{isLike}}</b></span></span>\
                      <span class="time"> <time>{{createat}}</time></span>\
                      <button class="praise">{{likeCount}}</button>\
                      <button class="reply" id="reply{{id}}">回复TA</button>\
                      <form id="picForm2"><div id="leave-words2">\
                          <div id="bgfff"></div>\
                          <div class="topborder">\
                              <div class="boxhf">\
                                  <textarea placeholder="请输入最新评论..."></textarea>\
                                  <button id="commit2" class="commit">提交</button>\
                              </div>\
                          </div>\
                      </div></form>\
                    </p>\
                    <div class="words">\
                      {{#sonCommentList}}\
                        <div class="son-comments" style="display: none;">\
                          <p class="right">\
                            <span class="key"><span class="Id">{{id}}</span><span class="refId">{{refId}}</span><span class="type">{{type}}</span><span class="parentId">{{parentId}}</span><span class="isLike"><b>{{isLike}}</b></span></span>\
                            <span class="title-box clearfix left-right">\
                            <span class="left name">{{userInfomation.nickName}}<b>回复</b><a>@{{parentUserInfomation.nickName}}</a></span>\
                            </span>\
                            <span class="text">\
                                {{content}}\
                            </span>\
                            <button class="praise">{{likeCount}}</button>\
                            <button class="reply" id="replyy{{id}}">回复TA</button>\
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
                          <span>共{{sonCommentList.length}}条回复 ></span>\
                        </div>\
                    </div>\
                  </li>\
                  {{/data}}\
                </ul>\
                <div id="outerdiv" style="position:fixed;top:0;left:0;background:rgba(0,0,0,0.7);z-index:2;width:100%;height:100%;display:none;"><div id="innerdiv" style="position:absolute;"><img id="bigimg" src="" /></div></div>\
                <script src="../js/BigPictureOpen.js"></script>\
                <script>\
                /*默认显示2条二级评论*/\
                $(".words").each(function(){\
                    $(this).children(".son-comments").eq(0).children(".right").css("border","none");\
                    $(this).children(".son-comments").eq(0).css("display","block");\
                    $(this).children(".son-comments").eq(1).css("display","block");\
                    $(this).children(".son-comments").eq(0).addClass("Noslide");\
                    $(this).children(".son-comments").eq(1).addClass("Noslide");\
                    if($(this).children(".son-comments").length<2){\
                     $(this).children(".review").css("display","none");\
                    }\
                });\
                /*图片点击放大*/\
                $(function(){\
                    $(".pimg").click(function(){\
                        var _this = $(this);\
                        imgShow("#outerdiv", "#innerdiv", "#bigimg", _this);\
                    });\
                });\
                /*选中单张图片*/\
                var $onlyone = $(".onlyone:contains(1)").parent();\
                $onlyone.find("img").removeClass("img");\
                $onlyone.find("img").addClass("imgone");\
                /*单张图片大小等比例自适应*/\
                objImg=$onlyone.find("img");\
                console.log(objImg);\
                for(var i=0;i<objImg.length;i++){\
                    console.log(objImg[i]);\
                    maxWidth=267;\
                    maxHeight=181;\
                    var img = new Image();\
                    img.src = objImg[i].src;\
                    var hRatio;\
                    var wRatio;\
                    var Ratio = 1;\
                    var w = img.width;\
                    var h = img.height;\
                    console.log(w+"|"+h);\
                    wRatio = maxWidth / w;\
                    hRatio = maxHeight / h;\
                    if (maxWidth ==0 && maxHeight==0){\
                        Ratio = 1;\
                    }else if (maxWidth==0){\
                        if (hRatio<1) Ratio = hRatio;\
                    }else if (maxHeight==0){\
                        if (wRatio<1) Ratio = wRatio;\
                    }else if (wRatio<1 || hRatio<1){\
                        Ratio = (wRatio<=hRatio?wRatio:hRatio);\
                    }\
                    if (Ratio<1){\
                        w = w * Ratio;\
                        h = h * Ratio;\
                    }\
                    objImg[i].height = h;\
                    objImg[i].width = w;\
                    console.log(w+"|"+h);\
                }\
                </script>\
                ';

                res.data.forEach(function (item, index) {
                    item.createat = new Date(item.createat).app();
                    console.log(item.commentPictureList);
                    if (item.commentPictureList.length == 1) {
                        var onlyone = item.id;
                        console.log(onlyone);
                    }
                });


                res.data.forEach(function (item, index) {
                    item.sonCommentList.forEach(function (item, index) {
                        item.createat = new Date(item.createat).app();
                    });
                });


                Mustache.parse(template);
                var rendered = Mustache.render(template, res);
                $('.ft-comment').empty().append($(rendered));

                /*留言*/
                $('.leavewords').on('click', function (e) {
                    if (device == "ios" || device == "android") {
                        ft.isLogin(function (result) {
                            var errorcode = result.errorCode.toString();
                            //alert(errorcode);
                            if (errorcode == "1") {
                                userid = result.data.userId.toString();
                                $('#leave-words').show();
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
                        // window.location.href="http://download.fotilestyle.com/?utm-source=share";

                        userid = 120520;
                        $('#leave-words').show();
                        test2(userid);
                    }
                });

                /*取消留言*/
                $('.backto').on('click', function () {
                    $('#leave-words').hide();
                    // refresh(homeurl);
                });
                $('#bgfff').on('click', function () {
                    $('#leave-words2').hide();
                });

                function test2(userid) {
                    $('#commit').on('click', function (e) {
                        var words = $('#leave-words'),
                            content = words.find('textarea').val().trim();
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
                            return;
                        }
                        //alert("refId:"+obj.refId+"type:"+obj.type+"userId:"+userid+"parentId:"+0);
                        var url = urlport + "comment/createGet?";
                        var contenturl = "content=" + content;
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

                $('.reply').on('click', function (e) {
                    if (device == "ios" || device == "android") {
                        $(e.target).attr("id");     // e.target表示被点击的目标
                        var $come = $(e.target).siblings(".key");//数据来自于
                        //var $putin = $(e.target).closest("li");  //数据存放处
                        parentid = $come.find('.Id').text();
                        ft.isLogin(function (result) {
                            var errorcode = result.errorCode.toString();
                            //alert(errorcode);
                            if (errorcode == "1") {
                                userid = result.data.userId.toString();
                                $('#leave-words2').show();
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
                        // window.location.href="http://download.fotilestyle.com/?utm-source=share";

                        $(e.target).attr("id");     // e.target表示被点击的目标
                        var $come = $(e.target).siblings(".key");//数据来自于
                        //var $putin = $(e.target).closest("li");  //数据存放处
                        parentid = $come.find('.Id').text();
                        userid = 120520;
                        $('#leave-words2').show();
                        test(parentid, userid);
                    }
                });
                function test(parentid, userid) {
                    $("#leave-words2 textarea").focus();//默认选中
                    $('#commit2').on('click', function (e) {
                        var words = $('#leave-words2');
                        var content = words.find('textarea').val().trim();
                        console.log(content);
                        if (!content) {
                            alert('请输入新评论');
                            e.preventDefault();
                            return;
                        }
                        // alert("refId:" + obj.refId + "type:" + obj.type + "userId:" + userid + "parentId:" + parentid);
                        var url = urlport + "comment/createGet?";
                        var contenturl = "content=" + content;
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
                $(".review").on("click", function (e) {
                    classname = $(e.target).attr("class");
                    if (classname = "review") {
                        var $soncomments=$(e.target).parent().find(".son-comments");//选中当前二级评论
                        if($(e.target).text()!=="收起"){
                            $soncomments.not(".Noslide").css("display","block");
                            $(e.target).text("收起");
                        }else if($(e.target).text()=="收起"){
                            $soncomments.not(".Noslide").css("display","none");
                            $(e.target).text("共"+$soncomments.length+"条回复")
                        }
                    }
                });

                /*判断点赞 */
                if (userid !== 1) {
                    //console.log($(".isLike :contains(1)").text());
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
                            console.log("111");
                        });
                    } else if (ispraise == "praisebg2") {
                        return;
                    }
                    $(this).unbind("click");
                });
            }
            function refresh(homeurl) {
                console.log(homeurl);
                // alert(homeurl);
                window.location.href = homeurl;
                window.event.returnValue = false;
            }
        }

        $(window).off('scroll').on('scroll', $api.throttle(function () {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            if (scrollTop + windowHeight == scrollHeight) {
                if (isEmpty) return;
                pageNum = pageNum + 1;
                loadComment(obj, pageNum);
            }
        }, 500, 200000))


    }


    $.loadComment = loadComment;
}();