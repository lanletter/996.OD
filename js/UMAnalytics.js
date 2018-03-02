function loadURL(url) {
    var iFrame;
    iFrame = document.createElement("iframe");
    iFrame.setAttribute("src", url);
    iFrame.setAttribute("style", "display:none;");
    iFrame.setAttribute("height", "0px");
    iFrame.setAttribute("width", "0px");
    iFrame.setAttribute("frameborder", "0");
    document.body.appendChild(iFrame);
    iFrame.parentNode.removeChild(iFrame);
    iFrame = null;
};

function exec(funName, args) {
    var commend = {
        functionName : funName,
        arguments : args
    };
    var jsonStr = JSON.stringify(commend);
    var url = "umanalytics:" + jsonStr;
    loadURL(url);
};

var UMAnalyticsAgent = {

    /**
     * 自定义事件数量统计
     *
     * @param eventId
     *            NSString类型.事件ID，注意需要先在友盟网站注册此ID
     */
    onEvent : function(eventId) {
        exec("onEvent", [ eventId ]);

    },
    /**
     * 自定义事件数量统计
     *
     * @param eventId
     *            NSString类型.事件ID， 注意需要先在友盟网站注册此ID
     * @param eventLabel
     *            NSString类型.事件标签，事件的一个属性说明
     */
    onEventWithLabel : function(eventId, eventLabel) {
        exec("onEventWithLabel", [ eventId, eventLabel ]);

    },
    /**
     * 自定义事件数量统计
     *
     * @param eventId
     *            NSString类型.事件ID， 注意需要先在友盟网站注册此ID
     * @param eventData
     *            NSDictionary类型.当前事件的属性集合，最多支持10个K-V值
     */
    onEventWithParameters : function(eventId, eventData) {
        exec("onEventWithParameters", [ eventId, eventData ]);
    },
    /**
     * 自定义事件数值型统计
     *
     * @param eventId
     *            NSString类型.事件ID，注意要先在友盟网站上注册此事件ID
     * @param eventData
     *            NSDictionary类型.事件的属性集合，最多支持10个K-V值
     * @param eventNum
     *            int 类型.事件持续时长，单位毫秒，您需要手动计算并传入时长，作为事件的时长参数
     *
     */
    onEventWithCounter : function(eventId, eventData, eventNum) {
        exec("onEventWithCounter", [ eventId, eventData, eventNum ]);
    },
    /**
     * 页面统计开始时调用
     *
     * @param pageName
     *            NSString类型.页面名称
     */
    onPageBegin : function(pageName) {
        exec("onPageBegin", [ pageName ]);
    },
    /**
     * 页面统计结束时调用
     *
     * @param pageName
     *            NSString类型.页面名称
     */
    onPageEnd : function(pageName) {
        exec("onPageEnd", [ pageName ]);
    },


    /**
     * 统计帐号登录接口 *
     *
     * @param UID
     *            用户账号ID,长度小于64字节
     */
    profileSignInWithPUID : function(UID) {
        exec("profileSignInWithPUID", [ UID ]);
    },
    /**
     * 统计帐号登录接口 *
     *
     * @param provider
     *            帐号来源.用户通过第三方账号登陆,可以调用此接口进行统计.不能以下划线"_"开头,使用大写字母和数字标识,长度小于32字节;
     *            如果是上市公司,建议使用股票代码.
     * @param UID
     *            用户账号ID,长度小于64字节
     */
    profileSignInWithPUIDWithProvider : function(provider, UID) {
        exec("profileSignInWithPUIDWithProvider", [ provider, UID ]);
    },
    /**
     * 帐号统计退出接口
     */
    profileSignOff : function() {
        exec("profileSignOff", []);
    },
    /**
     * 当玩家建立角色或者升级时，需调用此接口
     *
     * @param level
     *            int类型.等级
     */
    setUserLevelId : function(level) {
        exec("setUserLevelId", [ level ]);
    },
    /**
     * 游戏中关卡开始的时候调用此方法。
     *
     * @param level
     *            NSString类型.
     */
    startLevel : function(level) {
        exec("startLevel", [ level ]);
    },
    /**
     * 游戏中成功过关的时候调用此方法
     *
     * @param level
     *            NSString类型.
     */
    finishLevel : function(level) {
        exec("finishLevel", [ level ]);
    },
    /**
     * 游戏中在某一关卡失败的时候调用此方法
     *
     * @param level
     *            NSString类型.
     */
    failLevel : function(level) {
        exec("failLevel", [ level ]);
    },
    /**
     * 统计订单的接口
     *
     * @param currencyAmount
     *            double类型.货币金额
     * @param currencyType
     *            NSString类型.货币类型
     * @param virtualAmount
     *            double类型.虚拟货币金额
     * @param channel
     *            int类型.
     *            </p>
     *            本次消费的途径:1.AppStore 2.支付宝 3.网银 4.财付通 5.移动 6.联通 7.电信 8.paypal
     * @param orderId
     *            NSString类型.订单ID
     */
    exchange : function(currencyAmount, currencyType, virtualAmount, channel,
                        orderId) {
        exec("exchange", [ currencyAmount, currencyType, virtualAmount,
            channel, orderId ]);
    },
    /**
     * 游戏中真实消费（充值）的时候调用此方法 1.AppStore 2.支付宝 3.网银 4.财付通 5.移动 6.联通 7.电信 8.paypal
     *
     * @param money
     *            double类型.本次消费金额
     * @param coin
     *            double类型.本次消费等值的虚拟币
     * @param source
     *            int类型.本次消费的途径，网银，支付宝 等
     */
    pay : function(money, coin, source) {
        exec("pay", [ money, coin, source ]);
    },
    /**
     * 游戏中真实消费（购买物品）的时候调用此方法
     *
     * @param money
     *            double类型.本地消费金额
     * @param item
     *            NSString类型. 本次购买物品名称
     * @param number
     *            int类型.本地购买物品数量
     * @param price
     *            double类型.本地购买等值虚拟币
     * @param source
     *            int类型.本次消费的途径，网银支付宝等
     */
    payWithItem : function(money, item, number, price, source) {
        exec("payWithItem", [ money, item, number, price, source ]);
    },
    /**
     * 游戏中虚拟消费（购买物品）的时候调用此方法
     *
     * @param item
     *            NSString类型.本地购买的物品名称
     * @param number
     *            int类型.本地购买的物品数量
     * @param price
     *            double类型.本地购买花费的虚拟币数量
     */
    buy : function(item, number, price) {
        exec("buy", [ item, number, price ]);
    },
    /**
     * 游戏中使用道具时候调用此方法
     *
     * @param item
     *            NSString类型. 道具名称
     * @param number
     *            int类型. 数量
     * @param price
     *            double类型.等值虚拟币
     */
    use : function(item, number, price) {
        exec("use", [ item, number, price ]);
    },
    /**
     * 游戏中免费获得额外金币时调用此方法
     *
     * @param item
     *            NSString类型. 道具名称
     * @param number
     *            int类型. 数量
     * @param price
     *            double类型.等值虚拟币
     * @param source
     *            int类型.本次消费的途径，网银支付宝等
     */
    bonusWithItem : function(item, number, price, source) {
        exec("bonusWithItem", [ item, number, price, source ]);
    },
    /**
     * 游戏中免费获得额外金币时调用此方法
     *
     * @param coin
     *            double类型. 奖励金币数额
     * @param source
     *            int类型.奖励金币的触发原因
     */
    bonus : function(coin, source) {
        exec("bonus", [ coin, source ]);
    },

    /** Dplus增加事件
     * @param eventName 事件名
     *              NSString类型.事件名
     *
     */
    track : function(eventName) {
        exec("track", [ eventName ]);
    },

    /** Dplus增加事件
     * @param eventName
     *              NSString类型.事件名
     * @param property
     *              NSDictionary类型.自定义属性
     *
     */
    trackWithProperty : function(eventName, property) {
        console.log("trackWithProperty方法调用！");
        exec("trackWithProperty", [ eventName, property]);
    },

    /** * 设置属性 键值对 会覆盖同名的key
     * 将该函数指定的key-value写入dplus专用文件；APP启动时会自动读取该文件的所有key-value，并将key-value自动作为后续所有track事件的属性。
     * @param property
     *              NSDictionary类型.自定义属性
     *
     */
    registerSuperProperty : function(property) {
        exec("registerSuperProperty", [property]);
    },

    /** * 从dplus专用文件中删除指定key-value
     * @param propertyName
     *              NSString类型.自定义属性
     *
     */
    unregisterSuperProperty : function(propertyName) {
        exec("unregisterSuperProperty", [propertyName]);
    },

    /** 返回dplus专用文件中key对应的value；如果不存在，则返回空
     * @param propertyName
     *              NSString类型.自定义属性
     *
     */
    getSuperProperty : function(propertyName) {
        exec("getSuperProperty", [propertyName]);
    },

    /** 返回Dplus专用文件中的所有key-value；如果不存在，则返回空。
     *
     */
    getSuperProperties : function() {
        exec("getSuperProperties", []);
    },

    /** * 清空Dplus专用文件中的所有key-value。
     *
     */
    clearSuperProperties : function() {
        exec("clearSuperProperties", []);
    },

    /** * 设置关注事件是否首次触发,只关注eventList前五个合法eventID.只要已经保存五个,此接口无效
     * @param eventList
     *              NSArray类型.自定义属性
     *
     */
    setFirstLaunchEvent : function(eventList) {
        exec("setFirstLaunchEvent", [eventList]);
    }
};

