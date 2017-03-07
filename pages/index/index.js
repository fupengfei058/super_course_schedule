
Page({
 data:{
  userName:'',
  userPassword:'',
  user:'',
  isLogin:false
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
       //跳转到成功页面
        wx.switchTab({
            url:'../../pages/course/course',
                success:function(){
                console.log("success");
            }
        });
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
    console.log('logout');
    //销毁用户数据
    wx.setStorageSync('isLogin', false);
    this.setData({isLogin: false});
    wx.setStorageSync('userName', '');
    wx.setStorageSync('userPassword', '');
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
  //TODO 不记住密码，销毁缓存
 }
})