var phongReg = /^[1][3,4,5,7,8][0-9]{9}$/; //手机号格式验证
var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证正则验证
var currentTreeId = ''; //当前点击树状id
var currentTreeText = ''; //当前点击树状text
var uploadFile;

// 获取选中的行数据
function getSelectData() {
    var data = $("#tb_departments").bootstrapTable('getSelections');
    return {
        type:'特种动植物',
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
    if ($('#org_name').val() == '' && $('#org_name').val() == '') {
        layer.msg('请输入资产名称');
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
            url: port + '/v1/specialType/selectSpecialTypePage',
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
                field: 'spName',
                align: 'center',
                title: '资产名称'
            }, {
                field: 'spType',
                align: 'center',
                title: '资产分类名称'
            }, {
                field: 'spCode',
                align: 'center',
                title: '资产编号'
            }, {
                field: 'spChargeDepart',
                align: 'center',
                title: '管理部门'
            }, {
                field: 'spGainType',
                align: 'center',
                title: '取得方式'
            }, {
                field: 'spGainDate',
                align: 'center',
                title: '取得日期'
            }, {
                field: 'spNumbers',
                align: 'center',
                title: '数量'
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
            spName: $('#org_name').val(), //姓名
            mark: "特种用途动物",
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
                ' <td>' + row.spName + '</td>' +
                ' <td>资产分类名称</td>' +
                ' <td>' + row.spType + '</td>' +
                ' </tr>' +
                '<tr>' +
                ' <td>存放地点</td>' +
                ' <td>' + row.spDepo + '</td>' +
                '<td>采购组织形式</td>' +
                ' <td>' + row.spBuyType + '</td>' +
                '</tr>' +
                '<tr>' +
                ' <td>预算项目编号</td>' +
                ' <td>' + row.spBudgetnum + '</td>' +
                ' <td>原资产编号</td>' +
                '  <td>' + row.spCode + '</td>' +
                ' </tr>' +
                '<tr>' +
                '  <td>取得方式</td>' +
                '<td>' + row.spGainType + '</td>' +
                ' <td>预计寿命/栽种树龄</td>' +
                ' <td>' + row.spLife + '</td>' +
                ' </tr>' +
                ' <tr>' +
                '     <td>取得日期</td>' +
                ' <td>' + row.spGainDate + '</td>' +
                '   <td>纲属科</td>' +
                '   <td>' + row.spSuperTaxa + '</td>' +
                '  </tr>' +
                '   <tr>' +
                '   <td>产地</td>' +
                '   <td>' + row.spPlaceOrigin + '</td>' +
                '    <td>出生/栽种年份</td>' +
                ' <td>' + row.spDateBirth + '</td>' +
                ' </tr>' +
                '  <tr>' +
                '    <td>入账形式</td> ' +
                '  <td>' + row.spEnterAccountType + '</td>' +
                '  <td>数量</td>' +
                ' <td>' + row.spNumbers + '</td>' +
                ' </tr>' +
                ' <tr>' +
                '   <td>价值（元）</td>' +
                ' <td>' + row.spValue + '</td>' +
                ' <td>价值类型：</td>' +
                '  <td>' + row.spValueType + '</td>' +
                '</tr>' +
                '  <tr>' +
                ' <td>财政拨款（元）</td>' +
                ' <td>' + row.spPubliceconomy + '</td>' +
                ' <td>非财政拨款（元）</td>' +
                ' <td>' + row.spNotPublicEconomy + '</td>' +
                ' </tr>' +
                '  <tr>' +
                '  <td>使用状况</td>' +
                '  <td>' + row.spUseState + '</td>' +
                '  <td>均价</td>' +
                '  <td>' + row.spAveragePrice + '</td>' +
                ' </tr>' +
                ' <tr>' +
                '  <td>投入使用日期</td>' +
                '  <td>' + row.spStartUseDate + '</td>' +
                ' <td>会计凭证号</td>' +
                ' <td>' + row.spAccountingDocumentNum + '</td>' +
                ' </tr>' +
                '  <tr>' +
                '  <td>使用部门</td>' +
                ' <td>' + row.spUseDepart + '</td>' +
                '  <td>财务入账日期</td>' +
                ' <td>' + row.spEnterAccountDate + '</td>' +
                ' </tr>' +
                ' <tr>' +
                ' <td>使用人</td>' +
                '  <td>' + row.spUsePerson + '</td>' +
                '  <td>管理部门</td>' +
                '  <td>' + row.spChargeDepart + '</td>' +
                '</tr>' +
                '<tr>' +
                '   <td>备用字段</td>' +
                '  <td>' + row.spReserveField + '</td>' +
                '   <td>备注</td>' +
                '   <td>' + row.spRemarks + '</td>' +
                ' </tr>' +
                ' <tr>' +
                '<td>照片附件</td>' +
                '  <td colspan="3"><img class="annex-img" src="' + port + "/" + row.spImgpath + '"></td>' +
                ' </tr>' +
                ' </table>' +
                ' </div>'

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
                    var spName = layero.find('#spName').val(); //工号
                    var spType = layero.find('#spType').val(); //工号
                    var spDepo = layero.find('#spDepo').val(); //工号
                    var spBuyType = layero.find('#spBuyType').val(); //工号
                    var spBudgetnum = layero.find('#spBudgetnum').val(); //工号
                    var spGainType = layero.find('#spGainType').val(); //工号
                    var spLife = layero.find('#spLife').val(); //工号
                    var spGainDate = layero.find('#spGainDate').val(); //工号
                    var spSuperTaxa = layero.find('#spSuperTaxa').val(); //工号
                    var spPlaceOrigin = layero.find('#spPlaceOrigin').val(); //工号
                    var spDateBirth = layero.find('#spDateBirth').val(); //工号
                    var spEnterAccountType = layero.find('#spEnterAccountType').val(); //工号
                    var spNumbers = layero.find('#spNumbers').val(); //工号
                    var spValue = layero.find('#spValue').val(); //工号
                    var spValueType = layero.find('#spValueType').val(); //工号
                    var spPubliceconomy = layero.find('#spPubliceconomy').val(); //工号
                    var spNotPublicEconomy = layero.find('#spNotPublicEconomy').val(); //工号
                    var spUseState = layero.find('#spUseState').val(); //工号
                    var spAveragePrice = layero.find('#spAveragePrice').val(); //工号
                    var spStartUseDate = layero.find('#spStartUseDate').val(); //工号
                    var spEnterAccountDate = layero.find('#spEnterAccountDate').val(); //工号
                    var spUseDepart = layero.find('#spUseDepart').val(); //工号
                    var spAccountingDocumentNum = layero.find('#spAccountingDocumentNum').val(); //工号
                    var spUsePerson = layero.find('#spUsePerson').val(); //工号
                    var spChargeDepart = layero.find('#spChargeDepart').val(); //工号
                    var spReserveField = layero.find('#spReserveField').val(); //工号
                    var spRemarks = layero.find('#spRemarks').val(); //工号
                    var spCode = layero.find('#spCode').val(); //工号

                    if (spName == '') {
                        parent.parent.layer.msg('请输入资产名称');
                        return;
                    }
                   
                    if (spGainDate == '') {
                        parent.parent.layer.msg('请选择取得日期');
                        return;
                    }
                    if (spNumbers == '') {
                        parent.parent.layer.msg('请输入数量');
                        return;
                    }
                  
                    if (spChargeDepart == '') {
                        parent.parent.layer.msg('请选择管理部门');
                        return;
                    }

                       if (spValue == '') {
                            parent.parent.layer.msg('请输入价值');
                            return;
                        }

                    $.ajax({
                        url: port + '/v1/specialType/insertSpecialType',
                        type: 'post',
                        data: {
                            spCode,
                            spCode,
                            spName: spName,
                            spType: spType,
                            spDepo: spDepo, //资产名称
                            spBuyType: spBuyType, //资产分类名称
                            spBudgetnum: spBudgetnum, //存放地点
                            spGainType: spGainType, //采购组织形式
                            spLife: spLife, //预算项目编号
                            spGainDate: spGainDate, //资产编号
                            spSuperTaxa: spSuperTaxa, //取得方式
                            spPlaceOrigin: spPlaceOrigin, //数量
                            spDateBirth: spDateBirth, //取得日期
                            spEnterAccountType: spEnterAccountType, //价值类型
                            spNumbers: spNumbers, //入账形式
                            spValue: spValue, //财政拨款
                            spValueType: spValueType, //非财政拨款
                            spPubliceconomy: spPubliceconomy, //价值
                            spNotPublicEconomy: spNotPublicEconomy, //均价
                            spUseState: spUseState,
                            spAveragePrice: spAveragePrice,
                            /**/
                            spStartUseDate: spStartUseDate,
                            spEnterAccountDate: spEnterAccountDate,
                            spUseDepart: spUseDepart, //保存年限
                            spAccountingDocumentNum: spAccountingDocumentNum, //管理部门
                            spUsePerson: spUsePerson, //使用部门
                            spChargeDepart: spChargeDepart, //使用人*/
                            spReserveField: spReserveField, //档案号
                            spRemarks: spRemarks, //出版社
                            mark: "特种用途动物",
                            spMark: "特种用途动物",
                            spImgpath: uploadFile, //照片附件 
                            pJobNum:localStorage.getItem('pJobnum')

                        },
                        success: function(res) {
                            if (res > 0) {
                                $("#tb_departments").bootstrapTable('refresh');
                                parent.parent.layer.msg('添加成功');
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
                    layero.find('#spChargeDepart').on('click', function() {
                        var options = {
                            bootstrap2: false,
                            showTags: true,
                            levels: 5,
                            checkedIcon: "glyphicon glyphicon-check",
                            data: getTree(),
                            onNodeSelected: function(event, data) {
                                console.log(data);
                                layero.find('#spChargeDepart').attr('value', data.text);
                                layero.find("#treeviews").hide();
                            }
                        };
                        layero.find('#treeviews').treeview(options);
                        layero.find('#treeviews').show();

                    });


                    // 使用部门
                    layero.find('#spUseDepart').on('click', function() {
                        var options = {
                            bootstrap2: false,
                            showTags: true,
                            levels: 5,
                            checkedIcon: "glyphicon glyphicon-check",
                            data: getTree(),
                            onNodeSelected: function(event, data) {
                                console.log(data);
                                layero.find('#spUseDepart').attr('value', data.text);
                                layero.find("#treeviews1").hide();
                            }
                        };
                        layero.find('#treeviews1').treeview(options);
                        layero.find('#treeviews1').show();

                    });



                    // 取得日期
                    parent.parent.laydate.render({
                        elem: '#spStartUseDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#spStartUseDate').attr('value', value);
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
                        elem: '#spEnterAccountDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#spEnterAccountDate').attr('value', value);
                        }
                    });

                    // 投入使用日期
                    parent.parent.laydate.render({
                        elem: '#spGainDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#spGainDate').attr('value', value);
                        }
                    });

                    // 保修截止日期
                    parent.parent.laydate.render({
                        elem: '#baoxiuDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#baoxiuDate').attr('value', value);
                        }
                    });

                    // 生成资产编号
                    $.ajax({
                        url: port + '/v1/specialType/createCode',
                        type: 'post',
                        success: function(res) {
                            console.log('资产编号：', res);
                            layero.find('#spCode').attr('value', res.msg);
                        }
                    });


                },
                btnAlign: 'c',
                content: '<div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>资产名称：</label></div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0" style="position: relative;">' +
                    '<input autocomplete="off" style="background-color: #fff;"  id="spName" type="text" class="form-control" value="">' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>资产分类名称：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly value="特种动植物" autocomplete="off" id="spType" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>存放地点：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="spDepo" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>采购组织形式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="spBuyType" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>预算项目编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="spBudgetnum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>资产编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" id="spCode" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>取得方式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" id="spGainType" type="text" class="form-control"  value="新购" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>预计寿命/栽种树龄：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="spLife" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>取得日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="spGainDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>纲属科：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="spSuperTaxa" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>产地：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="spPlaceOrigin" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>出生/栽种年份：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="spDateBirth" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>入账形式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="spEnterAccountType" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>数量：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="spNumbers" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>价值（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="spValue" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>价值类型：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<select class="form-control" id="spValueType">' +
                    '<option>原价</option>' +
                    '<option>暂估价</option>' +
                    '<option>重置价</option>' +
                    '<option>无价值</option>' +
                    '<option>评估值</option>' +
                    '<option>名义金额</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>财政拨款（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="spPubliceconomy" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>非财政拨款（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="spNotPublicEconomy" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用状况：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="spUseState" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>均价：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="spAveragePrice" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>投入使用日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="spStartUseDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>财务入账日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="spEnterAccountDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +

                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用部门：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" style="background-color: #fff;" readonly type="text" id="spUseDepart" class="form-control" value="">' +
                    '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews1">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>会计凭证号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="spAccountingDocumentNum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用人：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="spUsePerson" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>管理部门：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" style="background-color: #fff;" readonly type="text" id="spChargeDepart" class="form-control" value="">' +
                    '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>备用字段：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<input autocomplete="off" id="spReserveField" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>备注：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<input autocomplete="off" id="spRemarks" type="text" class="form-control" />' +
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

                        var spName = layero.find('#spName').val(); //工号
                        var spType = layero.find('#spType').val(); //工号
                        var spDepo = layero.find('#spDepo').val(); //工号
                        var spBuyType = layero.find('#spBuyType').val(); //工号
                        var spBudgetnum = layero.find('#spBudgetnum').val(); //工号
                        var spGainType = layero.find('#spGainType').val(); //工号
                        var spLife = layero.find('#spLife').val(); //工号
                        var spGainDate = layero.find('#spGainDate').val(); //工号
                        var spSuperTaxa = layero.find('#spSuperTaxa').val(); //工号
                        var spPlaceOrigin = layero.find('#spPlaceOrigin').val(); //工号
                        var spDateBirth = layero.find('#spDateBirth').val(); //工号
                        var spEnterAccountType = layero.find('#spEnterAccountType').val(); //工号
                        var spNumbers = layero.find('#spNumbers').val(); //工号
                        var spValue = layero.find('#spValue').val(); //工号
                        var spValueType = layero.find('#spValueType').val(); //工号
                        var spPubliceconomy = layero.find('#spPubliceconomy').val(); //工号
                        var spNotPublicEconomy = layero.find('#spNotPublicEconomy').val(); //工号
                        var spUseState = layero.find('#spUseState').val(); //工号
                        var spAveragePrice = layero.find('#spAveragePrice').val(); //工号
                        var spStartUseDate = layero.find('#spStartUseDate').val(); //工号
                        var spEnterAccountDate = layero.find('#spEnterAccountDate').val(); //工号
                        var spUseDepart = layero.find('#spUseDepart').val(); //工号
                        var spAccountingDocumentNum = layero.find('#spAccountingDocumentNum').val(); //工号
                        var spUsePerson = layero.find('#spUsePerson').val(); //工号
                        var spChargeDepart = layero.find('#spChargeDepart').val(); //工号
                        var spReserveField = layero.find('#spReserveField').val(); //工号
                        var spRemarks = layero.find('#spRemarks').val(); //工号
                        var spCode = layero.find('#spCode').val(); //工号


                        if (spName == '') {
                            parent.parent.layer.msg('请输入资产名称');
                            return;
                        }
                       
                        if (spGainDate == '') {
                            parent.parent.layer.msg('请选择取得日期');
                            return;
                        }
                        if (spNumbers == '') {
                            parent.parent.layer.msg('请输入数量');
                            return;
                        }
                      
                        if (spChargeDepart == '') {
                            parent.parent.layer.msg('请选择管理部门');
                            return;
                        }

                         if (spValue == '') {
                            parent.parent.layer.msg('请输入价值');
                            return;
                        }

                        $.ajax({
                            url: port + '/v1/specialType/updateSpecialType',
                            type: 'post',
                            data: {
                                id: a[0].id,
                                spCode: spCode,
                                spName: spName,
                                spType: spType,
                                spDepo: spDepo, //资产名称
                                spBuyType: spBuyType, //资产分类名称
                                spBudgetnum: spBudgetnum, //存放地点
                                spGainType: spGainType, //采购组织形式
                                spLife: spLife, //预算项目编号
                                spGainDate: spGainDate, //资产编号
                                spSuperTaxa: spSuperTaxa, //取得方式
                                spPlaceOrigin: spPlaceOrigin, //数量
                                spDateBirth: spDateBirth, //取得日期
                                spEnterAccountType: spEnterAccountType, //价值类型
                                spNumbers: spNumbers, //入账形式
                                spValue: spValue, //财政拨款
                                spValueType: spValueType, //非财政拨款
                                spPubliceconomy: spPubliceconomy, //价值
                                spNotPublicEconomy: spNotPublicEconomy, //均价
                                spUseState: spUseState,
                                spAveragePrice: spAveragePrice,
                                /**/
                                spStartUseDate: spStartUseDate,
                                spEnterAccountDate: spEnterAccountDate,
                                spUseDepart: spUseDepart, //保存年限
                                spAccountingDocumentNum: spAccountingDocumentNum, //管理部门
                                spUsePerson: spUsePerson, //使用部门
                                spChargeDepart: spChargeDepart, //使用人*/
                                spReserveField: spReserveField, //档案号
                                spRemarks: spRemarks, //出版社
                                mark: "特种用途动物",
                                spMark: "特种用途动物",
                                spImgpath: uploadFile, //照片附件 
                                pJobNum:localStorage.getItem('pJobnum')

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
                                url: port + "/v1/specialType/importSpecialTypeImg",
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
                        layero.find('#spChargeDepart').on('click', function() {
                            var options = {
                                bootstrap2: false,
                                showTags: true,
                                levels: 5,
                                checkedIcon: "glyphicon glyphicon-check",
                                data: getTree(),
                                onNodeSelected: function(event, data) {
                                    console.log(data);
                                    layero.find('#spChargeDepart').attr('value', data.text);
                                    layero.find("#treeviews").hide();
                                }
                            };
                            layero.find('#treeviews').treeview(options);
                            layero.find('#treeviews').show();

                        });


                        // 使用部门
                        layero.find('#spUseDepart').on('click', function() {
                            var options = {
                                bootstrap2: false,
                                showTags: true,
                                levels: 5,
                                checkedIcon: "glyphicon glyphicon-check",
                                data: getTree(),
                                onNodeSelected: function(event, data) {
                                    console.log(data);
                                    layero.find('#spUseDepart').attr('value', data.text);
                                    layero.find("#treeviews1").hide();
                                }
                            };
                            layero.find('#treeviews1').treeview(options);
                            layero.find('#treeviews1').show();

                        });



                        // 取得日期
                        parent.parent.laydate.render({
                            elem: '#spStartUseDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#spStartUseDate').attr('value', value);
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
                            elem: '#spEnterAccountDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#spEnterAccountDate').attr('value', value);
                            }
                        });

                        // 投入使用日期
                        parent.parent.laydate.render({
                            elem: '#spGainDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#spGainDate').attr('value', value);
                            }
                        });

                        // 保修截止日期
                        parent.parent.laydate.render({
                            elem: '#baoxiuDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#baoxiuDate').attr('value', value);
                            }
                        });

                        // 价值类型下拉框回显
                        layero.find('#spValueType option').each(function(index, item) {
                            if ($(item).val() == a[0].spValueType) {
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
                        '<input autocomplete="off" style="background-color: #fff;"  id="spName" type="text" class="form-control" value="' + a[0].spName + '" >' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产分类名称：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" id="spType" type="text" class="form-control"  value="特种动植物" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>存放地点：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="spDepo" type="text" class="form-control"  value="' + a[0].spDepo + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>采购组织形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="spBuyType" type="text" class="form-control" value="' + a[0].spBuyType + '"  />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>预算项目编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="spBudgetnum" type="text" class="form-control"  value="' + a[0].spBudgetnum + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" id="spCode" type="text" class="form-control"  value="' + a[0].spCode + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>取得方式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" id="spGainType" type="text" class="form-control"  value="新购" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>预计寿命/栽种树龄：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="spLife" type="text" class="form-control"  value="' + a[0].spLife + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>取得日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="spGainDate" type="text" class="form-control" value="' + a[0].spGainDate + '"  />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>纲属科：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="spSuperTaxa" type="text" class="form-control"  value="' + a[0].spSuperTaxa + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>产地：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="spPlaceOrigin" type="text" class="form-control" value="' + a[0].spPlaceOrigin + '"  />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>出生/栽种年份：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="spDateBirth" type="text" class="form-control" value="' + a[0].spDateBirth + '"  />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>入账形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="spEnterAccountType" type="text" class="form-control" value="' + a[0].spEnterAccountType + '"  />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>数量：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="spNumbers" type="text" class="form-control" value="' + a[0].spNumbers + '"  />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>价值（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="spValue" type="text" class="form-control" value="' + a[0].spValue + '"  />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>价值类型：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<select class="form-control" id="spValueType" value="' + a[0].spValueType + '">' +
                        '<option value="原价">原价</option>' +
                        '<option value="暂估价">暂估价</option>' +
                        '<option value="重置价">重置价</option>' +
                        '<option value="无价值">无价值</option>' +
                        '<option value="评估值">评估值</option>' +
                        '<option value="名义金额">名义金额</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财政拨款（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="spPubliceconomy" type="text" class="form-control" value="' + a[0].spPubliceconomy + '"  />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>非财政拨款（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="spNotPublicEconomy" type="text" class="form-control"  value="' + a[0].spNotPublicEconomy + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用状况：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="spUseState" type="text" class="form-control" value="' + a[0].spUseState + '"  />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>均价：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="spAveragePrice" type="text" class="form-control" value="' + a[0].spAveragePrice + '"  />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>投入使用日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="spStartUseDate" type="text" class="form-control" value="' + a[0].spStartUseDate + '"  />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财务入账日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="spEnterAccountDate" type="text" class="form-control" value="' + a[0].spEnterAccountDate + '"  />' +
                        '</div>' +
                        '</div>' +

                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用部门：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" style="background-color: #fff;" readonly type="text" id="spUseDepart" class="form-control" value="' + a[0].spUseDepart + '" >' +
                        '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews1">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>会计凭证号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="spAccountingDocumentNum" type="text" class="form-control" value="' + a[0].spAccountingDocumentNum + '"  />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用人：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="spUsePerson" type="text" class="form-control" value="' + a[0].spUsePerson + '"  />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>管理部门：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" style="background-color: #fff;" readonly type="text" id="spChargeDepart" class="form-control" value="' + a[0].spChargeDepart + '" >' +
                        '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备用字段：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input autocomplete="off" id="spReserveField" type="text" class="form-control" value="' + a[0].spReserveField + '"  />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备注：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input autocomplete="off" id="spRemarks" type="text" class="form-control" value="' + a[0].spRemarks + '"  />' +
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
                            url: port + '/v1/specialType/deleteSpecialType',
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
                console.log('导出所有');
                layer.msg("请选择要导出的数据");
                return;
            } else {
                //获取选中的选项
                for (var i = 0; i < a.length; i++) {
                    exportData[i] = a[i].id;
                }
                location.href = port + '/v1/specialType/exportSpecialType?ids=' + exportData.toString() + "&mark=" + "特种用途动物";
            }
        });


    };
    return oInit;
};