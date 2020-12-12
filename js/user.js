var dataList = null;
var noPage = null;
var pageSize = null;
var queryName = null;
//在页面刷新的第一次就执行获取数据
getList();

//根据输入的当前页码，和页的数据大小，和查询参数获取数据
function getList(pageNo, pageSize, searchName) {
    let data = {
        "page": pageNo || 1,
        "limit": pageSize || 8,
        "name": searchName || null
    }
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8181/manager/message/list',
        dataType: 'json',
        // contentType: 'application/json',
        // data: JSON.stringify(data),
        data,
        success: function (res) {
            if (res) {
                noPage = res.page.currPage;
                // console.log(noPage);
                pageSize = res.page.pageSize;
                dataList = res.page.list;
                // queryname = queryParam;
                //判断查询页数是否超过总页数
                // console.log(res);
                if (res.list == "") {
                    $("#pageNum").val("1");
                    alert("查询错误");
                    getList();
                }
                // console.log(res);
                render(res);
            }
        }
    })
}


//把数据渲染到页面
function render(res) {
    // console.log(res.totalPage);
    $("#totalPage").html(res.page.totalPage);
    let html = `<tr>
    <th>编号</th>
    <th>账号</th>
    <th>姓名</th>
    <th>性别</th>
    <th>角色</th>
    <th>录用时间</th>
    <th>操作</th>
</tr>`;
    let records = res.page.list;
    for (let i in records) {
        let record = records[i]
        // console.log(record.fullName)
        // let time = (record.createTime).substring(0,10)
        // console.log(parseInt(res.page.currPage-1)*(res.page.pageSize)+parseInt(i)+1)
        html += `<tr>
        <td>${record && (res.page.currPage-1)*(res.page.pageSize)+parseInt(i)+1}</td>
            <td>${record && record.uno}</td>
            <td>${record && record.uname}</td>
            <td>${record && record.usex}</td>
            <td>${record && record.urole}</td>
            <td>${record && record.createtime.substring(0, 10)}</td>
            <td>
                <button type="button" class="btn btn-info modify-btn" onclick="modList('${record.no}')" >修改</button>
                <button type="button" class="btn btn-danger delete-btn" onclick="delList('${record.no}')">删除</button>
            </td>
        </tr>`
        if(user.urole == "管理员"){
            $(".modify-btn").attr("disabled","false");
            $(".delete-btn").attr("disabled","false");
        }
    }
    $('#table-list').html(html);
}


// 页面显示当前的页数
//转跳的点击事件
$("#jump").click(function () {
    // 判断查询页数是否过大
    var totalPage = $("#totalPage").html();
    if($("pageNum").val() > totalPage){
        alert('查询页数过大！！');
        $("#pageNum").val(1)
    }
    //判断查询页数是否过小
    if ($("#pageNum").val() < 1) {
        alert("查询页数过小！！");
        $("#pageNum").val(1)
    }
    getList($("#pageNum").val());
});

//上一页的点击事件
$("#prev").click(function () {

    var pageNum = $("#pageNum").val();
    if (pageNum > 1) {
        pageNum--;
    }
    // console.log(pageNum);
    $("#pageNum").val(pageNum);
    getList(pageNum, pageSize, queryName);
});
// 下一页的点击事件
$("#next").click(function () {
    var pageNum = $("#pageNum").val();
    var totalPage = $("#totalPage").html();

    // console.log(totalPage);
    if (pageNum < totalPage) {
        pageNum++;
    }
    // console.log(pageNum);
    $("#pageNum").val(pageNum);
    getList(pageNum, pageSize, queryName);
});



//搜索的点击事件
$('#search').click(function () {
    var searchName = $("#searchName").val();
    // var queryParam = {
    //     name: searchName
    // }
    $("#pageNum").val(1)
    getList(1,pageSize,searchName);
})


//添加用户的点击事件
// 添加用户按钮监听，实现弹出和关闭功能
$('#add-user').click(function () {
    $('#add-modal').css('display', 'block');
})
$('#add-close').click(function () {
    $('#add-modal').css('display', 'none');
})
$('.close').click(function () {
    $('#add-modal').css('display', 'none');
})
// 性别选择
function gd(t){
    t.setAttribute('checked','true')
}
var aGender = $('input[name="gender"]')
// 添加用户提交表单
$("#add-confirm").click(function () {
    let uno = $('#account').val();
    let password = $('#password').val();
    let uname = $('#addUame').val();
    let usex;
    for(var a of aGender){
        if(a.checked){
            usex = a.getAttribute('value')
        }
    }
    let data = {
        "uno": uno,
        "password": password,
        "uname": uname,
        "usex": usex
    }
    $.ajax({
        method: 'POST',
        url: 'http://localhost:8181/manager/message/save/',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (res) {
            if (res.msg == "success") {
                $('#add-modal').css('display', 'none');
                getList(noPage, pageSize, queryName);
                console.log(res.msg)
                alert('添加成功');
            }
        },
        error: function () {
            alert("账号已存在")
        }
    })
})




//删除的点击事件
function delList(no) {
    // console.log(id);
    // console.log(noPage);
    var del = confirm("是否删除");

    // console.log(del);
    if (del) {
        $.ajax({
            method: "DELETE",
            url: "http://localhost:8181/manager/message/delete/" + no,// manager/message/update
            dataType: "JSON",
            contentType: 'application/x-www-form-urlencoded',
            success: function (res) {
                if (res) {
                    getList(noPage, pageSize, queryName);
                }
            }
        });
    }
}


// 修改的点击事件
function modList(no) {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8181/manager/message/info/' + no,
        dataType: 'json',
        success: function (res) {
            if (res.msg == "success") {
                let user = res.message;
                let html2 = `<div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="mod-del"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">修改用户</h4>
                </div>
                <div class="modal-body">
                  <form name="a">
                      <p><label for="uno">账号：</label><input type="tel" name="uno" id="uno" class="gen" value="${user.uno}" disabled></p>
                      <p><label for="x-password">密码：</label><input type="password" name="password" id="x-password" class="gen" value="${user.password}">
                          <span id="error1" class="error1">密码安全系数过低！</span>
                      </p>
                      <p><label  for="x-username">姓名：</label><input type="text" name="dd" id="x-username" class="gen" value="${user.uname}"></p>
                      <p class="sex">
                          <label for="gender">性别：
                              <input type="radio" name="gender"  value="男" onclick="gd(this)"/>男
                              <input type="radio" name="gender" value="女" onclick="gd(this)"/>女
                          </label>
                      </p>
                      <p>
                          <button type="button" class="btn btn-default" id="mod-confirm">确定</button>
                          <button type="button" class="btn btn-default" id="mod-close" >取消</button>
                      </p>
                  </form>`
                $("#mod-modal").html(html2);
                $("#mod-modal").css("display", "block")
                $('#mod-del').click(function () {
                    $('#mod-modal').css('display', 'none');
                })
                $('#mod-close').click(function () {
                    $('#mod-modal').css('display', 'none');
                })
                // 提交验证表单
                function gd(t){
                    t.setAttribute('checked','true')
                }
                var aGender = $('input[name="gender"]')
                $("#mod-confirm").click(function () {
                    console.log(1)
                    let uno = $('#uno').val();
                    let password = $('#x-password').val();
                    let uname = $('#x-username').val();
                    let usex;
                    for(var a of aGender){
                        if(a.checked){
                            usex = a.getAttribute('value')
                        }
                    }
                    let data = {
                        "uno": uno,
                        "password": password,
                        "uname": uname,
                        "usex": usex
                    };
                    console.log(data);
                    console.log(JSON.stringify(data));
                    $.ajax({
                        method: 'POST',
                        url: 'http://localhost:8181/manager/message/update/' + no,
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify(data),
                        success: function (res) {
                            console.log(2)
                            console.log(res)
                            if (res.msg == "success") {
                                $('#mod-modal').css('display', 'none');
                                getList(noPage, pageSize, queryName);
                                alert("修改成功",res.msg);
                            } else {
                                alert(res.msg)
                            }

                        }
                    })
                })
            } else {
                alert(res.msg)
            }

        }
    })


}











































// function test(){
//     if(document.aa.bb.value.length!=11){
//     alert("手机号长度必须为11位！");
//     document.aa.bb.focus();
//     return false;
//     }
//     if(document.aa.cc.value == ""){
//     alert("密码为必填项");
//     document.aa.cc.focus();
//     return false;
//     }
// }
// $('#error1').click(function(){
//     $('#essor1').css('display',"none");
// })
//   function checkNumber(obj){
//     var reg = /^[0-9]+$/;
//     if(obj!=""&&!reg.test(obj)){
//     alert('只能输入数字！');
//     return false;
//     }
// }