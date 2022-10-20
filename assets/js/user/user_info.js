//自定义校验规则
$(function () {
    var form = layui.form

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度需在1～6个字符之间！"
            }
        }
    })
})

initUserInfo()
//初始化用户基本信息的哦函数
function initUserInfo() {
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        success: function (response) {
            if (response.status !== 0) {
                return layer.msg('获取用户信息失败！')
            }
            console.log(response)
        }
    });
}
//调用form.val为表单赋值 
form.val('formUserInfo', res.data)
//表单重置
$('#btnReset').on('click', function (e) {
    //阻止默认行为
    e.preventDefault()
    initUserInfo()
});
//发起请求更新用户信息
//监听表单提交事件
$(".layui-form").on('submit', function (e) {
    //阻止默认行为
    e.preventDefault()
    //ajax
    $.ajax({
        type: "POST",
        url: "/my/userinfo",
        data: $(this).serialize(),
        success: function (response) {
            if(response.status !==0) {
                return layer.msg('更新用户信息失败！')
            }
            layer.msg('更新用户信息成功！')
            //调用父页面的方法，重新渲染用户的头像和用户信息
            window.parent.getUserInfo()
        }
    });
});