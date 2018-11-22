
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        console.log(res);
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          url: 'https://apptest.fotilestyle.com:666/fotile-api-0.0.2/pay/wxtokenMini',
          data: {
            "code": res.code
          },
          method: "POST",
          success: function (res) {
            console.log(res);
            console.log(res.data.data.session_key);
            var session_key = res.data.data.session_key
            wx.getUserInfo({
              success: function (res) {
                console.log(res);
                var encryptedData = res.encryptedData
                var iv = res.iv
                var data={
                  "session_key": session_key,
                  "iv": iv,
                  "encryptedData": encryptedData
                }
                console.log(data);
              },
              fail: function (res) {
                console.log(res);
                wx.login() //session_key 已经失效，需要重新执行登录流程
              }
            })
          },
          fail: function (err) { },//请求失败
          complete: function (res) { }//请求完成后执行的函数
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              console.log(res);
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }else{
        
        }
      }
    })

    /*重新设置用户授权状态 */
    wx.openSetting({
      success(res) {

      }
    })

    wx.checkSession({
      success: function (res) {
        // console.log(res);
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail: function (res) {
        // console.log(res);
        // session_key 已经失效，需要重新执行登录流程
        wx.login() //重新登录
      }
    })

  },
  globalData: {
    userInfo: null,
    // ajaxurl: 'https://api.fotilestyle.com/fotile-api-0.0.2/',
    ajaxurl: 'https://apptest.fotilestyle.com:666/fotile-api-0.0.2/',
  },


})