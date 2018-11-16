var app = getApp();
var ajaxurl = app.globalData.ajaxurl;
const toasts = require('../../utils/toasts.js');

Page({

  /**
   * 页面的初始数据
   */ 
  data: {
    types: [{ name: "菜谱", searchType: "2" }, { name: "厨房攻略", searchType: "14" }],
    datamenu: [], //菜谱列表
    datavideo: [], //短视频列表
    currentTab: 0, //选项卡排序号
    searchtype: '2', //搜索结果类型
    pagenum2: 1, //菜谱翻页
    pagenum14: 1, //短视频翻页
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    toasts.loading();
    wx.stopPullDownRefresh() //停止下拉刷新
    var userid = 94138;
    console.log(userid);
    this.getdatamenu(userid);
    this.getdatavideo(userid);
  },

  getdatamenu: function (userid) {//定义函数名称
    console.log(userid);
    var that = this;   // 这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 如果在下方的sucess直接写this就变成了wx.request()的this了
    wx.request({
      url: ajaxurl + 'user/favorite',
      data: {
        "favoriteType": "menu",
        "pageNum": 1,
        "pageSize": 10,
        "userId": userid
      },
      header: {
        "version": "v430"
      },
      method: "POST",
      success: function (res) {
        console.log("菜谱列表：");
        console.log(res.data);
        if (res.data.status==200){
	        var arr1 = that.data.datamenu;
	        var arr2 = res.data.data;
//	        console.log(arr1);
//	        console.log(arr2);
	        arr1 = arr1.concat(arr2); //合并数组
	        console.log(arr1);
	        that.setData({
	          datamenu: arr1 //合并后存入data
	        })
        }else{
          toasts.fail();
        }

      },
      fail: function (err) { toasts.fail(); },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

  clicktap: function (event) {
    toasts.iferror();
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

  getdatavideo: function () {
    var that = this;
    wx.request({
      url: ajaxurl + 'search/searchJson/v420',
      data: {
        "keyWord": "菜",
        "pageNum": that.data.pagenum14,
        "pageSize": 10,
        "searchType": 14
      },
      method: "POST",
      success: function (res) {
        console.log("短视频列表：");
        console.log(res.data);
        if (res.data.status==200){
	        var arr1 = that.data.datavideo;
	        var arr2 = res.data.data.videoShortList;
//	        console.log(arr1);
//	        console.log(arr2);
	        arr1 = arr1.concat(arr2); //合并数组
	        console.log(arr1);
	        that.setData({
	          datavideo: arr1 //合并后存入data
	        })
        }else{
          toasts.fail();
        }
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
      datamenu: [],
      datavideo: [],
      currentTab: 0
    })
    that.setData({
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
    that.setData({
      currentTab: 0,
      searchtype: '2',
    })
    this.onLoad();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var searchtype = that.data.searchtype;
    console.log(searchtype);

    if (searchtype == 2) { //菜谱列表下拉加载
      var pagenum2 = that.data.pagenum2 + 1;
      console.log(pagenum2);
      that.setData({
        pagenum2: pagenum2,
      })
      that.getdatamenu();
    } else if (searchtype == 14) { //短视频列表下拉加载
      var pagenum14 = that.data.pagenum14 + 1;
      console.log(pagenum14);
      that.setData({
        pagenum14: pagenum14,
      })
      that.getdatavideo();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})