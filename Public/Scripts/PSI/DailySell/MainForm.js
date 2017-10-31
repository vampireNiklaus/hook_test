/**
 *销售 - 主界面
 *
 * @author Baoyu Li
 */
var summaryFilters = ['employee_profit', 'sell_amount'];
var allSum = {
    'employee_profit': 0,
    'sell_amount': 0

};
var newSum = {
    'employee_profit': 0,
    'sell_amount': 0

};
var unMatchedSum = {
    'employee_profit': 0,
    'sell_amount': 0

};

Ext.define("PSI.DailySell.MainForm", {
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
			tbar: [{
				text: "新增销售条目",
				disabled: me.getPAddDailySellItem() == "0",
				iconCls: "PSI-button-add",
				handler: me.onAddDailySell,
				scope: me
			}, {
				text: "编辑销售条目",
				disabled: me.getPEditDailySellItem() == "0",
				iconCls: "PSI-button-edit",
				handler: me.onEditDailySellForUnMatched,
				scope: me
			}, {
				text: "修改业务提成",
				disabled: me.getPEditDailySellItemProfit() == "0",
				iconCls: "PSI-button-edit",
				handler: me.onEditDailySellProfit,
				scope: me
            },/*"-", {
                text: "自动抓取流向",
                iconCls: "PSI-button-excelimport",
                handler: me.onAutoFetchDailySells,
                scope: me
			},*/ "-", "-", {
				text: "导入销售列表",
				disabled: me.getPImportDailySellItem() == "0",
				iconCls: "PSI-button-excelimport",
				handler: me.onImportDailySells,
				scope: me
			},  "-", "-", {
				text: "关闭",
				iconCls: "PSI-button-exit",
				handler: function() {
					location.replace(PSI.Const.BASE_URL);
				}
			}],
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
				items: [ {
					id: "editQueryEmployee",
					labelWidth: 60,
					labelAlign: "right",
					labelSeparator: "",
					fieldLabel: "业务员",
					colspan: 1,
					margin: "5, 0, 0, 0",
					xtype: "psi_employeefield",
					callbackFunc: me.setQueryEmployee,
					parentCmp: me,
					listeners: {
						specialkey: {
							fn: me.onQueryEditSpecialKey,
							scope: me
						}
					}
				},

					{
					id: "editQueryFromDT",
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
					fieldLabel: "业务日期（起）"
				}, {
					id: "editQueryToDT",
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
					fieldLabel: "业务日期（止）"
				}, {
					id: "editQueryDrug",
					labelWidth: 60,
					labelAlign: "right",
					labelSeparator: "",
					fieldLabel: "品种",
					colspan: 1,
					margin: "5, 0, 0, 0",
					xtype: "psi_drug_field",
					listeners: {
						specialkey: {
							fn: me.onQueryEditSpecialKey,
							scope: me
						}
					}
				}, {
					id: "editQueryHospital",
					labelWidth: 60,
					labelAlign: "right",
					labelSeparator: "",
					fieldLabel: "医院",
					colspan: 1,
					margin: "5, 0, 0, 0",
					xtype: "psi_hospital_field",
					listeners: {
						specialkey: {
							fn: me.onQueryEditSpecialKey,
							scope: me
						}
					}
				}, {
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
				}]
			}, {
				region: "center",
				layout: "border",
				id: "mainTabPanel",
				border: 0,
				split: true,
				xtype: "tabpanel",
				activeTab: 0,
				items: [
						me.getPViewAllDailySellGrid() == "0" ? null : me.getAllDailySellGrid(),
						// me.getPViewNewDailySellGrid() == "0" ? null : me.getNewDailySellGrid(),
						me.getPViewUnMatchedDailySellGrid() == "0" ? null : me.getUnMatchedDailySellGrid(),
					],
			}]
		});

		me.callParent(arguments);
		Ext.getCmp('mainTabPanel').on('tabchange', function(tabPanel, newCard) {
            switch(newCard.id) {
				case "__allDailySellGrid_1":
                    me.allDailySellGrid.getStore().removeAll();
                    me.allDailySellGrid.getStore().load();
                    return;
                case "__newDailySellGrid_2":
                    me.newDailySellGrid.getStore().removeAll();
                    me.newDailySellGrid.getStore().load();
                    return;
                case "__unMatchedDailySellGrid_3":
                    me.unMatchedDailySellGrid.getStore().removeAll();
                    me.unMatchedDailySellGrid.getStore().load();
                    return;
			}

		});

        me.allDailySellGrid.getStore().removeAll();
        me.allDailySellGrid.getStore().load();

	},

	refreshSelectedGrid: function() {
        var me = this;
        switch(me.getSelectedTabpanelId()){
			case 1:
                me.allDailySellGrid.getStore().removeAll();
                me.allDailySellGrid.getStore().load();
                return;
			case 2:
                me.newDailySellGrid.getStore().removeAll();
                me.newDailySellGrid.getStore().load();
                return;
			case 3:
                me.unMatchedDailySellGrid.getStore().removeAll();
                me.unMatchedDailySellGrid.getStore().load();
                return;
		}
	},

	refreshNewMatchedGrid: function() {
		var me = this;
		me.newDailySellGrid.getStore().removeAll();
		me.newDailySellGrid.getStore().load();

	},
	refreshUnmatchedGrid: function() {
		var me = this;
		me.unMatchedDailySellGrid.getStore().removeAll();
		me.unMatchedDailySellGrid.getStore().load();

	},
	//获取新添加未确认的销售记录
	getNewDailySellGrid: function() {
		var me = this;
		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 1, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
		});
		if (me.__newDailySellGrid) {
			return me.__newDailySellGrid;
		}

		var newDailySellStore = Ext.create("Ext.data.Store", {
			autoLoad: true,
			model: me.modelName,
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/DailySell/dailySellList",
				reader: {
					root: 'dailySellList4new',
					totalProperty: 'totalCount4new'
				}
			}
		});

		newDailySellStore.on("beforeload", function() {
			newDailySellStore.proxy.extraParams = me.getQueryParam(1);
            // for(var i=0; i<summaryFilters.length; i++) {
            //     newSum[summaryFilters[i]] = 0;
            // }
		});
		newDailySellStore.on("load", function(e, records, successful) {

		});

		me.__newDailySellGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			title: "新增临时销售流向",
			id:"__newDailySellGrid_2",
			bbar: [{
				id: "pagingToolbarNew",
				border: 0,
				xtype: "pagingtoolbar",
				store: newDailySellStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageNew",
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
							newDailySellStore.pageSize = Ext
								.getCmp("comboCountPerPageNew")
								.getValue();
							newDailySellStore.currentPage = 1;
							Ext.getCmp("pagingToolbarNew")
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
				text: "审核确认",
				disable: me.getPConfirmMatchedDailySellItem() == 0,
				width: 100,
				margin: "5 0 0 10",
				iconCls: "PSI-button-verify",
				cls: "button-background-gray",
				handler: me.onConfirmNewItems,
				scope: me
			}, {
				xtype: "button",
				text: "删除条目",
				disable: me.getPDeleteDailySellItem() == 0,
				width: 100,
				margin: "5 0 0 10",
				iconCls: "PSI-button-delete",
				cls: "button-background-gray",
				handler: me.onDeleteNewItems,
				scope: me
			},"-", {
                text: "导出销售信息",
                disabled: me.getPExportDailySellItem() == "0",
                iconCls: "PSI-button-excelexport",
                cls: "button-background-gray",
                handler: me.onExportGrid2Excel4NewTempGrid,
                scope: me
            }],
			columnLines: true,
			features: [{
				ftype: 'summary',
				dock: 'bottom'
			}],
			selModel: sm,
			columns: [
				Ext.create("Ext.grid.RowNumberer", {
					text: "序号",
					width: 40
				}), {
					header: "单据编号",
					dataIndex: "bill_code",
					menuDisabled: false,
					sortable: false,
                    summaryType: function() {
					    return '合计';
                    }
				},  {
					header: "单据状态",
					dataIndex: "status",
                    renderer: function(value) {
                        return me.getStatusTip(value);
                    },
					menuDisabled: false,
					sortable: false
				}, {
					header: "药品名称",
					dataIndex: "drug_name",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "药品规格",
					dataIndex: "drug_guige",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "药品生产企业",
					dataIndex: "drug_manufacture",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "药品批号",
					dataIndex: "batch_num",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "有效期",
					dataIndex: "expire_time",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "医院名称",
					dataIndex: "hospital_name",
					menuDisabled: false,
					sortable: false,
				}, {
					header: "业务员姓名",
					dataIndex: "employee_name",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "业务员身份",
					dataIndex: "employee_des",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "业务员提成",
					dataIndex: "employee_profit",
					menuDisabled: false,
					sortable: false,
					width: 60,
                    summaryType: function() {
					    return newSum['employee_profit'].toFixed(2);
                    }

				}, {
					header: "配送公司",
					dataIndex: "deliver_name",
					menuDisabled: false,
					sortable: false,
					width: 100
				}, {
					header: "销售数量",
					dataIndex: "sell_amount",
					menuDisabled: false,
					sortable: false,
                    summaryType: function() {
					    return newSum['employee_profit'].toFixed(0);
                    }
				}, {
					header: "销售日期",
					dataIndex: "sell_date",
				}, {
					header: "备注",
					dataIndex: "note",
				}
			],
			store: newDailySellStore,
            listeners: {
                selectionchange: function(view, record, item, index, e) {
                    if(record.length>0)
                        this.getView().findFeature('summary').onStoreUpdate();
                },
                select: function(view, record, item, index, e) {
                    for (var i = 0; i < summaryFilters.length; i++) {
                        newSum[summaryFilters[i]] += Number.parseFloat(record.data[summaryFilters[i]]);
                    }
                },
                deselect: function(view, record, item, index, e) {
                    for (var i = 0; i < summaryFilters.length; i++) {
                        newSum[summaryFilters[i]] -= Number.parseFloat(record.data[summaryFilters[i]]);
                    }
                }
            }
		});

		me.newDailySellGrid = me.__newDailySellGrid;
		return me.__newDailySellGrid;
	},


	getStatusTip:function (v) {
		switch (parseInt(v)){
			case 0:
                return "<p style='color: red;'>已入库</p>";
			case 1:
                return "<p style='color: #206512;'>未入库</p>";
			case 2:
                return "<p style='color: rebeccapurple;'>已入库，未进入支付状态</p>";
			case 3:
                return "<p style='color: darkgrey;'>待支付</p>";
			case 4:
                return "<p style='color: darkred;'>已付款</p>";
			case 5:
                return "<p style='color: cornflowerblue;'>已冻结</p>";

        }


    },
	//获取新添加未匹配的销售记录
	getUnMatchedDailySellGrid: function() {
		var me = this;
		if (me.__unMatchedDailySellGrid) {
			return me.__unMatchedDailySellGrid;
		}
		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 1,
			//checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
		});

		var unMatchedDailySellStore = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: me.modelName,
			groupField: ["drug_name", "hospital_name", "batch_num"],
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/DailySell/dailySellList",
				reader: {
					root: 'dailySellList4unmatched',
					totalProperty: 'totalCount4unmatched'
				}
			}
		});

		unMatchedDailySellStore.on("beforeload", function() {
			unMatchedDailySellStore.proxy.extraParams = me.getQueryParam(2);
            // for(var i=0; i<summaryFilters.length; i++) {
            //     unMatchedSum[summaryFilters[i]] = 0;
            // }
		});
		unMatchedDailySellStore.on("load", function(e, records, successful) {

		});

		me.__unMatchedDailySellGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			title: "新增未匹配销售流向",
			columnLines: true,
			id:"__unMatchedDailySellGrid_3",
			bbar: [{
				id: "pagingToolbarUnMatched",
				border: 0,
				xtype: "pagingtoolbar",
				store: unMatchedDailySellStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageUnMatched",
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
							unMatchedDailySellStore.pageSize = Ext
								.getCmp("comboCountPerPageUnMatched")
								.getValue();
							unMatchedDailySellStore.currentPage = 1;
							Ext.getCmp("pagingToolbarUnMatched")
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
				text: "分析补全流向",
				width: 100,
				margin: "5 0 0 10",
				disable: me.getPConfirmUnMatchedDailySellItem() == 0,
				iconCls: "PSI-button-verify",
				cls: "button-background-gray",
				handler: me.onGenerateSaleItems,
				scope: me
			}, {
				xtype: "button",
				text: "删除条目",
				disable: me.getPDeleteDailySellItem() == 0,
				width: 100,
				margin: "5 0 0 10",
				iconCls: "PSI-button-delete",
				cls: "button-background-gray",
				handler: me.onDeleteUnMatchedItems,
				scope: me
			},"-", {
                text: "导出销售信息",
                disabled: me.getPExportDailySellItem() == "0",
                iconCls: "PSI-button-excelexport",
                cls: "button-background-gray",
                handler: me.onExportGrid2Excel4NewUnmatchedGrid,
                scope: me
            }],
			selModel: sm,
			features: [{
				ftype: 'summary',
				dock: 'bottom'
			}],
			columns: [
				Ext.create("Ext.grid.RowNumberer", {
					text: "序号",
					width: 40
				}), {
					header: "备注",
					dataIndex: "note",
					width: 150,
                    summaryType: function() {
                        return '合计';
                    }
				}, /*{
					header: "单据状态",
					dataIndex: "status",
					menuDisabled: false,
					sortable: false,
					renderer: function (v) {
						return me.getStatusTip(v);
                    }
				},*/ {
					header: "药品名称",
					dataIndex: "drug_name",
					menuDisabled: false,
					sortable: true,
					width: 100,
					editor: {
						xtype: "psi_drug_field",
						parentCmp: me,
						//callbackFunc : me.selectEmployee,
						hideTrigger: false,
					}
				}, {
					header: "药品规格",
					dataIndex: "drug_guige",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "药品生产企业",
					dataIndex: "drug_manufacture",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "药品批号",
					dataIndex: "batch_num",
					menuDisabled: false,
					sortable: false,
					width: 60,
				}, {
					header: "有效期",
					dataIndex: "expire_time",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "医院名称",
					dataIndex: "hospital_name",
					menuDisabled: false,
					sortable: true,
				}, {
					header: "配送公司",
					dataIndex: "deliver_name",
					menuDisabled: false,
					sortable: false,
					width: 100,
					editor: {
						xtype: "combo",
					}
				}, {
					header: "销售数量",
					dataIndex: "sell_amount",
					menuDisabled: false,
					sortable: false,
					summaryType: function() {
						return unMatchedSum['sell_amount'].toFixed(0);
					},
					editor: {
						xtype: "numberfield",
						allowDecimals: true,
						decimalPrecision: 0,
						hideTrigger: false
					}
				}, {
					header: "销售日期",
					dataIndex: "sell_date",
					editor: {
						xtype: "datefield",
						format: "Y-m-d",
					},
				}
			],
			store: unMatchedDailySellStore,
			listeners: {
				selectionchange: function(view, record, item, index, e) {
					if(record.length>0)
					this.getView().findFeature('summary').onStoreUpdate();
				},
				select: function(view, record, item, index, e) {
					for (var i = 0; i < summaryFilters.length; i++) {
						 unMatchedSum[summaryFilters[i]] += Number.parseFloat(record.data[summaryFilters[i]]);
					}
				},
				deselect: function(view, record, item, index, e) {
					for (var i = 0; i < summaryFilters.length; i++) {
						unMatchedSum[summaryFilters[i]] -= Number.parseFloat(record.data[summaryFilters[i]]);
					}
				}
			}
		});
		me.unMatchedDailySellGrid = me.__unMatchedDailySellGrid;
        me.unMatchedDailySellGrid.on("itemdblclick", function(view, record, e) {
			me.editDailySellForUnMatched(me, record);
		});

		return me.__unMatchedDailySellGrid;
	},


	//获取已经确认过的已经在表格中的销售记录
	getAllDailySellGrid: function() {
		var me = this;
		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 1, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
		});
		if (me.__allDailySellGrid) {
			return me.__allDailySellGrid;
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
				url: PSI.Const.BASE_URL + "Home/DailySell/dailySellList",
				reader: {
					root: 'dailySellList4confirmed',
					totalProperty: 'totalCount4confirmed'
				}
			}
		});

		allDailySellStore.on("beforeload", function() {
			allDailySellStore.proxy.extraParams = me.getQueryParam(3);
            // for(var i=0; i<summaryFilters.length; i++)
            //     allSum[summaryFilters[i]] = 0;
		});
		allDailySellStore.on("load", function(e, records, successful) {

		});

		me.__allDailySellGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			title: "已确认销售信息",
			features: [{
				ftype: 'summary',
				dock: 'bottom'
			}],
			id:"__allDailySellGrid_1",
			bbar: [{
				id: "pagingToolbarAll",
				border: 0,
				xtype: "pagingtoolbar",
				store: allDailySellStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageAll",
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
								.getCmp("comboCountPerPageAll")
								.getValue();
							allDailySellStore.currentPage = 1;
							Ext.getCmp("pagingToolbarAll")
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
			},"-", {
                text: "导出销售信息",
                disabled: me.getPExportDailySellItem() == "0",
                cls: "button-background-gray",
                iconCls: "PSI-button-excelexport",
                handler: me.onExportGrid2Excel4ConfirmedGrid,
                scope: me
            }],
			columnLines: true,
			selModel: sm,
			columns: [
				Ext.create("Ext.grid.RowNumberer", {
					text: "序号",
					width: 40
				}), {
					header: "单据编号",
					dataIndex: "bill_code",
					menuDisabled: false,
					sortable: false,
                    summaryType: function() {
					    return '合计';
                    }
				}, {
					header: "是否支付",
					dataIndex: "if_paid",
					menuDisabled: false,
					sortable: true,
					width: 70,
                    renderer: function(value) {
                        if (value == 0) {
                            return "<p style='color: red;'>否</p>";
                        } else {
                            return "<p style='color: blue;'>是</p>";
                        }
                    },
				}, {
					header: "支付日期",
					dataIndex: "pay_time",
					width: 50,
				}, {
					header: "支付单单号",
					dataIndex: "paybill_id",
				}, {
					header: "药品名称",
					dataIndex: "drug_name",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "药品规格",
					dataIndex: "drug_guige",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "药品生产企业",
					dataIndex: "drug_manufacture",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "药品批号",
					dataIndex: "batch_num",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "有效期",
					dataIndex: "expire_time",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "医院名称",
					dataIndex: "hospital_name",
					menuDisabled: false,
					sortable: true,
				}, {
					header: "业务员姓名",
					dataIndex: "employee_name",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "业务员身份",
					dataIndex: "employee_des",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "业务员提成",
					dataIndex: "employee_profit",
					menuDisabled: false,
					sortable: false,
					width: 60,
                    summaryType: function() {
                        return allSum['employee_profit'].toFixed(2);
                    }
				}, {
					header: "配送公司",
					dataIndex: "deliver_name",
					menuDisabled: false,
					sortable: false,
					width: 100
				}, {
					header: "销售数量",
					dataIndex: "sell_amount",
					menuDisabled: false,
					sortable: false,
                    summaryType: function() {
                        return allSum['sell_amount'].toFixed(0);
                    }
				}, {
					header: "销售日期",
					dataIndex: "sell_date",
				}, {
					header: "备注",
					dataIndex: "note",
				}, {
					header: "操作详情",
					dataIndex: "operate_info",
				}
			],
			store: allDailySellStore,
            listeners: {
                selectionchange: function(view, record, item, index, e) {
                    if(record.length>0)
                        this.getView().findFeature('summary').onStoreUpdate();
                },
                select: function(view, record, item, index, e) {
                    for (var i = 0; i < summaryFilters.length; i++) {
                        allSum[summaryFilters[i]] += Number.parseFloat(record.data[summaryFilters[i]]);
                    }
                },
                deselect: function(view, record, item, index, e) {
                    for (var i = 0; i < summaryFilters.length; i++) {
                        allSum[summaryFilters[i]] -= Number.parseFloat(record.data[summaryFilters[i]]);
                    }
                }
            }
		});


		me.allDailySellGrid = me.__allDailySellGrid;
		return me.__allDailySellGrid;
	},

//	获取实时流向
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
				url: PSI.Const.BASE_URL + "Home/DailySell/dailySellList4Company",
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
            // for(var i=0; i<summaryFilters.length; i++) {
            //     unMatchedSum[summaryColumns[i]] = 0;
            // }
		});
		allDailySellStore.on("load", function(e, records, successful) {

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
					width: 40
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
					header: "药品名称",
					dataIndex: "drug_name",
					menuDisabled: false,
					sortable: true,
					width: 100,
                    summaryType: function () {
                        return '合计';
                    }
				}, {
					header: "药品规格",
					dataIndex: "drug_guige",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "药品生产企业",
					dataIndex: "drug_manufacture",
					menuDisabled: false,
					sortable: true,
					width: 100
				}, {
					header: "药品批号",
					dataIndex: "batch_num",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "有效期",
					dataIndex: "expire_time",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "医院名称",
					dataIndex: "hospital_name",
					menuDisabled: false,
					sortable: true,
				},
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
				{
					header: "销售数量",
					dataIndex: "sell_amount",
					menuDisabled: false,
					sortable: false,
                    summaryType: function () {
                        return unMatchedSum['sell_amount'].toFixed(0);
                    }
				}, {
					header: "销售日期",
					dataIndex: "sell_date",
				}
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
                listeners: {
                    selectionchange: function (view, record, item, index, e) {
                        if (record.length > 0)
                            this.getView().findFeature('summary').onStoreUpdate();
                    },
                    select: function (view, record, item, index, e) {
                        for (var i = 0; i < summaryFilters.length; i++) {
                            unMatchedSum[summaryFilters[i]] += Number.parseFloat(record.data[summaryFilters[i]]);
                        }
                    },
                    deselect: function (view, record, item, index, e) {
                        for (var i = 0; i < summaryFilters.length; i++) {
                            unMatchedSum[summaryFilters[i]] -= Number.parseFloat(record.data[summaryFilters[i]]);
                        }
                    }
                }
            }
		});
		me.immediatelySellGrid = me._immediatelySellGrid;
		return me._immediatelySellGrid;
	},


	getSelectedTabpanelId:function () {
        var tabPanel = Ext.getCmp("mainTabPanel");
        if (!tabPanel) {
            alert("系统错误！");
            //可以增加这个tab操作
            return null;
        }
		var tabId = tabPanel.getActiveTab().id
        return parseInt(tabId.charAt(tabId.length - 1));
    },
	getQueryParam: function(grid_select) {
		var me = this;

		var gridSelect = me.getSelectedTabpanelId();

		var employee_name = Ext.getCmp("editQueryEmployee").getValue();
		// var itemType = Ext.getCmp("editQueryType").getValue();
		var itemType = 0;
		if (itemType == "导入未确认") {
			itemType = 1;
		} else if (itemType == "已确认-未支付") {
			itemType = 2;
		} else if (itemType == "已支付") {
			itemType = 3;
		}
		var drug_id = Ext.getCmp("editQueryDrug").getIdValue();

		var hospital_name = Ext.getCmp("editQueryHospital").getValue();

		var editQueryFromDT = date2string(Ext.getCmp("editQueryFromDT").getValue());
		var editQueryToDT = date2string(Ext.getCmp("editQueryToDT").getValue());
		var result = {};

		if (parseInt(itemType) == itemType) {
			result.status = itemType;
		}
		if (editQueryFromDT != "") {
			result.sell_date_from = editQueryFromDT;
		}
		if (editQueryToDT != "") {
			result.sell_date_to = editQueryToDT;
		}
		if (parseInt(gridSelect) == gridSelect) {
			result.grid_type = gridSelect;
		}
		if (drug_id) {
			result.drug_id = drug_id;
		}
		if (hospital_name) {
			result.hospital_name = hospital_name;
		}
		if (employee_name) {
			result.employee_name = employee_name;
		}
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
	 * 编辑DailySell
	 */
	onEditDailySellForUnMatched: function() {
		var me = this;
		var items = me.unMatchedDailySellGrid.getSelectionModel().getSelection();
		if (items == null || items.length != 1) {
			PSI.MsgBox.showInfo("请选择一个未匹配的条目进行编辑");
			return;
		}
        var item = items[0];
        me.editDailySellForUnMatched(this,item);
	},

    editDailySellForUnMatched: function(parent, item) {
        var form = Ext.create("PSI.DailySell.DailySellEditForm", {
            parentForm: parent,
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
		var tabPanel = Ext.getCmp("mainTabPanel");
		if (!tabPanel) {
			alert("系统错误！");
			//可以增加这个tab操作
			return;
		}
		var grid = tabPanel.getActiveTab();
		var config = {
			store: grid.getStore(),
			title: "销售流向"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(grid, config); //调用导出函数

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
	onQuery: function(currentPage) {
		var me = this;
		var gridId = me.getSelectedTabpanelId();
		var grid = null;
		if (gridId == 1) {
			grid = me.allDailySellGrid;
		} else if (gridId == 2) {
			grid = me.newDailySellGrid;
		} else if (gridId == 3) {
			grid = me.unMatchedDailySellGrid;
		}
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

        Ext.getCmp("editQueryEmployee").setValue(null);
        // Ext.getCmp("editQueryType").setValue(1);
        Ext.getCmp("editQueryFromDT").setValue(new Date(2017, 0, 1));
        Ext.getCmp("editQueryToDT").setValue(new Date());
        Ext.getCmp("editQueryDrug").setValue(null);
        Ext.getCmp("editQueryHospital").setValue(null);


		// for (var i = 0; i < nameList.length; i++) {
		// 	var name = nameList[i];
		// 	var edit = Ext.getCmp(name);
		// 	if (edit) {
		// 		edit.setValue(null);
		// 	}
		// }

		me.onQuery();
	},



	setQueryEmployee: function(scope, data) {
		var me = this;
		if (scope) {
			me = scope;
		}
		Ext.getCmp("editQueryEmployee").setValue(data.name);
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
					me.refreshSelectedGrid();
				}
				el.unmask();
			}
		});
	},
    onAutoFetchDailySells: function() {
        if (this.getPAddDailySellItem() == "0") {
            PSI.MsgBox.showInfo("没有新增条目权限");
            return;
        }
        var form = Ext.create("PSI.DailySell.DailySellFetchForm", {
            parentForm: this,
        });

        form.show();

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
					me.refreshSelectedGrid();
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
    onExportGrid2Excel4ConfirmedGrid: function() {
        var grid = this.allDailySellGrid;
        var config = {
            store: grid.getStore(),
            title: "销售流向--已确认销售信息"
        };
        ExportExcel(grid, config); //调用导出函数
    },onExportGrid2Excel4NewTempGrid: function() {
        var grid = this.newDailySellGrid;
        var config = {
            store: grid.getStore(),
            title: "销售流向--新增临时销售信息"
        };
        ExportExcel(grid, config); //调用导出函数
    },onExportGrid2Excel4NewUnmatchedGrid: function() {
        var grid = this.unMatchedDailySellGrid;
        var config = {
            store: grid.getStore(),
            title: "销售流向--新增未匹配销售信息"
        };
        ExportExcel(grid, config); //调用导出函数
    },

});