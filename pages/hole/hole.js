//hole.js
Page({
  data: {
    holes_empty: true,
    list: [],
    offset: 0,
    loadingHidden: false,
    userName: wx.getStorageSync('userName')
  },
 
  onShow() {
    this.getTreeHoles('newlist');
  },
  
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.getTreeHoles('newlist');
  },

  //上拉刷新
  bindscrolltoupper: function () {
    console.log('top');
    this.getTreeHoles('newlist');
  },

  //加载更多
  bindscrolltolower: function () {
    console.log('bottom')
    // this.getTreeHoles('list');
  },
  
//请求数据
getTreeHoles: function(option){
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
      data: {
        option: option,
        offset: $this.data.offset,
      },
      method: 'GET',
      dataType: 'json',
      success: function(res){
        wx.hideToast();
      if(res.statusCode == 200 && res.data.code == 200){
        $this.setData({
          // 拼接数组
          list: option == 'newlist' ? res.data.data : $this.data.list.concat(res.data.data),
          holes_empty:false,
          loadingHidden: true,
          offset: res.data.offset
        })
      }
      },
      fail: function() {
        wx.hideToast();
        wx.showModal({title: '加载失败', content: '请检查网络设置！', showCancel: false});
      },
      })
  }
},

//删除
clickDelete: function(event){
  var hole_id = event.target.dataset.holeid;
  var $this = this;
  wx.request({
    url : 'https://fupengfei.s1.natapp.cc/tree_hole_admin/delete_hole',
    data : {
      'hole_id' : hole_id
    },
    method : 'GET',
    dataType : 'json',
    success : function(res){
      if(res.statusCode == 200 && res.data.code == 200){
        $this.setData({
          list:res.data.data
        });
        wx.showToast({title: '已删除', icon: 'success', duration: 1500});
      }
    }
  });
},

support: function(event){
  var hole_id = event.target.dataset.holeid;
  var $this = this;
  wx.request({
    url : 'https://fupengfei.s1.natapp.cc/tree_hole_admin/support',
    data : {
      'hole_id' : hole_id,
      'type' : 'support',
      'offset' : $this.data.offset
    },
    method : 'GET',
    dataType : 'json',
    success : function(res){
      if(res.statusCode == 200 && res.data.code == 200){
        $this.setData({
          list:res.data.data
        });
        console.log('support');
      }
    }
  });
},

unsupport: function(event){
  var hole_id_ = event.target.dataset.holeid;
  var $this = this;
  wx.request({
    url : 'https://fupengfei.s1.natapp.cc/tree_hole_admin/support',
    data : {
      'hole_id' : hole_id_,
      'type' : 'unsupport',
      'offset' : $this.data.offset
    },
    method : 'GET',
    dataType : 'json',
    success : function(res){
      if(res.statusCode == 200 && res.data.code == 200){
        $this.setData({
          list:res.data.data
        });
        console.log('unsupport');
      }
    }
  });
},
})