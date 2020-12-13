var pageSize = null;
var queryName = null;

getList();

//根据输入的当前页码，和页的数据大小，和查询参数获取数据
function getList(pageNo, pageSize, queryParam) {
    let data = {
        "page": pageNo || 1,
        "limit": pageSize || 8,
        "queryParam": queryParam || null
    }
    $.ajax({
        method: 'GET',
        url: 'https://www.fastmock.site/mock/cd17c96264c7828050380742d4afad3d/bookSystem/manager/book/list',
        dataType: 'json',
        // contentType: 'application/json',
        // data: JSON.stringify(data),
        data,
        success: function (res) {
            if (res) {
                noPage = res.page.currPage;
                // // console.log(noPage);
                pageSize = res.page.pageSize;
                dataList = res.page.list;
                if (res.page.list == "") {
                    $("#pageNum2").val("1");
                    alert("查询错误");
                    // getList();
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
    $("#totalPage2").html(res.page.totalPage);
    let html = `<tr>
    <th>图书编号</th>
    <th>书名</th>
    <th>出版社</th>
    <th>数量</th>
    <th>录入时间</th>
    <th>图书类型</th>
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
            <td>${record && record.bookName}</td>
            <td>${record && record.bookPub}</td>
            <td>${record && record.bookType}</td>
            <td>${record && record.count}</td>
            <td>${record && record.createTime.substring(0, 10)}</td>
            <td>
                <button type="button" class="btn btn-info modify-btn" onclick="modList('${record.id}')" >修改</button>
                <button type="button" class="btn btn-danger delete-btn" onclick="delList('${record.id}')">删除</button>
            </td>
        </tr>`
    }
    $('#book-table-list').html(html);
}


//转跳的点击事件
$("#jump2").click(function () {
    // 判断查询页数是否过大
    var totalPage = $("#totalPage2").html();
    if($("#pageNum2").val() > totalPage){
        alert('查询页数过大！！');
        $("#pageNum2").val(1)
    }
    //判断查询页数是否过小
    if ($("#pageNum2").val() < 1) {
        alert("查询页数过小！！");
        $("#pageNum2").val(1)
    }
    getList($("#pageNum2").val());
    // getList()
});

//上一页的点击事件
$("#prev2").click(function () {

    var pageNum = $("#pageNum2").val();
    if (pageNum > 1) {
        pageNum--;
    }
    // console.log(pageNum);
    $("#pageNum2").val(pageNum);
    getList(pageNum, pageSize, queryName);
});
// 下一页的点击事件
$("#next2").click(function () {
    var pageNum = $("#pageNum2").val();
    var totalPage = $("#totalPage2").html();

    // console.log(totalPage);
    if (pageNum < totalPage) {
        pageNum++;
    }
    // console.log(pageNum);
    $("#pageNum2").val(pageNum);
    getList(pageNum, pageSize, queryName);
});

// 查询事件
$('#book-search').click(function () {
    var searchName = $("#search-bookName").val();
    var searchPub = $("#search-bookPub").val();
    var queryParam = {
        bookName: searchName,
        bookPub: searchPub
    }
    $("#pageNum2").val(1)
    getList(1,pageSize,queryParam);
})

// 图书录入按钮监听，实现弹出和关闭功能
$('#add-book').click(function(){
    $('#bookadd-modal').css('display','block');
})
$('#book-close-a').click(function(){
    $('#bookadd-modal').css('display','none');
})
$('.close2').click(function(){
    $('#bookadd-modal').css('display','none');
})
// 图书录入提交表单
$("#book-confirm-a").click(function(){
    let bookName = $('#bookName-a').val();
    let bookPub = $('#bookPub-a').val();
    let count = $('#count-a').val();
    // 多选框取值
    // let bt = $('#bookType').val();
    // let 
    let data={
        "bookName": bookName,
        "bookPub": bookPub,
        "count":count,
        // 多选框取值
    }
    $.ajax({
        method: 'POST',
        url: 'https://www.fastmock.site/mock/cd17c96264c7828050380742d4afad3d/bookSystem/manager/book/save',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function(res) {
            if(res.msg =="success"){
                $('#bookadd-modal').css('display','none');
                // 查看进行添加之后是否进行重新渲染
                getList();
                alert('添加成功');
            }
        },
        error: function () {
            alert("添加失败");
        }
    })
})


//删除的点击事件
function delList(id) {
    var del = confirm("是否删除");
    // console.log(del);
    if (del) {
        $.ajax({
            method: "POST",
            url: "https://www.fastmock.site/mock/cd17c96264c7828050380742d4afad3d/bookSystem/manager/book/delete" + id,// manager/message/update
            dataType: "JSON",
            contentType: 'application/x-www-form-urlencoded',
            success: function (res) {
                if (res) {
                    // 重新渲染当前页面的值
                    getList(noPage, pageSize, queryName);
                }
            }
        });
    }
}


// 修改的点击事件
function modList(id) {
    $.ajax({
        method: 'GET',
        url: 'https://www.fastmock.site/mock/cd17c96264c7828050380742d4afad3d/bookSystem/manager/book/info' + 1,
        dataType: 'json',
        success: function (res) {
            if (res.msg == "success") {
                let book = res.message;
                let html2 = `<div class="book-header">
                <button type="button" class="close2" data-dismiss="modal" aria-label="Close" ><span aria-hidden="true">&times;</span></button>
                <h4 class="book-title">图书录入</h4>
              </div>
              <div class="book-body">
                  <form name="a">
                      <p><label for="bookName">书名：</label><input type="text" name="bookName" id="bookName-m" class="gan" value="${book.bookName}"></p>
                      <p><label  for="bookPub">出版社：</label><input type="text" name="bookPub" id="bookPub-m" class="gan" value="${book.bookPub}"></p>
                      <p class="gen">
                          <label  for="count">数量：</label><input type="number" name="count" id="count-m" class="gan" value="${book.count}">
                      </p>
                      <p class="type">
                          <label for="bookType">类型:&nbsp;&nbsp;</label>
                          <select name="" id="bookType" class="gbn">
                              <option value="哲学类">哲学类</option>
                              <option value="军事类">军事类</option>
                              <option value="经济类">经济类</option>
                              <option value="文化类">文化类</option>
                              <option value="艺术类">艺术类</option>
                              <option value="综合类">综合类</option>
                              <option value="暂不分类">暂不分类</option>
                          </select>
                      </p>
                      <p>
                          <button type="button" class="btn" id="book-confirm-m">确定</button>
                          <button type="button" class="btn" id="book-close-m">取消</button>
                      </p>
                  </form>
              </div>`
                $("bookmod-modal").html(html2);
                $("#bookmod-modal").css("display", "block")
                $('#book-close-m').click(function () {
                    $('#bookmod-modal').css('display', 'none');
                })
                $('.close2').click(function () {
                    $('#bookmod-modal').css('display', 'none');
                })
                // 提交验证表单
                $("#book-confirm-m").click(function () {
                    // console.log(1)
                    let bookName = $('#bookName-m').val();
                    let bookPub = $('#bookPub-m').val();
                    let count = $('#count-m').val();
                    
                    let data = {
                        "bookName": bookName,
                        "bookPub": bookPub,
                        "count": count,
                    };
                    // console.log(data);
                    // console.log(JSON.stringify(data));
                    $.ajax({
                        method: 'POST',
                        url: 'https://www.fastmock.site/mock/cd17c96264c7828050380742d4afad3d/bookSystem/manager/book/update' + id,
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify(data),
                        success: function (res) {
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




