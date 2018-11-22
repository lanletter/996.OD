// pages/impower/impower.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(getCurrentPages().length);

  },

  bindgetuserinfo:function(e){
    // console.log(e.detail);
    if (e.detail.userInfo) {
      //用户按了允许授权按钮

      var encryptedData = e.detail.encryptedData;
      var iv = e.detail.iv;
      wx.login({
        success: res => {
          // console.log(res);
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          wx.request({
            url: 'https://apptest.fotilestyle.com:666/fotile-api-0.0.2/pay/wxtokenMini',
            data: {
              "code": res.code
            },
            method: "POST",
            success: function (res) {
              // console.log(res);
              // console.log(res.data.data.session_key);
              var session_key = res.data.data.session_key
              var data = {
                "session_key": session_key,
                "iv": iv,
                "encryptedData": encryptedData
              }
              console.log(data);
            },
            fail: function (err) { },//请求失败
            complete: function (res) { }//请求完成后执行的函数
          })
        }
      })
    } else {
      //用户按了拒绝按钮
      wx.navigateBack({
        delta: 1
      })
    }
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