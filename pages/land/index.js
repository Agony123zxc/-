var currentTreeId = ''; //当前点击树状id
var currentTreeText = ''; //当前点击树状text
var uploadFile;


// 获取选中的行数据
function getSelectData() {
    var data = $("#tb_departments").bootstrapTable('getSelections');
    return {
        type: '土地',
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
            // url: 'table.json',
            url: port + '/v1/land/selectLandPage',
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
                field: 'aName',
                align: 'center',
                title: '资产名称'
            }, {
                field: 'aType',
                align: 'center',
                title: '资产分类名称'
            }, {
                field: 'aCode',
                align: 'center',
                title: '资产编号'
            }, {
                field: 'aChargeDepart',
                align: 'center',
                title: '管理部门'
            }, {
                field: 'aGainType',
                align: 'center',
                title: '取得方式'
            }, {
                field: 'aGainDate',
                align: 'center',
                title: '取得日期'
            }, {
                field: 'aRemarks',
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
                $('.fixed-table-container').css({
                    'height': $(window).height() - 160 + 'px'
                });
                $('.panel-body').css({
                    'height': $(window).height() + 'px'
                });

            },
            //加载失败时执行
            onLoadError: function() {
                $('.fixed-table-container').css({
                    'height': $(window).height() - 160 + 'px'
                });
                $('.panel-body').css({
                    'height': $(window).height() + 'px'
                });
            },
            onClickRow: function(row, $element) {}
        });
    };


    //得到查询的参数
    oTableInit.queryParams = function(params) {
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            pageSize: params.limit, //页面大小
            pageNum: (params.offset / params.limit) + 1, //页码
            aName: $('#org_name').val(), //工号
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
                layero.find('.layui-layer-btn0').css({
                    background: '#fff',
                    color: '#333',
                    borderColor: '#ddd',
                    padding: '0 20px'
                });
            },
            content: '<div class="detail-layer">' +
                '<table>' +
                '<tr>' +
                '<td>资产名称</td>' +
                '<td>' + row.aName + '</td>' +
                '<td>资产分类名称</td>' +
                '<td>' + row.aType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>坐落位置</td>' +
                '<td>' + row.aPlace + '</td>' +
                '<td>资产编号</td>' +
                '<td>' + row.aCode + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>预算项目编号</td>' +
                '<td>' + row.aBudgetnum + '</td>' +
                '<td>产权形式</td>' +
                '<td>' + row.aPropertyRightType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>权属性质</td>' +
                '<td>' + row.aPropertyRightNature + '</td>' +
                '<td>权属证明</td>' +
                '<td>' + row.aPropertyRightProve + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>权属年限</td>' +
                '<td>' + row.aPropertyRightAgeLimit + '</td>' +
                '<td>权属证号</td>' +
                '<td>' + row.aPropertyRightPapersnum + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>持证人</td>' +
                '<td>' + row.aPapersPerson + '</td>' +
                '<td>地类（用途）</td>' +
                '<td>' + row.aLandType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>土地级次</td>' +
                '<td>' + row.aLandLevel + '</td>' +
                '<td>使用权类型</td>' +
                '<td>' + row.aUsufructType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>取得方式</td>' +
                '<td>' + row.aGainType + '</td>' +
                '<td>数量</td>' +
                '<td>' + row.aNumbers + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>取得日期</td>' +
                '<td>' + row.aGainDate + '</td>' +
                '<td>发证日期</td>' +
                '<td>' + row.aCertificateDate + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>入账形式</td>' +
                '<td>' + row.aEnterAccountType + '</td>' +
                '<td>会计凭证号</td>' +
                '<td>' + row.aAccountingDocumentNum + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>账务入账日期</td>' +
                '<td>' + row.aEnterAccountDate + '</td>' +
                '<td>投入使用日期</td>' +
                '<td>' + row.aUseingDate + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>管理部门</td>' +
                '<td>' + row.aChargeDepart + '</td>' +
                '<td>价值类型</td>' +
                '<td>' + row.aValueType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>价值（元）</td>' +
                '<td>' + row.aValue + '</td>' +
                '<td>财政拨款（元）</td>' +
                '<td>' + row.aPublicEconomy + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>非财政拨款（元）</td>' +
                '<td>' + row.aNotPublicEconomy + '</td>' +
                '<td>均价</td>' +
                '<td>' + row.aAveragePrice + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>独有面积</td>' +
                '<td>' + row.aOnlyHaveArea + '</td>' +
                '<td>自用面积</td>' +
                '<td>' + row.aOwnArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>分摊面积</td>' +
                '<td>' + row.aShareArea + '</td>' +
                '<td>出租面积</td>' +
                '<td>' + row.aHireArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>出借面积</td>' +
                '<td>' + row.aLendValue + '</td>' +
                '<td>其他面积</td>' +
                '<td>' + row.aOtherArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>闲置面积</td>' +
                '<td>' + row.aSetAsideArea + '</td>' +
                '<td>出借价值</td>' +
                '<td>' + row.aLendValue + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>自用价值</td>' +
                '<td>' + row.aOwnValue + '</td>' +
                '<td>闲置价值</td>' +
                '<td>' + row.aSetAsideArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>出租价值</td>' +
                '<td>' + row.aHireValue + '</td>' +
                '<td>备用字段</td>' +
                '<td>' + row.aReserveField + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>其他价值</td>' +
                '<td>' + row.aOtherValue + '</td>' +
                '<td>备注</td>' +
                '<td>' + row.aRemarks + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>照片附件</td>' +
                '<td colspan="3"><img class="annex-img" src="' + row.aImgpath + '"></td>' +
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



                    if (layero.find("#a_name").val() == '') {
                        parent.parent.layer.msg('请输入资产名称');
                        return;
                    }



                    if (layero.find("#a_numbers").val() == '') {
                        parent.parent.layer.msg('请输入数量');
                        return;
                    }

                    if (layero.find("#quDate").val() == '') {
                        parent.parent.layer.msg('请选择取得日期');
                        return;
                    }



                    if (layero.find("#a_charge_depart").val() == '') {
                        parent.parent.layer.msg('请选择管理部门');
                        return;
                    }
                    if (layero.find("#a_value").val() == '') {
                        parent.parent.layer.msg('请输入价值');
                        return;
                    }



                    $.ajax({
                        url: port + '/v1/land/insertLand',
                        type: 'post',
                        data: {
                            aName: layero.find("#a_name").val(), //资产名称
                            aType: layero.find("#a_type").val(), //资产分类名称
                            aPlace: layero.find("#a_place").val(), //姓名
                            aCode: layero.find("#a_code").val(), //资产编号
                            aBudgetnum: layero.find("#a_budgetNum").val(), //部门
                            aPropertyRightType: layero.find("#a_property_right_type").val(), //学历
                            aPropertyRightNature: layero.find("#a_property_right_nature").val(), //民族
                            aPropertyRightProve: layero.find("#a_property_right_prove").val(), //职务
                            aPropertyRightAgeLimit: layero.find("#a_property_right_age_limit").val(), //职称
                            aPropertyRightPapersNum: layero.find("#a_property_right_papersNum").val(), //政治面貌
                            aPapersPerson: layero.find("#a_papers_person").val(), //手机号码
                            aLandType: layero.find("#a_land_type").val(), //出生日期
                            aLandLevel: layero.find("#a_land_level").val(), //入职日期
                            aUsufructType: layero.find("#a_usufruct_type").val(), //婚姻状况
                            aGainType: layero.find("#a_gain_type").val(), //人事状态
                            aNumbers: layero.find("#a_numbers").val(), //毕业日期
                            aGainDate: layero.find("#quDate").val(), //毕业院校
                            aCertificateDate: layero.find("#faZhengDate").val(), //发证日期faZhengDate
                            aEnterAccountType: layero.find("#a_enter_account_type").val(), //身份证号
                            aAccountingDocumentNum: layero.find("#a_accounting_document_num").val(), //上传的图片地址
                            aEnterAccountDate: layero.find("#caiWuDate").val(),
                            aUseingDate: layero.find("#useDate").val(),
                            aChargeDepart: layero.find("#a_charge_depart").val(),
                            aValueType: layero.find("#a_value_type").val(),
                            aValue: layero.find("#a_value").val(),
                            aPublicEconomy: layero.find("#a_public_economy").val(),
                            aNotPublicEconomy: layero.find("#a_not_public_economy").val(),
                            aAveragePrice: layero.find("#a_average_price").val(),
                            aOnlyHaveArea: layero.find("#a_only_have_area").val(),
                            aShareArea: layero.find("#a_share_area").val(),
                            aOwnArea: layero.find("#a_own_area").val(),
                            aHireArea: layero.find("#a_hire_area").val(),
                            aLendArea: layero.find("#a_lend_area").val(),
                            aOtherArea: layero.find("#a_other_area").val(),
                            aSetAsideArea: layero.find("#a_set_aside_area").val(),
                            aLendValue: layero.find("#a_lend_value").val(),
                            aOwnValue: layero.find("#a_own_value").val(),
                            aSetAsideValue: layero.find("#a_set_aside_value").val(),
                            aHireValue: layero.find("#a_hire_value").val(),
                            aReserveField: layero.find("#a_reserve_field").val(),
                            aOtherValue: layero.find("#a_other_value").val(),
                            aImgpath: uploadFile,
                            aRemarks: layero.find("#a_remarks").val(),
                            pJobNum:localStorage.getItem('pJobnum')
                        },
                        success: function(data) {
                            console.log('添加成功' + data);
                            $("#tb_departments").bootstrapTable('refresh'); //刷新表格数据
                            parent.parent.layer.close(index);
                            parent.parent.layer.msg('添加成功');

                        }
                    });


                },
                success: function(layero, index) {
                    layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                    layero.find('input[readonly]').css('background', '#fff');

                    // 上传照片
                    layero.find('#uploadFile').change(function(event) {
                        $.ajax({
                            url: port + "/v1/land/importLandImg",
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
                    layero.find('#a_charge_depart').on('click', function() {
                        var options = {
                            bootstrap2: false,
                            showTags: true,
                            levels: 5,
                            checkedIcon: "glyphicon glyphicon-check",
                            data: getTree(),
                            onNodeSelected: function(event, data) {
                                console.log(data);
                                layero.find('#a_charge_depart').attr('value', data.text);
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
                        done: function(value, date, endDate) {
                            layero.find('#quDate').attr('value', value);
                        }
                    });

                    // 发证日期
                    parent.parent.laydate.render({
                        elem: '#faZhengDate',
                        done: function(value, date, endDate) {
                            layero.find('#faZhengDate').attr('value', value);
                        }
                    });

                    // 财务入账日期日期
                    parent.parent.laydate.render({
                        elem: '#caiWuDate',
                        done: function(value, date, endDate) {
                            layero.find('#caiWuDate').attr('value', value);
                        }
                    });

                    // 投入使用日期
                    parent.parent.laydate.render({
                        elem: '#useDate',
                        done: function(value, date, endDate) {
                            layero.find('#useDate').attr('value', value);
                        }
                    });


                    // 生成资产编号
                    $.ajax({
                        url: port + '/v1/land/createCode',
                        type: 'post',
                        success: function(res) {
                            console.log('资产编号：', res);
                            layero.find('#a_code').attr('value', res.msg);
                        }
                    });


                },
                btnAlign: 'c',
                content: '<div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>资产名称：</label></div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0" style="position: relative;">' +
                    '<input autocomplete="off" id = "a_name" style="background-color: #fff;" type="text" class="form-control" value="">' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>资产分类名称：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" id="a_type" type="text" class="form-control" value="土地" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>坐落位置：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_place" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>资产编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" id="a_code" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>预算项目编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_budgetNum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>产权形式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_property_right_type" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>权属性质：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_property_right_nature" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>权属证明：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_property_right_prove" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>权属年限：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_property_right_age_limit" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>权属证号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_property_right_papersNum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>持证人：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_papers_person" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>地类（用途）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_land_type" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>土地层次：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_land_level" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用权类型：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_usufruct_type" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>取得方式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" id="a_gain_type" type="text" class="form-control" value="新购" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>数量：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_numbers" type="number" class="form-control" />' +
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
                    '<input autocomplete="off" id="a_enter_account_type" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>会计凭证号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_accounting_document_num" type="text" class="form-control" />' +
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
                    '<input autocomplete="off" id="a_charge_depart" style="background-color: #fff;" readonly type="text" id="manageDepart" class="form-control" value="">' +
                    '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>价值类型：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<select class="form-control" id="a_value_type">' +
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
                    '<label><i class="must-star">*</i>价值（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_value" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>财政拨款（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_public_economy" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>非财政拨款（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_not_public_economy" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>均价：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_average_price" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-7" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用权面积：独有面积：</label>' +
                    '</div>' +
                    '<div class="col-md-5" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_only_have_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>自用面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_own_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-7" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>分摊面积：</label>' +
                    '</div>' +
                    '<div class="col-md-5" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_share_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>出租面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_hire_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>出借面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_lend_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>其他面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_other_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>闲置面积：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_set_aside_area" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>出借价值：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_lend_value" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>自用价值：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_own_value" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>闲置价值：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_set_aside_value" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>出租价值：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_hire_value" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>其他价值：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="a_other_value" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>备用字段：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<input autocomplete="off" id="a_reserve_field" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>备注：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<input autocomplete="off" id="a_remarks" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>照片附件：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<form enctype="multipart/form-data" id="Form">' +
                    '<input accept="image/*" multiple type="file" name="file" id="uploadFile"/>' +
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
                        if ($("#a_name").val() == '') {
                            parent.parent.layer.msg('请输入资产名称');
                            return;
                        }



                        if ($("#a_numbers").val() == '') {
                            parent.parent.layer.msg('请输入数量');
                            return;
                        }

                        if ($("#quDate").val() == '') {
                            parent.parent.layer.msg('请选择取得日期');
                            return;
                        }



                        if ($("#a_charge_depart").val() == '') {
                            parent.parent.layer.msg('请选择管理部门');
                            return;
                        }

                        if (layero.find("#a_value").val() == '') {
                            parent.parent.layer.msg('请输入价值');
                            return;
                        }




                        $.ajax({
                            url: port + '/v1/land/updateLand',
                            type: 'post',
                            data: {
                                id: a[0].id,
                                aName: layero.find("#a_name").val(), //左侧树状部门
                                aType: layero.find("#a_type").val(), //工号
                                aPlace: layero.find("#a_place").val(), //姓名
                                aCode: layero.find("#a_code").val(), //性别
                                aBudgetnum: layero.find("#a_budgetNum").val(), //部门
                                aPropertyRightType: layero.find("#a_property_right_type").val(), //学历
                                aPropertyRightNature: layero.find("#a_property_right_nature").val(), //民族
                                aPropertyRightProve: layero.find("#a_property_right_prove").val(), //职务
                                aPropertyRightAgeLimit: layero.find("#a_property_right_age_limit").val(), //职称
                                aPropertyRightPapersnum: layero.find("#a_property_right_papersNum").val(), //权属证号
                                aPapersPerson: layero.find("#a_papers_person").val(), //手机号码
                                aLandType: layero.find("#a_land_type").val(), //出生日期
                                aLandLevel: layero.find("#a_land_level").val(), //入职日期
                                aUsufructType: layero.find("#a_usufruct_type").val(), //婚姻状况
                                aGainType: layero.find("#a_gain_type").val(), //人事状态
                                aNumbers: layero.find("#a_numbers").val(), //毕业日期
                                aGainDate: layero.find("#quDate").val(), //毕业院校
                                aCertificateDate: layero.find("#faZhengDate").val(), //发证日期faZhengDate
                                aEnterAccountType: layero.find("#a_enter_account_type").val(), //身份证号
                                aAccountingDocumentNum: layero.find("#a_accounting_document_num").val(), //上传的图片地址
                                aEnterAccountDate: layero.find("#caiWuDate").val(),
                                aUseingDate: layero.find("#useDate").val(),
                                aChargeDepart: layero.find("#a_charge_depart").val(),
                                aValueType: layero.find("#a_value_type").val(),
                                aValue: layero.find("#a_value").val(),
                                aPublicEconomy: layero.find("#a_public_economy").val(),
                                aNotPublicEconomy: layero.find("#a_not_public_economy").val(),
                                aAveragePrice: layero.find("#a_average_price").val(),
                                aOnlyHaveArea: layero.find("#a_only_have_area").val(),
                                aShareArea: layero.find("#a_share_area").val(),
                                aOwnArea: layero.find("#a_own_area").val(),
                                aHireArea: layero.find("#a_hire_area").val(),
                                aLendArea: layero.find("#a_lend_area").val(),
                                aOtherArea: layero.find("#a_other_area").val(),
                                aSetAsideArea: layero.find("#a_set_aside_area").val(),
                                aLendValue: layero.find("#a_lend_value").val(),
                                aOwnValue: layero.find("#a_own_value").val(),
                                aSetAsideValue: layero.find("#a_set_aside_value").val(),
                                aHireValue: layero.find("#a_hire_value").val(),
                                aReserveField: layero.find("#a_reserve_field").val(),
                                aOtherValue: layero.find("#a_other_value").val(),
                                aImgPath: layero.find("#a_imgPath").val(),
                                aRemarks: layero.find("#a_remarks").val(),
                                pJobNum:localStorage.getItem('pJobnum')
                            },


                            success: function(data) {
                                console.log('修改成功' + data);
                                $("#tb_departments").bootstrapTable('refresh'); //刷新表格数据
                                parent.parent.layer.close(index);
                                layer.msg('修改成功');
                            }
                        });

                        console.log('修改2');
                    },
                    success: function(layero, index) {
                        layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                        layero.find('input[readonly]').css('background', '#fff');


                        // 管理部门
                        // 管理部门
                        layero.find('#a_charge_depart').on('click', function() {
                            var options = {
                                bootstrap2: false,
                                showTags: true,
                                levels: 5,
                                checkedIcon: "glyphicon glyphicon-check",
                                data: getTree(),
                                onNodeSelected: function(event, data) {
                                    console.log(data);
                                    layero.find('#a_charge_depart').attr('value', data.text);
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
                            done: function(value, date, endDate) {
                                layero.find('#quDate').attr('value', value);
                            }
                        });

                        // 发证日期
                        parent.parent.laydate.render({
                            elem: '#faZhengDate',
                            done: function(value, date, endDate) {
                                layero.find('#faZhengDate').attr('value', value);
                            }
                        });

                        // 财务入账日期日期
                        parent.parent.laydate.render({
                            elem: '#caiWuDate',
                            done: function(value, date, endDate) {
                                layero.find('#caiWuDate').attr('value', value);
                            }
                        });

                        // 投入使用日期
                        parent.parent.laydate.render({
                            elem: '#useDate',
                            done: function(value, date, endDate) {
                                layero.find('#useDate').attr('value', value);
                            }
                        });
                        // 价值类型下拉框回显
                        layero.find('#a_value_type option').each(function(index, item) {
                            if (a[0].aValueType == $(item).text()) {
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
                        '<input autocomplete="off" id = "a_name" style="background-color: #fff;" type="text" class="form-control" value="' + a[0].aName + '">' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产分类名称：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" id="a_type" type="text" class="form-control" value="土地"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>坐落位置：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_place" type="text" class="form-control" value="' + a[0].aPlace + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" id="a_code" type="text" class="form-control" value="' + a[0].aCode + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>预算项目编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_budgetNum" type="text" class="form-control" value="' + a[0].aBudgetnum + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>产权形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_property_right_type" type="text" class="form-control" value="' + a[0].aPropertyRightType + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>权属性质：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_property_right_nature" type="text" class="form-control" value="' + a[0].aPropertyRightNature + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>权属证明：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_property_right_prove" type="text" class="form-control" value="' + a[0].aPropertyRightProve + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>权属年限：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_property_right_age_limit" type="text" class="form-control" value="' + a[0].aPropertyRightAgeLimit + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>权属证号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_property_right_papersNum" type="text" class="form-control" value="' + a[0].aPropertyRightPapersnum + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>持证人：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_papers_person" type="text" class="form-control" value="' + a[0].aPapersPerson + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>地类（用途）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_land_type" type="text" class="form-control" value="' + a[0].aLandType + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>土地层次：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_land_level" type="text" class="form-control" value="' + a[0].aLandLevel + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用权类型：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_usufruct_type" type="text" class="form-control" value="' + a[0].aUsufructType + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>取得方式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" id="a_gain_type" type="text" class="form-control" value="新购" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>数量：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_numbers" type="number" class="form-control" value="' + a[0].aNumbers + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>取得日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="quDate" type="text" class="form-control" value="' + a[0].aGainDate + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>发证日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="faZhengDate" type="text" class="form-control" value="' + a[0].aCertificateDate + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>入账形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_enter_account_type" type="text" class="form-control" value="' + a[0].aEnterAccountType + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>会计凭证号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_accounting_document_num" type="text" class="form-control" value="' + a[0].aAccountingDocumentNum + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财务入账日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="caiWuDate" type="text" class="form-control" value="' + a[0].aEnterAccountDate + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>投入使用日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="useDate" type="text" class="form-control" value="' + a[0].aUseingDate + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>管理部门：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_charge_depart" value="' + a[0].aChargeDepart + '" style="background-color: #fff;" readonly type="text" id="manageDepart" class="form-control" value="">' +
                        '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>价值类型：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<select class="form-control" id="a_value_type">' +
                        '<option>校区</option>' +
                        '<option>院系</option>' +
                        '<option>专业</option>' +
                        '<option>班级</option>' +
                        '<option>机构</option>' +
                        '<option>教学机构</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>价值（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_value" type="text" class="form-control" value="' + a[0].aValue + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财政拨款（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_public_economy" type="text" class="form-control" value="' + a[0].aPublicEconomy + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>非财政拨款（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_not_public_economy" type="text" class="form-control" value="' + a[0].aNotPublicEconomy + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>均价：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_average_price" type="text" class="form-control" value="' + a[0].aAveragePrice + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-7" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用权面积：独有面积：</label>' +
                        '</div>' +
                        '<div class="col-md-5" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_only_have_area" type="text" class="form-control" value="' + a[0].aOnlyHaveArea + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>自用面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_own_area" type="text" class="form-control" value="' + a[0].aOwnArea + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-7" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>分摊面积：</label>' +
                        '</div>' +
                        '<div class="col-md-5" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_share_area" type="text" class="form-control" value="' + a[0].aShareArea + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>出租面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_hire_area" type="text" class="form-control" value="' + a[0].aHireArea + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>出借面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_lend_area" type="text" class="form-control" value="' + a[0].aLendArea + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>其他面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_other_area" type="text" class="form-control" value="' + a[0].aOtherArea + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>闲置面积：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_set_aside_area" type="text" class="form-control" value="' + a[0].aSetAsideArea + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>出借价值：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_lend_value" type="text" class="form-control" value="' + a[0].aLendValue + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>自用价值：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_own_value" type="text" class="form-control" value="' + a[0].aOwnValue + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>闲置价值：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_set_aside_value" type="text" class="form-control" value="' + a[0].aSetAsideValue + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>出租价值：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_hire_value" type="text" class="form-control" value="' + a[0].aHireValue + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>其他价值：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="a_other_value" type="text" class="form-control" value="' + a[0].aOtherValue + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备用字段：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input autocomplete="off" id="a_reserve_field" type="text" class="form-control" value="' + a[0].aReserveField + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备注：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input autocomplete="off" id="a_remarks" type="text" class="form-control" value="' + a[0].aRemarks + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>照片附件：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input autocomplete="off" id="uploadFile" type="file" value="' + a[0].aImgPath + '"/>' +
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
                            url: port + '/v1/land/deleteLand',
                            type: 'post',
                            data: {
                                ids: delData.toString()
                            },
                            success: function(data) {
                                console.log(data)
                                $("#tb_departments").bootstrapTable('refresh'); //刷新表格数据
                                // $('#tree').treeview({ 
                                //     data: getTree()
                                // });
                                layer.msg('删除成功');
                                $("#tb_departments").bootstrapTable('refresh');

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
                layer.msg('请选择要导出的数据');
            } else {
                //获取选中的选项
                for (var i = 0; i < a.length; i++) {
                    exportData[i] = a[i].id;
                }
                location.href = port + '/v1/land/exportLand?ids=' + exportData.toString();
            }
        });


    };
    return oInit;
};