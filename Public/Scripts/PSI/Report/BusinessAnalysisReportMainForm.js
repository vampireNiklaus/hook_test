/**
 * 销售报表
 */
var summaryFilters = ['01_month_sell', '02_month_sell', '03_month_sell', '04_month_sell', '05_month_sell',
	'06_month_sell', '07_month_sell', '08_month_sell', '09_month_sell', '10_month_sell',
	'11_month_sell', '12_month_sell',
	'01_month_buy', '02_month_buy', '03_month_buy', '04_month_buy', '05_month_buy',
	'06_month_buy', '07_month_buy', '08_month_buy', '09_month_buy', '10_month_buy',
	'11_month_buy', '12_month_buy', 'sum_buy', 'sum_sell', 'buy_rate', 'sell_rate', 'amount', 'need_amount'
];
var records = {};
Ext.define("PSI.Report.BusinessAnalysisReportMainForm", {
	extend: "Ext.panel.Panel",

	config: {
		pViewReportProductAgency: null,
	},

	border: 0,

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
					me.getPViewReportProductAgency() == "0" ? null : me.getProductAgencyGrid(),
				]
			}]
		});
		me.callParent(arguments);
		Ext.onDocumentReady(function() {
			var spread = new GC.Spread.Sheets.Workbook(document.getElementById('ss'), {
				sheetCount: 1
			});
		});
	},

	//产品代理协议
	getProductAgencyGrid: function() {
		var me = this;
		if (me.productAgencyGrid) {
			return me.productAgencyGrid;
		}
		//定义业务员利润分配条目数据字段模型
		Ext.define("ProductAgency", {
			extend: "Ext.data.Model",
			fields: ['id', 'drug_id', 'common_name', 'guige', 'manufacturer', 'protocol_time', 'bill_date',
				'note', 'amount', 'earnest_money', 'need_amount', 'sum_buy', 'sum_sell', 'buy_rate', 'sell_rate',
				'01_month_sell', '02_month_sell', '03_month_sell', '04_month_sell', '05_month_sell',
				'06_month_sell', '07_month_sell', '08_month_sell', '09_month_sell', '10_month_sell',
				'11_month_sell', '12_month_sell',
				'01_month_buy', '02_month_buy', '03_month_buy', '04_month_buy', '05_month_buy',
				'06_month_buy', '07_month_buy', '08_month_buy', '09_month_buy', '10_month_buy',
				'11_month_buy', '12_month_buy'
			]
		});
		//业务员
		var productAgencyStore = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: "ProductAgency",
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Report/getProductAgencyList",
				reader: {
					root: 'productAgencyList',
					totalProperty: 'totalCount'
				}
			}
		});


		productAgencyStore.on("beforeload", function() {
			productAgencyStore.proxy.extraParams = me.getQueryParam4ProductAgency();
		});
		productAgencyStore.on("load", function(e, records, successful) {
			if (successful) {
				// me.gotoProductAgencyGridRecord(me.__lastId);
			}
		});
		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 1, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
		});
		//定义一个业务员利润分配条目列表实例
		var productAgencyGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true,
				forceFit: true
			},
			title: "产品代理协议报表",
			selModel: sm,
			features: [{
				ftype: 'summary',
				dock: 'bottom'
			}],
			columnLines: true,
			tbar: [{
				id: "editQueryDate4ProductAgency",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "年份",
				xtype: 'monthfield',
				margin: "5, 0, 0, 0",
				format: "Y",
				width: 150,
				value: new Date(),
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
					width: 100,
					iconCls: "PSI-button-refresh",
					margin: "5, 0, 0, 20",
					handler: me.onQuery4ProductAgency,
					scope: me
				}, {
					xtype: "button",
					text: "导出到excel",
					width: 100,
					margin: "5, 0, 0, 10",
					iconCls: "PSI-button-excelexport",
					handler: me.onExportGrid2Excel4ProductAgency,
					scope: me
				}]
			}],
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				sortable: true,
				width: 30
			}), {
				header: "签订时间",
				menuDisabled: false,
				dataIndex: "bill_date",
				sortable: true
			}, {
				header: "协议时间",
				dataIndex: "protocol_time",
				menuDisabled: false,
				sortable: true,
				renderer: function(v) {
					return v + '.01.01-' + v + '.12.31'
				}
			}, {
				header: "药品通用名",
				dataIndex: "common_name",
				menuDisabled: false,
				sortable: true
			}, {
				header: "规格",
				dataIndex: "guige",
				menuDisabled: false,
				sortable: true
			}, {
				header: "生产厂家",
				dataIndex: "manufacturer",
				menuDisabled: true,
				sortable: true
			}, {
				header: "保证金",
				dataIndex: "earnest_money",
				menuDisabled: false,
				sortable: true
			}, {
				header: "协议量",
				dataIndex: "amount",
				menuDisabled: false,
				sortable: true
			}, {
				header: "剩余协议量",
				dataIndex: "need_amount",
				menuDisabled: false,
				sortable: true
			}, {
				header: "1月购货",
				dataIndex: "01_month_buy",
				menuDisabled: false,
				sortable: true
			}, {
				header: "1月纯销",
				dataIndex: "01_month_sell",
				menuDisabled: false,
				sortable: true
			}, {
				header: "2月购货",
				dataIndex: "02_month_buy",
				menuDisabled: false,
				sortable: true
			}, {
				header: "2月纯销",
				dataIndex: "02_month_sell",
				menuDisabled: false,
				sortable: true
			}, {
				header: "3月购货",
				dataIndex: "03_month_buy",
				menuDisabled: false,
				sortable: true
			}, {
				header: "3月纯销",
				dataIndex: "03_month_sell",
				menuDisabled: false,
				sortable: true
			}, {
				header: "4月购货",
				dataIndex: "04_month_buy",
				menuDisabled: false,
				sortable: true
			}, {
				header: "4月纯销",
				dataIndex: "04_month_sell",
				menuDisabled: false,
				sortable: true
			}, {
				header: "5月购货",
				dataIndex: "05_month_buy",
				menuDisabled: false,
				sortable: true
			}, {
				header: "5月纯销",
				dataIndex: "05_month_sell",
				menuDisabled: false,
				sortable: true
			}, {
				header: "6月购货",
				dataIndex: "06_month_buy",
				menuDisabled: false,
				sortable: true
			}, {
				header: "6月纯销",
				dataIndex: "06_month_sell",
				menuDisabled: false,
				sortable: true
			}, {
				header: "7月购货",
				dataIndex: "07_month_buy",
				menuDisabled: false,
				sortable: true
			}, {
				header: "7月纯销",
				dataIndex: "07_month_sell",
				menuDisabled: false,
				sortable: true
			}, {
				header: "8月购货",
				dataIndex: "08_month_buy",
				menuDisabled: false,
				sortable: true
			}, {
				header: "8月纯销",
				dataIndex: "08_month_sell",
				menuDisabled: false,
				sortable: true
			}, {
				header: "9月购货",
				dataIndex: "09_month_buy",
				menuDisabled: false,
				sortable: true
			}, {
				header: "9月纯销",
				dataIndex: "09_month_sell",
				menuDisabled: false,
				sortable: true
			}, {
				header: "10月购货",
				dataIndex: "10_month_buy",
				menuDisabled: false,
				sortable: true
			}, {
				header: "10月纯销",
				dataIndex: "10_month_sell",
				menuDisabled: false,
				sortable: true
			}, {
				header: "11月购货",
				dataIndex: "11_month_buy",
				menuDisabled: false,
				sortable: true
			}, {
				header: "11月纯销",
				dataIndex: "11_month_sell",
				menuDisabled: false,
				sortable: true
			}, {
				header: "12月购货",
				dataIndex: "12_month_buy",
				menuDisabled: false,
				sortable: true
			}, {
				header: "12月纯销",
				dataIndex: "12_month_sell",
				menuDisabled: false,
				sortable: true
			}, {
				header: "合计购货",
				dataIndex: "sum_buy",
				menuDisabled: false,
				sortable: true
			}, {
				header: "合计纯销",
				dataIndex: "sum_sell",
				menuDisabled: false,
				sortable: true
			}, {
				header: "购货完成率",
				dataIndex: "buy_rate",
				menuDisabled: false,
				sortable: true
			}, {
				header: "纯销完成率",
				dataIndex: "sell_rate",
				menuDisabled: false,
				sortable: true
			}],
			store: productAgencyStore,
			bbar: [{
				id: "pagingToolbarProductAgency",
				border: 0,
				xtype: "pagingtoolbar",
				store: productAgencyStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageProductAgency",
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
							productAgencyStore.pageSize = Ext.getCmp("comboCountPerPageProductAgency").getValue();
							productAgencyStore.currentPage = 1;
							Ext.getCmp("pagingToolbarProductAgency").doRefresh();
						},
						scope: me
					}
				}
			}, {
				xtype: "displayfield",
				value: "条记录"
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
                    me.productAgencyGrid.update();
				},

			}
		});
		me.productAgencyGrid = productAgencyGrid;

		var summaryColumns = me.productAgencyGrid.columns;
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

		return me.productAgencyGrid;
	},



	refreshProductAgencyGrid: function(currentPage) {
		var me = this;
		var grid = me.productAgencyGrid;
		var store = grid.getStore();
		if (currentPage)
			store.currentPage = currentPage;
		store.removeAll();
		store.load();
	},
	onQuery4ProductAgency: function() {
		var me = this;
		me.refreshProductAgencyGrid();
	},

	onQuery4ProductIODetail: function() {
		var me = this;
		me.refreshProductAgencyGrid();
	},
	getQueryParam4ProductAgency: function() {
		var result = {};
		var date = Ext.getCmp("editQueryDate4ProductAgency").getValue();
		if (date) {
			result.date = Ext.Date.format(date, "Y");
		}
		return result;
	},

	getQueryParam4ProductIODetail: function() {
		var result = {};
		var date = Ext.getCmp("editQueryDate4ProductIODetail").getValue();
		if (date) {
			result.date = Ext.Date.format(date, "Y-m");
		}

		var drug_id = Ext.getCmp("editQueryDrug4IODetail").getIdValue();
		if (drug_id) {
			result.drug_id = drug_id;
		}
		return result;
	},



	onQuery: function() {
		this.refreshMainGrid();
		this.refreshSummaryGrid();
	},

	onClearQuery: function() {
		//var me = this;
		//
		//Ext.getCmp("editQueryDT").setValue(new Date());
		//
		//me.onQuery();
	},

	getQueryParam: function() {
		//var me = this;
		//
		//var result = {};
		//
		//var dt = Ext.getCmp("editQueryDT").getValue();
		//if (dt) {
		//	result.dt = Ext.Date.format(dt, "Y-m-d");
		//}
		//
		//return result;
	},

	refreshMainGrid: function(id) {
		//Ext.getCmp("pagingToobar").doRefresh();
	},

	onExportGrid2Excel4ProductAgency: function() {
		var me = this;
		var config = {
			store: me.productAgencyGrid.getStore(),
			title: "业务分析报表产品代理协议报表"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(me.productAgencyGrid, config); //调用导出函数
	},

	onExportGrid2Excel4ProductIODetail: function() {
		var me = this;
		var config = {
			store: me.productIODetailPanel.getStore(),
			title: "业务分析报表产品代理协议报表"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(me.productIODetailPanel, config); //调用导出函数
	},
});