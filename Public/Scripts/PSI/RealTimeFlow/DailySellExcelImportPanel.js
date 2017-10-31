/**
 *医院多选field - 主界面
 *
 * @author Baoyu Li
 */
Ext.define("PSI.DailySell.DailySellExcelImportPanel", {
	extend : "Ext.panel.Panel",
	alias : "widget.psi_dailySell_importPanel",

	config : {
		pAddCategory : null,
		pEditCategory : null,
		pDeleteCategory : null,
		pAddGoods : null,
		pEditGoods : null,
		pDeleteGoods : null,
		pImportGoods : null,
		pGoodsSI : null
	},

	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		me.unMatchedDailySellGrid = null;
		me.matchedDailySellGrid = null;
		me.modelName = "PSIDailySell";
		Ext.define(me.modelName, {
			extend : "Ext.data.Model",
			fields : ["id", "bill_code", "drug_id", "drug_name", "hospital_id","hospital_name",
				"batch_num", "sellamount", "stock_id","sell_date","create_time",
				"creator_id","note","if_paied","pay_time","paybill_id","status"]
		});



		Ext.apply(me, {
			border: 0,
			layout: "border",
			items: [{
					region: "north",
					layout: "fit",
					height: 150,
					border: 0,
					items: [me.getMatchedItemsGrid()]
				},
				{
					region: "center",
					layout: "fit",
					border: 0,
					height:150,
					items: [me.getUnMatchedItemsGrid()]
				}
			]
		});
		me.callParent(arguments);

	},
	getMatchedItemsGrid : function(){
		var me = this;
		if(me.__matchedDailySellGrid){
			return me.__matchedDailySellGrid;
		}
		var store = Ext.create("Ext.data.Store", {
			autoLoad : false,
			model : me.modelName,
			data : [],
			//pageSize : 20,
			//proxy : {
			//	type : "ajax",
			//	actionMethods : {
			//		read : "POST"
			//	},
			//	url : PSI.Const.BASE_URL + "Home/DailySell/hospitalList",
			//	reader : {
			//		root : 'hospitalList',
			//		totalProperty : 'totalCount'
			//	}
			//}
		});

		var sm = Ext.create('Ext.selection.CheckboxModel',
			{
				injectCheckbox:1,//checkbox位于哪一列，默认值为0
				//mode:'single',//multi,simple,single；默认为多选multi
				//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
				//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
				//enableKeyNav:false
			});
		me.__matchedDailySellGrid = Ext.create("Ext.grid.Panel", {
			viewConfig : {
				enableTextSelection : true
			},
			title : "已匹配---销售信息列表",
			//selModel: sm,
			columnLines : true,
			columns : [Ext.create("Ext.grid.RowNumberer", {
				text : "序号",
				width : 30
			}), {
				header : "id",
				dataIndex : "id",
				xtype : "hidden",
				menuDisabled : false,
				sortable : false
			}, {
				header : "单据编号",
				dataIndex : "bill_code",
				menuDisabled : false,
				sortable : false
			}, {
				header : "是否支付",
				dataIndex : "if_paied",
				menuDisabled : false,
				sortable : false
			}, {
				header : "支付日期",
				dataIndex : "pay_time",
			}, {
				header : "支付单单号",
				dataIndex : "paybill_id",
			}, {
				header : "单据状态",
				dataIndex : "status",
				menuDisabled : false,
				sortable : false
			}, {
				header : "drug_id",
				dataIndex : "drug_id",
				xtype:"hidden"
			}, {
				header : "药品名称",
				dataIndex : "drug_name",
				menuDisabled : false,
				sortable : false,
				width : 60
			}, {
				header : "药品批号",
				dataIndex : "batch_num",
				menuDisabled : false,
				sortable : false,
				width : 60
			}, {
				header : "hospital_id",
				dataIndex : "hospital_id",
				xtype : "hidden"
			}, {
				header : "医院名称",
				dataIndex : "hospital_name",
				menuDisabled : false,
				sortable : false,
			}, {
				header : "销售数量",
				dataIndex : "sellamount",
				menuDisabled : false,
				sortable : false
			}, {
				header : "stock_id",
				dataIndex : "stock_id",
				xtype:"hidden"
			}, {
				header : "销售日期",
				dataIndex : "sell_date",
			}, {
				header : "备注",
				dataIndex : "note",
			}],
			store : store,
			listeners : {
			}
		});

		me.matchedDailySellGrid = me.__matchedDailySellGrid;
		return me.__matchedDailySellGrid
	},
	getUnMatchedItemsGrid : function(){
		var me = this;
		if(me.__unMatchedDailySellGrid){
			return me.__unMatchedDailySellGrid;
		}
		var store = Ext.create("Ext.data.Store", {
			autoLoad : false,
			model : me.modelName,
			groupField:["hospital_code", "hospital_name", "region_id", "hospital_type",
				"pym", "note", "manager"],
			data : [],
			//pageSize : 20,
			//proxy : {
			//	type : "ajax",
			//	actionMethods : {
			//		read : "POST"
			//	},
			//	url : PSI.Const.BASE_URL + "Home/DailySell/hospitalList",
			//	reader : {
			//		root : 'hospitalList',
			//		totalProperty : 'totalCount'
			//	}
			//}
		});

		var sm = Ext.create('Ext.selection.CheckboxModel',
			{
				injectCheckbox:1,//checkbox位于哪一列，默认值为0
				//mode:'single',//multi,simple,single；默认为多选multi
				//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
				//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
				//enableKeyNav:false
			});
		me.__unMatchedDailySellGrid = Ext.create("Ext.grid.Panel", {
			viewConfig : {
				enableTextSelection : true
			},
			title : "未匹配匹配---销售信息列表",
			//selModel: sm,
			columnLines : true,
			columns : [Ext.create("Ext.grid.RowNumberer", {
				text : "序号",
				width : 30
			}), {
				header : "id",
				dataIndex : "id",
				xtype : "hidden",
				menuDisabled : false,
				sortable : false
			}, {
				header : "单据编号",
				dataIndex : "bill_code",
				menuDisabled : false,
				sortable : false
			}, {
				header : "是否支付",
				dataIndex : "if_paied",
				menuDisabled : false,
				sortable : false
			}, {
				header : "支付日期",
				dataIndex : "pay_time",
			}, {
				header : "支付单单号",
				dataIndex : "paybill_id",
			}, {
				header : "单据状态",
				dataIndex : "status",
				menuDisabled : false,
				sortable : false
			}, {
				header : "drug_id",
				dataIndex : "drug_id",
				xtype:"hidden"
			}, {
				header : "药品名称",
				dataIndex : "drug_name",
				menuDisabled : false,
				sortable : false,
				width : 60
			}, {
				header : "药品批号",
				dataIndex : "batch_num",
				menuDisabled : false,
				sortable : false,
				width : 60
			}, {
				header : "hospital_id",
				dataIndex : "hospital_id",
				xtype : "hidden"
			}, {
				header : "医院名称",
				dataIndex : "hospital_name",
				menuDisabled : false,
				sortable : false,
			}, {
				header : "销售数量",
				dataIndex : "sellamount",
				menuDisabled : false,
				sortable : false
			}, {
				header : "stock_id",
				dataIndex : "stock_id",
				xtype:"hidden"
			}, {
				header : "销售日期",
				dataIndex : "sell_date",
			}, {
				header : "备注",
				dataIndex : "note",
			}],
			store : store,
			listeners : {
			}
		});

		me.unMatchedDailySellGrid = me.__unMatchedDailySellGrid;
		return me.__unMatchedDailySellGrid;
	}



});