var treeText = ''; //点击的数文本


$(function() {

    // 树状数据
    $('#tree').treeview({
        data: getTree()
    });

    // 选择一个节点
    $('#tree').on('nodeSelected', function(event, data) {
        console.log('树状菜单', data);
        treeText = data.text;
        console.log('树文本>>>', treeText);
        $("#tb_departments").bootstrapTable('refresh');

    });
    // 取消选择一个节点
    $('#tree').on('nodeUnselected', function(event, data) {
        console.log('树状菜单', data);
        treeText = '';
        console.log('树文本>>>', treeText);
        $("#tb_departments").bootstrapTable('refresh');

    });



    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();



});

//查询
function searchBtn() {
    if (treeText == '') {
        layer.msg('请先选择左侧资产类型');
        return;
    }
    $("#tb_departments").bootstrapTable('refresh');
}
//重置
function resetBtn() {
    $('#searchName').val('');
    $("#tb_departments").bootstrapTable('refresh');
}

// 树状菜单
function getTree() {
    var tree = "";
    $.ajax({
        url: '../../js/tree.json',
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
            url: port + '/v1/assetDepot/v1/assetDepotFindByType',
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
                field: 'name',
                align: 'center',
                title: '资产名称'
            }, {
                field: 'type',
                align: 'center',
                title: '资产类型'
            }, {
                field: 'chargeDepart',
                align: 'center',
                title: '管理部门'
            }, {
                field: 'unit',
                align: 'center',
                title: '单位'
            }, {
                field: 'price',
                align: 'center',
                title: '价格'
            }, {
                field: 'value',
                align: 'center',
                title: '金额'
            }, {
                field: 'num',
                align: 'center',
                title: '库存数量'
            }, {
                field: 'remarks',
                align: 'center',
                title: '备注'
            }, ],

            onLoadSuccess: function(data) {
                if ($(window).height() <= 650) {
                    $('.fixed-table-container').css({ 'height': $(window).height() - 300 + 'px' });
                    $('.panel-body').css({ 'height': $(window).height() + 'px' });
                } else {
                    $('.fixed-table-container').css({ 'height': $(window).height() - 200 + 'px' });
                    $('.panel-body').css({ 'height': $(window).height() + 'px' });
                }
            },
            onLoadError: function() {
                if ($(window).height() <= 650) {
                    $('.fixed-table-container').css({ 'height': $(window).height() - 300 + 'px' });
                    $('.panel-body').css({ 'height': $(window).height() + 'px' });
                } else {
                    $('.fixed-table-container').css({ 'height': $(window).height() - 200 + 'px' });
                    $('.panel-body').css({ 'height': $(window).height() + 'px' });
                }
            },
            onClickRow: function(row, $element) {},
            queryParams: function(params) {
                var temp = {
                    pageSize: params.limit, //页面大小
                    pageNum: (params.offset / params.limit) + 1, //页码
                    type: treeText, //点击数文本
                    name: $('#searchName').val()
                };
                return temp;
            }

        });
    };


    return oTableInit;
};






// 工具栏按钮事件
var ButtonInit = function() {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function() {

        // 出库单
        $('#exportList').click(function() {
            layer.open({
                title: '出库单',
                type: 2,
                area: ['1000px', '500px'],
                btn: ['关闭'],
                btnAlign: 'c',
                content: 'exportList.html',
                success: function(layero, index) {
                    layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                }
            });
        });


        // 导入
        $('#importBtn').click(function() {
            if (treeText == '') {
                layer.msg('请选择资产类型');
                return;
            }
            console.log('导入');
        });

        // 导出
        $("#exportBtn").on('click', function() {
            var a = $("#tb_departments").bootstrapTable('getSelections');
            var exportData = []; //要导出的数据


            if (treeText == '') {
                layer.msg('请选择左侧资产类型');
                return;
            }

            if (a.length == 0) {
                console.log(exportData);
                layer.msg('请勾选要导出的数据');
            } else {
                //获取选中的选项
                for (var i = 0; i < a.length; i++) {
                    exportData[i] = a[i].id;
                }
                location.href = port + '/v1/outWarehouse/exportOutDepotByType?ids=' + exportData.toString() + '&type=' + treeText + '';
            }
        });

    };
    return oInit;
};