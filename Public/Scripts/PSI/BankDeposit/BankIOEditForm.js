/**
 * Created by RCG on 2016/4/30 0030.
 */
/**
 * 转账单 - 新建或编辑界面
 */
Ext.define("PSI.BankDeposit.BankIOEditForm", {
    extend : "Ext.window.Window",

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
            title : entity == null ? "新增转账单" : "编辑转账单",
            modal : true,
            resizable : true,
            onEsc : Ext.emptyFn,
            width : 600,
            height : 300,
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
                    msgTarget : 'side'
                },
                items : [{
                    xtype : "hidden",
                    name : "id",
                    value : entity == null ? null : entity.get("id")
                },{
                    id : "out_account",
                    fieldLabel : "付款账户",
                    allowBlank : false,
                    xtype : "psi_bank_account_field",
                    blankText : "请输入账户名称",
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    colspan : 6,
                    width:350,
                    value : entity == null ? null : entity.get("out_account_name")+" 卡号："+entity.get("out_account_num"),
                    listeners : {
                        specialkey : {
                            fn : me.onEditSpecialKey,
                            scope : me
                        }
                    }
                },{
                    id:'out_account_id',
                    name:'out_account_id',
                    hidden:true,
                    value : entity == null ? null : entity.get("out_account_id"),
                }, {
                    id : "in_account",
                    fieldLabel : "收款账户",
                    xtype : "psi_bank_account_field",
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    blankText : '请输入银行账号',
                    allowBlank : false,
                    colspan : 6,
                    width:350,
                    value : entity == null ? null : entity.get("in_account_name")+" 卡号："+entity.get("in_account_num"),
                    listeners : {
                        specialkey : {
                            fn : me.onEditSpecialKey,
                            scope : me
                        }
                    }
                },{
                    id:'in_account_id',
                    name:'in_account_id',
                    value : entity == null ? null : entity.get("in_account_id"),
                    hidden:true
                },  {
                    id : "amount",
                    fieldLabel : "金额",
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    blankText : '请输入金额',
                    allowBlank : false,
                    xtype:"numberfield",
                    decimalPrecision:3,
                    colspan : 6,
                    width:250,
                    name:"amount",
                    value : entity == null ? null : entity.get("amount"),
                    listeners : {
                        specialkey : {
                            fn : me.onEditSpecialKey,
                            scope : me
                        }
                    }
                },{
                    id : "purpose",
                    fieldLabel : "用途",
                    value : entity == null ? null : entity.get("purpose"),
                    colspan : 6,
                    width:250,
                    name:"purpose",
                    listeners : {
                        specialkey : {
                            fn : me.onEditSpecialKey,
                            scope : me
                        }
                    }
                },{
                    id : "piaoju_code",
                    fieldLabel : "票据编号",
                    value : entity == null ? null : entity.get("piaoju_code"),
                    colspan : 6,
                    width:250,
                    name:"piaoju_code",
                    listeners : {
                        specialkey : {
                            fn : me.onEditSpecialKey,
                            scope : me
                        }
                    }
                },{
                    id : "danju_code",
                    fieldLabel : "单据编号",
                    value : entity == null ? null : entity.get("danju_code"),
                    colspan : 6,
                    width:250,
                    name:"danju_code",
                    listeners : {
                        specialkey : {
                            fn : me.onEditSpecialKey,
                            scope : me
                        }
                    }
                },{
                    id : "note",
                    fieldLabel : "备注",
                    value : entity == null ? null : entity.get("note"),
                    colspan : 6,
                    width:250,
                    name:"note",
                    listeners : {
                        specialkey : {
                            fn : me.onEditSpecialKey,
                            scope : me
                        }
                    }
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

        me.__editorList = ["out_account_id","in_account_id","amount","purpose",
            "piaoju_code","danju_code","note"];
    },

    onWndShow : function() {
        var me = this;
        var editCode = Ext.getCmp("out_account_id");
        editCode.focus();
        editCode.setValue(editCode.getValue());

        var el = me.getEl();
    },

    onOK : function(thenAdd) {
        var me = this;
        var f = Ext.getCmp("editForm");
        var el = f.getEl();
        el.mask(PSI.Const.SAVING);
        if(Ext.getCmp("out_account").getIdValue()!=null){
            var outAccountId = Ext.getCmp("out_account").getIdValue();
            Ext.getCmp("out_account_id").setValue(outAccountId);
        }
        if(Ext.getCmp("in_account").getIdValue()!=null){
            var inAccountId = Ext.getCmp("in_account").getIdValue();
            Ext.getCmp("in_account_id").setValue(inAccountId);
        }

        f.submit({
            url : PSI.Const.BASE_URL + "Home/BankDeposit/editBankIO",
            method : "POST",
            success : function(form, action) {
                el.unmask();
                me.__lastId = action.result.id;
                me.getParentForm().__lastId = me.__lastId;

                PSI.MsgBox.tip("数据保存成功");
                me.focus();

                if (thenAdd) {
                    me.clearEdit();
                } else {
                    me.close();
                    me.getParentForm().freshBankIOGrid();
                }
            },
            failure : function(form, action) {
                el.unmask();
                PSI.MsgBox.showInfo(action.result.msg,
                    function() {
                        Ext.getCmp("out_account_id").focus();
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
        Ext.getCmp("out_account_id").focus();

        var setNull = [Ext.getCmp("out_account_id"), Ext.getCmp("account_num"),
            Ext.getCmp("bank_name")];
        var setNum=[Ext.getCmp("init_money"), Ext.getCmp("now_money")];
        for (var i = 0; i < setNull.length; i++) {
            var edit = setNull[i];
            edit.setValue(null);
            edit.clearInvalid();
        }
        for (var i = 0; i < setNum.length; i++) {
            var edit = setNum[i];
            edit.setValue('0.00');
            edit.clearInvalid();
        }
        Ext.getCmp("is_cash_1").setValue(true);
        Ext.getCmp("disabled_no").setValue(true);
    },

    onWndClose : function() {
        var me = this;
        me.getParentForm().__lastId = me.__lastId;
        me.getParentForm().freshBankIOGrid();

    }
});
