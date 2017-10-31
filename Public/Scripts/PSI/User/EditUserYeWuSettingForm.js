/**
 * 医院 - 业务设置新增或编辑界面
 */
Ext.define("PSI.User.EditUserYeWuSettingForm", {
	extend: "Ext.window.Window",
	config: {
		entity: null,
		parentForm: null
	},
	initComponent: function() {
		var me = this;
		var entity = me.getEntity();

		Ext.define("PSIHospitalAssign", {
			extend: "Ext.data.Model",
			fields: ["hospital_id", "hospital_name", "data_org", "dataOrgFullName", "common_name", "jx", "guige", "manufacturer", "drug_id"]
		});

		var hospitalAssignStore = Ext.create("Ext.data.Store", {
			model: "PSIHospitalAssign",
			autoLoad: false,
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/User/yeWuSetHospitalAssignList",
				reader: {
					root: 'yeWuSetHospitalAssignList',
					totalProperty: 'totalCount'
				}
			}
		});

		hospitalAssignStore.on("beforeload", function() {
			hospitalAssignStore.proxy.extraParams = me.getHospitalAssignSearchParam();
		});

		var hospitalAssignGrid = Ext.create("Ext.grid.Panel", {
			title: "管辖医院分配",
			padding: 5,
			selModel: {
				mode: "MULTI"
			},
			selType: "checkboxmodel",
			bbar: [{
				id: "pagingToolbarHospitalAssign",
				border: 0,
				xtype: "pagingtoolbar",
				store: hospitalAssignStore
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPageHospitalAssign",
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
							hospitalAssignStore.pageSize = Ext
								.getCmp("comboCountPerPageHospitalAssign")
								.getValue();
							hospitalAssignStore.currentPage = 1;
							Ext.getCmp("pagingToolbarHospitalAssign")
								.doRefresh();
						},
						scope: me
					}
				}
			}, {
				xtype: "displayfield",
				value: "条记录"
			}],
			store: hospitalAssignStore,
			columns: [{
				header: "医院名称",
				dataIndex: "hospital_name",
				flex: 2,
				menuDisabled: false
			}, {
				header: "品种名称",
				dataIndex: "common_name",
				flex: 1,
				menuDisabled: false
			}, {
				header: "剂型",
				dataIndex: "jx",
				flex: 1,
				menuDisabled: false
			}, {
				header: "规格",
				dataIndex: "guige",
				flex: 1,
				menuDisabled: false
			}, {
				header: "生产企业",
				dataIndex: "manufacturer",
				flex: 1,
				menuDisabled: false
			}, {
				header: "数据域",
				dataIndex: "data_org",
				flex: 1,
				menuDisabled: false
			}, {
				header: "操作",
				align: "center",
				menuDisabled: false,
				width: 50,
				xtype: "actioncolumn",
				items: [{
					icon: PSI.Const.BASE_URL + "Public/Images/icons/delete.png",
					handler: function(grid, row) {
						var store = grid.getStore();
						store.remove(store.getAt(row));
					},
					scope: this
				}]
			}],
			tbar: [{
				text: "添加医院",
				handler: me.onAddHospitalAssign,
				scope: me,
				iconCls: "PSI-button-add"
			}, "-", {
				text: "添加所有医院",
				handler: me.onAddAllHospitalAssign,
				scope: me,
				iconCls: "PSI-button-add"
			}, "-", {
				text: "移除医院",
				handler: me.onRemoveHospitalAssign,
				scope: me,
				iconCls: "PSI-button-delete"
			}, "-", {
				text: "移除所有医院",
				handler: me.onRemoveAllHospitalAssign,
				scope: me,
				iconCls: "PSI-button-delete"
			}, "-", {
				text: "编辑数据域",
				handler: me.onEditDataOrg,
				scope: me,
				iconCls: "PSI-button-edit"
			}, "------", "-", {
				text: "确定",
				formBind: true,
				iconCls: "PSI-button-ok",
				handler: function() {
					var me = this;
					PSI.MsgBox.confirm("请确认是否保存数据?", function() {
						me.onOK();
					});
				},
				scope: this
			}, "-", {
				text: "取消",
				iconCls: "PSI-button-cancel",
				handler: function() {
					var me = this;
					PSI.MsgBox.confirm("请确认是否取消操作?", function() {
						me.close();
					});
				},
				scope: this
			}]
		});

		this.hospitalAssignGrid = hospitalAssignGrid;

		Ext.apply(me, {
			title: entity == null ? "新增业务设置" : "编辑业务设置:" + entity.name,
			modal: true,
			resizable: true,
			onEsc: Ext.emptyFn,
			maximized: true,
			width: 700,
			height: 600,
			layout: "border",
			defaultFocus: "editName",
			items: [{
				xtype: "panel",
				region: "north",
				layout: "fit",
				height: 0,
				border: 0,
				items: [{
					id: "editForm",
					xtype: "form",
					layout: {
						type: "table",
						columns: 1
					},
					border: 0,
					bodyPadding: 5,
					defaultType: 'textfield',
					fieldDefaults: {
						labelWidth: 60,
						labelAlign: "right",
						labelSeparator: "",
						msgTarget: 'side',
						width: 670,
						margin: "5"
					},
					items: [{
						xtype: "hidden",
						name: "user_id",
						value: entity == null ? null : entity.id
					}, {
						id: "editHospitalAssignIdList",
						xtype: "hidden",
						name: "hospitalAssignIdList"
					}, {
						id: "editDataOrgList",
						xtype: "hidden",
						name: "dataOrgList"
					}, {
						id: "editDrugIdList",
						xtype: "hidden",
						name: "drugIdList"
					}]
				}]
			}, {
				xtype: "tabpanel",
				region: "center",
				flex: 1,
				border: 0,
				layout: "border",
				items: [hospitalAssignGrid]
			}],
			tbar: []
		});

		if (entity) {
			me.on("show", this.onWndShow, this);
		}
		me.refreshHospitalAssignGrid();
		me.callParent(arguments);
	},

	onWndShow: function() {

	},

	setSelectedHospital: function(data, dataOrgList, fullNameList) {
		var store = this.hospitalAssignGrid.getStore();
		store.removeAll();
		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			var added = false;
			if (store.findExact("hospital_id", item.hospital_id) == -1 || store.findExact("drug_id", item.drug_id) == -1 || store.findExact("hospital_id", item.hospital_id) != store.findExact("drug_id", item.drug_id)) {
				store.add({
					hospital_id: item.hospital_id,
					drug_id: item.drug_id,
					hospital_name: item.hospital_name,
					common_name: item.common_name,
					jx: item.jx,
					guige: item.guige,
					manufacturer: item.manufacturer,
					data_org: dataOrgList,
					dataOrgFullName: fullNameList
				});
			} else {}
		}
	},


	refreshHospitalAssignGrid: function() {
		Ext.getCmp("pagingToolbarHospitalAssign")
			.doRefresh();
	},

	onOK: function() {
		var me = this;
		var store = this.hospitalAssignGrid.getStore();
		var data = store.data;
		var idList = [];
		var dataOrgList = [];
		var drugIdList = [];
		for (var i = 0; i < data.getCount(); i++) {
			var item = data.items[i].data;
			if (item.hospital_id != null && item.hospital_id != "") {
				idList.push(item.hospital_id);
				dataOrgList.push(item.data_org);
				drugIdList.push(item.drug_id)
			}
		}
		var editHospitalAssignIdList = Ext.getCmp("editHospitalAssignIdList");
		editHospitalAssignIdList.setValue(idList.join());

		Ext.getCmp("editDataOrgList").setValue(dataOrgList.join(","));

		Ext.getCmp("editDrugIdList").setValue(drugIdList.join(","));

		var editForm = Ext.getCmp("editForm");
		var el = this.getEl() || Ext.getBody();
		el.mask("数据保存中...");

		editForm.submit({
			url: PSI.Const.BASE_URL + "Home/User/editYeWuSet4HospitalAssign",
			method: "POST",
			success: function(form, action) {
				el.unmask();
				PSI.MsgBox.showInfo("数据保存成功", function() {
					me.refreshHospitalAssignGrid();
				});
			},
			failure: function(form, action) {
				el.unmask();
				PSI.MsgBox.showInfo(action.result.msg, function() {
					editName.focus();
				});
			}
		});
	},

	onAddHospitalAssign: function() {
		var store = this.hospitalAssignGrid.getStore();
		var data = store.data;
		var idList = [];
		var drugSelected = {};
		for (var i = 0; i < data.getCount(); i++) {
			var item = data.items[i].data;
			if (!drugSelected[item.hospital_id])
				drugSelected[item.hospital_id] = {};
			drugSelected[item.hospital_id][item.drug_id] = {
				drug_id: item.drug_id,
				jx: item.jx,
				guige: item.guige,
				common_name: item.common_name,
				manufacturer: item.manufacturer,
				hospital_id: item.hospital_id,
				hospital_name: item.hospital_name
			}
			if (idList.indexOf(item.hospital_id) < 0)
				idList.push(item.hospital_id);
		}
		var form = Ext.create("PSI.Hospital.SelectHospitalForm", {
			idList: idList,
			drugSelected: drugSelected,
			parentForm: this,
			entity: this.entity
		});
		form.show();
	},

	onAddAllHospitalAssign: function() {
		var me = this;
		var el = this.getEl() || Ext.getBody();
		PSI.MsgBox.confirm("是否添加所有医院？", function() {
			el.mask("数据保存中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/Hospital/viewAllHospital",
				method: "POST",
				params: {
					user_id: me.getEntity().id,
					if_view: 1,
				},
				callback: function(options, success, response) {
					if (success) {
						el.unmask();
						// PSI.MsgBox.showInfo("添加成功",function(){
						me.refreshHospitalAssignGrid();
						// });
					} else {
						el.unmask();
						PSI.MsgBox.showInfo(data.msg);
					}
				}
			})
		});
	},

	onRemoveAllHospitalAssign: function() {
		var me = this;
		var el = this.getEl() || Ext.getBody();
		PSI.MsgBox.confirm("是否移除所有医院？", function() {
			el.mask("数据保存中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/Hospital/viewAllHospital",
				method: "POST",
				params: {
					user_id: me.getEntity().id,
					if_view: 0,
				},
				callback: function(options, success, response) {
					if (success) {
						let data = JSON.parse(response.responseText);
						if (data.success) {
							// PSI.MsgBox.showInfo("添加成功",function(){
							el.unmask();
							me.refreshHospitalAssignGrid();
						} else {
							el.unmask();
							PSI.MsgBox.showInfo(data.msg);
						}
						// });
					} else {
						el.unmask();
						PSI.MsgBox.showInfo(data.msg);
					}
				}
			})
		});
		el.unmask()
	},

	onRemoveHospitalAssign: function() {
		var grid = this.hospitalAssignGrid;

		var items = grid.getSelectionModel().getSelection();
		if (items == null || items.length == 0) {
			PSI.MsgBox.showInfo("请选择要移除的医院");
			return;
		}

		grid.getStore().remove(items);
	},

	getDataOrgGrid: function() {
		var me = this;
		if (me.__dataOrgGrid) {
			return me.__dataOrgGrid;
		}
		var modelName = "PSIHospitalAssignDataOrg_EditForm";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["dataOrg", "fullName"]
		});

		var store = Ext.create("Ext.data.Store", {
			model: modelName,
			autoLoad: false,
			data: []
		});

		me.__dataOrgGrid = Ext.create("Ext.grid.Panel", {
			title: "数据域",
			store: store,
			padding: 5,
			tbar: [{
				text: "设置数据域"
			}],
			columns: [{
				header: "数据域",
				dataIndex: "dataOrg",
				flex: 1,
				menuDisabled: false
			}, {
				header: "组织机构/人",
				dataIndex: "fullName",
				flex: 2,
				menuDisabled: false
			}]
		});

		return me.__dataOrgGrid;
	},

	onEditDataOrg: function() {
		var me = this;

		var grid = me.hospitalAssignGrid;

		var items = grid.getSelectionModel().getSelection();
		if (items == null || items.length == 0) {
			PSI.MsgBox.showInfo("请选择要编辑数据域的医院");
			return;
		}

		var form = Ext.create("PSI.HospitalAssign.SelectDataOrgForm", {
			editForm: me
		});
		form.show();
	},


	getHospitalAssignSearchParam: function() {
		var me = this;
		var result = {};
		result.userId = me.entity.id;
		return result;
	},


	/**
	 * PSI.HospitalAssign.SelectDataOrgForm中回调本方法
	 */
	onEditDataOrgCallback: function(dataOrg) {
		var me = this;

		var grid = me.hospitalAssignGrid;

		var items = grid.getSelectionModel().getSelection();
		if (items == null || items.length == 0) {
			return;
		}

		for (var i = 0; i < items.length; i++) {
			items[i].set("dataOrg", dataOrg);
		}
	}
});