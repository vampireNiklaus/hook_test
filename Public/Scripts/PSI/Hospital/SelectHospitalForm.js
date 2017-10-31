/**
 * 选择医院
 */

var drugSelected = {};
var lastClickId = undefined;
var lastClickName = undefined;
var lastIndex = undefined;
var isSelected = false;

Ext.define("PSI.Hospital.SelectHospitalForm", {
	extend: "Ext.window.Window",

	config: {
		idList: null, // idList是数组
		parentForm: null,
		entity: null,
		drugSelected: null,
	},

	title: "选择医院",
	width: 800,
	height: 800,
	modal: true,
	resizable: true,
	layout: "border",

	initComponent: function() {
		var me = this;
		var entity = me.getEntity();
		window.drugSelected = me.getDrugSelected();
		Ext.apply(me, {
			padding: 5,
			maximized: true,
			items: [{
				region: "center",
				layout: "border",
				border: 0,
				items: [{
					region: "north",
					layout: "border",
					height: "50%",
					border: 0,
					title: "所有可以选择的医院",
					items: [{
						region: "west",
						width: "30%",
						layout: "fit",
						border: 0,
						split: true,
						items: [me.getRegionTreeGrid()]
					}, {
						region: "center",

						border: 0,
						layout: "fit",
						items: [me.getHospitalGrid()]
					}, {
						region: "east",
						width: "30%",
						border: 0,
						layout: "fit",
						items: [me.getDrugGrid()]
					}]
				}, {
					region: "center",
					layout: "fit",
					border: 0,
					items: [me.getSelectedGrid()]
				}]
			}, {
				region: "south",
				layout: {
					type: "table",
					columns: 2
				},
				border: 0,
				height: 40,
				items: [{
					xtype: "textfield",
					fieldLabel: "数据域",
					margin: "5 5 5 5",
					labelWidth: 40,
					labelAlign: "right",
					labelSeparator: "",
					width: 590,
					readOnly: true,
					id: "editDataOrg"
				}, {
					xtype: "hidden",
					id: "editDataOrgIdList"
				}, {
					xtype: "button",
					text: "选择数据域",
					handler: me.onSelectDataOrg,
					scope: me
				}]
			}],
			buttons: [{
				text: "确定",
				formBind: true,
				iconCls: "PSI-button-ok",
				handler: this.onOK,
				scope: this
			}, {
				text: "取消",
				handler: function() {
					me.close();
				},
				scope: me
			}],
			listeners: {
				show: me.onWndShow
			}
		});

		me.callParent(arguments);
	},

	onWndShow: function() {

	},

	onOK: function() {
		var me = this;
		var grid = me.getSelectedGrid();

		// if (grid.getStore().getCount() == 0) {
		var drugSelected = window.drugSelected;
		if (!drugSelected) {
			PSI.MsgBox.showInfo("没有选择医院");
			return;
		}

		var items = [];
		for (var i in drugSelected) {
			var hospitalItem = drugSelected[i];
			for (var j in hospitalItem) {
				var item = hospitalItem[j];
				items.push({
					drug_id: item.drug_id,
					hospital_id: item.hospital_id,
					hospital_name: item.hospital_name,
					common_name: item.common_name,
					jx: item.jx,
					guige: item.guige,
					manufacturer: item.manufacturer
				});
			}
		}

		var dataOrgList = Ext.getCmp("editDataOrgIdList").getValue();
		if (!dataOrgList) {
			PSI.MsgBox.showInfo("没有选择数据域");
			return;
		}

		if (me.getParentForm()) {
			var fullNameList = Ext.getCmp("editDataOrg").getValue();
			me.getParentForm().setSelectedHospital(items, dataOrgList, fullNameList);
		}

		me.close();
	},

	onSelectDataOrg: function() {
		var me = this;
		var form = Ext.create("PSI.Permission.SelectDataOrgForm", {
			parentForm: me
		});
		form.show();
	},

	setDataOrgList: function(fullNameList, dataOrgList) {
		Ext.getCmp("editDataOrg").setValue(fullNameList);
		Ext.getCmp("editDataOrgIdList").setValue(dataOrgList);
	},

	/**
	 * 所有可以选择的医院的Grid
	 */

	getHospitalGrid: function() {
		var me = this;
		if (me.__hospitalGrid) {
			return me.__hospitalGrid;
		}

		var modelName = "PSIHospital_SelectHospitalForm";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "hospital_code", "hospital_name", "region_id", "hospital_type",
				"pym", "note", "manager"
			]
		});

		var store = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: modelName,
			groupField: ["hospital_code", "hospital_name", "region_id", "hospital_type",
				"pym", "note", "manager"
			],
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Hospital/hospitalList",
				reader: {
					root: 'hospitalList',
					totalProperty: 'totalCount'
				}
			}
		});

		store.on("beforeload", function() {
			store.proxy.extraParams = me.getQueryParam();
		});
		store.on("load", function(e, records, successful) {
			if (successful) {
				me.refreshRegionCount();
				// me.gotoHospitalGridRecord(me.__lastId);
			}
		});

		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 0, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			checkOnly: true, //如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
			selectAll: function() {
				var length = this.getStore().getCount();
				// while (--length >= 0) {
				for (var i = 0; i < length; i++) {
					this.select(i, true, false);
					var record = this.getLastSelected();
					var hospital_id = record.get('id');
					var hospital_name = record.get('hospital_name');
					me.__drugGrid.getSelectionModel().selectAll();
					me.selectAllHospital(hospital_id, hospital_name);
					// me.__hospitalGrid.fireEvent('itemclick', me.__hospitalGrid, me.__hospitalGrid.getSelectionModel().getLastSelected());
				}
			},
			deselectAll: function() {
				var length = this.getStore().getCount();
				window.drugSelected = {};
				window.lastClickId = undefined;
				window.lastClickName = undefined;
				window.lastIndex = undefined;
				window.isSelected = false;
				for (var i = 0; i < length; i++) {
					this.deselect(i, true, false);
				}
			}
		});
		me.__hospitalGrid = Ext.create("Ext.grid.Panel", {
			store: store,
			selModel: sm,
			bbar: [{
					id: "pagingToolbar4yeWuHospital",
					border: 0,
					xtype: "pagingtoolbar",
					store: store
				}, "-", {
					xtype: "displayfield",
					value: "每页显示"
				}, {
					id: "comboCountPerPage4yeWuHospital",
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
								store.pageSize = Ext
									.getCmp("comboCountPerPage4yeWuHospital")
									.getValue();
								store.currentPage = 1;
								Ext.getCmp("pagingToolba4yeWuHospitalr")
									.doRefresh();
							},
							scope: me
						}
					}
				}, {
					xtype: "displayfield",
					value: "条记录"
				}
				// , {
				// 	text: "全部添加",
				// 	handler: me.addAllHospital,
				// 	scope: me,
				// 	iconCls: "PSI-button-add-detail"
				// }
			],
			columns: [Ext.create("Ext.grid.RowNumberer", {
					text: "序号",
					width: 30
				}), {
					header: "医院名称",
					dataIndex: "hospital_name",
					menuDisabled: false,
					sortable: false
				}, {
					header: "医院类型",
					dataIndex: "hospital_type",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "备注",
					dataIndex: "note",
					menuDisabled: false,
					sortable: false,
				}, {
					header: "管理员",
					dataIndex: "manager",
					menuDisabled: false,
					sortable: false
				}
				// , {
				// 	header: "",
				// 	align: "center",
				// 	menuDisabled: false,
				// 	draggable: false,
				// 	width: 40,
				// 	xtype: "actioncolumn",
				// 	items: [{
				// 		icon: PSI.Const.BASE_URL + "Public/Images/icons/add.png",
				// 		handler: me.onAddHospital,
				// 		scope: me
				// 	}]
				// }
			],
			listeners: {
				itemclick: {
					fn: function(rowModel, record, item, index, e) {
						lastClickId = record.get('id')
						lastClickName = record.get('hospital_name')
						lastIndex = record.index;
						me.onHospitalGridNodeSelect(record);
					},
					scope: me
				},
				select: function(rowModel, records, index) {
					isSelected = true;
				}
			}
		});

		return me.__hospitalGrid;
	},

	getDrugGrid: function() {
		var me = this;
		if (me.__drugGrid) {
			return me.__drugGrid;
		}

		var modelName = "PSIHospital_SelectHospitalAndDrugForm";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "hospital_name", "common_name", "jx", "guige", "manufacturer"]
		});

		var store = Ext.create("Ext.data.Store", {
			autoLoad: true,
			model: modelName,
			groupField: ["common_name", "jx", "guige", "manufacturer", "id"],
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Hospital/hospitalToDrug",
				reader: {
					root: 'drugList',
					totalProperty: 'totalCount'
				}
			}
		});


		store.on("beforeload", function() {
			store.proxy.extraParams = me.getHospitalId();
		});

		store.on("load", function(e, records, successful) {
			if (successful) {
				me.refreshRegionCount();
				var lastSelect = me.__hospitalGrid.getSelectionModel().getLastSelected();
			}
		});

		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 0, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			checkOnly: true, //如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
		});

		me.__drugGrid = Ext.create("Ext.grid.Panel", {
			store: store,
			selModel: sm,
			bbar: [{
					id: "pagingToolbar4yeWuDrug",
					border: 0,
					xtype: "pagingtoolbar",
					store: store
				}, "-", {
					xtype: "displayfield",
					value: "每页显示"
				}, {
					id: "comboCountPerPage4yeWuDrug",
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
								store.pageSize = Ext
									.getCmp("comboCountPerPage4yeWuDrug")
									.getValue();
								store.currentPage = 1;
								Ext.getCmp("pagingToolbar4yeWuDrug")
									.doRefresh();
							},
							scope: me
						}
					}
				}, {
					xtype: "displayfield",
					value: "条记录"
				}
				// , {
				// 	text: "全部添加",
				// 	handler: me.addAllHospital,
				// 	scope: me,
				// 	iconCls: "PSI-button-add-detail"
				// }
			],
			columns: [Ext.create("Ext.grid.RowNumberer", {
					text: "序号",
					width: 30
				}), {
					header: "品种名称",
					dataIndex: "common_name",
					menuDisabled: false,
					sortable: false
				}, {
					header: "剂型",
					dataIndex: "jx",
					menuDisabled: false,
					sortable: false,
					width: 60
				}, {
					header: "规格",
					dataIndex: "guige",
					menuDisabled: false,
					sortable: false,
				}, {
					header: "生产厂家",
					dataIndex: "manufacturer",
					menuDisabled: false,
					sortable: false
				}
				// , {
				// 	header: "",
				// 	align: "center",
				// 	menuDisabled: false,
				// 	draggable: false,
				// 	width: 40,
				// 	xtype: "actioncolumn",
				// 	items: [{
				// 		icon: PSI.Const.BASE_URL + "Public/Images/icons/add.png",
				// 		handler: me.onAddHospital,
				// 		scope: me
				// 	}]
				// }
			],
			listeners: {
				select: function(rowModel, records, row) {
					if (!drugSelected[lastClickId])
						drugSelected[lastClickId] = {}
					var druglist = drugSelected[lastClickId];
					var drug_id = records.get('id')
					druglist[drug_id] = {
						drug_id: drug_id,
						jx: records.get('jx'),
						guige: records.get('guige'),
						common_name: records.get('common_name'),
						manufacturer: records.get('manufacturer'),
						hospital_id: lastClickId,
						hospital_name: lastClickName,
						index: records.index || row
					}
					var isSelected = me.__hospitalGrid.getSelectionModel().isSelected(lastIndex);
					if (!isSelected) {
						me.__hospitalGrid.getSelectionModel().select(lastIndex, true, true);
					}
				},
				deselect: function(rowModel, records) {
					var drug_id = records.get('id');
					delete(drugSelected[lastClickId][drug_id])
				}
			}
		});

		return me.__drugGrid;
	},

	onAddHospital: function(grid, row) {
		var me = this;
		var item = me.getDrugGrid().getStore().getAt(row);
		var store = me.getSelectedGrid().getStore();
		var hospitalItem = me.getHospitalGrid().getSelectionModel().getSelection();
		var id = hospitalItem[0].get('id');
		var hospital_name = hospitalItem[0].get('hospital_name');
		if (store.findExact("hospital_id", id) == -1 || store.findExact("drug_id", item.get("id")) == -1) {
			store.add({
				hospital_id: id,
				hospital_name: hospital_name,
				drug_id: item.get("id"),
				common_name: item.get("common_name"),
				jx: item.get("jx"),
				guige: item.get("guige"),
				manufacturer: item.get("manufacturer")
			});
		}
	},

	/**
	 * 最终用户选择医院的Grid
	 */
	getSelectedGrid: function() {
		var me = this;
		if (me.__selectedGrid) {
			return me.__selectedGrid;
		}

		var modelName = "PSISelectedHospital_SelectHospitalForm";

		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["hospital_id", "hospital_name", "jx", "common_name", "manufacturer", "guige", "drug_id"]
		});

		var store = Ext.create("Ext.data.Store", {
			model: modelName,
			autoLoad: false,
			data: []
		});

		me.__selectedGrid = Ext.create("Ext.grid.Panel", {
			title: "已经选择的医院",
			padding: 5,
			store: store,
			columns: [{
					header: "医院名称",
					dataIndex: "hospital_name",
					flex: 1,
					menuDisabled: false,
					draggable: false
				}, {
					header: "品种名称",
					dataIndex: "common_name",
					flex: 1,
					menuDisabled: false,
					draggable: false
				}, {
					header: "剂型",
					dataIndex: "jx",
					flex: 1,
					menuDisabled: false,
					draggable: false
				}, {
					header: "规格",
					dataIndex: "guige",
					flex: 1,
					menuDisabled: false,
					draggable: false
				}, {
					header: "生产厂家",
					dataIndex: "manufacturer",
					flex: 1,
					menuDisabled: false,
					draggable: false
				}
				// , {
				// 	header: "",
				// 	align: "center",
				// 	menuDisabled: false,
				// 	draggable: false,
				// 	width: 40,
				// 	xtype: "actioncolumn",
				// 	items: [{
				// 		icon: PSI.Const.BASE_URL + "Public/Images/icons/delete.png",
				// 		handler: function(grid, row) {
				// 			grid.getStore().removeAt(row);
				// 		},
				// 		scope: me
				// 	}]
				// }
			]
		});

		return me.__selectedGrid;
	},

	/**
	 * 地区列表Grid
	 */
	getRegionTreeGrid: function() {
		var me = this;
		if (me.__regionGrid) {
			return me.__regionGrid;
		}

		var modelName = "PSIRegionTree";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "region_name", "parent_id", "region_type", "cnt", "leaf", "children"]
		});

		var store = Ext.create("Ext.data.TreeStore", {
			model: modelName,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Hospital/allRegions"
			},
			listeners: {
				beforeload: {
					fn: function() {
						store.proxy.extraParams = me.getQueryParamForRegion();
					},
					scope: me
				}
			}

		});

		store.on("load", me.onRegionTreeStoreLoad, me);

		me.__regionGrid = Ext.create("Ext.tree.Panel", {
			title: "区域划分",
			//width: 200,
			//height:600,
			store: store,
			rootVisible: false,
			useArrows: true,
			viewConfig: {
				loadMask: true
			},
			bbar: [{
				id: "fieldTotalHospitalCount",
				xtype: "displayfield",
				value: "共有医院数量"
			}],
			columns: {
				defaults: {
					sortable: false,
					menuDisabled: false,
					draggable: false
				},
				items: [{
					xtype: "treecolumn",
					text: "区域",
					dataIndex: "region_name",
					width: 120
				}, {
					text: "医院个数",
					dataIndex: "cnt",
					align: "left",
					width: 80,
					renderer: function(value) {
						return value == 0 ? "" : value;
					}
				}]
			},
			listeners: {
				select: {
					fn: function(rowModel, record) {
						me.onRegionGridNodeSelect(record);
					},
					scope: me
				}
			}
		});

		me.regionGrid = me.__regionGrid;

		return me.__regionGrid;
	},
	getQueryParamForRegion: function() {
		var me = this;
		var result = {};
		//未定义是什么鬼
		return result;
	},

	onRegionTreeStoreLoad: function() {},

	onRegionGridNodeSelect: function(record) {
		if (!record) {
			return;
		}
		var me = this;
		me.getHospitalGrid().getStore().currentPage = 1;
		var grid = me.getHospitalGrid();
		var el = grid.getEl() || Ext.getBody();
		el.mask(PSI.Const.LOADING);
		Ext.Ajax.request({
			url: PSI.Const.BASE_URL + "Home/Hospital/hospitalList",
			method: "POST",
			params: me.getQueryParam(),
			callback: function(options, success, response) {
				var store = grid.getStore();
				store.removeAll();
				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					store.add(data["hospitalList"]);
					var hospital_ids = me.getIdList();
					var hasFilter = [];
					//勾选所有已选医院
					for (var i = 0; i < hospital_ids.length; i++) {
						var hospital_id = hospital_ids[i];
						if (hasFilter.indexOf(hospital_id) == -1) {
							var index = store.findExact('id', hospital_id);
							me.__hospitalGrid.getSelectionModel().select(Number.parseInt(index), true, true);
						}
					}
					me.__hospitalGrid.fireEvent('itemclick', me.__hospitalGrid, me.__hospitalGrid.getStore().getAt(0))
				}
				el.unmask();
			}
		});
	},

	onHospitalGridNodeSelect: function(record) {
		if (!record) {
			return;
		}
		var me = this;
		me.getDrugGrid().getStore().currentPage = 1;
		var grid = me.getDrugGrid();
		var el = grid.getEl() || Ext.getBody();
		el.mask(PSI.Const.LOADING);

		var selectGrid = me.getSelectedGrid();
		var selectEl = selectGrid.getEl() || Ext.getBody();
		selectEl.mask(PSI.Const.LOADING);

		// var freshDrugInf = undefined;
		// var freshSelectedInf = undefined;

		//刷新右侧界面
		Ext.Ajax.request({
			url: PSI.Const.BASE_URL + "Home/Hospital/hospitalToDrug",
			method: "POST",
			params: me.getHospitalId(record),
			callback: function(options, success, response) {
				var store = grid.getStore();
				store.removeAll();
				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					if (data && data.drugList) {
						store.add(data["drugList"]);
						// freshDrugInf = data["drugList"]
						// me.dealDrug(record, freshDrugInf, freshSelectedInf);
						me.dealDrug(record, data["drugList"])
					}
				}
				el.unmask();
			}
		});

		//刷新已选择医院界面
		Ext.Ajax.request({
			url: PSI.Const.BASE_URL + "Home/Hospital/selectedHospitalToDrug",
			method: "POST",
			params: me.getHospitalId(record),
			callback: function(options, success, response) {
				var store = selectGrid.getStore();
				store.removeAll();
				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					if (data && data.hospitalDrug) {
						store.add(data["hospitalDrug"]);
						// freshSelectedInf = data["hospitalDrug"]
						// me.dealDrug(record, freshDrugInf, data["hospitalDrug"])
					}
				}
				selectEl.unmask();
			}
		});
	},

	//选中所有医院
	selectAllHospital: function(hospital_id, hospital_name) {
		var me = this;
		var result = {
			hospital_id: hospital_id,
			hospital_name: hospital_name,
			user_id: me.entity.id,
			page: 1,
			limit: 1000
		};
		Ext.Ajax.request({
			url: PSI.Const.BASE_URL + "Home/Hospital/hospitalToDrug",
			method: "POST",
			params: result,
			callback: function(options, success, response) {
				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					if (data && data.drugList) {
						var drugLists = data.drugList;
						for (var i in drugLists) {
							me.addDrugToList(drugLists[i], hospital_id, hospital_name, i);
						}
					}
				}
			}
		});
	},

	//将药品信息加到临时表中
	addDrugToList: function(drug, hospital_id, hospital_name, row) {
		if (!drugSelected[hospital_id])
			drugSelected[hospital_id] = {}
		var druglist = drugSelected[hospital_id];
		var drug_id = drug.id;
		druglist[drug_id] = {
			drug_id: drug_id,
			jx: drug.jx,
			guige: drug.guige,
			common_name: drug.common_name,
			manufacturer: drug.manufacturer,
			hospital_id: hospital_id,
			hospital_name: hospital_name,
			index: drug.index || row
		}
	},

	//处理药品表单选择状况
	dealDrug: function(record, drug) {
		var me = this;
		var drugGrid = me.__drugGrid.getSelectionModel();
		var gridIsSelected = me.__hospitalGrid.getSelectionModel().isSelected(record.index);
		var isSelected = window.isSelected;
		if (isSelected) {
			if (gridIsSelected)
				drugGrid.selectAll();
			else
				drugGrid.deselectAll();
		} else {
			//将已选未保存的选中
			var selectedDrugs = drugSelected[lastClickId] || {};
			for (var i in selectedDrugs) {
				var index = selectedDrugs[i].index || me.__drugGrid.getStore().findExact('id', i);
				drugGrid.select(index, 1, true)
			}
			//将已选已保存（数据库）的选中
			// for (var i in drug) {
			// 	var isSelected = drug[i]['type'] === 'selected';
			// 	if (isSelected) {
			// 		// console.log("已选择的药品 : ", drug[i]);
			// 		drugGrid.select(Number.parseInt(i), true, true);
			// 		if (!drugSelected[lastClickId])
			// 			drugSelected[lastClickId] = {}
			// 		var druglist = drugSelected[lastClickId];
			// 		var drug_id = drug[i].id;
			// 		druglist[drug_id] = {
			// 			drug_id: drug_id,
			// 			jx: drug[i].jx,
			// 			guige: drug[i].guige,
			// 			common_name: drug[i].common_name,
			// 			manufacturer: drug[i].manufacturer,
			// 			hospital_id: lastClickId,
			// 			hospital_name: lastClickName,
			// 			index: Number.parseInt(i)
			// 		}
			// 	}
			// }
		}
		isSelected = false;
	},

	getQueryParam: function() {
		var me = this;
		var item = me.getRegionTreeGrid().getSelectionModel().getSelection();
		var region_id;
		if (item == null || item.length != 1) {
			region_id = null;
		} else {
			region_id = item[0].get("id");
		}
		var result = {
			region_id: region_id
		};

		var page = me.getHospitalGrid().getStore().currentPage;
		if (page) {
			result.page = page;
		}
		var limit = me.getHospitalGrid().getStore().pageSize;
		if (limit) {
			result.limit = limit;
		}
		return result;
	},

	getHospitalId: function(record) {
		var me = this;
		var item = [record];
		var hospital_id;
		var hospital_name;
		if (item == null || item.length != 1) {
			hospital_id = null;
		} else {
			hospital_id = item[0].get("id");
			hospital_name = item[0].get("hospital_name")
		}
		var result = {
			hospital_id: hospital_id,
			hospital_name: hospital_name,
			user_id: me.entity.id
		};
		var page = me.getDrugGrid().getStore().currentPage;
		if (page) {
			result.page = page;
		}
		var limit = me.getDrugGrid().getStore().pageSize;
		if (limit) {
			result.limit = limit;
		}
		return result;
	},

	addAllHospital: function() {
		var me = this;
		var store = me.getDrugGrid().getStore();

		var selectStore = me.getSelectedGrid().getStore();

		var hospitalItem = me.getHospitalGrid().getSelectionModel().getSelection()[0];
		var id = hospitalItem.get("id");
		var hospital_name = hospitalItem.get("hospital_name")

		for (var i = 0; i < store.getCount(); i++) {
			var item = store.getAt(i);
			if (selectStore.findExact("hospital_id", id) == -1 || selectStore.findExact("drug_id", item.get("id")) == -1) {
				selectStore.add({
					hospital_id: id,
					hospital_name: hospital_name,
					drug_id: item.get("id"),
					common_name: item.get("common_name"),
					jx: item.get("jx"),
					guige: item.get("guige"),
					manufacturer: item.get("manufacturer")
				});
			}
		}

		me.getSelectedGrid().focus();
	},

	getHospitalAssignSearchParam: function() {
		var me = this;
		var result = {};
		result.userId = me.entity.id;
		return result;
	},
});