/**
 * 医院缓存
 */


Ext.define("PSI.Hospital.HospitalTempForm", {
	extend: "Ext.window.Window",

	config: {
		entity: null,
		parentForm: null
	},

	title: "医院缓存",
	width: 800,
	height: 800,
	modal: true,
	resizable: true,
	layout: "border",

	initComponent: function() {
		var me = this;
		var entity = me.getEntity();

        Ext.define("PSIHospitalTemp", {
            extend : "Ext.data.Model",
            fields : ["id","hospital_code", "hospital_name", "city", "country"]
        });

        var hospitalTempStore = Ext.create("Ext.data.Store", {
            model : "PSIHospitalTemp",
            autoLoad : false,
            data : [],
            pageSize : 20,
            proxy : {
                type: "ajax",
                actionMethods : {
                    read : "POST"
                },
                url : PSI.Const.BASE_URL + "Home/Hospital/getHospitalTempList",
                render: {
                    root: 'hospitalTemp',
                    totalProperty: 'totalCount'
                }
            }
        });

        var hospitalTempGrid = Ext.create("Ext.grid.Panel", {
            title : "医院缓存",
            padding : 5,
            selModel: {
                mode: "MULTI"
            },
            selType: "checkboxmodel",
            bbar: [{
                id: "pagingToolbarHospitalTemp",
                border: 0,
                xtype: "pagingtoolbar",
                store: hospitalTempStore
            }, "-", {
                xtype: "displayfield",
                value: "每页显示"
            }, {
                id: "comboCountPerPageHospitalTemp",
                xtype: "combobox",
                editable: false,
                width: 120,
                store: Ext.create("Ext.data.ArrayStore", {
                    fields: ["text"],
                    data: [
                        ["20"],
                        ["50"],
                        ["120"],
                        ["300"],
                        ["1200"]
                    ]
                }),
                value: 20,
                listeners: {
                    change: {
                        fn: function() {
                            hospitalTempStore.pageSize = Ext
                                .getCmp("comboCountPerPageHospitalTemp")
                                .getValue();
                            hospitalTempStore.currentPage = 1;
                            Ext.getCmp("pagingToolbarHospitalTemp")
                                .doRefresh();
                        },
                        scope: me
                    }
                }
            }, {
                xtype: "displayfield",
                value: "条记录"
            }],
            store : hospitalTempStore,
            columns : [Ext.create("Ext.grid.RowNumberer", {
                header : "序号",
                width : 30
            }), {
                header : "医院编码",
                dataIndex : "hospital_code",
                flex : 1
            }, {
                header : "医院名称",
                dataIndex : "hospital_name",
                flex : 2
            }, {
                header : "市",
                dataIndex : "city",
                flex : 1
            }, {
                header : "县",
                dataIndex : "country",
                flex : 1
            }],
            tbar : [{
                text : "保存医院",
                handler : me.onAddHospitalTemp,
                scope : me,
                iconCls : "PSI-button-add"
            }, "-", {
                text : "移除医院",
                handler : me.onRemoveHospitalTemp,
                scope : me,
                iconCls : "PSI-button-delete"
            }]
        });

        this.hospitalTempGrid = hospitalTempGrid;

        Ext.apply(me, {
            title: "医院缓存",
            modal: true,
            resizable: true,
            onEsc: Ext.emptyFn,
            maximized: true,
            width: 700,
            height: 600,
            layout: "border",
            defaultFocus: "editName",
            items: [{
                xtype: "panel",
                region: "north",
                layout: "fit",
                height: 0,
                border: 0,
                items: [{
                    id: "editForm",
                    xtype: "form",
                    layout: {
                        type: "table",
                        columns: 1
                    },
                    border: 0,
                    bodyPadding: 5,
                    defaultType: 'textfield',
                    fieldDefaults: {
                        labelWidth: 60,
                        labelAlign: "right",
                        labelSeparator: "",
                        msgTarget: 'side',
                        width: 670,
                        margin: "5"
                    },
                    items: [{
                        xtype: "hidden",
                        name: "user_id",
                        value: entity == null ? null : entity.id
                    }, {
                        id: "editHospitalAssignIdList",
                        xtype: "hidden",
                        name: "hospitalAssignIdList"
                    }, {
                        id: "editDataOrgList",
                        xtype: "hidden",
                        name: "dataOrgList"
                    }, {
                        id: "editDrugIdList",
                        xtype: "hidden",
                        name: "drugIdList"
                    }]
                }]
            }, {
                xtype: "tabpanel",
                region: "center",
                flex: 1,
                border: 0,
                layout: "border",
                items: [hospitalTempGrid]
            }],
            tbar: []
        });
        me.refreshHospitalTempGrid();
		me.callParent(arguments);
	},

    refreshHospitalTempGrid: function(currentPage) {
        var me = this;
        var store = me.hospitalTempGrid.getStore();
        if(currentPage) {
            store.currentPage = currentPage;
        }
        store.removeAll();
        store.load();
    },

	onAddHospitalTemp: function () {
	    var me = this;
		var items = this.hospitalTempGrid.getSelectionModel().getSelection();
        if (items === null || items.length === 0) {
            PSI.MsgBox.showInfo("请选择要添加的医院");
            return;
        }
		var tempHospitalList = [];

		for(var i = 0; i < items.length; i++) {
            tempHospitalList[i] = items[i].getData()["id"];
        }

        Ext.Ajax.request({
            url: PSI.Const.BASE_URL + "Home/Hospital/importTempToHospital",
            method: "POST",
            params: {
                "tempList": tempHospitalList.join()
            },
            callback: function(options, success, response) {

                if (success) {
                    PSI.MsgBox.tip("导入医院缓存成功");
                } else {
                    PSI.MsgBox.tip("导入医院缓存失败");
                }
                me.refreshHospitalTempGrid(1);

            }
        });


    },
    
    onRemoveHospitalTemp: function () {
	    var me = this;
        var items = this.hospitalTempGrid.getSelectionModel().getSelection();
        if (items === null || items.length === 0) {
            PSI.MsgBox.showInfo("请选择要删除的医院");
            return;
        }

        var tempHospitalList = [];

        for(var i = 0; i < items.length; i++) {
            tempHospitalList.push(items[i].getData()["id"]);
        }

        Ext.Ajax.request({
            url: PSI.Const.BASE_URL + "Home/Hospital/deleteTempToHospital",
            method: "POST",
            params: {
                "tempList": tempHospitalList.join()
            },
            callback: function(options, success, response) {

                if (success) {
                    PSI.MsgBox.tip("删除医院缓存成功");
                } else {
                    PSI.MsgBox.tip("删除医院缓存失败");
                }
                me.refreshHospitalTempGrid(1);
            }
        });

    }

});