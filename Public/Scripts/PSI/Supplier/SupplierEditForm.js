/**
 * 供应商档案 - 新建或编辑界面
 */
Ext.define("PSI.Supplier.SupplierEditForm", {
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
			title : entity == null ? "新增供应商" : "编辑供应商",
			modal : true,
			resizable : true,
			onEsc : Ext.emptyFn,
			width : 550,
			height : 480,
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
							fieldLabel : "公司编码",
							allowBlank : false,
							blankText : "没有输入供应商编码",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							name : "code",
							value : entity == null ? null : entity.get("code"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "editName",
							fieldLabel : "公司名称",
							allowBlank : false,
							blankText : "没有输入供应商名称",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							name : "name",
							value : entity == null ? null : entity.get("name"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
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
							name : "manager_mobile",
							value : entity == null ? null : entity
								.get("manager_mobile"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "editInnerEmName",
							fieldLabel : "内勤姓名",
							name : "neiqin_name",
							value : entity == null ? null : entity
								.get("neiqin_name"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "editInnerEmPhone",
							fieldLabel : "内勤电话",
							name : "neiqin_phone",
							value : entity == null ? null : entity
								.get("neiqin_phone"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "editInnerEmFax",
							fieldLabel : "内勤QQ",
							name : "neiqin_qq",
							value : entity == null ? null : entity
								.get("neiqin_qq"),
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
						}, {xtype:"displayfield",
							name:"textarea1",
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
							},
							colspan : 2,
							width : 490
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

		me.__editorList = ["editCode", "editName",
				"editManagerName", "editManagerPhone", "editManagerFax", "editInnerEmName",
				"editInnerEmPhone", "editInnerEmFax", "editAccountantName", "editAccountantPhone",
				"editAccountantQQ", "editCompanyEmail", "editCompanyPostcode",
				"editCompanyBankaccount", "editCompanyAddress", "editNote"];
	},
	onWndShow : function() {
		var me = this;
		if (me.adding) {
			// 新建
			var grid = me.getParentForm().supplierGrid;
			var item = grid.getSelectionModel().getSelection();
			if (item == null || item.length != 1) {
				return;
			}
		} else {
			// 编辑
			var el = me.getEl();
			//el.mask(PSI.Const.LOADING);
			//Ext.Ajax.request({
			//			url : PSI.Const.BASE_URL + "Home/Supplier/supplierInfo",
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
			//					Ext.getCmp("editManagerName")
			//							.setValue(data.address);
			//					Ext.getCmp("editManagerPhone")
			//							.setValue(data.contact01);
			//					Ext.getCmp("editManagerFax")
			//							.setValue(data.mobile01);
			//					Ext.getCmp("editInnerEmName").setValue(data.tel01);
			//					Ext.getCmp("editInnerEmPhone").setValue(data.qq01);
			//					Ext.getCmp("editInnerEmFax")
			//							.setValue(data.contact02);
			//					Ext.getCmp("editAccountantName")
			//							.setValue(data.mobile02);
			//					Ext.getCmp("editAccountantPhone").setValue(data.tel02);
			//					Ext.getCmp("editAccountantQQ").setValue(data.qq02);
			//					Ext.getCmp("editCompanyEmail")
			//							.setValue(data.addressShipping);
			//					Ext.getCmp("editInitPayables")
			//							.setValue(data.initPayables);
			//					Ext.getCmp("editInitPayablesDT")
			//							.setValue(data.initPayablesDT);
			//					Ext.getCmp("editCompanyPostcode")
			//							.setValue(data.bankName);
			//					Ext.getCmp("editCompanyBankaccount")
			//							.setValue(data.bankAccount);
			//					Ext.getCmp("editCompanyAddress").setValue(data.tax);
			//					Ext.getCmp("editNote").setValue(data.fax);
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
					url : PSI.Const.BASE_URL + "Home/Supplier/editSupplier",
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
		me.getParentForm().freshSupplierGrid;
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

		var editors = ["editCode", "editName", "editManagerName",
				"editCompanyEmail", "editManagerPhone", "editManagerFax",
				"editInnerEmName", "editInnerEmPhone", "editInnerEmFax", "editAccountantName",
				"editAccountantPhone", "editAccountantQQ", "editInitPayables",
				"editInitPayablesDT", "editCompanyPostcode", "editCompanyBankaccount",
				"editCompanyAddress", "editNote", "editNote"];
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
			me.getParentForm().freshSupplierGrid(me.__lastId);
		}
	}
});