/**
 * 配送公司自定义字段
 */
Ext.define("PSI.Deliver.DeliverField", {
	extend: "Ext.form.field.Trigger",
	alias: "widget.psi_deliver_field",

	config: {
		callbackFunc: undefined,
		queryCondition: undefined,
		parentCmp: undefined,
	},

	initComponent: function() {
		var me = this;

		me.__idValue = null;

		me.enableKeyEvents = true;

		me.callParent(arguments);

		me.on("keydown", function(field, e) {
			if (me.readOnly) {
				return;
			}

			if (e.getKey() == e.BACKSPACE) {
				field.setValue(null);
				me.setIdValue(null);
				e.preventDefault();
				return false;
			}

			if (e.getKey() != e.ENTER && !e.isSpecialKey(e.getKey())) {
				me.onTriggerClick(e);
			}
		});
	},

	onTriggerClick: function(e) {
		var me = this;
		var modelName = "PSIDeliverField";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "deliver_code", "deliver_name", 'deliver_id']
		});

		var store = Ext.create("Ext.data.Store", {
			model: modelName,
			autoLoad: false,
			data: []
		});
		var lookupGrid = Ext.create("Ext.grid.Panel", {
			columnLines: true,
			border: 0,
			store: store,
			columns: [{
				header: "编码",
				dataIndex: "deliver_code",
				menuDisabled: false
			}, {
				header: "配送公司",
				dataIndex: "deliver_name",
				menuDisabled: false,
				flex: 1
			}]
		});
		me.lookupGrid = lookupGrid;
		me.lookupGrid.on("itemdblclick", me.onOK, me);

		var wnd = Ext.create("Ext.window.Window", {
			title: "选择 - 配送公司",
			modal: true,
			width: 400,
			height: 300,
			layout: "border",
			items: [{
				region: "center",
				xtype: "panel",
				layout: "fit",
				border: 0,
				items: [lookupGrid]
			}, {
				xtype: "panel",
				region: "south",
				height: 40,
				layout: "fit",
				border: 0,
				items: [{
					xtype: "form",
					layout: "form",
					bodyPadding: 5,
					items: [{
						id: "__editDeliver",
						xtype: "textfield",
						fieldLabel: "搜索",
						labelWidth: 40,
						emptyText: '配送公司名称或其编号',
						labelAlign: "right",
						labelSeparator: ""
					}]
				}]
			}],
			buttons: [{
				text: "确定",
				handler: me.onOK,
				scope: me
			}, {
				text: "取消",
				handler: function() {
					wnd.close();
				}
			}]
		});

		wnd.on("close", function() {
			me.focus();
		});
		me.wnd = wnd;
		var queryConditionType = me.getQueryCondition() ? me.getQueryCondition().queryConditionType : null;
		var queryConditionKey = me.getQueryCondition() ? me.getQueryCondition().queryConditionKey : null;
		//var queryConditionType = me.getQueryCondition().queryConditionType;
		var editName = Ext.getCmp("__editDeliver");
		//var drug=Ext.getCmp("drug_id")&&Ext.getCmp("drug_id").getValue()?Ext.getCmp("drug_id").getValue():me.getDrugId();
		editName.on("change", function() {
			var store = me.lookupGrid.getStore();
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/Deliver/queryData",
				params: {
					queryKey: editName.getValue(),
					queryConditionType: queryConditionType,
					queryConditionKey: queryConditionKey
				},
				method: "POST",
				callback: function(opt, success, response) {
					store.removeAll();
					if (success) {
						var data = Ext.JSON
							.decode(response.responseText);
						store.add(data);
						if (data.length > 0) {
							// me.lookupGrid.getSelectionModel().select(0);
							// editName.focus();
						}
					} else {
						PSI.MsgBox.showInfo("网络错误");
					}
				},
				scope: this
			});

		}, me);

		editName.on("specialkey", function(field, e) {
			if (e.getKey() == e.ENTER) {
				me.onOK();
			} else if (e.getKey() == e.UP) {
				var m = me.lookupGrid.getSelectionModel();
				var store = me.lookupGrid.getStore();
				var index = 0;
				for (var i = 0; i < store.getCount(); i++) {
					if (m.isSelected(i)) {
						index = i;
					}
				}
				index--;
				if (index < 0) {
					index = 0;
				}
				m.select(index);
				e.preventDefault();
				editName.focus();
			} else if (e.getKey() == e.DOWN) {
				var m = me.lookupGrid.getSelectionModel();
				var store = me.lookupGrid.getStore();
				var index = 0;
				for (var i = 0; i < store.getCount(); i++) {
					if (m.isSelected(i)) {
						index = i;
					}
				}
				index++;
				if (index > store.getCount() - 1) {
					index = store.getCount() - 1;
				}
				m.select(index);
				e.preventDefault();
				editName.focus();
			}
		}, me);

		me.wnd.on("show", function() {
			editName.focus();
			editName.fireEvent("change");
		}, me);
		wnd.show();
	},

	// private
	onOK: function() {
		var me = this;
		var grid = me.lookupGrid;
		var item = grid.getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			return;
		}

		var data = item[0].getData();

		me.wnd.close();
		me.focus();
		me.setValue(data.deliver_name);
		me.focus();

		me.setIdValue(data.deliver_id);

		var func = me.getCallbackFunc();
		if (func) {
			func(me.getParentCmp(), data);
		}
	},

	setIdValue: function(id) {
		this.__idValue = id;
	},

	getIdValue: function() {
		return this.__idValue;
	},

	clearIdValue: function() {
		this.setValue(null);
		this.__idValue = null;
	}
});