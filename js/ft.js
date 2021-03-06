!function () {

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
    var noop = function () {
    };//

//ANDROID = 0; IOS = 1;

    /**
     * 方便在各个平台中看到完整的log
     */
    function log() {
        // http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
        Function.apply.call(console.log, console, arguments)
    }

//生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    var generateID = window.performance && performance.now ? function () {
        return ("ft" + performance.now() + performance.now()).replace(/\./g, "")//去掉小数点，变成整数
    } : function () {
        return ("ft" + Math.random() + Math.random()).replace(/0\./g, "")//去掉0.变成整数
    }


    /*********************************************************************
     *                           ft初始化                                 *
     **********************************************************************/
    ft = function (el) {
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
    var isFunction = typeof alert === "object" ? function (fn) {
        try {
            return /^\s*\bfunction\b/.test(fn + "")
        } catch (e) {
            return false
        }
    } : function (fn) {
        return serialize.call(fn) == "[object Function]"
    }
    ft.isFunction = isFunction
//是否是一个window对象
    ft.isWindow = function (obj) {
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
    ft.isPlainObject = function (obj, key) {
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
        addToCart: {
            name: "addToCart",
            param: {
                refId: "",
                type: "",
                count: ""
            },
            callbackId: generateID(),
            callback: noop
        },
        addCartMenu: {
            name: "addCartMenu",
            param: {
                id: "",//菜谱食材
                provinceName: "",//省
                cityName: "",//市
                areaName:""//区
            },
            callbackId: generateID(),
            callback: noop
        },
        addCartGood: {
            name: "addCartGood",
            param: {
                skuUuid: "",//商品SKU
                count: ""//商品数量
            },
            callbackId: generateID(),
            callback: noop
        },
        selectCoupon: {
            name: "selectCoupon",
            callbackId: generateID(),
            callback: noop
        },
        purchase: {
            name: "purchase",
            param: {
                id: "",//  ID
                price: "",//单价
                num: "",// 数量
                type: "",// 类型
                coupontype: "",//优惠券类型
                voucher: "", //优惠券
                remark: "",// 备注
                picturepath: "",// 图片路径
                name: "", //名称、标题
                oldprice: "", //原价
                newprice: "",//新价格
                starttime: "",//开课时间
                address1: "",//开课地址1
                address2: ""//开课地址2

            },
            callbackId: generateID(),
            callback: noop
        },
        purchaseGood: {
            name: "purchaseGood",
            param: {
                shopUuid: "",//店铺id
                shopName: "",// 店铺名称
                productUuid: "",// 商品id
                skuUuid: "",// skuid
                productCountNum: "", //商品选择数量
                productimage: "", //商品图片
                productName: "",//商品名称
                productPrice:"" ,//价格
                productInventory: "",//商品库存
                skuName: "",// sku名称
                provinceName: "",// 省
                cityName: "",// 市
                areaName: "" //区
            },
            callbackId: generateID(),
            callback: noop
        },
        isLogin: {
            name: "isLogin",
            callbackId: generateID(),
            callback: noop
        },
        isLogin2: {
            name: "isLogin2",
            callbackId: generateID(),
            callback: noop
        },
        callKitchenware: {
            name: "callKitchenware",
            param: {
                pid: ""//id
            },
            callbackId: generateID(),
            callback: noop
        },
        classMenu: {
            name: "classMenu",
            callbackId: generateID(),
            callback: noop
        },
        pushStore: {
            name: "pushStore",
            callbackId: generateID(),
            callback: noop
        },
        MenuLinght: {
            name: "MenuLinght",
            callbackId: generateID(),
            callback: noop
        },
        locationAddress: {
            name: "locationAddress",
            callbackId: generateID(),
            callback: noop
        },
        chooseAddress: {
            name: "chooseAddress",
            callbackId: generateID(),
            callback: noop
        },
        callMenuUp: {
            name: "callMenuUp",
            callbackId: generateID(),
            callback: noop
        },
        shareInfo: {
            name: "shareInfo",
            param: {
                id: "",//id
                type: "",// 类型
                sharetitle: "",//标题
                sharedesc: "",// 详情
                shareimg: "",// 图片
                sharelink: "" //url地址
            },
            callbackId: generateID(),
            callback: noop
        },
        multithreadedCooking: {
            name: "multithreadedCooking",
            callbackId: generateID(),
            callback: noop
        },
        tutorInfo:{
            name: "tutorInfo",
            param: {
                id: "",//导师id
                type: ""// 类型
            },
            callbackId: generateID(),
            callback: noop
        },
        workDetail:{
            name: "workDetail",
            param: {
                id: ""//作品id
            },
            callbackId: generateID(),
            callback: noop
        },
        questionDetail:{
            name: "questionDetail",
            param: {
                id: "",//问题id
                menuurl: ""//菜谱id
            },
            callbackId: generateID(),
            callback: noop
        },
        copyText:{
            name: "copyText",
            param: {
                copytext: "",//文本内容
            },
            callbackId: generateID(),
            callback: noop
        },
        toOrder:{
            name: "toOrder",
            param: {
                type: "",//类型
                id:""
            },
            callbackId: generateID(),
            callback: noop
        }

    };


    /*********************************************************************
     *                           js bridge                                 *
     **********************************************************************/
    function encode(opts) {
        //判断传入参数是否为object
        if (typeof opts === "object") {
            for (var p in opts) {
                //判断opts里层对象是否为objecte
                if (typeof opts[p] === "object") {
                    opts[p] = encode(opts[p])
                } else if (Array.isArray(opts[p])) {//判断里层对象是否为数组
                    for (var i = 0; i < opts[p].length; i++) {
                        if (typeof opts[p][i] === "object") {
                            opts[p][i] = encode(opts[p][i])
                        } else {
                            opts[p][i] = encodeURIComponent(opts[p][i])
                        }
                    }
                } else {
                    opts[p] = encodeURIComponent(opts[p])
                }
            }
        } else {
            ft.log("不是有效的对象")
        }
        return opts;
    }

    function invoke(cmd) {
        log('invoke:', cmd);
        // alert('invoke:'+ cmd);
        window.location.href = 'ft://' + encodeURIComponent(cmd);
        log('ft://' + encodeURIComponent(cmd));
        // alert('ft://' + encodeURIComponent(cmd));
    }

    function callByJS(opt) {
        var input = {};
        input.name = opt.name;
        input.callbackId = generateID();
        input.param = opt.param || {};
        callbacks[input.callbackId] = opt.callback;
        invoke(JSON.stringify(encode(input)));
    }

    function callByNative(opt) {
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
     *                           登录判断-强制登录                                 *
     **********************************************************************/
    ft.isLogin = function (fn) {
        var isLoginConfig = ft.mix(true, {}, config.isLogin);
        isLoginConfig.callback = fn;
        callByJS(isLoginConfig);
    }
    /*********************************************************************
     *                           登录判断2-不强制登录                                 *
     **********************************************************************/
    ft.isLogin2 = function (fn) {
        var isLoginConfig2 = ft.mix(true, {}, config.isLogin2);
        isLoginConfig2.callback = fn;
        callByJS(isLoginConfig2);
    }
    /*********************************************************************
     *                           唤起智能设备                             *
     **********************************************************************/
    ft.callKitchenware = function (option, fn) {
        var callKitchenwareConfig = ft.mix(true, {}, config.callKitchenware);
        callKitchenwareConfig.param.pid = option.pid || "";
        callKitchenwareConfig.callback = fn;
        callByJS(callKitchenwareConfig);
    }
    /*********************************************************************
     *                           进入菜谱列表                             *
     **********************************************************************/
    ft.classMenu = function (fn) {
        var classMenuConfig = ft.mix(true, {}, config.classMenu);
        classMenuConfig.callback = fn;
        callByJS(classMenuConfig);
    }
    /*********************************************************************
     *                           进入商城厨具列表                             *
     **********************************************************************/
    ft.pushStore = function (fn) {
        var pushStoreConfig = ft.mix(true, {}, config.pushStore);
        pushStoreConfig.callback = fn;
        callByJS(pushStoreConfig);
    }
    /*********************************************************************
     *                           进入菜谱页的标志                             *
     **********************************************************************/
    ft.MenuLinght = function (fn) {
        var MenuLinghtConfig = ft.mix(true, {}, config.MenuLinght);
        MenuLinghtConfig.callback = fn;
        callByJS(MenuLinghtConfig);
    }
    /*********************************************************************
     *                           获取定位地址                          *
     **********************************************************************/
    ft.locationAddress = function (fn) {
        var locationAddressConfig = ft.mix(true, {}, config.locationAddress);
        locationAddressConfig.callback = fn;
        callByJS(locationAddressConfig);
    }
    /*********************************************************************
     *                           唤起用户选择地址                             *
     **********************************************************************/
    ft.chooseAddress = function (fn) {
        var chooseAddressConfig = ft.mix(true, {}, config.chooseAddress);
        chooseAddressConfig.callback = fn;
        callByJS(chooseAddressConfig);
    }
    /*********************************************************************
     *                           选择优惠券-课程                                *
     **********************************************************************/
    ft.selectCoupon = function (fn) {
        var selectCouponConfig = ft.mix(true, {}, config.selectCoupon);
        selectCouponConfig.callback = fn;
        callByJS(selectCouponConfig);
    }
    /*********************************************************************
     *                           立即购买-课程                                 *
     **********************************************************************/
    ft.purchase = function (option, fn) {
        var purchaseConfig = ft.mix(true, {}, config.purchase);
        purchaseConfig.param.id = option.id || "";
        purchaseConfig.param.price = option.price || "";
        purchaseConfig.param.num = option.num || "";
        purchaseConfig.param.type = option.type || "";
        purchaseConfig.param.coupontype = option.coupontype || "";
        purchaseConfig.param.voucher = option.voucher || "";
        purchaseConfig.param.remark = option.remark || "";
        purchaseConfig.param.picturepath = option.picturepath || "";
        purchaseConfig.param.name = option.name || "";
        purchaseConfig.param.oldprice = option.oldprice || "";
        purchaseConfig.param.newprice = option.newprice || "";
        purchaseConfig.param.starttime = option.starttime || "";
        purchaseConfig.param.address1 = option.address1 || "";
        purchaseConfig.param.address2 = option.address2 || "";
        purchaseConfig.callback = fn;
        callByJS(purchaseConfig);
    }
    /*********************************************************************
     *                           加入购物车-课程                                 *
     **********************************************************************/
    ft.addToCart = function (option, fn) {
        var addToCartConfig = ft.mix(true, {}, config.addToCart);
        addToCartConfig.param.refId = option.refId || "";
        addToCartConfig.param.type = option.type || "";
        addToCartConfig.param.count = option.count || "";
        addToCartConfig.callback = fn;
        callByJS(addToCartConfig);
    }
    /*********************************************************************
     *                           加入购物车-菜谱                                 *
     **********************************************************************/
    ft.addCartMenu = function (option, fn) {
        var addCartMenuConfig = ft.mix(true, {}, config.addCartMenu);
        addCartMenuConfig.param.id = option.id || "";
        addCartMenuConfig.param.provinceName = option.provinceName || "";
        addCartMenuConfig.param.cityName = option.cityName || "";
        addCartMenuConfig.param.areaName = option.areaName || "";
        addCartMenuConfig.callback = fn;
        callByJS(addCartMenuConfig);
    }
    /*********************************************************************
     *                           加入购物车-商品                                 *
     **********************************************************************/
    ft.addCartGood = function (option, fn) {
        var addCartGoodConfig = ft.mix(true, {}, config.addCartGood);
        addCartGoodConfig.param.skuUuid = option.skuUuid || "";
        addCartGoodConfig.param.count = option.count || "";
        addCartGoodConfig.callback = fn;
        callByJS(addCartGoodConfig);
    }
    /*********************************************************************
     *                           立即购买-商品                                 *
     **********************************************************************/
    ft.purchaseGood= function (option, fn) {
        var purchaseGoodConfig = ft.mix(true, {}, config.purchaseGood);
        purchaseGoodConfig.param.shopUuid = option.shopUuid || "";
        purchaseGoodConfig.param.shopName = option.shopName || "";
        purchaseGoodConfig.param.productUuid = option.productUuid || "";
        purchaseGoodConfig.param.skuUuid = option.skuUuid || "";
        purchaseGoodConfig.param.productCountNum = option.productCountNum || "";
        purchaseGoodConfig.param.productimage = option.productimage || "";
        purchaseGoodConfig.param.productName = option.productName || "";
        purchaseGoodConfig.param.productPrice = option.productPrice || "";
        purchaseGoodConfig.param.productInventory = option.productInventory || "";
        purchaseGoodConfig.param.skuName = option.skuName || "";
        purchaseGoodConfig.param.provinceName = option.provinceName || "";
        purchaseGoodConfig.param.cityName = option.cityName || "";
        purchaseGoodConfig.param.areaName = option.areaName || "";
        purchaseGoodConfig.callback = fn;
        callByJS(purchaseGoodConfig);
    }

    /*********************************************************************
     *                           唤起菜谱上传                             *
     **********************************************************************/
    ft.callMenuUp = function (option, fn) {
        var callMenuUpConfig = ft.mix(true, {}, config.callMenuUp);
        callMenuUpConfig.callback = fn;
        callByJS(callMenuUpConfig);
    }

    /*********************************************************************
     *                           获取分享参数                             *
     **********************************************************************/
    ft.shareInfo= function (option, fn) {
        var shareInfoConfig = ft.mix(true, {}, config.shareInfo);
        shareInfoConfig.param.id = option.id || "";
        shareInfoConfig.param.type = option.type || "";
        shareInfoConfig.param.sharetitle = option.sharetitle || "";
        shareInfoConfig.param.sharedesc = option.sharedesc || "";
        shareInfoConfig.param.shareimg = option.shareimg || "";
        shareInfoConfig.param.sharelink = option.sharelink || "";
        shareInfoConfig.callback = fn;
        callByJS(shareInfoConfig);
    }

    /*********************************************************************
     *                           唤起多线程交互                             *
     **********************************************************************/
    ft.multithreadedCooking = function (option, fn) {
        var multithreadedCookingConfig = ft.mix(true, {}, config.multithreadedCooking);
        multithreadedCookingConfig.callback = fn;
        callByJS(multithreadedCookingConfig);
    }

    /*********************************************************************
     *                           获取课程导师                             *
     **********************************************************************/
    ft.tutorInfo= function (option, fn) {
        var tutorInfoConfig = ft.mix(true, {}, config.tutorInfo);
        tutorInfoConfig.param.id = option.id || "";
        tutorInfoConfig.param.type = option.type || "";
        tutorInfoConfig.callback = fn;
        callByJS(tutorInfoConfig);
    }

    /*********************************************************************
     *                           进入作品详情                             *
     **********************************************************************/
    ft.workDetail= function (option, fn) {
        var productionConfig = ft.mix(true, {}, config.workDetail);
        productionConfig.param.id = option.id || "";
        productionConfig.callback = fn;
        callByJS(productionConfig);
    }

    /*********************************************************************
     *                           进入问题详情                             *
     **********************************************************************/
    ft.questionDetail= function (option, fn) {
        var productionConfig = ft.mix(true, {}, config.questionDetail);
        productionConfig.param.id = option.id || "";
        productionConfig.param.menuurl = option.menuurl || "";
        productionConfig.callback = fn;
        callByJS(productionConfig);
    }
    
    /*********************************************************************
     *                           点击复制文本                             *
     **********************************************************************/
    ft.copyText = function (option, fn) {
        var productionConfig = ft.mix(true, {}, config.copyText);
        productionConfig.param.copytext = option.copytext || "";
        callByJS(productionConfig);
    }
    
    /*********************************************************************
     *                           转订单结算                             *
     **********************************************************************/
    ft.toOrder = function (option, fn) {
        var productionConfig = ft.mix(true, {}, config.toOrder);
        productionConfig.param.type = option.type || "";
        productionConfig.param.id = option.id || "";
        callByJS(productionConfig);
    }

}()