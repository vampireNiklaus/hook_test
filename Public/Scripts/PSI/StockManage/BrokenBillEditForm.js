/**
 * Created by Administrator on 2016/6/30 0030.
 */
/**
 * 库存破损单 - 新建或编辑界面
 */
Ext.define("PSI.StockManage.BrokenBillEditForm", {
    extend: "Ext.window.Window",
    alias: "widget.psi_broken_bill_edit",

    config: {
        parentForm: null,
        entity: null
    },

    /**
     * 初始化组件
     */
    initComponent: function () {
        var me = this;
        var entity = me.getEntity();
        me.adding = entity == null;

        var buttons = [];
        if (!entity) {
            buttons.push({
                text: "保存并继续新增",
                formBind: true,
                handler: function () {
                    me.onOK(true);
                },
                scope: me
            });
        }
        buttons.push({
            text: "保存",
            formBind: true,
            iconCls: "PSI-button-ok",
            handler: function () {
                me.onOK(false);
            },
            scope: me
        }, {
            text: entity == null ? "关闭" : "取消",
            handler: function () {
                me.close();
            },
            scope: me
        });
        Ext.apply(me, {
            title: entity == null ? "新增库存破损单" : "编辑库存破损单",
            modal: true,
            resizable: false,
            onEsc: Ext.emptyFn,
            width: 600,
            height: 400,
            layout: "fit",
            items: [{
                id: "editForm",
                xtype: "form",
                layout: {
                    type: "table",
                    columns: 6
                },
                height: "100%",
                bodyPadding: 10,
                defaultType: 'textfield',
                fieldDefaults: {
                    labelWidth: 80,
                    labelAlign: "right",
                    labelSeparator: "：",
                    msgTarget: 'side',
                },
                items: [
                    {
                        xtype : "hidden",
                        name : "id",
                        value : entity == null ? null : entity.get("id")
                    },{
                        id : "drug_name",
                        fieldLabel : "药品",
                        allowBlank : false,
                        emptyText : "选择药品",
                        beforeLabelTextTpl : PSI.Const.REQUIRED,
                        xtype : "psi_drug_field",
                        selfDrug:true,
                        callbackFunc:me.selectDrug,
                        colspan : 6,
                        width:550,
                        value : entity == null ? null : entity.get("common_name"),
                        listeners : {
                            specialkey : {
                                fn : me.onEditSpecialKey,
                                scope : me
                            }
                        }
                    },{
                        id : "drug_id",
                        xtype : "hidden",
                        name : "drug_id",
                        value : entity == null ? null : entity.get("drug_id")
                    }, {
                        id:'jldw',
                        fieldLabel : "计量单位",
                        value : entity == null ? '<span style="color:#6B6B6B">根据药品信息生成</span>' : entity.get("jldw"),
                        xtype:'displayfield',
                        colspan:6,
                    },{
                        id : "jx",
                        fieldLabel : "剂型",
                        xtype:'displayfield',
                        value : entity == null ? '<span style="color:#6B6B6B">根据药品信息生成</span>' : entity.get("jx"),
                        colspan : 2,
                    }, {
                        id : "guige",
                        fieldLabel : "规格",
                        xtype:'displayfield',
                        colspan : 4,
                        width:300,
                        value : entity == null ? '<span style="color:#6B6B6B">根据药品信息生成</span>' : entity.get("guige"),
                    }, {
                        id : "manufacturer",
                        fieldLabel : "生产厂家",
                        xtype:'displayfield',
                        value : entity == null ? '<span style="color:#6B6B6B">根据药品信息生成</span>' : entity.get("manufacturer"),
                        colspan : 6,
                    },{
                        id : "stock_name",
                        fieldLabel : "",
                        allowBlank : false,
                        xtype:'psi_deliver_field',
                        emptyText : "选择库存",
                        fieldLabel : "配送仓库",
                        colspan : 6,
                        width:550,
                        beforeLabelTextTpl : PSI.Const.REQUIRED,
                        value : entity == null ? null : entity.get("stock_name"),
                        listeners : {
                            specialkey : {
                                fn : me.onEditSpecialKey,
                                scope : me
                            }
                        },
                        callbackFunc:me.selectStock
                    },{
                        id : "stock_id",
                        xtype : "hidden",
                        name : "stock_id",
                        value : entity == null ? null : entity.get("stock_id")
                    }, {
                        id : "batch_num",
                        name : "batch_num",
                        allowBlank : false,
                        fieldLabel : "批号",
                        xtype:"combo",
                        colspan : 6,
                        width:550,
                        emptyText : "输入或者选择批号",
                        beforeLabelTextTpl : PSI.Const.REQUIRED,
                        value : entity == null ? null : entity.get("batch_num"),
                        listeners : {
                            specialkey : {
                                fn : me.onEditSpecialKey,
                                scope : me
                            }
                        },
                    },{
                        id : "bill_status",
                        name : "status",
                        xtype : "hidden",
                        fieldLabel : "单据状态",
                        value : entity == null ? null : entity.get("status")
                    },{
                        id : "amount",
                        fieldLabel : "相关数量",
                        regex:/^\d+$/,
                        regexText: '请输入正确的数据类型',
                        allowBlank : false,
                        blankText : "没有输入数量",
                        name : "amount",
                        beforeLabelTextTpl : PSI.Const.REQUIRED,
                        colspan : 6,
                        width:550,
                        value : entity == null ? null : entity.get("amount"),
                        listeners : {
                            specialkey : {
                                fn : me.onEditSpecialKey,
                                scope : me
                            }
                        }
                    },
                    {
                        id: 'note',
                        name: 'note',
                        fieldLabel: "备注",
                        xtype: 'textareafield',
                        value: entity == null ? null : entity.get("note"),
                        colspan: 6,
                        width: 550
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

        me.__editorList = ["emName", "emCode", "bankAccount",
            "emPhone", "emQQ", "emEmail", "emPYM",
            "emAddress", "emNote", "isEmployee", "isOffJob", "clientUserName",
            "clientPassword"];
    },

    onWndShow: function () {

    },

    onOK: function (thenAdd) {
        var me = this;
        var f = Ext.getCmp("editForm");
        var el = f.getEl();
        el.mask(PSI.Const.SAVING);
        f.submit({
            url: PSI.Const.BASE_URL + "Home/StockManage/editStockBrokenBill",
            method: "POST",
            success: function (form, action) {
                el.unmask();
                me.__lastId = action.result.id;
                me.getParentForm().__lastId = me.__lastId;

                PSI.MsgBox.tip("数据保存成功");
                me.focus();

                if (thenAdd) {
                    me.clearEdit();
                    me.getParentForm().updateDrugBrokenBillGrid();
                } else {
                    me.close();
                    me.getParentForm().updateDrugBrokenBillGrid();
                }
            },
            failure: function (form, action) {
                el.unmask();
                PSI.MsgBox.showInfo(action.result.msg,
                    function () {
                    });
            }
        });
    },

    onEditSpecialKey: function (field, e) {
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

    onLastEditSpecialKey: function (field, e) {
        if (e.getKey() == e.ENTER) {
            var f = Ext.getCmp("editForm");
            if (f.getForm().isValid()) {
                var me = this;
                me.onOK(me.adding);
            }
        }
    },

    clearEdit: function () {
        var editors = [
            Ext.getCmp("type"),
            Ext.getCmp("money"),
            Ext.getCmp("note"),
        ];
        for (var i = 0; i < editors.length; i++) {
            var edit = editors[i];
            edit.setValue(null);
            edit.clearInvalid();
        }
    },

    onWndClose: function () {
        var me = this;
        me.getParentForm().__lastId = me.__lastId;
        // me.getParentForm().refreshDelePurchaseGrid();
    },

    selectType: function (scope, data) {
        var me = this;
        if (scope) {
            me = scope;
        }
        //这个方法被调用的时候，this指向的是window
        Ext.getCmp("type_id").setValue(data.id);
        //设置生产厂家
        Ext.getCmp('bill_type').setValue(data.type);
    },

    getDeliverQueryCondition: function () {
        //根据药品类型选择对应的配送公司，配送公司的限制查询条件
        var drug_id = Ext.getCmp("drug_id").getValue();
        drug_id = drug_id ? drug_id : 0;
        return {
            queryConditionType: "searchByDrugId",
            queryConditionKey: drug_id
        }
    },
    selectDrug : function(scope,data){
        //这个方法被调用的时候，this指向的是window
        Ext.getCmp("drug_id").setValue(data.id);
        Ext.getCmp('jx').setValue(data.jx);
        Ext.getCmp('guige').setValue(data.guige);
        Ext.getCmp('jldw').setValue(data.jldw);
        //设置生产厂家
        Ext.getCmp('manufacturer').setValue(data.manufacturer);
        //设置买货底价

    },
    selectStock:function(scope,data){
        var me = this;
        if(scope){
            me = scope;
        }
        Ext.getCmp("stock_id").setValue(data.deliver_id);
    },
    selectKpgs:function(scope,data){
        var me = this;
        if(scope){
            me = scope;
        }
        Ext.getCmp("kpgs_id").setValue(data.id);
    },

});
