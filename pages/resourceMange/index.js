 var currentTreeId='021'; //当前点击树状id
 var currentTreeText=''; //当前点击树状text



 $(function() {

     // 树状数据
     $('#tree').treeview({
         data: getTree()
     });
     // 树状数据事件
     $('#tree').on('nodeSelected', function(event, data) {
         currentTreeText = data.text;
         currentTreeId = data.id;
         console.log(data)
         $("#tb_departments").bootstrapTable('refresh');

     });

     // 左侧树状图没有选择时
     $('#tree').on('nodeUnselected', function(event, data) {
         currentTreeText = '';
         currentTreeId = '021';
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
     console.log('重置');
     location.reload();
 }

 // 树状菜单
 function getTree() {
     var tree = "";
     $.ajax({
         url: port + '/v1/resource/resourcetree',
         type: 'post',
         async: false,
         success: function(data) {
             tree = JSON.stringify(data);
         }
     });
     return tree;
 }

 //初始化Table
 var TableInit = function() {
     var oTableInit = new Object();
     oTableInit.Init = function() {
         $('#tb_departments').bootstrapTable({
             url: port + '/v1/resource/all',
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
                 field: 'reName',
                 align: 'center',
                 title: '资源名称'
             }, {
                 field: 'reLink',
                 align: 'center',
                 title: '资源链接'
             }, {
                 field: 'reIcon',
                 align: 'center',
                 title: '资源图标'
             }, {
                 field: 'reSort',
                 align: 'center',
                 title: '资源排序'
             }, {
                 field: 'reMark',
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
     	     if($("#reNameSearch").val()!=""){
     	     	currentTreeId="";
     	     }
             var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
             pageSize: params.limit, //页面大小
             pageNum: (params.offset/params.limit)+1, //页码
             pId: currentTreeId, //父id
             resourceName:$("#reNameSearch").val()
         };
         return temp;
     };
     return oTableInit;
 };

 //添加保存弹窗
 var ButtonInit = function() {
     var oInit = new Object();
     var postdata = {};

     oInit.Init = function() {
         // 添加表格数据
         $("#btn_add").on('click', function() {
             if (currentTreeId =='') {
                 layer.msg('请选择左侧要添加材料类型的父级')
                 return;
             }
             layer.open({
                 type: 1,
                 title: '添加',
                 area: ['500px', '400px'],
                 btn: ['确定', '取消'],
                 yes: function(index, layero) {
                     if (layero.find('#reName').val() == '') {
                         layer.msg('请输入资源名称');
                         return;
                     }
                     $.ajax({
                         url: port + '/v1/resource/save',
                         type: 'post',
                         data: {
                             rePid: currentTreeId,
                             reLink: layero.find('#reLink').val(), 
                             reType: layero.find('#reType').val(), 
                             reName:layero.find('#reName').val(), 
                             reSort:layero.find('#reSort').val(), 
                             reIcon:layero.find('#reIcon').val(), 
                             reMark: layero.find('#reMark').val()
                         },
                         success: function(data) {
                             $("#tb_departments").bootstrapTable('refresh');
                             $('#tree').treeview({ data: getTree() });
                             layer.msg('添加成功');
                             layer.close(index);
                             location.reload();
                         }
                     });
                 },
                 success: function(layero, index) {
                     layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                 },
                 btnAlign: 'c',
                 content: 
                     '<div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">'
                            +'<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">'
                                +'<div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">'
                                    +'<label for="orgCode"><i class="must-star">*</i>资源类型：</label>'
                                +'</div>'
                                +'<div class="col-md-9" style="padding: 0;margin: 0">'
                                    +'<select autocomplete="off" id="reType" type="text" class="form-control"><option value="1">菜单</option><option value="2">功能</option><select/>'
                                +'</div>'
                            +'</div>'
                            + '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
			                  '<div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">' +
			                  '<label><i class="must-star">*</i>资源名称：</label>' +
			                  '</div>' +
			                  '<div class="col-md-9" style="padding: 0;margin: 0">' +
			                  '<input autocomplete="off" id="reName"  type="text" class="form-control" />' +
			                  '</div>' +
			                  '</div>'+
			                  '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
			                  '<div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">' +
			                  '<label>资源链接：</label>' +
			                  '</div>' +
			                  '<div class="col-md-9" style="padding: 0;margin: 0">' +
			                  '<input autocomplete="off" id="reLink"  type="text" class="form-control" />' +
			                  '</div>' +
			                  '</div>'+
			                   '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
			                  '<div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">' +
			                  '<label>资源排序：</label>' +
			                  '</div>' +
			                  '<div class="col-md-9" style="padding: 0;margin: 0">' +
			                  '<input autocomplete="off" id="reSort" placeholder="请填写数字" type="text" class="form-control" />' +
			                  '</div>' +
			                  '</div>'+
			                  '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
			                  '<div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">' +
			                  '<label>资源图标：</label>' +
			                  '</div>' +
			                  '<div class="col-md-9" style="padding: 0;margin: 0">' +
			                  '<input autocomplete="off" id="reIcon"  type="text" class="form-control" />' +
			                  '</div>' +
			                  '</div>'
                                +'<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">'
                                +'<div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">'
                                +'<label>备注：</label>'
                                +'</div>'
                                +'<div class="col-md-9" style="padding: 0;margin: 0;">'
                                +'<textarea class="form-control" id="reMark" rows="2" style="resize: none;"></textarea>'
                                +'</div>'
                            +'</div>'
                        +'</div>'
             });
         });

         // 修改表格数据
         $("#btn_edit").on('click', function() {
             var a = $("#tb_departments").bootstrapTable('getSelections');
             if (a.length == 1) {
                 layer.open({
                     type: 1,
                     title: '修改',
                     area: ['500px', '400px'],
                     btn: ['确定', '取消'],
                     yes: function(index, layero) {
                         var reId = a[0].reId
                         if (layero.find('#reName').val() == '') {
                             layer.msg('请输入资源名称');
                             return;
                         }
                         $.ajax({
                             url: port + '/v1/resource/update',
                             type: 'post',
                             data: {
	                                 reId: reId,
	                                 rePid: a[0].pId,
		                             reLink: layero.find('#reLink').val(), 
		                             reType: layero.find('#reType').val(), 
		                             reName:layero.find('#reName').val(), 
		                             reSort:layero.find('#reSort').val(), 
		                             reIcon:layero.find('#reIcon').val(), 
		                             reMark: layero.find('#reMark').val()
	                             },
                             success: function(data) {
                                 $("#tb_departments").bootstrapTable('refresh');
                                 $('#tree').treeview({ data: getTree() });
                                 layer.msg('修改成功');
                                 layer.close(index);
                                 location.reload();
                             }
                         });
                     },
                     success: function(layero, index) {
                         layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                     },
                     btnAlign: 'c',
                     content: 
                      '<div class="modal-body table-layer" style="padding: 0;margin: 0 20px;z-index: 10">'
                            +'<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">'
                                +'<div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">'
                                    +'<label for="orgCode"><i class="must-star">*</i>资源类型：</label>'
                                +'</div>'
                                +'<div class="col-md-9" style="padding: 0;margin: 0">'
                                    +'<select autocomplete="off" id="reType" type="text" class="form-control"><option value="1">菜单</option><option value="2">功能</option><select/>'
                                +'</div>'
                            +'</div>'
                            + '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
			                  '<div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">' +
			                  '<label><i class="must-star">*</i>资源名称：</label>' +
			                  '</div>' +
			                  '<div class="col-md-9" style="padding: 0;margin: 0">' +
			                  '<input autocomplete="off" id="reName" value='+a[0].reName+'  type="text" class="form-control" />' +
			                  '</div>' +
			                  '</div>'+
			                  '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
			                  '<div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">' +
			                  '<label>资源链接：</label>' +
			                  '</div>' +
			                  '<div class="col-md-9" style="padding: 0;margin: 0">' +
			                  '<input autocomplete="off" id="reLink" value='+a[0].reLink+' type="text" class="form-control" />' +
			                  '</div>' +
			                  '</div>'+
			                   '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
			                  '<div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">' +
			                  '<label>资源排序：</label>' +
			                  '</div>' +
			                  '<div class="col-md-9" style="padding: 0;margin: 0">' +
			                  '<input autocomplete="off" id="reSort" value='+a[0].reSort+' placeholder="请填写数字" type="text" class="form-control" />' +
			                  '</div>' +
			                  '</div>'+
			                  '<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">' +
			                  '<div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">' +
			                  '<label>资源图标：</label>' +
			                  '</div>' +
			                  '<div class="col-md-9" style="padding: 0;margin: 0">' +
			                  '<input autocomplete="off" id="reIcon" value='+a[0].reIcon+' type="text" class="form-control" />' +
			                  '</div>' +
			                  '</div>'
                                +'<div class="form-group col-md-12" style="padding: 0;margin: 0;padding-top: 8px;z-index: 10">'
                                +'<div class="col-md-3" style="padding: 0;margin: 0;text-align: right;">'
                                +'<label>备注：</label>'
                                +'</div>'
                                +'<div class="col-md-9" style="padding: 0;margin: 0;">'
                                +'<textarea class="form-control" id="reMark"  rows="2" style="resize: none;">'+a[0].reMark+'</textarea>'
                                +'</div>'
                            +'</div>'
                        +'</div>'
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
                     delData[i] = a[i].reId;
                 }
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
                             url: port + '/v1/resource/delete',
                             type: 'post',
                             data: {
                                 resourceIds: delData.toString()
                             },
                             success: function(data) {
                                 if (data.rescode == '0000') {
                                     $("#tb_departments").bootstrapTable('refresh');
                                     $('#tree').treeview({ data: getTree() });
                                     layer.msg('删除成功');
                                     layer.close(index);
                                     location.reload();
                                 }
                                 if (data.rescode == '0001') {
                                     layer.msg(data.data);
                                 }
                             }
                         });
                     },
                     btnAlign: 'c',
                     content: '<div style="margin:20px">确定要删除选中的数据（如果存在子节点，将会一并删除）?</div>'
                 });
             }
         });
     };
     return oInit;
 };