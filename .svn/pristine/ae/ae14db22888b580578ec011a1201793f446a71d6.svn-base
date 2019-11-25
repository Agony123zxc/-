// //线上
// var port='http://zhhq.zzyedu.cn/byxassets';
// var Port = 'http://zhhq.zzyedu.cn/byxassets';


// //可以不用注释(单点登录用到)
// var Port_lit = "http://zhhq.zzyedu.cn/Hall/user/login";
// var Port_lit_out = "http://zhhq.zzyedu.cn/Hall/user/logout";



var port = 'http://192.168.1.141:99'; //世源
// var port = 'http://192.168.1.215:94'; //浩奇
// var port = 'http://192.168.1.88:94'; //秋生
// var port = 'http://192.168.1.171:8080'; //玉甫




// 获取登录用户
$.ajax({
    url: port + '/v1/applybuyAsset/getCurrentUser',
    type: 'post',
    success: function(res) {
        console.log('登录人信息', res);
        localStorage.setItem('pJobnum', res.pJobnum); //工号
        localStorage.setItem('loginPerson', res.pName); //登录人
        localStorage.setItem('loginDepart', res.depId); //登录人部门
    }
});


// 时间戳转出日期格式
function changeDateFormat(cellval) {
    var dateVal = cellval + "";
    if (cellval != null) {
        var date = new Date(parseInt(dateVal.replace("/Date(", "").replace(")/", ""), 10));
        var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
        var currentDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();

        var hours = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
        var minutes = date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
        var seconds = date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
        return date.getFullYear() + "-" + month + "-" + currentDate;
    }
}


// 打印（参数为要打印的元素）
function printPage(page) {
    var newstr = $(page).html();
    var oldstr = $('body').html();
    $('body').html(newstr);
    window.print();
    $('body').html(oldstr);
    location.reload();
    return false;
}