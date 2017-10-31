/**
 * 配送公司档案 - 新建或编辑界面
 */
Ext.define("PSI.Deliver.DeliverEditForm", {
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
			title : entity == null ? "新增配送公司" : "编辑配送公司",
			modal : true,
			resizable : true,
			onEsc : Ext.emptyFn,
			width : 550,
			height : 500,
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
							id : "editCode",
							fieldLabel : "编码",
							allowBlank : false,
							blankText : "没有输入配送公司编码",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							name : "code",
							value : entity == null ? null : entity.get("code"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						},{
							xtype:"displayfield",
							name:"textarea1",
						}, {
							id : "editName",
							fieldLabel : "配送公司名称",
							allowBlank : false,
							blankText : "没有输入配送公司",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							name : "name",
							value : entity == null ? null : entity.get("name"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							},
							colspan : 2,
							width : 490
						}, {
							id : "editManagerName",
							fieldLabel : "经理姓名",
							name : "manager_name",
							value : entity == null ? null : entity
								.get("manager_name"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "editManagerPhone",
							fieldLabel : "经理电话",
							name : "manager_phone",
							value : entity == null ? null : entity
								.get("manager_phone"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "editManagerFax",
							fieldLabel : "经理传真",
							name : "manager_fax",
							value : entity == null ? null : entity
								.get("manager_fax"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "editZhiguankeName",
							fieldLabel : "质管科姓名",
							name : "zhiguanke_name",
							value : entity == null ? null : entity
								.get("zhiguanke_name"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "editZhiguankePhone",
							fieldLabel : "质管科电话",
							name : "zhiguanke_phone",
							value : entity == null ? null : entity
								.get("zhiguanke_phone"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "editZhiguankeFax",
							fieldLabel : "质管科传真",
							name : "zhiguanke_fax",
							value : entity == null ? null : entity
								.get("zhiguanke_fax"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						},{
							id : "editAccountantName",
							fieldLabel : "财务姓名",
							name : "accountant_name",
							value : entity == null ? null : entity
								.get("accountant_name"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "editAccountantPhone",
							fieldLabel : "财务电话",
							name : "accountant_phone",
							value : entity == null ? null : entity
								.get("accountant_phone"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "editAccountantQQ",
							fieldLabel : "财务传真",
							name : "accountant_qq",
							value : entity == null ? null : entity
								.get("accountant_qq"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						},{
							id : "editCompanyEmail",
							fieldLabel : "公司邮件",
							name : "company_email",
							value : entity == null ? null : entity
								.get("company_email"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						},{
							id : "editCompanyPostcode",
							fieldLabel : "公司邮编",
							name : "company_postcode",
							value : entity == null ? null : entity
								.get("company_postcode"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						},{
							id : "editCompanyBankaccount",
							fieldLabel : "公司银行账号",
							name : "company_bankaccount",
							value : entity == null ? null : entity
								.get("company_bankaccount"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						},{
							id : "business_license_code",
							fieldLabel : "营业执照编号",
							name : "business_license_code",
							value : entity == null ? null : entity
								.get("business_license_code"),
							listeners : {
								specialkey : {
									fn : me.onEditNameSpecialKey,
									scope : me
								}
							}
						}, {
							id : "business_license_expire_time",
							fieldLabel : "营业执照有效期",
							name : "business_license_expire_time",
							xtype : "datefield",
							format : "Y-m-d",
							labelAlign : "right",
							labelSeparator : "",
							value : entity == null ? null : entity
								.get("business_license_expire_time"),
							listeners : {
								specialkey : {
									fn : me.onEditCodeSpecialKey,
									scope : me
								}
							}
						}, {
							id : "gmp_code",
							fieldLabel : "GMP编号",
							name : "gmp_code",
							value : entity == null ? null : entity
								.get("gmp_code"),
							listeners : {
								specialkey : {
									fn : me.onEditNameSpecialKey,
									scope : me
								}
							}
						}, {
							id : "gmp_expire_time",
							fieldLabel : "GMP有效期",
							name: "gmp_expire_time",
							value : entity == null ? null : entity
								.get("gmp_expire_time"),
							xtype : "datefield",
							format : "Y-m-d",
							labelAlign : "right",
							labelSeparator : "",
							listeners : {
								specialkey : {
									fn : me.onEditCodeSpecialKey,
									scope : me
								}
							}
						}, {
							id : "qs_code",
							fieldLabel : "生产许可证",
							name : "qs_code",
							value : entity == null ? null : entity
								.get("qs_code"),
							listeners : {
								specialkey : {
									fn : me.onEditNameSpecialKey,
									scope : me
								}
							}
						}, {
							id : "qs_expire_time",
							fieldLabel : "生产许可证有效期",
							name : "qs_expire_time",
							xtype : "datefield",
							format : "Y-m-d",
							labelAlign : "right",
							labelSeparator : "",
							value : entity == null ? null : entity
								.get("qs_expire_time"),
							listeners : {
								specialkey : {
									fn : me.onEditCodeSpecialKey,
									scope : me
								}
							}
						}, {
							id : "client_code",
							fieldLabel : "委托书",
							name : "client_code",
							value : entity == null ? null : entity
								.get("client_code"),
							listeners : {
								specialkey : {
									fn : me.onEditNameSpecialKey,
									scope : me
								}
							}
						}, {
							id : "client_expire_time",
							fieldLabel : "委托书有效期",
							value : entity == null ? null : entity
								.get("client_expire_time"),
							xtype : "datefield",
							format : "Y-m-d",
							name:"client_expire_time",
							labelAlign : "right",
							labelSeparator : "",
							listeners : {
								specialkey : {
									fn : me.onEditCodeSpecialKey,
									scope : me
								}
							}
						},{
							id : "editCompanyAddress",
							fieldLabel : "公司地址",
							name : "company_address",
							value : entity == null ? null : entity
								.get("company_address"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							},
							colspan : 2,
							width : 490
						}, {
							id : "editPeisongAddress",
							fieldLabel : "配送地址",
							name : "peisong_address",
							value : entity == null ? null : entity.get("peisong_address"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							},
							colspan : 2,
							width : 490
						},{
							id : "editNote",
							fieldLabel : "备注",
							name : "note",
							value : entity == null ? null : entity.get("note"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							},
							colspan : 2,
							width : 490
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

		me.__editorList = [ "editCode", "editName",
				"editManagerName", "editManagerPhone", "editManagerFax",
				"editZhiguankeName", "editZhiguankePhone", "editZhiguankeFax",
				"editAccountantName", "editAccountantPhone", "editAccountantQQ",
				"editCompanyEmail", "editCompanyPostcode", "editCompanyBankaccount",
				"editCompanyAddress","editPeisongAddress", "editNote"];
	},
	onWndShow : function() {
		var me = this;
		if (me.adding) {
			// 新建
			var grid = me.getParentForm().categoryGrid;
			var item = grid.getSelectionModel().getSelection();
			if (item == null || item.length != 1) {
				return;
			}
		} else {
			// 编辑
			var el = me.getEl();
			//el.mask(PSI.Const.LOADING);
			//Ext.Ajax.request({
			//			url : PSI.Const.BASE_URL + "Home/Deliver/deliverInfo",
			//			params : {
			//				id : me.getEntity().get("id")
			//			},
			//			method : "POST",
			//			callback : function(options, success, response) {
			//				if (success) {
			//					var data = Ext.JSON
			//							.decode(response.responseText);
			//					Ext.getCmp("editCode").setValue(data.code);
			//					Ext.getCmp("editName").setValue(data.name);
			//					Ext.getCmp("editManagerName")
			//							.setValue(data.manager_name);
			//					Ext.getCmp("editManagerPhone")
			//							.setValue(data.manager_phone);
			//					Ext.getCmp("editManagerFax")
			//							.setValue(data.manager_mobile);
			//					Ext.getCmp("editZhiguankeName").setValue(data.zhiguanke_name);
			//					Ext.getCmp("editZhiguankePhone").setValue(data.zhiguanke_phone);
			//					Ext.getCmp("editZhiguankeFax")
			//							.setValue(data.zhiguanke_fax);
			//					Ext.getCmp("editAccountantName")
			//							.setValue(data.accountant_name);
			//					Ext.getCmp("editAccountantPhone").setValue(data.accountant_phone);
			//					Ext.getCmp("editAccountantQQ").setValue(data.accountant_qq);
			//					Ext.getCmp("editCompanyEmail")
			//							.setValue(data.company_email);
			//					Ext.getCmp("editCompanyPostcode")
			//							.setValue(data.company_postcode);
			//					Ext.getCmp("editCompanyBankaccount")
			//							.setValue(data.company_bankaccount);
			//					Ext.getCmp("editCompanyAddress")
			//							.setValue(data.company_address);
			//					Ext.getCmp("editPeisongAddress")
			//							.setValue(data.peisong_address);
			//					Ext.getCmp("editNote").setValue(data.note);
			//				}
            //
			//				el.unmask();
			//			}
			//		});
		}

		var editCode = Ext.getCmp("editCode");
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
					url : PSI.Const.BASE_URL + "Home/Deliver/editDeliver",
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
									Ext.getCmp("editCode").focus();
								});
					}
				});
		me.getParentForm().freshDeliverGrid();
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
		Ext.getCmp("editCode").focus();

		var editors = [ "editCode", "editName",
			"editManagerName", "editManagerPhone", "editManagerFax",
			"editZhiguankeName", "editZhiguankePhone", "editZhiguankeFax",
			"editAccountantName", "editAccountantPhone", "editAccountantQQ",
			"editCompanyEmail", "editCompanyPostcode", "editCompanyBankaccount",
			"editCompanyAddress","editPeisongAddress", "editNote"];
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
			me.getParentForm().freshDeliverGrid(me.__lastId);
		}
	}
});