//获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        //请求头配置
        headers: {
            Authorization: localStorage.getItem('token') || ""
        },
        success: function (response) {
            if (response.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            //调用renderAvatar渲染用户头像
            renderAvatar(res.data)
        },
    });
}
//用户头像渲染
function renderAvatar(user) {
    //用户名称获取
    var name = user.nickname || user.username
    //设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //按需渲染用户头像
    if (user.user_pic !== null) {
        //渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase()
        $('.text-avatar').html(first).show()
    }
}
//退出功能实现
var layer = layui.layer
//点击按钮、推出
$('#btnLoginout').on('click', function () {
    //用户提示
    layer.confirm('确认退出？', { icon: 3, title: "提示" }, function (index) {
        //清空本地token
        localStorage.removeItem('token')
        //重新跳转登录页面
        location.href = 'login.html'

        //关闭confirm框
        layer.close(index)
    }
    )
})