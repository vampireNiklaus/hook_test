/**
 * 回款单单
 *
 * @author rcg
 */
Ext.define("PSI.DeleHuikuan.DeleHuikuanEditForm", {
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

        me.adding = entity == null;
        if (!me.adding)
            me.entity = entity;
        var buttons = [];
        buttons.push({
            text: entity == null ? "添加到待回款回款单单" : '保存修改',
            formBind: true,
            iconCls: "PSI-button-ok",
            handler: function() {
                me.onOk();
            },
            scope: me
        });
        buttons.push({
            text: "关闭",
            handler: function() {
                me.close();
            },
            scope: me
        });
        me.__cellEditing = Ext.create("PSI.UX.CellEditing", {
            clicksToEdit: 1,
            listeners: {
                edit: {
                    fn: me.cellEditingAfterEdit,
                    scope: me
                }
            }
        });

        Ext.apply(me, {
            title: entity == null ? "新增回款单" : "编辑回款单",
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
                            items: me.getDailySellSubGrid()
                        }, {
                            region: "west",
                            width: 500,
                            hidden: entity == null ? false : true,
                            xtype: "panel",
                            split: true,
                            border: 0,
                            layout: "fit",
                            items: me.getDailySellGrid()
                        }]
                    }, {
                        region: 'north',
                        layout: {
                            type: "table",
                            columns: 4
                        },
                        height: 90,
                        border: 0,
                        title: "查询、账户选择",
                        items: [{
                            id: "editQueryDrug",
                            labelWidth: 60,
                            labelAlign: "right",
                            labelSeparator: "",
                            fieldLabel: "品种",
                            margin: "5, 0, 0, 0",
                            xtype: "psi_drug_field",
                            hidden: me.entity == null ? false : true,
                            listeners: {
                                change: function() {

                                }
                            }
                        }, {
                            fieldLabel: "品种",
                            labelWidth: 60,
                            labelSeparator: "：",
                            labelAlign: "right",
                            xtype: 'displayfield',
                            margin: '5px',
                            value: me.entity == null ? "" : me.entity.get('common_name'),
                            renderer: function(v) {
                                return "<b style='color:blue;font-size:25px;'>" + v + "</b>"
                            },
                            hidden: me.entity == null ? true : false
                        }, {
                            id: "editQuerySearchDateFrom",
                            labelWidth: 120,
                            labelAlign: "right",
                            labelSeparator: "：",
                            fieldLabel: "销售日期（起）",
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
                            id: "editQuerySearchDateTo",
                            labelWidth: 120,
                            labelAlign: "right",
                            labelSeparator: "：",
                            fieldLabel: "销售日期（止）",
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
                                handler: me.entity == null ? me.onQuery : me.onQuery4Edit,
                                scope: me
                            }, {
                                xtype: "button",
                                text: "清空查询条件",
                                width: 100,
                                margin: "5, 0, 0, 10",
                                handler: me.onClearQuery,
                                scope: me
                            }]
                        }, {
                            id: "editQueryBankAccount",
                            labelWidth: 80,
                            labelAlign: "right",
                            labelSeparator: "：",
                            fieldLabel: "回款账户",
                            margin: "5, 0, 0, 0",
                            allowBlank: false,
                            //width:300,
                            xtype: "psi_bank_account_field",
                            value: entity == null ? "" : entity.get('huikuan_account_name') + "，" + "卡号：" + entity.get('huikuan_account_num'),
                            listeners: {
                                change: function() {

                                }
                            },

                        }, {
                            id: "editQueryBillDate",
                            labelWidth: 80,
                            labelAlign: "right",
                            labelSeparator: "：",
                            fieldLabel: "单据日期",
                            margin: "5, 0, 0, 0",
                            allowBlank: false,
                            //width:300,
                            xtype: "datefield",
                            format: "Y-m-d",
                            value: entity == null ? new Date() : entity.get('bill_date'),
                            listeners: {
                                change: function() {}
                            }
                        }]
                    }]
                }]
            }],
            buttons: buttons,
            listeners: {
                // show : {
                // 	fn : me.onWndShow,
                // 	scope : me
                // },
                close: {
                    fn: function() {
                        me.getParentForm().freshDeleHuikuanGrid();
                    },
                    scope: me
                }
            }
        });

        me.callParent(arguments);
        me.refreshDailySellGrid(1);

        if (!me.adding) {
            Ext.getCmp('editQueryBankAccount').setIdValue(me.entity.get('huikuan_account'));
            Ext.getCmp('editQueryBillDate').setValue(me.entity.get('bill_date'));
        }
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

    getQueryCmp: function() {
        var me = this;
        return [];
    },

    //获取销售信息列表
    getDailySellGrid: function() {
        var me = this;
        if (me.dailySellGrid) {
            return me.dailySellGrid;
        }
        var entity = me.getEntity();
        if (entity != null) return;
        var modelName = "PSIDailySell";
        Ext.define(modelName, {
            extend: "Ext.data.Model",
            fields: ["drug_id", 'drug_name', 'jx', 'jldw', 'guige', 'drug_name', 'manufacturer']
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
                url: PSI.Const.BASE_URL + "Home/Drug/getDeleDrugList",
                reader: {
                    root: 'drugList',
                    totalProperty: 'totalCount'
                }
            }
        });
        store.on("beforeload", function() {
            store.proxy.extraParams = me.getQueryParam();
        });
        store.on("load", function(e, records, successful) {
            if (successful) {
                me.dailySellGrid.getSelectionModel().select(0);
            }
        });
        me.dailySellGrid = Ext.create("Ext.grid.Panel", {
            viewConfig: {
                enableTextSelection: true
            },
            features: [{
                ftype: 'summary'
            }],
            border: 0,
            title: "品种列表",
            // forceFit : true,
            columnLines: true,
            columns: [Ext.create("Ext.grid.RowNumberer", {
                text: "序号",
                width: 40
            }), {
                header: "品种",
                dataIndex: "drug_name",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "规格",
                dataIndex: "guige",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "剂型",
                dataIndex: "jx",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "计量单位",
                dataIndex: "jldw",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "生产企业",
                dataIndex: "manufacturer",
                menuDisabled: false,
                sortable: true,
            }],
            store: store,
            listeners: {
                itemdblclick: {
                    fn: function() {
                        return false;
                    },
                    scope: me
                },
                select: {
                    fn: me.onDailySellGridSelect,
                    scope: me
                },
            }
        });
        return me.dailySellGrid;
    },

    //获取销售信息列表
    getDailySellSubGrid: function() {
        var me = this;
        if (me.dailySellSubGrid) {
            return me.dailySellSubGrid;
        }
        me.deselectArr = [];
        var modelName = "PSIDailySell";
        Ext.define(modelName, {
            extend: "Ext.data.Model",
            fields: ['huikuan_unit_price', 'pay_sum_money',
                "drug_name", "drug_id", "drug_name", "drug_guige", "drug_manufacture",
                "hospital_id", "hospital_name", "drug2deliver_id", "deliver_id", "deliver_name",
                "batch_num", "sell_amount", "sell_date", "create_time", 'bill_code', 'now_date', 'sell_id_list',
                "creator_id", "note", "if_paid", "pay_time", "paybill_id", "status", 'employee_profit', 'sell_amount',
                'before_3m_money', 'after_3m_money', 'next_amount', 'next_money', 'sell_month'
            ]
        });
        var url = me.adding ? "Home/DailySell/getDailySellDetail4DeleHuikuan" : "Home/DailySell/getEditDailySellDetail4Huikuan";
        var sm = Ext.create('Ext.selection.CheckboxModel', {
            injectCheckbox: 0, //checkbox位于哪一列，默认值为0
            //mode:'single',//multi,simple,single；默认为多选multi
            checkOnly: true, //如果值为true，则只用点击checkbox列才能选中此条记录
            //allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
            //enableKeyNav:false,
            // renderer:function(){
            //
            // }
        });
        var store = Ext.create("Ext.data.Store", {
            autoLoad: false,
            model: modelName,
            data: [],
            pageSize: 20,
            proxy: {
                type: "ajax",
                actionMethods: {
                    read: "POST"
                },
                url: PSI.Const.BASE_URL + url,
                reader: {
                    root: 'dailySellList',
                    totalProperty: 'totalCount'
                }
            }
        });
        store.on("beforeload", function() {
            if (me.adding) //新建
                store.proxy.extraParams = me.getParentSelectParam();
            else {
                store.proxy.extraParams = me.getParentSelectParam4Edit();
            }
        });
        store.on("load", function(e, records, successful) {
            if (successful) {
                sm.selectAll();
                for (var i in records) {
                    if (records[i].get('paybill_id') == '0') {
                        sm.deselect(records[i]);
                    }
                }
            }
        });


        me.dailySellSubGrid = Ext.create("Ext.grid.Panel", {
            viewConfig: {
                enableTextSelection: true
            },
            plugins: [me.__cellEditing],
            border: 0,
            deferRowRender: false,
            title: "销售信息列表",
            selModel: sm,
            columnLines: true,
            features: [{
                ftype: 'summary'
            }],
            columns: [Ext.create("Ext.grid.RowNumberer", {
                text: "序号",
                width: 30
            }), {
                header: "单据状态",
                dataIndex: "status",
                renderer: function(v) {
                    switch (v) {
                        case '0':
                            return "<span style='color:red'>未匹配</span>";
                            break;
                        case '1':
                            return "<span style='color:green'>已匹配</span>";
                            break;
                        default:
                            return "<span style='color:red'>未匹配</span>";

                    }
                }
            }, {
                header: "月份",
                dataIndex: "sell_month",
                menuDisabled: false,
                sortable: false,
            }, {
                header: "批号",
                dataIndex: "batch_num",
                menuDisabled: false,
                sortable: false,
            }, {
                header: "医院",
                dataIndex: "hospital_name",
            }, {
                header: "回款月销量",
                dataIndex: "sell_amount",
                summaryType: 'sum',

            }, {
                header: "回款单价",
                dataIndex: "huikuan_unit_price",
                menuDisabled: false,
                align: "right",
                width: 100,
                editor: {
                    xtype: "numberfield",
                    allowDecimals: true,
                    decimalPrecision: 3,
                    hideTrigger: false
                },
                listeners: {
                    change: {
                        fn: function() {
                            // var items = me.dailySellSubGrid.getSelectionModel().getSelection();
                            // if(items.length == 1){
                            //     var item = items[0];
                            //     item.set("pay_sum_money",item.get("huikuan_unit_price")*item.get("sell_amount"));
                            // }
                        },
                        scope: me
                    }
                },
            }, {
                header: "回款金额",
                dataIndex: "pay_sum_money",
                renderer: function(value, meta, record) {
                    return (record.get("huikuan_unit_price") * record.get("sell_amount")).toFixed("3");
                },
                summaryType: 'sum',
                xtype: 'numbercolumn',
                format: '0.00',
            }],
            store: store,
            listeners: {
                itemdblclick: {
                    fn: function() {
                        return false;
                    },
                    scope: me
                }
            },
        });

        if (!me.adding)
            store.load();

        return me.dailySellSubGrid;
    },

    onDailySellGridSelect: function() {
        var me = this;
        var grid = me.dailySellSubGrid;
        var item = me.dailySellGrid.getSelectionModel().getSelection();
        var store = grid.getStore();
        store.load();
    },

    //刷新销售信息列表
    refreshDailySellGrid: function(currentPage) {
        var me = this;
        var grid = me.dailySellGrid;
        if (!me.adding) return;
        var store = grid.getStore();
        if (currentPage)
            store.currentPage = currentPage;
        //store.removeAll();
        store.load();
    },

    //获取查询的字段
    getQueryParam: function() {
        var me = this;

        var result = {};
        var entity = me.getEntity();

        var drug_id = Ext.getCmp("editQueryDrug").getIdValue();
        if (drug_id) {
            result.drug_id = drug_id;
        }

        result.edit_id = me.adding ? null : {
            'edit_id': entity.get('id')
        };
        return result;
    },

    onOk: function() {
        var me = this;
        var params = {};

        var drug_id = me.entity == null ? me.dailySellGrid.getSelectionModel().getSelection()[0].get("drug_id") : me.entity.get("drug_id");
        //判断能否提交
        var account = Ext.getCmp('editQueryBankAccount').getIdValue();
        if (account == null || account == '') {
            PSI.MsgBox.showInfo("请先选择回款账号");
            return;
        }

        var bill_date = Ext.getCmp('editQueryBillDate').getValue();
        if (bill_date == null || bill_date == '') {
            PSI.MsgBox.showInfo("请先选择单据日期");
            return;
        }


        if (account != null && account != '' && bill_date != null && bill_date != '') {
            var selectors = me.getSelectSell(); //object
            if (selectors.select_count < 1) {
                PSI.MsgBox.showInfo("请至少选择一个条目");
                return;
            }
            params.selectors = Ext.JSON.encode(selectors);
            params.account_id = account;
            params.drug_id = drug_id;
            params.bill_date = Ext.Date.format(bill_date, "Y-m-d");
            params.edit_id = me.adding ? null : {
                'edit_id': me.entity.get('id')
            };

            var f = Ext.getCmp("importForm");
            var el = f.getEl();
            el.mask('正在添加...');
            f.submit({
                url: PSI.Const.BASE_URL + "Home/DeleHuikuan/editDeleHuikuanFromDailySell",
                method: "POST",
                params: params,
                success: function(form, action) {
                    PSI.MsgBox.showInfo("操作成功", function() {
                        el.unmask();
                        if (me.adding) {
                            me.focus();
                            me.refreshDailySellGrid();
                        } else {
                            me.close();
                            me.getParentForm().freshDeleHuikuanGrid();
                        }
                    });
                },
                failure: function(form, action) {
                    el.unmask();
                    PSI.MsgBox.showInfo('添加失败');
                }
            });

        }
        if (!account) {
            Ext.getCmp('editQueryBankAccount').setActiveErrors('请选择回款账户');
        }
        if (!bill_date) {
            Ext.getCmp('editQueryBillDate').setActiveErrors('请选择单据日期');
        }
    },

    //搜索查询
    onQuery: function() {
        var me = this;
        var grid = me.dailySellGrid;
        var params = me.getQueryParam();
        var store = grid.getStore();
        store.load();
    },

    //搜索查询
    onQuery4Edit: function() {
        var me = this;
        var grid = me.dailySellSubGrid;
        var store = grid.getStore();
        store.removeAll();
        store.load();
    },

    //清空查询条件
    onClearQuery: function() {
        Ext.getCmp("editQueryDrug").setValue(null);
        Ext.getCmp("editQueryDrug").setIdValue(null);
        this.onQuery();
    },

    //获取被选中的单子id作为参数返回
    getParentSelectParam: function() {
        var me = this;
        if (Ext.getCmp('editQuerySearchDateFrom')) {
            var search_date_from = Ext.getCmp('editQuerySearchDateFrom').getValue();
            if (!search_date_from) {
                PSI.MsgBox.showInfo("没有选择搜索开始日期");
                return;
            }
        }
        if (Ext.getCmp('editQuerySearchDateTo')) {
            var search_date_to = Ext.getCmp('editQuerySearchDateTo').getValue();
            if (!search_date_to) {
                PSI.MsgBox.showInfo("没有选择搜索结束日期");
                return;
            }
        }


        if (me.adding) {
            var item = me.dailySellGrid.getSelectionModel().getSelection();
            return {
                'drug_id': item[0].get('drug_id'),
                'search_date_from': Ext.Date.format(search_date_from, "Y-m-d"),
                'search_date_to': Ext.Date.format(search_date_to, "Y-m-d")
            };
        }
    },
    getParentSelectParam4Edit: function() {
        var me = this;
        if (Ext.getCmp('editQuerySearchDateFrom')) {
            var search_date_from = Ext.getCmp('editQuerySearchDateFrom').getValue();
            if (!search_date_from) {
                PSI.MsgBox.showInfo("没有选择搜索开始日期");
                return;
            }
        }
        if (Ext.getCmp('editQuerySearchDateTo')) {
            var search_date_to = Ext.getCmp('editQuerySearchDateTo').getValue();
            if (!search_date_to) {
                PSI.MsgBox.showInfo("没有选择搜索结束日期");
                return;
            }
        }


        return {
            'edit_id': me.entity.get('id'),
            'search_date_from': Ext.Date.format(search_date_from, "Y-m-d"),
            'search_date_to': Ext.Date.format(search_date_to, "Y-m-d")
        };
    },

    //获取选中的
    getSelectSell: function() {
        var me = this;
        var result = {};
        var grid = me.dailySellSubGrid;
        var selects = grid.getSelectionModel().getSelection();

        result.select_count = selects.length;
        //遍历获取id，塞进数组
        for (var i in selects) {
            result['select_' + i] = {
                'sell_id_list': selects[i].get('sell_id_list'),
                'huikuan_unit_price': selects[i].get('huikuan_unit_price'),
            };
        }
        return result;
    }
});