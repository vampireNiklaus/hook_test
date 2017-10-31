/**
 * 销售日报表(按业务员汇总)
 */
Ext.define("PSI.YeWuYuan.SellReportForm", {
    extend: "Ext.panel.Panel",

    border: 0,

    layout: "border",


    __mainGrid:null,//aggrid 句柄

    initComponent: function () {
        var me = this;

        Ext.apply(me, {
            tbar: [{
                text: "关闭",
                iconCls: "PSI-button-exit",
                handler: function () {
                    location.replace(PSI.Const.BASE_URL);
                }
            }, {
                xtype: "button",
                text: "导出到excel",
                width: 100,
                margin: "5, 0, 0, 10",
                iconCls: "PSI-button-excelexport",
                //handler : me.onExportGrid2Excel(store,"报表/销售报表/销售总表",me.__mainGrid),
                handler: me.onExportGrid2Excel4Main,
                scope: me
            }],
            items: [{
                region: "north",
                height: 60,
                border: 0,
                title: "查询条件",
                collapsible: true,
                layout: {
                    type: "table",
                    columns: 4
                },
                items: [{
                    id: "editQueryDate",
                    xtype: 'monthfield',
                    margin: "5, 0, 0, 0",
                    format: "Y",
                    labelAlign: "right",
                    labelSeparator: "",
                    width: 200,
                    fieldLabel: "选择年份",
                    value: new Date()
                }, {
                    id: "editQueryType",
                    labelWidth: 60,
                    labelAlign: "right",
                    labelSeparator: "",
                    fieldLabel: "身份",
                    margin: "5, 0, 0, 0",
                    valueField: "name",
                    displayField: "name",
                    xtype: "combo",
                    store: new Ext.data.ArrayStore({
                        fields: [ 'name'],
                        data: [[ '全部'],[ '招商经理'],[ '合作伙伴'],[ '业务员']]
                    }),
                    allowBlank: true,
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
                        margin: "5 0 0 10",
                        iconCls: "PSI-button-refresh",
                        handler: me.onQuery,
                        scope: me
                    }, {
                        xtype: "button",
                        text: "重置查询条件",
                        width: 100,
                        margin: "5, 0, 0, 10",
                        handler: me.onClearQuery,
                        scope: me
                    }]
                }]
            }, {

                region: "center",
                layout: "border",
                border: 0,
                items: [{
                    region: "center",
                    layout: "fit",
                    border: 0,
                    items: [me.getMainGrid()]
                }]
            }]
        });

        me.callParent(arguments);
        // me.initDocReady(me.getMainGrid);
        // me.getMainGrid();

        me.store.load();
    },

    getMainGrid: function () {
        var me = this;
        if (me.__mainGrid) {
            return me.__mainGrid;
        }

        var modelName = "PSIYeWuYuanSellReport";
        Ext.define(modelName, {
            extend: "Ext.data.Model",
            fields: ["id", "employee_des", "employee_profit", "drug_name", "drug_guige", "drug_manufacture",
                "hospital_name", "01_month", "02_month", "03_month", "04_month",
                "05_month", "06_month", "07_month", "08_month", "09_month", "10_month",
                "11_month", "12_month",]
        });
        me.store = Ext.create("Ext.data.Store", {
            autoLoad: false,
            model: modelName,
            data: [],
            pageSize: 20,
            proxy: {
                type: "ajax",
                actionMethods: {
                    read: "POST"
                },
                url: PSI.Const.BASE_URL + "Home/YeWuYuan/sellReportQueryData",
                reader: {
                    root: 'all_data',
                    totalProperty: 'totalCount'
                }
            }
        });
        me.store.on("beforeload", function () {
            me.store.proxy.extraParams = me.getQueryParam();
        });

        me.__mainGrid = Ext.create("Ext.grid.Panel", {
            viewConfig: {
                enableTextSelection: true
            },
            //forceFit:true,
            autoScroll: true,
            border: 0,
            columnLines: true,
            features: [
                Ext.create('Ext.grid.feature.Grouping',
                    {
                        groupByText: '用身份分组',
                        showGroupsText: '显示分组',
                        groupHeaderTpl: '身份: {employee_des} ({rows.length})', //分组显示的模板
                        startCollapsed: false //设置初始分组是不是收起
                    }),
                {
                    ftype: 'summary'
                }
            ],
            columns: [{
                xtype: "rownumberer",
                width: 40
            }, {
                header: "身份",
                dataIndex: "employee_des",
                menuDisabled: false,
                sortable: true,
                width: 65,
                summaryRenderer: function (value) {
                    return "合计"
                }
            }, {
                header: "推广费用",
                dataIndex: "employee_profit",
                menuDisabled: false,
                sortable: true,
                width: 50
            }, {
                header: "药品",
                dataIndex: "drug_name",
                menuDisabled: false,
                sortable: true,
                width: 80
            }, {
                header: "规格",
                dataIndex: "drug_guige",
                menuDisabled: false,
                sortable: false,
                width: 90
            }, {
                header: "药品生产企业",
                dataIndex: "drug_manufacture",
                menuDisabled: false,
                sortable: true,
                width: 200
            }, {
                header: "销售医院",
                dataIndex: "hospital_name",
                menuDisabled: false,
                sortable: true,
                width: 350
            }, {
                header: "1月销量",
                dataIndex: "01_month",
                menuDisabled: false,
                sortable: false,
                width: 55,
                summaryType: 'sum',
            }, {
                header: "2月销量",
                dataIndex: "02_month",
                menuDisabled: false,
                sortable: false,
                width: 55,
                summaryType: 'sum',
            }, {
                header: "3月销量",
                dataIndex: "03_month",
                menuDisabled: false,
                sortable: false,
                width: 55,
                summaryType: 'sum',
            }, {
                header: "4月销量",
                dataIndex: "04_month",
                menuDisabled: false,
                sortable: false,
                width: 55,
                summaryType: 'sum',
            }, {
                header: "5月销量",
                dataIndex: "05_month",
                menuDisabled: false,
                sortable: false,
                width: 55,
                summaryType: 'sum',
            }, {
                header: "6月销量",
                dataIndex: "06_month",
                menuDisabled: false,
                sortable: false,
                width: 55,
                summaryType: 'sum',
            }, {
                header: "7月销量",
                dataIndex: "07_month",
                menuDisabled: false,
                sortable: false,
                width: 55,
                summaryType: 'sum',
            }, {
                header: "8月销量",
                dataIndex: "08_month",
                menuDisabled: false,
                sortable: false,
                width: 55,
                summaryType: 'sum',
            }, {
                header: "9月销量",
                dataIndex: "09_month",
                menuDisabled: false,
                sortable: false,
                width: 55,
                summaryType: 'sum',
            }, {
                header: "10月销量",
                dataIndex: "10_month",
                menuDisabled: false,
                sortable: false,
                width: 55,
                summaryType: 'sum',
            }, {
                header: "11月销量",
                dataIndex: "11_month",
                menuDisabled: false,
                sortable: false,
                width: 55,
                summaryType: 'sum',
            }, {
                header: "12月销量",
                dataIndex: "12_month",
                menuDisabled: false,
                sortable: false,
                width: 55,
                summaryType: 'sum',
            }],
            store: me.store,
            //tbar : [{
            //	id : "pagingToobar",
            //	xtype : "pagingtoolbar",
            //	border : 0,
            //	store : me.store
            //}, "-", {
            //	xtype : "displayfield",
            //	value : "每页显示"
            //}, {
            //	id : "comboCountPerPage",
            //	xtype : "combobox",
            //	editable : false,
            //	width : 60,
            //	store : Ext.create("Ext.data.ArrayStore", {
            //		fields : ["text"],
            //		data : [["20"], ["50"], ["100"],
            //				["300"], ["1000"]]
            //	}),
            //	value : 20,
            //	listeners : {
            //		change : {
            //			fn : function() {
            //				me.store.pageSize = Ext
            //						.getCmp("comboCountPerPage")
            //						.getValue();
            //				me.store.currentPage = 1;
            //				Ext.getCmp("pagingToobar")
            //						.doRefresh();
            //			},
            //			scope : me
            //		}
            //	}
            //}, {
            //	xtype : "displayfield",
            //	value : "条记录"
            //}],
            listeners: {}
        });

        return me.__mainGrid;
    },
    getMainGrid1: function () {
        var me = this;
        var columnDefs = [
            {headerName: "Make", field: "make"},
            {headerName: "Model", field: "model"},
            {headerName: "Price", field: "price"}
        ];

        // specify the data
        var rowData = [
            {make: "Toyota", model: "Celica", price: 35000},
            {make: "Ford", model: "Mondeo", price: 32000},
            {make: "Porsche", model: "Boxter", price: 72000}
        ];

        // let the grid know which columns and what data to use
        var gridOptions = {
            columnDefs: columnDefs,
            rowData: rowData,
            onGridReady: function () {
                gridOptions.api.sizeColumnsToFit();
            }
        };
        var eGridDiv = Ext.getCmp('myGrid-body');
        console.log(document,eGridDiv,gridOptions);
        // create the grid passing in the div to use together with the columns & data we want to use
        me.__mainGrid =  new agGrid.Grid(eGridDiv, gridOptions);
    },

    initDocReady:function (fireDocReady){

        var COMPLETE = "complete";

        setInterval(function(){
            if(document.readyState == COMPLETE) {
                fireDocReady();
            }
        }, 100);
    },


    onQuery: function () {
        this.refreshMainGrid();
    },


    onClearQuery: function () {
        var me = this;

        Ext.getCmp("editQueryDate").setValue(new Date().getFullYear());

        me.onQuery();
    },

    getQueryParam: function () {
        var me = this;

        var result = {};

        var dt = Ext.getCmp("editQueryDate").getValue();
        if (dt) {
            result.date = Ext.Date.format(dt, "Y");
        }

        var type = Ext.getCmp("editQueryType").getValue();
        if (type !="全部") {
            result.employee_des = type;
        }

        return result;
    },

    refreshMainGrid: function (id) {
        var me = this;
        var store = me.__mainGrid.getStore();
        store.removeAll();
        store.load();
    },
    onExportGrid2Excel4Main: function () {
        var me = this;
        var config = {
            store: me.__mainGrid.getStore(),
            title: "销售报表/销售条目"
        };
        //var tab=tabPanel.getActiveTab();//当前活动状态的Panel
        ExportExcel(me.__mainGrid, config);//调用导出函数
    },
});