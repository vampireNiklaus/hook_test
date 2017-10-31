/**
 * 直营结算单
 * 
 * @author rcg
 */
Ext.define("PSI.DirectPay.DirectPayEditForm", {
	extend: "Ext.window.Window",

	config: {
		parentForm: null,
		entity: null,
		status: null,
	},
	detailGrid: [],

	/**
	 * 初始化组件
	 */
	initComponent: function() {
		var me = this;
		var entity = me.getEntity();
		var status = Number.parseInt(me.getStatus());
		me.adding = entity == null;
		if (!me.adding)
			me.entity = entity;

		if (status !== 1) {
			var buttons = [];
			buttons.push({
				text: entity == null ? "添加到待付款直营结算单" : '保存修改',
				formBind: true,
				iconCls: "PSI-button-ok",
				handler: function() {
					me.onOk();
				},
				scope: me
			});
			buttons.push({
				text: "关闭",
				handler: function() {
					me.close();
				},
				scope: me
			});
		}

		Ext.apply(me, {
			title: entity == null ? "新增直营结算单" : "编辑直营结算单",
			modal: true,
			resizable: true,
			maximizable: true,
			maximized: true,
			onEsc: Ext.emptyFn,
			width: 1000,
			height: 600,
			layout: "fit",
			items: [{
				id: "importForm",
				xtype: "form",
				layout: "border",
				items: [{
					region: "north",
					height: 60,
					border: 0,
					hidden: entity == null ? false : true,
					title: "查询条件",
					collapsible: true,
					layout: {
						type: "table",
						columns: 6
					},
					//获取查询栏
					items: me.getQueryCmp()
				}, {
					region: 'center',
					layout: "border",
					xtype: "container",
					border: 0,
					height: 600,
					items: [{
						region: "center",
						height: 400,
						border: 0,
						layout: "border",
						items: [{
							xtype: "panel",
							region: "center",
							border: 0,
							layout: "fit",
							items: me.getDailySellSubGrid()
						}, {
							region: "west",
							width: 500,
							hidden: entity == null ? false : true,
							xtype: "panel",
							split: true,
							border: 0,
							layout: "fit",
							items: me.getDailySellGrid()
						}]
					}, {
						region: 'north',
						layout: {
							type: "table",
							columns: 4
						},
						height: 100,
						hidden: status === 1,
						border: 0,
						title: "选择付款账户",
						items: me.adding == true ? [{
							fieldLabel: "业务员",
							labelWidth: 60,
							labelSeparator: "：",
							labelAlign: "right",
							xtype: 'displayfield',
							margin: '5px',
							value: entity == null ? "" : entity.get('employee_name'),
							renderer: function(v) {
								return "<b style='color:blue;font-size:25px;'>" + v + "</b>"
							},
							hidden: entity == null ? true : false
						}, {
							fieldLabel: "所支付月份",
							labelSeparator: "：",
							labelAlign: "right",
							xtype: 'displayfield',
							margin: '5px',
							value: entity == null ? "" : entity.get('pay_month'),
							renderer: function(v) {
								return "<span style='color:blue;font-size:20px;'>" + v + "</span>"
							},
							hidden: entity == null ? true : false
						}, {
							id: "editQueryBankAccount",
							labelWidth: 80,
							labelAlign: "right",
							labelSeparator: "：",
							fieldLabel: "付款账户",
							margin: "5, 0, 0, 0",
							allowBlank: false,
							//width:300,
							xtype: "psi_bank_account_field",
							value: entity == null ? "" : entity.get('pay_account_name') + "，" + "卡号：" + entity.get('pay_account_num'),
							listeners: {
								change: function() {

								}
							},

						}, {
							id: "editQueryBillDate",
							labelWidth: 80,
							labelAlign: "right",
							labelSeparator: "：",
							fieldLabel: "支付日期",
							margin: "5, 0, 0, 0",
							allowBlank: false,
							//width:300,
							xtype: "datefield",
							format: "Y-m-d",
							value: entity == null ? "" : entity.get('bill_date'),
							listeners: {
								change: function() {}
							}
						}, {
							id: "editQueryPayBillDate",
							labelWidth: 80,
							labelAlign: "right",
							labelSeparator: "：",
							fieldLabel: "支付月份",
							margin: "5, 0, 0, 0",
							allowBlank: false,
							//width:300,
							xtype: "monthfield",
							format: "Y-m",
							value: entity == null ? new Date() : entity.get('pay_month'),
							listeners: {
								change: function() {}
							}
						}] : [{
							fieldLabel: "业务员",
							labelWidth: 60,
							labelSeparator: "：",
							labelAlign: "right",
							xtype: 'displayfield',
							margin: '5px',
							value: entity == null ? "" : entity.get('employee_name'),
							renderer: function(v) {
								return "<b style='color:blue;font-size:25px;'>" + v + "</b>"
							},
							hidden: entity == null ? true : false
						}, {
							id: "editQueryPayBillDate",
							labelWidth: 80,
							labelAlign: "right",
							labelSeparator: "：",
							fieldLabel: "支付月份",
							margin: "5, 0, 0, 0",
							allowBlank: false,
							//width:300,
							xtype: "monthfield",
							format: "Y-m",
							value: entity == null ? new Date() : entity.get('pay_month'),
							listeners: {
								change: function() {}
							}
						}, {
							id: "editQueryBankAccount",
							labelWidth: 80,
							labelAlign: "right",
							labelSeparator: "：",
							fieldLabel: "付款账户",
							margin: "5, 0, 0, 0",
							allowBlank: false,
							//width:300,
							xtype: "psi_bank_account_field",
							value: entity == null ? "" : entity.get('pay_account_name') + "，" + "卡号：" + entity.get('pay_account_num'),
							listeners: {
								change: function() {

								}
							},

						}, {
							id: "editQueryBillDate",
							labelWidth: 80,
							labelAlign: "right",
							labelSeparator: "：",
							fieldLabel: "支付日期",
							margin: "5, 0, 0, 0",
							allowBlank: false,
							//width:300,
							xtype: "datefield",
							format: "Y-m-d",
							value: entity == null ? "" : entity.get('bill_date'),
							listeners: {
								change: function() {}
							}
						}, {
							id: "reEditQuerySearchDateFrom",
							labelWidth: 120,
							labelAlign: "right",
							labelSeparator: "：",
							fieldLabel: "业务日期范围（起）",
							margin: "5, 0, 0, 0",
							allowBlank: false,
							width: 300,
							xtype: "datefield",
							format: "Y-m-d",
							value: new Date(2017, 0, 1),
							listeners: {
								change: function() {

								}
							}
						}, {
							id: "reEditQuerySearchDateTo",
							labelWidth: 120,
							labelAlign: "right",
							labelSeparator: "：",
							fieldLabel: "业务日期范围（止）",
							margin: "5, 0, 0, 0",
							allowBlank: false,
							width: 300,
							xtype: "datefield",
							format: "Y-m-d",
							value: new Date(),
							listeners: {
								change: function() {

								}
							}
						}, {
							xtype: "button",
							text: "查询",
							width: 100,
							margin: "5 0 0 10",
							iconCls: "PSI-button-refresh",
							handler: me.onQuery4Edit,
							scope: me
						}]
					}]
				}]
			}],
			buttons: buttons,
			listeners: {
				// show : {
				// 	fn : me.onWndShow,
				// 	scope : me
				// },
				close: {
					fn: function() {
						me.getParentForm().freshDirectPayGrid();
					},
					scope: me
				}
			}
		});

		me.callParent(arguments);
		me.refreshDailySellGrid(1);

		if (!me.adding && status !== 1)
			Ext.getCmp('editQueryBankAccount').setIdValue(me.entity.get('pay_account_id'));
	},

	onEditSpecialKey: function(field, e) {
		// if (e.getKey() === e.ENTER) {
		// 	var me = this;
		// 	var id = field.getId();
		// 	for (var i = 0; i < me.__editorList.length; i++) {
		// 		var editorId = me.__editorList[i];
		// 		if (id === editorId) {
		// 			var edit = Ext.getCmp(me.__editorList[i + 1]);
		// 			edit.focus();
		// 			edit.setValue(edit.getValue());
		// 		}
		// 	}
		// }
	},

	getQueryCmp: function() {
		var me = this;
		return [{
			id: "editQueryEmployee",
			labelWidth: 60,
			labelAlign: "right",
			labelSeparator: "",
			fieldLabel: "业务员",
			margin: "5, 0, 0, 0",
			xtype: "psi_employeefield",
			listeners: {
				change: function() {

				}
			}
		}, {
			id: "editQueryDate",
			xtype: 'monthfield',
			fieldLabel: '业务日期',
			editable: false,
			margin: "5, 0, 0, 0",
			labelWidth: 60,
			labelAlign: 'right',
			format: 'Y-m',
			value: new Date()
		}, {
			id: "editQuerySearchDateFrom",
			labelWidth: 120,
			labelAlign: "right",
			labelSeparator: "：",
			fieldLabel: "业务日期范围（起）",
			margin: "5, 0, 0, 0",
			allowBlank: false,
			width: 300,
			xtype: "datefield",
			format: "Y-m-d",
			value: new Date(),
			listeners: {
				change: function() {

				}
			}
		}, {
			id: "editQuerySearchDateTo",
			labelWidth: 120,
			labelAlign: "right",
			labelSeparator: "：",
			fieldLabel: "业务日期范围（止）",
			margin: "5, 0, 0, 0",
			allowBlank: false,
			width: 300,
			xtype: "datefield",
			format: "Y-m-d",
			value: new Date(),
			listeners: {
				change: function() {

				}
			}
		}, {
			xtype: "container",
			items: [{
				xtype: "button",
				text: "查询",
				width: 100,
				margin: "5 0 0 10",
				iconCls: "PSI-button-refresh",
				handler: me.onQuery,
				scope: me
			}, {
				xtype: "button",
				text: "清空查询条件",
				width: 100,
				margin: "5, 0, 0, 10",
				handler: me.onClearQuery,
				scope: me
			}]
		}];
	},

	//获取销售信息列表
	getDailySellGrid: function() {
		var me = this;
		if (me.dailySellGrid) {
			return me.dailySellGrid;
		}
		var entity = me.getEntity();
		if (entity != null) return;
		var modelName = "PSIDailySell";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["employee_id", 'pay_sum_money', "employee_name",
				'before_3m_money', 'after_3m_money', 'now_date'
			]
		});
		var store = Ext.create("Ext.data.Store", {
			autoLoad: true,
			model: modelName,
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/DailySell/getEmployeeList4AddBusinessPayItem",
				reader: {
					root: 'dailySellList',
					totalProperty: 'totalCount'
				}
			}
		});
		store.on("beforeload", function() {
			store.proxy.extraParams = me.getQueryParam();
		});
		store.on("load", function(e, records, successful) {
			if (successful) {
				me.dailySellGrid.getSelectionModel().select(0);
			}
		});
		me.dailySellGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			features: [{
				ftype: 'summary'
			}],
			border: 0,
			title: "业务员列表",
			// forceFit : true,
			columnLines: true,
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				width: 40
			}), {
				header: "业务员",
				dataIndex: "employee_name",
				menuDisabled: false,
				sortable: true,
			}, {
				header: "未支付金额",
				dataIndex: "pay_sum_money",
				menuDisabled: false,
				renderer: function(value) {
					if (value != null)
						return "<b>" + value + "</b>";
				},
				xtype: 'numbercolumn',
				format: '0.00',
				summaryType: 'sum',
			}, {
				header: "当前选定月份",
				dataIndex: "now_date",
				menuDisabled: false,
			}, {
				header: "前3月未支付",
				menuDisabled: false,
				dataIndex: "before_3m_money",
				//renderer:function(value){
				//	if(value!=null)
				//		return "<b>"+value+"</b>";
				//}
				summaryType: 'sum',
				xtype: 'numbercolumn',
				format: '0.00',
			}, {
				header: "后3月未支付",
				menuDisabled: false,
				dataIndex: "after_3m_money",
				renderer: function(value) {
					if (value != null)
						return "<b>" + value + "</b>";
				},
				summaryType: 'sum',
				xtype: 'numbercolumn',
				format: '0.00',

			}],
			store: store,
			listeners: {
				itemdblclick: {
					fn: function() {
						return false;
					},
					scope: me
				},
				select: {
					fn: me.onDailySellGridSelect,
					scope: me
				},
			}
		});
		return me.dailySellGrid;
	},

	//获取销售信息列表
	getDailySellSubGrid: function() {
		var me = this;
		if (me.dailySellSubGrid) {
			return me.dailySellSubGrid;
		}
		me.deselectArr = [];
		var modelName = "PSIDailySell";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["employee_id", "employee_des", "employee_profit", 'pay_sum_money',
				"employee_name", "drug_id", "drug_name", "drug_guige", "drug_manufacture",
				"hospital_id", "hospital_name", "drug2deliver_id", "deliver_id", "deliver_name",
				"batch_num", "sell_amount", "sell_date", "create_time", 'bill_code', 'now_date', 'sell_id_list',
				"creator_id", "note", "if_paid", "pay_time", "paybill_id", "status", 'employee_profit', 'sell_amount',
				'before_3m_money', 'after_3m_money', 'next_amount', 'next_money', 'sell_month'
			]
		});
		var url = me.adding ? "Home/DailySell/getDailySellDetail" : "Home/DailySell/getEditDailySellDetail";
		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 0, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			checkOnly: true, //如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false,
			// renderer:function(){
			//
			// }
		});
		var store = Ext.create("Ext.data.Store", {
			autoLoad: true,
			model: modelName,
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + url,
				reader: {
					root: 'dailySellList',
					totalProperty: 'totalCount'
				}
			}
		});
		store.on("beforeload", function() {
			if (me.adding) //新建
				store.proxy.extraParams = me.getParentSelectParam();
			else {
				store.proxy.extraParams = me.getParentSelectParam4Edit();
			}
		});
		store.on("load", function(e, records, successful) {
			if (successful) {
				sm.selectAll();
				for (var i in records) {
					if (records[i].get('paybill_id') == '0') {
						sm.deselect(records[i]);
					}
				}
			}
		});


		me.dailySellSubGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			border: 0,
			deferRowRender: false,
			title: "销售信息列表",
			selModel: sm,
			columnLines: true,
			features: [{
				ftype: 'summary'
			}],
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				width: 30
			}), {
				header: "单据状态",
				dataIndex: "status",
				renderer: function(v) {
					switch (v) {
						case '2':
							return "<span style='color:red'>未匹配</span>";
							break;
						case '3':
							return "<span style='color:green'>已匹配</span>";
							break;
					}
				}
			}, {
				header: "月份",
				dataIndex: "sell_month",
				menuDisabled: false,
				sortable: false,
			}, {
				header: "业务员",
				dataIndex: "employee_name",
				menuDisabled: false,
				sortable: false,
			}, {
				header: "业务员身份",
				dataIndex: "employee_des",
				menuDisabled: false,
				sortable: false,
			}, {
				header: "药品名",
				dataIndex: "drug_name",
			}, {
				header: "厂家",
				dataIndex: "drug_manufacture",
			}, {
				header: "药品规格",
				dataIndex: "drug_guige",
			}, {
				header: "医院",
				dataIndex: "hospital_name",
			}, {
				header: "对应提成单价",
				dataIndex: "employee_profit",
			}, {
				header: "付款月销量",
				dataIndex: "sell_amount",
				summaryType: function(records) {
					var gridSum = 0;
					for (var i = 0; i < records.length; i++) {
						var item = records[i].get('sell_amount');
						var itemPrice = (Number.parseFloat(item) || 0);
						gridSum += itemPrice;
					}
					return gridSum.toFixed(0);
				},

			}, {
				header: "付款月支付金额",
				dataIndex: "pay_sum_money",
				renderer: function(v) {
					return "<b style='color:blue'>" + v + "</b>";
				},
				summaryType: function(records) {
					var gridSum = 0;
					for (var i = 0; i < records.length; i++) {
						var item = records[i].get('pay_sum_money');
						var itemPrice = (Number.parseFloat(item) || 0);
						gridSum += itemPrice;
					}
					return gridSum.toFixed(2);
				},
				xtype: 'numbercolumn',
				format: '0.00',
			}, {
				header: "前3月金额",
				menuDisabled: false,
				dataIndex: "before_3m_money",
				summaryType: function(records) {
					var gridSum = 0;
					for (var i = 0; i < records.length; i++) {
						var item = records[i].get('before_3m_money');
						var itemPrice = (Number.parseFloat(item) || 0);
						gridSum += itemPrice;
					}
					return gridSum.toFixed(2);
				},
				xtype: 'numbercolumn',
				format: '0.00',

			}, {
				header: "后3月金额",
				menuDisabled: false,
				dataIndex: "after_3m_money",
				summaryType: function(records) {
					var gridSum = 0;
					for (var i = 0; i < records.length; i++) {
						var item = records[i].get('after_3m_money');
						var itemPrice = (Number.parseFloat(item) || 0);
						gridSum += itemPrice;
					}
					return gridSum.toFixed(2);
				},
				xtype: 'numbercolumn',
				format: '0.00',
			}, {
				header: "下月销量",
				menuDisabled: false,
				dataIndex: "next_amount",
				summaryType: function(records) {
					var gridSum = 0;
					for (var i = 0; i < records.length; i++) {
						var item = records[i].get('next_amount');
						var itemPrice = (Number.parseFloat(item) || 0);
						gridSum += itemPrice;
					}
					return gridSum.toFixed(2);
				},
			}, {
				header: "下月金额",
				menuDisabled: false,
				dataIndex: "next_money",
				summaryType: function(records) {
					var gridSum = 0;
					for (var i = 0; i < records.length; i++) {
						var item = records[i].get('next_money');
						var itemPrice = (Number.parseFloat(item) || 0);
						gridSum += itemPrice;
					}
					return gridSum.toFixed(2);
				},
				xtype: 'numbercolumn',
				format: '0.00',
			}],
			store: store,
			listeners: {
				itemdblclick: {
					fn: function() {
						return false;
					},
					scope: me
				}
			},
		});

		if (!me.adding)
			store.load();

		return me.dailySellSubGrid;
	},

	onDailySellGridSelect: function() {
		var me = this;
		var grid = me.dailySellSubGrid;
		var item = me.dailySellGrid.getSelectionModel().getSelection();
		var store = grid.getStore();
		store.load();
	},

	//刷新销售信息列表
	refreshDailySellGrid: function(currentPage) {
		var me = this;
		var grid = me.dailySellGrid;
		if (!me.adding) return;
		var store = grid.getStore();
		if (currentPage)
			store.currentPage = currentPage;
		//store.removeAll();
		store.load();
	},

	//获取查询的字段
	getQueryParam: function() {
		var me = this;

		var result = {};
		var entity = me.getEntity();

		var employee_id = Ext.getCmp("editQueryEmployee").getIdValue();
		if (employee_id) {
			result.employee_id = employee_id;
		}

		var date = Ext.getCmp("editQueryDate").getValue();
		if (date) {
			result.date = Ext.Date.format(date, "Y-m");
		}
		var search_date_from = Ext.getCmp('editQuerySearchDateFrom').getValue();
		if (search_date_from) {
			result.search_date_from = Ext.Date.format(search_date_from, "Y-m-d");
		}
		var search_date_to = Ext.getCmp('editQuerySearchDateTo').getValue();
		if (search_date_to) {
			result.search_date_to = Ext.Date.format(search_date_to, "Y-m-d");
		}
		result.edit_id = me.adding ? null : {
			'edit_id': entity.get('id')
		};
		return result;
	},

	onOk: function() {
		var me = this;
		var params = {};
		//判断能否提交
		var account = Ext.getCmp('editQueryBankAccount').getIdValue();
		if (account == null || account == '') {
			PSI.MsgBox.showInfo("请先选择付款账号");
			return;
		}

		var bill_date = Ext.getCmp('editQueryBillDate').getValue();
		if (bill_date == null || bill_date == '') {
			PSI.MsgBox.showInfo("请先选择支付日期");
			return;
		}

		var pay_month = Ext.getCmp('editQueryPayBillDate').getValue();
		if (pay_month == null || pay_month == '') {
			PSI.MsgBox.showInfo("请先选择支付月份");
			return;
		}
		if (account != null && account != '' && bill_date != null && bill_date != '' && pay_month != null && pay_month != '') {
			params = me.getSelectSell(); //object
			params.account_id = account;
			params.bill_date = bill_date;
			params.pay_month = Ext.Date.format(pay_month, "Y-m");
			params.edit_id = me.adding ? null : {
				'edit_id': me.entity.get('id')
			};
			if (params.select_0) { //存在被选择的条目
				var f = Ext.getCmp("importForm");
				var el = f.getEl();
				el.mask('正在添加...');
				f.submit({
					url: PSI.Const.BASE_URL + "Home/DirectPay/editDirectPay",
					method: "POST",
					params: params,
					success: function(form, action) {
						PSI.MsgBox.tip("操作成功");
                        el.unmask();
                        if (me.adding) {
                            me.focus();
                            me.refreshDailySellGrid();
                        } else {
                            me.getParentForm().freshDirectPayGrid;
                            me.close();
                        }
					},
					failure: function(form, action) {
						el.unmask();
						PSI.MsgBox.tip('添加失败');
					}
				});
			} else {
				PSI.MsgBox.showInfo('请选择支付条目！');
			}
		}
		if (!account) {
			Ext.getCmp('editQueryBankAccount').setActiveErrors('请选择付款账户');
		}
		if (!bill_date) {
			Ext.getCmp('editQueryBillDate').setActiveErrors('请选择支付日期');
		}
	},


	//搜索查询
	onQuery: function() {
		var me = this;
		var grid = me.dailySellGrid;
		var params = me.getQueryParam();
		var store = grid.getStore();
		store.load();
	},

	//搜索查询
	onQuery4Edit: function() {
		var me = this;
		var grid = me.dailySellSubGrid;
		var store = grid.getStore();
		store.removeAll();
		store.load();
	},

	//清空查询条件
	onClearQuery: function() {
		Ext.getCmp("editQueryDate").setValue(new Date());
		Ext.getCmp("editQueryEmployee").setValue(null);
		Ext.getCmp("editQueryEmployee").setIdValue(null);
		this.onQuery();
	},

	//获取被选中的单子id作为参数返回
	getParentSelectParam: function() {
		var me = this;
		var search_date_from = Ext.getCmp('editQuerySearchDateFrom').getValue();
		if (!search_date_from) {
			PSI.MsgBox.showInfo("没有选择搜索开始日期");
			return;
		}
		var search_date_to = Ext.getCmp('editQuerySearchDateTo').getValue();
		if (!search_date_to) {
			PSI.MsgBox.showInfo("没有选择搜索结束日期");
			return;
		}

		if (me.adding) {
			var item = me.dailySellGrid.getSelectionModel().getSelection();
			return {
				'id': item[0].get('employee_id'),
				'date': item[0].get('now_date'),
				'search_date_from': Ext.Date.format(search_date_from, "Y-m-d"),
				'search_date_to': Ext.Date.format(search_date_to, "Y-m-d")
			};
		}
	},
	getParentSelectParam4Edit: function() {
		var me = this;
		if (Ext.getCmp('reEditQuerySearchDateFrom')) {
			var search_date_from = Ext.getCmp('reEditQuerySearchDateFrom').getValue();
			if (!search_date_from) {
				PSI.MsgBox.showInfo("没有选择搜索开始日期");
				return;
			}
		} else {
			search_date_from = new Date();
		}
		if (Ext.getCmp('reEditQuerySearchDateTo')) {
			var search_date_to = Ext.getCmp('reEditQuerySearchDateTo').getValue();
			if (!search_date_to) {
				PSI.MsgBox.showInfo("没有选择搜索结束日期");
				return;
			}
		} else {
			search_date_to = new Date();
		}
		return {
			'edit_id': me.entity.get('id'),
			'search_date_from': Ext.Date.format(search_date_from, "Y-m-d"),
			'search_date_to': Ext.Date.format(search_date_to, "Y-m-d")
		};
	},

	//获取选中的
	getSelectSell: function() {
		var me = this;
		var result = [];
		var grid = me.dailySellSubGrid;
		var selects = grid.getSelectionModel().getSelection();

		//遍历获取id，塞进数组
		for (var i in selects) {
			result['select_' + i] = {
				'sell_id_list': selects[i].get('sell_id_list'),
			};
		}
		return result;
	}
});