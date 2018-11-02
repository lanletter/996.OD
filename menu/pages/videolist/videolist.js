
Page({
  /**
   * 页面的初始数据
   */
  data: {
    data:{},
    id:"",
    videourl: "",
    videopic: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option);
    var id = option.id;
    this.getdata(id);
  },

  getdata: function (id) {//定义函数名称
    var that = this;
    wx.request({
      url: 'https://api.fotilestyle.com/fotile-api-0.0.2/videoShort/detail',
      data: {
        "id": 247,
        "userId": 1
      },
      header: {
        "version": "v440"
      },
      method: "POST",
      success: function (res) {
        console.log("菜谱详情:");
        console.log(res.data);
        var data = res.data.data;
        var id = res.data.data.id;
        var videopic = res.data.data.picture.path;
        var videourl = res.data.data.url;
        console.log(videourl);
        console.log(videopic);
        that.setData({
          data: data,
          id: id,
          videourl: videourl,
          videopic: videopic
        })

      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

  bindlinkdetail: function (e){
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