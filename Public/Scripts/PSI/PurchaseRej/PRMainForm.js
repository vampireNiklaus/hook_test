/**
 * 采购退货出库 - 主界面
 */
Ext.define("PSI.PurchaseRej.PRMainForm", {
	extend : "Ext.panel.Panel",
	border : 0,
	layout : "border",
	initComponent : function() {
		var me = this;

		Ext.apply(me, {
					tbar : me.getToolbarCmp(),
					items : [{
								region : "north",
								height : 90,
								layout : "fit",
								border : 0,
								title : "查询条件",
								collapsible : true,
								layout : {
									type : "table",
									columns : 4
								},
								items : me.getQueryCmp()
							}, {
								region : "center",
								layout : "border",
								border : 0,
								items : [{
											region : "north",
											height : "40%",
											split : true,
											layout : "fit",
											border : 0,
											items : [me.getMainGrid()]
										}, {
											region : "center",
											layout : "fit",
											border : 0,
											items : [me.getDetailGrid()]
										}]
							}]
				});

		me.callParent(arguments);

		me.refreshMainGrid();
	},

	getToolbarCmp : function() {
		var me = this;
		return [{
					text : "新建采购退货出库单",
					iconCls : "PSI-button-add",
					scope : me,
					handler : me.onAddBill
				}, "-", {
					text : "编辑采购退货出库单",
					id : "buttonEdit",
					iconCls : "PSI-button-edit",
					scope : me,
					handler : me.onEditBill
				}, "-", {
					text : "删除采购退货出库单",
					id : "buttonDelete",
					iconCls : "PSI-button-delete",
					scope : me,
					handler : me.onDeleteBill
				}, "-", {
					text : "提交采购退货出库单",
					id : "buttonCommit",
					iconCls : "PSI-button-commit",
					scope : me,
					handler : me.onCommit
				}, "-", {
					text : "关闭",
					iconCls : "PSI-button-exit",
					handler : function() {
						location.replace(PSI.Const.BASE_URL);
					}
				}];
	},

	getQueryCmp : function() {
		var me = this;
		return [{
					id : "editQueryBillStatus",
					xtype : "combo",
					queryMode : "local",
					editable : false,
					valueField : "id",
					labelWidth : 60,
					labelAlign : "right",
					labelSeparator : "",
					fieldLabel : "状态",
					margin : "5, 0, 0, 0",
					store : Ext.create("Ext.data.ArrayStore", {
								fields : ["id", "text"],
								data : [[-1, "全部"], [0, "待出库"], [1000, "已出库"]]
							}),
					value : -1
				}, {
					id : "editQueryRef",
					labelWidth : 60,
					labelAlign : "right",
					labelSeparator : "",
					fieldLabel : "单号",
					margin : "5, 0, 0, 0",
					xtype : "textfield"
				}, {
					id : "editQueryFromDT",
					xtype : "datefield",
					margin : "5, 0, 0, 0",
					format : "Y-m-d",
					labelAlign : "right",
					labelSeparator : "",
					fieldLabel : "业务日期（起）"
				}, {
					id : "editQueryToDT",
					xtype : "datefield",
					margin : "5, 0, 0, 0",
					format : "Y-m-d",
					labelAlign : "right",
					labelSeparator : "",
					fieldLabel : "业务日期（止）"
				}, {
					id : "editQuerySupplier",
					xtype : "psi_supplierfield",
					labelAlign : "right",
					labelSeparator : "",
					labelWidth : 60,
					margin : "5, 0, 0, 0",
					fieldLabel : "供应商"
				}, {
					id : "editQueryWarehouse",
					xtype : "psi_warehousefield",
					labelAlign : "right",
					labelSeparator : "",
					labelWidth : 60,
					margin : "5, 0, 0, 0",
					fieldLabel : "仓库"
				}, {
					id : "editQueryReceivingType",
					margin : "5, 0, 0, 0",
					labelAlign : "right",
					labelSeparator : "",
					fieldLabel : "收款方式",
					xtype : "combo",
					queryMode : "local",
					editable : false,
					valueField : "id",
					store : Ext.create("Ext.data.ArrayStore", {
								fields : ["id", "text"],
								data : [[-1, "全部"], [0, "记应收账款"], [1, "现金收款"]]
							}),
					value : -1
				}, {
					xtype : "container",
					items : [{
								xtype : "button",
								text : "查询",
								width : 100,
								margin : "5 0 0 10",
								iconCls : "PSI-button-refresh",
								handler : me.onQuery,
								scope : me
							}, {
								xtype : "button",
								text : "清空查询条件",
								width : 100,
								margin : "5, 0, 0, 10",
								handler : me.onClearQuery,
								scope : me
							}]
				}];
	},

	refreshMainGrid : function(id) {
		var me = this;

		Ext.getCmp("buttonEdit").setDisabled(true);
		Ext.getCmp("buttonDelete").setDisabled(true);
		Ext.getCmp("buttonCommit").setDisabled(true);

		var gridDetail = me.getDetailGrid();
		gridDetail.setTitle("采购退货出库单明细");
		gridDetail.getStore().removeAll();
		Ext.getCmp("pagingToobar").doRefresh();
		me.__lastId = id;
	},

	// 新增采购退货出库单
	onAddBill : function() {
		var me = this;
		var form = Ext.create("PSI.PurchaseRej.PREditForm", {
					parentForm : me
				});
		form.show();
	},

	// 编辑采购退货出库单
	onEditBill : function() {
		var me = this;
		var item = me.getMainGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要编辑的采购退货出库单");
			return;
		}
		var bill = item[0];
		var form = Ext.create("PSI.PurchaseRej.PREditForm", {
					parentForm : me,
					entity : bill
				});
		form.show();
	},

	// 删除采购退货出库单
	onDeleteBill : function() {
		var me = this;
		var item = me.getMainGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要删除的采购退货出库单");
			return;
		}
		var bill = item[0];

		if (bill.get("billStatus") == "已出库") {
			PSI.MsgBox.showInfo("当前采购退货出库单已经提交出库，不能删除");
			return;
		}

		var info = "请确认是否删除采购退货出库单: <span style='color:red'>" + bill.get("ref")
				+ "</span>";

		PSI.MsgBox.confirm(info, function() {
					var el = Ext.getBody();
					el.mask("正在删除中...");
					Ext.Ajax.request({
								url : PSI.Const.BASE_URL
										+ "Home/PurchaseRej/deletePRBill",
								method : "POST",
								params : {
									id : bill.get("id")
								},
								callback : function(options, success, response) {
									el.unmask();

									if (success) {
										var data = Ext.JSON
												.decode(response.responseText);
										if (data.success) {
											PSI.MsgBox.showInfo("成功完成删除操作",
													function() {
														me.refreshMainGrid();
													});
										} else {
											PSI.MsgBox.showInfo(data.msg);
										}
									} else {
										PSI.MsgBox.showInfo("网络错误");
									}
								}

							});
				});
	},

	// 提交采购退货出库单
	onCommit : function() {
		var me = this;
		var item = me.getMainGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要提交的采购退货出库单");
			return;
		}
		var bill = item[0];

		if (bill.get("billStatus") == "已出库") {
			PSI.MsgBox.showInfo("当前采购退货出库单已经提交出库，不能再次提交");
			return;
		}

		var info = "请确认是否提交单号: <span style='color:red'>" + bill.get("ref")
				+ "</span> 的采购退货出库单?";
		PSI.MsgBox.confirm(info, function() {
					var el = Ext.getBody();
					el.mask("正在提交中...");
					Ext.Ajax.request({
								url : PSI.Const.BASE_URL
										+ "Home/PurchaseRej/commitPRBill",
								method : "POST",
								params : {
									id : bill.get("id")
								},
								callback : function(options, success, response) {
									el.unmask();

									if (success) {
										var data = Ext.JSON
												.decode(response.responseText);
										if (data.success) {
											PSI.MsgBox.showInfo("成功完成提交操作",
													function() {
														me
																.refreshMainGrid(data.id);
													});
										} else {
											PSI.MsgBox.showInfo(data.msg);
										}
									} else {
										PSI.MsgBox.showInfo("网络错误");
									}
								}
							});
				});
	},

	getMainGrid : function() {
		var me = this;
		if (me.__mainGrid) {
			return me.__mainGrid;
		}

		var modelName = "PSIPRBill";
		Ext.define(modelName, {
					extend : "Ext.data.Model",
					fields : ["id", "ref", "bizDT", "warehouseName",
							"supplierName", "inputUserName", "bizUserName",
							"billStatus", "rejMoney", "dateCreated",
							"receivingType"]
				});
		var store = Ext.create("Ext.data.Store", {
					autoLoad : false,
					model : modelName,
					data : [],
					pageSize : 20,
					proxy : {
						type : "ajax",
						actionMethods : {
							read : "POST"
						},
						url : PSI.Const.BASE_URL
								+ "Home/PurchaseRej/prbillList",
						reader : {
							root : 'dataList',
							totalProperty : 'totalCount'
						}
					}
				});
		store.on("beforeload", function() {
					store.proxy.extraParams = me.getQueryParam();
				});
		store.on("load", function(e, records, successful) {
					if (successful) {
						me.gotoMainGridRecord(me.__lastId);
					}
				});

		me.__mainGrid = Ext.create("Ext.grid.Panel", {
					viewConfig : {
						enableTextSelection : true
					},
					border : 0,
					columnLines : true,
					columns : [{
								xtype : "rownumberer",
								width : 50
							}, {
								header : "状态",
								dataIndex : "billStatus",
								menuDisabled : false,
								sortable : false,
								width : 60,
								renderer : function(value) {
									return value == "待出库"
											? "<span style='color:red'>"
													+ value + "</span>"
											: value;
								}
							}, {
								header : "单号",
								dataIndex : "ref",
								width : 110,
								menuDisabled : false,
								sortable : false
							}, {
								header : "业务日期",
								dataIndex : "bizDT",
								menuDisabled : false,
								sortable : false
							}, {
								header : "供应商",
								dataIndex : "supplierName",
								menuDisabled : false,
								sortable : false,
								width : 300
							}, {
								header : "收款方式",
								dataIndex : "receivingType",
								menuDisabled : false,
								sortable : false,
								width : 100,
								renderer : function(value) {
									if (value == 0) {
										return "记应收账款";
									} else if (value == 1) {
										return "现金收款";
									} else {
										return "";
									}
								}
							}, {
								header : "出库仓库",
								dataIndex : "warehouseName",
								menuDisabled : false,
								sortable : false,
								width : 150
							}, {
								header : "退货金额",
								dataIndex : "rejMoney",
								menuDisabled : false,
								sortable : false,
								align : "right",
								xtype : "numbercolumn",
								width : 150
							}, {
								header : "业务员",
								dataIndex : "bizUserName",
								menuDisabled : false,
								sortable : false
							}, {
								header : "制单人",
								dataIndex : "inputUserName",
								menuDisabled : false,
								sortable : false
							}, {
								header : "制单时间",
								dataIndex : "dateCreated",
								width : 140,
								menuDisabled : false,
								sortable : false
							}],
					listeners : {
						select : {
							fn : me.onMainGridSelect,
							scope : me
						},
						itemdblclick : {
							fn : me.onEditBill,
							scope : me
						}
					},
					store : store,
					tbar : [{
								id : "pagingToobar",
								xtype : "pagingtoolbar",
								border : 0,
								store : store
							}, "-", {
								xtype : "displayfield",
								value : "每页显示"
							}, {
								id : "comboCountPerPage",
								xtype : "combobox",
								editable : false,
								width : 60,
								store : Ext.create("Ext.data.ArrayStore", {
											fields : ["text"],
											data : [["20"], ["50"], ["100"],
													["300"], ["1000"]]
										}),
								value : 20,
								listeners : {
									change : {
										fn : function() {
											storeWSBill.pageSize = Ext
													.getCmp("comboCountPerPage")
													.getValue();
											storeWSBill.currentPage = 1;
											Ext.getCmp("pagingToobar")
													.doRefresh();
										},
										scope : me
									}
								}
							}, {
								xtype : "displayfield",
								value : "条记录"
							}]
				});

		return me.__mainGrid;
	},

	getDetailGrid : function() {
		var me = this;
		if (me.__detailGrid) {
			return me.__detailGrid;
		}

		var modelName = "PSIITBillDetail";
		Ext.define(modelName, {
					extend : "Ext.data.Model",
					fields : ["id", "goodsCode", "goodsName", "goodsSpec",
							"unitName", "rejCount", "rejPrice", "rejMoney"]
				});
		var store = Ext.create("Ext.data.Store", {
					autoLoad : false,
					model : modelName,
					data : []
				});

		me.__detailGrid = Ext.create("Ext.grid.Panel", {
					viewConfig : {
						enableTextSelection : true
					},
					title : "采购退货出库单明细",
					columnLines : true,
					columns : [Ext.create("Ext.grid.RowNumberer", {
										text : "序号",
										width : 30
									}), {
								header : "商品编码",
								dataIndex : "goodsCode",
								menuDisabled : false,
								sortable : false,
								width : 120
							}, {
								header : "商品名称",
								dataIndex : "goodsName",
								menuDisabled : false,
								sortable : false,
								width : 200
							}, {
								header : "规格型号",
								dataIndex : "goodsSpec",
								menuDisabled : false,
								sortable : false,
								width : 200
							}, {
								header : "退货数量",
								dataIndex : "rejCount",
								menuDisabled : false,
								sortable : false,
								align : "right",
								width : 150
							}, {
								header : "单位",
								dataIndex : "unitName",
								menuDisabled : false,
								sortable : false,
								width : 60
							}, {
								header : "退货单价",
								dataIndex : "rejPrice",
								menuDisabled : false,
								sortable : false,
								align : "right",
								width : 150,
								xtype : "numbercolumn"
							}, {
								header : "退货金额",
								dataIndex : "rejMoney",
								menuDisabled : false,
								sortable : false,
								align : "right",
								width : 150,
								xtype : "numbercolumn"
							}],
					store : store
				});

		return me.__detailGrid;
	},

	gotoMainGridRecord : function(id) {
		var me = this;
		var grid = me.getMainGrid();
		grid.getSelectionModel().deselectAll();
		var store = grid.getStore();
		if (id) {
			var r = store.findExact("id", id);
			if (r != -1) {
				grid.getSelectionModel().select(r);
			} else {
				grid.getSelectionModel().select(0);
			}
		} else {
			grid.getSelectionModel().select(0);
		}
	},

	onMainGridSelect : function() {
		var me = this;
		me.getDetailGrid().setTitle("采购退货出库单明细");
		var item = me.getMainGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			Ext.getCmp("buttonEdit").setDisabled(true);
			Ext.getCmp("buttonDelete").setDisabled(true);
			Ext.getCmp("buttonCommit").setDisabled(true);

			return;
		}
		var bill = item[0];

		var commited = bill.get("billStatus") == "已出库";
		Ext.getCmp("buttonDelete").setDisabled(commited);
		Ext.getCmp("buttonCommit").setDisabled(commited);

		var buttonEdit = Ext.getCmp("buttonEdit");
		buttonEdit.setDisabled(false);
		if (commited) {
			buttonEdit.setText("查看采购退货出库单");
		} else {
			buttonEdit.setText("编辑采购退货出库单");
		}

		me.refreshDetailGrid();
	},

	refreshDetailGrid : function(id) {
		var me = this;
		me.getDetailGrid().setTitle("采购退货出库单明细");
		var grid = me.getMainGrid();
		var item = grid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			return;
		}
		var bill = item[0];

		grid = me.getDetailGrid();
		grid.setTitle("单号: " + bill.get("ref") + " 出库仓库: "
				+ bill.get("warehouseName"));
		var el = grid.getEl();
		el.mask(PSI.Const.LOADING);
		Ext.Ajax.request({
					url : PSI.Const.BASE_URL
							+ "Home/PurchaseRej/prBillDetailList",
					params : {
						id : bill.get("id")
					},
					method : "POST",
					callback : function(options, success, response) {
						var store = grid.getStore();

						store.removeAll();

						if (success) {
							var data = Ext.JSON.decode(response.responseText);
							store.add(data);

							if (store.getCount() > 0) {
								if (id) {
									var r = store.findExact("id", id);
									if (r != -1) {
										grid.getSelectionModel().select(r);
									}
								}
							}
						}

						el.unmask();
					}
				});
	},

	gotoMainGridRecord : function(id) {
		var me = this;
		var grid = me.getMainGrid();
		grid.getSelectionModel().deselectAll();
		var store = grid.getStore();
		if (id) {
			var r = store.findExact("id", id);
			if (r != -1) {
				grid.getSelectionModel().select(r);
			} else {
				grid.getSelectionModel().select(0);
			}
		} else {
			grid.getSelectionModel().select(0);
		}
	},

	onQuery : function() {
		this.refreshMainGrid();
	},

	onClearQuery : function() {
		var me = this;

		Ext.getCmp("editQueryBillStatus").setValue(-1);
		Ext.getCmp("editQueryRef").setValue(null);
		Ext.getCmp("editQueryFromDT").setValue(null);
		Ext.getCmp("editQueryToDT").setValue(null);
		Ext.getCmp("editQuerySupplier").clearIdValue();
		Ext.getCmp("editQueryWarehouse").clearIdValue();
		Ext.getCmp("editQueryReceivingType").setValue(-1);

		me.onQuery();
	},

	getQueryParam : function() {
		var me = this;

		var result = {
			billStatus : Ext.getCmp("editQueryBillStatus").getValue()
		};

		var ref = Ext.getCmp("editQueryRef").getValue();
		if (ref) {
			result.ref = ref;
		}

		var supplierId = Ext.getCmp("editQuerySupplier").getIdValue();
		if (supplierId) {
			result.supplierId = supplierId;
		}

		var warehouseId = Ext.getCmp("editQueryWarehouse").getIdValue();
		if (warehouseId) {
			result.warehouseId = warehouseId;
		}

		var fromDT = Ext.getCmp("editQueryFromDT").getValue();
		if (fromDT) {
			result.fromDT = Ext.Date.format(fromDT, "Y-m-d");
		}

		var toDT = Ext.getCmp("editQueryToDT").getValue();
		if (toDT) {
			result.toDT = Ext.Date.format(toDT, "Y-m-d");
		}

		var receivingType = Ext.getCmp("editQueryReceivingType").getValue();
		result.receivingType = receivingType;

		return result;
	}
});