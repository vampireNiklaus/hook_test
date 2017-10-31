/**
 * 付款单 - 主界面
 */
//付款单状态常量定义
var SELF_PAY_STATUS_2EDIT = '0'; //待编辑
var SELF_PAY_STATUS_2FUND = '1'; //已编辑，待打款
var SELF_PAY_STATUS_FUND_DENIED = '2'; //未通过打款
var SELF_PAY_STATUS_FUND_PASSED = '3'; //已打款，待复核
var SELF_PAY_STATUS_VERIFY_PASSED = '4'; //审核通过
var SELF_PAY_STATUS_VERIFY_DENIED = '5'; //审核不通过
var SELF_PAY_STATUS_STOCK_BACK = '6'; //入库单被撤回
var defaultDate = new Date("2017-1-1");

Ext.define("PSI.SelfPay.MainForm", {
	extend: "Ext.panel.Panel",
	config: {
		pEditSelfPayBill: null,
		pDeleteSelfPayBill: null,
		pImportSelfPayBill: null,
		pExportSelfPayBill: null,
		pVerifySelfPayBill: null,
		pRevertVerifySelfPayBill: null
	},
	//页面初始化
	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			border: 0,
			layout: "border",
			//获取工具栏
			tbar: [{
				text: "编辑-提交付款单",
				iconCls: "PSI-button-edit",
				scope: me,
				handler: me.onEditBill,
				disabled: me.getPEditSelfPayBill() == "0",
				id: "buttonEdit"
			}, "-", {
				text: "删除付款单",
				iconCls: "PSI-button-delete",
				disabled: me.getPDeleteSelfPayBill() == "0",
				scope: me,
				handler: me.onDeleteBill,
				id: "buttonDelete"
			}, "-", {
				text: "审核",
				// disabled : me.getPVerifySelfPayBill() == "0",
				iconCls: "PSI-button-verify",
				scope: me,
				handler: me.onCommit,
				id: "buttonVerify"
			}, {
				text: "反审核",
				// disabled : me.getPRevertVerifySelfPayBill() == "0",
				iconCls: "PSI-button-revert-verify",
				scope: me,
				handler: me.onCommitReturn,
				id: "buttonRevertVerify"
			}, "-", {
				text: "导入自销付款单列表",
				disabled: me.getPImportSelfPayBill() == "0",
				iconCls: "PSI-button-excelimport",
				handler: me.onImportSelfPurchase,
				scope: me
			}, "-", {
				text: "帮助",
				iconCls: "PSI-help",
				handler: function() {
					window
						.open("http://www.kangcenet.com");
				}
			}, "-", {
				text: "关闭",
				iconCls: "PSI-button-exit",
				handler: function() {
					location.replace(PSI.Const.BASE_URL);
				}
			}],
			items: [{
				region: "north",
				height: 0,
				border: 0,
				title: "查询条件",
				collapsible: true,
				layout: {
					type: "table",
					columns: 4
				},
				//获取查询栏
				items: me.getQueryCmp()
			}, {
				region: "center",
				layout: "border",
				border: 0,
				items: [{
					region: "north",
					height: "50%",
					split: true,
					layout: "fit",
					border: 0,
					//获取未编辑付款单
					items: [me.getUnEditedGrid()]
				}, {
					region: "north",
					height: 60,
					border: 0,
					title: "查询条件",
					collapsible: true,
					layout: {
						type: "table",
						columns: 2
					},
					//获取查询栏
					items: me.getQueryCmp2()
				}, {
					region: "center",
					layout: "fit",
					border: 0,
					//获取已编辑付款单
					items: [me.getEditedGrid()]
				}]
			}]
		});

		me.callParent(arguments);
		me.refreshUnEditedGrid(1);
		me.refreshEditedGrid(1);
	},

	getQueryCmp: function() {
		var me = this;
		return [{
			id: "editQueryBillStatus",
			xtype: "combo",
			editable: false,
			queryMode: "local",
			editable: false,
			valueField: "id",
			labelWidth: 60,
			labelAlign: "right",
			labelSeparator: "",
			fieldLabel: "状态",
			margin: "5, 0, 0, 0",
			store: Ext.create("Ext.data.ArrayStore", {
				fields: ["id", "text"],
				data: [
					[-1, "全部"],
					[0, "待入库"],
					[1000, "已入库"]
				]
			}),
			value: -1
		}, {
			id: "editQueryRef",
			labelWidth: 60,
			labelAlign: "right",
			labelSeparator: "",
			fieldLabel: "采购单号",
			margin: "5, 0, 0, 0",
			xtype: "textfield"
		}, {
			id: "editQueryFromDT",
			xtype: "datefield",
			margin: "5, 0, 0, 0",
			format: "Y-m-d",
			labelAlign: "right",
			labelSeparator: "",
			value: new Date(defaultDate),
			fieldLabel: "业务日期（起）"
		}, {
			id: "editQueryToDT",
			xtype: "datefield",
			margin: "5, 0, 0, 0",
			format: "Y-m-d",
			labelAlign: "right",
			labelSeparator: "",
			value: new Date(),
			fieldLabel: "业务日期（止）"
		}, {
			id: "editQueryPaymentType",
			labelAlign: "right",
			labelSeparator: "",
			fieldLabel: "付款方式",
			margin: "5, 0, 0, 0",
			xtype: "combo",
			editable: false,
			queryMode: "local",
			editable: false,
			valueField: "id",
			store: Ext.create("Ext.data.ArrayStore", {
				fields: ["id", "text"],
				data: [
					[-1, "全部"],
					[0, "记应付账款"],
					[1, "现金付款"],
					[2, "预付款"]
				]
			}),
			value: -1
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

	getQueryCmp2: function() {
		var me = this;
		return [{
			id: "editQueryBillStatus2",
			xtype: "combo",
			editable: false,
			queryMode: "local",
			editable: false,
			valueField: "id",
			labelWidth: 60,
			labelAlign: "right",
			labelSeparator: "",
			fieldLabel: "状态",
			margin: "5, 0, 0, 0",
			store: Ext.create("Ext.data.ArrayStore", {
				fields: ["id", "text"],
				data: [
					[-1, "全部"],
					[0, "待编辑"],
					[1, "已编辑，待打款"],
					[2, "未通过打款"],
					[3, "已打款，待复核"],
					[4, "审核通过"],
					[5, "审核不通过"],
					[6, "入库单被撤回"],
				]
			}),
			value: -1
		}, {
			xtype: "container",
			items: [{
				xtype: "button",
				text: "查询",
				width: 100,
				margin: "5 0 0 10",
				iconCls: "PSI-button-refresh",
				handler: me.onQuery2,
				scope: me
			}]
		}];
	},

	//获取未编辑的付款单
	getUnEditedGrid: function() {
		var me = this;
		if (me.unEditedGrid) {
			return me.unEditedGrid;
		}

		var modelName = "PSISelfPayBill";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "drug_id", 'common_name', 'goods_name', 'jx', 'guige', 'manufacturer',
				'bill_code', "buy_bill_id", "supplier_id", 'supplier_name', 'kaidan_ren', 'kpgs_name',
				"kpgs_id", "unit", "unit_price", 'kaipiao_unit_price', 'sum_kaipiao_money',
				"sum_pay_money", "pay_amount", "buy_date", 'buy_bill_code',
				"yewu_date", 'tax_unit_price', 'sum_tax_money', 'status', 'status_str', 'operate_info'
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
				url: PSI.Const.BASE_URL + "Home/SelfPay/listSelfPayUnEdit",
				reader: {
					root: 'selfPayList',
					totalProperty: 'totalCount'
				}
			}
		});
		store.on("beforeload", function() {
			store.proxy.extraParams = me.getQueryParam();
		});
		store.on("load", function(e, records, successful) {
			if (successful) {
				me.gotoUnEditedGridRecord(me.__lastId);
			}
		});

		me.unEditedGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			border: 0,
			title: "未编辑付款单列表",
			columnLines: true,
			columns: [Ext.create("Ext.grid.RowNumberer", {
					text: "序号",
					width: 30
				}), {
					header: "状态",
					dataIndex: "status_str",
					menuDisabled: false,
					sortable: true,
				}, {
					header: "系统单号",
					dataIndex: "bill_code",
					menuDisabled: false,
					sortable: false
				}, {
					header: "药品通用名",
					dataIndex: "common_name",
					menuDisabled: false,
					sortable: true
				}, {
					header: "药品商品名",
					dataIndex: "goods_name",
					menuDisabled: false,
					sortable: true
				}, {
					header: "剂型",
					dataIndex: "jx",
					menuDisabled: false,
					sortable: true
				}, {
					header: "规格",
					dataIndex: "guige",
					menuDisabled: false,
					sortable: true
				}, {
					header: "生产产家",
					dataIndex: "manufacturer",
					menuDisabled: false,
					sortable: true
				}, {
					header: "供应商",
					dataIndex: "supplier_name",
					menuDisabled: false,
					sortable: true
				}, {
					header: "开票公司",
					dataIndex: "kpgs_name",
					menuDisabled: false,
					sortable: true
				}, {
					header: "买货数量",
					dataIndex: "pay_amount",
					menuDisabled: false,
				}, {
					header: "买货单价",
					dataIndex: "unit_price",
					menuDisabled: false,
				}, {
					header: "买货金额",
					dataIndex: "sum_pay_money",
					menuDisabled: false,
					sortable: true
				},
				// 	{
				// 	header : "开票单价",
				// 	dataIndex : "kaipiao_unit_price",
				// 	menuDisabled : false,
				// 	sortable : true
				// }, {
				//
				// 	header : "开票金额",
				// 	dataIndex : "sum_kaipiao_money",
				// 	menuDisabled : false,
				// 	sortable : true
				// }, {
				// 	header : "税价",
				// 	dataIndex : "tax_unit_price",
				// 	menuDisabled : false,
				// 	sortable : true
				// }, {
				// 	header : "税额",
				// 	dataIndex : "sum_tax_money",
				// 	menuDisabled : false,
				// 	sortable : true
				// },
				{
					header: "采购日期",
					dataIndex: "buy_date",
					menuDisabled: false,
					sortable: true
				}, {
					header: "开单日期",
					dataIndex: "yewu_date",
					menuDisabled: false,
					sortable: true
				}, {
					header: "操作详情",
					dataIndex: "operate_info",
					menuDisabled: false,
					sortable: true
				}
			],
			store: store,
			tbar: [{
				id: "pagingToobarUnEdited",
				xtype: "pagingtoolbar",
				border: 0,
				store: store
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageUnEdited",
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
							store.pageSize = Ext.getCmp("comboCountPerPage").getValue();
							store.currentPage = 1;
							Ext.getCmp("pagingToobar").doRefresh();
						},
						scope: me
					}
				}
			}, {
				xtype: "displayfield",
				value: "条记录"
			}, {
				text: "导出未编辑付款单信息",
				disabled: me.getPExportSelfPayBill() == "0",
				iconCls: "PSI-button-excelexport",
				handler: me.onExportSelfPurchase1,
				scope: me
			}],
			listeners: {
				select: {
					fn: me.onUnEditedGridSelect,
					scope: me
				},
				itemdblclick: {
					fn: me.onEditBill,
					scope: me
				}
			}
		});
		me.unEditedGrid.getView().on('render', function(view) {
			view.tip = Ext.create('Ext.tip.ToolTip', {
				width: 300,
				title: '付款单详情',
				padding: '5',
				// 所有的目标元素
				target: view.el,
				// 每个网格行导致其自己单独的显示和隐藏。
				delegate: view.itemSelector,
				// 在行上移动不能隐藏提示框
				trackMouse: true,
				// 立即呈现，tip.body可参照首秀前。
				renderTo: Ext.getBody(),
				autoHide: false,
				listeners: {
					// 当元素被显示时动态改变内容.
					beforeshow: function updateTipBody(tip) {
						var re = view.getRecord(tip.triggerElement);
						tip.update(
							"状态：" + re.get('status_str') + "</br>" +
							"系统单号：" + re.get('bill_code') + "</br>" +
							"药品通用名：" + re.get('common_name') + "</span></br>" +
							"药品商品名：" + re.get('goods_name') + "</span></br>" +
							"<span style='margin-right: 20px'>剂型：" + re.get('jx') + "</span>规格：" + re.get('guige') + "</br>" +
							"生产公司：" + re.get('manufacturer') + "</br>" +
							"供应商：" + re.get('supplier_name') + "</br>" +
							"开票公司：" + re.get('kpgs_name') + "</br>" +
							"买货数量：<b style='color:red'>" + re.get('pay_amount') + "</b></br>" +
							"<span style='margin-right: 20px'>买货单价：<b style='color:red'>" + re.get('unit_price') +
							"</b></span>买货金额：<b style='color:red'>" + re.get('sum_pay_money') + "</b></br>" +
							// "<span style='margin-right: 20px'>开票单价：<b style='color:red'>"+re.get('kaipiao_unit_price') +
							// "</b></span>开票金额：<b style='color:red'>"+re.get('sum_kaipiao_money')+"</b></br>"+
							// "<span style='margin-right: 20px'>税价：<b style='color:red'>"+re.get('tax_unit_price') +
							// "</b></span>税额：<b style='color:red'>"+re.get('sum_tax_money')+"</b></br>"+
							"开单日期：" + re.get('yewu_date') + "</br>" +
							"采购日期：" + re.get('buy_date') + "</br>" +
							"开单人：" + re.get('kandan_ren') + "</br>"
							// "操作详情：" + re.get('operate_info')
						);
					}
				}
			});
		});

		return me.unEditedGrid;
	},

	getEditedGrid: function() {
		var me = this;
		if (me.editedGrid) {
			return me.editedGrid;
		}

		var modelName = "PSISelfPayBill";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "drug_id", 'common_name', 'goods_name', 'jx', 'guige', 'bill_code',
				"buy_bill_id", 'buy_bill_code', "supplier_id", 'manufacturer', 'supplier_name', 'kpgs_name',
				"unit", "unit_price", 'kaipiao_unit_price', 'sum_kaipiao_money',
				"sum_pay_money", "pay_amount", "buy_date", 'note', 'fund_date',
				"yewu_date", 'kaidan_ren', 'tax_unit_price', 'sum_tax_money', 'status', 'status_str',
				'pay_1st_account_str', 'pay_2nd_account_str', 'pay_1st_amount', 'pay_2nd_amount',
				'pay_1st_account', 'pay_2nd_account',
				'pay_1st_account_name', 'pay_1st_account_num', 'pay_2nd_account_name', 'pay_2nd_account_num', 'operate_info'
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
				url: PSI.Const.BASE_URL + "Home/SelfPay/listSelfPayEdit",
				reader: {
					root: 'selfPayList',
					totalProperty: 'totalCount'
				}
			}
		});
		store.on("beforeload", function() {
			store.proxy.extraParams = me.getQueryParam();
		});
		store.on("load", function(e, records, successful) {
			if (successful) {
				me.gotoEditedGridRecord(me.__lastId);
			}
		});
		me.editedGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			border: 0,
			title: "已编辑付款单列表",
			columnLines: true,
			columns: [Ext.create("Ext.grid.RowNumberer", {
					text: "序号",
					width: 30
				}), {
					header: "状态",
					dataIndex: "status_str",
					menuDisabled: false,
					sortable: true,
				}, {
					header: "系统单号",
					dataIndex: "bill_code",
					menuDisabled: false,
					sortable: false
				}, {
					header: "药品通用名",
					dataIndex: "common_name",
					menuDisabled: false,
					sortable: true
				}, {
					header: "药品商品名",
					dataIndex: "goods_name",
					menuDisabled: false,
					sortable: true
				}, {
					header: "剂型",
					dataIndex: "jx",
					menuDisabled: false,
					sortable: true
				}, {
					header: "规格",
					dataIndex: "guige",
					menuDisabled: false,
					sortable: true
				}, {
					header: "生产产家",
					dataIndex: "manufacturer",
					menuDisabled: false,
					sortable: true
				}, {
					header: "供应商",
					dataIndex: "supplier_name",
					menuDisabled: false,
					sortable: true
				}, {
					header: "开票公司",
					dataIndex: "kpgs_name",
					menuDisabled: false,
					sortable: true
				}, {
					header: "买货数量",
					dataIndex: "pay_amount",
					menuDisabled: false,
				}, {
					header: "买货单价",
					dataIndex: "unit_price",
					menuDisabled: false,
				}, {
					header: "买货金额",
					dataIndex: "sum_pay_money",
					menuDisabled: false,
					sortable: true
				},
				// 	{
				// 	header : "开票单价",
				// 	dataIndex : "kaipiao_unit_price",
				// 	menuDisabled : false,
				// 	sortable : true
				// }, {
				//
				// 	header : "开票金额",
				// 	dataIndex : "sum_kaipiao_money",
				// 	menuDisabled : false,
				// 	sortable : true
				// }, {
				// 	header : "税价",
				// 	dataIndex : "tax_unit_price",
				// 	menuDisabled : false,
				// 	sortable : true
				// }, {
				// 	header : "税额",
				// 	dataIndex : "sum_tax_money",
				// 	menuDisabled : false,
				// 	sortable : true
				// },
				{
					header: "主付账户",
					dataIndex: "pay_1st_account_str",
					menuDisabled: false,
					sortable: true
				}, {
					header: "主付金额",
					dataIndex: "pay_1st_amount",
					menuDisabled: false,
					sortable: true
				}, {
					header: "次付账户",
					dataIndex: "pay_2nd_account_str",
					menuDisabled: false,
					sortable: true
				}, {
					header: "次付金额",
					dataIndex: "pay_2nd_amount",
					menuDisabled: false,
					sortable: true,
					renderer: function(val) {
						if (val == 0)
							return '';
						else return val;
					}
				}, {
					header: "采购日期",
					dataIndex: "buy_date",
					menuDisabled: false,
					sortable: true
				}, {
					header: "开单日期",
					dataIndex: "yewu_date",
					menuDisabled: false,
					sortable: true
				}, {
					header: "打款日期",
					dataIndex: "fund_date",
					menuDisabled: false,
					sortable: true
				}, {
					header: "备注",
					dataIndex: "note",
					menuDisabled: false,
				}, {
					header: "操作详情",
					dataIndex: "operate_info",
					menuDisabled: false,
				}
			],
			store: store,
			tbar: [{
				id: "pagingToobarEdited",
				xtype: "pagingtoolbar",
				border: 0,
				store: store
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageEdited",
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
							store.pageSize = Ext.getCmp("comboCountPerPage").getValue();
							store.currentPage = 1;
							Ext.getCmp("pagingToobar").doRefresh();
						},
						scope: me
					}
				}
			}, {
				xtype: "displayfield",
				value: "条记录"
			}, {
				text: "导出已编辑付款单信息",
				disabled: me.getPExportSelfPayBill() == "0",
				iconCls: "PSI-button-excelexport",
				handler: me.onExportSelfPurchase2,
				scope: me
			}],
			listeners: {
				select: {
					fn: me.onEditedGridSelect,
					scope: me
				},
				itemdblclick: {
					fn: me.onEditBill,
					scope: me
				}
			}
		});
		//鼠标移入，查看详情
		me.editedGrid.getView().on('render', function(view) {
			view.tip = Ext.create('Ext.tip.ToolTip', {
				width: 300,
				title: '付款单详情',
				padding: '5',
				// 所有的目标元素
				target: view.el,
				// 每个网格行导致其自己单独的显示和隐藏。
				delegate: view.itemSelector,
				// 在行上移动不能隐藏提示框
				trackMouse: true,
				// 立即呈现，tip.body可参照首秀前。
				renderTo: Ext.getBody(),
				autoHide: false,
				listeners: {
					// 当元素被显示时动态改变内容.
					beforeshow: function updateTipBody(tip) {
						var re = view.getRecord(tip.triggerElement);
						tip.update(
							"状态：" + re.get('status_str') + "</br>" +
							"系统单号：" + re.get('bill_code') + "</br>" +
							"采购单号：" + re.get('buy_bill_code') + "</br>" +
							"药品通用名：" + re.get('common_name') + "</span></br>" +
							"药品商品名：" + re.get('goods_name') + "</span></br>" +
							"<span style='margin-right: 20px'>剂型：" + re.get('jx') + "</span>规格：" + re.get('guige') + "</br>" +
							"生产公司：" + re.get('manufacturer') + "</br>" +
							"供应商：" + re.get('supplier_name') + "</br>" +
							"开票公司：" + re.get('kpgs_name') + "</br>" +
							"买货数量：<b style='color:red'>" + re.get('pay_amount') + "</b></br>" +
							"<span style='margin-right: 20px'>买货单价：<b style='color:red'>" + re.get('unit_price') +
							"</b></span>买货金额：<b style='color:red'>" + re.get('sum_pay_money') + "</b></br>" +
							// "<span style='margin-right: 20px'>开票单价：<b style='color:red'>"+re.get('kaipiao_unit_price') +
							// "</b></span>开票金额：<b style='color:red'>"+re.get('sum_kaipiao_money')+"</b></br>"+
							// "<span style='margin-right: 20px'>税价：<b style='color:red'>"+re.get('tax_unit_price') +
							// "</b></span>税额：<b style='color:red'>"+re.get('sum_tax_money')+"</b></br>"+
							"主付账户：<b style='color:blue'>" + re.get('pay_1st_account_name') + "</b></br>" +
							"银行卡号：<b style='color:blue'>" + re.get('pay_1st_account_num') + "</b></br>" +
							"主付金额：<b style='color:red'>" + re.get('pay_1st_amount') + "</b></br>" +
							"次付账户：" + (re.get('pay_2nd_account_name') ? "<b style='color:blue'>" + re.get('pay_2nd_account_name') + '</b>' : '无') + "</br>" +
							"银行卡号：" + (re.get('pay_2nd_account_num') ? "<b style='color:blue'>" + re.get('pay_2nd_account_num') + "</b>" : '无') + "</br>" +
							"次付金额：" + (re.get('pay_2nd_amount') > 0 ? "<b style='color:red'>" + re.get('pay_2nd_amount') + "</b>" : "无") + "</br>" +
							"开单日期：" + re.get('yewu_date') + "</br>" +
							"采购日期：" + re.get('buy_date') + "</br>" +
							"开单人：" + re.get('kandan_ren') + "</br>" +
							"备注：" + re.get('note') + "</br>"
							// "操作详情：" + re.get('operate_info')
						);
					}
				}
			});
		});

		return me.editedGrid;
	},

	//未编辑付款单页面刷新，传入页码的话就跳到指定页码，不传的话就是刷新当前页
	refreshUnEditedGrid: function(currentPage) {
		var me = this;
		var grid = me.unEditedGrid;
		var store = grid.getStore();
		if (currentPage)
			store.currentPage = currentPage;
		store.removeAll();
		store.load();
	},

	//已编辑付款单页面刷新，传入页码的话就跳到指定页码，不传的话就是刷新当前页
	refreshEditedGrid: function(currentPage) {
		var me = this;
		var grid = me.editedGrid;
		var store = grid.getStore();
		if (currentPage)
			store.currentPage = currentPage;
		store.removeAll();
		store.load();
	},

	// 编辑付款单
	onEditBill: function() {
		var me = this;
		//是否是父付款单
		var isParent = true;
		var item = me.getUnEditedGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			//子单
			item = me.getEditedGrid().getSelectionModel().getSelection();
			isParent = false;
		}
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要编辑的付款单");
			return;
		}
		var bill = item[0];
		//这里可以调节是否能修改账户
		switch (bill.get('status')) {
			case SELF_PAY_STATUS_VERIFY_PASSED:
				PSI.MsgBox.showInfo("已通过审核，无法修改！");
				return;
			case SELF_PAY_STATUS_FUND_PASSED:
			case SELF_PAY_STATUS_2FUND:
				bill.data.isFund = true;
				break;
		}
		var form = Ext.create("PSI.SelfPay.SelfPayEditForm", {
			parentForm: me,
			entity: bill
		});
		form.show();
	},
	// 删除采购入库单
	onDeleteBill: function() {
		var me = this;
		var item = me.getUnEditedGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择未编辑的付款单");
			return;
		}

		var bill = item[0];

		var store = me.getUnEditedGrid().getStore();
		var index = store.findExact("id", bill.get("id"));
		index--;
		var preIndex = null;
		var preItem = store.getAt(index);
		if (preItem) {
			preIndex = preItem.get("id");
		}

		var info = "请确认是否删除付款单: <span style='color:red'>单号：" + bill.get("bill_code") + " 药品名：" +
			bill.get("common_name") + "</span>";
		var me = this;
		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/SelfPay/deleteSelfPay",
				method: "POST",
				params: {
					id: bill.get("id")
				},
				callback: function(options, success, response) {
					el.unmask();
					if (success) {
						var data = Ext.JSON.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.showInfo("成功完成删除操作", function() {
								me.refreshUnEditedGrid();
							});
						} else {
							PSI.MsgBox.showInfo(data.msg);
						}
					} else {
						PSI.MsgBox.showInfo("网络错误", function() {
							window.location.reload();
						});
					}
				}
			});
		});
	},

	//未编辑的条目被选择
	onUnEditedGridSelect: function() {
		//启用编辑或删除的按钮
		//应该设置已编辑的选中项为空
		var grid = this.getEditedGrid();
		grid.getSelectionModel().deselectAll();
	},
	//已编辑的条目被选择
	onEditedGridSelect: function() {
		var gridE = this.getEditedGrid();
		var gridU = this.getUnEditedGrid();
		var item = gridE.getSelectionModel().getSelection();
		var bill = item[0];
		var status = bill.get('status');
		// 应该设置已编辑的选中项为空
		gridU.getSelectionModel().deselectAll();
	},

	// 审核
	onCommit: function() {
		var me = this;
		var item = me.editedGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择可审核的付款单");
			return;
		}
		var bill = item[0];

		switch (bill.get('status')) {
			case SELF_PAY_STATUS_VERIFY_PASSED:
				PSI.MsgBox.showInfo("该付款单已通过审核");
				return;
				// case SELF_PAY_STATUS_2FUND:
				// case SELF_PAY_STATUS_VERIFY_DENIED:
				// case SELF_PAY_STATUS_STOCK_BACK:
				// 	this.onEditBill();
				// 	return;
		}

		var info = "请确认付款单: <span style='color:red'>系统单号：" + bill.get("bill_code") + "，药品：" + bill.get("common_name") + "</span> 审核通过?";
		PSI.MsgBox.verify(info, function() {
			//审核通过
			me.verifyRequest(bill, 'yes')
		}, function() {
			//审核不通过
			me.verifyRequest(bill, 'no')
		});
	},
	// 反审核
	onCommitReturn: function() {
		var me = this;
		var item = me.editedGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要操作的付款单");
			return;
		}
		var bill = item[0];

		if (bill.get("status") != SELF_PAY_STATUS_FUND_PASSED && bill.get("status") != SELF_PAY_STATUS_VERIFY_PASSED) {
			PSI.MsgBox.showInfo("该转账单无法进行此操作");
			return;
		}
		var info = "确认要反审核该转账单: <span style='color:red'>系统单号：" + bill.get("bill_code") + "，药品：" + bill.get("common_name") + "</span> ?";
		PSI.MsgBox.confirm(info, function() {
			me.verifyRequest(bill, 'return')
		});
	},

	verifyRequest: function(bill, type) {
		var id = bill.get("id");
		var me = this;
		var el = Ext.getBody();
		el.mask("正在提交中...");
		Ext.Ajax.request({
			url: PSI.Const.BASE_URL + "Home/SelfPay/selfPayStatus",
			method: "POST",
			params: {
				id: id,
				type: type
			},
			callback: function(options, success, response) {
				el.unmask();

				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					if (data.success) {
						PSI.MsgBox.showInfo("操作成功", function() {
							me.refreshEditedGrid();
							if (type != 'yes') {
								me.refreshUnEditedGrid();
							}
						});
					} else {
						PSI.MsgBox.showInfo(data.msg);
					}
				} else {
					PSI.MsgBox.showInfo("网络错误", function() {
						window.location.reload();
					});
				}
			}
		});
	},

	gotoUnEditedGridRecord: function(id) {
		var me = this;
		var grid = me.getUnEditedGrid();
		grid.getSelectionModel().deselectAll();
		var store = grid.getStore();
		if (id) {
			var r = store.findExact("id", id);
			if (r != -1) {
				grid.getSelectionModel().select(r);
			}
		}
	},
	gotoEditedGridRecord: function(id) {
		var me = this;
		var grid = me.getEditedGrid();
		grid.getSelectionModel().deselectAll();
		var store = grid.getStore();
		if (id) {
			var r = store.findExact("id", id);
			if (r != -1) {
				grid.getSelectionModel().select(r);
			}
		}
	},


	onQuery: function() {
		this.refreshUnEditedGrid();
	},

	onQuery2: function() {
		this.refreshEditedGrid();
	},

	onClearQuery: function() {
		var me = this;

		Ext.getCmp("editQueryBillStatus").setValue(-1);
		Ext.getCmp("editQueryRef").setValue(null);
		Ext.getCmp("editQueryFromDT").setValue(null);
		Ext.getCmp("editQueryToDT").setValue(null);
		Ext.getCmp("editQuerySupplier").clearIdValue();
		Ext.getCmp("editQueryWarehouse").clearIdValue();
		Ext.getCmp("editQueryPaymentType").setValue(-1);

		me.onQuery();
	},

	getQueryParam: function() {
		var me = this;

		var result = {
			billStatus: Ext.getCmp("editQueryBillStatus").getValue()
		};

		var ref = Ext.getCmp("editQueryRef").getValue();
		if (ref) {
			result.ref = ref;
		}

		//var supplierId = Ext.getCmp("editQuerySupplier").getIdValue();
		//if (supplierId) {
		//	result.supplierId = supplierId;
		//}

		//var warehouseId = Ext.getCmp("editQueryWarehouse").getIdValue();
		//if (warehouseId) {
		//	result.warehouseId = warehouseId;
		//}

		var fromDT = Ext.getCmp("editQueryFromDT").getValue();
		if (fromDT) {
			result.fromDT = Ext.Date.format(fromDT, "Y-m-d");
		}

		var toDT = Ext.getCmp("editQueryToDT").getValue();
		if (toDT) {
			result.toDT = Ext.Date.format(toDT, "Y-m-d");
		}

		var paymentType = Ext.getCmp("editQueryPaymentType").getValue();
		result.paymentType = paymentType;
		var status = Ext.getCmp("editQueryBillStatus2").getValue();
		result.status = status;
		return result;
	},

	//导出表格
	onExportSelfPurchase1: function() {
		var grid = this.getUnEditedGrid();
		var config = {
			store: grid.getStore(),
			title: "未编辑付款单列表"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(grid, config); //调用导出函数
	},
	onExportSelfPurchase2: function() {
		var grid = this.getEditedGrid();
		var config = {
			store: grid.getStore(),
			title: "已编辑付款单列表"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(grid, config); //调用导出函数
	}
});