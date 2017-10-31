/**
 * 销售报表
 */
var summaryFilters = ['pre_amount', 'pre_money', 'this_instock_amount', 'this_instock_money', 'this_sell_amount', 'this_sell_money', 'this_amount', 'this_money', 'amount', 'sell_amount'];
var records = {};
Ext.define("PSI.Report.JinXiaoCunReportMainForm", {
	extend: "Ext.panel.Panel",

	border: 0,
	config: {
		pViewReportJinXiaoCunSummary: null,
		pViewReportJinXiaoCunSellDetail: null,
		pViewReportJinXiaoCunInStock: null
	},
	layout: "border",

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
					me.getPViewReportJinXiaoCunSummary() == "0" ? null : me.getMainGrid(),
					me.getPViewReportJinXiaoCunSellDetail() == "0" ? null : me.getSellGrid(),
					me.getPViewReportJinXiaoCunInStock() == "0" ? null : me.getInStockGrid()
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

		var modelName = "PSIReportJinXiaoCunMain";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: [
				"drug_id", "drug_name", "drug_guige", "drug_manufacturer", "drug_jx",
				"pre_amount", "pre_money",
				"this_instock_amount", "this_instock_money",
				"this_sell_amount", "this_sell_money",
				"this_amount", "this_money"
			]
		});
		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 1, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
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
				url: PSI.Const.BASE_URL + "Home/Report/jinXiaoCunMainQueryData",
				reader: {
					root: 'all_data',
					totalProperty: 'totalCount'
				}
			}
		});
		store.on("beforeload", function() {
			store.proxy.extraParams = me.getQueryParam4Main();
		});

		me.__mainGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			title: "进销存总表",
			border: 0,
			selModel: sm,
			features: [{
				ftype: 'summary',
				dock: 'bottom'
			}],
			scroll: true,
			columnLines: true,
			columns: [{
				xtype: "rownumberer"
			}, {
				header: "药品",
				dataIndex: "drug_name",
				menuDisabled: false,
				sortable: true,
			}, {
				header: "规格",
				dataIndex: "drug_guige",
				menuDisabled: false,
				sortable: true,
			}, {
				header: "药品生产企业",
				width: 200,
				dataIndex: "drug_manufacturer",
				menuDisabled: false,
				sortable: true,
			}, {
				header: "剂型",
				dataIndex: "drug_jx",
				menuDisabled: false,
				sortable: true,
			}, {
				header: "上周期结存数量",
				dataIndex: "pre_amount",
				menuDisabled: false,
				sortable: true,
			}, {
				header: "上周期结存金额",
				dataIndex: "pre_money",
				menuDisabled: false,
				sortable: true,
			}, {
				header: "本周期入库数量",
				dataIndex: "this_instock_amount",
				menuDisabled: false,
				sortable: true,
			}, {
				header: "上周期入库金额",
				dataIndex: "this_instock_money",
				menuDisabled: false,
				sortable: true,
			}, {
				header: "本周期销售数量",
				dataIndex: "this_sell_amount",
				menuDisabled: false,
				sortable: true,
			}, {
				header: "本周期销售金额",
				dataIndex: "this_sell_money",
				menuDisabled: false,
				sortable: true,
			}, {
				header: "本周期结存数量",
				dataIndex: "this_amount",
				menuDisabled: false,
				sortable: true,
			}, {
				header: "本周期结存金额",
				dataIndex: "this_money",
				menuDisabled: false,
				sortable: true,
			}],
			store: store,
			bbar: [{
				id: "pagingToobar4Main",
				xtype: "pagingtoolbar",
				border: 0,
				store: store
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPage4Main",
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
								.getCmp("comboCountPerPage4Main")
								.getValue();
							store.currentPage = 1;
							Ext.getCmp("pagingToobar4Main")
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
				id: "editQueryDT",
				xtype: "monthfield",
				margin: "5, 0, 0, 0",
				format: "Y-m",
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "查询时间",
				value: new Date()
			}, {
				id: "editQueryDrug4Main",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "品种",
				margin: "5, 0, 0, 0",
				xtype: "psi_drug_field",
				listeners: {
					specialkey: {
						fn: me.onQueryEditSpecialKey,
						scope: me
					}
				}
			}, {
				id: "editSearchType4Main",
				fieldLabel: "查询类型",
				valueField: "name",
				labelAlign: "right",
				displayField: "name",
				labelWidth: 60,
				xtype: "combo",
				value: '按月查询',
				store: new Ext.data.ArrayStore({
					fields: ['id', 'name'],
					data: [
						["1", '按月查询'],
						["2", '按年查询']
					]
				})
			}, {
				xtype: "container",
				items: [{
					xtype: "button",
					text: "查询",
					width: 100,
					margin: "5 0 0 10",
					iconCls: "PSI-button-refresh",
					handler: me.onQuery4Main,
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
				}]
			}],
			listeners: {
				selectionchange: function(view, record, item, index, e) {
                    var data = this.getSelectionModel().getSelection();
                    console.log(data)
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



	//按照地区查询
	getInStockGrid: function() {
		var me = this;
		if (me.inStockGrid) {
			return me.__inStockGrid;
		}

		var modelName = "PSIInStock";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["drug_name", "drug_guige", "drug_manufacturer", "deliver_name", "supplier_name",
				"instock_date", "amount", "batch_num"
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
				url: PSI.Const.BASE_URL + "Home/Report/jinXiaoCunInStockQueryData",
				reader: {
					root: 'all_data',
					totalProperty: 'totalCount'
				}
			}
		});
		store.on("beforeload", function() {
			store.proxy.extraParams = me.getQueryParam4InStock();
		});
		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 1, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
		});
		me.__inStockGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			scroll: true,
			title: "进货查询",
			selModel: sm,
			features: [{
				ftype: 'summary',
				dock: 'bottom'
			}],
			border: 0,
			columnLines: true,
			columns: [
				Ext.create("Ext.grid.RowNumberer", {
					text: "序号",
					width: 40
				}), {
					header: "药品名称",
					dataIndex: "drug_name",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "药品规格",
					dataIndex: "drug_guige",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "药品生产企业",
					dataIndex: "drug_manufacturer",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "药品批号",
					dataIndex: "batch_num",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "配送公司",
					dataIndex: "deliver_name",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "供应商",
					dataIndex: "supplier_name",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "入库数量",
					dataIndex: "amount",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "入库日期",
					dataIndex: "instock_date",
					menuDisabled: false,
					sortable: false,
					width: 60
				},
			],
			store: store,
			bbar: [{
				id: "pagingToobar4InStock",
				xtype: "pagingtoolbar",
				border: 0,
				store: store
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPage4InStock",
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
								.getCmp("comboCountPerPage4InStock")
								.getValue();
							store.currentPage = 1;
							Ext.getCmp("pagingToobar4InStock")
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
				id: "editQueryDate4InStockFrom",
				xtype: 'datefield',
				margin: "5, 0, 0, 0",
				format: "Y-m-d",
				labelAlign: "left",
				labelSeparator: "",
				width: 200,
				labelWidth: 70,
				fieldLabel: "选择日期(起）",
				value: new Date("2017-1-1")
			}, {
				id: "editQueryDate4InStockTo",
				xtype: 'datefield',
				margin: "5, 0, 0, 0",
				format: "Y-m-d",
				labelAlign: "left",
				labelSeparator: "",
				width: 200,
				labelWidth: 70,
				fieldLabel: "选择日期(止）",
				value: new Date()
			}, {
				id: "editQueryDrug4InStock",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "药品",
				margin: "5, 0, 0, 0",
				xtype: "psi_drug_field",
				parentCmp: me,
				callbackFunc: me.onSelectDrugIn4InStockGrid,
				listeners: {
					specialkey: {
						fn: me.onQueryEditSpecialKey,
						scope: me
					}
				}
			}, {
				xtype: "container",
				items: [{
					xtype: "button",
					text: "查询",
					width: 50,
					margin: "5 0 0 10",
					iconCls: "PSI-button-refresh",
					handler: me.onQuery4InStock,
					scope: me
				}, {
					xtype: "button",
					text: "导出到excel",
					width: 100,
					margin: "5, 0, 0, 10",
					iconCls: "PSI-button-excelexport",
					handler: me.onExportGrid2Excel4Instock,
					scope: me
				}]
			}],
			listeners: {
				selectionchange: function(view, record, item, index, e) {
					this.getView().refresh();
				},
				select: function(view, record, item, index, e) {
					var data = this.getSelectionModel().getSelection();
					console.log(data)
					for (var i = 0; i < summaryFilters.length; i++) {
						records[summaryFilters[i]] = 0;
					}
					for (var i = 0; i < data.length; i++) {
						for (var j = 0; j < summaryFilters.length; j++) {
							var itemname = summaryFilters[j];
							records[itemname] += Number.parseFloat(data[i].raw[itemname]);
						}
					}
					// this.getView().refresh();
				},
				deselect: function(view, record, item, index, e) {
					var data = this.getSelectionModel().getSelection();
					console.log(data)
					for (var i = 0; i < summaryFilters.length; i++) {
						records[summaryFilters[i]] = 0;
					}
					for (var i = 0; i < data.length; i++) {
						for (var j = 0; j < summaryFilters.length; j++) {
							var itemname = summaryFilters[j];
							records[itemname] += Number.parseFloat(data[i].raw[itemname]);
						}
					}
					// this.getView().refresh();
				}
			}
		});
		me.inStockGrid = me.__inStockGrid;

		var summaryColumns = me.__inStockGrid.columns;
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

		return me.inStockGrid;
	},

	//医院业务开发状况
	getSellGrid: function() {
		var me = this;
		if (me.sellGrid) {
			return me.sellGrid;
		}

		var modelName = "PSIReportSell";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "bill_code", "employee_id", "employee_des", "employee_profit",
				"employee_name", "drug_id", "drug_name", "drug_guige", "drug_manufacture",
				"hospital_id", "hospital_name", "stock_id", "deliver_id", "deliver_name",
				"batch_num", "sell_amount", "sell_date", "create_time",
				"creator_id", "note", "if_paid", "pay_time", "paybill_id", "status", "expire_time"
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
				url: PSI.Const.BASE_URL + "Home/Report/jinXiaoCunSellQueryData",
				reader: {
					root: 'all_data',
					totalProperty: 'totalCount'
				}
			}
		});
		store.on("beforeload", function() {
			store.proxy.extraParams = me.getQueryParam4Sell();
		});
		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 1, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
		});
		me.__sellGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			scroll: true,
			title: "销售明细查询",
			selModel: sm,
			features: [{
				ftype: 'summary',
				dock: 'bottom'
			}],
			border: 0,
			columnLines: true,
			columns: [
				Ext.create("Ext.grid.RowNumberer", {
					text: "序号",
					width: 40
				}), {
					header: "单据编号",
					dataIndex: "bill_code",
					menuDisabled: false,
					sortable: false
				}, {
					header: "是否支付",
					dataIndex: "if_paid",
					menuDisabled: false,
					sortable: true,
					width: 20,
				}, {
					header: "支付日期",
					dataIndex: "pay_time",
					width: 50,
				}, {
					header: "支付单单号",
					dataIndex: "paybill_id",
				}, {
					header: "单据状态",
					dataIndex: "status",
					menuDisabled: false,
					sortable: false
				}, {
					header: "药品名称",
					dataIndex: "drug_name",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "药品规格",
					dataIndex: "drug_guige",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "药品生产企业",
					dataIndex: "drug_manufacture",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "药品批号",
					dataIndex: "batch_num",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "有效期",
					dataIndex: "expire_time",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "医院名称",
					dataIndex: "hospital_name",
					menuDisabled: false,
					sortable: false,
				}, {
					header: "业务员姓名",
					dataIndex: "employee_name",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "业务员身份",
					dataIndex: "employee_des",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "业务员提成",
					dataIndex: "employee_profit",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "配送公司",
					dataIndex: "deliver_name",
					menuDisabled: false,
					sortable: false,
					width: 100
				}, {
					header: "销售数量",
					dataIndex: "sell_amount",
					menuDisabled: false,
					sortable: false
				}, {
					header: "销售日期",
					dataIndex: "sell_date",
				}, {
					header: "备注",
					dataIndex: "note",
				}
			],
			store: store,
			bbar: [{
				id: "pagingToobar4Sell",
				xtype: "pagingtoolbar",
				border: 0,
				store: store
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPage4Sell",
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
								.getCmp("comboCountPerPage4Sell")
								.getValue();
							store.currentPage = 1;
							Ext.getCmp("pagingToobar4Sell")
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
				id: "editQueryDate4SellFrom",
				xtype: 'datefield',
				margin: "5, 0, 0, 0",
				format: "Y-m-d",
				labelAlign: "left",
				labelSeparator: "",
				width: 200,
				labelWidth: 70,
				fieldLabel: "选择日期(起）",
				value: new Date("2017-1-1")
			}, {
				id: "editQueryDate4SellTo",
				xtype: 'datefield',
				margin: "5, 0, 0, 0",
				format: "Y-m-d",
				labelAlign: "left",
				labelSeparator: "",
				width: 200,
				labelWidth: 70,
				fieldLabel: "选择日期(止）",
				value: new Date()
			}, {
				id: "editQueryDrugSell",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "药品",
				margin: "5, 0, 0, 0",
				xtype: "psi_drug_field",
			}, {
				id: "editQueryEmployeeSell",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "业务员",
				margin: "5, 0, 0, 0",
				xtype: "psi_employeefield",
			}, {
				xtype: "container",
				items: [{
					xtype: "button",
					text: "查询",
					width: 50,
					margin: "5 0 0 10",
					iconCls: "PSI-button-refresh",
					handler: me.onQuery4Sell,
					scope: me
				}, {
					xtype: "button",
					text: "导出到excel",
					width: 100,
					margin: "5, 0, 0, 10",
					iconCls: "PSI-button-excelexport",
					handler: me.onExportGrid2Excel4Sell,
					scope: me
				}]
			}],
			listeners: {
				selectionchange: function(view, record, item, index, e) {
					this.getView().refresh();
				},
				select: function(view, record, item, index, e) {
					var data = this.getSelectionModel().getSelection();
					console.log(data)
					for (var i = 0; i < summaryFilters.length; i++) {
						records[summaryFilters[i]] = 0;
					}
					for (var i = 0; i < data.length; i++) {
						for (var j = 0; j < summaryFilters.length; j++) {
							var itemname = summaryFilters[j];
							records[itemname] += Number.parseFloat(data[i].raw[itemname]);
						}
					}
					// this.getView().refresh();
				},
				deselect: function(view, record, item, index, e) {
					var data = this.getSelectionModel().getSelection();
					console.log(data)
					for (var i = 0; i < summaryFilters.length; i++) {
						records[summaryFilters[i]] = 0;
					}
					for (var i = 0; i < data.length; i++) {
						for (var j = 0; j < summaryFilters.length; j++) {
							var itemname = summaryFilters[j];
							records[itemname] += Number.parseFloat(data[i].raw[itemname]);
						}
					}
					// this.getView().refresh();
				}
			}
		});
		me.sellGrid = me.__sellGrid;

		var summaryColumns = me.__sellGrid.columns;
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

		return me.__sellGrid;
	},


	onQuery4Main: function() {
		Ext.getCmp("pagingToobar4Main")
			.doRefresh();
	},
	onQuery4Sell: function() {
		Ext.getCmp("pagingToobar4Sell")
			.doRefresh();
	},
	onQuery4InStock: function() {
		Ext.getCmp("pagingToobar4InStock")
			.doRefresh();
	},

	onClearQuery: function() {

	},

	getQueryParam4Main: function() {
		var me = this;
		var result = {};

		var drug_name = Ext.getCmp("editQueryDrug4Main").getValue();
		if (drug_name) {
			result.drug_name = drug_name;
		}

		var searchType = Ext.getCmp("editSearchType4Main").getValue();
		if (searchType) {
			result.searchType = searchType;
		}

		var date = Ext.getCmp("editQueryDT").getValue();
		if (date) {
			if (searchType == "按月查询") {
				result.date = Ext.Date.format(date, "Y-m")
			} else {
				result.date = Ext.Date.format(date, "Y")
			}
		}
		return result;
	},

	getQueryParam4Sell: function() {
		var me = this;
		var result = {};

		var drug_name = Ext.getCmp("editQueryDrugSell").getValue();
		if (drug_name) {
			result.drug_name = drug_name;
		}

		var employee_name = Ext.getCmp("editQueryEmployeeSell").getValue();
		if (employee_name) {
			result.employee_name = employee_name;
		}

		var dateFrom = Ext.getCmp("editQueryDate4SellFrom").getValue();
		if (dateFrom) {
			result.dateFrom = Ext.Date.format(dateFrom, "Y-m-d")
		}

		var dateTo = Ext.getCmp("editQueryDate4SellTo").getValue();
		if (dateTo) {
			result.dateTo = Ext.Date.format(dateTo, "Y-m-d")
		}
		return result;
	},

	getQueryParam4InStock: function() {
		var me = this;
		var result = {};

		var drug_id = Ext.getCmp("editQueryDrug4InStock").getIdValue();
		if (drug_id) {
			result.drug_id = drug_id;
		}


		var dateFrom = Ext.getCmp("editQueryDate4InStockFrom").getValue();
		if (dateFrom) {
			result.dateFrom = Ext.Date.format(dateFrom, "Y-m-d")
		}

		var dateTo = Ext.getCmp("editQueryDate4InStockTo").getValue();
		if (dateTo) {
			result.dateTo = Ext.Date.format(dateTo, "Y-m-d")
		}
		return result;
	},
	onExportGrid2Excel4Main: function() {
		var me = this;
		var config = {
			store: me.__mainGrid.getStore(),
			title: "进销存报表进销存总表"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(me.__mainGrid, config); //调用导出函数
	},

	onExportGrid2Excel4Instock: function() {
		var me = this;
		var config = {
			store: me.__inStockGrid.getStore(),
			title: "进销存报表入库查询"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(me.__inStockGrid, config); //调用导出函数
	},

	onExportGrid2Excel4Sell: function() {
		var me = this;
		var config = {
			store: me.__sellGrid.getStore(),
			title: "进销存报表销售明细报表"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(me.__sellGrid, config); //调用导出函数
	},

});