/**
 * 账户档案 - 新建或编辑界面
 */
Ext.define("PSI.BankCard.BankCardEditForm", {
	extend : "Ext.window.Window",

	config : {
		parentForm : null,
		entity : null
	},

	initComponent : function() {
		var me = this;
		var entity = me.getEntity();
		this.adding = entity == null;

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
			title : entity == null ? "新增账户" : "编辑账户",
			modal : true,
			resizable : true,
			onEsc : Ext.emptyFn,
			width : 550,
			height : 400,
			layout : "fit",
			items : [{
				id : "editForm",
				xtype : "form",
				layout : {
					type : "table",
					columns : 2
				},
				height : "100%",
				bodyPadding : 5,
				defaultType : 'textfield',
				fieldDefaults : {
					labelWidth : 90,
					labelAlign : "right",
					labelSeparator : "",
					msgTarget : 'side'
				},
				items : [{
							xtype : "hidden",
							name : "id",
							value : entity == null ? null : entity.get("id")
						},{
							id : "editAccountNumber",
							fieldLabel : "账号",
							allowBlank : false,
							blankText : "没有输入账户编码",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							name : "account_number",
							value : entity == null ? null : entity.get("account_number"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "editBankName",
							fieldLabel : "开户行",
							name : "bank_name",
							value : entity == null ? null : entity
								.get("bank_name"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "editAccountName",
							fieldLabel : "账户名称",
							allowBlank : false,
							blankText : "没有输入账户",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							name : "account_name",
							value : entity == null ? null : entity.get("account_name"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							},
							colspan : 2,
							width : 490
						}, {
							id : "editCapitalType",
							fieldLabel : "资金类型",
							name : "capital_type",
							value : entity == null ? null : entity
									.get("capital_type"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "editIsStopped",
							fieldLabel : "是否停用",
							name : "is_stopped",
							value : entity == null ? null : entity
									.get("is_stopped"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							},
							xtype:"checkbox"
						}, {
							id : "editNowAmount",
							fieldLabel : "当前余额",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							name : "now_amount",
									value : entity == null ? null : entity.get("now_amount"),
									listeners : {
										specialkey : {
											fn : me.onEditSpecialKey,
											scope : me
										}
									},
									xtype:"numberfield"
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

		me.__editorList = [ "editAccountNumber", "editBankName","editAccountName",
			     "editCapitalType", "editIsStopped", "editNowAmount"];
	},
	onWndShow : function() {
		var me = this;
		if (me.adding) {
			// 新建
			var grid = me.getParentForm().bankCardGrid;
			var item = grid.getSelectionModel().getSelection();
			if (item == null || item.length != 1) {
				return;
			}

			Ext.getCmp("editCategory").setValue(item[0].get("id"));
		} else {
			// 编辑
			var el = me.getEl();
			//el.mask(PSI.Const.LOADING);
			//Ext.Ajax.request({
			//			url : PSI.Const.BASE_URL + "Home/BankCard/supplierInfo",
			//			params : {
			//				id : me.getEntity().get("id")
			//			},
			//			method : "POST",
			//			callback : function(options, success, response) {
			//				if (success) {
			//					var data = Ext.JSON
			//							.decode(response.responseText);
			//					Ext.getCmp("editCategory")
			//							.setValue(data.categoryId);
			//					Ext.getCmp("editCode").setValue(data.code);
			//					Ext.getCmp("editName").setValue(data.name);
			//					Ext.getCmp("editBankName")
			//							.setValue(data.address);
			//					Ext.getCmp("editContact01")
			//							.setValue(data.contact01);
			//					Ext.getCmp("editIsStopped")
			//							.setValue(data.mobile01);
			//					Ext.getCmp("editNowAmount").setValue(data.tel01);
			//					Ext.getCmp("editQQ01").setValue(data.qq01);
			//					Ext.getCmp("editContact02")
			//							.setValue(data.contact02);
			//					Ext.getCmp("editMobile02")
			//							.setValue(data.mobile02);
			//					Ext.getCmp("editTel02").setValue(data.tel02);
			//					Ext.getCmp("editQQ02").setValue(data.qq02);
			//					Ext.getCmp("editBankNameShipping")
			//							.setValue(data.addressShipping);
			//					Ext.getCmp("editInitPayables")
			//							.setValue(data.initPayables);
			//					Ext.getCmp("editInitPayablesDT")
			//							.setValue(data.initPayablesDT);
			//					Ext.getCmp("editBankName")
			//							.setValue(data.bankName);
			//					Ext.getCmp("editBankAccount")
			//							.setValue(data.bankAccount);
			//					Ext.getCmp("editTax").setValue(data.tax);
			//					Ext.getCmp("editFax").setValue(data.fax);
			//					Ext.getCmp("editNote").setValue(data.note);
			//				}
            //
			//				el.unmask();
			//			}
			//		});
		}

		var editCode = Ext.getCmp("editAccountNumber");
		editCode.focus();
		editCode.setValue(editCode.getValue());
	},
	// private
	onOK : function(thenAdd) {
		var me = this;
		var f = Ext.getCmp("editForm");
		var el = f.getEl();
		el.mask(PSI.Const.SAVING);
		f.submit({
					url : PSI.Const.BASE_URL + "Home/BankCard/editBankCard",
					method : "POST",
					success : function(form, action) {
						el.unmask();
						PSI.MsgBox.tip("数据保存成功");
						me.focus();
						me.__lastId = action.result.id;
						if (thenAdd) {
							me.clearEdit();
						} else {
							me.close();
						}
					},
					failure : function(form, action) {
						el.unmask();
						PSI.MsgBox.showInfo(action.result.msg, function() {
									Ext.getCmp("editAccountNumber").focus();
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
	onEditLastSpecialKey : function(field, e) {
		if (e.getKey() === e.ENTER) {
			var f = Ext.getCmp("editForm");
			if (f.getForm().isValid()) {
				var me = this;
				me.onOK(me.adding);
			}
		}
	},
	clearEdit : function() {
		Ext.getCmp("editAccountNumber").focus();

		var editors = ["editAccountNumber", "editBankName","editAccountName",
			"editCapitalType", "editIsStopped", "editNowAmount"];
		for (var i = 0; i < editors.length; i++) {
			var edit = Ext.getCmp(editors[i]);
			if (edit) {
				edit.setValue(null);
				edit.clearInvalid();
			}
		}
	},
	onWndClose : function() {
		var me = this;
		if (me.__lastId) {
			me.getParentForm().freshBankCardGrid(me.__lastId);
		}
	}
});