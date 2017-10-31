/**
 * 账户档案 - 主界面
 */
Ext.define("PSI.BankCard.MainForm", {
	extend : "Ext.panel.Panel",

	config : {
		pAddCategory : null,
		pEditCategory : null,
		pDeleteCategory : null,
		pAddBankCard : null,
		pEditBankCard : null,
		pDeleteBankCard : null
	},

	initComponent : function() {
		var me = this;


		Ext.define("PSIBankCard", {
					extend : "Ext.data.Model",
					fields : ["id", "account_number", "bank_name",
							"account_name", "capital_type","is_stopped",
							"now_amount"]
				});

		var store = Ext.create("Ext.data.Store", {
					autoLoad : false,
					model : "PSIBankCard",
					data : [],
					pageSize : 20,
					proxy : {
						type : "ajax",
						actionMethods : {
							read : "POST"
						},
						url : PSI.Const.BASE_URL + "Home/BankCard/bankCardList",
						reader : {
							root : 'bankCardList',
							totalProperty : 'totalCount'
						}
					},
					listeners : {
						beforeload : {
							fn : function() {
								store.proxy.extraParams = me.getQueryParam();
							},
							scope : me
						},
						load : {
							fn : function(e, records, successful) {
								if (successful) {
									me.gotoBankCardGridRecord(me.__lastId);
								}
							},
							scope : me
						}
					}
				});

		var bankCardGrid = Ext.create("Ext.grid.Panel", {
					viewConfig : {
						enableTextSelection : true
					},
					title : "账户列表",
					columnLines : true,
					columns : [Ext.create("Ext.grid.RowNumberer", {
										text : "序号",
										width : 30
									}), {
								header : "账号",
								dataIndex : "account_number",
								menuDisabled : false,
								sortable : false,
								enableDrag: true,
								enableDrop: true
							}, {
								header : "开户行",
								dataIndex : "bank_name",
								menuDisabled : false,
								sortable : false,
								width : 300
							}, {
								header : "账户名称",
								dataIndex : "account_name",
								menuDisabled : false,
								sortable : true,
								enableDrag: true,
								enableDrop: true
							}, {
								header : "资金类型",
								dataIndex : "capital_type",
								menuDisabled : false,
								sortable : false
							}, {
								header : "是否停用",
								dataIndex : "is_stopped",
								menuDisabled : false,
								sortable : false
							}, {
								header : "当前余额",
								dataIndex : "now_amount",
								menuDisabled : false,
								sortable : false
							}],
					store : store,
					bbar : [{
								id : "pagingToolbar",
								border : 0,
								xtype : "pagingtoolbar",
								store : store
							}, "-", {
								xtype : "displayfield",
								value : "每页显示"
							}, {
								id : "comboCountPerPage",
								xtype : "combobox",
								editable : false,
								width : 60,
								store : Ext.create("Ext.data.ArrayStore", {
											fields : ["text"],
											data : [["20"], ["50"], ["100"],
													["300"], ["1000"]]
										}),
								value : 20,
								listeners : {
									change : {
										fn : function() {
											store.pageSize = Ext
													.getCmp("comboCountPerPage")
													.getValue();
											store.currentPage = 1;
											Ext.getCmp("pagingToolbar")
													.doRefresh();
										},
										scope : me
									}
								}
							}, {
								xtype : "displayfield",
								value : "条记录"
							}],
					listeners : {
						itemdblclick : {
							fn : me.onEditBankCard,
							scope : me
						}
					}
				});

		me.bankCardGrid = bankCardGrid;

		Ext.apply(me, {
			border : 0,
			layout : "border",
			tbar : [{
						text : "新增账户",
						disabled : me.getPAddBankCard() == "0",
						iconCls : "PSI-button-add-detail",
						handler : this.onAddBankCard,
						scope : this
					}, {
						text : "修改账户",
						disabled : me.getPEditBankCard() == "0",
						iconCls : "PSI-button-edit-detail",
						handler : this.onEditBankCard,
						scope : this
					}, {
						text : "删除账户",
						disabled : me.getPDeleteBankCard() == "0",
						iconCls : "PSI-button-delete-detail",
						handler : this.onDeleteBankCard,
						scope : this
					}, "-", {
						text : "帮助",
						iconCls : "PSI-help",
						handler : function() {
							window
									.open("http://www.kangcenet.com");
						}
					}, "-", {
						text : "关闭",
						iconCls : "PSI-button-exit",
						handler : function() {
							location.replace(PSI.Const.BASE_URL);
						}
					}],
			items : [{
						region : "north",
						height : 90,
						border : 0,
						collapsible : true,
						title : "查询条件",
						layout : {
							type : "table",
							columns : 4
						},
						items : [{
									id : "editQueryAccountName",
									labelWidth : 60,
									labelAlign : "right",
									labelSeparator : "",
									fieldLabel : "账户名称",
									margin : "5, 0, 0, 0",
									xtype : "textfield",
									listeners : {
										specialkey : {
											fn : me.onQueryEditSpecialKey,
											scope : me
										}
									}
								}, {
									xtype : "container",
									items : [{
												xtype : "button",
												text : "查询",
												width : 100,
												iconCls : "PSI-button-refresh",
												margin : "5, 0, 0, 20",
												handler : me.onQuery,
												scope : me
											}, {
												xtype : "button",
												text : "清空查询条件",
												width : 100,
												iconCls : "PSI-button-cancel",
												margin : "5, 0, 0, 5",
												handler : me.onClearQuery,
												scope : me
											}]
								}]
					}, {
						region : "center",
						xtype : "container",
						layout : "border",
						border : 0,
						items : [{
									region : "center",
									xtype : "panel",
									layout : "fit",
									border : 0,
									items : [bankCardGrid]
								}]
					}]
		});

		me.callParent(arguments);
		me.freshBankCardGrid();
		me.__queryEditNameList = ["editQueryAccountName"];

	},

	onQuery : function () {
		var me=this;
		me.freshBankCardGrid();
	},

	freshBankCardGrid : function(id) {

		var grid = this.bankCardGrid;
		this.__lastId = id;
		Ext.getCmp("pagingToolbar").doRefresh()
	},

	onAddBankCard : function() {
		var form = Ext.create("PSI.BankCard.BankCardEditForm", {
					parentForm : this
				});
		form.show();
	},

	/**
	 * 编辑账户档案
	 */
	onEditBankCard : function() {
		var me = this;
		if (me.getPEditBankCard() == "0") {
			return;
		}

		var item = this.bankCardGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要编辑的账户");
			return;
		}

		var bankCard = item[0];
		var form = Ext.create("PSI.BankCard.BankCardEditForm", {
					parentForm : this,
					entity : bankCard
				});
		form.show();
	},
	onDeleteBankCard : function() {
		var me = this;
		var item = me.bankCardGrid.getSelectionModel().getSelection();
		if(item==null||item.length!=1){
			PSI.MsgBox.showInfo("请选择要删除的账户");
			return;
		}
		var bankCard = item[0];

		var store = me.bankCardGrid.getStore();
		var index = store.findExact("id", bankCard.get("id"));
		index--;
		var preIndex = null;
		var preItem = store.getAt(index);
		if (preItem) {
			preIndex = preItem.get("id");
		}

		var info = "请确认是否删除账户: <span style='color:red'>"
				+ bankCard.get("account_name") + "</span>";
		var me = this;
		PSI.MsgBox.confirm(info, function() {
					var el = Ext.getBody();
					el.mask("正在删除中...");
					Ext.Ajax.request({
								url : PSI.Const.BASE_URL
										+ "Home/BankCard/deleteBankCard",
								method : "POST",
								params : {
									id : bankCard.get("id")
								},
								callback : function(options, success, response) {
									el.unmask();

									if (success) {
										var data = Ext.JSON
												.decode(response.responseText);
										if (data.success) {
											PSI.MsgBox.tip("成功完成删除操作");
											me.freshBankCardGrid();
										} else {
											PSI.MsgBox.showInfo(data.msg);
										}
									}
								}

							});
				});
	},

	gotoBankCardGridRecord : function(id) {
		var me = this;
		var grid = me.bankCardGrid;
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

	onQueryEditSpecialKey : function(field, e) {
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

	onLastQueryEditSpecialKey : function(field, e) {
		if (e.getKey() === e.ENTER) {
			//this.onQuery();
		}
	},

	getQueryParam : function() {
		var me = this;
		var result = {
		};

		var account_name = Ext.getCmp("editQueryAccountName").getValue();
		if (account_name) {
			result.account_name = account_name;
		}


		return result;
	},


	onClearQuery : function() {
		var me = this;
		var nameList = this.__queryEditNameList;
		for (var i = 0; i < nameList.length; i++) {
			var name = nameList[i];
			var edit = Ext.getCmp(name);
			if (edit) {
				edit.setValue(null);
			}
		}
		me.freshBankCardGrid();
	}
});