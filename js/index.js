function ulogin(){
    var username = $('#username').val();
    var password = $('#password').val();
    let data={
        "username": username,
        "password": password
    }
    $.ajax({
        method: 'POST',
        url: 'http://localhost:8181/login',
        dataType: 'json',
        // contentType: 'application/json',
        // data: JSON.stringify(data),
        data,
        success: function(res) {
            if(res.msg=="success"){
                // 存储本地信息
                localStorage.setItem("loginInfo",JSON.stringify(res.message));
                // console.log(localStorage.getItem("message"))
                window.location="main.html"
            }else{
                alert(res.msg);
            }
        }
    })
}  



$("#login").click(function(){
    if(document.a.username.value.length!=11){
        alert("手机号长度必须为11位！");
        document.a.username.focus();
        return;
    }
    if(document.a.password.value == ""){
        alert("密码为必填项");
        document.a.password.focus();
        return;
    }
    ulogin()
})
function checkNumber(obj){
        var reg = /^[0-9]+$/;
        if(obj!=""&&!reg.test(obj)){
        alert('只能输入数字！');
        return false;
    }
}

