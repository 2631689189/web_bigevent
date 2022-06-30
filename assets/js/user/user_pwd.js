$(function(){
    var form = layui.form
// 校验密码
    form.verify({
        pwd: [
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
        ],
        // 判断新旧密码是否一致
        samepwd:function(value){  //value:指的是在新密码框中填写的值
            if (value === $('[name=oldPwd').val()){
                return '新密码不能和旧密码一样'
            }
        },
        // 判断两次密码是否一致
        samerePwd:function(value){
            if (value !== $('[name=newPwd]').val()){
                return '两次密码不一致，请重修修改'
            }
        }
    })

    // 提交表单和ajax请求
    $('.layui-form').on('submit', function(e){
        // 阻止默认提交行为
        e.preventDefault()
        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            //获取服务器响应返回的data数据、 serialize：快速获取表单中的数据
            data:$(this).serialize(),
            success: function(res){
                if (res !== 0){
                    // res.responseJSON.message
                    // console.log(res.responseJSON.message);
                    return layui.layer.msg('原密码错误')
                }
                layui.layer.msg('更新密码成功')
                // 通过[0]的形式将jquery元素转换成原生的dom元素，这样就可以调用reset方法
                // reset方法：重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})