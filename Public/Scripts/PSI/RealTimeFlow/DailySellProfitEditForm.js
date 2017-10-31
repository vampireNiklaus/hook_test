/**
 * 商品 - 新建或编辑界面
 */
Ext.define("PSI.DailySell.DailySellProfitEditForm", {
    extend: "Ext.window.Window",

    config: {
        parentForm: null,
        entity: null,
        parentGrid: null,
    },

    /**
     * 初始化组件
     */
    initComponent: function() {
        var me = this;
        var entity = me.getEntity();

        me.adding = false;

        var buttons = [];


        buttons.push({
            text: "保存",
            formBind: true,
            iconCls: "PSI-button-ok",
            handler: function() {
                me.onOK();
            },
            scope: me
        }, {
            text: entity == null ? "关闭" : "取消",
            handler: function() {
                me.close();
            },
            scope: me
        });


        Ext.apply(me, {
            title: "更新业务提成",
            modal: true,
            resizable: true,
            onEsc: Ext.emptyFn,
            width: 250,
            height: 80,
            layout: "fit",
            items: [{
                id: "prorfitEditForm",
                xtype: "form",
                layout: {
                    type: "table",
                    columns: 1
                },
                height: "100%",
                bodyPadding: 2,
                defaultType: 'textfield',
                fieldDefaults: {
                    labelWidth: 60,
                    labelAlign: "right",
                    labelSeparator: "",
                    msgTarget: 'side'
                },
                items: [{
                    id: "new_profit",
                    fieldLabel: "业务提成",
                    name: "new_profit",
                    xtype: "numberfield",
                    decimalPrecision: 3,
                    allowDecimals: true,
                    value: 1.00,
                    listeners: {
                        specialkey: {
                            fn: me.onEditCodeSpecialKey,
                            scope: me
                        }
                    }
                }],
                buttons: buttons
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

        me.__editorList = [];
    },

    onEditCodeSpecialKey: function(field, e) {
        if (e.getKey() == e.ENTER) {
            this.onOK();
        }
    },
    onWndShow: function() {
        var me = this;
        var el = me.getEl();
    },

    onOK: function() {
        var me = this;
        var f = Ext.getCmp("prorfitEditForm");
        var el = f.getEl();
        var temp = me.getEntity();
        var result = {
            ids: temp,
            profit: Ext.getCmp("new_profit").getValue()
        };
        el.mask(PSI.Const.SAVING);
        f.submit({
            url: PSI.Const.BASE_URL + "Home/DailySell/updateDailySellProfit",
            method: "POST",
            params: {
                inData: Ext.JSON.encode(result)
            },
            success: function(form, action) {
                el.unmask();
                PSI.MsgBox.tip("成功更新数据");
                me.close();
                me.getParentForm().refreshAllGrid();
            },
            failure: function(form, action) {
                el.unmask();
                PSI.MsgBox.showInfo(action.result.msg,
                    function() {
                        Ext.getCmp("drug_name").focus();
                    });
            }
        });
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

    onLastEditSpecialKey: function(field, e) {
        if (e.getKey() == e.ENTER) {
            //var f = Ext.getCmp("editForm");
            if (f.getForm().isValid()) {
                var me = this;
                me.onOK();
            }
        }
    },

    clearEdit: function() {
        Ext.getCmp("employee_des").focus();
        var editors =
            [
                Ext.getCmp("id"), Ext.getCmp("bill_code"),
                Ext.getCmp("employee_id"), Ext.getCmp("employee_des"), Ext.getCmp("employee_profit"), Ext.getCmp("employee_name"),
                Ext.getCmp("drug_id"), Ext.getCmp("drug_name"), Ext.getCmp("drug_guige"), Ext.getCmp("drug_manufacture"),
                Ext.getCmp("hospital_id"), Ext.getCmp("hospital_name"), Ext.getCmp("stock_id"), Ext.getCmp("deliver_id"),
                Ext.getCmp("deliver_name"), Ext.getCmp("batch_num"), Ext.getCmp("sell_amount"), Ext.getCmp("sell_date"),
                Ext.getCmp("create_time"), Ext.getCmp("creator_id"), Ext.getCmp("if_paid"), Ext.getCmp("pay_time"),
                Ext.getCmp("paybill_id"), Ext.getCmp("status"), Ext.getCmp("note")
            ];
        for (var i = 0; i < editors.length; i++) {
            var edit = editors[i];
            edit.setValue(null);
            edit.clearInvalid();
        }
    },

    onWndClose: function() {
        var me = this;
        me.getParentForm().__lastId = me.__lastId;
        //me.getParentForm().refreshDailySellGrid();
    },

    //选择药品
    onSelectDrug: function(scope, data) {
        var me = this;
        if (scope) {
            me = scope;
        }
        Ext.getCmp("drug_name").setValue(data.common_name);
        Ext.getCmp("drug_guige").setValue(data.guige);
        Ext.getCmp("drug_manufacture").setValue(data.manufacturer);
        Ext.getCmp("drug_id").setValue(data.id);
        //根据选择的药品获取对应的配送公司列表

    },
    //选择医院
    onSelectHospital: function(scope, data) {
        var me = this;
        if (scope) {
            me = scope;
        }
        Ext.getCmp("hospital_id").setValue(data.id);
        Ext.getCmp("hospital_name").setValue(data.hospital_name);
    },
    //选择配送公司
    onSelectDeliver: function(scope, data) {
        var me = this;
        if (scope) {
            me = scope;
        }
        Ext.getCmp("deliver_id").setValue(data.deliver_id);
        Ext.getCmp("deliver_name").setValue(data.deliver_name);
    },
    //选择业务员
    onSelectEmployee: function(scope, data) {
        var me = this;
        if (scope) {
            me = scope;
        }
        Ext.getCmp("employee_id").setValue(data.id);
        Ext.getCmp("employee_name").setValue(data.name);
    },
});