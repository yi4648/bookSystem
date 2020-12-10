$(function () {
    // 退出登录
    $('#exit').click(function () {
        console.log(2)
        $.ajax({
            method: 'GET',
            // 退出登录的网址
            url: 'http://47.107.145.174:8081/api/logout',
            dataType: 'json',
            contentType: 'application/json',
            success: function (res) {
                if (res.success == "true") {
                    console.log(1)
                    window.location= "index.html"
                    localStorage.clear()
                    // window.location.reload()
                    alter("退出登录成功")
                } else {
                    alert("退出登录失败");
                }
            }
        })
    });


    // 返回是否为超级管理员
    // function jude() {
    //     let message = localStorage.getItem("message");
    //     $('#identity').html(message.urole);
    // }
    // jude()
    // $("#prev").click = function(){
    //     alert("我是prev");
    // }

});

//点击切换