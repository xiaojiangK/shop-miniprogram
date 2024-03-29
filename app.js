//app.js
var e = require("utils/core.js");
App({
  getExt: function () {
    this.removeCache();
    wx.getExtConfig({
      success: (res) => {
        if (res.extConfig.extAppid) {
          this.globalData.appid = res.extConfig.extAppid;
          this.globalData.api = res.extConfig.api;
          this.globalData.approot = res.extConfig.approot;
        }
      }
    });
  },
  onLaunch: function () {
    this.getExt();
  },
  requirejs: function (e) {
    return require("utils/" + e + ".js")
  },
  getCache: function (e, t) {
    var i = +new Date / 1000,
      n = "";
    i = parseInt(i);
    try {
      n = wx.getStorageSync(e + this.globalData.appid),
        n.expire > i || 0 == n.expire ? n = n.value : (n = "", this.removeCache(e))
    } catch (e) {
      n = void 0 === t ? "" : t
    }
    return n = n || ""
  },
  setCache: function (e, t, i) {
    var n = +new Date / 1000,
      a = true,
      o = {
        expire: i ? n + parseInt(i) : 0,
        value: t
      };
    try {
      wx.setStorageSync(e + this.globalData.appid, o)
    } catch (e) {
      a = false
    }
    return a
  },
  removeCache: function (e) {
    var t = true;
    try {
      wx.removeStorageSync(e + this.globalData.appid)
    } catch (e) {
      t = false
    }
    return t
  },
  getUserInfo: function (t, i) {
    var n = this,
      a = n.getCache("userinfo");
    if (a && !a.needauth)
      return void (t && "function" == typeof t && t(a));
    wx.login({
      success: function (o) {
        console.log(o)
        if (!o.code)
          return void e.alert("获取用户登录态失败1:" + o.errMsg);
        e.post("wxapp/login", {
          code: o.code
        }, function (o) {
          console.log(o)
          return o.error ? void e.alert("获取用户登录态失败2:" + o.message) : o.isclose && i && "function" == typeof i ? void i(o.closetext, true) : void wx.getUserInfo({
            success: function (i) {
              console.log(i)
              a = i.userInfo,
                e.get("wxapp/auth", {
                  data: i.encryptedData,
                  iv: i.iv,
                  sessionKey: o.session_key
                }, function (e) {
                  wx.showToast({
                    title: '登录成功',
                    icon: 'none'
                  });
                  console.log('openid')
                  console.log(e)
                  i.userInfo.openid = o.openid,
                    i.userInfo.id = e.id,
                    i.userInfo.uniacid = e.uniacid,
                    i.needauth = 0,
                    n.setCache("userinfo", i.userInfo),
                    t && "function" == typeof t && t(a)
                })
            },
            fail: function () {
              console.log(o.openid)
              console.log(e)
              console.log(n.getCache("userinfo"))
              e.get("wxapp/check", {
                openid: o.openid
              }, function (e) {
                e.needauth = 1,
                  n.setCache("userinfo", e),
                  t && "function" == typeof t && t(a)
              })
              console.log(n.getCache("userinfo"))
            }
          })
        })
      },
      fail: function () {
        e.alert("获取用户信息失败!")
      }
    })
  },
  getSet: function () {
    var t = this;
    "" == t.getCache("sysset") && setTimeout(function () {
      var i = t.getCache("cacheset");
      e.get("cacheset", {
        version: i.version
      }, function (e) {
        e.update && t.setCache("cacheset", e.data),
          t.setCache("sysset", e.sysset, 7200)
      })
    }, 10)
  },
  url: function (e) {
    e = e || {};
    var t = {},
      i = "",
      n = "",
      a = this.getCache("usermid");
    i = e.mid || "",
      n = e.merchid || "",
      "" != a ? ("" != a.mid && void 0 !== a.mid || (t.mid = i), "" != a.merchid && void 0 !== a.merchid || (t.merchid = n)) : (t.mid = i, t.merchid = n),
      this.setCache("usermid", t, 7200)
  },
  globalData: {
    appid: "wxb976d839a7e84647",
    //api: "https://hexinshop.qiuxinpay.cn/app/ewei_shopv2_api.php?i=34",
    //approot: "https://hexinshop.qiuxinpay.cn/addons/ewei_shopv2/",
    api: "https://hexinshop.qiuxinpay.com/app/ewei_shopv2_api.php?i=1",
    approot: "https://hexinshop.qiuxinpay.com/addons/ewei_shopv2/",
    userInfo: null
  }
})