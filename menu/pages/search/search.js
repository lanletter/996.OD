var app = getApp();
var ajaxurl = app.globalData.ajaxurl;
const toasts = require('../../utils/toasts.js');

function uniq(array) {
  var temp = []; //一个新的临时数组
  for (var i = 0; i < array.length; i++) {
    if (temp.indexOf(array[i]) == -1) {
      temp.push(array[i]);
    }
  }
  return temp;
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    datahotlist: {}, //热词
    datawords: [], //联想词
    historywords: [], //历史搜索记录
    types: {}, //选项列表
    datamenu: [], //菜谱列表
    datavideo: [], //短视频列表
    inputvalue: '', //搜索值
    startinput: false, //是否触发搜索
    searched: false, //搜索前后修改样式
    currentTab: 0, //选项卡排序号
    searchtype: '', //搜索结果类型
    pagenum2: 1, //菜谱翻页
    pagenum14: 1, //短视频翻页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    toasts.loading();
    var that = this;
    console.log(ajaxurl);
    that.gethotlist();
    wx.getStorage({
      key: 'history',
      success(res) {
        console.log("搜索历史列表：");
        console.log(res.data);
        that.setData({
          historywords: res.data
        })
      }
    })
  },

  gethotlist: function () {
    var that = this;
    wx.request({
      url: ajaxurl + 'search/hotlist',
      data: {},
      method: "POST",
      success: function (res) {
        console.log("热词列表：");
        console.log(res.data);
        var datahotlist = res.data.data;
        that.setData({
          datahotlist: datahotlist
        })
      },
      fail: function (err) { toasts.fail(); },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

  /* 获取输入内容 */
  bindinput: function (e) {
    var that = this;
    // console.log(e.detail);
    if (e.detail.value !== "") {
      this.setData({
        startinput: true
      })
      that.checkword(e.detail.value)
    }
  },

  /* 查询联想词 */
  checkword: function (value) {
    var that = this;
    wx.request({
      url: ajaxurl + 'search/suggest',
      data: {
        "keyWord": value
      },
      method: "POST",
      success: function (res) {
        console.log("联想词列表：");
        console.log(res.data);
        var datawords = res.data.data;
        that.setData({
          datawords: datawords
        })
      },
      fail: function (err) { toasts.fail(); },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

  /* 删除input内容 */
  deleteinputvalue: function () {
    this.setData({
      inputvalue: '',
      startinput: false
    })
  },

  /* 提交搜索 */
  bindconfirm: function (e) {
    var that = this;
    var value = e.detail.value;
    console.log(value);
    /* 搜索状态重置 */
    that.restart(value);

    that.getsearch(value);

    /* 存储搜索记录 */
    wx.getStorage({
      key: 'history',
      success(res) {
        var historywords = res.data;
        console.log(historywords); //获取当前数组
        historywords.unshift(value); //新增元素插入数组（前）
        console.log(uniq(historywords)); //数组去重
        wx.setStorageSync('history', uniq(historywords));
        that.setData({
          historywords: uniq(historywords)
        })
      }
    })
  },

  /* 选择联想词 */
  chooseword: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset);
    var value = e.currentTarget.dataset.value;
    that.restart(value);
    that.getsearch(value)
    /* 存储搜索记录 */
    wx.getStorage({
      key: 'history',
      success(res) {
        var historywords = res.data;
        console.log(historywords); //获取当前数组
        historywords.unshift(value); //新增元素插入数组（前）
        console.log(uniq(historywords)); //数组去重
        wx.setStorageSync('history', uniq(historywords));
        that.setData({
          historywords: uniq(historywords)
        })
      }
    })
  },

  /* 删除历史词 */
  deleteword: function (e) {
    toasts.iferror();
    var that = this;
    console.log(e.currentTarget.dataset);
    var index = e.currentTarget.dataset.index;
    //删除下标index的1个元素
    wx.getStorage({
      key: 'history',
      success(res) {
        var historywords = res.data;
        console.log(historywords);
        historywords.splice(index, 1);
        console.log(historywords);
        //更新缓存和本地数据
        wx.setStorageSync('history', historywords);
        that.setData({
          historywords: historywords
        })
      }
    })

  },

  getsearch: function () {
    toasts.iferror();
    var that = this;
    wx.request({
      url: ajaxurl + 'search/searchJsonMenu',
      data: {
        "keyWord": that.data.inputvalue
      },
      header: {
        version: "v440"
      },
      method: "POST",
      success: function (res) {
        console.log("选项列表：");
        console.log(res.data);
        var types = res.data.data;
        that.setData({
          startinput: true,
          types: types,
          searchtype: types[0].searchType
        })
        that.getdatamenu();
        that.getdatavideo();
      },
      fail: function (err) { toasts.fail(); },//请求失败
      complete: function () { }//请求完成后执行的函数
    })

    /* 更换搜索后样式 */
    this.setData({
      searched: true,
      startinput: false
    })
  },

  clicktap: function (event) {
    var that = this;
    console.log(event);
    var current = event.currentTarget.dataset.current;
    var searchtype = event.currentTarget.dataset.searchtype;
    /* 点击效果 */
    if (this.data.currentTab === current) {
      return false;
    } else {
      that.setData({
        currentTab: current,
        searchtype: searchtype
      })
    }
  },

  getdatamenu: function () {
    var that = this;
    wx.request({
      url: ajaxurl + 'search/searchJson/v420',
      data: {
        "keyWord": that.data.inputvalue,
        "pageNum": that.data.pagenum2,
        "pageSize": 10,
        "searchType": 2
      },
      method: "POST",
      success: function (res) {
        console.log("菜谱列表：");
        var arr1 = that.data.datamenu;
        var arr2 = res.data.data.menuList;
        arr1 = arr1.concat(arr2); //合并数组
        console.log(arr1);
        that.setData({
          datamenu: arr1 //合并后存入data
        })
      },
      fail: function (err) { toasts.fail(); },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

  getdatavideo: function () {
    var that = this;
    wx.request({
      url: ajaxurl + 'search/searchJson/v420',
      data: {
        "keyWord": that.data.inputvalue,
        "pageNum": that.data.pagenum14,
        "pageSize": 10,
        "searchType": 14
      },
      method: "POST",
      success: function (res) {
        console.log("短视频列表：");
        var arr1 = that.data.datavideo;
        var arr2 = res.data.data.videoShortList;
        console.log(arr1);
        console.log(arr2);
        arr1 = arr1.concat(arr2); //合并数组
        console.log(arr1);
        that.setData({
          datavideo: arr1 //合并后存入data
        })
      },
      fail: function (err) { toasts.fail(); },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

  /* 数据重置 */
  restart: function (value) {
    var that = this;
    console.log("数据重置：");
    console.log({
      inputvalue: value,
      datawords: [],
      datamenu: [],
      datavideo: [],
      currentTab: 0
    })
    that.setData({
      inputvalue: value,
      datawords: [],
      datamenu: [],
      datavideo: [],
      currentTab: 0
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    toasts.finish(); //停止下拉刷新效果
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    console.log("1");
    that.setData({
      inputvalue: '',
      startinput: false,
      searched: false,
      currentTab: 0,
      searchtype: '',
    })
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("onReachBottom");
    var that=this;
    var searchtype = that.data.searchtype;
    console.log(searchtype);

    if (searchtype==2){ //菜谱列表下拉加载
      var pagenum2 = that.data.pagenum2 + 1;
      console.log(pagenum2);
      that.setData({
        pagenum2: pagenum2,
      })
      that.getdatamenu(that.data.inputvalue);
    } else if (searchtype == 14) { //短视频列表下拉加载
      var pagenum14 = that.data.pagenum14 + 1;
      console.log(pagenum14);
      that.setData({
        pagenum14: pagenum14,
      })
      that.getdatavideo(that.data.inputvalue);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})