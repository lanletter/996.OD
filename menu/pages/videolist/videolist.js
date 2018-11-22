var app = getApp();
var ajaxurl = app.globalData.ajaxurl;
const toasts = require('../../utils/toasts.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    id: "",
    videourl: "",
    videopic: "",
    yellowbg: true,
    pagenum: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    var that = this;
    console.log(option);
    if (option.page > 1) {
      var page = option.page
    } else {
      var page = 1
    }
    console.log(page);
    that.setData({
      pagenum: page
    })

    wx.getNetworkType({
      success: function (res) {
        console.log(res.networkType);
        if (res.networkType == "wifi") {
          that.getlistdata(page);
        } else {
          wx.showModal({
            title: '提示',
            content: '当前状态下播放视频可能会消耗流量，是否继续?',
            confirmText: '继续',
            success(res) {
              if (res.confirm) {
                // console.log('用户点击继续');
                that.getlistdata(page);
              } else if (res.cancel) {
                // console.log('用户点击取消');
                wx.navigateTo({
                  url: '/pages/home/home'
                })
              }
            }
          })
        }
        that.setData({
          netWorkType: res.networkType
        })
      }
    })
    setTimeout(function () {
      that.setData({
        yellowbg: false
      })
    }, 5000);
  },

  getlistdata: function (page) {
    var that = this;
    wx.request({
      url: ajaxurl + '/videoShort/list',
      data: {
        "pageNum": page,
        "pageSize": 1
      },
      header: {
        "version": "v450"
      },
      method: "POST",
      success: function (res) {
        console.log("列表:");
        console.log(res.data);
        var id = res.data.data[0].id;
        var videopic = res.data.data[0].picture.path;
        var videourl = res.data.data[0].url;
        var title = res.data.data[0].title;
        console.log(videourl);
        console.log(videopic);
        that.setData({
          title: title,
          id: id,
          videourl: videourl,
          videopic: videopic
        })
      },
      fail: function (err) { toasts.fail(); },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

  bindlinkdetail: function (e) {
    toasts.iferror();
    // console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/videodetail/videodetail?id=" + id
    })
  },

  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    console.log(that.data.pagenum);
    var pagenum = that.data.pagenum - 1;
    console.log(pagenum);

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    // console.log("onReachBottom");
    // var that = this;
    console.log(that.data.pagenum);
    var page = parseInt(that.data.pagenum) + 1;
    console.log(page);
    // this.getdata(that.data.id);
    wx.redirectTo({
      url: '/pages/videolist/videolist?page=' + page,
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})