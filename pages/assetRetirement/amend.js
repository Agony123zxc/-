// 获取选择的表格数据
function getSelectData() {
    var allData = $("#tb_departments").bootstrapTable('getSelections');
    return allData;
}


// 获取所有表格数据
function getAllData() {
    var data = $("#tb_departments").bootstrapTable('getData');
    return data;
}




$(function() {

    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    // //2.初始化Button的点击事件
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
    location.reload();
}



//初始化Table
var TableInit = function() {
    var oTableInit = new Object();
    oTableInit.Init = function() {
        $('#tb_departments').bootstrapTable({
            url: port + '/v1/assetsScrap/findAssetDetailMap',
            undefinedText: '',
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
            // clickToSelect: true, //是否启用点击选中行
            // height: $(window).height(), //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
            uniqueId: "areaId", //每一行的唯一标识，一般为主键列
            showToggle: false, //是否显示详细视图和列表视图的切换按钮
            cardView: false, //是否显示详细视图
            detailView: false, //是否显示父子表
            columns: [{
                checkbox: true
            }, {
                field: 'code',
                align: 'center',
                title: '资产编号'
            }, {
                field: 'name',
                align: 'center',
                title: '资产名称'
            }, {
                field: 'type',
                align: 'center',
                title: '资产类别'
            }, {
                field: 'assetNum',
                align: 'center',
                title: '数量',
            }, {
                field: 'price',
                align: 'center',
                title: '单价',
            }, {
                field: 'unit',
                align: 'center',
                title: '单位',
            }, {
                field: 'remarks',
                align: 'center',
                title: '备注',
            }],

            //加载成功时执行
            onLoadSuccess: function(data) {
                console.log(data)
                $('.fixed-table-container').css({ 'height': $(window).height() - 230 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });

            },
            //加载失败时执行
            onLoadError: function() {
                 $('.fixed-table-container').css({ 'height': $(window).height() - 230 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });
            },
            onClickRow: function(row, $element) {
                console.log(row);
            },
            onClickCell: function(field, value, row, $element) {

                $('#tb_departments td').attr('contenteditable', true);
                $('#tb_departments tr td:nth-child(2)').attr('contenteditable', false);
                $('#tb_departments tr td:nth-child(4)').attr('contenteditable', false);

                $element.blur(function() {
                    var index = $element.parent().data('index');
                    var tdValue = $element.html();
                    saveData(index, field, tdValue);
                });

            },
            //得到查询的参数
            queryParams: function(params) {
                var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
                    pageSize: params.limit, //页面大小
                    pageNum: (params.offset / params.limit) + 1, //页码
                    id: sessionStorage.getItem('checkId') //采购申请查看的id
                };
                return temp;
            }

        });
    };


    return oTableInit;
};



// 工具栏按钮事件
var ButtonInit = function() {
    var oInit = new Object();

    oInit.Init = function() {


       // 添加
        $("#btn_add").on('click', function() {

            parent.layer.open({
                type: 2,
                title: '查询',
                area: ['1100px', '600px'],
                btn: ['确定', '取消'],
                end: function() {

                },
                yes: function(index, layero) {
                    var body = parent.layer.getChildFrame('body', index);

                    if (body.find('.asset-frame').attr('src') == '') {
                        parent.layer.msg('请选择左侧资产类型');
                        return;
                    }

                    // 执行弹层为iframe内嵌套的iframe里的获取选中数据方法
                    var allData = body.find('.asset-frame')[0].contentWindow.getSelectData();
                    var selectData = allData.data;

                    console.log('勾选过来的数据', allData);

                    if (selectData.length == 0) {
                        parent.layer.msg('请勾选要添加的数据');
                        return;
                    }
                    ///////////////////////////////因为资产表字段名不一样，这里要把拿到的数据字段名转化
                    // 修改添加的土地资产的字段名
                    if (allData.type == '土地') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].assetname = selectData[i].aName; //资产名称
                            delete selectData[i].aName;

                            selectData[i].assetsid = selectData[i].aCode; //资产编号
                            delete selectData[i].aCode;

                            selectData[i].assettype = selectData[i].aType; //资产分类名称
                            delete selectData[i].aType;

                            selectData[i].assetnum = selectData[i].aNumbers; //数量
                            delete selectData[i].aNumbers;

                            selectData[i].price = selectData[i].aValue; //单价
                            delete selectData[i].aValue;

                            selectData[i].id = selectData[i].id;
                        }
                    }

                     // 修改添加的房屋资产的字段名
                    if (allData.type == '房屋') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].assetname = selectData[i].bName; //资产名称
                            delete selectData[i].bName;

                            selectData[i].assetsid = selectData[i].bCode; //资产编号
                            delete selectData[i].bCode;

                            selectData[i].assettype = selectData[i].bType; //资产分类名称
                            delete selectData[i].bType;

                            selectData[i].assetnum = selectData[i].bNumbers; //数量
                            delete selectData[i].bNumbers;

                            selectData[i].price = selectData[i].bValue; //单价
                            delete selectData[i].bValue;

                            selectData[i].id = selectData[i].id;
                        }
                    }

                     // 修改添加的构筑物资产的字段名
                    if (allData.type == '构筑物') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].assetname = selectData[i].stName; //资产名称
                            delete selectData[i].stName;

                            selectData[i].assetsid = selectData[i].stPropertynum; //资产编号
                            delete selectData[i].stPropertynum;

                            selectData[i].assettype = selectData[i].stType; //资产分类名称
                            delete selectData[i].stType;

                            selectData[i].assetnum = selectData[i].stNumbers; //数量
                            delete selectData[i].stNumbers;

                            selectData[i].price = selectData[i].stValue; //单价
                            delete selectData[i].stValue;

                            selectData[i].id = selectData[i].id;
                        }
                    }

                     // 修改添加的通用设备资产的字段名
                    if (allData.type == '通用设备') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].assetname = selectData[i].coName; //资产名称
                            delete selectData[i].coName;

                            selectData[i].assetsid = selectData[i].coCode; //资产编号
                            delete selectData[i].coCode;

                            selectData[i].assettype = selectData[i].coType; //资产分类名称
                            delete selectData[i].coType;

                            selectData[i].assetnum = selectData[i].coNumbers; //数量
                            delete selectData[i].coNumbers;

                            selectData[i].price = selectData[i].coValue; //单价
                            delete selectData[i].coValue;

                            selectData[i].id = selectData[i].id;
                        }
                    }

                     // 修改添加的专用设备资产的字段名
                    if (allData.type == '专用设备') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].assetname = selectData[i].onName; //资产名称
                            delete selectData[i].onName;

                            selectData[i].assetsid = selectData[i].onCode; //资产编号
                            delete selectData[i].onCode;

                            selectData[i].assettype = selectData[i].onType; //资产分类名称
                            delete selectData[i].onType;

                            selectData[i].assetnum = selectData[i].onNumbers; //数量
                            delete selectData[i].onNumbers;

                            selectData[i].price = selectData[i].onValue; //单价
                            delete selectData[i].onValue;

                            selectData[i].id = selectData[i].id;
                        }
                    }

                     // 修改添加的文物及陈列品资产的字段名
                    if (allData.type == '文物及陈列品') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].assetname = selectData[i].reName; //资产名称
                            delete selectData[i].reName;

                            selectData[i].assetsid = selectData[i].reCode; //资产编号
                            delete selectData[i].reCode;

                            selectData[i].assettype = selectData[i].reType; //资产分类名称
                            delete selectData[i].reType;

                            selectData[i].assetnum = selectData[i].reNumbers; //数量
                            delete selectData[i].reNumbers;

                            selectData[i].price = selectData[i].reValue; //单价
                            delete selectData[i].reValue;

                            selectData[i].id = selectData[i].id;
                        }
                    }

                     // 修改添加的图书资产的字段名
                    if (allData.type == '图书') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].assetname = selectData[i].boName; //资产名称
                            delete selectData[i].boName;

                            selectData[i].assetsid = selectData[i].boCode; //资产编号
                            delete selectData[i].boCode;

                            selectData[i].assettype = selectData[i].boType; //资产分类名称
                            delete selectData[i].boType;

                            selectData[i].assetnum = selectData[i].boNumbers; //数量
                            delete selectData[i].boNumbers;

                            selectData[i].price = selectData[i].boValue; //单价
                            delete selectData[i].boValue;

                            selectData[i].id = selectData[i].id;
                        }
                    }

                     // 修改添加的特种动植物资产的字段名
                    if (allData.type == '特种动植物') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].assetname = selectData[i].spName; //资产名称
                            delete selectData[i].spName;

                            selectData[i].assetsid = selectData[i].spCode; //资产编号
                            delete selectData[i].spCode;

                            selectData[i].assettype = selectData[i].spType; //资产分类名称
                            delete selectData[i].spType;

                            selectData[i].assetnum = selectData[i].spNumbers; //数量
                            delete selectData[i].spNumbers;

                            selectData[i].price = selectData[i].spValue; //单价
                            delete selectData[i].spValue;

                            selectData[i].id = selectData[i].id;
                        }
                    }

                       // 修改添加的家具资产的字段名
                    if (allData.type == '家具') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].assetname = selectData[i].toName; //资产名称
                            delete selectData[i].toName;

                            selectData[i].assetsid = selectData[i].toCode; //资产编号
                            delete selectData[i].toCode;

                            selectData[i].assettype = selectData[i].toType; //资产分类名称
                            delete selectData[i].toType;

                            selectData[i].assetnum = selectData[i].toNumbers; //数量
                            delete selectData[i].toNumbers;

                            selectData[i].price = selectData[i].toValue; //单价
                            delete selectData[i].toValue;

                            selectData[i].id = selectData[i].id;
                        }
                    }

                      // 修改添加的土地使用权资产的字段名
                    if (allData.type == '土地使用权') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].assetname = selectData[i].luName; //资产名称
                            delete selectData[i].luName;

                            selectData[i].assetsid = selectData[i].luAssetsNumber; //资产编号
                            delete selectData[i].luAssetsNumber;

                            selectData[i].assettype = selectData[i].luTypeName; //资产分类名称
                            delete selectData[i].luTypeName;

                            selectData[i].assetnum = selectData[i].luNumber; //数量
                            delete selectData[i].luNumber;

                            selectData[i].price = selectData[i].luValue; //单价
                            delete selectData[i].luValue;

                            selectData[i].id = selectData[i].id;
                        }
                    }

                        // 修改添加的其他资产的字段名
                    if (allData.type == '其他') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].assetname = selectData[i].pName; //资产名称
                            delete selectData[i].pName;

                            selectData[i].assetsid = selectData[i].pAssetsNumber; //资产编号
                            delete selectData[i].pAssetsNumber;

                            selectData[i].assettype = selectData[i].pTypeName; //资产分类名称
                            delete selectData[i].pTypeName;

                            selectData[i].assetnum = selectData[i].pNumber; //数量
                            delete selectData[i].pNumber;

                            selectData[i].price = selectData[i].pValue; //单价
                            delete selectData[i].pValue;

                            selectData[i].id = selectData[i].id;
                        }
                    }



                    console.log('selectData', selectData);
                    $('#tb_departments').bootstrapTable('append', selectData);
                    parent.layer.close(index);


                },
                success: function(layero, index) {
                    layero.find('.layui-layer-btn0').css('background', '#27AAE1');
                },
                btnAlign: 'c',
                content: 'search.html'
            });
        });



        // 删除表格数据
        $("#btn_delete").on('click', function() {

            var a = $("#tb_departments").bootstrapTable('getSelections');//勾选的数据
            var allData=$("#tb_departments").bootstrapTable('getData');//所有数据

            var delData = []; //要删除的数据

            if (a.length == 0) {
                parent.layer.msg('请选择要删除的数据');
            } else {

                for (var i = 0; i < a.length; i++) {
                    delData[i] = a[i].id;
                }

                if(delData.length>=allData.length){
                    parent.layer.msg('至少保留一条数据');
                    return;
                }
                
                $("#tb_departments").bootstrapTable('remove', { field: 'id', values: delData });

                console.log('删除>>>', delData);

            }
        });


    };
    return oInit;
};