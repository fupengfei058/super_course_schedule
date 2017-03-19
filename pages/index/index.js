Page({
  data: {
    loadingHidden: true,
    modalHidden: true,
    modalContent: '',
    userName:'',
    userPassword:'',
    isLogin:false,
    user:'',
    successHidden:false,
    loadingHidden:false,
    logoutHidden:false
  },

formSubmit:function(e){
 var $this = this;
 console.log(e.detail.value);
 wx.showToast({title: '正在登陆', icon: 'loading', duration: 10000});
  //获得表单数据
var objData = e.detail.value;
if(objData.userName && objData.userPassword){
   // 同步方式存储表单数据
   wx.setStorageSync('userName', objData.userName);
   wx.setStorageSync('userPassword', objData.userPassword);
   wx.setStorageSync('remind', objData.remind);
   //请求教务系统
   wx.request({
    url: 'https://fupengfei.s1.natapp.cc/personal_admin/check_user',
    data: {
    'username':objData.userName,
    'password':objData.userPassword,
    },
    method: 'GET',
    dataType: 'json',
    success: function(res){
    wx.hideToast();
    if(res.statusCode == 200 && res.data.code == 200){
       wx.setStorageSync('isLogin', true);
       $this.setData({isLogin: true,user: res.data.data});
        wx.setStorageSync('user', res.data.data);//登录者的名字 树洞页面要用到
        wx.showToast({title: '已登录', icon: 'success', duration: 1500});
      }else{
          wx.setStorageSync('isLogin', false);
          $this.setData({isLogin: false});
          wx.showModal({title: '登录失败', content: '账号或密码错误!', showCancel: false});
     }
    },
    fail: function() {
    wx.hideToast();
    wx.setStorageSync('isLogin', false);
        $this.setData({isLogin: false});
        wx.showModal({title: '登录失败', content: '请检查网络设置!', showCancel: false});
    },
    })
   }else{
       wx.hideToast();
       wx.setStorageSync('isLogin', false);
        $this.setData({isLogin: false});
        wx.showModal({title: '登录失败', content: '请输入账号密码!', showCancel: false});
   }
},

logout:function(e){
    wx.showToast({title: '已退出', icon: 'success', duration: 1500});
    //销毁用户数据
    this.setData({
        isLogin: false,
        userName:'',
        userPassword:'',
    });
    wx.clearStorage();
},

 //加载完后，处理事件 
 // 如果有本地数据，则直接显示
 onLoad:function(options){
  //获取本地数据
    var userName = wx.getStorageSync('userName');
    var userPassword = wx.getStorageSync('userPassword');

    if(userName){
        this.setData({userName: userName});
    }
    if(userPassword){
        this.setData({userPassword: userPassword});
    }
 
 },
 onReady:function(){
  // 页面渲染完成
 },
 onShow:function(){
  // 页面显示
 },
 onHide:function(){
  // 页面隐藏
 },
 onUnload:function(){
     // 页面关闭
     console.log('unload');
     var remind = wx.getStorageSync('remind');
     if(!remind){
        wx.removeStorageSync('userName');
        wx.removeStorageSync('userPassword');
     }
 }
})