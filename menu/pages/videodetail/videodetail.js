var app = getApp();
var ajaxurl = app.globalData.ajaxurl;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
    datalist: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option);
    var id = option.id;
    id = 247;
    this.getdata(247);
    this.getdatalist()
  },

  getdata: function (id) {//定义函数名称
    var that = this;
    wx.request({
      url: ajaxurl +'videoShort/detail',
      data: {
        "id": 247,
        "userId": 1
      },
      header: {
        "version": "v440"
      },
      method: "POST",
      success: function (res) {
        console.log(res.data.data);
        var data = res.data.data;
        that.setData({
          data: data
        })

      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

  getdatalist: function () {//定义函数名称
    var that = this;
    wx.request({
      url: ajaxurl +'videoShort/recommend',
      data: {
        "pageNum": 1,
        "pageSize": 4,
        "type": 1
      },
      header: {
        "version": "v440"
      },
      method: "POST",
      success: function (res) {
        console.log("更多推荐:");
        console.log(res.data.data);
        that.setData({
          datalist: res.data.data,
        })
      },
      fail: function (err) { },
      complete: function () { }
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