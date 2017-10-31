/**
 * Created by Administrator on 2016/6/30 0030.
 */
/**
 * 应收应付账款单 - 新建或编辑界面
 */
Ext.define("PSI.CapitalManage.ReceiptPayBillEditForm", {
    extend : "Ext.window.Window",
    alias : "widget.psi_receipt_pay_bill",

    config : {
        parentForm : null,
        entity : null
    },

    /**
     * 初始化组件
     */
    initComponent : function() {
        var me = this;
        var entity = me.getEntity();
        me.adding = entity == null;

        var buttons = [];
        if (!entity) {
            buttons.push({
                text : "保存并继续新增",
                formBind : true,
                handler : function() {
                    me.onOK(true);
                },
                scope : me
            });
        }
        buttons.push({
            text : "保存",
            formBind : true,
            iconCls : "PSI-button-ok",
            handler : function() {
                me.onOK(false);
            },
            scope : me
        }, {
            text : entity == null ? "关闭" : "取消",
            handler : function() {
                me.close();
            },
            scope : me
        });
        Ext.apply(me, {
            title : entity == null ? "新增应收应付单" : "编辑应收应付单",
            modal : true,
            resizable : false,
            onEsc : Ext.emptyFn,
            width : 600,
            height : 400,
            layout : "fit",
            items : [{
                id : "editForm",
                xtype : "form",
                layout : {
                    type : "table",
                    columns : 6
                },
                height : "100%",
                bodyPadding : 10,
                defaultType : 'textfield',
                fieldDefaults : {
                    labelWidth : 80,
                    labelAlign : "right",
                    labelSeparator : "：",
                    msgTarget : 'side',
                },
                items : [{
                    xtype : "hidden",
                    name : "id",
                    value : entity == null ? null : entity.get("id")
                },{
                    id : "type",
                    fieldLabel : "科目",
                    allowBlank : false,
                    emptyText : "选择科目",
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    xtype:'psi_billing_types_field',
                    callbackFunc:me.selectType,
                    parentCmp:me,
                    colspan : 6,
                    width:300,
                    value : entity == null ? null : entity.get("type_name"),
                    listeners : {
                        specialkey : {
                            fn : me.onEditSpecialKey,
                            scope : me
                        }
                    }
                },{
                    id : "type_id",
                    xtype : "hidden",
                    name : "type_id",
                    value : entity == null ? null : entity.get("type_id")
                },{
                    id : "bill_type",
                    fieldLabel : "单据类型",
                    xtype:'displayfield',
                    value : entity == null ? '<span style="color:#6B6B6B">根据科目生成</span>' : entity.get("bill_type"),
                    colspan : 6,
                },{
                    id : "money",
                    fieldLabel : "金额",
                    allowBlank : true,
                    colspan : 6,
                    width:300,
                    allowDecimals: true,
                    decimalPrecision: 3,
                    name : "money",
                    value : entity == null ? null : entity.get("money"),
                    xtype:"numberfield",
                    listeners : {
                        specialkey : {
                            fn : me.onEditNameSpecialKey,
                            scope : me
                        }

                    }
                },{
                    id:'note',
                    name:'note',
                    fieldLabel:"备注",
                    xtype: 'textareafield',
                    value : entity == null ? null : entity.get("note"),
                    colspan:6,
                    width:550
                }],
                buttons : buttons
            }],
            listeners : {
                show : {
                    fn : me.onWndShow,
                    scope : me
                },
                close : {
                    fn : me.onWndClose,
                    scope : me
                }
            }
        });

        me.callParent(arguments);

        me.__editorList = ["emName", "emCode", "bankAccount",
            "emPhone", "emQQ", "emEmail", "emPYM",
            "emAddress", "emNote", "isEmployee","isOffJob","clientUserName",
            "clientPassword"];
    },

    onWndShow : function() {

    },

    onOK : function(thenAdd) {
        var me = this;
        var f = Ext.getCmp("editForm");
        var el = f.getEl();
        el.mask(PSI.Const.SAVING);
        f.submit({
            url : PSI.Const.BASE_URL + "Home/CapitalManage/editReceiptPayBill",
            method : "POST",
            success : function(form, action) {
                el.unmask();
                me.__lastId = action.result.id;
                me.getParentForm().__lastId = me.__lastId;

                PSI.MsgBox.tip("数据保存成功");
                me.focus();

                if (thenAdd) {
                    me.clearEdit();
                    me.getParentForm().freshReceiptPayBillGrid();
                } else {
                    me.close();
                    me.getParentForm().freshReceiptPayBillGrid();
                }
            },
            failure : function(form, action) {
                el.unmask();
                PSI.MsgBox.showInfo(action.result.msg,
                    function() {
                        Ext.getCmp("editCode").focus();
                    });
            }
        });
    },

    onEditSpecialKey : function(field, e) {
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

    onLastEditSpecialKey : function(field, e) {
        if (e.getKey() == e.ENTER) {
            var f = Ext.getCmp("editForm");
            if (f.getForm().isValid()) {
                var me = this;
                me.onOK(me.adding);
            }
        }
    },

    clearEdit : function() {
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

    onWndClose : function() {
        var me = this;
        me.getParentForm().__lastId = me.__lastId;
        // me.getParentForm().refreshDelePurchaseGrid();
    },

    selectType : function(scope,data){
        var me = this;
        if(scope){
            me = scope;
        }
        //这个方法被调用的时候，this指向的是window
        Ext.getCmp("type_id").setValue(data.id);
        //设置生产厂家
        Ext.getCmp('bill_type').setValue(data.type);
    },

    getDeliverQueryCondition : function(){
        //根据药品类型选择对应的配送公司，配送公司的限制查询条件
        var drug_id  = Ext.getCmp("drug_id").getValue();
        drug_id = drug_id?drug_id:0;
        return {
            queryConditionType:"searchByDrugId",
            queryConditionKey:drug_id
        }
    }
});
