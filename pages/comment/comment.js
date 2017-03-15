var app = getApp();
Page({
 data:{
   evaContent  : ''
 },
 onLoad:function(){
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
 },
 //事件
 textBlur: function(e){
   if(e.detail&&e.detail.value.length>0){
    if(e.detail.value.length<12||e.detail.value.length>500){
     //app.func.showToast('内容为12-500个字符','loading',1200);
    }else{
     this.setData({
       evaContent : e.detail.value
     });
    }
   }else{
    this.setData({
      evaContent : ''
    });
    evaData.evaContent = '';
    app.func.showToast('请输入投诉内容','loading',1200);
   }
 },
 //提交事件
 evaSubmit:function(eee){  
  var that = this;
  
 }
})