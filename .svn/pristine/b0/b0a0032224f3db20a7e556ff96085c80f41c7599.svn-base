

// 获取选择的表格数据
function getSelectData() {
    var allData = $("#tb_departments").bootstrapTable('getSelections');
    return allData;
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


// 获取出库单部门 
$.ajax({
    url: port + '/v1/outWarehouse/getDepartments',
    type: 'get',
    success: function(res) {
        console.log('部门下拉', res);
        for (var i = 0; i < res.length; i++) {
            $('#newDepart').append('<option value=' + res[i].orgName + '>' + res[i].orgName + '</option>');
        }
        // $("#oldDepart option[value='器材室']").attr("selected","selected"); //回显

         // 调入部门下拉框
        $('#newDepart').chosen({
            no_results_text: "没有找到结果！", //搜索无结果时显示的提示  
            search_contains: true, //关键字模糊搜索。设置为true，只要选项包含搜索词就会显示；设置为false，则要求从选项开头开始匹配
            allow_single_deselect: true, //单选下拉框是否允许取消选择。如果允许，选中选项会有一个x号可以删除选项
            disable_search: false, //禁用搜索。设置为true，则无法搜索选项。
            disable_search_threshold: 0, //当选项少等于于指定个数时禁用搜索。
            inherit_select_classes: true, //是否继承原下拉框的样式类，此处设为继承
            placeholder_text_single: ' ', //单选选择框的默认提示信息，当选项为空时会显示。如果原下拉框设置了data-placeholder，会覆盖这里的值。
            width: '180px', //设置chosen下拉框的宽度。即使原下拉框本身设置了宽度，也会被width覆盖。
            max_shown_results: 1000, //下拉框最大显示选项数量
            display_disabled_options: false,
            single_backstroke_delete: false, //false表示按两次删除键才能删除选项，true表示按一次删除键即可删除
            case_sensitive_search: false, //搜索大小写敏感。此处设为不敏感
            group_search: false, //选项组是否可搜。此处搜索不可搜
            include_group_label_in_selected: true, //选中选项是否显示选项分组。false不显示，true显示。默认false。
        });


    }
})




//初始化Table
var TableInit = function() {
    var oTableInit = new Object();
    oTableInit.Init = function() {
        $('#tb_departments').bootstrapTable({
            url: port + 'table.json',
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
                field: 'aoNumber',
                align: 'center',
                title: '资产编号'
            }, {
                field: 'aoAssetsName',
                align: 'center',
                title: '资产名称'
            }, {
                field: 'aoAssetsType',
                align: 'center',
                title: '资产类别'
            }, {
                field: 'aoAllotNumber',
                align: 'center',
                title: '数量',
            }, {
                field: 'aoYuliu2',
                align: 'center',
                title: '单价',
            }, {
                field: 'aoUnit',
                align: 'center',
                title: '单位',
            }, {
                field: 'aoRemark',
                align: 'center',
                title: '备注',
            }],

            //加载成功时执行
            onLoadSuccess: function(data) {
                console.log(data)
                $('.fixed-table-container').css({ 'height': $(window).height() - 250 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });
            },
            //加载失败时执行
            onLoadError: function() {
                $('.fixed-table-container').css({ 'height': $(window).height() - 250 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });
            },
            onClickRow: function(row, $element) {
                console.log(row);
            },
            onClickCell: function(field, value, row, $element) {
                // console.log(field, value, row, $element)
                $element.attr('contenteditable', true);
                $('#tb_departments tr td:nth-child(2)').attr('contenteditable', false);
                $('#tb_departments tr td:nth-child(3)').attr('contenteditable', false);
                $('#tb_departments tr td:nth-child(4)').attr('contenteditable', false);
                $('#tb_departments tr td:nth-child(5)').attr('contenteditable', false);
                $('#tb_departments tr td:nth-child(6)').attr('contenteditable', false);
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
                            selectData[i].aoAssetsName = selectData[i].aName; //资产名称
                            delete selectData[i].aName;

                            selectData[i].aoNumber = selectData[i].aCode; //资产编号
                            delete selectData[i].aCode;

                            selectData[i].aoAssetsType = selectData[i].aType; //资产分类名称
                            delete selectData[i].aType;

                            selectData[i].aoAllotNumber = selectData[i].aNumbers; //数量
                            delete selectData[i].aNumbers;

                            selectData[i].aoYuliu2 = selectData[i].aValue; //单价
                            delete selectData[i].aValue;
                        }
                    }

                     // 修改添加的房屋资产的字段名
                    if (allData.type == '房屋') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].aoAssetsName = selectData[i].bName; //资产名称
                            delete selectData[i].bName;

                            selectData[i].aoNumber = selectData[i].bCode; //资产编号
                            delete selectData[i].bCode;

                            selectData[i].aoAssetsType = selectData[i].bType; //资产分类名称
                            delete selectData[i].bType;

                            selectData[i].aoAllotNumber = selectData[i].bNumbers; //数量
                            delete selectData[i].bNumbers;

                            selectData[i].aoYuliu2 = selectData[i].bValue; //单价
                            delete selectData[i].bValue;
                        }
                    }

                     // 修改添加的构筑物资产的字段名
                    if (allData.type == '构筑物') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].aoAssetsName = selectData[i].stName; //资产名称
                            delete selectData[i].stName;

                            selectData[i].aoNumber = selectData[i].stPropertynum; //资产编号
                            delete selectData[i].stPropertynum;

                            selectData[i].aoAssetsType = selectData[i].stType; //资产分类名称
                            delete selectData[i].stType;

                            selectData[i].aoAllotNumber = selectData[i].stNumbers; //数量
                            delete selectData[i].stNumbers;

                            selectData[i].aoYuliu2 = selectData[i].stValue; //单价
                            delete selectData[i].stValue;
                        }
                    }

                     // 修改添加的通用设备资产的字段名
                    if (allData.type == '通用设备') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].aoAssetsName = selectData[i].coName; //资产名称
                            delete selectData[i].coName;

                            selectData[i].aoNumber = selectData[i].coCode; //资产编号
                            delete selectData[i].coCode;

                            selectData[i].aoAssetsType = selectData[i].coType; //资产分类名称
                            delete selectData[i].coType;

                            selectData[i].aoAllotNumber = selectData[i].coNumbers; //数量
                            delete selectData[i].coNumbers;

                            selectData[i].aoYuliu2 = selectData[i].coValue; //单价
                            delete selectData[i].coValue;
                        }
                    }

                     // 修改添加的专用设备资产的字段名
                    if (allData.type == '专用设备') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].aoAssetsName = selectData[i].onName; //资产名称
                            delete selectData[i].onName;

                            selectData[i].aoNumber = selectData[i].onCode; //资产编号
                            delete selectData[i].onCode;

                            selectData[i].aoAssetsType = selectData[i].onType; //资产分类名称
                            delete selectData[i].onType;

                            selectData[i].aoAllotNumber = selectData[i].onNumbers; //数量
                            delete selectData[i].onNumbers;

                            selectData[i].aoYuliu2 = selectData[i].onValue; //单价
                            delete selectData[i].onValue;
                        }
                    }

                     // 修改添加的文物及陈列品资产的字段名
                    if (allData.type == '文物及陈列品') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].aoAssetsName = selectData[i].reName; //资产名称
                            delete selectData[i].reName;

                            selectData[i].aoNumber = selectData[i].reCode; //资产编号
                            delete selectData[i].reCode;

                            selectData[i].aoAssetsType = selectData[i].reType; //资产分类名称
                            delete selectData[i].reType;

                            selectData[i].aoAllotNumber = selectData[i].reNumbers; //数量
                            delete selectData[i].reNumbers;

                            selectData[i].aoYuliu2 = selectData[i].reValue; //单价
                            delete selectData[i].reValue;
                        }
                    }

                     // 修改添加的图书资产的字段名
                    if (allData.type == '图书') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].aoAssetsName = selectData[i].boName; //资产名称
                            delete selectData[i].boName;

                            selectData[i].aoNumber = selectData[i].boCode; //资产编号
                            delete selectData[i].boCode;

                            selectData[i].aoAssetsType = selectData[i].boType; //资产分类名称
                            delete selectData[i].boType;

                            selectData[i].aoAllotNumber = selectData[i].boNumbers; //数量
                            delete selectData[i].boNumbers;

                            selectData[i].aoYuliu2 = selectData[i].boValue; //单价
                            delete selectData[i].boValue;
                        }
                    }

                     // 修改添加的特种动植物资产的字段名
                    if (allData.type == '特种动植物') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].aoAssetsName = selectData[i].spName; //资产名称
                            delete selectData[i].spName;

                            selectData[i].aoNumber = selectData[i].spCode; //资产编号
                            delete selectData[i].spCode;

                            selectData[i].aoAssetsType = selectData[i].spType; //资产分类名称
                            delete selectData[i].spType;

                            selectData[i].aoAllotNumber = selectData[i].spNumbers; //数量
                            delete selectData[i].spNumbers;

                            selectData[i].aoYuliu2 = selectData[i].spValue; //单价
                            delete selectData[i].spValue;
                        }
                    }

                       // 修改添加的家具资产的字段名
                    if (allData.type == '家具') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].aoAssetsName = selectData[i].toName; //资产名称
                            delete selectData[i].toName;

                            selectData[i].aoNumber = selectData[i].toCode; //资产编号
                            delete selectData[i].toCode;

                            selectData[i].aoAssetsType = selectData[i].toType; //资产分类名称
                            delete selectData[i].toType;

                            selectData[i].aoAllotNumber = selectData[i].toNumbers; //数量
                            delete selectData[i].toNumbers;

                            selectData[i].aoYuliu2 = selectData[i].toValue; //单价
                            delete selectData[i].toValue;
                        }
                    }

                      // 修改添加的土地使用权资产的字段名
                    if (allData.type == '土地使用权') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].aoAssetsName = selectData[i].luName; //资产名称
                            delete selectData[i].luName;

                            selectData[i].aoNumber = selectData[i].luAssetsNumber; //资产编号
                            delete selectData[i].luAssetsNumber;

                            selectData[i].aoAssetsType = selectData[i].luTypeName; //资产分类名称
                            delete selectData[i].luTypeName;

                            selectData[i].aoAllotNumber = selectData[i].luNumber; //数量
                            delete selectData[i].luNumber;

                            selectData[i].aoYuliu2 = selectData[i].luValue; //单价
                            delete selectData[i].luValue;
                        }
                    }

                        // 修改添加的其他资产的字段名
                    if (allData.type == '其他') {
                        for (var i = 0; i < selectData.length; i++) {
                            selectData[i].aoAssetsName = selectData[i].pName; //资产名称
                            delete selectData[i].pName;

                            selectData[i].aoNumber = selectData[i].pAssetsNumber; //资产编号
                            delete selectData[i].pAssetsNumber;

                            selectData[i].aoAssetsType = selectData[i].pTypeName; //资产分类名称
                            delete selectData[i].pTypeName;

                            selectData[i].aoAllotNumber = selectData[i].pNumber; //数量
                            delete selectData[i].pNumber;

                            selectData[i].aoYuliu2 = selectData[i].pValue; //单价
                            delete selectData[i].pValue;
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

            var a = $("#tb_departments").bootstrapTable('getSelections');

            var delData = []; //要删除的数据

            if (a.length == 0) {
                layer.msg('请选择要删除的数据');
            } else {

                for (var i = 0; i < a.length; i++) {
                    delData[i] = a[i].id;
                }
                $("#tb_departments").bootstrapTable('remove', { field: 'id', values: delData });

                console.log('删除>>>', delData);

            }
        });


    };
    return oInit;
};