 var upOrgId; //数据表格当前点击上级机构id
 var clickOrgId; //当前点击树状id

 var reg = /^[1][3,4,5,7,8][0-9]{9}$/; //手机号格式验证

 $(function() {

     
     //1.初始化Table
     var oTable = new TableInit();
     oTable.Init();

     //2.初始化Button的点击事件
     var oButtonInit = new ButtonInit();
     oButtonInit.Init();

 });


 // 流程设计
 $('#btn_design').on('click', function() {
     var a = $("#tb_departments").bootstrapTable('getSelections');
     console.log('流程设计', a[0]);

     if (a.length == 1) {
        sessionStorage.setItem('processId', a[0].peId);//给选择当前的peId存入缓存
         layer.open({
             type: 2,
             area: ['800px', '450px'],
             btn: ['确定', '取消'],
             btnAlign: 'c',
             title: '添加姓名',
             end:function(){
                sessionStorage.removeItem('processId');//删除给选择当前的peId存入的缓存
             },
             success: function(layero, index) {
                 layero.find('.layui-layer-btn0').css('background', '#27AAE1');
             },
             yes: function(index, layero) {
                 //按钮【按钮一】的回调
                 layer.close(index);
             },
             content: 'processDesign.html'
         });
     } else {
         layer.msg('请选择单条数据');
     }

 })

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
     $('#name').val('');
     $("#tb_departments").bootstrapTable('refresh');
 }







 //初始化Table
 var TableInit = function() {
     var oTableInit = new Object();
     oTableInit.Init = function() {
         $('#tb_departments').bootstrapTable({
             url: port + '/v1/processengine/all',
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
                 field: 'peName',
                 align: 'center',
                 title: '名称'
             }, {
                 field: 'peSort',
                 align: 'center',
                 title: '排序'
             }, {
                 field: 'peExplain',
                 align: 'center',
                 title: '备注'
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
             pageNum: (params.offset/params.limit)+1, //页码
             peName: $('#name').val() //名称
         };
         return temp;
     };
     return oTableInit;
 };


 // 导出
 $('#btn_export').on('click', function() {
     location.href = port + '/organize/export';
 });


 // 授权
 $('#btn_authorize').on('click', function() {
     // console.log('授权')
 });


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
         layer.open({
             type: 1,
             title: '详情',
             btn: '关闭',
             btnAlign: 'c',
             area: ['350px', '250px'],
             success: function(layero, index) {
                 layero.find('.layui-layer-btn0').css({ background: '#fff', color: '#333', borderColor: '#ddd', padding: '0 20px' });
             },
             content: `
                <div class="detail-layer">
                    <ul>
                        <li>南校区-一号楼-一层-101房间</li>
                        <li>南校区-一号楼-一层-101房间</li>
                        <li>南校区-一号楼-一层-101房间</li>
                    </ul>
                </div>
             `

         });
         console.log('行数据', row);
     }
 };

 // $(document).on('blur','input[name="orgName"]',function(){
 //     console.log('失去焦点')
 // })



 // 工具栏按钮事件
 var ButtonInit = function() {
     var oInit = new Object();
     var postdata = {};

     oInit.Init = function() {
         // 添加表格数据
         $("#btn_add").on('click', function() {
             console.log('添加')
             layer.open({
                 type: 1,
                 title: '添加',
                 area: ['400px', '300px'],
                 btn: ['确定', '取消'],
                 yes: function(index, layero) {
                     console.log('确定');
                     var orgUp = layero.find('input[name="orgUp"]'); //上级机构
                     var orgNumber = layero.find('input[name="orgNumber"]'); //编号
                     var orgName = layero.find('input[name="orgName"]'); //机构名称
                     var orgSimpleName = layero.find('input[name="orgSimpleName"]'); //机构简称
                     var orgPerson = layero.find('input[name="orgPerson"]'); //负责人
                     var orgPhone = layero.find('input[name="orgPhone"]'); //联系电话
                     var remarks = layero.find('textarea[name="remarks"]'); //备注


                     $.ajax({
                         url: port + '/organize/add',
                         type: 'post',
                         data: {
                             parentCode: upOrgId,
                             orgCode: orgNumber.val(),
                             orgName: orgName.val(),
                             orgSimpleName: orgSimpleName.val(),
                             chargePerson: orgPerson.val(),
                             phone: orgPhone.val(),
                             remarks: remarks.val()
                         },
                         success: function(data) {
                             console.log('添加成功' + data);
                             $("#tb_departments").bootstrapTable('refresh'); //刷新表格数据
                             

                             location.reload();
                         }
                     });

                     layer.msg('添加成功');
                     layer.close(index);
                 },
                 success: function(layero, index) {
                     // 添加姓名
                     layero.find('input[name=selectName]').on('click', function() {
                         layer.open({
                             type: 2,
                             area: ['1000px', '500px'],
                             btn: ['确定', '取消'],
                             btnAlign: 'c',
                             title: '添加姓名',
                             yes: function(index, layero) {
                                 //按钮【按钮一】的回调
                                 layer.close(index);
                             },
                             content: 'addName.html'
                         });
                     });

                 },
                 btnAlign: 'c',
                 content: `
                     <div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">
                            <div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode"><i class="must-star">*</i>姓名：</label>
                                </div>
                                <div class="col-md-9" style="padding: 0;margin: 0">
                                    <input style='background:#fff;' placeholder='点击选择' readonly autocomplete="off" name="selectName" type="text" class="form-control"/>
                                </div>
                            </div>
                            <div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode"><i class="must-star">*</i>角色名称：</label>
                                </div>
                                <div class="col-md-9" style="padding: 0;margin: 0">
                                    <select class="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">
                                    <label>备注：</label>
                                </div>
                                <div class="col-md-9" style="padding: 0;margin: 0;">
                                    <textarea class="form-control" name="remarks" rows="2" style="resize: none;"></textarea>
                                </div>
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
                     area: ['350px', '300px'],
                     btn: ['确定', '取消'],
                     yes: function(index, layero) {
                         var name = layero.find('#name').val(); //名称
                         var sort = layero.find('#sort').val(); //排序
                         var remark = layero.find('#remark').val(); //备注


                         $.ajax({
                             url: port + '/v1/processenginedetail/update',
                             type: 'post',
                             data: {
                                 peId: a[0].peId,
                                 peName: name, //名称
                                 peSort: sort, //排序
                                 peExplain: remark //备注
                             },
                             success: function(data) {
                                 console.log('修改成功' + data);
                                 $("#tb_departments").bootstrapTable('refresh');
                                 layer.msg('修改成功');
                                 layer.close(index);
                             }
                         });


                     },
                     success: function(layero, index) {
                         layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                     },
                     btnAlign: 'c',
                     content: `
                     <div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">
                            <div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode">名称：</label>
                                </div>
                                <div class="col-md-9" style="padding: 0;margin: 0">
                                    <input id="name" autocomplete="off" type="text" class="form-control"/>
                                </div>
                            </div>
                            <div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">
                                    <label for="orgCode">排序：</label>
                                </div>
                                <div class="col-md-9" style="padding: 0;margin: 0">
                                    <input id="sort" autocomplete="off" type="text" class="form-control"/>
                                </div>
                            </div>
                            <div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">
                                <div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">
                                    <label>备注：</label>
                                </div>
                                <div class="col-md-9" style="padding: 0;margin: 0;">
                                    <textarea id="remark" class="form-control" rows="2" style="resize: none;"></textarea>
                                </div>
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
             console.log('删除')
             var a = $("#tb_departments").bootstrapTable('getSelections');
             var delData = []; //要删除的数据

             if (a.length == 0) {
                 layer.msg('请选择要删除的数据');
             } else {
                 //获取选中的ID
                 for (var i = 0; i < a.length; i++) {
                     delData[i] = a[i].orgId;
                 }
                 console.log('删除的数据', delData);

                 layer.open({
                     type: 1,
                     title: '提示',
                     area: ['300px', '200px'],
                     btn: ['确定', '取消'],
                     yes: function(index, layero) {
                         $.ajax({
                             url: port + '/organize/delete',
                             type: 'post',
                             data: {
                                 orgId: delData
                             },
                             success: function(data) {
                                 if (data.rescode == '0000') {
                                     $("#tb_departments").bootstrapTable('refresh'); //刷新表格数据
                                    

                                     layer.msg('删除成功');
                                     location.reload();
                                 }
                                 if (data.rescode == '0001') {
                                     layer.msg(data.data);
                                 }
                             }
                         });
                         console.log('确定');
                         layer.close(index);
                     },
                     btnAlign: 'c',
                     content: '<div style="margin:20px">确定要删除选中的数据（如果存在子节点，将会一并删除）?</div>'
                 });

             }
         });


     };
     return oInit;
 };