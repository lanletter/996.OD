!function(){

/*********************************************************************
 *                           全局变量和方法                                 *
 **********************************************************************/
var callbacks = {};
var ua = window.navigator.userAgent;
var oproto = Object.prototype;

var ohasOwn = oproto.hasOwnProperty;
var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/;
var serialize = oproto.toString
var class2type = {}
// TODO精确性待改进
var ANDROID = /android/i.test(ua);
var IOS = /iphone|ipad/i.test(ua);
var WP = /windows phone/i.test(ua);
var noop = function () {};

//ANDROID = 0; IOS = 1;

/**
 * 方便在各个平台中看到完整的log
 */
function log() {
    // http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
    Function.apply.call(console.log, console, arguments)
}

//生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
var generateID = window.performance && performance.now? function() {
    return ("lb" + performance.now() + performance.now()).replace(/\./g, "")
} : function() {
    return ("lb" + Math.random() + Math.random()).replace(/0\./g, "")
}


/*********************************************************************
 *                           lb初始化                                 *
 **********************************************************************/
lb = function(el) {
    return new lb.init(el)
};

lb.init = function (el) {
    this[0] = this.element = el
};

lb.fn = lb.prototype = lb.init.prototype;

//取得目标的类型
lb.type = function (obj) {
    if (obj == null) {
        return String(obj)
    }

    return typeof obj === "object" || typeof obj === "function" ?
    class2type[serialize.call(obj)] || "object" :
        typeof obj
};

lb.mix = lb.fn.mix = function () {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[0] || {},
        i = 1,
        length = arguments.length,
        deep = false

    // 如果第一个参数为布尔,判定是否深拷贝
    if (typeof target === "boolean") {
        deep = target
        target = arguments[1] || {}
        i++
    }

    //确保接受方为一个复杂的数据类型
    if (typeof target !== "object" && !isFunction(target)) {
        target = {}
    }

    //如果只有一个参数，那么新成员添加于mix所在的对象上
    if (i === length) {
        target = this
        i--
    }

    for (; i < length; i++) {
        //只处理非空参数
        if ((options = arguments[i]) != null) {
            for (name in options) {
                src = target[name]
                try {
                    copy = options[name] //当options为VBS对象时报错
                } catch (e) {
                    continue
                }

                // 防止环引用
                if (target === copy) {
                    continue
                }
                if (deep && copy && (lb.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

                    if (copyIsArray) {
                        copyIsArray = false
                        clone = src && Array.isArray(src) ? src : []

                    } else {
                        clone = src && lb.isPlainObject(src) ? src : {}
                    }

                    target[name] = lb.mix(deep, clone, copy)
                } else if (copy !== void 0) {
                    target[name] = copy
                }
            }
        }
    }
    return target
}

var isFunction = typeof alert === "object" ? function(fn) {
    try {
        return /^\s*\bfunction\b/.test(fn + "")
    } catch (e) {
        return false
    }
} : function(fn) {
    return serialize.call(fn) == "[object Function]"
}
lb.isFunction = isFunction
lb.isWindow = function(obj) {
    if (!obj)
        return false
    return obj == obj.document && obj.document != obj
}

function isWindow(obj) {
    return rwindow.test(serialize.call(obj))
}
if (isWindow(window)) {
    lb.isWindow = isWindow
}

var enu;
for (enu in lb({})) {
    break
}
var enumerateBUG = enu !== "0";

//是否为一个原始对象
lb.isPlainObject = function(obj, key) {
    if (!obj || lb.type(obj) !== "object" || obj.nodeType || lb.isWindow(obj)) {
        return false;
    }
    try {
        if (obj.constructor && !ohasOwn.call(obj, "constructor") && !ohasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
            return false;
        }
    } catch (e) {
        return false;
    }
    if (enumerateBUG) {
        for (key in obj) {
            return ohasOwn.call(obj, key)
        }
    }
    for (key in obj) {
    }
    return key === void 0 || ohasOwn.call(obj, key);
};



/*********************************************************************
 *                           配置系统                                 *
 **********************************************************************/


var config = {
    camera :{
        name : "camera",
        callbackId : generateID(),
        callback : noop
    },
    qrcode : {
        name : "qrcode",
        callbackId : generateID(),
        callback : noop
    },
    barcode : {
        name : "barcode",
        callbackId : generateID(),
        callback : noop
    },
    qrcodeImage : {
        name : "qrcodeImage",
        callbackId : generateID(),
        callback : noop
    },
    tel :{
        name : "tel",
        param:{
            text: ""
        },
        callbackId : generateID(),
        callback : noop
    },
    email :{
        name : "email",
        param:{
            receiver : [],
            cc : [],
            text : "",
            title : ""
        },
        callbackId : generateID(),
        callback : noop
    },
    sms :{
        name : "sms",
        param:{
            text:"",
            tel : ""
        },
        callbackId : generateID(),
        callback : noop
    },
    geolocation:{
        name : "geolocation",
        callbackId : generateID(),
        callback : noop
    },
    dialog:{
        name : "dialog",
        param : {
            title : "",
            text :"",
            btnArray : [ {
                ok : "确定"
            } ,{
                cancel : "取消"
            }]

        },
        callbackId : generateID(),
        callback : noop
    },
    toast :{
        name : "toast",
        param : {
            text : ""
        },
        callbackId : generateID(),
        callback : noop
    },
    loading:{
        name : "loading",
        param : {
            text : "",
            open : true
        },
        callbackId : generateID(),
        callback : noop
    },
    userInfo : {
        name : "userInfo",
        callbackId : generateID(),
        callback : noop
    },
    appInfo : {
        name : "appInfo",
        callbackId : generateID(),
        callback : noop
    },
    redirect : {
        name : "redirect",
        param : {
            text : ""
        },
        callbackId : generateID(),
        callback : noop
    },
    alipay : {
    name : "alipay",
        param : {
        userId : "",
            orderId : "",
            orderPrice : ""
    },
    callbackId : generateID(),
        callback : noop
},
    shareInfo:{
        name : "shareInfo",
        param : {
            url : "",
            title : "",
            content : "",
            imgUrl:""
        },
        callbackId : generateID(),
        callback : noop
    },
    userInfoCXJ:{
        name : "userInfoCXJ",
        callbackId : generateID(),
        callback : noop
    },
    carInfo:{
        name : "carInfo",
        param : {
            text : ""
        },
        callbackId : generateID(),
        callback : noop
    },
    pay : {
        name : "checkoutcounter",
        param : {
            partner:"",
            orderId:"",
            txnAmount:"",
            mdseName:"",
            body:"",
            returnUrl:"",
            notifyUrl:"",
            finishUrl:"",
            timeout:"",
            sign:"",
            terminalType:"",
            storeId:""
        },
        callbackId : generateID(),
        callback : noop
    },
    domain:{
        name : "domain",
        callbackId : generateID(),
        callback : noop
    },
};



/*********************************************************************
 *                           js bridge                                 *
 **********************************************************************/
function encode( opts ){
    if( typeof opts === "object" ){
        for(var p in opts){
            if( typeof opts[p] === "object" ){
                opts[p] = encode( opts[p] )
            }else if (Array.isArray(opts[p])){
                for( var i=0 ; i < opts[p].length ; i++ ){
                    if( typeof opts[p][i] === "object" ){
                        opts[p][i] = encode( opts[p][i] )
                    }else{
                        opts[p][i] = encodeURIComponent( opts[p][i] )
                    }
                }
            }else{
                opts[p] = encodeURIComponent(opts[p])
            }
        }
    }else{
        lb.log("不是有效的对象")
    }
    return opts;
}
function invoke(cmd) {
    log('invoke:', cmd);
    window.location.href = 'lb://' + encodeURIComponent(cmd);
}
var callbackVersion = {};
function checkVersion(){
    try{
        var J_ua = JSON.parse(ua);
        var appcode = J_ua.appCode,
            appversion = J_ua.appVersion;
        if(appcode&&appcode=="MongoToC"){
            if(appversion){
                var ava = appversion.split(".");
                if(parseInt(ava[0]) >= 3){
                    callbackVersion = {"s":true,"appcode":appcode,"appversion":appversion}
                }else {
                    callbackVersion = {"s":false,"appcode":appcode,"appversion":appversion}
                }
            }else{
                callbackVersion = {"s":false,"appcode":appcode,"appversion":appversion}
            }
        }else if(appcode&&appcode=="LightBundleDemo"){
            callbackVersion = {"s":true,"appcode":appcode,"appversion":appversion}
        }else{
            callbackVersion = {"s":false,"appcode":appcode,"appversion":appversion}
        }
        return callbackVersion;
    }catch(e) {
        log(ua);
        return callbackVersion;
    }
}

function callByJS(opt) {
        var input = {};
        input.name = opt.name;
        input.callbackId = generateID();
        input.param = opt.param || {};
        callbacks[input.callbackId] = opt.callback;
        var s = checkVersion().s?"支持":"不支持",
            appcode = checkVersion().appcode?checkVersion().appcode:"未定义",
            appversion =checkVersion().appversion?checkVersion().appversion:"未定义";
        if(checkVersion().s){
            //log("该版本"+s+"此功能(appcode:"+appcode+",appversion:"+appversion+")")
            invoke(JSON.stringify(encode(input)));
        }else {
            log(s+',invoke:',JSON.stringify(encode(input)));
            var randomId = generateID();
            callbacks[randomId] = opt.callback;
            callByNative( {
                callbackId : randomId,
                result:{
                    errorCode : "-2",
                    msg : "该版本"+s+"此功能(appcode:"+appcode+",appversion:"+appversion+")"
                }
            })
        }
    }
function callByNative (opt) {
    var callback = callbacks[opt.callbackId];
    var result = opt.result || {};
    var script = opt.script || '';

    // Native主动调用Web
    if (script) {
        log('callByNative script', script);
        try {
            invoke(JSON.stringify({
                callbackId: opt.callbackId,
                result: eval(script)
            }));
        } catch (e) {
            console.error(e);
        }
    }
    // Web主动调用Native，Native被动响应
    else if (callback) {
        callback(result);
        try {
            delete callback;
            log(callbacks);
        } catch (e) {
            console.error(e);
        }
    }
}
lb.callByJS = callByJS;
lb.callByNative = callByNative;
lb.log = log;

/*********************************************************************
 *                           相机调用                                 *
 **********************************************************************/
lb.camera = function (fn) {
    var cameraConfig = lb.mix( true,{},config.camera );
    cameraConfig.callback =  fn;
    callByJS( cameraConfig);
}
/*********************************************************************
 *                           对话框                                 *
 **********************************************************************/
lb.dialog = function (setting , fn) {
    var dialogConfig = lb.mix( true,{},config.dialog);
    dialogConfig.param.title = setting.title ||  "";
    dialogConfig.param.text = setting.text || "";
    dialogConfig.param.btnArray = setting.btnArray || [];
    dialogConfig.callback =  fn;
    callByJS( dialogConfig );
}
/*********************************************************************
 *                           email调用                                 *
 **********************************************************************/
lb.email = function (setting , fn) {
    var emailConfig = lb.mix( true,{},config.email );
    emailConfig.param.receiver = setting.receiver || [];
    emailConfig.param.cc = setting.cc || [];
    emailConfig.param.text = setting.text || "";
    emailConfig.param.title = setting.title || "";
    emailConfig.callback =  fn;
    callByJS( emailConfig);
}
/*********************************************************************
 *                           地理位置调用                                 *
 **********************************************************************/
lb.geolocation = function (fn) {
    var geolocationConfig = lb.mix( true,{},config.geolocation );
    geolocationConfig.callback =  fn;
    callByJS( geolocationConfig);
}
/*********************************************************************
 *                           loading框调用                                 *
 **********************************************************************/
lb.loading = function (setting , fn) {
    var loadingConfig = lb.mix( true,{},config.loading);
    loadingConfig.param.open = setting.open;
    loadingConfig.param.text = setting.text || "";
    loadingConfig.callback = fn
    callByJS(loadingConfig)
}
/*********************************************************************
 *                           二维码调用                                 *
 **********************************************************************/
lb.qrcode = function (fn) {
    var qrConfig = lb.mix( true,{},config.qrcode);
    qrConfig.callback = fn;
    callByJS(qrConfig)
}
/*********************************************************************
 *                           二维码图片调用                                 *
 **********************************************************************/
lb.qrcodeImage = function (fn) {
    var qrImageConfig = lb.mix( true,{},config.qrcodeImage);
    qrImageConfig.callback = fn;
    callByJS(qrImageConfig)
}
/*********************************************************************
 *                           短信调用                                 *
 **********************************************************************/
lb.sms = function (setting , fn) {
    var smsConfig = lb.mix( true,{},config.sms);
    smsConfig.param.text = setting.text || "";
    smsConfig.param.tel = setting.tel || "";
    smsConfig.callback = fn;
    callByJS(smsConfig);
}
/*********************************************************************
 *                           电话调用                                 *
 **********************************************************************/
lb.tel = function (text , fn) {
    var telConfig = lb.mix( true,{},config.tel );
    telConfig.param.text = text;
    telConfig.callback =  fn;
    callByJS( telConfig);
}
/*********************************************************************
 *                          toast调用                                 *
 **********************************************************************/
lb.toast = function (opt , fn) {
    var toastConfig = lb.mix( true,{},config.toast );
    toastConfig.param.text = opt.text;
    toastConfig.callback = fn;
    callByJS(toastConfig);
}
/**
 * Created by caifan on 2015/10/29.
 */
/*********************************************************************
 *                          获取 userInfo                              *
 **********************************************************************/
lb.getUserInfo = function ( fn ) {
    var userInfoConfig = lb.mix( true,{},config.userInfo );
    userInfoConfig.callback = fn;
    callByJS(userInfoConfig);
}

/*********************************************************************
 *                          获取 appInfo                              *
 **********************************************************************/
lb.getAppInfo = function ( fn) {
    var appInfoConfig = lb.mix( true,{},config.appInfo );
    appInfoConfig.callback = fn;
    callByJS(appInfoConfig);
}
/*********************************************************************
 *                          扫描barcode                      *
 **********************************************************************/
lb.barcode = function ( fn) {
    var barcodeConfig = lb.mix( true,{},config.barcode );
    barcodeConfig.callback = fn;
    callByJS(barcodeConfig);
}
/*********************************************************************
 *                 redirect跳转到navative或者h5页面                   *
 **********************************************************************/
lb.redirect = function ( text , fn) {
    var redirectConfig = lb.mix( true,{},config.redirect );
    redirectConfig.callback = fn;
    redirectConfig.param.text = text;
    callByJS(redirectConfig);
}
/*********************************************************************
 *                           支付宝支付                              *
 **********************************************************************/
lb.alipay = function ( option , fn) {
    var alipayConfig = lb.mix( true,{},config.alipay );
    alipayConfig.callback = fn;
    alipayConfig.param.userId = option.userId;
    alipayConfig.param.orderId = option.orderId;
    alipayConfig.param.orderPrice = option.orderPrice;
    callByJS(alipayConfig);
}

/*********************************************************************
 *                           分享数据                                *
 *********************************************************************/
lb.shareInfo = function ( option,fn ) {
    var shareInfoConfig = lb.mix( true,{},config.shareInfo);
    shareInfoConfig.callback = fn;
    shareInfoConfig.param.url = option.url;
    shareInfoConfig.param.title = option.title;
    shareInfoConfig.param.content = option.content;
    shareInfoConfig.param.imgUrl = option.imgUrl;
    callByJS(shareInfoConfig);
}
/*********************************************************************
 *                           爱车信息                             *
 **********************************************************************/
lb.getCarInfo = function (text, fn ) {
    var carInfoConfig = lb.mix( true,{},config.carInfo );
    carInfoConfig.callback = fn;
    carInfoConfig.param.text = text;
    callByJS(carInfoConfig);
}
/*********************************************************************
 *                           车享家userinfo                          *
 *********************************************************************/
lb.getUserInfoCXJ = function ( fn ) {
    var userId,username,mobilePhone, longitude,latitude,errorCode,msg;
    lb.getUserInfo(function (data) {
        userId =data.text.UID;
        username=data.text.username;
        mobilePhone=data.text.tel;
        var userInfoCXJConfig = lb.mix( true,{},config.userInfoCXJ );
        userInfoCXJConfig.callback = fn;
        var randomId = generateID();
        callbacks[randomId] = userInfoCXJConfig.callback;
        callByNative( {
            callbackId : randomId,
            result:{
                text:{
                    userId:userId,
                    custName:username,
                    mobilePhone:mobilePhone,
                    sourceType:"2",
                    openId:"5",
                    equId:"6",
                    cityName:"7",
                    localX:"8",
                    localY:"9"
                },
                errorCode : data.errorCode,
                msg : data.msg
            }
        })
        /*lb.geolocation(function (data) {
            longitude=data.text.longitude;
            latitude=data.text.latitude;
        })*/
    })
}
/*********************************************************************
*                              支付中心                              *
**********************************************************************/
lb.pay = function ( option , fn) {
    var payConfig = lb.mix( true,{},config.pay );
    payConfig.callback = fn;
    payConfig.param.partner = option.partner;
    payConfig.param.orderId =option.orderId;
    payConfig.param.txnAmount=option.txnAmount;
    payConfig.param.mdseName=option.mdseName;
    payConfig.param.body=option.body;
    payConfig.param.returnUrl=option.returnUrl;
    payConfig.param.notifyUrl=option.notifyUrl;
    payConfig.param.finishUrl=option.finishUrl;
    payConfig.param.timeout=option.timeout;
    payConfig.param.sign=option.sign;
    payConfig.param.terminalType=option.terminalType;
    payConfig.param.storeId=option.storeId;
    callByJS(payConfig);
}

/*********************************************************************
 *                           相机调用                                 *
 **********************************************************************/
lb.getDomain = function (fn) {
    var domainConfig = lb.mix( true,{},config.domain );
    domainConfig.callback =  fn;
    callByJS( domainConfig);
}
}()