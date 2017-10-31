
/**
 * Created by Administrator on 2016/6/20 0020.
 */
/**
 * 产品代理协议 - 新建或编辑界面
 */
Ext.define("PSI.BusinessSetting.ProductAgencyEditForm", {
    extend : "Ext.window.Window",
    alias : "widget.psi_product_agency",

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
            title : entity == null ? "新增产品代理协议" : "编辑产品代理协议",
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
                    id : "drug_name",
                    fieldLabel : "药品",
                    allowBlank : false,
                    emptyText : "选择药品",
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    xtype:'psi_drug_field',
                    callbackFunc:me.selectDrug,
                    parentCmp:me,
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
                    id : "guige",
                    fieldLabel : "规格",
                    xtype:'displayfield',
                    colspan : 4,
                    width:200,
                    value : entity == null ? '<span style="color:#6B6B6B">根据药品信息生成</span>' : entity.get("guige"),
                }, {
                    id : "manufacturer",
                    fieldLabel : "生产厂家",
                    xtype:'displayfield',
                    value : entity == null ? '<span style="color:#6B6B6B">根据药品信息生成</span>' : entity.get("manufacturer"),
                    colspan : 4,
                },{
                    id:'earnest_money',
                    fieldLabel:'保证金',
                    xtype:"numberfield",
                    minValue:0,
                    decimalPrecision: 3,
                    regexText: '请输入正确的数据类型',
                    allowBlank : false,
                    blankText : "没有输入保证金",
                    name : "earnest_money",
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    colspan : 6,
                    width:200,
                    value : entity == null ? null : entity.get("earnest_money"),
                },{
                    id:'amount',
                    fieldLabel:'协议量',
                    xtype:"numberfield",
                    decimalPrecision: 0,
                    minValue:0,
                    regex:/^\d+$/,
                    regexText: '请输入正确的数据类型',
                    allowBlank : false,
                    blankText : "没有输入协议量",
                    name : "amount",
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    colspan : 6,
                    width:200,
                    value : entity == null ? null : entity.get("amount"),
                },{
                    id : "protocol_time",
                    fieldLabel : "协议时间",
                    allowBlank : false,
                    colspan : 6,
                    blankText : "没有输入协议时间",
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    name : "protocol_time",
                    value : entity == null ? new Date() : entity.get("protocol_time"),
                    xtype: 'monthfield',
                    margin : "5, 0, 0, 0",
                    format : "Y",
                    labelAlign : "right",
                    labelSeparator : "",
                    width:200,
                    listeners : {
                        specialkey : {
                            fn : me.onEditSpecialKey,
                            scope : me
                        }
                    }
                },{
                    id : "bill_date",
                    fieldLabel : "签订时间",
                    allowBlank : false,
                    colspan : 6,
                    width:200,
                    blankText : "没有输入签订时间",
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    xtype : "datefield",
                    format : "Y-m-d",
                    margin:'10px 0 10px 0',
                    name : "bill_date",
                    value : entity == null ? new Date() : entity.get("bill_date"),
                    listeners : {
                        specialkey : {
                            fn : me.onEditSpecialKey,
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

    //刷新批号列表
    refreshBatch:function () {
        this.batchStore.load();
    },
    //刷新批号时候获取药品id和配送公司id
    getQueryParam:function(){
        var result={};
        if(Ext.getCmp('drug_id'))
            result.drug_id=Ext.getCmp('drug_id').getValue();
        if(Ext.getCmp('deliver_id'))
            result.deliver_id=Ext.getCmp('deliver_id').getValue();
        return result;
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
            url : PSI.Const.BASE_URL + "Home/BusinessSetting/editProductAgency",
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
                    me.getParentForm().refreshProductAgencyGrid();
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

    //计算所有的价格
    recountAll:function(){
        var config={
            'per_price':'sum_pay',
            'kaipiao_unit_price':'sum_kaipiao_money',
            // 'tax_unit_price':'sum_tax_money',
        };
        //用于判断是否已经选择了药品
        var drug=Ext.getCmp('drug_id').value;
        //获取数量
        var num = Ext.getCmp('buy_amount').getValue();
        if(drug&&num&& Ext.getCmp('buy_amount').isValid()){
            for(var key in config){
                var unit =Ext.getCmp(key).getValue();
                if(unit!=''&&Ext.getCmp(key).isValid())
                    Ext.getCmp(config[key]).setValue((unit*num).toFixed(2));
            }
        }
    },

    clearEdit : function() {
        Ext.getCmp("emCode").focus();

        var editors = [Ext.getCmp("emName"), Ext.getCmp("emCode"),
            Ext.getCmp("bankAccount"), Ext.getCmp("emPhone"),
            Ext.getCmp("emQQ"),Ext.getCmp("emEmail"),
            Ext.getCmp("emPYM"), Ext.getCmp("emAddress"),
            Ext.getCmp("emNote"),Ext.getCmp("isEmployee"),
            Ext.getCmp("isOffJob"), Ext.getCmp("clientUserName"),
            Ext.getCmp("clientPassword")];
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

    selectDrug : function(scope,data){
        var me = this;
        if(scope){
            me = scope;
        }
        //这个方法被调用的时候，this指向的是window
        Ext.getCmp("drug_id").setValue(data.id);
        Ext.getCmp('guige').setValue(data.guige);
        //设置生产厂家
        Ext.getCmp('manufacturer').setValue(data.manufacturer);
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
