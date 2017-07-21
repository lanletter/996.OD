!function(){

    /*********************************************************************
     *                           全局变量和方法                                 *
     **********************************************************************/
    var callbacks = {};//回调函数对象
    var ua = window.navigator.userAgent;//获取ua
    var oproto = Object.prototype;//Object对象原型

    var ohasOwn = oproto.hasOwnProperty;//属性是否来自对象本身
    var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/;
    var serialize = oproto.toString;//对象转换
    var class2type = {};//对象类型
// TODO精确性待改进
    var ANDROID = /android/i.test(ua);//是否为安卓（不区分大小写）返回布尔类型
    var IOS = /iphone|ipad/i.test(ua);//是否为iphone或ipad（不区分大小写）
    var WP = /windows phone/i.test(ua);//是否为window phone（不区分大小写）
    var noop = function () {};//

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
        return ("ft" + performance.now() + performance.now()).replace(/\./g, "")//去掉小数点，变成整数
    } : function() {
        return ("ft" + Math.random() + Math.random()).replace(/0\./g, "")//去掉0.变成整数
    }


    /*********************************************************************
     *                           ft初始化                                 *
     **********************************************************************/
    ft = function(el) {
        return new ft.init(el)
    };

    ft.init = function (el) {
        this[0] = this.element = el
    };

    ft.fn = ft.prototype = ft.init.prototype;

//取得目标的类型
    ft.type = function (obj) {
        if (obj == null) {
            return String(obj)
        }

        return typeof obj === "object" || typeof obj === "function" ?
        class2type[serialize.call(obj)] || "object" :
            typeof obj
    };

    ft.mix = ft.fn.mix = function () {
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
                    if (deep && copy && (ft.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

                        if (copyIsArray) {
                            copyIsArray = false
                            clone = src && Array.isArray(src) ? src : []

                        } else {
                            clone = src && ft.isPlainObject(src) ? src : {}
                        }

                        target[name] = ft.mix(deep, clone, copy)
                    } else if (copy !== void 0) {
                        target[name] = copy
                    }
                }
            }
        }
        return target
    }
//是否是一个函数对象
    var isFunction = typeof alert === "object" ? function(fn) {
        try {
            return /^\s*\bfunction\b/.test(fn + "")
        } catch (e) {
            return false
        }
    } : function(fn) {
        return serialize.call(fn) == "[object Function]"
    }
    ft.isFunction = isFunction
//是否是一个window对象
    ft.isWindow = function(obj) {
        if (!obj)
            return false
        return obj == obj.document && obj.document != obj
    }

    function isWindow(obj) {
        return rwindow.test(serialize.call(obj))
    }
    if (isWindow(window)) {
        ft.isWindow = isWindow
    }

    var enu;
    for (enu in ft({})) {
        break
    }
//枚举类型
    var enumerateBUG = enu !== "0";

//是否为一个原始对象（普通对象）
    ft.isPlainObject = function(obj, key) {
        if (!obj || ft.type(obj) !== "object" || obj.nodeType || ft.isWindow(obj)) {
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
        addToCart :{
            name : "addToCart",
            param:{
                refId: "",
                type:"",
                count:""
            },
            callbackId : generateID(),
            callback : noop
        },
        selectCoupon:{
            name : "selectCoupon",
            callbackId : generateID(),
            callback : noop
        },
        purchase:{
            name : "purchase",
            param:{
                id:"",//  购物车ID
                num:"",// 购物车数量
                type:"",// 购物车类型
                voucher:"", //购物车优惠券
                remark:"",// 购物车备注
                picturepath:"",// 购物车图片路径
                name:"", //购物车名称、标题
                oldprice:"", //购物车原价
                newprice:"" ,//购物车新价格
                starttime:"",//开课时间
                address1:"",//开课地址1
                address2:""//开课地址2

            },
            callbackId : generateID(),
            callback : noop
        },
        isLogin:{
            name : "isLogin",
            callbackId : generateID(),
            callback : noop
        },
        // callKitchenware:{
        //     name : "callKitchenware",
        //     callbackId : generateID(),
        //     callback : noop
        // },
        callKitchenware:{
            name : "callKitchenware",
            param:{
                id:""
            },
            callbackId : generateID(),
            callback : noop
        }
    };


    /*********************************************************************
     *                           js bridge                                 *
     **********************************************************************/
    function encode( opts ){
        //判断传入参数是否为object
        if( typeof opts === "object" ){
            for(var p in opts){
                //判断opts里层对象是否为objecte
                if( typeof opts[p] === "object" ){
                    opts[p] = encode( opts[p] )
                }else if (Array.isArray(opts[p])){//判断里层对象是否为数组
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
            ft.log("不是有效的对象")
        }
        return opts;
    }
    function invoke(cmd) {
        log('invoke:', cmd);
        window.location.href = 'ft://' + encodeURIComponent(cmd);
    }

    function callByJS(opt) {
        var input = {};
        input.name = opt.name;
        input.callbackId = generateID();
        input.param = opt.param || {};
        callbacks[input.callbackId] = opt.callback;
        invoke(JSON.stringify(encode(input)));
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
    ft.callByJS = callByJS;
    ft.callByNative = callByNative;
    ft.log = log;

    /*********************************************************************
     *                           加入购物车                                 *
     **********************************************************************/
    ft.addToCart = function (option,fn) {
        var addToCartConfig = ft.mix( true,{},config.addToCart );
        addToCartConfig.param.refId = option.refId ||"" ;
        addToCartConfig.param.type = option.type ||"" ;
        addToCartConfig.param.count = option.count ||"" ;
        addToCartConfig.callback =  fn;
        callByJS( addToCartConfig);
    }
    /*********************************************************************
     *                           选择优惠券                                 *
     **********************************************************************/
    ft.selectCoupon = function (fn) {
        var selectCouponConfig = ft.mix( true,{},config.selectCoupon );
        selectCouponConfig.callback =  fn;
        callByJS(selectCouponConfig);
    }
    /*********************************************************************
     *                           立即购买                                 *
     **********************************************************************/
    ft.purchase = function (option,fn) {
        var purchaseConfig = ft.mix( true,{},config.purchase );
        purchaseConfig.param.id = option.id ||"" ;
        purchaseConfig.param.num = option.num ||"" ;
        purchaseConfig.param.type = option.type ||"" ;
        purchaseConfig.param.voucher = option.voucher ||"" ;
        purchaseConfig.param.remark = option.remark ||"";
        purchaseConfig.param.picturepath = option.picturepath ||"";
        purchaseConfig.param.name = option.name ||"" ;
        purchaseConfig.param.oldprice = option.oldprice ||"" ;
        purchaseConfig.param.newprice = option.newprice ||"" ;
        purchaseConfig.param.starttime = option.starttime ||"" ;
        purchaseConfig.param.address1 = option.address1 ||"" ;
        purchaseConfig.param.address2 = option.address2 ||"" ;
        purchaseConfig.callback =  fn;
        callByJS(purchaseConfig);
    }
    /*********************************************************************
     *                           登录判断                                 *
     **********************************************************************/
    ft.isLogin = function (fn) {
        var isLoginConfig = ft.mix( true,{},config.isLogin );
        isLoginConfig.callback =  fn;
        callByJS(isLoginConfig);
    }
    /*********************************************************************
     *                           唤起智能设备                             *
     **********************************************************************/
    // ft.callKitchenware = function (fn) {
    //     var callKitchenwareConfig = ft.mix( true,{},config.callKitchenware );
    //     callKitchenwareConfig.callback =  fn;
    //     callByJS(callKitchenwareConfig);
    // }
    ft.callKitchenware = function (fn) {
        var callKitchenwareConfig = ft.mix( true,{},config.callKitchenware );
        callKitchenwareConfig.param.id = option.id ||"" ;
        callKitchenwareConfig.callback =  fn;
        callByJS(callKitchenwareConfig);
    }
}()