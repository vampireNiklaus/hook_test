/**
 * 库存超上限明细表
 */
Ext.define("PSI.Report.InventoryUpperForm", {
	extend : "Ext.panel.Panel",

	border : 0,

	layout : "border",

	initComponent : function() {
		var me = this;

		Ext.apply(me, {
					tbar : [{
								text : "查询",
								iconCls : "PSI-button-refresh",
								handler : me.onQuery,
								scope : me
							}, "-", {
								text : "关闭",
								iconCls : "PSI-button-exit",
								handler : function() {
									location.replace(PSI.Const.BASE_URL);
								}
							}],
					items : [{
								region : "center",
								layout : "fit",
								border : 0,
								items : [me.getMainGrid()]
							}]
				});

		me.callParent(arguments);
	},

	getMainGrid : function() {
		var me = this;
		if (me.__mainGrid) {
			return me.__mainGrid;
		}

		var modelName = "PSIReportInventoryUpper";
		Ext.define(modelName, {
					extend : "Ext.data.Model",
					fields : ["warehouseCode", "warehouseName", "iuCount",
							"invCount", "goodsCode", "goodsName", "goodsSpec",
							"unitName", "delta"]
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
								+ "Home/Report/inventoryUpperQueryData",
						reader : {
							root : 'dataList',
							totalProperty : 'totalCount'
						}
					}
				});

		me.__mainGrid = Ext.create("Ext.grid.Panel", {
					viewConfig : {
						enableTextSelection : true
					},
					border : 0,
					columnLines : true,
					columns : [{
								xtype : "rownumberer"
							}, {
								header : "仓库编码",
								dataIndex : "warehouseCode",
								menuDisabled : false,
								sortable : false
							}, {
								header : "仓库",
								dataIndex : "warehouseName",
								menuDisabled : false,
								sortable : false,
								width : 200
							}, {
								header : "商品编码",
								dataIndex : "goodsCode",
								menuDisabled : false,
								sortable : false
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
								width : 160
							}, {
								header : "库存上限",
								dataIndex : "iuCount",
								menuDisabled : false,
								sortable : false,
								align : "right",
								xtype : "numbercolumn",
								format : "0"
							}, {
								header : "当前库存",
								dataIndex : "invCount",
								menuDisabled : false,
								sortable : false,
								align : "right",
								xtype : "numbercolumn",
								format : "0"
							}, {
								header : "存货超量",
								dataIndex : "delta",
								menuDisabled : false,
								sortable : false,
								align : "right",
								xtype : "numbercolumn",
								format : "0",
								renderer : function(value) {
									return "<span style='color:red'>" + value
											+ "</span>";
								}
							}, {
								header : "计量单位",
								dataIndex : "unitName",
								menuDisabled : false,
								sortable : false
							}],
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
											store.pageSize = Ext
													.getCmp("comboCountPerPage")
													.getValue();
											store.currentPage = 1;
											Ext.getCmp("pagingToobar")
													.doRefresh();
										},
										scope : me
									}
								}
							}, {
								xtype : "displayfield",
								value : "条记录"
							}],
					listeners : {}
				});

		return me.__mainGrid;
	},

	onQuery : function() {
		this.refreshMainGrid();
	},

	refreshMainGrid : function(id) {
		Ext.getCmp("pagingToobar").doRefresh();
	}
});