/**
 * 代销进货单 - 主界面
 *
 * @author RCG
 */
Ext.define("PSI.DelePurchase.MainForm", {
	extend : "Ext.panel.Panel",

	config : {
		pAddDelePurchaseBill: null,
		pEditDelePurchaseBill: null,
		pDeleteDelePurchaseBill: null,
		pImportDelePurchaseBill: null,
		pExportDelePurchaseBill: null,
		pVerifyDelePurchaseBill: null,
		pRevertVerifyDelePurchaseBill: null
	},

	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;

		var modelName = "PSIDelePurchase";
		Ext.define(modelName, {
			extend : "Ext.data.Model",
			fields : ["id", "bill_code", "drug_id","common_name",'goods_name','jx','guige','jldw',
				'manufacturer', "supplier_id",'supplier_name', "deliver_id",'deliver_name','batch_num',
				"buy_amount", "unit", "per_price","sum_pay", "tax_unit_price", "sum_tax_money",
				"kaipiao_unit_price","sum_kaipiao_money","buy_date","kaidan_date","kaidan_bill_code",
				"note","kaidan_ren","verified","verifier_id","status","status_str","in_use","create_time","operate_info"]
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
				url : PSI.Const.BASE_URL + "Home/DelePurchase/listDelePurchase",
				reader : {
					type: 'json',
					root : 'delePurchaseList',
					totalProperty : 'totalCount'
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

		var delePurchaseGrid = Ext.create("Ext.grid.Panel", {
			viewConfig : {
				enableTextSelection : true
			},
			title : "代销进货单列表",
			bbar : [{
				id : "pagingToolbar",
				border : 0,
				xtype : "pagingtoolbar",
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
							store.pageSize = Ext.getCmp("comboCountPerPage").getValue();
							store.currentPage = 1;
							Ext.getCmp("pagingToolbar").doRefresh();
						},
						scope : me
					}
				}
			}, {
				xtype : "displayfield",
				value : "条记录"
			}],
			columnLines : true,
			columns : [Ext.create("Ext.grid.RowNumberer", {
				text : "序号",
				width : 50,
				menuDisabled : false,
			}), {
				header : "状态",
				dataIndex : "status_str",
				menuDisabled : false,
				sortable : true,
			}, {
				header : "系统单号",
				dataIndex : "bill_code",
				menuDisabled : false,
				sortable : true,
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
			}, {
				header : "剂型",
				dataIndex : "jx",
				menuDisabled : false,
			}, {
				header : "规格",
				dataIndex : "guige",
				menuDisabled : false,
			}, {
				header : "计量单位",
				dataIndex : "jldw",
				menuDisabled : false,
			},{
				header : "批号",
				dataIndex : "batch_num",
				menuDisabled : false,
				sortable : true
			}, {
				header : "买货数量",
				dataIndex : "buy_amount",
				menuDisabled : false,
				renderer:function(v){
					return '<b>'+v+'</b>';
				}
			}, {
				header : "买货单价",
				dataIndex : "per_price",
				menuDisabled : false,
				renderer:function(v){
					return '<b>'+v+'</b>';
				}
			}, {
				header : "买货金额",
				dataIndex : "sum_pay",
				menuDisabled : false,
				sortable : true,
				renderer:function(v){
					return '<b>'+v+'</b>';
				}
			}, {
				header : "开票单价",
				dataIndex : "kaipiao_unit_price",
				menuDisabled : false,
				sortable : true,
				renderer:function(v){
					return '<b>'+v+'</b>';
				}
			}, {

				header : "开票金额",
				dataIndex : "sum_kaipiao_money",
				menuDisabled : false,
				sortable : true,
				renderer:function(v){
					return '<b>'+v+'</b>';
				}
			},{
				header : "进货日期",
				dataIndex : "buy_date",
				menuDisabled : false,
				sortable : true
			}, {
				header : "开单日期",
				dataIndex : "kaidan_date",
				menuDisabled : false,
				sortable : true
			}, {
				header : "备注",
				dataIndex : "note",
				menuDisabled : false,
				sortable : true
			}, {
				header : "操作详情",
				dataIndex : "operate_info",
				menuDisabled : false,
				sortable : true
			}],
			store : store,
			listeners : {
				itemdblclick : {
					fn : me.onEditDelePurchase,
					scope : me
				},
				select : {
					fn : me.onUnGridSelect,
					scope : me
				},
			}
		});
		//鼠标移入显示详情
		delePurchaseGrid.getView().on('render', function(view) {
			view.tip = Ext.create('Ext.tip.ToolTip', {
				width:300,
				title:'进货单详情',
				padding:'5',
				// 所有的目标元素
				target: view.el,
				// 每个网格行导致其自己单独的显示和隐藏。
				delegate: view.itemSelector,
				// 在行上移动不能隐藏提示框
				trackMouse: true,
				// 立即呈现，tip.body可参照首秀前。
				renderTo: Ext.getBody(),
				autoHide:false,
				listeners: {
					// 当元素被显示时动态改变内容.
					beforeshow: function updateTipBody(tip) {
						var re=view.getRecord(tip.triggerElement);
						tip.update(
							"状态："+re.get('status_str')+"</br>"+
							"系统单号："+re.get('bill_code')+"</br>"+
							"药品通用名："+re.get('common_name') +"</span></br>"+
							"药品商品名："+re.get('goods_name')+"</span></br>"+
							"计量单位："+re.get('jldw')+"</span></br>"+
							"<span style='margin-right: 20px'>剂型："+re.get('jx') + "</span>规格："+re.get('guige')+"</br>"+
							// "生产公司："+re.get('jx') +"</br>"+
							"批号："+re.get('batch_num') +"</br>"+
							"供应商："+re.get('supplier_name') +"</br>"+
							"配送公司："+re.get('deliver_name')+"</br>"+
							"买货数量：<b style='color:red'>"+re.get('buy_amount') + "</b></br>"+
							"<span style='margin-right: 20px'>买货单价：<b style='color:red'>"+re.get('per_price') +
								"</b></span>买货金额：<b style='color:red'>"+re.get('sum_pay')+"</b></br>"+
							"<span style='margin-right: 20px'>开票单价：<b style='color:red'>"+re.get('kaipiao_unit_price') +
								"</b></span>开票金额：<b style='color:red'>"+re.get('sum_kaipiao_money')+"</b></br>"+
							// "<span style='margin-right: 20px'>税价：<b style='color:red'>"+re.get('tax_unit_price') +
							// 	"</b></span>税额：<b style='color:red'>"+re.get('sum_tax_money')+"</b></br>"+
							"开单日期："+re.get('kaidan_date')+"</br>"+
							"进货日期："+re.get('buy_date')+"</br>"+
							"开单人："+re.get('kandan_ren')+"</br>"+
							(re.get('verifier_id')>0?"审核人："+re.get('verifier_id')+"</br>":'')+
							"备注："+re.get('note')+"</br>"+
							"操作详情："+re.get('operate_info')
						);
					}
				}
			});
		});
		me.delePurchaseGrid = delePurchaseGrid;

		Ext.apply(me, {
			border : 0,
			layout : "border",
			tbar : [{
				text : "新增代销进货单",
				disabled : me.getPAddDelePurchaseBill() == "0",
				iconCls : "PSI-button-add",
				handler : me.onAddDelePurchase,
				scope : me,
				id:'buttonAdd',
			}, {
				text : "编辑代销进货单",
				disabled : me.getPEditDelePurchaseBill() == "0",
				iconCls : "PSI-button-edit",
				handler : me.onEditDelePurchase,
				scope : me,
				id:'buttonEdit',
			}, {
				text : "删除代销进货单",
				disabled : me.getPDeleteDelePurchaseBill() == "0",
				iconCls : "PSI-button-delete",
				handler : me.onDeleteDelePurchase,
				scope : me,
				id:'buttonDelete',
			},"-", {
				text : "审核",
				iconCls : "PSI-button-verify",
				disabled : me.getPVerifyDelePurchaseBill() == "0",
				scope : me,
				handler : me.onCommit,
				id : "buttonVerify"
			}, {
				text : "反审核",
				iconCls : "PSI-button-revert-verify",
				disabled : me.getPRevertVerifyDelePurchaseBill() == "0",
				scope : me,
				handler : me.onCommitReturn,
				id : "buttonRevertVerify"
			}, "-",  {
				text : "导入代销进货单列表",
				disabled : me.getPImportDelePurchaseBill() == "0",
				iconCls : "PSI-button-excelimport",
				handler : me.onImportDelePurchase,
				scope : me
			}, "-", {
				text : "导出代销进货单信息",
				disabled : me.getPExportDelePurchaseBill() == "0",
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
			}],
			items : [{
				region : "north",
				border : 0,
				height : 60,
				title : "查询条件",
				collapsible : true,
				layout : {
					type : "table",
					columns : 5
				},
				items : [{
					id : "bill_code",
					labelWidth : 60,
					labelAlign : "right",
					labelSeparator : "",
					fieldLabel : "单号",
					margin : "5, 0, 0, 0",
					xtype : "textfield",
					listeners : {
						specialkey : {
							fn : me.onQueryEditSpecialKey,
							scope : me
						}
					}
				}, {
					id : "common_name",
					labelWidth : 60,
					labelAlign : "right",
					labelSeparator : "",
					fieldLabel : "药品名称",
					margin : "5, 0, 0, 0",
					xtype : "textfield",
					listeners : {
						specialkey : {
							fn : me.onQueryEditSpecialKey,
							scope : me
						}
					}
				}, {
					xtype : "container",
					items : [{
						xtype : "button",
						text : "查询",
						width : 100,
						iconCls : "PSI-button-refresh",
						margin : "5, 0, 0, 20",
						handler : me.onQuery,
						scope : me
					}, {
						xtype : "button",
						text : "清空查询条件",
						width : 100,
						iconCls : "PSI-button-cancel",
						margin : "5, 0, 0, 5",
						handler : me.onClearQuery,
						scope : me
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
					items: [delePurchaseGrid]
				}]
			}]
		});

		me.callParent(arguments);
		me.refreshDelePurchaseGrid();
		me.__queryEditNameList = ["bill_code", "common_name"];

	},
	//页面刷新，传入页码的话就跳到指定页码，不传的话就是刷新当前页
	refreshDelePurchaseGrid:function(currentPage){
		var me = this;
		var grid = me.delePurchaseGrid;
		var store = grid.getStore();
		if(currentPage)
			store.currentPage = currentPage;
		store.removeAll();
		store.load();
	},
	getQueryParam : function() {
		var me = this;

		var result = { };

		var bill_code = Ext.getCmp("bill_code").getValue();
		if (bill_code) {
			result.bill_code = bill_code;
		}

		var common_name = Ext.getCmp("common_name").getValue();
		if (common_name) {
			result.common_name = common_name;
		}

		return result;
	},

	/**
	 * 新增代销进货单
	 */
	onAddDelePurchase : function() {
		var form = Ext.create("PSI.DelePurchase.DelePurchaseEditForm", {
			parentForm : this
		});

		form.show();
	},

	/**
	 * 编辑代销进货单
	 */
	onEditDelePurchase : function() {
		var me = this;

		var item = this.delePurchaseGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要编辑的代销进货单");
			return;
		}

		var delePurchase = item[0];
		if(delePurchase.get('status')==1){
			PSI.MsgBox.showInfo("已审核，无法修改");
			return;
		}

		var form = Ext.create("PSI.DelePurchase.DelePurchaseEditForm", {
			parentForm : this,
			entity : delePurchase
		});

		form.show();
	},

	/**
	 * 删除代销进货单
	 */
	onDeleteDelePurchase : function() {
		var me = this;
		var item = me.delePurchaseGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要删除的代销进货单");
			return;
		}

		var delePurchase = item[0];

		var store = me.delePurchaseGrid.getStore();
		var index = store.findExact("id", delePurchase.get("id"));
		index--;
		var preItem = store.getAt(index);
		if (preItem) {
			me.__lastId = preItem.get("id");
		}

		var info = "请确认是否删除代销进货单，单号: <span style='color:red'>" + delePurchase.get("bill_code")
			+ "</span> 药品：<span style='color:red'>" + delePurchase.get("common_name") + "</span>";

		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url : PSI.Const.BASE_URL
				+ "Home/DelePurchase/deleteDelePurchase",
				method : "POST",
				params : {
					id : delePurchase.get("id")
				},
				callback : function(options, success, response) {
					el.unmask();
					if (success) {
						var data = Ext.JSON.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.tip("成功完成删除操作");
							me.refreshDelePurchaseGrid();
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
	 * 导入代销进货单信息
	 */
	onImportDelePurchase : function() {
		//var form = Ext.create("PSI.Goods.GoodsImportForm", {
		//	parentForm : this
		//});
        //
		//form.show();
	},

	/**
	 * 导出代销进货单信息
	 */
	onEportDelePurchase : function() {
		//var form = Ext.create("PSI.Goods.GoodsImportForm", {
		//	parentForm : this
		//});
        //
		//form.show();
	},

	// 审核
	onCommit : function() {
		var me = this;
		var item = me.delePurchaseGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要操作的进货单");
			return;
		}
		var bill = item[0];

		if (bill.get("status") == 1) {
			PSI.MsgBox.showInfo("该进货单已经审核过了");
			return;
		}

		var info = "请确认进货单: <span style='color:red'>系统单号：" + bill.get("bill_code")
			+ "，药品："+bill.get("common_name")+"</span> 审核通过?";
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
		var item = me.delePurchaseGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要操作的进货单");
			return;
		}
		var bill = item[0];

		if (bill.get("status") != 1) {
			PSI.MsgBox.showInfo("该进货单无法进行此操作");
			return;
		}
		var info = "确认要反审核该进货单: <span style='color:red'>系统单号：" + bill.get("bill_code")
			+ "，药品："+bill.get("common_name")+"</span> ?";
		PSI.MsgBox.confirm(info, function() {
			me.verifyRequest(bill,'return')
		});
	},

	verifyRequest:function(bill,type){
		var id = bill.get("id");
		var me=this;
		var el = Ext.getBody();
		el.mask("正在提交中...");
		Ext.Ajax.request({
			url : PSI.Const.BASE_URL + "Home/DelePurchase/delePurchaseStatus",
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
							me.refreshDelePurchaseGrid();
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


	onQueryEditSpecialKey : function(field, e) {
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

	onLastQueryEditSpecialKey : function(field, e) {
		if (e.getKey() === e.ENTER) {
			this.onQuery();
		}
	},
	

	/**
	 * 查询
	 */
	onQuery : function() {
		var me = this;
		me.refreshDelePurchaseGrid(1);
	},

	/**
	 * 清除查询条件
	 */
	onClearQuery : function() {
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

	onUnGridSelect : function() {
		var grid = this.delePurchaseGrid;
		var item = grid.getSelectionModel().getSelection();
		var bill = item[0];
	},


});