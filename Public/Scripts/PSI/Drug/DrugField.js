/**
 * 药品自定义字段
 */
Ext.define("PSI.Drug.DrugField", {
    extend: "Ext.form.field.Trigger",
    alias: "widget.psi_drug_field",

    config: {
        callbackFunc: undefined,
        selfDrug: undefined,
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
        var modelName = "PSIDrugField";
        Ext.define(modelName, {
            extend: "Ext.data.Model",
            fields: ["id", "drug_code", "common_name", "goods_name", "jx", "guige", "manufacturer", "base_price",
                "tax_price", "kaipiao_price", 'jldw'
            ]
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
                header: "通用名",
                dataIndex: "common_name",
                menuDisabled: false,
                flex: 1
            }, {
                header: "规格",
                dataIndex: "guige",
                menuDisabled: false,
                flex: 1
            }, {
                header: "剂型",
                dataIndex: "jx",
                menuDisabled: false,
                flex: 1
            }, {
                header: "计量单位",
                dataIndex: "jldw",
                menuDisabled: false,
                flex: 1
            },{
                header: "生产企业",
                dataIndex: "manufacturer",
                menuDisabled: false
            }]
        });
        me.lookupGrid = lookupGrid;
        me.lookupGrid.on("itemdblclick", me.onOK, me);

        var wnd = Ext.create("Ext.window.Window", {
            title: "选择 - 药品",
            modal: true,
            width: 600,
            height: 400,
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
                        id: "__editSupplier",
                        xtype: "textfield",
                        fieldLabel: "搜索",
                        labelWidth: 40,
                        emptyText: '药品通用名、商品名或编号',
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

        var editName = Ext.getCmp("__editSupplier");
        editName.on("change", function() {
            var store = me.lookupGrid.getStore();
            Ext.Ajax.request({
                url: PSI.Const.BASE_URL + "Home/Drug/queryData",
                params: {
                    queryKey: editName.getValue(),
                    isSelf: me.getSelfDrug()
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
        me.setValue(data.common_name);
        me.focus();

        me.setIdValue(data.id);
        console.log(data);

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