//index.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '加载中',
    _days: ['一','二','三','四','五','六','日'],
    _weeks : ['第一周','第二周','第三周','第四周','第五周','第六周','第七周','第八周','第九周','第十周','十一周','十二周','十三周','十四周','十五周','十六周','十七周','十八周','十九周','二十周'],    
    timelineTop: 0,
    scroll: {
      left: 0
    },
    targetLessons: [],
    targetX: 0, //target x轴top距离
    targetY: 0, //target y轴left距离
    targetDay: 0, //target day
    targetWid: 0, //target wid
    targetI: 0,   //target 第几个active
    targetLen: 0, //target 课程长度
    blur: false,
    today: '',  //当前星期数
    toweek: 1,  //当前周数
    week: 1,    //视图周数（'*'表示学期视图）
    lessons : [],  //课程data
    dates: [],     //本周日期
    teacher: false   //是否为教师课表
  },
  
  onLoad: function(options){
    var _this = this;
    app.loginLoad(function(){
      _this.loginHandler.call(_this, options);
    });
  },
  
  onShow: function(){
    
  },
  
  infoCardTap: function(e){
    var dataset = e.currentTarget.dataset;
    if(this.data.targetI == dataset.index){ return false; }
    this.setData({
      targetI: dataset.index
    });
  },
  infoCardChange: function(e){
    var current = e.detail.current;
    if(this.data.targetI == current){ return false; }
    this.setData({
      targetI: current
    });
  },
  chooseView: function(){
    app.showLoadToast('切换视图中', 500);
    //切换视图(周/学期) *表示学期视图
    this.setData({
      week: this.data.week == '*' ? this.data.toweek : '*'
    });
  },
  returnCurrent: function(){
    //返回本周
    this.setData({
      week: this.data.toweek
    });
  },
  currentChange: function(e){
    // 更改底部周数时触发，修改当前选择的周数
    var current = e.detail.current
    this.setData({
      week: current+1
    });
  },
  catchMoveDetail: function(){ /*阻止滑动穿透*/ },
  bindStartDetail: function(e){
    this.setData({
      startPoint: [e.touches[0].pageX, e.touches[0].pageY]
    });
  },
  
  get_kb: function(id){
    //数组去除指定值
    function removeByValue(array,val){
      for(var i=0,len=array.length;i<len;i++) {
        if(array[i]==val){array.splice(i,1);break;}
      }
      return array;
    }
    // 根据获取课表
    var _this = this, data = {
      openid: app._user.openid,
      id: id,
    };
    if(app._user.teacher && !_this.data.name){ data.type = 'teacher'; }
    //判断并读取缓存
    if(app.cache.kb && !_this.data.name){ kbRender(app.cache.kb); }
    //课表渲染
    function kbRender(_data){
      var colors = ['red','green','purple','yellow'];
      var i,ilen,j,jlen,k,klen;
      var colorsDic = {};
      var _lessons = _data.lessons;
      var _colors = colors.slice(0); //暂存一次都未用过的颜色
      // 循环课程
      for( i = 0, ilen = _lessons.length; i < ilen; i++){
        for( j = 0, jlen = _lessons[i].length; j < jlen; j++){
          for( k = 0, klen = _lessons[i][j].length; k < klen; k++){
            if (_lessons[i][j][k] && _lessons[i][j][k].class_id) {
              // 找出冲突周数,及课程数
              var conflictWeeks = {};
              _lessons[i][j][k].weeks.forEach(function(e){
                for(var n = 0; n < klen; n++){
                  if( n !== k && _lessons[i][j][n].weeks.indexOf(e)!==-1){
                    !conflictWeeks[e]?conflictWeeks[e]=2:conflictWeeks[e]++;
                  }
                }
              });
              _lessons[i][j][k].conflictWeeks = conflictWeeks;
              _lessons[i][j][k].klen = klen;
              _lessons[i][j][k].xf_num = _lessons[i][j][k].xf ? parseFloat(_lessons[i][j][k].xf).toFixed(1) : '';
              // 为课程上色
              if (!colorsDic[_lessons[i][j][k].class_id]) { //如果该课还没有被上色
                var iColors = !_colors.length ? colors.slice(0) : _colors.slice(0); // 本课程可选颜色
                if(!_colors.length){ //未用过的颜色还没用过，就优先使用
                  // 剔除掉其上边和左边的课程的可选颜色，如果i!==0则可剔除左边课程颜色，如果j!==0则可剔除上边课程颜色
                  var m, mlen;
                  if ( i!==0 ) {
                    for(m = 0, mlen = _lessons[i-1][j].length; m < mlen; m++){
                      iColors = removeByValue(iColors, _lessons[i-1][j][m].color);
                    }
                  }
                  if ( j!==0 && _lessons[i][j-1][k] && _lessons[i][j-1][k].color ) {
                    for(m = 0, mlen = _lessons[i][j-1].length; m < mlen; m++){
                      iColors = removeByValue(iColors, _lessons[i][j-1][m].color);
                    }
                  }
                  // 如果k!==0则剔除之前所有课程的颜色
                  if ( k!==0 ) {
                    for(m = 0; m < k; m++){
                      iColors = removeByValue(iColors, _lessons[i][j][m].color);
                    }
                  }
                  //如果为空，则重新补充可选颜色
                  if (!iColors.length) { iColors = colors.slice(0); }
                }
                //剩余可选颜色随机/固定上色
                // var iColor = iColors[Math.floor(Math.random()*iColors.length)];
                var iColor = iColors[0];
                _lessons[i][j][k].color = iColor;
                colorsDic[_lessons[i][j][k].class_id] = iColor;
                if(_colors.length){ _colors = removeByValue(_colors, iColor); }
              } else {
                //该课继续拥有之前所上的色
                _lessons[i][j][k].color = colorsDic[_lessons[i][j][k].class_id];
              }
            }
          }
        }
      }
      var today = parseInt(_data.day);  //0周日,1周一
      today = today === 0 ? 6 : today-1; //0周一,1周二...6周日
      var week = _data.week;
      var lessons = _data.lessons;
      //各周日期计算
      var nowD = new Date(),
          nowMonth = nowD.getMonth() + 1,
          nowDate = nowD.getDate();
      var dates = _this.data._weeks.slice(0);  //0:第1周,1:第2周,..19:第20周
      dates = dates.map(function(e,m){
        var idates = _this.data._days.slice(0);  //0:周一,1:周二,..6:周日
        idates = idates.map(function(e,i){
          var d = (m === (week-1) && i === today) ? nowD : new Date(nowD.getFullYear(), nowD.getMonth(), nowD.getDate()-((week-1-m)*7+(today-i)));
          return {
            month: d.getMonth() + 1,
            date: d.getDate()
          }
        });
        return idates;
      });
      _this.setData({
        today : today,
        week : week,
        toweek: week,
        lessons : lessons,
        dates: dates,
        remind: ''
      });
    }
    wx.showNavigationBarLoading();
    //获取课表
    wx.request({
      url: "http://api.course.com/course_admin/get_course",
      method: 'POST',
      data: app.key(data),
      success: function(res) {
        if (res.data && res.data.status === 200){
          var _data = res.data.data;
          if(_data) {
            if(!_this.data.name){
              //保存课表缓存
              app.saveCache('kb', _data);
            }
            kbRender(_data);
          }else{ _this.setData({ remind: '暂无数据' }); }

        }else{
          app.removeCache('kb');
          _this.setData({
            remind: res.data.message || '未知错误'
          });
        }
      },
      fail: function(res) {
        if(_this.data.remind == '加载中'){
          _this.setData({
            remind: '网络错误'
          });
        }
        console.warn('网络错误');
      },
      complete: function() {
        wx.hideNavigationBarLoading();
      }
    });
  }
});
