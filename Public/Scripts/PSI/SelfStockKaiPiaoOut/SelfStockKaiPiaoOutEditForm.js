	/**
 * 自销出库单 - 编辑界面
 */
Ext.define("PSI.SelfStockKaiPiaoOut.SelfStockKaiPiaoOutEditForm", {
	extend : "Ext.window.Window",
	alias : "widget.psi_self_stock",

	config : {
		parentForm : null,
		entity : null,
		direction : null,
		callbackFunc:null
	},

	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		var entity = me.getEntity();
		me.entity=entity;

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
			id:'btn-save',
			text : "出库",
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
			title : "编辑自销入开票公司单",
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
				items : me.getDirection()== 0?
				[
				{
					xtype : "hidden",
					name : "id",
					value :entity==null?null:entity.get("id")
				},{
					xtype : "hidden",
					name : "parent_id",
					value :entity==null?null:entity.get("parent_id")
				},{
					fieldLabel : "出库单号",
					xtype : "displayfield",
					colspan : 3,
					width:200,
					value :  entity.get("bill_code"),
				},{
					fieldLabel : "付款单单号",
					xtype : "displayfield",
					colspan : 3,
					value :  entity.get("pay_bill_code"),
				},{
					fieldLabel : "药品",
					xtype:'displayfield',
					colspan : 3,
					value : entity.get("common_name"),
				},{
					fieldLabel : "采购日期",
					xtype:'displayfield',
					colspan : 3,
					value : entity.get("buy_date"),
				}, {
					fieldLabel : "剂型",
					xtype:'displayfield',
					value : entity.get("jx"),
					colspan : 2,
				}, {
					fieldLabel : "规格",
					xtype:'displayfield',
					colspan : 4,
					width:300,
					value :entity.get("guige"),
				}, {
					fieldLabel : "生产厂家",
					xtype:'displayfield',
					value : entity.get("manufacturer"),
					colspan : 6,
				},{
					fieldLabel : "供应商",
					xtype:'displayfield',
					colspan : 6,
					value :entity.get("supplier_name"),
				} ,{
					fieldLabel : "应出库总量",
					colspan : 3,
					width:200,
					xtype : "displayfield",
					value : "<b style='color:blue'>" + entity.get("stock_amount") +"</b>"  ,
				},{
					fieldLabel : "剩余待出库量",
					colspan : 3,
					width:200,
					xtype : "displayfield",
					value : "<b style='color:red'>" +entity.get("remain_amount") +"</b>",
				},{
					fieldLabel : "开票公司",
					colspan : 6,
					name: "supplier_name",
					xtype : "displayfield",
					value : entity.get("supplier_name"),
				}, {
					id:"supplier_id",
					hidden:true,
					name:'supplier_id',
					value : entity == null ? null : entity.get("supplier_id"),
				},{
					id : "out_amount",
					fieldLabel : "出库数量",
					regex:/^\d+$/,
					regexText: '请输入正确的数据类型',
					allowBlank : false,
					blankText : "没有输入出库数量",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					name : "out_amount",
					colspan : 6,
					width:200,
					value : entity == null ? null : entity.get("out_amount"),
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						},change : {
							fn : me.recountAll,
							scope : me
						},
					},
				},{
					id : "kaipiao_unit_price",
					fieldLabel : "开票单价",
					allowBlank : false,
					blankText : "没有输入开票单价",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					name : "kaipiao_unit_price",
					colspan : 3,
					width:200,
					value : entity == null ? null : entity.get("kaipiao_unit_price"),
					xtype : "numberfield",
					allowDecimals : true,
					decimalPrecision: 3,
					hideTrigger : false,
					listeners : {
						change : {
							fn : me.recountAll,
							scope : me
						},
					},
				},{
					fieldLabel : "开票金额",
					colspan : 3,
					name: "kaipiao_sum_money",
					id: "kaipiao_sum_money",
					xtype : "displayfield",
					value : 0.00,
				}, {
					id : "outstock_date",
					name : "outstock_date",
					fieldLabel : "出库日期",
					allowBlank : false,
					blankText : "没有输入出库日期",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					xtype : "datefield",
					format : "Y-m-d",
					colspan:6,
					value : entity == null ? new Date() : entity.get("outstock_date"),
					listeners : {
						specialkey : {
							fn : me.onEditBizDTSpecialKey,
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
				}]
				: //出库条目
					[
						{
							xtype : "hidden",
							name : "id",
							value :entity==null?null:entity.get("id")
						},{
						xtype : "hidden",
						name : "parent_id",
						value :entity==null?null:entity.get("parent_id")
					},{
						fieldLabel : "出库单号",
						xtype : "displayfield",
						colspan : 3,
						width:200,
						value :  entity.get("bill_code"),
					},{
						fieldLabel : "付款单单号",
						xtype : "displayfield",
						colspan : 3,
						value :  entity.get("pay_bill_code"),
					},{
						fieldLabel : "药品",
						xtype:'displayfield',
						colspan : 3,
						value : entity.get("common_name"),
					},{
						fieldLabel : "采购日期",
						xtype:'displayfield',
						colspan : 3,
						value : entity.get("buy_date"),
					}, {
						fieldLabel : "剂型",
						xtype:'displayfield',
						value : entity.get("jx"),
						colspan : 2,
					}, {
						fieldLabel : "规格",
						xtype:'displayfield',
						colspan : 4,
						width:300,
						value :entity.get("guige"),
					}, {
						fieldLabel : "生产厂家",
						xtype:'displayfield',
						value : entity.get("manufacturer"),
						colspan : 6,
					},{
						fieldLabel : "供应商",
						xtype:'displayfield',
						colspan : 6,
						value :entity.get("supplier_name"),
					} ,{
						fieldLabel : "出库总量",
						colspan : 2,
						width:200,
						xtype : "displayfield",
						value : entity.get("stock_amount"),
					},{
						fieldLabel : "剩余出库量",
						colspan : 4,
						xtype : "displayfield",
						value : entity.get("need_amount"),
					},{
						id : "supplier",
						fieldLabel : "开票公司",
						name:"supplier_name",
						xtype:'displayfield',
						parentCmp:me,
						colspan :6,
						value : entity == null ? null : entity.get("supplier_name"),
						width:300,
					},{
						id:"supplier_id",
						hidden:true,
						name:'supplier_id',
						value : entity == null ? null : entity.get("supplier_id"),
					},{
						id : "stock_num",
						fieldLabel : "出库数量",
						xtype:'displayfield',
						name : "stock_num",
						colspan : 6,
						width:200,
						value : entity == null ? null : entity.get("stock_num"),
					},{
						id : "kaipiao_sum_money",
						fieldLabel : "开票总额",
						xtype:'displayfield',
						colspan : 4,
						name : "sum_pay",
						value : entity == null ? '<span style="color:#6B6B6B">系统自动生成</span>' : entity.get("sum_pay"),
					},{
							id : "batch_num",
							fieldLabel : "批号",
							allowBlank : false,
							blankText : "没有输入批号",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							name : "batch_num",
							colspan : 6,
							width:300,
							value : entity == null ? null : entity.get("batch_num"),
							valueField : "batch_num",
							displayField : "batch_num",
							xtype : "combo",
							store: me.batchStore,
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								},
								focus : {
									fn : me.refreshBatch,
									scope : me
								}

							}
			},{
						id : "validity",
						name : "validity",
						fieldLabel : "有效期",
						allowBlank : false,
						blankText : "没有输入有效期",
						beforeLabelTextTpl : PSI.Const.REQUIRED,
						xtype : "datefield",
						format : "Y-m-d",
						colspan:6,
						value : entity == null ? new Date() : entity.get("validity"),
						listeners : {
							specialkey : {
								fn : me.onEditBizDTSpecialKey,
								scope : me
							}
						}
					}, {
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

		// me.__editorList = ["pay_1st_account","pay_1st_amount","pay_2nd_account","pay_2nd_amount"];
	},

	//刷新批号列表
	refreshBatch:function () {
		this.batchStore.load();
	},
	//刷新批号时候获取药品id和配送公司id
	getQueryParam:function(){
		var me=this;
		var result={};
		result.drug_id=me.entity.get('drug_id');
		if(Ext.getCmp('supplier_id'))
			result.supplier_id=Ext.getCmp('supplier_id').getValue();
		return result;
	},

	onWndShow : function() {
		var me = this;

		var el = me.getEl();
	},

	onOK : function(thenAdd) {
		var me = this;
		var f = Ext.getCmp("editForm");
		var el = f.getEl();
		el.mask(PSI.Const.SAVING);

		f.submit({
			url : PSI.Const.BASE_URL + "Home/SelfStockKaiPiaoOut/editSelfStockKaiPiaoOut",
			method : "POST",
			success : function(form, action) {
				el.unmask();
				me.__lastId = action.result.id;
				me.getParentForm().__lastId = me.__lastId;

				PSI.MsgBox.tip("数据保存成功");
				me.focus();
				me.close();
				// me.getCallbackFunc();
				me.getParentForm().refreshUnEditedGrid();
				me.getParentForm().refreshEditedGrid();
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

	//计算所有的价格
	recountAll:function(){
		var config={
			'kaipiao_unit_price':'kaipiao_sum_money',
		};
		var num = Ext.getCmp('out_amount').getValue();
		if(num&& Ext.getCmp('out_amount').isValid()){
			for(var key in config){
				var unit =Ext.getCmp(key).getValue();
				if(unit!=''&&Ext.getCmp(key).isValid())
					Ext.getCmp(config[key]).setValue((unit*num).toFixed(2));
			}
		}
	},

	onWndClose : function() {
		var me = this;
		me.getParentForm().__lastId = me.__lastId;
		me.getParentForm().refreshUnEditedGrid();
	},
	selectSupplier:function(scope,data){
		var me = this;
		if(scope){
			me = scope;
		}
		Ext.getCmp("supplier_id").setValue(data.supplier_id);
	}
	,
	getSupplierQueryCondition : function(){
		//根据药品类型选择对应的配送公司，配送公司的限制查询条件
		var drug_id  = Ext.getCmp("drug_id").getValue();
		drug_id = drug_id?drug_id:0;
		return {
			queryConditionType:"searchByDrugId",
			queryConditionKey:drug_id
		}
	}
});