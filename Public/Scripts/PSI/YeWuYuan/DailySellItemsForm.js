/**
 * 销售日报表(按业务员汇总)
 */
Ext.define("PSI.YeWuYuan.DailySellItemsForm", {
	extend : "Ext.panel.Panel",

	border : 0,

	layout : "border",

	initComponent : function() {
		var me = this;

		Ext.apply(me, {
			tbar : [{
				text : "关闭",
				iconCls : "PSI-button-exit",
				handler : function() {
					location.replace(PSI.Const.BASE_URL);
				}
			},{
				xtype : "button",
				text : "导出到excel",
				width : 100,
				margin : "5, 0, 0, 10",
				iconCls : "PSI-button-excelexport",
				//handler : me.onExportGrid2Excel(store,"报表/销售报表/销售总表",me.__mainGrid),
				handler : me.onExportGrid2Excel4Main,
				scope : me
			}],
			items : [{
				region : "north",
				height : 60,
				border : 0,
				title : "查询条件",
				collapsible : true,
				layout : {
					type : "table",
					columns : 4
				},
				items : [{
					id : "editQueryDrug",
					xtype : "psi_drug_field",
					margin : "5, 0, 0, 0",
					labelAlign : "right",
					labelSeparator : "",
					fieldLabel : "药品",
					parentCmp:me,
				},{
					id : "editQueryDFrom",
					xtype : "datefield",
					margin : "5, 0, 0, 0",
					format : "Y-m-d",
					labelAlign : "right",
					labelSeparator : "",
					fieldLabel : "业务日期(起）",
					value : me.getMonthFirst()
				}, {
					id : "editQueryDTo",
					xtype : "datefield",
					margin : "5, 0, 0, 0",
					format : "Y-m-d",
					labelAlign : "right",
					labelSeparator : "",
					fieldLabel : "业务日期(止）",
					value : new Date()
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
						text : "重置查询条件",
						width : 100,
						margin : "5, 0, 0, 10",
						handler : me.onClearQuery,
						scope : me
					}]
				}]
			}, {
				region : "center",
				layout : "border",
				border : 0,
				items : [{
					region : "center",
					layout : "fit",
					border : 0,
					items : [me.getMainGrid()]
				}]
			}]
		});

		me.callParent(arguments);
		me.store.load();
	},

	getMainGrid : function() {
		var me = this;
		if (me.__mainGrid) {
			return me.__mainGrid;
		}

		var modelName = "PSIYeWuYuanDailySellItems";
		Ext.define(modelName, {
			extend : "Ext.data.Model",
			fields : ["id","bill_code","employee_id","employee_des","employee_profit",
				"employee_name","drug_name", "drug_guige","drug_manufacture", "hospital_name",
				"deliver_name", "batch_num","sell_amount", "sell_date","if_paid","pay_time","status","sum_money"]
		});
		me.store = Ext.create("Ext.data.Store", {
			autoLoad : false,
			model : modelName,
			data : [],
			pageSize : 20,
			proxy : {
				type : "ajax",
				actionMethods : {
					read : "POST"
				},
				url : PSI.Const.BASE_URL + "Home/YeWuYuan/dailySellItemsQueryData",
				reader : {
					root : 'all_data',
					totalProperty : 'totalCount'
				}
			}
		});


		me.store.on("beforeload", function() {
			me.store.proxy.extraParams = me.getQueryParam();
		});

		me.__mainGrid = Ext.create("Ext.grid.Panel", {
			viewConfig : {
				enableTextSelection : true
			},
			//forceFit:true,
			autoScroll: true,
			border : 0,
			columnLines : true,
			features: [
				{
					ftype: 'summary'
				}
			],
			columns : [{
				xtype : "rownumberer",
				width:40,
				summaryRenderer: function (value) {
					return "合计"
				}
			},{
				header : "推广费用",
				dataIndex : "employee_profit",
				menuDisabled : false,
				sortable : true,
				width:60
			}, {
				header : "药品名称",
				dataIndex : "drug_name",
				menuDisabled : false,
				sortable : true,
				width:80
			}, {
				header : "药品规格",
				dataIndex : "drug_guige",
				menuDisabled : false,
				sortable : false,
				width:90
			}, {
				header : "医院名称",
				dataIndex : "hospital_name",
				menuDisabled : false,
				sortable : true,
				width:350
			}, {
				header : "销售数量",
				dataIndex : "sell_amount",
				menuDisabled : false,
				sortable : true,
				width:65,
				summaryType: 'sum',
			},  {
				header : "销售金额",
				dataIndex : "sum_money",
				menuDisabled : false,
				sortable : true,
				width:65,
				summaryType: 'sum',
			}, {
				header : "配送公司",
				dataIndex : "deliver_name",
				menuDisabled : false,
				sortable : true,
				width:200
			},{
				header : "药品生产企业",
				dataIndex : "drug_manufacture",
				menuDisabled : false,
				sortable : true,
				width:200
			},  {
				header : "批号",
				dataIndex : "batch_num",
				menuDisabled : false,
				sortable : false,
				width:100
			}, {
				header : "销售日期",
				dataIndex : "sell_date",
				menuDisabled : false,
				sortable : true,
				width:90
			},{
				header : "身份",
				dataIndex : "employee_des",
				menuDisabled : false,
				sortable : true,
				width:65
			},  {
				header : "是否支付",
				dataIndex : "status",
				menuDisabled : false,
				sortable : true,
				renderer:function(v){
					switch (v){
						case '4':
							return '是';
						default :
							return '否';
					}
				},
				width:55
			}, {
				header : "支付日期",
				dataIndex : "pay_time",
				menuDisabled : false,
				sortable : true,
				width:90
			}],
			store : me.store,
			tbar : [{
				id : "pagingToobar",
				xtype : "pagingtoolbar",
				border : 0,
				store : me.store
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
					data : [["20"], ["50"], ["100"], ["300"], ["1000"]]
				}),
				value : 20,
				listeners : {
					change : {
						fn : function() {
							me.store.pageSize = Ext.getCmp("comboCountPerPage").getValue();
							me.store.currentPage = 1;
							Ext.getCmp("pagingToobar").doRefresh();
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



	onClearQuery : function() {
		var me = this;

		Ext.getCmp("editQueryDFrom").setValue(new Date());
		Ext.getCmp("editQueryDTo").setValue(new Date());
		Ext.getCmp("editQueryDrug").setValue("");

		me.onQuery();
	},

	getQueryParam : function() {
		var me = this;

		var result = {};

		var dtFrom = Ext.getCmp("editQueryDFrom").getValue();
		if (dtFrom) {
			result.dtFrom = Ext.Date.format(dtFrom, "Y-m-d");
		}

		var dtTo = Ext.getCmp("editQueryDTo").getValue();
		if (dtTo) {
			result.dtTo = Ext.Date.format(dtTo, "Y-m-d");
		}

		var drug_name = Ext.getCmp("editQueryDrug").getValue();
		if (drug_name) {
			result.drug_name = drug_name;
		}

		return result;
	},

	refreshMainGrid : function(id) {
		Ext.getCmp("pagingToobar").doRefresh();
	},

	getMonthFirst : function(){
		var data=new Date();
		var year=data.getFullYear();
		var month=data.getMonth()+1;
		month=month<10?'0'+month.toString():month;
		return year+'-'+month+'-01';
	},
	onExportGrid2Excel4Main: function(){
		var me = this;
		var config={ store:me.__mainGrid.getStore() ,
			title: "销售报表/销售条目"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(me.__mainGrid,config);//调用导出函数
	},
});