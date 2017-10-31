/**
 *销售 - 主界面
 *
 * @author Baoyu Li
 */
var summaryFilters = ['employee_profit', 'sell_amount']
var sum = 0;

Ext.define("PSI.DailySellFetch.MainForm", {
	extend: "Ext.panel.Panel",
	config: {
		pAddDailySellItem: null,
		pEditDailySellItem: null,
		pEditDailySellItemProfit: null,
		pDeleteDailySellItem: null,
		pImportDailySellItem: null,
		pExportDailySellItem: null,
		pConfirmMatchedDailySellItem: null,
		pConfirmUnMatchedDailySellItem: null,
		pViewAllDailySellGrid: null,
		pViewNewDailySellGrid: null,
		pViewUnMatchedDailySellGrid: null,
		pViewImmediatelySellGrid: null
	},

	/**
	 * 初始化组件
	 */
	initComponent: function() {
		var me = this;
		me.newDailySellGrid = null;
		me.allDailySellGrid = null;
		me.unMatchedDailySellGrid = null;
		me.modelName = "PSINewDailySell";
		Ext.define(me.modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "bill_code", "employee_id", "employee_des", "employee_profit",
				"employee_name", "drug_id", "drug_name", "drug_guige", "drug_manufacture",
				"hospital_id", "hospital_name", "stock_id", "deliver_id", "deliver_name",
				"batch_num", "sell_amount", "sell_date", "create_time",
				"creator_id", "note", "if_paid", "pay_time", "paybill_id", "status", "expire_time", "operate_info"
			]
		});

		Ext.apply(me, {
			border: 0,
			layout: "border",
			// tbar: [{
			// 	text: "新增销售条目",
			// 	disabled: me.getPAddDailySellItem() == "0",
			// 	iconCls: "PSI-button-add",
			// 	handler: me.onAddDailySell,
			// 	scope: me
			// }, {
			// 	text: "编辑销售条目",
			// 	disabled: me.getPEditDailySellItem() == "0",
			// 	iconCls: "PSI-button-edit",
			// 	handler: me.onEditDailySellForUnMatched,
			// 	scope: me
			// }, {
			// 	text: "修改业务提成",
			// 	disabled: me.getPEditDailySellItemProfit() == "0",
			// 	iconCls: "PSI-button-edit",
			// 	handler: me.onEditDailySellProfit,
			// 	scope: me
			// }, "-", "-", {
			// 	text: "导入销售列表",
			// 	disabled: me.getPImportDailySellItem() == "0",
			// 	iconCls: "PSI-button-excelimport",
			// 	handler: me.onImportDailySells,
			// 	scope: me
			// }, "-", {
			// 	text: "导出销售信息",
			// 	disabled: me.getPExportDailySellItem() == "0",
			// 	iconCls: "PSI-button-excelexport",
			// 	handler: me.onEportDailySell,
			// 	scope: me
			// }, "-", "-", {
			// 	text: "关闭",
			// 	iconCls: "PSI-button-exit",
			// 	handler: function() {
			// 		location.replace(PSI.Const.BASE_URL);
			// 	}
			// }],
			items: [{
				region: "north",
				border: 0,
				height: 90,
				title: "查询条件",
				collapsible: true,
				layout: {
					type: "table",
					columns: 5
				},
				items: [
					// {
					// 	id: "editGridType",
					// 	labelWidth: 50,
					// 	labelAlign: "right",
					// 	labelSeparator: "",
					// 	fieldLabel: "刷新表格",
					// 	margin: "5, 0, 0, 0",
					// 	valueField: "name",
					// 	displayField: "name",
					// 	xtype: "combo",
					// 	colspan: 1,
					// 	editable: false,
					// 	store: new Ext.data.ArrayStore({
					// 		fields: ['id', 'name'],
					// 		data: [
					// 			[1, '新增未确认记录'],
					// 			[2, '新增未匹配记录'],
					// 			[3, '已确认销售信息']
					// 		]
					// 	}),
					// 	value: '新增未确认记录',
					// 	allowBlank: false,
					// 	blankText: "没有选择销售等级",
					// 	listeners: {
					// 		specialkey: {
					// 			fn: me.onQueryEditSpecialKey,
					// 			scope: me
					// 		}
					// 	}
					// },
					// {
					// 	id: "editQueryEmployee",
					// 	labelWidth: 60,
					// 	labelAlign: "right",
					// 	labelSeparator: "",
					// 	fieldLabel: "业务员",
					// 	colspan: 1,
					// 	margin: "5, 0, 0, 0",
					// 	xtype: "psi_employeefield",
					// 	callbackFunc: me.setQueryEmployee,
					// 	parentCmp: me,
					// 	listeners: {
					// 		specialkey: {
					// 			fn: me.onQueryEditSpecialKey,
					// 			scope: me
					// 		}
					// 	}
					// },{
					// 	id: "editQueryType",
					// 	labelWidth: 60,
					// 	labelAlign: "right",
					// 	colspan: 1,
					// 	labelSeparator: "",
					// 	fieldLabel: "单据类型",
					// 	margin: "5, 0, 0, 0",
					// 	valueField: "name",
					// 	displayField: "name",
					// 	xtype: "combo",
					// 	editable: false,
					// 	store: new Ext.data.ArrayStore({
					// 		fields: ['id', 'name'],
					// 		data: [
					// 			[1, '导入未确认'],
					// 			[2, '已确认-未支付'],
					// 			[3, '已支付']
					// 		]
					// 	}),
					// 	value: '导入未确认',
					// 	allowBlank: false,
					// 	blankText: "没有选择销售等级",
					// 	listeners: {
					// 		specialkey: {
					// 			fn: me.onQueryEditSpecialKey,
					// 			scope: me
					// 		}
					// 	}
					// }, 
					{
						id: "editQueryFromDT",
                        fieldLabel: "抓取日期（起）",
						xtype: "datefield",
						margin: "5, 0, 0, 0",
						format: "Y-m-d",
						labelAlign: "right",
						colspan: 1,
						labelSeparator: "",
						value: new Date(2017, 0, 1),
						renderer: function(value) {
							return value.format("Y-m-d");
						},

					}, {
						id: "editQueryToDT",
                        fieldLabel: "至",
						xtype: "datefield",
						margin: "5, 0, 0, 0",
						format: "Y-m-d",
						colspan: 1,
						labelAlign: "right",
						labelSeparator: "",
						value: new Date(),
						renderer: function(value) {
							return value.format("Y-m-d");
						},
					}, {
						id: "editQueryType",
						labelWidth: 60,
						labelAlign: "right",
						colspan: 1,
						labelSeparator: "",
						fieldLabel: "抓取状态",
						margin: "5, 0, 0, 0",
						valueField: "name",
						displayField: "name",
						xtype: "combo",
						editable: false,
						store: new Ext.data.ArrayStore({
							fields: ['id', 'name'],
							data: [
								[1, '导入未确认'],
								[2, '已确认-未支付'],
								[3, '已支付']
							]
						}),
						value: '导入未确认',
						allowBlank: false,
						blankText: "没有选择销售等级",
						listeners: {
							specialkey: {
								fn: me.onQueryEditSpecialKey,
								scope: me
							}
						}
					},   {
						xtype: "container",
						colspan: 2,
						items: [{
							xtype: "button",
							text: "查询",
							width: 100,
							iconCls: "PSI-button-refresh",
							margin: "5, 0, 0, 20",
							handler: me.onQuery,
							scope: me
						}, {
							xtype: "button",
							text: "清空查询条件",
							width: 100,
							iconCls: "PSI-button-cancel",
							margin: "5, 0, 0, 5",
							handler: me.onClearQuery,
							scope: me
						}]
					}
				]
			}, {

				region: "center",
				layout: "border",
				border: 0,
				split: true,
				xtype: "tabpanel",
				items: [
						// me.getPViewAllDailySellGrid() == "0" ? null : me.getAllDailySellGrid(),
						// me.getPViewNewDailySellGrid() == "0" ? null : me.getNewDailySellGrid(),
						// me.getPViewUnMatchedDailySellGrid() == "0" ? null : me.getUnMatchedDailySellGrid(),
						me.getPViewImmediatelySellGrid() == "0" ? null : me.getImmediatelySellGrid()
					]
					// region: "center",
					// xtype: "panel",
					// layout: "border",
					// border: 0,
					// items: [{
					// 	region: "center",
					// 	layout: "fit",
					// 	border: 0,
					// 	items: [me.getAllDailySellGrid()]
					// },
					// {
					// 	xtype : "panel",
					// 	region : "west",
					// 	layout : "border",
					// 	width : 500,
					// 	split : true,
					// 	items : [{
					// 		xtype : "panel",
					// 		region : "center",
					// 		layout : "fit",
					// 		border : 0,
					// 		items : [me.getNewDailySellGrid()]
					// 	},{
					// 		xtype : "panel",
					// 		region : "south",
					// 		layout : "fit",
					// 		height : 400,
					// 		split : true,
					// 		border : 0,
					// 		items : [me.getUnMatchedDailySellGrid()]
					// 	}]
					// }]
			}]
		});

		me.callParent(arguments);
		me.refreshAllGrid();
		me.__queryEditNameList = ["editQueryName", "editQueryType", "editQueryDrug", "editQueryHospital"];
	},
	refreshAllGrid: function() {
		var me = this;

		if (me.immediatelySellGrid) {
			me.immediatelySellGrid.getStore().removeAll();
			me.immediatelySellGrid.getStore().load();
		}
	},

	//获取实时流向
	getImmediatelySellGrid: function() {
		var me = this;
		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 1, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
		});
		if (me._immediatelySellGrid) {
			return me._immediatelySellGrid;
		}

		var allDailySellStore = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: me.modelName,
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/DailySellFetch/realTimeList",
				reader: {
					root: 'dailySellList',
					totalProperty: 'totalCount'
				}
			},
			filters: [{
				property: 'employee_name',
				value: '公司'
			}]
		});

		allDailySellStore.on("beforeload", function() {
			allDailySellStore.proxy.extraParams = me.getQueryParam(3);
			sum = 0;
		});
		allDailySellStore.on("load", function(e, records, successful) {
			if (successful) {
				me.gotoDailySellGridRecord(me.__lastId);
			}
		});

		me._immediatelySellGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			title: "实时流向",
			features: [{
				ftype: 'summary',
				dock: 'bottom'
			}],
			bbar: [{
				id: "pagingToolbarIm",
				border: 0,
				xtype: "pagingtoolbar",
				store: allDailySellStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageIm",
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
						["500"],
						["1000"],
						["2000"]
					]
				}),
				value: 20,
				listeners: {
					change: {
						fn: function() {
							allDailySellStore.pageSize = Ext
								.getCmp("comboCountPerPageIm")
								.getValue();
							allDailySellStore.currentPage = 1;
							Ext.getCmp("pagingToolbarIm")
								.doRefresh();
						},
						scope: me
					}
				}
			}, {
				xtype: "displayfield",
				value: "条记录"
			}, {
				xtype: "button",
				text: "删除条目",
				disable: me.getPDeleteDailySellItem() == 0,
				width: 100,
				margin: "5 0 0 10",
				iconCls: "PSI-button-delete",
				cls: "button-background-gray",
				handler: me.onDeleteAllItems,
				disabled: me.getPDeleteDailySellItem() == "0",
				scope: me
			}],
			columnLines: true,
			selModel: sm,
			columns: [
				Ext.create("Ext.grid.RowNumberer", {
					text: "序号",
					width: 100
				}),
				// {
				// 	header: "单据编号",
				// 	dataIndex: "bill_code",
				// 	menuDisabled: false,
				// 	sortable: false
				// }, {
				// 	header: "是否支付",
				// 	dataIndex: "if_paid",
				// 	menuDisabled: false,
				// 	sortable: true,
				// 	width: 20,
				// 	renderer: function(value) {
				// 		if (value == 0) {
				// 			return "是";
				// 		} else {
				// 			return "否";
				// 		}
				// 	}
				// }, {
				// 	header: "支付日期",
				// 	dataIndex: "pay_time",
				// 	width: 50,
				// }, {
				// 	header: "支付单单号",
				// 	dataIndex: "paybill_id",
				// },
				{
					header: "商业公司名称",
					dataIndex: "deliver_name",
					menuDisabled: false,
					sortable: true,
					width: 200,
					summaryType: function () {
						return '合计';
                    }
				}, {
					header: "抓取日期",
					dataIndex: "drug_guige",
					menuDisabled: false,
					sortable: true,
					width: 200
				}, {
					header: "抓取状态",
					dataIndex: "drug_manufacture",
					menuDisabled: false,
					sortable: true,
					width: 200
				}, {
					header: "药品品种数量",
					dataIndex: "batch_num",
					menuDisabled: false,
					sortable: false,
					width: 200
				}, {
					header: "条目数量",
					dataIndex: "expire_time",
					menuDisabled: false,
					sortable: false,
					width: 200
				}, {
                    header: "操作",
                    dataIndex: "expire_time",
                    menuDisabled: false,
                    sortable: false,
                    width: 200
                }
				// 	header: "医院名称",
				// 	dataIndex: "hospital_name",
				// 	menuDisabled: false,
				// 	sortable: false,
				// },
				// {
				// 	header: "业务员姓名",
				// 	dataIndex: "employee_name",
				// 	menuDisabled: false,
				// 	sortable: false,
				// 	width: 60
				// },{
				// 	header: "业务员身份",
				// 	dataIndex: "employee_des",
				// 	menuDisabled: false,
				// 	sortable: false,
				// 	width: 60
				// }, {
				// 	header: "业务员提成",
				// 	dataIndex: "employee_profit",
				// 	menuDisabled: false,
				// 	sortable: false,
				// 	width: 60
				// }, {
				// 	header: "配送公司",
				// 	dataIndex: "deliver_name",
				// 	menuDisabled: false,
				// 	sortable: false,
				// 	width: 100
				// }, 
                //
				// 	header: "销售数量",
				// 	dataIndex: "sell_amount",
				// 	menuDisabled: false,
				// 	sortable: false,
				// 	summaryType: function () {
				// 		return sum;
                 //    }
				// }, {
				// 	header: "销售日期",
				// 	dataIndex: "sell_date",
				// }
				// , {
				// 	header: "备注",
				// 	dataIndex: "note",
				// }, {
				// 	header: "操作详情",
				// 	dataIndex: "operate_info",
				// }
			],
			store: allDailySellStore,
			listeners: {
                selectionchange: function(view, record, item, index, e) {
                    if(record.length>0)
                        this.getView().findFeature('summary').onStoreUpdate();
                },
                select: function(view, record, item, index, e) {
                	sum += Number.parseInt(record.data['sell_amount']);
                },
                deselect: function(view, record, item, index, e) {
                    sum -= Number.parseInt(record.data['sell_amount']);
                }
			}
		});
		me.immediatelySellGrid = me._immediatelySellGrid;
		return me._immediatelySellGrid;
	},

	gotoDailySellGridRecord: function() {
		//var me = this;
		//var grid = me.DailySellGrid;
		//var store = grid.getStore();
		//if (id) {
		//	var r = store.findExact("id", id);
		//	if (r != -1) {
		//		grid.getSelectionModel().select(r);
		//	} else {
		//		grid.getSelectionModel().select(0);
		//	}
		//}
	},


	getQueryParam: function(grid_select) {
		var me = this;
		/*
		 *点击某一个表格下方的刷新按钮的时候，需要直接传入表格标识，当没有传入的时候，
		 *需要靠顶部的查询栏的表格选择下拉框来选择
		 */
		if (!grid_select) {
			var gridSelect = Ext.getCmp("editGridType").getValue();
			if (gridSelect == "新增未确认记录") {
				gridSelect = 1;
			} else if (gridSelect == "新增未匹配记录") {
				gridSelect = 2;
			} else if (gridSelect == "已确认销售信息") {
				gridSelect = 3;
			}
		} else {
			var gridSelect = grid_select;
		}

		// var employee_name = Ext.getCmp("editQueryEmployee").getValue();
		// var itemType = Ext.getCmp("editQueryType").getValue();
		// if (itemType == "导入未确认") {
		// 	itemType = 1;
		// } else if (itemType == "已确认-未支付") {
		// 	itemType = 2;
		// } else if (itemType == "已支付") {
		// 	itemType = 3;
		// }
		// var drug_name = Ext.getCmp("editQueryDrug").getValue();
		// var hospital_name = Ext.getCmp("editQueryHospital").getValue();

		var editQueryFromDT = date2string(Ext.getCmp("editQueryFromDT").getValue());
		var editQueryToDT = date2string(Ext.getCmp("editQueryToDT").getValue());
		var result = {};

		// if (parseInt(itemType) == itemType) {
		// result.status = itemType;
		// }
		if (editQueryFromDT != "") {
			result.sell_date_from = editQueryFromDT;
		}
		if (editQueryToDT != "") {
			result.sell_date_to = editQueryToDT;
		}
		if (parseInt(gridSelect) == gridSelect) {
			result.grid_type = gridSelect;
		}
		// if (drug_name) {
		// 	result.drug_name = drug_name;
		// }
		// if (hospital_name) {
		// 	result.hospital_name = hospital_name;
		// }
		// if (employee_name) {
		// result.employee_name = employee_name;
		// }
		return result;
	},

	/**
	 * 新增DailySell
	 */
	onAddDailySell: function() {
		if (this.getPAddDailySellItem() == "0") {
			PSI.MsgBox.showInfo("没有新增条目权限");
			return;
		}
		var form = Ext.create("PSI.DailySell.DailySellAddForm", {
			parentForm: this,
		});

		form.show();
	},

	/**
	 * 新增DailySell
	 */
	onEditDailySellForUnMatched: function() {
		var me = this;
		var items = me.unMatchedDailySellGrid.getSelectionModel().getSelection();
		if (items == null || items.length != 1) {
			PSI.MsgBox.showInfo("请选择一个未匹配的条目进行编辑");
			return;
		}
		var item = items[0];
		var form = Ext.create("PSI.DailySell.DailySellEditForm", {
			parentForm: this,
			entity: item
		});

		form.show();
	},



	/**
	 *动态修改已匹配DailySell条目的利润空间
	 */
	onEditDailySellProfit: function() {
		var me = this;
		var items = me.allDailySellGrid.getSelectionModel().getSelection();
		if (items == null || items.length < 1) {
			PSI.MsgBox.showInfo("请至少选择一个条目编辑");
			return;
		}
		var data = [];
		for (var i = 0; i < items.length; i++) {
			data.push(items[i].getData().id)
		}
		var form = Ext.create("PSI.DailySell.DailySellProfitEditForm", {
			parentForm: this,
			entity: data
		});
		form.show();
	},



	/**
	 * 删除销售
	 */
	onDeleteDailySell: function(items) {
		var me = this;
		if (me.getPDeleteDailySellItem() == "0") {
			PSI.MsgBox.showInfo("没有删除权限");
			return;
		}
		if (items == null || items.length < 1) {
			PSI.MsgBox.showInfo("请选择要删除的销售条目");
			return;
		}
		for (var i = 0; i < items.length; i++) {
			if (items[i].getData().status > 3) {
				PSI.MsgBox.showInfo("有已支付或者是被冻结单据被选择，请重新选择");
				return;
			}
		}

		var result = [];

		for (var i = 0; i < items.length; i++) {
			var temp = {};
			temp.id = items[i].getData().id;
			temp.status = items[i].getData().status;
			result.push(temp);
		}
		var info = "请确认是否删除销售条目: <span style='color:red'>" + "</span>";

		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/DailySell/deleteDailySellItems",
				method: "POST",
				params: {
					list: Ext.JSON.encode(result)
				},
				callback: function(options, success, response) {
					el.unmask();

					if (success) {
						var data = Ext.JSON
							.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.tip("成功完成删除操作");
						} else {
							PSI.MsgBox.showInfo(data.msg);
						}
					} else {
						PSI.MsgBox.showInfo("网络错误", function() {
							window.location.reload();
						});
					}

					Ext.getCmp("pagingToolbarAll")
						.doRefresh();
					Ext.getCmp("pagingToolbarUnMatched")
						.doRefresh();
					Ext.getCmp("pagingToolbarNew")
						.doRefresh();
				}

			});
		});
	},

	/**
	 * 导入销售信息
	 */
	onImportDailySells: function() {
		var form = Ext.create("PSI.DailySell.DailySellsImportForm", {
			parentForm: this
		});
		form.show();
	},

	/**
	 * 导出销售信息
	 */
	onEportDailySell: function() {
		var form = Ext.create("PSI.DailySell.DailySellExportForm", {
			parentForm: this
		});
		form.show();
	},

	onQueryEditSpecialKey: function(field, e) {
		if (e.getKey() === e.ENTER) {
			var me = this;
			var id = field.getId();
			for (var i = 0; i < me.__queryEditNameList.length - 1; i++) {
				var editorId = me.__queryEditNameList[i];
				if (id === editorId) {
					var edit = Ext.getCmp(me.__queryEditNameList[i + 1]);
					edit.focus();
					edit.setValue(edit.getValue());
				}
			}
		}
	},

	onLastQueryEditSpecialKey: function(field, e) {
		if (e.getKey() === e.ENTER) {
			this.onQuery();
		}
	},


	/**
	 * 查询
	 */
	onQuery: function() {
		var me = this;
		// var gridId = Ext.getCmp("editGridType").getValue();
		// var grid = null;
		// if (gridId == "新增未确认记录") {
		// 	grid = me.newDailySellGrid;
		// } else if (gridId == "新增未匹配记录") {
		// 	grid = me.unMatchedDailySellGrid;
		// } else if (gridId == "已确认销售信息") {
		// 	grid = me.allDailySellGrid;
		// }
		var grid = me._immediatelySellGrid;
		var store = grid.getStore();
		store.removeAll();
		store.load();
	},

	/**
	 * 清除查询条件
	 */
	onClearQuery: function() {
		var me = this;
		var nameList = me.__queryEditNameList;
		for (var i = 0; i < nameList.length; i++) {
			var name = nameList[i];
			var edit = Ext.getCmp(name);
			if (edit) {
				edit.setValue(null);
			}
		}

		me.onQuery();
	},



	setQueryEmployee: function(scope, data) {
		var me = this;
		if (scope) {
			me = scope;
		}
		Ext.getCmp("editQueryEmployeeId").setValue(data.id);
	},
	billStatusDisplay: function(value) {
		if (value == 0) {
			return "<a style='color:blue'>新添加已匹配完整记录</a>";
		} else if (value == 1) {
			return "<a style='color:red'>新添加未匹配不完整记录</a>";
		} else if (value == 2) {
			return "<a style='color:green'>待支付</a>";
		} else if (value == 3) {
			return "<a style='color:deeppink'>已支付</a>";
		} else if (value == 4) {
			return "<a style='color:yellow'>已冻结</a>";
		}
	},
	onConfirmNewItems: function() {
		var me = this;
		var Items = me.newDailySellGrid.getSelectionModel().getSelection();
		if (Items.length < 1) {
			PSI.MsgBox("请选择至少一条条目");
			return;
		}

		var inData = {
			inData: []
		};
		for (var i = 0; i < Items.length; i++) {
			var temp = Items[i].getData();
			inData.inData.push(temp.id);
		}
		var el = me.getEl() || Ext.getBody();
		el.mask(PSI.Const.LOADING);
		Ext.Ajax.request({
			url: PSI.Const.BASE_URL + "Home/DailySell/confirmItems2official",
			method: "POST",
			params: {
				inData: Ext.JSON.encode(inData)
			},
			callback: function(options, success, response) {

				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					me.refreshAllGrid();
				}
				el.unmask();
			}
		});
	},

	onGenerateSaleItems: function() {
		var me = this;
		var Items = me.unMatchedDailySellGrid.getSelectionModel().getSelection();
		if (Items.length < 1) {
			PSI.MsgBox("请选择至少一条条目");
			return;
		}

		var inData = {
			inData: []
		};
		for (var i = 0; i < Items.length; i++) {
			var temp = Items[i].getData();
			inData.inData.push(temp.id);
		}
		var el = me.getEl() || Ext.getBody();
		el.mask(PSI.Const.LOADING);
		Ext.Ajax.request({
			url: PSI.Const.BASE_URL + "Home/DailySell/confirmItems2official",
			method: "POST",
			params: {
				inData: Ext.JSON.encode(inData)
			},
			callback: function(options, success, response) {

				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					me.refreshAllGrid();
				}
				el.unmask();
			}
		});
	},
	onDeleteAllItems: function() {
		var items = this.allDailySellGrid.getSelectionModel().getSelection();
		this.onDeleteDailySell(items);
	},
	onDeleteUnMatchedItems: function() {
		var items = this.unMatchedDailySellGrid.getSelectionModel().getSelection();
		this.onDeleteDailySell(items);
	},
	onDeleteNewItems: function() {
		var items = this.newDailySellGrid.getSelectionModel().getSelection();
		this.onDeleteDailySell(items);
	},

});