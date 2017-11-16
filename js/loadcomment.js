+function () {
    var isEmpty = false;
    var homeurl = window.location.href;

    function loadComment(obj, pageNum, type, id, userId) {
        console.log(obj);
        obj.pageNum = pageNum;
        var typecook = $.cookie('typecook');
        var idcook = $.cookie('idcook');
        var cookstring=typecook+idcook;
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
            // alert(data.length);

            if (data.length == 0 && obj.pageNum == 1) {
                var noComment = '\
                <div id="ft-header" class="ft-comment__header clearfix left-right">\
                  <span class="left">用户评论<i></i></span>\
                  <button href="#" class="leavewords right comment"></button>\
                  <br/>\
                  <p>暂无评论，快去抢沙发吧</p>\
                </div>\
                <form id="picForm"><div id="leave-words" class="leave-words">\
                  <p class="bgfff"></p>\
                  <textarea placeholder="请输入最新评论..." maxlength="200" onchange="this.value=this.value.substring(0, 200)" onkeydown="this.value=this.value.substring(0, 200)" onkeyup="this.value=this.value.substring(0, 200)"></textarea>\
                  <div id="commit" class="buttons commit">提交</div>\
                  <div class="buttons backto">取消</div>\
                </div></form>';

                Mustache.parse(noComment);
                var rendered0 = Mustache.render(noComment, res);
                $('.ft-comment').append($(rendered0));

                /*留言*/
                $('.leavewords').unbind().click(function (e) {
                    if (device == "ios" || device == "android") {
                        ft.isLogin(function (result) {
                            var errorcode = result.errorCode.toString();
                            // alert("errorcode："+errorcode);
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
                        window.location.href = "http://download.fotilestyle.com/?utm-source=share";
                        // userid = 120520;
                        // $('#leave-words').show();
                        // test1(userid);
                    }
                });

                /*取消留言*/
                $('.backto').on('click', function () {
                    $('#leave-words').hide();
                    isdelete();
                });

                function test1(userid) {
                    $('#commit').unbind().click(function (e) {
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
                        //alert(url+contenturl+refIdurl+typeurl+userIdurl+parentidurl+commentPictureIdLists);

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
            <div class="loadbox">\
                <div id="ft-header" class="ft-comment__header clearfix left-right">\
                  <span class="left">用户评论</span>\
                  <button href="#" class="leavewords right comment"></button>\
                </div>\
                <form id="picForm"><div id="leave-words" class="leave-words">\
                  <p class="bgfff"></p>\
                  <textarea placeholder="请输入最新评论..." maxlength="200" onchange="this.value=this.value.substring(0, 200)" onkeydown="this.value=this.value.substring(0, 200)" onkeyup="this.value=this.value.substring(0, 200)"></textarea>\
                  <div id="commit" class="buttons commit">提交</div>\
                  <div class="buttons backto">取消</div>\
                </div></form>\
                <ul class="ft-comment-ul">\
                  {{#data}}\
                  <li class="ft-comment__content left-right clearfix">\
                    <img src="{{userInfomation.titlePicture}}" class="header-pic">\
                    <div class="boxright"><div clsss="boxright2">\
                        <p class="right">\
                          <span class="title-box clearfix left-right">\
                            <span class="left name">{{userInfomation.nickName}}</span>\
                          </span>\
                          <span class="text">\
                            {{content}}\
                          </span>\
                        </p>\
                        <p class="bottom">\
                          <span class="key"><span class="Id">{{id}}</span><span class="refId">{{refId}}</span><span class="type">{{type}}</span><span class="userId"><b>{{userId}}</b></span><span class="parentId">{{parentId}}</span><span class="isLike"><b>{{isLike}}</b></span><span class="otstatus"><b>{{otstatus}}</b></span><span class="status"><b>{{status}}</b></span></span>\
                          <span class="time"> <time>{{createat}}</time></span>\
                          <button class="delete" id="delete{{id}}">删除</button>\
                          <span class="reply rpbutton" id="reply{{id}}">回复</span>\
                          <span class="dot">•</span>\
                          <button class="praise">{{likeCount}}</button>\
                        </p>\
                        <div class="words">\
                          {{#sonCommentList}}\
                            <div class="son-comments" style="display: none;">\
                              <p class="right">\
                                <span class="key"><span class="Id">{{id}}</span><span class="refId">{{refId}}</span><span class="type">{{type}}</span><span class="userId"><b>{{userId}}</b></span><span class="parentId">{{parentId}}</span><span class="isLike"><b>{{isLike}}</b></span><span class="otstatus"><b>{{otstatus}}</b></span><span class="status"><b>{{status}}</b></span></span>\
                                <span class="title-box rpbutton" id="reply{{id}}">\
                                    <span class="name">{{userInfomation.nickName}}<b>回复</b><a>@{{parentUserInfomation.nickName}}</a><b>：</b></span>\
                                    <span class="text">\
                                        {{content}}\
                                    </span>\
                                </span>\
                                <button class="praise">{{likeCount}}</button>\
                                <button class="delete" id="delete{{id}}">删除</button>\
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
                              共{{sonCommentList.length}}条回复 >\
                            </div>\
                        </div>\
                    </div></div>\
                  </li>\
                  {{/data}}\
                </ul>\
                <form id="picForm2"><div id="leave-words2" style="z-index:999999;">\
                  <div id="bgfff"></div>\
                  <div class="topborder">\
                      <div class="boxhf">\
                          <input class="textarea" placeholder="请输入最新评论..." maxlength="200"/>\
                          <div id="commit2" class="commit">回复</div>\
                      </div>\
                  </div>\
                </div></form>\
                <div id="scripts">\
                    <script src="../js/alertdiy.js"></script>\
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

                Mustache.parse(template);
                var rendered = Mustache.render(template, res);
                $('.ft-comment').append($(rendered));
                $(".ft-comment").prepend($("#ft-header"));
                $(".ft-comment").append($("#picForm"));
                $(".ft-comment").append($("#picForm2"));
                $(".ft-comment").append($("#outerdiv"));
                // $(".ft-comment").append($("#loading"));
                $(".ft-comment").append($("#scripts"));
                $(".loadbox #ft-header").remove();
                $(".loadbox #picForm").remove();
                $(".loadbox #picForm2").remove();
                $(".loadbox #outerdiv").remove();
                // $(".loadbox #loading").remove();
                $(".loadbox #scripts").remove();


                /*留言*/
                $('.leavewords').unbind().click(function (e) {
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
                        window.location.href = "http://download.fotilestyle.com/?utm-source=share";
                        // userid = 120520;
                        // $('#leave-words').show();
                        // test2(userid);
                    }
                });

                /*取消留言*/
                $('.backto').on('click', function () {
                    $('#leave-words').hide();
                    isdelete();
                });
                $('#bgfff').on('click', function () {
                    $('#leave-words2').hide();
                    document.body.style.overflow='';//出现滚动条
                    document.removeEventListener("touchmove",mo,false);//出现滚动条
                    isdelete();
                });

                function test2(userid) {
                    $('#commit').unbind().click(function (e) {
                        var words = $('#leave-words'),
                            content = words.find('textarea').val().trim();
                        var picid = $('#ssr .picid');
                        var picarr = [];

                        var commentPictureIdLists = '';
                        for (var i = 0; i < picid.size(); i++) {
                            //picarr[i] = picid.eq(i).attr("id");
                            commentPictureIdLists += '&commentPictureIdList=' + picid.eq(i).attr("id");
                        }
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
                        //alert(url+contenturl+refIdurl+typeurl+userIdurl+parentidurl+commentPictureIdLists);

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

                var mo=function(e){e.preventDefault();};//禁止页面滑动
                $('.rpbutton').unbind().click(function (e) {
                    if (device == "ios" || device == "android") {
                        $(e.target).attr("id");     // e.target表示被点击的目标
                        var $come = $(e.target).siblings(".key");//数据来自于
                        parentid = $come.find('.Id').text();
                        ft.isLogin(function (result) {
                            var errorcode = result.errorCode.toString();
                            // alert("errorcode："+errorcode);
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
                        window.location.href = "http://download.fotilestyle.com/?utm-source=share";
                        // var targetid=$(e.target).attr("id");     // e.target表示被点击的目标
                        // var $come = $(e.target).siblings(".key");//数据来自于
                        // parentid = $come.find('.Id').text();
                        // // alert(parentid);
                        // userid = 120520;
                        // $('#leave-words2').show();
                        // test(parentid, userid);
                    }
                });

                function test(parentid, userid) {
                    $("#leave-words2 .textarea").focus();//默认选中
                    document.body.style.overflow='hidden';//禁止页面滑动
                    document.addEventListener("touchmove",mo,false);//禁止页面滑动

                    $('#commit2').unbind().click(function (e) {
                        var words = $('#leave-words2');
                        var content = words.find('textarea').val().trim();
                        console.log(content);
                        if (!content) {
                            alert('请输入新评论');
                            e.preventDefault();
                            return;
                        }
                        //alert("refId:" + obj.refId + "type:" + obj.type + "userId:" + userid + "parentId:" + parentid);
                        var url = urlport + "comment/createGet?";
                        var contenturl = "content=" + content;
                        var refIdurl = "&refId=" + obj.refId;
                        var typeurl = "&type=" + obj.type;
                        var userIdurl = "&userId=" + userid;
                        var parentidurl = "&parentId=" + parentid;
                        //alert(url+contenturl+refIdurl+typeurl+userId+parentidurl);
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
                $('.review').unbind().click(function (e) {
                    var $soncomments = $(e.target).parent().find(".son-comments");//选中当前二级评论
                    if ($(e.target).text() !== "收起") {
                        $soncomments.not(".Noslide").css("display", "block");
                        $(e.target).text("收起");
                    } else if ($(e.target).text() == "收起") {
                        $soncomments.not(".Noslide").css("display", "none");
                        $(e.target).text("共" + $soncomments.length + "条回复")
                    }
                });

                /*是否出现删除按钮*/
                if (userid !== 1) {
                    console.log($(".userId :contains(" + userid + ")").text());
                    var $delete = $(".userId :contains(" + userid + ")");
                    var $nodelete1 = $(".otstatus :contains(2)");
                    var $nodelete2 = $(".status :contains(EBL)");
                    $delete.parent().parent().siblings(".delete").css("display", "inline-block");
                    $nodelete1.parent().parent().siblings(".delete").css("display", "none");
                    // $(".otstatus :contains(2)").parentsUntil(".boxright2").find(".text").text("此评论已被用户删除");
                    // $nodelete2.parent().parent().siblings(".delete").css("display","none");
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
                /*删除*/
                $('.delete').unbind().click(function (e) {
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
                if (userid !== 1 || cookstring!==null) {
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
                            console.log("111");
                            $.cookie('typecook', typecook);
                            $.cookie('idcook', idcook);
                        });
                    } else if (ispraise == "praisebg2") {
                        return;
                    }
                    $(this).unbind("click");
                });
            }

            function refresh(homeurl) {
                //alert(homeurl);
                window.location.href = homeurl;
                window.event.returnValue = false;
            }
        }

        $(window).off('scroll').on('scroll', $api.throttle(function () {
            var scrollTop = $(this).scrollTop();
            var scrollHeight = $(document).height();
            var windowHeight = $(this).height();
            // alert(scrollTop+","+scrollHeight+","+windowHeight);
            // alert(window.screen.height);
            if (scrollTop + windowHeight == scrollHeight) {
                if (isEmpty) return;
                pageNum = pageNum + 1;
                // alert(pageNum);
                loadComment(obj, pageNum);
            }
        }, 500))


    }


    $.loadComment = loadComment;
}();