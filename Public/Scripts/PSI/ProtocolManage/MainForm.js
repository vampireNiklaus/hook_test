/**
 * 协议管理 - 主界面
 *
 * @author RCG
 */
Ext.define("PSI.ProtocolManage.MainForm", {
	extend: "Ext.panel.Panel",

	config: {
		pAddProtocolManage: null,
		pEditProtocolManage: null,
		pDeleteProtocolManage: null,
		pImportProtocolManage: null,
		pExportProtocolManage: null,
		pVerifyProtocolManage: null,
		pRevertVerifyProtocolManage: null
	},

	/**
	 * 初始化组件
	 */
	initComponent: function() {
		var me = this;
		var modelName = "PSIProtocolManage";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["id","region","hospital_name","drug_id","drug_name","drug_jx","drug_guige","drug_jldw","cash_deposit","develop_time","protocol_amount","bidding_price","commission","cover_business","flow_type","status","protocol_number","agent_id","agent_name","start_date","end_date","execute_date","zs_employee","zs_commission","note"]
		});

		var store = Ext.create("Ext.data.Store", {
			autoLoad: false,
			model: modelName,
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/ProtocolManage/listProtocolManage",
				reader: {
					type: 'json',
					root: 'protocolManageList',
					totalProperty: 'totalCount'
				}
			}
		});

		store.on("beforeload", function() {
			store.proxy.extraParams = me.getQueryParam();
		});
		store.on("load", function(e, records, successful) {
			if (successful) {
				//点击分页下的刷新按钮的动作
			}
		});

		var protocolManageGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			title: "协议管理列表",
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
							store.pageSize = Ext.getCmp("comboCountPerPage").getValue();
							store.currentPage = 1;
							Ext.getCmp("pagingToolbar").doRefresh();
						},
						scope: me
					}
				}
			}, {
				xtype: "displayfield",
				value: "条记录"
			}],
			columnLines: true,
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				width: 50,
				menuDisabled: false,
			}), {
				header: "状态",
                width: 100,
				dataIndex: "status",
				menuDisabled: false,
				sortable: true,
				renderer : function(v){
					if(v == 0){
                        return '<span style="color:red">未审核</span>';
                    }
                    if(v == 1){
                        return '<span style="color:blue">审核已通过</span>';
                    }
                    if(v == 2){
                        return '<span style="color:red">审核未通过</span>';
                    }
				}
			}, {
				header: "协议编号",
                width: 150,
				dataIndex: "protocol_number",
				menuDisabled: false,
				sortable: true,
			},{
                header: "药品名称",
                width: 150,
                dataIndex: "drug_name",
                menuDisabled: false,
                sortable: true,
            }, {
				header: "代理商",
                width: 150,
				dataIndex: "agent_name",
				menuDisabled: false,
				sortable: true
			}, {
                header: "开始时间",
                width: 150,
                dataIndex: "start_date",
                menuDisabled: false,
                sortable: true
            },{
                header: "结束时间",
                width: 150,
                dataIndex: "end_date",
                menuDisabled: false,
                sortable: true
            },{
                header: "执行时间",
                width: 150,
                dataIndex: "execute_date",
                menuDisabled: false,
                sortable: true
            }],
			store: store,
			listeners: {
				itemdblclick: {
					fn: me.onEditProtocolManage,
					scope: me
				},
				select: {
					fn: me.onUnGridSelect,
					scope: me
				},
			}
		});
		//鼠标移入显示详情
		protocolManageGrid.getView().on('render', function(view) {
			view.tip = Ext.create('Ext.tip.ToolTip', {
				width: 300,
				title: '协议管理详情',
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
							"状态：" + re.get('status') + "</br>" +
							"协议编号：" + re.get('protocol_number') + "</br>" +
							"药品通用名：" + re.get('drug_name') + "</span></br>" +
							"代理商：" + re.get('agent_name') + "</span></br>" +
							"医院名称：" + re.get('hospital_name') + "</span></br>" +
							"<span style='margin-right: 20px'>开始日期：" + re.get('start_date') + "</span>结束日期：" + re.get('end_date') + "</br>" +
							"执行日期：" + re.get('execute_date') + "</br>" +
							"保证金：" + re.get('cash_deposit') + "</br>" +
							"开发时间：" + re.get('develop_time') + "</br>" +
							"协议销量：" + re.get('protocol_amount') + "</br>" +
                            "中标价：" + re.get('bidding_price') + "</br>" +
							"佣金：<b style='color:red'>" + re.get('commission') + "</b></br>" +
							"覆盖商业：" + re.get('cover_business') + "</br>" +
							"流向形式：" + re.get('flow_type') + "</br>" +
							"招商人员：" + re.get('zs_employee') + "</br>"+
                            "招商佣金：<b style='color:red'>" + re.get('zs_commission') + "</b></br>" +
                            "备注：" + re.get('note') + "</br>"
							// +
							// (re.get('verifier_id')>0?"审核人："+re.get('verifier_id')+"</br>":'')+
							// "备注："+re.get('note')+"</br>"+
							// "操作详情："+re.get('operate_info')
						);
					}
				}
			});
		});
		me.protocolManageGrid = protocolManageGrid;
		Ext.apply(me, {
			border: 0,
			layout: "border",
			tbar: [{
				text: "新增协议管理",
				disabled: me.getPAddProtocolManage() == "0",
				iconCls: "PSI-button-add",
				handler: me.onAddProtocolManage,
				scope: me,
				id: 'buttonAdd',
			}, {
				text: "编辑协议管理",
				disabled: me.getPEditProtocolManage() == "0",
				iconCls: "PSI-button-edit",
				handler: me.onEditProtocolManage,
				scope: me,
				id: 'buttonEdit',
			}, {
				text: "删除协议管理",
				disabled: me.getPDeleteProtocolManage() == "0",
				iconCls: "PSI-button-delete",
				handler: me.onDeleteProtocolManage,
				scope: me,
				id: 'buttonDelete',
			}, "-", {
				text: "审核",
				iconCls: "PSI-button-verify",
				disabled: me.getPVerifyProtocolManage() == "0",
				scope: me,
				handler: me.onCommit,
				id: "buttonVerify"
			}, {
				text: "反审核",
				iconCls: "PSI-button-revert-verify",
				disabled: me.getPRevertVerifyProtocolManage() == "0",
				scope: me,
				handler: me.onCommitReturn,
				id: "buttonRevertVerify"
			}, /*"-", {
				text: "导入协议管理列表",
				disabled: me.getPImportProtocolManage() == "0",
				iconCls: "PSI-button-excelimport",
				handler: me.onImportProtocolManage,
				scope: me
			}, {
				text: "导出协议管理信息",
				disabled: me.getPExportProtocolManage() == "0",
				iconCls: "PSI-button-excelexport",
				handler: me.onExportProtocolManage,
				scope: me
			}, "-",*/ {
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
				border: 0,
				height: 60,
				title: "查询条件",
				collapsible: true,
				layout: {
					type: "table",
					columns: 5
				},
				items: [{
					id: "protocol_number",
					labelWidth: 60,
					labelAlign: "right",
					labelSeparator: "",
					fieldLabel: "协议编号",
					margin: "5, 0, 0, 0",
					xtype: "textfield",
					listeners: {
						specialkey: {
							fn: me.onQueryEditSpecialKey,
							scope: me
						}
					}
				}, {
					id: "agent_name",
					labelWidth: 60,
					labelAlign: "right",
					labelSeparator: "",
					fieldLabel: "代理商",
					margin: "5, 0, 0, 0",
					xtype: "textfield",
					listeners: {
						specialkey: {
							fn: me.onQueryEditSpecialKey,
							scope: me
						}
					}
				}, {
					id: "editQueryType",
					labelWidth: 60,
					labelAlign: "right",
					labelSeparator: "",
					fieldLabel: "状态",
					margin: "5, 0, 0, 0",
					valueField: "id",
					displayField: "name",
					xtype: "combo",
					store: new Ext.data.ArrayStore({
						fields: ['id', 'name'],
						data: [
							[-1, '全部'],
							[0, '未审核'],
							[1, '已审核'],
							[2, '审核未通过']
						]
					}),
					value: -1,
					allowBlank: false,
					blankText: "没有选择协议审核状态",
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
				xtype: "panel",
				layout: "border",
				border: 0,
				items: [{
					region: "center",
					layout: "fit",
					border: 0,
					items: [protocolManageGrid]
				}]
			}]
		});

		me.callParent(arguments);
		me.refreshProtocolManageGrid();
		me.__queryEditNameList = ["protocol_number", "agent_name"];
	},
	//页面刷新，传入页码的话就跳到指定页码，不传的话就是刷新当前页
	refreshProtocolManageGrid: function(currentPage) {
		var me = this;
		var grid = me.protocolManageGrid;
		var store = grid.getStore();
		if (currentPage)
			store.currentPage = currentPage;
		store.removeAll();
		store.load();
	},
	getQueryParam: function() {
		var me = this;

		var result = {};

		var protocol_number = Ext.getCmp("protocol_number").getValue();
		if (protocol_number) {
			result.protocol_number = protocol_number;
		}

		var status = Ext.getCmp("editQueryType").getValue();
		if (status != -1) {
			result.status = status;
		}

		var agent_name = Ext.getCmp("agent_name").getValue();
		if (agent_name) {
			result.agent_name = agent_name;
		}

		return result;
	},

	/**
	 * 新增协议管理
	 */
	onAddProtocolManage: function() {
		var form = Ext.create("PSI.ProtocolManage.InvestProtocolEditForm", {
			parentForm: this
		});
		form.show();
	},

	/**
	 * 编辑协议管理
	 */
	onEditProtocolManage: function() {
		var me = this;

		var item = this.protocolManageGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要编辑的协议管理");
			return;
		}

		var protocolManage = item[0];
		if (protocolManage.get('status') == 1) {
			PSI.MsgBox.showInfo("已审核，无法修改");
			return;
		}

		var form = Ext.create("PSI.ProtocolManage.InvestProtocolEditForm", {
			parentForm: this,
			entity: protocolManage
		});

		form.show();
	},

	/**
	 * 删除协议管理
	 */
	onDeleteProtocolManage: function() {
		var me = this;
		var item = me.protocolManageGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要删除的协议管理");
			return;
		}

		var protocolManage = item[0];

		var store = me.protocolManageGrid.getStore();
		var index = store.findExact("id", protocolManage.get("id"));
		index--;
		var preItem = store.getAt(index);
		if (preItem) {
			me.__lastId = preItem.get("id");
		}

		var info = "请确认是否删除协议管理，协议编号: <span style='color:red'>" + protocolManage.get("protocol_number") + "</span> 药品：<span style='color:red'>" + protocolManage.get("drug_name") + "</span>";

		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/ProtocolManage/deleteProtocolManage",
				method: "POST",
				params: {
					id: protocolManage.get("id")
				},
				callback: function(options, success, response) {
					el.unmask();
					if (success) {
						var data = Ext.JSON.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.tip("成功完成删除操作");
							me.refreshProtocolManageGrid();
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
	 * 导入协议管理信息
	 */
	onImportProtocolManage: function() {
		//var form = Ext.create("PSI.Goods.GoodsImportForm", {
		//	parentForm : this
		//});
		//
		//form.show();
	},

	/**
	 * 导出协议管理信息
	 */
	onEportProtocolManage: function() {
		//var form = Ext.create("PSI.Goods.GoodsImportForm", {
		//	parentForm : this
		//});
		//
		//form.show();
	},

	// 审核
	onCommit: function() {
		var me = this;
		var item = me.protocolManageGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要操作的协议");
			return;
		}
		var bill = item[0];

		if (bill.get("status") == 1) {
			PSI.MsgBox.showInfo("该协议已经审核过了");
			return;
		}

		var info = "请确认协议: <span style='color:red'>协议编号：" + bill.get("protocol_number") + "，代理商：" + bill.get("agent_name") + "</span> 审核通过?";
		PSI.MsgBox.verify(info, function() {
			//审核通过
			me.verifyRequest(bill, 'yes')
		}, function() {
			//审核不通过
			me.verifyRequest(bill, 'no')
		});
	},
	// 反审核
	onCommitReturn: function() {
		var me = this;
		var item = me.protocolManageGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要操作的协议");
			return;
		}
		var bill = item[0];

		if (bill.get("status") != 1) {
			PSI.MsgBox.showInfo("该协议无法进行此操作");
			return;
		}
		var info = "确认要反审核该协议: <span style='color:red'>协议编号：" + bill.get("protocol_number") + "，代理商：" + bill.get("agent_name") + "</span> ?";
		PSI.MsgBox.confirm(info, function() {
			me.verifyRequest(bill, 'return')
		});
	},

	verifyRequest: function(bill, type) {
		var id = bill.get("id");
		var me = this;
		var el = Ext.getBody();
		el.mask("正在提交中...");
		Ext.Ajax.request({
			url: PSI.Const.BASE_URL + "Home/ProtocolManage/protocolManageStatus",
			method: "POST",
			params: {
				id: id,
				type: type
			},
			callback: function(options, success, response) {
				el.unmask();

				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					if (data.success) {
						PSI.MsgBox.showInfo("操作成功", function() {
							me.refreshProtocolManageGrid();
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
	onQuery: function() {
		var me = this;
		me.refreshProtocolManageGrid(1);
	},

	/**
	 * 清除查询条件
	 */
	onClearQuery: function() {
		var me = this;
		var nameList = me.__queryEditNameList;
		for (var i = 0; i < nameList.length; i++) {
			var name = nameList[i];
			var edit = Ext.getCmp(name);
			if (edit) {
				edit.setValue(null);
			}
		}

		me.onQuery();
	},

	onUnGridSelect: function() {
		var grid = this.protocolManageGrid;
		var item = grid.getSelectionModel().getSelection();
		var bill = item[0];
		//启用编辑或删除的按钮
		//应该设置已编辑的选中项为空
		if (bill.get('status') == 1) {} else {}
	},

	//导出表格
	onExportProtocolManage: function() {
		var grid = this.protocolManageGrid;
		var config = {
			store: grid.getStore(),
			title: "协议管理"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(grid, config); //调用导出函数
	},

});