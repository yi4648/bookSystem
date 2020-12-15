loginInfo = JSON.parse(localStorage.getItem("res"))
if(loginInfo.user.urole == "普通用户"){
    $('#add-user').attr("disabled","false");
    $(".modify-btn").attr("disabled","false");
    $(".delete-btn").attr("disabled","false");
}