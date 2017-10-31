/**
 * 回款单 - 主界面
 */
Ext.define("PSI.DeleHuikuan.MainForm", {
	extend : "Ext.panel.Panel",
	config : {
		pAddDeleHuikuanBill: null,
		pEditDeleHuikuanBill: null,
		pDeleteDeleHuikuanBill: null,
		pImportDeleHuikuanBill: null,
		pExportDeleHuikuanBill: null,
		pVerifyDeleHuikuanBill: null,
		pRevertVerifyDeleHuikuanBill: null
	},
	//页面初始化
	initComponent : function() {
		var me = this;
		Ext.apply(me, {
			border : 0,
			layout : "border",
			//获取工具栏
			tbar : me.getToolbarCmp(),
			items : [{
				region : "north",
				height : 90,
				border : 0,
				title : "查询条件",
				collapsible : true,
				layout : {
					type : "table",
					columns : 4
				},
				//获取查询栏
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
					//获取未编辑回款单
					items : [me.getUnEditedGrid()]
				}, {
					region : "center",
					layout : "fit",
					border : 0,
					//获取已编辑回款单
					items : [me.getEditedGrid()]
				}]
			}]
		});

		me.callParent(arguments);
		me.refreshUnEditedGrid(1);
		me.refreshEditedGrid(1);
	},
	//获取工具栏
	getToolbarCmp : function() {
		var me = this;
		return [{
			text : "编辑-提交回款单",
			iconCls : "PSI-button-edit",
			scope : me,
			handler : me.onEditBill,
			disabled: me.getPEditDeleHuikuanBill()=='0',
			id : "buttonEdit"
		}, "-", {
			text : "删除回款单",
			iconCls : "PSI-button-delete",
			disabled: me.getPDeleteDeleHuikuanBill()=='0',
			scope : me,
			handler : me.onDeleteBill,
			id : "buttonDelete"
		}, "-", {
			text : "审核",
			disabled: me.getPVerifyDeleHuikuanBill()=='0',
			iconCls : "PSI-button-verify",
			scope : me,
			handler : me.onCommit,
			id : "buttonVerify"
		}, {
			text : "反审核",
			iconCls : "PSI-button-revert-verify",
			disabled: me.getPRevertVerifyDeleHuikuanBill()=='0',
			scope : me,
			handler : me.onCommitReturn,
			id : "buttonRevertVerify"
		}, "-",  {
			text : "导入代销回款单列表",
			disabled : me.getPImportDeleHuikuanBill() == "0",
			iconCls : "PSI-button-excelimport",
			handler : me.onImportDelePurchase,
			scope : me
		}, "-", {
			text : "导出代销回款单信息",
			disabled : me.getPExportDeleHuikuanBill() == "0",
			iconCls : "PSI-button-excelexport",
			handler : me.onExportDelePurchase,
			scope : me
		},"-", {
			text : "帮助",
			iconCls : "PSI-help",
			handler : function() {
				window
					.open("http://www.kangcenet.com");
			}
		}, "-", {
			text : "关闭",
			iconCls : "PSI-button-exit",
			handler : function() {
				location.replace(PSI.Const.BASE_URL);
			}
		}];
	},
	//获取搜索栏
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
				data : [[-1, "全部"], [0, "待入库"], [1000, "已入库"]]
			}),
			value : -1
		}, {
			id : "editQueryRef",
			labelWidth : 60,
			labelAlign : "right",
			labelSeparator : "",
			fieldLabel : "采购单号",
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
		},{
			id : "editQueryPaymentType",
			labelAlign : "right",
			labelSeparator : "",
			fieldLabel : "付款方式",
			margin : "5, 0, 0, 0",
			xtype : "combo",
			queryMode : "local",
			editable : false,
			valueField : "id",
			store : Ext.create("Ext.data.ArrayStore", {
				fields : ["id", "text"],
				data : [[-1, "全部"], [0, "记应付账款"], [1, "现金付款"],
					[2, "预付款"]]
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
	//获取未编辑的回款单
	getUnEditedGrid : function() {
		var me = this;
		if (me.unEditedGrid) {
			return me.unEditedGrid;
		}

		var modelName = "PSIDeleHuikuanBill";
		Ext.define(modelName, {
			extend : "Ext.data.Model",
			fields : ["id", "drug_id",'common_name','goods_name','jx','guige','manufacturer',
				'bill_code', "tax_bill_id",'tax_sub_bill_code', "supplier_id",'supplier_name','batch_num',
				"deliver_id",'deliver_name', "kaipiao_unit_price",'huikuan_amount','sum_kaipiao_money',
				'need_amount','status_str','note','operate_info']
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
				url : PSI.Const.BASE_URL + "Home/DeleHuikuan/listDeleHuikuanUnEdit",
				reader : {
					root : 'deleHuikuanList',
					totalProperty : 'totalCount'
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
			viewConfig : {
				enableTextSelection : true
			},
			border : 0,
			title:"未编辑回款单列表",
			columnLines : true,
			columns : [Ext.create("Ext.grid.RowNumberer", {
				text : "序号",
				width : 30
			}),{
				header : "状态",
				dataIndex : "status_str",
				menuDisabled : false,
				sortable : true,
			}, {
				header : "系统单号",
				dataIndex : "bill_code",
				menuDisabled : false,
				sortable : false
			},{
				header : "药品通用名",
				dataIndex : "common_name",
				menuDisabled : false,
				sortable : true
			}, {
				header : "药品商品名",
				dataIndex : "goods_name",
				menuDisabled : false,
				sortable : true
			},{
				header : "剂型",
				dataIndex : "jx",
				menuDisabled : false,
				sortable : true
			}, {
				header : "规格",
				dataIndex : "guige",
				menuDisabled : false,
				sortable : true
			},{
				header : "批号",
				dataIndex : "batch_num",
				menuDisabled : false,
				sortable : true
			},{
				header : "总开票数量",
				dataIndex : "huikuan_amount",
				menuDisabled : false,
				renderer:function(value){
					return "<b style='color:blue'>"+ value +"</b>";
				},
			},{
				header : "待开票数量",
				dataIndex : "need_amount",
				menuDisabled : false,
				renderer:function(value){
					if(value>0)
						return "<b style='color:red'>"+ value +"</b>";
					else
						return value;
				}
			}, {
				header : "开票单价",
				dataIndex : "kaipiao_unit_price",
				menuDisabled : false,
				sortable : true
			}, {
				header : "开票金额",
				dataIndex : "sum_kaipiao_money",
				menuDisabled : false,
				sortable : true
			},{
				header : "生产产家",
				dataIndex : "manufacturer",
				menuDisabled : false,
				sortable : true
			},{
				header : "供应商",
				dataIndex : "supplier_name",
				menuDisabled : false,
				sortable : true
			},{
				header : "配送公司",
				dataIndex : "deliver_name",
				menuDisabled : false,
				sortable : true
			},{
				header : "操作详情",
				dataIndex : "operate_info",
				menuDisabled : false,
				sortable : true
			}],
			store : store,
			tbar : [{
				id : "pagingToobarUnEdited",
				xtype : "pagingtoolbar",
				border : 0,
				store : store
			}, "-", {
				xtype : "displayfield",
				value : "每页显示"
			}, {
				id : "comboCountPerPageUnEdited",
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
							store.pageSize = Ext.getCmp("comboCountPerPage").getValue();
							store.currentPage = 1;
							Ext.getCmp("pagingToobar").doRefresh();
						},
						scope : me
					}
				}
			}, {
				xtype : "displayfield",
				value : "条记录"
			}],
			listeners : {
				select : {
					fn : me.onUnEditedGridSelect,
					scope : me
				},
				itemdblclick : {
					fn : me.onEditBill,
					scope : me
				}
			}
		});

		return me.unEditedGrid;
	},
	//获取已编辑为审核的回款单
	getEditedGrid : function() {
		var me = this;
		if (me.editedGrid) {
			return me.editedGrid;
		}

		var modelName = "PSIDeleHuikuanBill";
		Ext.define(modelName, {
			extend : "Ext.data.Model",
			fields : ["id", "drug_id",'common_name','goods_name','jx','guige','manufacturer',
				'bill_code', "supplier_id",'supplier_name', "deliver_id",'deliver_name', "kaipiao_unit_price",
				'huikuan_num','huikuan_money', 'huikuan_account','huikuan_account_name','batch_num',
				'huikuan_account_num', 'status','status_str','bill_date','parent_id','note','operate_info',
				'huikuan_code']
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
				url : PSI.Const.BASE_URL + "Home/DeleHuikuan/listDeleHuikuanEdit",
				reader : {
					root : 'deleHuikuanList',
					totalProperty : 'totalCount'
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
			viewConfig : {
				enableTextSelection : true
			},
			border : 0,
			title:"已编辑回款单列表",
			columnLines : true,
			columns : [Ext.create("Ext.grid.RowNumberer", {
				text : "序号",
				width : 30
			}), {
				header : "状态",
				dataIndex : "status_str",
				menuDisabled : false,
				sortable : true,
			}, {
				header : "系统单号",
				dataIndex : "bill_code",
				menuDisabled : false,
				sortable : false
			}, {
				header : "药品通用名",
				dataIndex : "common_name",
				menuDisabled : false,
				sortable : true
			}, {
				header : "药品商品名",
				dataIndex : "goods_name",
				menuDisabled : false,
				sortable : true
			}, {
				header : "剂型",
				dataIndex : "jx",
				menuDisabled : false,
				sortable : true
			}, {
				header : "规格",
				dataIndex : "guige",
				menuDisabled : false,
				sortable : true
			}, {
				header : "生产产家",
				dataIndex : "manufacturer",
				menuDisabled : false,
			},{
				header : "批号",
				dataIndex : "batch_num",
				menuDisabled : false,
				sortable : true
			}, {
				header : "供应商",
				dataIndex : "supplier_name",
				menuDisabled : false,
			}, {
				header : "配送公司",
				dataIndex : "deliver_name",
				menuDisabled : false,
			}, {
				header : "回款数量",
				dataIndex : "huikuan_num",
				menuDisabled : false,
				renderer:function(value){
					return "<b style='color:red'>"+ value +"</b>";
				}
			}, {
				header : "开票单价",
				dataIndex : "kaipiao_unit_price",
				menuDisabled : false,
			}, {
				header : "开票金额",
				dataIndex : "huikuan_money",
				menuDisabled : false,
			},{
				header : "回款账户",
				dataIndex : "huikuan_account_name",
				menuDisabled : false,
			},{
				header : "银行卡号",
				dataIndex : "huikuan_account_num",
				menuDisabled : false,
			},{
				header : "单据编号",
				dataIndex : "huikuan_code",
				menuDisabled : false,
			},{
				header : "业务日期",
				dataIndex : "bill_date",
				menuDisabled : false,
			},{
				header : "备注",
				dataIndex : "note",
				menuDisabled : false,
			},{
				header : "操作详情",
				dataIndex : "operate_info",
				menuDisabled : false,
			}],
			store : store,
			tbar : [{
				id : "pagingToobarEdited",
				xtype : "pagingtoolbar",
				border : 0,
				store : store
			}, "-", {
				xtype : "displayfield",
				value : "每页显示"
			}, {
				id : "comboCountPerPageEdited",
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
							store.pageSize = Ext.getCmp("comboCountPerPage").getValue();
							store.currentPage = 1;
							Ext.getCmp("pagingToobar").doRefresh();
						},
						scope : me
					}
				}
			}, {
				xtype : "displayfield",
				value : "条记录"
			}],
			listeners : {
				select : {
					fn : me.onEditedGridSelect,
					scope : me
				},
				itemdblclick:{
					fn : me.onEditBill,
					scope : me
				}
			}
		});

		return me.editedGrid;
	},
	//未编辑回款单页面刷新，传入页码的话就跳到指定页码，不传的话就是刷新当前页
	refreshUnEditedGrid:function(currentPage){
		var me = this;
		var grid = me.unEditedGrid;
		var store = grid.getStore();
		if(currentPage)
			store.currentPage = currentPage;
		store.removeAll();
		store.load();
	},
	//已编辑回款单页面刷新，传入页码的话就跳到指定页码，不传的话就是刷新当前页
	refreshEditedGrid:function(currentPage){
		var me = this;
		var grid = me.editedGrid;
		var store = grid.getStore();
		if(currentPage)
			store.currentPage = currentPage;
		store.removeAll();
		store.load();
	},
	// 编辑回款单
	onEditBill : function() {
		var me = this;
		var isParent=true;
		var item = me.getUnEditedGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			//判断选择的是不是子单
			item = me.getEditedGrid().getSelectionModel().getSelection();
			isParent=false;
		}
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要编辑的回款单");
			return;
		}
		var bill = item[0];
		if(isParent&&bill.get('need_amount')==0)return;
		if(bill.get('status')==1)return;
		if(!isParent){
			//异步获取总量和剩余入库量
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/DeleHuikuan/getHuikuanAmount",
				method:'POST',
				params: {
					id: bill.get('id')
				},
				success: function(response){
					var text = response.responseText;
					var re= Ext.JSON.decode(text);
					bill.data.huikuan_amount=re['huikuan_amount'];
					bill.data.need_amount=re['need_amount'];
					bill.data.tax_sub_bill_code=re['tax_sub_bill_code'];
					var form = Ext.create("PSI.DeleHuikuan.DeleHuikuanEditForm", {
						parentForm : me,
						entity : bill
					});
					form.show();
				}
			});
		}else{
			var form = Ext.create("PSI.DeleHuikuan.DeleHuikuanEditForm", {
				parentForm : me,
				entity : bill
			});
			form.show();
		}

	},
	// 删除采购入库单
	onDeleteBill : function() {
		var me = this;
		var isParent=true;//true表示在上栏操作
		var item = me.getUnEditedGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			item = me.getEditedGrid().getSelectionModel().getSelection();
			isParent=false;
		}
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要删除的回款单");
			return;
		}

		var bill = item[0];

		var info = "请确认是否删除入库单: <span style='color:red'>单号：" + bill.get("bill_code")+" 药品名："+
			bill.get("common_name")+ "</span>";
		var me = this;
		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url : PSI.Const.BASE_URL + "Home/DeleHuikuan/deleteDeleHuikuan",
				method : "POST",
				params : {
					id : bill.get("id"),
					parent_id:bill.get('parent_id')
				},
				callback : function(options, success, response) {
					el.unmask();
					if (success) {
						var data = Ext.JSON.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.showInfo("成功完成删除操作", function() {
								if(isParent)
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
	onUnEditedGridSelect : function() {
		var gridE = this.getEditedGrid();
		var gridU = this.getUnEditedGrid();
		var item = gridU.getSelectionModel().getSelection();
		var bill = item[0];
		gridE.getSelectionModel().deselectAll();
	},
	//已编辑的条目被选择
	onEditedGridSelect : function() {
		var gridE = this.getEditedGrid();
		var gridU = this.getUnEditedGrid();
		var item = gridE.getSelectionModel().getSelection();
		var bill = item[0];
		//应该设置已编辑的选中项为空
		gridU.getSelectionModel().deselectAll();
	},
	// 审核
	onCommit : function() {
		var me = this;
		var item = me.editedGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要操作的回款单");
			return;
		}
		var bill = item[0];

		if (bill.get("status") == 1) {
			PSI.MsgBox.showInfo("该回款单已经审核过了");
			return;
		}

		var info = "请确认回款单: <span style='color:red'>系统单号：" + bill.get("bill_code")
			+ "，药品："+bill.get("common_name")+"，配送公司："+bill.get("deliver_name")+"</span> 审核通过?";
		PSI.MsgBox.verify(info, function() {
			//审核通过
			me.verifyRequest(bill,'yes')
		},function(){
			//审核不通过
			me.verifyRequest(bill,'no')
		});
	},
	// 反审核
	onCommitReturn:function(){
		var me = this;
		var item = me.editedGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要操作的回款单");
			return;
		}
		var bill = item[0];

		if (bill.get("status") != 1) {
			PSI.MsgBox.showInfo("该转账单无法进行此操作");
			return;
		}
		var info = "确认要反审核该转账单: <span style='color:red'>系统单号：" + bill.get("bill_code")
			+ "，药品："+bill.get("common_name")+"</span> ?";
		PSI.MsgBox.confirm(info, function() {
			me.verifyRequest(bill,'return')
		});
	},
	//发送审核请求
	verifyRequest:function(bill,type){
		var id = bill.get("id");
		var me=this;
		var el = Ext.getBody();
		el.mask("正在提交中...");
		Ext.Ajax.request({
			url : PSI.Const.BASE_URL + "Home/DeleHuikuan/deleHuikuanStatus",
			method : "POST",
			params : {
				id : id,
				type: type
			},
			callback : function(options, success, response) {
				el.unmask();

				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					if (data.success) {
						PSI.MsgBox.showInfo("操作成功", function() {
							me.refreshEditedGrid();
							me.refreshUnEditedGrid();
							if(type!='yes'){
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

	gotoUnEditedGridRecord : function(id) {
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
	gotoEditedGridRecord : function(id) {
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


	onQuery : function() {
		this.refreshUnEditedGrid();
	},

	onClearQuery : function() {
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

	getQueryParam : function() {
		var me = this;

		var result = {
			billStatus : Ext.getCmp("editQueryBillStatus").getValue()
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

});