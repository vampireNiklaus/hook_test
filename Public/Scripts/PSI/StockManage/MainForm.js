/**
 * 银行存取款 - 主界面
 */
var summaryFilters = ['amount']
Ext.define("PSI.StockManage.MainForm", {
    extend: "Ext.panel.Panel",

    config: {
        pAddStockTrans: null,
        pEditStockTrans: null,
        pDeleteStockTrans: null,
        pVerifyStockTrans: null,
        pRevertVerifyStockTrans: null,
        pEditStockAlarm: null,
        pEditStockBatch: null,
        pViewStockMetaInfo: null,
        pDrugBrokenBill: null,
        /*破损单相关权限*/
        pBrokenBillBillAdd: null,
        pBrokenBillBillEdit: null,
        pBrokenBillBillDelete: null,
        pBrokenBillBillVerify: null,
        pBrokenBillBillVerifyReturn: null,

},

    /**
     * 页面初始化
     */
    initComponent: function () {
        var me = this;
        me.stockItemGrid = null;
        me.stockDetailGrid = null;
        me.bankIOGrid = null;
        Ext.apply(me,


            {
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
                            me.getPViewStockMetaInfo() == "0" ? null : me.getStockMetaInfoPanel(),
                            me.getPDrugBrokenBill() == "0" ? null : me.getDrugBrokenBillGrid(),
                        ]
                    }]
                }]
            }
        );

        me.callParent(arguments);
        me.__queryEditNameList = ["editQueryDrugName", "editQueryDeliver"];
        me.freshStockItemGrid();
        me.freshStockTransGrid();
    },




    getStockMetaInfoPanel: function () {
        var me = this;

        if (me.stockMetaInfoPanel) {
            return me.stockMetaInfoPanel;
        }
        var stockMetaInfoPanel = Ext.create("Ext.panel.Panel", {
            viewConfig: {
                enableTextSelection: true,
                forceFit: true
            },
            title:"库存科目与调拨单信息",
            border: 0,
            layout: "border",
            tbar: [{
                text: "新增库存调拨单",
                iconCls: "PSI-button-add",
                handler: this.onAddStockTrans,
                disabled: me.getPAddStockTrans() == 0 ? true : false,
                scope: this
            }, {
                text: "编辑库存调拨单",
                iconCls: "PSI-button-edit",
                handler: this.onEditStockTrans,
                disabled: me.getPEditStockTrans() == 0 ? true : false,
                scope: this
            }, {
                text: "删除库存调拨单",
                iconCls: "PSI-button-delete",
                handler: this.onDeleteStockTrans,
                disabled: me.getPDeleteStockTrans() == 0 ? true : false,
                scope: this
            }, "-", {
                text: "修改库存预警值",
                iconCls: "PSI-button-edit-detail",
                handler: this.onEditStockItemAlarmAmount,
                disabled: me.getPEditStockAlarm() == 0 ? true : false,
                scope: this
            }, {
                text: "修改批号信息",
                iconCls: "PSI-button-edit-detail",
                handler: this.onEditStockBatchItem,
                disabled: me.getPEditStockBatch() == 0 ? true : false,
                scope: this
            }, "-", {
                text: "审核",
                iconCls: "PSI-button-verify",
                scope: me,
                handler: me.onCommit,
                disabled: me.getPVerifyStockTrans() == 0 ? true : false,
                id: "buttonVerify"
            }, {
                text: "反审核",
                iconCls: "PSI-button-revert-verify",
                disabled: me.getPRevertVerifyStockTrans() == 0 ? true : false,
                scope: me,
                handler: me.onCommitReturn,
                id: "buttonRevertVerify"
            }, {
                xtype: "button",
                text: "导出库存汇总",
                width: 100,
                margin: "5, 0, 0, 10",
                iconCls: "PSI-button-excelexport",
                handler: me.onExportGrid2Excel4StockSummarr,
                scope: me
            }, , {
                xtype: "button",
                text: "导出库存详情",
                width: 100,
                margin: "5, 0, 0, 10",
                iconCls: "PSI-button-excelexport",
                handler: me.onExportGrid2Excel4StockDetailItem,
                scope: me
            }, "-", {
                text: "帮助",
                iconCls: "PSI-help",
                handler: function () {
                    window
                        .open("http://www.kangcenet.com");
                }
            }, "-", {
                text: "关闭",
                iconCls: "PSI-button-exit",
                handler: function () {
                    location.replace(PSI.Const.BASE_URL);
                }
            }],
            items: [{
                region: "north",
                height: 60,
                border: 0,
                collapsible: true,
                title: "查询条件",
                layout: {
                    type: "table",
                    columns: 4
                },
                items:
                    [
                    {
                        id: "editQueryDrugName",
                        labelWidth: 60,
                        labelAlign: "right",
                        labelSeparator: "",
                        fieldLabel: "药品",
                        margin: "5, 0, 0, 0",
                        xtype: "psi_drug_field",
                        listeners: {
                            specialkey: {
                                fn: me.onQueryEditSpecialKey,
                                scope: me
                            }
                        }
                    }, {
                        id: "editQueryDeliver",
                        labelWidth: 60,
                        labelAlign: "right",
                        labelSeparator: "",
                        fieldLabel: "配送公司",
                        margin: "5, 0, 0, 0",
                        xtype: "psi_deliver_field",
                        listeners: {
                            specialkey: {
                                fn: me.onQueryEditSpecialKey,
                                scope: me
                            }
                        }
                    }, {
                        id: "editQueryBatchNum",
                        labelWidth: 60,
                        labelAlign: "right",
                        labelSeparator: "",
                        fieldLabel: "药品批号",
                        margin: "5, 0, 0, 0",
                        xtype: "textfield",
                        listeners: {
                            specialkey: {
                                fn: me.onQueryEditSpecialKey,
                                scope: me
                            }
                        }
                    }, {
                        xtype: "container",
                        items: [{
                            xtype: "button",
                            text: "查询",
                            width: 100,
                            iconCls: "PSI-button-refresh",
                            margin: "5, 0, 0, 20",
                            handler: me.onQuery,
                            scope: me
                        }, {
                            xtype: "button",
                            text: "清空查询条件",
                            width: 100,
                            iconCls: "PSI-button-cancel",
                            margin: "5, 0, 0, 5",
                            handler: me.onClearQuery,
                            scope: me
                        }]
                    }]
            }, {
                region: "center",
                xtype: "panel",
                layout: "border",
                border: 0,
                items: [{
                    xtype: "panel",
                    layout: "fit",
                    border: 0,
                    region: "center",
                    items: [me.getBankIOGrid()]
                }]
            }, {
                region: "west",
                xtype: "panel",
                layout: "border",
                width: 600,
                split: true,
                border: 0,
                items: [{
                    xtype: "panel",
                    region: "center",
                    layout: "fit",
                    border: 0,
                    items: [me.getStockSummaryGrid()]
                }, {
                    xtype: "panel",
                    region: "south",
                    layout: "fit",
                    split: true,
                    height: 300,
                    border: 0,
                    items: [me.getStockDetailGrid()]
                }]
            }]
        });
        me.stockMetaInfoPanel = stockMetaInfoPanel;
        return me.stockMetaInfoPanel;

    },

    updateDrugBrokenBillGrid:function () {
        var me = this;
        if(me.drugBrokenBillGrid){
            var store = me.drugBrokenBillGrid.getStore();
            store.removeAll();
            store.load();
        }
    },
    //药品破损列表单
    getDrugBrokenBillGrid: function () {
        var me = this;
        if (me.drugBrokenBillGrid) {
            return me.drugBrokenBillGrid;
        }
        //定义业务员利润分配条目数据字段模型
        Ext.define("DrugBrokenBill", {
            extend: "Ext.data.Model",
            fields: ["id", "drug_id", 'common_name', 'goods_name', 'jx', 'guige', 'manufacturer', 'jldw','type',
                'bill_code', "supplier_id", 'supplier_name', "stock_id", 'stock_name', "amount",
                'status', 'status_str', 'batch_num', 'validity', 'parent_id', 'note', 'operate_info', 'instock_date'
            ]
        });
        //业务员
        var store = Ext.create("Ext.data.Store", {
            autoLoad: true,
            model: "DrugBrokenBill",
            data: [],
            pageSize: 20,
            proxy: {
                type: "ajax",
                actionMethods: {
                    read: "POST"
                },
                url: PSI.Const.BASE_URL + "Home/StockManage/drugBrokenBillList",
                reader: {
                    root: 'brokenDrugList',
                    totalProperty: 'totalCount'
                }
            },
            listeners: {}
        });


        store.on("beforeload", function () {
            store.proxy.extraParams = me.getQueryParam4DrugBrokenBillBill();
        });
        store.on("load", function (e, records, successful) {
            if (successful) {
                me.gotoDrugBrokenBillBillGridRecord(me.__lastId);
            }
        });

        //定义一个业务员利润分配条目列表实例
        var drugBrokenBillGrid = Ext.create("Ext.grid.Panel", {
            viewConfig: {
                enableTextSelection: true,
                forceFit: true
            },
            title: "入配送公司药品破损单",
            columnLines: true,
            features: [{
                ftype: 'summary',
                dock: 'bottom'
            }],
            tbar: [{
                text: "新增破损单",
                iconCls: "PSI-button-add",
                handler: this.onAddBrokenBillBill,
                disabled: me.getPBrokenBillBillAdd() == "0",
                scope: this
            }, {
                text: "编辑破损单",
                iconCls: "PSI-button-edit",
                handler: this.onEditDrugBrokenBill,
                disabled: me.getPBrokenBillBillEdit() == "0",
                scope: this
            }, {
                text: "删除破损单",
                iconCls: "PSI-button-delete",
                disabled: me.getPBrokenBillBillDelete() == "0",
                handler: this.onDeleteBrokenBillBill,
                scope: this
            }, "-", {
                text: "审核",
                iconCls: "PSI-button-verify",
                disabled: me.getPBrokenBillBillVerify() == "0",
                scope: me,
                handler: me.onBrokenBillBillCommit,
                id: "buttonVerify2"
            }, {
                text: "反审核",
                iconCls: "PSI-button-revert-verify",
                disabled: me.getPBrokenBillBillVerifyReturn() == "0",
                scope: me,
                handler: me.onBrokenBillBillCommitReturn,
                id: "buttonRevertVerify2"
            }, "-",

                {
                id: "editQueryType4BrokenBill",
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
                    handler: me.onBrokenBillGirdQuery,
                    scope: me
                }, {
                    xtype: "button",
                    text: "重置查询条件",
                    width: 100,
                    margin: "5, 0, 0, 10",
                    handler: me.onClearBrokenBillBillGirdQuery,
                    scope: me
                }


                ]
            }],
            columns: [Ext.create("Ext.grid.RowNumberer", {
                text: "序号",
                sortable: true,
                width: 40
            }), {
                header: "状态",
                dataIndex: "status_str",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "破损类型",
                dataIndex: "type",
                menuDisabled: false,
                sortable: true,
                renderer:function (v) {
                    if(v == 0){
                        return "入库<b style='color:blue'>前</b>破损"
                    }else{
                        return "入库<b style='color:red'>后</b>破损"
                    }
                }
            }, {
                header: "破损数量",
                dataIndex: "amount",
                menuDisabled: false,
                renderer: function (value) {
                    return "<b style='color:red'>" + value + "</b>";
                }
            }, {
                header: "相关入库单单号",
                dataIndex: "bill_code",
                menuDisabled: false,
                sortable: false
            }, {
                header: "配送仓库",
                dataIndex: "stock_name",
                menuDisabled: false,
            }, {
                header: "批号",
                dataIndex: "batch_num",
                menuDisabled: false,
            },{
                header: "药品通用名",
                dataIndex: "common_name",
                menuDisabled: false,
                sortable: true
            }, {
                header: "药品商品名",
                dataIndex: "goods_name",
                menuDisabled: false,
                sortable: true
            }, {
                header: "剂型",
                dataIndex: "jx",
                menuDisabled: false,
                sortable: true
            }, {
                header: "计量单位",
                dataIndex: "jldw",
                menuDisabled: false,
                sortable: true
            }, {
                header: "规格",
                dataIndex: "guige",
                menuDisabled: false,
                sortable: true
            }, {
                header: "生产产家",
                dataIndex: "manufacturer",
                menuDisabled: false,
            }, {
                header: "供应商",
                dataIndex: "supplier_name",
                menuDisabled: false,
            },  {
                header: "入库时间",
                dataIndex: "instock_date",
                menuDisabled: false,
            }, {
                header: "有效期",
                dataIndex: "validity",
                menuDisabled: false,
            }, {
                header: '备注',
                dataIndex: 'note',
                menuDisabled: true
            }, {
                header: '操作详情',
                dataIndex: 'operate_info',
                menuDisabled: true
            }],
            store: store,
            bbar: [{
                id: "pagingToolbarDrugBrokenBillBill",
                border: 0,
                xtype: "pagingtoolbar",
                store: store
            }, "-", {
                xtype: "displayfield",
                value: "每页显示"
            }, {
                id: "comboCountPerPageDrugBrokenBillBill",
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
                        fn: function () {
                            store.pageSize = Ext.getCmp("comboCountPerPageDrugBrokenBillBill").getValue();
                            store.currentPage = 1;
                            Ext.getCmp("pagingToolbarDrugBrokenBillBill").doRefresh();
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
                    fn: me.onDrugBrokenBillBillGridSelect,
                    scope: me
                },
                itemdblclick: {
                    fn: me.onEditDrugBrokenBill,
                    scope: me
                }
            }
        });
        Ext.getCmp("pagingToolbarDrugBrokenBillBill").doRefresh();
        me.drugBrokenBillGrid = drugBrokenBillGrid;
        var summaryColumns = me.drugBrokenBillGrid.columns;
        for (var i = 0; i < summaryColumns.length; i++) {
            var itemname = summaryColumns[i].dataIndex;
            (function (itemname) {
                summaryColumns[i].summaryType = summaryFilters.indexOf(itemname) < 0 ? false : function (records) {
                        var gridSum = 0;
                        for (var i = 0; i < records.length; i++) {
                            var item = records[i].get(itemname);
                            var itemPrice = Number.parseFloat(item);
                            gridSum += itemPrice;
                        }
                        return gridSum;
                    }
                if (i === 1) {
                    summaryColumns[1].summaryType = function () {
                        return '合计'
                    }
                }
            })(itemname)

        }
        return me.drugBrokenBillGrid;
    },


    getBankIOGrid: function () {
        var me = this;
        if (me.__bankIOGrid) {
            return me.__bankIOGrid;
        }
        //定义库存调拨单数据字段模型
        Ext.define("PSIStockTransBill", {
            extend: "Ext.data.Model",
            fields: ["id", "drug_id", "drug_name", "supplier_id", "supplier_name",
                "amount", "bill_date", "verify_id", "verify_date", "creator_id",
                "note", "bill_code", "status","allot_date",
                'piaoju_code', 'danju_code', 'purpose',
                "in_deliver_id", "in_deliver_name",
                "out_deliver_id", "out_deliver_name", "batch_num"
            ]
        });
        //库存调拨单数据
        var bankIOStore = Ext.create("Ext.data.Store", {
            autoLoad: false,
            model: "PSIStockTransBill",
            data: [],
            pageSize: 20,
            proxy: {
                type: "ajax",
                actionMethods: {
                    read: "POST"
                },
                url: PSI.Const.BASE_URL + "Home/StockManage/stockTransList",
                reader: {
                    root: 'stockTransList',
                    totalProperty: 'totalCount'
                }
            },
            listeners: {
                beforeload: {
                    fn: function () {
                        bankIOStore.proxy.extraParams = me.getQueryParam();
                    },
                    scope: me
                },
                load: {
                    fn: function (e, records, successful) {
                        if (successful) {
                            me.gotoStockTransGridRecord(me.__lastId);
                        }
                    },
                    scope: me
                }
            }
        });
        me.__bankIOGrid = Ext.create("Ext.grid.Panel", {
            viewConfig: {
                enableTextSelection: true
            },
            title: "库存调拨单列表",
            columnLines: true,
            columns: [Ext.create("Ext.grid.RowNumberer", {
                text: "序号",
                width: 30
            }), {
                header: 'id',
                dataIndex: 'id',
                hidden: true
            }, {
                header: "系统编号",
                dataIndex: "bill_code",
                menuDisabled: false,
                sortable: false,
            }, {
                header: "单据状态",
                dataIndex: "status",
                menuDisabled: false,
                sortable: false,
                renderer: function (v) {
                    switch (v) {
                        case '0':
                            return "<span style='color:red'>未审核</span>";
                        case '1':
                            return "<span>已审核</span>";
                        case '2':
                            return "<span style='color:blue'>未通过审核</span>";
                    }
                }
            }, {
                header: "药品名称",
                dataIndex: "drug_name",
                menuDisabled: false,
                sortable: false
            }, {
                header: "供应商",
                dataIndex: "supplier_name",
                menuDisabled: false,
                sortable: false
            }, {
                header: "转入配送公司",
                dataIndex: "in_deliver_name",
                menuDisabled: false,
                sortable: false
            }, {
                header: "转出配送公司",
                dataIndex: "out_deliver_name",
                menuDisabled: false,
                sortable: false
            }, {
                header: "药品批号",
                dataIndex: "batch_num",
                menuDisabled: false,
                sortable: false
            }, {
                header: '转移数量',
                dataIndex: 'amount',
            }, /*{
                header: "票据编号",
                dataIndex: "piaoju_code",
                menuDisabled: false,
                sortable: false
            },*/ {
                header: "单据编号",
                dataIndex: "danju_code",
                menuDisabled: false,
                sortable: false
            }, {
                header: "调拨日期",
                dataIndex: "allot_date",
                menuDisabled: false,
                sortable: false
            }, {
                header: "审核日期",
                dataIndex: "verify_date",
                menuDisabled: false,
                sortable: false
            }, {
                header: '用途',
                dataIndex: 'purpose',
                hidden: true
            }],
            store: bankIOStore,
            bbar: [{
                id: "pagingToolbar",
                border: 0,
                xtype: "pagingtoolbar",
                store: bankIOStore
            }, "-", {
                xtype: "displayfield",
                value: "每页显示"
            }, {
                id: "comboCountPerPage",
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
                        fn: function () {
                            store.pageSize = Ext
                                .getCmp("comboCountPerPage")
                                .getValue();
                            store.currentPage = 1;
                            Ext.getCmp("pagingToolbar")
                                .doRefresh();
                        },
                        scope: me
                    }
                }
            }, {
                xtype: "displayfield",
                value: "条记录"
            }, {
                xtype: "button",
                text: "导出到excel",
                width: 100,
                margin: "5, 0, 0, 10",
                iconCls: "PSI-button-excelexport",
                handler: me.onExportGrid2Excel4StockTrans,
                scope: me
            }],
            listeners: {
                itemdblclick: {
                    fn: me.onEditStockTrans,
                    scope: me
                }
            }
        });

        me.bankIOGrid = me.__bankIOGrid;
        return me.__bankIOGrid;
    },
    getStockSummaryGrid: function () {
        var me = this;
        if (me.__stockItemGrid) {
            return me.__stockItemGrid;
        }
        //定义库存条目数据字段模型
        Ext.define("PSIStockItem", {
            extend: "Ext.data.Model",
            fields: ["id", "drug_id", "drug_name", "deliver_id", "deliver_name",
                "batch_num", "sum_amount", "expire_time", "alarm_amount", 'guige', 'jldw', 'manufacturer'
            ]
        });
        //账户数据
        var stockItemStore = Ext.create("Ext.data.Store", {
            autoLoad: false,
            model: "PSIStockItem",
            data: [],
            pageSize: 20,
            proxy: {
                type: "ajax",
                actionMethods: {
                    read: "POST"
                },
                url: PSI.Const.BASE_URL + "Home/StockManage/stockSummaryItemList",
                reader: {
                    root: 'stockSummaryItemList',
                    totalProperty: 'totalCount'
                }
            },
            listeners: {
                beforeload: {
                    fn: function () {
                        stockItemStore.proxy.extraParams = me.getQueryParam();
                    },
                    scope: me
                },
                load: {
                    fn: function (e, records, successful) {
                        if (successful) {
                            me.gotoStockItemGridRecord(me.__lastId);
                        }
                    },
                    scope: me
                }
            }
        });
        //定义一个库存条目列表实例
        me.__stockItemGrid = Ext.create("Ext.grid.Panel", {
            viewConfig: {
                enableTextSelection: true,
                forceFit: true
            },
            title: "库存条目",
            columnLines: true,
            columns: [Ext.create("Ext.grid.RowNumberer", {
                text: "序号",
                sortable: true,
                width: 30
            }), {
                header: "配送公司",
                dataIndex: "deliver_name",
                menuDisabled: false,
                sortable: true,
                width: 150
            }, {
                header: "药品名称",
                dataIndex: "drug_name",
                menuDisabled: false,
                sortable: true
            }, {
                header: "规格",
                dataIndex: "guige",
                menuDisabled: false,
                sortable: false
            }, {
                header: "生产厂家",
                dataIndex: "manufacturer",
                menuDisabled: false,
                sortable: true,
                width: 200
            }, {
                header: "单位",
                dataIndex: "jldw",
                menuDisabled: false,
                sortable: false
            }, {
                header: "当前数量",
                dataIndex: "sum_amount",
                menuDisabled: false,
                sortable: true
            }, {
                header: "预警值",
                dataIndex: "alarm_amount",
                menuDisabled: false,
                sortable: true
            }],
            store: stockItemStore,
            bbar: [{
                id: "pagingToolbarStockItem",
                border: 0,
                xtype: "pagingtoolbar",
                store: stockItemStore
            }, "-", {
                xtype: "displayfield",
                value: "每页显示"
            }, {
                id: "comboCountPerPageStockItem",
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
                        fn: function () {
                            stockItemStore.pageSize = Ext.getCmp("comboCountPerPageStockItem").getValue();
                            stockItemStore.currentPage = 1;
                            Ext.getCmp("pagingToolbarStockItem").doRefresh();
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
                    fn: me.onStockItemGridSelect,
                    scope: me
                },
                itemdblclick: {
                    fn: me.onEditStockItemAlarmAmount,
                    scope: me
                }
            }
        });
        me.stockItemGrid = me.__stockItemGrid;
        return me.__stockItemGrid;
    },

    //
    getStockDetailGrid: function () {
        var me = this;
        if (me.__stockDetailGrid) {
            return me.__stockDetailGrid
        }
        var modelName = 'stockDetail_model';
        Ext.define(modelName, {
            extend: 'Ext.data.Model',
            fields: ["id", "drug_id", "drug_name", "deliver_id", "deliver_name","instock_date",
                "batch_num", "amount", "expire_time", "alarm_amount", 'guige', 'jldw', 'manufacturer'
            ]
        });
        var store = Ext.create('Ext.data.Store', {
            autoLoad: false,
            model: modelName,
            data: [],
            title: "对应库存条目",
            proxy: {
                type: "ajax",
                actionMethods: {
                    read: "POST"
                },
                url: PSI.Const.BASE_URL + "Home/StockManage/stockDetailItemList",
                reader: {
                    root: 'stockDetailItemList'
                }
            },
            listeners: {
                beforeload: {
                    fn: function () {
                        store.proxy.extraParams = me.getQueryParam4StockDetail();
                    },
                    scope: me
                },
                load: {
                    fn: function (e, records, successful) {
                        if (successful) {
                        }
                    },
                    scope: me
                }
            }
        });
        me.__stockDetailGrid = Ext.create('Ext.grid.Panel', {
            store: store,
            viewConfig: {
                enableTextSelection: true,
                forceFit: true
            },
            features: [{
                ftype: 'summary',
                dock: 'bottom'
            }],
            columns: [Ext.create("Ext.grid.RowNumberer", {
                text: "序号",
                sortable: true,
                width: 30
            }), {
                header: "药品批号",
                dataIndex: "batch_num",
                menuDisabled: false,
                sortable: true
            }, {
                header: "当前数量",
                dataIndex: "amount",
                menuDisabled: false,
                sortable: true
            }, {
                header: "有效期",
                dataIndex: "expire_time",
                menuDisabled: false,
                sortable: true
            },{
                header: "入库时间",
                dataIndex: "instock_date",
                menuDisabled: false,
                sortable: true
            }],
            columnLines: true,
            listeners: {
                select: {
                    fn: me.freshStockTransGrid,
                    scope: me
                },
                itemdblclick: {
                    //fn : me.onEditStockItemAlarmAmount,
                    //scope : me
                }
            }
        });
        me.stockDetailGrid = me.__stockDetailGrid;

        var summaryColumns = me.__stockDetailGrid.columns;
        for (var i = 0; i < summaryColumns.length; i++) {
            var itemname = summaryColumns[i].dataIndex;
            (function (itemname) {
                summaryColumns[i].summaryType = summaryFilters.indexOf(itemname) < 0 ? false : function (records) {
                        var gridSum = 0;
                        for (var i = 0; i < records.length; i++) {
                            var item = records[i].get(itemname);
                            var itemPrice = Number.parseFloat(item);
                            gridSum += itemPrice;
                        }
                        return gridSum;
                    }
                if (i === 1) {
                    summaryColumns[1].summaryType = function () {
                        return '合计'
                    }
                }
            })(itemname)
        }

        return me.__stockDetailGrid;
    },

    refreshStockDetailGrid: function () {
        var me = this;
        var store = me.stockDetailGrid.getStore();
        store.removeAll();
        store.load();
    },
    /**
     * 新增库存调拨单
     */
    onAddStockTrans: function () {
        var form = Ext.create("PSI.StockManage.StockTransEditForm", {
            parentForm: this
        });
        form.show();
    },

    /**
     * 编辑库存调拨单
     */
    onEditStockTrans: function () {
        var me = this;
        if (me.getPEditStockTrans() == "0") {
            return;
        }

        var item = this.bankIOGrid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("请选择要编辑的库存调拨单");
            return;
        }

        var io = item[0];
        if (io.get('status') == 1) {
            PSI.MsgBox.showInfo("已审核，不得修改");
        } else {
            var form = Ext.create("PSI.StockManage.StockTransEditForm", {
                parentForm: this,
                entity: io
            });

            form.show();
        }

    },

    /**
     * 删除库存调拨单
     */
    onDeleteStockTrans: function () {
        var item = this.bankIOGrid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("请选择要删除的库存调拨单");
            return;
        }

        var io = item[0];
        if (io.get('status') == 1) {
            PSI.MsgBox.showInfo("已审核的库存调拨单无法删除！");
            return;
        }
        var info = "请确认是否删除该库存调拨单: <span style='color:red'>转出配送公司：" + io.get("out_deliver_name") + "，转入配送公司：" + io.get('in_deliver_name') + "</span>";
        var me = this;

        var store = me.bankIOGrid.getStore();
        var index = store.findExact("id", io.get("id"));
        index--;
        var preIndex = null;
        var preItem = store.getAt(index);
        if (preItem) {
            preIndex = preItem.get("id");
        }
        PSI.MsgBox.confirm(info, function () {
            var el = Ext.getBody();
            el.mask("正在删除中...");
            Ext.Ajax.request({
                url: PSI.Const.BASE_URL + "Home/StockManage/deleteStockTrans",
                method: "POST",
                params: {
                    id: io.get("id")
                },
                callback: function (options, success, response) {
                    el.unmask();

                    if (success) {
                        var data = Ext.JSON
                            .decode(response.responseText);
                        if (data.success) {
                            PSI.MsgBox.tip("成功完成删除操作");
                            me.freshStockTransGrid(preIndex);
                        } else {
                            PSI.MsgBox.showInfo(data.msg);
                        }
                    }
                }
            });
        });
    },

    /**
     * 刷新库存条目
     */
    freshStockItemGrid: function () {
        var me = this;
        var store = me.stockItemGrid.getStore();
        store.removeAll();
        store.load();
    },

    /**
     * 刷新库存调拨单列表
     */
    freshStockTransGrid: function () {
        var me = this;
        var store = me.bankIOGrid.getStore();
        store.removeAll();
        store.load();
    },


    /**
     * 库存条目被选中时候，刷新库存调拨单
     */
    onStockItemGridSelect: function () {
        var me = this;
        me.bankIOGrid.getStore().currentPage = 1;
        me.refreshStockDetailGrid();
    },

    /**
     * 新增库存条目
     */
    onAddStockItem: function () {
        var form = Ext.create("PSI.StockManage.StockItemEditForm", {
            parentForm: this
        });

        form.show();
    },

    /**
     * 编辑库存条目预警值
     */
    onEditStockItemAlarmAmount: function () {
        var me = this;

        var item = this.stockItemGrid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("没有选择库存条目");
            return;
        }
        var data = item[0];

        var form = Ext.create("PSI.StockManage.StockItemAlarmEditForm", {
            parentForm: this,
            entity: data
        });
        form.show();


    },

    /**
     * 编辑库存批号信息
     */
    onEditStockBatchItem: function () {
        var me = this;

        var item = this.stockDetailGrid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("没有选择批号条目");
            return;
        }
        var data = item[0];

        var form = Ext.create("PSI.StockManage.StockBatchItemEditForm", {
            parentForm: this,
            entity: data
        });
        form.show();
    },


    /**
     * 删除库存条目
     */
    onDeleteStockItem: function () {
        var me = this;
        var item = me.stockItemGrid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("请选择要删除的库存条目");
            return;
        }

        var account = item[0];

        var store = me.stockItemGrid.getStore();
        var index = store.findExact("id", account.get("id"));
        index--;
        var preIndex = null;
        var preItem = store.getAt(index);
        if (preItem) {
            preIndex = preItem.get("id");
        }

        var info = "请确认是否删除库存条目: <span style='color:red'>" + account.get("account_name") + "</span>";
        var me = this;
        PSI.MsgBox.confirm(info, function () {
            var el = Ext.getBody();
            el.mask("正在删除中...");
            Ext.Ajax.request({
                url: PSI.Const.BASE_URL + "Home/StockManage/deleteStockItem",
                method: "POST",
                params: {
                    id: account.get("id")
                },
                callback: function (options, success, response) {
                    el.unmask();

                    if (success) {
                        var data = Ext.JSON.decode(response.responseText);
                        if (data.success) {
                            PSI.MsgBox.tip("成功完成删除操作");
                            me.freshStockItemGrid(preIndex);
                        } else {
                            PSI.MsgBox.showInfo(data.msg);
                        }
                    }
                }

            });
        });
    },

    gotoStockItemGridRecord: function (id) {
        var me = this;
        var grid = me.stockItemGrid;
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
    gotoStockTransGridRecord: function (id) {
        var me = this;
        var grid = me.bankIOGrid;
        var store = grid.getStore();
        if (id) {
            var r = store.findExact("id", id);
            if (r != -1) {
                grid.getSelectionModel().select(r);
            } else {
                grid.getSelectionModel().select(0);
            }
        } else {
            grid.getSelectionModel().select(0);
        }
    },


    // 提交采购入库单
    onCommit: function () {
        var me = this;
        var item = me.bankIOGrid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("没有选择要编辑的库存调拨单");
            return;
        }
        var bill = item[0];

        if (bill.get("status") == 1) {
            PSI.MsgBox.showInfo("该库存调拨单已经审核过了");
            return;
        }

        var info = "请确认库存调拨单审核通过?";
        PSI.MsgBox.verify(info, function () {
            //审核通过
            me.verifyRequest(bill, 'yes')
        }, function () {
            //审核不通过
            me.verifyRequest(bill, 'no')
        });
    },
    onCommitReturn: function () {
        var me = this;
        var item = me.bankIOGrid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("没有选择要编辑的库存调拨单");
            return;
        }
        var bill = item[0];

        if (bill.get("status") != 1) {
            PSI.MsgBox.showInfo("该库存调拨单无法进行此操作");
            return;
        }
        var info = "确认要反审核该库存调拨单？";
        PSI.MsgBox.confirm(info, function () {
            me.verifyRequest(bill, 'return')
        });
    },

    verifyRequest: function (bill, type) {
        var id = bill.get("id");
        var me = this;
        var el = Ext.getBody();
        el.mask("正在提交中...");
        Ext.Ajax.request({
            url: PSI.Const.BASE_URL + "Home/StockManage/stockTransStatus",
            method: "POST",
            params: {
                id: id,
                type: type
            },
            callback: function (options, success, response) {
                el.unmask();

                if (success) {
                    var data = Ext.JSON.decode(response.responseText);
                    if (data.success) {
                        PSI.MsgBox.showInfo("操作成功", function () {
                            me.freshStockTransGrid();
                            me.freshStockItemGrid();
                        });
                    } else {
                        PSI.MsgBox.showInfo(data.msg);
                    }
                } else {
                    PSI.MsgBox.showInfo("网络错误", function () {
                        window.location.reload();
                    });
                }
            }
        });
    },


    onQueryEditSpecialKey: function (field, e) {
        if (e.getKey() === e.ENTER) {
            var me = this;
            var id = field.getId();
            for (var i = 0; i < me.__queryEditNameList.length - 1; i++) {
                var editorId = me.__queryEditNameList[i];
                if (id === editorId) {
                    var edit = Ext.getCmp(me.__queryEditNameList[i + 1]);
                    edit.focus();
                    edit.setValue(edit.getValue());
                }
            }
        }
    },

    onLastQueryEditSpecialKey: function (field, e) {
        if (e.getKey() === e.ENTER) {
            this.onQuery();
        }
    },


    getQueryParam4StockDetail: function () {
        var me = this;
        var item = me.stockItemGrid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            return {};
        }

        var result = {};
        result.drug_id = item[0].get("drug_id");
        result.deliver_id = item[0].get("deliver_id");
        return result;
    },
    getQueryParam: function () {
        var me = this;
        var item = me.stockDetailGrid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            stock_id = null;
        } else {
            stock_id = item[0].get("id");
        }

        var result = {
            stock_id: stock_id
        };

        var drug_name = Ext.getCmp("editQueryDrugName").getValue();
        if (drug_name) {
            result.drug_name = drug_name;
        }

        var deliver_name = Ext.getCmp("editQueryDeliver").getValue();
        if (deliver_name) {
            result.deliver_name = deliver_name;
        }

        var batch_num = Ext.getCmp("editQueryBatchNum").getValue();
        if (batch_num) {
            result.batch_num = batch_num;
        }

        return result;
    },

    onQuery: function () {
        this.freshStockItemGrid();
        this.freshStockTransGrid();
    },

    onClearQuery: function () {
        var nameList = this.__queryEditNameList;
        for (var i = 0; i < nameList.length; i++) {
            var name = nameList[i];
            var edit = Ext.getCmp(name);
            if (edit) {
                edit.setValue(null);
            }
        }
        this.stockItemGrid.getSelectionModel().clearSelections();
        // this.onQuery();
        Ext.getCmp("editQueryDrugName").setValue(null);
        Ext.getCmp("editQueryDeliver").setValue(null);
        Ext.getCmp("editQueryBatchNum").setValue(null);
        this.freshStockItemGrid()
        this.freshStockTransGrid();
    },

    onExportGrid2Excel4StockSummarr: function () {
        var me = this;
        var config = {
            store: me.__stockItemGrid.getStore(),
            title: "库存管理库存条目"
        };
        //var tab=tabPanel.getActiveTab();//当前活动状态的Panel
        ExportExcel(me.__stockItemGrid, config); //调用导出函数
    },

    onExportGrid2Excel4StockDetailItem: function () {
        var url = PSI.Const.BASE_URL + "Home/StockManage/exportStockDetailItem";
        window.open(url);
    },

    onExportGrid2Excel4StockTrans: function () {
        var me = this;
        var config = {
            store: me.__bankIOGrid.getStore(),
            title: "库存调拨单"
        };
        //var tab=tabPanel.getActiveTab();//当前活动状态的Panel
        ExportExcel(me.__bankIOGrid, config); //调用导出函数
    },


    getQueryParam4DrugBrokenBillBill: function() {
        var result = {};
        // var type = Ext.getCmp("editQueryType4BrokenBill").getValue();
        // if (type) {
        //     // result.date = Ext.Date.format(date, "Y");
        //     result.type = type
        // }
        return result;
    },

    gotoDrugBrokenBillBillGridRecord: function(id) {
        var me = this;
        var grid = me.drugBrokenBillGrid;
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

    //编辑
    onEditDrugBrokenBill: function() {
        var me = this;
        if (me.getPBrokenBillBillEdit() == "0")
            return;

        var item = me.drugBrokenBillGrid.getSelectionModel().getSelection();

        if (item == null || item.length != 1) {
            PSI.MsgBox.tip("没有选择要编辑的库存破损账款单");
            return;
        }
        var bill = item[0];
        if(bill['type'] == 0){
            PSI.MsgBox.tip("入库前破损单允许编辑，请到入库单里编辑");
            return;
        }

        if (bill.get('status') == 1) {
            PSI.MsgBox.showInfo('已审核，无法编辑');
            return;
        }
        var form = Ext.create("PSI.StockManage.BrokenBillEditForm", {
            parentForm: me,
            entity: bill
        });
        console.log(bill);
        form.show();
    },

    //新增库存破损单据
    onAddBrokenBillBill: function() {
        var me = this;
        if (me.getPBrokenBillBillAdd() == "0")
            return;
        var form = Ext.create("PSI.StockManage.BrokenBillEditForm", {
            parentForm: this
        });

        form.show();
    },

    //删除库存破损账款单
    onDeleteBrokenBillBill: function() {
        var me = this;
        if (me.getPBrokenBillBillDelete() == "0") return;

        var item = me.drugBrokenBillGrid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("没有选择要删除的库存破损账款单");
            return;
        }

        var bill = item[0];

        if (bill.get('type') == 0) {
            PSI.MsgBox.showInfo('入库前破损单请到入库位置删除');
            return;
        }

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
                url: PSI.Const.BASE_URL + "Home/StockManage/deleteBrokenBillBill",
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
                                me.updateDrugBrokenBillGrid();
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
    //审核库存破损账款单
    onBrokenBillBillCommit: function() {
        var me = this;
        var item = me.drugBrokenBillGrid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("没有选择要操作的条目");
            return;
        }
        var bill = item[0];

        if (bill.get("type") == 0) {
            PSI.MsgBox.showInfo("入库前破损单审核请到入库单位置操作");
            return;
        }

        if (bill.get("status") == 1) {
            PSI.MsgBox.showInfo("该条目已经审核过了");
            return;
        }

        var info = "请确认该条目审核通过?";
        PSI.MsgBox.verify(info, function() {
            //审核通过
            me.verifyRequest4BrokenBill(bill, 'yes')
        }, function() {
            //审核不通过
            me.verifyRequest4BrokenBill(bill, 'no')
        });
    },

    //反审核其他收支单
    onBrokenBillBillCommitReturn: function() {
        var me = this;
        var item = me.drugBrokenBillGrid.getSelectionModel().getSelection();
        if (item == null || item.length != 1) {
            PSI.MsgBox.showInfo("没有选择要操作的条目");
            return;
        }
        var bill = item[0];

        if (bill.get("type") == 0) {
            PSI.MsgBox.showInfo("入库前破损单请到入库单位置操作");
            return;
        }

        if (bill.get("status") != 1) {
            PSI.MsgBox.showInfo("该条目无法进行此操作");
            return;
        }
        var info = "确认要反审核该条目?";
        PSI.MsgBox.confirm(info, function() {
            me.verifyRequest4BrokenBill(bill, 'return')
        });
    },

    onBrokenBillGirdQuery: function() {
        this.updateDrugBrokenBillGrid();
    },
    refreshBrokenBillBillGrid: function() {
        Ext.getCmp("pagingToolbarBrokenBillBill").doRefresh();
    },
    onClearBrokenBillBillGirdQuery: function() {
        var me = this;

        Ext.getCmp("editQueryType4BrokenBill").setValue(null);

        me.updateDrugBrokenBillGrid();
    },
    //库存破损账款的审核与反审核
    verifyRequest4BrokenBill: function(bill, type) {
        var id = bill.get("id");
        var me = this;
        var el = Ext.getBody();
        el.mask("正在提交中...");
        Ext.Ajax.request({
            url: PSI.Const.BASE_URL + "Home/StockManage/stockBrokenBillStatus",
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
                            me.updateDrugBrokenBillGrid();
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



});