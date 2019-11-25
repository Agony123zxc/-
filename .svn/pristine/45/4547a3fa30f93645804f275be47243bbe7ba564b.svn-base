var phoneReg = /^[1][3,4,5,7,8][0-9]{9}$/; //手机号格式验证
var currentTreeId; //当前点击树状id
var currentTreeName;
$(function() {



    // 树状数据
    $('#tree').treeview({
        data: getTree()
    });
    // 树状数据事件
    $('#tree').on('nodeSelected', function(event, data) {
        console.log('树状菜单', data);
        currentTreeId = data.id;
        currentTreeName = data.text;
        $("#tb_departments").bootstrapTable('refresh');

    });

    // 左侧树状图没有选择时
    $('#tree').on('nodeUnselected', function(event, data) {
        currentTreeId = '';
        currentTreeName = '';
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
    if ($('#orgName').val() == '' && $('#orgSimpleName').val() == '') {
        return;
    }
    $("#tb_departments").bootstrapTable('refresh');
}
//重置
function resetBtn() {
    location.reload();
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
            url: port + '/v1/organize/seleOrganize',
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
                    field: 'orgIdnum',
                    align: 'center',
                    title: '编号'
                }, {
                    field: 'orgName',
                    align: 'center',
                    title: '机构名称'
                }, {
                    field: 'orgType',
                    align: 'center',
                    title: '类型'
                }, {
                    field: 'orgPname',
                    align: 'center',
                    title: '上级部门'
                }, {
                    field: 'orgInchangePerson',
                    align: 'center',
                    title: '负责人'
                }, {
                    field: 'orgInchangePersonMobile',
                    align: 'center',
                    title: '联系电话'
                },
                {
                    field: 'orgMark',
                    align: 'center',
                    title: '备注'
                }
            ],

            //加载成功时执行
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
            //加载失败时执行
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

    //得到查询的参数
    oTableInit.queryParams = function(params) {
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            pageSize: params.limit, //页面大小
            // pageNum: params.offset, //页码
            pageNum: (params.offset / params.limit) + 1, //页码
            orgName: $('#org_name').val() || currentTreeName, //机构名称
            orgType: $('#org_type').val() //类型
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
                url: port + "/v1/organize/importOrganizationInfo",
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
            '<a style="margin-left: 8px;" href="' + port + '/v1/organize/exportOrganizationTemplet">点击下载模板</a>' +
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
        layer.open({
            type: 1,
            title: '详情',
            btn: '关闭',
            btnAlign: 'c',
            area: ['470px', '320px'],
            success: function(layero, index) {
                layero.find('.layui-layer-btn0').css({ background: '#fff', color: '#333', borderColor: '#ddd', padding: '0 20px' });
            },
            content: '<div class="detail-layer">' +
                '<ul class="clearfix">' +
                '<li><span>上级机构：</span>' + row.parentName + '</li>' +
                '<li><span>编号：</span>' + row.orgCode + '</li>' +
                '<li><span>机构名称：</span>' + row.orgName + '</li>' +
                '<li><span>负责人：</span>' + row.chargePerson + '</li>' +
                '<li><span>机构简称：</span>' + row.orgSimpleName + '</li>' +
                '<li><span>联系电话：</span>' + row.phone + '</li>' +
                '<li><span>备注：</span>' + row.remarks + '</li>' +
                '</ul>' +
                '</div>'

        });
        console.log('行数据', row);
    }
};





// 工具栏按钮事件
var ButtonInit = function() {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function() {
        // 添加表格数据
        $("#btn_add").on('click', function() {
            if (currentTreeId == '') {
                layer.msg('请选择左侧要添加材料类型的父级')
                return;
            }
            console.log('添加')
            layer.open({
                type: 1,
                title: '添加',
                area: ['520px', '400px'],
                btn: ['确定', '取消'],
                yes: function(index, layero) {
                    var up_department = layero.find('#up_department').val(); //上级部门
                    var number = layero.find('#number').val(); //编号
                    var org_name = layero.find('#org_name').val(); //机构名称
                    var org_type = layero.find('#org_type').val(); //类型
                    var org_person = layero.find('#org_person').val(); //负责人
                    var org_phone = layero.find('#org_phone').val(); //电话
                    var remark = layero.find('#remark').val(); //备注



                    if (up_department == '') {
                        layer.msg('请选择上级部门');
                        return;
                    }
                    if (number == '') {
                        layer.msg('请输入编号');
                        return;
                    }
                    if (org_name == '') {
                        layer.msg('请输入机构名称');
                        return;
                    }




                    $.ajax({
                        url: port + '/v1/organize/addOrganize',
                        type: 'post',
                        data: {
                            pid: currentTreeId,
                            orgPname: up_department,
                            orgIdnum: number,
                            orgName: org_name,
                            orgType: org_type,
                            orgInchangePerson: org_person,
                            orgInchangePersonMobile: org_phone,
                            orgMark: remark
                        },
                        success: function(data) {
                            console.log('添加成功' + data);
                            $("#tb_departments").bootstrapTable('refresh'); //刷新表格数据
                            $('#tree').treeview({ //刷新树状菜单
                                data: getTree()
                            });
                            layer.msg('添加成功');
                            layer.close(index);
                            location.reload();
                        }
                    });


                },
                success: function(layero, index) {
                    layero.find('.layui-layer-btn0').css('background', '#27AAE1');

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
                },
                btnAlign: 'c',
                content: '<div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>上级部门：</label></div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0" style="position: relative;">' +
                    '<input autocomplete="off" style="background-color: #fff;" readonly type="text" id="up_department" class="form-control" value="">' +
                    '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>编号：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="number" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label for="orgCode"><i class="must-star">*</i>机构名称：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="org_name" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>类型：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<select class="form-control" id="org_type">' +
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
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>负责人：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="org_person" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>电话：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="org_phone" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>备注：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0;">' +
                    '<textarea class="form-control" id="remark" rows="2" style="resize: none;"></textarea>' +
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

                layer.open({
                    type: 1,
                    title: '修改',
                    area: ['520px', '400px'],
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {
                        var up_department = layero.find('#up_department').val(); //上级部门
                        var number = layero.find('#number').val(); //编号
                        var org_name = layero.find('#org_name').val(); //机构名称
                        var org_type = layero.find('#org_type').val(); //类型
                        var org_person = layero.find('#org_person').val(); //负责人
                        var org_phone = layero.find('#org_phone').val(); //电话
                        var remark = layero.find('#remark').val(); //备注



                        if (up_department == '') {
                            layer.msg('请选择上级部门');
                            return;
                        }
                        if (number == '') {
                            layer.msg('请输入编号');
                            return;
                        }
                        if (org_name == '') {
                            layer.msg('请输入机构名称');
                            return;
                        }



                        $.ajax({
                            url: port + '/v1/organize/updateOrganize',
                            type: 'post',
                            data: {
                                id: a[0].id,
                                pid: a[0].pid,
                                orgPname: up_department,
                                orgIdnum: number,
                                orgName: org_name,
                                orgType: org_type,
                                orgInchangePerson: org_person,
                                orgInchangePersonMobile: org_phone,
                                orgMark: remark
                            },
                            success: function(data) {
                                console.log('修改成功' + data);
                                $("#tb_departments").bootstrapTable('refresh'); //刷新表格数据
                                $('#tree').treeview({ //刷新树状菜单
                                    data: getTree()
                                });
                                layer.msg('修改成功');
                                layer.close(index);
                                location.reload();
                            }
                        });
                    },
                    success: function(layero, index) {
                        layero.find('.layui-layer-btn0').css('background', '#27AAE1');

                        // 编号去重查询
                        layero.find('#number').blur(function(event) {
                            $.ajax({
                                url: port + '/v1/organize/validationUpdateOrganization',
                                type: 'post',
                                data: {
                                    orgIdNum: layero.find('#number').val(),
                                    id: a[0].id
                                },
                                success: function(res) {
                                    if (res == 0) {
                                        layer.msg('编号已存在');
                                        layero.find('#number').val('');
                                    }
                                }
                            })
                        });


                        // 上级机构
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

                        layero.find('#org_type option').each(function(index, item) {
                            if (item.innerHTML == a[0].orgType) {
                                $(this).attr('selected', true);
                            }
                        });

                    },
                    btnAlign: 'c',
                    content: '<div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>上级部门：</label></div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0" style="position: relative;">' +
                        '<input autocomplete="off" style="background-color: #fff;" readonly type="text" id="up_department" class="form-control" value="' + a[0].orgPname + '">' +
                        '<div style="position: absolute;width: 100%;left: 0;top: 33px;display: none;height: 250px;z-index: 99;overflow: auto;" id="treeviews">' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>编号：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="number" type="text" class="form-control" value="' + a[0].orgIdnum + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label for="orgCode"><i class="must-star">*</i>机构名称：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="org_name" type="text" class="form-control" value="' + a[0].orgName + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>类型：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<select class="form-control" id="org_type">' +
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
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>负责人：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="org_person" type="text" class="form-control" value="' + a[0].orgInchangePerson + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>电话：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="org_phone" type="text" class="form-control" value="' + a[0].orgInchangePersonMobile + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>备注：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0;">' +
                        '<textarea class="form-control" id="remark" rows="2" style="resize: none;">' + a[0].orgMark + '</textarea>' +
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
            var a = $("#tb_departments").bootstrapTable('getSelections');
            var delData = []; //要删除的数据
            if (a.length == 0) {
                layer.msg('请选择要删除的数据');
            } else {
                var pIds = "";
                //获取选中的ID
                for (var i = 0; i < a.length; i++) {
                    if (a[i].pid == "0") {
                        pIds = "0";
                    }
                    delData[i] = a[i].id;
                }
                if (pIds == "") {
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
                                url: port + '/v1/organize/deleteOrganize',
                                type: 'post',
                                data: {
                                    ids: delData.toString()
                                },
                                success: function(data) {
                                    console.log(data);
                                    $("#tb_departments").bootstrapTable('refresh'); //刷新表格数据
                                    $('#tree').treeview({ //刷新树状菜单
                                        data: getTree()
                                    });
                                    layer.msg('删除成功');
                                    layer.close(index);
                                    location.reload();

                                }
                            });

                        },
                        btnAlign: 'c',
                        content: '<div style="text-align: center;margin-top: 40px;">确定要删除选中的数据?</div>'
                    });
                } else {
                    layer.msg('包含顶级机构不能删除');
                }
            }
        });


        // 导出（导出所有、选择导出）
        $("#btn_export").on('click', function() {
            var a = $("#tb_departments").bootstrapTable('getSelections');
            var exportData = []; //要导出的数据

            if (a.length == 0) {
                console.log('导出所有')
                location.href = port + '/v1/organize/exportOrganizeInfoOnce';
            } else {
                //获取选中的选项
                for (var i = 0; i < a.length; i++) {
                    exportData[i] = a[i].id;
                }
                location.href = port + '/v1/organize/exportMaterielInfo?ids=' + exportData.toString();
            }
        });


    };
    return oInit;
};