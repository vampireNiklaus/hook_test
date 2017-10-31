/**
 * 银行账户 - 新建或编辑界面
 */
Ext.define("PSI.BankDeposit.BankAccountEditForm", {
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
					title : entity == null ? "新增银行账户" : "编辑银行账户",
					modal : true,
					resizable : true,
					onEsc : Ext.emptyFn,
					width : 600,
					height : 300,
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
							msgTarget : 'side'
						},
						items : [{
							xtype : "hidden",
							name : "id",
							value : entity == null ? null : entity.get("id")
						},{
							id : "account_name",
							fieldLabel : "账户名称",
							allowBlank : false,
							blankText : "请输入账户名称",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							name:'account_name',
							colspan : 6,
							width:550,
							value : entity == null ? null : entity.get("account_name"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "account_num",
							fieldLabel : "银行账号",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							blankText : '请输入银行账号',
							allowBlank : false,
							colspan : 6,
							width:550,
							name:"account_num",
							value : entity == null ? null : entity.get("account_num"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						},  {
							id : "bank_name",
							fieldLabel : "所在银行",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							blankText : '请输入所在银行',
							allowBlank : false,
							colspan : 6,
							width:250,
							name:"bank_name",
							value : entity == null ? null : entity.get("bank_name"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						},{
							id : "init_money",
							fieldLabel : "初始余额",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							value : entity == null ? '0.00' : entity.get("init_money"),
							colspan : 6,
							width:250,
							name:"init_money",
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						},{
							id : "now_money",
							fieldLabel : "当前余额",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							value : entity == null ? '0.00' : entity.get("now_money"),
							colspan : 6,
							width:250,
							name:"now_money",
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						},{
							id:'is_cash',
							name:"is_cash",
							xtype : "radiogroup",
							fieldLabel:"现金账户",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							colspan : 6,
							columns : 2,
							items : [{
								boxLabel : "是 ",
								name : "is_cash",
								id:"is_cash_1",
								inputValue : "1",
								width:50,
								checked : entity === null ? true : entity.get("is_cash") == 1
							}, {
								boxLabel : "否 ",
								name : "is_cash",
								width:100,
								inputValue : "0",
								checked : entity === null ? false : entity.get("is_cash") == 0
							}],
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						},{
							id:'disabled',
							name:"disabled",
							xtype : "radiogroup",
							fieldLabel:"停用",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							colspan : 6,
							columns : 2,
							items : [{
								boxLabel : "是 ",
								name : "disabled",
								width:50,
								inputValue : "1",
								checked : entity === null ? false : entity.get("disabled") == 1
							}, {
								boxLabel : "否 ",
								name : "disabled",
								id:"disabled_no",
								width:100,
								inputValue : "0",
								checked : entity === null ? true : entity.get("disabled") == 0
							}],
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

				me.__editorList = ["account_name","account_num","bank_name","init_money",
					"now_money","is_cash","disabled"];
			},

			onWndShow : function() {
				var me = this;
				var editCode = Ext.getCmp("account_name");
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
							url : PSI.Const.BASE_URL + "Home/BankDeposit/editBankAccount",
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
									me.getParentForm().freshBankAccountGrid();
								}
							},
							failure : function(form, action) {
								el.unmask();
								PSI.MsgBox.showInfo(action.result.msg,
										function() {
											Ext.getCmp("account_name").focus();
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
				Ext.getCmp("account_name").focus();

				var setNull = [Ext.getCmp("account_name"), Ext.getCmp("account_num"),
						Ext.getCmp("bank_name")];
				var setNum=[Ext.getCmp("init_money"), Ext.getCmp("now_money")];
				for (var i = 0; i < setNull.length; i++) {
					var edit = setNull[i];
					edit.setValue(null);
					edit.clearInvalid();
				}
				for (var i = 0; i < setNum.length; i++) {
					var edit = setNum[i];
					edit.setValue('0.00');
					edit.clearInvalid();
				}
				Ext.getCmp("is_cash_1").setValue(true);
				Ext.getCmp("disabled_no").setValue(true);
			},

			onWndClose : function() {
				var me = this;
				me.getParentForm().__lastId = me.__lastId;
				me.getParentForm().freshBankAccountGrid();

			}
		});