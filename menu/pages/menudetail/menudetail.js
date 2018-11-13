var app = getApp();
var ajaxurl = app.globalData.ajaxurl;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    databasic: {},
    materialsList:[],
    menuSteps:[],
    datashow: {},
    dataask: {},
    datarecommend: [],
    videourl: ""
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id = options.id;
    // var id = 5507;
    var id = 10128;
    this.getdata(id);
    this.getshowdata(id);
    this.getaskdata(id)
  },
  getdata: function (id) {//定义函数名称
    var that = this;   // 这个地方非常重要，重置data{}里数据时候setData方法的this应为以及函数的this, 如果在下方的sucess直接写this就变成了wx.request()的this了
    wx.request({
      url: ajaxurl +'menu/detail',
      data: {
        "id": id, 
        "userId": 1
      },
      header: {
        "version": "v440"
      },
      method: "POST",
      success: function (res) {
        console.log("菜谱详情:");
        console.log(res.data);
        that.setData({//如果在sucess直接写this就变成了wx.request()的this了.必须为getdata函数的this,不然无法重置调用函数

          databasic: res.data.data.basicInfo,
          materialsList: res.data.data.materialsList,
          menuSteps: res.data.data.menuSteps
          
        })
        var sunNameJson = res.data.data.basicInfo.subNameList;
        if (sunNameJson == null) {
          sunNameJson = ["平和质"];
        }
        that.getrecommenddata(sunNameJson);

      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },
  getshowdata: function (id) {//定义函数名称
    var that = this;
    wx.request({
      url: ajaxurl +'comment/work/list',
      data: {
        "pageNum": 1,
        "pageSize": 5,
        "refId": id,
        "userId": 1
      },
      header: {
        "version": "v440"
      },
      method: "POST",
      success: function (res) {
        console.log("晒作品列表:");
        console.log(res.data.data);
        that.setData({
          datashow: res.data.data,
        })
      },
      fail: function (err) { },
      complete: function () { }
    })
  },
  getaskdata: function (id) {//定义函数名称
    var that = this;
    wx.request({
      url: ajaxurl +'comment/answer/list',
      data: {
        "pageNum": 1,
        "pageSize": 2,
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
      fail: function (err) { },
      complete: function () { }
    })
  },
  getrecommenddata: function (sunNameJson) {//定义函数名称
    var that = this;
    wx.request({
      url: ajaxurl +'menu/getMenuByRecommend',
      data: {
        "pageNum": 1,
        "pageSize": 4,
        "subNameList": sunNameJson
      },
      header: {
        "version": "v440"
      },
      method: "POST",
      success: function (res) {
        console.log("更多推荐:");
        console.log(res.data.data);
        that.setData({
          datarecommend: res.data.data,
        })
      },
      fail: function (err) { },
      complete: function () { }
    })
  },

  /* 跳转视频页面 */
  openvideo: function (event) {
    console.log(event.currentTarget);
    console.log(event.currentTarget.dataset.id);
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../videomenu/videomenu?id=" + id
    })
  },

  /* 跳转作品列表 */
  moreshow: function (event){
    console.log(event.currentTarget.dataset.id);
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/menudetail/menushowlist/menushowlist?id=" + id
    })
  },

  /* 跳转问答列表 */
  moreask: function (event) {
    console.log(event.currentTarget.dataset.id);
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "/pages/menudetail/menuasklist/menuasklist?id=" + id
    })
  },

  /* 跳转推荐菜谱 */
  jumprecommend: function (event) {
    console.log(event.currentTarget.dataset.id);
    var id = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: "../menudetail/menudetail?id=" + id
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