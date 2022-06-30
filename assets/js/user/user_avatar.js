$(function () {
    var layer = layui.layer

    // 1.1 获取裁剪区域的 DOM 元素，因为之后我们需要将图片初始化为一个裁剪区域
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,//1：代表是一个正方形区域，若要设置长方形等设置4/3...
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 为上传按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })

    // 为文件选择框绑定change事件
    $('#file').on('change', function (e) {
        // 获取用户选择的文件
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择图片')
        }
        // 得到用户选择的文件
        var file = e.target.files[0]
        // 根据选择的文件，创建一个对应的 URL 地址：
        var imgURL = URL.createObjectURL(file)
        // 重新初始化裁剪区
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', imgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 为确定按钮绑定头像更换事件
    $('#btnUpload').on('click',function(){
        // 1.拿到用户裁剪后的头像
        var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
       
      // 2.调用接口将头像上传到服务器
      $.ajax({
        method:'POST',
        url: '/my/update/avatar',
        data:{
            avatar:dataURL //avatar：表示图片
        },
        success: function(res){
            if (res.status !== 0){
                return layer.msg('更换头像失败')
            }
            layer.msg('更新头像成功')
            // 调用父级函数重新渲染头像
            window.parent.getUserInfo()
        }
      })
    })
})