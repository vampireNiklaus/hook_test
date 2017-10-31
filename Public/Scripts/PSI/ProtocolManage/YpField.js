/**
 * Created by RCG on 2016/4/29 0029.
 * 药品--自定义字段
 */
Ext.define("PSI.Yp.YpField", {
    extend : "Ext.form.field.Trigger",
    alias : "widget.ypfield",

    /**
     * 初始化组件
     */
    initComponent : function() {
        var me = this;
        me.__idValue = null;

        me.enableKeyEvents = true;

        me.callParent(arguments);

        me.on("keydown", function(field, e) {
            if (e.getKey() == e.BACKSPACE) {
                field.setValue(null);
                me.setIdValue(null);
                e.preventDefault();
                return false;
            }

            if (e.getKey() !== e.ENTER) {
                this.onTriggerClick(e);
            }
        });
    },

    onTriggerClick : function(e) {
        var modelName = "PSIRegionModel_Field";
        Ext.define(modelName, {
            extend : "Ext.data.Model",
            fields : ["id","region_name", "parent_id", "region_type","cnt", "leaf","children"]
        });

        var orgStore = Ext.create("Ext.data.TreeStore", {
            model : modelName,
            proxy : {
                type : "ajax",
                actionMethods : {
                    read : "POST"
                },
                url : PSI.Const.BASE_URL
                + "Home/Hospital/allRegions"
            }
        });

        var orgTree = Ext.create("Ext.tree.Panel", {
            store : orgStore,
            rootVisible : false,
            useArrows : true,
            viewConfig : {
                loadMask : true
            },
            columns : {
                defaults : {
                    flex : 1,
                    sortable : false,
                    menuDisabled : false,
                    draggable : false
                },
                items : [{
                    xtype : "treecolumn",
                    text : "区域",
                    dataIndex : "region_name",
                    width : 300
                }]
            }
        });
        orgTree.on("itemdblclick", this.onOK, this);
        this.tree = orgTree;

        var wnd = Ext.create("Ext.window.Window", {
            title : "选择区域划分",
            modal : true,
            width : 400,
            height : 300,
            layout : "fit",
            items : [orgTree],
            buttons : [{
                text : "确定",
                handler : this.onOK,
                scope : this
            }, {
                text : "取消",
                handler : function() {
                    wnd.close();
                }
            }]
        });
        this.wnd = wnd;
        wnd.show();
    },

    onOK : function() {
        var me = this;

        var tree = me.tree;
        var item = tree.getSelectionModel().getSelection();

        if (item === null || item.length !== 1) {
            PSI.MsgBox.showInfo("没有选择区域");

            return;
        }

        var data = item[0];
        me.setIdValue(data.get("id"));
        me.setValue(data.get("region_name"));
        me.wnd.close();
        me.focus();
    },

    setIdValue : function(id) {
        this.__idValue = id;
    },

    getIdValue : function() {
        return this.__idValue;
    }
});
