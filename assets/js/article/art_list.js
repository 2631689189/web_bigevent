$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (data) {
        const dt = new DataTransfer(data)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    // 定义一个查询的参数对象，将来请求数据的时候，
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 调用方法
    initTable()
    initCate()

    // 获取文章列表数据的方法，会根据q中的内容发起数据请求
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            // 提交的参数q
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败')
                }
                // 使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                // 调用渲染分页的方法
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                // 调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 通知layui重新渲染表单区域的ui结构
                form.render()
            }
        })
    }

    // 为筛选表单绑定submit时间
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 通过属性选择器获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件重新渲染表格数据
        initTable()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render方法来渲染分页结构
        laypage.render({
            elem: 'pageBox',  //分页容器的id
            count: total,  //总数据条数
            limit: q.pagesize,  //每页显示几条数据
            curr: q.pagenum, //设置默认被选中页
            layout: ['count','limit','prev','page','next','skip'],  //顺序很重要
            limits:[2, 3, 5, 10] ,
            // 分页发生切换的时候，触发jump回调
            // 只要调用了laypage.render方法，就会触发jump回调，造成死循环
            // 点击页码的时候，会触发jump回调
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // console.log(first);
                // 把最新的页码值，赋值到q这个查询对象中
                q.pagenum = obj.curr
                // 把最新的条目数赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit
                // 根据最新的q，重新渲染页面，从而实现页表数据的变化
                // initTable()  //这会造成死循环，导致页面一直重复渲染
                // console.log(first);当通过点击页码则first值为undefind，通过render方法得到的
                // first值为turn，所以我们可以通过if判断，若first值为undefind才执行initTable函数重新渲染页面
                if (! first){
                    initTable()
                }
            }
        })
    }

    // 通过代理的形式为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.btn-delete', function(){
        // 获取删除按钮的个数
        var len = $('.btn-delete').length
        // 获取到文章的id
        var id = $(this).attr('data-Id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            // 发起ajax请求删除数据
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/'+id,
                success: function(res){
                    if(res.status !== 0){
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    // 删除成功之后要重新渲染页面
                    // 当数据删除完成后需要判断当前这一页是否还有剩余数据，
                    // 如果没有数据了，则让页码值-1之后再重新调用initTable方法渲染
                    if (len === 1){
                        // 若len值为1，则说明删除后该fm页面上就没有任何数据了，
                        // 此时我们应该自动跳转到上一个页面中
                        // 页码值最小必须为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            
            layer.close(index);
          });
    })
})