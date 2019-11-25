var treeText = ''; //点击的数文本


// 获取出库单部门 
$.ajax({
    url: port + '/v1/outWarehouse/getDepartments',
    type: 'get',
    success: function(res) {
        console.log('出库单部门下拉', res)
        for (var i = 0; i < res.length; i++) {
            $('#applyDepart').append('<option value=' + res[i].orgName + '>' + res[i].orgName + '</option>')
        }
        // 部门下拉框
        $('#applyDepart').chosen({
            no_results_text: "没有找到结果！", //搜索无结果时显示的提示  
            search_contains: true, //关键字模糊搜索。设置为true，只要选项包含搜索词就会显示；设置为false，则要求从选项开头开始匹配
            allow_single_deselect: true, //单选下拉框是否允许取消选择。如果允许，选中选项会有一个x号可以删除选项
            disable_search: false, //禁用搜索。设置为true，则无法搜索选项。
            disable_search_threshold: 0, //当选项少等于于指定个数时禁用搜索。
            inherit_select_classes: true, //是否继承原下拉框的样式类，此处设为继承
            placeholder_text_single: '选择部门', //单选选择框的默认提示信息，当选项为空时会显示。如果原下拉框设置了data-placeholder，会覆盖这里的值。
            width: '175px', //设置chosen下拉框的宽度。即使原下拉框本身设置了宽度，也会被width覆盖。
            max_shown_results: 1000, //下拉框最大显示选项数量
            display_disabled_options: false,
            single_backstroke_delete: false, //false表示按两次删除键才能删除选项，true表示按一次删除键即可删除
            case_sensitive_search: false, //搜索大小写敏感。此处设为不敏感
            group_search: false, //选项组是否可搜。此处搜索不可搜
            include_group_label_in_selected: true, //选中选项是否显示选项分组。false不显示，true显示。默认false。
        });
    }
})



// 部门下拉框 事件
$('#applyDepart').change(function(e, a) {
    console.log(e, a)
})


$(function() {

    // 树状数据
    $('#tree').treeview({
        data: getTree()
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
    $("#tb_departments").bootstrapTable('refresh');
}
//重置
function resetBtn() {
    // $('#applyNum').val('');
    // $('#applyDepart').val('');
    // $("#tb_departments").bootstrapTable('refresh');
    location.reload();
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
            }, ],

            onLoadSuccess: function(data) {
                $('.fixed-table-container').css({ 'height': $(window).height() - 140 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });
            },
            onLoadError: function() {
                $('.fixed-table-container').css({ 'height': $(window).height() - 140 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });
            },
            onClickRow: function(row, $element) {},
            queryParams: function(params) {
                var temp = {
                    pageSize: params.limit, //页面大小
                    pageNum: (params.offset / params.limit) + 1, //页码
                    pJobNum: localStorage.getItem('pJobnum'),
                    applyNumber: $('#applyNum').val(), //申请单号
                    applyDepart: $('#applyDepart').val(), //申请部门
                };
                return temp;
            }

        });
    };

    return oTableInit;
};




// 点击当前行数据审核事件
window.operateEvents = {
    'click .info': function(e, value, row, index) {

        sessionStorage.setItem('checkId', row.id);

        console.log('行数据', row);

        parent.layer.open({
            type: 2,
            title: '详情',
            btn: ['关闭'],
            btnAlign: 'c',
            area: ['1000px', '500px'],
            success: function(layero, index) {
                var body = parent.layer.getChildFrame('body', index);
                layero.find('.layui-layer-btn0').css('background', '#27AAE1');

                body.find('#applyNum').attr('value', row.odNumber); //申请单号
                body.find('#applyDate').attr('value', row.odTime); //申请时间
                body.find('#applyDepart').attr('value', row.odPersonDepart); //申请部门
                body.find('#applyPerson').attr('value', row.odPerson); //申请人
                body.find('#applyJobNum').attr('value', row.odPersonNumber); //申请人工号
                body.find('#applyState').attr('value', row.odState); //申请人工号

            },
            end: function() {
                sessionStorage.removeItem('checkId');
            },
            yes: function(index, layero) {
                var body = parent.layer.getChildFrame('body', index);
                parent.layer.close(index);
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

        // 出库
        $("#exportBtn").on('click', function() {
            var a = $("#tb_departments").bootstrapTable('getSelections');
            var selectData = []; //选中的数据

            if (a.length == 1) {
                for (var i = 0; i < a.length; i++) {
                    selectData[i] = a[i].id;
                }
                console.log('选中的数据', selectData);
                parent.layer.open({
                    type: 1,
                    title: '提示',
                    area: ['300px', '200px'],
                    btn: ['确定', '取消'],
                    success: function(layero, index) {
                        layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                    },
                    yes: function(index, layero) {
                        $.ajax({
                            url: port + '/v1/outWarehouse/orderOutDepot',
                            type: 'get',
                            data: {
                                id: selectData.toString(),
                                pJobNum: localStorage.getItem('pJobnum')
                            },
                            success: function(res) {
                                console.log('出库返回',res);
                                if (res.code =='1') {
                                    $("#tb_departments").bootstrapTable('refresh');
                                    parent.layer.close(index);
                                    parent.layer.msg('出库成功');
                                }else{
                                    parent.layer.msg(res.code);
                                }
                            }
                        });
                    },
                    btnAlign: 'c',
                    content: '<div style="text-align: center;margin-top: 40px;">确定出库?</div>'
                });
                
            } else {
                parent.layer.msg('请选择单条数据');
            }
        });

    };
    return oInit;
};