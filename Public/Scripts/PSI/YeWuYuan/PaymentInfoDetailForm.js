/**
 * 商品 - 新建或编辑界面
 */
Ext.define("PSI.YeWuYuan.PaymentInfoDetailForm", {
    extend: "Ext.window.Window",

    config: {
        parentForm: null,
        entity: null
    },

    /**
     * 初始化组件
     */
    initComponent: function() {
        var me = this;
        var entity = me.getEntity();
        var modelName = entity + '_model';
        Ext.define(modelName, {
            extend: 'Ext.data.Model',
            fields: ["employee_id", "employee_des", "employee_profit", 'pay_sum_money',
                "employee_name", "drug_id", "drug_name", "drug_guige", "drug_manufacture",
                "hospital_id", "hospital_name", "drug2deliver_id", "deliver_id", "deliver_name",
                "batch_num", "sell_amount", "sell_date", "create_time", 'bill_code',
                "creator_id", "note", "if_paid", "pay_time", "paybill_id", "status", "sell_month"
            ]
        });
        var store = Ext.create('Ext.data.Store', {
            autoLoad: false,
            model: modelName,
            data: [],
            pageSize: 20,
            proxy: {
                type: "ajax",
                actionMethods: {
                    read: "POST"
                },
                url: PSI.Const.BASE_URL + "Home/BusinessPay/getDailySellById",
                extraParams: {
                    'id': entity
                },
                reader: {
                    root: 'all_data',
                    totalProperty: 'totalCount'
                }
            }
        });


        me.innerGrid = Ext.create('Ext.grid.Panel', {
            store: store,
            forceFit: false,
            columns: [Ext.create("Ext.grid.RowNumberer", {
                text: "序号",
                width: 30
            }), {
                header: "业务员身份",
                dataIndex: "employee_des",
                menuDisabled: false,
                sortable: false,
            }, {
                header: "销售月份",
                dataIndex: "sell_month",
                menuDisabled: false,
                sortable: false,
            }, {
                header: "支付金额",
                dataIndex: "pay_sum_money",
                menuDisabled: false,
                sortable: true,
                renderer: function(v) {
                    return "<b style='color:blue'>" + v + "</b>";
                }
            }, {
                header: "销售数量",
                dataIndex: "sell_amount",
                menuDisabled: false,
                sortable: true,
                renderer: function(v) {
                    return "<b style='color:blue'>" + v + "</b>";
                }
            }, {
                header: "业务日期",
                dataIndex: "sell_date",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "药品",
                dataIndex: "drug_name",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "医院",
                dataIndex: "hospital_name",
                menuDisabled: false,
                sortable: true,
            }],
            columnLines: true,
            bbar: [{
                id: "pagingToobarDetail",
                xtype: "pagingtoolbar",
                border: 0,
                store: store
            }, "-", {
                xtype: "displayfield",
                value: "每页显示"
            }, {
                id: "comboCountPerPageDetail",
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
                            store.pageSize = Ext
                                .getCmp("comboCountPerPageDetail")
                                .getValue();
                            store.currentPage = 1;
                            Ext.getCmp("pagingToobarDetail")
                                .doRefresh();
                        },
                        scope: me
                    }
                }
            }, {
                xtype: "displayfield",
                value: "条记录"
            }],
        });

        Ext.apply(me, {
            title: '打款信息',
            modal: true,
            resizable: true,
            maximizable: true,
            maximized: true,
            width: 1000,
            height: 600,
            onEsc: Ext.emptyFn,
            layout: "fit",
            border: 0,
            items: [{
                id: "importForm",
                xtype: "panel",
                region: "center",
                layout: "fit",
                border: 0,
                items: [me.innerGrid]
            }]
        });
        store.removeAll();
        store.load();
        me.callParent(arguments);
    },
});