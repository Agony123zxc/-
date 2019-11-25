

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






//初始化Table
var TableInit = function() {
    var oTableInit = new Object();
    oTableInit.Init = function() {
        $('#tb_departments').bootstrapTable({
            url: port + '/v1/assetsScrap/findAssetsScrapdtlById',
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
                title: '资产类型'
            }, {
                field: 'unit',
                align: 'center',
                title: '单位'
            }, {
                field: 'price',
                align: 'center',
                title: '单价'
            }, {
                field: 'assetNum',
                align: 'center',
                title: '数量'
            }
            ],

            //加载成功时执行
            onLoadSuccess: function(data) {
                console.log('成功加载表格数据', data);
                // $('.fixed-table-container').css({'height':$(window).height()-290+'px'})
                // $('.panel-body').css({'height':$(window).height()+'px'});
            },
            //加载失败时执行
            onLoadError: function() {},
            onClickRow: function(row, $element) {}
        });
    };

    //得到查询的参数
    oTableInit.queryParams = function(params) {
        var temp = { //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            // pageSize: params.limit, //页面大小
            // pageNum: (params.offset / params.limit) + 1, //页码
            // applyId: sessionStorage.getItem('buyApplyCheckId') //采购申请查看的id
            id: sessionStorage.getItem('checkId')

        };
        return temp;
    };


    return oTableInit;
};


// 导出
$('#btn_export').on('click', function() {
    location.href = port + '/organize/export';
});


// 点击当前行数据详情事件
window.operateEvents = {
    'click .info': function(e, value, row, index) {
        console.log(row);
        parent.layer.open({
            type: 1,
            title: '详情',
            btn: '关闭',
            btnAlign: 'c',
            area: ['760px', '500px'],
            success: function(layero, index) {
                layero.find('.layui-layer-btn0').css({
                    background: '#fff',
                    color: '#333',
                    borderColor: '#ddd',
                    padding: '0 20px'
                });
            },
            content: '<div class="detail-layer">' +
                '<table>' +
                '<tr>' +
                '<td>资产名称</td>' +
                '<td>' + row.aName + '</td>' +
                '<td>资产分类名称</td>' +
                '<td>' + row.aType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>坐落位置</td>' +
                '<td>' + row.aPlace + '</td>' +
                '<td>资产编号</td>' +
                '<td>' + row.aCode + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>预算项目编号</td>' +
                '<td>' + row.aBudgetnum + '</td>' +
                '<td>产权形式</td>' +
                '<td>' + row.aPropertyRightType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>权属性质</td>' +
                '<td>' + row.aPropertyRightNature + '</td>' +
                '<td>权属证明</td>' +
                '<td>' + row.aPropertyRightProve + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>权属年限</td>' +
                '<td>' + row.aPropertyRightAgeLimit + '</td>' +
                '<td>权属证号</td>' +
                '<td>' + row.aPropertyRightPapersnum + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>持证人</td>' +
                '<td>' + row.aPapersPerson + '</td>' +
                '<td>地类（用途）</td>' +
                '<td>' + row.aLandType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>土地级次</td>' +
                '<td>' + row.aLandLevel + '</td>' +
                '<td>使用权类型</td>' +
                '<td>' + row.aUsufructType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>取得方式</td>' +
                '<td>' + row.aGainType + '</td>' +
                '<td>数量</td>' +
                '<td>' + row.aNumbers + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>取得日期</td>' +
                '<td>' + row.aGainDate + '</td>' +
                '<td>发证日期</td>' +
                '<td>' + row.aCertificateDate + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>入账形式</td>' +
                '<td>' + row.aEnterAccountType + '</td>' +
                '<td>会计凭证号</td>' +
                '<td>' + row.aAccountingDocumentNum + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>账务入账日期</td>' +
                '<td>' + row.aEnterAccountDate + '</td>' +
                '<td>投入使用日期</td>' +
                '<td>' + row.aUseingDate + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>管理部门</td>' +
                '<td>' + row.aChargeDepart + '</td>' +
                '<td>价值类型</td>' +
                '<td>' + row.aValueType + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>价值（元）</td>' +
                '<td>' + row.aValue + '</td>' +
                '<td>财政拨款（元）</td>' +
                '<td>' + row.aPublicEconomy + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>非财政拨款（元）</td>' +
                '<td>' + row.aNotPublicEconomy + '</td>' +
                '<td>均价</td>' +
                '<td>' + row.aAveragePrice + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>独有面积</td>' +
                '<td>' + row.aOnlyHaveArea + '</td>' +
                '<td>自用面积</td>' +
                '<td>' + row.aOwnArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>分摊面积</td>' +
                '<td>' + row.aShareArea + '</td>' +
                '<td>出租面积</td>' +
                '<td>' + row.aHireArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>出借面积</td>' +
                '<td>' + row.aLendValue + '</td>' +
                '<td>其他面积</td>' +
                '<td>' + row.aOtherArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>闲置面积</td>' +
                '<td>' + row.aSetAsideArea + '</td>' +
                '<td>出借价值</td>' +
                '<td>' + row.aLendValue + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>自用价值</td>' +
                '<td>' + row.aOwnValue + '</td>' +
                '<td>闲置价值</td>' +
                '<td>' + row.aSetAsideArea + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>出租价值</td>' +
                '<td>' + row.aHireValue + '</td>' +
                '<td>备用字段</td>' +
                '<td>' + row.aReserveField + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>其他价值</td>' +
                '<td>' + row.aOtherValue + '</td>' +
                '<td>备注</td>' +
                '<td>' + row.aRemarks + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td>照片附件</td>' +
                '<td colspan="3"><img class="annex-img" src="' + row.aImgPath + '"></td>' +
                '</tr>' +
                '</table>' +
                '</div>'
        });
    }
};






// 工具栏按钮事件
var ButtonInit = function() {
    var oInit = new Object();
    var postdata = {};

    oInit.Init = function() {

    };
    return oInit;
};