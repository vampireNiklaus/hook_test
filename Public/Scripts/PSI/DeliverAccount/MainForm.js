/**
 * 配送公司档案 - 主界面
 */
Ext.define("PSI.DeliverAccount.MainForm", {
	extend: "Ext.panel.Panel",

	config: {
		pAddDeliverAccount: null,
		pEditDeliverAccount: null,
		pDeleteDeliverAccount: null,
		pDisableDeliverAccount: null
	},

	initComponent: function() {
		var me = this;


		Ext.define("PSIDeliverAccount", {
			extend: "Ext.data.Model",
			fields: ["id","deliver_id","deliver_name","url","username","password","disabled","creator_id", "creator_name", "create_time"
			]
		});

		var store = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: "PSIDeliverAccount",
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/DeliverAccount/deliverAccountList",
				reader: {
					root: 'deliverAccountList',
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
							me.gotoDeliverAccountGridRecord(me.__lastId);
						}
					},
					scope: me
				}
			}
		});

		var deliverAccountGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			title: "配送公司账号列表",
			columnLines: true,
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				width: 30
			}), {
				header: "配送公司名称",
				dataIndex: "deliver_name",
				menuDisabled: false,
				sortable: true
			}, {
				header: "网站地址",
				dataIndex: "url",
				menuDisabled: false,
				sortable: false
			}, {
				header: "账号",
				dataIndex: "username",
				menuDisabled: false,
				sortable: false
			}, {
				header: "是否禁用",
				dataIndex: "disabled",
				menuDisabled: false,
				sortable: false,
				renderer: function(value) {
					return value==0?"已启用":"<b style='color:red'>已禁用</b>";
				}
			}, {
				header: "创建人",
				dataIndex: "creator_name",
				width: 120,
			}, {
				header: "创建时间",
				dataIndex: "create_time",
				width: 120
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
					fn: me.onEditDeliverAccount,
					scope: me
				}
			}
		});

		me.deliverAccountGrid = deliverAccountGrid;

		Ext.apply(me, {
			border: 0,
			layout: "border",
			tbar: [{
				text: "新增账号",
				disabled: me.getPAddDeliverAccount() == "0",
				iconCls: "PSI-button-add-detail",
				handler: this.onAddDeliverAccount,
				scope: this
			}, {
				text: "修改账号",
				disabled: me.getPEditDeliverAccount() == "0",
				iconCls: "PSI-button-edit-detail",
				handler: this.onEditDeliverAccount,
				scope: this
			}, {
				text: "删除账号",
				disabled: me.getPDeleteDeliverAccount() == "0",
				iconCls: "PSI-button-delete-detail",
				handler: this.onDeleteDeliverAccount,
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
					items: [deliverAccountGrid]
				}]
			}]
		});

		me.callParent(arguments);
		me.freshDeliverAccountGrid();
		me.__queryEditNameList = ["editQueryName"];

	},


	freshDeliverAccountGrid: function(id) {
		var grid = this.deliverAccountGrid;
		var store = grid.getStore();
		store.removeAll();
		store.load();
	},

    /**
     * 编辑配送公司账号
     */
	onAddDeliverAccount: function() {
		var form = Ext.create("PSI.DeliverAccount.DeliverAccountEditForm", {
			parentForm: this
		});
		form.show();
	},

	/**
	 * 编辑配送公司账号
	 */
	onEditDeliverAccount: function() {
		var me = this;
		if (me.getPEditDeliverAccount() == "0") {
			return;
		}

		var item = this.deliverAccountGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要编辑的账号");
			return;
		}

		var deliverAccount = item[0];
		var form = Ext.create("PSI.DeliverAccount.DeliverAccountEditForm", {
			parentForm: this,
			entity: deliverAccount
		});
		form.show();
	},
	onQuery: function() {
		this.freshDeliverAccountGrid();
	},
	onDeleteDeliverAccount: function() {
		var me = this;
		var item = me.deliverAccountGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要删除的账号");
			return;
		}
		var deliverAccount = item[0];
		var store = me.deliverAccountGrid.getStore();
		var index = store.findExact("id", deliverAccount.get("id"));
		index--;
		var preIndex = null;
		var preItem = store.getAt(index);
		if (preItem) {
			preIndex = preItem.get("id");
		}

		var info = "请确认是否删除 <span style='color:red'>" + deliverAccount.get("deliver_name") + "的账号</span>";
		var me = this;
		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/DeliverAccount/deleteDeliverAccount",
				method: "POST",
				params: {
					id: deliverAccount.get("id")
				},
				callback: function(options, success, response) {
					el.unmask();

					if (success) {
						var data = Ext.JSON
							.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.tip("成功完成删除操作");
							me.freshDeliverAccountGrid();
						} else {
							PSI.MsgBox.showInfo(data.msg);
						}
					}
				}

			});
		});
	},

	gotoDeliverAccountGridRecord: function(id) {
		var me = this;
		var grid = me.deliverAccountGrid;
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
		me.freshDeliverAccountGrid();

	}

});