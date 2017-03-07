//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    listData:[],
    course_empty:true,
},
onShow: function(options){
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
    wx.showToast({title: '正在加载课表', icon: 'loading', duration: 10000});
    var $this = this;
    wx.request({
    url: 'https://fupengfei.s1.natapp.cc/course_admin/get_course',
    data: {
    'username':wx.getStorageSync('userName'),
    'password':wx.getStorageSync('userPassword'),
    },
    method: 'GET',
    dataType: 'json',
    success: function(res){
      wx.hideToast();
    if(res.statusCode == 200 && res.data.code == 200){
      $this.setData({course_empty:false,listData:res.data.data});
      console.log(res.data.data);
      //TODO 周五没循环出来
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
},
onLoad:function(){
  
},

showCourse: function(e){

},

});
