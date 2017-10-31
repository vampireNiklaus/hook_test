/**
 * 药品 - 主界面
 */
/*
//require filter
Ext.Loader.setConfig({enabled: true});
Ext.Loader.setPath('Ext.ux', '../Public/Scripts/PSI/UX');
Ext.require([
    'Ext.ux.grid.FiltersFeature'
]);

//add filter in grid
 var filters = {
 ftype: 'filters',
 // encode and local configuration options defined previously for easier reuse
 encode: false, // json encode the filter query
 local: true,   // defaults to false (remote filtering)

 // Filters are most naturally placed in the column definition, but can also be
 // added here.
 filters: [{
 type: 'boolean',
 dataIndex: 'visible'
 }]
 };

 //add filter feature in panel
 features: [filters],

 add filter in columns
 filter: {
 type: 'list'
 }
*/
var summaryFilters = [];
Ext.Loader.setConfig({
	enabled: true
});
Ext.Loader.setPath('Ext.ux', '../Public/Scripts/PSI/UX');
Ext.require([
	'Ext.ux.grid.FiltersFeature'
]);

Ext.define("PSI.Drug.MainForm", {
	extend: "Ext.panel.Panel",

	config: {
		pAddDrugCategory: null,
		pEditDrugCategory: null,
		pDeleteDrugCategory: null,
		pImportDrugCategory: null,
		pAddDrugAssign: null,
		pDeleteDrugAssign: null,
		pImportDrugAssign: null,
		pAddDrugProfitAssign: null,
		pDeleteDrugProfitAssign: null,
		pEditDrugProfitAssign: null,
		pViewDrugSecretInfo: null,
		pEditDrugCompanyProfitAssign: null,
		pViewCompanyProfitAssign: null,
		pEditCompanyProfitAssign: null,
		pViewEmployeeProfitAssign: null,
		pEditEmployeeProfitAssign: null
	},


	initComponent: function() {
		var me = this;
		me.profitAssignDetailGrid = null;
		me.drugCategoryGrid = null;
		me.drugAssignHospitalGrid = null;
		Ext.apply(me, {
			border: 0,
			layout: "border",
			tbar: [{
				text: "新增药品分类",
				disabled: me.getPAddDrugCategory() == "0",
				iconCls: "PSI-button-add",
				handler: this.onAddDrugCategory,
				scope: this
			}, {
				text: "编辑药品分类",
				disabled: me.getPEditDrugCategory() == "0",
				iconCls: "PSI-button-edit",
				handler: this.onEditDrugCategory,
				scope: this
			}, {
				text: "删除药品分类",
				disabled: me.getPDeleteDrugCategory() == "0",
				iconCls: "PSI-button-delete",
				handler: this.onDeleteDrugCategory,
				scope: this
			}, "-", {
				text: "导入药品信息",
                disabled: me.getPImportDrugCategory() == "0",
				iconCls: "PSI-button-excelimport",
				handler: this.onImportDrug,
				scope: this
			}, {
				text: "导入药品分配",
                disabled: me.getPImportDrugAssign() == "0",
				iconCls: "PSI-button-excelimport",
				handler: this.onImportDrugAssign,
				scope: this
			}, "-", {
				text: "新增药品分配",
				disabled: me.getPAddDrugAssign() == "0",
				iconCls: "PSI-button-add-detail",
				handler: this.onAddDrugAssign,
				scope: this
			}, {
				text: "删除药品分配医院",
				disabled: me.getPDeleteDrugAssign() == "0",
				iconCls: "PSI-button-delete-detail",
				handler: this.onDeleteDrugAssignHospital,
				scope: this
			}, "-", {
				text: "关闭",
				iconCls: "PSI-button-exit",
				handler: function() {
					location.replace(PSI.Const.BASE_URL);
				}
			}],
			items: [{
				region: "north",
				height: 60,
				border: 0,
				collapsible: true,
				title: "查询条件",
				layout: {
					type: "table",
					columns: 4
				},
				items: [{
					id: "editQueryName",
					labelWidth: 120,
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
					xtype: "container",
					items: [{
						xtype: "button",
						text: "查询",
						width: 120,
						iconCls: "PSI-button-refresh",
						margin: "5, 0, 0, 20",
						handler: me.onQuery,
						scope: me
					}, {
						xtype: "button",
						text: "清空查询条件",
						width: 120,
						iconCls: "PSI-button-cancel",
						margin: "5, 0, 0, 5",
						handler: me.onClearQuery,
						scope: me
					}]
				}]
			}, {
				region: "center",
				xtype: "container",
				layout: "border",
				border: 0,
				items: [{
					region: "center",
					xtype: "panel",
					layout: "border",
					border: 0,
					items: [{
						region: "center",
						layout: "fit",
						border: 0,
						items: [me.getDrugAssignHospitalGrid()]
					}, {
						region: "south",
						layout: "fit",
						border: 0,
						height: 200,
						split: true,
						xtype: "tabpanel",
						items: [me.getProfitAssignDetailGrid()]
					}]
				}, {
					xtype: "panel",
					//collapsible : true,
					region: "west",
					layout: "fit",
					width: 600,
					split: true,
					collapsible: true,
					border: 0,
					items: [me.getDrugCategoryGrid()]
				}]
			}]
		});

		me.callParent(arguments);
		me.__queryEditNameList = ["editQueryName"];
		me.freshDrugCategoryGrid();
	},


	/**
	 * 药品类别Grid
	 */
	getDrugCategoryGrid: function() {
		var me = this;
		if (me.__drugCategoryGrid) {
			return me.__drugCategoryGrid;
		}
		var drugCategoryModelName = "PSIDrugCategory";
		Ext.define(drugCategoryModelName, {
			extend: "Ext.data.Model",
			fields: me.getPViewDrugSecretInfo() == 1 ? ["id", "drug_code", "common_name", "jx", "goods_name", "guige", "jldw", "manufacturer", "bid_price",
				"retail_price", "pym", "bid_type", "kaipiao_price", "tax_price", "base_price", "other_price", "profit", "is_new", "disabled",
				"is_self", "medicare_code_province", "medicare_code_country", "protocol_region",
				"business_license_code", "business_license_expire_time", "gmp_code", "gmp_expire_time",
				"qs_code", "qs_expire_time", "client_code", "client_expire_time", "deliver_list", "supplier_list",
				"delegate_list", "creator_id", "create_time", "approval_code"
			] : ["id", "drug_code", "common_name", "jx", "goods_name", "guige", "jldw", "manufacturer", "bid_price",
				"retail_price", "pym", "bid_type", "is_new", "disabled",
				"is_self", "medicare_code_province", "medicare_code_country", "protocol_region",
				"business_license_code", "business_license_expire_time", "gmp_code", "gmp_expire_time",
				"qs_code", "qs_expire_time", "client_code", "client_expire_time", "deliver_list", "supplier_list",
				"delegate_list", "creator_id", "create_time", "approval_code"
			]
		});

		var drugCategoryStore = Ext.create("Ext.data.Store", {
			model: drugCategoryModelName,
			autoLoad: true,
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Drug/drugCategoryList",
				reader: {
					root: 'drugCategoryList',
					totalProperty: 'totalCount'
				}
			}
		});

		drugCategoryStore.on("beforeload", function() {
			drugCategoryStore.proxy.extraParams = me.getDrugCategorySearchParam();
		});
		drugCategoryStore.on("load", function(e, records, successful) {
			if (successful) {
				me.gotoDrugCategoryGridRecord(me.__lastId);
			}
		});

		var filters = {
			ftype: 'filters',
			// encode and local configuration options defined previously for easier reuse
			encode: false, // json encode the filter query
			local: true, // defaults to false (remote filtering)

			// Filters are most naturally placed in the column definition, but can also be
			// added here.
			filters: [{
				type: 'boolean',
				dataIndex: 'visible'
			}]
		};

		var columns = [Ext.create("Ext.grid.RowNumberer", {
			text: "序号",
			width: 40
		}), {
			header: "药品编码",
			dataIndex: "drug_code",
			width: 120,
			menuDisabled: false,
			sortable: true,
			filter: {
				type: 'list'
			}
		}, {
			header: "通用名",
			dataIndex: "common_name",
			width: 120,
		}, {
			header: "剂型",
			dataIndex: "jx",
			width: 120,
		}, {
			header: "商品名",
			dataIndex: "goods_name",
			width: 120,
		}, {
			header: "规格",
			dataIndex: "guige",
			width: 120,
		}, {
			header: "计量单位",
			dataIndex: "jldw",
			width: 120,
		}, {
			header: "生产企业",
			dataIndex: "manufacturer",
			width: 120,
		}, {
			header: "中标价",
			dataIndex: "bid_price",
			width: 120,
			// summaryType: function(records) {
			// 	var itemname = 'bid_price';
			// 	gridSum[itemname] = 0;
			// 	for (var i = 0; i < records.length; i++) {
			// 		var itemPrice = Number.parseFloat(records[i].get(itemname));
			// 		gridSum[itemname] += itemPrice;
			// 	}
			// 	return gridSum[itemname].toFixed(3) + '元';
			// }
		}, {
			header: "零售价",
			dataIndex: "retail_price",
			width: 120
		}, {
			header: "中标类型",
			dataIndex: "bid_type",
			width: 120,
		}, {
			header: "开票价",
			dataIndex: "kaipiao_price",
			width: 120,
		}, {
			header: "税价",
			dataIndex: "tax_price",
			width: 120,
		}, {
			header: "底价",
			dataIndex: "base_price",
			width: 120,
		}, {
			header: "其他费用",
			dataIndex: "other_price",
			width: 120,
		}, {
			header: "费用",
			dataIndex: "profit",
			width: 120,
		}, {
			header: "新药分销",
			dataIndex: "is_new",
			width: 120,
			renderer: function(value) {
				if (value == 1) {
					return "是";
				} else {
					return "否";
				}
			}
		}, {
			header: "是否停用",
			dataIndex: "disabled",
			width: 120,
			renderer: function(value) {
				if (value == 1) {
					return "是";
				} else {
					return "否";
				}
			}
		}, {
			header: "是否自销",
			dataIndex: "is_self",
			width: 120,
			renderer: function(value) {
				if (value == 1) {
					return "<span style='color:red;font-weight:bold;'>是</span>";
				} else {
					return "否";
				}
			}
		}, {
			header: "省级医保代码",
			dataIndex: "medicare_code_province",
			width: 120,
		}, {
			header: "国家医保代码",
			dataIndex: "medicare_code_country",
			width: 120,
		}, {
			header: "协议区域",
			dataIndex: "protocol_region",
			width: 120,
		}, {
			header: "营业执照代码",
			dataIndex: "business_license_code",
			width: 120,
		}, {
			header: "营业执照过期日期",
			dataIndex: "business_license_expire_time",
			width: 120,
		}, {
			header: "GMP代码",
			dataIndex: "gmp_code",
			width: 120,
		}, {
			header: "GMP过期日期",
			dataIndex: "gmp_expire_time",
			width: 120,
		}, {
			header: "生产许可证",
			dataIndex: "qs_code",
			width: 120,
		}, {
			header: "生产许可证有效期",
			dataIndex: "qs_expire_time",
			width: 120,
		}, {
			header: "委托书",
			dataIndex: "client_code",
			width: 120,
		}, {
			header: "委托书有效期",
			dataIndex: "client_expire_time",
			width: 120,
		}, {
			header: "创建人",
			dataIndex: "creator_name",
			width: 120,
		}, {
			header: "创建时间",
			dataIndex: "create_time",
			width: 120,
		}]

		me.getPViewDrugSecretInfo() == 0 && columns.splice(11, 5);

		me.__drugCategoryGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			title: "药品种类信息",
			features: [filters],
			forceFit: false,
			autoScroll: true,
			columnLines: true,
			columns: columns,
			store: drugCategoryStore,
			bbar: [{
				id: "pagingToolbarCategory",
				border: 0,
				xtype: "pagingtoolbar",
				store: drugCategoryStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageCategory",
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
							drugCategoryStore.pageSize = Ext
								.getCmp("comboCountPerPageCategory")
								.getValue();
							drugCategoryStore.currentPage = 1;
							Ext.getCmp("pagingToolbarCategory")
								.doRefresh();
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
					fn: me.onDrugCategoryGridSelect,
					scope: me
				},
				itemdblclick: {
					fn: me.onEditDrugCategory,
					scope: me
				}
			}
		});

		var summaryColumns = me.__drugCategoryGrid.columns;
		for (var i = 0; i < summaryColumns.length; i++) {
			var itemname = summaryColumns[i].dataIndex;
			(function(itemname) {
				summaryColumns[i].summaryType = summaryFilters.indexOf(itemname) < 0 ? false : function(records) {
					var gridSum = 0;
					for (var i = 0; i < records.length; i++) {
						var item = records[i].get(itemname);
						var itemPrice = Number.parseFloat(item);
						gridSum += itemPrice;
					}
					return gridSum.toFixed(3) + '元';
				}
			})(itemname)

		}

		me.__drugCategoryGrid.getView().on('render', function(view) {
			view.tip = Ext.create('Ext.tip.ToolTip', {
				width: 380,
				title: '药品信息详情',
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
							"药品编码：" + re.get('drug_code') + "</br>" +
							"通用名：" + re.get('common_name') + "</br>" +
							"生产企业：" + re.get('manufacturer') + "</span></br>" +
							"药品商品名：" + re.get('goods_name') + "</span></br>" +
							"中标价：<span style='margin-right: 10px;color:red'>" + re.get('bid_price') + "</span>零售价：<span style='margin-right: 10px;color:red'>" + re.get('retail_price') + "</span>" +
							"开票价：<span style='margin-right: 10px;color:red'>" + re.get('kaipiao_price') + "</span>税价：<span style='margin-right: 10px;color:red'>" + re.get('tax_price') + "</span>" +
							"底价：<span style='margin-right: 10px;color:red'>" + re.get('base_price') + "</span>其他费用：<span style='margin-right: 10px;color:red'>" + re.get('other_price') + "</span>" +
							"费用：<span style='margin-right: 10px;color:red'>" + re.get('profit') + "</span>" +
							"</br>" +
							"省级医保代码：" + re.get('medicare_code_province') + "</br>" +
							"国家医保代码：" + re.get('medicare_code_country') + "</br>" +
							"协议区域：" + re.get('protocol_region') + "</br>"
						);
					}
				}
			});
		});
		me.drugCategoryGrid = me.__drugCategoryGrid;
		return me.__drugCategoryGrid;
	},
	/**
	 * 药品医院分配详情Grid
	 */
	getDrugAssignHospitalGrid: function() {
		var me = this;
		if (me.__drugAssignHospitalGrid) {
			return me.__drugAssignHospitalGrid;
		}
		var drugAssignHospitalModelName = "PSIDrugAssign";
		Ext.define(drugAssignHospitalModelName, {
			extend: "Ext.data.Model",
			fields: me.getPViewCompanyProfitAssign() == 1 ?
				["id", "drug_id", "drug_name", "hospital_id", "hospital_code", "hospital_name", "create_time", "creator_id", "company_profit"] : ["id", "drug_id", "drug_name", "hospital_id", "hospital_code", "hospital_name", "create_time", "creator_id"]
		});

		var drugAssignHospitalStore = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: drugAssignHospitalModelName,
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Drug/drugAssignHospitalList",
				reader: {
					root: 'drugAssignHospitalList',
					totalProperty: 'totalCount'
				}
			},
			listeners: {
				beforeload: {
					fn: function() {
						drugAssignHospitalStore.proxy.extraParams = me.getDrugCategoryQueryParam();
					},
					scope: me
				},
				load: {
					fn: function(e, records, successful) {
						if (successful) {
						me.gotoDrugAssignHospitalGridRecord(me.__drugAssignHospitalGrid__lastId);
						}
					},
					scope: me
				}
			}
		});
		me.__cellEditing = Ext.create("PSI.UX.CellEditing", {
			clicksToEdit: 1,
			listeners: {
				edit: {
					fn: me.cellEditingAfterEdit,
					scope: me
				}
			}
		});
		var columns = [
			Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				width: 30
			}), {
				header: "医院名称",
				dataIndex: "hospital_name",
				width: 400,
				menuDisabled: false,
				sortable: true
			}, {
				header: "公司利润",
				dataIndex: "company_profit",
				menuDisabled: false,
				align: "right",
				width: 100,
				/*editor: {
					xtype: "numberfield",
					allowDecimals: true,
					decimalPrecision: 2,
					hideTrigger: false
				}*/
			}, /*{
				header: "保存",
				id: "companyProfitEdit",
				align: "center",
				menuDisabled: false,
				draggable: false,
				width: 50,
				xtype: "actioncolumn",
				disabled: me.getPEditCompanyProfitAssign() == "0",
				items: [{
					icon: PSI.Const.BASE_URL + "Public/Images/icons/verify.png",
					handler: function(grid, row) {
						var me = this;
						if (me.getPEditCompanyProfitAssign() == "0") {
							PSI.MsgBox.showInfo("没有编辑公司利润权限");
							return;
						}
						me.editCompanyProfitAssignDetailItem(grid, row);
					},
					scope: me
				}]
			}*/
		]

		//控制无权限人看不到列
		me.getPEditCompanyProfitAssign() == "0" && columns.splice(3, 1);
		me.getPViewCompanyProfitAssign() == "0" && columns.splice(2, 1);

		me.__drugAssignHospitalGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			title: "药品分配 列表",
			plugins: [me.__cellEditing],
			columnLines: true,
			autoScroll: true,
			columns: columns,
			store: drugAssignHospitalStore,
			tbar: [{
				id: "editQueryAssignHospital",
				labelWidth: 30,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "医院",
				margin: "5, 0, 0, 0",
				xtype: "textfield",
				width: 200,
				listeners: {
					specialkey: {
						fn: me.onQueryEditSpecialKey,
						scope: me
					}
				}
			}, {
				xtype: "button",
				text: "查询",
				width: 50,
				iconCls: "PSI-button-refresh",
				margin: "5, 0, 0, 20",
				handler: me.onQueryAssignHospital,
				scope: me
			}],
			bbar: [{
				id: "pagingToolbarDrugAssign",
				border: 0,
				xtype: "pagingtoolbar",
				store: drugAssignHospitalStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageDrugAssign",
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
							drugAssignHospitalStore.pageSize = Ext
								.getCmp("comboCountPerPageDrugAssign")
								.getValue();
							drugAssignHospitalStore.currentPage = 1;
							Ext.getCmp("pagingToolbarDrugAssign")
								.doRefresh();
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
					fn: me.onEditDrugProfitAssign,
					scope: me
				}
			}
		});

		me.drugAssignHospitalGrid = me.__drugAssignHospitalGrid;
		return me.__drugAssignHospitalGrid;
	},
	/**
	 * 药品提成详情Grid
	 */
	getProfitAssignDetailGrid: function() {
		var me = this;
		if (me.__profitAssignDetailGrid) {
			return me.__profitAssignDetailGrid;
		}

		var modelName = "PSIProfitAssignDetailModel";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: me.getPViewEmployeeProfitAssign() == 1 ? ["id", "drug_id", "drug_name", "hospital_name", "hospital_id", "drug2hos_id", "description",
				"employee_id", "employee_name", "profit_assign", "creator_id", "create_time", "note", "rate"
			] : ["id", "drug_id", "drug_name", "hospital_name", "hospital_id", "drug2hos_id", "description",
				"employee_id", "employee_name", "creator_id", "create_time", "note", "rate"
			]
		});
		var drugProfitAssignStore = Ext.create("Ext.data.Store", {
			model: modelName,
			autoLoad: false,
			data: [{
				employee_id: 1,
				employee_name: "测试"
			}],
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Drug/drugProfitAssignList",
				reader: {
					root: 'drugProfitAssignList',
					totalProperty: 'totalCount'
				}
			},
			listeners: {
				beforeload: {
					fn: function() {
						drugProfitAssignStore.proxy.extraParams = me.getDrugProfitAssignQueryParam();
					},
					scope: me
				},
				load: {
					fn: function(e, records, successful) {
						if (successful) {

						}
					},
					scope: me
				}
			}
		});
		me.__cellEditing = Ext.create("PSI.UX.CellEditing", {
			clicksToEdit: 1,
			listeners: {
				edit: {
					fn: me.cellEditingAfterEdit,
					scope: me
				}
			}
		});

		var drugProfitAssignStore = Ext.create("Ext.data.Store", {
			model: modelName,
			autoLoad: false,
			data: [{}],
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Drug/drugProfitAssignList",
				reader: {
					root: 'drugProfitAssignList',
					totalProperty: 'totalCount'
				}
			},
			listeners: {
				beforeload: {
					fn: function() {
						drugProfitAssignStore.proxy.extraParams = me.getDrugProfitAssignQueryParam();
					},
					scope: me
				},
				load: {
					fn: function(e, records, successful) {
						if (successful) {
							me.gotoDrugAssignHospitalGridRecord(me.__lastId);
						}
					},
					scope: me
				}
			}
		});
		var columns = [
			Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				width: 40
			}), {
				header: "身份",
				dataIndex: "description",
				width: 80,
				editor: {
					xtype: "combo",
                    displayField :'name',
                    editable:false,
					valueField : 'name',
                    store: new Ext.data.ArrayStore({
                        fields: [ 'name'],
                        data: [
                            ['合作伙伴'],
                            ['开发员'],
                            ['返利'],
                            ['管理员'],
                            ['招商经理'],
                            ['部门经理'],
                            ['临床人员'],
                            ['直营经理'],
                            ['直营业务员']
                        ]
                    }),

				},
				menuDisabled: false,
				sortable: true,
			}, {
				header: "业务员",
				dataIndex: "employee_name",
				draggable: false,
				align: "right",
				width: 120,
				editor: {
					xtype: "psi_employeefield",
					parentCmp: me,
					callbackFunc: me.selectEmployee,
					hideTrigger: false,
				}
			}, {
				header: "比例",
				dataIndex: "rate",
				menuDisabled: false,
				align: "right",
				width: 120,
				renderer: function(value) {
					if (value)
						return value + '%';
				},
				editor: {
					xtype: "numberfield",
					allowDecimals: true,
					decimalPrecision: 2,
					hideTrigger: false,
					maxValue: 100,
					minValue: 0,
					listeners: {
						change: function(field, value) {
							var bid_price = me.getDrugCategoryGrid().getSelectionModel().getSelection()[0].get('bid_price');
							var profit_assign = value <= 100 ? (bid_price * value / 100).toFixed(3) : 0..toFixed(3);
							me.getProfitAssignDetailGrid().getSelectionModel().getSelection()[0].set('profit_assign', profit_assign);
						}
					},
				}
			}, {
				header: "提成",
				dataIndex: "profit_assign",
				menuDisabled: false,
				align: "right",
				width: 120,
				editor: {
					xtype: "numberfield",
					allowDecimals: true,
					decimalPrecision: 2,
					hideTrigger: false,
                    listeners: {
                        change: function(field, value) {
                            var bid_price = me.getDrugCategoryGrid().getSelectionModel().getSelection()[0].get('bid_price');
                            var rate = Math.round(value / bid_price * 10000) / 100.00;
                            me.getProfitAssignDetailGrid().getSelectionModel().getSelection()[0].set('rate', rate);
                        }
                    },
				}
			}, {
				header: "备注",
				dataIndex: "note",
				draggable: false,
				width: 200,
				editor: {
					xtype: "textfield"
				}
			}, {
				header: "保存",
				id: "profitColumnActionEdit",
				align: "center",
				menuDisabled: false,
				draggable: false,
				width: 50,
				disabled: me.getPEditEmployeeProfitAssign() == "0",
				xtype: "actioncolumn",
				items: [{
					icon: PSI.Const.BASE_URL + "Public/Images/icons/verify.png",
					handler: function(grid, row) {
						var me = this;
						if (me.getPEditEmployeeProfitAssign() == "0") {
							PSI.MsgBox.showInfo("没有编辑权限");
							return;
						}
						var store = grid.getStore();
						//保存这一行的数据，如果保存成功，那么从数据库返回这一行的记录值，然后补充完整。
						var d2hItems = me.drugAssignHospitalGrid.getSelectionModel().getSelection();
						if (d2hItems == null || d2hItems.length != 1) {
							PSI.MsgBox.showInfo("没有选取分配医院");
							return;
						}
						me.addProfitAssignDetailItem(grid, row);

					},
					scope: me
				}]
			}, {
				header: "删除",
				id: "profitColumnActionDelete",
				disabled: me.getPEditEmployeeProfitAssign() == "0",
				align: "center",
				menuDisabled: false,
				draggable: false,
				width: 50,
				xtype: "actioncolumn",
				items: [{
					icon: PSI.Const.BASE_URL + "Public/Images/icons/delete.png",
					handler: function(grid, row) {
						if (me.getPEditEmployeeProfitAssign() == "0") {
							PSI.MsgBox.showInfo("没有操作权限");
							return;
						}
						me.onDeleteDrugProfitAssignItem(grid, row);
					},
					scope: me
				}]
			}, {
				header: "新增",
				id: "profitColumnActionAdd",
				align: "center",
				menuDisabled: false,
				draggable: false,
				width: 50,
				disabled: me.getPEditEmployeeProfitAssign() == "0",
				xtype: "actioncolumn",
				items: [{
					icon: PSI.Const.BASE_URL + "Public/Images/icons/add.png",
					handler: function(grid, row) {
						var me = this;
						if (me.getPEditEmployeeProfitAssign() == "0") {
							PSI.MsgBox.showInfo("没有操作权限");
							return;
						}
						var store = grid.getStore();
						store.add({});
					},
					scope: me
				}]
			}
		]
		me.getPEditEmployeeProfitAssign() == "0" && columns.splice(6, 3);
		me.getPViewEmployeeProfitAssign() == "0" && columns.splice(3, 2);
		me.__profitAssignDetailGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			title: "利润分配详情",
			autoScroll: true,
			plugins: [me.__cellEditing],
			columnLines: true,
			columns: columns,
			store: drugProfitAssignStore,
		});
		me.profitAssignDetailGrid = me.__profitAssignDetailGrid;
		return me.__profitAssignDetailGrid;
	},


	cellEditingAfterEdit: function(editor, e) {},

	selectEmployee: function(scope, data) {
		var me = this;
		if (scope) {
			me = scope;
		}
		var item = me.profitAssignDetailGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			return;
		}
		var profitAssign = item[0];
		profitAssign.set("employee_id", data.id);
		profitAssign.set("employee_name", data.name);
		profitAssign.set("profit_assign", 0.00);
	},
	/**
	 * 新增药品分类
	 */
	onAddDrugCategory: function() {
		var form = Ext.create("PSI.Drug.DrugCategoryEditForm", {
			parentForm: this
		});

		form.show();
	},

	/**
	 * 编辑药品分类
	 */
	onEditDrugCategory: function() {
		var me = this;
		if (me.getPEditDrugCategory() == "0") {
			return;
		}
		var item = this.drugCategoryGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要编辑的药品分类");
			return;
		}

		var category = item[0];

		var form = Ext.create("PSI.Drug.DrugCategoryEditForm", {
			parentForm: this,
			entity: category
		});

		form.show();
	},

	/**
	 * 删除药品分类
	 */
	onDeleteDrugCategory: function() {
		var item = this.drugCategoryGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要删除的药品分类");
			return;
		}

		var category = item[0];
		var info = "请确认是否删除药品分类: <span style='color:red'>" + category.get("common_name") + "</span>";
		var me = this;

		var store = me.drugCategoryGrid.getStore();
		var index = store.findExact("id", category.get("id"));
		index--;
		var preIndex = null;
		var preItem = store.getAt(index);
		if (preItem) {
			preIndex = preItem.get("id");
		}

		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/Drug/deleteDrugCategory",
				method: "POST",
				params: {
					id: category.get("id")
				},
				callback: function(options, success, response) {
					el.unmask();

					if (success) {
						var data = Ext.JSON
							.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.tip("成功完成删除操作");
							me.freshDrugCategoryGrid(preIndex);
						} else {
							PSI.MsgBox.showInfo(data.msg);
						}
					}
				}
			});
		});
	},

	freshDrugCategoryGrid: function(id) {
		var me = this;
		var grid = me.drugCategoryGrid;
		var store = grid.getStore();
		store.removeAll();
		store.load();
	},
	freshDrugAssignHospitalGrid: function(id) {
		var item = this.drugCategoryGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			var grid = this.drugAssignHospitalGrid;
			grid.setTitle("药品分配");
			return;
		}

		var category = item[0];

		var grid = this.drugAssignHospitalGrid;
		grid.setTitle("属于药品 [" + category.get("common_name") + "] 的医院分配情况");
		this.__lastId = id;
		grid.getStore().load();
	},

	onDrugCategoryGridSelect: function() {
		var me = this;
		if(me.getProfitAssignDetailGrid().getStore().getCount()>0){
            me.getProfitAssignDetailGrid().getStore().removeAll();
        }
		if(me.drugAssignHospitalGrid.getStore().getCount()>0){
            me.drugAssignHospitalGrid.getStore().removeAll();
        }
		var items = me.drugCategoryGrid.getSelectionModel().getSelection();
		if (items == null || items.length != 1) {
			return;
		}
		var item = items[0].getData();
		var drug_id = item.id;
		me.freshDrugAssignHospitalGrid(drug_id);
	},

	onAddDrugAssign: function() {
		//if (this.drugCategoryGrid.getStore().getCount() == 0) {
		//	PSI.MsgBox.showInfo("没有药品分类，请先新增药品分类");
		//	return;
		//}

		var form = Ext.create("PSI.Drug.Drug_AddHospitalFilterForm", {
			parentForm: this
		});
		form.show();
	},

	onDeleteDrugAssignHospital: function() {
		var me = this;
		var item = me.drugAssignHospitalGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要删除的医院");
			return;
		}


		var d2h = item[0].getData();
		var store = me.drugAssignHospitalGrid.getStore();
		var index = store.findExact("id", d2h.id);
		index--;
		var preIndex = null;
		var preItem = store.getAt(index);
		if (preItem) {
			preIndex = preItem.get("id");
		}
		var info = "请确认是否删除分配医院: <span style='color:red'>" + d2h.hospital_name + "</span>";
		var me = this;
		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/Drug/deleteDrugAssignHospitalItem",
				method: "POST",
				params: {
					id: d2h.id
				},
				callback: function(options, success, response) {
					el.unmask();

					if (success) {
						var data = Ext.JSON
							.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.tip("成功完成删除操作");
							me.freshDrugAssignHospitalGrid(preIndex);
						} else {
							PSI.MsgBox.showInfo(data.msg);
						}
					}
				}

			});
		});
	},
	gotoDrugCategoryGridRecord: function(id) {
		var me = this;
		var grid = me.drugCategoryGrid;
		var store = grid.getStore();
		if (id) {
			var r = store.findExact("id", id);
			if (r >0) {
                grid.getSelectionModel().select(r);
			} else {
				grid.getSelectionModel().select(0);
			}
		} else {
			grid.getSelectionModel().select(0);
		}
	},
	gotoDrugAssignHospitalGridRecord: function(id) {
		var me = this;
		var grid = me.drugAssignHospitalGrid;
		if (id) {
			if (id != -1) {
				grid.getSelectionModel().select(id);
			} else {
				grid.getSelectionModel().select(0);
			}
		} else {
			grid.getSelectionModel().select(0);
		}
	},


	onQueryEditSpecialKey: function(field, e) {
		var me = this;
		if (e.getKey() === e.ENTER) {
			var me = this;
			var id = field.getId();
			if (id === "editQueryName") {
				me.onQuery();
			}
			if (id === "editQueryAssignHospital") {
				me.onQueryAssignHospital();
			}
		}
	},

	onLastQueryEditSpecialKey: function(field, e) {
		if (e.getKey() === e.ENTER) {
			this.onQuery();
		}
	},

	getDrugCategoryQueryParam: function() {
		var me = this;

		var result = {};

		var items = me.drugCategoryGrid.getSelectionModel().getSelection();
		if (items == null || items.length != 1) {
			//PSI.MsgBox.showInfo("请选择对应的药品！");
			return;
		}
		var drug_id = items[0].get("id");
		var hospital_name = Ext.getCmp("editQueryAssignHospital").getValue();
		if (drug_id) {
			result.drug_id = drug_id;
		}

		if (hospital_name) {
			result.hospital_name = hospital_name;
		}
		return result;
	},
	getDrugCategorySearchParam: function() {
		var me = this;

		var result = {};
		var drug_name = Ext.getCmp("editQueryName").getValue();
		if (drug_name) {
			result.common_name = drug_name;
		}
		return result;
	},
	getDrugProfitAssignQueryParam: function() {
		var me = this;
		var result = {};
		var items = me.drugAssignHospitalGrid.getSelectionModel().getSelection();
		if (items == null || items.length != 1) {
			//PSI.MsgBox.showInfo("请选择对应的药品！");
			return;
		}
		var data = items[0].data;
		if (data) {
			result.drug_id = data.drug_id;
			result.hospital_id = data.hospital_id;
		}
		return result;
	},
	onQuery: function() {
		this.freshDrugCategoryGrid();
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
		this.onQuery();
	},

	onEditDrugProfitAssign: function() {
		var me = this;
		var items = me.drugAssignHospitalGrid.getSelectionModel().getSelection();
		if (items == null || items.length != 1) {
			return;
		}
		me.__drugAssignHospitalGrid__lastId = items[0].index;
		var grid = me.profitAssignDetailGrid;
		var el = grid.getEl() || Ext.getBody();
		el.mask(PSI.Const.LOADING);
		Ext.Ajax.request({
			url: PSI.Const.BASE_URL + "Home/Drug/drugProfitAssignList",
			method: "POST",
			params: me.getDrugProfitAssignQueryParam(),
			callback: function(options, success, response) {
				var store = grid.getStore();
				store.removeAll();
				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					if (data["drugProfitAssignList"] != null && data["drugProfitAssignList"].length > 0) {
						store.add(data["drugProfitAssignList"]);
					} else {
						store.add({});
					}

				} else {
					store.add({});
				}
				el.unmask();
			}
		});
	},
	//编辑药品公司利润分配详情条目
	editCompanyProfitAssignDetailItem: function(grid, row) {
		var me = this;
		if (grid == null || row == null) {
			return;
		}
		var store = grid.getStore();
		var item = store.getAt(row).getData();
		if (item == null) {
			return false;
		}

		var result = item;
		//向后台添加需要的数据

		var grid = me.drugAssignHospitalGrid;
		var el = grid.getEl() || Ext.getBody();
		el.mask(PSI.Const.LOADING);
		Ext.Ajax.request({
			url: PSI.Const.BASE_URL + "Home/Drug/editCompanyProfitAssign",
			method: "POST",
			params: result,
			callback: function(options, success, response) {
				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					if (data["id"] != null) {
						el.unmask();
						me.freshDrugAssignHospitalGrid();
						return;
					} else {
						el.unmask();
						return;
					}
				} else {
					el.unmask();
					return;
				}
			}
		});
	},


	//添加药品利润分配详情条目
	addProfitAssignDetailItem: function(grid, row) {
		var me = this;
		if (grid == null || row == null) {
			return;
		}
		var store = grid.getStore();
		var item = store.getAt(row).getData();
		var d2hItems = me.drugAssignHospitalGrid.getSelectionModel().getSelection();
		if (d2hItems == null || d2hItems.length != 1) {
			PSI.MsgBox.showInfo("没有选取分配医院");
			return;
		}
		var d2hData = d2hItems[0].getData();
		//fields : ["id", "drug2hos_id", "description",
		//	"employee_id","employee_name", "profit_assign","creator_id","create_time","note"]
		if (item == null || item.employee_id == null || item.employee_name == "" || item.profit_assign == 0) {
			return false;
		}

		var result = {
			d2hData: d2hData,
			item: item
		};
		console.log(result)
			//向后台添加需要的数据

		var grid = me.profitAssignDetailGrid;
		var el = grid.getEl() || Ext.getBody();
		el.mask(PSI.Const.LOADING);
		Ext.Ajax.request({
			url: PSI.Const.BASE_URL + "Home/Drug/addProfitAssignDetailItem",
			method: "POST",
			params: {
				inData: Ext.JSON.encode(result)
			},
			callback: function(options, success, response) {
                var data = Ext.JSON.decode(response.responseText);
                if (data.success) {
					if (data["addedProfitAssignDetailItem"] != null) {
                        el.unmask();
                        me.freshDrugAssignHospitalGrid();
                    }
				} else {
                    PSI.MsgBox.showInfo(data.msg);
					el.unmask();
					return;
				}
			}
		});
	},
	//删除药品提成分配条目
	onDeleteDrugProfitAssignItem: function(grid, row) {
		var me = this;
		var store = grid.getStore();
		var item = store.getAt(row).getData();
		var target_id = item.id;
		if (target_id == "" || parseInt(target_id) != target_id) {
			store.remove(store.getAt(row));
			return;
		}
		var info = "请确认是否删除该条药品提成分配记录: <span style='color:red'>" + item.employee_name + " " + "</span>";

		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/Drug/deleteDrugProfitAssignItem",
				method: "POST",
				params: {
					id: target_id
				},
				callback: function(options, success, response) {
					el.unmask();
					if (success) {
						var data = Ext.JSON
							.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.tip("成功完成删除操作");
							store.remove(store.getAt(row));
							if (store.getCount() == 0) {
								store.add({});
							}
							me.freshDrugAssignHospitalGrid();
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
	getDrugProfitAssignAddParam: function() {

	},
	/**
	 * 导入药品分配
	 */
	onImportDrugAssign: function() {
		var form = Ext.create("PSI.Drug.DrugAssignImportForm", {
			parentForm: this
		});
		form.show();
	},

	/**
	 * 导入药品信息
	 */
	onImportDrug: function() {
		var form = Ext.create("PSI.Drug.DrugImportForm", {
			parentForm: this
		});
		form.show();
	},


	/*
	 已经得到了某一药品对应的医院信息，再在内部筛选医院
	* */
	onQueryAssignHospital: function() {
		var me = this;
		me.drugAssignHospitalGrid.getStore().currentPage = 1;
		Ext.getCmp("pagingToolbarDrugAssign")
			.doRefresh();
	}


});