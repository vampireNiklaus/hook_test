/**
 * Created by Administrator on 2016/6/30 0030.
 */
/**
 * 银行存取款 - 主界面
 */
Ext.define("PSI.AccountManage.MainForm", {
    extend : "Ext.panel.Panel",

    config : {
        pExtraBill : null,
        pExtraBillAdd : null,
        pExtraBillEdit : null,
        pExtraBillDelete : null,
        pExtraBillVerify : null,
        pExtraBillVerifyReturn : null,
    },

    /**
     * 页面初始化
     */
    initComponent : function() {
        var me = this;

        Ext.apply(me, {
            border : 0,
            layout : "border",
            tbar : [ ],
            items : [ {
                region : "center",
                xtype : "container",
                layout : "border",
                border : 0,
                items : [ {
                    region : "center",
                    split : true,
                    xtype : "tabpanel",
                    border : 0,
                    items : [
                        me.getPExtraBill() == "0"? null:me.getExtraBillGrid()
                    ]
                }]
            }]
        });

        me.callParent(arguments);

        me.__queryEditNameList = ["editQueryEmployeeName"];

        me.freshExtraBillGrid();
    },

    //其他收入支出单
    getExtraBillGrid:function(){
        var me=this ;
        if(me.extraBillGrid){
            return me.extraBillGrid;
        }
        //定义业务员利润分配条目数据字段模型
        Ext.define("ExtraBill", {
            extend : "Ext.data.Model",
            fields : ['id','type_id','type_name','bill_type','money','note','status']
        });
        //业务员
        var extraBillStore = Ext.create("Ext.data.Store", {
            autoLoad : false,
            model : "ExtraBill",
            data : [],
            pageSize : 20,
            proxy : {
                type : "ajax",
                actionMethods : {
                    read : "POST"
                },
                url : PSI.Const.BASE_URL + "Home/AccountManage/getExtraBillList",
                reader : {
                    root : 'extraBillList',
                    totalProperty : 'totalCount'
                }
            },
            listeners : {
                beforeload : {
                    fn : function() {
                        extraBillStore.proxy.extraParams = me.getQueryParam4ExtraBill();
                    },
                    scope : me
                },
                load : {
                    fn : function(e, records, successful) {
                        if (successful) {
                            me.gotoExtraBillGridRecord(me.__lastId);
                        }
                    },
                    scope : me
                }
            }
        });


        extraBillStore.on("beforeload", function() {
            extraBillStore.proxy.extraParams = me.getQueryParam4ExtraBill();
        });
        extraBillStore.on("load", function(e, records, successful) {
            if (successful) {
                me.gotoExtraBillGridRecord(me.__lastId);
            }
        });

        //定义一个业务员利润分配条目列表实例
        var extraBillGrid = Ext.create("Ext.grid.Panel", {
            viewConfig : {
                enableTextSelection : true,
                forceFit: true
            },
            title : "其他收入支出单",
            columnLines : true,
            tbar:[
                {
                    text : "新增收入支出单",
                    iconCls : "PSI-button-add",
                    handler : this.onAddExtraBill,
                    disabled : me.getPExtraBillAdd() == "0",
                    scope : this
                },{
                    text : "编辑收入支出单",
                    iconCls : "PSI-button-edit",
                    handler : this.onEditExtraBill,
                    disabled : me.getPExtraBillEdit() == "0",
                    scope : this
                },{
                    text : "删除收入支出单",
                    iconCls : "PSI-button-delete",
                    disabled : me.getPExtraBillDelete() == "0",
                    handler : this.onDeleteExtraBill,
                    scope : this
                },"-", {
                    text : "审核",
                    iconCls : "PSI-button-verify",
                    disabled : me.getPExtraBillVerify() == "0",
                    scope : me,
                    handler : me.onExtraBillCommit,
                    id : "buttonVerify"
                }, {
                    text : "反审核",
                    iconCls : "PSI-button-revert-verify",
                    disabled : me.getPExtraBillVerifyReturn() == "0",
                    scope : me,
                    handler : me.onExtraBillCommitReturn,
                    id : "buttonRevertVerify"
                }],
            columns : [Ext.create("Ext.grid.RowNumberer", {
                text : "序号",
                sortable : true,
                width:40
            }),{
                header : "状态",
                dataIndex : "status",
                menuDisabled : true,
                sortable : true,
                renderer:function(v){
                    switch (v){
                        case '0':
                            return "<span style='color:red' >未审核</span>";
                        case '1':
                            return "<span style='color:green' >已审核</span>";
                        case '2':
                            return "<span style='color:blue' >审核未通过</span>";
                    }
                }
            },{
                header : "单据类型",
                menuDisabled : true,
                dataIndex : "bill_type",
                sortable : true
            },{
                header : "科目",
                dataIndex : "type_name",
                menuDisabled : true,
                sortable : true
            },{
                header : "金额",
                dataIndex : "money",
                menuDisabled : true,
                sortable : true
            },{
                header : "备注",
                dataIndex : "note",
                menuDisabled : true,
                sortable : true
            }],
            store : extraBillStore ,
            bbar : [{
                id : "pagingToolbarExtraBill",
                border : 0,
                xtype : "pagingtoolbar",
                store : extraBillStore
            }, "-", {
                xtype : "displayfield",
                value : "每页显示"
            }, {
                id : "comboCountPerPageExtraBill",
                xtype : "combobox",
                editable : false,
                width : 60,
                store : Ext.create("Ext.data.ArrayStore", {
                    fields : ["text"],
                    data : [["20"], ["50"], ["100"],
                        ["300"], ["1000"]]
                }),
                value : 20,
                listeners : {
                    change : {
                        fn : function() {
                            extraBillStore.pageSize = Ext.getCmp("comboCountPerPageExtraBill").getValue();
                            extraBillStore.currentPage = 1;
                            Ext.getCmp("pagingToolbarExtraBill").doRefresh();
                        },
                        scope : me
                    }
                }
            }, {
                xtype : "displayfield",
                value : "条记录"
            }],
            listeners : {
                select : {
                    fn : me.onExtraBillGridSelect,
                    scope : me
                },
                itemdblclick : {
                    fn : me.onEditExtraBill,
                    scope : me
                }
            }
        });
        me.extraBillGrid = extraBillGrid;
        return me.extraBillGrid;
    },

    //添加产品代理协议
    onAddExtraBill:function(){
        var me=this;
        if(me.getPExtraBillAdd() == "0")return;
        var form = Ext.create("PSI.AccountManage.ExtraBillEditForm", {
            parentForm : this
        });

        form.show();
    },
    onEditExtraBill:function(){
        var me = this;

        if(me.getPExtraBillEdit() == "0")return;

        var item = me.getExtraBillGrid().getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("没有选择要编辑的收入支出单");
            return;
        }
        var bill = item[0];
        if(bill.get('status')==1){
            PSI.MsgBox.showInfo('已审核，无法编辑');
            return;
        }
        var form = Ext.create("PSI.AccountManage.ExtraBillEditForm", {
            parentForm : me,
            entity : bill
        });
        form.show();

    },
    onDeleteExtraBill:function(){
        var me = this;
        if(me.getPExtraBillDelete() == "0")return;

        var item = me.getExtraBillGrid().getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("没有选择要删除的收入支出单");
            return;
        }

        var bill = item[0];
        if(bill.get('status')==1){
            PSI.MsgBox.showInfo('已审核，无法删除');
            return;
        }
        var info = "确认要删除吗？";
        var me = this;
        PSI.MsgBox.confirm(info, function() {
            var el = Ext.getBody();
            el.mask("正在删除中...");
            Ext.Ajax.request({
                url : PSI.Const.BASE_URL + "Home/AccountManage/deleteExtraBill",
                method : "POST",
                params : {
                    id : bill.get("id")
                },
                callback : function(options, success, response) {
                    el.unmask();
                    if (success) {
                        var data = Ext.JSON.decode(response.responseText);
                        if (data.success) {
                            PSI.MsgBox.showInfo("成功完成删除操作", function() {
                                me.freshExtraBillGrid();
                            });
                        } else {
                            PSI.MsgBox.showInfo(data.msg);
                        }
                    } else {
                        PSI.MsgBox.showInfo("网络错误", function() {
                            window.location.reload();
                        });
                    }
                }
            });
        });
    },
    onExtraBillCommit:function () {
        var me = this;
        var item = me.extraBillGrid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("没有选择要操作的条目");
            return;
        }
        var bill = item[0];

        if (bill.get("status") == 1) {
            PSI.MsgBox.showInfo("该条目已经审核过了");
            return;
        }

        var info = "请确认该条目审核通过?";
        PSI.MsgBox.verify(info, function() {
            //审核通过
            me.verifyRequest(bill,'yes')
        },function(){
            //审核不通过
            me.verifyRequest(bill,'no')
        });
    },
    onExtraBillCommitReturn:function(){
        var me = this;
        var item = me.extraBillGrid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("没有选择要操作的条目");
            return;
        }
        var bill = item[0];

        if (bill.get("status") != 1) {
            PSI.MsgBox.showInfo("该条目无法进行此操作");
            return;
        }
        var info = "确认要反审核该条目?";
        PSI.MsgBox.confirm(info, function() {
            me.verifyRequest(bill,'return')
        });
    },
    verifyRequest:function(bill,type){
        var id = bill.get("id");
        var me=this;
        var el = Ext.getBody();
        el.mask("正在提交中...");
        Ext.Ajax.request({
            url : PSI.Const.BASE_URL + "Home/AccountManage/extraBillStatus",
            method : "POST",
            params : {
                id : id,
                type: type
            },
            callback : function(options, success, response) {
                el.unmask();

                if (success) {
                    var data = Ext.JSON.decode(response.responseText);
                    if (data.success) {
                        PSI.MsgBox.showInfo("操作成功", function() {
                            me.freshExtraBillGrid();
                        });
                    } else {
                        PSI.MsgBox.showInfo(data.msg);
                    }
                } else {
                    PSI.MsgBox.showInfo("网络错误", function() {
                        window.location.reload();
                    });
                }
            }
        });
    },

    getQueryParam4ExtraBill:function(){
        var result={};
        // var date = Ext.getCmp("editQueryDate4ExtraBill").getValue();
        // if (date) {
        //     result.date = Ext.Date.format(date, "Y");
        // }
        return result;
    },

    gotoExtraBillGridRecord : function(id) {
        var me = this;
        var grid = me.extraBillGrid;
        var store = grid.getStore();
        if (id) {
            var r = store.findExact("id", id);
            if (r != -1) {
                grid.getSelectionModel().select(r);
            } else {
                grid.getSelectionModel().select(0);
            }
        }
    },
    freshExtraBillGrid : function() {
        var me = this;
        var grid = me.extraBillGrid;
        var store = grid.getStore();
        store.removeAll();
        store.load();
        grid.getSelectionModel().deselectAll();
    },
});