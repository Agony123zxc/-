var phongReg = /^[1][3,4,5,7,8][0-9]{9}$/; //手机号格式验证
var currentTreeId = ''; //当前点击树状id
var currentTreeText = ''; //当前点击树状text

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
            url: port + '/v1/personnel2/selePersonals',
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
            },{
                field: 'pSex',
                align: 'center',
                title: '性别'
            }, {
                field: 'pState',
                align: 'center',
                title: '人员状态'
            }, {
                field: 'depId',
                align: 'center',
                title: '部门'
            }, {
                field: 'pCardid',
                align: 'center',
                title: '身份证号'
            }, {
                field: 'pMobile',
                align: 'center',
                title: '手机号码'
            }],

            //加载成功时执行
            onLoadSuccess: function(data) {
                console.log('成功加载表格数据', data);
                $('.fixed-table-container').css({ 'height': $(window).height() - 120 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });
            },
            //加载失败时执行
            onLoadError: function() {
                $('.fixed-table-container').css({ 'height': $(window).height() - 120 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });
            },
            onClickRow: function(row, $element) {}
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function(params) {
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            pageSize: params.limit, //页面大小
            pageNum: (params.offset/params.limit)+1, //页码
            pJobnum: $('#work_number').val(), //工号
            pName: $('#user_name').val(), //姓名
            orgName: currentTreeText,
            pCardid:$('#id_card').val()//身份证号
        };
        return temp;
    };

    return oTableInit;
};





// 导入
$("#btn_import").on('click', function() {
    console.log('导入');
    layer.open({
        type: 1,
        title: '导入',
        btn: ['导入', '关闭'],
        btnAlign: 'c',
        area: ['470px', '320px'],
        yes: function(index, layero) {
            console.log('导入');
            // layer.close(index);
        },
        content: `
                <div class="modal-body" style="overflow: hidden;margin-top: 20px;">
                            <div class="form-group col-md-12" style="padding: 0;margin: 0;z-index: 10">
                                <div class="col-md-3" style="padding: 0;margin: 0;text-align: center">
                                    <label for="remarks">模板：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <a href="javascript:;"><strong>点击下载模板</strong></a>
                                </div>
                            </div>
                            <div class="form-group col-md-12" style="margin-top: 20px;">
                                <form id="importFile" name="importFile" class="form-horizontal" method="post" enctype="multipart/form-data">
                                    <div class="col-md-3" style="padding: 0;margin: 0;text-align: center">
                                        <label class="control-label">选择文件：</label>
                                    </div>
                                    <div class="col-md-8" style="padding: 0;margin: 0">
                                        <input id="importFiles" name="importFiles" type="file" class="file" data-show-preview="false" placeholder="请选择您要导入的Excel文件">
                                    </div>
                                </form>
                            </div>
                        </div>
             `

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
                '<li><span class="title">出生日期：</span>' + row.pBirth + '</li>' +
                '<li><span class="title">入职日期：</span>' + row.pWorktime + '</li>' +
                '<li><span class="title">婚姻状况：</span>' + row.pMaritalStatus + '</li>' +
                '<li><span class="title">人事状态：</span>' + row.pState + '</li>' +
                '<li><span class="title">毕业日期：</span>' + row.pGraduateDate + '</li>' +
                '<li><span class="title">毕业院校：</span>' + row.pGraduateCollege + '</li>' +
                '<li><span class="title">学习专业：</span>' + row.pMajor + '</li>' +
                '<li><span class="title">身份证号：</span>' + row.pCardid + '</li>' +
                '</ul>' +
                '<div class="head-img" style="background-image: url(' + row.pPhoto + ')"></div>' +
                '</div>'
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
            if (currentTreeText == '') {
                layer.msg('请在左侧选择要添加的部门');
                return;
            }
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
                            pCardid: id_card //身份证号
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
                content: `
                     <div class="modal-body table-layer clearfix" style="padding: 0;margin: 0;padding-right: 200px;position: relative;">
                            <div class="form-info clearfix">
                                <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label><i class="must-star">*</i>工号：</label></div>
                                <div class="col-md-8" style="padding: 0;margin: 0" style="position: relative;z-index=99;">
                                    <input autocomplete="off" style="background-color: #fff;" type="text" class="form-control" id="work_number">
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label><i class="must-star">*</i>姓名：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input autocomplete="off" type="text" class="form-control" id="user_name" />
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode"><i class="must-star">*</i>性别：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <select id="sex" style="width: 100%;height: 34px;">
                                        <option value="男">男</option>
                                        <option value="女">女</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode"><i class="must-star">*</i>部门：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input autocomplete="off" style="background-color: #fff;" type="text" class="form-control" value="" id="department">
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode">学历：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <select id="education" style="width: 100%;height: 34px;">
                                        <option value="大专">大专</option>
                                        <option value="本科">本科</option>
                                        <option value="本科">研究生</option>
                                        <option value="本科">硕士</option>
                                        <option value="本科">博士</option>
                                        <option value="本科">博士后</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode">民族：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <select id="nation" style="width: 100%;height: 34px;">
                                        <option>汉族</option>
                                        <option>满族</option>
                                        <option>蒙古族</option>
                                        <option>回族</option>
                                        <option>藏族</option>
                                        <option>维吾尔族</option>
                                        <option>苗族</option>
                                        <option>彝族</option>
                                        <option>壮族</option>
                                        <option>布依族</option>
                                        <option>侗族</option>
                                        <option>瑶族</option>
                                        <option>白族</option>
                                        <option>土家族</option>
                                        <option>哈尼族</option>
                                        <option>哈萨克族</option>
                                        <option>傣族</option>
                                        <option>黎族</option>
                                        <option>傈僳族</option>
                                        <option>佤族</option>
                                        <option>畲族</option>
                                        <option>高山族</option>
                                        <option>拉祜族</option>
                                        <option>水族</option>
                                        <option>东乡族</option>
                                        <option>纳西族</option>
                                        <option>景颇族</option>
                                        <option>柯尔克孜族</option>
                                        <option>土族</option>
                                        <option>达斡尔族</option>
                                        <option>仫佬族</option>
                                        <option>羌族</option>
                                        <option>布朗族</option>
                                        <option>撒拉族</option>
                                        <option>毛南族</option>
                                        <option>仡佬族</option>
                                        <option>锡伯族</option>
                                        <option>阿昌族</option>
                                        <option>普米族</option>
                                        <option>朝鲜族</option>
                                        <option>塔吉克族</option>
                                        <option>怒族</option>
                                        <option>乌孜别克族</option>
                                        <option>俄罗斯族</option>
                                        <option>鄂温克族</option>
                                        <option>德昂族</option>
                                        <option>保安族</option>
                                        <option>裕固族</option>
                                        <option>京族</option>
                                        <option>塔塔尔族</option>
                                        <option>独龙族</option>
                                        <option>鄂伦春族</option>
                                        <option>赫哲族</option>
                                        <option>门巴族</option>
                                        <option>珞巴族</option>
                                        <option>基诺族</option>
                                        <option>其他</option>
                                    </select>
                                </div>
                            </div>
                           
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode">职务：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <select id="position" style="width: 100%;height: 34px;">
                                        <option value="主管">总经理</option>
                                        <option value="经理">经理</option>
                                        <option value="经理">总经理助理</option>
                                        <option value="经理">其他</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode">职称：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <select id="work_title" style="width: 100%;height: 34px;">
                                        <option value="主管">研究实习员</option>
                                        <option value="经理">教授</option>
                                        <option value="经理">副教授</option>
                                        <option value="经理">其他</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode">政治面貌：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <select id="political_face" style="width: 100%;height: 34px;">
                                        <option value="群众">群众</option>
                                        <option value="团员">团员</option>
                                        <option value="团员">党员</option>
                                        <option value="团员">预备党员</option>
                                        <option value="团员">其他</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label><i class="must-star">*</i>手机号码：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input autocomplete="off" id="phone" type="text" class="form-control" />
                                </div>
                            </div>
                             <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label>出生日期：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input readonly autocomplete="off" type="text" class="form-control" id="born_date" />
                                </div>
                            </div>
                            
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label>入职日期：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input readonly autocomplete="off" type="text" class="form-control" id="entry_date" />
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode">婚姻状况：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <select id="marriage_status" style="width: 100%;height: 34px;">
                                        <option value="未婚">未婚</option>
                                        <option value="已婚">已婚</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode">人事状态：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <select id="people_status" style="width: 100%;height: 34px;">
                                        <option value="">在职</option>
                                        <option value="">离职</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label>毕业日期：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input readonly autocomplete="off" type="text" class="form-control" id="leave_date" />
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label><i class="must-star">*</i>毕业院校：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input autocomplete="off" type="text" class="form-control" id="leave_school" />
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label><i class="must-star">*</i>学习专业：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input autocomplete="off" type="text" class="form-control" id="profession" />
                                </div>
                            </div>
                            <div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;">
                                <div class="col-md-2" style="padding: 0;margin: 0;text-align: right;">
                                    <label>身份证号：</label>
                                </div>
                                <div class="col-md-10" style="padding: 0;margin: 0">
                                    <input autocomplete="off" type="text" class="form-control" id="id_card" />
                                </div>
                            </div>
                            </div>
                            <div class="up-photo">
                                <div class="photo-wrap"></div>
                                <button class="btn btn-primary up-photo-btn" style="position: relative;cursor: pointer;width: 80px;margin-top: 20px;">
                                    <input type="file" name="" style="position: absolute;width: 100%;height: 100%;left: 0;top: 0;opacity: 0;font-size:0;cursor:pointer;">
                                选择头像
                                </button>
                            </div>
                        </div>
                 `
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
                                pCardid: id_card //身份证号
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
                    content: `
                     <div class="modal-body table-layer clearfix" style="padding: 0;margin: 0;padding-right: 200px;position: relative;">
                            <div class="form-info clearfix">
                                <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label><i class="must-star">*</i>工号：</label></div>
                                <div class="col-md-8" style="padding: 0;margin: 0" style="position: relative;z-index=99;">
                                    <input autocomplete="off" style="background-color: #fff;" type="text" class="form-control" id="work_number" value="${a[0].pJobnum}">
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label><i class="must-star">*</i>姓名：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input autocomplete="off" type="text" class="form-control" id="user_name" value="${a[0].pName}" />
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode"><i class="must-star">*</i>性别：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <select id="sex" style="width: 100%;height: 34px;">
                                        <option value="男">男</option>
                                        <option value="女">女</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode"><i class="must-star">*</i>部门：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input autocomplete="off" style="background-color: #fff;" type="text" class="form-control" value="${a[0].depId}" id="department">
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode">学历：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <select id="education" style="width: 100%;height: 34px;">
                                        <option value="大专">大专</option>
                                        <option value="本科">本科</option>
                                        <option value="本科">研究生</option>
                                        <option value="本科">硕士</option>
                                        <option value="本科">博士</option>
                                        <option value="本科">博士后</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode">民族：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <select id="nation" style="width: 100%;height: 34px;">
                                        <option>汉族</option>
                                        <option>满族</option>
                                        <option>蒙古族</option>
                                        <option>回族</option>
                                        <option>藏族</option>
                                        <option>维吾尔族</option>
                                        <option>苗族</option>
                                        <option>彝族</option>
                                        <option>壮族</option>
                                        <option>布依族</option>
                                        <option>侗族</option>
                                        <option>瑶族</option>
                                        <option>白族</option>
                                        <option>土家族</option>
                                        <option>哈尼族</option>
                                        <option>哈萨克族</option>
                                        <option>傣族</option>
                                        <option>黎族</option>
                                        <option>傈僳族</option>
                                        <option>佤族</option>
                                        <option>畲族</option>
                                        <option>高山族</option>
                                        <option>拉祜族</option>
                                        <option>水族</option>
                                        <option>东乡族</option>
                                        <option>纳西族</option>
                                        <option>景颇族</option>
                                        <option>柯尔克孜族</option>
                                        <option>土族</option>
                                        <option>达斡尔族</option>
                                        <option>仫佬族</option>
                                        <option>羌族</option>
                                        <option>布朗族</option>
                                        <option>撒拉族</option>
                                        <option>毛南族</option>
                                        <option>仡佬族</option>
                                        <option>锡伯族</option>
                                        <option>阿昌族</option>
                                        <option>普米族</option>
                                        <option>朝鲜族</option>
                                        <option>塔吉克族</option>
                                        <option>怒族</option>
                                        <option>乌孜别克族</option>
                                        <option>俄罗斯族</option>
                                        <option>鄂温克族</option>
                                        <option>德昂族</option>
                                        <option>保安族</option>
                                        <option>裕固族</option>
                                        <option>京族</option>
                                        <option>塔塔尔族</option>
                                        <option>独龙族</option>
                                        <option>鄂伦春族</option>
                                        <option>赫哲族</option>
                                        <option>门巴族</option>
                                        <option>珞巴族</option>
                                        <option>基诺族</option>
                                        <option>其他</option>
                                    </select>
                                </div>
                            </div>
                           
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode">职务：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <select id="position" style="width: 100%;height: 34px;">
                                        <option value="主管">总经理</option>
                                        <option value="经理">经理</option>
                                        <option value="经理">总经理助理</option>
                                        <option value="经理">其他</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode">职称：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <select id="work_title" style="width: 100%;height: 34px;">
                                        <option value="主管">研究实习员</option>
                                        <option value="经理">教授</option>
                                        <option value="经理">副教授</option>
                                        <option value="经理">其他</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode">政治面貌：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <select id="political_face" style="width: 100%;height: 34px;">
                                        <option value="群众">群众</option>
                                        <option value="团员">团员</option>
                                        <option value="团员">党员</option>
                                        <option value="团员">预备党员</option>
                                        <option value="团员">其他</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label><i class="must-star">*</i>手机号码：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input autocomplete="off" id="phone" type="text" class="form-control" value="${a[0].pMobile}" />
                                </div>
                            </div>
                             <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label>出生日期：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input readonly autocomplete="off" type="text" class="form-control" id="born_date" value="${a[0].pBirth}" />
                                </div>
                            </div>
                            
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label>入职日期：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input readonly autocomplete="off" type="text" class="form-control" id="entry_date" value="${a[0].pWorktime}" />
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode">婚姻状况：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <select id="marriage_status" style="width: 100%;height: 34px;">
                                        <option value="未婚">未婚</option>
                                        <option value="已婚">已婚</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode">人事状态：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <select id="people_status" style="width: 100%;height: 34px;">
                                        <option value="">在职</option>
                                        <option value="">离职</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label>毕业日期：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input readonly autocomplete="off" type="text" class="form-control" id="leave_date" />
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label><i class="must-star">*</i>毕业院校：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input autocomplete="off" type="text" class="form-control" id="leave_school" value="${a[0].pGraduateCollege}" />
                                </div>
                            </div>
                            <div class="form-group col-md-6" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-4" style="padding: 0;margin: 0;text-align: right;">
                                    <label><i class="must-star">*</i>学习专业：</label>
                                </div>
                                <div class="col-md-8" style="padding: 0;margin: 0">
                                    <input autocomplete="off" type="text" class="form-control" id="profession" />
                                </div>
                            </div>
                            <div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;">
                                <div class="col-md-2" style="padding: 0;margin: 0;text-align: right;">
                                    <label>身份证号：</label>
                                </div>
                                <div class="col-md-10" style="padding: 0;margin: 0">
                                    <input autocomplete="off" type="text" class="form-control" id="id_card" />
                                </div>
                            </div>
                            </div>
                            <div class="up-photo">
                                <div class="photo-wrap"></div>
                                <button class="btn btn-primary up-photo-btn" style="position: relative;cursor: pointer;width: 80px;margin-top: 20px;">
                                    <input type="file" name="" style="position: absolute;width: 100%;height: 100%;left: 0;top: 0;opacity: 0;font-size:0;cursor:pointer;">
                                选择头像
                                </button>
                            </div>
                        </div>
                 `
                });


            } else {
                layer.msg('请选择单行数据');
            }
        });


        // 删除表格数据
        $("#btn_delete").on('click', function() {
            var a = $("#tb_departments").bootstrapTable('getSelections');
            console.log(a)
            var delData = []; //要删除的数据
            var delName=[]; //要删除的姓名

            if (a.length == 0) {
                layer.msg('请选择要添加的数据');
            } else {
                //获取选中的pId
                for (var i = 0; i < a.length; i++) {
                    delData[i] = a[i].pId;
                    delName[i]=a[i].pName;
                }


                console.log('添加的数据', delName);

                sessionStorage.setItem('selectName', delName);//选择的名字存入缓存
                sessionStorage.setItem('selectId', delData);//选择的名字的id存入缓存

            }
        });


        // 导出（导出所有、选择导出）
        $("#btn_export").on('click', function() {
            var a = $("#tb_departments").bootstrapTable('getSelections');
            var exportData = []; //要导出的数据

            if (a.length == 0) {
                console.log('导出所有')
                location.href = port + '/v1/materielinfo/exportMaterielInfoOnce';
            } else {
                //获取选中的选项
                for (var i = 0; i < a.length; i++) {
                    exportData[i] = a[i].id;
                }
                location.href = port + '/v1/materielinfo/exportMaterielInfo?ids=' + exportData.toString();
            }
        });


    };
    return oInit;
};