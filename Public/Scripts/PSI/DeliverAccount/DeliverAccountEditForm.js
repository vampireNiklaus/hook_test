/**
 * 配送公司账号 - 新建或编辑界面
 */
Ext.define("PSI.DeliverAccount.DeliverAccountEditForm", {
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
			title : entity == null ? "新增账号" : "编辑账号",
			modal : true,
			resizable : true,
			onEsc : Ext.emptyFn,
			width : 300,
			height : 200,
			layout : "fit",
			items : [{
				id : "editForm",
				xtype : "form",
				layout : {
					type : "table",
					columns : 1
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
				items : [{
							xtype : "hidden",
							name : "id",
							value : entity == null ? null : entity.get("id")
						}, {
							id : "deliver_id",
							xtype : "hidden",
							name : "deliver_id",
                    		value : entity == null ? null : entity.get("deliver_id")
                		}, {
							id : "deliver_name",
							fieldLabel : "配送公司",
							editable: false,
							allowBlank : false,
							blankText : "请选择配送公司",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							name : "deliver_name",
							value : entity == null ? null : entity.get("deliver_name"),
							xtype: "psi_deliver_field",
							callbackFunc: me.onSelectDeliver,
							parentCmp: this,
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "url",
							fieldLabel : "网站地址",
							name : "url",
							allowBlank : false,
							blankText : "请输入网站地址",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							value : entity == null ? null : entity.get("url"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "username",
							fieldLabel : "账号",
							name : "username",
                    		allowBlank : false,
                    		blankText : "请输入账号",
                    		beforeLabelTextTpl : PSI.Const.REQUIRED,
							value : entity == null ? null : entity.get("username"),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						}, {
							id : "password",
							fieldLabel : "密码",
							name : "password",
							value : entity == null ? null : entity
								.get("password"),
							listeners : {
                                specialkey: {
                                    fn: me.onEditSpecialKey,
                                    scope: me
                                }
                            }
						}, {
							id : "disabled",
							fieldLabel : "是否禁用",
							name : "disabled",
							xtype      : 'radiogroup',
							defaults: {
								flex: 1
							},
							layout: 'table',
							items: [

								{
									boxLabel  : '启用',
									name      : 'disabled',
									inputValue: '0',
									id        : 'disabled_radio_yes',
									checked : entity === null ? true : entity.get("disabled") == 0
								}, {
									boxLabel  : '禁用',
									name      : 'disabled',
									inputValue: '1',
									id        : 'disabled_radio_no',
									checked : entity === null ? false : entity.get("disabled") == 1,
								}
							],
							value : entity == null ? null : entity
								.get("disabled"),
							listeners : {
								specialkey : {
									fn : me.onEditCodeSpecialKey,
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

		me.__editorList = [ "deliver_id", "deliver_name","url","username","password","disabled"];
	},

	onSelectDeliver: function(scope, data) {
		 Ext.getCmp('deliver_id').setValue(data.deliver_id);
         Ext.getCmp("deliver_name").setValue(data.deliver_name);
	},

	onWndShow : function() {
		// var me = this;
		// if (me.adding) {
		// 	// 新建
		// 	var grid = me.getParentForm().categoryGrid;
		// 	var item = grid.getSelectionModel().getSelection();
		// 	if (item == null || item.length != 1) {
		// 		return;
		// 	}
		// } else {
		// 	// 编辑
		// 	var el = me.getEl();
		// }
        //
		// // var editCode = Ext.getCmp("editCode");
		// // editCode.focus();
		// // editCode.setValue(editCode.getValue());
	},
	// private
	onOK : function(thenAdd) {
		var me = this;
		var f = Ext.getCmp("editForm");
		var el = f.getEl();
		el.mask(PSI.Const.SAVING);
		f.submit({
					url : PSI.Const.BASE_URL + "Home/DeliverAccount/editDeliverAccount",
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
									Ext.getCmp("deliver_name").focus();
								});
					}
				});
		me.getParentForm().freshDeliverAccountGrid();
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
		var me = this;
		Ext.getCmp("deliver_name").focus();
		var editors = me.__editorList;
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
			me.getParentForm().freshDeliverAccountGrid(me.__lastId);
		}
	}
});