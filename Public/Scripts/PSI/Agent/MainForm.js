/**
 * 代理商档案 - 主界面
 */
Ext.define("PSI.Agent.MainForm", {
	extend: "Ext.panel.Panel",

	config: {
		pAddAgent: null,
		pEditAgent: null,
		pDeleteAgent: null,
		pImportAgent: null,
		pExportAgent: null,
	},

	initComponent: function() {
		var me = this;

		Ext.define("PSIAgent", {
			extend: "Ext.data.Model",
			fields: ["id", "code", "agent_name", "region", "address",
				"duty_employee", "link_name", "mobile_phone", "telephone",
				"fax", "qq", "email",
				"id_card", "gender", "payment_way",
				"bank_account", "creator_id", "create_time", "note"
			]
		});

		var store = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: "PSIAgent",
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/Agent/listAgent",
				reader: {
					root: 'agentList',
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
							me.gotoAgentGridRecord(me.__lastId);
						}
					},
					scope: me
				}
			}
		});

		var agentGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			title: "代理商列表",
			columnLines: true,
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				width: 30
			}), {
				header: "代理商编码",
				dataIndex: "code",
				menuDisabled: false,
				sortable: false
			}, {
				header: "代理商名称",
				dataIndex: "agent_name",
				menuDisabled: false,
				sortable: true
			}, {
				header: "所在地区",
				dataIndex: "region",
				menuDisabled: false,
				sortable: false
			}, {
				header: "地址",
				dataIndex: "address",
				menuDisabled: false,
				sortable: false
			}, {
				header: "负责人",
				dataIndex: "duty_employee",
				menuDisabled: false,
				sortable: false
			}, {
				header: "联系人姓名",
				dataIndex: "link_name",
				menuDisabled: false,
				sortable: false
			}, {
				header: "手机号码",
				dataIndex: "mobile_phone",
				menuDisabled: false,
				sortable: false
			}, {
				header: "固定电话",
				dataIndex: "telephone",
				menuDisabled: false,
				sortable: false
			}, {
				header: "传真",
				dataIndex: "fax",
				menuDisabled: false,
				sortable: false
			}, {
				header: "QQ/微信",
				dataIndex: "qq",
				menuDisabled: false,
				sortable: false
			}, {
				header: "邮箱",
				dataIndex: "email",
				menuDisabled: false,
				sortable: false
			}, {
				header: "身份证号码",
				dataIndex: "id_card",
				menuDisabled: false,
				sortable: false,
                width:120,
			}, {
				header: "性别",
				dataIndex: "gender",
				menuDisabled: false,
				sortable: false,
			}, {
				header: "付款方式",
				dataIndex: "payment_way",
				menuDisabled: false,
				sortable: false
			}, {
				header: "银行账户",
				dataIndex: "bank_account",
				menuDisabled: false,
				sortable: false,
				width:120,
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
					fn: me.onEditAgent,
					scope: me
				}
			}
		});

		me.agentGrid = agentGrid;

		Ext.apply(me, {
			border: 0,
			layout: "border",
			tbar: [{
				text: "新增代理商",
				disabled: me.getPAddAgent() == "0",
				iconCls: "PSI-button-add-detail",
				handler: this.onAddAgent,
				scope: this
			}, {
				text: "修改代理商",
				disabled: me.getPEditAgent() == "0",
				iconCls: "PSI-button-edit-detail",
				handler: this.onEditAgent,
				scope: this
			}, {
				text: "删除代理商",
				disabled: me.getPDeleteAgent() == "0",
				iconCls: "PSI-button-delete-detail",
				handler: this.onDeleteAgent,
				scope: this
			}, {
				text: "导入代理商信息",
				iconCls: "PSI-button-excelimport",
				handler: this.onImportAgent,
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
					fieldLabel: "代理商名称",
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
					items: [agentGrid]
				}]
			}]
		});

		me.callParent(arguments);
		me.freshAgentGrid();
		me.__queryEditNameList = ["editQueryName"];

	},

	freshAgentGrid: function(id) {
		var grid = this.agentGrid;
		var store = grid.getStore();
		store.removeAll();
		store.load();
	},

	onAddAgent: function() {
		var form = Ext.create("PSI.Agent.AgentEditForm", {
			parentForm: this
		});
		form.show();
	},

	/**
	 * 编辑代理商档案
	 */
	onEditAgent: function() {
		var me = this;
		if (me.getPEditAgent() == "0") {
			return;
		}

		var item = this.agentGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要编辑的代理商");
			return;
		}

		var agent = item[0];
		var form = Ext.create("PSI.Agent.AgentEditForm", {
			parentForm: this,
			entity: agent
		});
		form.show();
	},
	onDeleteAgent: function() {
		var me = this;
		var item = me.agentGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要删除的代理商");
			return;
		}
		var agent = item[0];
		var store = me.agentGrid.getStore();
		var index = store.findExact("id", agent.get("id"));
		index--;
		var preIndex = null;
		var preItem = store.getAt(index);
		if (preItem) {
			preIndex = preItem.get("id");
		}

		var info = "请确认是否删除代理商: <span style='color:red'>" + agent.get("agent_name") + "</span>";
		var me = this;
		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/Agent/deleteAgent",
				method: "POST",
				params: {
					id: agent.get("id")
				},
				callback: function(options, success, response) {
					el.unmask();

					if (success) {
						var data = Ext.JSON
							.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.tip("成功完成删除操作");
							me.freshAgentGrid();
						} else {
							PSI.MsgBox.showInfo(data.msg);
						}
					}
				}

			});
		});
	},

	gotoAgentGridRecord: function(id) {
		var me = this;
		var grid = me.agentGrid;
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

		var result = {};

		var name = Ext.getCmp("editQueryName").getValue();
		if (name) {
			result.agent_name = name;
		}

		return result;
	},

	/**
	 * 查询
	 */
	onQuery: function() {
		var me = this;
		me.freshAgentGrid();
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

		me.freshAgentGrid();
	},

	/**
	 * 导入信息
	 */
	onImportAgent: function() {
		var form = Ext.create("PSI.Agent.AgentImportForm", {
			parentForm: this
		});
		form.show();
	},
});