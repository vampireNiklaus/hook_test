/**
 * 销售日报表(按业务员汇总)
 */
Ext.define("PSI.YeWuYuan.PaymentInfoForm", {
	extend: "Ext.panel.Panel",

	border: 0,

	layout: "border",

	initComponent: function() {
		var me = this;

		Ext.apply(me, {
			tbar: [{
				text: "关闭",
				iconCls: "PSI-button-exit",
				handler: function() {
					location.replace(PSI.Const.BASE_URL);
				}
			}, {
				xtype: "button",
				text: "导出到excel",
				width: 100,
				margin: "5, 0, 0, 10",
				iconCls: "PSI-button-excelexport",
				//handler : me.onExportGrid2Excel(store,"报表/销售报表/销售总表",me.__mainGrid),
				handler: me.onExportGrid2Excel4Main,
				scope: me
			}],
			items: [{
				region: "north",
				height: 60,
				border: 0,
				title: "查询条件",
				collapsible: true,
				layout: {
					type: "table",
					columns: 4
				},
				items: [{
					id: "editQueryDate",
					xtype: 'monthfield',
					margin: "5, 0, 0, 0",
					format: "Y",
					labelAlign: "right",
					labelSeparator: "",
					width: 200,
					fieldLabel: "选择年份",
					value: new Date()
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
						text: "重置查询条件",
						width: 100,
						margin: "5, 0, 0, 10",
						handler: me.onClearQuery,
						scope: me
					}]
				}]
			}, {
				region: "center",
				layout: "border",
				border: 0,
				items: [{
					region: "center",
					layout: "fit",
					border: 0,
					items: [me.getMainGrid()]
				}]
			}]
		});

		me.callParent(arguments);

		me.store.load();
	},

	getMainGrid: function() {
		var me = this;
		if (me.__mainGrid) {
			return me.__mainGrid;
		}

		var modelName = "PSIYeWuYuanPaymentReport";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "bill_code", 'pay_amount', 'bill_date', 'pay_month', 'note', 'status']
		});
		me.store = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: modelName,
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/YeWuYuan/paymentInfoQueryData",
				reader: {
					root: 'all_data',
					totalProperty: 'totalCount'
				}
			}
		});
		me.store.on("beforeload", function() {
			me.store.proxy.extraParams = me.getQueryParam();
		});

		me.__mainGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			border: 0,
			//forceFit:true,
			autoScroll: true,
			columnLines: true,
			columns: [{
				xtype: "rownumberer",
				width: 40
			}, {
				header: "支付金额",
				dataIndex: "pay_amount",
				menuDisabled: false,
				sortable: true,
				width: 100
			}, {
				header: "支付日期",
				dataIndex: "bill_date",
				menuDisabled: false,
				sortable: true,
				width: 100
			}, {
				header: "单据编号",
				dataIndex: "bill_code",
				menuDisabled: false,
				sortable: false,
				width: 200
			}, {
				header: "支付月份",
				dataIndex: "pay_month",
				menuDisabled: false,
				sortable: true,
				width: 200
			}, {
				header: "是否支付",
				dataIndex: "status",
				menuDisabled: false,
				sortable: true,
				width: 100,
				renderer: function(v) {
					switch (v) {
						case '1':
							return '是';
						default:
							return '否';
					}
				}
			}, {
				header: "备注",
				dataIndex: "note",
				menuDisabled: false,
				sortable: false,
				width: 400
			}],
			store: me.store,
			plugins: [{
				ptype: 'rowexpander',
				rowBodyTpl: [
					'<div id="r_{id}" style="margin: 5px 0 30px 80px">',
					'</div>'
				]
			}],
			tbar: [{
				id: "pagingToobar",
				xtype: "pagingtoolbar",
				border: 0,
				store: me.store
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPage",
				xtype: "combobox",
				editable: false,
				width: 60,
				store: Ext.create("Ext.data.ArrayStore", {
					fields: ["text"],
					data: [
						["20"],
						["50"],
						["100"],
						["300"],
						["1000"]
					]
				}),
				value: 20,
				listeners: {
					change: {
						fn: function() {
							store.pageSize = Ext
								.getCmp("comboCountPerPage")
								.getValue();
							store.currentPage = 1;
							Ext.getCmp("pagingToobar")
								.doRefresh();
						},
						scope: me
					}
				}
			}, {
				xtype: "displayfield",
				value: "条记录"
			}],
			listeners: {
				itemdblclick: {
					fn: me.onShowDetailForm,
					scope: me
				}
			}
		});


		me.__mainGrid.view.on('expandBody', function(rowNode, record, expandRow, eOpts) {
			me.onShowDetailForm(null, record);
			console.log(me.__mainGrid.view);
		});

		// me.__mainGrid.view.on('collapsebody', function(rowNode, record, expandRow, eOpts) {
		// 	me.destroyInnerGrid('r_' + record.get('id'));

		// });
		return me.__mainGrid;
	},


	/**
	 * 编辑业务员
	 */
	onShowDetailForm: function(view, record, item, index, e, eOpts) {
		var me = this;
		// if(me.getPEditEmployee() == "0"){
		//     if (item == null || item.length != 1) {
		//         PSI.MsgBox.showInfo("没有编辑权限");
		//         return;
		//     }
		// }
		// var item = this.employeeGrid.getSelectionModel().getSelection();
		// if (item == null || item.length != 1) {
		//     PSI.MsgBox.showInfo("请选择要编辑的业务员");
		//     return;
		// }
		//
		// var employee = item[0];
		var form = Ext.create("PSI.YeWuYuan.PaymentInfoDetailForm", {
			parentForm: this,
			entity: 'r_' + record.get('id')
		});
		form.show();
	},


	onQuery: function() {
		this.refreshMainGrid();
	},



	onClearQuery: function() {
		var me = this;

		Ext.getCmp("editQueryDate").setValue(new Date().getFullYear());

		me.onQuery();
	},

	getQueryParam: function() {
		var me = this;

		var result = {};

		var dt = Ext.getCmp("editQueryDate").getValue();
		if (dt) {
			result.date = Ext.Date.format(dt, "Y");
		}

		return result;
	},

	refreshMainGrid: function(id) {
		Ext.getCmp("pagingToobar").doRefresh();
	},
	destroyInnerGrid: function(record) {
		var parent = document.getElementById(record);
		var child = parent.firstChild;

		while (child) {
			child.parentNode.removeChild(child);
			child = child.nextSibling;
		}
	},
	displayInnerGrid: function(renderId) {
		var modelName = renderId + '_model';
		Ext.define(modelName, {
			extend: 'Ext.data.Model',
			fields: ["employee_id", "employee_des", "employee_profit", 'pay_sum_money',
				"employee_name", "drug_id", "drug_name", "drug_guige", "drug_manufacture",
				"hospital_id", "hospital_name", "drug2deliver_id", "deliver_id", "deliver_name",
				"batch_num", "sell_amount", "sell_date", "create_time", 'bill_code',
				"creator_id", "note", "if_paid", "pay_time", "paybill_id", "status", "sell_month"
			]
		});
		var store = Ext.create('Ext.data.Store', {
			autoLoad: false,
			model: modelName,
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/BusinessPay/getDailySellById",
				extraParams: {
					'id': renderId
				},
				reader: {
					root: 'all_data',
					totalProperty: 'totalCount'
				}
			}
		});

		var innerGrid = Ext.create('Ext.grid.Panel', {
			store: store,
			forceFit: false,
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				width: 30
			}), {
				header: "业务员身份",
				dataIndex: "employee_des",
				menuDisabled: false,
				sortable: false,
			}, {
				header: "销售月份",
				dataIndex: "sell_month",
				menuDisabled: false,
				sortable: false,
			}, {
				header: "支付金额",
				dataIndex: "pay_sum_money",
				menuDisabled: false,
				sortable: true,
				renderer: function(v) {
					return "<b style='color:blue'>" + v + "</b>";
				}
			}, {
				header: "销售数量",
				dataIndex: "sell_amount",
				menuDisabled: false,
				sortable: true,
				renderer: function(v) {
					return "<b style='color:blue'>" + v + "</b>";
				}
			}, {
				header: "业务日期",
				dataIndex: "sell_date",
				menuDisabled: false,
				sortable: true,
			}, {
				header: "药品",
				dataIndex: "drug_name",
				menuDisabled: false,
				sortable: true,
			}, {
				header: "医院",
				dataIndex: "hospital_name",
				menuDisabled: false,
				sortable: true,
			}],
			columnLines: true,
			renderTo: renderId,
		});
		innerGrid.getEl().swallowEvent([
			'mousedown', 'mouseup', 'click',
			'contextmenu', 'mouseover', 'mouseout',
			'dblclick', 'mousemove'
		]);
		store.load();
	},
	onExportGrid2Excel4Main: function() {
		var me = this;
		var config = {
			store: me.__mainGrid.getStore(),
			title: "销售报表/销售条目"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(me.__mainGrid, config); //调用导出函数
	},
});