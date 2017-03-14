//grade.js
Page({
  data: {
    grade_empty: true,
    grade: [],
    list: []
  },

  widgetsToggle: function (e) {
    var id = e.currentTarget.id
    var list = this.data.list
    for (var i = 0, len = list.length; i < len; ++i) {
      if (list[i].id == id) {
        list[i].open = !list[i].open
      } else {
        // list[i].open = false
      }
    }
    this.setData({
      list: list
    })
  },

onShow:function(){
  this.getGrade();
},

getGrade:function(){
if(!wx.getStorageSync('isLogin')){
      wx.showModal({title: '加载失败', content: '请先登录！', showCancel: false, success: function(res) {
        wx.switchTab({
          url:'../../pages/index/index',
            success:function(){
              console.log("called switchtab.");
        }
      });
    }});
  }else{
    //已登录
    wx.showToast({title: '正在加载成绩', icon: 'loading', duration: 10000});
    if(wx.getStorageSync('grade_cache')){
      wx.hideToast();
      this.setData({
        grade_empty: false,
        list: wx.getStorageSync('grade_cache'),
      });
    }else{
      var $this = this;
      wx.request({
      url: 'https://fupengfei.s1.natapp.cc/grade_admin/get_all_grade',
      data: {
      'username':wx.getStorageSync('userName'),
      'password':wx.getStorageSync('userPassword'),
      },
      method: 'GET',
      dataType: 'json',
      success: function(res){
        wx.hideToast();
      if(res.statusCode == 200 && res.data.code == 200){
        $this.setData({
          grade_empty:false,
          list:res.data.data
        });
        wx.setStorageSync('grade_cache', res.data.data) //缓存成绩
        console.log(res.data.data);
      }else{
        wx.showModal({title: '加载失败', content: '请检查网络设置！', showCancel: false});
      }
      },
      fail: function() {
        wx.hideToast();
        wx.showModal({title: '加载失败', content: '请检查网络设置！', showCancel: false});
      },
      })
    }
  }
},
  
})
