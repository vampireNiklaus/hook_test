/**
 * 业务员月销售 - 新建或编辑界面
 */
Ext.define("PSI.BusinessSetting.EmployeeMonthSellAlarmEditForm", {
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
					title : entity == null ? "编辑业务员月销售预警值" : "编辑业务员月销售预警值",
					modal : true,
					resizable : true,
					onEsc : Ext.emptyFn,
					width : 300,
					height : 100,
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
							id : "employee_alarm_month",
							fieldLabel : "预警值",
							allowBlank : false,
							blankText : "请输入预警值",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							name:'employee_alarm_month',
							xtype:"numberfield",
							colspan : 6,
							width:270,
							value : entity == null ? null : entity.get("employee_alarm_month"),
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
				me.__editorList = ["employee_alarm_month"];
			},

			onWndShow : function() {
				var me = this;
				var editCode = Ext.getCmp("employee_alarm_month");
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
							url : PSI.Const.BASE_URL + "Home/BusinessSetting/editEmployeeMonthAlarm",
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
									me.getParentForm().freshEmployeeProfitAssignGrid();
								}
							},
							failure : function(form, action) {
								el.unmask();
								PSI.MsgBox.showInfo(action.result.msg,
										function() {
											Ext.getCmp("employee_alarm_month").focus();
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
				Ext.getCmp("employee_alarm_month").focus();
			},

			onWndClose : function() {
				var me = this;
				me.getParentForm().__lastId = me.__lastId;
				me.getParentForm().freshEmployeeProfitAssignGrid();
			}
		});