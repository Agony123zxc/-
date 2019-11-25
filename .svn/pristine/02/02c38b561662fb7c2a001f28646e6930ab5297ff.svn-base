var phongReg = /^[1][3,4,5,7,8][0-9]{9}$/; //手机号格式验证
var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证正则验证
var currentTreeId = ''; //当前点击树状id
var currentTreeText = ''; //当前点击树状text


// 获取选中的行数据
function getSelectData() {
    var data = $("#tb_departments").bootstrapTable('getSelections');
    return {
        type: '构筑物',
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
            url: port + '/v1/structures/selectStructuresPage',
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
                field: 'stName',
                align: 'center',
                title: '资产名称'
            }, {
                field: 'stType',
                align: 'center',
                title: '资产分类名称'
            }, {
                field: 'stPropertynum',
                align: 'center',
                title: '资产编号'
            }, {
                field: 'stChargeDepart',
                align: 'center',
                title: '管理部门'
            }, {
                field: 'stGainType',
                align: 'center',
                title: '取得方式'
            }, {
                field: 'stGainDate',
                align: 'center',
                title: '取得日期'
            }, {
                field: 'stRemarks',
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
            pJobNum: localStorage.getItem('pJobnum'),
            stName: $('#org_name').val(), //姓名
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
                '<td>' + row.stName + '</td>' +
                '<td>资产分类名称</td>' +
                '<td>' + row.stType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>坐落位置</td>' +
                '<td>' + row.stPlace + '</td>' +
                '<td>构筑物计量</td>' +
                '<td>' + row.stStructuresUnit + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>预算项目编号</td>' +
                '<td>' + row.stBudgetnum + '</td>' +
                '<td>资产编号</td>' +
                '<td>' + row.stPropertynum + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>取得方式</td>' +
                '<td>' + row.stGainType + '</td>' +
                '<td>预计使用年限</td>' +
                '<td>' + row.stEstimateUseYears + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>取得日期</td>' +
                '<td>' + row.stGainDate + '</td>' +
                '<td>数量</td>' +
                '<td>' + row.stNumbers + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>权属性质</td>' +
                '<td>' + row.stPropertyRightNature + '</td>' +
                '<td>建筑结构</td>' +
                '<td>' + row.stBuildingStructure + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>竣工日期</td>' +
                '<td>' + row.stCompletedDate + '</td>' +
                '<td>入账形式</td>' +
                '<td>' + row.stEnterAccountType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>价值类型</td>' +
                '<td>' + row.stValueType + '</td>' +
                '<td>价值（元）</td>' +
                '<td>' + row.stValue + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>财政拨款（元）</td>' +
                '<td>' + row.stPublicEconomy + '</td>' +
                '<td>非财政拨款（元）</td>' +
                '<td>' + row.stNotPublicEconomy + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>会计凭证号</td>' +
                '<td>' + row.stAccountingDocumentNum + '</td>' +
                '<td>财务入账日期</td>' +
                '<td>' + row.stEnterAccountDate + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>管理部门</td>' +
                '<td>' + row.stChargeDepart + '</td>' +
                '<td>使用状况</td>' +
                '<td>' + row.stUseState + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>折旧状态</td>' +
                '<td>' + row.stDepreciationState + '</td>' +
                '<td>折旧方法</td>' +
                '<td>' + row.stDepreciationMethod + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>月折旧额</td>' +
                '<td>' + row.stDepreciatedOneMonthMoney + '</td>' +
                '<td>折旧年限（月）</td>' +
                '<td>' + row.stDepreciatedYears + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>已提折旧月数</td>' +
                '<td>' + row.stDepreciatedMonthNumbers + '</td>' +
                '<td>累计折旧</td>' +
                '<td>' + row.stAddupDepreciated + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>备用字段</td>' +
                '<td>' + row.stReserveField + '</td>' +
                '<td>备注</td>' +
                '<td>' + row.stRemarks + '</td>' +
                '</tr>' +

                '<tr>' +
                '<td>照片附件</td>' +
                '<td colspan="3"><img class="annex-img" src="' + row.stImgpath + '"></td>' +
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
    var dispic;

    oInit.Init = function() {
        // 添加表格数据
        $("#btn_add").on('click', function() {

            parent.parent.layer.open({
                type: 1,
                title: '添加',
                area: ['760px', '500px'],
                btn: ['确定', '取消'],
                yes: function(index, layero) {
                    var work_number = layero.find('#work_number').val(); //工号

                    if (layero.find("#zcName").val() == "") {
                        parent.parent.layer.msg("请输入资产名称")
                        return;
                    }


                    if (layero.find("#quDate").val() == "") {
                        parent.parent.layer.msg("请选择取得日期")
                        return;
                    }
                    if (layero.find("#totalNum").val() == "") {
                        parent.parent.layer.msg("请输入数量")
                        return;
                    }

                    if (layero.find("#totalPrc").val() == "") {
                        parent.parent.layer.msg("请输入价值")
                        return;
                    }

                    if (layero.find("#manageDepart").val() == "") {
                        parent.parent.layer.msg("请选择管理部门")
                        return;
                    }

                    console.log(layero.find("#xmysNum").val())
                    $.ajax({
                        url: port + "/v1/structures/insertStructures",
                        type: "post",
                        data: {
                            stName: layero.find("#zcName").val(), //资产名称
                            stType: layero.find("#number").val(), //资产分类名称
                            stPlace: layero.find("#xmysNum").val(), //坐落位置
                            stStructuresUnit: layero.find("#gzwMeasure").val(), //构筑物计量
                            stBudgetnum: layero.find("#ysProjectN").val(), //预算项目编号
                            stGainType: layero.find("#getType").val(), //取得方式
                            stEstimateUseYears: layero.find("#needUseYear").val(), //预计使用年限
                            stGainDate: layero.find("#quDate").val(), //取得日期
                            stNumbers: layero.find("#totalNum").val(), //数量
                            stPropertyRightNature: layero.find("#qsxz").val(), //权属性质
                            stBuildingStructure: layero.find("#buildJg").val(), //建筑结构
                            stCompletedDate: layero.find("#doneDate").val(), //竣工日期
                            stEnterAccountType: layero.find("#srType").val(), //入账形式
                            stValueType: layero.find("#valType option:selected").val(), //价值类型
                            stValue: layero.find("#totalPrc").val(), //价值（元）
                            stPublicEconomy: layero.find("#czPay").val(), //财政拨款
                            stNotPublicEconomy: layero.find("#nczPay").val(), //非财政拨款
                            stAccountingDocumentNum: layero.find("#kjpzh").val(), //会计凭证号
                            stEnterAccountDate: layero.find("#caiWuDate").val(), //财务入账日期
                            stChargeDepart: layero.find("#manageDepart").val(), //管理部门
                            stUseState: layero.find("#useState").val(), //使用状况
                            stDepreciationState: layero.find("#zjstated option:selected").val(), //折旧状态
                            stDepreciationMethod: layero.find("#zjff option:selected").val(), //折旧方法
                            stDepreciatedOneMonthMoney: layero.find("#mzje").val(), //月折旧额
                            stDepreciatedYears: layero.find("#zjnx").val(), //折旧年限
                            stDepreciatedMonthNumbers: layero.find("#yzjM").val(), //已提折旧月数
                            stAddupDepreciated: layero.find("#totalZj").val(), //累计折旧
                            stRemarks: layero.find("#remarks").val(), //备注
                            stReserveField: layero.find("#spare").val(), //备用字段
                            stImgpath: dispic, //照片附件
                            stPropertynum: layero.find("#oldZcN").val(), //资产编号
                            pJobNum: localStorage.getItem('pJobnum')
                        },
                        success: function(res) {
                            console.log(res)
                            if (res > 0) {
                                parent.parent.layer.msg("添加成功")
                                parent.parent.layer.close(index)
                                $("#tb_departments").bootstrapTable("refresh")
                            }

                        }
                    })



                },
                success: function(layero, index) {
                    layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                    layero.find('input[readonly]').css('background', '#fff');



                    $(document).ready(function() {
                        $(".misBtn").change();
                    })
                    //图片上传
                    $('input[name="file"]').on('change', function() {
                        $.ajax({
                            url: port + "/v1/structures/importStructuresImg",
                            type: 'post',
                            data: new FormData($('#Form')[0]), // 上传formdata封装的数据
                            cache: false, //// 不缓存
                            processData: false, //不处理发送的数据
                            contentType: false, //不设置Content-Type请求头
                            success: function(data) {
                                console.log(data);
                                dispic = data
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

                    // 编号重复查询
                    layero.find('#number').blur(function(event) {
                        $.ajax({
                            url: port + '/v1/organize/validationAddOrganization',
                            type: 'post',
                            data: {
                                orgIdNum: layero.find('#number').val()
                            },
                            success: function(res) {
                                if (res == 0) {
                                    layer.msg('编号已存在');
                                    layero.find('#number').val('');
                                }
                            }
                        });
                    });

                    // 上级部门
                    layero.find('#up_department').on('click', function() {
                        var options = {
                            bootstrap2: false,
                            showTags: true,
                            levels: 5,
                            checkedIcon: "glyphicon glyphicon-check",
                            data: getTree(),
                            onNodeSelected: function(event, data) {
                                console.log(data);
                                layero.find('#up_department').attr('value', data.text);
                                layero.find("#treeviews").hide();
                            }
                        };
                        layero.find('#treeviews').treeview(options);
                        layero.find('#treeviews').show();
                    });

                    // 取得日期
                    parent.parent.laydate.render({
                        elem: '#quDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#quDate').attr('value', value);
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

                    // 竣工日期
                    parent.parent.laydate.render({
                        elem: '#doneDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#doneDate').attr('value', value);
                        }
                    });


                    // 生成资产编号
                    $.ajax({
                        url: port + '/v1/structures/createCode',
                        type: 'post',
                        success: function(res) {
                            console.log('资产编号：', res);
                            layero.find('#oldZcN').attr('value', res.msg);
                        }
                    });


                },
                btnAlign: 'c',
                content: '<div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>资产名称：</label></div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0" style="position: relative;">' +
                    '<input autocomplete="off" style="background-color: #fff;" id="zcName" type="text" class="form-control" value="">' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>资产分类名称：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly value="构筑物" autocomplete="off" id="number" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>坐落位置：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="xmysNum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>构筑物计量：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="gzwMeasure" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>预算项目编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="ysProjectN" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>资产编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" id="oldZcN" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>取得方式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" id="getType" name="getType" type="text" class="form-control" value="新购" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>预计使用年限：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="needUseYear" type="text" class="form-control" />' +
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
                    '<label><i class="must-star">*</i>数量：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="totalNum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>权属性质：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="qsxz" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>建筑结构：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="buildJg" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>竣工日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="doneDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>入账形式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="srType" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>价值类型：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<select class="form-control" id="valType">' +
                    '<option></option>' +
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
                    '<label><i class="must-star">*</i>价值（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="totalPrc" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>财政拨款（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="czPay" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>非财政拨款（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="nczPay" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>会计凭证号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="kjpzh" type="text" class="form-control" />' +
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
                    '<label>折旧状态：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<select class="form-control" id="zjstated">' +
                    '<option>提折旧</option>' +
                    '<option>不提折旧</option>' +
                    '<option>已完成折旧</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>折旧方法：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<select class="form-control" id="zjff">' +
                    '<option>固定金额法</option>' +
                    '<option>评价年限法</option>' +
                    '<option>评价年限法一</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>月折旧额：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="mzje" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>折旧年限（月）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="zjnx" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>已提折旧月数：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="yzjM" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +

                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>累计折旧：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="totalZj" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +

                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>备用字段：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<input autocomplete="off" type="text" id="spare" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>备注：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<input autocomplete="off" type="text" id="remarks" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>照片附件：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +

                    '<form enctype="multipart/form-data" id="Form">' +
                    '<input accept="image/*" multiple type="file" name="file">' +
                    '<a href="javascript:;" class="btn misBtn" style="display:none">提交</a>' +
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

                        var work_number = layero.find('#work_number').val(); //工号

                        if (layero.find("#zcName").val() == "") {
                            parent.parent.layer.msg("请输入资产名称")
                            return;
                        }


                        if (layero.find("#manageDepart").val() == "") {
                            parent.parent.layer.msg("请选择管理部门")
                            return;
                        }
                        if (layero.find("#quDate").val() == "") {
                            parent.parent.layer.msg("请选择取得日期")
                            return;
                        }
                        if (layero.find("#totalNum").val() == "") {
                            parent.parent.layer.msg("请输入数量")
                            return;
                        }

                        if (layero.find("#totalPrc").val() == "") {
                            parent.parent.layer.msg("请输入价值")
                            return;
                        }


                        console.log(layero.find("#xmysNum").val())
                        $.ajax({
                            url: port + "/v1/structures/updateStructures",
                            type: "post",
                            data: {
                                id: a[0].id,
                                stName: layero.find("#zcName").val(), //资产名称
                                stType: layero.find("#number").val(), //资产分类名称
                                stPlace: layero.find("#xmysNum").val(), //坐落位置
                                stStructuresUnit: layero.find("#gzwMeasure").val(), //构筑物计量
                                stBudgetnum: layero.find("#ysProjectN").val(), //预算项目编号
                                stGainType: layero.find("#getType").val(), //取得方式
                                stEstimateUseYears: layero.find("#needUseYear").val(), //预计使用年限
                                stGainDate: layero.find("#quDate").val(), //取得日期
                                stNumbers: layero.find("#totalNum").val(), //数量
                                stPropertyRightNature: layero.find("#qsxz").val(), //权属性质
                                stBuildingStructure: layero.find("#buildJg").val(), //建筑结构
                                stCompletedDate: layero.find("#doneDate").val(), //竣工日期
                                stEnterAccountType: layero.find("#srType").val(), //入账形式
                                stValueType: layero.find("#valType option:selected").val(), //价值类型
                                stValue: layero.find("#totalPrc").val(), //价值（元）
                                stPublicEconomy: layero.find("#czPay").val(), //财政拨款
                                stNotPublicEconomy: layero.find("#nczPay").val(), //非财政拨款
                                stAccountingDocumentNum: layero.find("#kjpzh").val(), //会计凭证号
                                stEnterAccountDate: layero.find("#caiWuDate").val(), //财务入账日期
                                stChargeDepart: layero.find("#manageDepart").val(), //管理部门
                                stUseState: layero.find("#useState").val(), //使用状况
                                stDepreciationState: layero.find("#zjstated option:selected").val(), //折旧状态
                                stDepreciationMethod: layero.find("#zjff option:selected").val(), //折旧方法
                                stDepreciatedOneMonthMoney: layero.find("#mzje").val(), //月折旧额
                                stDepreciatedYears: layero.find("#zjnx").val(), //折旧年限
                                stDepreciatedMonthNumbers: layero.find("#yzjM").val(), //已提折旧月数
                                stAddupDepreciated: layero.find("#totalZj").val(), //累计折旧
                                stRemarks: layero.find("#remarks").val(), //备注
                                stReserveField: layero.find("#spare").val(), //备用字段
                                stImgpath: dispic, //照片附件
                                stPropertynum: layero.find("#oldZcN").val(), //资产编号
                                pJobNum: localStorage.getItem('pJobnum')
                            },
                            success: function(res) {
                                console.log(res)
                                if (res > 0) {
                                    parent.parent.layer.msg("修改成功")
                                    parent.parent.layer.close(index);
                                    $("#tb_departments").bootstrapTable("refresh")
                                }
                            }
                        })




                    },
                    success: function(layero, index) {
                        layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                        layero.find('input[readonly]').css('background', '#fff');


                        $("#getType").find("option[value=" + a[0].stGainType + "]").attr("selected", true); //取得方式
                        if (a[0].stValueType) {
                            $("#valType").find("option[value=" + a[0].stValueType + "]").attr("selected", true); //价值类型
                        }
                        if (a[0].stDepreciationMethod) {
                            $("#zjff").find("option[value=" + a[0].stDepreciationMethod + "]").attr("selected", true);
                        }
                        if (a[0].stDepreciationState) {
                            $("#zjstated").find("option[value=" + a[0].stDepreciationState + "]").attr("selected", true);
                        }


                        $(document).ready(function() {
                            $(".misBtn").change();
                        })
                        //图片上传
                        $('input[name="file"]').on('change', function() {
                            $.ajax({
                                url: port + "/v1/structures/importStructuresImg",
                                type: 'post',
                                data: new FormData($('#Form')[0]), // 上传formdata封装的数据
                                cache: false, //// 不缓存
                                processData: false, //不处理发送的数据
                                contentType: false, //不设置Content-Type请求头
                                success: function(data) {
                                    console.log(data);
                                    dispic = data
                                }
                            });
                        });


                        // 取得方式下拉框回显
                        layero.find('#getType option').each(function(index, item) {
                            if ($(item).text() == a[0].stGainType) {
                                $(item).attr('selected', true);
                            }
                        });

                        // 价值类型下拉框回显
                        layero.find('#valType option').each(function(index, item) {
                            if ($(item).text() == a[0].stValueType) {
                                $(item).attr('selected', true);
                            }
                        });

                        // 折旧状态下拉框回显
                        layero.find('#zjstated option').each(function(index, item) {
                            if ($(item).text() == a[0].stDepreciationState) {
                                $(item).attr('selected', true);
                            }
                        });

                        // 折旧方法下拉框回显
                        layero.find('#zjff option').each(function(index, item) {
                            if ($(item).text() == a[0].stDepreciationMethod) {
                                $(item).attr('selected', true);
                            }
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

                        // 编号重复查询
                        layero.find('#number').blur(function(event) {
                            $.ajax({
                                url: port + '/v1/organize/validationAddOrganization',
                                type: 'post',
                                data: {
                                    orgIdNum: layero.find('#number').val()
                                },
                                success: function(res) {
                                    if (res == 0) {
                                        layer.msg('编号已存在');
                                        layero.find('#number').val('');
                                    }
                                }
                            });
                        });

                        // 上级部门
                        layero.find('#up_department').on('click', function() {
                            var options = {
                                bootstrap2: false,
                                showTags: true,
                                levels: 5,
                                checkedIcon: "glyphicon glyphicon-check",
                                data: getTree(),
                                onNodeSelected: function(event, data) {
                                    console.log(data);
                                    layero.find('#up_department').attr('value', data.text);
                                    layero.find("#treeviews").hide();
                                }
                            };
                            layero.find('#treeviews').treeview(options);
                            layero.find('#treeviews').show();
                        });

                        // 取得日期
                        parent.parent.laydate.render({
                            elem: '#quDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#quDate').attr('value', value);
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

                        // 竣工日期
                        parent.parent.laydate.render({
                            elem: '#doneDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#doneDate').attr('value', value);
                            }
                        });

                    },
                    btnAlign: 'c',
                    content: '<div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>资产名称：</label></div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0" style="position: relative;">' +
                        '<input autocomplete="off" value="' + a[0].stName + '" style="background-color: #fff;" id="zcName" type="text" class="form-control" value="">' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>资产分类名称：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" value="构筑物" id="number" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>坐落位置：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stPlace + '" id="xmysNum" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>构筑物计量：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stStructuresUnit + '" id="gzwMeasure" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>预算项目编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stBudgetnum + '" id="ysProjectN" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" value="' + a[0].stPropertynum + '" id="oldZcN" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>取得方式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" value="新购" id="getType" name="getType" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>预计使用年限：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stEstimateUseYears + '" id="needUseYear" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>取得日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stGainDate + '" readonly id="quDate" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>数量：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stNumbers + '" id="totalNum" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>权属性质：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stPropertyRightNature + '" id="qsxz" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>建筑结构：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stBuildingStructure + '" id="buildJg" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>竣工日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stCompletedDate + '" readonly id="doneDate" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>入账形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stEnterAccountType + '" id="srType" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>价值类型：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<select class="form-control" id="valType">' +
                        '<option></option>' +
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
                        '<label><i class="must-star">*</i>价值（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stValue + '" id="totalPrc" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财政拨款（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stPublicEconomy + '" id="czPay" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>非财政拨款（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stNotPublicEconomy + '" id="nczPay" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>会计凭证号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stAccountingDocumentNum + '" id="kjpzh" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财务入账日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stEnterAccountDate + '" readonly id="caiWuDate" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>管理部门：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stChargeDepart + '" style="background-color: #fff;" readonly type="text" id="manageDepart" class="form-control" value="">' +
                        '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用状况：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stUseState + '" id="useState" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>折旧状态：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<select class="form-control" id="zjstated">' +
                        '<option></option>' +
                        '<option value="提折旧">提折旧</option>' +
                        '<option value="不提折旧">不提折旧</option>' +
                        '<option value="已完成折旧">已完成折旧</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>折旧方法：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<select class="form-control" id="zjff">' +
                        '<option></option>' +
                        '<option value="固定金额法">固定金额法</option>' +
                        '<option value="评价年限法">评价年限法</option>' +
                        '<option value="评价年限法一">评价年限法一</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>月折旧额：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stDepreciatedOneMonthMoney + '" id="mzje" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>折旧年限（月）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stDepreciatedYears + '" id="zjnx" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>已提折旧月数：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stDepreciatedMonthNumbers + '" id="yzjM" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +

                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>累计折旧：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].stAddupDepreciated + '" id="totalZj" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +

                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备用字段：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input autocomplete="off" value="' + a[0].stReserveField + '" type="text" id="spare" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备注：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input autocomplete="off" value="' + a[0].stRemarks + '" type="text" id="remarks" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>照片附件：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +

                        '<form enctype="multipart/form-data" id="Form">' +
                        '<input accept="image/*" multiple type="file" name="file">' +
                        '<a href="javascript:;" class="btn misBtn" style="display:none">提交</a>' +
                        '</form>' +
                        '</div>' +
                        '</div>' +
                        '</div>'
                });


            } else {
                layer.msg('请选择单行数据');
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
                            url: port + '/v1/structures/deleteStructures',
                            type: 'post',
                            data: {
                                ids: delData.toString()
                            },
                            success: function(data) {
                                console.log(data)
                                $("#tb_departments").bootstrapTable('refresh'); //刷新表格数据
                                parent.parent.layer.msg('删除成功');
                            }
                        });
                        console.log('确定');
                        parent.parent.layer.close(index);
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

                layer.msg("请选择要导出的信息")
                return;
            } else {
                //获取选中的选项
                for (var i = 0; i < a.length; i++) {
                    exportData[i] = a[i].id;
                }
                location.href = port + '/v1/structures/exportStructures?ids=' + exportData.toString();
            }
        });


    };
    return oInit;
};