/**
 *医院多选field - 主界面
 *
 * @author Baoyu Li
 */
Ext.define("PSI.Hospital.HospitalMultiSelectPanel", {
	extend : "Ext.panel.Panel",
	alias : "widget.psi_hospital_multiSelectPanel",

	config : {
		pAddCategory : null,
		pEditCategory : null,
		pDeleteCategory : null,
		pAddGoods : null,
		pEditGoods : null,
		pDeleteGoods : null,
		pImportGoods : null,
		pGoodsSI : null
	},

	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;

		var modelName = "PSIHospital";
		Ext.define(modelName, {
			extend : "Ext.data.Model",
			fields : ["id", "hospital_code", "hospital_name", "region_id", "hospital_type",
				"pym", "note", "manager"]
		});

		var store = Ext.create("Ext.data.Store", {
			autoLoad : false,
			model : modelName,
			groupField:["hospital_code", "hospital_name", "region_id", "hospital_type",
				"pym", "note", "manager"],
			data : [],
			pageSize : 20,
			proxy : {
				type : "ajax",
				actionMethods : {
					read : "POST"
				},
				url : PSI.Const.BASE_URL + "Home/Hospital/hospitalList",
				reader : {
					root : 'hospitalList',
					totalProperty : 'totalCount'
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
		var sm = Ext.create('Ext.selection.CheckboxModel',
			          {
						  injectCheckbox:1,//checkbox位于哪一列，默认值为0
						//mode:'single',//multi,simple,single；默认为多选multi
						//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
						//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
						//enableKeyNav:false
					  });
		var HospitalGrid = Ext.create("Ext.grid.Panel", {
			viewConfig : {
				enableTextSelection : true
			},
			title : "医院列表",
			selModel: sm,
			//width: 600,
			//height:600,
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
			columnLines : true,
			columns : [Ext.create("Ext.grid.RowNumberer", {
				text : "序号",
				width : 30
			}), {
				header : "医院名称",
				dataIndex : "hospital_name",
				menuDisabled : false,
				sortable : false
			}, {
				header : "医院类型",
				dataIndex : "hospital_type",
				menuDisabled : false,
				sortable : false,
				width : 60
			},{
				header : "备注",
				dataIndex : "note",
				menuDisabled : false,
				sortable : false,
			}, {
				header : "管理员",
				dataIndex : "manager",
				menuDisabled : false,
				sortable : false
			}],
			store : store,
			listeners : {
			}
		});

		me.HospitalGrid = HospitalGrid;

		Ext.apply(me, {
			border : 0,
			layout : "border",
			items : [ {
				region : "north",
				border : 0,
				height : 50,
				layout : {
					type : "table",
					columns : 2
				},
				items : [{
					id : "quickSearchHospital",
					labelWidth : 100,
					labelAlign : "right",
					labelSeparator : "",
					fieldLabel : "医院名称",
					margin : "5, 0, 0, 0",
					xtype : "textfield",
					width:300,
					listeners : {
						specialkey : {
							fn : me.onQueryEditSpecialKey,
							scope : me
						}
					}
				},{
					xtype : "button",
					text : "查询",
					width : 100,
					iconCls : "PSI-button-refresh",
					margin : "5, 0, 0, 20",
					handler : me.onSearchHospital,
					scope : me
				}]
			},{
				region: "center",
				xtype: "panel",
				layout: "border",
				border: 0,
				items: [{
					region: "center",
					layout: "fit",
					border: 0,
					items: [HospitalGrid]
				},
				{
					xtype : "panel",
					region : "west",
					layout : "fit",
					width : 200,
					split : true,
					collapsible : true,
					border : 0,
					items : [me.getRegionGrid()]
				}]
			}]
		});

		me.callParent(arguments);

		me.queryTotalHospitalCount();

		me.__queryEditNameList = ["editQueryName",
			"editQueryType"];
	},

	onSearchHospital : function() {
		var me = this;
		me.mask(PSI.Const.LOADING);
		var editName = Ext.getCmp("quickSearchHospital");
		var store = me.HospitalGrid.getStore();
		Ext.Ajax.request({
			url : PSI.Const.BASE_URL + "Home/Hospital/queryData",
			params : {
				queryKey : editName.getValue()
			},
			method : "POST",
			callback : function(opt, success, response) {
				store.removeAll();
				if (success) {
					var data = Ext.JSON
						.decode(response.responseText);
					store.add(data);
					if (data.length > 0) {
						me.HospitalGrid.getSelectionModel().select(0);
						editName.focus();
					}
				} else {
					PSI.MsgBox.showInfo("网络错误");
				}
				me.unmask();
			},
			scope : this
		});
	},
	gotoHospitalGridRecord: function(){
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
	refreshRegionCount : function(){
		var me = this;
		var item = me.getRegionGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			return;
		}
	},

	getQueryParam : function() {
		var me = this;
		var item = me.getRegionGrid().getSelectionModel().getSelection();
		var region_id;
		if (item == null || item.length != 1) {
			region_id = null;
		} else {
			region_id = item[0].get("id");
		}
		var result = {
			region_id : region_id
		};

		var page = me.HospitalGrid.currentPage;
		if(page){
			result.page = page;
		}
		var limit = me.HospitalGrid.limit
		return result;
	},

	/**
	 * 新增Hospital
	 */
	onAddHospital : function() {
		if (this.getRegionGrid().getStore().getCount() == 0) {
			PSI.MsgBox.showInfo("没有选择区域，请先选择区域");
			return;
		}
		var form = Ext.create("PSI.Hospital.HospitalEditForm", {
			parentForm : this
		});

		form.show();
	},


	/**
	 * 删除医院
	 */
	onDeleteHospital : function() {
		var me = this;
		var item = me.HospitalGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
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

		var info = "请确认是否删除医院: <span style='color:red'>" + hospital.get("name")
			+ " " + hospital.get("spec") + "</span>";

		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url : PSI.Const.BASE_URL
				+ "Home/Goods/deleteHospital",
				method : "POST",
				params : {
					id : hospital.get("id")
				},
				callback : function(options, success, response) {
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

	/**
	 * 导入医院信息
	 */
	onImportHospital : function() {
		//var form = Ext.create("PSI.Goods.GoodsImportForm", {
		//	parentForm : this
		//});
        //
		//form.show();
	},

	/**
	 * 导出医院信息
	 */
	onEportHospital : function() {
		//var form = Ext.create("PSI.Goods.GoodsImportForm", {
		//	parentForm : this
		//});
        //
		//form.show();
	},

	onQueryEditSpecialKey : function(field, e) {
		if (e.getKey() === e.ENTER) {
			var me = this;
			var id = field.getId();
			if(id=="quickSearchHospital"){
				me.onSearchHospital();
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
		me.HospitalGrid.getStore().removeAll();
		me.queryTotalGoodsCount();

		me.freshHospitalGrid();
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


	/**
	 * 刷新医院Grid
	 */
	freshHospitalGrid : function(id) {
		var me = this;
		var grid = me.HospitalGrid;
		var el = grid.getEl() || Ext.getBody();
		el.mask(PSI.Const.LOADING);
		Ext.Ajax.request({
			url : PSI.Const.BASE_URL + "Home/Hospital/hospitalList",
			method : "POST",
			params : me.getQueryParam(),
			callback : function(options, success, response) {
				var store = grid.getStore();
				store.removeAll();
				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					store.add(data["hospitalList"]);
					if (id) {
						var r = store.findExact("id", id);
						if (r != -1) {
							grid.getSelectionModel().select(r);
						}
					} else {
						// grid.getSelectionModel().select(0);
					}
				}
				el.unmask();
			}
		});
	},

	/**
	 * 刷新区域Grid
	 */
	freshRegionGrid : function() {
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
	
	getRegionGrid : function (){
		var me = this;
		if (me.__regionGrid) {
			return me.__regionGrid;
		}

		var modelName = "PSIRegionTree";
		Ext.define(modelName, {
			extend : "Ext.data.Model",
			fields : ["id","region_name", "parent_id", "region_type","cnt", "leaf","children"]
		});

		var store = Ext.create("Ext.data.TreeStore", {
			model : modelName,
			proxy : {
				type : "ajax",
				actionMethods : {
					read : "POST"
				},
				url : PSI.Const.BASE_URL + "Home/Hospital/allRegions"
			},
			listeners : {
				beforeload : {
					fn : function() {
						store.proxy.extraParams = me.getQueryParamForRegion();
					},
					scope : me
				}
			}

		});

		store.on("load", me.onRegionTreeStoreLoad, me);

		me.__regionGrid = Ext.create("Ext.tree.Panel", {
			title : "区域划分",
			//width: 200,
			//height:600,
			store : store,
			rootVisible : false,
			useArrows : true,
			viewConfig : {
				loadMask : true
			},
			bbar : [{
				id : "fieldTotalHospitalCount",
				xtype : "displayfield",
				value : "共有医院数量"
			}],
			columns : {
				defaults : {
					sortable : false,
					menuDisabled : false,
					draggable : false
				},
				items : [{
					xtype : "treecolumn",
					text : "区域",
					dataIndex : "region_name",
					width : 120
				},{
					text : "医院个数",
					dataIndex : "cnt",
					align : "left",
					width : 80,
					renderer : function(value) {
						return value == 0 ? "" : value;
					}
				}]
			},
			listeners : {
				select : {
					fn : function(rowModel, record) {
						me.onRegionGridNodeSelect(record);
					},
					scope : me
				}
			}
		});

		me.regionGrid = me.__regionGrid;

		return me.__regionGrid;
	},

	onRegionTreeStoreLoad: function () {
		
	},
	onRegionGridNodeSelect: function (record) {
		if(!record){
			return;
		}
		this.onRegionGridSelect();
	},

	onRegionGridSelect:function(){
		var me = this;
		me.HospitalGrid.getStore().currentPage = 1;
		me.freshHospitalGrid();
	},
	queryTotalHospitalCount : function() {
		//var me = this;
		//Ext.Ajax.request({
		//	url : PSI.Const.BASE_URL + "Home/Hospital/getTotalHospitalCount",
		//	method : "POST",
		//	params : me.getQueryParamForRegion(),
		//	callback : function(options, success, response) {
        //
		//		if (success) {
		//			var data = Ext.JSON.decode(response.responseText);
		//			Ext.getCmp("fieldTotalHospitalCount").setValue("共有医院"
		//				+ data.cnt + "家");
		//		}
		//	}
		//});
	},
	getQueryParamForRegion : function(){
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