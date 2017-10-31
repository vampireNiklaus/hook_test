/**
 * 回款单单
 *
 * @author rcg
 */
Ext.define("PSI.BankDeposit.BankIODetailForm", {
    extend: "Ext.window.Window",

    config: {
        parentForm: null,
        entity: null,
    },
    detailGrid: [],

    /**
     * 初始化组件
     */
    initComponent: function() {
        var me = this;
        var entity = me.getEntity();
        me.entity = entity;


        Ext.apply(me, {
            title: "银行转账详情",
            modal: true,
            resizable: true,
            maximizable: true,
            maximized: true,
            onEsc: Ext.emptyFn,
            width: 1000,
            height: 600,
            layout: "fit",
            items: [{
                id: "importForm",
                xtype: "form",
                layout: "border",
                items: [{
                    region: 'center',
                    layout: "border",
                    xtype: "container",
                    border: 0,
                    height: 600,
                    items: [{
                        region: "center",
                        height: 400,
                        border: 0,
                        layout: "border",
                        items: [{
                            xtype: "panel",
                            region: "center",
                            border: 0,
                            layout: "fit",
                            items: [me.getBankIODetailGrid()]
                        }]
                    }, {
                        region: 'north',
                        layout: {
                            type: "table",
                            columns: 6
                        },
                        height: 90,
                        border: 0,
                        title: "查询、账户选择",
                        items: [{
                            id: "editQueryBank",
                            labelWidth: 60,
                            labelAlign: "right",
                            labelSeparator: "",
                            fieldLabel: "银行账号",
                            margin: "5, 0, 0, 0",
                            xtype: "psi_bank_account_field",
                            listeners: {
                                change: function() {}
                            },
                            idValue: me.entity.id,
                            value: me.entity.account_name + ":" + me.entity.account_num
                        }, {
                            id: "editQueryBankId",
                            xtype: "hidden",
                            value: me.getEntity().id
                        }, {
                            id: "editQuerySearchDateFrom",
                            labelWidth: 120,
                            labelAlign: "right",
                            labelSeparator: "：",
                            fieldLabel: "业务日期范围（起）",
                            margin: "5, 0, 0, 0",
                            allowBlank: false,
                            width: 300,
                            xtype: "datefield",
                            format: "Y-m-d",
                            value: new Date("2017-01-01"),
                            listeners: {
                                change: function() {

                                }
                            }
                        }, {
                            id: "editQuerySearchDateTo",
                            labelWidth: 120,
                            labelAlign: "right",
                            labelSeparator: "：",
                            fieldLabel: "业务日期范围（止）",
                            margin: "5, 0, 0, 0",
                            allowBlank: false,
                            width: 300,
                            xtype: "datefield",
                            format: "Y-m-d",
                            value: new Date(),
                            listeners: {
                                change: function() {

                                }
                            }
                        }, {
                            xtype: "container",
                            items: [{
                                xtype: "button",
                                text: "查询",
                                width: 100,
                                margin: "5 0 0 10",
                                iconCls: "PSI-button-refresh",
                                handler: me.refreshMainIOGrid,
                                scope: me
                            }, {
                                xtype: "button",
                                text: "清空查询条件",
                                width: 100,
                                margin: "5, 0, 0, 10",
                                handler: me.onClearQuery,
                                scope: me
                            }]
                        }]
                    }]
                }]
            }],
            listeners: {
                show: {
                    fn: me.onWndShow,
                    scope: me
                },
                close: {
                    fn: me.onWndClose,
                    scope: me
                }
            }
        });

        me.callParent(arguments);
        me.refreshMainIOGrid(1);
        me.__editorList = [];

    },
    onWndShow: function() {
        var me = this;

        var el = me.getEl() || Ext.getBody();
        el.mask(PSI.Const.LOADING);
        Ext.Ajax.request({
            url: PSI.Const.BASE_URL + "Home/BankDeposit/bankIODetaillList",
            params: me.getQueryParam(),
            method: "POST",
            callback: function(options, success, response) {
                el.unmask();

                if (success) {
                    var data = Ext.JSON.decode(response.responseText);
                    if (data.bankIODetaillList) {
                        var store = me.getGoodsGrid().getStore();
                        store.removeAll();
                        store.add(data.bankIODetaillList);
                    }
                } else {
                    PSI.MsgBox.showInfo("网络错误")
                }
            }
        });
    },

    onWndClose: function() {

    },

    onEditSpecialKey: function(field, e) {
        if (e.getKey() === e.ENTER) {
            var me = this;
            var id = field.getId();
            for (var i = 0; i < me.__editorList.length; i++) {
                var editorId = me.__editorList[i];
                if (id === editorId) {
                    var edit = Ext.getCmp(me.__editorList[i + 1]);
                    edit.focus();
                    edit.setValue(edit.getValue());
                }
            }
        }
    },



    //获取销售信息列表
    getBankIODetailGrid: function() {
        var me = this;
        if (me.bankIODetailGrid) {
            return me.bankIODetailGrid;
        }
        var entity = me.getEntity();
        var modelName = "PSIBankIODetail";
        Ext.define(modelName, {
            extend: "Ext.data.Model",
            fields: ["id", "category", "account_name", "account_num", "operate_time", "operater", "description", "money"]
        });
        var store = Ext.create("Ext.data.Store", {
            autoLoad: true,
            model: modelName,
            data: [],
            pageSize: 20,
            proxy: {
                type: "ajax",
                actionMethods: {
                    read: "POST"
                },
                url: PSI.Const.BASE_URL + "Home/BankDeposit/bankIODetaillList",
                reader: {
                    root: 'bankIODetaillList',
                    totalProperty: 'totalCount'
                }
            }
        });
        store.on("beforeload", function() {
            store.proxy.extraParams = me.getQueryParam();
        });
        store.on("load", function(e, records, successful) {
            if (successful) {
                // me.bankIODetailGrid.getSelectionModel().select(0);
            }
        });
        me.bankIODetailGrid = Ext.create("Ext.grid.Panel", {
            viewConfig: {
                enableTextSelection: true
            },
            features: [{
                ftype: 'summary',
                // dock: 'bottom'
            }],
            bbar: [{
                id: "pagingToobarIODetail",
                xtype: "pagingtoolbar",
                border: 0,
                store: store
            }, "-", {
                xtype: "displayfield",
                value: "每页显示"
            }, {
                id: "comboCountPerPageIODetail",
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
                            store.pageSize = Ext.getCmp("comboCountPerPageIODetail").getValue();
                            store.currentPage = 1;
                            Ext.getCmp("pagingToobarIODetail").doRefresh();
                        },
                        scope: me
                    }
                }
            }, {
                xtype: "displayfield",
                value: "条记录"
            }],
            border: 0,
            title: "品种列表",
            columnLines: true,
            columns: [{
                header: "类目",
                dataIndex: "category",
                menuDisabled: false,
                sortable: true
            }, {
                header: "对应账户",
                dataIndex: "account_name",
                menuDisabled: false,
                sortable: true
            }, {
                header: "对应账号",
                dataIndex: "account_num",
                menuDisabled: false,
                sortable: true
            }, {
                header: "操作时间",
                dataIndex: "operate_time",
                width: 100,
                menuDisabled: false,
                sortable: true
            }, {
                header: "操作用户",
                dataIndex: "operater",
                menuDisabled: false,
                sortable: true
            }, {
                header: "详情",
                dataIndex: "description",
                width: 200,
                menuDisabled: false,
                sortable: true
            }, {
                header: "变动金额",
                dataIndex: "money",
                menuDisabled: false,
                sortable: true
            }],
            store: store,
            listeners: {
                itemdblclick: {
                    fn: function() {
                        return false;
                    },
                    scope: me
                }
            }
        });
        return me.bankIODetailGrid;
    },



    //刷新销售信息列表
    refreshMainIOGrid: function(currentPage) {
        var me = this;
        var grid = me.bankIODetailGrid == null ? me.getBankIODetailGrid() : me.bankIODetailGrid;
        var store = grid.getStore();
        store.removeAll();
        store.load();
    },

    //获取查询的字段
    getQueryParam: function() {
        var result = {};

        var bankcard_id = Ext.getCmp("editQueryBank").getIdValue();
        if (bankcard_id != null && bankcard_id != "") {
            result.bankcard_id = Ext.getCmp("editQueryBank").getIdValue();
        } else {
            if (Ext.getCmp("editQueryBankId").getValue())
                result.bankcard_id = Ext.getCmp("editQueryBankId").getValue();
        }

        var date_from = Ext.getCmp("editQuerySearchDateFrom").getValue();
        var date_to = Ext.getCmp("editQuerySearchDateTo").getValue();
        if (date_from && date_to) {
            if (date_from > date_to) {
                var temp = date_from;
                date_from = date_to;
                date_to = temp;
            }
            result.date_from = Ext.Date.format(date_from, "Y-m-d");
            result.date_to = Ext.Date.format(date_to, "Y-m-d");
        } else {
            result.date_from = Ext.Date.format(new Date(), "Y-m-d");
            result.date_to = Ext.Date.format(new Date(), "Y-m-d");
        }
        return result;
    },


    //搜索查询
    onQuery: function() {
        var me = this;
        var grid = me.bankIODetailGrid;
        var store = grid.getStore();
        store.load();
    },


    //清空查询条件
    onClearQuery: function() {

    },

});