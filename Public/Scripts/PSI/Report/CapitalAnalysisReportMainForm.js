/**
 * 销售报表
 */
var summaryFilters = ['goods_in', 'shangye_huikuan', 'other_in', 'yewu_pay', 'manage_pay', 'goods_out',
	'guarantee_pay', 'tax_pay', 'other_yewu_out', 'bussiness_rebate', 'office_pay', 'remain_sum',
	"qichu_amount", "qichu_stock_money", "jinhuo_amount", "jinhuo_huokuan",
	"xkfh_money", "xkfh_amount", "fahuo_amount", "fahuo_money", "qimo_amount", "qimo_stock_money",
	"end_should_receive_amount", "end_should_receive__money", "puhuo_amount", "puhuo_unitprice", "puhuo_sum_money", "huikuan_amount", "huikuan_sum_money",
	"month_end_should_amount", "month_end_should_sum_money",
	"sell_amount", "sell_unit_price", "sell_sum_money", "buy_amount", "buy_unit_price",
	"buy_sum_money", "price_gap", "tax_sum_money", "other_out", "gross_profit"
]
var records = {};
Ext.define("PSI.Report.CapitalAnalysisReportMainForm", {
	extend: "Ext.panel.Panel",

	border: 0,
	config: {
		pViewReportCapitalAnalysisProIoDetail: null,
		pViewReportCapitalAnalysisPro2ReceiveSum: null,
		pViewReportCapitalAnalysisProJinXiaoSum: null,
		pViewReportCapitalAnalysisProPuHuoProfit: null
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
					me.getPViewReportCapitalAnalysisProIoDetail() == "0" ? null : me.getProductIODetailGrid(),
					me.getPViewReportCapitalAnalysisProJinXiaoSum() == "0" ? null : me.getProductJinXiaoSumGrid(),
					me.getPViewReportCapitalAnalysisPro2ReceiveSum() == "0" ? null : me.getProduct2ReceiveMoneyGrid(),
					me.getPViewReportCapitalAnalysisProPuHuoProfit() == "0" ? null : me.getProductPuHuoProfitGrid(),
				]
			}]
		});

		me.callParent(arguments);
	},


	//产品收支明细账
	getProductIODetailGrid: function() {
		var me = this;
		if (me.productIODetailPanel) {
			return me.productIODetailPanel;
		}

		//定义业务员利润分配条目数据字段模型
		Ext.define("productIODetailDataModel", {
			extend: "Ext.data.Model",
			fields: [
				"drug_name", "yewu_date", "goods_in", "shangye_huikuan", "other_in",
				"yewu_pay", "manage_pay", "goods_out", "guarantee_pay",
				"tax_pay", "other_yewu_out", "bussiness_rebate",
				"office_pay", "remain_sum", "note"
			]
		});

		var productIODetailStore = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: "productIODetailDataModel",
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Report/getProductIODetailList",
				reader: {
					root: 'productIODetailList',
					totalProperty: 'totalCount'
				}
			}
		});
		productIODetailStore.on("beforeload", function() {
			productIODetailStore.proxy.extraParams = me.getQueryParam4ProductIODetail();
		});
		productIODetailStore.on("load", function(e, records, successful) {
			if (successful) {

			}
		});

		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 0, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
		});

		//定义一个业务员利润分配条目列表实例
		var productIODetailPanel = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true,
				forceFit: true
			},
			title: "产品收支明细账",
			selModel: sm,
			features: [{
				ftype: 'summary',
				dock: 'bottom'
			}],
			columnLines: true,
			tbar: [{
				id: "editQueryDrug4IODetail",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "品种",
				margin: "5, 0, 0, 0",
				xtype: "psi_drug_field",
			}, {
				id: "editQueryDate4ProductIODetail",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "年月份",
				xtype: 'monthfield',
				margin: "5, 0, 0, 0",
				format: "Y-m",
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
					handler: me.onQuery4ProductIODetail,
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
					handler: me.onExportGrid2Excel4ProductIODetail,
					scope: me
				}]
			}],
			columns: [{
					text: "产品收支明细账",
					columns: [

						{
							text: "品种",
							width: 120,
							dataIndex: 'drug_name',
							sortable: true
						}, {
							text: "日期",
							width: 70,
							dataIndex: 'yewu_date',
							sortable: true
						}, {
							text: "收入",
							columns: [{
								text: "货款收入",
								width: 70,
								dataIndex: 'goods_in',
								sortable: true
							}, {
								text: "主营业务收入",
								width: 90,
								dataIndex: 'shangye_huikuan',
								sortable: true
							}, {
								text: "其他收入",
								width: 70,
								dataIndex: 'other_in',
								sortable: true
							}, ]
						}, {
							text: "支出",
							columns: [{
								text: "业务费",
								width: 70,
								dataIndex: 'yewu_pay',
								sortable: true
							}, {
								text: "管理费",
								width: 70,
								dataIndex: 'manage_pay',
								sortable: true
							}, {
								text: "货款支出",
								width: 70,
								dataIndex: 'goods_out',
								sortable: true
							}, {
								text: "保证金",
								width: 70,
								dataIndex: 'guarantee_pay',
								sortable: true
							}, {
								text: "税金",
								width: 70,
								dataIndex: 'tax_pay',
								sortable: true
							}, {
								text: "其他业务支出",
								width: 80,
								dataIndex: 'other_yewu_out',
								sortable: true
							}, {
								text: "商业补差及返利",
								width: 90,
								dataIndex: 'bussiness_rebate',
								sortable: true
							}, {
								text: "办公费用",
								width: 70,
								dataIndex: 'office_pay',
								sortable: true
							}, ]
						}, {
							text: "余额",
							width: 100,
							dataIndex: 'remain_sum',
							sortable: true
						}, {
							text: "备注",
							width: 100,
							dataIndex: 'note',
							sortable: true
						},
					]
				}

			],
			store: productIODetailStore,
			bbar: [{
				id: "pagingToolbarProductIODetail",
				border: 0,
				xtype: "pagingtoolbar",
				store: productIODetailStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageProductIODetail",
				xtype: "combobox",
				editable: false,
				width: 60,
				store: Ext.create("Ext.data.ArrayStore", {
					fields: ["text"],
					data: [
						["5"],
						["10"]
					]
				}),
				value: 5,
				listeners: {
					change: {
						fn: function() {
							productIODetailStore.pageSize = Ext.getCmp("comboCountPerPageProductIODetail").getValue();
							productIODetailStore.currentPage = 1;
							Ext.getCmp("pagingToolbarProductIODetail").doRefresh();
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
					this.getView().refresh();
				},
				select: function(view, record, item, index, e) {
					var data = this.getSelectionModel().getSelection();
					for (var i = 0; i < summaryFilters.length; i++) {
						records['detail_' + summaryFilters[i]] = 0;
					}
					for (var i = 0; i < data.length; i++) {
						for (var j = 0; j < summaryFilters.length; j++) {
							var itemname = summaryFilters[j];
							records['detail_' + itemname] += (Number.parseFloat(data[i].raw[itemname]) || 0);
						}
					}
					// this.getView().refresh();
				},
				deselect: function(view, record, item, index, e) {
					var data = this.getSelectionModel().getSelection();
					for (var i = 0; i < summaryFilters.length; i++) {
						records['detail_' + summaryFilters[i]] = 0;
					}
					for (var i = 0; i < data.length; i++) {
						for (var j = 0; j < summaryFilters.length; j++) {
							var itemname = summaryFilters[j];
							records['detail_' + itemname] += (Number.parseFloat(data[i].raw[itemname]) || 0);
						}
					}
					// this.getView().refresh();
				},
				itemdblclick: {
					fn: me.onEditProductIODetail,
					scope: me
				}
			}
		});
		// Ext.getCmp("pagingToolbarProductIODetail").doRefresh();
		me.productIODetailPanel = productIODetailPanel;
		var summaryColumns = me.productIODetailPanel.columns;
		for (var i = 0; i < summaryColumns.length; i++) {
			var itemname = summaryColumns[i].dataIndex;
			(function(itemname) {
				summaryColumns[i].summaryType = summaryFilters.indexOf(itemname) < 0 ? false : function() {
					return records['detail_' + itemname] || 0;
				}
				if (i === 1) {
					summaryColumns[0].summaryType = function() {
						return '合计'
					}
				}
			})(itemname)
		}

		return me.productIODetailPanel;
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
	onQuery4ProductIODetail: function() {
		var me = this;
		me.refreshProductIODetail();
	},
	refreshProductIODetail: function() {
		Ext.getCmp("pagingToolbarProductIODetail").doRefresh();
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
	onEditProductIODetail: function() {
		var me = this;
	},


	//产品进销汇总表
	getProductJinXiaoSumGrid: function() {
		var me = this;
		if (me.productJinXiaoSumPanel) {
			return me.productJinXiaoSumPanel;
		}

		//定义业务员利润分配条目数据字段模型
		Ext.define("productJinXiaoSumDataModel", {
			extend: "Ext.data.Model",
			fields: [
				"drug_name", "yewu_date", "qichu_amount", "qichu_stock_money", "jinhuo_amount", "jinhuo_huokuan",
				"xkfh_money", "xkfh_amount", "fahuo_amount", "fahuo_money", "qimo_amount", "qimo_stock_money", "note"
			]
		});

		var productJinXiaoSumStore = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: "productJinXiaoSumDataModel",
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Report/getProductJinXiaoSumList",
				reader: {
					root: 'productJinXiaoSumList',
					totalProperty: 'totalCount'
				}
			}
		});
		productJinXiaoSumStore.on("beforeload", function() {
			productJinXiaoSumStore.proxy.extraParams = me.getQueryParam4ProductJinXiaoSum();
		});
		productJinXiaoSumStore.on("load", function(e, records, successful) {
			if (successful) {

			}
		});
		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 0, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
		});

		//定义一个业务员利润分配条目列表实例
		var productJinXiaoSumPanel = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true,
				forceFit: true
			},
			title: "产品进销汇总表",
			selModel: sm,
			columnLines: true,
			features: [{
				ftype: 'summary',
				dock: 'bottom'
			}],
			tbar: [{
				id: "editQueryDrug4JinXiaoSum",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "品种",
				margin: "5, 0, 0, 0",
				xtype: "psi_drug_field",
			}, {
				id: "editQueryStartDate4ProductJinXiaoSum",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "起始年月份",
				xtype: 'monthfield',
				margin: "5, 0, 0, 0",
				format: "Y-m",
				width: 150,
				value: new Date("2017-1-1"),
				listeners: {
					specialkey: {
						fn: me.onQueryEditSpecialKey,
						scope: me
					}
				}
			}, {
				id: "editQueryEndDate4ProductJinXiaoSum",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "截止年月份",
				xtype: 'monthfield',
				margin: "5, 0, 0, 0",
				format: "Y-m",
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
					handler: me.onQuery4ProductJinXiaoSum,
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
					handler: me.onExportGrid2Excel4ProductJinXiaoSum,
					scope: me
				}]
			}],
			columns: [{
					text: "产品进销汇总表",
					columns: [

						{
							text: "品种",
							width: 120,
							dataIndex: 'drug_name',
							sortable: true
						}, {
							text: "月份",
							width: 120,
							dataIndex: 'yewu_date',
							sortable: true
						}, {
							text: "期初",
							columns: [{
								text: "数量",
								width: 70,
								dataIndex: 'qichu_amount',
								sortable: true
							}, {
								text: "库存资金",
								width: 70,
								dataIndex: 'qichu_stock_money',
								sortable: true
							}, ]
						}, {
							text: "进货",
							columns: [{
								text: "数量",
								width: 70,
								dataIndex: 'jinhuo_amount',
								sortable: true
							}, {
								text: "货款",
								width: 70,
								dataIndex: 'jinhuo_huokuan',
								sortable: true
							}, ]
						}, {
							text: "现款发货",
							columns: [{
								text: "数量",
								width: 70,
								dataIndex: 'xkfh_amount',
								sortable: true
							}, {
								text: "金额",
								width: 70,
								dataIndex: 'xkfh_money',
								sortable: true
							}, ]
						}, {
							text: "发货",
							columns: [{
								text: "数量",
								width: 70,
								dataIndex: 'fahuo_amount',
								sortable: true
							}, {
								text: "金额",
								width: 70,
								dataIndex: 'fahuo_money',
								sortable: true
							}, ]
						}, {
							text: "期末库存",
							columns: [{
								text: "数量",
								width: 70,
								dataIndex: 'qimo_amount',
								sortable: true
							}, {
								text: "库存资金",
								width: 70,
								dataIndex: 'qimo_stock_money',
								sortable: true
							}, ]
						}, {
							text: "备注",
							width: 100,
							dataIndex: 'note',
							sortable: true
						},
					]
				}

			],
			store: productJinXiaoSumStore,
			bbar: [{
				id: "pagingToolbarProductJinXiaoSum",
				border: 0,
				xtype: "pagingtoolbar",
				store: productJinXiaoSumStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageProductJinXiaoSum",
				xtype: "combobox",
				editable: false,
				width: 60,
				store: Ext.create("Ext.data.ArrayStore", {
					fields: ["text"],
					data: [
						["5"],
						["10"],
						["15"],
					]
				}),
				value: 5,
				listeners: {
					change: {
						fn: function() {
							productJinXiaoSumStore.pageSize = Ext.getCmp("comboCountPerPageProductJinXiaoSum").getValue();
							productJinXiaoSumStore.currentPage = 1;
							Ext.getCmp("pagingToolbarProductJinXiaoSum").doRefresh();
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
					this.getView().refresh();
				},
				select: function(view, record, item, index, e) {
					var data = this.getSelectionModel().getSelection();
					console.log(data)
					for (var i = 0; i < summaryFilters.length; i++) {
						records['jinxiao_' + summaryFilters[i]] = 0;
					}
					for (var i = 0; i < data.length; i++) {
						for (var j = 0; j < summaryFilters.length; j++) {
							var itemname = summaryFilters[j];
							records['jinxiao_' + itemname] += (Number.parseFloat(data[i].raw[itemname]) || 0);
						}
					}
					// this.getView().refresh();
				},
				deselect: function(view, record, item, index, e) {
					var data = this.getSelectionModel().getSelection();
					console.log(data)
					for (var i = 0; i < summaryFilters.length; i++) {
						records['jinxiao_' + summaryFilters[i]] = 0;
					}
					for (var i = 0; i < data.length; i++) {
						for (var j = 0; j < summaryFilters.length; j++) {
							var itemname = summaryFilters[j];
							records['jinxiao_' + itemname] += (Number.parseFloat(data[i].raw[itemname]) || 0);
						}
					}
					// this.getView().refresh();
				},
				itemdblclick: {
					fn: me.onEditProductJinXiaoSum,
					scope: me
				}
			}
		});
		me.productJinXiaoSumPanel = productJinXiaoSumPanel;

		var summaryColumns = me.productJinXiaoSumPanel.columns;
		for (var i = 0; i < summaryColumns.length; i++) {
			var itemname = summaryColumns[i].dataIndex;
			(function(itemname) {
				summaryColumns[i].summaryType = summaryFilters.indexOf(itemname) < 0 ? false : function() {
					return records['jinxiao_' + itemname] || 0;
				}
				if (i === 1) {
					summaryColumns[0].summaryType = function() {
						return '合计'
					}
				}
			})(itemname)
		}

		return me.productJinXiaoSumPanel;
	},
	getQueryParam4ProductJinXiaoSum: function() {
		var result = {};
		var date_s = Ext.getCmp("editQueryStartDate4ProductJinXiaoSum").getValue();
		if (date_s) {
			result.date_s = Ext.Date.format(date_s, "Y-m");
		}

		var date_e = Ext.getCmp("editQueryEndDate4ProductJinXiaoSum").getValue();
		if (date_e) {
			result.date_e = Ext.Date.format(date_e, "Y-m");
		}

		if (date_s > date_e) {
			PSI.MsgBox.showInfo("起始日期不能大于截止日期！");
			return;
		}
		var drug_id = Ext.getCmp("editQueryDrug4JinXiaoSum").getIdValue();
		if (drug_id) {
			result.drug_id = drug_id;
		}
		return result;
	},
	onQuery4ProductJinXiaoSum: function() {
		var me = this;
		me.refreshProductJinXiaoSum();
	},
	refreshProductJinXiaoSum: function() {
		Ext.getCmp("pagingToolbarProductJinXiaoSum").doRefresh();
	},
	onExportGrid2Excel4ProductJinXiaoSum: function() {
		var me = this;
		var config = {
			store: me.productJinXiaoSumPanel.getStore(),
			title: "业务分析报表产品代理协议报表"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(me.productJinXiaoSumPanel, config); //调用导出函数
	},
	onEditProductJinXiaoSum: function() {
		var me = this;
	},


	//产品应收账款汇总表
	getProduct2ReceiveMoneyGrid: function() {
		var me = this;
		if (me.product2ReceiveMoneyPanel) {
			return me.product2ReceiveMoneyPanel;
		}

		//定义业务员利润分配条目数据字段模型
		Ext.define("product2ReceiveMoneyDataModel", {
			extend: "Ext.data.Model",
			fields: [
				"drug_name", "deliver",
				"end_should_receive_amount", "end_should_receive__money", "puhuo_amount", "puhuo_unitprice", "puhuo_sum_money",
				"huikuan_amount", "huikuan_sum_money",
				"month_end_should_amount", "month_end_should_sum_money",
				"note"
			]
		});

		var product2ReceiveMoneyStore = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: "product2ReceiveMoneyDataModel",
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Report/getProduct2ReceiveMoneyList",
				reader: {
					root: 'product2ReceiveMoneyList',
					totalProperty: 'totalCount'
				}
			}
		});
		product2ReceiveMoneyStore.on("beforeload", function() {
			product2ReceiveMoneyStore.proxy.extraParams = me.getQueryParam4Product2ReceiveMoney();
		});
		product2ReceiveMoneyStore.on("load", function(e, records, successful) {
			if (successful) {

			}
		});
		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 0, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
		});

		//定义一个业务员利润分配条目列表实例
		var product2ReceiveMoneyPanel = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true,
				forceFit: true
			},
			title: "产品应收账款汇总表",
			selModel: sm,
			features: [{
				ftype: 'summary',
				dock: 'bottom'
			}],
			columnLines: true,
			tbar: [{
				id: "editQueryDrug42ReceiveMoney",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "品种",
				margin: "5, 0, 0, 0",
				xtype: "psi_drug_field",
			}, {
				id: "editQueryDate4Product2ReceiveMoney",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "年月份",
				xtype: 'monthfield',
				margin: "5, 0, 0, 0",
				format: "Y-m",
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
					handler: me.onQuery4Product2ReceiveMoney,
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
					handler: me.onExportGrid2Excel4Product2ReceiveMoney,
					scope: me
				}]
			}],
			columns: [{
					text: "产品应收账款",
					columns: [

						{
							text: "品种",
							width: 120,
							dataIndex: 'drug_name',
							sortable: true
						}, {
							text: "月份",
							width: 70,
							dataIndex: 'date_month',
							sortable: true
						}, {
							text: "商业公司",
							width: 70,
							dataIndex: 'deliver',
							sortable: true
						}, {
							text: "末应收账款",
							columns: [{
								text: "数量",
								width: 70,
								dataIndex: 'end_should_receive_amount',
								sortable: true
							}, {
								text: "金额",
								width: 70,
								dataIndex: 'end_should_receive__money',
								sortable: true
							}, ]
						}, {
							text: "铺货",
							columns: [{
								text: "数量",
								width: 70,
								dataIndex: 'puhuo_amount',
								sortable: true
							}, {
								text: "单价",
								width: 70,
								dataIndex: 'puhuo_unitprice',
								sortable: true
							}, {
								text: "金额",
								width: 70,
								dataIndex: 'puhuo_sum_money',
								sortable: true
							}, ]
						}, {
							text: "回款",
							columns: [{
								text: "数量",
								width: 70,
								dataIndex: 'huikuan_amount',
								sortable: true
							}, {
								text: "金额",
								width: 70,
								dataIndex: 'huikuan_sum_money',
								sortable: true
							}, ]
						}, {
							text: "月末营收账款",
							columns: [{
								text: "数量",
								width: 70,
								dataIndex: 'month_end_should_amount',
								sortable: true
							}, {
								text: "金额",
								width: 70,
								dataIndex: 'month_end_should_sum_money',
								sortable: true
							}, ]
						}, {
							text: "备注",
							width: 100,
							dataIndex: 'note',
							sortable: true
						},
					]
				}

			],
			store: product2ReceiveMoneyStore,
			bbar: [{
				id: "pagingToolbarProduct2ReceiveMoney",
				border: 0,
				xtype: "pagingtoolbar",
				store: product2ReceiveMoneyStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageProduct2ReceiveMoney",
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
							product2ReceiveMoneyStore.pageSize = Ext.getCmp("comboCountPerPageProduct2ReceiveMoney").getValue();
							product2ReceiveMoneyStore.currentPage = 1;
							Ext.getCmp("pagingToolbarProduct2ReceiveMoney").doRefresh();
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
					this.getView().refresh();
				},
				select: function(view, record, item, index, e) {
					var data = this.getSelectionModel().getSelection();
					for (var i = 0; i < summaryFilters.length; i++) {
						records['receive' + summaryFilters[i]] = 0;
					}
					for (var i = 0; i < data.length; i++) {
						for (var j = 0; j < summaryFilters.length; j++) {
							var itemname = summaryFilters[j];
							records['receive' + itemname] += (Number.parseFloat(data[i].raw[itemname]) || 0);
						}
					}
					// this.getView().refresh();
				},
				deselect: function(view, record, item, index, e) {
					var data = this.getSelectionModel().getSelection();
					for (var i = 0; i < summaryFilters.length; i++) {
						records['receive' + summaryFilters[i]] = 0;
					}
					for (var i = 0; i < data.length; i++) {
						for (var j = 0; j < summaryFilters.length; j++) {
							var itemname = summaryFilters[j];
							records['receive' + itemname] += (Number.parseFloat(data[i].raw[itemname]) || 0);
						}
					}
					// this.getView().refresh();
				},
				itemdblclick: {
					fn: me.onEditProduct2ReceiveMoney,
					scope: me
				}
			}
		});
		me.product2ReceiveMoneyPanel = product2ReceiveMoneyPanel;

		var summaryColumns = me.product2ReceiveMoneyPanel.columns;
		for (var i = 0; i < summaryColumns.length; i++) {
			var itemname = summaryColumns[i].dataIndex;
			(function(itemname) {
				summaryColumns[i].summaryType = summaryFilters.indexOf(itemname) < 0 ? false : function() {
					return records['receive' + itemname] || 0;
				}
				if (i === 1) {
					summaryColumns[0].summaryType = function() {
						return '合计'
					}
				}
			})(itemname)
		}

		return me.product2ReceiveMoneyPanel;
	},
	getQueryParam4Product2ReceiveMoney: function() {
		var result = {};
		var date = Ext.getCmp("editQueryDate4Product2ReceiveMoney").getValue();
		if (date) {
			result.date = Ext.Date.format(date, "Y-m");
		}

		var drug_id = Ext.getCmp("editQueryDrug42ReceiveMoney").getIdValue();
		if (drug_id) {
			result.drug_id = drug_id;
		}
		return result;
	},
	onQuery4Product2ReceiveMoney: function() {
		var me = this;
		me.refreshProduct2ReceiveMoney();
	},
	refreshProduct2ReceiveMoney: function() {
		Ext.getCmp("pagingToolbarProduct2ReceiveMoney").doRefresh();
	},
	onExportGrid2Excel4Product2ReceiveMoney: function() {
		var me = this;
		var config = {
			store: me.product2ReceiveMoneyPanel.getStore(),
			title: "业务分析报表产品代理协议报表"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(me.product2ReceiveMoneyPanel, config); //调用导出函数
	},
	onEditProduct2ReceiveMoney: function() {
		var me = this;
	},


	//铺货利润表
	getProductPuHuoProfitGrid: function() {
		var me = this;
		if (me.productPuHuoProfitPanel) {
			return me.productPuHuoProfitPanel;
		}

		//定义业务员利润分配条目数据字段模型
		Ext.define("productPuHuoProfitDataModel", {
			extend: "Ext.data.Model",
			fields: [
				"drug_name", "date_month", "sell_amount", "sell_unit_price", "sell_sum_money",
				"buy_amount", "buy_unit_price", "buy_sum_money", "price_gap", "tax_sum_money",
				"other_out", "gross_profit", "note"
			]
		});

		var productPuHuoProfitStore = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: "productPuHuoProfitDataModel",
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Report/getProductPuHuoProfitList",
				reader: {
					root: 'productPuHuoProfitList',
					totalProperty: 'totalCount'
				}
			}
		});
		productPuHuoProfitStore.on("beforeload", function() {
			productPuHuoProfitStore.proxy.extraParams = me.getQueryParam4ProductPuHuoProfit();
		});
		productPuHuoProfitStore.on("load", function(e, records, successful) {
			if (successful) {

			}
		});

		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 0, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
		});
		//定义一个业务员利润分配条目列表实例
		var productPuHuoProfitPanel = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true,
				forceFit: true
			},
			title: "产品铺货利润表",
			selModel: sm,
			features: [{
				ftype: 'summary',
				dock: 'bottom'
			}],
			columnLines: true,
			tbar: [{
				id: "editQueryDrug4PuHuoProfit",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "品种",
				margin: "5, 0, 0, 0",
				xtype: "psi_drug_field",
			}, {
				id: "editQueryDate4ProductPuHuoProfit",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "年月份",
				xtype: 'monthfield',
				margin: "5, 0, 0, 0",
				format: "Y-m",
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
					handler: me.onQuery4ProductPuHuoProfit,
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
					handler: me.onExportGrid2Excel4ProductPuHuoProfit,
					scope: me
				}]
			}],
			columns: [{
					text: "产品铺货利润表",
					columns: [

						{
							text: "品种",
							width: 120,
							dataIndex: 'drug_name',
							sortable: true
						}, {
							text: "月份",
							width: 70,
							dataIndex: 'date_month',
							sortable: true
						}, {
							text: "销售数量",
							width: 70,
							dataIndex: 'sell_amount',
							sortable: true
						}, {
							text: "销售价",
							width: 70,
							dataIndex: 'sell_unit_price',
							sortable: true
						}, {
							text: "销售金额",
							width: 70,
							dataIndex: 'sell_sum_money',
							sortable: true
						}, {
							text: "采购数量",
							width: 70,
							dataIndex: 'buy_amount',
							sortable: true
						}, {
							text: "采购单价",
							width: 70,
							dataIndex: 'buy_unit_price',
							sortable: true
						}, {
							text: "采购金额",
							width: 70,
							dataIndex: 'buy_sum_money',
							sortable: true
						}, {
							text: "差额",
							width: 70,
							dataIndex: 'price_gap',
							sortable: true
						}, {
							text: "税金",
							width: 70,
							dataIndex: 'tax_sum_money',
							sortable: true
						}, {
							text: "结算费",
							width: 70,
							dataIndex: 'other_out',
							sortable: true
						}, {
							text: "毛利",
							width: 70,
							dataIndex: 'gross_profit',
							sortable: true
						}, {
							text: "备注",
							width: 100,
							dataIndex: 'note',
							sortable: true
						},
					]
				}

			],
			store: productPuHuoProfitStore,
			bbar: [{
				id: "pagingToolbarProductPuHuoProfit",
				border: 0,
				xtype: "pagingtoolbar",
				store: productPuHuoProfitStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageProductPuHuoProfit",
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
							productPuHuoProfitStore.pageSize = Ext.getCmp("comboCountPerPageProductPuHuoProfit").getValue();
							productPuHuoProfitStore.currentPage = 1;
							Ext.getCmp("pagingToolbarProductPuHuoProfit").doRefresh();
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
							records[itemname] += (Number.parseFloat(data[i].raw[itemname]) || 0);
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
							records[itemname] += (Number.parseFloat(data[i].raw[itemname]) || 0);
						}
					}
					// this.getView().refresh();
				},
				itemdblclick: {
					fn: me.onEditProductPuHuoProfit,
					scope: me
				}
			}
		});
		me.productPuHuoProfitPanel = productPuHuoProfitPanel;

		var summaryColumns = me.productPuHuoProfitPanel.columns;
		for (var i = 0; i < summaryColumns.length; i++) {
			var itemname = summaryColumns[i].dataIndex;
			(function(itemname) {
				summaryColumns[i].summaryType = summaryFilters.indexOf(itemname) < 0 ? false : function() {
					return records[itemname] || 0;
				}
				if (i === 1) {
					summaryColumns[0].summaryType = function() {
						return '合计'
					}
				}
			})(itemname)
		}
		return me.productPuHuoProfitPanel;
	},
	getQueryParam4ProductPuHuoProfit: function() {
		var result = {};
		var date = Ext.getCmp("editQueryDate4ProductPuHuoProfit").getValue();
		if (date) {
			result.date = Ext.Date.format(date, "Y-m");
		}

		var drug_id = Ext.getCmp("editQueryDrug4PuHuoProfit").getIdValue();
		if (drug_id) {
			result.drug_id = drug_id;
		}
		return result;
	},
	onQuery4ProductPuHuoProfit: function() {
		var me = this;
		me.refreshProductPuHuoProfit();
	},
	refreshProductPuHuoProfit: function() {
		Ext.getCmp("pagingToolbarProductPuHuoProfit").doRefresh();
	},
	onExportGrid2Excel4ProductPuHuoProfit: function() {
		var me = this;
		var config = {
			store: me.productPuHuoProfitPanel.getStore(),
			title: "业务分析报表产品代理协议报表"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(me.productPuHuoProfitPanel, config); //调用导出函数
	},
	onEditProductPuHuoProfit: function() {
		var me = this;
	},

	onClearQuery: function() {
		var me = this;
		Ext.getCmp("editQueryDrug4IODetail").setValue('');
		Ext.getCmp("editQueryDrug4IODetail").setIdValue(null);
		Ext.getCmp("editQueryDate4ProductIODetail").setValue(new Date());

		Ext.getCmp("editQueryDrug4JinXiaoSum").setValue('');
		Ext.getCmp("editQueryDrug4JinXiaoSum").setIdValue(null);
		Ext.getCmp("editQueryStartDate4ProductJinXiaoSum").setValue(new Date());
		Ext.getCmp("editQueryEndDate4ProductJinXiaoSum").setValue(new Date());

		Ext.getCmp("editQueryDrug42ReceiveMoney").setIdValue(null);
		Ext.getCmp("editQueryDrug42ReceiveMoney").setValue('');
		Ext.getCmp("editQueryDate4Product2ReceiveMoney").setValue(new Date());

		Ext.getCmp("editQueryDrug4PuHuoProfit").setValue('');
		Ext.getCmp("editQueryDrug4PuHuoProfit").setIdValue(null);
		Ext.getCmp("editQueryDate4ProductPuHuoProfit").setValue(new Date());
	},


});