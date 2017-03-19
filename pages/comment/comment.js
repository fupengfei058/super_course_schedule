Page({
 data:{
   is_empty : true,
   hole_id : '',
   content : '',
   hole : [],
   comments : [],
   userName: wx.getStorageSync('userName')
 },
 onLoad: function(options) {
   //获取url传递的参数
    this.setData({
      hole_id: options.holeid,
    });
    this.getHoleAndComments(options.holeid);
  },
  bindChange: function(e){
    console.log(e.detail.value);
    this.setData({
      content: e.detail.value
    });
  },
 //发表评论
 publishComment: function(){
  var $this = this;
  wx.request({
    url: 'https://fupengfei.s1.natapp.cc/tree_hole_admin/publish_comment',
    data: {
      'nick_name' : wx.getStorageSync('user'),
      'stu_no' : wx.getStorageSync('userName'),
      'content' : $this.data.content,
      'hole_id' : $this.data.hole_id
    },
    method: 'GET',
    dataType: 'json',
    success: function(res){
    if(res.statusCode == 200 && res.data.code == 200){
       $this.setData({
         //重新渲染列表
          hole : res.data.data.hole,
          comments : res.data.data.comments,
          is_empty : false,
          content : ''
        });
        wx.showToast({title: '评论成功', icon: 'success', duration: 1500});
    }else{
      wx.showModal({title: '评论失败', content: '请检查网络设置！', showCancel: false});
    }
    },
    fail: function() {
      wx.hideToast();
      wx.showModal({title: '评论失败', content: '请检查网络设置！', showCancel: false});
    },
  })
},

//获取单条树洞以及树洞下的评论
getHoleAndComments: function(hole_id){
  var $this = this;
  wx.request({
    url: 'https://fupengfei.s1.natapp.cc/tree_hole_admin/get_hole_and_comments',
    data: {
      'hole_id' : hole_id
    },
    method: 'GET',
    dataType: 'json',
    success: function(res){
      if(res.statusCode == 200 && res.data.code == 200){
        $this.setData({
          hole : res.data.data.hole,
          comments : res.data.data.comments,
          is_empty : false
        });
      }else{
        wx.showModal({title: '加载失败', content: '请检查网络设置！', showCancel: false});
      }
    },
    fail: function() {
      wx.showModal({title: '加载失败', content: '请检查网络设置！', showCancel: false});
    },
  })
},
//删除
clickDelete: function(event){
  var commentid = event.target.dataset.commentid;
  var $this = this;
  wx.request({
    url : 'https://fupengfei.s1.natapp.cc/tree_hole_admin/delete_comment',
    data : {
      'comment_id' : commentid
    },
    method : 'GET',
    dataType : 'json',
    success : function(res){
      if(res.statusCode == 200 && res.data.code == 200){
        $this.setData({
          //重新渲染列表
          hole : res.data.data.hole,
          comments : res.data.data.comments,
          is_empty : false
        });
        wx.showToast({title: '已删除', icon: 'success', duration: 1500});
      }
    }
  });
},
})