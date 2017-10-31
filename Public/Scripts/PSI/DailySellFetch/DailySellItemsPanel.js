/**
 * 药品-代理商对应关系 - 主界面
 */
Ext.define("PSI.DailySell.DailySellItemsPanel", {
	extend : "Ext.panel.Panel",
	alias : "widget.psi_dailySellItemsPanel",

	collapsible: false,
	config : {
		pAddSupplier : null,
		pEditSupplier : null,
		pDeleteSupplier : null,
		inData : undefined,
	},

	initComponent : function() {
		var me = this;
		me.__readOnly = false;
		me.dailySellItemsGrid = null;
		Ext.apply(me, {
			border : 0,
			layout : "border",
			items : [{
						region : "center",
						layout : "fit",
						width:900,
						height:500,
						border : 0,
						bodyPadding : 1,
						items : [me.getDailySellItemsGrid()]
					}]
		});
		me.callParent(arguments);
	},

	/**
	 * 药品销售详细条条目Grid
	 */
	getDailySellItemsGrid : function() {
		var me = this;
		if (me.__dailySellItemsGrid) {
			return me.__dailySellItemsGrid;
		}

		var modelName = "PSIDailySellItemsModel";
		Ext.define(modelName, {
			extend : "Ext.data.Model",
			fields : ["id","bill_code","employee_id","employee_des","employee_profit",
				"employee_name","drug_id","drug_name", "hospital_id","hospital_name",
				"batch_num","sell_amount","stock_id", "sell_date","create_time",
				"creator_id","note","if_paid","pay_time","paybill_id","status"]
		});

		me.__cellEditing = Ext.create("PSI.UX.CellEditing", {
			clicksToEdit : 1,
			listeners : {
				edit : {
					fn : me.cellEditingAfterEdit,
					scope : me
				}
			}
		});

		var drugDailySellStore = Ext.create("Ext.data.Store", {
			model : modelName,
			autoLoad : false,
			data : [{}],
			proxy : {
				type : "ajax",
				actionMethods : {
					read : "POST"
				},
				url : PSI.Const.BASE_URL + "Home/Drug/drugDailySellList",
				reader : {
					root : 'drugDailySellList',
					totalProperty : 'totalCount'
				}
			},
			listeners : {
				beforeload : {
					fn : function() {
						//drugDailySellStore.proxy.extraParams = me.getDrugDailySellQueryParam();
					},
					scope : me
				},
				load : {
					fn : function(e, records, successful) {
						if (successful) {
							//me.gotoDrugAssignHospitalGridRecord(me.__lastId);
						}
					},
					scope : me
				}
			}});
		me.__dailySellItemsGrid = Ext.create("Ext.grid.Panel", {
			viewConfig : {
				enableTextSelection : true
			},
			title : "利润分配详情",
			plugins : [me.__cellEditing],
			columnLines : true,
			columns : [
				Ext.create("Ext.grid.RowNumberer", {
					text : "序号",
					width : 40
				}),
				{
					header : "销售日期",
					dataIndex : "sell_date",
					width : 110,
					editor : {
						xtype : "datefield",
						format : "Y-m-d",
					},
					menuDisabled : false,
					sortable : false,
				},{
					header : "销量",
					dataIndex : "sell_amount",
					menuDisabled : false,
					align : "center",
					width : 50,
					editor : {
						xtype : "numberfield",
						allowDecimals : true,
						decimalPrecision: 0,
						hideTrigger : false
					}
				},{
					header : "销售医院",
					align : "center",
					dataIndex : "description",
					width : 120,
					editor : {
						xtype : "psi_hospitalfield"
					},
					menuDisabled : false,
					sortable : true
				},{
					header : "业务员",
					dataIndex : "employee_name",
					draggable : false,
					align : "center",
					width : 120,
					editor : {
						xtype : "psi_employeefield",
						parentCmp : me,
						//callbackFunc : me.selectEmployee,
						hideTrigger : false,
					}
				},{
					header : "提成",
					dataIndex : "profit_assign",
					menuDisabled : false,
					align : "center",
					width : 50,
					editor : {
						xtype : "numberfield",
						allowDecimals : true,
						decimalPrecision: 2,
						hideTrigger : false
					}
				},{
					header : "备注",
					dataIndex : "note",
					draggable : false,
					align : "center",
					width : 200,
					editor : {
						xtype : "textfield"
					}
				}, {
					header : "删除",
					id : "profitColumnActionDelete",
					align : "center",
					menuDisabled : false,
					draggable : false,
					width : 50,
					xtype : "actioncolumn",
					items : [{
						icon : PSI.Const.BASE_URL
						+ "Public/Images/icons/delete.png",
						handler : function(grid, row) {
							//me.onDeleteDrugDailySellItem(grid,row);
						},
						scope : me
					}]
				}, {
					header : "新增",
					id : "profitColumnActionAdd",
					align : "center",
					menuDisabled : false,
					draggable : false,
					width : 50,
					xtype : "actioncolumn",
					items : [{
						icon : PSI.Const.BASE_URL
						+ "Public/Images/icons/add.png",
						handler : function(grid, row) {
							var store = grid.getStore();
							//保存这一行的数据，如果保存成功，那么从数据库返回这一行的记录值，然后补充完整。
							store.add({});
							var me = this;

						},
						scope : me
					}]
				}
			],
			store:drugDailySellStore,
		});
		me.dailySellItemsGrid = me.__dailySellItemsGrid;
		return me.__dailySellItemsGrid;
	},

	cellEditingAfterEdit : function(editor, e) {
	},


});