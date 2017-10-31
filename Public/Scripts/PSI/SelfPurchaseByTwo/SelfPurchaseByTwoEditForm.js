/**
 * 自销采购单 - 新建或编辑界面
 */
Ext.define("PSI.SelfPurchaseByTwo.SelfPurchaseByTwoEditForm", {
	extend : "Ext.window.Window",
	alias : "widget.psi_self_purchase",

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
			title : entity == null ? "新增自销采购单" : "编辑自销采购单",
			modal : true,
			resizable : true,
			onEsc : Ext.emptyFn,
			width : 600,
			height : 600,
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
					id:'purchaseKey',
					value:'1314',
					hidden:true
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
					id : "buy_amount",
					fieldLabel : "买货数量",
					regex:/^\d+$/,
					regexText: '请输入正确的数据类型',
					allowBlank : false,
					blankText : "没有输入买货数量",
					name : "buy_amount",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					colspan : 3,
					width:200,
					value : entity == null ? null : entity.get("buy_amount"),
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						},
						change:{
							fn:me.recountAll,
							scope:me
						}
					},
				},{
					id : "base_price",
					fieldLabel : "买货底价",
					xtype:'numberfield',
					allowBlank : false,
					blankText : "没有输入开票单价",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					decimalPrecision : 3,
					minValue:0,
					name:"base_price",
					colspan : 3,
					width:200,
					value : entity == null ? '<span style="color:#6B6B6B">根据药品信息生成</span>' : entity.get("base_price"),
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						},
						change:{
							fn:me.recountAll,
							scope:me
						}
					},
				},
				{
					id : "tax_unit_price",
					fieldLabel : "单品税价",
					xtype:'numberfield',
					allowBlank : false,
					blankText : "没有输入开票单价",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					decimalPrecision : 3,
					minValue:0,
					name:"tax_unit_price",
					colspan : 3,
					width:200,
					value : entity == null ? '<span style="color:#6B6B6B">根据药品信息生成</span>' : entity.get("tax_unit_price"),
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						},
						change:{
							fn:me.recountAll,
							scope:me
						}
					},
				},{
					id : "kaipiao_unit_price",
					fieldLabel : "开票单价",
					xtype:'numberfield',
					allowBlank : false,
					blankText : "没有输入开票价格",
					name : "kaipiao_unit_price",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					colspan : 3,
					width:200,
					value : entity == null ? null : entity.get("kaipiao_unit_price"),
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						},
                        change:{
                            fn:me.recountAll,
                            scope:me
                        }

					},
				},{
					id:"huikuan_way",
					fieldLabel:"回款方式",
					allowBlank:false,
					blankText:"没有输入回款方式",
					beforeLabelTextTpl:PSI.Const.REQUIRED,
					colspan : 6,
					width:550,
					name:"huikuan_way",
					value:entity == null ? null : entity.get("huikuan_way"),
					valueField: "id",
					displayField: "name",
					xtype: "combo",
					store: new Ext.data.ArrayStore({
						fields: ['id', 'name'],
						data: [
							["1", '现款现货'],
							["2", '商业公司预付'],
							["3", '固定期限回款'],
							["4", '压批回款']
						]
					}),
					listeners:{
						specialkey:{
							fn:me.onEditSpecialKey,
							scope:me
						},
                        change:{
                            fn:me.recountAll,
                            scope:me
                        }
					}
				},{
					id : "sum_pay",
					fieldLabel : "付款金额",
					emptyText: '系统自动生成',
					blankText: "没有输入付款金额",
					colspan : 3,
					name : "sum_pay",
					value : entity == null ? null : entity.get("sum_pay"),
					listeners: {
						specialkey: {
							fn: me.onEditSpecialKey,
							scope: me
						},
					},
				},{
					id : "huikuan_pay",
					fieldLabel : "回款金额",
					emptyText: '系统自动生成',
					blankText: "没有输入回款金额",
					colspan : 3,
					name : "huikuan_pay",
					value : entity == null ? null : entity.get("huikuan_pay"),
					listeners: {
						specialkey: {
							fn: me.onEditSpecialKey,
							scope: me
						},
					},
				},{
					id : "buy_date",
					fieldLabel : "采购日期",
					allowBlank : false,
					colspan : 3,
					width:200,
					blankText : "没有输入采购日期",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					xtype : "datefield",
					format : "Y-m-d",
					name : "buy_date",
					value : entity == null ? new Date() : entity.get("buy_date"),
					listeners : {
						specialkey : {
							fn : me.onEditBizDTSpecialKey,
							scope : me
						}
					}
				},{
					id : "kaidan_date",
					fieldLabel : "开单日期",
					allowBlank : false,
					colspan : 3,
					width:200,
					blankText : "没有输入开单日期",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					xtype : "datefield",
					format : "Y-m-d",
					name : "kaidan_date",
					value : entity == null ? new Date() : entity.get("kaidan_date"),
					listeners : {
						specialkey : {
							fn : me.onEditBizDTSpecialKey,
							scope : me
						}
					}
				},/*{
					id : "huikuan_deadline",
					fieldLabel : "回款期限",
					regex:/^\d+$/,
					regexText: '请输入正确的数据类型',
					allowBlank : true,
					// blankText : "没有输入买货数量",
					name : "huikuan_deadline",
					// beforeLabelTextTpl : PSI.Const.REQUIRED,
					colspan : 6,
					width:200,
					value : entity == null ? null : entity.get("huikuan_deadline"),
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						}
					},
				},*/{
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

		me.__editorList = [];
	},

	onWndShow : function() {
		var me = this;

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
					url : PSI.Const.BASE_URL + "Home/SelfPurchaseByTwo/editSelfPurchaseByTwo",
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
							me.getParentForm().refreshSelfPurchaseByTwoGrid();
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
			'base_price':'sum_pay',
			'huikuan_price':'huikuan_pay'
		};
		//用于判断是否已经选择了药品
		var drug=Ext.getCmp('drug_id').value;
		//获取数量
		var num = Ext.getCmp('buy_amount').getValue();
		//获取单品税价
		var tax_price = Ext.getCmp('tax_unit_price').getValue();
		//获取开票单价
		var kaipiao_price = Ext.getCmp('kaipiao_unit_price').getValue();
		//获取回款方式
		var huikuan_way = Ext.getCmp('huikuan_way').getValue();
		if(huikuan_way&&huikuan_way != '2'){
			//商业公司预回款方式
            if(drug&&num&&tax_price&&kaipiao_price&&Ext.getCmp('buy_amount').isValid()){
                for(var key in config){
                    var unit =Ext.getCmp('base_price').getValue();
                    if(unit!=''&&Ext.getCmp('base_price').isValid())
                        Ext.getCmp(config['base_price']).setValue((num*tax_price+num*unit).toFixed(2));
                        Ext.getCmp(config['huikuan_price']).setValue((num*kaipiao_price).toFixed(2));
                }
            }
		}
		if(huikuan_way&&huikuan_way == '2'){
			//非商业公司预回款方式
            if(drug&&num&&tax_price&&kaipiao_price&&Ext.getCmp('buy_amount').isValid()){
                for(var key in config){
                    var unit =Ext.getCmp('base_price').getValue();
                    if(unit!=''&&Ext.getCmp('base_price').isValid())
					Ext.getCmp(config['base_price']).setValue(0.00.toFixed(2));
                    Ext.getCmp(config['huikuan_price']).setValue((num*kaipiao_price-num*tax_price-num*unit).toFixed(2));
                }
            }
		}

	},

	clearEdit : function() {
		var editors = [];
		for (var i = 0; i < editors.length; i++) {
			var edit = editors[i];
			edit.setValue(null);
			edit.clearInvalid();
		}
	},

	onWndClose : function() {
		var me = this;
		me.getParentForm().__lastId = me.__lastId;
		me.getParentForm().refreshSelfPurchaseByTwoGrid();
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
		Ext.getCmp('base_price').setValue(data.base_price);
		console.log(data.base_price);
		// Ext.getCmp('kaipiao_unit_price').setValue(data.kaipiao_price);
		// Ext.getCmp('tax_unit_price').setValue(data.tax_price);
		var config={
			'base_price':'sum_pay',
			// 'kaipiao_unit_price':'sum_kaipiao_money',
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

	selectSupplier:function(scope,data){
		var me = this;
		if(scope){
			me = scope;
		}
		Ext.getCmp("supplier_id").setValue(data.id);
	},
	selectKpgs:function(scope,data){
		var me = this;
		if(scope){
			me = scope;
		}
		Ext.getCmp("kpgs_id").setValue(data.id);
	},
});