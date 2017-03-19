Page({
 data:{
   content : ''
 },
  textBlur: function(e){
    console.log(e.detail.value);
    this.setData({
      content: e.detail.value
    });
  },
 //发树洞
 publishTreeHole: function(){
  var $this = this;
  wx.request({
    url: 'https://fupengfei.s1.natapp.cc/tree_hole_admin/publish_tree_hole',
    data: {
      'nick_name' : wx.getStorageSync('user'),
      'stu_no' : wx.getStorageSync('userName'),
      'content' : $this.data.content
    },
    method: 'GET',
    dataType: 'json',
    success: function(res){
    if(res.statusCode == 200 && res.data.code == 200){
       wx.switchTab({
          url:'../../pages/hole/hole',
            success:function(){
              console.log("success");
          }
        });
    }else{
      $this.publishTreeHole();
      //wx.showModal({title: '发表失败', content: '请检查网络设置001！', showCancel: false});
    }
    },
    fail: function() {
      wx.hideToast();
      wx.showModal({title: '发表失败', content: '请检查网络设置！', showCancel: false});
    },
  })
},
})