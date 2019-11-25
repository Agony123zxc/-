var uploadFile; //上传照片


// 获取选中的行数据
function getSelectData() {
    var data = $("#tb_departments").bootstrapTable('getSelections');
    return {
        type: '文物及陈列品',
        data: data
    };
}

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
    if ($('#work_number').val() == '' && $('#user_name').val() == '') {
        layer.msg('请输入工号或姓名');
        return;
    }
    $("#tb_departments").bootstrapTable('refresh');
}
//重置
function resetBtn() {
    console.log('重置');
    $('#org_name').val('');
    $("#tb_departments").bootstrapTable('refresh');
}

// 树状菜单
function getTree() {
    var tree = "";
    $.ajax({
        url: port + '/v1/organize/organizeTree',
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
            url: port + '/v1/relic/selectRelicPage',
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
            // height: $(window).height()-60, //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "areaId", //每一行的唯一标识，一般为主键列
            showToggle: false, //是否显示详细视图和列表视图的切换按钮
            cardView: false, //是否显示详细视图
            detailView: false, //是否显示父子表
            columns: [{
                checkbox: true
            }, {
                field: 'reName',
                align: 'center',
                title: '资产名称'
            }, {
                field: 'reType',
                align: 'center',
                title: '资产分类名称'
            }, {
                field: 'reCode',
                align: 'center',
                title: '资产编号'
            }, {
                field: 'reChargeDepart',
                align: 'center',
                title: '管理部门'
            }, {
                field: 'reGainType',
                align: 'center',
                title: '取得方式'
            }, {
                field: 'reGainDate',
                align: 'center',
                title: '取得日期'
            }, {
                field: 'reRemarks',
                align: 'center',
                title: '备注'
            }, {
                field: 'name6',
                align: 'center',
                title: '操作',
                events: operateEvents,
                formatter: function(value, row, index) {
                    var result = "<a href='javascript:;' class='info' style='color:#1E9DD3'>查看</a>";
                    return result;
                }
            }],

            //得到查询的参数
            queryParams: function(params) {
                var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    pageSize: params.limit, //页面大小
                    pageNum: (params.offset / params.limit) + 1, //页码
                    reName: $('#org_name').val(), //资产名称
                    pJobNum: localStorage.getItem('pJobnum')
                };
                return temp;
            },

            //加载成功时执行
            onLoadSuccess: function(data) {
                console.log('成功加载表格数据', data);
                $('.fixed-table-container').css({ 'height': $(window).height() - 160 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });
            },
            //加载失败时执行
            onLoadError: function() {
                $('.fixed-table-container').css({ 'height': $(window).height() - 160 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });
            },
            onClickRow: function(row, $element) {}
        });
    };

    return oTableInit;
};





// 导入文件
var formData = new FormData();
var name;
$("#btn_import").on('click', function() {
    layer.open({
        type: 1,
        title: '导入',
        btn: ['导入', '关闭'],
        btnAlign: 'c',
        area: ['470px', '300px'],
        success: function(layero, index) {
            // 改变按钮背景色
            layero.find('.layui-layer-btn0').css('background', '#27AAE1');

            // 导入事件
            layero.find('input[name=importFile]').change(function(event) {
                name = $(this).val();
                formData.append("file", $(this)[0].files[0]);
                formData.append("name", name);
                layero.find('.import-file-name').html(name);
            });
        },
        yes: function(index, layero) {
            $.ajax({
                url: port + "/v1/personnel2/import",
                type: 'post',
                async: false,
                data: formData,
                processData: false,
                contentType: false,
                success: function(res) {
                    console.log('导入结果', res);
                    if (res.success > 0) {

                        layer.msg('操作成功');
                        setTimeout(function() {
                            location.reload();
                        }, 500);



                    } else {
                        layer.msg('导入失败，请重新导入');
                    }

                }
            });

        },
        content: '<div class="import-layer">' +
            '<div class="form-group col-md-12" style="padding: 0;margin: 0;z-index: 10">' +
            '<div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">' +
            '<label for="remarks">模板：</label>' +
            '</div>' +
            '<div class="col-md-8" style="padding: 0;margin: 0">' +
            '<a style="margin-left: 8px;" href="' + port + '/v1/personnel2/exportPersonalInfoTemplet">点击下载模板</a>' +
            '</div>' +
            '</div>' +
            '<div class="form-group col-md-12" style="margin-top: 20px;">' +
            '<form id="importFile" name="importFile" class="form-horizontal" method="post" enctype="multipart/form-data">' +
            '<div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">' +
            '<label class="control-label" style="margin-right: 8px;">选择文件：</label>' +
            '</div>' +
            '<div class="col-md-8" style="padding: 0;margin: 0">' +
            '<div class="import-file-wrap">' +
            '<div class="import-file-name"></div>' +
            '<span class="import-file-btn">浏览</span>' +
            '<input name="importFile" type="file">' +
            '</div>' +
            '</div>' +
            '</form>' +
            '</div>' +
            '</div>'

    });
});


// 点击当前行数据详情事件
window.operateEvents = {
    'click .info': function(e, value, row, index) {
        console.log(row);
        parent.parent.layer.open({
            type: 1,
            title: '详情',
            btn: '关闭',
            btnAlign: 'c',
            area: ['760px', '500px'],
            success: function(layero, index) {
                layero.find('.layui-layer-btn0').css({ background: '#fff', color: '#333', borderColor: '#ddd', padding: '0 20px' });
            },
            content: '<div class="detail-layer">' +
                '<table>' +
                '<tr>' +
                '<td>资产名称</td>' +
                '<td>' + row.reName + '</td>' +
                '<td>资产分类名称</td>' +
                '<td>' + row.reType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>存放地点</td>' +
                '<td>' + row.reDepo + '</td>' +
                '<td>采购组织形式</td>' +
                '<td>' + row.reBuyType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>预算项目编号</td>' +
                '<td>' + row.reBudgetnum + '</td>' +
                '<td>资产编号</td>' +
                '<td>' + row.reCode + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>取得方式</td>' +
                '<td>' + row.reGainType + '</td>' +
                '<td>藏品年代</td>' +
                '<td>' + row.reCollectionYears + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>取得日期</td>' +
                '<td>' + row.reGainDate + '</td>' +
                '<td>来源地</td>' +
                '<td>' + row.rePlaceOrigin + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>文物等级</td>' +
                '<td>' + row.reRelicLevel + '</td>' +
                '<td>规格型号</td>' +
                '<td>' + row.reSpecs + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>数量</td>' +
                '<td>' + row.reNumbers + '</td>' +
                '<td>价值类型</td>' +
                '<td>' + row.reValueType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>入账形式</td>' +
                '<td>' + row.reEnterAccountType + '</td>' +
                '<td>价值（元）</td>' +
                '<td>' + row.reValue + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>财政拨款（元）</td>' +
                '<td>' + row.rePublicEconomy + '</td>' +
                '<td>非财政拨款（元）</td>' +
                '<td>' + row.reNotPublicEconomy + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>均价</td>' +
                '<td>' + row.reAveragePrice + '</td>' +
                '<td>会计凭证号</td>' +
                '<td>' + row.reAccountingDocumentNum + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>使用状况</td>' +
                '<td>' + row.reUseState + '</td>' +
                '<td>财务入账日期</td>' +
                '<td>' + row.reEnterAccountDate + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>使用部门</td>' +
                '<td>' + row.reUseDepart + '</td>' +
                '<td>管理部门</td>' +
                '<td>' + row.reChargeDepart + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>投入使用日期</td>' +
                '<td>' + row.reStartUseDate + '</td>' +
                '<td>备用字段</td>' +
                '<td>' + row.reReserveField + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>备注</td>' +
                '<td colspan="3">' + row.reRemarks + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>照片附件</td>' +
                '<td colspan="3"><img class="annex-img" src=' + row.reImgpath + '></td>' +
                '</tr>' +
                '</table>' +
                '</div>'

        });
    }
};





// 工具栏按钮事件
var ButtonInit = function() {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function() {
        // 添加表格数据
        $("#btn_add").on('click', function() {

            parent.parent.layer.open({
                type: 1,
                title: '添加',
                area: ['760px', '500px'],
                btn: ['确定', '取消'],
                yes: function(index, layero) {

                    var assetName = layero.find('#assetName').val(); //资产名称
                    var assetTypeName = layero.find('#assetTypeName').val(); //资产分类名称
                    var storeAddress = layero.find('#storeAddress').val(); //存放地点
                    var buyOrgName = layero.find('#buyOrgName').val(); //采购组织形式
                    var budgetProNum = layero.find('#budgetProNum').val(); //预算项目编号
                    var assetNum = layero.find('#assetNum').val(); //资产编号
                    var getType = layero.find('#getType').val(); //取得方式
                    var collectYear = layero.find('#collectYear').val(); //藏品年代
                    var quDate = layero.find('#quDate').val(); //取得日期
                    var originalAdd = layero.find('#originalAdd').val(); //来源地
                    var culturalLevel = layero.find('#culturalLevel').val(); //文物等级
                    var specifications = layero.find('#specifications').val(); //规格型号
                    var amount = layero.find('#amount').val(); //数量
                    var valueType = layero.find('#valueType').val(); //价值类型
                    var bookingForm = layero.find('#bookingForm').val(); //入账形式
                    var value = layero.find('#value').val(); //价值
                    var fiscalAppropriation = layero.find('#fiscalAppropriation').val(); //财政拨款
                    var notFiscalAppropriation = layero.find('#notFiscalAppropriation').val(); //非财政拨款
                    var averagePrice = layero.find('#averagePrice').val(); //均价
                    var accountNum = layero.find('#accountNum').val(); //会计凭证号
                    var useState = layero.find('#useState').val(); //使用状况
                    var caiWuDate = layero.find('#caiWuDate').val(); //财务入账日期
                    var useDate = layero.find('#useDate').val(); //投入使用日期
                    var useDepart = layero.find('#useDepart').val(); //使用部门
                    var manageDepart = layero.find('#manageDepart').val(); //管理部门
                    var standbyField = layero.find('#standbyField').val(); //备用字段
                    var remark = layero.find('#remark').val(); //备注


                    if (assetName == '') {
                        parent.parent.layer.msg('请输入资产名称');
                        return;
                    }

                    if (quDate == '') {
                        parent.parent.layer.msg('请选择取得日期');
                        return;
                    }
                    if (amount == '') {
                        parent.parent.layer.msg('请输入数量');
                        return;
                    }

                    if (manageDepart == '') {
                        parent.parent.layer.msg('请选择管理部门');
                        return;
                    }

                    if (value == '') {
                        parent.parent.layer.msg('请输入价值');
                        return;
                    }

                    $.ajax({
                        url: port + '/v1/relic/insertRelic',
                        type: 'post',
                        data: {
                            reName: assetName, //资产名称
                            reType: assetTypeName, //资产分类名称
                            reDepo: storeAddress, //存放地点
                            reBuyType: buyOrgName, //采购组织形式
                            reBudgetnum: budgetProNum, //预算项目编号
                            reCode: assetNum, //资产编号
                            reGainType: getType, //取得方式
                            reCollectionYears: collectYear, //藏品年代
                            reGainDate: quDate, //取得日期
                            rePlaceOrigin: originalAdd, //来源地
                            reRelicLevel: culturalLevel, //文物等级
                            reSpecs: specifications, //规格型号
                            reNumbers: amount, //数量
                            reValueType: valueType, //价值类型
                            reEnterAccountType: bookingForm, //入账形式
                            reValue: value, //价值
                            rePublicEconomy: fiscalAppropriation, //财政拨款
                            reNotPublicEconomy: notFiscalAppropriation, //非财政拨款
                            reAveragePrice: averagePrice, //均价
                            reAccountingDocumentNum: accountNum, //会计凭证号
                            reUseState: useState, //使用状况
                            reEnterAccountDate: caiWuDate, //财务入账日期
                            reStartUseDate: useDate, //投入使用日期
                            reUseDepart: useDepart, //使用部门
                            reChargeDepart: manageDepart, //管理部门
                            reReserveField: standbyField, //备用字段
                            reRemarks: remark, //备注
                            reImgpath: uploadFile, //上传照片
                            pJobNum: localStorage.getItem('pJobnum')
                        },
                        success: function(res) {
                            console.log('添加返回', res);
                            parent.parent.layer.msg('添加成功');
                            parent.parent.layer.close(index);
                            $("#tb_departments").bootstrapTable('refresh');
                        }
                    });



                },
                success: function(layero, index) {
                    layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                    layero.find('input[readonly]').css('background', '#fff');

                    // 上传照片
                    layero.find('#uploadFile').change(function(event) {
                        $.ajax({
                            url: port + "/v1/relic/importRelicImg",
                            type: 'post',
                            data: new FormData(layero.find('#Form')[0]), // 上传formdata封装的数据
                            cache: false, //// 不缓存
                            processData: false, //不处理发送的数据
                            contentType: false, //不设置Content-Type请求头
                            success: function(data) {
                                console.log(data);
                                uploadFile = data;
                            },
                            error: function() {
                                console.log('异常');
                            }
                        });
                    });


                    // 管理部门
                    layero.find('#manageDepart').on('click', function() {
                        var options = {
                            bootstrap2: false,
                            showTags: true,
                            levels: 5,
                            checkedIcon: "glyphicon glyphicon-check",
                            data: getTree(),
                            onNodeSelected: function(event, data) {
                                console.log(data);
                                layero.find('#manageDepart').attr('value', data.text);
                                layero.find("#treeviews").hide();
                            }
                        };
                        layero.find('#treeviews').treeview(options);
                        layero.find('#treeviews').show();

                    });


                    // 使用部门
                    layero.find('#useDepart').on('click', function() {
                        var options = {
                            bootstrap2: false,
                            showTags: true,
                            levels: 5,
                            checkedIcon: "glyphicon glyphicon-check",
                            data: getTree(),
                            onNodeSelected: function(event, data) {
                                console.log(data);
                                layero.find('#useDepart').attr('value', data.text);
                                layero.find("#treeviews1").hide();
                            }
                        };
                        layero.find('#treeviews1').treeview(options);
                        layero.find('#treeviews1').show();

                    });



                    // 取得日期
                    parent.parent.laydate.render({
                        elem: '#quDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#quDate').attr('value', value);
                        }
                    });



                    // 财务入账日期日期
                    parent.parent.laydate.render({
                        elem: '#caiWuDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#caiWuDate').attr('value', value);
                        }
                    });

                    // // 投入使用日期
                    parent.parent.laydate.render({
                        elem: '#useDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#useDate').attr('value', value);
                        }
                    });

                    // 生成资产编号
                    $.ajax({
                        url: port + '/v1/relic/createCode',
                        type: 'post',
                        success: function(res) {
                            console.log('资产编号：', res);
                            layero.find('#assetNum').attr('value', res.msg);
                        }
                    });




                },
                btnAlign: 'c',
                content: '<div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>资产名称：</label></div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0" style="position: relative;">' +
                    '<input autocomplete="off" style="background-color: #fff;" type="text" class="form-control" value="" id="assetName">' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>资产分类名称：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly value="文物及陈列品" autocomplete="off" id="assetTypeName" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>存放地点：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="storeAddress" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>采购组织形式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="buyOrgName" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>预算项目编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="budgetProNum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>资产编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" id="assetNum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>取得方式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" id="getType" type="text" class="form-control" value="新购" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>藏品年代：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="collectYear" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>取得日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="quDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>来源地：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="originalAdd" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>文物等级：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="culturalLevel" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>规格型号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="specifications" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>数量：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="amount" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +

                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>价值类型：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<select class="form-control" id="valueType">' +
                    '<option value="原值">原值</option>' +
                    '<option value="暂估值">暂估值</option>' +
                    '<option value="重置值">重置值</option>' +
                    '<option value="无价值">无价值</option>' +
                    '<option value="评估值">评估值</option>' +
                    '<option value="名义金额">名义金额</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>入账形式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="bookingForm" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>价值（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="value" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>财政拨款：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="fiscalAppropriation" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>非财政拨款（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="notFiscalAppropriation" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>均价：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="averagePrice" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>会计凭证号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="accountNum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用状况：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" type="text" class="form-control" id="useState" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>财务入账日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="caiWuDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>投入使用日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="useDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用部门：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" style="background-color: #fff;" readonly type="text" id="useDepart" class="form-control" value="">' +
                    '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews1">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>管理部门：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" style="background-color: #fff;" readonly type="text" id="manageDepart" class="form-control" value="">' +
                    '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>备用字段：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<input autocomplete="off" type="text" class="form-control" id="standbyField" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>备注：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<input autocomplete="off" type="text" class="form-control" id="remark" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>照片附件：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<form enctype="multipart/form-data" id="Form">' +
                    '<input accept="image/*" id="uploadFile" multiple type="file" name="file">' +
                    '</form>' +
                    '</div>' +
                    '</div>' +
                    '</div>'
            });
        });



        // 修改表格数据
        $("#btn_edit").on('click', function() {
            var a = $("#tb_departments").bootstrapTable('getSelections');
            console.log('修改', a[0]);

            if (a.length == 1) {

                parent.parent.layer.open({
                    type: 1,
                    title: '修改',
                    area: ['760px', '500px'],
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {

                        var assetName = layero.find('#assetName').val(); //资产名称
                        var assetTypeName = layero.find('#assetTypeName').val(); //资产分类名称
                        var storeAddress = layero.find('#storeAddress').val(); //存放地点
                        var buyOrgName = layero.find('#buyOrgName').val(); //采购组织形式
                        var budgetProNum = layero.find('#budgetProNum').val(); //预算项目编号
                        var assetNum = layero.find('#assetNum').val(); //资产编号
                        var getType = layero.find('#getType').val(); //取得方式
                        var collectYear = layero.find('#collectYear').val(); //藏品年代
                        var quDate = layero.find('#quDate').val(); //取得日期
                        var originalAdd = layero.find('#originalAdd').val(); //来源地
                        var culturalLevel = layero.find('#culturalLevel').val(); //文物等级
                        var specifications = layero.find('#specifications').val(); //规格型号
                        var amount = layero.find('#amount').val(); //数量
                        var valueType = layero.find('#valueType').val(); //价值类型
                        var bookingForm = layero.find('#bookingForm').val(); //入账形式
                        var value = layero.find('#value').val(); //价值
                        var fiscalAppropriation = layero.find('#fiscalAppropriation').val(); //财政拨款
                        var notFiscalAppropriation = layero.find('#notFiscalAppropriation').val(); //非财政拨款
                        var averagePrice = layero.find('#averagePrice').val(); //均价
                        var accountNum = layero.find('#accountNum').val(); //会计凭证号
                        var useState = layero.find('#useState').val(); //使用状况
                        var caiWuDate = layero.find('#caiWuDate').val(); //财务入账日期
                        var useDate = layero.find('#useDate').val(); //投入使用日期
                        var useDepart = layero.find('#useDepart').val(); //使用部门
                        var manageDepart = layero.find('#manageDepart').val(); //管理部门
                        var standbyField = layero.find('#standbyField').val(); //备用字段
                        var remark = layero.find('#remark').val(); //备注


                        if (assetName == '') {
                            parent.parent.layer.msg('请输入资产名称');
                            return;
                        }
                        if (quDate == '') {
                            parent.parent.layer.msg('请选择取得日期');
                            return;
                        }
                        if (amount == '') {
                            parent.parent.layer.msg('请输入数量');
                            return;
                        }

                        if (manageDepart == '') {
                            parent.parent.layer.msg('请选择管理部门');
                            return;
                        }

                        if (value == '') {
                            parent.parent.layer.msg('请输入价值');
                            return;
                        }

                        $.ajax({
                            url: port + '/v1/relic/updateRelic',
                            type: 'post',
                            data: {
                                id: a[0].id,
                                reName: assetName, //资产名称
                                reType: assetTypeName, //资产分类名称
                                reDepo: storeAddress, //存放地点
                                reBuyType: buyOrgName, //采购组织形式
                                reBudgetnum: budgetProNum, //预算项目编号
                                reCode: assetNum, //资产编号
                                reGainType: getType, //取得方式
                                reCollectionYears: collectYear, //藏品年代
                                reGainDate: quDate, //取得日期
                                rePlaceOrigin: originalAdd, //来源地
                                reRelicLevel: culturalLevel, //文物等级
                                reSpecs: specifications, //规格型号
                                reNumbers: amount, //数量
                                reValueType: valueType, //价值类型
                                reEnterAccountType: bookingForm, //入账形式
                                reValue: value, //价值
                                rePublicEconomy: fiscalAppropriation, //财政拨款
                                reNotPublicEconomy: notFiscalAppropriation, //非财政拨款
                                reAveragePrice: averagePrice, //均价
                                reAccountingDocumentNum: accountNum, //会计凭证号
                                reUseState: useState, //使用状况
                                reEnterAccountDate: caiWuDate, //财务入账日期
                                reStartUseDate: useDate, //投入使用日期
                                reUseDepart: useDepart, //使用部门
                                reChargeDepart: manageDepart, //管理部门
                                reReserveField: standbyField, //备用字段
                                reRemarks: remark, //备注
                                reImgpath: uploadFile, //上传照片
                                pJobNum: localStorage.getItem('pJobnum')
                            },
                            success: function(res) {
                                console.log('修改返回', res);
                                parent.parent.layer.msg('修改成功');
                                parent.parent.layer.close(index);
                                $("#tb_departments").bootstrapTable('refresh');
                            }
                        });

                    },
                    success: function(layero, index) {
                        layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                        layero.find('input[readonly]').css('background', '#fff');

                        // 价值类型下拉框赋值
                        layero.find('#valueType option').each(function(index, item) {
                            if (a[0].reValueType == $(item).text()) {
                                $(item).attr('selected', true);
                            }
                        });

                        // 上传照片
                        layero.find('#uploadFile').change(function(event) {
                            $.ajax({
                                url: port + "/v1/relic/importRelicImg",
                                type: 'post',
                                data: new FormData(layero.find('#Form')[0]), // 上传formdata封装的数据
                                cache: false, //// 不缓存
                                processData: false, //不处理发送的数据
                                contentType: false, //不设置Content-Type请求头
                                success: function(data) {
                                    console.log(data);
                                    uploadFile = data;
                                },
                                error: function() {
                                    console.log('异常');
                                }
                            });
                        });


                        // 管理部门
                        layero.find('#manageDepart').on('click', function() {
                            var options = {
                                bootstrap2: false,
                                showTags: true,
                                levels: 5,
                                checkedIcon: "glyphicon glyphicon-check",
                                data: getTree(),
                                onNodeSelected: function(event, data) {
                                    console.log(data);
                                    layero.find('#manageDepart').attr('value', data.text);
                                    layero.find("#treeviews").hide();
                                }
                            };
                            layero.find('#treeviews').treeview(options);
                            layero.find('#treeviews').show();

                        });


                        // 使用部门
                        layero.find('#useDepart').on('click', function() {
                            var options = {
                                bootstrap2: false,
                                showTags: true,
                                levels: 5,
                                checkedIcon: "glyphicon glyphicon-check",
                                data: getTree(),
                                onNodeSelected: function(event, data) {
                                    console.log(data);
                                    layero.find('#useDepart').attr('value', data.text);
                                    layero.find("#treeviews1").hide();
                                }
                            };
                            layero.find('#treeviews1').treeview(options);
                            layero.find('#treeviews1').show();

                        });



                        // 取得日期
                        parent.parent.laydate.render({
                            elem: '#quDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#quDate').attr('value', value);
                            }
                        });



                        // 财务入账日期日期
                        parent.parent.laydate.render({
                            elem: '#caiWuDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#caiWuDate').attr('value', value);
                            }
                        });

                        // 投入使用日期
                        parent.parent.laydate.render({
                            elem: '#useDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#useDate').attr('value', value);
                            }
                        });


                    },
                    btnAlign: 'c',
                    content: '<div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>资产名称：</label></div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0" style="position: relative;">' +
                        '<input autocomplete="off" style="background-color: #fff;" type="text" class="form-control" value="' + a[0].reName + '" id="assetName">' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产分类名称：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" id="assetTypeName" type="text" class="form-control" value="文物及陈列品" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>存放地点：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reDepo + '" autocomplete="off" id="storeAddress" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>采购组织形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reBuyType + '" autocomplete="off" id="buyOrgName" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>预算项目编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reBudgetnum + '" autocomplete="off" id="budgetProNum" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly value="' + a[0].reCode + '" autocomplete="off" id="assetNum" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>取得方式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" id="getType" type="text" class="form-control" value="新购" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>藏品年代：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reCollectionYears + '" autocomplete="off" id="collectYear" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>取得日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reGainDate + '" autocomplete="off" readonly id="quDate" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>来源地：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].rePlaceOrigin + '" autocomplete="off" id="originalAdd" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>文物等级：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reRelicLevel + '" autocomplete="off" id="culturalLevel" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>规格型号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reSpecs + '" autocomplete="off" id="specifications" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>数量：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reNumbers + '" autocomplete="off" id="amount" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>价值类型：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<select class="form-control" id="valueType">' +
                        '<option value="原值">原值</option>' +
                        '<option value="暂估值">暂估值</option>' +
                        '<option value="重置值">重置值</option>' +
                        '<option value="无价值">无价值</option>' +
                        '<option value="评估值">评估值</option>' +
                        '<option value="名义金额">名义金额</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>入账形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reEnterAccountType + '" autocomplete="off" id="bookingForm" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>价值（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reValue + '" autocomplete="off" id="value" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财政拨款（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].rePublicEconomy + '" autocomplete="off" id="fiscalAppropriation" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>非财政拨款（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reNotPublicEconomy + '" autocomplete="off" id="notFiscalAppropriation" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>均价：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reAveragePrice + '" autocomplete="off" id="averagePrice" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>会计凭证号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reAccountingDocumentNum + '" autocomplete="off" id="accountNum" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用状况：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reUseState + '" autocomplete="off" type="text" class="form-control" id="useState" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财务入账日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reEnterAccountDate + '" autocomplete="off" readonly id="caiWuDate" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>投入使用日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reStartUseDate + '" autocomplete="off" readonly id="useDate" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用部门：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reUseDepart + '" autocomplete="off" style="background-color: #fff;" readonly type="text" id="useDepart" class="form-control" value="">' +
                        '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews1">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>管理部门：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="' + a[0].reChargeDepart + '" autocomplete="off" style="background-color: #fff;" readonly type="text" id="manageDepart" class="form-control" value="">' +
                        '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备用字段：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input value="' + a[0].reReserveField + '" autocomplete="off" type="text" class="form-control" id="standbyField" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备注：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input value="' + a[0].reRemarks + '" autocomplete="off" type="text" class="form-control" id="remark" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>照片附件：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<form enctype="multipart/form-data" id="Form">' +
                        '<input accept="image/*" id="uploadFile" multiple type="file" name="file">' +
                        '</form>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                });


            } else {
                parent.parent.layer.msg('请选择单行数据');
            }
        });


        // 删除表格数据
        $("#btn_delete").on('click', function() {
            console.log('删除')
            var a = $("#tb_departments").bootstrapTable('getSelections');
            var delData = []; //要删除的数据

            if (a.length == 0) {
                layer.msg('请选择要删除的数据');
            } else {
                //获取选中的ID
                for (var i = 0; i < a.length; i++) {
                    delData[i] = a[i].id;
                }
                console.log('删除的数据', delData);

                parent.parent.layer.open({
                    type: 1,
                    title: '提示',
                    area: ['300px', '200px'],
                    btn: ['确定', '取消'],
                    success: function(layero, index) {
                        layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                    },
                    yes: function(index, layero) {
                        $.ajax({
                            url: port + '/v1/relic/deleteRelic',
                            type: 'post',
                            data: {
                                ids: delData.toString()
                            },
                            success: function(data) {
                                if (data > 0) {
                                    parent.parent.layer.msg('删除成功');
                                    parent.parent.layer.close(index);
                                    $("#tb_departments").bootstrapTable('refresh');
                                }

                            }
                        });
                        console.log('确定');
                    },
                    btnAlign: 'c',
                    content: '<div style="margin:20px">确定要删除选中的数据?</div>'
                });

            }
        });


        // 导出（导出所有、选择导出）
        $("#btn_export").on('click', function() {

            var a = $("#tb_departments").bootstrapTable('getSelections');
            var exportData = []; //要导出的数据

            if (a.length == 0) {
                layer.msg('请选择导出的数据');
            } else {
                //获取选中的选项
                for (var i = 0; i < a.length; i++) {
                    exportData[i] = a[i].id;
                }
                location.href = port + '/v1/relic/exportRelic?ids=' + exportData.toString();
            }
        });


    };
    return oInit;
};