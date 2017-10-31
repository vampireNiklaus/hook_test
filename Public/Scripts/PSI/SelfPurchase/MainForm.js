/**
 * 自销采购单 - 主界面
 *
 * @author RCG
 */
Ext.define("PSI.SelfPurchase.MainForm", {
	extend: "Ext.panel.Panel",

	config: {
		pAddSelfPurchaseBill: null,
		pEditSelfPurchaseBill: null,
		pDeleteSelfPurchaseBill: null,
		pImportSelfPurchaseBill: null,
		pExportSelfPurchaseBill: null,
		pVerifySelfPurchaseBill: null,
		pRevertVerifySelfPurchaseBill: null
	},

	/**
	 * 初始化组件
	 */
	initComponent: function() {
		var me = this;
		var modelName = "PSISelfPurchase";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "bill_code", "drug_id", "common_name", 'goods_name', 'jx', 'guige', 'jldw',
				'manufacturer', "supplier_id", 'supplier_name', "kpgs_id", 'kpgs_name',
				"buy_amount", "unit", "per_price", "sum_pay", "tax_unit_price", "sum_tax_money",
				"kaipiao_unit_price", "sum_kaipiao_money", "buy_date", "kaidan_date", "kaidan_bill_code",
				"note", "kaidan_ren", "verified", "verifier_id", "status", "status_str", "in_use", "create_time", "operate_info"
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
				url: PSI.Const.BASE_URL + "Home/SelfPurchase/listSelfPurchase",
				reader: {
					type: 'json',
					root: 'selfPurchaseList',
					totalProperty: 'totalCount'
				}
			}
		});

		store.on("beforeload", function() {
			store.proxy.extraParams = me.getQueryParam();
		});
		store.on("load", function(e, records, successful) {
			if (successful) {
				//点击分页下的刷新按钮的动作
			}
		});

		var selfPurchaseGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			title: "自销采购单列表",
			bbar: [{
				id: "pagingToolbar",
				border: 0,
				xtype: "pagingtoolbar",
				store: store
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPage",
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
							Ext.getCmp("pagingToolbar").doRefresh();
						},
						scope: me
					}
				}
			}, {
				xtype: "displayfield",
				value: "条记录"
			}],
			columnLines: true,
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				width: 50,
				menuDisabled: false,
			}), {
				header: "状态",
				dataIndex: "status_str",
				menuDisabled: false,
				sortable: true,
			}, {
				header: "系统单号",
				dataIndex: "bill_code",
				menuDisabled: false,
				sortable: true,
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
			}, {
				header: "规格",
				dataIndex: "guige",
				menuDisabled: false,
			}, {
				header: "计量单位",
				dataIndex: "jldw",
				menuDisabled: false,
			}, {
				header: "供应商",
				dataIndex: "supplier_name",
				menuDisabled: false,
			}, {
				header: "开票公司",
				dataIndex: "kpgs_name",
				menuDisabled: false,
			}, {
				header: "买货数量",
				dataIndex: "buy_amount",
				menuDisabled: false,
				renderer: function(v) {
					return '<b>' + v + '</b>';
				}
			}, {
				header: "买货单价",
				dataIndex: "per_price",
				menuDisabled: false,
				renderer: function(v) {
					return '<b>' + v + '</b>';
				}
			}, {
				header: "买货金额",
				dataIndex: "sum_pay",
				menuDisabled: false,
				sortable: true,
				renderer: function(v) {
					return '<b>' + v + '</b>';
				}
			}, {
				header: "采购日期",
				dataIndex: "buy_date",
				menuDisabled: false,
				sortable: true
			}, {
				header: "开单日期",
				dataIndex: "kaidan_date",
				menuDisabled: false,
				sortable: true
			}, {
				header: "备注",
				dataIndex: "note",
				menuDisabled: false,
				sortable: true
			}, {
				header: "操作详情",
				dataIndex: "operate_info",
				menuDisabled: false,
				sortable: true
			}],
			store: store,
			listeners: {
				itemdblclick: {
					fn: me.onEditSelfPurchase,
					scope: me
				},
				select: {
					fn: me.onUnGridSelect,
					scope: me
				},
			}
		});
		//鼠标移入显示详情
		selfPurchaseGrid.getView().on('render', function(view) {
			view.tip = Ext.create('Ext.tip.ToolTip', {
				width: 300,
				title: '采购单详情',
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
							"计量单位：" + re.get('jldw') + "</span></br>" +
							"<span style='margin-right: 20px'>剂型：" + re.get('jx') + "</span>规格：" + re.get('guige') + "</br>" +
							"生产公司：" + re.get('jx') + "</br>" +
							"供应商：" + re.get('supplier_name') + "</br>" +
							"开票公司：" + re.get('kpgs_name') + "</br>" +
							"买货数量：<b style='color:red'>" + re.get('buy_amount') + "</b></br>" +
							"<span style='margin-right: 20px'>买货单价：<b style='color:red'>" + re.get('per_price') +
							"</b></span>买货金额：<b style='color:red'>" + re.get('sum_pay') + "</b></br>" +
							"<span style='margin-right: 20px'>开票单价：<b style='color:red'>" + re.get('kaipiao_unit_price') +
							"</b></span>开票金额：<b style='color:red'>" + re.get('sum_kaipiao_money') + "</b></br>" +
							"<span style='margin-right: 20px'>税价：<b style='color:red'>" + re.get('tax_unit_price') +
							"</b></span>税额：<b style='color:red'>" + re.get('sum_tax_money') + "</b></br>" +
							"开单日期：" + re.get('kaidan_date') + "</br>" +
							"采购日期：" + re.get('buy_date') + "</br>" +
							"开单人：" + re.get('kaidan_ren') + "</br>"
							// +
							// (re.get('verifier_id')>0?"审核人："+re.get('verifier_id')+"</br>":'')+
							// "备注："+re.get('note')+"</br>"+
							// "操作详情："+re.get('operate_info')
						);
					}
				}
			});
		});
		me.selfPurchaseGrid = selfPurchaseGrid;
		Ext.apply(me, {
			border: 0,
			layout: "border",
			tbar: [{
				text: "新增自销采购单",
				disabled: me.getPAddSelfPurchaseBill() == "0",
				iconCls: "PSI-button-add",
				handler: me.onAddSelfPurchase,
				scope: me,
				id: 'buttonAdd',
			}, {
				text: "编辑自销采购单",
				disabled: me.getPEditSelfPurchaseBill() == "0",
				iconCls: "PSI-button-edit",
				handler: me.onEditSelfPurchase,
				scope: me,
				id: 'buttonEdit',
			}, {
				text: "删除自销采购单",
				disabled: me.getPDeleteSelfPurchaseBill() == "0",
				iconCls: "PSI-button-delete",
				handler: me.onDeleteSelfPurchase,
				scope: me,
				id: 'buttonDelete',
			}, "-", {
				text: "审核",
				iconCls: "PSI-button-verify",
				disabled: me.getPVerifySelfPurchaseBill() == "0",
				scope: me,
				handler: me.onCommit,
				id: "buttonVerify"
			}, {
				text: "反审核",
				iconCls: "PSI-button-revert-verify",
				disabled: me.getPRevertVerifySelfPurchaseBill() == "0",
				scope: me,
				handler: me.onCommitReturn,
				id: "buttonRevertVerify"
			}, "-", {
				text: "导入自销采购单列表",
				disabled: me.getPImportSelfPurchaseBill() == "0",
				iconCls: "PSI-button-excelimport",
				handler: me.onImportSelfPurchase,
				scope: me
			}, {
				text: "导出自销采购单信息",
				disabled: me.getPExportSelfPurchaseBill() == "0",
				iconCls: "PSI-button-excelexport",
				handler: me.onExportSelfPurchase,
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
				border: 0,
				height: 60,
				title: "查询条件",
				collapsible: true,
				layout: {
					type: "table",
					columns: 5
				},
				items: [{
					id: "bill_code",
					labelWidth: 60,
					labelAlign: "right",
					labelSeparator: "",
					fieldLabel: "单号",
					margin: "5, 0, 0, 0",
					xtype: "textfield",
					listeners: {
						specialkey: {
							fn: me.onQueryEditSpecialKey,
							scope: me
						}
					}
				}, {
					id: "common_name",
					labelWidth: 60,
					labelAlign: "right",
					labelSeparator: "",
					fieldLabel: "药品名称",
					margin: "5, 0, 0, 0",
					xtype: "textfield",
					listeners: {
						specialkey: {
							fn: me.onQueryEditSpecialKey,
							scope: me
						}
					}
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
							[1, '已审核'],
							[2, '不通过审核']
						]
					}),
					value: 0,
					allowBlank: false,
					blankText: "没有选择业务支付等级",
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
				layout: "border",
				border: 0,
				items: [{
					region: "center",
					layout: "fit",
					border: 0,
					items: [selfPurchaseGrid]
				}]
			}]
		});

		me.callParent(arguments);
		me.refreshSelfPurchaseGrid();
		me.__queryEditNameList = ["bill_code", "common_name"];
	},
	//页面刷新，传入页码的话就跳到指定页码，不传的话就是刷新当前页
	refreshSelfPurchaseGrid: function(currentPage) {
		var me = this;
		var grid = me.selfPurchaseGrid;
		var store = grid.getStore();
		if (currentPage)
			store.currentPage = currentPage;
		store.removeAll();
		store.load();
	},
	getQueryParam: function() {
		var me = this;

		var result = {};

		var bill_code = Ext.getCmp("bill_code").getValue();
		if (bill_code) {
			result.bill_code = bill_code;
		}

		var status = Ext.getCmp("editQueryType").getValue();
		if (status != -1) {
			result.status = status;
		}

		var common_name = Ext.getCmp("common_name").getValue();
		if (common_name) {
			result.common_name = common_name;
		}

		return result;
	},

	/**
	 * 新增自销采购单
	 */
	onAddSelfPurchase: function() {
		var form = Ext.create("PSI.SelfPurchase.SelfPurchaseEditForm", {
			parentForm: this
		});

		form.show();
	},

	/**
	 * 编辑自销采购单
	 */
	onEditSelfPurchase: function() {
		var me = this;

		var item = this.selfPurchaseGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要编辑的自销采购单");
			return;
		}

		var selfPurchase = item[0];
		if (selfPurchase.get('status') == 1) {
			PSI.MsgBox.showInfo("已审核，无法修改");
			return;
		}

		var form = Ext.create("PSI.SelfPurchase.SelfPurchaseEditForm", {
			parentForm: this,
			entity: selfPurchase
		});

		form.show();
	},

	/**
	 * 删除自销采购单
	 */
	onDeleteSelfPurchase: function() {
		var me = this;
		var item = me.selfPurchaseGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要删除的自销采购单");
			return;
		}

		var selfPurchase = item[0];

		var store = me.selfPurchaseGrid.getStore();
		var index = store.findExact("id", selfPurchase.get("id"));
		index--;
		var preItem = store.getAt(index);
		if (preItem) {
			me.__lastId = preItem.get("id");
		}

		var info = "请确认是否删除自销采购单，单号: <span style='color:red'>" + selfPurchase.get("bill_code") + "</span> 药品：<span style='color:red'>" + selfPurchase.get("common_name") + "</span>";

		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/SelfPurchase/deleteSelfPurchase",
				method: "POST",
				params: {
					id: selfPurchase.get("id")
				},
				callback: function(options, success, response) {
					el.unmask();
					if (success) {
						var data = Ext.JSON.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.tip("成功完成删除操作");
							me.refreshSelfPurchaseGrid();
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
	 * 导入自销采购单信息
	 */
	onImportSelfPurchase: function() {
		//var form = Ext.create("PSI.Goods.GoodsImportForm", {
		//	parentForm : this
		//});
		//
		//form.show();
	},

	/**
	 * 导出自销采购单信息
	 */
	onEportSelfPurchase: function() {
		//var form = Ext.create("PSI.Goods.GoodsImportForm", {
		//	parentForm : this
		//});
		//
		//form.show();
	},

	// 审核
	onCommit: function() {
		var me = this;
		var item = me.selfPurchaseGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要操作的采购单");
			return;
		}
		var bill = item[0];

		if (bill.get("status") == 1) {
			PSI.MsgBox.showInfo("该采购单已经审核过了");
			return;
		}

		var info = "请确认采购单: <span style='color:red'>系统单号：" + bill.get("bill_code") + "，药品：" + bill.get("common_name") + "</span> 审核通过?";
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
		var item = me.selfPurchaseGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要操作的采购单");
			return;
		}
		var bill = item[0];

		if (bill.get("status") != 1) {
			PSI.MsgBox.showInfo("该采购单无法进行此操作");
			return;
		}
		var info = "确认要反审核该采购单: <span style='color:red'>系统单号：" + bill.get("bill_code") + "，药品：" + bill.get("common_name") + "</span> ?";
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
			url: PSI.Const.BASE_URL + "Home/SelfPurchase/selfPurchaseStatus",
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
							me.refreshSelfPurchaseGrid();
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
		me.refreshSelfPurchaseGrid(1);
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

	onUnGridSelect: function() {
		var grid = this.selfPurchaseGrid;
		var item = grid.getSelectionModel().getSelection();
		var bill = item[0];
		//启用编辑或删除的按钮
		//应该设置已编辑的选中项为空
		if (bill.get('status') == 1) {} else {}
	},

	//导出表格
	onExportSelfPurchase: function() {
		var grid = this.selfPurchaseGrid;
		var config = {
			store: grid.getStore(),
			title: "自销采购单"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(grid, config); //调用导出函数
	},

});