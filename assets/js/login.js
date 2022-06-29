// 点击登录切换页面
$(function(){
    // 点击注册连接将登录页面隐藏，注册页面显示
    $('#link_reg').on('click', function(){
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击去登录将注册页面隐藏，登录页面显示
    $('#link_login').on('click', function(){
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // 从Layui中获取form对象
    var form = layui.form //表单的校验规则
    var layer = layui.layer  // 注册成功的提示规则
    // 通过form.verfy()函数自定义校验规则
    form.verify({
        username: function(value, item){ //value：表单的值、item：表单的DOM对象
            if(!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)){
              return '用户名不能有特殊字符';
            }
            if(/(^\_)|(\__)|(\_+$)/.test(value)){
              return '用户名首尾不能出现下划线\'_\'';
            }
            if(/^\d+\d+\d$/.test(value)){
              return '用户名不能全为数字';
            }
            
            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if(value === 'xxx'){
              alert('用户名不能为敏感词');
              return true;
            }
          },
        // 自定义一个叫做pwd的校验规则
        pwd:[
            /^[\S]{6,12}$/,
            '密码必须6到12位，且不能出现空格'
            // \S不能出现空格
        ],
        // 验证两次密码是否一致的规则
        repwd: function(value){  //此处的value值就是确认密码中的输入值
            // 通过形参得到确认密码框中的内容，再得到第一个密码框中的内容，两次进行等于的判断
            // 如果判断失败则return一个错误提示
            var pwd = $('.reg-box [name=password]').val()  //个人理解为获取第一个name值为password的数据
            if(pwd !== value){
                return '两次密码输入不一致'
            }
        }
    })


    // 监听注册表单的提交事件
    $('#form_reg').on('submit', function(e){
        e.preventDefault() //阻止默认提交的行为
        // 发起Ajax的post请求
        $.post('http://www.liulongbin.top:3007/api/reguser',
        {username: $('#form_reg [name=username]').val(),   //{请求的参数：username和password}
        password: $('#form_reg [name=password]').val()}, function(res){
            // 对服务器返回的数据进行判断
            if(res.status !== 0){
                // return console.log('注册失败'+res.message);
                return layer.msg(res.message)
            }
            // return console.log('注册成功');
            layer.msg('注册成功，请登录')
            // 注册成功之后我们要模拟人点击了去登录从而实现自动跳转到登录界面
            $('#link_login').click()
        })  

    })

    // 监听登录表单的提交事件
    $('#form_login').on('submit', function(e){
        e.preventDefault() //阻止默认提交事件
        // 发起post请求
        $.ajax({
            url:'http://www.liulongbin.top:3007/api/login',
            method:'POST',  //请求方式
            // serialize：快速获取表单中的数据
            data:$(this).serialize(), //this指的就是当前的form_login
            success: function(res){
                if(res.status !== 0){
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功')
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 登录成功后要自动跳转到后台主页
                location.href = '/code/index.html'
            }
        })
    })
})

