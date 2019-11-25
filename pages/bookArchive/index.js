var phongReg = /^[1][3,4,5,7,8][0-9]{9}$/; //手机号格式验证
var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证正则验证
var currentTreeId = ''; //当前点击树状id
var currentTreeText = ''; //当前点击树状text

var uploadFile;

// 获取选中的行数据
function getSelectData() {
    var data = $("#tb_departments").bootstrapTable('getSelections');
    return {
        type: '图书',
        data: data
    };
}

$(function() {

    // 树状数据
    $('#tree').treeview({
        data: getTree()
    });
    // 树状数据事件
    $('#tree').on('nodeSelected', function(event, data) {
        currentTreeId = data.id;
        currentTreeText = data.text;
        $("#tb_departments").bootstrapTable('refresh');

    });

    // 左侧树状图没有选择时
    $('#tree').on('nodeUnselected', function(event, data) {
        currentTreeText = '';
        currentTreeId = '';
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
            url: port + '/v1/book/selectBookPage',
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
                field: 'boName',
                align: 'center',
                title: '资产名称'
            }, {
                field: 'boType',
                align: 'center',
                title: '资产分类名称'
            }, {
                field: 'boCode',
                align: 'center',
                title: '资产编号'
            }, {
                field: 'boChargeDepart',
                align: 'center',
                title: '管理部门'
            }, {
                field: 'boGainType',
                align: 'center',
                title: '取得方式'
            }, {
                field: 'boGainDate',
                align: 'center',
                title: '取得日期'
            }, {
                field: 'boRemarks',
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

    //得到查询的参数
    oTableInit.queryParams = function(params) {
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            pageSize: params.limit, //页面大小
            pageNum: (params.offset / params.limit) + 1, //页码
            pJobnum: $('#work_number').val(), //工号
            pName: $('#user_name').val(), //姓名
            boName: $('#org_name').val(), //编号、名称
            pJobNum: localStorage.getItem('pJobnum')
        };
        return temp;
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
                '<td>' + row.boName + '</td>' +
                '<td>资产分类名称</td>' +
                '<td>' + row.boType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>存放地点</td>' +
                '<td>' + row.boDepo + '</td>' +
                '<td>采购组织形式</td>' +
                '<td>' + row.boBuyType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>预算项目编号</td>' +
                '<td>' + row.boBudgetnum + '</td>' +
                '<td>资产编号</td>' +
                '<td>' + row.boCode + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>取得方式</td>' +
                '<td>' + row.boGainType + '</td>' +
                '<td>数量</td>' +
                '<td>' + row.boNumbers + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>取得日期</td>' +
                '<td>' + row.boGainDate + '</td>' +
                '<td>价值类型</td>' +
                '<td>' + row.boValueType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>入账形式</td>' +
                '<td>' + row.boEnterAccountType + '</td>' +
                '<td>价值（元）</td>' +
                '<td>' + row.boValue + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>财政拨款（元）</td>' +
                '<td>' + row.boPublicEconomy + '</td>' +
                '<td>非财政拨款（元）</td>' +
                '<td>' + row.boNotPublicEconomy + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>均价</td>' +
                '<td>' + row.boAveragePrice + '</td>' +
                '<td>会计凭证号</td>' +
                '<td>' + row.boAccountingDocumentNum + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>使用状况</td>' +
                '<td>' + row.boUseState + '</td>' +
                '<td>财务入账日期</td>' +
                '<td>' + row.boEnterAccountDate + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>投入使用日期</td>' +
                '<td>' + row.boStartUseDate + '</td>' +
                '<td>保存年限（月）</td>' +
                '<td>' + row.boPreserveYears + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>使用部门</td>' +
                '<td>' + row.boUseDepart + '</td>' +
                '<td>管理部门</td>' +
                '<td>' + row.boChargeDepart + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>使用人</td>' +
                '<td>' + row.boUsePerson + '</td>' +
                '<td>档案号</td>' +
                '<td>' + row.boFilesnum + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>出版社</td>' +
                '<td>' + row.boPress + '</td>' +
                '<td>出版日期</td>' +
                '<td>' + row.boPressDate + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>备用字段</td>' +
                '<td>' + row.boReserveField + '</td>' +
                '<td>备注</td>' +
                '<td>' + row.boRemarks + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>照片附件</td>' +
                '<td colspan="3"><img class="annex-img" src="' + row.boImgpath + '"></td>' +
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
    var formData = new FormData();
    var upLoadImg = '';

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
                    var storagePlace = layero.find('#storagePlace').val(); //存放地点
                    var buyOrgType = layero.find('#buyOrgType').val(); //采购组织形式
                    var budgetProjectNumber = layero.find('#budgetProjectNumber').val(); //预算项目编号
                    var assetNum = layero.find('#assetNum').val(); //资产编号
                    var gainWay = layero.find('#gainWay').val(); //取得方式
                    var number = layero.find('#number').val(); //数量
                    var gainDate = layero.find('#gainDate').val(); //取得日期
                    var valueType = layero.find('#valueType option:selected').text(); //价值类型
                    var importAccountWay = layero.find('#importAccountWay').val(); //入账形式
                    var fiscalAppropriation = layero.find('#fiscalAppropriation').val(); //财政拨款
                    var noFiscalAppropriation = layero.find('#noFiscalAppropriation').val(); //非财政拨款
                    var value = layero.find('#value').val(); //价值
                    var averagePrice = layero.find('#averagePrice').val(); //均价
                    var kjVoucherNum = layero.find('#kjVoucherNum').val(); //会计凭证号
                    var useState = layero.find('#useState').val(); //使用状况
                    var caiWuDate = layero.find('#caiWuDate').val(); //财务入账日期
                    var useDate = layero.find('#useDate').val(); //投入使用日期
                    var saveTime = layero.find('#saveTime').val(); //保存年限
                    var useDepart = layero.find('#useDepart').val(); //使用部门
                    var manageDepart = layero.find('#manageDepart').val(); //管理部门
                    var usePerson = layero.find('#usePerson').val(); //使用人
                    var archivesNum = layero.find('#archivesNum').val(); //档案号
                    var press = layero.find('#press').val(); //出版社
                    var pressDate = layero.find('#pressDate').val(); //出版日期
                    var standbyField = layero.find('#standbyField').val(); //备用字段
                    var remark = layero.find('#remark').val(); //备注


                    if (assetName == '') {
                        parent.parent.layer.msg('请输入资产名称');
                        return;
                    }



                    if (number == '') {
                        parent.parent.layer.msg('请输入数量');
                        return;
                    }

                    if (gainDate == '') {
                        parent.parent.layer.msg('请选择取得日期');
                        return;
                    }

                    if (value == '') {
                        parent.parent.layer.msg('请输入价值');
                        return;
                    }

                    if (manageDepart == '') {
                        parent.parent.layer.msg('请选择管理部门');
                        return;
                    }


                    // 添加
                    $.ajax({
                        url: port + '/v1/book/insertBook',
                        type: 'post',
                        data: {
                            boName: assetName, //资产名称
                            boType: assetTypeName, //资产分类名称
                            boDepo: storagePlace, //存放地点
                            boBuyType: buyOrgType, //采购组织形式
                            boBudgetnum: budgetProjectNumber, //预算项目编号
                            boCode: assetNum, //资产编号
                            boGainType: gainWay, //取得方式
                            boNumbers: number, //数量
                            boGainDate: gainDate, //取得日期
                            boValueType: valueType, //价值类型
                            boEnterAccountType: importAccountWay, //入账形式
                            boPublicEconomy: fiscalAppropriation, //财政拨款
                            boNotPublicEconomy: noFiscalAppropriation, //非财政拨款
                            boValue: value, //价值
                            boAveragePrice: averagePrice, //均价
                            boAccountingDocumentNum: kjVoucherNum, //会计凭证号
                            boUseState: useState, //使用状况
                            boEnterAccountDate: caiWuDate, //财务入账日期
                            boStartUseDate: useDate, //投入使用日期
                            boPreserveYears: saveTime, //保存年限
                            boChargeDepart: manageDepart, //管理部门
                            boUseDepart: useDepart, //使用部门
                            boUsePerson: usePerson, //使用人
                            boFilesnum: archivesNum, //档案号
                            boPress: press, //出版社
                            boPressDate: pressDate, //出版日期
                            boReserveField: standbyField, //备用字段
                            boRemarks: remark, //备注
                            boImgpath: uploadFile, //照片附件
                            pJobNum: localStorage.getItem('pJobnum')
                        },
                        success: function(res) {
                            if (res > 0) {
                                $("#tb_departments").bootstrapTable('refresh');
                                parent.parent.layer.msg('已添加');
                                parent.parent.layer.close(index);
                            }
                        }
                    });





                },
                success: function(layero, index) {
                    layero.find('.layui-layer-btn0').css('background', '#27AAE1');

                    // 上传照片
                    layero.find('#uploadFile').change(function(event) {
                        $.ajax({
                            url: port + "/v1/book/importBookImg",
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
                                layero.find('#useDepart').attr('value', data.text);
                                layero.find("#treeviews").hide();
                            }
                        };
                        layero.find('#treeviews').treeview(options);
                        layero.find('#treeviews').show();

                    });




                    // 取得日期
                    parent.parent.laydate.render({
                        elem: '#gainDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#gainDate').attr('value', value);
                        }
                    });

                    // 发证日期
                    parent.parent.laydate.render({
                        elem: '#faZhengDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#faZhengDate').attr('value', value);
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

                    // 出版日期
                    parent.parent.laydate.render({
                        elem: '#pressDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#pressDate').attr('value', value);
                        }
                    });


                    // 生成资产编号
                    $.ajax({
                        url: port + '/v1/book/createCode',
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
                    '<input readonly autocomplete="off" value="图书" id="assetTypeName" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>存放地点：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="storagePlace" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>采购组织形式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="buyOrgType" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>预算项目编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="budgetProjectNumber" type="text" class="form-control" />' +
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
                    '<input readonly autocomplete="off" value="新购"  id="gainWay" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>数量：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="number" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>取得日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="gainDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>价值类型：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<select class="form-control" id="valueType">' +
                    '<option>原值</option>' +
                    '<option>暂估值</option>' +
                    '<option>重置值</option>' +
                    '<option>无价值</option>' +
                    '<option>评估值</option>' +
                    '<option>名义金额</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>入账形式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="importAccountWay" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>财政拨款（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="fiscalAppropriation" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>非财政拨款：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="noFiscalAppropriation" type="text" class="form-control" />' +
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
                    '<input autocomplete="off" id="kjVoucherNum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用状况：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="useState" type="text" class="form-control" />' +
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
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>保存年限（月）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="saveTime" type="text" class="form-control" />' +
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
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用部门：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off"  type="text" id="useDepart" class="form-control" readonly value="">' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用人：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="usePerson" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>档案号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="archivesNum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>出版社：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="press" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>出版日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="pressDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>备用字段：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<input autocomplete="off" id="standbyField" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>备注：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<input id="remark" autocomplete="off" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>照片附件：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<form enctype="multipart/form-data" id="Form">' +
                    '<input accept="image/*" multiple type="file" name="file" id="uploadFile">' +
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
                        var storagePlace = layero.find('#storagePlace').val(); //存放地点
                        var buyOrgType = layero.find('#buyOrgType').val(); //采购组织形式
                        var budgetProjectNumber = layero.find('#budgetProjectNumber').val(); //预算项目编号
                        var assetNum = layero.find('#assetNum').val(); //资产编号
                        var gainWay = layero.find('#gainWay').val(); //取得方式
                        var number = layero.find('#number').val(); //数量
                        var gainDate = layero.find('#gainDate').val(); //取得日期
                        var valueType = layero.find('#valueType option:selected').text(); //价值类型
                        var importAccountWay = layero.find('#importAccountWay').val(); //入账形式
                        var fiscalAppropriation = layero.find('#fiscalAppropriation').val(); //财政拨款
                        var noFiscalAppropriation = layero.find('#noFiscalAppropriation').val(); //非财政拨款
                        var value = layero.find('#value').val(); //价值
                        var averagePrice = layero.find('#averagePrice').val(); //均价
                        var kjVoucherNum = layero.find('#kjVoucherNum').val(); //会计凭证号
                        var useState = layero.find('#useState').val(); //使用状况
                        var caiWuDate = layero.find('#caiWuDate').val(); //财务入账日期
                        var useDate = layero.find('#useDate').val(); //投入使用日期
                        var saveTime = layero.find('#saveTime').val(); //保存年限
                        var useDepart = layero.find('#useDepart').val(); //使用部门
                        var manageDepart = layero.find('#manageDepart').val(); //管理部门
                        var usePerson = layero.find('#usePerson').val(); //使用人
                        var archivesNum = layero.find('#archivesNum').val(); //档案号
                        var press = layero.find('#press').val(); //出版社
                        var pressDate = layero.find('#pressDate').val(); //出版日期
                        var standbyField = layero.find('#standbyField').val(); //备用字段
                        var remark = layero.find('#remark').val(); //备注


                        if (assetName == '') {
                            layer.msg('请输入资产名称');
                            return;
                        }



                        if (number == '') {
                            parent.parent.layer.msg('请输入数量');
                            return;
                        }

                        if (gainDate == '') {
                            parent.parent.layer.msg('请选择取得日期');
                            return;
                        }

                        if (value == '') {
                            parent.parent.layer.msg('请输入价值');
                            return;
                        }

                        if (manageDepart == '') {
                            parent.parent.layer.msg('请选择管理部门');
                            return;
                        }



                        $.ajax({
                            url: port + '/v1/book/updateBook',
                            type: 'post',
                            data: {
                                id: a[0].id,
                                boName: assetName, //资产名称
                                boType: assetTypeName, //资产分类名称
                                boDepo: storagePlace, //存放地点
                                boBuyType: buyOrgType, //采购组织形式
                                boBudgetnum: buyOrgType, //预算项目编号
                                boCode: assetNum, //资产编号
                                boGainType: gainWay, //取得方式
                                boNumbers: number, //数量
                                boGainDate: gainDate, //取得日期
                                boValueType: valueType, //价值类型
                                boEnterAccountType: importAccountWay, //入账形式
                                boPublicEconomy: fiscalAppropriation, //财政拨款
                                boNotPublicEconomy: noFiscalAppropriation, //非财政拨款
                                boValue: value, //价值
                                boAveragePrice: averagePrice, //均价
                                boAccountingDocumentNum: kjVoucherNum, //会计凭证号
                                boUseState: useState, //使用状况
                                boEnterAccountDate: caiWuDate, //财务入账日期
                                boStartUseDate: useDate, //投入使用日期
                                boPreserveYears: saveTime, //保存年限
                                boChargeDepart: manageDepart, //管理部门
                                boUseDepart: useDepart, //使用部门
                                boUsePerson: usePerson, //使用人
                                boFilesnum: archivesNum, //档案号
                                boPress: press, //出版社
                                boPressDate: pressDate, //出版日期
                                boReserveField: standbyField, //备用字段
                                boRemarks: remark, //备注
                                pJobNum: localStorage.getItem('pJobnum')
                            },
                            success: function(res) {
                                if (res > 0) {
                                    $("#tb_departments").bootstrapTable('refresh');
                                    parent.parent.layer.msg('修改成功');
                                    parent.parent.layer.close(index);
                                }
                            }
                        });


                    },
                    success: function(layero, index) {
                        layero.find('.layui-layer-btn0').css('background', '#27AAE1');


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
                                    layero.find('#useDepart').attr('value', data.text);
                                    layero.find("#treeviews").hide();
                                }
                            };
                            layero.find('#treeviews').treeview(options);
                            layero.find('#treeviews').show();

                        });




                        // 取得日期
                        parent.parent.laydate.render({
                            elem: '#gainDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#gainDate').attr('value', value);
                            }
                        });

                        // 发证日期
                        parent.parent.laydate.render({
                            elem: '#faZhengDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#faZhengDate').attr('value', value);
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

                        // 出版日期
                        parent.parent.laydate.render({
                            elem: '#pressDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#pressDate').attr('value', value);
                            }
                        });


                        // 价值类型下拉框回显
                        layero.find('#valueType option').each(function(index, item) {
                            if (a[0].boValueType == $(item).text()) {
                                $(item).attr('selected', true);
                            }
                        });

                    },
                    btnAlign: 'c',
                    content: '<div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>资产名称：</label></div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0" style="position: relative;">' +
                        '<input autocomplete="off" style="background-color: #fff;" type="text" class="form-control" value="' + a[0].boName + '" id="assetName">' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产分类名称：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" value="图书" id="assetTypeName" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>存放地点：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].boDepo + '" id="storagePlace" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>采购组织形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].boBuyType + '" id="buyOrgType" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>预算项目编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="budgetProjectNumber" type="text" class="form-control" value="' + a[0].boBudgetnum + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" id="assetNum" type="text" class="form-control" value="' + a[0].boCode + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>取得方式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" value="新购"  id="gainWay" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>数量：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="number" type="text" class="form-control" value="' + a[0].boNumbers + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>取得日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="gainDate" type="text" class="form-control" value="' + a[0].boGainDate + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>价值类型：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<select class="form-control" id="valueType">' +
                        '<option>原值</option>' +
                        '<option>暂估值</option>' +
                        '<option>重置值</option>' +
                        '<option>无价值</option>' +
                        '<option>评估值</option>' +
                        '<option>名义金额</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>入账形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="importAccountWay" type="text" class="form-control" value="' + a[0].boEnterAccountType + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财政拨款（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="fiscalAppropriation" type="text" class="form-control" value="' + a[0].boPublicEconomy + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>非财政拨款：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="noFiscalAppropriation" type="text" class="form-control" value="' + a[0].boNotPublicEconomy + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>价值（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="value" type="text" class="form-control" value="' + a[0].boValue + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>均价：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="averagePrice" type="text" class="form-control" value="' + a[0].boAveragePrice + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>会计凭证号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="kjVoucherNum" type="text" class="form-control" value="' + a[0].boAccountingDocumentNum + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用状况：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="useState" type="text" class="form-control" value="' + a[0].boUseState + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财务入账日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="caiWuDate" type="text" class="form-control" value="' + a[0].boEnterAccountDate + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>投入使用日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="useDate" type="text" class="form-control" value="' + a[0].boStartUseDate + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>保存年限（月）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="saveTime" type="text" class="form-control" value="' + a[0].boPreserveYears + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>管理部门：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" style="background-color: #fff;" readonly type="text" id="manageDepart" class="form-control" value=' + a[0].boChargeDepart + '>' +
                        '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用部门：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off"  type="text" id="useDepart" class="form-control" readonly value="' + a[0].boUseDepart + '">' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用人：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="usePerson" type="text" class="form-control" value="' + a[0].boUsePerson + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>档案号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="archivesNum" type="text" class="form-control" value="' + a[0].boFilesnum + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>出版社：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="press" type="text" class="form-control" value="' + a[0].boPress + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>出版日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="pressDate" type="text" class="form-control" value="' + a[0].boPressDate + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备用字段：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input autocomplete="off" id="standbyField" type="text" class="form-control" value="' + a[0].boReserveField + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备注：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input id="remark" autocomplete="off" type="text" class="form-control" value="' + a[0].boRemarks + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>照片附件：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input id="photo" autocomplete="off" type="file" />' +
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
                parent.parent.layer.msg('请选择要删除的数据');
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
                            url: port + '/v1/book/deleteBook',
                            type: 'post',
                            data: {
                                ids: delData.toString()
                            },
                            success: function(data) {
                                console.log(data)
                                parent.parent.layer.msg('删除成功');
                                parent.parent.layer.close(index);
                                $("#tb_departments").bootstrapTable('refresh'); //刷新表格数据
                            }
                        });
                        console.log('确定');

                    },
                    btnAlign: 'c',
                    content: '<div style="margin:20px">确定要删除选中的数据?</div>'
                });

            }
        });


        // 导出
        $("#btn_export").on('click', function() {

            var a = $("#tb_departments").bootstrapTable('getSelections');
            var exportData = []; //要导出的数据

            if (a.length == 0) {
                layer.msg('请选择要导出的数据');
            } else {
                //获取选中的选项
                for (var i = 0; i < a.length; i++) {
                    exportData[i] = a[i].id;
                }
                location.href = port + '/v1/book/exportBook?ids=' + exportData.toString();
            }
        });


    };
    return oInit;
};