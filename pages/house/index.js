var phongReg = /^[1][3,4,5,7,8][0-9]{9}$/; //手机号格式验证
var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证正则验证
var currentTreeId = ''; //当前点击树状id
var currentTreeText = ''; //当前点击树状text

// 获取选中的行数据
function getSelectData() {
    var data = $("#tb_departments").bootstrapTable('getSelections');
    return {
        type:'房屋',
        data:data
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
            url: port + '/v1/building/selectBuildingPage',
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
                field: 'bName',
                align: 'center',
                title: '资产名称'
            }, {
                field: 'bType',
                align: 'center',
                title: '资产分类名称'
            }, {
                field: 'bCode',
                align: 'center',
                title: '资产编号'
            }, {
                field: 'bChargeDepart',
                align: 'center',
                title: '管理部门'
            }, {
                field: 'bGainMethod',
                align: 'center',
                title: '取得方式'
            }, {
                field: 'bGainDate',
                align: 'center',
                title: '取得日期'
            }, {
                field: 'bRemarks',
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
           pJobNum:localStorage.getItem('pJobnum'),
            bName: $("#org_name").val()
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
                '<td>' + row.bName + '</td>' +
                '<td>资产分类名称</td>' +
                '<td>' + row.bType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>坐落位置</td>' +
                '<td>' + row.bPlace + '</td>' +
                '<td>资产编号</td>' +
                '<td>' + row.bCode + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>预算项目编号</td>' +
                '<td>' + row.bBudgetnum + '</td>' +
                '<td>产权形式</td>' +
                '<td>' + row.bPropertyRightType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>权属性质</td>' +
                '<td>' + row.bPropertyRightNature + '</td>' +
                '<td>权属证明</td>' +
                '<td>' + row.bPropertyRightProve + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>权属年限</td>' +
                '<td>' + row.bPropertyRightAgeLimit + '</td>' +
                '<td>权属证号</td>' +
                '<td>' + row.bPropertyRightPapersnum + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>持证人</td>' +
                '<td>' + row.bPapersPerson + '</td>' +
                '<td>房屋所有权人</td>' +
                '<td>' + row.bOwnershipPerson + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>设计用途</td>' +
                '<td>' + row.bDeviseUse + '</td>' +
                '<td>建筑结构</td>' +
                '<td>' + row.bBuildingStructure + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>取得方式</td>' +
                '<td>' + row.bGainMethod + '</td>' +
                '<td>竣工日期</td>' +
                '<td>' + row.bCompletedDate + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>取得日期</td>' +
                '<td>' + row.bGainDate + '</td>' +
                '<td>发证日期</td>' +
                '<td>' + row.bCertificateDate + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>入账形式</td>' +
                '<td>' + row.bEnterAccountType + '</td>' +
                '<td>会计凭证号</td>' +
                '<td>' + row.bAccountingDocumentNum + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>账务入账日期</td>' +
                '<td>' + row.bEnterAccountDate + '</td>' +
                '<td>投入使用日期</td>' +
                '<td>' + row.bUseingDate + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>管理部门</td>' +
                '<td>' + row.bChargeDepart + '</td>' +
                '<td>上次批复投入使用时间</td>' +
                '<td>' + row.bLastTimeRespondedDate + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>价值类型</td>' +
                '<td>' + row.bValueType + '</td>' +
                '<td>数量</td>' +
                '<td>' + row.bNumbers + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>价值（元）</td>' +
                '<td>' + row.bValue + '</td>' +
                '<td>财政拨款（元）</td>' +
                '<td>' + row.bPublicEconomy + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>非财政拨款（元）</td>' +
                '<td>' + row.bNotPublicEconomy + '</td>' +
                '<td>均价</td>' +
                '<td>' + row.bAveragePrice + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="4" style="background:#fff;">建筑面积</td>' +
                '</tr>' +
                '<tr>' +
                '<td>取暖面积</td>' +
                '<td>' + row.bWarmArea + '</td>' +
                '<td>危房面积</td>' +
                '<td>' + row.bDangerousBuildingArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>自用面积</td>' +
                '<td>' + row.bOwnUseArea + '</td>' +
                '<td>本单位实际使用面积</td>' +
                '<td>' + row.bOwnDepartRealityArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>出租面积</td>' +
                '<td>' + row.bHireArea + '</td>' +
                '<td>出借面积</td>' +
                '<td>' + row.bLendArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>闲置面积</td>' +
                '<td>' + row.bSetAsideArea + '</td>' +
                '<td>其他面积</td>' +
                '<td>' + row.bOtherArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="4" style="background:#fff;">小计办公室用房</td>' +
                '</tr>' +
                '<tr>' +
                '<td>办公室用房自用面积</td>' +
                '<td>' + row.bOfficeOwnArea + '</td>' +
                '<td>办公室用房单位实际使用面积</td>' +
                '<td>' + row.bOfficeOwnRealityArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>办公室用房出租面积</td>' +
                '<td>' + row.bOfficeHireArea + '</td>' +
                '<td>办公室用房出借面积</td>' +
                '<td>' + row.bOfficeLendArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>办公室用房闲置面积</td>' +
                '<td>' + row.bOfficeSetAsideArea + '</td>' +
                '<td>办公室用房其他面积</td>' +
                '<td>' + row.bOfficeOtherArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="4" style="background:#fff;">小计业务用房</td>' +
                '</tr>' +
                '<tr>' +
                '<td>业务用房自用面积</td>' +
                '<td>' + row.bWorkOwnArea + '</td>' +
                '<td>业务用房单位实际使用面积</td>' +
                '<td>' + row.bWorkOwnRealityArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>业务用房出租面积</td>' +
                '<td>' + row.bWorkHireArea + '</td>' +
                '<td>业务用房出借面积</td>' +
                '<td>' + row.bWorkLendArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>业务用房闲置面积</td>' +
                '<td>' + row.bWorkSetAsideArea + '</td>' +
                '<td>业务用房其他面积</td>' +
                '<td>' + row.bWorkOtherArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td colspan="4" style="background:#fff;">小计其他用房</td>' +
                '</tr>' +
                '<tr>' +
                '<td>其他用房自用面积</td>' +
                '<td>' + row.bOtherOwnArea + '</td>' +
                '<td>其他用房单位实际使用面积</td>' +
                '<td>' + row.bOtherOwnRealityArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>其他用房出租面积</td>' +
                '<td>' + row.bOtherHireArea + '</td>' +
                '<td>其他用房出借面积</td>' +
                '<td>' + row.bOtherLendArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>其他用房闲置面积</td>' +
                '<td>' + row.bOtherSetAsideArea + '</td>' +
                '<td>其他用房其他面积</td>' +
                '<td>' + row.bOtherOtherArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>自用价值</td>' +
                '<td>' + row.bOwnValue + '</td>' +
                '<td>出借价值</td>' +
                '<td>' + row.bLendValue + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>出租价值</td>' +
                '<td>' + row.bHireValue + '</td>' +
                '<td>闲置价值</td>' +
                '<td>' + row.bSetAsideValue + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>其他价值</td>' +
                '<td>' + row.bOtherValue + '</td>' +
                '<td>折旧状态</td>' +
                '<td>' + row.bDepreciatedState + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>折旧年限（月）</td>' +
                '<td>' + row.bDepreciatedYears + '</td>' +
                '<td>月折旧额</td>' +
                '<td>' + row.bDepreciatedOneMonthMoney + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>已提折旧月数</td>' +
                '<td>' + row.bDepreciatedMonthNumbers + '</td>' +
                '<td>累计折旧</td>' +
                '<td>' + row.bAddupDepreciated + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>备用字段</td>' +
                '<td>' + row.bReserveField + '</td>' +
                '<td>备注</td>' +
                '<td>' + row.bRemarks + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>照片附件</td>' +
                '<td colspan="3"><img class="annex-img" src="' + row.bImgPath + '"></td>' +
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

                    if (layero.find("#b_name").val() == "") {
                        parent.parent.layer.msg("请输入资产名称")
                        return;
                    }


                    if (layero.find("#quDate").val() == "") {
                        parent.parent.layer.msg("请选择取得日期")
                        return;
                    }


                    if (layero.find("#manageDepart").val() == "") {
                        parent.parent.layer.msg("请选择管理部门")
                        return;
                    }
                    if (layero.find("#b_numbers").val() == "") {
                        parent.parent.layer.msg("请输入数量")
                        return;
                    }

                    if (layero.find("#b_value").val() == "") {
                        parent.parent.layer.msg("请输入价值")
                        return;
                    }


                    $.ajax({
                        url: port + "/v1/building/saveBuilding",
                        type: "post",
                        data: {
                            bName: layero.find("#b_name").val(), //资产名称
                            bType: layero.find("#b_type").val(), //资产分类名称
                            bPlace: layero.find("#b_place").val(), //坐落位置
                            bCode: layero.find("#b_code").val(), //资产编号
                            bBudgetnum: layero.find("#b_budgetNum").val(), //预算项目编号
                            bPropertyRightType: layero.find("#b_property_right_type").val(), //产权形式
                            bPropertyRightNature: layero.find("#b_property_right_nature").val(), //权属性质
                            bPropertyRightProve: layero.find("#b_property_right_prove").val(), //权属证明
                            bPropertyRightAgeLimit: layero.find("#b_property_right_age_limit").val(), //权属年限
                            bPropertyRightPapersnum: layero.find("#b_property_right_papersNum").val(), //权属证号
                            bPapersPerson: layero.find("#b_papers_person").val(), //持证人
                            bOwnershipPerson: layero.find("#b_ownership_person").val(), //房屋所有权人
                            bDeviseUse: layero.find("#b_devise_use").val(), //设计用途
                            bBuildingStructure: layero.find("#b_building_structure").val(), //建筑结构
                            bGainMethod: layero.find("#b_gain_method").val(), //取得方式
                            bCompletedDate: layero.find("#completionDate").val(), //竣工日期
                            bGainDate: layero.find("#quDate").val(), //取得日期
                            bCertificateDate: layero.find("#faZhengDate").val(), //发证日期
                            bEnterAccountType: layero.find("#b_enter_account_type").val(), //入账形式
                            bAccountingDocumentNum: layero.find("#b_accounting_document_num").val(), //会计凭证号
                            bEnterAccountDate: layero.find("#caiWuDate").val(), //财务入账日期
                            bChargeDepart: layero.find("#manageDepart").val(), //管理部门
                            bUseingDate: layero.find("#useDate").val(), //投入使用日期
                            bLastTimeRespondedDate: layero.find("#lastApproveTime").val(), //上次批复房屋使用时间
                            bValueType: layero.find("#b_value_type option:selected").val(), //价值类型
                            bNumbers: layero.find("#b_numbers").val(), //数量
                            bValue: layero.find("#b_value").val(), //价值
                            bPublicEconomy: layero.find("#b_public_economy").val(), //财政拨款
                            bNotPublicEconomy: layero.find("#b_not_public_economy").val(), //非财政拨款
                            bAveragePrice: layero.find("#b_average_price").val(), //均价
                            bWarmArea: layero.find("#b_warm_area").val(), //取暖面积
                            bDangerousBuildingArea: layero.find("#b_dangerous_building_area").val(), //危房面积
                            bOwnUseArea: layero.find("#b_own_use_area").val(), //自用面积
                            bOwnDepartRealityArea: layero.find("#b_own_depart_reality_area").val(), //本单位实际使用面积
                            bHireArea: layero.find("#b_hire_area").val(), //出租面积
                            bLendArea: layero.find("#b_lend_area").val(), //出借面积
                            bSetAsideArea: layero.find("#b_set_aside_area").val(), //闲置面积
                            bOtherArea: layero.find("#b_other_area").val(), //其他面积
                            bOfficeOwnArea: layero.find("#b_office_own_area").val(), //办公室用房自用面积
                            bOfficeOwnRealityArea: layero.find("#b_office_own_reality_area").val(), //办公用房本单位实际使用面积
                            bOfficeHireArea: layero.find("#b_office_hire_area").val(), //办公室用房出租面积
                            bOfficeLendArea: layero.find("#b_office_lend_area").val(), //办公室用房出借面积
                            bOfficeSetAsideArea: layero.find("#b_office_set_aside_area").val(), //办公室用房闲置面积
                            bOfficeOtherArea: layero.find("#b_office_other_area").val(), //办公室用房其他面积
                            bWorkOwnArea: layero.find("#b_work_own_area").val(), //业务用房自用面积
                            bWorkOwnRealityArea: layero.find("#b_work_own_reality_area").val(), //业务用房本单位实际使用面积
                            bWorkHireArea: layero.find("#b_work_hire_area").val(), //业务用房出租面积
                            bWorkLendArea: layero.find("#b_work_lend_area").val(), //业务用房出借面积
                            bWorkSetAsideArea: layero.find("#b_work_set_aside_area").val(), //业务用闲置面积
                            bWorkOtherArea: layero.find("#b_work_other_area").val(), //业务用房其他面积
                            bOtherOwnArea: layero.find("#b_other_own_area").val(), //其他用房自用面积
                            bOtherOwnRealityArea: layero.find("#b_other_own_reality_area").val(), //其他用房本单位实际使用面积
                            bOtherHireArea: layero.find("#b_other_hire_area").val(), //其他用房出租面积
                            bOtherLendArea: layero.find("#b_other_lend_area").val(), //其他用房出借面积
                            bOtherSetAsideArea: layero.find("#b_other_set_aside_area").val(), //其他用闲置面积
                            bOtherOtherArea: layero.find("#b_other_other_area").val(), //其他用房其他面积
                            bOwnValue: layero.find("#b_own_value").val(), //自用价值
                            bLendValue: layero.find("#b_lend_value").val(), //出借价值
                            bHireValue: layero.find("#b_hire_value").val(), //出租价值
                            bSetAsideValue: layero.find("#b_set_aside_value").val(), //闲置价值
                            bOtherValue: layero.find("#b_other_value").val(), //其他价值
                            bDepreciatedState: layero.find("#b_depreciated_state option:selected").val(), //折旧状态
                            bDepreciatedYears: layero.find("#b_depreciated_years").val(), //折旧年限
                            bDepreciatedOneMonthMoney: layero.find("#b_depreciated_one_month_money").val(), //月折旧额
                            bDepreciatedMonthNumbers: layero.find("#b_depreciated_month_numbers").val(), //已提折旧月数
                            bAddupDepreciated: layero.find("#b_addup_depreciated").val(), //累计折旧
                            bRemarks: layero.find("#b_remarks").val(), //备注
                            bReserveField: layero.find("#b_reserve_field").val(), //备用字段
                            bImgpath: dispic, //照片附件
                            pJobNum:localStorage.getItem('pJobnum')
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
                    layero.find('.p-type').css({ 'fontWeight': 'bold', 'textAlign': 'center' });


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
                        elem: '#completionDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#completionDate').attr('value', value);
                        }
                    });

                    // 上次房屋批复时间
                    parent.parent.laydate.render({
                        elem: '#lastApproveTime',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#lastApproveTime').attr('value', value);
                        }
                    });

                    // 生成资产编号
                    $.ajax({
                        url: port + '/v1/building/createCode',
                        type: 'post',
                        success: function(res) {
                            console.log('资产编号：', res);
                            layero.find('#b_code').attr('value', res.msg);
                        }
                    });


                },
                btnAlign: 'c',
                content: '<div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>资产名称：</label></div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0" style="position: relative;">' +
                    '<input autocomplete="off" id="b_name" style="background-color: #fff;" type="text" class="form-control" value="">' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>资产分类名称：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly value="房屋" autocomplete="off" id="b_type" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>坐落位置：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_place" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>资产编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" id="b_code" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>预算项目编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_budgetNum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>产权形式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_property_right_type" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>权属性质：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_property_right_nature" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>权属证明：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_property_right_prove" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>权属年限：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_property_right_age_limit" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>权属证号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_property_right_papersNum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>持证人：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_papers_person" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>房屋所有权人：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_ownership_person" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>设计用途：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_devise_use" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>建筑结构：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_building_structure" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>取得方式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input value="新购" readonly autocomplete="off" id="b_gain_method" name="b_gain_method" type="" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>竣工日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="completionDate" type="" class="form-control" />' +
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
                    '<label>发证日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="faZhengDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>入账形式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" type="text" id="b_enter_account_type" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>会计凭证号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" type="text" id="b_accounting_document_num" class="form-control" />' +
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
                    '<label>上次房屋批复时间：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="lastApproveTime" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>价值类型：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<select class="form-control" id="b_value_type">' +
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
                    '<label><i class="must-star">*</i>数量：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_numbers" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>价值（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_value" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>财政拨款（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_public_economy" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>非财政拨款（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_not_public_economy" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>均价：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_average_price" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<p class="p-type">建筑面积</p>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>取暖面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_warm_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>危房面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_dangerous_building_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>自用面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_own_use_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>单位实际使用面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_own_depart_reality_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>出租面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_hire_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>出借面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_lend_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>闲置面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_set_aside_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>其他面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_other_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<p class="p-type">小计办公室用房</p>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>办公室用房自用面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_office_own_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>办公室用房单位实际使用面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_office_own_reality_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>办公室用房出租面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_office_hire_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>办公室用房出借面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_office_lend_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>办公室用房闲置面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_office_set_aside_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>办公室用房其他面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_office_other_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<p class="p-type">小计业务用房</p>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>业务用房自用面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_work_own_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>业务用房单位实际使用面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_work_own_reality_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>业务用房出租面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_work_hire_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>业务用房出借面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_work_lend_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>业务用房闲置面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_work_set_aside_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>业务用房其他面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_work_other_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<p class="p-type">小计其他用房</p>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>其他用房自用面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_other_own_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>其他用房单位实际用房面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_other_own_reality_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>其他用房出租面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_other_hire_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>其他用房出借面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_other_lend_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>其他用房闲置面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_other_set_aside_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>其他用房其他面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_other_other_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>自用价值：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_own_value" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>出借价值：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_lend_value" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>出租价值：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_hire_value" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>闲置价值：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_set_aside_value" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>其他价值：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_other_value" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>折旧状态：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<select class="form-control" id="b_depreciated_state">' +
                    '<option ></option>' +
                    '<option >已提折旧</option>' +
                    '<option >不提折旧</option>' +
                    '<option >已完成折旧</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +

                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>折旧年限（月）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_depreciated_years" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>月折旧额：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_depreciated_one_month_money" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>已提折旧月数：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_depreciated_month_numbers" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>累计折旧：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="b_addup_depreciated" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>备用字段：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<input autocomplete="off" id="b_reserve_field" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>备注：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<input autocomplete="off" id="b_remarks" type="text" class="form-control" />' +
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

                        if (layero.find("#b_name").val() == "") {
                            layer.msg("请输入资产名称")
                            return;
                        }



                        if (layero.find("#quDate").val() == "") {
                            layer.msg("请选择取得日期")
                            return;
                        }


                        if (layero.find("#manageDepart").val() == "") {
                            layer.msg("请选择管理部门")
                            return;
                        }
                        if (layero.find("#b_numbers").val() == "") {
                            layer.msg("请输入数量")
                            return;
                        }

                        if (layero.find("#b_value").val() == "") {
                            parent.parent.layer.msg("请输入价值")
                            return;
                        }


                        console.log(layero.find("#xmysNum").val())
                        $.ajax({
                            url: port + "/v1/building/updateBuilding",
                            type: "post",
                            data: {
                                id: a[0].id,
                                bName: layero.find("#b_name").val(), //资产名称
                                bType: layero.find("#b_type").val(), //资产分类名称
                                bPlace: layero.find("#b_place").val(), //坐落位置
                                bCode: layero.find("#b_code").val(), //资产编号
                                bBudgetnum: layero.find("#b_budgetNum").val(), //预算项目编号
                                bPropertyRightType: layero.find("#b_property_right_type").val(), //产权形式
                                bPropertyRightNature: layero.find("#b_property_right_nature").val(), //权属性质
                                bPropertyRightProve: layero.find("#b_property_right_prove").val(), //权属证明
                                bPropertyRightAgeLimit: layero.find("#b_property_right_age_limit").val(), //权属年限
                                bPropertyRightPapersnum: layero.find("#b_property_right_papersNum").val(), //权属证号
                                bPapersPerson: layero.find("#b_papers_person").val(), //持证人
                                bOwnershipPerson: layero.find("#b_ownership_person").val(), //房屋所有权人
                                bDeviseUse: layero.find("#b_devise_use").val(), //设计用途
                                bBuildingStructure: layero.find("#b_building_structure").val(), //建筑结构
                                bGainMethod: layero.find("#b_gain_method").val(), //取得方式
                                bCompletedDate: layero.find("#completionDate").val(), //竣工日期
                                bGainDate: layero.find("#quDate").val(), //取得日期
                                bCertificateDate: layero.find("#faZhengDate").val(), //发证日期
                                bEnterAccountType: layero.find("#b_enter_account_type").val(), //入账形式
                                bAccountingDocumentNum: layero.find("#b_accounting_document_num").val(), //会计凭证号
                                bEnterAccountDate: layero.find("#caiWuDate").val(), //财务入账日期
                                bChargeDepart: layero.find("#manageDepart").val(), //管理部门
                                bUseingDate: layero.find("#useDate").val(), //投入使用日期
                                bLastTimeRespondedDate: layero.find("#lastApproveTime").val(), //上次批复房屋使用时间
                                bValueType: layero.find("#b_value_type option:selected").val(), //价值类型
                                bNumbers: layero.find("#b_numbers").val(), //数量
                                bValue: layero.find("#b_value").val(), //价值
                                bPublicEconomy: layero.find("#b_public_economy").val(), //财政拨款
                                bNotPublicEconomy: layero.find("#b_not_public_economy").val(), //非财政拨款
                                bAveragePrice: layero.find("#b_average_price").val(), //均价
                                bWarmArea: layero.find("#b_warm_area").val(), //取暖面积
                                bDangerousBuildingArea: layero.find("#b_dangerous_building_area").val(), //危房面积
                                bOwnUseArea: layero.find("#b_own_use_area").val(), //自用面积
                                bOwnDepartRealityArea: layero.find("#b_own_depart_reality_area").val(), //本单位实际使用面积
                                bHireArea: layero.find("#b_hire_area").val(), //出租面积
                                bLendArea: layero.find("#b_lend_area").val(), //出借面积
                                bSetAsideArea: layero.find("#b_set_aside_area").val(), //闲置面积
                                bOtherArea: layero.find("#b_other_area").val(), //其他面积
                                bOfficeOwnArea: layero.find("#b_office_own_area").val(), //办公室用房自用面积
                                bOfficeOwnRealityArea: layero.find("#b_office_own_reality_area").val(), //办公用房本单位实际使用面积
                                bOfficeHireArea: layero.find("#b_office_hire_area").val(), //办公室用房出租面积
                                bOfficeLendArea: layero.find("#b_office_lend_area").val(), //办公室用房出借面积
                                bOfficeSetAsideArea: layero.find("#b_office_set_aside_area").val(), //办公室用房闲置面积
                                bOfficeOtherArea: layero.find("#b_office_other_area").val(), //办公室用房其他面积
                                bWorkOwnArea: layero.find("#b_work_own_area").val(), //业务用房自用面积
                                bWorkOwnRealityArea: layero.find("#b_work_own_reality_area").val(), //业务用房本单位实际使用面积
                                bWorkHireArea: layero.find("#b_work_hire_area").val(), //业务用房出租面积
                                bWorkLendArea: layero.find("#b_work_lend_area").val(), //业务用房出借面积
                                bWorkSetAsideArea: layero.find("#b_work_set_aside_area").val(), //业务用闲置面积
                                bWorkOtherArea: layero.find("#b_work_other_area").val(), //业务用房其他面积
                                bOtherOwnArea: layero.find("#b_other_own_area").val(), //其他用房自用面积
                                bOtherOwnRealityArea: layero.find("#b_other_own_reality_area").val(), //其他用房本单位实际使用面积
                                bOtherHireArea: layero.find("#b_other_hire_area").val(), //其他用房出租面积
                                bOtherLendArea: layero.find("#b_other_lend_area").val(), //其他用房出借面积
                                bOtherSetAsideArea: layero.find("#b_other_set_aside_area").val(), //其他用闲置面积
                                bOtherOtherArea: layero.find("#b_other_other_area").val(), //其他用房其他面积
                                bOwnValue: layero.find("#b_own_value").val(), //自用价值
                                bLendValue: layero.find("#b_lend_value").val(), //出借价值
                                bHireValue: layero.find("#b_hire_value").val(), //出租价值
                                bSetAsideValue: layero.find("#b_set_aside_value").val(), //闲置价值
                                bOtherValue: layero.find("#b_other_value").val(), //其他价值
                                bDepreciatedState: layero.find("#b_depreciated_state option:selected").val(), //折旧状态
                                bDepreciatedYears: layero.find("#b_depreciated_years").val(), //折旧年限
                                bDepreciatedOneMonthMoney: layero.find("#b_depreciated_one_month_money").val(), //月折旧额
                                bDepreciatedMonthNumbers: layero.find("#b_depreciated_month_numbers").val(), //已提折旧月数
                                bAddupDepreciated: layero.find("#b_addup_depreciated").val(), //累计折旧
                                bRemarks: layero.find("#b_remarks").val(), //备注
                                bReserveField: layero.find("#b_reserve_field").val(), //备用字段
                                bImgpath: dispic, //照片附件
                                pJobNum:localStorage.getItem('pJobnum')
                            },
                            success: function(res) {
                                console.log(res)
                                if (res > 0) {
                                    parent.parent.layer.msg("修改成功")
                                    parent.parent.layer.close(index)
                                    $("#tb_departments").bootstrapTable("refresh")
                                }

                            }
                        })


                        console.log('修改2');
                    },
                    success: function(layero, index) {
                        layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                        layero.find('input[readonly]').css('background', '#fff');
                        layero.find('.p-type').css({ 'fontWeight': 'bold', 'textAlign': 'center' });


                        // 取得方式下拉框回显
                        layero.find('#b_gain_method option').each(function(index, item) {
                            if ($(item).text() == a[0].bGainMethod) {
                                $(item).attr('selected', true);
                            }
                        });

                        // 价值类型下拉框回显
                        layero.find('#b_value_type option').each(function(index, item) {
                            if ($(item).text() == a[0].bValueType) {
                                $(item).attr('selected', true);
                            }
                        });

                        // 折旧状态下拉框回显
                        layero.find('#b_depreciated_state option').each(function(index, item) {
                            if ($(item).text() == a[0].bDepreciatedState) {
                                $(item).attr('selected', true);
                            }
                        });


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
                            elem: '#completionDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#completionDate').attr('value', value);
                            }
                        });

                        // 上次房屋批复时间
                        parent.parent.laydate.render({
                            elem: '#lastApproveTime',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#lastApproveTime').attr('value', value);
                            }
                        });

                    },
                    btnAlign: 'c',
                    content: '<div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>资产名称：</label></div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0" style="position: relative;">' +
                        '<input autocomplete="off" value="' + a[0].bName + '" id="b_name" style="background-color: #fff;" type="text" class="form-control" value="">' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产分类名称：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" value="房屋" id="b_type" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>坐落位置：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bPlace + '" id="b_place" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" value="' + a[0].bCode + '" id="b_code" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>预算项目编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bBudgetnum + '" id="b_budgetNum" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>产权形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bPropertyRightType + '" id="b_property_right_type" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>权属性质：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bPropertyRightNature + '" id="b_property_right_nature" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>权属证明：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bPropertyRightProve + '" id="b_property_right_prove" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>权属年限：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bPropertyRightAgeLimit + '" id="b_property_right_age_limit" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>权属证号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bPropertyRightPapersnum + '" id="b_property_right_papersNum" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>持证人：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bPapersPerson + '" id="b_papers_person" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>房屋所有权人：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOwnershipPerson + '" id="b_ownership_person" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>设计用途：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bDeviseUse + '" id="b_devise_use" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>建筑结构：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bBuildingStructure + '" id="b_building_structure" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>取得方式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input value="新购" readonly autocomplete="off" id="b_gain_method" name="b_gain_method" type="" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>竣工日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bCompletedDate + '" id="completionDate" type="" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>取得日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bGainDate + '" readonly id="quDate" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>发证日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bCertificateDate + '" readonly id="faZhengDate" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>入账形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bEnterAccountType + '" type="text" id="b_enter_account_type" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>会计凭证号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bAccountingDocumentNum + '" type="text" id="b_accounting_document_num" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财务入账日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bEnterAccountDate + '" readonly id="caiWuDate" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>投入使用日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bUseingDate + '" readonly id="useDate" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>管理部门：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bChargeDepart + '" style="background-color: #fff;" readonly type="text" id="manageDepart" class="form-control" value="">' +
                        '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>上次房屋批复时间：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bLastTimeRespondedDate + '" id="lastApproveTime" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>价值类型：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<select class="form-control" id="b_value_type">' +
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
                        '<label><i class="must-star">*</i>数量：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bNumbers + '" id="b_numbers" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>价值（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bValue + '" id="b_value" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财政拨款（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bPublicEconomy + '" id="b_public_economy" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>非财政拨款（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bNotPublicEconomy + '" id="b_not_public_economy" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>均价：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bAveragePrice + '" id="b_average_price" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<p class="p-type">建筑面积</p>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>取暖面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bWarmArea + '" id="b_warm_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>危房面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bDangerousBuildingArea + '" id="b_dangerous_building_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>自用面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOwnUseArea + '" id="b_own_use_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>单位实际使用面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOwnDepartRealityArea + '" id="b_own_depart_reality_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>出租面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bHireArea + '" id="b_hire_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>出借面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bLendArea + '" id="b_lend_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>闲置面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bSetAsideArea + '" id="b_set_aside_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>其他面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOtherArea + '" id="b_other_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<p class="p-type">小计办公室用房</p>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>办公室用房自用面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOfficeOwnArea + '" id="b_office_own_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>办公室用房单位实际使用面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOfficeOwnRealityArea + '" id="b_office_own_reality_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>办公室用房出租面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOfficeHireArea + '" id="b_office_hire_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>办公室用房出借面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOfficeLendArea + '" id="b_office_lend_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>办公室用房闲置面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOfficeSetAsideArea + '" id="b_office_set_aside_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>办公室用房其他面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOfficeOtherArea + '" id="b_office_other_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<p class="p-type">小计业务用房</p>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>业务用房自用面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bWorkOwnArea + '" id="b_work_own_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>业务用房单位实际使用面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bWorkOwnRealityArea + '" id="b_work_own_reality_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>业务用房出租面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bWorkHireArea + '" id="b_work_hire_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>业务用房出借面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bWorkLendArea + '" id="b_work_lend_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>业务用房闲置面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bWorkSetAsideArea + '" id="b_work_set_aside_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>业务用房其他面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bWorkOtherArea + '" id="b_work_other_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<p class="p-type">小计其他用房</p>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>其他用房自用面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOtherOwnArea + '" id="b_other_own_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>其他用房单位实际用房面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOtherOwnRealityArea + '" id="b_other_own_reality_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>其他用房出租面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOtherHireArea + '" id="b_other_hire_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>其他用房出借面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOtherLendArea + '" id="b_other_lend_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>其他用房闲置面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOtherSetAsideArea + '" id="b_other_set_aside_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>其他用房其他面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOtherOtherArea + '" id="b_other_other_area" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>自用价值：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOwnValue + '" id="b_own_value" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>出借价值：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bLendValue + '" id="b_lend_value" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>出租价值：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bHireValue + '" id="b_hire_value" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>闲置价值：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bSetAsideValue + '" id="b_set_aside_value" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>其他价值：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bOtherValue + '" id="b_other_value" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>折旧状态：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<select class="form-control" name="" id="b_depreciated_state">' +
                        '<option value=""></option>' +
                        '<option value="已提折旧">已提折旧</option>' +
                        '<option value="不提折旧">不提折旧</option>' +
                        '<option value="已完成折旧">已完成折旧</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>折旧年限（月）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bDepreciatedYears + '" id="b_depreciated_years" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>月折旧额：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bDepreciatedOneMonthMoney + '" id="b_depreciated_one_month_money" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>已提折旧月数：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bDepreciatedMonthNumbers + '" id="b_depreciated_month_numbers" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>累计折旧：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].bAddupDepreciated + '" id="b_addup_depreciated" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备用字段：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input autocomplete="off" value="' + a[0].bReserveField + '" id="b_reserve_field" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备注：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input autocomplete="off" value="' + a[0].bRemarks + '" id="b_remarks" type="text" class="form-control" />' +
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
                            url: port + '/v1/building/delteBuilding',
                            type: 'post',
                            data: {
                                ids: delData.toString()
                            },
                            success: function(data) {
                                console.log(data);
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

            // location.href = port + '/v1/personnel2/export';

            var a = $("#tb_departments").bootstrapTable('getSelections');
            var exportData = []; //要导出的数据

            if (a.length == 0) {
                // console.log('导出所有')
                // location.href = port + '/v1/materielinfo/exportMaterielInfoOnce';
                layer.msg("请选择要导出的数据")
                return;
            } else {
                //获取选中的选项
                for (var i = 0; i < a.length; i++) {
                    exportData[i] = a[i].id;
                }
                location.href = port + '/v1/building/exportBuilding?ids=' + exportData.toString();
            }
        });


    };
    return oInit;
};