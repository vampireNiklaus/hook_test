/**
 *编辑业务支付单- 主界面
 *
 * @author Baoyu Li
 */
Ext.define("PSI.InvestPay.InvestPayEditPanel", {
	extend : "Ext.panel.Panel",
	alias : "widget.psi_investpay_editPanel",

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
			fields : ["id", "employee_id","employee_name", "pay_account_id","pay_account_name", "pay_amount", "bill_date","bill_code",
				"creator_id","creator_name", "note", "status","pay_month","verifier_id","verifier_name",
				"operation_detail","create_time"]
		});



		Ext.apply(me, {
			border: 0,
			layout: "border",
			items: [
				{
					region: "center",
					layout: "fit",
					border: 0,
					height:400,
					items: [me.getAggregatePayItemGrid()]
				}
			]
		});


		me.callParent(arguments);
		me.refreshAggregatePayItemGrid(1);

	},
	/*
	* 点击某一个汇总条目的时候显示每一个详细的销售价的条目信息
	* */
	getSinglePayItemGrid : function(){

	},
	getAggregatePayItemGrid : function(){
		var me = this;
		if(me.__unMatchedDailySellGrid){
			return me.__unMatchedDailySellGrid;
		}
		var store = Ext.create("Ext.data.Store", {
			autoLoad : false,
			model : me.modelName,
			groupField:["id", "employee_id","employee_name", "pay_account_id","pay_account_name", "pay_amount",
				"bill_date","bill_code", "creator_id","creator_name", "note", "status","pay_month","verifier_id",
				"verifier_name", "operation_detail","create_time"],
			data : [],
			pageSize : 20,
			proxy : {
				type : "ajax",
				actionMethods : {
					read : "POST"
				},
				url : PSI.Const.BASE_URL + "Home/DailySell/dailySellList",
				reader : {
					root : 'dailySellList',
					totalProperty : 'totalCount'
				}
			}
		});
		store.on("beforeload", function() {
			// store.proxy.extraParams = me.getQueryParam();
		});
		store.on("load", function(e, records, successful) {
			if (successful) {
				// me.gotoUnEditedGridRecord(me.__lastId);
			}
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
			selModel: sm,
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
				header : "业务员",
				dataIndex : "employee_name",
				menuDisabled : false,
				sortable : false
			}, {
				header : "支付账户",
				dataIndex : "pay_account_name",
				menuDisabled : false,
				sortable : false
			}, {
				header : "支付金额",
				dataIndex : "pay_amount",
			}, {
				header : "业务日期",
				dataIndex : "bill_date",
			}, {
				header : "单据编号",
				dataIndex : "bill_code",
				menuDisabled : false,
				sortable : false
			}, {
				header : "单据状态",
				dataIndex : "status",
				menuDisabled : false,
				sortable : false,
				width : 60
			}, {
				header : "支付月份",
				dataIndex : "pay_month",
			}, {
				header : "审核人",
				dataIndex : "verifier_name",
				menuDisabled : false,
				sortable : false,
			}, {
				header : "操作记录",
				dataIndex : "operation_detail",
				menuDisabled : false,
				sortable : false
			},{
				header : "创建人",
				dataIndex : "creator_name",
				xtype:"hidden"
			}, {
				header : "备注",
				dataIndex : "note",
				menuDisabled : false,
				sortable : false,
				width : 60
			}, {
				header : "创建时间",
				dataIndex : "create_time",
			}],
			store : store,
			bbar : [{
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
			}
		});

		me.unMatchedDailySellGrid = me.__unMatchedDailySellGrid;
		return me.__unMatchedDailySellGrid;
	},
	refreshAggregatePayItemGrid:function(currentPage){
		var me = this;
		var grid = me.unMatchedDailySellGrid;
		var store = grid.getStore();
		if(currentPage)
			store.currentPage = currentPage;
		// store.removeAll();
		store.load();
	}



});