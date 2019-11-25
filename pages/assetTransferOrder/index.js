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
    $('#transferNum').val('');
    $('#applyPerson').val('');
    $('#timeRange').val('');
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
            url: port + '/v1/assetAllot/findAssetsAllot',
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
                    field: 'aaCoding',
                    align: 'center',
                    title: '调拨单号'
                }, {
                    field: 'aaAllotDate',
                    align: 'center',
                    title: '调拨日期'

                }, {
                    field: 'aaOutDepartmentname',
                    align: 'center',
                    title: '原使用部门'
                }, {
                    field: 'aaFormerUsername',
                    align: 'center',
                    title: '原使用人'
                },
                {
                    field: 'aaInDepartmentname',
                    align: 'center',
                    title: '调入部门'
                }, {
                    field: 'aaNewUsername',
                    align: 'center',
                    title: '新使用人'
                }, {
                    field: 'aaAppstate',
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
                    startTime: $('#timeRange').val().substring(0, 10), //开始时间
                    endTime: $('#timeRange').val().substring(13), //结束时间
                    aaCoding: $('#transferNum').val(), //调拨单号
                    newPerson: $('#applyPerson').val(), //申请人
                    mark: '资产调拨单'
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
        sessionStorage.setItem('checkId', row.aaId);
        layer.open({
            type: 2,
            title: '详情',
            btn: '关闭',
            btnAlign: 'c',
            area: ['860px', '520px'],
            success: function(layero, index) {
                layero.find('.layui-layer-btn0').css({ background: '#fff', color: '#333', borderColor: '#ddd', padding: '0 20px' });
                var body = layer.getChildFrame('body', index);

                body.find('#transferNum').attr('value', row.aaCoding); //调拨单号
                body.find('#transferDate').attr('value', row.aaAllotDate); //调拨日期
                body.find('#oldPerson').attr('value', row.aaFormerUsername); //原使用人
                body.find('#oldDepart').attr('value', row.aaOutDepartmentname); //原使用部门
                body.find('#newDepart').attr('value', row.aaInDepartmentname); //新使用部门
                body.find('#newPerson').attr('value', row.aaNewUsername); //新使用人
                body.find('#transferReason').text(row.aaBz2); //调拨原因


            },
            end: function() {
                sessionStorage.removeItem('checkId');
            },
            content: 'detail.html'
        });
    }
};




// 工具栏按钮事件
var ButtonInit = function() {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function() {
        // 调拨
        $("#btn_add").on('click', function() {
            layer.open({
                type: 2,
                title: '调拨',
                area: ['847px', '520px'],
                btn: ['确定', '取消'],
                end: function() {

                },
                yes: function(index, layero) {

                    var body = layer.getChildFrame('body', index);

                    if (body.find('#oldPerson').val() == '') {
                        layer.msg('请输入原使用人');
                        return;
                    }

                    if (body.find('#newDepart').val() == '') {
                        layer.msg('请选择调入部门');
                        return;
                    }

                    if (body.find('#newPerson').val() == '') {
                        layer.msg('请输入新使用人');
                        return;
                    }

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
                            aoNumber: allData[i].aoNumber, //编号
                            aoAssetsName: allData[i].aoAssetsName, //资产名称
                            aoAssetsType: allData[i].aoAssetsType, //资产类别
                            aoAllotNumber: allData[i].aoAllotNumber, //数量
                            aoUnit: allData[i].aoUnit, //单位
                            aoRemark: allData[i].aoRemark, //备注
                            aoYuliu2: allData[i].aoYuliu2, //单价
                            aoYuliu1: allData[i].id
                        });
                    }

                    console.log('添加的数据', resultArr);

                    $.ajax({
                        url: port + '/v1/assetAllot/insertAssetAllotConfirm',
                        type: 'post',
                        data: {
                            aaoList: JSON.stringify(resultArr), //表格数据
                            aaCoding: body.find('#transferNum').val(), //调拨单号
                            aaFormerUsername: body.find('#oldPerson').val(), //原使用人
                            aaOutDepartmentName: body.find('#oldDepart').val(), //原使用部门
                            aaInDepartmentName: body.find('#newDepart').val(), //调入部门
                            aaNewUsername: body.find('#newPerson').val(), //新使用人
                            aaReason: body.find('#transferReason').val(), //调拨原因
                            pJobNum: localStorage.getItem('pJobnum')

                        },
                        success: function(res) {
                            console.log(res);
                            if (res > 0) {
                                $("#tb_departments").bootstrapTable('refresh');
                                layer.close(index);
                                layer.msg('添加成功');
                            }
                        }
                    });


                },
                success: function(layero, index) {
                    var body = layer.getChildFrame('body', index);
                    layero.find('.layui-layer-btn0').css('background', '#27AAE1');

                    // 自动生成编号
                    $.ajax({
                        url: port + '/v1/assetAllot/createCode',
                        type: 'get',
                        success: function(res) {
                            console.log('自动生成编号', res);
                            body.find('#transferNum').attr('value', res.msg);
                        }
                    });


                    body.find('#transferDate').attr('value', getDate()); // 调拨日期

                    // 获取登录人
                    body.find('#applyPerson').attr('value', localStorage.getItem('loginPerson')); //申请人员
                    body.find('#personJobNumber').attr('value', localStorage.getItem('pJobnum')); //人员工号
                    body.find('#oldDepart').attr('value', localStorage.getItem('loginDepart')); //原使用部门

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
                sessionStorage.setItem('checkId', a[0].aaId);
                sessionStorage.setItem('newDepart', a[0].aaInDepartmentname); //调入部门
                layer.open({
                    type: 2,
                    title: '修改',
                    area: ['847px', '520px'],
                    btn: ['确定', '取消'],
                    end: function() {
                        sessionStorage.removeItem('checkId');
                        sessionStorage.removeItem('newDepart');
                    },
                    yes: function(index, layero) {
                        var body = layer.getChildFrame('body', index);

                        if (body.find('#oldPerson').val() == '') {
                            layer.msg('请输入原使用人');
                            return;
                        }

                        if (body.find('#newDepart').val() == '') {
                            layer.msg('请选择调入部门');
                            return;
                        }

                        if (body.find('#newPerson').val() == '') {
                            layer.msg('请输入新使用人');
                            return;
                        }

                        var dataGrid = window[layero.find('iframe')[0]['name']].getAllData(); //所有表格数据

                        console.log('修改的数据', dataGrid);

                        for (var i = 0; i < dataGrid.length; i++) {
                            if (dataGrid[i].aoAssetsName == '') {
                                layer.msg('资产名称不能为空');
                                return;
                            }

                            if (!zsReg.test(dataGrid[i].aoAllotNumber)) {
                                layer.msg('数量必须大于0');
                                return;
                            }

                            if (!zsReg.test(dataGrid[i].aoYuliu2)) {
                                layer.msg('单价必须大于0');
                                return;
                            }
                        }

                        $.ajax({
                            url: port + '/v1/assetAllot/updateAssetAllotOrder',
                            type: 'post',
                            data: {
                                assetAllotId: a[0].aaId,
                                aaoList: JSON.stringify(dataGrid),
                                aaReason: body.find('#transferReason').val(), //调拨原因
                                aaFormerUsername: body.find('#oldPerson').val(), //原使用人
                                aaInDepartmentName: body.find('#newDepart').val(), //调入部门
                                aaNewUsername: body.find('#newPerson').val(), //新使用人
                                pJobNum: localStorage.getItem('pJobnum')

                            },
                            success: function(res) {
                                if (res > 0) {
                                    $("#tb_departments").bootstrapTable('refresh');
                                    layer.close(index);
                                    layer.msg('修改成功');

                                }
                            }
                        });

                    },
                    success: function(layero, index) {
                        var body = layer.getChildFrame('body', index);
                        layero.find('.layui-layer-btn0').css('background', '#27AAE1');

                        body.find('#transferNum').attr('value', a[0].aaCoding); //调拨单号
                        body.find('#transferDate').attr('value', a[0].aaAllotDate); //调拨日期
                        body.find('#oldPerson').attr('value', a[0].aaFormerUsername); //原使用人
                        body.find('#oldDepart').attr('value', a[0].aaOutDepartmentname); //原使用部门
                        body.find('#newPerson').attr('value', a[0].aaNewUsername); //新使用人
                        body.find('#transferReason').text(a[0].aaBz2); //调拨原因



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
                    delData[i] = a[i].aaId;
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
                            url: port + '/v1/assetAllot/deleteAssetAllot',
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
                    submitData[i] = a[i].aaId;
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
                            url: port + '/v1/assetAllot/insertAssetAllot',
                            type: 'post',
                            data: {
                                ids: submitData.toString()
                            },
                            success: function(data) {
                                if (data > 0) {
                                    $("#tb_departments").bootstrapTable('refresh');
                                    layer.close(index);
                                    layer.msg('已提交');
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