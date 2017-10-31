/**
 * Created by RCG on 2016/4/30 0030.
 */
/**
 * 转账单 - 新建或编辑界面
 */
Ext.define("PSI.StockManage.StockTransEditForm", {
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

        //这里是批号的store
        me.batchStore= new Ext.data.ArrayStore({
            fields : ['batch_num'],
            data : [],
            proxy : {
                type : "ajax",
                actionMethods : {
                    read : "POST"
                },
                url : PSI.Const.BASE_URL + "Home/StockManage/getBatchList",
                reader : {
                    root : 'all_data',
                }
            }
        });
        me.batchStore.on("beforeload", function() {
            me.batchStore.proxy.extraParams = me.getQueryParam();
        });


        Ext.apply(me, {
            title : entity == null ? "新增库存调拨单" : "编辑库存调拨单",
            modal : true,
            resizable : true,
            onEsc : Ext.emptyFn,
            width : 780,
            height : 300,
            layout : "fit",
            items : [{
                id : "editForm",
                xtype : "form",
                layout : {
                    type : "table",
                    columns : 3
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
                    id:'drug_id',
                    xtype : "hidden",
                    name : "drug_id",
                    value : entity == null ? null : entity.get("drug_id")
                },{
                    id : "drug_name",
                    name : "drug_name",
                    fieldLabel : "药品",
                    colspan : 6,
                    width:480,
                    callbackFunc:me.selectDrug,
                    allowBlank : false,
                    xtype : "psi_drug_field",
                    blankText : "请选择药品",
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    value : entity == null ? null : entity.get("drug_name"),
                    listeners : {
                        specialkey : {
                            fn : me.onEditSpecialKey,
                            scope : me
                        },
                        change : {
                            fn : function(){
                                Ext.getCmp('out_deliver_batchnum').setValue(null);
                            },
                            scope : me
                        },
                    }
                },{
                    id : "supplier_id",
                    xtype : "hidden",
                    name : "supplier_id",
                    value : entity == null ? null : entity.get("supplier_id")
                },{
                    id : "supplier_name",
                    name : "supplier_name",
                    fieldLabel : "供应商",
                    allowBlank : false,
                    colspan : 6,
                    width:480,
                    xtype : "psi_supplier_field",
                    callbackFunc:me.selectSupplier,
                    blankText : "供应商",
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    value : entity == null ? null : entity.get("supplier_name"),
                    listeners : {
                        specialkey : {
                            fn : me.onEditSpecialKey,
                            scope : me
                        }
                    }
                },{
                    id : "out_deliver_name",
                    name : "out_deliver_name",
                    fieldLabel : "转出公司",
                    allowBlank : false,
                    xtype : "psi_deliver_field",
                    blankText : "请选择转出公司",
                    callbackFunc:me.selectDeliver,
                    parentCmp:me,
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    value : entity == null ? null : entity.get("out_deliver_name"),
                    listeners : {
                        specialkey : {
                            fn : me.onEditSpecialKey,
                            scope : me
                        },
                        change : {
                            fn : function(){
                                Ext.getCmp('out_deliver_batchnum').setValue(null);
                            },
                            scope : me
                        },
                    }
                },{
                    id:'out_deliver_id',
                    name:'out_deliver_id',
                    hidden:true,
                    value : entity == null ? null : entity.get("out_deliver_id"),
                },{
                    id:'out_deliver_batchnum',
                    name:'batch_num',
                    fieldLabel : "转出批号",
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    listeners : {
                        specialkey : {
                            fn : me.onEditSpecialKey,
                            scope : me
                        },
                        focus : {
                            fn : me.refreshBatch,
                            scope : me
                        }
                    },
                    valueField : "batch_num",
                    displayField : "batch_num",
                    xtype : "combo",
                    editable:false,
                    store: me.batchStore,
                    allowBlank : false,
                    value : entity == null ? null : entity.get("batch_num"),
                },{
                    id : "amount",
                    fieldLabel : "转出数量",
                    name:"amount",
                    xtype:"numberfield",
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    blankText : '请填写转出数量',
                    allowBlank : false,
                    value : entity == null ? null : entity.get("amount"),
                    listeners : {
                        specialkey : {
                            fn : me.onEditSpecialKey,
                            scope : me
                        }
                    }
                },{
                    id : "in_deliver_name",
                    name : "in_deliver_name",
                    fieldLabel : "转入公司",
                    xtype : "psi_deliver_field",
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    blankText : '请选择转入公司',
                    allowBlank : false,
                    callbackFunc:me.onSelectInDeliver,
                    parentCmp:me,
                    value : entity == null ? null : entity.get("in_deliver_name"),
                    listeners : {
                        specialkey : {
                            fn : me.onEditSpecialKey,
                            scope : me
                        }
                    }
                },{
                    id:'in_deliver_id',
                    name:'in_deliver_id',
                    value : entity == null ? null : entity.get("in_deliver_id"),
                    hidden:true
                },  {
                    id : "purpose",
                    fieldLabel : "用途",
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
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
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
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
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
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
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
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

        me.__editorList = [];
    },

    //刷新批号列表
    refreshBatch:function () {
        this.batchStore.load();
    },
    //刷新批号时候获取药品id和配送公司id
    getQueryParam:function(){
        var me=this;
        var result={};
        if(Ext.getCmp('drug_id'))
            result.drug_id=Ext.getCmp('drug_id').getValue();
        if(Ext.getCmp('out_deliver_id'))
            result.deliver_id=Ext.getCmp('out_deliver_id').getValue();
        return result;
    },

    onWndShow : function() {
        var me = this;
        var editCode = Ext.getCmp("drug_name");
        editCode.focus();
        editCode.setValue(editCode.getValue());

        var el = me.getEl();
    },

    onOK : function(thenAdd) {
        var me = this;
        var f = Ext.getCmp("editForm");
        var el = f.getEl();

        if(!me.checkDeliver()){
            PSI.MsgBox.showInfo("转入和转出的公司不能相同");
            return;
        }

        el.mask(PSI.Const.SAVING);
        f.submit({
            url : PSI.Const.BASE_URL + "Home/StockManage/editStockTrans",
            method : "POST",
            success : function(form, action) {
                el.unmask();
                me.__lastId = action.result.id;
                me.getParentForm().__lastId = me.__lastId;

                PSI.MsgBox.tip("数据保存成功");
                me.focus();
                me.getParentForm().freshStockTransGrid();
                me.close();
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
        // Ext.getCmp("out_account_id").focus();
        //
        // var setNull = [Ext.getCmp("out_account_id"), Ext.getCmp("account_num"),
        //     Ext.getCmp("bank_name")];
        // var setNum=[Ext.getCmp("init_money"), Ext.getCmp("now_money")];
        // for (var i = 0; i < setNull.length; i++) {
        //     var edit = setNull[i];
        //     edit.setValue(null);
        //     edit.clearInvalid();
        // }
        // for (var i = 0; i < setNum.length; i++) {
        //     var edit = setNum[i];
        //     edit.setValue('0.00');
        //     edit.clearInvalid();
        // }
        // Ext.getCmp("is_cash_1").setValue(true);
        // Ext.getCmp("disabled_no").setValue(true);
    },

    onWndClose : function() {
        var me = this;
        me.getParentForm().__lastId = me.__lastId;
        // me.getParentForm().freshBankIOGrid();
    },
    onSelectInDeliver : function(scope,data){
        var me = this;
        if(scope){
            me = scope;
        }
        Ext.getCmp("in_deliver_id").setValue(data.id);
    },

    selectDrug:function(scope,data){
        var me = this;
        if(scope){
            me = scope;
        }
        Ext.getCmp("drug_id").setValue(data.id);
    },
    selectDeliver:function(scope,data){
        var me = this;
        if(scope){
            me = scope;
        }
        Ext.getCmp("out_deliver_id").setValue(data.deliver_id);
    },
    selectSupplier:function(scope,data){
        var me = this;
        if(scope){
            me = scope;
        }
        Ext.getCmp("supplier_id").setValue(data.id);
    },

    checkDeliver:function(){
        if(Ext.getCmp('in_deliver_id').getValue()==Ext.getCmp('out_deliver_id').getValue())
            return false;
        else
            return true;
    }
});
