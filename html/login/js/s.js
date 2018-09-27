/**
 * Created by syx on 15/11/30.
 */

/**
 * syx debug tools
 */

var Terminal = {
    platform : function(){
        var u = navigator.userAgent;
        return {
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
            iPhone: u.indexOf('iPhone') > -1 ,
            iPad: u.indexOf('iPad') > -1 ,
            windows: u.indexOf('Windows NT') > -1 ,
            mac: u.indexOf('Macintosh') > -1
        };
    }(),
    language : (navigator.browserLanguage || navigator.language).toLowerCase()
};

var apis = [
    'http://life.fotile.com/fotile-api-0.0.2',
    'http://fotilestyleapi.jingruigroup.com:8080/fotile-api-0.0.2',
    'http://192.168.199.112:8089/fotile',
    'http://192.168.2.164:8089/fotile',
    'http://121.40.135.115:8080/fotile-api-0.0.2'
];
var h5s = [
    'http://life.fotile.com/fotile-api-0.0.2/wx/',
    'http://fotilestyleapi.jingruigroup.com:8080/fotile-api-0.0.2/wx/',
    'http://192.168.199.111:503/wx/',
    'http://192.168.3.5:503/wx/',
];
var acs = [
    !(Terminal.platform.windows || Terminal.platform.mac),
    true,
    false
];
var AC_SERVER_API = apis[0];
var H5_SERVER_URL = h5s[0];
var ISAC = acs[1];
var ISDEBUG = false;
var INJAVA = false;

var STATIC_SERVER_URL = 'http://5t6y7u8i.oss-cn-hangzhou.aliyuncs.com/';
var VERSION = 'v340';

var _dstr = 's begin|';

jQuery.debug = {
    DEBUG:false,
    error:function() {console.error(arguments);},
    log : function() {console.log(arguments);},
    enableDebug:function() {
        this.DEBUG = true;
        return this;
    },
    disableDebug:function() {
        this.DEBUG = false;
        return this;
    },
    helpBtn : function(){
        if (!this.DEBUG) return this;
        var html = '<div style="text-align: center;display: block;position: fixed;bottom: 120px;right: 20px;width: 50px;height: 100px;border: 1px solid #ff0000;z-index: 999;"><div style="padding:18px 0 17px 0;" tapmode="active" onclick="window.location.reload();">刷新</div><div style="padding:18px 0 17px 0;" tapmode="active" onclick="$.JR.closeWin();">返回</div></div>';
        jQuery(document.body).append(html);
        return this;
    },
    weinre : function(is_target,weinre_target){
        if (!this.DEBUG) return this;
        var is_target = (is_target == null ? true : is_target);
        console.debug('syx weinre :',is_target,' on server:',weinre_target);
        if (is_target) (function(e){e.setAttribute("src",weinre_target);document.getElementsByTagName("body")[0].appendChild(e);})(document.createElement("script"));void(0);
        return this;
    },
    mockData : function(uri) {
        return {};
    }
};


jQuery.JR = {
    ENV : {
        WEIXIN : 1,
        AC : 2,
        WEB : 3
    },
    _env : 1,
    _engine : jQuery.wx,
    isWeixin : function() {return this._env == 1},
    isAC : function() {return this._env == 2},
    isWeb : function() {return this._env == 3},
    init : function(env) {
        this._env = env;
        if (env == this.ENV.WEIXIN) this._engine = jQuery.wx;
        else if (env == this.ENV.AC) this._engine = jQuery.ac;
        else if (env == this.ENV.WEB) this._engine = jQuery.web;
        else jQuery.debug.error('un know engine env:'+env);

        console.log('run engine',this._engine.name);
        jQuery.JR = jQuery.extend(jQuery.JR, this._engine);
        jQuery.JR.start();
        return this;
    },
    alert : function(data) {
        alert($.JR.jsonToStr(data));
    },
    H : function(uri) {
        return H5_SERVER_URL + uri;
    },
    S : function(uri) {
        if (uri && uri.indexOf('http://')==0) {
            return uri;
        } else {
            if (uri && uri != '') return STATIC_SERVER_URL + uri;
            else return '';
        }
    },
    initShopcount : function() {
        if (ISAC) {
            api.addEventListener({
                name: 'updateShopnumEvent'
            }, function(ret){
                $.JR.initShopcount();
            });
        }
        var count = $.JR.getShopCount();
        if (count > 0) $('.cart i').text(count).show();
        else $('.cart i').text(count).hide();
    },
    getShopCount : function() {
        var count = $.JR.getStorage('SHOPCARTNUM');
        if (count) return count;
        else return 0;
    },
    isArray : function(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    },
    addShopcart : function(cart) {
        var shopcart = $.JR.getStorage('SHOPCART');
        if (!$.JR.isArray(shopcart)) shopcart = [];
        var exsit = false, shopcartnum = 0, newshopcart=[];
        for(var i=0;i<shopcart.length;i++) {
            /*if (shopcart[i].type == cart.type && shopcart[i].id == cart.id) {
                shopcart[i].count ++;
                exsit = true;
            }
            if (shopcart[i].type != 'shop') {
                shopcartnum += shopcart[i].count;
                newshopcart.push(shopcart[i]);
            }
            if (shopcart[i].type == 'shop') {
                shopcart[i].count = 1;
            }*/

            if (shopcart[i].type != 'shop') {
                if (shopcart[i].type == cart.type && shopcart[i].id == cart.id) {
                    shopcart[i].count ++;
                    exsit = true;
                }
                shopcartnum += shopcart[i].count;
                newshopcart.push(shopcart[i]);
            } else {
                if (shopcart[i].type == cart.type && shopcart[i].id == cart.id) {
                    shopcart[i].count = 1;
                    newshopcart.push(shopcart[i]);
                    exsit = true;
                }
            }
        }

        if (!exsit) {
            shopcart.push(cart);
            newshopcart.push(cart);
            if (shopcart[i].type != 'shop') shopcartnum += cart.count;
        }
        $.JR.setStorage('SHOPCART', newshopcart);
        $.JR.setStorage('SHOPCARTNUM', shopcartnum);
        if (ISAC) {
            $.JR.sendEvent('updateShopnumEvent', {});
        }
    },
    checkFoodcart : function(id) {
        var foodcart = $.JR.getStorage('FOODCART');
        if (!foodcart) foodcart = {};
        if (foodcart[id]) return true;
        else return false;
    },
    delFoodcart : function(id) {
        var foodcart = $.JR.getStorage('FOODCART');
        if (!foodcart) foodcart = {};
        delete foodcart[id];
        $.JR.setStorage('FOODCART', foodcart);
    },
    addFoodcart : function(id, menuMaterials) {
        var foodcart = $.JR.getStorage('FOODCART');
        if (!foodcart) foodcart = {};
        foodcart[id] = menuMaterials;
        $.JR.setStorage('FOODCART', foodcart);
    },
    toggleFavorite : function(action, type, refid, favoriteType, func) {
        if ($.JR.needLogin()) return;
        var userid = $.JR.userid();
        if (action == 'add') {
            $.JR.jajax('/user/favorite.json', {
                    refid:refid,
                    favoriteType:favoriteType,
                    type:type,
                    userId:userid
                }, function(ret, iscache){
                    var data = ret.data;
                    console.log('/user/favorite.json', data);
                    if (data&&data.id > 0) {
                        func && func();
                    } else {
                        $.JR.tip('请稍后再试!');
                    }
                },function(error){
                    console.log(error);
                }
            );
        } else if(action == 'remove') {
            $.JR.jajax('/user/cancelFavorite.json', {
                    refid:refid,
                    favoriteType:favoriteType,
                    type:type,
                    userId:userid
                }, function(ret, iscache){
                    var data = ret.data;
                    console.log('/user/cancelFavorite.json', data);
                    if (ret.status==200) {
                        func && func();
                    } else {
                        $.JR.tip('请稍后再试!');
                    }
                },function(error){
                    console.log(error);
                }
            );
        }

    },
    checkFavorite : function (type, refid, favoriteType, func) {
        var userid = $.JR.userid();
        if (!userid) return;
        $.JR.jajax('/user/favoriteList.json', {
                refid:refid,
                favoriteType:favoriteType,
                type:type,
                userId:userid,
                pageNum:1,
                pageSize:10
            }, function(ret, iscache){
                var data = ret.data;
                console.log('/user/favoriteList.json', data);
                if (data.length > 0) {
                    func && func();
                }
            },function(error){
                console.log(error);
            }
        );
    },
    isAfter:function(endDate){
        var diff = endDate - new Date().getTime();
        if (diff>0) return true;
        else return false;
    },
    showLoading : function(){
        $('.spinner').fadeIn();
        $('.loading').fadeIn();
    },
    removeLoading : function (time){
        if (time && time > 0) {
            setTimeout(function(){
                $('.spinner').fadeOut(100);
                $('.loading').fadeOut(1000);
            }, time)
        }  else {
            $('.spinner').fadeOut(100);
            $('.loading').fadeOut(1000);
        }
    },
    showBacktop : function(show) {
        if (show) {
            $('#top').fadeIn(1000);
        } else {
            $('#top').fadeOut(1000);
        }
    },
    scrollTop :function (top) {
        $('html, body').animate({scrollTop:top}, 'slow');
    },
    _jrtiping : false,
    _jrtiptimer : null,
    jrtip : function(data,time) {
        $.JR._jrtiping = true;
        if(typeof data === 'object'){
            data =  JSON.stringify(data);
        }
        var tip = '<div class="basket" id="jrtip" style="display: none; margin-top: 20px;"><p id="jrtipp"></p></div>';
        if ($("#jrtip").length == 0) {
            $('body').append(tip);
        }
        if ($.JR._jrtiping) {
            $('#jrtipp').html(data + '<br/>' +$('#jrtipp').html());
        } else {
            $('#jrtipp').html(data );
        }
        $("#jrtip").animate({marginTop:"0",opacity:"show"},800);
        if ($.JR._jrtiptimer) clearTimeout($.JR._jrtiptimer);
        if (!time) time = 2000;
        $.JR._jrtiptimer = setTimeout(function(){
            $("#jrtip").animate({marginTop:"20px",opacity:"hide"},300,'linear', function(){
                $('#jrtipp').empty();
                $.JR._jrtiping = false;
            });
        },time);
    },
    openVideo : function(url) {
        alert('请在方太生活家app中播放视频!');
    }

};


jQuery.ac = {
    name : 'apicloud',
    _server_api : AC_SERVER_API,
    I : function(uri) { return this._server_api + uri;},
    start : function(){
        window.onerror = function(errorMessage, scriptURI, lineNumber,columnNumber,errorObj) {
            if (jQuery.debug.DEBUG){
                var error = '';
                error += "错误信息：" + errorMessage+'\r\n';
                error += "出错文件：" + scriptURI+'\r\n';
                error += "出错行号：" + lineNumber+'\r\n';
                error += "出错列号：" + columnNumber+'\r\n';
                error += "错误详情：" + errorObj+'\r\n';
                console.log(error);
                alert(error);
            }
        };
    },
    fixIos7Bar : function(el){
        if(!this.isElement(el)){
            console.warn('$api.fixIos7Bar Function need el param, el param must be DOM Element');
            return;
        }
        var strDM = api.systemType;
        if (strDM == 'ios') {
            var strSV = api.systemVersion;
            var numSV = parseInt(strSV,10);
            var fullScreen = api.fullScreen;
            var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
            if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
                el.style.paddingTop = '20px';
                return 20;
            }
        }
    },
    fixStatusBar : function(str){
        var header = $(str);
        var el = header.get(0);
        if(!this.isElement(el)){
            console.warn('$api.fixStatusBar Function need el param, el param must be DOM Element');
            return;
        }
        var sysType = api.systemType;
        if(sysType == 'ios'){
            return this.fixIos7Bar(el);
        }else if(sysType == 'android'){
            var ver = api.systemVersion;
            ver = parseFloat(ver);
            if(ver >= 4.4){
                el.style.paddingTop = '25px';
                return 25;
            }
        }
        return 0;
    },
    setStatusBarStyle : function(style) {
        api.setStatusBarStyle({style: style});
    },
    openWin:function(url,name, parArr){
        var delay = 0;
        if("ios" != api.systemType){
            delay = 300;
        }
        var slidBackEnabled = true;
        if (name == 'shoppingCart' || name == 'food') {
            slidBackEnabled = false;
        }
        var bounces = false;
        if (name == 'search' || name == 'new_http_link') {
            bounces = false;
        }
        _dstr += 'openWin begin|';
        api.openWin({
            name: name,
            //name: name+'_'+(new Date().getTime()),
            url: './'+url,
            pageParam: parArr,
            bounces: bounces,
            vScrollBarEnabled:true,
            hScrollBarEnabled:false,
            useWKWebView:false,
            slidBackEnabled:slidBackEnabled,
            reload: true,
            delay: delay
        });
    },
    closeWin : function(time) {
        $.JR.onPageEnd();
        if (time) {
            setTimeout(function(){api.closeWin();},time);
        } else {
            api.closeWin();
        }

    },
    toast : function(title, text, time){
        if(!this.isAC()){
            window.alert(text);
            return false;
        }
        var opts = {};
        var show = function(opts, time){
            api.showProgress(opts);
            setTimeout(function(){
                api.hideProgress();
            },time);
        };
        if(arguments.length === 1){
            var time = time || 500;
            if(typeof title === 'number'){
                time = title;
            }else{
                opts.title = title+'';
            }
            show(opts, time);
        }else if(arguments.length === 2){
            var time = time || 500;
            var text = text;
            if(typeof text === "number"){
                var tmp = text;
                time = tmp;
                text = null;
            }
            if(title){
                opts.title = title;
            }
            if(text){
                opts.text = text;
            }
            show(opts, time);
        }
        if(title){
            opts.title = title;
        }
        if(text){
            opts.text = text;
        }
        time = time || 500;
        show(opts, time);
    },
    getUrlParam:function (name,is) {
        if (!name) {
            return api.pageParam;
        }
        var pageParam = api.pageParam;
        return pageParam[name];
    },
    tip : function (msg,duration,locationIndex) {
        //0:top,1:middle,2:bottom
        var _msg = '';
        var _duration = 2000;
        var _locationIndex = '1';
        if (arguments.length > 0) _msg = msg;
        if (arguments.length > 1) _duration = duration;
        if (arguments.length > 2) _locationIndex = locationIndex;
        api.toast({
            msg: _msg,
            duration:_duration,
            location: _locationIndex == 0 ? 'top' : (_locationIndex == 1 ? 'middle' : 'bottom')
        });
    },
    showProgress : function(param) {
        var showProgress=false,progressTitle='',progressText='',progressModal=false;
        if (param.showProgress) {
            showProgress = param.showProgress;
            if (param.progressTitle) {
                progressTitle = param.progressTitle;
                delete param.progressTitle;
            }
            if (param.progressText) {
                progressText = param.progressText;
                delete param.progressText;
            }
            if (param.progressModal) {
                progressModal = param.progressModal;
                delete param.progressModal;
            }
            delete param.showProgress;
        }
        if (showProgress) {
            api.showProgress({
                style: 'default',
                animationType: 'fade',
                title: progressTitle,
                text: progressText,
                modal: progressModal
            });
        }
        return showProgress;
    },
    hideProgress : function() {
        api.hideProgress();
    },
    _jajax : function(uri, param, succ, error) {
        var showProgress = $.JR.showProgress(param);
        var request = {
            url: $.JR.I(uri),
            method: 'post',
            timeout: 30,
            dataType: 'json',
            charset: 'utf8bm4',
            returnAll:false,
            data: {values:param},
            headers:{'Content-Type':'application/x-www-form-urlencoded'}
        };
        //$.JR.alert(request);
        api.ajax(request,function(ret,err){
            //$.JR.alert(ret);
            if (showProgress) jQuery.JR.hideProgress();
            if (ret) {
                if (ret.status == 999) {
                    $.JR.logout();
                    $.JR.needLogin();
                } else if(ret.status == 900) {
                    $.JR.tip(ret.errorMessage);
                } else {
                    succ && succ(ret, false);
                }
            }else {
                if (showProgress) jQuery.JR.hideProgress();
                if (error) {
                    error(err);
                } else {
                    $.JR.tip('访问网络错误');
                }
            }
        });
    },
    logout : function() {
        $.JR.rmStorage('AUTH_USER');
    },
    confirm : function(title, msg, callback){
        api.confirm({
            title: title,
            msg: msg,
            buttons: ['确定', '取消']
        },function( ret, err ){
            if( ret ){
                if (ret.buttonIndex == 1) callback && callback();
            }
        });
    },
    needLogin : function(type) {//true:登录拦截,false:登录放行
        var AUTH_KEY = $.JR.getStorage('AUTH_USER');
        if (api.winName == 'root') type = 'cur';
        if (AUTH_KEY) {
            return false;
        } else {
            if (type == 'cur') {
                //兼容search android module的con_title_app.html过来请求
                if (api.frameName == 'class_food' ||api.frameName == 'class_teacher' ||api.frameName == 'class_class') {
                    type = '';
                }
            }
            $.JR.openWin(type=='cur'?'login.html':'../login.html', 'login', {title:'登录',frameUrl:'login.html', frameName:'login'});
        }
        return true;
    },
    needApp : function() {
        return false;
    },
    backToHome : function(time){
        if (time) {
            setTimeout(function(){
                api.closeToWin({name:'root'});
            }, time);
        } else {
            api.closeToWin({name:'root'});
        }
    },
    addEventHandle : function(name,func) {
        api.addEventListener({
            name: name
        }, function(ret, err){
             if(ret){
                 func && func(ret.value);
             }
        });
    },
    sendEvent : function(name,param) {
        api.sendEvent({
            name: name,
            extra: param
        });
    },
    initShare : function(param) {
        api.sendEvent({
            name: "initShare",
            extra: param
        });
    },

    _isRefreshHeader : false,
    initRefreshHeader : function(callback) {
        api.setCustomRefreshHeaderInfo({
            bgColor : '#fb4c4c',
            isScale: false,
            image : {
                pull : [
                    'widget://img/refresh/pull.png',
                    'widget://img/refresh/pull.png',
                    'widget://img/refresh/pull_end_image_frame_1.png',
                    'widget://img/refresh/pull_end_image_frame_2.png',
                    'widget://img/refresh/pull_end_image_frame_3.png',
                    'widget://img/refresh/pull_end_image_frame_4.png',
                    'widget://img/refresh/pull_end_image_frame_5.png',
                    'widget://img/refresh/pull_end_image_frame_6.png',
                    'widget://img/refresh/pull_end_image_frame_7.png',
                    'widget://img/refresh/pull_end_image_frame_8.png',
                    'widget://img/refresh/pull_end_image_frame_9.png',
                    'widget://img/refresh/pull_end_image_frame_10.png'
                ],
                load : [
                    'widget://img/refresh/refreshing_image_frame1.png',
                    'widget://img/refresh/refreshing_image_frame2.png',
                    'widget://img/refresh/refreshing_image_frame3.png',
                    'widget://img/refresh/refreshing_image_frame4.png',
                    'widget://img/refresh/refreshing_image_frame5.png',
                    'widget://img/refresh/refreshing_image_frame6.png',
                    'widget://img/refresh/refreshing_image_frame7.png',
                    'widget://img/refresh/refreshing_image_frame8.png',
                    'widget://img/refresh/refreshing_image_frame9.png',
                    'widget://img/refresh/refreshing_image_frame10.png',
                    'widget://img/refresh/refreshing_image_frame11.png',
                    'widget://img/refresh/refreshing_image_frame12.png',
                    'widget://img/refresh/refreshing_image_frame13.png',
                    'widget://img/refresh/refreshing_image_frame14.png',
                    'widget://img/refresh/refreshing_image_frame15.png',
                    'widget://img/refresh/refreshing_image_frame16.png',
                    'widget://img/refresh/refreshing_image_frame17.png',
                    'widget://img/refresh/refreshing_image_frame18.png',
                    'widget://img/refresh/refreshing_image_frame19.png',
                    'widget://img/refresh/refreshing_image_frame20.png'
                ]
            }
        }, function(ret, err) {
            if ($.JR._isRefreshHeader) {
                console.info('is RefreshHeader ing');
                return;
            }
            $.JR._isRefreshHeader = true;
            callback();
        });
    },
    doneRefreshHeader : function() {
        $.JR._isRefreshHeader = false;
        api.refreshHeaderLoadDone()
    },
    _isScrollbottom : false,
    initScrollbottom : function(callback,param) {
        api.addEventListener({
            name:'scrolltobottom',
            extra:{
                threshold:40
            }
        },function(ret,err){
            if ($.JR._isScrollbottom) {
                console.log('is Scrollbottom ing');
                return;
            }
            $.JR._isScrollbottom = true;
            callback(ret, err);
        });
    },
    doneScrollbottom : function() {
        $.JR._isScrollbottom = false;
    },
    call : function(tel) {
        api.call({
            type: 'tel_prompt',
            number: tel
        });
    },
    _pageTitle: '默认',
    initUmeng:function(title){
        $.JR._pageTitle = title;
        api.addEventListener({
            name : 'pause'
        }, function(ret, err) {
            $.JR.onPageEnd();
        });
        api.addEventListener({
            name : 'resume'
        }, function(ret, err) {
            $.JR.onPageStart();
        });
        // iOS手势关闭页面时结束自定义页面统计
        api.addEventListener({
            name: 'viewdisappear'
        }, function(ret, err) {
            $.JR.onPageEnd();
        });
        /*api.addEventListener({
            name:'viewappear'
        }, function(ret, err){
           $.JR.onPageStart();
        });*/
        // Android按返回键关闭页面时结束自定义页面统计
        api.addEventListener({
            name: 'keyback'
        }, function(ret, err) {
            $.JR.closeWin();
        });
        $.JR.onPageStart();
    },
    onPageStart : function() {
        var umengAnalytics = api.require('umengAnalytics');
        if (!umengAnalytics) return;
        umengAnalytics.onPageStart({pageName: $.JR._pageTitle}, function(ret, err) {
            //alert( $.JR._pageTitle+'page start');
        });
    },
    onPageEnd : function() {
        //$.JR.sendEvent('umengPageEnd', {pageName: $.JR._pageTitle});
        var umengAnalytics = api.require('umengAnalytics');
        if (!umengAnalytics||$.JR._pageTitle=='默认') return;
        umengAnalytics.onPageEnd({pageName: $.JR._pageTitle}, function(ret, err) {
            //alert( $.JR._pageTitle+'page end');
        });
    },
    checkThirdIntalled:function(wxcallback, qqcallback) {
        if (wxcallback) {
            var wx = api.require('wx');
            wx.isInstalled(function(ret, err){
                if(ret.installed){
                    wxcallback();
                }else{

                }
            });
        }
        if (qqcallback) {
            var qq = api.require('qq');
            qq.installed(function(ret,err){
                if(ret.status){
                    qqcallback();
                }else{
                }
            });
        }
    },
    openVideo : function(url, callback) {
        if (api.systemType != 'ios') {
            api.openVideo({
                url: url
            });
        } else {
            var jrfotilestyle = api.require('jrfotilestyle');
            jrfotilestyle.avplayer({
                video : url,
                fixedOn:api.frameName
            },function(ret,err){
                callback && callback();
            });
        }
    },
    sendIDFA : function(){
        if (api.systemType == 'ios') {
            var jrfotilestyle = api.require('jrfotilestyle');
            jrfotilestyle.idfa({},function(ret,err){
                $.JR.jajax('/activity/idfaAdd.json', {
                    idfa:ret.idfa
                },function(ret, iscache){},function(ret, iscache){});
            });
        }
    },
    initWeixin : function(){
    },
    wifiWarning : function(callback){
        if (api.connectionType != 'wifi') {
            api.confirm({
                title: '提醒',
                msg: '您当前处于非Wifi环境下，继续播放会产生数据流量，是否继续？',
                buttons: ['继续播放', '取消']
            },function( ret, err ){
                if( ret ){
                    if (ret.buttonIndex == 1) {
                        callback && callback();
                    }
                }
            });
        } else {
            callback && callback();
        }
    }

};
jQuery.wx = {
    name : 'weixin',
    _contentPath : INJAVA ? '/fotile-api-0.0.2/wx' : '/wx',
    I : function(uri) { return INJAVA ? ('/fotile-api-0.0.2'+uri) : '/wx/client/index.php';},
    start : function() {
        $('.topbar .back').hide();
        window.alert = function(name){
            var iframe = document.createElement("IFRAME");
            iframe.style.display="none";
            iframe.setAttribute("src", 'data:text/plain,');
            document.documentElement.appendChild(iframe);
            window.frames[0].window.alert(name);
            iframe.parentNode.removeChild(iframe);
        };
        window.api = {
            wexinmode:true,
            systemType:'ios',
            systemVersion:'7',
            iOS7StatusBarAppearance:true,
            fullScreen:false,
            connectionType : 'wifi',
            pageParam : {},
            openFrame:function(){},
            require : function(){return {open:function(){}}},
            setRefreshHeaderInfo:function(){},
            refreshHeaderLoadDone:function(){},
            addEventListener:function(){},
            parseTapmode:function(){},
            setFrameAttr:function(){},
            setFrameGroupAttr:function(){},
            ajax:function(){},
            removeLaunchView: function () {console.log('removeLaunchView')},
            sendEvent:function(name,parr){console.log('api.sendEvent', name, parr);}
        };
        console.info('init api object : ', api);
//        window.onerror = function(errorMessage, scriptURI, lineNumber,columnNumber,errorObj) {
//            if (jQuery.debug.DEBUG){
//                var error = '';
//                error += "错误信息：" + errorMessage+'\r\n';
//                error += "出错文件：" + scriptURI+'\r\n';
//                error += "出错行号：" + lineNumber+'\r\n';
//                error += "出错列号：" + columnNumber+'\r\n';
//                error += "错误详情：" + errorObj+'\r\n';
//                alert(error);
//            } else {
//                console.log(error);
//            }
//        };
    },
    fixIos7Bar : function(el){
    },
    fixStatusBar : function(str){
    },
    setStatusBarStyle : function(style) {
    },
    openWin : function(url,name,parArr){
        if (parArr.frameName) {
            delete parArr.frameName;
        }
        var frameUrl = parArr.frameUrl;
        delete parArr.frameUrl;
        delete parArr.title;
        var sep = '?';
        if (frameUrl.indexOf('?')>0) {
            sep = '&';
        }
        if (frameUrl.indexOf('http') >= 0) {
            window.location.href = frameUrl+sep+ $.param(parArr);
        } else {
            window.location.href = jQuery.wx._contentPath+'/html/'+frameUrl+sep+ $.param(parArr);
        }
        return false;
    },
    closeWin : function(time) {
        window.history.back();
    },
    backToHome : function(time) {
        var home = jQuery.wx._contentPath + '/html/home.html';
        setTimeout(function(){
            window.location.href = home;
        },time)
    },
    showProgress : function(param) {
        var showProgress=false,progressTitle='',progressText='',progressModal=false;
        if (param.showProgress) {
            showProgress = param.showProgress;
            if (param.progressTitle) {
                progressTitle = param.progressTitle;
                delete param.progressTitle;
            }
            if (param.progressText) {
                progressText = param.progressText;
                delete param.progressText;
            }
            if (param.progressModal) {
                progressModal = param.progressModal;
                delete param.progressModal;
            }
            delete param.showProgress;
        }
        if (showProgress) {
        }
        return showProgress;
    },
    hideProgress : function() {
    },
    _jajax : function(uri, param, succ, error) {
        var showProgress = $.JR.showProgress(param);
        param['uri'] = uri;
        $.ajax({
            type:'post',
            dataType:'json',
            data:param,
            url: $.JR.I(uri),
            success:function(data){
                if (showProgress) jQuery.JR.hideProgress();
                if (data.status == 999) {
                    $.JR.logout();
                    //$.JR.needLogin();
                } else if(data.status == 900) {
                    $.JR.tip(data.errorMessage);
                } else  {
                    succ && succ(data,false);
                }
            },
            error:function(err){
                if (showProgress) jQuery.JR.hideProgress();
                if (error) {
                    error(err);
                } else {
                    $.JR.tip('访问网络错误');
                }
            }
        });
    },
    getUrlParam:function (name,is) {
        if (!name) {
            return $.JR.UrlParamToArray();
        }
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (!results)  {
            return null;
        }
        return decodeURIComponent(results[1]) || null;
    },
    tip : function (msg,duration,locationIndex) {
        console.log(msg);
        window.alert(msg);
        return false;
    },
    logout : function() {
        console.log('logout AUTH_USER');
        $.JR.rmStorage('AUTH_USER');
    },
    needLogin : function() {//true:登录拦截,false:登录放行
        var AUTH_KEY = $.JR.getStorage('AUTH_USER');
        if (AUTH_KEY) {
            return false;
        } else {
            $.JR.setStorage('back_url', window.location.href);
            window.location.href = jQuery.wx._contentPath+'/html/login.html';
        }
        return true;
    },
    needApp : function(){
        if (ISDEBUG) {
            return false;
        } else {
            alert('请在方太生活家App中操作!');
            return true;
        }
    },
    confirm : function(title, msg, callback){
        if (ISAC) {
            api.confirm({
                title: title,
                msg: msg,
                buttons: ['确定', '取消']
            }, function(ret, err){
                var index = ret.buttonIndex;
                if (index == 1) {
                    callback && callback();
                }
            });
        } else {
            if (window.confirm(msg)) {
                callback && callback();
            }
        }

    },
    addEventHandle : function(name,func) {
        console.log('addEventHandle');
    },
    sendEvent : function(name,param) {
        console.log('sendEvent');
    },
    initShare : function(param) {
        var shareData = {
            sharetitle : '方太生活家',
            sharelink : 'http://www.fotilestyle.com',
            sharedesc : '我们和您一起倡导健康、环保、有品位、有文化的生活方式，共同鼓励和启发人们更经常的在家做饭，助力您和家人每天生活更健康。扫码加入方太生活家，分享生活味道。你，就是生活家！',
            shareimgUrl : $.JR.H('/img/logo180.png')
        };
        shareData = $.extend({},shareData, param);
        shareData.shareimgUrl = shareData.shareimgUrl.replace(/widget:\//ig,H5_SERVER_URL);
        jingruiInitShare && jingruiInitShare(shareData.sharetitle, shareData.sharelink, shareData.sharedesc, shareData.shareimgUrl);
        console.log('initShare', shareData);
    },
    initRefreshHeader : function(){console.log('initRefreshHeader');},
    doneRefreshHeader : function(){console.log('doneRefreshHeader');},
    initScrollbottom : function(){console.log('initScrollbottom');},
    doneScrollbottom : function(){console.log('doneScrollbottom');},
    call : function(tel) {
        window.location.href = 'tel:'+tel;
    },
    initUmeng:function(title){
        console.log('initUmeng', title);
    },
    checkThirdIntalled : function(){
        console.log('checkThirdIntalled');
    },
    sendIDFA : function(){
        console.log('sendIDFA');
    },
    initWeixin : function() {
        $('body').append('<div class="addDown"><div class="downTxt"><a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.fq.android.fangtai" class="more">查看更多</a><b class="icon"></b><div class="txt"><b>方太生活家</b><p>不止于美食和菜谱，更有生活方式！</p></div></div></div>');
        setTimeout(function(){
            $('#footeraction .banner').css('margin-bottom','60px');
            $('body').css('padding-bottom','60px');
        },1000);
    },
    wifiWarning : function(callback){
        console.log('wifiWarning not support');
    }
};
jQuery.web = {
    name : 'web'
};


;(function($){
    jQuery.JR = $.extend(jQuery.JR, {
        isElement : function(obj){
            return !!(obj && obj.nodeType == 1);
        },
        isPhoneNumber:function(tel){
             var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
             return reg.test(tel)
        },
        isSupportSticky : function() {
            var prefixTestList = ['', '-webkit-', '-ms-', '-moz-', '-o-'];
            var stickyText = '';
            for (var i = 0; i < prefixTestList.length; i++ ) {
                stickyText += 'position:' + prefixTestList[i] + 'sticky;';
            }
            // 创建一个dom来检查
            var div = document.createElement('div');
            var body = document.body;
            div.style.cssText = 'display:none;' + stickyText;
            body.appendChild(div);
            var isSupport = /sticky/i.test(window.getComputedStyle(div).position);
            body.removeChild(div);
            div = null;
            return isSupport;
        },
        jsonToStr : function(json){
            if(typeof json === 'object'){
                return JSON && JSON.stringify(json);
            }
        },
        strToJson : function(str){
            if(typeof str === 'string'){
                return JSON && JSON.parse(str);
            }
        },
        isLocalStorageNameSupported:function() {
          var testKey = 'test', storage = window.localStorage;
          try {
            storage.setItem(testKey, '1');
            storage.removeItem(testKey);
            return true;
          } catch (error) {
            return false;
          }
        },
        uzStorage : function(){
            if (!this.isLocalStorageNameSupported()) return false;
            var ls = window.localStorage;
            var isAndroid = (/android/gi).test(navigator.appVersion);
            if(isAndroid){
               //ls = os.localStorage();
            }
            return ls;
        },
        setStorage : function(key, value){
            if(arguments.length === 2){
                var v = value;
                if(typeof v == 'object'){
                    v = JSON.stringify(v);
                    v = 'obj-'+ v;
                }else{
                    v = 'str-'+ v;
                }
                var ls = jQuery.JR.uzStorage();
                if(ls){
                    ls.setItem(key, v);
                }
            }
        },
        getStorage : function(key){
            var ls = this.uzStorage();
            if(ls){
                var v = ls.getItem(key);
                if(!v){return;}
                if(v.indexOf('obj-') === 0){
                    v = v.slice(4);
                    return JSON.parse(v);
                }else if(v.indexOf('str-') === 0){
                    return v.slice(4);
                }
            }
            return "";
        },
        rmStorage : function(key){
            var ls = this.uzStorage();
            if(ls && key){
                ls.removeItem(key);
            }
        },
        clearStorage : function(){
            var ls = this.uzStorage();
            if(ls){
                ls.clear();
            }
        },
        UrlParamToArray:function(url){
            if (!url) url = window.location.href;
            var paraString = url.substring(url.indexOf("?")+1,url.length).split("&");
            var paraObj = {} ;
            var j = 0,i=0;
            for (i=0; j=paraString[i]; i++){
                paraObj[j.substring(0,j.indexOf("=")).toLowerCase()] = j.substring(j.indexOf("=")+1,j.length);
            }
            return paraObj;
        },
        runFun : function(funName, param) {
            var fun = new Function('param',funName+'(param)');
            fun(param);
        },
        jajax : function(uri, param, succ, error, cache, focusCache) {
            if ($.JR.userid()>0) {
                param = $.extend(param, {
                    'userId' : $.JR.userid(),
                    'token' : $.JR.token()
                });
            }
            if (cache) {
                var focus = false;
                if (focusCache) focus = true;
                $.JR.cacheData(uri, focus, function(handler){
                    $.JR._jajax(uri, param, handler, error);
                },function(data, iscachedata){
                    succ(data,iscachedata);
                });
            } else {
                $.JR._jajax(uri, param, succ, error);
            }
        },
        focusCache : false,
        cacheData: function (cacheKey, focuscache, newDataFun, dataFun) {
            var cache = $.JR.getStorage(cacheKey);
            if (cache && cache != '') {
                try {
                    dataFun(cache, true);
                }
                catch(e) {
                }
                if (!focuscache) {
                    newDataFun(function(data){
                        $.JR.setStorage(cacheKey, data);
                        dataFun(data, false);
                    });
                }
            } else {
                newDataFun(function(data){
                    $.JR.setStorage(cacheKey, data);
                    dataFun(data, false);
                });
            }
        },
        setUser : function(user){
            $.JR.rmStorage('AUTH_USER');
            $.JR.setStorage('AUTH_USER', user);
        },
        setUserInfo : function(info) {
            $.JR.rmStorage('AUTH_USER_INFO');
            $.JR.setStorage('AUTH_USER_INFO', info);
        },
        userid : function() {
            var user = $.JR.user();
            if($.JR.user()) {
                return user.id;
            } else {
                return 0;
            }
        },
        token : function(){
            var user = $.JR.user();
            if($.JR.user()) {
                return user.token;
            } else {
                return '';
            }
        },
        userInfo : function(){
            var AUTH_USER_INFO = $.JR.getStorage('AUTH_USER_INFO');
            if (!AUTH_USER_INFO) {
                return false;
            } else {
                return AUTH_USER_INFO;
            }
        },
        user : function(){
            var AUTH_KEY = $.JR.getStorage('AUTH_USER');
            if (!AUTH_KEY) {
                return false;
            } else {
                return AUTH_KEY;
            }
        },
        tapmode : function () {
            api.parseTapmode();
        },
        serialize:function(obj){
            var result = [];
            for(var p in obj){
                result.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
            }
            return result.join('&')
        },
        addCSS: function(cssText){
            var style = document.createElement('style'),  //创建一个style元素
                head = document.head || document.getElementsByTagName('head')[0]; //获取head元素
            style.type = 'text/css'; //这里必须显示设置style元素的type属性为text/css，否则在ie中不起作用
            if(style.styleSheet){ //IE
                var func = function(){
                    try{ //防止IE中stylesheet数量超过限制而发生错误
                        style.styleSheet.cssText = cssText;
                    }catch(e){
                    }
                }
                //如果当前styleSheet还不能用，则放到异步中则行
                if(style.styleSheet.disabled){
                    setTimeout(func,10);
                }else{
                    func();
                }
            }else{ //w3c
                //w3c浏览器中只要创建文本节点插入到style元素中就行了
                var textNode = document.createTextNode(cssText);
                style.appendChild(textNode);
            }
            head.appendChild(style); //把创建的style元素插入到head中
        },
        openTarget : function(type, link, title, level) {
            if (type == 0) {
                if (link && link.indexOf('http')==0) {
                    $.JR.openWin(level=='cur'?'con_title.html':'../con_title.html', 'new_http_link',{'title':title,frameUrl:link,frameName:'new_http_link'})
                } else if (link.indexOf('xialingyin')==0) {
                    $.JR.openWin(level=='cur'?'con_title.html':'../con_title.html', 'new_http_link',{'title':title,frameUrl:'../h5/xln/index.html',frameName:'h5_no_header'})
                } else {
                    $.JR.tip('无相关页面!');
                }
            } else if (type == 7) {
                if ($.JR.needLogin(level)) return;
                $.JR.openWin(level=='cur'?'con_title.html':'../con_title.html', 'addmenu', {'title':'提交菜谱',frameUrl:'./recipes.html',frameName:'addmenu'})
            } else {
                var type2html = {
                    '1' : ['class/class.html',{frameName:'class_class'},'id'],
                    '2' : ['class/food.html',{frameName:'class_food'},'id'],
                    '3' : ['new/detail.html',{frameName:'new_detail'},'id'],
                    '4' : ['store/detail.html',{frameName:'store_detail'},'id'],
                    '5' : ['class/shop.html',{frameName:'class_shop'},'id'],
                    '6' : ['class/teacher.html',{frameName:'class_teacher'},'id'],
                    '8' : ['list/class.html',{frameName:'list_class'},'id'],
                    '9' : ['list/food.html',{frameName:'list_food'},'id'],
                    '10' : ['list/store.html',{frameName:'list_store'},'id']
                };
                var arrs = type2html[type];
                if (arrs) {
                    if (!link) {
                        $.JR.tip('无相关数据!');
                        return;
                    }
                    var frameArr = $.extend(arrs[1], {'title':title,frameUrl:arrs[0]});
                    frameArr[arrs[2]] = link;
                    console.log(frameArr);
                    $.JR.openWin(level=='cur'?'con_title.html':'../con_title.html', 'new_link',frameArr)
                }
            }
        }

    });
})(jQuery);


window.apiready = function() {
    _dstr += 's apiready begin|';
    if (ISDEBUG)jQuery.debug.enableDebug().helpBtn();
    jQuery.JR.init(ISAC?jQuery.JR.ENV.AC:jQuery.JR.ENV.WEIXIN);
    _dstr += 's apiready end|';
    jQuery.holdReady(false);
    $.JR.tapmode();
    setTimeout(function(){
        $.JR.tapmode();
    },2000);
};

if (ISAC) {
    jQuery.holdReady(true);
    var appcss = $('#appcss');
    appcss.removeAttr('disabled');
} else {
    var appcss = $('#appcss');
    appcss.attr('disabled', 'disabled');
    if (ISDEBUG)jQuery.debug.enableDebug().helpBtn();
    jQuery.JR.init(ISAC?jQuery.JR.ENV.AC:jQuery.JR.ENV.WEIXIN)
    $('footer').show()
}

setTimeout(function(){
    $.JR.removeLoading();
},10000);

_dstr += 's end|';