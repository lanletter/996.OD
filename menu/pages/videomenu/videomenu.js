// 弹幕随机色生成
function getRandomColor() {
  let rgb = []
  for (let i = 0; i < 3; ++i) {
    let color = Math.floor(Math.random() * 256).toString(16)
    color = color.length == 1 ? '0' + color : color
    rgb.push(color)
  }
  return '#' + rgb.join('')
}

var app = getApp();
var ajaxurl = app.globalData.ajaxurl;

Page({
  onReady: function (res) {
    this.videoContext = wx.createVideoContext('myVideo')
  },
  inputValue: '',
  /**
   * 页面的初始数据
   */
  data: {
    videourl: "",
    videopic: "",
    danmuList: [
      {
        text: '第 1s 出现的弹幕',
        color: '#ff0000',
        time: 1
      },
      {
        text: '第 3s 出现的弹幕',
        color: '#ff00ff',
        time: 3
      }],
    currentTime: ""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    console.log(option);
    var id= option.id;
    this.getdata(id);
  },

  getdata: function (id) {//定义函数名称
    var that = this;
    wx.request({
      url: ajaxurl +'menu/detail',
      data: {
        "id": 5507,
        "userId": 1
      },
      header: {
        "version": "v440"
      },
      method: "POST",
      success: function (res) {
        console.log("菜谱详情:");
        console.log(res.data);
        var videopic = res.data.data.basicInfo.images[0];
        var videourl = res.data.data.basicInfo.video;
        console.log(videourl);
        console.log(videopic);
        that.setData({
          videourl: videourl,
          videopic: videopic
        })

      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

  bindInputBlur: function (e) {
    this.inputValue = e.detail.value
  },

  bindtimeupdate: function (e) {
    var that = this;
    // console.log(e.detail.currentTime);
    // console.log(e.detail.duration);
    this.setData({
      currentTime: e.detail.currentTime
    })
  },

  bindSendDanmu: function (e) {
    var that = this;
    console.log("text:" + this.inputValue);
    console.log("color:" + getRandomColor());
    console.log("time:" + e.currentTarget.dataset.x);
    this.videoContext.sendDanmu({
      text: this.inputValue,
      color: getRandomColor(),
      time: e.currentTarget.dataset.x
    })
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