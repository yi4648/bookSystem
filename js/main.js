$(function () {
     // 返回是否为超级管理员
    //  function jude() {
    //     let message = localStorage.getItem("userInfo");
    //     $('#identity').html(message.urole);
    // }
    // jude()

    // 退出登录
    $('#exit').click(function () {
        // window.location.href= "index.html"
        $.ajax({
            method: 'GET',
            // 退出登录的网址
            url: 'http://localhost:8181/logout',
            dataType: 'json',
            success: function (res) {
                if (res.msg == "success") {
                    window.location.href = "index.html"
                    localStorage.clear()
                    // window.location.reload()
                } else {
                    // window.location = "index.html"
                    alert("退出登录失败");
                }
            }
        })
    });

});

// 点击切换用户管理和图书管理界面
$('#user-manager').click(function(){
    $("#user-manager a").css("color","#fff");
    $("#book-manager a").css("color","#3588f3");
    $("#view").css("display","block")
    $("#view2").css("display","none")
})


$('#book-manager').click(function(){
    $("#book-manager a").css("color","#fff");
    $("#user-manager a").css("color","#3588F3");
    $("#view").css("display","none")
    $("#view2").css("display","block")
})
