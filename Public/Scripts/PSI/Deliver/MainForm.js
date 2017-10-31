/**
 * 配送公司档案 - 主界面
 */
Ext.define("PSI.Deliver.MainForm", {
	extend: "Ext.panel.Panel",

	config: {
		pAddDeliver: null,
		pEditDeliver: null,
		pDeleteDeliver: null,
		pImportDeliver: null,
		pExportDeliver: null,
	},

	initComponent: function() {
		var me = this;


		Ext.define("PSIDeliver", {
			extend: "Ext.data.Model",
			fields: ["id", "code", "name", "manager_name", "manager_phone",
				"manager_fax", "zhiguanke_phone", "zhiguanke_fax", "zhiguanke_name",
				"accountant_name", "accountant_qq", "accountant_phone",
				"company_email", "company_bankaccount", "company_address",
				"note", "company_postcode", "peisong_address", "business_license_code", "business_license_expire_time", "gmp_code", "gmp_expire_time",
				"qs_code", "qs_expire_time", "client_code", "client_expire_time", "creator_id", "creator_name", "create_time"
			]
		});

		var store = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: "PSIDeliver",
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Deliver/deliverList",
				reader: {
					root: 'deliverList',
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
							me.gotoDeliverGridRecord(me.__lastId);
						}
					},
					scope: me
				}
			}
		});

		var deliverGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			title: "配送公司列表",
			columnLines: true,
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				width: 30
			}), {
				header: "配送公司编码",
				dataIndex: "code",
				menuDisabled: false,
				sortable: false
			}, {
				header: "配送公司名称",
				dataIndex: "name",
				menuDisabled: false,
				sortable: true,
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
				dataIndex: "manager_fax",
				menuDisabled: false,
				sortable: false
			}, {
				header: "质管科姓名",
				dataIndex: "zhiguanke_name",
				menuDisabled: false,
				sortable: false
			}, {
				header: "质管科电话",
				dataIndex: "zhiguanke_phone",
				menuDisabled: false,
				sortable: false
			}, {
				header: "质管科传真",
				dataIndex: "zhiguanke_fax",
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
				sortable: false
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
				header: "配送地址",
				dataIndex: "peisong_address",
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
					fn: me.onEditDeliver,
					scope: me
				}
			}
		});

		me.deliverGrid = deliverGrid;

		Ext.apply(me, {
			border: 0,
			layout: "border",
			tbar: [{
				text: "新增配送公司",
				disabled: me.getPAddDeliver() == "0",
				iconCls: "PSI-button-add-detail",
				handler: this.onAddDeliver,
				scope: this
			}, {
				text: "修改配送公司",
				disabled: me.getPEditDeliver() == "0",
				iconCls: "PSI-button-edit-detail",
				handler: this.onEditDeliver,
				scope: this
			}, {
				text: "删除配送公司",
				disabled: me.getPDeleteDeliver() == "0",
				iconCls: "PSI-button-delete-detail",
				handler: this.onDeleteDeliver,
				scope: this
			}, {
				text: "导入配送公司信息",
				iconCls: "PSI-button-excelimport",
				handler: this.onImportDeliver,
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
					fieldLabel: "公司名称",
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
					items: [deliverGrid]
				}]
			}]
		});

		me.callParent(arguments);
		me.freshDeliverGrid();
		me.__queryEditNameList = ["editQueryName"];

	},


	freshDeliverGrid: function(id) {
		var grid = this.deliverGrid;
		var store = grid.getStore();
		store.removeAll();
		store.load();
	},

	onAddDeliver: function() {
		var form = Ext.create("PSI.Deliver.DeliverEditForm", {
			parentForm: this
		});
		form.show();
	},

	/**
	 * 编辑配送公司档案
	 */
	onEditDeliver: function() {
		var me = this;
		if (me.getPEditDeliver() == "0") {
			return;
		}

		var item = this.deliverGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要编辑的配送公司");
			return;
		}

		var deliver = item[0];
		var form = Ext.create("PSI.Deliver.DeliverEditForm", {
			parentForm: this,
			entity: deliver
		});
		form.show();
	},
	onQuery: function() {
		var me = this;
		me.freshDeliverGrid();
	},
	onDeleteDeliver: function() {
		var me = this;
		var item = me.deliverGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要删除的配送公司");
			return;
		}
		var deliver = item[0];
		var store = me.deliverGrid.getStore();
		var index = store.findExact("id", deliver.get("id"));
		index--;
		var preIndex = null;
		var preItem = store.getAt(index);
		if (preItem) {
			preIndex = preItem.get("id");
		}

		var info = "请确认是否删除配送公司: <span style='color:red'>" + deliver.get("name") + "</span>";
		var me = this;
		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/Deliver/deleteDeliver",
				method: "POST",
				params: {
					id: deliver.get("id")
				},
				callback: function(options, success, response) {
					el.unmask();

					if (success) {
						var data = Ext.JSON
							.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.tip("成功完成删除操作");
							me.freshDeliverGrid();
						} else {
							PSI.MsgBox.showInfo(data.msg);
						}
					}
				}

			});
		});
	},

	gotoDeliverGridRecord: function(id) {
		var me = this;
		var grid = me.deliverGrid;
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
			//this.onQuery();
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



	onClearQuery: function() {
		var me = this;
		var nameList = this.__queryEditNameList;
		for (var i = 0; i < nameList.length; i++) {
			var name = nameList[i];
			var edit = Ext.getCmp(name);
			if (edit) {
				edit.setValue(null);
			}
		}
		me.freshDeliverGrid();

	},

	/**
	 * 导入信息
	 */
	onImportDeliver: function() {
		var form = Ext.create("PSI.Deliver.DeliverImportForm", {
			parentForm: this
		});
		form.show();
	},
});