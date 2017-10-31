/**
 * 银行存取款 - 主界面
 */
Ext.define("PSI.BusinessSetting.MainForm", {
	extend: "Ext.panel.Panel",

	config: {
		/*产品代理协议*/
		pProductAgency: null,
		pProductAgencyAdd: null,
		pProductAgencyEdit: null,
		pProductAgencyDelete: null,
		pPromoteAgency: null,
		pPromoteAgencyAdd: null,
		pPromoteAgencyEdit: null,
		pPromoteAgencyDelete: null,

		/*业务员销量预警值*/
		pEditEmployeeMonthSellAlarm: null,
		pEmployeeMonthSellAlarm: null,
	},

	/**
	 * 页面初始化
	 */
	initComponent: function() {
		var me = this;

		Ext.apply(me, {
			border: 0,
			layout: "border",
			tbar: [],
			items: [{
				region: "center",
				xtype: "container",
				layout: "border",
				border: 0,
				items: [{
					region: "center",
					split: true,
					xtype: "tabpanel",
					border: 0,
					items: [
						me.getEmployeeProfitAssignGrid(),
						// me.getEmployeeDynamicProfitAssignGrid(),
						me.getProtocolAssignGrid(),
						me.getPProductAgency() == "0" ? null : me.getProductAgencyGrid(),
						me.getPPromoteAgency() == "0" ? null : me.getExpandAgencyGrid()
					]
				}]
			}]
		});

		me.callParent(arguments);

		me.__queryEditNameList = ["editQueryEmployeeName"];

		me.freshEmployeeProfitAssignGrid();
	},

	//业务员业务分配
	getEmployeeProfitAssignGrid: function() {
		var me = this;
		if (me.employeeProfitAssignGrid) {
			return me.employeeProfitAssignGrid;
		}
		//定义业务员利润分配条目数据字段模型
		Ext.define("EmployeeMonthAlarm", {
			extend: "Ext.data.Model",
			fields: ["id", "drug2hos_id", "description", "employee_name", "employee_id",
				"profit_assign", "drug_id", "drug_name", "hospital_id",
				"hospital_name", "note", "create_time", "employee_alarm_month", "drug_guige", "drug_jx", "drug_manufacturer"
			]
		});
		//业务员
		var employeeProfitAssignStore = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: "EmployeeMonthAlarm",
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/BusinessSetting/employeeProfitAssignItemList",
				reader: {
					root: 'employeeProfitAssignItemList',
					totalProperty: 'totalCount'
				}
			},
			listeners: {
				beforeload: {
					fn: function() {
						employeeProfitAssignStore.proxy.extraParams = me.getQueryParam();
					},
					scope: me
				},
				load: {
					fn: function(e, records, successful) {
						if (successful) {
							me.gotoEmployeeProfitAssignGridRecord(me.__lastId);
						}
					},
					scope: me
				}
			}
		});
		//定义一个业务员利润分配条目列表实例
		var employeeProfitAssignGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true,
				forceFit: true
			},
			title: "业务员业务分配",
			columnLines: true,
			tbar: [{
				text: "编辑业务员月销售预警值",
				iconCls: "PSI-button-edit",
				handler: this.onEditEmployeeMonthAlarm,
				scope: this
			}, {
				id: "editQueryEmployeeName",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "业务员",
				margin: "5, 0, 0, 0",
				xtype: "psi_employeefield",
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
				}]
			}],
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				sortable: true,
				width: 30
			}), {
				header: 'id',
				dataIndex: 'id',
				hidden: true
			}, {
				header: "药品名称",
				dataIndex: "drug_name",
				width: 200,
				menuDisabled: false,
				sortable: true
			}, {
				header: "药品规格",
				dataIndex: "drug_guige",
				menuDisabled: false,
				sortable: true
			}, {
				header: "药品剂型",
				dataIndex: "drug_jx",
				menuDisabled: false,
				sortable: true
			}, {
				header: "药品生产企业",
				dataIndex: "drug_manufacturer",
				menuDisabled: false,
				width: 200,
				sortable: true
			}, {
				header: "医院",
				dataIndex: "hospital_name",
				width: 250,
				menuDisabled: false,
				sortable: true,
			}, {
				header: "业务员",
				dataIndex: "employee_name",
				menuDisabled: false,
				sortable: true
			}, {
				header: "业务员身份",
				dataIndex: "description",
				menuDisabled: false,
				sortable: true
			}, {
				header: "月销量预警值",
				dataIndex: "employee_alarm_month",
				menuDisabled: false,
				sortable: true
			}],
			store: employeeProfitAssignStore,
			bbar: [{
				id: "pagingToolbarEmployeeProfitAssign",
				border: 0,
				xtype: "pagingtoolbar",
				store: employeeProfitAssignStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageEmployeeProfitAssign",
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
							employeeProfitAssignStore.pageSize = Ext.getCmp("comboCountPerPageEmployeeProfitAssign").getValue();
							employeeProfitAssignStore.currentPage = 1;
							Ext.getCmp("pagingToolbarEmployeeProfitAssign").doRefresh();
						},
						scope: me
					}
				}
			}, {
				xtype: "displayfield",
				value: "条记录"
			}],
			listeners: {
				select: {
					fn: me.onStockItemGridSelect,
					scope: me
				},
				itemdblclick: {
					fn: me.onEditEmployeeMonthAlarm,
					scope: me
				}
			}
		});
		me.employeeProfitAssignGrid = employeeProfitAssignGrid;
		return me.employeeProfitAssignGrid;
	},

	//业务员业务提成动态分配
	getEmployeeDynamicProfitAssignGrid: function() {
		var me = this;
		if (me.employeeDynamicProfitAssignGrid) {
			return me.employeeDynamicProfitAssignGrid;
		}
		//定义业务员利润分配条目数据字段模型
		Ext.define("EmployeeMonthAlarm", {
			extend: "Ext.data.Model",
			fields: ["id", "drug2hos_id", "description", "employee_name", "employee_id",
				"profit_assign", "drug_id", "drug_name", "hospital_id",
				"hospital_name", "note", "create_time", "employee_alarm_month", "drug_guige", "drug_jx", "drug_manufacturer"
			]
		});
		//业务员
		var employeeDynamicProfitAssignStore = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: "EmployeeMonthAlarm",
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/BusinessSetting/employeeProfitAssignItemList",
				reader: {
					root: 'employeeProfitAssignItemList',
					totalProperty: 'totalCount'
				}
			},
			listeners: {
				beforeload: {
					fn: function() {
						employeeDynamicProfitAssignStore.proxy.extraParams = me.getQueryParam();
					},
					scope: me
				},
				load: {
					fn: function(e, records, successful) {
						if (successful) {
							me.gotoEmployeeProfitAssignGridRecord(me.__lastId);
						}
					},
					scope: me
				}
			}
		});
		//定义一个业务员利润分配条目列表实例
		var employeeDynamicProfitAssignGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true,
				forceFit: true
			},
			title: "业务员提成动态分配",
			columnLines: true,
			tbar: [{
				text: "编辑业务员月销售预警值",
				iconCls: "PSI-button-edit",
				handler: this.onEditEmployeeMonthAlarm,
				scope: this
			}, {
				id: "editQueryEmployeeName",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "业务员",
				margin: "5, 0, 0, 0",
				xtype: "psi_employeefield",
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
				}]
			}],
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				sortable: true,
				width: 30
			}), {
				header: 'id',
				dataIndex: 'id',
				hidden: true
			}, {
				header: "药品名称",
				dataIndex: "drug_name",
				width: 200,
				menuDisabled: false,
				sortable: true
			}, {
				header: "药品规格",
				dataIndex: "drug_guige",
				menuDisabled: false,
				sortable: true
			}, {
				header: "药品剂型",
				dataIndex: "drug_jx",
				menuDisabled: false,
				sortable: true
			}, {
				header: "药品生产企业",
				dataIndex: "drug_manufacturer",
				menuDisabled: false,
				width: 200,
				sortable: true
			}, {
				header: "医院",
				dataIndex: "hospital_name",
				width: 250,
				menuDisabled: false,
				sortable: true,
			}, {
				header: "业务员",
				dataIndex: "employee_name",
				menuDisabled: false,
				sortable: true
			}, {
				header: "业务员身份",
				dataIndex: "description",
				menuDisabled: false,
				sortable: true
			}, {
				header: "月销量预警值",
				dataIndex: "employee_alarm_month",
				menuDisabled: false,
				sortable: true
			}],
			store: employeeDynamicProfitAssignStore,
			bbar: [{
				id: "pagingToolbarEmployeeProfitAssign",
				border: 0,
				xtype: "pagingtoolbar",
				store: employeeDynamicProfitAssignStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageEmployeeProfitAssign",
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
							employeeDynamicProfitAssignStore.pageSize = Ext.getCmp("comboCountPerPageEmployeeProfitAssign").getValue();
							employeeDynamicProfitAssignStore.currentPage = 1;
							Ext.getCmp("pagingToolbarEmployeeProfitAssign").doRefresh();
						},
						scope: me
					}
				}
			}, {
				xtype: "displayfield",
				value: "条记录"
			}],
			listeners: {
				select: {
					fn: me.onStockItemGridSelect,
					scope: me
				},
				itemdblclick: {
					fn: me.onEditEmployeeMonthAlarm,
					scope: me
				}
			}
		});
		me.employeeDynamicProfitAssignGrid = employeeDynamicProfitAssignGrid;
		return me.employeeDynamicProfitAssignGrid;
	},
	//协议分配
	getProtocolAssignGrid: function() {
		var me = this;
		if (me.protocolAssignGrid) {
			return me.protocolAssignGrid;
		}
		//定义业务员利润分配条目数据字段模型
		Ext.define("EmployeeProtocol", {
			extend: "Ext.data.Model",
			fields: []
		});
		//业务员
		var protocolAssignStore = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: "EmployeeProtocol",
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/BusinessSetting/employeeProfitAssignItemList",
				reader: {
					root: 'employeeProfitAssignItemList',
					totalProperty: 'totalCount'
				}
			},
			listeners: {
				beforeload: {
					fn: function() {
						protocolAssignStore.proxy.extraParams = me.getQueryParam4ProtocolAssign();
					},
					scope: me
				},
				load: {
					fn: function(e, records, successful) {
						if (successful) {
							me.gotoProtocolAssignGridRecord(me.__lastId);
						}
					},
					scope: me
				}
			}
		});
		//定义一个业务员利润分配条目列表实例
		var protocolAssignGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true,
				forceFit: true
			},
			title: "协议区域分配表",
			columnLines: true,
			tbar: [{
				text: "新增协议区域",
				iconCls: "PSI-button-add",
				handler: this.onAddProtocolAssign,
				scope: this
			}, {
				text: "编辑协议区域",
				iconCls: "PSI-button-edit",
				handler: this.onEditProtocolAssign,
				scope: this
			}, {
				text: "删除协议区域",
				iconCls: "PSI-button-delete",
				handler: this.onDeleteProtocolAssign,
				scope: this
			}, "|", {
				id: "editQueryEmployeeName4ProtocolAssign",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "业务员",
				margin: "5, 0, 0, 0",
				xtype: "psi_employeefield",
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
					handler: me.onQuery4ProtocolAssign,
					scope: me
				}]
			}],
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				sortable: true,
				width: 30
			})],
			store: protocolAssignStore,
			bbar: [{
				id: "pagingToolbarProtocolAssign",
				border: 0,
				xtype: "pagingtoolbar",
				store: protocolAssignStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageProtocolAssign",
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
							protocolAssignStore.pageSize = Ext.getCmp("comboCountPerPageProtocolAssign").getValue();
							protocolAssignStore.currentPage = 1;
							Ext.getCmp("pagingToolbarProtocolAssign").doRefresh();
						},
						scope: me
					}
				}
			}, {
				xtype: "displayfield",
				value: "条记录"
			}],
			listeners: {
				select: {
					fn: me.onProtocolGridSelect,
					scope: me
				},
				itemdblclick: {
					fn: me.onEditProtocolItem,
					scope: me
				}
			}
		});
		me.protocolAssignGrid = protocolAssignGrid;
		return me.protocolAssignGrid;
	},

	//产品代理协议
	getProductAgencyGrid: function() {
		var me = this;
		if (me.productAgencyGrid) {
			return me.productAgencyGrid;
		}
		//定义业务员利润分配条目数据字段模型
		Ext.define("ProductAgency", {
			extend: "Ext.data.Model",
			fields: ['id', 'drug_id', 'common_name', 'guige', 'manufacturer', 'protocol_time', 'bill_date',
				'note', 'amount', 'earnest_money'
			]
		});
		//业务员
		var productAgencyStore = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: "ProductAgency",
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/BusinessSetting/getProductAgencyList",
				reader: {
					root: 'productAgencyList',
					totalProperty: 'totalCount'
				}
			},
			listeners: {
				beforeload: {
					fn: function() {
						productAgencyStore.proxy.extraParams = me.getQueryParam4ProductAgency();
					},
					scope: me
				},
				load: {
					fn: function(e, records, successful) {
						if (successful) {
							me.gotoProductAgencyGridRecord(me.__lastId);
						}
					},
					scope: me
				}
			}
		});


		productAgencyStore.on("beforeload", function() {
			productAgencyStore.proxy.extraParams = me.getQueryParam4ProductAgency();
		});
		productAgencyStore.on("load", function(e, records, successful) {
			if (successful) {
				me.gotoProductAgencyGridRecord(me.__lastId);
			}
		});

		//定义一个业务员利润分配条目列表实例
		var productAgencyGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true,
				forceFit: true
			},
			title: "产品代理协议",
			columnLines: true,
			forceFit: true,
			tbar: [{
				text: "新增产品代理协议",
				iconCls: "PSI-button-add",
				handler: this.onAddProductAgency,
				disabled: me.getPProductAgencyAdd() == "0",
				scope: this
			}, {
				text: "编辑产品代理协议",
				iconCls: "PSI-button-edit",
				handler: this.onEditProductAgency,
				disabled: me.getPProductAgencyEdit() == "0",
				scope: this
			}, {
				text: "删除产品代理协议",
				iconCls: "PSI-button-delete",
				disabled: me.getPProductAgencyDelete() == "0",
				handler: this.onDeleteProductAgency,
				scope: this
			}, "|", {
				id: "editQueryDate4ProductAgency",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "年份",
				xtype: 'monthfield',
				margin: "5, 0, 0, 0",
				format: "Y",
				width: 150,
				value: new Date(),
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
					handler: me.onQuery4ProductAgency,
					scope: me
				}]
			}],
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				sortable: true,
				width: 30
			}), {
				header: "签订时间",
				menuDisabled: false,
				dataIndex: "bill_date",
				sortable: true
			}, {
				header: "协议时间",
				dataIndex: "protocol_time",
				menuDisabled: false,
				sortable: true,
				renderer: function(v) {
					return v + '.01.01-' + v + '.12.31'
				}
			}, {
				header: "药品通用名",
				dataIndex: "common_name",
				menuDisabled: false,
				sortable: true
			}, {
				header: "规格",
				dataIndex: "guige",
				menuDisabled: false,
				sortable: true
			}, {
				header: "生产厂家",
				dataIndex: "manufacturer",
				menuDisabled: true,
				sortable: true
			}, {
				header: "保证金",
				dataIndex: "earnest_money",
				menuDisabled: false,
				sortable: true
			}, {
				header: "协议量",
				dataIndex: "amount",
				menuDisabled: false,
				sortable: true
			}, {
				header: "备注",
				dataIndex: "note",
				menuDisabled: false,
				sortable: true
			}],
			store: productAgencyStore,
			bbar: [{
				id: "pagingToolbarProductAgency",
				border: 0,
				xtype: "pagingtoolbar",
				store: productAgencyStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageProductAgency",
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
							productAgencyStore.pageSize = Ext.getCmp("comboCountPerPageProductAgency").getValue();
							productAgencyStore.currentPage = 1;
							Ext.getCmp("pagingToolbarProductAgency").doRefresh();
						},
						scope: me
					}
				}
			}, {
				xtype: "displayfield",
				value: "条记录"
			}],
			listeners: {
				select: {
					fn: me.onProductAgencyGridSelect,
					scope: me
				},
				itemdblclick: {
					fn: me.onEditProductAgency,
					scope: me
				}
			}
		});
		me.productAgencyGrid = productAgencyGrid;
		return me.productAgencyGrid;
	},
	//添加产品代理协议
	onAddProductAgency: function() {
		var me = this;
		if (me.getPProductAgencyAdd() == "0") return;
		var form = Ext.create("PSI.BusinessSetting.ProductAgencyEditForm", {
			parentForm: this
		});

		form.show();
	},
	onEditProductAgency: function() {
		var me = this;

		if (me.getPProductAgencyEdit() == "0") return;

		var item = me.getProductAgencyGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要编辑的产品代理协议");
			return;
		}
		var bill = item[0];
		var form = Ext.create("PSI.BusinessSetting.ProductAgencyEditForm", {
			parentForm: me,
			entity: bill
		});
		form.show();

	},

	onEditProductIODetail: function() {
		var me = this;

		if (me.getPProductAgencyEdit() == "0") return;

		var item = me.getProductAgencyGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要编辑的产品代理协议");
			return;
		}
		var bill = item[0];
		var form = Ext.create("PSI.BusinessSetting.ProductAgencyEditForm", {
			parentForm: me,
			entity: bill
		});
		form.show();

	},
	onDeleteProductAgency: function() {
		var me = this;
		if (me.getPProductAgencyDelete() == "0") return;

		var item = me.getProductAgencyGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要删除的产品代理协议");
			return;
		}

		var bill = item[0];
		var info = "确认要删除吗？";
		var me = this;
		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/BusinessSetting/deleteProductAgency",
				method: "POST",
				params: {
					id: bill.get("id")
				},
				callback: function(options, success, response) {
					el.unmask();
					if (success) {
						var data = Ext.JSON.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.showInfo("成功完成删除操作", function() {
								me.refreshProductAgencyGrid();
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

	//推广协议
	getExpandAgencyGrid: function() {
		var me = this;
		if (me.expandAgencyGrid) {
			return me.expandAgencyGrid;
		}
		//定义业务员利润分配条目数据字段模型
		Ext.define("ExpandAgency", {
			extend: "Ext.data.Model",
			fields: ['id', 'code', 'drug_id', 'drug_name', 'guige', 'manufacturer', 'protocol_time', 'bill_date',
				'note', 'amount', 'earnest_money', 'employee_name', 'employee_id', 'phone_num', 'region_name',
				'region_id', 'earnest_detail', 'earnest_date', 'bill_detail', 'expand_money', 'agency_date',
			]
		});
		//业务员
		var expandAgencyStore = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: "ExpandAgency",
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/BusinessSetting/getExpandAgencyList",
				reader: {
					root: 'expandAgencyList',
					totalProperty: 'totalCount'
				}
			},
			listeners: {
				beforeload: {
					fn: function() {
						expandAgencyStore.proxy.extraParams = me.getQueryParam4ExpandAgency();
					},
					scope: me
				},
				load: {
					fn: function(e, records, successful) {
						if (successful) {
							me.gotoExpandAgencyGridRecord(me.__lastId);
						}
					},
					scope: me
				}
			}
		});


		expandAgencyStore.on("beforeload", function() {
			expandAgencyStore.proxy.extraParams = me.getQueryParam4ExpandAgency();
		});
		expandAgencyStore.on("load", function(e, records, successful) {
			if (successful) {
				me.gotoExpandAgencyGridRecord(me.__lastId);
			}
		});

		//定义一个业务员利润分配条目列表实例
		var expandAgencyGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true,
				forceFit: true
			},
			title: "推广协议",
			columnLines: true,
			tbar: [{
				text: "新增推广协议",
				iconCls: "PSI-button-add",
				handler: this.onAddExpandAgency,
				disabled: me.getPPromoteAgencyAdd() == "0",
				scope: this
			}, {
				text: "编辑推广协议",
				iconCls: "PSI-button-edit",
				handler: this.onEditExpandAgency,
				disabled: me.getPPromoteAgencyEdit() == "0",
				scope: this
			}, {
				text: "删除推广协议",
				iconCls: "PSI-button-delete",
				disabled: me.getPPromoteAgencyDelete() == "0",
				handler: this.onDeleteExpandAgency,
				scope: this
			}, "|", {
				id: "editQueryDrug4ExpandAgency",
				labelWidth: 60,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "药品",
				xtype: 'psi_drug_field',
				margin: "5, 0, 0, 0",
				format: "Y",
				width: 250,
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
					handler: me.onQuery4ExpandAgency,
					scope: me
				}]
			}],
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				sortable: true,
				width: 30
			}), {
				header: "档案号",
				dataIndex: "code",
				menuDisabled: false,
				sortable: true
			}, {
				header: "药品通用名",
				dataIndex: "drug_name",
				menuDisabled: false,
				sortable: true
			}, {
				header: "规格",
				dataIndex: "guige",
				menuDisabled: false,
				sortable: true
			}, {
				header: "生产厂家",
				dataIndex: "manufacturer",
				menuDisabled: true,
				sortable: true
			}, {
				header: "代理商",
				dataIndex: "employee_name",
				menuDisabled: true,
				sortable: true
			}, {
				header: "电话",
				dataIndex: "phone_num",
				menuDisabled: true,
				sortable: true
			}, {
				header: "代理地区",
				dataIndex: "region_name",
				menuDisabled: true,
				sortable: true
			}, {
				header: "保证金",
				dataIndex: "earnest_money",
				menuDisabled: false,
				sortable: true
			}, {
				header: "保证金情况",
				dataIndex: "earnest_detail",
				menuDisabled: false,
				sortable: true
			}, {
				header: "保证金日期",
				dataIndex: "earnest_date",
				menuDisabled: false,
				sortable: true
			}, {
				header: "收据情况",
				dataIndex: "bill_detail",
				menuDisabled: false,
				sortable: true
			}, {
				header: "推广费用",
				dataIndex: "expand_money",
				menuDisabled: false,
				sortable: true
			}, {
				header: "代理期限",
				dataIndex: "agency_date",
				menuDisabled: false,
				sortable: true
			}, {
				header: "备注",
				dataIndex: "note",
				menuDisabled: false,
				sortable: true
			}],
			store: expandAgencyStore,
			bbar: [{
				id: "pagingToolbarExpandAgency",
				border: 0,
				xtype: "pagingtoolbar",
				store: expandAgencyStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageExpandAgency",
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
							expandAgencyStore.pageSize = Ext.getCmp("comboCountPerPageExpandAgency").getValue();
							expandAgencyStore.currentPage = 1;
							Ext.getCmp("pagingToolbarExpandAgency").doRefresh();
						},
						scope: me
					}
				}
			}, {
				xtype: "displayfield",
				value: "条记录"
			}],
			listeners: {
				select: {
					fn: me.onExpandAgencyGridSelect,
					scope: me
				},
				itemdblclick: {
					fn: me.onEditExpandAgency,
					scope: me
				}
			}
		});
		me.expandAgencyGrid = expandAgencyGrid;
		return me.expandAgencyGrid;
	},
	//添加产品代理协议
	onAddExpandAgency: function() {
		var me = this;
		if (me.getPPromoteAgencyAdd() == "0") return;
		var form = Ext.create("PSI.BusinessSetting.PromoteAgencyEditForm", {
			parentForm: this
		});

		form.show();
	},
	onEditExpandAgency: function() {
		var me = this;
		if (me.getPPromoteAgencyEdit() == "0") return;
		var item = me.getExpandAgencyGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要编辑的推广协议");
			return;
		}
		var bill = item[0];
		var form = Ext.create("PSI.BusinessSetting.PromoteAgencyEditForm", {
			parentForm: me,
			entity: bill
		});
		form.show();

	},
	onDeleteExpandAgency: function() {
		var me = this;
		if (me.getPPromoteAgencyDelete() == "0") return;
		var item = me.getExpandAgencyGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要删除的推广协议");
			return;
		}

		var bill = item[0];
		var info = "确认要删除吗？";
		var me = this;
		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/BusinessSetting/deleteExpandAgency",
				method: "POST",
				params: {
					id: bill.get("id")
				},
				callback: function(options, success, response) {
					el.unmask();
					if (success) {
						var data = Ext.JSON.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.showInfo("成功完成删除操作", function() {
								me.refreshExpandAgencyGrid();
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

	/**
	 * 编辑业务员月销售预警值
	 */
	onEditEmployeeMonthAlarm: function() {
		var me = this;
		if (me.getPEditEmployeeMonthSellAlarm() == "0") {
			return;
		}

		var item = this.employeeProfitAssignGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要编辑的利润分配");
			return;
		}

		var form = Ext.create("PSI.BusinessSetting.EmployeeMonthSellAlarmEditForm", {
			parentForm: this,
			entity: item[0]
		});
		form.show();

	},


	/**
	 * 刷新业务员利润分配条目
	 */
	freshEmployeeProfitAssignGrid: function() {
		var me = this;
		var grid = me.employeeProfitAssignGrid;
		var store = grid.getStore();
		store.removeAll();
		store.load();
		grid.getSelectionModel().deselectAll();
	},



	gotoEmployeeProfitAssignGridRecord: function(id) {
		var me = this;
		var grid = me.employeeProfitAssignGrid;
		var store = grid.getStore();
		if (id) {
			var r = store.findExact("id", id);
			if (r != -1) {
				grid.getSelectionModel().select(r);
			} else {
				grid.getSelectionModel().select(0);
			}
		}
	},

	gotoProductAgencyGridRecord: function(id) {
		var me = this;
		var grid = me.productAgencyGrid;
		var store = grid.getStore();
		if (id) {
			var r = store.findExact("id", id);
			if (r != -1) {
				grid.getSelectionModel().select(r);
			} else {
				grid.getSelectionModel().select(0);
			}
		}
	},

	gotoExpandAgencyGridRecord: function(id) {
		var me = this;
		var grid = me.expandAgencyGrid;
		var store = grid.getStore();
		if (id) {
			var r = store.findExact("id", id);
			if (r != -1) {
				grid.getSelectionModel().select(r);
			} else {
				grid.getSelectionModel().select(0);
			}
		}
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

	getQueryParam4ProtocolAssign: function() {

	},
	getQueryParam4ProductAgency: function() {
		var result = {};
		var date = Ext.getCmp("editQueryDate4ProductAgency").getValue();
		if (date) {
			result.date = Ext.Date.format(date, "Y");
		}
		return result;
	},
	getQueryParam4ExpandAgency: function() {
		var result = {};
		var drug = Ext.getCmp("editQueryDrug4ExpandAgency").getIdValue();
		if (drug) {
			result.id = drug;
		}
		return result;
	},
	getQueryParam: function() {
		var me = this;
		var item = me.employeeProfitAssignGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			stock_id = null;
		} else {
			stock_id = item[0].get("id");
		}

		var result = {
			stock_id: stock_id
		};

		var employee_name = Ext.getCmp("editQueryEmployeeName").getValue();
		if (employee_name) {
			result.employee_name = employee_name;
		}

		return result;
	},

	onQuery: function() {
		this.freshEmployeeProfitAssignGrid();
	},

	onClearQuery: function() {
		var nameList = this.__queryEditNameList;
		for (var i = 0; i < nameList.length; i++) {
			var name = nameList[i];
			var edit = Ext.getCmp(name);
			if (edit) {
				edit.setValue(null);
			}
		}
		this.employeeProfitAssignGrid.getSelectionModel().clearSelections();
		// this.onQuery();
		Ext.getCmp("editQueryEmployeeName").setValue(null);
		this.freshEmployeeProfitAssignGrid();
	},
	gotoProtocolAssignGridRecord: function() {

	},

	onAddProtocolAssign: function() {

	},
	onEditProtocolAssign: function() {

	},
	onDeleteProtocolAssign: function() {

	},

	onQuery4ProtocolAssign: function() {},
	onProtocolGridSelect: function() {},
	onEditProtocolItem: function() {

	},

	refreshProductAgencyGrid: function(currentPage) {
		var me = this;
		var grid = me.productAgencyGrid;
		var store = grid.getStore();
		if (currentPage)
			store.currentPage = currentPage;
		store.removeAll();
		store.load();
	},
	onQuery4ProductAgency: function() {
		var me = this;
		me.refreshProductAgencyGrid();
	},

	refreshExpandAgencyGrid: function(currentPage) {
		var me = this;
		var grid = me.expandAgencyGrid;
		var store = grid.getStore();
		if (currentPage)
			store.currentPage = currentPage;
		store.removeAll();
		store.load();
	},
	onQuery4ExpandAgency: function() {
		var me = this;
		me.refreshExpandAgencyGrid();
	}
});