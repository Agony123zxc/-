var treeText = ''; //点击的数文本

function test(){
    console.log(555666);
}


// 选择资产
function selectAsset() {
    var a = $("#tb_departments").bootstrapTable('getSelections');
    var selectData = []; //要选择的数据

    if (a.length == 0) {
        layer.msg('请选择要添加数据');
    } else {
        //获取选中的ID
        for (var i = 0; i < a.length; i++) {
            selectData[i] = a[i];
        }

        for (var i = 0; i < selectData.length; i++) {
            delete selectData[i].id;
        }

        sessionStorage.setItem('assetsName', treeText); //所选数资产文本
        sessionStorage.setItem('selectAsssts', JSON.stringify(selectData)); //勾选的资产


    }
}

// 获取点击的资产类型
function getTreeType(){
    console.log('我我我');
    return treeText;
}

$(function() {

    // 树状数据
    $('#tree').treeview({
        data: getTree()
    });

    // 选择一个节点
    $('#tree').on('nodeSelected', function(event, data) {
        if (data.text=='固定资产'||data.text=='无形资产') {
            return;
        }
        $('.select-tips').hide();
        console.log('树状菜单', data);

        $('.asset-frame').attr('src',data.link);

        treeText = data.text;

    });
    // 取消选择一个节点
    $('#tree').on('nodeUnselected', function(event, data) {
        $('.asset-frame').attr('src','');
        console.log('树状菜单', data);
        treeText = '';
        console.log('树文本>>>', treeText);
        $("#tb_departments").bootstrapTable('refresh');
        $('.select-tips').show();
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
    if ($('#searchName').val() == '') {
        layer.msg('请输入查询编号或名称');
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
            url: port + '/v1/applybuyAsset/getAssetByTree',
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
                    field: 'applyAssetNum',
                    align: 'center',
                    title: '资产编号'
                }, {
                    field: 'applyAssetName',
                    align: 'center',
                    title: '资产名称'
                }, {
                    field: 'applyAssetType',
                    align: 'center',
                    title: '资产类别'
                },
               
            ],

            onLoadSuccess: function(data) {
                $('.fixed-table-container').css({ 'height': $(window).height() - 130 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });
            },
            onLoadError: function() {
                $('.fixed-table-container').css({ 'height': $(window).height() - 130 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });
            },
            onClickRow: function(row, $element) {},

        });
    };



    //得到查询的参数
    oTableInit.queryParams = function(params) {
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            pageSize: params.limit, //页面大小
            pageNum: (params.offset / params.limit) + 1, //页码
            assetType: treeText, //点击数文本
            input: $('#searchName').val()
        };
        return temp;
    };

    return oTableInit;
};


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


        // 选择
        $("#btn_select").on('click', function() {

            console.log('选择');

            var a = $("#tb_departments").bootstrapTable('getSelections');
            var selectData = []; //要选择的数据

            if (a.length == 0) {
                layer.msg('请选择要添加数据');
            } else {
                //获取选中的ID
                for (var i = 0; i < a.length; i++) {
                    selectData[i] = a[i];
                }

                for (var i = 0; i < selectData.length; i++) {
                    delete selectData[i].id;
                }

                sessionStorage.setItem('assetsName', treeText); //所选数资产文本
                sessionStorage.setItem('assetsList', JSON.stringify(selectData)); //勾选的资产


            }


        });


    };
    return oInit;
};