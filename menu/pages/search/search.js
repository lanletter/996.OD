// pages/search/search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datahotlist:{},
    inputvalue: '',
    startinput: false,
    searched: false,
    historywords: [],
    datawords: [],
    types: {},
    currentTab: 0,
    searchtype: '',
    datamenu: {},
    datavideo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'history',
      success(res) {
        console.log("搜索历史列表：");
        console.log(res.data);
        that.setData({
          historywords: res.data
        })
      }
    })
    that.gethotlist();
  },

  gethotlist: function () {
    var that = this;
    wx.request({
      url: 'https://api.fotilestyle.com/fotile-api-0.0.2/search/hotlist',
      data: { },
      method: "POST",
      success: function (res) {
        console.log("热词列表：");
        console.log(res.data);
        var datahotlist = res.data.data;
        that.setData({
          datahotlist: datahotlist
        })
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

  /* 获取输入内容 */
  bindinput: function (e) {
    var that = this;
    // console.log(e.detail);
    if (e.detail.value !== "") {
      this.setData({
        startinput:true
      })
      that.checkword(e.detail.value)
    }
  },

  /* 查询联想词 */
  checkword: function (value) {
    var that = this;
    wx.request({
      url: 'https://api.fotilestyle.com/fotile-api-0.0.2/search/suggest',
      data: {
        "keyWord": value
      },
      method: "POST",
      success: function (res) {
        console.log("联想词列表：");
        console.log(res.data);
        var datawords = res.data.data;
        that.setData({
          datawords: datawords
        })
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

  /* 删除input内容 */
  deleteinputvalue: function () {
    this.setData({
      inputvalue: '',
      startinput:false
    })
  },

  /* 提交搜索 */
  bindconfirm: function (e) {
    var that = this;
    var value = e.detail.value;
    console.log(value);
    that.getsearch(value);

    /* 存储搜索记录 */
    wx.getStorage({
      key: 'history',
      success(res) {
        var historywords = res.data;
        console.log(historywords);
        historywords.push(value)
        console.log(historywords);
        wx.setStorageSync('history', historywords);
        that.setData({
          historywords: historywords
        })
      }
    })
  },

  /* 选择联想词 */
  chooseword: function (e) {
    var that = this;
    console.log(e.currentTarget.dataset);
    var value = e.currentTarget.dataset.value;
    this.setData({
      inputvalue: value
    })
    that.getsearch(value)
  },

  /* 删除联想词 */
  deleteword: function (e) {
    var that=this;
    console.log(e.currentTarget.dataset);
    var index = e.currentTarget.dataset.index;
    //删除下标index的1个元素
    wx.getStorage({
      key: 'history',
      success(res) {
        var historywords = res.data;
        console.log(historywords);
        historywords.splice(index,1);
        console.log(historywords);
        //更新缓存和本地数据
        wx.setStorageSync('history', historywords);
        that.setData({
          historywords: historywords
        })
      }
    })
    
  },

  getsearch: function (value) {
    var that = this;
    wx.request({
      url: 'https://api.fotilestyle.com/fotile-api-0.0.2/search/searchJsonMenu',
      data: {
        "keyWord": value
      },
      header:{
        version:"v440"
      },
      method: "POST",
      success: function (res) {
        console.log("选项列表：");
        console.log(res.data);
        var types = res.data.data;
        that.setData({
          startinput: true,
          types: types,
          searchtype: types[0].searchType
        })
        that.getdatamenu(value);
        that.getdatavideo(value);
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })

    /* 更换搜索后样式 */
    this.setData({
      searched: true,
      startinput: false
    })
  },

  clicktap: function (event) {
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

  getdatamenu: function (value){
    var that=this;
    wx.request({
      url: 'https://api.fotilestyle.com/fotile-api-0.0.2/search/searchJson/v420',
      data: {
        "keyWord": value,
        "pageNum":1,
        "pageSize":10,
        "searchType":2
      },
      method: "POST",
      success: function (res) {
        console.log("菜谱列表：");
        console.log(res.data);
        var datamenu = res.data.data;
        that.setData({
          datamenu: datamenu
        })
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
    })
  },

  getdatavideo: function (value) {
    var that = this;
    wx.request({
      url: 'https://api.fotilestyle.com/fotile-api-0.0.2/search/searchJson/v420',
      data: {
        "keyWord": value,
        "pageNum": 1,
        "pageSize": 10,
        "searchType": 14
      },
      method: "POST",
      success: function (res) {
        console.log("短视频列表：");
        console.log(res.data);
        var datavideo = res.data.data;
        that.setData({
          datavideo: datavideo
        })
      },
      fail: function (err) { },//请求失败
      complete: function () { }//请求完成后执行的函数
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