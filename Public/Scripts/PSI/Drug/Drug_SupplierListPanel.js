/**
 * 药品-配送公司分配关系 - 主界面
 */
Ext.define("PSI.Drug.Drug_SupplierListPanel", {
	extend: "Ext.panel.Panel",
	alias: "widget.psi_drug_supplierListPanel",

	collapsible: true,
	config: {
		pAddSupplier: null,
		pEditSupplier: null,
		pDeleteSupplier: null,
		inData: undefined,
		parentCmp: undefined
	},

	initComponent: function() {
		var me = this;
		me.__readOnly = false;
		me.supplierListGrid = null;
		Ext.apply(me, {
			border: 0,
			layout: "border",
			items: [{
				region: "center",
				layout: "fit",
				border: 0,
				bodyPadding: 1,
				items: [me.getSupplierGrid()]
			}]
		});
		me.callParent(arguments);
		me.refreshdrug2supplierGrid();
	},
	getSupplierGrid: function() {
		var me = this;
		if (me.__supplierListGrid) {
			return me.__supplierListGrid;
		}
		var modelName = "PSISupplierModel";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "supplier_id", "supplier_name"]
		});
		var store = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: modelName,
			data: [{}],
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Drug/drug2supplierList",
				reader: {
					root: 'drug2supplierList',
					totalProperty: 'totalCount'
				}
			}
		});

		store.on("beforeload", function() {
			store.proxy.extraParams = me.getDrugIdFromInData();
		});
		store.on("load", function(e, records, successful) {
                store.add({});

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

		me.__supplierListGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			features: [{
				ftype: "summary"
			}],
			plugins: [me.__cellEditing],
			columnLines: true,
			columns: [{
				xtype: "rownumberer"
			}, {
				header: "供应公司名称",
				dataIndex: "supplier_name",
				menuDisabled: false,
				width: 150,
				sortable: true,
				draggable: false,
				id: "supplier_name",
				editor: {
					xtype: "psi_supplier_field",
					parentCmp: me,
					//drugId:'all',
					callbackFunc: me.selectSuppliers,
				}
			}, {
				header: "保存",
				id: "drug2supplierEdit",
				align: "center",
				menuDisabled: false,
				draggable: false,
				width: 50,
				xtype: "actioncolumn",
				items: [{
					icon: PSI.Const.BASE_URL + "Public/Images/icons/verify.png",
					handler: function(grid, row) {
						var me = this;
						var store = grid.getStore();
						//保存这一行的数据，如果保存成功，那么从数据库返回这一行的记录值，然后补充完整。
						me.addDrug2supplierItem(grid, row);
					},
					scope: me
				}]
			}, {
				header: "删除",
				id: "supplierColumnActionDelete",
				align: "center",
				menuDisabled: false,
				draggable: false,
				width: 50,
				xtype: "actioncolumn",
				items: [{
					icon: PSI.Const.BASE_URL + "Public/Images/icons/delete.png",
					handler: function(grid, row) {
						me.onDeleteDrug2SupplierItem(grid, row);
					},
					scope: me
				}]
			}, {
				header: "新增",
                id: "supplierColumnActionAdd",
				align: "center",
				menuDisabled: false,
				draggable: false,
				width: 50,
				xtype: "actioncolumn",
				items: [{
					icon: PSI.Const.BASE_URL + "Public/Images/icons/add.png",
					handler: function(grid, row) {
						var store = grid.getStore();
						store.insert(row, [{}]);
					},
					scope: me
				}]
			}],
			store: store,
			listeners: {
				cellclick: function() {
					return !me.__readonly;
				}
			}
		});
		me.supplierListGrid = me.__supplierListGrid;
		return me.__supplierListGrid;
	},
	cellEditingAfterEdit: function(editor, e) {},
	refreshdrug2supplierGrid: function() {
		var me = this;
		var store = me.supplierListGrid.getStore();
		store.removeAll();
		store.load();
		store.add({});
	},

	selectSuppliers: function(scope, data) {
		var me = this;
		if (scope) {
			me = scope;
		}
		var item = me.supplierListGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			return;
		}
		var supplier = item[0];
		supplier.set("supplier_id", data.id);
		supplier.set("supplier_name", data.name);
	},

	addDrug2supplierItem: function(grid, row) {
		var me = this;
		if (grid == null || row == null) {
			return;
		}
		var store = grid.getStore();
		var item = store.getAt(row).getData();
		var data = me.getInData();
		var result = {
			drug_name: data.common_name,
			drug_id: data.id,
			supplier_id: item.supplier_id,
			supplier_name: item.supplier_name,
		};
		if (item.id != null) {
			result.id = item.id;
		}
		//向后台添加需要的数据

		var el = me.getEl() || Ext.getBody();
		el.mask(PSI.Const.LOADING);
		Ext.Ajax.request({
			url: PSI.Const.BASE_URL + "Home/Drug/addDrug2SupplierItem",
			method: "POST",
			params: result,
			callback: function(options, success, response) {
				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					if (data["addedDrug2SupplierItem"] != null) {
						el.unmask();
						store.getAt(row).set("id", data["addedDrug2SupplierItem"].id);
					}
                    PSI.MsgBox.tip(data.msg);
					me.refreshdrug2supplierGrid();
				} else {
					//操作不成功删除
					store.remove(store.getAt(row));
					if (store.getCount() == 0) {
						store.add({});
					}
				}
				el.unmask();
				return;
			}
		});
	},

	//删除药品到配送公司
	onDeleteDrug2SupplierItem: function(grid, row) {
		var me = this;
		var store = grid.getStore();
		var item = store.getAt(row).getData();
		var target_id = item.id;
		if (target_id == "" || parseInt(target_id) != target_id) {
			return;
		}
		var info = "请确认是否删除该条记录？: <span style='color:red'>" + "</span>";

		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/Drug/deleteDrug2SupplierItem",
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
							me.refreshdrug2supplierGrid();
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
	getDrugIdFromInData: function() {
		var me = this;
		var result = {};
		var data = me.getInData();
		if (data != null && data != "") {
			result.drug_id = data.id;
		}
		return result;
	}


});