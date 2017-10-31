/**
 * 自销付款单 - 编辑界面
 */
Ext.define("PSI.SelfPayByTwo.SelfPayByTwoEditForm", {
	extend : "Ext.window.Window",
	alias : "widget.psi_self_pay",

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
			id:'btn-save',
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
			title : "编辑自销付款单",
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
					value :entity.get("id")
				},{
					fieldLabel : "采购单号",
					xtype : "displayfield",
					colspan : 3,
					width:200,
					value :  entity.get("buy_bill_code"),
				},{
					fieldLabel : "付款单号",
					xtype : "displayfield",
					colspan : 3,
					value :  entity.get("bill_code"),
				},{
					fieldLabel : "药品",
					xtype:'displayfield',
					colspan : 6,
					width:550,
					value : entity.get("common_name"),
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
					fieldLabel : "买货数量",
					xtype:'displayfield',
					colspan : 6,
					value :'<b style="color:red;">'+entity.get("pay_amount")+'</b>',
				},{
					fieldLabel : "买货单价",
					xtype:'displayfield',
					colspan : 2,
					width:200,
					value :'<b style="color:red;">'+ entity.get("base_price")+'</b>',
				}, {
					fieldLabel : "买货金额",
					xtype:'displayfield',
					colspan : 4,
					value : '<b style="color:red;">'+entity.get("sum_pay_money")+'</b>',
				},{
					id:'sum_pay_money',
					hidden:true,
					value:entity.get("sum_pay_money")

				},{
					fieldLabel : "采购日期",
					colspan : 2,
					width:200,
					xtype : "displayfield",
					value : entity.get("buy_date"),
				},{
					fieldLabel : "开单日期",
					colspan : 4,
					xtype : "displayfield",
					value : entity.get("yewu_date"),
				},{
					id : "pay_1st_account",
					fieldLabel : "主付款账户",
					allowBlank : false,
					emptyText : "选择主付款账户",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					colspan :6,
					value:entity.get('pay_1st_account')==null?null:entity.get('pay_1st_account_name')+'，卡号：'+entity.get('pay_1st_account_num'),
					xtype:entity.get('isFund')?'displayfield':'psi_bank_account_field',
					width:300,
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						}
					},
					renderer:function (v) {
						if(entity.get('isFund')){
							return "<b style='color: blue'>"+v+"</b>";
						}
						return v;
					}
				}, {
					id:"pay_1st_account_id",
					hidden:true,
					name:'pay_1st_account_id',
					value:entity.get('pay_1st_account')==null?null:entity.get('pay_1st_account'),
				},{
					id : "pay_1st_amount",
					fieldLabel : "主付款金额",
					regex:/^[0-9]+(.[0-9]{1,2})?$/,
					regexText: '请输入正确的数据类型',
					allowBlank : false,
					blankText : "没有输入主付款金额",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					name : "pay_1st_amount",
					value:entity.get('pay_1st_account')==null?null:entity.get('pay_1st_amount'),
					xtype:entity.get('isFund')?'displayfield':'',
					colspan : 6,
					width:200,
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						},
						change:{
							fn:me.countMoney,
						}
					},
					renderer:function (v) {
						if(entity.get('isFund')){
							return "<b style='color: red'>"+v+"</b>";
						}
						return v;
					}
				},{
					id : "pay_2nd_account",
					fieldLabel : "次付款账户",
					allowBlank : true,
					emptyText : "选择主付款账户",
					colspan :6,
					value:entity.get('pay_2nd_account_name')==null?null:entity.get('pay_2nd_account_name')+'，卡号：'+entity.get('pay_2nd_account_num'),
					xtype:entity.get('isFund')?'displayfield':'psi_bank_account_field',
					width:300,
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						}
					},
					renderer:function (v) {
						if(entity.get('isFund')){
							return "<b style='color: blue'>"+v+"</b>";
						}
						return v;
					}
				},  {
					id:"pay_2nd_account_id",
					hidden:true,
					name:'pay_2nd_account_id',
					value:entity.get('pay_2nd_account')==null?null:entity.get('pay_2nd_account'),
				},{
					id : "pay_2nd_amount",
					fieldLabel : "次付款金额",
					regex:/^[0-9]+(.[0-9]{1,2})?$/,
					regexText: '请输入正确的数据类型',
					allowBlank : true,
					blankText : "没有输入主付款金额",
					name : "pay_2nd_amount",
					value:entity.get('pay_2nd_amount')==null||entity.get('pay_2nd_amount')==0?null:entity.get('pay_2nd_amount'),
					xtype:entity.get('isFund')?'displayfield':'',
					colspan : 6,
					width:200,
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						},
					},
					renderer:function (v) {
						if(entity.get('isFund')){
							return "<b style='color: red'>"+v+"</b>";
						}
						return v;
					}
				},{
					id : "fund_date",
					fieldLabel : "打款日期",
					allowBlank : false,
					colspan : 6,
					width:200,
					blankText : "没有输入采购日期",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					xtype : "datefield",
					format : "Y-m-d",
					name : "fund_date",
					value : entity.get('fund_date') ? entity.get("fund_date") :new Date() ,
					hidden: entity.get('isFund')?false:true,
					disabled: entity.get('isFund')?false:true,
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
					value:entity.get('note'),
					colspan:6,
					width:550
				},{
					name:'isParent',
					value:entity.get('pay_1st_account')==null?1:0,
					hidden:true,
				},{
					id:'isFund',
					name:'isFund',
					value:entity.get('isFund')?1:0,
					hidden:true,
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

		me.__editorList = ["pay_1st_account","pay_1st_amount","pay_2nd_account","pay_2nd_amount"];
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

		if(Ext.getCmp("isFund").getValue()==false){
			if(Ext.getCmp("pay_1st_account").getIdValue())
				Ext.getCmp("pay_1st_account_id").setValue(Ext.getCmp("pay_1st_account").getIdValue());
			if(Ext.getCmp("pay_2nd_account").getIdValue())
				Ext.getCmp("pay_2nd_account_id").setValue(Ext.getCmp("pay_2nd_account").getIdValue());
			//判断是否有次付款账户
			if(Ext.getCmp('pay_2nd_amount').getValue()!=''&&Ext.getCmp("pay_2nd_account_id").getValue()==''){
				PSI.MsgBox.showInfo("次付款账户未选择");
				el.unmask();
				return;
			}
		}

		f.submit({
			url : PSI.Const.BASE_URL + "Home/SelfPayByTwo/editSelfPayByTwo",
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
					me.getParentForm().refreshUnEditedGrid();
					me.getParentForm().refreshEditedGrid();
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
	countMoney:function(){
		var needPay=Ext.getCmp('sum_pay_money').getValue();
		var amount1st=Ext.getCmp('pay_1st_amount').getValue();
		if(amount1st!=''&&needPay-amount1st>0){
			Ext.getCmp('pay_2nd_amount').setValue((needPay-amount1st).toFixed(2));
		}else{
			Ext.getCmp('pay_2nd_amount').setValue('');
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
		me.getParentForm().refreshUnEditedGrid();
	}
});