$(function(){
    // 调用getUserInfo获取用户的基本信息
    getUserInfo()
})

// 点击退出事件
var layer = layui.layer
$('#btnLogout').on('click', function(){
    // 提示用户是否想确认退出
    layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
        //do something
        // 清空本地存储的token
        localStorage.removeItem('token')
        // 重新跳转到登录页面
        location.href = '/code/login.html'

        // 关闭confirm询问框
        layer.close(index);
      });
})


// 获取用户的基本信息
function getUserInfo(){
    // 调用ajax发起get请求
    $.ajax({
        method:'GET',
        url:'/my/userinfo',
        // 请求头配置对象
        // 以 /my 开头的请求路径，需要在请求头中携带 Authorization 身份认证字段，才能正常访问成功
        // 统一放在baseAPI中S
        // headers:{
        //     Authorization: localStorage.getItem('token')||' '
        // },
        // 成功后的回调函数
        success: function(res){
            //如果请求失败，则弹出消息
            if (res.status !== 0){
                return layui.layer.msg('获取用户消息失败')
            }
            // 若请求成功,则调用renderAvatar函数渲染用户的头像
            renderAvatar(res.data)//实参
        },
        // 无论获取用户消息成功还是失败，最终都会调用complete回调函数，这是complete的一个固定属性
        // complete: function(res){
        //     // console.log(res);
        //     // 在complete回调函数中，可以使用res.responseJSON得到服务器响应回来的数据
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         // 1.如果判断成功则强制清空token
        //         localStorage.removeItem('token')
        //         // 强制跳转到登录页面
        //         location.href = '/code/login.html'

        //     }
        // }

    })
}

// 渲染用户头像和名称
function renderAvatar(user){  //形参
    // nickname可能是管理员等身份优先级高于username用户自己定义的名字
    var name = user.nickname || user.username
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户的头像
    if (user.user_pic !== null){
        // 渲染图片头像、attr()方法来获取和设置元素属性
        $('.layui-nav-img').attr('src',user.user_pic).show()
        // 隐藏文本头像
        $('.text-avatar').hide()
    }else{
        // 渲染文本头像则要先隐藏图片头像
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()  //获取第一个字符将字符设为大写
        $('.text-avatar').html(first).show()
    }
}
