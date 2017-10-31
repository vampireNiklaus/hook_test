/**
 *医院 - 主界面
 *
 * @author Baoyu Li
 */
Ext.define("PSI.Hospital.MainForm", {
	extend: "Ext.panel.Panel",

	config: {
		pAddHospital: null,
		pEditHospital: null,
		pDeleteHospital: null,
		pImportHospital: null,
		pExportHospital: null,
	},

	/**
	 * 初始化组件
	 */
	initComponent: function() {
		var me = this;

		var modelName = "PSIHospital";
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
					//totalProperty : 'totalCount'
				}
			}
		});

		store.on("beforeload", function() {
			store.proxy.extraParams = me.getQueryParam();
		});
		store.on("load", function(e, records, successful) {
			if (successful) {
				me.refreshRegionCount();
				me.gotoHospitalGridRecord(me.__lastId);
			}
		});

		var HospitalGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			title: "医院列表",
			columnLines: true,
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				width: 30
			}), {
				header: "医院编码",
				dataIndex: "hospital_code",
				menuDisabled: false,
				sortable: false
			}, {
				header: "医院名称",
				dataIndex: "hospital_name",
				menuDisabled: false,
				sortable: false
			}, {
				header: "区域编号",
				dataIndex: "region_id",
				menuDisabled: false,
				sortable: false
			}, {
				header: "医院类型",
				dataIndex: "hospital_type",
				menuDisabled: false,
				sortable: false,
				width: 60
			}, {
				header: "拼音码",
				dataIndex: "pym",
				menuDisabled: false,
				sortable: false
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
			}],
			store: store,
			listeners: {
				itemdblclick: {
					fn: me.onEditHospital,
					scope: me
				},
			}
		});

		me.HospitalGrid = HospitalGrid;

		Ext.apply(me, {
			border: 0,
			layout: "border",
			tbar: [{
				text: "新增医院",
				disabled: me.getPAddHospital() == "0",
				iconCls: "PSI-button-add",
				handler: me.onAddHospital,
				scope: me
			}, {
				text: "编辑医院",
				disabled: me.getPEditHospital() == "0",
				iconCls: "PSI-button-edit",
				handler: me.onEditHospital,
				scope: me
			}, {
				text: "删除医院",
				disabled: me.getPDeleteHospital() == "0",
				iconCls: "PSI-button-delete",
				handler: me.onDeleteHospital,
				scope: me
			}, "-", {
				text: "导入医院列表",
				disabled: me.getPImportHospital() == "0",
				iconCls: "PSI-button-excelimport",
				handler: me.onImportHospitals,
				scope: me
			}, "-", {
				text: "导出医院信息",
				disabled: me.getPExportHospital() == "0",
				iconCls: "PSI-button-excelexport",
				handler: me.onExportHospitals,
				scope: me
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
				border: 0,
				height: 100,
				title: "查询条件",
				collapsible: true,
				layout: {
					type: "table",
					columns: 5
				},
				items: [{
					id: "editQueryName",
					labelWidth: 60,
					labelAlign: "right",
					labelSeparator: "",
					fieldLabel: "医院名称",
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
					fieldLabel: "医院等级",
					margin: "5, 0, 0, 0",
					valueField: "name",
					displayField: "name",
					xtype: "combo",
					store: new Ext.data.ArrayStore({
						fields: ['id', 'name'],
						data: [
							["1", '二级以上'],
							["2", '卫生院'],
							["3", '民营医院'],
							["4", '药店'],
							["5", '诊所'],
							["6", '其他医疗单位'],
						]
					}),
					allowBlank: false,
					blankText: "没有选择医院等级",
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
					items: [HospitalGrid]
				}, {
					xtype: "panel",
					region: "west",
					layout: "fit",
					width: 430,
					split: true,
					collapsible: true,
					border: 0,
					items: [me.getRegionGrid()]
				}]
			}]
		});

		me.callParent(arguments);

		me.queryTotalHospitalCount();

		me.__queryEditNameList = ["editQueryName",
			"editQueryType"
		];
	},

	/**
	 * 导入医院信息
	 */
	onImportHospitals: function() {
        Ext.Ajax.request({
            url: PSI.Const.BASE_URL + "Home/Hospital/getHospitalTempCount",
            method: "POST",

            callback: function(options, success, response) {

                if (success) {
                    var data = Ext.JSON.decode(response.responseText);
                    if (data.cnt > 0) {
                        PSI.MsgBox.confirm("缓存中还存有" + data.cnt + "条数据，请确认是否删除?", function() {
							Ext.Ajax.request({
                                url: PSI.Const.BASE_URL + "Home/Hospital/deleteTemp",
                                method: "POST",
                                callback: function(options, success, response) {

                                    if(success) {
                                        PSI.MsgBox.tip("删除成功！");
                                        var form = Ext.create("PSI.Hospital.HospitalImportForm", {
                                            parentForm: this
                                        });
                                        form.show();
									}
                                }

							})
						});
                    }else {
                        var form = Ext.create("PSI.Hospital.HospitalImportForm", {
                            parentForm: this
                        });
                        form.show();
					}


                } else {
                    PSI.MsgBox.showInfo("网络错误", function() {
                        window.location.reload();
                    });
                }
            }

		});
	},

	//导出医院信息

	onExportHospitals: function() {
		var grid = this.HospitalGrid;
		var config = {
			store: grid.getStore(),
			title: "医院信息"
		};
		ExportExcel(grid, config); //调用导出函数
	},

	gotoHospitalGridRecord: function(id) {
		var me = this;
		var grid = me.HospitalGrid;
		var store = grid.getStore();
		if (id) {
			var r = store.findExact("id", id);
			if (r != -1) {
				grid.getSelectionModel().select(r);
			} else {
				grid.getSelectionModel().select(0);
			}
		}
	},
	refreshRegionCount: function() {
		var me = this;
		var item = me.getRegionGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			return;
		}
	},

	getQueryParam: function() {
		var me = this;
		var item = me.getRegionGrid().getSelectionModel().getSelection();
		var region_id;
		if (item == null || item.length != 1) {
			region_id = null;
		} else {
			region_id = item[0].get("id");
		}
		var result = {
			region_id: region_id
		};
		var hospital_name = Ext.getCmp("editQueryName").getValue();
		if (hospital_name) {
			result.hospital_name = hospital_name;
		}
		var hospital_type = Ext.getCmp("editQueryType").getValue();
		if (hospital_type) {
			result.hospital_type = hospital_type;
		}
		var page = me.HospitalGrid.currentPage;
		if (page) {
			result.page = page;
		}
		var limit = me.HospitalGrid.limit;
		return result;
	},

	/**
	 * 新增Hospital
	 */
	onAddHospital: function() {
		if (this.getRegionGrid().getStore().getCount() == 0) {
			PSI.MsgBox.showInfo("没有选择区域，请先选择区域");
			return;
		}
		var form = Ext.create("PSI.Hospital.HospitalEditForm", {
			parentForm: this
		});

		form.show();
	},

	/**
	 * 编辑Hospital
	 */
	onEditHospital: function() {
		var me = this;
		if (me.getPEditHospital() == "0") {
			return;
		}

		var item = this.getRegionGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择选择区域");
			return;
		}

		var region = item[0];

		var item = this.HospitalGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要编辑的医院");
			return;
		}

		var hospital = item[0];
		hospital.set("regionGrid", region.get("id"));
		var form = Ext.create("PSI.Hospital.HospitalEditForm", {
			parentForm: this,
			entity: hospital
		});

		form.show();
	},

	/**
	 * 删除医院
	 */
	onDeleteHospital: function() {
		var me = this;
		var item = me.HospitalGrid.getSelectionModel().getSelection();
		if (item === null || item.length !== 1) {
			PSI.MsgBox.showInfo("请选择要删除的医院");
			return;
		}

		var hospital = item[0];
		var store = me.HospitalGrid.getStore();
		var index = store.findExact("id", hospital.get("id"));
		index--;
		var preItem = store.getAt(index);
		if (preItem) {
			me.__lastId = preItem.get("id");
		}

		var info = "请确认是否删除医院: <span style='color:red'>" + hospital.get("hospital_name") + " " + hospital.get("hospital_type") + "</span>";

		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/Hospital/deleteHospital",
				method: "POST",
				params: {
					id: hospital.get("id")
				},
				callback: function(options, success, response) {
					el.unmask();

					if (success) {
						var data = Ext.JSON
							.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.tip("成功完成删除操作");
							me.freshHospitalGrid();
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
		me.HospitalGrid.getStore().removeAll();
		me.queryTotalHospitalCount();

		me.freshHospitalGrid();
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


	/**
	 * 刷新医院Grid
	 */
	freshHospitalGrid: function(id) {
		var me = this;
		var grid = me.HospitalGrid;
		var store = grid.getStore();
		store.removeAll();
		store.load();
		//var el = grid.getEl() || Ext.getBody();
		//el.mask(PSI.Const.LOADING);
		//Ext.Ajax.request({
		//	url : PSI.Const.BASE_URL + "Home/Hospital/hospitalList",
		//	method : "POST",
		//	params : me.getQueryParam(),
		//	callback : function(options, success, response) {
		//		var store = grid.getStore();
		//		store.removeAll();
		//		if (success) {
		//			var data = Ext.JSON.decode(response.responseText);
		//			store.add(data["hospitalList"]);
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

	/**
	 * 刷新区域Grid
	 */
	freshRegionGrid: function() {
		var me = this;
		var grid = me.regionGrid;
		var store = grid.getStore();
		store.load();

		// var el = grid.getEl() || Ext.getBody();
		// el.mask(PSI.Const.LOADING);
		// Ext.Ajax.request({
		// 	url : PSI.Const.BASE_URL + "Home/Hospital/allRegions",
		// 	method : "POST",
		// 	params : me.getQueryParam(),
		// 	callback : function(options, success, response) {
		// 		var store = grid.getStore();
		// 		store.removeAll();
		// 		if (success) {
		// 			var data = Ext.JSON.decode(response.responseText);
		// 			store.add(data);
		// 			// if (id) {
		// 			// 	var r = store.findExact("id", id);
		// 			// 	if (r != -1) {
		// 			// 		grid.getSelectionModel().select(r);
		// 			// 	}
		// 			// } else {
		// 			// 	grid.getSelectionModel().select(0);
		// 			// }
		// 		}
		// 		el.unmask();
		// 	}
		// });
	},

	getRegionGrid: function() {
		var me = this;
		if (me.__regionGrid) {
			return me.__regionGrid;
		}

		var modelName = "PSIRegionTree";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "region_name", "parent_id", "region_type", "hospital_count", "leaf", "children"]
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
					width: 300
				}, {
					text: "医院个数",
					dataIndex: "hospital_count",
					align: "right",
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

	onRegionTreeStoreLoad: function() {

	},
	onRegionGridNodeSelect: function(record) {
		if (!record) {
			return;
		}
		this.onRegionGridSelect();
	},

	onRegionGridSelect: function() {
		var me = this;
		me.HospitalGrid.getStore().currentPage = 1;
		me.freshHospitalGrid();
	},
	queryTotalHospitalCount: function() {
		var me = this;
		Ext.Ajax.request({
			url: PSI.Const.BASE_URL + "Home/Hospital/getTotalHospitalCount",
			method: "POST",
			params: me.getQueryParamForRegion(),
			callback: function(options, success, response) {

				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					Ext.getCmp("fieldTotalHospitalCount").setValue("共有医院" + data.cnt + "家");
				}
			}
		});
	},
	getQueryParamForRegion: function() {
		var me = this;
		var result = {};
		//未定义是什么鬼
		//var hospital_name = Ext.getCmp("editQueryName").getValue();
		//if (hospital_name) {
		//	result.hospital_name = hospital_name;
		//}
		//
		//var hospital_type = Ext.getCmp("editQueryType").getValue();
		//if (hospital_type) {
		//	result.hospital_type = hospital_type;
		//}
		return result;
	},

});