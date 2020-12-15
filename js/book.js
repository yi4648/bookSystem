// var dataList = null;
var noPageBook= null;
var pageSize = null;
var queryName = null;
// getBookList()
//根据输入的当前页码，和页的数据大小，和查询参数获取数据

function getBookList(pageNo, pageSize, bookName,bookPub) {
    let data = {
        "page": pageNo || 1,
        "limit": pageSize || 8,
        "bookName":bookName||null,
        "bookPub":bookPub||null
    }
    $.ajax({
        method: 'GET',
        // url: 'https://www.fastmock.site/mock/cd17c96264c7828050380742d4afad3d/bookSystem/manager/book/list',
        url: 'http://localhost:8181/manager/book/list',
        dataType: 'json',
        // contentType: 'application/json',
        // data: JSON.stringify(data),
        data,
        success: function (res) {
            if (res) {
                // console.log(res);
                noPageBook = res.page.currPage;
                // // console.log(noPageBook);
                pageSize = res.page.pageSize;
                dataList = res.page.list;
                if (res.page.list == "") {
                    $("#pageNum2").val("1");
                    alert("查询错误");
                    getBookList();
                }
                // console.log(res);
                renderBook(res);
                $("#search-bookName").val("");
                $("#search-bookPub").val("");
            }
        }
    })
}

//把数据渲染到页面
function renderBook(res) {
    // console.log(res.totalPage);
    $("#totalPage2").html(res.page.totalPage);
    let html = `<tr>
    <th>图书编号</th>
    <th>书名</th>
    <th>出版社</th>
    <th>图书类型</th>
    <th>数量</th>
    <th>录入时间</th>
    <th>操作</th>
  </tr>`;
    let books = res.page.list;
    // console.log(books);
    for (let i in books) {
        let book = books[i]
        // let time = (record.createTime).substring(0,10)
        // console.log(parseInt(res.page.currPage-1)*(res.page.pageSize)+parseInt(i)+1)
        html += `<tr>
        <td>${book && (res.page.currPage-1)*(res.page.pageSize)+parseInt(i)+1}</td>
            <td>${book && book.bookName}</td>
            <td>${book && book.bookPub}</td>
            <td>${book && book.bookType}</td>
            <td>${book && book.count}</td>
            // <td>${book && book.createTime.substring(0, 10)}</td>
            <td>
                <button type="button" class="btn btn-info modify-btn" onclick="modBookList('${book.id}')" >修改</button>
                <button type="button" class="btn btn-danger delete-btn" onclick="delBookList('${book.id}')">删除</button>
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
    getBookList($("#pageNum2").val());
    // getBookList()
});

//上一页的点击事件
$("#prev2").click(function () {

    var pageNum = $("#pageNum2").val();
    if (pageNum > 1) {
        pageNum--;
    }
    // console.log(pageNum);
    $("#pageNum2").val(pageNum);
    getBookList(pageNum, pageSize, queryName);
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
    getBookList(pageNum, pageSize, queryName);
});

// 查询事件
$('#book-search').click(function () {
    var bookName = $("#search-bookName").val();
    var bookPub = $("#search-bookPub").val();
    $("#pageNum2").val(1)
    getBookList(1,pageSize,bookName,bookPub);
})

let bookType = $("#bookType-a").val();
console.log(bookType)
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
$("#bookType-a").change(function(){
    let bookType = $("#bookType-a").val()
    $("#book-confirm-a").click(function(){
        let bookName = $('#bookName-a').val();
        if(bookName ===  ""){
            alert("书名不能为空！")
            return;
        }
        let bookPub = $('#bookPub-a').val();
        if(bookPub === ""){
            alert("出版社不能为空")
            return;
        }
        let count = $('#count-a').val();
        if(count<0){
            alert("数量不能小于0")
            return;
        }
        console.log(bookType)
        // 多选框取值
        // bookType = $("#bookType-a").val;
        // let bookType = $()
        // let
        let data={
            "bookName": bookName,
            "bookPub": bookPub,
            "count":count,
            // 多选框取值
            "bookType": bookType
        }
        console.log(data)
        $.ajax({
            method: 'POST',
            url: 'http://localhost:8181/manager/book/save',
            dataType: 'json',
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: function(res) {
                if(res.msg =="success"){
                    $('#bookadd-modal').css('display','none');
                    // 查看进行添加之后是否进行重新渲染
                    getBookList();
                    alert('添加成功');
                    $("#bookForm-a")[0].reset();
                    $("#bookType-a").val("")
                }
            },
            error: function () {
                alert("添加失败");
            }
        })
    })
})


//删除的点击事件
function delBookList(id) {
    var del = confirm("是否删除");
    // console.log(del);
    if (del) {
        $.ajax({
            method: "DELETE",
            url: "http://localhost:8181/manager/book/delete/" + id,// manager/message/update
            dataType: "JSON",
            contentType: 'application/x-www-form-urlencoded',
            success: function (res) {
                if (res) {
                    // 重新渲染当前页面的值
                    getBookList(1, pageSize, queryName);
                }
            }
        });
    }
}


// 修改的点击事件
function modBookList(id) {
    $.ajax({
        method: 'GET',
        url: 'http://localhost:8181/manager/book/info/' + id,
        dataType: 'json',
        success: function (res) {
            if (res.msg == "success") {
                let book = res.book;
                // console.log(res)
                let htmlbook = `<div class="book-header">
                <button type="button" class="close2" data-dismiss="modal" aria-label="Close" ><span aria-hidden="true">&times;</span></button>
                <h4 class="book-title">图书修改</h4>
              </div>
              <div class="book-body">
                  <form name="book-m">
                      <p><label for="bookName-m">书名：</label><input type="text" name="bookName" id="bookName-m" class="gan" value="${book.bookName}" disabled></p>
                      <p><label  for="bookPub-m">出版社：</label><input type="text" name="bookPub" id="bookPub-m" class="gan" value="${book.bookPub}"></p>
                      <p class="gen">
                          <label  for="count">数量：</label><input type="number" name="count" id="count-m" class="gan" value="${book.count}">
                      </p>
                      <p class="type">
                          <label for="bookType-m">类型:&nbsp;&nbsp;</label>
                          <select name="bookType-m" id="bookType-m" class="gbn">
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
                $("#bookmod-modal").html(htmlbook);
                $("#bookmod-modal").css("display", "block")
                console.log(book.bookType)
                $("#bookType-m").val(`${book.bookType}`)
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
                    if(bookName ===  ""){
                        alert("书名不能为空！")
                        return;
                    }
                    let bookPub = $('#bookPub-m').val();
                    if(bookPub === ""){
                        alert("出版社不能为空")
                        return;
                    }
                    let count = $('#count-m').val();
                    if(count<0){
                        alert("数量不能小于0")
                        return;
                    }


                    let data = {
                        "id":id,
                        "bookName": bookName,
                        "bookPub": bookPub,
                        "count": count
                    };
                    // console.log(data);
                    // console.log(JSON.stringify(data));
                    $.ajax({
                        method: 'POST',
                        url: 'http://localhost:8181/manager/book/update',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: JSON.stringify(data),
                        success: function (res) {
                            if (res.msg == "success") {
                                $('#bookmod-modal').css('display', 'none');
                                getBookList(noPageBook, pageSize, queryName);
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


