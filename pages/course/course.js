//course.js
//获取应用实例
Page({
  data: {
    listData:[],
    course_empty:true,
    time:[],
    selectYear:true,
    firstYear:'2016-2017-1',
    selectArea:true
},
onShow: function(options){
  this.showCourse();
},

getTerm:function(){
  var userName = wx.getStorageSync('userName');
  var admit_year = userName.substr(0,2);//入学年份
  var year = '20'+admit_year;
  return [
    year+"-"+(parseInt(year)+1)+"-1",
    year+"-"+(parseInt(year)+1)+"-2",
    (parseInt(year)+1)+"-"+(parseInt(year)+2)+"-1",
    (parseInt(year)+1)+"-"+(parseInt(year)+2)+"-2",
    (parseInt(year)+2)+"-"+(parseInt(year)+3)+"-1",
    (parseInt(year)+2)+"-"+(parseInt(year)+3)+"-2",
    (parseInt(year)+3)+"-"+(parseInt(year)+4)+"-1",
    (parseInt(year)+3)+"-"+(parseInt(year)+4)+"-2",
  ];
},

clickYear:function(){
    var selectYear = this.data.selectYear;
    if(selectYear == true){
     this.setData({
     selectArea:true,
     selectYear:false,
  })
    }else{
     this.setData({
     selectArea:false,
     selectYear:true,
  })
    }
  } ,
  //点击切换
  mySelect:function(e){
   this.setData({
     firstYear:e.target.dataset.me,
     selectYear:true,
     selectArea:false,
   });
   this.showCourse();
  },

onLoad:function(){
  
},

showCourse:function(){
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
    var userName = wx.getStorageSync('userName');
    var course_cache = userName+this.data.firstYear; //将学号拼接年份作为缓存的key
    if(wx.getStorageSync(course_cache)){
      //缓存中有课表
      wx.hideToast();
      this.setData({
        course_empty: false,
        listData: wx.getStorageSync(course_cache),
        time: this.getTerm(),
      });
    }else{
      //缓存未找到课表
      var $this = this;
      wx.request({
      url: 'https://fupengfei.s1.natapp.cc/course_admin/get_course',
      data: {
      'username':wx.getStorageSync('userName'),
      'password':wx.getStorageSync('userPassword'),
      'time':$this.data.firstYear
      },
      method: 'GET',
      dataType: 'json',
      success: function(res){
        wx.hideToast();
      if(res.statusCode == 200 && res.data.code == 200){
        $this.setData({
          course_empty:false,
          listData:res.data.data,
          time:$this.getTerm(),
        });
        wx.setStorageSync(course_cache, res.data.data) //缓存课表
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
});
