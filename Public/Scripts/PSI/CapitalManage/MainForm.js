/**
 * Created by Administrator on 2016/6/30 0030.
 */
/**
 * 银行存取款 - 主界面
 */
var summaryFilters = ['money', 'stock_num'];
Ext.define("PSI.CapitalManage.MainForm", {
    extend: "Ext.panel.Panel",

    config: {
        //其他收支单
        pExtraBill: null,
        pExtraBillAdd: null,
        pExtraBillEdit: null,
        pExtraBillDelete: null,
        pExtraBillVerify: null,
        pExtraBillVerifyReturn: null,

        //应收应付账款单
        pReceiptPayBill: null,
        pDrugBrokenBill: null,
        pReceiptPayBillAdd: null,
        pReceiptPayBillEdit: null,
        pReceiptPayBillDelete: null,
        pReceiptPayBillVerify: null,
        pReceiptPayBillVerifyReturn: null,
    },

    /**
     * 页面初始化
     */
    initComponent: function() {
        var me = this;

        Ext.apply(me, {
            border: 0,
            layout: "border",
            tbar: [],
            items: [{
                region: "center",
                xtype: "container",
                layout: "border",
                border: 0,
                items: [{
                    region: "center",
                    split: true,
                    xtype: "tabpanel",
                    border: 0,
                    items: [
                        me.getPExtraBill() == "0" ? null : me.getExtraBillGrid(),
                        me.getPReceiptPayBill() == "0" ? null : me.getReceiptBillGrid(),
                    ]
                }]
            }]
        });

        me.callParent(arguments);

        me.__queryEditNameList = ["editQueryEmployeeName"];

        me.freshExtraBillGrid();
    },

    //其他收入支出单
    getExtraBillGrid: function() {
        var me = this;
        if (me.extraBillGrid) {
            return me.extraBillGrid;
        }
        //定义业务员利润分配条目数据字段模型
        Ext.define("ExtraBill", {
            extend: "Ext.data.Model",
            fields: ['id', 'type_id', 'type_name', 'bill_type', 'money', 'note', 'status',
                'bank_account_id', 'bank_account_name', 'yewu_date', 'bank_account_num', 'verify_date', 'drug_id', 'drug_name', 'guige', 'manufacturer'
            ]
        });
        //业务员
        var extraBillStore = Ext.create("Ext.data.Store", {
            autoLoad: false,
            model: "ExtraBill",
            data: [],
            pageSize: 20,
            proxy: {
                type: "ajax",
                actionMethods: {
                    read: "POST"
                },
                url: PSI.Const.BASE_URL + "Home/CapitalManage/getExtraBillList",
                reader: {
                    root: 'extraBillList',
                    totalProperty: 'totalCount'
                }
            },
            listeners: {
                beforeload: {
                    fn: function() {
                        extraBillStore.proxy.extraParams = me.getQueryParam4ExtraBill();
                    },
                    scope: me
                },
                load: {
                    fn: function(e, records, successful) {
                        if (successful) {
                            me.gotoExtraBillGridRecord(me.__lastId);
                        }
                    },
                    scope: me
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
            viewConfig: {
                enableTextSelection: true,
                forceFit: true
            },
            title: "其他收入支出单",
            features: [{
                ftype: 'summary',
                dock: 'bottom'
            }],
            columnLines: true,
            tbar: [{
                text: "新增收入支出单",
                iconCls: "PSI-button-add",
                handler: this.onAddExtraBill,
                disabled: me.getPExtraBillAdd() == "0",
                scope: this
            }, {
                text: "编辑收入支出单",
                iconCls: "PSI-button-edit",
                handler: this.onEditExtraBill,
                disabled: me.getPExtraBillEdit() == "0",
                scope: this
            }, {
                text: "删除收入支出单",
                iconCls: "PSI-button-delete",
                disabled: me.getPExtraBillDelete() == "0",
                handler: this.onDeleteExtraBill,
                scope: this
            }, "-", {
                text: "审核",
                iconCls: "PSI-button-verify",
                disabled: me.getPExtraBillVerify() == "0",
                scope: me,
                handler: me.onExtraBillCommit,
                id: "buttonVerify"
            }, {
                text: "反审核",
                iconCls: "PSI-button-revert-verify",
                disabled: me.getPExtraBillVerifyReturn() == "0",
                scope: me,
                handler: me.onExtraBillCommitReturn,
                id: "buttonRevertVerify"
            }, "-", {
                id: "editQueryType4ExtraBill",
                fieldLabel: "单据类型",
                xtype: "combo",
                labelWidth: 60,
                store: Ext.create("Ext.data.ArrayStore", {
                    fields: ["value", "type_name"],
                    data: [
                        ['1', '收入'],
                        ['0', '支出']
                    ]
                }),
                width: 200,
                allowBlank: true,
                editable: false,
                displayField: 'type_name',
                valueField: 'type_name',
                listeners: {
                    specialkey: {
                        fn: me.onEditSpecialKey,
                        scope: me
                    }
                }
            }, {
                xtype: "container",
                items: [{
                    xtype: "button",
                    text: "查询",
                    width: 50,
                    margin: "5 0 0 10",
                    iconCls: "PSI-button-refresh",
                    handler: me.onExtraBillGirdQuery,
                    scope: me
                }, {
                    xtype: "button",
                    text: "重置查询条件",
                    width: 100,
                    margin: "5, 0, 0, 10",
                    handler: me.onClearExtraBillGirdQuery,
                    scope: me
                }]
            }],
            columns: [Ext.create("Ext.grid.RowNumberer", {
                text: "序号",
                sortable: true,
                width: 40
            }), {
                header: "状态",
                dataIndex: "status",
                menuDisabled: false,
                sortable: true,
                renderer: function(v) {
                    switch (v) {
                        case '0':
                            return "<span style='color:red' >未审核</span>";
                        case '1':
                            return "<span style='color:green' >已审核</span>";
                        case '2':
                            return "<span style='color:blue' >审核未通过</span>";
                    }
                }
            }, {
                header: "单据类型",
                menuDisabled: false,
                dataIndex: "bill_type",
                sortable: true
            }, {
                header: "科目",
                dataIndex: "type_name",
                menuDisabled: false,
                sortable: true
            }, {
                header: "金额",
                dataIndex: "money",
                menuDisabled: false,
                sortable: true
            }, {
                header: "账户",
                dataIndex: "bank_account_name",
                menuDisabled: false,
                sortable: true
            }, {
                header: "卡号",
                dataIndex: "bank_account_num",
                menuDisabled: false,
                sortable: true
            }, {
                header: "业务日期",
                dataIndex: "yewu_date",
                menuDisabled: false,
                sortable: true
            }, {
                header: "相关品种",
                dataIndex: "drug_name",
                menuDisabled: false,
                sortable: true
            }, {
                header: "规格",
                dataIndex: "guige",
                menuDisabled: false,
                sortable: true
            }, {
                header: "生产厂家",
                dataIndex: "manufacturer",
                menuDisabled: false,
                sortable: true
            }, {
                header: "审核时间",
                dataIndex: "verify_date",
                menuDisabled: false,
                sortable: true,
                renderer: function(v) {
                    return v == '0000-00-00' ? '' : v;
                }
            }, {
                header: "备注",
                dataIndex: "note",
                menuDisabled: false,
                sortable: true
            }],
            store: extraBillStore,
            bbar: [{
                id: "pagingToobarExtraBill",
                border: 0,
                xtype: "pagingtoolbar",
                store: extraBillStore
            }, "-", {
                xtype: "displayfield",
                value: "每页显示"
            }, {
                id: "comboCountPerPageExtraBill",
                xtype: "combobox",
                editable: false,
                width: 60,
                store: Ext.create("Ext.data.ArrayStore", {
                    fields: ["text"],
                    data: [
                        ["20"],
                        ["50"],
                        ["100"],
                        ["300"],
                        ["1000"]
                    ]
                }),
                value: 20,
                listeners: {
                    change: {
                        fn: function() {
                            extraBillStore.pageSize = Ext.getCmp("comboCountPerPageExtraBill").getValue();
                            extraBillStore.currentPage = 1;
                            Ext.getCmp("pagingToolbarExtraBill").doRefresh();
                        },
                        scope: me
                    }
                }
            }, {
                xtype: "displayfield",
                value: "条记录"
            }],
            listeners: {
                select: {
                    fn: me.onExtraBillGridSelect,
                    scope: me
                },
                itemdblclick: {
                    fn: me.onEditExtraBill,
                    scope: me
                }
            }
        });
        me.extraBillGrid = extraBillGrid;

        var summaryColumns = me.extraBillGrid.columns;
        for (var i = 0; i < summaryColumns.length; i++) {
            var itemname = summaryColumns[i].dataIndex;
            (function(itemname) {
                summaryColumns[i].summaryType = summaryFilters.indexOf(itemname) < 0 ? false : function(records) {
                    var gridSum = 0;
                    for (var i = 0; i < records.length; i++) {
                        var item = records[i].get(itemname);
                        var itemPrice = Number.parseFloat(item);
                        gridSum += itemPrice;
                    }
                    return gridSum;
                }
                if (i === 1) {
                    summaryColumns[1].summaryType = function() {
                        return '合计'
                    }
                }
            })(itemname)

        }

        return me.extraBillGrid;
    },

    //应收应付账款单
    getReceiptBillGrid: function() {
        var me = this;
        if (me.receiptPayBillGrid) {
            return me.receiptPayBillGrid;
        }
        //定义业务员利润分配条目数据字段模型
        Ext.define("ReceiptPayBill", {
            extend: "Ext.data.Model",
            fields: ['id', 'type_id', 'type_name', 'bill_type', 'money', 'note', 'status']
        });
        //业务员
        var store = Ext.create("Ext.data.Store", {
            autoLoad: false,
            model: "ReceiptPayBill",
            data: [],
            pageSize: 20,
            proxy: {
                type: "ajax",
                actionMethods: {
                    read: "POST"
                },
                url: PSI.Const.BASE_URL + "Home/CapitalManage/getReceiptPayBillList",
                reader: {
                    root: 'receiptPayBillList',
                    totalProperty: 'totalCount'
                }
            },
            listeners: {}
        });


        store.on("beforeload", function() {
            store.proxy.extraParams = me.getQueryParam4ReceiptPayBill();
        });
        store.on("load", function(e, records, successful) {
            if (successful) {
                me.gotoReceiptPayBillGridRecord(me.__lastId);
            }
        });

        //定义一个业务员利润分配条目列表实例
        var receiptPayBillGrid = Ext.create("Ext.grid.Panel", {
            viewConfig: {
                enableTextSelection: true,
                forceFit: true
            },
            title: "应收应付账款单",
            features: [{
                ftype: 'summary',
                dock: 'bottom'
            }],
            columnLines: true,
            tbar: [{
                text: "新增应收应付账款单",
                iconCls: "PSI-button-add",
                handler: this.onAddReceiptPayBill,
                disabled: me.getPReceiptPayBillAdd() == "0",
                scope: this
            }, {
                text: "编辑应收应付账款单",
                iconCls: "PSI-button-edit",
                handler: this.onEditReceiptPayBill,
                disabled: me.getPReceiptPayBillEdit() == "0",
                scope: this
            }, {
                text: "删除应收应付账款单",
                iconCls: "PSI-button-delete",
                disabled: me.getPReceiptPayBillDelete() == "0",
                handler: this.onDeleteReceiptPayBill,
                scope: this
            }, "-", {
                text: "审核",
                iconCls: "PSI-button-verify",
                disabled: me.getPReceiptPayBillVerify() == "0",
                scope: me,
                handler: me.onReceiptPayBillCommit,
                id: "buttonVerify2"
            }, {
                text: "反审核",
                iconCls: "PSI-button-revert-verify",
                disabled: me.getPReceiptPayBillVerifyReturn() == "0",
                scope: me,
                handler: me.onReceiptPayBillCommitReturn,
                id: "buttonRevertVerify2"
            }, "-", {
                id: "editQueryType4ReceiptPayBill",
                fieldLabel: "单据类型",
                xtype: "combo",
                labelWidth: 60,
                store: Ext.create("Ext.data.ArrayStore", {
                    fields: ["value", "type_name"],
                    data: [
                        ['1', '收入'],
                        ['0', '支出']
                    ]
                }),
                width: 200,
                allowBlank: true,
                editable: false,
                displayField: 'type_name',
                valueField: 'type_name',
                listeners: {
                    specialkey: {
                        fn: me.onEditSpecialKey,
                        scope: me
                    }
                }
            }, {
                xtype: "container",
                items: [{
                    xtype: "button",
                    text: "查询",
                    width: 50,
                    margin: "5 0 0 10",
                    iconCls: "PSI-button-refresh",
                    handler: me.onReceiptPayBillGirdQuery,
                    scope: me
                }, {
                    xtype: "button",
                    text: "重置查询条件",
                    width: 100,
                    margin: "5, 0, 0, 10",
                    handler: me.onClearReceiptPayBillGirdQuery,
                    scope: me
                }]
            }],
            columns: [Ext.create("Ext.grid.RowNumberer", {
                text: "序号",
                sortable: true,
                width: 40
            }), {
                header: "状态",
                dataIndex: "status",
                menuDisabled: false,
                sortable: true,
                renderer: function(v) {
                    switch (v) {
                        case '0':
                            return "<span style='color:red' >未审核</span>";
                        case '1':
                            return "<span style='color:green' >已审核</span>";
                        case '2':
                            return "<span style='color:blue' >审核未通过</span>";
                    }
                }
            }, {
                header: "单据类型",
                menuDisabled: false,
                dataIndex: "bill_type",
                sortable: true
            }, {
                header: "科目",
                dataIndex: "type_name",
                menuDisabled: false,
                sortable: true
            }, {
                header: "金额",
                dataIndex: "money",
                menuDisabled: false,
                sortable: true
            }, {
                header: "备注",
                dataIndex: "note",
                menuDisabled: false,
                sortable: true
            }],
            store: store,
            bbar: [{
                id: "pagingToolbarReceiptPayBill",
                border: 0,
                xtype: "pagingtoolbar",
                store: store
            }, "-", {
                xtype: "displayfield",
                value: "每页显示"
            }, {
                id: "comboCountPerPageReceiptPayBill",
                xtype: "combobox",
                editable: false,
                width: 60,
                store: Ext.create("Ext.data.ArrayStore", {
                    fields: ["text"],
                    data: [
                        ["20"],
                        ["50"],
                        ["100"],
                        ["300"],
                        ["1000"]
                    ]
                }),
                value: 20,
                listeners: {
                    change: {
                        fn: function() {
                            store.pageSize = Ext.getCmp("comboCountPerPageReceiptPayBill").getValue();
                            store.currentPage = 1;
                            Ext.getCmp("pagingToolbarReceiptPayBill").doRefresh();
                        },
                        scope: me
                    }
                }
            }, {
                xtype: "displayfield",
                value: "条记录"
            }],
            listeners: {
                select: {
                    fn: me.onReceiptPayBillGridSelect,
                    scope: me
                },
                itemdblclick: {
                    fn: me.onEditReceiptPayBill,
                    scope: me
                }
            }
        });
        me.receiptPayBillGrid = receiptPayBillGrid;
        var summaryColumns = me.receiptPayBillGrid.columns;
        for (var i = 0; i < summaryColumns.length; i++) {
            var itemname = summaryColumns[i].dataIndex;
            (function(itemname) {
                summaryColumns[i].summaryType = summaryFilters.indexOf(itemname) < 0 ? false : function(records) {
                    var gridSum = 0;
                    for (var i = 0; i < records.length; i++) {
                        var item = records[i].get(itemname);
                        var itemPrice = Number.parseFloat(item);
                        gridSum += itemPrice;
                    }
                    return gridSum;
                }
                if (i === 1) {
                    summaryColumns[1].summaryType = function() {
                        return '合计'
                    }
                }
            })(itemname)

        }
        return me.receiptPayBillGrid;
    },



    //新增其他收支单
    onAddExtraBill: function() {
        var me = this;
        if (me.getPExtraBillAdd() == "0") return;
        var form = Ext.create("PSI.CapitalManage.ExtraBillEditForm", {
            parentForm: this
        });

        form.show();
    },
    //新增应收应付单据
    onAddReceiptPayBill: function() {
        var me = this;
        if (me.getPReceiptPayBillAdd() == "0")
            return;
        var form = Ext.create("PSI.CapitalManage.ReceiptPayBillEditForm", {
            parentForm: this
        });

        form.show();
    },
    //编辑其他收支单
    onEditExtraBill: function() {
        var me = this;

        if (me.getPExtraBillEdit() == "0") return;

        var item = me.getExtraBillGrid().getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("没有选择要编辑的收入支出单");
            return;
        }
        var bill = item[0];
        if (bill.get('status') == 1) {
            PSI.MsgBox.showInfo('已审核，无法编辑');
            return;
        }
        var form = Ext.create("PSI.CapitalManage.ExtraBillEditForm", {
            parentForm: me,
            entity: bill
        });
        form.show();
    },
    //编辑应收应付账款单
    onEditReceiptPayBill: function() {
        var me = this;
        if (me.getPReceiptPayBillEdit() == "0")
            return;

        var item = me.receiptPayBillGrid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("没有选择要编辑的应收应付账款单");
            return;
        }
        var bill = item[0];
        if (bill.get('status') == 1) {
            PSI.MsgBox.showInfo('已审核，无法编辑');
            return;
        }
        var form = Ext.create("PSI.CapitalManage.ReceiptPayBillEditForm", {
            parentForm: me,
            entity: bill
        });
        form.show();
    },


    //删除其他收支单
    onDeleteExtraBill: function() {
        var me = this;
        if (me.getPExtraBillDelete() == "0") return;

        var item = me.getExtraBillGrid().getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("没有选择要删除的收入支出单");
            return;
        }

        var bill = item[0];
        if (bill.get('status') == 1) {
            PSI.MsgBox.showInfo('已审核，无法删除');
            return;
        }
        var info = "确认要删除吗？";
        var me = this;
        PSI.MsgBox.confirm(info, function() {
            var el = Ext.getBody();
            el.mask("正在删除中...");
            Ext.Ajax.request({
                url: PSI.Const.BASE_URL + "Home/CapitalManage/deleteExtraBill",
                method: "POST",
                params: {
                    id: bill.get("id")
                },
                callback: function(options, success, response) {
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

    //删除应收应付账款单
    onDeleteReceiptPayBill: function() {
        var me = this;
        if (me.getPReceiptPayBillDelete() == "0") return;

        var item = me.receiptPayBillGrid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("没有选择要删除的应收应付账款单");
            return;
        }

        var bill = item[0];
        if (bill.get('status') == 1) {
            PSI.MsgBox.showInfo('已审核，无法删除');
            return;
        }
        var info = "确认要删除吗？";
        var me = this;
        PSI.MsgBox.confirm(info, function() {
            var el = Ext.getBody();
            el.mask("正在删除中...");
            Ext.Ajax.request({
                url: PSI.Const.BASE_URL + "Home/CapitalManage/deleteReceiptPayBill",
                method: "POST",
                params: {
                    id: bill.get("id")
                },
                callback: function(options, success, response) {
                    el.unmask();
                    if (success) {
                        var data = Ext.JSON.decode(response.responseText);
                        if (data.success) {
                            PSI.MsgBox.showInfo("成功完成删除操作", function() {
                                me.freshReceiptPayBillGrid();
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
    //审核其他收支单
    onExtraBillCommit: function() {
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
            me.verifyRequest(bill, 'yes')
        }, function() {
            //审核不通过
            me.verifyRequest(bill, 'no')
        });
    },


    //审核应收应付账款单
    onReceiptPayBillCommit: function() {
        var me = this;
        var item = me.receiptPayBillGrid.getSelectionModel().getSelection();
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
            me.verifyRequest4ReceiptPay(bill, 'yes')
        }, function() {
            //审核不通过
            me.verifyRequest4ReceiptPay(bill, 'no')
        });
    },

    //反审核其他收支单
    onExtraBillCommitReturn: function() {
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
            me.verifyRequest(bill, 'return')
        });
    },


    // //反审核应收应付账款单
    // onExtraBillCommitReturn:function(){
    //     var me = this;
    //     var item = me.receiptPayBillGrid.getSelectionModel().getSelection();
    //     if (item == null || item.length != 1) {
    //         PSI.MsgBox.showInfo("没有选择要操作的条目");
    //         return;
    //     }
    //     var bill = item[0];
    //
    //     if (bill.get("status") != 1) {
    //         PSI.MsgBox.showInfo("该条目无法进行此操作");
    //         return;
    //     }
    //     var info = "确认要反审核该条目?";
    //     PSI.MsgBox.confirm(info, function() {
    //         me.verifyRequest4ReceiptPay(bill,'return')
    //     });
    // },

    //审核与反审核，其他收支单
    verifyRequest: function(bill, type) {
        var id = bill.get("id");
        var me = this;
        var el = Ext.getBody();
        el.mask("正在提交中...");
        Ext.Ajax.request({
            url: PSI.Const.BASE_URL + "Home/CapitalManage/extraBillStatus",
            method: "POST",
            params: {
                id: id,
                type: type
            },
            callback: function(options, success, response) {
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

    //反审核其他收支单
    onReceiptPayBillCommitReturn: function() {
        var me = this;
        var item = me.receiptPayBillGrid.getSelectionModel().getSelection();
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
            me.verifyRequest4ReceiptPay(bill, 'return')
        });
    },

    //应收应付账款的审核与反审核
    verifyRequest4ReceiptPay: function(bill, type) {
        var id = bill.get("id");
        var me = this;
        var el = Ext.getBody();
        el.mask("正在提交中...");
        Ext.Ajax.request({
            url: PSI.Const.BASE_URL + "Home/CapitalManage/receiptPayBillStatus",
            method: "POST",
            params: {
                id: id,
                type: type
            },
            callback: function(options, success, response) {
                el.unmask();

                if (success) {
                    var data = Ext.JSON.decode(response.responseText);
                    if (data.success) {
                        PSI.MsgBox.showInfo("操作成功", function() {
                            me.freshReceiptPayBillGrid();
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

    getQueryParam4ExtraBill: function() {
        var result = {};
        var type = Ext.getCmp("editQueryType4ExtraBill").getValue();
        if (type) {
            // result.date = Ext.Date.format(date, "Y");
            result.type = type
        }
        return result;
    },

    gotoExtraBillGridRecord: function(id) {
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
    freshExtraBillGrid: function() {
        var me = this;
        var grid = me.extraBillGrid;
        var store = grid.getStore();
        store.removeAll();
        store.load();
        grid.getSelectionModel().deselectAll();
    },

    onExtraBillGirdQuery: function() {
        this.refreshExtraBillGrid();
    },
    refreshExtraBillGrid: function() {
        Ext.getCmp("pagingToobarExtraBill").doRefresh();
    },
    onClearExtraBillGirdQuery: function() {
        var me = this;

        Ext.getCmp("editQueryType4ExtraBill").setValue(null);

        me.refreshExtraBillGrid();
    },


    getQueryParam4ReceiptPayBill: function() {
        var result = {};
        var type = Ext.getCmp("editQueryType4ReceiptPayBill").getValue();
        if (type) {
            // result.date = Ext.Date.format(date, "Y");
            result.type = type
        }
        return result;
    },



    gotoReceiptPayBillGridRecord: function(id) {
        var me = this;
        var grid = me.receiptPayBillGrid;
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


    freshReceiptPayBillGrid: function() {
        var me = this;
        var grid = me.receiptPayBillGrid;
        var store = grid.getStore();
        store.removeAll();
        store.load();
        grid.getSelectionModel().deselectAll();
    },
    onReceiptPayBillGirdQuery: function() {
        this.refreshReceiptPayBillGrid();
    },
    refreshReceiptPayBillGrid: function() {
        Ext.getCmp("pagingToolbarReceiptPayBill").doRefresh();
    },
    onClearReceiptPayBillGirdQuery: function() {
        var me = this;

        Ext.getCmp("editQueryType4ReceiptPayBill").setValue(null);

        me.refreshReceiptPayBillGrid();
    },
});