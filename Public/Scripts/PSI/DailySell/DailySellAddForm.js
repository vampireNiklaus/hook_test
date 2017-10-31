/**
 * 商品 - 新建或编辑界面
 */
Ext.define("PSI.DailySell.DailySellAddForm", {
	extend : "Ext.window.Window",

	config : {
		parentForm : null,
		entity : null,
		parentGrid:null,
	},

	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		//var entity = me.getEntity();
		var entity = null;

		me.adding = entity == null;

		var buttons = [];

		buttons.push({
			text : "保存并继续新增",
			formBind : true,
			handler : function() {
				me.onOK(true);
			},
			scope : me
		});

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

		me.hospitalNameStore = new Ext.data.ArrayStore({
			fields : ["hospital_id","hospital_name"],
			data : ["1","测试"]
		});
		me.batchNameStore = new Ext.data.ArrayStore({
			fields : ["deliver_id","batch_num"],
			data : ["1","测试"]
		});

		me.deliverNameStore = new Ext.data.ArrayStore({
			fields : ["deliver_id","deliver_name"],
			data : ["1","测试"]
		});

		Ext.apply(me, {
			title : entity==null?"新增销售记录信息":"编辑销售记录信息",
			modal : true,
			resizable : true,
			onEsc : Ext.emptyFn,
			width : 830,
			height : 250,
			layout : "fit",
			items : [{
				id : "editForm",
				xtype : "form",
				layout : {
					type : "table",
					columns : 3
				},
				height : "100%",
				bodyPadding : 2,
				defaultType : 'textfield',
				fieldDefaults : {
					labelWidth : 80,
					labelAlign : "right",
					labelSeparator : "",
					msgTarget : 'side'
				},
				items : [
					{
					id : "drug_id",
					xtype:"hidden",
					name : "drug_id",
				},{
					id : "drug_name",
					fieldLabel : "选择药品",
					editable:false,
					allowBlank : false,
					blankText : "没有选择药品",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					name : "drug_name",
					value : entity == null ? null : entity
						.get("drug_name"),
					xtype:"psi_drug_field",
					callbackFunc:me.onSelectDrug,
					parentCmp:me,
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						}
					}
				},{
					id : "drug_guige",
					editable:false,
					fieldLabel : "规格",
					allowBlank : false,
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					name : "drug_guige",
				},{
					id : "drug_manufacture",
					editable:false,
					fieldLabel : "生产企业",
					allowBlank : false,
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					name : "drug_manufacture",
					xtype:"psi_supplier_field",
					value : entity == null ? null : entity
						.get("drug_manufacture"),
				},{
					id : "hospital_id",
					xtype:"hidden",
					name : "hospital_id",
				},{
					id : "hospital_name",
					fieldLabel : "选择医院",
					allowBlank : false,
					editable:false,
					blankText : "没有选择医院",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					name : "hospital_name",
					callbackFunc : me.onSelectHospital,
					parentCmp : this,
					xtype : "psi_hospital_field",
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						}
					}
				},{
						id : "deliver_id",
						xtype:"hidden",
						name : "deliver_id",
					},{
					id : "deliver_name",
					fieldLabel : "配送公司",
					editable:false,
					allowBlank : false,
					blankText : "没有选择配送公司",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					name : "deliver_name",
					xtype : "psi_deliver_field",
					callbackFunc : me.onSelectDeliver,
					parentCmp : this,
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						}
					}
				},{
						id : "batch_num",
						name:"batch_num",
						fieldLabel : "药品批号",
						beforeLabelTextTpl : PSI.Const.REQUIRED,
						allowBlank : false,
						blankText : "没有选择或者填写对应的药品批号",
						value : entity == null ? null : entity
							.get("batch_num"),
					},{
						id : "expire_time",
						name:"expire_time",
						fieldLabel : "有效期",
						xtype : "datefield",
						format : "Y-m-d",
						labelAlign : "right",
						labelSeparator : "",
						beforeLabelTextTpl : PSI.Const.REQUIRED,
						allowBlank : false,
						blankText : "没有选择或者填写对应的有效期",
						value : entity == null ? null : entity
							.get("expire_time"),
					},{
					id : "sell_amount",
					name:"sell_amount",
					fieldLabel : "销售数量",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					xtype : "numberfield",
					allowBlank : false,
					blankText : "没有填写销售数量",
					value : entity == null ? null : entity
						.get("sell_amount"),
				},{
					id : "sell_date",
					name:"sell_date",
					xtype : "datefield",
					format : "Y-m-d",
					labelAlign : "right",
					labelSeparator : "",
					allowBlank : false,
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					fieldLabel : "销售日期",
					value : entity == null ? null : entity
						.get("sell_date"),
				}, {
					id : "create_time",
					name:"create_time",
					xtype : "hidden",
					value : entity == null ? null : entity
						.get("create_time"),
				},{
					id : "creator_id",
					name:"creator_id",
					xtype : "hidden",
					value : entity == null ? null : entity
						.get("creator_id"),
				},{
					id : "if_paid",
					name:"if_paid",
					xtype:"hidden",
					value : entity == null ? null : entity
						.get("if_paid"),
				},{
					id : "pay_time",
					name:"pay_time",
					xtype : "hidden",
					value : entity == null ? null : entity
						.get("pay_time"),

				},{
					id : "paybill_id",
					name:"paybill_id",
					xtype:"hidden",
					value : entity == null ? "未填写" : entity
						.get("paybill_id"),

				},{
					id : "status",
					name:"status",
					xtype:"hidden",
					value : entity == null ? null : entity
						.get("status"),
				},{
					editable:false,
					xtype:"displayfield",
				},{
					id : "note",
					fieldLabel : "备注",
					allowBlank : true,
					name : "note",
					colspan : 2,
					width : 550,
					value : entity == null ? null : entity
						.get("note"),
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

		me.__editorList = ["id","bill_code","employee_id","employee_des","employee_profit",
			"employee_name","drug_id","drug_name", "drug_guige","drug_manufacture",
			"hospital_id","hospital_name","stock_id","deliver_id", "deliver_name",
			"batch_num","sell_amount", "sell_date","create_time",
			"creator_id","note","if_paid","pay_time","paybill_id","status"];
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
			url : PSI.Const.BASE_URL + "Home/DailySell/editDailySell",
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
					me.getParentForm().refreshAllGrid();
				}
			},
			failure : function(form, action) {
				el.unmask();
				PSI.MsgBox.showInfo(action.result.msg,
					function() {
						Ext.getCmp("drug_name").focus();
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
			//var f = Ext.getCmp("editForm");
			if (f.getForm().isValid()) {
				var me = this;
				me.onOK(me.adding);
			}
		}
	},

	clearEdit : function() {
		Ext.getCmp("employee_des").focus();
		var editors =
			[
				Ext.getCmp("id"), Ext.getCmp("bill_code"),
				Ext.getCmp("employee_id"), Ext.getCmp("employee_des"),Ext.getCmp("employee_profit"),Ext.getCmp("employee_name"),
				Ext.getCmp("drug_id"),Ext.getCmp("drug_name"),Ext.getCmp("drug_guige"), Ext.getCmp("drug_manufacture"),
				Ext.getCmp("hospital_id"),Ext.getCmp("hospital_name"),Ext.getCmp("stock_id"),Ext.getCmp("deliver_id"),
				Ext.getCmp("deliver_name"),Ext.getCmp("batch_num"),Ext.getCmp("sell_amount"),Ext.getCmp("sell_date"),
				Ext.getCmp("create_time"),Ext.getCmp("creator_id"),Ext.getCmp("if_paid"),Ext.getCmp("pay_time"),
				Ext.getCmp("paybill_id"),Ext.getCmp("status"),Ext.getCmp("note")];
		for (var i = 0; i < editors.length; i++) {
			var edit = editors[i];
			edit.setValue(null);
			edit.clearInvalid();
		}
	},

	onWndClose : function() {
		var me = this;
		me.getParentForm().__lastId = me.__lastId;
		//me.getParentForm().refreshDailySellGrid();
	},

	//选择药品
	onSelectDrug:function(scope,data){
		var me  = this;
		if(scope){
			me = scope;
		}
		Ext.getCmp("drug_name").setValue(data.common_name);
		Ext.getCmp("drug_guige").setValue(data.guige);
		Ext.getCmp("drug_manufacture").setValue(data.manufacturer);
		Ext.getCmp("drug_id").setValue(data.id);
		//根据选择的药品获取对应的医院，配送公司等相关信息
		//var el = me.getEl();
		//el.mask(PSI.Const.LOADING);
		//Ext.Ajax.request({
		//	url : PSI.Const.BASE_URL + "Home/DailySell/afterDrugSelected",
		//	params : {
		//		drug_id:data.id
		//	},
		//	method : "POST",
		//	callback : function(options, success, response) {
		//		if (success) {
		//			var data = Ext.JSON
		//				.decode(response.responseText);
		//			if (data.hospitalList) {
		//				me.hospitalNameStore.removeAll();
		//				me.hospitalNameStore.add(data.hospitalList);
		//			}
		//			if(data.stockList){
		//				me.deliverNameStore.removeAll();
		//				me.deliverNameStore.add(data.stockList);
		//			}
		//			if(data.batchList){
		//				me.batchNameStore.removeAll();
		//				me.batchNameStore.add(data.batchList);
		//			}
		//		}
        //
		//		el.unmask();
		//	}
		//});
	},

	//选择医院
	onSelectHospital:function(scope,data){
		var me  = this;
		if(scope){
			me = scope;
		}
		Ext.getCmp("hospital_id").setValue(data.id);
		Ext.getCmp("hospital_name").setValue(data.hospital_name);
	},
	//选择配送公司
	onSelectDeliver:function(scope,data){
		var me  = this;
		if(scope){
			me = scope;
		}
		Ext.getCmp("deliver_id").setValue(data.deliver_id);
		Ext.getCmp("deliver_name").setValue(data.deliver_name);
	},
	//选择业务员
	onSelectEmployee:function(scope,data){
		var me  = this;
		if(scope){
			me = scope;
		}
		Ext.getCmp("employee_id").setValue(data.id);
		Ext.getCmp("employee_name").setValue(data.name);
	},
});