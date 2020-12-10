function ulogin(){
    var username = $('#username').val();
    var password = $('#password').val();
    let data={
        "username": username,
        "password": password
    }
    $.ajax({
        method: 'POST',
        // url: 'http://47.107.145.174:8080/librarymanagement/login',

        // fastmock
        url:'http://47.107.145.174:8081/api/login',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        
        success: function(res) {
            if(res.success="true"){
                // 存储本地信息
                localStorage.setItem("message",res.user);
                console.log(res.user)
                window.location="main.html"
            }else{
                alert(res.msg);
            }
        }
    })
}  



$("#login").click(function(){
        ulogin()
})






