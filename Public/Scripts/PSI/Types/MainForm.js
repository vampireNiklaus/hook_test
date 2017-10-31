/**
 * 资金条目 - 主界面
 *
 * @author Baoyu Li
 */
Ext.define("PSI.Types.MainForm", {
	extend : "Ext.panel.Panel",

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

		var modelName = "PSITypes";
		Ext.define(modelName, {
			extend : "Ext.data.Model",
			fields : ["id", "type", "name"]
		});

		var store = Ext.create("Ext.data.Store", {
			autoLoad : false,
			model : modelName,
			data : [],
			pageSize : 20,
			proxy : {
				type : "ajax",
				actionMethods : {
					read : "POST"
				},
				url : PSI.Const.BASE_URL + "Home/Types/listTypes",
				reader : {
					root : 'typesList',
					totalProperty : 'totalCount'
				}
			}
		});

		var typesGrid = Ext.create("Ext.grid.Panel", {
			viewConfig : {
				enableTextSelection : true
			},
			title : "收支方式与结算方式列表",
			columnLines : true,
			columns : [Ext.create("Ext.grid.RowNumberer", {
				text : "序号",
				width : 50
			}), {
				header : "ID",
				dataIndex : "id",
				menuDisabled : true,
				sortable : true,
				width : 100
			}, {
				header : "类型",
				dataIndex : "type",
				menuDisabled : true,
				sortable : true,
				width : 150
			}, {
				header : "名称",
				dataIndex : "name",
				menuDisabled : true,
				sortable : true,
				width : 200
			}],
			store : store,
			listeners : {
				itemdblclick : {
					fn : me.onEditTypes,
					scope : me
				},
			}
		});

		me.typesGrid = typesGrid;

		Ext.apply(me, {
			border : 0,
			layout : "border",
			tbar : [{
				text : "新增类别",
				disabled : me.getPAddCategory() == "0",
				iconCls : "PSI-button-add",
				handler : me.onAddTypes,
				scope : me
			},{
				text : "编辑类别",
				disabled : me.getPAddCategory() == "0",
				iconCls : "PSI-button-edit",
				handler : me.onEditTypes,
				scope : me
			},  {
				text : "删除类别",
				disabled : me.getPDeleteCategory() == "0",
				iconCls : "PSI-button-delete",
				handler : me.onDeleteTypes,
				scope : me
			}, "-", {
				text : "关闭",
				iconCls : "PSI-button-exit",
				handler : function() {
					location.replace(PSI.Const.BASE_URL);
				}
			}],
			items : [{
				region: "center",
				xtype: "panel",
				layout: "border",
				border: 0,
				items: [{
					region: "center",
					layout: "fit",
					border: 0,
					items: [typesGrid]
				}]
			}]
		});

		me.callParent(arguments);
		me.refreshTypesGrid();
	},

	refreshTypesGrid:function(id){
		var me = this;
		var grid = me.typesGrid;
		var el = grid.getEl() || Ext.getBody();
		el.mask(PSI.Const.LOADING);
		Ext.Ajax.request({
			url : PSI.Const.BASE_URL + "Home/Types/listTypes",
			method : "POST",
			callback : function(options, success, response) {
				var store = grid.getStore();
				store.removeAll();
				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					store.add(data["typesList"]);
					if (id) {
						var r = store.findExact("id", id);
						if (r != -1) {
							grid.getSelectionModel().select(r);
						}
					} else {
						grid.getSelectionModel().select(0);
					}
				}
				el.unmask();
			}
		});
	},

	/**
	 * 新增资金条目
	 */
	onAddTypes : function() {
		var form = Ext.create("PSI.Types.TypesEditForm", {
			parentForm : this
		});
		form.show();
	},

	/**
	 * 编辑资金条目
	 */
	onEditTypes : function() {
		var me = this;

		var item = this.typesGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要编辑的资金条目");
			return;
		}

		var types = item[0];
		var form = Ext.create("PSI.Types.TypesEditForm", {
			parentForm : this,
			entity : types
		});

		form.show();
	},

	/**
	 * 删除资金条目
	 */
	onDeleteTypes : function() {
		var me = this;
		var item = me.typesGrid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择要删除的资金条目");
			return;
		}

		var types = item[0];

		var store = me.typesGrid.getStore();
		var index = store.findExact("id", types.get("id"));
		index--;
		var preItem = store.getAt(index);
		if (preItem) {
			me.__lastId = preItem.get("id");
		}

		var info = "请确认是否删除资金条目: <span style='color:red'>" + types.get("name")
			+ " " + types.get("code") + "</span>";

		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url : PSI.Const.BASE_URL
				+ "Home/Types/deleteType",
				method : "POST",
				params : {
					id : types.get("id")
				},
				callback : function(options, success, response) {
					el.unmask();
					if (success) {
						var data = Ext.JSON
							.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.tip("成功完成删除操作");
							me.refreshTypesGrid();
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


});