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
    $('#apply_num').val('');
    $('#apply_person').val('');
    $('#apply_depart').val('');
    $('#timeRange').val('');
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
            url: port + '/v1/assetPurchaseApply/findRecords',
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
                    field: 'applyNum',
                    align: 'center',
                    title: '申请单号'
                }, {
                    field: 'applyTime',
                    align: 'center',
                    title: '申请时间',
                    formatter: function(value, row, index) {
                        return changeDateFormat(value);
                    }
                }, {
                    field: 'applyPerson',
                    align: 'center',
                    title: '申请人'
                }, {
                    field: 'applyPersonNumber',
                    align: 'center',
                    title: '工号'
                }, {
                    field: 'applyPersonDepart',
                    align: 'center',
                    title: '申请部门'
                }, {
                    field: 'applyState',
                    align: 'center',
                    title: '状态'
                },
                {
                    field: 'applyRemarks',
                    align: 'center',
                    title: '备注'
                },

                {
                    field: 'name8',
                    align: 'center',
                    title: '操作',
                    events: operateEvents,
                    formatter: function(value, row, index) {
                        var result = "<a href='javascript:;' class='info'>查看</a>";
                        return result;
                    }
                }
            ],

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



    //得到查询的参数
    oTableInit.queryParams = function(params) {

        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            pageSize: params.limit, //页面大小
            pageNum: (params.offset / params.limit) + 1, //页码
            startTime: $('#timeRange').val().substring(0, 10), //开始时间
            endTime: $('#timeRange').val().substring(13), //结束时间
            applyPerson: $('#apply_person').val(), //申请人
            applyPersonNumber: $('#apply_job_num').val(), //工号
            applyNum: $('#apply_num').val(), //申请单号
        };
        return temp;
    };


    return oTableInit;
};



// 点击当前行数据详情事件
window.operateEvents = {
    'click .info': function(e, value, row, index) {
        console.log('行数据', row);

        sessionStorage.setItem('checkId', row.id);
        sessionStorage.setItem('applyId', row.applyNum);

        layer.open({
            type: 2,
            title: '详情',
            btn: ['打印', '关闭'],
            btnAlign: 'c',
            area: ['1000px', '500px'],
            end: function() {
                sessionStorage.removeItem('checkId');
                sessionStorage.removeItem('applyId');
            },
            yes: function(index, layero) {
                var body = layer.getChildFrame('body', index);
                printPage(body.find('#content')); //打印
            },
            success: function(layero, index) {

                layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                layero.find('.layui-layer-btn1').css('background', '#fff');

                var body = layer.getChildFrame('body', index);

                body.find('#applyPerson').attr('value', row.applyPerson); //申请人员
                body.find('#applyDepart').attr('value', row.applyPersonDepart); //申请部门
                body.find('#applyNum').attr('value', row.applyNum); //申请单号
                body.find('#project-necessity').text(row.applyProjectNecessity); //项目必要性
                body.find('#project-requre').text(row.applyProjectRequire); //项目具体要求
                body.find('#applyDate').attr('value', changeDateFormat(row.applyTime)); //申请单号
                body.find('#project-name').attr('value', row.applyProjectName); //项目名称
                body.find('#phone').attr('value', row.applyTelephone); //联系电话
                body.find('#price').attr('value', row.applyBudgetPrice); //预算金额
                body.find('#done-time').attr('value', row.applyCompleteTime); //完成时限


                // 审批流程
                $.ajax({
                    url: port + '/v1/assetPurchaseApply/auditProcessDetails',
                    type: 'get',
                    data: {
                        applyId: row.applyNum
                    },
                    success: function(res) {
                        console.log('审批流程', res);

                        for (var i = 0; i < res.length; i++) {
                            if (res[i].detilYuliu1 == null) {
                                res[i].detilYuliu1 = '';
                            }
                            body.find('.approval-progress ul').append(
                                '<li>' +
                                '<p class="name">' + res[i].auditPerson + '<span class="time">' + res[i].detilYuliu2 + '</span></p>' +
                                '<p class="status">' + res[i].auditState + '</p>' +
                                '<p class="reason">' + res[i].detilYuliu1 + '</p>' +
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
        $("#btn_export").on('click', function() {
            var a = $("#tb_departments").bootstrapTable('getSelections');
            var selectData = [];

            if (a.length == 0) {
                layer.msg('请选择要导出的数据');
            } else {

                for (var i = 0; i < a.length; i++) {
                    selectData[i] = a[i].id;
                }

                location.href = port + '/v1/assetPurchaseApply/exportApplyBuy?ids=' + selectData.toString();
            }
        });


    };
    return oInit;
};