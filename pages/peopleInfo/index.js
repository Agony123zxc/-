var phongReg = /^[1][3,4,5,7,8][0-9]{9}$/; //手机号格式验证
var currentTreeId = ''; //当前点击树状id
var currentTreeText = ''; //当前点击树状text

var departTreeStr = ''; //添加时部门树
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
    console.log('重置');
    $('#work_number').val('');
    $('#user_name').val('');
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
            url: port + '/v1/personnel2/selePersonal',
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
                field: 'pJobnum',
                align: 'center',
                title: '工号'
            }, {
                field: 'pName',
                align: 'center',
                title: '姓名'
            }, {
                field: 'depId',
                align: 'center',
                title: '部门'
            }, {
                field: 'pCreatetime',
                align: 'center',
                title: '创建时间',
                formatter: function(value, row, index) {
                    return changeDateFormat(value);
                }
            }, {
                field: 'pUpdatetime',
                align: 'center',
                title: '更新时间',
                formatter: function(value, row, index) {
                    return changeDateFormat(value);
                }
            }, {
                field: 'name6',
                align: 'center',
                title: '操作',
                events: operateEvents,
                formatter: function(value, row, index) {
                    var result = "<a href='javascript:;' class='info' style='border:1px solid #3c8dbc;padding:3px 10px;font-size:12px;border-radius:3px;'>查看</a>";
                    return result;
                }
            }],

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
            pageNum: (params.offset / params.limit) + 1, //页码
            pJobnum: $('#work_number').val(), //工号
            pName: $('#user_name').val(), //姓名
            orgName: currentTreeText
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
        if (row.pPhoto == null) {
            row.pPhoto = '../../images/default.png';
        }
        layer.open({
            type: 1,
            title: '详情',
            btn: '关闭',
            btnAlign: 'c',
            area: ['800px', '500px'],
            success: function(layero, index) {
                layero.find('.layui-layer-btn0').css({ background: '#fff', color: '#333', borderColor: '#ddd', padding: '0 20px' });
            },
            content: '<div class="detail-layer">' +
                '<ul class="detail-info-list clearfix">' +
                '<li><span class="title">工号：</span>' + row.pJobnum + '</li>' +
                '<li><span class="title">姓名：</span>' + row.pName + '</li>' +
                '<li><span class="title">性别：</span>' + row.pSex + '</li>' +
                '<li><span class="title">部门：</span>' + row.depId + '</li>' +
                '<li><span class="title">学历：</span>' + row.pEducation + '</li>' +
                '<li><span class="title">民族：</span>' + row.pNation + '</li>' +
                '<li><span class="title">职务：</span>' + row.pTitle + '</li>' +
                '<li><span class="title">职称：</span>' + row.pDuty + '</li>' +
                '<li><span class="title">政治面貌：</span>' + row.pPoliticalStatus + '</li>' +
                '<li><span class="title">手机号码：</span>' + row.pMobile + '</li>' +
                '<li><span class="title">出生日期：</span>' + changeDateFormat(row.pBirth) + '</li>' +
                '<li><span class="title">入职日期：</span>' + row.pWorktime + '</li>' +
                '<li><span class="title">婚姻状况：</span>' + row.pMaritalStatus + '</li>' +
                '<li><span class="title">人事状态：</span>' + row.pState + '</li>' +
                '<li><span class="title">毕业日期：</span>' + row.pGraduateDate + '</li>' +
                '<li><span class="title">毕业院校：</span>' + row.pGraduateCollege + '</li>' +
                '<li><span class="title">学习专业：</span>' + row.pMajor + '</li>' +
                '<li><span class="title">身份证号：</span>' + row.pCardid + '</li>' +
                '</ul>' +
                '<div class="head-img" style="background-image: url(' + port + '/upload/' + row.pPhoto + ')"></div>' +
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

            layer.open({
                type: 1,
                title: '添加',
                area: ['800px', '560px'],
                btn: ['确定', '取消'],
                yes: function(index, layero) {
                    var work_number = layero.find('#work_number').val(); //工号
                    var user_name = layero.find('#user_name').val(); //姓名
                    var sex = layero.find('#sex').val(); //性别
                    var department = layero.find('#department').val(); //部门
                    var education = layero.find('#education').val(); //学历
                    var nation = layero.find('#nation').val(); //民族
                    var position = layero.find('#position').val(); //职务
                    var work_title = layero.find('#work_title').val(); //职称
                    var political_face = layero.find('#political_face').val(); //政治面貌
                    var phone = layero.find('#phone').val(); //手机号码
                    var born_date = layero.find('#born_date').val(); //出生日期
                    var entry_date = layero.find('#entry_date').val(); //入职日期
                    var marriage_status = layero.find('#marriage_status').val(); //婚姻状况
                    var people_status = layero.find('#people_status').val(); //人事状态
                    var leave_date = layero.find('#leave_date').val(); //毕业日期
                    var leave_school = layero.find('#leave_school').val(); //毕业院校
                    var profession = layero.find('#profession').val(); //学习专业
                    var id_card = layero.find('#id_card').val(); //身份证号



                    if (work_number == '') {
                        layer.msg('请输入工号');
                        return;
                    }
                    if (user_name == '') {
                        layer.msg('请输入姓名');
                        return;
                    }
                    if (department == '') {
                        layer.msg('请选择部门');
                        return;
                    }
                    if (phone == '') {
                        layer.msg('请输入手机号码');
                        return;
                    }
                    if (!phongReg.test(phone)) {
                        layer.msg('手机号码格式错误');
                        return;
                    }
                    if (leave_school == '') {
                        layer.msg('请输入毕业院校');
                        return;
                    }
                    if (profession == '') {
                        layer.msg('请输入所学专业');
                        return;
                    }

                    $.ajax({
                        url: port + '/v1/personnel2/addPersonal',
                        type: 'post',
                        data: {
                            orgName: currentTreeText, //左侧树状部门
                            pJobnum: work_number, //工号
                            pName: user_name, //姓名
                            pSex: sex, //性别
                            depId: department, //部门
                            pEducation: education, //学历
                            pNation: nation, //民族
                            pTitle: position, //职务
                            pDuty: work_title, //职称
                            pPoliticalStatus: political_face, //政治面貌
                            pMobile: phone, //手机号码
                            pBirth: born_date, //出生日期
                            pWorktime: entry_date, //入职日期
                            pMaritalStatus: marriage_status, //婚姻状况
                            pState: people_status, //人事状态
                            pGraduateDate: leave_date, //毕业日期
                            pGraduateCollege: leave_school, //毕业院校
                            pMajor: profession, //专业
                            pCardid: id_card, //身份证号
                            pPhoto: upLoadImg //上传的图片地址
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


                    layero.find('#nation').chosen({
                        no_results_text: "没有找到结果！", //搜索无结果时显示的提示  
                        search_contains: true, //关键字模糊搜索。设置为true，只要选项包含搜索词就会显示；设置为false，则要求从选项开头开始匹配
                        allow_single_deselect: true, //单选下拉框是否允许取消选择。如果允许，选中选项会有一个x号可以删除选项
                        disable_search: false, //禁用搜索。设置为true，则无法搜索选项。
                        disable_search_threshold: 0, //当选项少等于于指定个数时禁用搜索。
                        inherit_select_classes: true, //是否继承原下拉框的样式类，此处设为继承
                        placeholder_text_single: ' ', //单选选择框的默认提示信息，当选项为空时会显示。如果原下拉框设置了data-placeholder，会覆盖这里的值。
                        width: '200px', //设置chosen下拉框的宽度。即使原下拉框本身设置了宽度，也会被width覆盖。
                        max_shown_results: 1000, //下拉框最大显示选项数量
                        display_disabled_options: false,
                        single_backstroke_delete: false, //false表示按两次删除键才能删除选项，true表示按一次删除键即可删除
                        case_sensitive_search: false, //搜索大小写敏感。此处设为不敏感
                        group_search: false, //选项组是否可搜。此处搜索不可搜
                        include_group_label_in_selected: true, //选中选项是否显示选项分组。false不显示，true显示。默认false。
                    });


                    layero.find('#department').click(function(event) {


                        layer.open({
                            title: '部门',
                            type: 1,
                            btn: ['确定', '取消'],
                            btnAlign: 'c',
                            content: '<div id="departTree"></div>',
                            area: ['300px', '500px'],
                            success: function(layero, index) {
                                layero.find('.layui-layer-btn0').css('background', '#27AAE1');

                                layero.find('#departTree').treeview({
                                    data: getTree()
                                });

                                layero.find('#departTree').on('nodeSelected', function(event, data) {
                                    console.log(data.text)
                                    departTreeStr = data.text;
                                });

                                layero.find('#departTree').on('nodeUnselected', function(event, data) {
                                    departTreeStr = '';
                                });



                            },
                            yes: function(index1, layero1) {
                                console.log(departTreeStr);
                                if (departTreeStr == '') {
                                    layer.msg('请选择部门');
                                    return;
                                }
                                layero.find('#department').attr('value', departTreeStr);
                                layer.close(index1);
                                departTreeStr = '';
                            }
                        })
                    });

                    layero.find('#work_number').blur(function(event) {
                        // 工号去重查询
                        $.ajax({
                            url: port + '/v1/personnel2/validationAddPersonal',
                            type: 'post',
                            data: {
                                pJobnum: layero.find('#work_number').val()
                            },
                            success: function(res) {
                                if (res == 0) {
                                    layer.msg('工号已存在');
                                    layero.find('#work_number').val('');
                                }
                            }
                        });
                    });



                    // 出生日期
                    laydate.render({
                        elem: '#born_date',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#born_date').attr('value', value);
                        }
                    });

                    // 入职日期
                    laydate.render({
                        elem: '#entry_date',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#entry_date').attr('value', value);
                        }
                    });

                    // 毕业日期
                    laydate.render({
                        elem: '#leave_date',
                        trigger: 'click',
                        done: function(value, date, endDate) {
                            layero.find('#leave_date').attr('value', value);
                        }
                    });


                    // 上传图片
                    layero.find('#select_head').on('change', function(event) {

                        // 本地预览base64
                        var file = this.files[0];
                        if (file) {
                            var reader = new FileReader();
                            // 图片文件转换为base64
                            reader.readAsDataURL(file);
                            reader.onload = function() {
                                layero.find('.photo-wrap').css({ 'background-image': 'url(' + reader.result + ')' });
                            };
                        }

                        formData.append("file", $(this)[0].files[0]);

                        $.ajax({
                            url: port + "/v1/personnel2/importPersonalImg",
                            type: 'post',
                            async: false,
                            data: formData,
                            processData: false,
                            contentType: false,
                            success: function(res) {
                                console.log(res)
                                upLoadImg = res;
                            }
                        });
                    });


                },
                btnAlign: 'c',
                content: '<div class="modal-body table-layer clearfix" style="padding: 0;margin: 0;padding-right: 200px;position: relative;">' +
                    '<div class="form-info clearfix">' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>工号：</label></div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0" style="position: relative;z-index=99;">' +
                    '<input autocomplete="off" style="background-color: #fff;" type="text" class="form-control" id="work_number">' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>姓名：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" type="text" class="form-control" id="user_name" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label for="orgCode"><i class="must-star">*</i>性别：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<select id="sex" style="width: 100%;height: 34px;">' +
                    '<option value="男">男</option>' +
                    '<option value="女">女</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label for="orgCode"><i class="must-star">*</i>部门：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" style="background-color: #fff;" type="text" class="form-control" value="" id="department">' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    ' <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label for="orgCode">学历：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<select id="education" style="width: 100%;height: 34px;">' +
                    '<option value="大专">大专</option>' +
                    '<option value="本科">本科</option>' +
                    '<option value="本科">研究生</option>' +
                    '<option value="本科">硕士</option>' +
                    '<option value="本科">博士</option>' +
                    '<option value="本科">博士后</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label for="orgCode">民族：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<select id="nation" style="width: 100%;height: 34px;">' +
                    '<option></option>' +
                    '<option>汉族</option>' +
                    '<option>满族</option>' +
                    '<option>蒙古族</option>' +
                    '<option>回族</option>' +
                    '<option>藏族</option>' +
                    '<option>维吾尔族</option>' +
                    '<option>苗族</option>' +
                    '<option>彝族</option>' +
                    '<option>壮族</option>' +
                    '<option>布依族</option>' +
                    '<option>侗族</option>' +
                    '<option>瑶族</option>' +
                    '<option>白族</option>' +
                    '<option>土家族</option>' +
                    '<option>哈尼族</option>' +
                    '<option>哈萨克族</option>' +
                    '<option>傣族</option>' +
                    '<option>黎族</option>' +
                    '<option>傈僳族</option>' +
                    '<option>佤族</option>' +
                    '<option>畲族</option>' +
                    '<option>高山族</option>' +
                    '<option>拉祜族</option>' +
                    '<option>水族</option>' +
                    '<option>东乡族</option>' +
                    '<option>纳西族</option>' +
                    '<option>景颇族</option>' +
                    '<option>柯尔克孜族</option>' +
                    '<option>土族</option>' +
                    '<option>达斡尔族</option>' +
                    '<option>仫佬族</option>' +
                    '<option>羌族</option>' +
                    '<option>布朗族</option>' +
                    '<option>撒拉族</option>' +
                    '<option>毛南族</option>' +
                    '<option>仡佬族</option>' +
                    '<option>锡伯族</option>' +
                    '<option>阿昌族</option>' +
                    '<option>普米族</option>' +
                    '<option>朝鲜族</option>' +
                    '<option>塔吉克族</option>' +
                    '<option>怒族</option>' +
                    '<option>乌孜别克族</option>' +
                    '<option>俄罗斯族</option>' +
                    '<option>鄂温克族</option>' +
                    '<option>德昂族</option>' +
                    '<option>保安族</option>' +
                    '<option>裕固族</option>' +
                    '<option>京族</option>' +
                    '<option>塔塔尔族</option>' +
                    '<option>独龙族</option>' +
                    '<option>鄂伦春族</option>' +
                    '<option>赫哲族</option>' +
                    '<option>门巴族</option>' +
                    '<option>珞巴族</option>' +
                    '<option>基诺族</option>' +
                    '<option>其他</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    ' <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label for="orgCode">职务：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<select id="position" style="width: 100%;height: 34px;">' +
                    '<option value="主管">总经理</option>' +
                    '<option value="经理">经理</option>' +
                    '<option value="经理">总经理助理</option>' +
                    '<option value="经理">其他</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label for="orgCode">职称：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<select id="work_title" style="width: 100%;height: 34px;">' +
                    '<option value="主管">研究实习员</option>' +
                    '<option value="经理">教授</option>' +
                    '<option value="经理">副教授</option>' +
                    '<option value="经理">其他</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label for="orgCode">政治面貌：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<select id="political_face" style="width: 100%;height: 34px;">' +
                    '<option value="群众">群众</option>' +
                    '<option value="团员">团员</option>' +
                    '<option value="团员">党员</option>' +
                    '<option value="团员">预备党员</option>' +
                    '<option value="团员">其他</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>手机号码：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" id="phone" type="text" class="form-control" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>出生日期：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" type="text" class="form-control" id="born_date" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>入职日期：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" type="text" class="form-control" id="entry_date" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label for="orgCode">婚姻状况：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<select id="marriage_status" style="width: 100%;height: 34px;">' +
                    '<option value="未婚">未婚</option>' +
                    '<option value="已婚">已婚</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label for="orgCode">人事状态：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<select id="people_status" style="width: 100%;height: 34px;">' +
                    '<option value="">在职</option>' +
                    '<option value="">离职</option>' +
                    '</select>' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>毕业日期：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<input readonly autocomplete="off" type="text" class="form-control" id="leave_date" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>毕业院校：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" type="text" class="form-control" id="leave_school" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                    '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label><i class="must-star">*</i>学习专业：</label>' +
                    '</div>' +
                    '<div class="col-md-8" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" type="text" class="form-control" id="profession" />' +
                    '</div>' +
                    '</div>' +
                    '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;">' +
                    '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;">' +
                    '<label>身份证号：</label>' +
                    '</div>' +
                    '<div class="col-md-10" style="padding: 0;margin: 0">' +
                    '<input autocomplete="off" type="text" class="form-control" id="id_card" />' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="up-photo">' +
                    '<div class="photo-wrap"></div>' +
                    '<button class="btn btn-primary up-photo-btn" style="position: relative;cursor: pointer;width: 80px;margin-top: 20px;">' +
                    '<input type="file" name="" style="position: absolute;width: 100%;height: 100%;left: 0;top: 0;opacity: 0;font-size:0;cursor:pointer;" id="select_head">选择头像' +
                    '</button>' +
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
                    area: ['800px', '560px'],
                    btn: ['确定', '取消'],
                    yes: function(index, layero) {

                        var work_number = layero.find('#work_number').val(); //工号
                        var user_name = layero.find('#user_name').val(); //姓名
                        var sex = layero.find('#sex').val(); //性别
                        var department = layero.find('#department').val(); //部门
                        var education = layero.find('#education').val(); //学历
                        var nation = layero.find('#nation').val(); //民族
                        var position = layero.find('#position').val(); //职务
                        var work_title = layero.find('#work_title').val(); //职称
                        var political_face = layero.find('#political_face').val(); //政治面貌
                        var phone = layero.find('#phone').val(); //手机号码
                        var born_date = layero.find('#born_date').val(); //出生日期
                        var entry_date = layero.find('#entry_date').val(); //入职日期
                        var marriage_status = layero.find('#marriage_status').val(); //婚姻状况
                        var people_status = layero.find('#people_status').val(); //人事状态
                        var leave_date = layero.find('#leave_date').val(); //毕业日期
                        var leave_school = layero.find('#leave_school').val(); //毕业院校
                        var profession = layero.find('#profession').val(); //学习专业
                        var id_card = layero.find('#id_card').val(); //身份证号



                        if (work_number == '') {
                            layer.msg('请输入工号');
                            return;
                        }
                        if (user_name == '') {
                            layer.msg('请输入姓名');
                            return;
                        }
                        if (department == '') {
                            layer.msg('请输入部门');
                            return;
                        }
                        if (phone == '') {
                            layer.msg('请输入手机号码');
                            return;
                        }
                        if (!phongReg.test(phone)) {
                            layer.msg('手机号码格式错误');
                            return;
                        }
                        if (leave_school == '') {
                            layer.msg('请输入毕业院校');
                            return;
                        }
                        if (profession == '') {
                            layer.msg('请输入所学专业');
                            return;
                        }

                        console.log('修改1');


                        $.ajax({
                            url: port + '/v1/personnel2/updatePersonal',
                            type: 'post',
                            data: {
                                pJobnum: work_number, //工号
                                pName: user_name, //姓名
                                pSex: sex, //性别
                                depId: department, //部门
                                pEducation: education, //学历
                                pNation: nation, //民族
                                pTitle: position, //职务
                                pDuty: work_title, //职称
                                pPoliticalStatus: political_face, //政治面貌
                                pMobile: phone, //手机号码
                                pBirths: born_date, //出生日期
                                pWorktimes: entry_date, //入职日期
                                pMaritalStatus: marriage_status, //婚姻状况
                                pState: people_status, //人事状态
                                pGraduateDates: leave_date, //毕业日期
                                pGraduateCollege: leave_school, //毕业院校
                                pMajor: profession, //专业
                                pCardid: id_card, //身份证号
                                pId: a[0].pId
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

                        console.log('修改2');
                    },
                    success: function(layero, index) {

                        layero.find('#nation option').each(function(index, el) {
                            if (a[0].pNation == $(el).text()) {
                                $(el).attr('selected', true);
                            }
                        });

                        layero.find('#nation').chosen({
                            no_results_text: "没有找到结果！", //搜索无结果时显示的提示  
                            search_contains: true, //关键字模糊搜索。设置为true，只要选项包含搜索词就会显示；设置为false，则要求从选项开头开始匹配
                            allow_single_deselect: true, //单选下拉框是否允许取消选择。如果允许，选中选项会有一个x号可以删除选项
                            disable_search: false, //禁用搜索。设置为true，则无法搜索选项。
                            disable_search_threshold: 0, //当选项少等于于指定个数时禁用搜索。
                            inherit_select_classes: true, //是否继承原下拉框的样式类，此处设为继承
                            placeholder_text_single: ' ', //单选选择框的默认提示信息，当选项为空时会显示。如果原下拉框设置了data-placeholder，会覆盖这里的值。
                            width: '200px', //设置chosen下拉框的宽度。即使原下拉框本身设置了宽度，也会被width覆盖。
                            max_shown_results: 1000, //下拉框最大显示选项数量
                            display_disabled_options: false,
                            single_backstroke_delete: false, //false表示按两次删除键才能删除选项，true表示按一次删除键即可删除
                            case_sensitive_search: false, //搜索大小写敏感。此处设为不敏感
                            group_search: false, //选项组是否可搜。此处搜索不可搜
                            include_group_label_in_selected: true, //选中选项是否显示选项分组。false不显示，true显示。默认false。
                        });

                        layero.find('.layui-layer-btn0').css('background', '#27AAE1');

                        // 出生日期
                        laydate.render({
                            elem: '#born_date',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#born_date').attr('value', value);
                            }
                        });

                        // 入职日期
                        laydate.render({
                            elem: '#entry_date',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#entry_date').attr('value', value);
                            }
                        });

                        // 毕业日期
                        laydate.render({
                            elem: '#leave_date',
                            trigger: 'click',
                            done: function(value, date, endDate) {
                                layero.find('#leave_date').attr('value', value);
                            }
                        });
                    },
                    btnAlign: 'c',
                    content: '<div class="modal-body table-layer clearfix" style="padding: 0;margin: 0;padding-right: 200px;position: relative;">' +
                        '<div class="form-info clearfix">' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>工号：</label></div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0" style="position: relative;z-index=99;">' +
                        '<input autocomplete="off" style="background-color: #fff;" type="text" class="form-control" id="work_number" value="' + a[0].pJobnum + '">' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>姓名：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" type="text" class="form-control" id="user_name" value="' + a[0].pName + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label for="orgCode"><i class="must-star">*</i>性别：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<select id="sex" style="width: 100%;height: 34px;">' +
                        '<option value="男">男</option>' +
                        '<option value="女">女</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label for="orgCode"><i class="must-star">*</i>部门：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" style="background-color: #fff;" type="text" class="form-control" value="' + a[0].depId + '" id="department">' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label for="orgCode">学历：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<select id="education" style="width: 100%;height: 34px;">' +
                        '<option value="大专">大专</option>' +
                        '<option value="本科">本科</option>' +
                        '<option value="本科">研究生</option>' +
                        '<option value="本科">硕士</option>' +
                        '<option value="本科">博士</option>' +
                        '<option value="本科">博士后</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 11">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label for="orgCode">民族：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<select id="nation" style="width: 100%;height: 34px;">' +
                        '<option></option>' +
                        '<option>汉族</option>' +
                        '<option>满族</option>' +
                        '<option>蒙古族</option>' +
                        '<option>回族</option>' +
                        '<option>藏族</option>' +
                        '<option>维吾尔族</option>' +
                        '<option>苗族</option>' +
                        '<option>彝族</option>' +
                        '<option>壮族</option>' +
                        '<option>布依族</option>' +
                        '<option>侗族</option>' +
                        '<option>瑶族</option>' +
                        '<option>白族</option>' +
                        '<option>土家族</option>' +
                        '<option>哈尼族</option>' +
                        '<option>哈萨克族</option>' +
                        '<option>傣族</option>' +
                        '<option>黎族</option>' +
                        '<option>傈僳族</option>' +
                        '<option>佤族</option>' +
                        '<option>畲族</option>' +
                        '<option>高山族</option>' +
                        '<option>拉祜族</option>' +
                        '<option>水族</option>' +
                        '<option>东乡族</option>' +
                        '<option>纳西族</option>' +
                        '<option>景颇族</option>' +
                        '<option>柯尔克孜族</option>' +
                        '<option>土族</option>' +
                        '<option>达斡尔族</option>' +
                        '<option>仫佬族</option>' +
                        '<option>羌族</option>' +
                        '<option>布朗族</option>' +
                        '<option>撒拉族</option>' +
                        '<option>毛南族</option>' +
                        '<option>仡佬族</option>' +
                        '<option>锡伯族</option>' +
                        '<option>阿昌族</option>' +
                        '<option>普米族</option>' +
                        '<option>朝鲜族</option>' +
                        '<option>塔吉克族</option>' +
                        '<option>怒族</option>' +
                        '<option>乌孜别克族</option>' +
                        '<option>俄罗斯族</option>' +
                        '<option>鄂温克族</option>' +
                        '<option>德昂族</option>' +
                        '<option>保安族</option>' +
                        '<option>裕固族</option>' +
                        '<option>京族</option>' +
                        '<option>塔塔尔族</option>' +
                        '<option>独龙族</option>' +
                        '<option>鄂伦春族</option>' +
                        '<option>赫哲族</option>' +
                        '<option>门巴族</option>' +
                        '<option>珞巴族</option>' +
                        '<option>基诺族</option>' +
                        '<option>其他</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label for="orgCode">职务：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<select id="position" style="width: 100%;height: 34px;">' +
                        '<option value="主管">总经理</option>' +
                        '<option value="经理">经理</option>' +
                        '<option value="经理">总经理助理</option>' +
                        '<option value="经理">其他</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label for="orgCode">职称：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<select id="work_title" style="width: 100%;height: 34px;">' +
                        '<option value="主管">研究实习员</option>' +
                        '<option value="经理">教授</option>' +
                        '<option value="经理">副教授</option>' +
                        '<option value="经理">其他</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label for="orgCode">政治面貌：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<select id="political_face" style="width: 100%;height: 34px;">' +
                        '<option value="群众">群众</option>' +
                        '<option value="团员">团员</option>' +
                        '<option value="团员">党员</option>' +
                        '<option value="团员">预备党员</option>' +
                        '<option value="团员">其他</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>手机号码：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" id="phone" type="text" class="form-control" value="' + a[0].pMobile + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>出生日期：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" type="number" class="form-control" id="born_date" value="' + changeDateFormat(a[0].pBirth) + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>入职日期：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" type="text" class="form-control" id="entry_date" value="' + changeDateFormat(a[0].pWorktime) + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label for="orgCode">婚姻状况：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<select id="marriage_status" style="width: 100%;height: 34px;">' +
                        '<option value="未婚">未婚</option>' +
                        '<option value="已婚">已婚</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label for="orgCode">人事状态：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<select id="people_status" style="width: 100%;height: 34px;">' +
                        '<option value="">在职</option>' +
                        '<option value="">离职</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>毕业日期：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<input readonly autocomplete="off" type="text" class="form-control" id="leave_date" value="' + changeDateFormat(a[0].pGraduateDate) + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>毕业院校：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" type="text" class="form-control" id="leave_school" value="' + a[0].pGraduateCollege + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
                        '<div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label><i class="must-star">*</i>学习专业：</label>' +
                        '</div>' +
                        '<div class="col-md-8" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" type="text" class="form-control" id="profession" value="' + a[0].pMajor + '" />' +
                        '</div>' +
                        '</div>' +
                        '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;">' +
                        '<div class="col-md-2" style="padding: 0;margin: 0;text-align: right;">' +
                        '<label>身份证号：</label>' +
                        '</div>' +
                        '<div class="col-md-10" style="padding: 0;margin: 0">' +
                        '<input autocomplete="off" type="text" class="form-control" id="id_card" value="' + a[0].pCardid + '" />' +
                        '</div>' +
                        '</div>' +
                        '</div>' +
                        '<div class="up-photo">' +
                        '<div class="photo-wrap" style="background-image: url("' + port + '"/upload/"' + a[0].pPhoto + '")"></div>' +
                        '<button class="btn btn-primary up-photo-btn" style="position: relative;cursor: pointer;width: 80px;margin-top: 20px;">' +
                        '<input type="file" name="" style="position: absolute;width: 100%;height: 100%;left: 0;top: 0;opacity: 0;font-size:0;cursor:pointer;">选择头像' +
                        '</button>' +
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
                    delData[i] = a[i].pId;
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
                            url: port + '/v1/personnel2/delePersonal',
                            type: 'get',
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
                                setTimeout(function() {
                                    location.reload();
                                }, 200)

                            }
                        });
                        console.log('确定');
                        layer.close(index);
                    },
                    btnAlign: 'c',
                    content: '<div style="text-align: center;margin-top: 40px;">确定要删除选中的数据?</div>'
                });

            }
        });


        // 导出（导出所有、选择导出）
        $("#btn_export").on('click', function() {

            location.href = port + '/v1/personnel2/export';

            // var a = $("#tb_departments").bootstrapTable('getSelections');
            // var exportData = []; //要导出的数据

            // if (a.length == 0) {
            //     console.log('导出所有')
            //     location.href = port + '/v1/materielinfo/exportMaterielInfoOnce';
            // } else {
            //     //获取选中的选项
            //     for (var i = 0; i < a.length; i++) {
            //         exportData[i] = a[i].id;
            //     }
            //     location.href = port + '/v1/materielinfo/exportMaterielInfo?ids=' + exportData.toString();
            // }
        });


    };
    return oInit;
};