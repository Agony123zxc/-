var schoolLeader = '';

var reg = /^[1][3,4,5,7,8][0-9]{9}$/; //手机号格式验证


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
    $('#transferNum').val('');
    $('#jobNum').val('');
    $('#timeRange').val('');
    $("#tb_departments").bootstrapTable('refresh');
}

// 树状菜单
function getTree() {
    var tree = "";
    $.ajax({
        url: 'tree.json',
        type: 'get',
        async: false,
        success: function(data) {
            console.log('树状', data);
            tree = JSON.stringify(data.data);
        }
    });
    return tree;
}





//初始化Table
var TableInit = function() {
    var oTableInit = new Object();
    oTableInit.Init = function() {
        $('#tb_departments').bootstrapTable({
            url: port + '/v1/assetAllot/findAssetsAllot',
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
                    checkbox: true
                }, {
                    field: 'aaCoding',
                    align: 'center',
                    title: '调拨单号'
                }, {
                    field: 'aaFormerUserid',
                    align: 'center',
                    title: '申请人工号'
                }, {
                    field: 'aaAllotDate',
                    align: 'center',
                    title: '调拨日期'

                }, {
                    field: 'aaOutDepartmentname',
                    align: 'center',
                    title: '原使用部门'
                }, {
                    field: 'aaFormerUsername',
                    align: 'center',
                    title: '原使用人'
                },
                {
                    field: 'aaInDepartmentname',
                    align: 'center',
                    title: '调入部门'
                }, {
                    field: 'aaNewUsername',
                    align: 'center',
                    title: '新使用人'
                }, {
                    field: 'aaAppstate',
                    align: 'center',
                    title: '状态'
                }, {
                    field: 'name6',
                    align: 'center',
                    title: '操作',
                    events: operateEvents,
                    formatter: function(value, row, index) {
                        var result = "<a href='javascript:;' class='info' style='color:#1E9DD3'>查看</a>";
                        return result;
                    }
                }
            ],

            //得到查询的参数
            queryParams: function(params) {
                var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    pageSize: params.limit, //页面大小
                    pageNum: (params.offset / params.limit) + 1, //页码
                    pJobNum: localStorage.getItem('pJobnum'),
                    aaCoding: $('#transferNum').val(), //调拨单号
                    applyPersonNum: $('#jobNum').val(), //申请人工号
                    startTime: $('#timeRange').val().substring(0, 10), //开始时间
                    endTime: $('#timeRange').val().substring(13), //结束时间
                    mark: '审批记录'
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




// 点击当前行数据审核事件
window.operateEvents = {
    'click .info': function(e, value, row, index) {

        sessionStorage.setItem('checkId', row.aaId);

        console.log('行数据', row);

        layer.open({
            type: 2,
            title: '审核',
            btn: ['关闭'],
            btnAlign: 'c',
            area: ['850px', '500px'],
            success: function(layero, index) {
                var body = layer.getChildFrame('body', index);
                layero.find('.layui-layer-btn0').css('background', '#27AAE1');


                body.find('#transferNum').attr('value', row.aaCoding); //调拨单号
                body.find('#transferDate').attr('value', row.aaAllotDate); //调拨日期
                body.find('#oldPerson').attr('value', row.aaFormerUsername); //原使用人
                body.find('#oldDepart').attr('value', row.aaOutDepartmentname); //原使用部门
                body.find('#newDepart').attr('value', row.aaInDepartmentname); //新使用部门
                body.find('#newPerson').attr('value', row.aaNewUsername); //新使用人
                body.find('#transferReason').text(row.aaBz2); //调拨原因

                // 流程展示
                $.ajax({
                    url: port + '/v1/assetAllot/auditProcessDetails',
                    type: 'get',
                    data: {
                        applyNumber: row.aaCoding
                    },
                    success: function(res) {
                        console.log('流程', res);
                        for (var i = 0; i < res.length; i++) {
                            if (res[i].detilYuliu1 == null) {
                                res[i].detilYuliu1 = '';
                            }
                            if (res[i].detilYuliu2 == null) {
                                res[i].detilYuliu2 = '';
                            }
                            body.find('.approval-progress ul').append(
                                '<li>' +
                                '<p class="name">' + res[i].auditPerson + '<span class="time">' + res[i].detilYuliu2 +

                                '</span></p>' +
                                '<p class="status">' + res[i].auditState + '</p>' +
                                '<p class="reason">' + res[i].detilYuliu1 + '</p>' +
                                '</li>');
                        }
                    }
                });


            },
            end: function() {
                sessionStorage.removeItem('checkId');
            },
            yes: function(index, layero) {
                layer.close(index)

            },

            content: 'detail.html'

        });
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
                //获取选中的选项
                for (var i = 0; i < a.length; i++) {
                    exportData[i] = a[i].aaId;
                }
                location.href = port + '/v1/assetAllot/exportAssetAllot?ids=' + exportData.toString() + '';
            }
        });


    };
    return oInit;
};