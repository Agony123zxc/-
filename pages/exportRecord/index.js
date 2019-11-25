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

    $("#tb_departments").bootstrapTable('refresh');
}
//重置
function resetBtn() {
    $('#exportNum').val('');
    $('#jobNum').val('');
    $("#tb_departments").bootstrapTable('refresh');
}


// 打印
$('#btn_print').click(function() {
    printPage('.fixed-table-container');
});



//初始化Table
var TableInit = function() {
    var oTableInit = new Object();
    oTableInit.Init = function() {
        $('#tb_departments').bootstrapTable({
            url: port + '/v1/outWarehouse/selectPageOutDepotOrder',
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
            pageList: [10, 20], //可供选择的每页的行数（*）
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
                checkbox: true
            }, {
                field: 'odNumber',
                align: 'center',
                title: '出库单申请单号'
            }, {
                field: 'odTime',
                align: 'center',
                title: '出库单申请时间'
            }, {
                field: 'odPersonDepart',
                align: 'center',
                title: '申请部门'
            }, {
                field: 'odPerson',
                align: 'center',
                title: '申请人'
            }, {
                field: 'odPersonNumber',
                align: 'center',
                title: '申请人工号'
            }, {
                field: 'odState',
                align: 'center',
                title: '状态'
            }, {
                field: 'remarks',
                align: 'center',
                title: '操作',
                events: operateEvents,
                formatter: function(value, row, index) {
                    var result = "<a href='javascript:;' class='info'>查看</a>";
                    return result;
                }
            }],

            //得到查询的参数
            queryParams: function(params) {

                var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    pageSize: params.limit, //页面大小
                    pageNum: (params.offset / params.limit) + 1, //页码
                    pJobNum: localStorage.getItem('pJobnum'),
                    applyPersonNum: $('#jobNum').val(), //工号
                    applyNumber: $('#exportNum').val(), //出库单号
                    mark: '出库记录'
                };
                return temp;
            },

            //加载成功时执行
            onLoadSuccess: function(data) {
                console.log('成功加载表格数据', data);
                if ($(window).height() <= 650) {
                    $('.fixed-table-container').css({ 'height': $(window).height() - 300 + 'px' });
                    $('.panel-body').css({ 'height': $(window).height() + 'px' });
                } else {
                    $('.fixed-table-container').css({ 'height': $(window).height() - 200 + 'px' });
                    $('.panel-body').css({ 'height': $(window).height() + 'px' });
                }
            },
            //加载失败时执行
            onLoadError: function() {
                if ($(window).height() <= 650) {
                    $('.fixed-table-container').css({ 'height': $(window).height() - 300 + 'px' });
                    $('.panel-body').css({ 'height': $(window).height() + 'px' });
                } else {
                    $('.fixed-table-container').css({ 'height': $(window).height() - 200 + 'px' });
                    $('.panel-body').css({ 'height': $(window).height() + 'px' });
                }
            },
            onClickRow: function(row, $element) {}
        });
    };


    return oTableInit;
};





// 点击当前行数据详情事件
window.operateEvents = {
    'click .info': function(e, value, row, index) {
        console.log('行数据', row);

        sessionStorage.setItem('checkId', row.id);



        layer.open({
            type: 2,
            title: '详情',
            btn: '关闭',
            btnAlign: 'c',
            area: ['900px', '500px'],
            end: function() {
                sessionStorage.removeItem('checkId');
            },
            success: function(layero, index) {
                var body = layer.getChildFrame('body', index);
                layero.find('.layui-layer-btn0').css('background', '#27AAE1');

                body.find('#exportNum').attr('value', row.odNumber); //出库单号
                body.find('#exportDate').attr('value', changeDateFormat(row.odTime)); //出库日期
                body.find('#getDepart').attr('value', row.odPersonDepart); //部门
                body.find('#applyJobNum').attr('value', row.odPersonNumber); //申请人工号


                // 审批流程
                $.ajax({
                    url: port + '/v1/outWarehouse/selectAuditList',
                    type: 'get',
                    data: {
                        intodepotApplyNum: row.odNumber
                    },
                    success: function(res) {
                        console.log('审批流程', res);

                        for (var i = 0; i < res.length; i++) {

                            body.find('.approval-progress ul').append(
                                '<li>' +
                                '<p class="name">' + res[i].auditPerson + '<span class="time">'+res[i].detilYuliu2+'</span></p>' +
                                '<p class="status">' + res[i].auditState + '</p>' +
                                '</li>');
                        }
                    }
                });


            },
            content: 'detail.html'

        });
        console.log('行数据', row);
    }
};





// 工具栏按钮事件
var ButtonInit = function() {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function() {


        // 导出
        $("#exportBtn").on('click', function() {
            var a = $("#tb_departments").bootstrapTable('getSelections');
            var exportData = []; //要导出的数据

            if (a.length == 0) {
                console.log(exportData);
                layer.msg('请勾选要导出的数据');
            } else {
                for (var i = 0; i < a.length; i++) {
                    exportData[i] = a[i].id;
                }
                //获取选中的选项
                location.href = port + '/v1/outWarehouse/exportOutDepotRecord?ids=' + exportData.toString() + '';
            }
        });


    };
    return oInit;
};