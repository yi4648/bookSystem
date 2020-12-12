$(function () {
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


    // 返回是否为超级管理员
    function jude() {
        let message = localStorage.getItem("userInfo");
        $('#identity').html(message.urole);
    }
    jude()
    $("#prev").click = function(){
        alert("我是prev");
    }

});

//点击切换