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







//初始化Table
var TableInit = function() {
    var oTableInit = new Object();
    oTableInit.Init = function() {
        $('#tb_departments').bootstrapTable({
            url: port + '/v1/assetAcceptance/findAcceptanceOrderDetailMap',
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
                field: 'intodepotAssetNum',
                align: 'center',
                title: '资产编号'
            }, {
                field: 'intodepotAssetName',
                align: 'center',
                title: '资产名称'
            }, {
                field: 'intodepotAssetType',
                align: 'center',
                title: '资产类型'
            }, {
                field: 'intodepotAssetUnit',
                align: 'center',
                title: '单位'
            }, {
                field: 'intodepotAssetPrice',
                align: 'center',
                title: '单价'
            }, {
                field: 'intodepotAssetYuliu2',
                align: 'center',
                title: '规格',
            }, {
                field: 'intodepotAssetNumber',
                align: 'center',
                title: '数量'
            }, {
                field: 'intodepotAssetRemarks',
                align: 'center',
                title: '备注'
            }],

            //加载成功时执行
            onLoadSuccess: function(data) {
                console.log('成功加载表格数据', data);
                $('.fixed-table-container').css({ 'height': $(window).height() - 180 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });
            },
            //加载失败时执行
            onLoadError: function() {
                $('.fixed-table-container').css({ 'height': $(window).height() - 180 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });
            },
            onClickRow: function(row, $element) {}
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function(params) {
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            pageSize: params.limit, //页面大小
            pageNum: (params.offset / params.limit) + 1, //页码
            id: sessionStorage.getItem('checkId')
        };
        return temp;
    };


    return oTableInit;
};

//获取所有数据
function getAllData() {
    var data = $("#tb_departments").bootstrapTable('getData');
    return data;
}


// 导出
$('#btn_export').on('click', function() {
    location.href = port + '/organize/export';
});


// 导入
// $("#btn_import").on('click', function() {
//     console.log('导入');
//     layer.open({
//         type: 1,
//         title: '导入',
//         btn: ['导入', '关闭'],
//         btnAlign: 'c',
//         area: ['470px', '320px'],
//         yes: function(index, layero) {
//             console.log('导入');
//             // layer.close(index);
//         },
//         content: `
//                 <div class="modal-body" style="overflow: hidden;margin-top: 20px;">
//                             <div class="form-group col-md-12" style="padding: 0;margin: 0;z-index: 10">
//                                 <div class="col-md-3" style="padding: 0;margin: 0;text-align: center">
//                                     <label for="remarks">模板：</label>
//                                 </div>
//                                 <div class="col-md-8" style="padding: 0;margin: 0">
//                                     <a href="javascript:;"><strong>点击下载模板</strong></a>
//                                 </div>
//                             </div>
//                             <div class="form-group col-md-12" style="margin-top: 20px;">
//                                 <form id="importFile" name="importFile" class="form-horizontal" method="post" enctype="multipart/form-data">
//                                     <div class="col-md-3" style="padding: 0;margin: 0;text-align: center">
//                                         <label class="control-label">选择文件：</label>
//                                     </div>
//                                     <div class="col-md-8" style="padding: 0;margin: 0">
//                                         <input id="importFiles" name="importFiles" type="file" class="file" data-show-preview="false" placeholder="请选择您要导入的Excel文件">
//                                     </div>
//                                 </form>
//                             </div>
//                         </div>
//              `

//     });
// });


// 点击当前行数据详情事件
window.operateEvents = {
    'click .info': function(e, value, row, index) {
        layer.open({
            type: 1,
            title: '详情',
            btn: '关闭',
            btnAlign: 'c',
            area: ['470px', '320px'],
            success: function(layero, index) {
                layero.find('.layui-layer-btn0').css({ background: '#fff', color: '#333', borderColor: '#ddd', padding: '0 20px' });
            },
            content: '<div class="detail-layer">' +
                '<ul class="clearfix">' +
                '<li><span>上级机构：</span>' + row.parentName + '</li>' +
                '<li><span>编号：</span>' + row.orgCode + '</li>' +
                '<li><span>机构名称：</span>' + row.orgName + '</li>' +
                '<li><span>负责人：</span>' + row.chargePerson + '</li>' +
                '<li><span>机构简称：</span>' + row.orgSimpleName + '</li>' +
                '<li><span>联系电话：</span>' + row.phone + '</li>' +
                '<li><span>备注：</span>' + row.remarks + '</li>' +
                '</ul>' +
                '</div>'

        });
        console.log('行数据', row);
    }
};





// 工具栏按钮事件
var ButtonInit = function() {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function() {



    };
    return oInit;
};