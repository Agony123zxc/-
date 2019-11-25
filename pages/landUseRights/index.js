var phongReg = /^[1][3,4,5,7,8][0-9]{9}$/; //手机号格式验证
var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证正则验证
var currentTreeId = ''; //当前点击树状id
var currentTreeText = ''; //当前点击树状text

// 获取选中的行数据
function getSelectData() {
    var data = $("#tb_departments").bootstrapTable('getSelections');
    return {
        type:'土地使用权',
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
            url: port + '/v1/landUseRight/selectLandUseRightPage',
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
                field: 'luName',
                align: 'center',
                title: '资产名称'
            }, {
                field: 'luTypeName',
                align: 'center',
                title: '资产分类名称'
            }, {
                field: 'luAssetsNumber',
                align: 'center',
                title: '资产编号'
            }, {
                field: 'luManageDepartment',
                align: 'center',
                title: '管理部门'
            }, {
                field: 'luGainWay',
                align: 'center',
                title: '取得方式'
            }, {
                field: 'luGainTime',
                align: 'center',
                title: '取得日期'
            }, {
                field: 'luRemarks',
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
           
            assetName: $("#org_name").val(),
            pJobNum:localStorage.getItem('pJobnum')
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

                        // 带下载导入错误文件
                        // layer.open({
                        //     type: 1,
                        //     title: '导入结果',
                        //     btn: ['关闭'],
                        //     area: ['350px', '200px'],
                        //     btnAlign: 'c',
                        //     end: function() {
                        //         layer.closeAll();
                        //         location.reload();
                        //     },
                        //     success: function(layero, index) {
                        //         layero.find('.error-msg').css('cursor', 'pointer');
                        //         layero.find('.error-msg').on('click', function() {
                        //             location.href = port + '/v1/organize/exportErrorOrganizeInfo?organizeListString=' + encodeURIComponent(JSON.stringify(res.errorList));
                        //         });
                        //     },
                        //     content: '<div style="margin:20px"><p class="result-tit">导入成功</p><p class="error-msg">有' + res.errorCount + '条错误数据，点击下载错误信息</p></div>',
                        //     yes: function(index, layero) {
                        //         layer.closeAll();
                        //         location.reload();
                        //     }
                        // });

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
                '<td>' + row.luName + '</td>' +
                '<td>资产分类名称</td>' +
                '<td>' + row.luTypeName + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>预算项目编号</td>' +
                '<td>' + row.luBudgetnum + '</td>' +
                '<td>使用状况</td>' +
                '<td>' + row.luUsestatus + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>管理部门</td>' +
                '<td>' + row.luManageDepartment + '</td>' +
                '<td>取得方式</td>' +
                '<td>' + row.luGainWay + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>投入使用日期</td>' +
                '<td>' + row.luUseingDate + '</td>' +
                '<td>取得日期</td>' +
                '<td>' + row.luGainTime + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>持证人</td>' +
                '<td>' + row.luLicensee + '</td>' +
                '<td>数量</td>' +
                '<td>' + row.luNumber + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>均价</td>' +
                '<td>' + row.luAveragePrice + '</td>' +
                '<td>价值（元）</td>' +
                '<td>' + row.luValue + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>财政拨款（元）</td>' +
                '<td>' + row.luFinanceGrant + '</td>' +
                '<td>非财政拨款（元）</td>' +
                '<td>' + row.luNonFinanceGrant + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>入账形式</td>' +
                '<td>' + row.luAccountEntryType + '</td>' +
                '<td>价值类型</td>' +
                '<td>' + row.luValueType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>会计凭证号</td>' +
                '<td>' + row.luAccountingDocumentNumber + '</td>' +
                '<td>财务入账日期</td>' +
                '<td>' + row.luFinanceEntryTime + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>土地产权形式</td>' +
                '<td>' + row.luLandPropertyRightType + '</td>' +
                '<td>撤消状态</td>' +
                '<td>' + row.luAmortizationStatus + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>权属性质</td>' +
                '<td>' + row.luPropertyRightNature + '</td>' +
                '<td>权属证明</td>' +
                '<td>' + row.luPropertyRightProve + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>权属证号</td>' +
                '<td>' + row.luPropertyRightNumber + '</td>' +
                '<td>权属年限</td>' +
                '<td>' + row.luPropertyRightAgeLimit + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>发证日期</td>' +
                '<td>' + row.luCertificateDate + '</td>' +
                '<td>使用权类型</td>' +
                '<td>' + row.luUsufructType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>土地级次</td>' +
                '<td>' + row.luLandLevel + '</td>' +
                '<td>地类（用途）</td>' +
                '<td>' + row.luLandType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>独有面积</td>' +
                '<td>' + row.luOnlyHaveArea + '</td>' +
                '<td>坐落位置</td>' +
                '<td>' + row.luPlace + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>分摊面积</td>' +
                '<td>' + row.luShareArea + '</td>' +
                '<td>自用面积</td>' +
                '<td>' + row.luOwnArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>出借面积</td>' +
                '<td>' + row.luLendArea + '</td>' +
                '<td>出租面积</td>' +
                '<td>' + row.luHireArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>闲置面积</td>' +
                '<td>' + row.luSetAsideArea + '</td>' +
                '<td>其他面积</td>' +
                '<td>' + row.luOtherArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>自用价值</td>' +
                '<td>' + row.luOwnValue + '</td>' +
                '<td>出借价值</td>' +
                '<td>' + row.luLendValue + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>其他价值</td>' +
                '<td>' + row.luOtherValue + '</td>' +
                '<td>折旧年限（月）</td>' +
                '<td>' + row.luDepreciationYear + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>折旧方法</td>' +
                '<td>' + row.luDepreciationMethod + '</td>' +
                '<td>月折旧额</td>' +
                '<td>' + row.luMonthlyDepreciation + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>累计折旧</td>' +
                '<td>' + row.luTotalDepreciation + '</td>' +
                '<td>已提折旧月数</td>' +
                '<td>' + row.luDepreciatedMonths + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>备用字段</td>' +
                '<td>' + row.luReserveField + '</td>' +
                '<td>备注</td>' +
                '<td>' + row.luRemarks + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>照片附件</td>' +
                '<td colspan="3"><img class="annex-img" src="' + row.luPhotoAnnex + '"></td>' +
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

                    if (layero.find("#up_department").val() == "") {
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



                    $.ajax({
                        url: port + "/v1/landUseRight/addLandUseRight",
                        type: "post",
                        data: {
                            luAccountEntryType: layero.find("#srType").val(), //入账形式
                            luAccountingDocumentNumber: layero.find("#kjpzh").val(), //会计凭证号
                            luAmortizationStatus: layero.find("#csState").val(), //摊销状态
                            luAssetsNumber: layero.find("#zcNum").val(), //资产编号
                            luBudgetnum: layero.find("#xmysNum").val(), //预算项目编号
                            luDepreciatedMonths: layero.find("#yzjM").val(), //已提折旧月数
                            luAveragePrice: layero.find("#avaPrice").val(), //均价
                            luDepreciationMethod: layero.find("#zjff option:selected").val(), //折旧方法
                            luDepreciationYear: layero.find("#zjnx").val(), //折旧年限
                            luCertificateDate: layero.find("#faZhengDate").val(), //发证日期
                            luFinanceEntryTime: layero.find("#caiWuDate").val(), //财务入账日期
                            luFinanceGrant: layero.find("#czPay").val(), //财政拨款
                            luHireArea: layero.find("#borrowArea").val(), //出租面积
                            luGainTime: layero.find("#quDate").val(), //取得日期
                            luGainWay: layero.find("#getType").val(), //取得方式
                            luHireValue: layero.find("#rentVal").val(), //出租价值
                            luLandLevel: layero.find("#solieJC").val(), //土地级次
                            luLandPropertyRightType: layero.find("#solieType").val(), //土地产权形式
                            luLandType: layero.find("#solieTypes").val(), //地类（用途）
                            luLendArea: layero.find("#sendArea").val(), //出借面积
                            luLendValue: layero.find("#borrowVal").val(), //出借价值
                            luLicensee: layero.find("#catchPerson").val(), //持证人
                            luUseingDate: layero.find("#useDate").val(), //投入使用日期
                            luMonthlyDepreciation: layero.find("#mzje").val(), //月折旧额
                            luName: layero.find("#zcName").val(), //资产名称
                            luNonFinanceGrant: layero.find("#nczPay").val(), //非财政拨款
                            luNumber: layero.find("#totalNum").val(), //数量
                            luOnlyHaveArea: layero.find("#onlyArea").val(), //独有面积
                            luOtherArea: layero.find("#elseArea").val(), //其他面积
                            luOtherValue: layero.find("#elseVal").val(), //其他价值
                            luOwnArea: layero.find("#mainArea").val(), //自用面积
                            luOwnValue: layero.find("#mainVal").val(), //自用价值
                            luPhotoAnnex: dispic, //照片附件
                            luPlace: layero.find("#downPlace").val(), //坐落位置
                            luPropertyRightAgeLimit: layero.find("#qsYear").val(), //权属年限
                            luPropertyRightNature: layero.find("#qsType").val(), //权属性质
                            luPropertyRightNumber: layero.find("#qsNum").val(), //权属证号

                            luPropertyRightProve: layero.find("#qsProvide").val(), //权属证明
                            luSetAsideArea: layero.find("#freeArea").val(), //闲置面积
                            luSetAsideValue: layero.find("#freeVal").val(), //闲置面积
                            luRemarks: layero.find("#remarks").val(), //备注
                            luReserveField: layero.find("#spare").val(), //备用字段


                            luShareArea: layero.find("#avaArea").val(), //分摊面积
                            luTotalDepreciation: layero.find("#totalZj").val(), //累计折旧
                            luTypeName: layero.find("#number").val(), //资产分类名称
                            luManageDepartment: layero.find("#up_department").val(), //管理部门
                            luUsufructType: layero.find("#useNtype").val(), //使用权类型
                            luUsestatus: layero.find("#useState").val(), //使用状况
                            luValue: layero.find("#totalPrc").val(), //价值
                            luValueType: layero.find("#valType option:selected").val(), //价值类形
                            pJobNum:localStorage.getItem('pJobnum')
                        },
                        success: function(res) {
                            console.log(res)
                            if (res.success == true) {
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
                            url: port + "/v1/information/importInformationImg",
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

                    // 生成资产编号
                    $.ajax({
                        url: port + '/v1/landUseRight/createCode',
                        type: 'post',
                        success: function(res) {
                            console.log('资产编号：', res);
                            layero.find('#zcNum').attr('value', res.msg);
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
                    '<input readonly value="土地使用权" autocomplete="off" id="number" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>资产编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" id="zcNum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>预算项目编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="xmysNum" type="text" class="form-control" />' +
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
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>管理部门：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" style="background-color: #fff;" readonly type="text" id="up_department" class="form-control" value="">' +
                    '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                    '</div>' +
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
                    '<label>投入使用日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="useDate" type="text" class="form-control" />' +
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
                    '<label>持证人：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="catchPerson" type="text" class="form-control" />' +
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
                    '<label>均价：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="avaPrice" type="text" class="form-control" />' +
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
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>土地产权形式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="solieType" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>撤销状态：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="csState" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>权属性质：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="qsType" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>权属证明：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="qsProvide" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>权属证号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="qsNum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>权属年限：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="qsYear" type="text" class="form-control" />' +
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
                    '<label>使用权类型：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="useNtype" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>土地级次：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="solieJC" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>地类（用途）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="solieTypes" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +

                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-7" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用权面积：独有面积：</label>' +
                    '</div>' +
                    '<div class="col-md-5" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onlyArea" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>坐落位置：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="downPlace" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-7" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>分摊面积：</label>' +
                    '</div>' +
                    '<div class="col-md-5" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="avaArea" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>自用面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="mainArea" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>出借面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="sendArea" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>出租面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="borrowArea" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +

                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>闲置面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="freeArea" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +

                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>其他面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="elseArea" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>自用价值：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="mainVal" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>出借价值：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="borrowVal" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>出租价值：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="rentVal" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>闲置价值：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="freeVal" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>其他价值：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="elseVal" type="text" class="form-control" />' +
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
                    '<label>折旧方法：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<select class="form-control" id="zjff">' +
                    '<option value="提折旧">提折旧</option>' +
                    '<option value="不提折旧">不提折旧</option>' +
                    '<option value="已完成折旧">已完成折旧</option>' +
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
                    '<label>累计折旧：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="totalZj" type="text" class="form-control" />' +
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

                        if (layero.find("#up_department").val() == "") {
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
                            url: port + "/v1/landUseRight/updateLandUseRight",
                            type: "post",
                            data: {
                                id: a[0].id,
                                luAccountEntryType: layero.find("#srType").val(), //入账形式
                                luAccountingDocumentNumber: layero.find("#kjpzh").val(), //会计凭证号
                                luAmortizationStatus: layero.find("#csState").val(), //摊销状态
                                luAssetsNumber: layero.find("#zcNum").val(), //资产编号
                                luBudgetnum: layero.find("#xmysNum").val(), //预算项目编号
                                luDepreciatedMonths: layero.find("#yzjM").val(), //已提折旧月数
                                luAveragePrice: layero.find("#avaPrice").val(), //均价
                                luDepreciationMethod: layero.find("#zjff option:selected").val(), //折旧方法
                                luDepreciationYear: layero.find("#zjnx").val(), //折旧年限
                                luCertificateDate: layero.find("#faZhengDate").val(), //发证日期
                                luFinanceEntryTime: layero.find("#caiWuDate").val(), //财务入账日期
                                luFinanceGrant: layero.find("#czPay").val(), //财政拨款
                                luHireArea: layero.find("#borrowArea").val(), //出租面积
                                luGainTime: layero.find("#quDate").val(), //取得日期
                                luGainWay: layero.find("#getType").val(), //取得方式
                                luHireValue: layero.find("#rentVal").val(), //出租价值
                                luLandLevel: layero.find("#solieJC").val(), //土地级次
                                luLandPropertyRightType: layero.find("#solieType").val(), //土地产权形式
                                luLandType: layero.find("#solieTypes").val(), //地类（用途）
                                luLendArea: layero.find("#sendArea").val(), //出借面积
                                luLendValue: layero.find("#borrowVal").val(), //出借价值
                                luLicensee: layero.find("#catchPerson").val(), //持证人
                                luUseingDate: layero.find("#useDate").val(), //投入使用日期
                                luMonthlyDepreciation: layero.find("#mzje").val(), //月折旧额
                                luName: layero.find("#zcName").val(), //资产名称
                                luNonFinanceGrant: layero.find("#nczPay").val(), //非财政拨款
                                luNumber: layero.find("#totalNum").val(), //数量
                                luOnlyHaveArea: layero.find("#onlyArea").val(), //独有面积
                                luOtherArea: layero.find("#elseArea").val(), //其他面积
                                luOtherValue: layero.find("#elseVal").val(), //其他价值
                                luOwnArea: layero.find("#mainArea").val(), //自用面积
                                luOwnValue: layero.find("#mainVal").val(), //自用价值
                                luPhotoAnnex: dispic, //照片附件
                                luPlace: layero.find("#downPlace").val(), //坐落位置
                                luPropertyRightAgeLimit: layero.find("#qsYear").val(), //权属年限
                                luPropertyRightNature: layero.find("#qsType").val(), //权属性质
                                luPropertyRightNumber: layero.find("#qsNum").val(), //权属证号

                                luPropertyRightProve: layero.find("#qsProvide").val(), //权属证明
                                luSetAsideArea: layero.find("#freeArea").val(), //闲置面积
                                luSetAsideValue: layero.find("#freeVal").val(), //闲置价值
                                luRemarks: layero.find("#remarks").val(), //备注
                                luReserveField: layero.find("#spare").val(), //备用字段


                                luShareArea: layero.find("#avaArea").val(), //分摊面积
                                luTotalDepreciation: layero.find("#totalZj").val(), //累计折旧
                                luTypeName: layero.find("#number").val(), //资产分类名称
                                luManageDepartment: layero.find("#up_department").val(), //管理部门
                                luUsufructType: layero.find("#useNtype").val(), //使用权类型
                                luUsestatus: layero.find("#useState").val(), //使用状况
                                luValue: layero.find("#totalPrc").val(), //价值
                                luValueType: layero.find("#valType option:selected").val(), //价值类形
                                pJobNum:localStorage.getItem('pJobnum')
                            },
                            success: function(res) {
                                console.log(res)
                                if (res.success == true) {
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



                        $(document).ready(function() {
                            $(".misBtn").change();
                        })
                        //图片上传
                        $('input[name="file"]').on('change', function() {
                            $.ajax({
                                url: port + "/v1/information/importInformationImg",
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

                        // 取得方式下拉框回显
                        layero.find('#getType option').each(function(index, item) {
                            if ($(item).text() == a[0].luGainWay) {
                                $(item).attr('selected', true);
                            }
                        });

                        // 价值类型下拉框回显
                        layero.find('#valType option').each(function(index, item) {
                            if ($(item).text() == a[0].luValueType) {
                                $(item).attr('selected', true);
                            }
                        });

                        // 折旧方法下拉框回显
                        layero.find('#zjff option').each(function(index, item) {
                            if ($(item).text() == a[0].luDepreciationMethod) {
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
                        '<input autocomplete="off" value="' + a[0].luName + '" style="background-color: #fff;" id="zcName" type="text" class="form-control" value="">' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产分类名称：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="土地使用权" id="number" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" id="zcNum" value="' + a[0].luAssetsNumber + '" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>预算项目编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luBudgetnum + '" id="xmysNum" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用状况：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luUsestatus + '" id="useState" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>管理部门：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luManageDepartment + '" style="background-color: #fff;" readonly type="text" id="up_department" class="form-control" value="">' +
                        '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                        '</div>' +
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
                        '<label>投入使用日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luUseingDate + '" readonly id="useDate" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>取得日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luGainTime + '" readonly id="quDate" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>持证人：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luLicensee + '" id="catchPerson" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>数量：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luNumber + '" id="totalNum" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>均价：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luAveragePrice + '" id="avaPrice" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>价值（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luValue + '" id="totalPrc" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财政拨款（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luFinanceGrant + '" id="czPay" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>非财政拨款（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luNonFinanceGrant + '" id="nczPay" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>入账形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luAccountEntryType + '" id="srType" type="text" class="form-control" />' +
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
                        '<label>会计凭证号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luAccountingDocumentNumber + '" id="kjpzh" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财务入账日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luFinanceEntryTime + '" readonly id="caiWuDate" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>土地产权形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luLandPropertyRightType + '" id="solieType" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>撤销状态：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luAmortizationStatus + '" id="csState" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>权属性质：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luPropertyRightNature + '" id="qsType" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>权属证明：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luPropertyRightProve + '" id="qsProvide" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>权属证号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luPropertyRightNumber + '" id="qsNum" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>权属年限：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luPropertyRightAgeLimit + '" id="qsYear" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>发证日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luCertificateDate + '" readonly id="faZhengDate" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用权类型：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luUsufructType + '" id="useNtype" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>土地级次：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luLandLevel + '" id="solieJC" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>地类（用途）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luLandType + '" id="solieTypes" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +

                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-7" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用权面积：独有面积：</label>' +
                        '</div>' +
                        '<div class="col-md-5" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luOnlyHaveArea + '" id="onlyArea" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>坐落位置：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luPlace + '" id="downPlace" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-7" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>分摊面积：</label>' +
                        '</div>' +
                        '<div class="col-md-5" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luShareArea + '" id="avaArea" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>自用面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luOwnArea + '" id="mainArea" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>出借面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luLendArea + '" id="sendArea" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>出租面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luHireArea + '" id="borrowArea" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +

                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>闲置面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luSetAsideArea + '" id="freeArea" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +

                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>其他面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luOtherArea + '" id="elseArea" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>自用价值：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luOwnValue + '" id="mainVal" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>出借价值：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luLendValue + '" id="borrowVal" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>出租价值：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luHireValue + '" id="rentVal" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>闲置价值：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luSetAsideValue + '" id="freeVal" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>其他价值：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luOtherValue + '" id="elseVal" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +

                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>折旧年限（月）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luDepreciationYear + '" id="zjnx" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>折旧方法：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<select class="form-control" id="zjff">' +
                        '<option></option>' +
                        '<option value="提折旧">提折旧</option>' +
                        '<option value="不提折旧">不提折旧</option>' +
                        '<option value="已完成折旧">已完成折旧</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>月折旧额：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luMonthlyDepreciation + '" id="mzje" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>累计折旧：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luTotalDepreciation + '" id="totalZj" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +

                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>已提折旧月数：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" value="' + a[0].luDepreciatedMonths + '" id="yzjM" type="text" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备用字段：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input autocomplete="off" value="' + a[0].luReserveField + '" type="text" id="spare" class="form-control" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备注：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input autocomplete="off" value="' + a[0].luRemarks + '" type="text" id="remarks" class="form-control" />' +
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
                parent.parent.layer.msg('请选择单行数据');
            }
        });


        // 删除表格数据
        $("#btn_delete").on('click', function() {
            console.log('删除')
            var a = $("#tb_departments").bootstrapTable('getSelections');
            console.log(a)
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
                            url: port + '/v1/landUseRight/deleteLandUseRight',
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

            // location.href = port + '/v1/personnel2/export';

            var a = $("#tb_departments").bootstrapTable('getSelections');
            var exportData = []; //要导出的数据

            if (a.length == 0) {
                // console.log('导出所有')
                // location.href = port + '/v1/materielinfo/exportMaterielInfoOnce';
                layer.msg("请选择数据")
                return;
            } else {
                //获取选中的选项
                for (var i = 0; i < a.length; i++) {
                    exportData[i] = a[i].id;
                }
                location.href = port + '/v1/landUseRight/exportLandUseRight?ids=' + exportData.toString();
            }
        });


    };
    return oInit;
};