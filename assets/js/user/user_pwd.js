//校验规则
$(function () {
    var form = layui.form
    form.verify({
        pwd: [[/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格']],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同！'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })
    //发起请求实现密码重置
    $('.layui-card-body').on('submit', function (e) {
        //阻止默认行为
        e.preventDefault()
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (response) {
                if (response.status !== 0) {
                    return layui.layer.msg('更新密码失败！')
                }
                layui.layer.msg('更新密码成功！')
                //重置表单,通过索引形式把jq对象转化成原生js对象
                $('.layui-form')[0].reset()
            }
        });
    })
})


