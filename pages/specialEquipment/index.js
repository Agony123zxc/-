var phongReg = /^[1][3,4,5,7,8][0-9]{9}$/; //手机号格式验证
var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/; //身份证正则验证
var currentTreeId = ''; //当前点击树状id
var currentTreeText = ''; //当前点击树状text
var uploadFile;


// 获取选中的行数据
function getSelectData() {
    var data = $("#tb_departments").bootstrapTable('getSelections');
    return {
        type:'专用设备',
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
            url: port + '/v1/onlyfacility/selectOnlyfacilityPage',
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
                field: 'onName',
                align: 'center',
                title: '资产名称'
            }, {
                field: 'onType',
                align: 'center',
                title: '资产分类名称'
            }, {
                field: 'onCode',
                align: 'center',
                title: '资产编号'
            }, {
                field: 'onChargeDepart',
                align: 'center',
                title: '管理部门'
            }, {
                field: 'onGainType',
                align: 'center',
                title: '取得方式'
            }, {
                field: 'onGainDate',
                align: 'center',
                title: '取得日期'
            }, {
                field: 'onRemarks',
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
            aName: $('#org_name').val(), //资产名称
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
                ' <table>' +
                ' <tr>' +
                ' <td>资产名称</td>' +
                ' <td>' + row.onName + '</td>' +
                '  <td>资产分类名称</td>' +
                ' <td>' + row.onType + '</td>' +
                ' </tr>' +
                '  <tr>' +
                '  <td>存放地点</td>' +
                ' <td>' + row.onDepo + '</td>' +
                '<td>采购组织形式</td>' +
                '<td>' + row.onBuyType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>预算项目编号</td>' +
                ' <td>' + row.onBudgetnum + '</td>' +
                '<td>资产编号</td>' +
                '<td>' + row.onCode + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>取得方式</td>' +
                '<td>' + row.onGainType + '</td>' +
                '<td>品牌</td>' +
                ' <td>' + row.onBrand + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>取得日期</td>' +
                '<td>' + row.onGainDate + '</td>' +
                '<td>数量</td>' +
                '<td>' + row.onNumbers + '</td>' +
                ' </tr>' +
                ' <td>生产厂家</td>' +
                '<td>' + row.onFactory + '</td>' +
                ' <td>规格型号</td>' +
                ' <td>' + row.onSpecs + '</td>' +
                '</tr>' +
                '<tr>' +
                ' <td>产品序列号</td>' +
                '<td>' + row.onProductnum + '</td>' +
                '<td>销售商</td>' +
                '<td>' + row.onDealer + '</td>' +
                '</tr>' +
                '<tr>' +
                ' <td>合同编号</td>' +
                '<td>' + row.onContract + '</td>' +
                '<td>发票号</td>' +
                ' <td>' + row.onBillnum + '</td>' +
                '</tr>' +
                '<tr>' +
                ' <td>入账形式</td>' +
                '<td>' + row.onEnterAccountType + '</td>' +
                ' <td>保修截止日期</td>' +
                ' <td>' + row.onGuaranteedEndDate + '</td>' +
                '</tr>' +
                ' <tr>' +
                '  <td>价值（元）</td>' +
                '<td>' + row.onValue + '</td>' +
                ' <td>财政拨款（元）</td>' +
                ' <td>' + row.onPublicEconomy + '</td>' +
                ' </tr>' +
                ' <tr>' +
                '  <td>非财政拨款（元）：</td>' +
                ' <td>' + row.onNotPublicEconomy + '</td>' +
                '  <td>使用状况</td>' +
                ' <td>' + row.onUseStete + '</td>' +
                '</tr>' +
                '<tr>' +
                '  <td>投入使用日期</td>' +
                ' <td>' + row.onStartUseDate + '</td>' +
                '<td>财务入账日期</td>' +
                '  <td>' + row.onEnterAccountDate + '</td>' +
                '</tr>' +
                ' <tr>' +
                '  <td>使用部门</td>' +
                ' <td>' + row.onUseDepart + '</td>' +
                ' <td>管理部门</td>' +
                ' <td>' + row.onChargeDepart + '</td>' +
                ' </tr>' +
                ' <tr>' +
                '    <td>使用人</td>' +
                '  <td>' + row.onUsePerson + '</td>' +
                '  <td>设备用途</td>' +
                '  <td>' + row.onDeviceUse + '</td>' +
                '</tr>' +
                ' <tr>' +
                '  <td>折旧状态</td>' +
                '  <td>' + row.onDepreciatedState + '</td>' +
                ' <td>折旧方法</td>' +
                ' <td>' + row.onDepreciatedMethod + '</td>' +
                ' </tr>' +
                ' <tr>' +
                ' <td>月折旧额</td>' +
                ' <td>' + row.onDepreciatedOneMonthMoney + '</td>' +
                '  <td>折旧年限（月）</td>' +
                '  <td>' + row.onDepreciatedYears + '</td>' +
                '</tr>' +
                '  <tr>' +
                '  <td>已提折旧月数</td>' +
                '  <td>' + row.onDepreciatedMonthNumbers + '</td>' +
                ' <td>累计折旧</td>' +
                ' <td>' + row.onAddupDepreciated + '</td>' +
                '</tr>' +
                ' <tr>' +
                '  <td>备用字段</td>' +
                '  <td>' + row.onReserveField + '</td>' +
                ' <td>备注</td>' +
                ' <td>' + row.onRemarks + '</td>' +
                ' </tr>' +
                ' <tr>' +
                ' <td>照片附件</td>' +
                ' <td colspan="3"><img class="annex-img" src="' + port + "/" + row.onImgpath + '"></td>' +
                ' </tr>' +
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


                    var onName = layero.find('#onName').val();
                    var onType = layero.find('#onType').val();
                    var onDepo = layero.find('#onDepo').val();
                    var onBuyType = layero.find('#onBuyType').val();
                    var onBudgetnum = layero.find('#onBudgetnum').val();
                    var onCode = layero.find('#onCode').val();
                    var onGainType = layero.find('#onGainType').val(); //下拉
                    var onBrand = layero.find('#onBrand').val();
                    var onGainDate = layero.find('#onGainDate').val(); //取得日期
                    var onNumbers = layero.find('#onNumbers').val();
                    var onFactory = layero.find('#onFactory').val();
                    var onSpecs = layero.find('#onSpecs').val();
                    var onProductnum = layero.find('#onProductnum').val();
                    var onDealer = layero.find('#onDealer').val();
                    var onContract = layero.find('#onContract').val();
                    var onBillnum = layero.find('#onBillnum').val();
                    var onEnterAccountType = layero.find('#onEnterAccountType').val();
                    var onGuaranteedEndDate = layero.find('#onGuaranteedEndDate').val();
                    var onValueType = layero.find('#onValueType').val();
                    var onValue = layero.find('#onValue').val();
                    var onPublicEconomy = layero.find('#onPublicEconomy').val();
                    var onNotPublicEconomy = layero.find('#onNotPublicEconomy').val();
                    var onUseStete = layero.find('#onUseStete').val();
                    var onAccountingDocumentNum = layero.find('#onAccountingDocumentNum').val();
                    var onEnterAccountDate = layero.find('#onEnterAccountDate').val();
                    var onStartUseDate = layero.find('#onStartUseDate').val();
                    var onUseDepart = layero.find('#onUseDepart').val();
                    var onChargeDepart = layero.find('#onChargeDepart').val();
                    var onDeviceUse = layero.find('#onDeviceUse').val();
                    var onUsePerson = layero.find('#onUsePerson').val();
                    var onDepreciatedState = layero.find('#onDepreciatedState').val();
                    var onDepreciatedMethod = layero.find('#onDepreciatedMethod').val();
                    var onDepreciatedMonthNumbers = layero.find('#onDepreciatedMonthNumbers').val();
                    var onDepreciatedOneMonthMoney = layero.find('#onDepreciatedOneMonthMoney').val();
                    var onDepreciatedMonthNumbers = layero.find('#onDepreciatedMonthNumbers').val();
                    var onAddupDepreciated = layero.find('#onAddupDepreciated').val();
                    var onReserveField = layero.find('#onReserveField').val();
                    var onRemarks = layero.find('#onRemarks').val();
                    var onDepreciatedYears = layero.find('#onDepreciatedYears').val();





                    if (onName == '') {
                        parent.parent.layer.msg('清输入资产名称');
                        return;
                    }

                    if (onGainDate == '') {
                        parent.parent.layer.msg('清选择取得日期');
                        return;
                    }
                    if (onNumbers == '') {
                        parent.parent.layer.msg('清输入数量');
                        return;
                    }

                    if (onChargeDepart == '') {
                        parent.parent.layer.msg('清选择管理部门');
                        return;
                    }

                     if (onValue == '') {
                        parent.parent.layer.msg('清输入价值');
                        return;
                    }

                    $.ajax({
                        url: port + '/v1/onlyfacility/insertOnlyfacility',
                        type: 'post',
                        data: {
                            onName: onName, //资产名称
                            onType: onType, //资产分类名称
                            onDepo: onDepo, //存放地点
                            onBuyType: onBuyType, //采购组织形式
                            onBudgetnum: onBudgetnum, //预算项目编号
                            onCode: onCode, //资产编号
                            onGainType: onGainType, //取得方式
                            onBrand: onBrand, //数量
                            onGainDate: onGainDate, //取得日期
                            onNumbers: onNumbers, //价值类型
                            onFactory: onFactory, //入账形式
                            onSpecs: onSpecs, //财政拨款
                            onProductnum: onProductnum, //非财政拨款
                            onDealer: onDealer, //价值
                            onContract: onContract, //均价
                            onEnterAccountType: onEnterAccountType,
                            onBillnum: onBillnum,
                            /**/
                            onValue: onValue,
                            onGuaranteedEndDate: onGuaranteedEndDate,
                            onPublicEconomy: onPublicEconomy, //保存年限
                            onValueType: onValueType, //管理部门
                            onUseStete: onUseStete, //使用部门
                            onNotPublicEconomy: onNotPublicEconomy, //使用人*/
                            onStartUseDate: onStartUseDate, //档案号
                            onAccountingDocumentNum: onAccountingDocumentNum, //出版社
                            onUseDepart: onUseDepart, //出版日期
                            onEnterAccountDate: onEnterAccountDate, //备用字段
                            onUsePerson: onUsePerson, //备注
                            onChargeDepart: onChargeDepart, //备注
                            onDepreciatedState: onDepreciatedState, //备注
                            onDeviceUse: onDeviceUse, //备注
                            onDepreciatedOneMonthMoney: onDepreciatedOneMonthMoney, //备注
                            onDepreciatedMethod: onDepreciatedMethod, //备注
                            onDepreciatedMonthNumbers: onDepreciatedMonthNumbers, //备注
                            onDepreciatedYears: onDepreciatedYears, //备注
                            onAddupDepreciated: onAddupDepreciated, //备注
                            onRemarks: onRemarks, //备注
                            onReserveField: onReserveField, //备注
                            onAddupDepreciated: onAddupDepreciated,
                            onImgpath: uploadFile, //照片附件 
                            pJobNum:localStorage.getItem('pJobnum')
                        },
                        success: function(res) {
                            if (res > 0) {
                                $("#tb_departments").bootstrapTable('refresh');
                                parent.parent.layer.msg('已添加');
                                parent.parent.layer.close(index);
                            }
                        }
                    })


                },

                success: function(layero, index) {


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

                    layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                    layero.find('input[readonly]').css('background', '#fff');
                    // 管理部门
                    layero.find('#onChargeDepart').on('click', function() {
                        var options = {
                            bootstrap2: false,
                            showTags: true,
                            levels: 5,
                            checkedIcon: "glyphicon glyphicon-check",
                            data: getTree(),
                            onNodeSelected: function(event, data) {
                                console.log(data);
                                layero.find('#onChargeDepart').attr('value', data.text);
                                layero.find("#treeviews").hide();
                            }
                        };
                        layero.find('#treeviews').treeview(options);
                        layero.find('#treeviews').show();

                    });


                    // 使用部门
                    layero.find('#onUseDepart').on('click', function() {
                        var options = {
                            bootstrap2: false,
                            showTags: true,
                            levels: 5,
                            checkedIcon: "glyphicon glyphicon-check",
                            data: getTree(),
                            onNodeSelected: function(event, data) {
                                console.log(data);
                                layero.find('#onUseDepart').attr('value', data.text);
                                layero.find("#treeviews1").hide();
                            }
                        };
                        layero.find('#treeviews1').treeview(options);
                        layero.find('#treeviews1').show();

                    });



                    // 取得日期
                    parent.parent.laydate.render({
                        elem: '#onGainDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#onGainDate').attr('value', value);
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

                    // 取得日期
                    parent.parent.laydate.render({
                        elem: '#onGainDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#onGainDate').attr('value', value);
                        }
                    });
                    // 取得日期
                    parent.parent.laydate.render({
                        elem: '#onGuaranteedEndDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#onGuaranteedEndDate').attr('value', value);
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
                        elem: '#onEnterAccountDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#onEnterAccountDate').attr('value', value);
                        }
                    });

                    // 投入使用日期
                    parent.parent.laydate.render({
                        elem: '#onStartUseDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#onStartUseDate').attr('value', value);
                        }
                    });

                    // 投入使用日期
                    parent.parent.laydate.render({
                        elem: '#baoxiuDate',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#baoxiuDate').attr('value', value);
                        }
                    });

                    // 生成资产编号
                    $.ajax({
                        url: port + '/v1/onlyfacility/createCode',
                        type: 'post',
                        success: function(res) {
                            console.log('资产编号：', res);
                            layero.find('#onCode').attr('value', res.msg);
                        }
                    });


                },
                btnAlign: 'c',
                content: '<div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>资产名称：</label></div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0" style="position: relative;">' +
                    '<input autocomplete="off" id="onName" style="background-color: #fff;" type="text" class="form-control" value="">' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>资产分类名称：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly value="专用设备" autocomplete="off" id="onType" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>存放地点：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onDepo" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>采购组织形式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onBuyType" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>预算项目编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onBudgetnum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>资产编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" id="onCode" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>取得方式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" id="onGainType" type="text" class="form-control" value="新购" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>品牌：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onBrand" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>取得日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="onGainDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>数量：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onNumbers" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>生产厂家：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onFactory" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>规格型号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onSpecs" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>产品序列号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onProductnum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>销售商：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onDealer" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>合同编号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onContract" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>发票号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onBillnum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>入账形式：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onEnterAccountType" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>保修截止日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" readonly id="onGuaranteedEndDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>价值（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onValue" type="number" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>价值类型：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<select class="form-control" id="onValueType">' +
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
                    '<input autocomplete="off"  id="onPublicEconomy" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>非财政拨款（元）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onNotPublicEconomy" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +

                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用状况：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onUseStete" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>会计凭证号：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onAccountingDocumentNum" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>财务入账日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off"  readonly id="onEnterAccountDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>投入使用日期：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onStartUseDate" readonly id="useDate" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用部门：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" style="background-color: #fff;" readonly type="text" id="onUseDepart" class="form-control" value="">' +
                    '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews1">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>管理部门：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" style="background-color: #fff;" readonly type="text" id="onChargeDepart" class="form-control" value="">' +
                    '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +

                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>设备用途：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onDeviceUse" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>使用人：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onUsePerson" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>折旧状态：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<select class="form-control" name="" id="onDepreciatedState">' +
                    '<option value="">提折旧</option>' +
                    '<option value="">不提折旧</option>' +
                    '<option value="">已完成折旧</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>折旧方法：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<select class="form-control" name="" id="onDepreciatedMethod">' +
                    '<option value="">提折旧</option>' +
                    '<option value="">不提折旧</option>' +
                    '<option value="">已完成折旧</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>折旧年限（月）：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onDepreciatedYears" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>月折旧额：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onDepreciatedOneMonthMoney" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>已提折旧月数：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onDepreciatedMonthNumbers" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>累计折旧：</label>' +
                    '</div>' +
                    '<div class="col-md-7" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="onAddupDepreciated" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>备用字段：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<input autocomplete="off" id="onReserveField" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                    '<label>备注：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                    '<input autocomplete="off" id="onRemarks" type="text" class="form-control" />' +
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


                        var onName = layero.find('#onName').val();
                        var onType = layero.find('#onType').val();
                        var onDepo = layero.find('#onDepo').val();
                        var onBuyType = layero.find('#onBuyType').val();
                        var onBudgetnum = layero.find('#onBudgetnum').val();
                        var onCode = layero.find('#onCode').val();
                        var onGainType = layero.find('#onGainType').val(); //下拉
                        var onBrand = layero.find('#onBrand').val();
                        var onGainDate = layero.find('#onGainDate').val(); //取得日期
                        var onNumbers = layero.find('#onNumbers').val();
                        var onFactory = layero.find('#onFactory').val();
                        var onSpecs = layero.find('#onSpecs').val();
                        var onProductnum = layero.find('#onProductnum').val();
                        var onDealer = layero.find('#onDealer').val();
                        var onContract = layero.find('#onContract').val();
                        var onBillnum = layero.find('#onBillnum').val();
                        var onEnterAccountType = layero.find('#onEnterAccountType').val();
                        var onGuaranteedEndDate = layero.find('#onGuaranteedEndDate').val();
                        var onValueType = layero.find('#onValueType').val();
                        var onValue = layero.find('#onValue').val();
                        var onPublicEconomy = layero.find('#onPublicEconomy').val();
                        var onNotPublicEconomy = layero.find('#onNotPublicEconomy').val();
                        var onUseStete = layero.find('#onUseStete').val();
                        var onAccountingDocumentNum = layero.find('#onAccountingDocumentNum').val();
                        var onEnterAccountDate = layero.find('#onEnterAccountDate').val();
                        var onStartUseDate = layero.find('#onStartUseDate').val();
                        var onUseDepart = layero.find('#onUseDepart').val();
                        var onChargeDepart = layero.find('#onChargeDepart').val();
                        var onDeviceUse = layero.find('#onDeviceUse').val();
                        var onUsePerson = layero.find('#onUsePerson').val();
                        var onDepreciatedState = layero.find('#onDepreciatedState').val();
                        var onDepreciatedMethod = layero.find('#onDepreciatedMethod').val();
                        var onDepreciatedMonthNumbers = layero.find('#onDepreciatedMonthNumbers').val();
                        var onDepreciatedOneMonthMoney = layero.find('#onDepreciatedOneMonthMoney').val();
                        var onDepreciatedMonthNumbers = layero.find('#onDepreciatedMonthNumbers').val();
                        var onAddupDepreciated = layero.find('#onAddupDepreciated').val();
                        var onReserveField = layero.find('#onReserveField').val();
                        var onRemarks = layero.find('#onRemarks').val();
                        var onDepreciatedYears = layero.find('#onDepreciatedYears').val();

                        if (onName == '') {
                            parent.parent.layer.msg('清输入资产名称');
                            return;
                        }


                        if (onGainDate == '') {
                            parent.parent.layer.msg('清选择取得日期');
                            return;
                        }
                        if (onNumbers == '') {
                            parent.parent.layer.msg('清输入数量');
                            return;
                        }

                        if (onValue == '') {
                            parent.parent.layer.msg('清输入价值');
                            return;

                        }

                      

                        if (onChargeDepart == '') {
                            parent.parent.layer.msg('清选择管理部门');
                            return;

                        }

                        $.ajax({
                            url: port + '/v1/onlyfacility/updateOnlyfacility',
                            type: 'post',
                            data: {
                                id: a[0].id,
                                onName: onName, //资产名称
                                onType: onType, //资产分类名称
                                onDepo: onDepo, //存放地点
                                onBuyType: onBuyType, //采购组织形式
                                onBudgetnum: onBudgetnum, //预算项目编号
                                onCode: onCode, //资产编号
                                onGainType: onGainType, //取得方式
                                onBrand: onBrand, //数量
                                onGainDate: onGainDate, //取得日期
                                onNumbers: onNumbers, //价值类型
                                onFactory: onFactory, //入账形式
                                onSpecs: onSpecs, //财政拨款
                                onProductnum: onProductnum, //非财政拨款
                                onDealer: onDealer, //价值
                                onContract: onContract, //均价
                                onEnterAccountType: onEnterAccountType,
                                onBillnum: onBillnum,
                                /**/
                                onValue: onValue,
                                onGuaranteedEndDate: onGuaranteedEndDate,
                                onPublicEconomy: onPublicEconomy, //保存年限
                                onValueType: onValueType, //管理部门
                                onUseStete: onUseStete, //使用部门
                                onNotPublicEconomy: onNotPublicEconomy, //使用人*/
                                onStartUseDate: onStartUseDate, //档案号
                                onAccountingDocumentNum: onAccountingDocumentNum, //出版社
                                onUseDepart: onUseDepart, //出版日期
                                onEnterAccountDate: onEnterAccountDate, //备用字段
                                onUsePerson: onUsePerson, //备注
                                onChargeDepart: onChargeDepart, //备注
                                onDepreciatedState: onDepreciatedState, //备注
                                onDeviceUse: onDeviceUse, //备注
                                onDepreciatedOneMonthMoney: onDepreciatedOneMonthMoney, //备注
                                onDepreciatedMethod: onDepreciatedMethod, //备注
                                onDepreciatedMonthNumbers: onDepreciatedMonthNumbers, //备注
                                onDepreciatedYears: onDepreciatedYears, //备注
                                onAddupDepreciated: onAddupDepreciated, //备注
                                onRemarks: onRemarks, //备注
                                onReserveField: onReserveField, //备注
                                onAddupDepreciated: onAddupDepreciated,
                                onImgpath: uploadFile, //照片附件 
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
                        layero.find('#onChargeDepart').on('click', function() {
                            var options = {
                                bootstrap2: false,
                                showTags: true,
                                levels: 5,
                                checkedIcon: "glyphicon glyphicon-check",
                                data: getTree(),
                                onNodeSelected: function(event, data) {
                                    console.log(data);
                                    layero.find('#onChargeDepart').attr('value', data.text);
                                    layero.find("#treeviews").hide();
                                }
                            };
                            layero.find('#treeviews').treeview(options);
                            layero.find('#treeviews').show();

                        });


                        // 使用部门
                        layero.find('#onUseDepart').on('click', function() {
                            var options = {
                                bootstrap2: false,
                                showTags: true,
                                levels: 5,
                                checkedIcon: "glyphicon glyphicon-check",
                                data: getTree(),
                                onNodeSelected: function(event, data) {
                                    console.log(data);
                                    layero.find('#onUseDepart').attr('value', data.text);
                                    layero.find("#treeviews1").hide();
                                }
                            };
                            layero.find('#treeviews1').treeview(options);
                            layero.find('#treeviews1').show();

                        });



                        // 取得日期
                        parent.parent.laydate.render({
                            elem: '#onGainDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#onGainDate').attr('value', value);
                            }
                        });
                        // 取得日期
                        parent.parent.laydate.render({
                            elem: '#onGuaranteedEndDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#onGuaranteedEndDate').attr('value', value);
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
                            elem: '#onEnterAccountDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#onEnterAccountDate').attr('value', value);
                            }
                        });

                        // 投入使用日期
                        parent.parent.laydate.render({
                            elem: '#onStartUseDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#onStartUseDate').attr('value', value);
                            }
                        });

                        // 投入使用日期
                        parent.parent.laydate.render({
                            elem: '#baoxiuDate',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#baoxiuDate').attr('value', value);
                            }
                        });



                        // 价值类型下拉框回显
                        layero.find('#onValueType option').each(function(index, item) {
                            if (a[0].onValueType == $(item).text()) {
                                $(item).attr('selected', true);
                            }
                        });
                        // 折旧状态下拉框回显
                        layero.find('#onDepreciatedState option').each(function(index, item) {
                            if (a[0].onDepreciatedState == $(item).text()) {
                                $(item).attr('selected', true);
                            }
                        });
                        // 折旧方法下拉框回显
                        layero.find('#onDepreciatedMethod option').each(function(index, item) {
                            if (a[0].onDepreciatedMethod == $(item).text()) {
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
                        '<input autocomplete="off" style="background-color: #fff;" type="text" id="onName"  class="form-control" value="' + a[0].onName + '">' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产分类名称：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onType" type="text" class="form-control"  value="专用设备"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>存放地点：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onDepo" type="text" class="form-control" value="' + a[0].onDepo + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>采购组织形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onBuyType" type="text" class="form-control"  value="' + a[0].onBuyType + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>预算项目编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onBudgetnum" type="text" class="form-control"  value="' + a[0].onBudgetnum + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>资产编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" id="onCode" type="text" class="form-control" value="' + a[0].onCode + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>取得方式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" id="onGainType" type="text" class="form-control" value="新购" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>品牌：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onBrand" type="text" class="form-control"  value="' + a[0].onBrand + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>取得日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="onGainDate" type="text" class="form-control" value="' + a[0].onGainDate + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>数量：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onNumbers" type="text" class="form-control"  value="' + a[0].onNumbers + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>生产厂家：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onFactory" type="text" class="form-control"  value="' + a[0].onFactory + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>规格型号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onSpecs" type="text" class="form-control" value="' + a[0].onSpecs + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>产品序列号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onProductnum" type="text" class="form-control"  value="' + a[0].onProductnum + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>销售商：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onDealer" type="text" class="form-control"  value="' + a[0].onDealer + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>合同编号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onContract" type="text" class="form-control"  value="' + a[0].onContract + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>发票号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onBillnum" type="text" class="form-control" value="' + a[0].onBillnum + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>入账形式：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onEnterAccountType" type="text" class="form-control"  value="' + a[0].onEnterAccountType + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>保修截止日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="onGuaranteedEndDate" type="text" class="form-control" value="' + a[0].onGuaranteedEndDate + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>价值（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onValue" type="number" class="form-control"  value="' + a[0].onValue + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>价值类型：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<select class="form-control" id="onValueType" >' +
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
                        '<input autocomplete="off"   id="onPublicEconomy" type="text" class="form-control" value="' + a[0].onPublicEconomy + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>非财政拨款（元）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" type="text" id="onNotPublicEconomy" class="form-control"  value="' + a[0].onNotPublicEconomy + '"/>' +
                        '</div>' +
                        '</div>' +

                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用状况：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" type="text" id="onUseStete" class="form-control" value="' + a[0].onUseStete + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>会计凭证号：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" type="text" id="onAccountingDocumentNum" class="form-control" value="' + a[0].onAccountingDocumentNum + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>财务入账日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="onEnterAccountDate" type="text" class="form-control"  value="' + a[0].onEnterAccountDate + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>投入使用日期：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" readonly id="onStartUseDate" type="text" class="form-control" value="' + a[0].onStartUseDate + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用部门：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onUseDepart" style="background-color: #fff;" readonly type="text"  class="form-control" value="' + a[0].onUseDepart + '">' +
                        '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews1">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>管理部门：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onChargeDepart" style="background-color: #fff;" readonly type="text"  class="form-control" value="' + a[0].onChargeDepart + '">' +
                        '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +

                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>设备用途：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onDeviceUse" type="text" class="form-control" value="' + a[0].onDeviceUse + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>使用人：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onUsePerson" type="text" class="form-control" value="' + a[0].onUsePerson + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>折旧状态：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<select class="form-control"  id="onDepreciatedState">' +
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
                        '<select class="form-control" name="" id="onDepreciatedMethod" >' +
                        '<option>固定金额法</option>' +
                        '<option>平均年限法</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>折旧年限（月）：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onDepreciatedYears" type="text" class="form-control"  value="' + a[0].onDepreciatedYears + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>月折旧额：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onDepreciatedOneMonthMoney" type="text" class="form-control"  value="' + a[0].onDepreciatedOneMonthMoney + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>已提折旧月数：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onDepreciatedMonthNumbers" type="text" class="form-control"  value="' + a[0].onDepreciatedMonthNumbers + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-5" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>累计折旧：</label>' +
                        '</div>' +
                        '<div class="col-md-7" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="onAddupDepreciated" type="text" class="form-control" value="' + a[0].onAddupDepreciated + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备用字段：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input autocomplete="off" type="text" id="onReserveField" class="form-control"  value="' + a[0].onReserveField + '"/>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;width:20.7%;">' +
                        '<label>备注：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;width:79.3%;">' +
                        '<input autocomplete="off" type="text" id="onRemarks" class="form-control" value="' + a[0].onRemarks + '" />' +
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
                            url: port + '/v1/onlyfacility/deleteOnlyfacility',
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

            // location.href = port + '/v1/onlyfacility/exportOnlyfacility';

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
                location.href = port + '/v1/onlyfacility/exportOnlyfacility?ids=' + exportData.toString();
            }
        });


    };
    return oInit;
};