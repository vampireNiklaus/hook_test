/**
 * 业务员 - 主界面
 *
 * @author Baoyu Li
 */
Ext.define("PSI.Employee.MainForm", {
	extend : "Ext.panel.Panel",

	config : {
		pAddEmployee : null,
		pEditEmployee : null,
		pDeleteEmployee : null,
		pImportEmployee : null,
		pExportEmployee : null
	},

	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		me.employeeGrid = null;

		var modelName = "PSIEmployee";
		Ext.define(modelName, {
			extend : "Ext.data.Model",
			fields : ["id", "code", "name", "bank_account", "phone",
				"qq", "email", "pym","address", "note", "is_employee",
				"is_off_job","client_user_name","client_password","create_time","login_enable","creator_id","creator_name"]
		});
		var store = Ext.create("Ext.data.Store", {
			autoLoad : true,
			model : modelName,
			data : [],
			pageSize : 20,
			proxy : {
				type : "ajax",
				actionMethods : {
					read : "POST"
				},
				url : PSI.Const.BASE_URL + "Home/Employee/listEmployee",
				reader : {
					root : 'employeeList',
					totalProperty : 'totalCount'
				}
			}
		});

		store.on("beforeload", function() {
			store.proxy.extraParams = me.getQueryParam();
		});
		store.on("load", function(e, records, successful) {
			if (successful) {
				me.gotoEmployeeGridRecord();
			}
		});

		me.employeeGrid = Ext.create("Ext.grid.Panel", {
			viewConfig : {
				enableTextSelection : true,
			},
			title : "业务员列表",
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
				width : 120,
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
			columnLines : true,
			columns : [Ext.create("Ext.grid.RowNumberer", {
				text : "序号",
				width : 30
			}), {
				header : "ID",
				dataIndex : "id",
				menuDisabled : false,
				sortable : true
			}, {
				header : "业务员编号",
				dataIndex : "code",
				menuDisabled : false,
				sortable : true
			}, {
				header : "业务员姓名",
				dataIndex : "name",
				menuDisabled : false,
				sortable : true
			}, {
				header : "银行账号",
				dataIndex : "bank_account",
				menuDisabled : false,
				sortable : false,
				width : 300
			}, {
				header : "联系电话",
				dataIndex : "phone",
				menuDisabled : false,
				sortable : false,
			}, {
				header : "QQ",
				dataIndex : "qq",
				menuDisabled : false,
				sortable : false
			}, {
				header : "邮箱",
				dataIndex : "email",
				menuDisabled : false,
				sortable : false
			}, {
				header : "拼音码",
				dataIndex : "pym",
				menuDisabled : false,
				sortable : false,
			}, {
				header : "住址",
				dataIndex : "address",
				menuDisabled : false,
				sortable : false
			}, {
				header : "备注",
				dataIndex : "note",
				menuDisabled : false,
				sortable : false
			}, {
				header : "是否是业务员",
				dataIndex : "is_employee",
				menuDisabled : false,
				sortable : false,
				renderer: function(value){
					if (value == 1) {
						return "是";
					}else{
						return "否";
					}
				}
			}, {
				header : "是否离职",
				dataIndex : "is_off_job",
				menuDisabled : false,
				sortable : false,
				renderer: function(value){
					if (value == 1) {
						return "是";
					}else{
						return "否";
					}
				}
			}, {
				header : "客户端登录账号",
				dataIndex : "client_user_name",
				menuDisabled : false,
				sortable : false
			},{
				header : "客户端登录密码",
				dataIndex : "client_password",
				menuDisabled : false,
				sortable : false
			},{
				header : "创建时间",
				dataIndex : "create_time",
				menuDisabled : false,
				sortable : false
			},{
				header : "创建人",
				dataIndex : "creator_name",
				menuDisabled : false,
				sortable : false
			}],
			store : store,
			listeners : {
				itemdblclick : {
					fn : me.onEditEmployee,
					scope : me
				},
			}
		});


		Ext.apply(me, {
			border : 0,
			layout : "border",
			tbar : [{
				text : "新增业务员",
				disabled : me.getPAddEmployee() == "0",
				iconCls : "PSI-button-add",
				handler : me.onAddEmployee,
				scope : me
			}, {
				text : "编辑业务员",
				disabled : me.getPEditEmployee() == "0",
				iconCls : "PSI-button-edit",
				handler : me.onEditEmployee,
				scope : me
			}, {
				text : "删除业务员",
				disabled : me.getPDeleteEmployee() == "0",
				iconCls : "PSI-button-delete",
				handler : me.onDeleteEmployee,
				scope : me
			}, "-",  {
				text : "导入业务员列表",
				disabled : me.getPImportEmployee() == "0",
				iconCls : "PSI-button-excelimport",
				handler : me.onImportEmployees,
				scope : me
			}, "-", {
				text : "导出业务员信息",
				disabled : me.getPExportEmployee() == "0",
				iconCls : "PSI-button-excelexport",
				handler : me.onExportEmployees,
				scope : me
			},"-", {
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
				border : 0,
				height : 100,
				title : "查询条件",
				collapsible : true,
				layout : {
					type : "table",
					columns : 5
				},
				items : [{
					id : "editQueryName",
					labelWidth : 60,
					labelAlign : "right",
					labelSeparator : "",
					fieldLabel : "业务员姓名",
					margin : "5, 0, 0, 0",
					xtype : "textfield",
					listeners : {
						specialkey : {
							fn : me.onQueryEditSpecialKey,
							scope : me
						}
					}
				}, {
					id : "editQueryQQ",
					labelWidth : 60,
					labelAlign : "right",
					labelSeparator : "",
					fieldLabel : "业务员QQ",
					margin : "5, 0, 0, 0",
					xtype : "textfield",
					listeners : {
						specialkey : {
							fn : me.onQueryEditSpecialKey,
							scope : me
						}
					}
				}, {
					id : "editQueryPhone",
					labelWidth : 60,
					labelAlign : "right",
					labelSeparator : "",
					fieldLabel : "业务员电话",
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
				region: "center",
				xtype: "panel",
				layout: "border",
				border: 0,
				items: [{
					region: "center",
					layout: "fit",
					border: 0,
					items: [me.employeeGrid]
				}]
			}]
		});

		me.callParent(arguments);
		me.refreshEmployeeGrid();
		me.__queryEditNameList = ["editQueryQQ", "editQueryName",
			"editQueryPhone"];
	},

	refreshEmployeeGrid:function(id){
		var me = this;
		var grid = me.employeeGrid;
		var store = grid.getStore();
		store.removeAll();
		store.load();
		//Ext.Ajax.request({
		//	url : PSI.Const.BASE_URL + "Home/Employee/listEmployee",
		//	method : "POST",
		//	params : me.getQueryParam(),
		//	callback : function(options, success, response) {
		//		var store = grid.getStore();
		//		store.removeAll();
		//		if (success) {
		//			var data = Ext.JSON.decode(response.responseText);
		//			store.add(data["employeeList"]);
		//			if (id) {
		//				var r = store.findExact("id", id);
		//				if (r != -1) {
		//					grid.getSelectionModel().select(r);
		//				}
		//			} else {
		//				grid.getSelectionModel().select(0);
		//			}
		//		}
		//		el.unmask();
		//	}
		//});
	},
	getQueryParam : function() {
		var me = this;

		var result = { };

		var qq = Ext.getCmp("editQueryQQ").getValue();
		if (qq) {
			result.qq = qq;
		}

		var name = Ext.getCmp("editQueryName").getValue();
		if (name) {
			result.name = name;
		}

		var phone = Ext.getCmp("editQueryPhone").getValue();
		if (phone) {
			result.phone = phone;
		}
		return result;
	},

	/**
	 * 新增业务员
	 */
	onAddEmployee : function() {
		var form = Ext.create("PSI.Employee.EmployeeEditForm", {
			parentForm : this
		});

		form.show();
	},

	/**
	 * 编辑业务员
	 */
	onEditEmployee : function() {
		var me = this;
		if(me.getPEditEmployee() == "0"){
			if (item == null || item.length != 1) {
				PSI.MsgBox.showInfo("没有编辑权限");
				return;
			}
		}
		var item = this.employeeGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要编辑的业务员");
			return;
		}

		var employee = item[0];
		var form = Ext.create("PSI.Employee.EmployeeEditForm", {
			parentForm : this,
			entity : employee
		});

		form.show();
	},

	/**
	 * 删除业务员
	 */
	onDeleteEmployee : function() {
		var me = this;
		var item = me.employeeGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要删除的业务员");
			return;
		}

		var employee = item[0];

		var store = me.employeeGrid.getStore();
		var index = store.findExact("id", employee.get("id"));
		index--;
		var preItem = store.getAt(index);
		if (preItem) {
			me.__lastId = preItem.get("id");
		}

		var info = "请确认是否删除业务员: <span style='color:red'>" + employee.get("name")
			+ " " + employee.get("code") + "</span>";

		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url : PSI.Const.BASE_URL
				+ "Home/Employee/deleteEmployee",
				method : "POST",
				params : {
					id : employee.get("id")
				},
				callback : function(options, success, response) {
					el.unmask();
					if (success) {
						var data = Ext.JSON
							.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.tip("成功完成删除操作");
							me.refreshEmployeeGrid();
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
	 * 导入业务员信息
	 */
	onImportEmployee : function() {
		//var form = Ext.create("PSI.Employee.EmployeeImportForm", {
		//	parentForm : this
		//});
        //
		//form.show();
	},

	/**
	 * 导出业务员信息
	 */
	onEportEmployee : function() {
		//var form = Ext.create("PSI.Employee.EmployeeImportForm", {
		//	parentForm : this
		//});
        //
		//form.show();
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
			this.onQuery();
		}
	},


	/**
	 * 查询
	 */
	onQuery : function() {
		var me = this;
		me.refreshEmployeeGrid();
	},

	gotoEmployeeGridRecord : function(id) {
		var me = this;
		var grid = me.employeeGrid;
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


	/**
	 * 清除查询条件
	 */
	onClearQuery : function() {
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


	//导入业务员信息
	onImportEmployees :function(){

		var form = Ext.create("PSI.Employee.EmployeeImportForm", {
			parentForm : this
		});
		form.show();
	},
	//导出业务员信息
	onExportEmployees : function () {
		var url = PSI.Const.BASE_URL + "Home/Employee/exportEmployeeInfo";
		window.open(url);
	}

});