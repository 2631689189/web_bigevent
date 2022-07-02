$(function () {

    var layer = layui.layer
    var form = layui.form
    // 调用
    initArtCateList()
    // 获取文章分类列表的数据
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res)  //模板引擎渲染表格、id为tpl-table 数据为res
                $('tbody').html(htmlStr)
            }
        })
    }

    // 此处的indexAdd是为了后面自动关闭弹出层
    var indexAdd = null
    // 为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 因为当我们没点击添加时，还没添加的页面，
    // 所以不能直接使用$需要通过代理的形式为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            // 指定提交的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('新增分类失败')
                }
                // 重新渲染表格数据
                initArtCateList()
                layer.msg('新增分类成功')
                // 根据索引关闭对应的弹出层
                layer.close(indexAdd)
            }
        })
    })

    var indexEdit = null
    // 通过代理的形式为btn-edit按钮绑定点击事件
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改信息的弹出层
        indexEdit = layer.open({
            type: 1,  //弹出层的类型有0、1、2、3....
            area: ['500px', '250px'],  //弹出层的宽高
            title: '修改文章分类',   //弹出层的标题
            content: $('#dialog-edit').html()   //弹出层里面的样式
        })
        // attr()方法:获取和设置元素属性,有四个表达式，可百度
        var id = $(this).attr('data-Id')
        // 发请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // 获取数据成功后需要将数据填入表格中
                form.val('form-edit', res.data)
            }
        })
    })

    // 通过代理的形式为修改分类的表单绑定提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            // 快速拿到表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res);
                    return layer.msg('更新分类数据失败')
                }
                layer.msg('更新分类数据成功')
                // 关闭弹出层
                layer.close(indexEdit)
                // 刷新表格数据
                initArtCateList()
            }
        })
    })

    // 通过代理的形式，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        // 获取删除选项的id
        var id = $(this).attr('data-id')
        // 提示用户是否确定删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            // 发起ajax请求删除数据
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/'+id,
                success: function(res){
                    if (res.status !== 0){
                        console.log(res);
                        return layer.msg('删除分类失败')
                    }
                    layer.msg('删除分类成功')
                    // 成功之后关闭弹出层
                    layer.close(index);
                    // 刷新数据
                    initArtCateList()
                }
            })

        });
    })
})