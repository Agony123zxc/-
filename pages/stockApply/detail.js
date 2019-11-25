$(function() {

    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();


});

//查询
function searchBtn() {
    console.log('查询');
    if ($('#orgName').val() == '' && $('#orgSimpleName').val() == '') {
        return;
    }
    $("#tb_departments").bootstrapTable('refresh');
}
//重置
function resetBtn() {
    console.log('重置');
    location.reload();
}


// 打印
function printBtn() {
    var printBox = document.querySelector('.print-wrap');
    //拿到打印的区域的html内容
    var newContent = printBox.innerHTML;
    //将旧的页面储存起来，当打印完成后返给给页面。
    var oldContent = document.body.innerHTML;
    //赋值给body
    document.body.innerHTML = newContent;
    //执行window.print打印功能
    window.print();
    // 重新加载页面，以刷新数据。以防打印完之后，页面不能操作的问题
    window.location.reload();
    document.body.innerHTML = oldContent;
    return false;
}




//初始化Table
var TableInit = function() {
    var oTableInit = new Object();
    oTableInit.Init = function() {
        $('#tb_departments').bootstrapTable({
            url: port + '/v1/applybuyAsset/applyBuyAssetDetail',
            method: 'get',
            locale: 'zh-CN',
            toolbar: '#toolbar', //工具按钮用哪个容器
            striped: true, //是否显示行间隔色
            cache: false, //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true, //是否显示分页（*）
            sortable: true, //是否启用排序
            sortOrder: "asc", //排序方式
            queryParams: oTableInit.queryParams, //查询参数
            sidePagination: "server", //分页方式：client客户端分页，server服务端分页（*）
            pageNum: 1, //初始化加载第一页，默认第一页
            pageSize: 20, //每页的记录行数（*）
            pageList: [10], //可供选择的每页的行数（*）
            search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            strictSearch: true,
            showColumns: true, //是否显示所有的列
            showRefresh: true, //是否显示刷新按钮
            minimumCountColumns: 2, //最少允许的列数
            clickToSelect: true, //是否启用点击选中行
            // height: $(window).height(), //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "areaId", //每一行的唯一标识，一般为主键列
            showToggle: false, //是否显示详细视图和列表视图的切换按钮
            cardView: false, //是否显示详细视图
            detailView: false, //是否显示父子表
            columns: [{
                    field: 'applyAssetNum',
                    align: 'center',
                    title: '项目名称'
                }, {
                    field: 'applyAssetName',
                    align: 'center',
                    title: '联系电话'
                }, {
                    field: 'applyAssetType',
                    align: 'center',
                    title: '资产类别'
                }, {
                    field: 'applyAssetNumber',
                    align: 'center',
                    title: '数量'
                }
            ],

            //加载成功时执行
            onLoadSuccess: function(data) {
                console.log('成功加载表格数据', data);
                // $('.fixed-table-container').css({'height':$(window).height()-290+'px'})
                // $('.panel-body').css({'height':$(window).height()+'px'});
            },
            //加载失败时执行
            onLoadError: function() {},
            onClickRow: function(row, $element) {}
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function(params) {
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            pageSize: params.limit, //页面大小
            pageNum: (params.offset / params.limit) + 1, //页码
            applyId: sessionStorage.getItem('buyApplyCheckId') //采购申请查看的id

        };
        return temp;
    };


    return oTableInit;
};


// 导出
$('#btn_export').on('click', function() {
    location.href = port + '/organize/export';
});









// 工具栏按钮事件
var ButtonInit = function() {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function() {

    };
    return oInit;
};