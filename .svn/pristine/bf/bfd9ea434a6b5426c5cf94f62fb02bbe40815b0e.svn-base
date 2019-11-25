var uploadFile; //上传附件


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
    $("#tb_departments").bootstrapTable('refresh');
}
//重置
function resetBtn() {
    $('#scrapNum').val('');
    $('#applyPerson').val('');
    $('#applyDepart').val('');
    $("#tb_departments").bootstrapTable('refresh');
}

// 树状菜单
function getTree() {
    var tree = "";
    $.ajax({
        url: 'tree.json',
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
            url: port + '/v1/assetsScrap/selectPageScrap',
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
            // height: $(window).height(), //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "areaId", //每一行的唯一标识，一般为主键列
            showToggle: false, //是否显示详细视图和列表视图的切换按钮
            cardView: false, //是否显示详细视图
            detailView: false, //是否显示父子表
            columns: [{
                    checkbox: true
                }, {
                    field: 'scrapno',
                    align: 'center',
                    title: '报废单号'
                }, {
                    field: 'scrapdate',
                    align: 'center',
                    title: '报废日期',
                    formatter: function(value, row, index) {
                        return changeDateFormat(value)
                    }

                }, {
                    field: 'applypersonname',
                    align: 'center',
                    title: '申请人'
                }, {
                    field: 'applydeptname',
                    align: 'center',
                    title: '申请部门'
                },
                /*{
                                   field: 'applyreason',
                                   align: 'center',
                                   title: '报废原因'
                               },*/
                {
                    field: 'state',
                    align: 'center',
                    title: '状态'
                }, {
                    field: 'name6',
                    align: 'center',
                    title: '操作',
                    events: operateEvents,
                    formatter: function(value, row, index) {
                        var result = "<a href='javascript:;' class='info' style='color:#1E9DD3'>查看</a>";
                        return result;
                    }
                }
            ],

            //查询的参数
            queryParams: function(params) {
                var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    pageSize: params.limit, //页面大小
                    pageNum: (params.offset / params.limit) + 1, //页码
                    pJobNum: localStorage.getItem('pJobnum'),
                    scrapNo: $('#scrapNum').val(), //报废单号
                    applyPersonName: $('#applyPerson').val(), //申请人
                    applyDeptName: $('#applyDepart').val(), //申请部门
                    mark: '报废单管理'
                };
                return temp;
            },

            onLoadSuccess: function(data) {
                console.log('成功加载表格数据', data);
                if ($(window).height() <= 650) {
                    $('.fixed-table-container').css({ 'height': $(window).height() - 300 + 'px' });
                    $('.panel-body').css({ 'height': $(window).height() + 'px' });
                } else {
                    $('.fixed-table-container').css({ 'height': $(window).height() - 200 + 'px' });
                    $('.panel-body').css({ 'height': $(window).height() + 'px' });
                }
            },
            onLoadError: function() {
                if ($(window).height() <= 650) {
                    $('.fixed-table-container').css({ 'height': $(window).height() - 300 + 'px' });
                    $('.panel-body').css({ 'height': $(window).height() + 'px' });
                } else {
                    $('.fixed-table-container').css({ 'height': $(window).height() - 200 + 'px' });
                    $('.panel-body').css({ 'height': $(window).height() + 'px' });
                }
            },
            onClickRow: function(row, $element) {}
        });
    };

    return oTableInit;
};


// 点击当前行数据详情事件
window.operateEvents = {
    'click .info': function(e, value, row, index) {
        console.log(row);
        sessionStorage.setItem('checkId', row.id);
        layer.open({
            type: 2,
            title: '详情',
            btn: '关闭',
            btnAlign: 'c',
            area: ['860px', '520px'],
            success: function(layero, index) {
                layero.find('.layui-layer-btn0').css({ background: '#fff', color: '#333', borderColor: '#ddd', padding: '0 20px' });
                var body = layer.getChildFrame('body', index);

                // 回显表单数据
                body.find('#scrapNum').attr('value', row.scrapno); //报废单号
                body.find('#applyDepart').attr('value', row.applydeptname); //申请部门
                body.find('#scrapDate').attr('value', changeDateFormat(row.scrapdate)); //报废日期
                body.find('#applyPerson').attr('value', row.applypersonname); //申请人员
                body.find('#JobNum').attr('value', row.applypersonid); //申请人工号
                body.find('#scrapReason').text(row.applyreason); //报废原因


                // 下载附件
                if (row.annexurl) {
                    body.find('#downloadFile').attr('href', row.annexurl);
                }

                body.find('#downloadFile').click(function(event) {
                    if ($(this).attr('href') == '###') {
                        layer.msg('没有附件');
                    }
                });

            },
            end: function() {
                sessionStorage.removeItem('checkId');
            },
            content: 'approval.html'
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

            layer.open({
                type: 2,
                title: '添加',
                area: ['847px', '520px'],
                btn: ['确定', '取消'],
                end: function() {

                },
                yes: function(index, layero) {

                    var body = layer.getChildFrame('body', index);

                    //////////////////////////////////////添加资产用
                    var resultArr = [];
                    var allData = window[layero.find('iframe')[0]['name']].getSelectData(); //获取iframe内选中的表格数据

                    if (allData.length == 0) {
                        layer.msg('请勾选要添加的数据');
                        return;
                    }

                    console.log('表格数据', allData);

                    for (var i = 0; i < allData.length; i++) {

                        // 抽取资产的字段放在新数组里（字段和add.js字段一致）
                        resultArr.push({
                            code: allData[i].assetsid, //编号
                            name: allData[i].assetname, //资产名称
                            type: allData[i].assettype, //资产类型
                            assetNum: allData[i].assetnum, //数量
                            price: allData[i].price, //单价
                            unit: allData[i].unit, //单位
                            remarks: allData[i].remarks, //备注
                            yuliu1: allData[i].id, //备注
                        });
                    }

                    console.log('添加的数据', resultArr);

                    $.ajax({
                        url: port + '/v1/assetsScrap/scrapSave',
                        type: 'post',
                        data: {
                            scrapDtlList: JSON.stringify(resultArr), //表格数据
                            annexurl: uploadFile, //附件
                            applyDeptName: body.find('#applyDepartment').val(), //申请部门
                            scrapNo: body.find('#applyListNum').val(), //单号
                            applyPersonName: body.find('#applyPerson').val(), //申请人
                            applyReason: body.find('#applyReason').val(), //申请理由
                            applyPersonId: localStorage.getItem('pJobnum')
                        },
                        success: function(res) {
                            console.log(res);
                            if (res > 0) {
                                $("#tb_departments").bootstrapTable('refresh');
                                layer.msg('添加成功');
                                layer.close(index);
                            }
                        }
                    });


                },
                success: function(layero, index) {
                    var body = layer.getChildFrame('body', index);
                    layero.find('.layui-layer-btn0').css('background', '#27AAE1');

                    // 报废单号
                    $.ajax({
                        url: port + '/v1/assetsScrap/createCode',
                        type: 'post',
                        success: function(res) {
                            console.log('自动生成编号', res);
                            body.find('#applyListNum').attr('value', res.msg);
                        }
                    });


                    body.find('#applyDate').attr('value', getDate()); // 申请日期

                    // 获取登录人
                    body.find('#applyPerson').attr('value', localStorage.getItem('loginPerson')); //申请人员
                    body.find('#applyDepartment').attr('value', localStorage.getItem('loginDepart')); //申请部门

                    body.find('#phone').blur(function(event) {
                        if (!phongReg.test($(this).val())) {
                            layer.msg('请输入正确的电话号码');
                            $(this).val('');
                        }
                    });

                    body.find('#price').blur(function(event) {
                        if (!zsReg.test($(this).val())) {
                            layer.msg('预算金额必须大于0');
                            $(this).val('');
                        }
                    });

                    // 上传
                    body.find('.upload-file input').change(function(e) {
                        console.log('上传', e);
                        $.ajax({
                            url: port + "/v1/assetsScrap/importScrapImg",
                            type: 'post',
                            data: new FormData(body.find('#uploadFile')[0]),
                            cache: false,
                            processData: false,
                            contentType: false,
                            success: function(data) {
                                console.log(data);
                                uploadFile = data;
                            },
                            error: function() {
                                console.log('异常');
                            }
                        });
                    });
                },
                btnAlign: 'c',
                content: 'add.html'
            });

        });



        // 修改表格数据
        $("#btn_edit").on('click', function() {

            var a = $("#tb_departments").bootstrapTable('getSelections');
            console.log('修改', a[0]);
            if (a.length == 1) {
                sessionStorage.setItem('checkId', a[0].id);
                layer.open({
                    type: 2,
                    title: '修改',
                    area: ['847px', '520px'],
                    btn: ['确定', '取消'],
                    end: function() {
                        sessionStorage.removeItem('checkId');
                    },
                    yes: function(index, layero) {
                        var body = layer.getChildFrame('body', index);
                        var dataGrid = window[layero.find('iframe')[0]['name']].getAllData(); //所有表格数据



                        for (var i = 0; i < dataGrid.length; i++) {
                            if (dataGrid[i].name == '') {
                                layer.msg('资产名称不能为空');
                                return;
                            }

                            if (!zsReg.test(dataGrid[i].assetNum)) {
                                layer.msg('数量必须大于0');
                                return;
                            }

                            if (!zsReg.test(dataGrid[i].price)) {
                                layer.msg('单价必须大于0');
                                return;
                            }
                        }



                        $.ajax({
                            url: port + '/v1/assetsScrap/scrapUpdate',
                            type: 'post',
                            data: {
                                scrapDtlList: JSON.stringify(dataGrid), //表格数据
                                annexurl: uploadFile, //附件
                                applyDeptName: body.find('#applyDepartment').val(), //申请部门
                                scrapNo: body.find('#applyListNum').val(), //单号
                                applyPersonName: body.find('#applyPerson').val(), //申请人
                                applyReason: body.find('#applyReason').val(), //申请理由
                                id: a[0].id
                            },
                            success: function(res) {
                                console.log(res);
                                if (res > 0) {
                                    $("#tb_departments").bootstrapTable('refresh');
                                    layer.msg('修改成功');
                                    layer.close(index);
                                }
                            }
                        });



                    },
                    success: function(layero, index) {
                        var body = layer.getChildFrame('body', index);
                        layero.find('.layui-layer-btn0').css('background', '#27AAE1');

                        body.find('#applyListNum').attr('value', a[0].scrapno); //报废单号
                        body.find('#applyDate').attr('value', changeDateFormat(a[0].scrapdate)); //报废日期
                        body.find('#applyPerson').attr('value', a[0].applypersonname); //申请人员
                        body.find('#applyDepartment').attr('value', a[0].applydeptname); //申请部门

                        body.find('#applyReason').text(a[0].applyreason); //报废原因


                        // 上传
                        body.find('.upload-file input').change(function(e) {
                            console.log('上传', e);
                            $.ajax({
                                url: port + "/v1/assetsScrap/importScrapImg",
                                type: 'post',
                                data: new FormData(body.find('#uploadFile')[0]),
                                cache: false,
                                processData: false,
                                contentType: false,
                                success: function(data) {
                                    console.log(data);
                                    uploadFile = data;
                                },
                                error: function() {
                                    console.log('异常');
                                }
                            });
                        });

                    },
                    btnAlign: 'c',
                    content: 'amend.html'
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
                layer.open({
                    type: 1,
                    title: '提示',
                    area: ['300px', '200px'],
                    btn: ['确定', '取消'],
                    success: function(layero, index) {
                        layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                    },
                    yes: function(index, layero) {
                        $.ajax({
                            url: port + '/v1/assetsScrap/scrapDelete',
                            type: 'post',
                            data: {
                                ids: delData.toString()
                            },
                            success: function(data) {
                                if (data > 0) {
                                    $("#tb_departments").bootstrapTable('refresh');
                                    layer.close(index);
                                    layer.msg('删除成功');

                                }
                            }
                        });

                    },
                    btnAlign: 'c',
                    content: '<div style="text-align: center;margin-top: 40px;">确定要删除选中的数据?</div>'
                });

            }
        });


        // 提交
        $("#btn_submit").on('click', function() {
            var a = $("#tb_departments").bootstrapTable('getSelections');
            var submitData = []; //要提交的数据

            if (a.length == 0) {
                layer.msg('请选择要提交的数据');
            } else {
                for (var i = 0; i < a.length; i++) {
                    submitData[i] = a[i].id;
                }
                console.log('提交的数据', submitData);

                layer.open({
                    type: 1,
                    title: '提示',
                    area: ['300px', '200px'],
                    btn: ['确定', '取消'],
                    success: function(layero, index) {
                        layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                    },
                    yes: function(index, layero) {
                        $.ajax({
                            url: port + '/v1/assetsScrap/scrapSubmit',
                            type: 'post',
                            data: {
                                ids: submitData.toString()
                            },
                            success: function(data) {
                                if (data > 0) {
                                    $("#tb_departments").bootstrapTable('refresh');
                                    layer.close(index);
                                    layer.msg('提交成功');
                                }
                            }
                        });

                    },
                    btnAlign: 'c',
                    content: '<div style="margin-top: 40px;text-align: center;">确定提交选中的数据?</div>'
                });

            }
        });


    };
    return oInit;
};