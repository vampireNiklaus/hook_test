/**
 * 销售报表
 */
var summaryFilters = ['pay_amount', '01_month', '02_month', '03_month', '04_month', '05_month', '06_month', '07_month', '08_month', '09_month', '10_month', '11_month', '12_month'];
var records = {}
Ext.define("PSI.Report.EmployeeReportMainForm", {
	extend: "Ext.panel.Panel",
	border: 0,
	layout: "border",
	config: {
		pViewReportEmployeeByMonth: null,
		pViewReportEmployeePayment: null
	},
	initComponent: function() {
		var me = this;

		Ext.apply(me, {
			items: [{
				region: "center",
				layout: "border",
				border: 0,
				split: true,
				xtype: "tabpanel",
				items: [
					me.getPViewReportEmployeeByMonth() == "0" ? null : me.getMainGrid(),
					me.getPViewReportEmployeePayment() == "0" ? null : me.getEmployeePayDetailGrid()
				]
			}]
		});

		me.callParent(arguments);
	},

	getMainGrid: function() {
		var me = this;
		if (me.__mainGrid) {
			return me.__mainGrid;
		}

		var modelName = "PSIYeWuYuanSellReport";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "employee_name", "employee_des", "employee_profit", "drug_name", "drug_guige", "drug_manufacture",
				"hospital_name", "01_month", "02_month", "03_month", "04_month",
				"05_month", "06_month", "07_month", "08_month", "09_month", "10_month",
				"11_month", "12_month", "employee_alarm_month"
			]
		});
		var store = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: modelName,
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Report/sellReportQueryData",
				reader: {
					root: 'all_data',
					totalProperty: 'totalCount'
				}
			}
		});

		store.on("beforeload", function() {
			store.proxy.extraParams = me.getQueryParam();
		});
		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 1, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
		});

		var rendererFunction = function(value, cellmeta, record, rowIndex, columnIndex, store, view) {
			var alarm = record && record.get('employee_alarm_month');
			if (alarm && value < alarm) {
				cellmeta.style = 'background-color:red'
					// return ('<div style="color:red">' + value + '</div>');
			}
			return value
		}

		me.__mainGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			//forceFit:true,
			autoScroll: true,
			selModel: sm,
			features: [{
				ftype: 'summary',
				dock: 'bottom'
			}],
			title: "业务员月销售报表",
			border: 0,
			columnLines: true,
			columns: [{
				xtype: "rownumberer",
				width: 40
			}, {
				header: "业务员",
				dataIndex: "employee_name",
				menuDisabled: false,
				sortable: true,
				width: 65
			}, {
				header: "身份",
				dataIndex: "employee_des",
				menuDisabled: false,
				sortable: true,
				width: 65
			}, {
				header: "推广费用",
				dataIndex: "employee_profit",
				menuDisabled: false,
				sortable: true,
				width: 50
			}, {
				header: "药品",
				dataIndex: "drug_name",
				menuDisabled: false,
				sortable: true,
				width: 80
			}, {
				header: "规格",
				dataIndex: "drug_guige",
				menuDisabled: false,
				sortable: false,
				width: 90
			}, {
				header: "药品生产企业",
				dataIndex: "drug_manufacture",
				menuDisabled: false,
				sortable: true,
				width: 200
			}, {
				header: "销售医院",
				dataIndex: "hospital_name",
				menuDisabled: false,
				sortable: true,
				width: 350
			}, {
				header: "1月销量",
				dataIndex: "01_month",
				menuDisabled: false,
				sortable: false,
				width: 55,
				renderer: rendererFunction
			}, {
				header: "2月销量",
				dataIndex: "02_month",
				menuDisabled: false,
				sortable: false,
				width: 55,
				renderer: rendererFunction
			}, {
				header: "3月销量",
				dataIndex: "03_month",
				menuDisabled: false,
				sortable: false,
				width: 55,
				renderer: rendererFunction
			}, {
				header: "4月销量",
				dataIndex: "04_month",
				menuDisabled: false,
				sortable: false,
				width: 55,
				renderer: rendererFunction
			}, {
				header: "5月销量",
				dataIndex: "05_month",
				menuDisabled: false,
				sortable: false,
				width: 55,
				renderer: rendererFunction
			}, {
				header: "6月销量",
				dataIndex: "06_month",
				menuDisabled: false,
				sortable: false,
				width: 55,
				renderer: rendererFunction
			}, {
				header: "7月销量",
				dataIndex: "07_month",
				menuDisabled: false,
				sortable: false,
				width: 55,
				renderer: rendererFunction
			}, {
				header: "8月销量",
				dataIndex: "08_month",
				menuDisabled: false,
				sortable: false,
				width: 55,
				renderer: rendererFunction
			}, {
				header: "9月销量",
				dataIndex: "09_month",
				menuDisabled: false,
				sortable: false,
				width: 55,
				renderer: rendererFunction
			}, {
				header: "10月销量",
				dataIndex: "10_month",
				menuDisabled: false,
				sortable: false,
				width: 55,
				renderer: rendererFunction
			}, {
				header: "11月销量",
				dataIndex: "11_month",
				menuDisabled: false,
				sortable: false,
				width: 55,
				renderer: rendererFunction
			}, {
				header: "12月销量",
				dataIndex: "12_month",
				menuDisabled: false,
				sortable: false,
				width: 55,
				renderer: rendererFunction
			}],
			tbar: [{
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
				id: "editQueryEmployeeMainForm",
				xtype: 'psi_employeefield',
				labelAlign: "right",
				labelSeparator: "",
				width: 200,
				fieldLabel: "选择业务员",
			}, {
				xtype: "button",
				text: "查询",
				width: 100,
				margin: "5 0 0 10",
				iconCls: "PSI-button-refresh",
				handler: me.onQueryMainForm,
				scope: me
			}, {
				xtype: "button",
				text: "重置查询条件",
				width: 100,
				margin: "5, 0, 0, 10",
				handler: me.onClearQuery,
				scope: me
			}, {
				xtype: "button",
				text: "导出到excel",
				width: 100,
				margin: "5, 0, 0, 10",
				iconCls: "PSI-button-excelexport",
				handler: me.onExportGrid2Excel4Main,
				scope: me
			}],
			bbar: [{
				id: "pagingToobarMainForm",
				xtype: "pagingtoolbar",
				border: 0,
				store: store
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageMainForm",
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
								.getCmp("comboCountPerPageMainForm")
								.getValue();
							store.currentPage = 1;
							Ext.getCmp("pagingToobarMainForm")
								.doRefresh();
						},
						scope: me
					}
				}
			}, {
				xtype: "displayfield",
				value: "条记录"
			}],
			store: store,
			listeners: {
				selectionchange: function(view, record, item, index, e) {
                    var data = this.getSelectionModel().getSelection();
                    for (var i = 0; i < summaryFilters.length; i++) {
                        records[summaryFilters[i]] = 0;
                    }
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < summaryFilters.length; j++) {
                            var itemname = summaryFilters[j];
                            records[itemname] += Number.parseFloat(data[i].raw[itemname]);
                        }
                    }
                    me.__mainGrid.update();
				},

			}
		});

		var summaryColumns = me.__mainGrid.columns;
		for (var i = 0; i < summaryColumns.length; i++) {
			var itemname = summaryColumns[i].dataIndex;
			(function(itemname) {
				summaryColumns[i].summaryType = summaryFilters.indexOf(itemname) < 0 ? false : function() {
					return records[itemname] || 0;
				}
				if (i === 1) {
					summaryColumns[1].summaryType = function() {
						return '合计'
					}
				}
			})(itemname)
		}

		return me.__mainGrid;
	},

	getEmployeePayDetailGrid: function() {
		var me = this;
		if (me.__employeePayDetailGrid) {
			return me.__employeePayDetailGrid;
		}

		var modelName = "PSIReportSaleDayByGoods";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: [
				"id", "bill_code", "employee_name", 'pay_amount', 'bill_date', 'pay_month', 'note'
			]
		});
		var store = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: modelName,
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Report/paymentInfoQueryData",
				reader: {
					root: 'all_data',
					totalProperty: 'totalCount'
				}
			}
		});
		store.on("beforeload", function() {
			store.proxy.extraParams = me.getQueryParam4Payment();
		});
		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 1, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
		});
		me.__employeePayDetailGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			title: "业务员支付报表",
			border: 0,
			selModel: sm,
			columnLines: true,
			features: [{
				ftype: 'summary',
				dock: 'bottom'
			}],
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
				header: "业务员",
				dataIndex: "employee_name",
				menuDisabled: false,
				sortable: true,
				width: 100
			}, {
				header: "业务日期",
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
				width: 100
			}, {
				header: "备注",
				dataIndex: "note",
				menuDisabled: false,
				sortable: false,
				width: 200
			}],
			store: store,
			bbar: [{
				id: "pagingToobarPayDetail",
				xtype: "pagingtoolbar",
				border: 0,
				store: store
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPagePayDetail",
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
								.getCmp("comboCountPerPagePayDetail")
								.getValue();
							store.currentPage = 1;
							Ext.getCmp("pagingToobarPayDetail")
								.doRefresh();
						},
						scope: me
					}
				}
			}, {
				xtype: "displayfield",
				value: "条记录"
			}],
			tbar: [{
				id: "editQueryDate4Payment",
				xtype: 'monthfield',
				margin: "5, 0, 0, 0",
				format: "Y",
				labelAlign: "right",
				labelSeparator: "",
				width: 200,
				fieldLabel: "选择年份",
				value: new Date()
			}, {
				id: "editQueryEmployee4Payment",
				xtype: 'psi_employeefield',
				labelAlign: "right",
				labelSeparator: "",
				width: 200,
				fieldLabel: "选择业务员",
			}, {
				xtype: "container",
				items: [{
					xtype: "button",
					text: "查询",
					width: 100,
					margin: "5 0 0 10",
					iconCls: "PSI-button-refresh",
					handler: me.onQuery4Payment,
					scope: me
				}, {
					xtype: "button",
					text: "重置查询条件",
					width: 100,
					margin: "5, 0, 0, 10",
					handler: me.onClearQuery,
					scope: me
				}, {
					xtype: "button",
					text: "导出到excel",
					width: 100,
					margin: "5, 0, 0, 10",
					iconCls: "PSI-button-excelexport",
					handler: me.onExportGrid2Excel4Pay,
					scope: me
				}]
			}],
			listeners: {
				selectionchange: function(view, record, item, index, e) {
                    var data = this.getSelectionModel().getSelection();
                    for (var i = 0; i < summaryFilters.length; i++) {
                        records[summaryFilters[i]] = 0;
                    }
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < summaryFilters.length; j++) {
                            var itemname = summaryFilters[j];
                            records[itemname] += Number.parseFloat(data[i].raw[itemname]);
                        }
                    }
                    me.__employeePayDetailGrid.update();
                }
			}
		});
		var summaryColumns = me.__employeePayDetailGrid.columns;
		for (var i = 0; i < summaryColumns.length; i++) {
			var itemname = summaryColumns[i].dataIndex;
			(function(itemname) {
				summaryColumns[i].summaryType = summaryFilters.indexOf(itemname) < 0 ? false : function() {
						return records[itemname] || 0;
					}
					// if (i === 1) {
					//     summaryColumns[1].summaryType = function() {
					//         return '合计'
					//     }
					// }
			})(itemname)
		}
		return me.__employeePayDetailGrid;
	},


	onQueryMainForm: function() {
		this.refreshMainGrid();
	},
	onQuery4Payment: function() {
		this.refreshPayment();
	},

	onClearQuery: function() {
		//var me = this;
		//
		//Ext.getCmp("editQueryDT").setValue(new Date());
		//
		//me.onQuery();
	},

	getQueryParam: function() {
		var me = this;

		var result = {};

		var dt = Ext.getCmp("editQueryDate").getValue();
		if (dt) {
			result.date = Ext.Date.format(dt, "Y");
		}
		var employee_name = Ext.getCmp("editQueryEmployeeMainForm").getValue();
		if (employee_name) {
			result.employee_name = employee_name;
		}
		return result;
	},

	getQueryParam4Payment: function() {
		var me = this;

		var result = {};

		var dt = Ext.getCmp("editQueryDate4Payment").getValue();
		if (dt) {
			result.date = Ext.Date.format(dt, "Y");
		}
		var employee_name = Ext.getCmp("editQueryEmployee4Payment").getValue();
		if (employee_name) {
			result.employee_name = employee_name;
		}
		return result;
	},

	refreshMainGrid: function(id) {
		var me = this;
		var store = me.__mainGrid.getStore();
		store.removeAll();
		store.load();
	},
	refreshPayment: function(id) {
		var me = this;
		var store = me.__employeePayDetailGrid.getStore();
		store.removeAll();
		store.load();
	},
	onExportGrid2Excel4Main: function() {
		var me = this;
		var config = {
			store: me.getMainGrid().getStore(),
			title: "业务员报表业务员月销售报表"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(me.getMainGrid(), config); //调用导出函数
	},

	onExportGrid2Excel4Pay: function() {
		var me = this;
		var config = {
			store: me.getEmployeePayDetailGrid().getStore(),
			title: "业务员报表业务员月销售报表"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(me.getEmployeePayDetailGrid(), config); //调用导出函数
	},
});