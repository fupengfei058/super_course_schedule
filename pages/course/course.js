//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '加载中',
    _days: ['一','二','三','四','五','六','日'],
    _weeks : ['第一周','第二周','第三周','第四周','第五周','第六周','第七周','第八周','第九周','第十周','十一周','十二周','十三周','十四周','十五周','十六周','十七周','十八周','十九周','二十周'],    
    _time: [ //课程时间与指针位置的映射，{begin:课程开始,end:结束时间,top:指针距开始top格数}
      { begin: '0:00', end: '7:59', beginTop: -4, endTop: -4 },
      { begin: '8:00', end: '9:40', beginTop: 0, endTop: 200 },
      { begin: '9:41', end: '10:04', beginTop: 204, endTop: 204 },
      { begin: '10:05', end: '11:45', beginTop: 208, endTop: 408 },
      { begin: '11:46', end: '13:59', beginTop: 414, endTop: 414 },
      { begin: '14:00', end: '15:40', beginTop: 420, endTop: 620 },
      { begin: '15:41', end: '16:04', beginTop: 624, endTop: 624 },
      { begin: '16:05', end: '17:45', beginTop: 628, endTop: 828 },
      { begin: '17:46', end: '18:59', beginTop: 834, endTop: 834 },
      { begin: '19:00', end: '20:40', beginTop: 840, endTop: 1040 },
      { begin: '20:41', end: '20:49', beginTop: 1044, endTop: 1044 },
      { begin: '20:50', end: '22:30', beginTop: 1048, endTop: 1248 },
      { begin: '22:31', end: '23:59', beginTop: 1254, endTop: 1254 },
    ],
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
  }
},
onLoad:function(){
  //wx.showToast({title: '正在读取课表', icon: 'loading', duration: 10000});
    var $this = this;
    var xhr = new XMLHttpRequest;
    xhr.open('POST','http://api.course.com/course_admin/get_course');
    xhr.send();
    xhr.onloadend = function(){
      if(xhr.status = 200){
        //wx.hideToast();
        var ret = JSON.parse(xhr.responseTest);
        $this.setData({
          imgUrls : ret
        });
      }
    }
}

});
