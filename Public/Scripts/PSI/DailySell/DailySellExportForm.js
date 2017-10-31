/**
 * 库存条目 - 新建或编辑界面
 */
Ext.define("PSI.DailySell.DailySellExportForm", {
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
							text : "导出",
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
					title : "导出销售信息" ,
					modal : true,
					resizable : true,
					onEsc : Ext.emptyFn,
					width : 300,
					height : 170,
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
						items : [
							{
							fieldLabel : "开始日期",
							allowBlank : false,
							blankText : "请选择预日期",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							name:'date_from',
							id:'date_from',
							xtype:"datefield",
							format:"Y-m-d",
							colspan : 6,
							width:270,
							value:new Date(),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						},{
							fieldLabel : "结束日期",
							allowBlank : false,
							blankText : "请选择预日期",
							beforeLabelTextTpl : PSI.Const.REQUIRED,
							name:'date_to',
							id:'date_to',
							xtype:"datefield",
							format:"Y-m-d",
							colspan : 6,
							width:270,
							value : new Date(),
							listeners : {
								specialkey : {
									fn : me.onEditSpecialKey,
									scope : me
								}
							}
						},
							{
								id : "editDailySellType",
								fieldLabel : "导出类型",
								blankText : "选择导出类型",
								allowBlank : false,
								beforeLabelTextTpl : PSI.Const.REQUIRED,
								valueField : "id",
								labelAlign : "right",
								displayField : "name",
								colspan : 6,
								width:270,
								multiSelect:true,
								xtype : "combo",
								store: new Ext.data.ArrayStore({
									fields : ['id', 'name'],
									data : [["0", '新增已匹配'],["1", '新增未匹配'], ["2", '已确认未编辑'],["3", '待支付'], ["4", '已支付'], ["5", '已冻结']]
								})
							},],
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

				me.__editorList = [];
			},

			onWndShow : function() {
				var me = this;
				var editCode = Ext.getCmp("alarm_amount");
				editCode.focus();
				editCode.setValue(editCode.getValue());
                //
				//var el = me.getEl();
			},

			onOK : function(thenAdd) {
				var date_from = Ext.Date.format(Ext.getCmp("date_from").getValue(), "Y-m-d");
				var date_to = Ext.Date.format(Ext.getCmp("date_to").getValue(), "Y-m-d");
				var types = Ext.JSON.encode(Ext.getCmp("editDailySellType").getValue());
				var url = PSI.Const.BASE_URL + "Home/DailySell/exportDailySell?date_from="+date_from+"&date_to="+date_to+"&types="+types;
				window.open(url);
				me.getParentForm().refreshAllGrid();
				this.close();
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
				Ext.getCmp("alarm_amount").focus();

				var setNull = [Ext.getCmp("alarm_amount"), Ext.getCmp("account_num"),
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
				me.getParentForm().freshStockItemGrid();

			}
		});