/**
 * 商品 - 新建或编辑界面
 */
Ext.define("PSI.Types.TypesEditForm", {
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
							title : entity == null ? "新增资金条目" : "编辑资金条目",
							modal : true,
							resizable : true,
							onEsc : Ext.emptyFn,
							width : 300,
							height : 150,
							layout : "fit",
							items : [{
								id : "editForm",
								xtype : "form",
								layout : {
									type : "table",
									columns : 1
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
									id : "editType",
									fieldLabel : "条目类别",
									allowBlank : false,
									blankText : "没有选择条目类别",
									beforeLabelTextTpl : PSI.Const.REQUIRED,
									name : "type",
									value : entity == null ? null : entity
										.get("type"),
									valueField : "name",
									displayField : "name",
									xtype : "combo",
									store: new Ext.data.ArrayStore({
										fields : ['id', 'name'],
										data : [["1", '收入'], ["2", '支出'],["3", '结算方式']]
									}),
									listeners : {
										specialkey : {
											fn : me.onEditSpecialKey,
											scope : me
										}
									}
								},{
									id : "editName",
									fieldLabel : "条目名称",
									allowBlank : false,
									blankText : "没有输入员工编码",
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

				me.__editorList = ["editType", "editName"];
			},

			onWndShow : function() {
				var me = this;
				var editCode = Ext.getCmp("editType");
				editCode.focus();
				editCode.setValue(editCode.getValue());
				var el = me.getEl();
			},

			onOK : function(thenAdd) {
				var me = this;
				var f = Ext.getCmp("editForm");
				var el = f.getEl();
				el.mask(PSI.Const.SAVING);
				f.submit({
							url : PSI.Const.BASE_URL + "Home/Types/editType",
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
									me.getParentForm().refreshTypesGrid();
								}
							},
							failure : function(form, action) {
								el.unmask();
								PSI.MsgBox.showInfo(action.result.msg,
										function() {
											Ext.getCmp("editType").focus();
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
				Ext.getCmp("editType").focus();

				var editors = [Ext.getCmp("editName")];
				for (var i = 0; i < editors.length; i++) {
					var edit = editors[i];
					edit.setValue(null);
					edit.clearInvalid();
				}
			},

			onWndClose : function() {
				var me = this;
				me.getParentForm().__lastId = me.__lastId;
				me.getParentForm().refreshTypesGrid();
			}
		});