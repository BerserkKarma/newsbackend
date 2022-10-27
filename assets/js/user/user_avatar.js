$(function () {
    var layer = layui.layer
    //实现裁剪
    //DOM获取
    var $image = $('#image')
    //配置输出
    const options = {
        //纵横比
        aspectRatio: 1,
        //指定预览区域
        preview: '.img-preview'
    }
    // 创建裁剪区域
    $image.cropper(options)
    //上传按钮绑定事件
    $('#btnChooseImage').on('click', function () {
        $('#file').click()
    })
    //文件选择框绑定change事件，上传图片执行剪裁
    $('#file').on('change', function (e) {
        //事件对象的target属性中files子属性代表文件伪数组
        var filelist = e.target.files
        if (filelist.length === 0) {
            return layer.msg('请选择照片！')
        }
        // 1. 拿到用户选择的文件
        var file = e.target.files[0]
        // 2. 将文件，转化为路径
        var imgURL = URL.createObjectURL(file)
        // 3. 重新初始化裁剪区域
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', imgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })
    //裁剪后的头像上传
    //确定按钮绑定事件
    $('#btnUpload').on('click', function () {
        //用户裁剪后的图像获取
        var dataURL = $image
            .cropper('getCroppedCanvas', {
                //创建一个Canvas画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')  // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        // 调用接口上传到服务器
        $.ajax({
            method:"POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function (response) {
                if (response.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                layer.msg('更换头像成功！')
                window.parent.getUserInfo()
            }
        });
    })
})
