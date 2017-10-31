/**
 *佣金回款 - 主界面
 *
 * @author Baoyu Li
 */
var defaultDate = new Date("2017-1-1")
Ext.define("PSI.DeleHuikuan.MainForm", {
	extend: "Ext.panel.Panel",

	config: {
		pAddDeleHuikuan: null,
		pEditDeleHuikuan: null,
		pDeleteDeleHuikuan: null,
		pImportDeleHuikuan: null,
		pExportDeleHuikuan: null,
		pVerifyDeleHuikuan: null,
		pRevertVerifyDeleHuikuan: null,
		pViewDeleHuikuanDetail: null,
		pDeleHuikuanSearch: null,
	},

	/**
	 * 初始化组件
	 */
	initComponent: function() {
		var me = this;
		me.newDeleHuikuanGrid = null;
		me.allDeleHuikuanGrid = null;

		me.modelName = "PSINewDeleHuikuan";
		Ext.define(me.modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "employee_id", "employee_name", "pay_account_id", "pay_account_name", "pay_amount", "bill_date", "bill_code",
				"creator_id", "creator_name", "note", "status", "pay_month", "verifier_id", "verifier_name",
				"operation_detail", "create_time", "operate_info"
			]
		});

		Ext.apply(me, {
			border: 0,
			layout: "border",
			tbar: [{
				text: "新增佣金回款条目",
				disabled: me.getPAddDeleHuikuan() == "0",
				iconCls: "PSI-button-add",
				handler: me.onAddDeleHuikuanItem,
				scope: me
			}, {
				text: "编辑佣金回款条目",
				disabled: me.getPEditDeleHuikuan() == "0",
				iconCls: "PSI-button-edit",
				handler: me.onEditDeleHuikuan,
				scope: me
			}, {
				text: "删除佣金回款条目",
				disabled: me.getPDeleteDeleHuikuan() == "0",
				iconCls: "PSI-button-delete",
				handler: me.onDeleteDeleHuikuan,
				scope: me
			}, "-", {
				text: "审核",
				disabled: me.getPVerifyDeleHuikuan() == "0",
				iconCls: "PSI-button-verify",
				scope: me,
				handler: me.onCommit,
				id: "buttonVerify"
			}, {
				text: "反审核",
				iconCls: "PSI-button-revert-verify",
				disabled: me.getPRevertVerifyDeleHuikuan() == "0",
				scope: me,
				handler: me.onCommitReturn,
				id: "buttonRevertVerify"
			}, "-", {
				text: "导出佣金回款信息",
				disabled: me.getPExportDeleHuikuan() == 0,
				iconCls: "PSI-button-excelexport",
				handler: me.onExportDeleHuikuan,
				scope: me
			}, "-", {
				text: "关闭",
				iconCls: "PSI-button-exit",
				handler: function() {
					location.replace(PSI.Const.BASE_URL);
				}
			}],
			items: [me.getPDeleHuikuanSearch() == "0" ? {} : {
				region: "north",
				border: 0,
				height: 60,
				title: "查询条件",
				collapsible: true,
				layout: {
					type: "table",
					columns: 5
				},
				items: [me.getPDeleHuikuanSearch() == "0" ? {} : {
					id: "mainQueryDrug",
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
					id: "editQueryEmployeeId",
					xtype: "hidden",

				}, {
					id: "editQueryType",
					labelWidth: 60,
					labelAlign: "right",
					labelSeparator: "",
					fieldLabel: "单据类型",
					margin: "5, 0, 0, 0",
					valueField: "id",
					displayField: "name",
					xtype: "combo",
					store: new Ext.data.ArrayStore({
						fields: ['id', 'name'],
						data: [
							[-1, '全部'],
							[0, '未审核'],
							[1, '已审核']
						]
					}),
					value: 0,
					allowBlank: false,
					blankText: "没有选择佣金回款等级",
					listeners: {
						specialkey: {
							fn: me.onQueryEditSpecialKey,
							scope: me
						}
					}
				}, {
					id: "editQueryFromDT",
					xtype: "datefield",
					margin: "5, 0, 0, 0",
					format: "Y-m-d",
					labelAlign: "right",
					labelSeparator: "",
					fieldLabel: "业务日期（起）",
					value: new Date("2017-01-01"),
					allowBlank: false,
					listeners: {
						specialkey: {
							fn: me.onQueryEditSpecialKey,
							scope: me
						}
					}
				}, {
					id: "editQueryToDT",
					xtype: "datefield",
					margin: "5, 0, 0, 0",
					format: "Y-m-d",
					labelAlign: "right",
					labelSeparator: "",
					fieldLabel: "业务日期（止）",
					value: new Date(),
					allowBlank: false,
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
				}]
			}, {
				region: "center",
				xtype: "panel",
				layout: "fit",
				border: 0,
				items: me.getNewDeleHuikuanGrid()
			}]
		});

		me.callParent(arguments);

		me.queryTotalDeleHuikuanCount();
		me.freshDeleHuikuanGrid();
		me.__queryEditNameList = ["mainQueryDrug",
			"editQueryType"
		];
	},
	//获取新添加未确认的佣金回款记录
	getNewDeleHuikuanGrid: function() {
		var me = this;
		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 1, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
		});
		if (me.__newDeleHuikuanGrid) {
			return me.__newDeleHuikuanGrid;
		}
		var modelName = "PSIDeleHuikuanModel";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "drug_id", 'common_name', 'goods_name', 'jx', 'guige', 'manufacturer',
				'bill_code', "supplier_id", 'supplier_name', "deliver_id", 'deliver_name', "kaipiao_unit_price",
				'huikuan_num', 'huikuan_money', 'huikuan_account', 'huikuan_account_name', 'batch_num',
				'huikuan_account_num', 'status', 'status_str', 'bill_date', 'parent_id', 'note', 'operate_info',
				'huikuan_code'
			]
		});
		var store = Ext.create("Ext.data.Store", {
			autoLoad: true,
			model: modelName,
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/DeleHuikuan/listDeleHuikuanEdit",
				reader: {
					root: 'deleHuikuanList',
					totalProperty: 'totalCount'
				}
			}
		});
		store.on("beforeload", function() {
			store.proxy.extraParams = me.getQueryParam();
		});
		store.on("load", function(e, records, successful) {});
		// var sm = Ext.create('Ext.selection.CheckboxModel',
		// 	{
		// 		injectCheckbox:0,//checkbox位于哪一列，默认值为0
		// 		//mode:'single',//multi,simple,single；默认为多选multi
		// 		//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
		// 		//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
		// 		//enableKeyNav:false
		// 	});
		me.__newDeleHuikuanGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			scroll: true,
			forceFit: true,
			border: 0,
			title: "佣金回款单列表",
			columnLines: true,
			selModel: sm,
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				width: 30
			}), {
				header: "状态",
				dataIndex: "status_str",
				menuDisabled: false,
				sortable: true,
			}, {
				header: "通用名",
				dataIndex: "common_name",
				menuDisabled: false,
				sortable: true
			}, {
				header: "商品名",
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
			}, {
				header: "批号",
				dataIndex: "batch_num",
				menuDisabled: false,
				sortable: true
			}, {
				header: "回款数量",
				dataIndex: "huikuan_num",
				menuDisabled: false,
				renderer: function(value) {
					return "<b style='color:red'>" + value + "</b>";
				}
			}, {
				header: "回款金额",
				dataIndex: "huikuan_money",
				menuDisabled: false,
			}, {
				header: "回款账户",
				dataIndex: "huikuan_account_name",
				menuDisabled: false,
			}, {
				header: "银行卡号",
				dataIndex: "huikuan_account_num",
				menuDisabled: false,
			}, {
				header: "单据日期",
				dataIndex: "bill_date",
				menuDisabled: false,
			}, {
				header: "备注",
				dataIndex: "note",
				menuDisabled: false,
			}, {
				header: "操作详情",
				dataIndex: "operate_info",
				menuDisabled: false,
			}],
			store: store,
			bbar: [{
				id: "pagingToolbarDeleHuikuan",
				border: 0,
				xtype: "pagingtoolbar",
				store: store
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageDeleHuikuan",
				xtype: "combobox",
				editable: false,
				width: 120,
				store: Ext.create("Ext.data.ArrayStore", {
					fields: ["text"],
					data: [
						["20"],
						["50"],
						["120"],
						["300"],
						["1200"]
					]
				}),
				value: 20,
				listeners: {
					change: {
						fn: function() {
							store.pageSize = Ext
								.getCmp("comboCountPerPageDeleHuikuan")
								.getValue();
							store.currentPage = 1;
							Ext.getCmp("pagingToolbarDeleHuikuan")
								.doRefresh();
						},
						scope: me
					}
				}
			}, {
				xtype: "displayfield",
				value: "条记录"
			}],

			// plugins: [{
			// 	ptype: 'rowexpander',
			// 	rowBodyTpl: [
			// 		'<div id="r_{id}" style="margin: 5px 0 30px 80px">',
			// 		'</div>'
			// 	]
			// }],
			listeners: {
				itemdblclick: {
					fn: function() {
						me.onEditDeleHuikuan();
						return false;
					},
					scope: me
				},
				select: {
					fn: me.onDailySellGridSelect,
					scope: me
				},
				beforerowselect: function() {
					return false;
				}
			}
		});

		me.__newDeleHuikuanGrid.view.on('expandBody', function(rowNode, record, expandRow, eOpts) {
			if (me.getPViewDeleHuikuanDetail() == "0") {
				PSI.MsgBox.showInfo("没有查看销售详情权限");
				return;
			}
			me.displayInnerGrid('r_' + record.get('id'));
		});

		me.__newDeleHuikuanGrid.view.on('collapsebody', function(rowNode, record, expandRow, eOpts) {
			me.destroyInnerGrid('r_' + record.get('id'));
			if (me.getPViewDeleHuikuanDetail() == "0") {
				PSI.MsgBox.showInfo("没有查看销售详情权限");
				return;
			}
		});
		me.newDeleHuikuanGrid = me.__newDeleHuikuanGrid;
		return me.__newDeleHuikuanGrid;
	},

	displayInnerGrid: function(renderId) {
		var modelName = renderId + '_model';
		Ext.define(modelName, {
			extend: 'Ext.data.Model',
			fields: ["drug_id", "drug_name", "drug_guige", "drug_manufacture",
				"hospital_id", "hospital_name", "huikuan_unit_price", "huikuan_status",
				"batch_num", "sell_amount", "sell_month", "sell_id_list"
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
				url: PSI.Const.BASE_URL + "Home/DeleHuikuan/getDeleHuikuanInnerDetailById",
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
			forceFit: true,
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				width: 30
			}), {
				header: "销售月份",
				dataIndex: "sell_month",
				width: 30,
				menuDisabled: false,
				sortable: false,
			}, {
				header: "批号",
				dataIndex: "batch_num",
				width: 30,
				menuDisabled: false,
				sortable: false,
			}, {
				header: "回款数量",
				dataIndex: "sell_amount",
				menuDisabled: false,
				width: 40,
				sortable: true,
				renderer: function(v) {
					return "<b style='color:blue'>" + v + "</b>";
				}
			}, {
				header: "回款单价",
				dataIndex: "huikuan_unit_price",
				menuDisabled: false,
				width: 40,
				sortable: true,
				renderer: function(v) {
					return "<b style='color:blue'>" + v + "</b>";
				}
			}, {
				header: "回款金额",
				menuDisabled: false,
				width: 40,
				sortable: true,
				renderer: function(value, meta, record) {
					return (record.get("huikuan_unit_price") * record.get("sell_amount")).toFixed("3");
				},
			}, {
				header: "医院",
				width: 150,
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
	destroyInnerGrid: function(record) {
		var parent = document.getElementById(record);
		var child = parent.firstChild;

		while (child) {
			child.parentNode.removeChild(child);
			child = child.nextSibling;
		}
	},


	getQueryParam: function() {
		var me = this;
		var result = {};
		var drug_id = Ext.getCmp("mainQueryDrug").getIdValue();
		if (drug_id) {
			result.drug_id = drug_id;
		}

		var status = Ext.getCmp("editQueryType").getValue();
		// if (status != -1) {
		result.status = status;
		// }

		var bill_date_from = Ext.getCmp("editQueryFromDT").getValue();
		if (bill_date_from != "") {
			result.bill_date_from = Ext.Date.format(bill_date_from, 'Y-m-d');
		}

		var bill_date_to = Ext.getCmp("editQueryToDT").getValue();
		if (bill_date_to != "") {
			result.bill_date_to = Ext.Date.format(bill_date_to, 'Y-m-d');
		}

		if (bill_date_from != "" && bill_date_to != "") {
			if (bill_date_from > bill_date_to) {
				var temp = bill_date_from;
				bill_date_from = bill_date_to;
				bill_date_to = temp;
				result.bill_date_from = bill_date_from;
				result.bill_date_to = bill_date_to;
			}
		}
		return result;
	},


	/**
	 * 编辑DeleHuikuan
	 */
	onEditDeleHuikuan: function() {
		var me = this;
		if (me.getPEditDeleHuikuan() == "0") {
			PSI.MsgBox.showInfo("没有编辑权限，无法编辑！");
			return;
		}
		var item = this.newDeleHuikuanGrid.getSelectionModel().getSelection();;
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择支付单");
			return;
		}
		if (item[0].get('status') == 1) {
			PSI.MsgBox.showInfo("已审核，无法编辑！");
			return;
		}
		var form = Ext.create("PSI.DeleHuikuan.DeleHuikuanEditForm", {
			parentForm: this,
			entity: item[0]
		});

		form.show();
	},

	/**
	 * 删除佣金回款
	 */
	onDeleteDeleHuikuan: function() {
		var me = this;
		var item = me.newDeleHuikuanGrid.getSelectionModel().getSelection();

		if (item == null || item.length == 0) {
			PSI.MsgBox.showInfo("请选择要删除的佣金回款");
			return;
		}


		var info = "确认要删除选中的" + item.length + "条佣金回款单吗？";

		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			var params = me.getSelects();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/DeleHuikuan/deleteDeleHuikuan",
				method: "POST",
				params: params,
				callback: function(options, success, response) {
					el.unmask();

					if (success) {
						var data = Ext.JSON
							.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.tip("成功完成删除操作");
							me.freshDeleHuikuanGrid();
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


	/**
	 * 导入佣金回款信息
	 */
	onAddDeleHuikuanItem: function() {
		var form = Ext.create("PSI.DeleHuikuan.DeleHuikuanEditForm", {
			parentForm: this,
		});
		form.show();
	},

	/**
	 * 导出佣金回款信息
	 */
	onExportDeleHuikuan: function() {
		// var url = PSI.Const.BASE_URL + "Home/DeleHuikuan/exportDeleHuikuan";
		// window.open(url);
		var grid = this.getNewDeleHuikuanGrid();
		var config = {
			store: grid.getStore(),
			title: "佣金回款单列表"
		};
		ExportExcel(grid, config); //调用导出函数
	},


	onQueryEditSpecialKey: function(field, e) {
		if (e.getKey() === e.ENTER) {
			var me = this;
			var id = field.getId();
			if (id === "mainQueryDrug" || id === "editQueryType" || id === "editQueryFromDT" || id === "editQueryToDT") {
				me.onQuery();
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
		me.freshDeleHuikuanGrid();
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


	/**
	 * 刷新佣金回款Grid
	 */
	freshDeleHuikuanGrid: function(id) {
		var me = this;
		var grid = me.newDeleHuikuanGrid;
		var store = grid.getStore();
		store.removeAll();
		store.load();
	},

	/**
	 * 刷新区域Grid
	 */
	freshRegionGrid: function() {
		var me = this;
		var grid = me.regionGrid;
		var store = grid.getStore();
		store.load();


	},



	onRegionGridSelect: function() {
		var me = this;
		me.DeleHuikuanGrid.getStore().currentPage = 1;
		me.freshDeleHuikuanGrid();
	},
	queryTotalDeleHuikuanCount: function() {
		var me = this;
		// Ext.Ajax.request({
		// 	url : PSI.Const.BASE_URL + "Home/DeleHuikuan/getTotalDeleHuikuanCount",
		// 	method : "POST",
		// 	params : me.getQueryParamForRegion(),
		// 	callback : function(options, success, response) {
		//
		// 		if (success) {
		// 			var data = Ext.JSON.decode(response.responseText);
		// 			Ext.getCmp("fieldTotalDeleHuikuanCount").setValue("共有佣金回款"
		// 				+ data.cnt + "家");
		// 		}
		// 	}
		// });
	},
	getQueryParamForRegion: function() {
		var me = this;
		var result = {};
		return result;
	},


	//获取选中的
	getSelects: function() {
		var me = this;
		var result = [];
		var grid = me.newDeleHuikuanGrid;
		var selects = grid.getSelectionModel().getSelection();

		//遍历获取id，塞进数组
		for (var i in selects) {
			result.push(selects[i].get('id'));
		}
		return Ext.JSON.encode({
			list: result
		});
	},

	// 审核
	onCommit: function() {
		var me = this;
		var item = me.newDeleHuikuanGrid.getSelectionModel().getSelection();
		var list = [];
		if (item == null || item.length == 0) {
			PSI.MsgBox.showInfo("没有选择要操作的佣金回款单");
			return;
		}

		// for(var i in item){
		// 	if(item[i].get('status')==0){
		// 		list.push(item[i].get('id'));
		// 	}
		// }
		if (item[0].get('status') == 0) {
			list.push(item[0].get('id'));
		}

		if (list.length == 0) {
			PSI.MsgBox.showInfo("请选择至少一个单据！");
			return;
		}

		var info = "确认选中的佣金回款单审核通过?（自动过滤已审核）";
		// PSI.MsgBox.verify(info, function() {
		// 	//审核通过
		// 	me.verifyRequest(list,'yes')
		// },function(){
		// 	//审核不通过
		// 	me.verifyRequest(list,'no')
		// });
		PSI.MsgBox.confirm(info, function() {
			me.verifyRequest(list, 'yes');
		})
	},
	// 反审核
	onCommitReturn: function() {
		var me = this;
		var item = me.newDeleHuikuanGrid.getSelectionModel().getSelection();
		var list = [];
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要操作的佣金回款单");
			return;
		}
		// for(var i in item){
		// 	if(item[i].get('status')==1){
		// 		list.push(item[i].get('id'));
		// 	}
		// }
		if (item[0].get('status') == 1) {
			list.push(item[0].get('id'));
		}
		console.log(list);

		if (list.length == 0) {
			PSI.MsgBox.showInfo("该佣金回款单无法进行此操作");
			return;
		}

		var info = "确认要反审核该佣金回款单？";
		PSI.MsgBox.confirm(info, function() {
			me.verifyRequest(list, 'return')
		});
	},

	verifyRequest: function(list, type) {
		var list = Ext.JSON.encode(list);
		var me = this;
		var el = Ext.getBody();
		el.mask("正在提交中...");
		Ext.Ajax.request({
			url: PSI.Const.BASE_URL + "Home/DeleHuikuan/deleHuikuanStatus",
			method: "POST",
			params: {
				list: list,
				type: type,
			},
			callback: function(options, success, response) {
				el.unmask();

				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					if (data.success) {
						PSI.MsgBox.showInfo("操作成功", function() {
							me.freshDeleHuikuanGrid();
						});
					} else {
						PSI.MsgBox.showInfo(data.msg);
					}
				} else {
					PSI.MsgBox.showInfo("网络错误", function() {
						window.location.reload();
					});
				}
				me.newDeleHuikuanGrid.deselectAll();
			}
		});
	},

});