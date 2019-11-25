var assetsName = ''; //资产名称
var assetsList = ''; //勾选的资产
var alreadyAssets = ''; //已存在的资产
var reg = /^\+?[1-9]\d*$/; //正则判断大于0的正整数


// 获取选择的表格数据
function getSelectData() {
    var allData = $("#tb_departments").bootstrapTable('getSelections');
    return allData;
}


$(function() {

    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    // //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();


    // 申请单号
    $.ajax({
        url: port + '/v1/assetPurchaseApply/createCode',
        type: 'post',
        data: {
            tableName: 'tb_a_asset_purchase',
            fieldName: 'apply_num'
        },
        success: function(res) {
            console.log('申请单号', res);
            $('#applyListNum').attr('value', res.msg);
        }
    });

    // 申请日期
    $('#applyDate').attr('value', getDate());


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
            url: port + '/v1/applybuyAsset/getAssets',
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
                title: '预算金额'
            }, {
                field: 'applyAssetNumber',
                align: 'center',
                title: '完成时限',
            }],

            //加载成功时执行
            onLoadSuccess: function(data) {
                console.log(data)
                $('.fixed-table-container').css({ 'height': $(window).height() - 230 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });
            },
            //加载失败时执行
            onLoadError: function() {},
            onClickRow: function(row, $element) {
                console.log(row);
            },
            onClickCell: function(field, value, row, $element) {
                // console.log(field, value, row, $element)
                $element.attr('contenteditable', true);
                $('#tb_departments tr td:nth-child(2)').attr('contenteditable', false);
                $('#tb_departments tr td:nth-child(3)').attr('contenteditable', false);
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
                    assetType: assetsName, //资产名称
                    assetListString: assetsList, //勾选的资产
                    alreadyAssetListString: alreadyAssets, //已存在的资产
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

            //获取所有行数据赋值给已存在的数据
            alreadyAssets = JSON.stringify($("#tb_departments").bootstrapTable('getData'));

            sessionStorage.setItem('alreadyAssets', alreadyAssets); //已存在的资产存入缓存

            parent.layer.open({
                type: 2,
                title: '查询',
                area: ['1100px', '600px'],
                btn: ['确定', '取消'],
                end: function() {
                    sessionStorage.removeItem('assetsName');
                    sessionStorage.removeItem('assetsList');
                    sessionStorage.removeItem('alreadyAssets');
                },
                yes: function(index, layero) {
                    // 点击弹层确定执行iframe内的确定按钮事件
                    var body = parent.layer.getChildFrame('body', index);
                    //  sessionStorage.setItem('getTreeType', parent.window[layero.find('iframe')[0]['name']].getTreeType());
                    // body[0].querySelector('#btn_select').click();



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
                        selectData[i].applyAssetName = selectData[i].aName;
                        delete selectData[i].aName;

                        selectData[i].applyAssetNum = selectData[i].aCode;
                        delete selectData[i].aCode;

                        selectData[i].applyAssetType = selectData[i].aType;
                        delete selectData[i].aType;

                    }
                    console.log(selectData);
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
            var allData = $("#tb_departments").bootstrapTable('getData');

            var delData = []; //要删除的数据


            if (a.length == 0) {
                layer.msg('请选择要删除的数据');
            } else {
                // console.log(a);

                //获取选中的ID
                for (var i = 0; i < a.length; i++) {
                    delData[i] = a[i].id;
                }
                $("#tb_departments").bootstrapTable('remove', { field: 'id', values: delData });

                console.log('删除>>>', delData);

               

            }
        });


        // 选择
        $("#btn_select").on('click', function() {
            console.log('选择');
            var a = $("#tb_departments").bootstrapTable('getData');
            var selectData = []; //要删除的数据

            var apply_person = $('#apply_person').val(); //申请人员
            var apply_work_number = $('#apply_work_number').val(); //工号
            var apply_department = $('#apply_department').val(); //申请部门
            var applyNum = $('#applyNum').val(); //申请单号
            var apply_date = $('#apply_date').val(); //申请日期
            var amList = []; //添加的物料单;



            //获取选中的ID
            for (var i = 0; i < a.length; i++) {
                selectData[i] = a[i];
                if (selectData[i].applyAssetNumber == null) {
                    layer.msg('请输入数量');
                    return;
                }
                if (!reg.test(selectData[i].applyAssetNumber)) {
                    layer.msg('数量必须是大于0的正整数');
                    return;
                }
                if (selectData[i].applyAssetYuliu2 == null) {
                    layer.msg('请输入单价');
                    return;
                }
                if (!reg.test(selectData[i].applyAssetYuliu2)) {
                    layer.msg('单价必须是大于0的正整数');
                    return;
                }
                if (selectData[i].applyAssetUnit == null) {
                    layer.msg('请输入单位');
                    return;
                }
            }

            console.log('提交的数据', selectData);
            if (selectData.length == 0) {
                return;
            }

            sessionStorage.setItem('alreadySubmit', JSON.stringify(selectData));
            // 提交
            $.ajax({
                url: port + '/v1/applybuyAsset/saveWithData',
                type: 'post',
                data: {
                    applyPerson: $('#applyPerson').val(), //申请人
                    applyPersonNumber: $('#personJobNumber').val(), //人员工号
                    applyPersonDepart: $('#applyDepartment').val(), //申请部门
                    applyNum: $('#applyListNum').val(), //申请单号
                    applyYuliu1: $('#applyReason').val(), //申请理由
                    aasList: JSON.stringify(selectData), //申请单列表
                    applyYuliu3: uploadFile //上传的附件
                },
                success: function(res) {

                }
            });


        });


    };
    return oInit;
};