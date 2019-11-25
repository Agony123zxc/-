var assetsName = ''; //资产名称
var assetsList = ''; //勾选的资产
var alreadyAssets = ''; //已存在的资产
var reg = /^\+?[1-9]\d*$/; //正则判断大于0的正整数

var timer;//定时器


var allData;//所有的数据

$(function() {

    //1.初始化Table
    var oTable = new TableInit();
    oTable.Init();

    // //2.初始化Button的点击事件
    var oButtonInit = new ButtonInit();
    oButtonInit.Init();



    // 申请日期
    $('#applyDate').attr('value', getDate());

    // 获取系统日期
    function getDate() {
        var myDate = new Date();
        var myYear = myDate.getFullYear(); //年
        var myMonth = myDate.getMonth() + 1; //月
        var myDay = myDate.getDate(); //日
        var myHour = myDate.getHours(); //时
        var myMin = myDate.getMinutes(); //分

        if (myMonth < 10) {
            myMonth = '0' + myMonth;
        }
        if (myDate < 10) {
            myDate = '0' + myDate;
        }
        if (myHour < 10) {
            myHour = '0' + myHour;
        }
        if (myMin < 10) {
            myMin = '0' + myMin;
        }
        return myYear + '-' + myMonth + '-' + myDay + ' ' + myHour + ':' + myMin;
    }


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


var uploadFile;
// 上传
$('.upload-file input').change(function(e) {
    console.log('上传', e);
    $.ajax({
        url: port+"/v1/applybuyAsset/importAssetBuyImg",
        type: 'post',
        data: new FormData($('#uploadFile')[0]), // 上传formdata封装的数据
        cache: false, //// 不缓存
        processData: false, //不处理发送的数据
        contentType: false, //不设置Content-Type请求头
        success: function(data) {
            console.log(data);
            uploadFile=data;
        },
        error: function() {
            console.log('异常');
        }
    });
});




//初始化Table
var TableInit = function() {
    var oTableInit = new Object();
    oTableInit.Init = function() {
        $('#tb_departments').bootstrapTable({
            url: port + '/v1/applybuyAsset/applyBuyAssetDetail',
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
                field: 'applyAssetNum',
                align: 'center',
                title: '资产编号'
            }, {
                field: 'applyAssetName',
                align: 'center',
                title: '资产名称'
            }, {
                field: 'applyAssetType',
                align: 'center',
                title: '资产类别'
            }, {
                field: 'applyAssetNumber',
                align: 'center',
                title: '数量',
            }, {
                field: 'applyAssetYuliu2',
                align: 'center',
                title: '单价'
            }, {
                field: 'applyAssetUnit',
                align: 'center',
                title: '单位'
            }, {
                field: 'applyAssetRemarks',
                align: 'center',
                title: '备注'
            }],

            //加载成功时执行
            onLoadSuccess: function(data) {
                console.log(JSON.stringify(data.rows));
                $('.fixed-table-container').css({ 'height': $(window).height() - 200 + 'px' });
                $('.panel-body').css({ 'height': $(window).height() + 'px' });
                allData=$("#tb_departments").bootstrapTable('getData')[0].applyAssetType;//打开修改页面时资产类型存入缓存
                sessionStorage.setItem('getTreeType', allData);
            },
            //加载失败时执行
            onLoadError: function() {},
            onClickRow: function(row, $element) {
                console.log(row);
            },
            onDblClickCell: function(field, value, row, $element) {
                // console.log(field, value, row, $element)
                $element.attr('contenteditable', true);
                $('#tb_departments tr td:nth-child(2)').attr('contenteditable', false);
                $('#tb_departments tr td:nth-child(3)').attr('contenteditable', false);
                $('#tb_departments tr td:nth-child(4)').attr('contenteditable', false);
                $element.blur(function() {
                    var index = $element.parent().data('index');
                    var tdValue = $element.html();
                    saveData(index, field, tdValue);
                });
            }
        });
    };

    function saveData(index, field, value) {
        $('#tb_departments').bootstrapTable('updateCell', {
            index: index, //行索引
            field: field, //列名
            value: value //cell值
        });

        console.log('编辑后更新>>>', index, field, value);
    }


    //得到查询的参数
    oTableInit.queryParams = function(params) {
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            pageSize: params.limit, //页面大小
            pageNum: (params.offset / params.limit) + 1, //页码
            applyId: sessionStorage.getItem('amendId')
           
        };
        return temp;
    };

    return oTableInit;
};



var testData=[{"id":193,"applyAssetNum":"001","applyAssetName":"资产1","applyAssetType":"通用设备","applyAssetSpec":null,"applyAssetNumber":"10","applyAssetUnit":"g&nbsp;","applyAssetRemarks":null,"apid":240,"applyAssetYuliu1":"ddbb2bea47444e84b00803c40bd68705","applyAssetYuliu2":"10"}];


// 工具栏按钮事件
var ButtonInit = function() {
    var oInit = new Object();

    oInit.Init = function() {

        // 添加完物料后仿刷新数据表格
        $('#refresh_table').on('click', function() {
            $("#tb_departments").bootstrapTable('refresh');
            console.log('刷新表格数据');
        });

        // 添加
        $("#btn_add").on('click', function() {


            //获取所有行数据赋值给已存在的数据
            alreadyAssets = JSON.stringify($("#tb_departments").bootstrapTable('getData'));

            sessionStorage.setItem('alreadyAssets', alreadyAssets); //已存在的资产存入缓存

            parent.layer.open({
                type: 2,
                title: '查询',
                area: ['900px', '500px'],
                btn: ['确定', '取消'],
                end: function() {
                    sessionStorage.removeItem('assetsName');
                    sessionStorage.removeItem('selectAsssts');
                },
                yes: function(index, layero) {
                    var body = parent.layer.getChildFrame('body', index);

                    // 执行子级弹层选择资产的方法;
                    parent.window[layero.find('iframe')[0]['name']].selectAsset();

                    // 执行iframe内追加数据方法
                    $(document).find("#tb_departments").bootstrapTable('append', JSON.parse(sessionStorage.getItem('selectAsssts')));

                    $(document).find("#tb_departments").bootstrapTable('uncheckAll');

                    if (sessionStorage.getItem('selectAsssts')) {
                        parent.layer.close(index);
                    }


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
            var allData = $("#tb_departments").bootstrapTable('getData');

            var delData = []; //要删除的数据
            var delIds = [];

            // console.log('所有数据', allData);

            if (a.length == 0) {
                layer.msg('请选择要删除的数据');
            } else {
                //获取选中的ID
                for (var i = 0; i < a.length; i++) {
                    delData[i] = a[i].id;
                    // delIds[i] = a[i].id;
                }

                $("#tb_departments").bootstrapTable('remove', {field: 'id', values: delData});

                for (var i = 0; i < delData.length; i++) {
                    delete delData[i].id;
                }



                $.ajax({
                    url: port + '/v1/applybuyAsset/deletApplyBuyAsset',
                    type: 'post',
                    data: {
                        id: sessionStorage.getItem('amendId'),
                        ids: delIds.toString(),
                        aasListString: JSON.stringify(delData)
                    },
                    success: function(res) {
                        $("#tb_departments").bootstrapTable('refresh');

                    }
                });

            }
        });


        // 选择
        $("#btn_select").on('click', function() {
            var a = $("#tb_departments").bootstrapTable('getData');
            var selectData = [];


            //获取选中的ID
            for (var i = 0; i < a.length; i++) {
                selectData[i] = a[i];
                if (selectData[i].applyAssetNumber == null) {
                    layer.msg('请输入数量');
                    return;
                }
                if (!reg.test(selectData[i].applyAssetNumber)) {
                    layer.msg('数量必须是大于0的正整数');
                    return;
                }
                if (selectData[i].applyAssetYuliu2 == null) {
                    layer.msg('请输入单价');
                    return;
                }
                if (!reg.test(selectData[i].applyAssetYuliu2)) {
                    layer.msg('单价必须是大于0的正整数');
                    return;
                }
                if (selectData[i].applyAssetUnit == null) {
                    layer.msg('请输入单位');
                    return;
                }
            }

            console.log('提交的数据', selectData);
            if (selectData.length == 0) {
                return;
            }

            for (var i = 0; i < selectData.length; i++) {
                delete selectData[i].id;
            }

            sessionStorage.setItem('alreadySubmit', JSON.stringify(selectData));
            // 提交
            $.ajax({
                url: port + '/v1/applybuyAsset/updateApplyBuyAsset',
                type: 'post',
                data: {
                    applyId: sessionStorage.getItem('amendId'),
                    aasListString: JSON.stringify(selectData), //申请单列表
                    applyYuliu1:$('#applyReason').val(),//申请原因
                    applyYuliu3:uploadFile//上传的附件
                },
                success: function(res) {
                   console.log('修改的提交',res);
                   if (res>0) {
                    sessionStorage.setItem('stockApplyAmendSubmit', 1);
                   }
                }
            });


        });


    };
    return oInit;
};