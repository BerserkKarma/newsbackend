//登录、注册切换
$(function () {
    //点击注册帐号
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    })
    //点击登录
    $('#link_login').on('click', function () {
        $('.login-box').show();
        $('.reg-box').hide();
    });

    //表单校验，自定义规则
    //从layui中获取form对象
    var form = layui.form
    var layer = layui.layer
    // console.log(form)
    //通过form.verify()函数自定义校验规则
    form.verify({
        // 自定义了一个叫做 pwd 校验规则
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容
            // 还需要拿到密码框中的内容
            // 然后进行一次等于的判断
            // 如果判断失败,则return一个提示消息即可
            var pwd = $('.reg-box [name=password]').val()
            if (pwd !== value) {
                return '两次密码不一致！'
            }
        }
    })
    //监听注册表单提交事件
    $('#form_reg').on('submit', function (e) {
        //阻止默认行为
        e.preventDefault()
        //ajax的post请求
        var data = {
            username: $('#form_reg [name=username]').val(),
            password: $('#form_reg [name=password]').val()
        }
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message)
            }
            layer.msg('注册成功，请登录')
            //模拟点击
            $('#link_login').click()
        })
    })
    //监听登录表单提交事件
    $('#form_login').submit(function(e){
        //阻止默认行为
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/api/login",
            //使用serialize()函数快速获取表单中的数据
            data: $(this).serialize(),  //this指向id为form_login的表单对象
            success: function (response) {
                if(response.status !==0) {
                    return layer.msg('登录失败！')
                }
                layer.msg('登录成功！')
                //登录成功的token值存在本地存储中
                localStorage.setItem('token',res.token)
                //后台主页跳转
                location.href = '/index.html'
            }
        });
    })
})

