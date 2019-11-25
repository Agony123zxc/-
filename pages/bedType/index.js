var phongReg = /^[1][3,4,5,7,8][0-9]{9}$/; //手机号格式验证
var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证正则验证
var currentTreeId = ''; //当前点击树状id
var currentTreeText = ''; //当前点击树状text
var uploadFile;

// 获取选中的行数据
function getSelectData() {
    var data = $("#tb_departments").bootstrapTable('getSelections');
    return {
        type: '家具',
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
    console.log('查询');
    if ($('#org_name').val() == '') {
        layer.msg('请输资产名称');
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
            url: port + '/v1/toolFurniture/selectToolFurniturePage',
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
                field: 'toName',
                align: 'center',
                title: '资产名称'
            }, {
                field: 'toType',
                align: 'center',
                title: '资产分类名称'
            }, {
                field: 'toCode',
                align: 'center',
                title: '资产编号'
            }, {
                field: 'toChargeDepart',
                align: 'center',
                title: '管理部门'
            }, {
                field: 'toGainType',
                align: 'center',
                title: '取得方式'
            }, {
                field: 'toGainDate',
                align: 'center',
                title: '取得日期'
            }, {
                field: 'toRemarks',
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
            toName: $('#org_name').val(), //姓名
            yuliu1: "床类",
            orgName: currentTreeText,
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
    parent.parent.layer.open({
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
                ' <tr>' +
                ' <td>资产名称</td>' +
                ' <td>' + row.toName + '</td>' +
                ' <td>资产分类名称</td>' +
                ' <td>' + row.toType + '</td>' +
                '</tr>' +
                '<tr>' +
                ' <td>存放地点</td>' +
                ' <td>' + row.toDepo + '</td>' +
                ' <td>采购组织形式</td>' +
                '<td>' + row.toBuyType + '</td>' +
                ' </tr>' +
                '<tr>' +
                '  <td>预算项目编号</td>' +
                ' <td>' + row.toBudgetnum + '</td>' +
                ' <td>原资产编号</td>' +
                ' <td>' + row.toCode + '</td>' +
                ' </tr>' +
                '<tr>' +
                '  <td>取得方式</td>' +
                '  <td>' + row.toGainType + '</td>' +
                '  <td>品牌</td>' +
                '<td>' + row.toBrand + '</td>' +
                ' </tr>' +
                '<tr>' +
                ' <td>取得日期</td>' +
                '<td>' + row.toGainDate + '</td>' +
                '<td>数量</td>' +
                '<td>' + row.toNumbers + '</td>' +
                ' </tr>' +
                ' <tr>' +
                ' <td>入账形式</td>' +
                ' <td>' + row.toEnterAccountType + '</td>' +
                '<td>规格型号</td>' +
                '<td>' + row.toSpecs + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>价值（元）</td>' +
                ' <td>' + row.toValue + '</td>' +
                ' <td>销售商</td>' +
                ' <td>' + row.toDealer + '</td>' +
                '   </tr>' +
                '<tr>' +
                '  <td>财政拨款（元）</td>' +
                ' <td>' + row.toPublicEconomy + '</td>' +
                ' <td>保修截止日期</td>' +
                ' <td>' + row.toGuaranteedEndDate + '</td>' +
                ' </tr>' +
                ' <tr>' +
                ' <td>财务入账日期</td>' +
                ' <td>' + row.toEnterAccountDate + '</td>' +
                ' <td>价值类型</td>' +
                ' <td>' + row.toValueType + '</td>' +
                ' </tr>' +
                ' <tr>' +
                ' <td>使用部门</td>' +
                ' <td>' + row.toUseDepart + '</td>' +
                ' <td>非财政拨款（元）</td>' +
                ' <td>' + row.toNotPublicEconomy + '</td>' +
                '</tr>' +
                '<tr>' +
                ' <td>投入使用日期</td>' +
                '  <td>' + row.toStartUseDate + '</td>' +
                ' <td>会计凭证号</td>' +
                '<td>' + row.toAccountingDocumentNum + '</td>' +
                ' </tr>' +
                '<tr>' +
                ' <td>使用状况</td>' +
                ' <td>' + row.toUseState + '</td>' +
                ' <td>管理部门</td>' +
                ' <td>' + row.toChargeDepart + '</td>' +
                ' </tr>' +
                '<tr>' +
                ' <td>使用人</td>' +
                '  <td>' + row.toUsePerson + '</td>' +
                ' <td>折旧方法</td>' +
                '  <td>' + row.toDepreciatedMethod + '</td>' +
                '</tr>' +
                '<tr>' +
                ' <td>折旧状态</td>' +
                ' <td>' + row.toDepreciatedState + '</td>' +
                ' <td>折旧年限（月）</td>' +
                ' <td>' + row.toDepreciatedYears + '</td>' +
                ' </tr>' +
                '  <tr>' +
                '  <td>月折旧额</td>' +
                ' <td>' + row.toDepreciatedOneMonthMoney + '</td>' +
                ' <td>累计折旧</td>' +
                ' <td>' + row.toAddupDepreciated + '</td>' +
                ' </tr>' +
                '<tr>' +
                '<td>已提折旧月数</td>' +
                '<td>' + row.toDepreciatedMonthNumbers + '</td>' +
                ' <td>备用字段</td>' +
                ' <td>' + row.toReserveField + '</td>' +
                '</tr>' +
                ' <tr>' +
                '<td>备注</td>' +
                ' <td colspan="3">' + row.toRemarks + '</td>' +
                '</tr>' +
                '<tr>' +
                '  <td>照片附件</td>' +
                ' <td colspan="3"><img class="annex-img" src="' + port + "/" + row.toImgpath + '"></td>' +
                ' </tr>' +
                ' </table>' +
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

                    var toName = layero.find('#toName').val();
                    var toType = layero.find('#toType').val();
                    var toDepo = layero.find('#toDepo').val();
                    var toBuyType = layero.find('#toBuyType').val();

                    var toBudgetnum = layero.find('#toBudgetnum').val();
                    var toCode = layero.find('#toCode').val(); //下拉
                    var toBrand = layero.find('#toBrand').val();
                    var toGainDate = layero.find('#toGainDate').val(); //取得日期
                    var toNumbers = layero.find('#toNumbers').val();
                    var toEnterAccountType = layero.find('#toEnterAccountType').val();
                    var toSpecs = layero.find('#toSpecs').val();
                    var toValue = layero.find('#toValue').val();
                    var toDealer = layero.find('#toDealer').val();
                    var toPublicEconomy = layero.find('#toPublicEconomy').val();
                    var toGuaranteedEndDate = layero.find('#toGuaranteedEndDate').val();
                    var toEnterAccountDate = layero.find('#toEnterAccountDate').val();
                    var toValueType = layero.find('#toValueType').val();
                    var toUseDepart = layero.find('#toUseDepart').val();
                    var toNotPublicEconomy = layero.find('#toNotPublicEconomy').val();
                    var toStartUseDate = layero.find('#toStartUseDate').val();
                    var toAccountingDocumentNum = layero.find('#toAccountingDocumentNum').val();
                    var toUseState = layero.find('#toUseState').val();
                    var toChargeDepart = layero.find('#toChargeDepart').val();
                    var toUsePerson = layero.find('#toUsePerson').val();
                    var toDepreciatedMethod = layero.find('#toDepreciatedMethod').val();
                    var toDepreciatedState = layero.find('#toDepreciatedState').val();
                    var toDepreciatedYears = layero.find('#toDepreciatedYears').val();
                    var toDepreciatedOneMonthMoney = layero.find('#toDepreciatedOneMonthMoney').val();
                    var toAddupDepreciated = layero.find('#toAddupDepreciated').val();
                    var toDepreciatedMonthNumbers = layero.find('#toDepreciatedMonthNumbers').val();
                    var toReserveField = layero.find('#toReserveField').val();
                    var toRemarks = layero.find('#toRemarks').val();
                    var toGainType = layero.find('#toType').val();


                    if (toName == '') {
                        parent.parent.layer.msg('请输入资产名称');
                        return;
                    }

                    if (toGainDate == '') {
                        parent.parent.layer.msg('请选择取得日期');
                        return;
                    }
                    if (toNumbers == '') {
                        parent.parent.layer.msg('请输入数量');
                        return;
                    }

                    if (toValue == '') {
                        parent.parent.layer.msg('请输入价值');
                        return;
                    }

                    if (toChargeDepart == '') {
                        parent.parent.layer.msg('请选择管理部门');
                        return;
                    }


                    $.ajax({
                        url: port + '/v1/toolFurniture/insertToolFurniture',
                        type: 'post',
                        data: {
                            toBrand: toBrand,
                            toCode: toCode,
                            toName: toName, //资产名称
                            toType: toType, //资产分类名称
                            toDepo: toDepo, //存放地点
                            toBuyType: toBuyType, //采购组织形式
                            toBudgetnum: toBudgetnum, //预算项目编号
                            toGainDate: toGainDate, //资产编号
                            toNumbers: toNumbers, //取得方式
                            toEnterAccountType: toEnterAccountType, //数量
                            toSpecs: toSpecs, //取得日期
                            toValue: toValue, //价值类型
                            toDealer: toDealer, //入账形式
                            toPublicEconomy: toPublicEconomy, //财政拨款
                            toGuaranteedEndDate: toGuaranteedEndDate, //非财政拨款
                            toEnterAccountDate: toEnterAccountDate, //价值
                            toValueType: toValueType, //均价
                            toUseDepart: toUseDepart,
                            toNotPublicEconomy: toNotPublicEconomy,
                            /**/
                            toStartUseDate: toStartUseDate,
                            toAccountingDocumentNum: toAccountingDocumentNum,
                            toUseState: toUseState, //保存年限
                            toChargeDepart: toChargeDepart, //管理部门
                            toUsePerson: toUsePerson, //使用部门
                            toDepreciatedMethod: toDepreciatedMethod, //使用人*/
                            toDepreciatedState: toDepreciatedState, //档案号
                            toDepreciatedYears: toDepreciatedYears, //出版社
                            toDepreciatedOneMonthMoney: toDepreciatedOneMonthMoney, //出版日期
                            toAddupDepreciated: toAddupDepreciated, //备用字段
                            toDepreciatedMonthNumbers: toDepreciatedMonthNumbers, //备注
                            toReserveField: toReserveField, //备注
                            toRemarks: toRemarks, //备注
                            toGainType: toGainType,
                            mark: "床类",
                            onImgpath: uploadFile, //照片附件 
                            pJobNum: localStorage.getItem('pJobnum')

                        },
                        success: function(res) {
                            if (res > 0) {
                                $("#tb_departments").bootstrapTable('refresh');
                                parent.parent.layer.msg('添加成功');
                                parent.parent.layer.close(index);
                            }
                        }
                    })



                },
                success: function(layero, index) {
                    layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                    layero.find('input[readonly]').css('background', '#fff');
                    // 上传照片
                    layero.find('#uploadFile').change(function(event) {
                        $.ajax({
                            url: port + "/v1/toolFurniture/importToolFurnitureImg",
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
                    layero.find('#toChargeDepart').on('click', function() {
                        var options = {
                            bootstrap2: false,
                            showTags: true,
                            levels: 5,
                            checkedIcon: "glyphicon glyphicon-check",
                            data: getTree(),
                            onNodeSelected: function(event, data) {
                                console.log(data);
                                layero.find('#toChargeDepart').attr('value', data.text);
                                layero.find("#treeviews").hide();
                            }
                        };
                        layero.find('#treeviews').treeview(options);
                        layero.find('#treeviews').show();

                    });


                    // 使用部门
                    layero.find('#toUseDepart').on('click', function() {
                        var options = {
                            bootstrap2: false,
                            showTags: true,
                            levels: 5,
                            checkedIcon: "glyphicon glyphicon-check",
                            data: getTree(),
                            onNodeSelected: function(event, data) {
                                console.log(data);
                                layero.find('#toUseDepart').attr('value', data.text);
                                layero.find("#treeviews1").hide();
                            }
                        };
                        layero.find('#treeviews1').treeview(options);
                        layero.find('#treeviews1').show();

                    });



                    // 取得日期
                    parent.parent.laydate.render({
                        elem: '#toGainDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#toGainDate').attr('value', value);
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
                        elem: '#toEnterAccountDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#toEnterAccountDate').attr('value', value);
                        }
                    });

                    // 投入使用日期
                    parent.parent.laydate.render({
                        elem: '#toStartUseDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#toStartUseDate').attr('value', value);
                        }
                    });

                    // 保修截止日期
                    parent.parent.laydate.render({
                        elem: '#toGuaranteedEndDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#toGuaranteedEndDate').attr('value', value);
                        }
                    });

                    // 生成资产编号
                    $.ajax({
                        url: port + '/v1/toolFurniture/createCode',
                        type: 'post',
                        success: function(res) {
                            console.log('资产编号：', res);
                            layero.find('#toCode').attr('value', res.msg);
                        }
                    });


                },
                btnAlign: 'c',
                content: '<div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>资产名称：</label></div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0" style="position: relative;">' +
                    '<input autocomplete="off" id="toName" style="background-color: #fff;" type="text" class="form-control" value="">' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>资产分类名称：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly value="家具" autocomplete="off" id="toType" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5"  style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>存放地点：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toDepo" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>采购组织形式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toBuyType" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>预算项目编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toBudgetnum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>资产编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" id="toCode" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>取得方式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" id="toGainType" type="text" class="form-control"  value="新购"/>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>品牌：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toBrand" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>取得日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="toGainDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>数量：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toNumbers" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>入账形式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toEnterAccountType" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>规格型号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toSpecs" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>价值（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toValue" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>销售商：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toDealer" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>财政拨款（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toPublicEconomy" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>保修截止日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="toGuaranteedEndDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>财务入账日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="toEnterAccountDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>价值类型：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<select class="form-control" id="toValueType">' +
                    '<option>原价</option>' +
                    '<option>暂估价</option>' +
                    '<option>重置价</option>' +
                    '<option>无价值</option>' +
                    '<option>评估值</option>' +
                    '<option>名义金额</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用部门：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" style="background-color: #fff;" readonly type="text" id="toUseDepart" class="form-control" value="">' +
                    '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews1">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>非财政拨款（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toNotPublicEconomy" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>投入使用日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="toStartUseDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>会计凭证号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toAccountingDocumentNum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用状况：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toUseState" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>管理部门：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" style="background-color: #fff;" readonly type="text" id="toChargeDepart" class="form-control" value="">' +
                    '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用人：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toUsePerson" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>折旧方法：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<select class="form-control" id="toDepreciatedMethod">' +
                    '<option>固定金额法</option>' +
                    '<option>平均年限法</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>折旧状态：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<select class="form-control" id="toDepreciatedState">' +
                    '<option>提折旧</option>' +
                    '<option>不提折旧</option>' +
                    '<option>已完成折旧</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>折旧年限（月）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toDepreciatedYears" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>月折旧额：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toDepreciatedOneMonthMoney" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>累计折旧：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toAddupDepreciated" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>已提折旧月数：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="toDepreciatedMonthNumbers" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>备用字段：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<input autocomplete="off" type="text" id="toReserveField" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>备注：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<input autocomplete="off" type="text" id="toRemarks" class="form-control" />' +
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
            console.log(a[0].toBrand)
            if (a.length == 1) {

                parent.parent.layer.open({
                    type: 1,
                    title: '修改',
                    area: ['760px', '500px'],
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {
                        var toName = layero.find('#toName').val();
                        var toType = layero.find('#toType').val();
                        var toDepo = layero.find('#toDepo').val();
                        var toBuyType = layero.find('#toBuyType').val();
                        var toGainType = layero.find('#toGainType').val()
                        var toBudgetnum = layero.find('#toBudgetnum').val();
                        var toCode = layero.find('#toCode').val(); //下拉
                        var toBrand = layero.find('#toBrand').val();
                        var toGainDate = layero.find('#toGainDate').val(); //取得日期
                        var toNumbers = layero.find('#toNumbers').val();
                        var toEnterAccountType = layero.find('#toEnterAccountType').val();
                        var toSpecs = layero.find('#toSpecs').val();
                        var toValue = layero.find('#toValue').val();
                        var toDealer = layero.find('#toDealer').val();
                        var toPublicEconomy = layero.find('#toPublicEconomy').val();
                        var toGuaranteedEndDate = layero.find('#toGuaranteedEndDate').val();
                        var toEnterAccountDate = layero.find('#toEnterAccountDate').val();
                        var toValueType = layero.find('#toValueType').val();
                        var toUseDepart = layero.find('#toUseDepart').val();
                        var toNotPublicEconomy = layero.find('#toNotPublicEconomy').val();
                        var toStartUseDate = layero.find('#toStartUseDate').val();
                        var toAccountingDocumentNum = layero.find('#toAccountingDocumentNum').val();
                        var toUseState = layero.find('#toUseState').val();
                        var toChargeDepart = layero.find('#toChargeDepart').val();
                        var toUsePerson = layero.find('#toUsePerson').val();
                        var toDepreciatedMethod = layero.find('#toDepreciatedMethod').val();
                        var toDepreciatedState = layero.find('#toDepreciatedState').val();
                        var toDepreciatedYears = layero.find('#toDepreciatedYears').val();
                        var toDepreciatedOneMonthMoney = layero.find('#toDepreciatedOneMonthMoney').val();
                        var toAddupDepreciated = layero.find('#toAddupDepreciated').val();
                        var toDepreciatedMonthNumbers = layero.find('#toDepreciatedMonthNumbers').val();
                        var toReserveField = layero.find('#toReserveField').val();
                        var toRemarks = layero.find('#toRemarks').val();

                        if (toName == '') {
                            parent.parent.layer.msg('请输入资产名称');
                            return;
                        }

                        if (toGainDate == '') {
                            parent.parent.layer.msg('请输入取得日期');
                            return;
                        }
                        if (toNumbers == '') {
                            parent.parent.layer.msg('请输入数量');
                            return;
                        }

                        if (toValue == '') {
                            parent.parent.layer.msg('请输入价值');
                            return;
                        }

                        if (toChargeDepart == '') {
                            parent.parent.layer.msg('请选择管理部门');
                            return;
                        }

                        $.ajax({
                            url: port + '/v1/toolFurniture/updateToolFurniture',
                            type: 'post',
                            data: {
                                id: a[0].id,
                                toCode: toCode,
                                toBrand: toBrand,
                                toName: toName, //资产名称
                                toType: toType, //资产分类名称
                                toDepo: toDepo, //存放地点
                                toBuyType: toBuyType, //采购组织形式
                                toBudgetnum: toBudgetnum, //预算项目编号
                                toGainDate: toGainDate, //资产编号
                                toNumbers: toNumbers, //取得方式
                                toEnterAccountType: toEnterAccountType, //数量
                                toSpecs: toSpecs, //取得日期
                                toValue: toValue, //价值类型
                                toDealer: toDealer, //入账形式
                                toPublicEconomy: toPublicEconomy, //财政拨款
                                toGuaranteedEndDate: toGuaranteedEndDate, //非财政拨款
                                toEnterAccountDate: toEnterAccountDate, //价值
                                toValueType: toValueType, //均价
                                toUseDepart: toUseDepart,
                                toNotPublicEconomy: toNotPublicEconomy,
                                /**/
                                toStartUseDate: toStartUseDate,
                                toAccountingDocumentNum: toAccountingDocumentNum,
                                toUseState: toUseState, //保存年限
                                toChargeDepart: toChargeDepart, //管理部门
                                toUsePerson: toUsePerson, //使用部门
                                toDepreciatedMethod: toDepreciatedMethod, //使用人*/
                                toDepreciatedState: toDepreciatedState, //档案号
                                toDepreciatedYears: toDepreciatedYears, //出版社
                                toDepreciatedOneMonthMoney: toDepreciatedOneMonthMoney, //出版日期
                                toAddupDepreciated: toAddupDepreciated, //备用字段
                                toDepreciatedMonthNumbers: toDepreciatedMonthNumbers, //备注
                                toReserveField: toReserveField, //备注
                                toRemarks: toRemarks, //备注
                                mark: "床类",
                                onImgpath: uploadFile, //照片附件 
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
                        layero.find('input[readonly]').css('background', '#fff');
                        // 上传照片
                        layero.find('#uploadFile').change(function(event) {
                            $.ajax({
                                url: port + "/v1/toolFurniture/importToolFurnitureImg",
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
                        layero.find('#toChargeDepart').on('click', function() {
                            var options = {
                                bootstrap2: false,
                                showTags: true,
                                levels: 5,
                                checkedIcon: "glyphicon glyphicon-check",
                                data: getTree(),
                                onNodeSelected: function(event, data) {
                                    console.log(data);
                                    layero.find('#toChargeDepart').attr('value', data.text);
                                    layero.find("#treeviews").hide();
                                }
                            };
                            layero.find('#treeviews').treeview(options);
                            layero.find('#treeviews').show();

                        });


                        // 使用部门
                        layero.find('#toUseDepart').on('click', function() {
                            var options = {
                                bootstrap2: false,
                                showTags: true,
                                levels: 5,
                                checkedIcon: "glyphicon glyphicon-check",
                                data: getTree(),
                                onNodeSelected: function(event, data) {
                                    console.log(data);
                                    layero.find('#toUseDepart').attr('value', data.text);
                                    layero.find("#treeviews1").hide();
                                }
                            };
                            layero.find('#treeviews1').treeview(options);
                            layero.find('#treeviews1').show();

                        });



                        // 取得日期
                        parent.parent.laydate.render({
                            elem: '#toGainDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#toGainDate').attr('value', value);
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
                            elem: '#toEnterAccountDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#toEnterAccountDate').attr('value', value);
                            }
                        });

                        // 投入使用日期
                        parent.parent.laydate.render({
                            elem: '#toStartUseDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#toStartUseDate').attr('value', value);
                            }
                        });

                        // 保修截止日期
                        parent.parent.laydate.render({
                            elem: '#toGuaranteedEndDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#toGuaranteedEndDate').attr('value', value);
                            }
                        });


                        // 价值类型下拉框回显
                        layero.find('#toValueType option').each(function(index, item) {
                            if (a[0].toValueType == $(item).text()) {
                                $(item).attr('selected', true);
                            }
                        });
                        // 折旧状态下拉框回显
                        layero.find('#toDepreciatedState option').each(function(index, item) {
                            if (a[0].toDepreciatedState == $(item).text()) {
                                $(item).attr('selected', true);
                            }
                        });
                        // 折旧方法下拉框回显
                        layero.find('#toDepreciatedMethod option').each(function(index, item) {
                            if (a[0].toDepreciatedMethod == $(item).text()) {
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
                        '<input autocomplete="off" id="toName" style="background-color: #fff;" type="text" class="form-control" value="' + a[0].toName + '">' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产分类名称：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" id="toType" type="text" class="form-control" value="家具" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5"  style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>存放地点：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toDepo" type="text" class="form-control" value="' + a[0].toDepo + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>采购组织形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toBuyType" type="text" class="form-control" value="' + a[0].toBuyType + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>预算项目编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toBudgetnum" type="text" class="form-control" value="' + a[0].toBudgetnum + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" id="toCode" type="text" class="form-control"  value="' + a[0].toCode + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>取得方式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" id="toGainType" type="text" class="form-control"  value="新购"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>品牌：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toBrand" type="text" class="form-control" value="' + a[0].toBrand + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>取得日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="toGainDate" type="text" class="form-control" value="' + a[0].toGainDate + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>数量：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toNumbers" type="text" class="form-control" value="' + a[0].toNumbers + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>入账形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toEnterAccountType" type="text" class="form-control" value="' + a[0].toEnterAccountType + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>规格型号：：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toSpecs" type="text" class="form-control" value="' + a[0].toSpecs + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>价值（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toValue" type="text" class="form-control" value="' + a[0].toValue + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>销售商：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toDealer" type="text" class="form-control" value="' + a[0].toDealer + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财政拨款（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toPublicEconomy" type="text" class="form-control" value="' + a[0].toPublicEconomy + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>保修截止日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="toGuaranteedEndDate" type="text" class="form-control" value="' + a[0].toGuaranteedEndDate + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财务入账日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="toEnterAccountDate" type="text" class="form-control" value="' + a[0].toEnterAccountDate + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>价值类型：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<select class="form-control" id="toValueType">' +
                        '<option>原价</option>' +
                        '<option>暂估价</option>' +
                        '<option>重置价</option>' +
                        '<option>无价值</option>' +
                        '<option>评估值</option>' +
                        '<option>名义金额</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用部门：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" style="background-color: #fff;" readonly type="text" id="toUseDepart" class="form-control" value="' + a[0].toUseDepart + '">' +
                        '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews1">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>非财政拨款（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toNotPublicEconomy" type="text" class="form-control"  value="' + a[0].toNotPublicEconomy + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>投入使用日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="toStartUseDate" type="text"  value="' + a[0].toStartUseDate + '" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>会计凭证号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toAccountingDocumentNum" type="text" class="form-control"  value="' + a[0].toAccountingDocumentNum + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用状况：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toUseState" type="text" class="form-control"  value="' + a[0].toUseState + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>管理部门：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" style="background-color: #fff;" readonly type="text" id="toChargeDepart" class="form-control" value="' + a[0].toChargeDepart + '">' +
                        '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用人：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toUsePerson" type="text" class="form-control" value="' + a[0].toUsePerson + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>折旧方法：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<select class="form-control" id="toDepreciatedMethod" >' +
                        '<option>固定金额法</option>' +
                        '<option>平均年限法</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>折旧状态：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<select class="form-control" id="toDepreciatedState" >' +
                        '<option>提折旧</option>' +
                        '<option>不提折旧</option>' +
                        '<option>已完成折旧</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>折旧年限（月）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toDepreciatedYears" type="text" class="form-control" value="' + a[0].toDepreciatedYears + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>月折旧额：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toDepreciatedOneMonthMoney" type="text" class="form-control"  value="' + a[0].toDepreciatedOneMonthMoney + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>累计折旧：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toAddupDepreciated" type="text" class="form-control" value="' + a[0].toAddupDepreciated + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>已提折旧月数：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="toDepreciatedMonthNumbers" type="text" class="form-control" value="' + a[0].toDepreciatedMonthNumbers + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备用字段：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input autocomplete="off" type="text" id="toReserveField" class="form-control" value="' + a[0].toReserveField + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备注：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input autocomplete="off" type="text" id="toRemarks" class="form-control"  value="' + a[0].toRemarks + '"/>' +
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
                            url: port + '/v1/toolFurniture/deleteToolFurniture',
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


        // 导出（导出所有、选择导出）
        $("#btn_export").on('click', function() {


            var a = $("#tb_departments").bootstrapTable('getSelections');
            var exportData = []; //要导出的数据

            if (a.length == 0) {
                console.log('导出所有')
                layer.msg("请选择要导出的数据");
                return;
            } else {
                //获取选中的选项
                for (var i = 0; i < a.length; i++) {
                    exportData[i] = a[i].id;
                }
                location.href = port + '/v1/toolFurniture/exportToolFurniture?ids=' + exportData.toString() + "&mark=" + "床类";
            }
        });


    };
    return oInit;
};