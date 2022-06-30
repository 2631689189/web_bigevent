// 接口函数
$(function(){
    var form = layui.form
    var layer = layui.layer

    form.verify({
        // 自定义的校验规则
        nickname: function(value) {
            if (value.length > 6) {
              return '昵称长度必须在 1 ~ 6 个字符之间！'
            }
        }
    })
// 调用initUserInfo函数
initUserInfo()

// 初始化用户的基本信息
function initUserInfo(){
    // 发起安吉星ajax请求
    $.ajax({
        method : 'GET',
        url:'/my/userinfo',
        success: function(res){
            if(res.status !== 0){
                return layer.msg('获取用户信息失败！')
            }
            // 语法：form.val('filter', object); 
            // 第一个参数表示赋值给哪个表
            // 第二个参数用于给指定表单集合的元素赋值和取值。如果 object 参数存在，则为赋值；如果 object 参数不存在，则为取值。
            // 调用form.val()快速为表单赋值
            form.val('formUserInfo', res.data)
        }
    })
}

// 重置表单的数据
$('btnReset').on('click', function(e){
    // 阻止表单的默认重置行为
    e.preventDefault();
    // 当用户点击重置按钮时，我们只需要再次调用initUserInfo重新发起
    // Ajax请求和重新赋值一下就行
    initUserInfo()
})

// 监听表单的提交事件
$('.layui-form').on('submit', function(e){
    // 阻止表单的默认提交行为
    e.preventDefault()
    // 发起ajax数据请求
    $.ajax({
        method:'POST',
        url:'/my/userinfo',
        data: $('.layui-form').serialize() ,//快速拿到表单填写的数据
        success: function(res){
            if (res.status !== 0){
                return layer.msg('更新用户信息失败！')
            }
            layer.msg('更新用户信息成功')
            // 调用父页面中的getUserInfo方法，重新渲染用户的头像和用户的信息
            // window表示整个页面、parent：表示user_info的父级页面
            window.parent.getUserInfo()
        }
    
    })
})




})