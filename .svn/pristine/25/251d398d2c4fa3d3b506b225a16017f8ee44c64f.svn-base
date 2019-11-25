// 获取选择的表格数据
function getSelectData() {
    var allData = $("#tb_departments").bootstrapTable('getSelections');
    return allData;
}


// 获取所有表格数据
function getAllData() {
    var data = $("#tb_departments").bootstrapTable('getData');
    return data;
}




$(function() {

    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    // //2.初始化Button的点击事件
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
            undefinedText: '',
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
            // clickToSelect: true, //是否启用点击选中行
            // height: $(window).height(), //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "areaId", //每一行的唯一标识，一般为主键列
            showToggle: false, //是否显示详细视图和列表视图的切换按钮
            cardView: false, //是否显示详细视图
            detailView: false, //是否显示父子表
            columns: [{
                checkbox: true
            }, {
                field: 'intodepotAssetNum',
                align: 'center',
                title: '资产编号'
            }, {
                field: 'intodepotAssetName',
                align: 'center',
                title: '资产名称',
            }, {
                field: 'intodepotAssetType',
                align: 'center',
                title: '资产分类名称'
            }, {
                field: 'intodepotAssetNumber',
                align: 'center',
                title: '数量',
            }, {
                field: 'intodepotAssetPrice',
                align: 'center',
                title: '单价',
            }, {
                field: 'intodepotAssetUnit',
                align: 'center',
                title: '单位',
            },{
                field: 'intodepotAssetYuliu2',
                align: 'center',
                title: '规格',
            }, {
                field: 'intodepotAssetRemarks',
                align: 'center',
                title: '备注',
            }],

            //加载成功时执行
            onLoadSuccess: function(data) {
                console.log(data)
                $('.fixed-table-container').css({ 'height': $(window).height() - 200 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });


            },
            //加载失败时执行
            onLoadError: function() {},
            onClickRow: function(row, $element) {
                console.log(row);
            },
            onClickCell: function(field, value, row, $element) {

                $('#tb_departments td').attr('contenteditable', true);
                $('#tb_departments tr td:nth-child(2)').attr('contenteditable', false);
                $('#tb_departments tr td:nth-child(4)').attr('contenteditable', false);

                $element.blur(function() {
                    var index = $element.parent().data('index');
                    var tdValue = $element.html();
                    saveData(index, field, tdValue);
                });

            },
            //得到查询的参数
            queryParams: function(params) {
                var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    pageSize: params.limit, //页面大小
                    pageNum: (params.offset / params.limit) + 1, //页码
                    id: sessionStorage.getItem('checkId') //采购申请查看的id
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

    oInit.Init = function() {


        // 添加
        $("#btn_add").on('click', function() {

            parent.layer.open({
                type: 2,
                title: '查询',
                area: ['1100px', '600px'],
                btn: ['确定', '取消'],
                end: function() {

                },
                yes: function(index, layero) {
                    var body = parent.layer.getChildFrame('body', index);

                    if (body.find('.asset-frame').attr('src') == '') {
                        parent.layer.msg('请选择左侧资产类型');
                        return;
                    }

                    // 执行弹层为iframe内嵌套的iframe里的获取选中行数据方法
                    var selectData = body.find('.asset-frame')[0].contentWindow.getSelectData();

                    if (selectData.length == 0) {
                        parent.layer.msg('请勾选要添加的数据');
                        return;
                    }

                    // 修改添加的资产的key属性名
                    for (var i = 0; i < selectData.length; i++) {
                        selectData[i].intodepotAssetName = selectData[i].aName; //资产名称
                        delete selectData[i].aName;

                        selectData[i].intodepotAssetNum = selectData[i].aCode; //资产编号
                        delete selectData[i].aCode;

                        selectData[i].intodepotAssetType = selectData[i].aType; //资产分类名称
                        delete selectData[i].aType;

                        selectData[i].intodepotAssetNumber = selectData[i].aNumbers; //数量
                        delete selectData[i].aNumbers;


                    }
                    console.log('selectData', selectData);
                    $('#tb_departments').bootstrapTable('append', selectData);
                    parent.layer.close(index);


                },
                success: function(layero, index) {
                    layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                },
                btnAlign: 'c',
                content: 'search.html'
            });
        });



        // 删除表格数据
        $("#btn_delete").on('click', function() {

            var a = $("#tb_departments").bootstrapTable('getSelections');

            var delData = []; //要删除的数据

            if (a.length == 0) {
                layer.msg('请选择要删除的数据');
            } else {

                for (var i = 0; i < a.length; i++) {
                    delData[i] = a[i].id;
                }
                $("#tb_departments").bootstrapTable('remove', { field: 'id', values: delData });

                console.log('删除>>>', delData);

            }
        });


    };
    return oInit;
};