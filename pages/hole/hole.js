//hole.js
let refreshing = false, refreshed = false, loadingMore = false, loadedEnd = false
Page({
  data: {
    holes_empty:true,
    holes: []
  },
 
  onReady() {
    this.getTreeHoles();
  },
  onPullDownRefresh() {
    
  },
  scrollToLower() {
    if(loadingMore || loadedEnd) return false

    loadingMore = true
    
  },
  
getTreeHoles:function(){
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
    wx.showToast({title: '正在加载树洞', icon: 'loading', duration: 10000});
    var $this = this;
      wx.request({
      url: 'https://fupengfei.s1.natapp.cc/tree_hole_admin/get_tree_holes',
      data: {},
      method: 'GET',
      dataType: 'json',
      success: function(res){
        wx.hideToast();
      if(res.statusCode == 200 && res.data.code == 200){
        $this.setData({
          holes_empty:false,
          holes:res.data.data
        });
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
},
  
  previewImage(event) {
    wx.previewImage({
      current: '', 
      urls: [event.target.dataset.originalPic]
    })
  },
  timeFormat(ms) {
    ms = ms * 1000
    let d_second,d_minutes, d_hours, d_days
    let timeNow = new Date().getTime()
    let d = (timeNow - ms)/1000
    d_days = Math.round(d / (24 * 60 * 60))
    d_hours = Math.round(d / (60 * 60))
    d_minutes = Math.round(d / 60)
    d_second = Math.round(d)
    if (d_days > 0 && d_days < 2) {
      return `${d_days} days ago`
    } else if (d_days <= 0 && d_hours > 0) {
      return `${d_hours} hours ago`
    } else if (d_hours <= 0 && d_minutes > 0) {
      return `${d_minutes} minutes ago`
    } else if (d_minutes <= 0 && d_second >= 0) {
      return 'Just now'
    } else {
      let s = new Date()
      s.setTime(ms)
      return [s.getFullYear(), s.getMonth() + 1, s.getDate()].map(this.formatNumber).join('/') + ' ' + [s.getHours(), s.getMinutes()].map(this.formatNumber).join(':')
    }
  },
  formatNumber(n) {
    n = n.toString()
    return n[1] ? n : `0${n}`
  },
})