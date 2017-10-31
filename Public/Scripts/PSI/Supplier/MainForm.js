/**
 * 供应商档案 - 主界面
 */
Ext.define("PSI.Supplier.MainForm", {
	extend: "Ext.panel.Panel",

	config: {
		pAddSupplier: null,
		pEditSupplier: null,
		pDeleteSupplier: null,
		pImportSupplier: null,
		pExportSupplier: null,
	},

	initComponent: function() {
		var me = this;

		Ext.define("PSISupplier", {
			extend: "Ext.data.Model",
			fields: ["id", "code", "name", "manager_name", "manager_phone",
				"manager_mobile", "neiqin_name", "neiqin_phone", "neiqin_qq",
				"accountant_name", "accountant_qq", "accountant_phone",
				"company_email", "company_bankaccount", "company_address",
				"note", "company_postcode", "business_license_code", "business_license_expire_time", "gmp_code", "gmp_expire_time",
				"qs_code", "qs_expire_time", "client_code", "client_expire_time", "creator_id", "creator_name", "create_time"
			]
		});

		var store = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: "PSISupplier",
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Supplier/supplierList",
				reader: {
					root: 'supplierList',
					totalProperty: 'totalCount'
				}
			},
			listeners: {
				beforeload: {
					fn: function() {
						store.proxy.extraParams = me.getQueryParam();
					},
					scope: me
				},
				load: {
					fn: function(e, records, successful) {
						if (successful) {
							me.gotoSupplierGridRecord(me.__lastId);
						}
					},
					scope: me
				}
			}
		});

		var supplierGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			title: "供应商列表",
			columnLines: true,
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				width: 30
			}), {
				header: "供应商编码",
				dataIndex: "code",
				menuDisabled: false,
				sortable: false
			}, {
				header: "供应商名称",
				dataIndex: "name",
				menuDisabled: false,
				sortable: true
			}, {
				header: "经理姓名",
				dataIndex: "manager_name",
				menuDisabled: false,
				sortable: false
			}, {
				header: "经理电话",
				dataIndex: "manager_phone",
				menuDisabled: false,
				sortable: false
			}, {
				header: "经理传真",
				dataIndex: "manager_mobile",
				menuDisabled: false,
				sortable: false
			}, {
				header: "内勤姓名",
				dataIndex: "neiqin_name",
				menuDisabled: false,
				sortable: false
			}, {
				header: "内勤电话",
				dataIndex: "neiqin_phone",
				menuDisabled: false,
				sortable: false
			}, {
				header: "内勤QQ",
				dataIndex: "neiqin_qq",
				menuDisabled: false,
				sortable: false
			}, {
				header: "财务姓名",
				dataIndex: "accountant_name",
				menuDisabled: false,
				sortable: false
			}, {
				header: "财务QQ",
				dataIndex: "accountant_qq",
				menuDisabled: false,
				sortable: false
			}, {
				header: "财务电话",
				dataIndex: "accountant_phone",
				menuDisabled: false,
				sortable: false
			}, {
				header: "公司邮箱",
				dataIndex: "company_email",
				menuDisabled: false,
				sortable: false
			}, {
				header: "公司银行账号",
				dataIndex: "company_bankaccount",
				menuDisabled: false,
				sortable: false,
				width: 300
			}, {
				header: "公司地址",
				dataIndex: "company_address",
				menuDisabled: false,
				sortable: false
			}, {
				header: "邮编",
				dataIndex: "company_postcode",
				menuDisabled: false,
				sortable: false
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
			}, {
				header: "备注",
				dataIndex: "note",
				menuDisabled: false,
				sortable: false
			}],
			store: store,
			bbar: [{
				id: "pagingToolbar",
				border: 0,
				xtype: "pagingtoolbar",
				store: store
			}, "-", {
				xtype: "displayfield",
				value: "每页显示"
			}, {
				id: "comboCountPerPage",
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
								.getCmp("comboCountPerPage")
								.getValue();
							store.currentPage = 1;
							Ext.getCmp("pagingToolbar")
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
				itemdblclick: {
					fn: me.onEditSupplier,
					scope: me
				}
			}
		});

		me.supplierGrid = supplierGrid;

		Ext.apply(me, {
			border: 0,
			layout: "border",
			tbar: [{
				text: "新增供应商",
				disabled: me.getPAddSupplier() == "0",
				iconCls: "PSI-button-add-detail",
				handler: this.onAddSupplier,
				scope: this
			}, {
				text: "修改供应商",
				disabled: me.getPEditSupplier() == "0",
				iconCls: "PSI-button-edit-detail",
				handler: this.onEditSupplier,
				scope: this
			}, {
				text: "删除供应商",
				disabled: me.getPDeleteSupplier() == "0",
				iconCls: "PSI-button-delete-detail",
				handler: this.onDeleteSupplier,
				scope: this
			}, {
				text: "导入供应商信息",
				iconCls: "PSI-button-excelimport",
				handler: this.onImportSupplier,
				scope: this
			}, "-", {
				text: "帮助",
				iconCls: "PSI-help",
				handler: function() {
					window
						.open("http://www.kangcenet.com");
				}
			}, "-", {
				text: "关闭",
				iconCls: "PSI-button-exit",
				handler: function() {
					location.replace(PSI.Const.BASE_URL);
				}
			}],
			items: [{
				region: "north",
				height: 90,
				border: 0,
				collapsible: true,
				title: "查询条件",
				layout: {
					type: "table",
					columns: 4
				},
				items: [{
					id: "editQueryName",
					labelWidth: 60,
					labelAlign: "right",
					labelSeparator: "",
					fieldLabel: "供应商名称",
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
				xtype: "container",
				layout: "border",
				border: 0,
				items: [{
					region: "center",
					xtype: "panel",
					layout: "fit",
					border: 0,
					items: [supplierGrid]
				}]
			}]
		});

		me.callParent(arguments);
		me.freshSupplierGrid();
		me.__queryEditNameList = ["editQueryName"];

	},

	freshSupplierGrid: function(id) {
		var grid = this.supplierGrid;
		var store = grid.getStore();
		store.removeAll();
		store.load();
	},

	onAddSupplier: function() {
		var form = Ext.create("PSI.Supplier.SupplierEditForm", {
			parentForm: this
		});
		form.show();
	},

	/**
	 * 编辑供应商档案
	 */
	onEditSupplier: function() {
		var me = this;
		if (me.getPEditSupplier() == "0") {
			return;
		}

		var item = this.supplierGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要编辑的供应商");
			return;
		}

		var supplier = item[0];
		var form = Ext.create("PSI.Supplier.SupplierEditForm", {
			parentForm: this,
			entity: supplier
		});
		form.show();
	},
	onDeleteSupplier: function() {
		var me = this;
		var item = me.supplierGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要删除的供应商");
			return;
		}
		var supplier = item[0];
		var store = me.supplierGrid.getStore();
		var index = store.findExact("id", supplier.get("id"));
		index--;
		var preIndex = null;
		var preItem = store.getAt(index);
		if (preItem) {
			preIndex = preItem.get("id");
		}

		var info = "请确认是否删除供应商: <span style='color:red'>" + supplier.get("name") + "</span>";
		var me = this;
		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/Supplier/deleteSupplier",
				method: "POST",
				params: {
					id: supplier.get("id")
				},
				callback: function(options, success, response) {
					el.unmask();

					if (success) {
						var data = Ext.JSON
							.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.tip("成功完成删除操作");
							me.freshSupplierGrid();
						} else {
							PSI.MsgBox.showInfo(data.msg);
						}
					}
				}

			});
		});
	},

	gotoSupplierGridRecord: function(id) {
		var me = this;
		var grid = me.supplierGrid;
		var store = grid.getStore();
		if (id) {
			var r = store.findExact("id", id);
			if (r != -1) {
				grid.getSelectionModel().select(r);
			} else {
				grid.getSelectionModel().select(0);
			}
		} else {
			grid.getSelectionModel().select(0);
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

	getQueryParam: function() {
		var me = this;

		var result = {};

		var name = Ext.getCmp("editQueryName").getValue();
		if (name) {
			result.name = name;
		}

		return result;
	},

	/**
	 * 查询
	 */
	onQuery: function() {
		var me = this;
		me.freshSupplierGrid();
	},

	onClearQuery: function() {
		var nameList = this.__queryEditNameList;
		var me = this;
		for (var i = 0; i < nameList.length; i++) {
			var name = nameList[i];
			var edit = Ext.getCmp(name);
			if (edit) {
				edit.setValue(null);
			}
		}

		me.freshSupplierGrid();
	},

	/**
	 * 导入信息
	 */
	onImportSupplier: function() {
		var form = Ext.create("PSI.Supplier.SupplierImportForm", {
			parentForm: this
		});
		form.show();
	},
});