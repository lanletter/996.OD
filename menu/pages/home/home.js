var app = getApp();
var ajaxurl = app.globalData.ajaxurl;
const toasts = require('../../utils/toasts.js');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    datamenuspecial:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    toasts.loading();
    var userid = 94138;
    // console.log(userid);
    this.getdata(userid);
  },

  getdata: function (userid) {//定义函数名称
    var that = this;   // 这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 如果在下方的sucess直接写this就变成了wx.request()的this了
    wx.request({
      url: ajaxurl + 'index/greatest/wx',
      data: { },
      header: {
        "version": "v450"
      },
      method: "POST",
      success: function (res) {
        // console.log(res);
        // console.log(res.data.data[1]);
        if (res.data.status==200){
          that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
            datamenuspecial: res.data.data[1]
          })
        }else{
          toasts.fail();
        }

      },
      fail: function (err) { toasts.fail(); },//请求失败
      complete: function (res) { }//请求完成后执行的函数
    })
  },

  /* 获取授权 */
  getLogin:function(){
    wx.navigateTo({
      url: "/pages/impower/impower"
    })
  },

  /**
   * 跳转菜谱专题页
   */
  jumpmenu: function (event) {
    console.log(event.currentTarget);
    console.log(event.currentTarget.dataset.id);
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/menulist/menulist?id=" + id
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
    toasts.finish();
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