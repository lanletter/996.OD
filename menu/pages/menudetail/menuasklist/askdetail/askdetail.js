// pages/menudetail/menuasklist/askdetail/askdetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    data: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var id = options.id;
    // id = 21527;
    this.getdata(id);
  },

  getdata: function (id) {//定义函数名称
    var that = this;
    wx.request({
      url: 'https://api.fotilestyle.com/fotile-api-0.0.2/comment/answer/detail',
      data: {
        "id": id,
        "userId": 1,
        // "pageNum": 1,
        // "pageSize": 10
      },
      header: {
        "version": "v440"
      },
      method: "POST",
      success: function (res) {
        console.log(res.data.data);
        that.setData({
          data: res.data.data,
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