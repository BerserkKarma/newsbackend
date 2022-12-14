$(function () {
    var layer = layui.layer
    // 为form重新渲染机制做准备
    var form = layui.form
    //layui分页所需要的laypage对象导出
    var laypage = layui.page
    //定义查询参数对象q，请求数据时便于发送给服务器，此处设置为默认值
    var q = {
        pagenum: 1,  //页码值，默认请求第一页数据
        pagesize: 2, //每页显示几条数据，默认每页显示2条
        cate_id: '', //文章分类Id
        state: '',   //文章的发布状态
    }
    //获取文章列表数据的函数
    initTable()
    //定义获取文章列表数据函数
    function initTable() {
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg('获取文章列表失败！')
                }
                //使用模板引擎渲染页面的数据
                var htmlStr = template('tpl-table', responses)
                $('tbody').html(htmlStr)
                //调用渲染分页的函数
                renderPage(response.total)
            }
        });
    }
    //定义美化时间的过滤器，art-template自带
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        var y = dt.getFullYear
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }
    //定义补零的函数，美化补零
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    //发起请求获取文章分类
    initCate()
    //初始化文章分类函数定义
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg('获取分类数据失败！')
                }
                //调用模板引擎渲染分类可选项
                var htmlStr = template('tpl-cate', response)
                $('[name=cate_id]').html(htmlStr)
                //异步ajax请求后，通过layui重新渲染表单区域的UI的结构
                //自带render()方法
                form.render()
            }
        });
    }
    //筛选表单绑定submit事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        //获取表单中选项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询参数对象q中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新筛选条件，重新渲染表格数据
        initTable()
    });
    //渲染分页的函数定义
    function renderPage(total) {
        // 服务器返回的数据中有关于文章总数的total属性，根据此进行分页计算
        //使用layui的laypage方法渲染分页结构
        laypage.render({
            elem: 'pageBox',      //分页容器的id
            count: total,         //总数据条数
            limit: q.pagesize,    //每页显示几条数据
            curr: q.pagenum,     // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],  // 根据layui文档按顺序添加不同功能
            limits: [2, 3, 5, 10],    //其中'prev', 'page', 'next'是基础功能，count为总数功能，limit为限制每页数目显示功能，skip为跳转功能
            //分页发生切换的时候，触发jump回调
            // 触发 jump 回调的方式有两种：
            // 1. 点击页码的时候，会触发 jump 回调
            // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
            jump: function (obj, first) {
                // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
                // 如果 first 的值为 true，证明是方式2触发的
                // 否则就是方式1触发的
                console.log(first)
                console.log(obj.curr)
                //最新的页码值jump回调函数中obj对象的curr属性(代表当前页面值，即pagenum)赋值给查询参数对象q中
                q.pagenum = obj.curr
                //最新的页码值jump回调函数中obj对象的limit属性(代表当前限制条目值，即pagesize)赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                //根据最新的q获取对应的数据列表，并渲染表格
                if (!first) {
                    initTable()
                }
            }
        })
    }
    // 为删除按钮绑定点击事件处理函数
    $('.tbody').on('click', '.btn-delete', function () {
        //获取删除按钮的个数
        var len = $('.btn-delete').length
        // 获取文章的id
        var id = $(this).attr('data-id')
        //询问用户是否删除数据
        layer.comfirm('确认删除？', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/delete" + id,
                success: function (response) {
                    if (response.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            });
            layer.close(index)
        })
    })
})