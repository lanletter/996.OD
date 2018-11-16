var app = getApp();
var ajaxurl = app.globalData.ajaxurl;
const toasts = require('../../../utils/toasts.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataask: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    toasts.loading();
    var id = options.id;
    this.getaskdata(id)
  },

  getaskdata: function (id) {//定义函数名称
    var that = this;
    wx.request({
      url: ajaxurl +'comment/answer/list',
      data: {
        "refId": id,
        "userId": 1
      },
      header: {
        "version": "v440"
      },
      method: "POST",
      success: function (res) {
        console.log("问答列表:");
        console.log(res.data.data);
        that.setData({
          dataask: res.data.data,
        })
      },
      fail: function (err) { toasts.fail(); },
      complete: function () { }
    })
  },

  opendetail: function (event) {
    toasts.iferror();
    console.log(event.currentTarget.dataset.id);
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/menudetail/menuasklist/askdetail/askdetail?id=" + id
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
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})