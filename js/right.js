
let message = JSON.parse(localStorage.getItem("message"));
$('#identity').html(message);
if(message.urole == "普通管理员"){
    $('#add-user').attr("disabled","false");
    $(".modify-btn").attr("disabled","false");
    $(".delete-btn").attr("disabled","false");
}