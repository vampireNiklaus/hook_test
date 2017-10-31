/**
 * Created by Administrator on 2016/6/30 0030.
 */

/**
 * Created by Administrator on 2016/6/20 0020.
 */
/**
 * 其他收入支出单 - 新建或编辑界面
 */
Ext.define("PSI.CapitalManage.ExtraBillEditForm", {
    extend : "Ext.window.Window",
    alias : "widget.psi_extra_bill",

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
            title : entity == null ? "新增收入支出单" : "编辑收入支出单",
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
                },
                //     {
                //     fieldLabel : "单据类型",
                //     xtype:"combo",
                //     store : Ext.create("Ext.data.ArrayStore", {
                //         fields : ["value","type_name"],
                //         data : [
                //             ['1','收入'],
                //             ['0','支出']
                //         ]
                //     }),
                //     width:300,
                //     colspan : 6,
                //     allowBlank : false,
                //     editable:false,
                //     name:'billing_type',
                //     value : entity == null ? null : entity.get("billing_type"),
                //     displayField: 'type_name',
                //     valueField: 'value',
                //     blankText : "没有选择类型",
                //     beforeLabelTextTpl : PSI.Const.REQUIRED,
                //     listeners : {
                //         specialkey : {
                //             fn : me.onEditSpecialKey,
                //             scope : me
                //         }
                //     }
                // },

                {
                    id : "type",
                    fieldLabel : "科目",
                    allowBlank : false,
                    emptyText : "选择科目",
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    xtype:'psi_billing_types_field',
                    callbackFunc:me.selectType,
                    parentCmp:me,
                    colspan : 6,
                    width:550,
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
                    width:550,
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
                        id : "bank_account",
                        name : "bank_account",
                        fieldLabel : "银行账户",
                        xtype : "psi_bank_account_field",
                        beforeLabelTextTpl : PSI.Const.REQUIRED,
                        blankText : '请输入银行账号',
                        callbackFunc:me.selectBankAccount,
                        parentCmp:me,
                        allowBlank : false,
                        colspan : 6,
                        width:550,
                        value : entity == null ? null : entity.get("bank_account_name")+" 卡号："+entity.get("bank_account_num"),
                        listeners : {
                            specialkey : {
                                fn : me.onEditSpecialKey,
                                scope : me
                            }
                        }
                    },{
                        id : "drug_name",
                        fieldLabel : "关联品种",
                        // allowBlank : false,
                        allowBlank : true,
                        emptyText : "选择药品",
                        // beforeLabelTextTpl : PSI.Const.REQUIRED,
                        xtype : "psi_drug_field",
                        selfDrug:true,
                        callbackFunc:me.selectDrug,
                        colspan : 6,
                        width:550,
                        value : entity == null ? null : entity.get("drug_name"),
                        listeners : {
                            specialkey : {
                                fn : me.onEditSpecialKey,
                                scope : me
                            }
                        }
                    },{
                        id : "yewu_date",
                        fieldLabel : "业务日期",
                        allowBlank : false,
                        colspan : 6,
                        width:550,
                        blankText : "没有输入业务日期",
                        beforeLabelTextTpl : PSI.Const.REQUIRED,
                        xtype : "datefield",
                        format : "Y-m-d",
                        name : "yewu_date",
                        value : entity == null ? new Date() : entity.get("yewu_date"),
                        listeners : {
                            specialkey : {
                                fn : me.onEditBizDTSpecialKey,
                                scope : me
                            }
                        }
                    },{
                        id : "drug_id",
                        xtype : "hidden",
                        name : "drug_id",
                        value : entity == null ? null : entity.get("drug_id")
                    },{
                        id : "bank_account_id",
                        xtype : "hidden",
                        name : "bank_account_id",
                        value : entity == null ? null : entity.get("bank_account_id")
                    },{
                        id : "bank_account_name",
                        xtype : "hidden",
                        name : "bank_account_name",
                        value : entity == null ? null : entity.get("bank_account_name")
                    },{
                        id : "bank_account_num",
                        xtype : "hidden",
                        name : "bank_account_num",
                        value : entity == null ? null : entity.get("bank_account_num")
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
        var me = this;
        var editCode = Ext.getCmp("emName");
        editCode.focus();
        editCode.setValue(editCode.getValue());

        var el = me.getEl();
        //el.mask(PSI.Const.LOADING);
        /*Ext.Ajax.request({
         url : PSI.Const.BASE_URL + "Home/Goods/goodsInfo",
         params : {
         id : me.adding ? null : me.getEntity()
         .get("id"),
         categoryId : categoryId
         },
         method : "POST",
         callback : function(options, success, response) {
         unitStore.removeAll();

         if (success) {
         var data = Ext.JSON
         .decode(response.responseText);
         if (data.units) {
         unitStore.add(data.units);
         }

         if (!me.adding) {
         // 编辑商品信息
         Ext.getCmp("editCategory")
         .setIdValue(data.categoryId);
         Ext.getCmp("editCategory")
         .setValue(data.categoryName);
         Ext.getCmp("editCode")
         .setValue(data.code);
         Ext.getCmp("editName")
         .setValue(data.name);
         Ext.getCmp("editSpec")
         .setValue(data.spec);
         Ext.getCmp("editUnit")
         .setValue(data.unitId);
         Ext.getCmp("editSalePrice")
         .setValue(data.salePrice);
         Ext.getCmp("editPurchasePrice")
         .setValue(data.purchasePrice);
         Ext.getCmp("editBarCode")
         .setValue(data.barCode);
         Ext.getCmp("editMemo")
         .setValue(data.memo);
         var brandId = data.brandId;
         if (brandId) {
         var editBrand = Ext
         .getCmp("editBrand");
         editBrand.setIdValue(brandId);
         editBrand
         .setValue(data.brandFullName);
         }
         } else {
         // 新增商品
         if (unitStore.getCount() > 0) {
         var unitId = unitStore.getAt(0)
         .get("id");
         Ext.getCmp("editUnit")
         .setValue(unitId);
         }
         if (data.categoryId) {
         Ext
         .getCmp("editCategory")
         .setIdValue(data.categoryId);
         Ext
         .getCmp("editCategory")
         .setValue(data.categoryName);
         }
         }
         }

         el.unmask();
         }
         });*/
    },

    onOK : function(thenAdd) {
        var me = this;
        var f = Ext.getCmp("editForm");
        var el = f.getEl();
        el.mask(PSI.Const.SAVING);
        f.submit({
            url : PSI.Const.BASE_URL + "Home/CapitalManage/editExtraBill",
            method : "POST",
            success : function(form, action) {
                el.unmask();
                me.__lastId = action.result.id;
                me.getParentForm().__lastId = me.__lastId;

                PSI.MsgBox.tip("数据保存成功");
                me.focus();

                if (thenAdd) {
                    me.clearEdit();
                    me.getParentForm().freshExtraBillGrid();
                } else {
                    me.close();
                    me.getParentForm().freshExtraBillGrid();
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

    selectBankAccount:function (scope,data) {
        var me = this;
        if(scope){
            me = scope;
        }
        //这个方法被调用的时候，this指向的是window
        console.log(data);
        Ext.getCmp("bank_account_id").setValue(data.id);
        //设置生产厂家
        Ext.getCmp('bank_account_name').setValue(data.account_name);
        Ext.getCmp('bank_account_num').setValue(data.account_num);
    },

    getDeliverQueryCondition : function(){
        //根据药品类型选择对应的配送公司，配送公司的限制查询条件
        var drug_id  = Ext.getCmp("drug_id").getValue();
        drug_id = drug_id?drug_id:0;
        return {
            queryConditionType:"searchByDrugId",
            queryConditionKey:drug_id
        }
    },
    selectDrug : function(scope,data) {
        //这个方法被调用的时候，this指向的是window
        Ext.getCmp("drug_id").setValue(data.id);
    }
});
