/**
 * 入库单 - 主界面
 */

var SELF_STOCK_KAIPIAO_OUT_STATUS_2STOCK = "0"; //待入库
var SELF_STOCK_KAIPIAO_OUT_STATUS_STOCKED = "3"; //已全部入库
var SELF_STOCK_KAIPIAO_OUT_STATUS_2VERIFY = "0"; //子单，待审核
var SELF_STOCK_KAIPIAO_OUT_STATUS_VERIFY_PASSED = "1"; //审核通过
var SELF_STOCK_KAIPIAO_OUT_STATUS_VERIFY_DENIED = "2"; //审核未通过
var SELF_STOCK_KAIPIAO_OUT_STATUS_TAX_BACK = "4"; //税票单被撤回
var defaultDate = new Date("2017-1-1");

Ext.define("PSI.SelfStockKaiPiaoOut.MainForm", {
	extend: "Ext.panel.Panel",

	config: {
		pViewSelfWarehouseOutKaiPiaoBill: null,
		pAddSelfWarehouseOutKaiPiaoBill: null,
		pEditSelfWarehouseOutKaiPiaoBill: null,
		pDeleteSelfWarehouseOutKaiPiaoBill: null,
		pImportSelfWarehouseOutKaiPiaoBill: null,
		pExportSelfWarehouseOutKaiPiaoBill: null,
		pVerifySelfWarehouseOutKaiPiaoBill: null,
		pRevertVerifySelfWarehouseOutKaiPiaoBill: null
	},
	//页面初始化
	initComponent: function() {
		var me = this;
		Ext.apply(me, {
			border: 0,
			layout: "border",
			//获取工具栏
			tbar: me.getToolbarCmp(),
			items: [{
				region: "north",
				height: 90,
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
					height: "40%",
					split: true,
					layout: "fit",
					border: 0,
					//获取未编辑入库单
					items: [me.getPViewSelfWarehouseOutKaiPiaoBill() == 0 ? null : me.getUnEditedGrid()]
				}, {
					region: "center",
					layout: "fit",
					border: 0,
					//获取已编辑入库单
					items: [me.getPViewSelfWarehouseOutKaiPiaoBill() == 0 ? null : me.getEditedGrid()]
				}]
			}]
		});

		me.callParent(arguments);
		me.refreshUnEditedGrid(1);
		me.refreshEditedGrid(1);
	},

	getToolbarCmp: function() {
		var me = this;
		return [{
			text: "编辑-提交出库单",
			iconCls: "PSI-button-edit",
			scope: me,
			handler: me.onEditBill,
			disabled: me.getPEditSelfWarehouseOutKaiPiaoBill() == "0",
			id: "buttonEdit"
		}, "-", {
			text: "删除条目",
			iconCls: "PSI-button-delete",
			disabled: me.getPDeleteSelfWarehouseOutKaiPiaoBill() == "0",
			scope: me,
			handler: me.onDeleteBill,
			id: "buttonDelete"
		}, "-", {
			text: "审核出库",
			disabled: me.getPVerifySelfWarehouseOutKaiPiaoBill() == "0",
			iconCls: "PSI-button-verify",
			scope: me,
			handler: me.onCommit,
			id: "buttonVerify"
		}, {
			text: "反审核",
			disabled: me.getPRevertVerifySelfWarehouseOutKaiPiaoBill() == "0",
			iconCls: "PSI-button-revert-verify",
			scope: me,
			handler: me.onCommitReturn,
			id: "buttonRevertVerify"
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
		}];
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
	//获取未编辑的入库单
	getUnEditedGrid: function() {
		var me = this;
		if (me.unEditedGrid) {
			return me.unEditedGrid;
		}

		var modelName = "PSISelfStockKaiPiaoOutBill";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "drug_id", 'common_name', 'goods_name', 'jx', 'guige', 'manufacturer', 'jldw',
				'bill_code', "pay_bill_id", 'pay_bill_code', 'buy_bill_code', "supplier_id", 'supplier_name',
				"deliver_id", "stock_amount", "remain_amount", 'status_str', 'status', 'operate_info', 'buy_date'
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
				url: PSI.Const.BASE_URL + "Home/SelfStockKaiPiaoOut/listSelfStockKaiPiaoOutUnEdit",
				reader: {
					root: 'SelfStockKaiPiaoOutList',
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
			title: "待出库列表",
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
				header: "总应出库数量",
				dataIndex: "stock_amount",
				menuDisabled: false,
				renderer: function(value) {
					return "<b style='color:blue'>" + value + "</b>";
				},
			}, {
				header: "待出库数量",
				dataIndex: "remain_amount",
				menuDisabled: false,
				renderer: function(value) {
					if (value > 0)
						return "<b style='color:red'>" + value + "</b>";
					else
						return value;
				}
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
				header: "计量单位",
				dataIndex: "jldw",
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
				header: "操作详情",
				dataIndex: "operate_info",
				menuDisabled: false,
				sortable: true
			}],
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
				text: "导出待出库列表信息",
				disabled: me.getPExportSelfWarehouseOutKaiPiaoBill() == "0",
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
				title: '开票公司出库详情单',
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
							"付款单号：" + re.get('pya_bill_code') + "</br>" +
							"药品通用名：" + re.get('common_name') + "</span></br>" +
							"药品商品名：" + re.get('goods_name') + "</span></br>" +
							"计量单位：" + re.get('jldw') + "</span></br>" +
							"<span style='margin-right: 20px'>剂型：" + re.get('jx') + "</span>规格：" + re.get('guige') + "</br>" +
							"生产公司：" + re.get('jx') + "</br>" +
							"供应商：" + re.get('supplier_name') + "</br>" +
							"总应出库数量：<b style='color:blue'>" + re.get('stock_amount') + "</b></br>" +
							"待出库数量：<b style='color:red'>" + re.get('remain_amount') + "</b></br>" +
							"开单人：" + re.get('kandan_ren') + "</br>"
							// (re.get('verifier_id') > 0 ? "审核人：" + re.get('verifier_id') + "</br>" : '' +
							// 	"操作详情：" + re.get('operate_info'))
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

		var modelName = "PSISelfStockKaiPiaoOutBill";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "drug_id", 'common_name', 'goods_name', 'jx', 'guige', 'manufacturer', 'jldw',
				'bill_code', 'buy_bill_code', 'pay_bill_code', 'buy_bill_code', "supplier_id", 'supplier_name', "out_amount", "stock_amount", "remain_amount",
				'status', 'status_str', 'batch_num', 'validity', 'parent_id', 'note', 'operate_info', 'instock_date', 'outstock_date', 'kaipiao_unit_price'
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
				url: PSI.Const.BASE_URL + "Home/SelfStockKaiPiaoOut/listSelfStockKaiPiaoOutEdit",
				reader: {
					root: 'SelfStockKaiPiaoOutList',
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
			title: "出库待审核列表",
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
				header: "计量单位",
				dataIndex: "jldw",
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
			}, {
				header: "供应商",
				dataIndex: "supplier_name",
				menuDisabled: false,
			}, {
				header: "出库数量",
				dataIndex: "out_amount",
				menuDisabled: false,
				renderer: function(value) {
					return "<b style='color:red'>" + value + "</b>";
				}
			}, {
				header: "应出库总量",
				dataIndex: "stock_amount",
				menuDisabled: false,
				renderer: function(value) {
					return "<b style='color:blue'>" + value + "</b>";
				}
			}, {
				header: "待出库总量",
				dataIndex: "remain_amount",
				menuDisabled: false,
				renderer: function(value) {
					return "<b style='color:red'>" + value + "</b>";
				}
			}, {
				header: "批号",
				dataIndex: "batch_num",
				menuDisabled: false,
			}, {
				header: "入库时间",
				dataIndex: "instock_date",
				menuDisabled: false,
			}, {
				header: "开票单价",
				dataIndex: "kaipiao_unit_price",
				menuDisabled: false,
			}, {
				header: "出库时间",
				dataIndex: "outstock_date",
				menuDisabled: false,
			}, {
				header: "有效期",
				dataIndex: "validity",
				menuDisabled: false,
			}, {
				header: '备注',
				dataIndex: 'note',
				menuDisabled: true
			}, {
				header: '操作详情',
				dataIndex: 'operate_info',
				menuDisabled: true
			}],
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
				text: "导出出库待审核信息",
				disabled: me.getPExportSelfWarehouseOutKaiPiaoBill() == "0",
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

		me.editedGrid.getView().on('render', function(view) {
			view.tip = Ext.create('Ext.tip.ToolTip', {
				width: 300,
				title: '开票公司出库详情单',
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
							"付款单号：" + re.get('pya_bill_code') + "</br>" +
							"药品通用名：" + re.get('common_name') + "</span></br>" +
							"药品商品名：" + re.get('goods_name') + "</span></br>" +
							"计量单位：" + re.get('jldw') + "</span></br>" +
							"<span style='margin-right: 20px'>剂型：" + re.get('jx') + "</span>规格：" + re.get('guige') + "</br>" +
							"生产公司：" + re.get('jx') + "</br>" +
							"供应商：" + re.get('supplier_name') + "</br>" +
							"配送公司：" + re.get('deliver_name') + "</br>" +
							"应出库总数：<b style='color:blue'>" + re.get('stock_amount') + "</b></br>" +
							"未出库总数：<b style='color:red'>" + re.get('remain_amount') + "</b></br>" +
							"本单出库：<b style='color:red'>" + re.get('out_amount') + "</b></br>" +
							"开单日期：" + re.get('kaidan_date') + "</br>" +
							"批号：" + re.get('batch_num') + "</br>" +
							"有效期：" + re.get('validity') + "</br>" +
							"开单人：" + re.get('kandan_ren') + "</br>"
							// (re.get('verifier_id') > 0 ? "审核人：" + re.get('verifier_id') + "</br>" : '') +
							// "备注：" + re.get('note') + "</br>" +
							// "操作详情：" + re.get('operate_info')
						);
					}
				}
			});
		});

		return me.editedGrid;
	},

	//未编辑入库单页面刷新，传入页码的话就跳到指定页码，不传的话就是刷新当前页
	refreshUnEditedGrid: function(currentPage) {
		var me = this;
		var grid = me.unEditedGrid;
		var store = grid.getStore();
		if (currentPage)
			store.currentPage = currentPage;
		store.removeAll();
		store.load();
	},

	//已编辑入库单页面刷新，传入页码的话就跳到指定页码，不传的话就是刷新当前页
	refreshEditedGrid: function(currentPage) {
		var me = this;
		var grid = me.editedGrid;
		var store = grid.getStore();
		if (currentPage)
			store.currentPage = currentPage;
		store.removeAll();
		store.load();
	},

	// 编辑入库单
	onEditBill: function() {
		var me = this;
		var flag = true;
		var item = me.getUnEditedGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			item = me.getEditedGrid().getSelectionModel().getSelection();
			flag = false;
		}
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要编辑的入库单");
			return;
		}
		var bill = item[0];
		switch (bill.get('status')) {
			case SELF_STOCK_KAIPIAO_OUT_STATUS_VERIFY_PASSED:
				PSI.MsgBox.showInfo("已审核出库，无法编辑");
				return;
			case SELF_STOCK_KAIPIAO_OUT_STATUS_STOCKED:
				PSI.MsgBox.showInfo("已全部入库，无法编辑");
				return;
		}
		var form = Ext.create("PSI.SelfStockKaiPiaoOut.SelfStockKaiPiaoOutEditForm", {
			parentForm: me,
			entity: bill,
			direction: 0 //编辑提交入库单
		});
		form.show();

	},
	// 删除采购入开票公司单
	onDeleteBill: function() {
		var me = this;
		var flag = true; //true表示在上栏操作
		var item = me.getUnEditedGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			item = me.getEditedGrid().getSelectionModel().getSelection();
			flag = false;
		}
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要删除的入库单");
			return;
		}

		var bill = item[0];
		if (!flag) { //下栏操作
			switch (bill.get('status')) {
				case SELF_STOCK_KAIPIAO_OUT_STATUS_VERIFY_PASSED:
					PSI.MsgBox.showInfo("已审核，无法删除");
					return;
			}
		}

		var info = "请确认是否删除入库单: <span style='color:red'>单号：" + bill.get("bill_code") + " 药品名：" +
			bill.get("common_name") + "</span>";
		var me = this;
		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/SelfStockKaiPiaoOut/deleteSelfStockKaiPiaoOut",
				method: "POST",
				params: {
					id: bill.get("id"),
					parent_id: bill.get('parent_id')
				},
				callback: function(options, success, response) {
					el.unmask();
					if (success) {
						var data = Ext.JSON.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.showInfo("成功完成删除操作", function() {
								me.refreshUnEditedGrid();
								me.refreshEditedGrid();
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
		var gridE = this.getEditedGrid();
		var gridU = this.getUnEditedGrid();
		//启用编辑或删除的按钮
		//应该设置已编辑的选中项为空
		gridE.getSelectionModel().deselectAll();
	},
	//已编辑的条目被选择
	onEditedGridSelect: function() {
		var gridE = this.getEditedGrid();
		var gridU = this.getUnEditedGrid();
		var item = gridE.getSelectionModel().getSelection();
		var bill = item[0];
		//应该设置已编辑的选中项为空
		gridU.getSelectionModel().deselectAll();
	},

	// 审核
	onCommit: function() {
		var me = this;
		var item = me.editedGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择待审核的入库单");
			return;
		}
		var bill = item[0];
		if (bill.getData().outstock_date == "0000-00-00" || !bill.getData().kaipiao_unit_price > 0) {
			PSI.MsgBox.toedit("请首先编辑出库单条目：必须要出库日期，开票单价和批号！", function() {
				var form = Ext.create("PSI.SelfStockKaiPiaoOut.SelfStockKaiPiaoOutEditForm", {
					parentForm: me,
					entity: bill,
					direction: 1, //出库审核
					// callbackFunc: me.onEditBill
				});
				form.show();
			}, function() {
				return;
			});
		} else {
			if (bill.get("status") == SELF_STOCK_KAIPIAO_OUT_STATUS_VERIFY_PASSED) {
				PSI.MsgBox.showInfo("该出库单已经审核过，成功出库了");
				return;
			}

			var info = "请确认出库单: <span style='color:red'>系统单号：" + bill.get("bill_code") + "，药品：" + bill.get("common_name") + "，开票公司：" + bill.get("supplier_name") + "</span> 审核通过?";
			PSI.MsgBox.verify(info, function() {
				//审核通过
				me.verifyRequest(bill, 'yes')
			}, function() {
				//审核不通过
				me.verifyRequest(bill, 'no')
			});
		}

	},
	// 反审核
	onCommitReturn: function() {
		var me = this;
		var item = me.editedGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要反审核的开票公司出库单");
			return;
		}
		var bill = item[0];

		if (bill.get("status") != SELF_STOCK_KAIPIAO_OUT_STATUS_VERIFY_PASSED) {
			PSI.MsgBox.showInfo("该入库单无法进行此操作");
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
			url: PSI.Const.BASE_URL + "Home/SelfStockKaiPiaoOut/selfStockStatus",
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
							me.refreshUnEditedGrid();
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

		return result;
	},

	onExportSelfPurchase1: function() {
		var grid = this.getUnEditedGrid();
		var config = {
			store: grid.getStore(),
			title: "待入库列表"
		};
		ExportExcel(grid, config); //调用导出函数
	},
	onExportSelfPurchase2: function() {
		var grid = this.getEditedGrid();
		var config = {
			store: grid.getStore(),
			title: "待出库列表"
		};
		ExportExcel(grid, config); //调用导出函数
	}

});