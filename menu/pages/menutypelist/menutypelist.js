var app = getApp();
var ajaxurl = app.globalData.ajaxurl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    rects: {},
    currentTab: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getdata();
  },

  getdata: function () {
    var that = this;
    wx.request({
      url: ajaxurl +'menu/category403',
      data: {},
      method: "POST",
      success: function (res) {
        console.log(res.data);
        that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数
          data: res.data.data
        })
        that.getAllRects(res.data.data);
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

  /*获取节点信息 */
  getAllRects: function (data) {
    var that = this;
    wx.createSelectorQuery().selectAll('.title').boundingClientRect(function (rects) {
      for (var i = 0; i < rects.length; i++) {
        data[i].top = rects[i].top;
        rects[i].name = data[i].name;
      }
      that.setData({
        rects: rects
      })
      console.log(rects);
    }).exec()
  },

  clicktap: function (event) {
    var that = this;
    console.log(event);
    console.log(event.currentTarget.dataset.top);
    var index = event.currentTarget.dataset.index;
    var top = event.currentTarget.dataset.top;
    var current = event.currentTarget.dataset.current;

    /* 滚动效果 */
    wx.pageScrollTo({
      scrollTop: top,
      duration: 0
    })

    /* 点击效果 */
    if (this.data.currentTab === current) {
      return false;
    } else {
      that.setData({
        currentTab: current
      })
    }
  },

  onPageScroll: function (e) {
    var that = this;
    // console.log(e.scrollTop);
    wx.createSelectorQuery().selectAll('.tabs').boundingClientRect(function (tabs) {
      for (var i = 0; i < tabs.length; i++) {
        /* 开始循环匹配节点位置 */
        if (e.scrollTop >= tabs[i].dataset.top && e.scrollTop <= tabs[i+1].dataset.top) {
          that.setData({
            currentTab: i
          })
        // console.log(i);
        }
      }
    }).exec()
  },

  tomenutype: function (event) {
    console.log(event.currentTarget.dataset);
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../menutype/menutype?id=" + id
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