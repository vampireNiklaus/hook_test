/**
 * 商品 - 新建或编辑界面
 */
Ext.define("PSI.Employee.EmployeeEditForm", {
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


				Ext.apply(me, {
							title : entity == null ? "新增业务员" : "编辑业务员",
							modal : true,
							resizable : true,
							onEsc : Ext.emptyFn,
							width : 500,
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
									labelWidth : 80,
									labelAlign : "right",
									labelSeparator : "",
									msgTarget : 'side'
								},
								items : [{
									xtype : "hidden",
									name : "id",
									value : entity == null ? null : entity
											.get("id")
								},{
									id : "emName",
									fieldLabel : "员工姓名",
									allowBlank : false,
									blankText : "没有输入员工姓名",
									beforeLabelTextTpl : PSI.Const.REQUIRED,
									name : "name",
									value : entity == null ? null : entity
										.get("name"),
									listeners : {
										specialkey : {
											fn : me.onEditSpecialKey,
											scope : me
										}
									}
								},{
									id : "emCode",
									fieldLabel : "员工编码",
									allowBlank : false,
									blankText : "没有输入员工编码",
									beforeLabelTextTpl : PSI.Const.REQUIRED,
									name : "code",
									value : entity == null ? null : entity
											.get("code"),
									listeners : {
										specialkey : {
											fn : me.onEditSpecialKey,
											scope : me
										}
									}
								}, {
									id : "bankAccount",
									fieldLabel : "银行账号",
									colspan : 2,
									width : 470,
									allowBlank : true,
									name : "bank_account",
									value : entity == null ? null : entity
											.get("bank_account"),
									listeners : {
										specialkey : {
											fn : me.onEditSpecialKey,
											scope : me
										}
									}
								},{
									id : "emPhone",
									fieldLabel : "员工电话",
									allowBlank : true,
									name : "phone",
									value : entity == null ? null : entity
										.get("phone"),
									listeners : {
										specialkey : {
											fn : me.onEditSpecialKey,
											scope : me
										}
									}
								}, {
									id : "emQQ",
									fieldLabel : "员工QQ",
									allowBlank : true,
									name : "qq",
									value : entity == null ? null : entity
										.get("qq"),
									listeners : {
										specialkey : {
											fn : me.onEditSpecialKey,
											scope : me
										}
									}
								},  {
									id : "emEmail",
									fieldLabel : "员工Email",
									colspan : 2,
									width : 470,
									allowBlank : true,
									name : "email",
									value : entity == null ? null : entity
										.get("email"),
									listeners : {
										specialkey : {
											fn : me.onEditSpecialKey,
											scope : me
										}
									}
								}, {
									xtype:"hidden",
									name : "pym",
									value : entity == null ? null : entity
										.get("pym"),
								},{
									id : "emAddress",
									fieldLabel : "通讯地址",
									colspan : 2,
									width : 470,
									allowBlank : true,
									name : "address",
									value : entity == null ? null : entity
										.get("address"),
									listeners : {
										specialkey : {
											fn : me.onEditSpecialKey,
											scope : me
										}
									}
								},{
									id : "emNote",
									fieldLabel : "备注",
									colspan : 2,
									width : 470,
									allowBlank :true,
									name : "note",
									value : entity == null ? null : entity
										.get("note"),
									listeners : {
										specialkey : {
											fn : me.onEditSpecialKey,
											scope : me
										}
									}
								},{
									id : "is_employee",
									fieldLabel : "是否是业务员",
									name : "is_employee",
									colspan : 2,
									width : 470,
									xtype      : 'radiogroup',
									defaults: {
										flex: 1
									},
									layout: 'hbox',
									items: [

										{
											boxLabel  : '是',
											name      : 'is_employee',
											inputValue: '1',
											id        : 'is_employee_radio_yes',
											checked : entity === null ? true : entity.get("is_employee") == 1
										}, {
											boxLabel  : '否',
											name      : 'is_employee',
											inputValue: '0',
											id        : 'is_employee_radio_no',
											checked : entity === null ? false : entity.get("is_employee") == 0,
										}
									],
									value : entity == null ? null : entity
										.get("is_employee"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										}
									}
								}, {
									id : "is_off_job",
									fieldLabel : "是否离职",
									name : "is_off_job",
									xtype      : 'radiogroup',
									colspan : 2,
									width : 470,
									defaults: {
										flex: 1
									},
									layout: 'hbox',
									items: [

										{
											boxLabel  : '是',
											name      : 'is_off_job',
											inputValue: '1',
											id        : 'is_off_job_radio_yes',
											checked : entity === null ? true : entity.get("is_off_job") == 1
										}, {
											boxLabel  : '否',
											name      : 'is_off_job',
											inputValue: '0',
											id        : 'is_off_job_radio_no',
											checked : entity === null ? false : entity.get("is_off_job") == 0,
										}
									],
									value : entity == null ? null : entity
										.get("is_off_job"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										}
									}
								},{
									id : "clientUserName",
									fieldLabel : "登录账号",
									colspan : 2,
									width : 470,
									allowBlank : true,
									name : "client_user_name",
									value : entity == null ? null : entity
										.get("client_user_name"),
									listeners : {
										specialkey : {
											fn : me.onEditSpecialKey,
											scope : me
										}
									}
								},{
									id : "clientPassword",
									fieldLabel : "客户端密码",
									colspan : 2,
									width : 470,
									allowBlank : true,
									name : "client_password",
									value : entity == null ? null : entity
										.get("client_password"),
									listeners : {
										specialkey : {
											fn : me.onEditSpecialKey,
											scope : me
										}
									}
								},{
									id : "login_enable",
									fieldLabel : "客户端是否可以登录",
									name : "login_enable",
									xtype      : 'radiogroup',
									colspan : 2,
									width : 470,
									defaults: {
										flex: 1
									},
									layout: 'hbox',
									items: [

										{
											boxLabel  : '是',
											name      : 'login_enable',
											inputValue: '1',
											id        : 'login_enable_radio_yes',
											checked : entity === null ? true : entity.get("login_enable") == 1
										}, {
											boxLabel  : '否',
											name      : 'login_enable',
											inputValue: '0',
											id        : 'login_enable_radio_no',
											checked : entity === null ? false : entity.get("login_enable") == 0,
										}
									],
									value : entity == null ? null : entity
										.get("login_enable"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										}
									}
								}
									],
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
						"emPhone", "emQQ", "emEmail",
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
							url : PSI.Const.BASE_URL + "Home/Employee/editEmployee",
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
									me.getParentForm().refreshEmployeeGrid();
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
				Ext.getCmp("emCode").focus();

				var editors = [Ext.getCmp("emName"), Ext.getCmp("emCode"),
						Ext.getCmp("bankAccount"), Ext.getCmp("emPhone"),
						Ext.getCmp("emQQ"),Ext.getCmp("emEmail"),
					 Ext.getCmp("emAddress"),
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
				me.getParentForm().refreshEmployeeGrid();
			}
		});