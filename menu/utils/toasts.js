const loading = date => {
  // wx.startPullDownRefresh()
  wx.showLoading({
    title: '加载中',
  })
}

const iferror = date => {
  // 判断网络状态
  wx.getNetworkType({
    success: function (res) {
      // 返回网络类型, 有效值：
      // wifi/2g/3g/4g/unknown(Android下不常见的网络类型)/none(无网络)
      var networkType = res.networkType;
      // console.log(networkType);
      if (networkType == "none") {
        wx.showToast({
          title: '网络好像有点问题，请检查后再重试！',
          duration: 2000
        })
      }
    }
  })
}

const fail = date => {
  wx.showToast({
    title: '请求失败',
    icon: 'fail',
    duration: 2000
  })
}

const finish = date => {
  // wx.stopPullDownRefresh()
  wx.hideLoading()
}

module.exports = {
  loading: loading,
  iferror: iferror,
  fail: fail,
  finish: finish
}