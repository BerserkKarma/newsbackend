$(function () {
    //导入layer
    var layer = layui.layer
    var form = layui.form
    iniArtCateList()
    // 获取文章分类列表
    function iniArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (response) {
                var htmlStr = template("tpl-table", response);
                $("tbody").html(htmlStr);
            },
        });
    }
    // 一、添加文章分类的功能
    //预先保存弹出层的索引
    var indexAdd = null
    //使用layer.open实现弹出层效果
    //给添加类别按钮绑定点击事件
    $("#btnAddCate").on("click", function () {
        layer.open({
            type: 1,
            area: ["500px", "250px"],
            title: " 添加文章分类",
            // 通过content指定弹出层内容
            content: $('#dialog-add').html(),
        });
    });
    //通过事件代理的形式，为form-add表单绑定submit事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg('新增分类失败！')
                }
                iniArtCateList()
                layer.msg('新增分类成功！')
                //根据索引，关闭对应的弹出层
                layer.close(indexAdd)
            }
        });
    });
    //二、点击编辑按钮弹出修改文章分类的编辑层
    var indexEdit = null
    // 事件委托，编辑按钮绑定事件
    $('tbody').on('click', '.btn-edit', function () {
        //弹出修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '修改文章分类',
            // 通过content指定弹出层内容
            content: $('#dialog-edit').html()
        })
        //为修改文章分类的编辑层填充表单数据
        //弹出层ok后，根据id值发起请求获取文章数据，然后填充进表单中
        var id = $(this).attr('data-id')
        //发起请求获取对应分类的数据,填充
        $.ajax({
            type: "GET",
            url: "/my/article/cate/" + id,
            success: function (response) {
                form.val('form-edit', response.data)
            }
        });
    });
    //更新文章分类数据
    //事件委托，绑定submit事件 
    $('tbody').on('submit', '#form-edit', function (e) {
        //阻止默认行为
        e.preventDefault()
        //发起请求修改文章分类
        $.ajax({
            type: "GET",
            url: "/my/artile/updatecate",
            data: $(this).serialize(),
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg('更新分类数据失败！')
                }
                layui.msg('更新分类数据成功')
                layui.close(indexEdit)
                iniArtCateList()
            }
        });
    });
    //三、删除文章分类
    //事件委托，为删除按钮绑定点击事件
    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        //提示用户是否删除
        layer.confirm('确认删除？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                type: "GET",
                url: "/my/article/deletecate/" + id,
                success: function (response) {
                    if (response.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功')
                    layer.close(index)
                    iniArtCateList()
                }
            });
        })
    });

})