/**
 * 销售报表
 */
var summaryFilters = ['01_month', '02_month', '03_month', '04_month', '05_month', '06_month', '07_month', '08_month', '09_month', '10_month', '11_month', '12_month', 'sum_year', 'gross_profit', 'saleroom'];
var records = {}
Ext.define("PSI.Report.SellReportMainForm", {
    extend: "Ext.panel.Panel",

    config: {
        pViewReportSellSummary: null,
        pViewReportSellByRegion: null,
        pViewReportSellHospitalBusiness: null,
        pViewReportSellUnSable: null,
        pViewReportSellProfit: null
    },
    border: 0,

    layout: "border",

    initComponent: function() {
        var me = this;
        var hc_panelTitle = "";
        var hc_chart_title = "";
        var hc_chart_subtitle = "";
        var hc_chart_yAxis_title = "";
        var hc_chart_xAxis_categories = "";
        var hc_chart_type = "";

        Ext.apply(me, {
            items: [{
                region: "center",
                layout: "border",
                border: 0,
                split: true,
                id:"main_tabpanel",
                xtype: "tabpanel",
                items: [
                    me.getPViewReportSellSummary() == "0" ? null : me.getMainGrid(),
                    me.getPViewReportSellByRegion() == "0" ? null : me.getRegionSortGrid(),
                    me.getPViewReportSellHospitalBusiness() == "0" ? null : me.getHospitalBusinessGrid(),
                    me.getPViewReportSellUnSable() == "0" ? null : me.getUnsalableGrid(),
                    me.getPViewReportSellProfit() == "0" ? null : me.getGrossProfitGrid(),
                ]
            }]
        });

        me.callParent(arguments);
        me.refreshMainGrid();
    },

    //公司销售总表
    getMainGrid: function() {
        var me = this;
        if (me.__mainGrid) {
            return me.__mainGrid;
        }

        var modelName = "PSIReportSaleSummary";
        Ext.define(modelName, {
            extend: "Ext.data.Model",
            fields: ["drug_name", "drug_guige", "drug_manufacture",
                "01_month", "02_month", "03_month", "04_month",
                "05_month", "06_month", "07_month", "08_month", "09_month", "10_month",
                "11_month", "12_month", "sum_year"
            ]
        });
        var store = Ext.create("Ext.data.Store", {
            autoLoad: false,
            model: modelName,
            data: [],
            pageSize: 20,
            proxy: {
                type: "ajax",
                actionMethods: {
                    read: "POST"
                },
                url: PSI.Const.BASE_URL + "Home/Report/sellReportSummaryQueryData",
                reader: {
                    root: 'allData',
                    totalProperty: 'totalCount'
                }
            }
        });
        store.on("beforeload", function() {
            store.proxy.extraParams = me.getQueryParam();
        });
        var sm = Ext.create('Ext.selection.CheckboxModel', {
            injectCheckbox: 1, //checkbox位于哪一列，默认值为0
            //mode:'single',//multi,simple,single；默认为多选multi
            //checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
            //allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
            //enableKeyNav:false
        });
        me.__mainGrid = Ext.create("Ext.grid.Panel", {
            viewConfig: {
                enableTextSelection: true
            },
            id:"__mainGrid",
            scroll: true,
            title: "销售总表",
            border: 0,
            selModel: sm,
            features: [{
                ftype: 'summary',
                dock: 'bottom'
            }],
            columnLines: true,
            columns: [{
                xtype: "rownumberer",
                width: 40
            }, {
                header: "药品",
                dataIndex: "drug_name",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "规格",
                dataIndex: "drug_guige",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "药品生产企业",
                width: 200,
                dataIndex: "drug_manufacture",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "1月销量",
                dataIndex: "01_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "2月销量",
                dataIndex: "02_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "3月销量",
                dataIndex: "03_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "4月销量",
                dataIndex: "04_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "5月销量",
                dataIndex: "05_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "6月销量",
                dataIndex: "06_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "7月销量",
                dataIndex: "07_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "8月销量",
                dataIndex: "08_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "9月销量",
                dataIndex: "09_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "10月销量",
                dataIndex: "10_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "11月销量",
                dataIndex: "11_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "12月销量",
                dataIndex: "12_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "年度合计",
                dataIndex: "sum_year",
                menuDisabled: false,
                sortable: true,
                width: 90
            }],
            store: store,
            bbar: [{
                id: "pagingToobar",
                xtype: "pagingtoolbar",
                border: 0,
                store: store
            }, "-", {
                xtype: "displayfield",
                value: "每页显示"
            }, {
                id: "comboCountPerPage",
                xtype: "combobox",
                editable: false,
                width: 60,
                store: Ext.create("Ext.data.ArrayStore", {
                    fields: ["text"],
                    data: [
                        ["20"],
                        ["50"],
                        ["100"],
                        ["300"],
                        ["1000"]
                    ]
                }),
                value: 20,
                listeners: {
                    change: {
                        fn: function() {
                            store.pageSize = Ext
                                .getCmp("comboCountPerPage")
                                .getValue();
                            store.currentPage = 1;
                            Ext.getCmp("pagingToobar")
                                .doRefresh();
                        },
                        scope: me
                    }
                }
            }, {
                xtype: "displayfield",
                value: "条记录"
            },"-",{
                xtype: "button",
                text: "图表显示",
                width: 100,
                margin: "5 0 0 10",
                iconCls: "PSI-button-refresh",
                handler: me.onShowChart,
                cls: "button-background-gray",
                scope: me
            },],
            tbar: [{
                id: "editQueryDate",
                xtype: 'monthfield',
                margin: "5, 0, 0, 0",
                format: "Y",
                labelAlign: "left",
                labelSeparator: "",
                width: 200,
                labelWidth: 60,
                fieldLabel: "选择年份",
                value: new Date()
            }, {
                id: "editQueryDrug",
                labelWidth: 60,
                labelAlign: "right",
                labelSeparator: "",
                fieldLabel: "药品",
                margin: "5, 0, 0, 0",
                xtype: "psi_drug_field",
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
                    width: 50,
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
                }, {
                    xtype: "button",
                    text: "导出到excel",
                    width: 100,
                    margin: "5, 0, 0, 10",
                    iconCls: "PSI-button-excelexport",
                    //handler : me.onExportGrid2Excel(store,"报表/销售报表/销售总表",me.__mainGrid),
                    handler: me.onExportGrid2Excel4Main,
                    scope: me
                }]
            }],
            listeners: {
                selectionchange: function(view, record, item, index, e) {
                    var data = this.getSelectionModel().getSelection();
                    for (var i = 0; i < summaryFilters.length; i++) {
                        records[summaryFilters[i]] = 0;
                    }
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < summaryFilters.length; j++) {
                            var itemname = summaryFilters[j];
                            records[itemname] += Number.parseFloat(data[i].raw[itemname]);
                        }
                    }
                    me.__mainGrid.update();
                },

            }
        });

        var summaryColumns = me.__mainGrid.columns;
        for (var i = 0; i < summaryColumns.length; i++) {
            var itemname = summaryColumns[i].dataIndex;
            (function(itemname) {
                summaryColumns[i].summaryType = summaryFilters.indexOf(itemname) < 0 ? false : function() {
                    return records['main_' + itemname] || 0;
                }
                if (i === 1) {
                    summaryColumns[1].summaryType = function() {
                        return '合计'
                    }
                }
            })(itemname)
        }

        return me.__mainGrid;
    },

    //按照地区查询
    getRegionSortGrid: function() {
        var me = this;
        if (me.__regionSortGrid) {
            return me.__regionSortGrid;
        }

        var modelName = "PSIReportSaleSummary";
        Ext.define(modelName, {
            extend: "Ext.data.Model",
            fields: ["employee_des", "employee_profit", "drug_name", "drug_guige", "drug_manufacture",
                "region_name", "hospital_name", "01_month", "02_month", "03_month", "04_month",
                "05_month", "06_month", "07_month", "08_month", "09_month", "10_month",
                "11_month", "12_month", "sum_year"
            ]
        });
        var store = Ext.create("Ext.data.Store", {
            autoLoad: false,
            model: modelName,
            data: [],
            pageSize: 20,
            proxy: {
                type: "ajax",
                actionMethods: {
                    read: "POST"
                },
                url: PSI.Const.BASE_URL + "Home/Report/sellReportRegionSortQueryData",
                reader: {
                    root: 'allData',
                    totalProperty: 'totalCount'
                }
            }
        });
        store.on("beforeload", function() {
            store.proxy.extraParams = me.getQueryParamByRegion();
        });
        var sm = Ext.create('Ext.selection.CheckboxModel', {
            injectCheckbox: 1, //checkbox位于哪一列，默认值为0
            //mode:'single',//multi,simple,single；默认为多选multi
            //checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
            //allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
            //enableKeyNav:false
        });
        me.__regionSortGrid = Ext.create("Ext.grid.Panel", {
            viewConfig: {
                enableTextSelection: true
            },
            scroll: true,
            id:"__regionSortGrid",
            selModel: sm,
            title: "销售总表--按照地区查询",
            border: 0,
            columnLines: true,
            features: [{
                ftype: 'summary',
                dock: 'bottom'
            }],
            columns: [{
                xtype: "rownumberer",
                width: 40
            }, {
                header: "医院",
                dataIndex: "hospital_name",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "地区",
                dataIndex: "region_name",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "身份",
                dataIndex: "employee_des",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "推广费用",
                dataIndex: "employee_profit",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "药品",
                dataIndex: "drug_name",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "规格",
                dataIndex: "drug_guige",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "药品生产企业",
                width: 200,
                dataIndex: "drug_manufacture",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "1月销量",
                dataIndex: "01_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "2月销量",
                dataIndex: "02_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "3月销量",
                dataIndex: "03_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "4月销量",
                dataIndex: "04_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "5月销量",
                dataIndex: "05_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "6月销量",
                dataIndex: "06_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "7月销量",
                dataIndex: "07_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "8月销量",
                dataIndex: "08_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "9月销量",
                dataIndex: "09_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "10月销量",
                dataIndex: "10_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "11月销量",
                dataIndex: "11_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "12月销量",
                dataIndex: "12_month",
                menuDisabled: false,
                sortable: true,
                width: 60
            }, {
                header: "年度合计",
                dataIndex: "sum_year",
                menuDisabled: false,
                sortable: true,
                width: 90
            }],
            store: store,
            bbar: [{
                id: "pagingToobarByRegion",
                xtype: "pagingtoolbar",
                border: 0,
                store: store
            }, "-", {
                xtype: "displayfield",
                value: "每页显示"
            }, {
                id: "comboCountPerPageByRegion",
                xtype: "combobox",
                editable: false,
                width: 60,
                store: Ext.create("Ext.data.ArrayStore", {
                    fields: ["text"],
                    data: [
                        ["20"],
                        ["50"],
                        ["100"],
                        ["300"],
                        ["1000"]
                    ]
                }),
                value: 20,
                listeners: {
                    change: {
                        fn: function() {
                            store.pageSize = Ext
                                .getCmp("comboCountPerPageByRegion")
                                .getValue();
                            store.currentPage = 1;
                            Ext.getCmp("pagingToobarByRegion")
                                .doRefresh();
                        },
                        scope: me
                    }
                }
            }, {
                xtype: "displayfield",
                value: "条记录"
            },"-",{
                xtype: "button",
                text: "图表显示",
                width: 100,
                margin: "5 0 0 10",
                iconCls: "PSI-button-refresh",
                handler: me.onShowChart,
                cls: "button-background-gray",
                scope: me
            }],
            tbar: [{
                id: "editQueryDateByRegion",
                xtype: 'monthfield',
                margin: "5, 0, 0, 0",
                format: "Y",
                labelAlign: "left",
                labelSeparator: "",
                width: 80,
                labelWidth: 25,
                fieldLabel: "年份",
                value: new Date()
            }, {
                id: "editQueryDrugIDByRegion",
                xtype: "hidden",
            }, {
                id: "editQueryDrugByRegion",
                labelWidth: 25,
                width: 150,
                labelAlign: "right",
                labelSeparator: "",
                fieldLabel: "品种",
                margin: "5, 0, 0, 0",
                xtype: "psi_drug_field",
                parentCmp: me,
                callbackFunc: me.onSelectDrugInByRegionGrid,
                listeners: {
                    specialkey: {
                        fn: me.onQueryEditSpecialKey,
                        scope: me
                    }
                }
            }, {
                id: "editQueryRegionIDByRegion",
                xtype: "hidden",
            }, {
                id: "if_by_region",
                fieldLabel: "是否按照地区",
                valueField: "name",
                labelAlign: "right",
                displayField: "name",
                labelWidth: 80,
                multiSelect: false,
                xtype: "combo",
                value: '是',
                store: new Ext.data.ArrayStore({
                    fields: ['id', 'name'],
                    data: [
                        ["0", '否'],
                        ["1", '是']
                    ]
                }),
                listeners: {
                    change: {
                        fn: me.onIfByRegion,
                        scope: me
                    }
                }
            }, {
                id: "editQueryRegionByRegion",
                labelWidth: 30,
                labelAlign: "right",
                labelSeparator: "",
                parentCmp: me,
                callbackFunc: me.onSelectRegionInByRegionGrid,
                fieldLabel: "地区",
                margin: "5, 0, 0, 0",
                xtype: "psi_regionfield",
                listeners: {
                    specialkey: {
                        fn: me.onQueryEditSpecialKey,
                        scope: me
                    }
                }
            }, {
                id: "editHospitalType",
                fieldLabel: "医院等级",
                blankText: "没有输入医院等级",
                valueField: "name",
                labelAlign: "right",
                displayField: "name",
                labelWidth: 60,
                multiSelect: true,
                xtype: "combo",
                value: '全选',
                store: new Ext.data.ArrayStore({
                    fields: ['id', 'name'],
                    data: [
                        ["0", '全选'],
                        ["1", '二级以上'],
                        ["2", '卫生院'],
                        ["3", '民营医院'],
                        ["4", '药店'],
                        ["5", '诊所'],
                        ["6", '其他医疗单位'],
                    ]
                })
            }, {
                xtype: "container",
                items: [{
                    xtype: "button",
                    text: "查询",
                    width: 50,
                    margin: "5 0 0 10",
                    iconCls: "PSI-button-refresh",
                    handler: me.onQueryByRegion,
                    scope: me
                }, {
                    xtype: "button",
                    text: "导出到excel",
                    width: 100,
                    margin: "5, 0, 0, 10",
                    iconCls: "PSI-button-excelexport",
                    handler: me.onExportGrid2Excel4RegionSortGrid,
                    scope: me
                }]
            }],
            listeners: {
                selectionchange: function(view, record, item, index, e) {
                    var data = this.getSelectionModel().getSelection();
                    for (var i = 0; i < summaryFilters.length; i++) {
                        records[summaryFilters[i]] = 0;
                    }
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < summaryFilters.length; j++) {
                            var itemname = summaryFilters[j];
                            records[itemname] += Number.parseFloat(data[i].raw[itemname]);
                        }
                    }
                    me.__regionSortGrid.update();
                },

            }
        });

        me.regionSortGrid = me.__regionSortGrid;

        var summaryColumns = me.__regionSortGrid.columns;
        for (var i = 0; i < summaryColumns.length; i++) {
            var itemname = summaryColumns[i].dataIndex;
            (function(itemname) {
                summaryColumns[i].summaryType = summaryFilters.indexOf(itemname) < 0 ? false : function() {
                    return records['region' + itemname] || 0;
                }
                if (i === 1) {
                    summaryColumns[1].summaryType = function() {
                        return '合计'
                    }
                }
            })(itemname)
        }
        return me.regionSortGrid;
    },

    //医院业务开发状况
    getHospitalBusinessGrid: function() {
        var me = this;
        if (me.__hospitalBusinessGrid) {
            return me.__hospitalBusinessGrid;
        }

        var modelName = "PSIReportHospitalBusiness";
        Ext.define(modelName, {
            extend: "Ext.data.Model",
            fields: ["drug_id", "drug_name", "drug_guige", "drug_manufacture",
                "hospital_id", "hospital_name", "start_date"
            ]
        });
        var store = Ext.create("Ext.data.Store", {
            autoLoad: false,
            model: modelName,
            data: [],
            pageSize: 20,
            proxy: {
                type: "ajax",
                actionMethods: {
                    read: "POST"
                },
                url: PSI.Const.BASE_URL + "Home/Report/sellReportHospitalBusinessQueryData",
                reader: {
                    root: 'allData',
                    totalProperty: 'totalCount'
                }
            }
        });
        store.on("beforeload", function() {
            store.proxy.extraParams = me.getQueryParamHospitalBusiness();
        });

        me.__hospitalBusinessGrid = Ext.create("Ext.grid.Panel", {
            viewConfig: {
                enableTextSelection: true
            },
            scroll: true,
            title: "医院业务开发状况",
            border: 0,
            id:"__hospitalBusinessGrid",
            columnLines: true,
            columns: [{
                xtype: "rownumberer",
                width: 40
            }, {
                header: "医院",
                dataIndex: "hospital_name",
                menuDisabled: false,
                sortable: true,
                width: 250,
            }, {
                header: "药品",
                dataIndex: "drug_name",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "规格",
                dataIndex: "drug_guige",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "药品生产企业",
                width: 200,
                dataIndex: "drug_manufacture",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "进院时间",
                dataIndex: "start_date",
                menuDisabled: false,
                sortable: true,
            }],
            store: store,
            bbar: [{
                id: "pagingToobarHospitalBusiness",
                xtype: "pagingtoolbar",
                border: 0,
                store: store
            }, "-", {
                xtype: "displayfield",
                value: "每页显示"
            }, {
                id: "comboCountPerPageHospitalBusiness",
                xtype: "combobox",
                editable: false,
                width: 60,
                store: Ext.create("Ext.data.ArrayStore", {
                    fields: ["text"],
                    data: [
                        ["20"],
                        ["50"],
                        ["100"],
                        ["300"],
                        ["1000"]
                    ]
                }),
                value: 20,
                listeners: {
                    change: {
                        fn: function() {
                            store.pageSize = Ext
                                .getCmp("comboCountPerPageHospitalBusiness")
                                .getValue();
                            store.currentPage = 1;
                            Ext.getCmp("pagingToobarHospitalBusiness")
                                .doRefresh();
                        },
                        scope: me
                    }
                }
            }, {
                xtype: "displayfield",
                value: "条记录"
            },"-",{
                xtype: "button",
                text: "图表显示",
                width: 100,
                margin: "5 0 0 10",
                iconCls: "PSI-button-refresh",
                handler: me.onShowChart,
                cls: "button-background-gray",
                scope: me
            }],
            tbar: [{
                id: "editQueryDateHospitalBusiness",
                xtype: 'monthfield',
                fieldLabel: '选择月份',
                editable: false,
                margin: "5, 0, 0, 0",
                labelWidth: 60,
                labelAlign: 'right',
                format: 'Y-m',
                value: new Date()
            }, {
                id: "editQueryDrugHospitalBusiness",
                labelWidth: 60,
                labelAlign: "right",
                labelSeparator: "",
                fieldLabel: "药品",
                margin: "5, 0, 0, 0",
                xtype: "psi_drug_field",
            }, {
                id: "editQueryRegionHospitalBusiness",
                labelWidth: 60,
                labelAlign: "right",
                labelSeparator: "",
                fieldLabel: "地区",
                margin: "5, 0, 0, 0",
                xtype: "psi_regionfield",
            }, {
                id: "editHospitalBusinessType",
                fieldLabel: "业务类型",
                valueField: "name",
                labelAlign: "right",
                displayField: "name",
                labelWidth: 60,
                xtype: "combo",
                store: new Ext.data.ArrayStore({
                    fields: ['id', 'name'],
                    data: [
                        ["1", '未进院分析'],
                        ["2", '已进院分析']
                    ]
                }),
                listeners: {
                    change: {
                        fn: me.hospitalBusinessAnalyseTypeChange,
                        scope: me
                    }
                },
            }, {
                xtype: "container",
                items: [{
                    xtype: "button",
                    text: "查询",
                    width: 50,
                    margin: "5 0 0 10",
                    iconCls: "PSI-button-refresh",
                    handler: me.onQueryHospitalBusiness,
                    scope: me
                }, {
                    xtype: "button",
                    text: "导出到excel",
                    width: 100,
                    margin: "5, 0, 0, 10",
                    iconCls: "PSI-button-excelexport",
                    handler: me.onExportGrid2Excel4HospitalBusinessGrid,
                    scope: me
                }]
            }],
            listeners: {}
        });
        me.hospitalBusinessGrid = me.__hospitalBusinessGrid;
        return me.__hospitalBusinessGrid;
    },

    //滞销分析
    getUnsalableGrid: function() {
        var me = this;
        if (me.__unsalableGrid) {
            return me.__unsalableGrid;
        }

        var modelName = "PSIReportSaleUnsalableGrid";
        Ext.define(modelName, {
            extend: "Ext.data.Model",
            fields: ["employee_alarm_month", "employee_des", "employee_name", "drug_name", "drug_guige", "drug_manufacturer",
                "hospital_name", "01_month", "02_month", "03_month", "04_month",
                "05_month", "06_month", "07_month", "08_month", "09_month", "10_month",
                "11_month", "12_month", "sum_year"
            ]
        });
        var store = Ext.create("Ext.data.Store", {
            autoLoad: false,
            model: modelName,
            data: [],
            pageSize: 20,
            proxy: {
                type: "ajax",
                actionMethods: {
                    read: "POST"
                },
                url: PSI.Const.BASE_URL + "Home/Report/sellReportUnsalableQueryData",
                reader: {
                    root: 'allData',
                    totalProperty: 'totalCount'
                }
            }
        });
        store.on("beforeload", function() {
            store.proxy.extraParams = me.getQueryParamUnsalable();
        });

        store.on("load", function(s,records){

        });

        var sm = Ext.create('Ext.selection.CheckboxModel', {
            injectCheckbox: 1, //checkbox位于哪一列，默认值为0
            //mode:'single',//multi,simple,single；默认为多选multi
            //checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
            //allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
            //enableKeyNav:false
        });
        me.__unsalableGrid = Ext.create("Ext.grid.Panel", {
            viewConfig: {
                enableTextSelection: true
            },
            scroll: true,
            selModel: sm,
            title: "滞销分析",
            id:"__unsalableGrid",
            border: 0,
            columnLines: true,
            features: [{
                ftype: 'summary',
                dock: 'bottom'
            }],
            columns: [{
                xtype: "rownumberer",
                width: 40
            }, {
                header: "身份",
                dataIndex: "employee_des",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "推广费用",
                dataIndex: "employee_profit",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "姓名",
                dataIndex: "employee_name",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "月销售预警值",
                dataIndex: "employee_alarm_month",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "药品",
                dataIndex: "drug_name",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "规格",
                dataIndex: "drug_guige",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "药品生产企业",
                width: 200,
                dataIndex: "drug_manufacturer",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "销售医院",
                dataIndex: "hospital_name",
                menuDisabled: false,
                sortable: true,
                width: 300,
            }, {
                header: "1月销量",
                dataIndex: "01_month",
                menuDisabled: false,
                sortable: true,
                width: 60,
                renderer: me.renderUnsaledGrid
            }, {
                header: "2月销量",
                dataIndex: "02_month",
                menuDisabled: false,
                sortable: true,
                width: 60,
                renderer: me.renderUnsaledGrid
            }, {
                header: "3月销量",
                dataIndex: "03_month",
                menuDisabled: false,
                sortable: true,
                width: 60,
                renderer: me.renderUnsaledGrid

            }, {
                header: "4月销量",
                dataIndex: "04_month",
                menuDisabled: false,
                sortable: true,
                width: 60,
                renderer: me.renderUnsaledGrid

            }, {
                header: "5月销量",
                dataIndex: "05_month",
                menuDisabled: false,
                sortable: true,
                width: 60,
                renderer: me.renderUnsaledGrid

            }, {
                header: "6月销量",
                dataIndex: "06_month",
                menuDisabled: false,
                sortable: true,
                width: 60,
                renderer: me.renderUnsaledGrid
            }, {
                header: "7月销量",
                dataIndex: "07_month",
                menuDisabled: false,
                sortable: true,
                width: 60,
                renderer: me.renderUnsaledGrid

            }, {
                header: "8月销量",
                dataIndex: "08_month",
                menuDisabled: false,
                sortable: true,
                width: 60,
                renderer: me.renderUnsaledGrid

            }, {
                header: "9月销量",
                dataIndex: "09_month",
                menuDisabled: false,
                sortable: true,
                width: 60,
                renderer: me.renderUnsaledGrid

            }, {
                header: "10月销量",
                dataIndex: "10_month",
                menuDisabled: false,
                sortable: true,
                width: 60,
                renderer: me.renderUnsaledGrid
            }, {
                header: "11月销量",
                dataIndex: "11_month",
                menuDisabled: false,
                sortable: true,
                width: 60,
                renderer: me.renderUnsaledGrid
            }, {
                header: "12月销量",
                dataIndex: "12_month",
                menuDisabled: false,
                sortable: true,
                width: 60,
                renderer: me.renderUnsaledGrid
            }, {
                header: "年度合计",
                dataIndex: "sum_year",
                menuDisabled: false,
                sortable: true,
                width: 90
            }],
            store: store,
            bbar: [{
                id: "pagingToobarUnsalable",
                xtype: "pagingtoolbar",
                border: 0,
                store: store
            }, "-", {
                xtype: "displayfield",
                value: "每页显示"
            }, {
                id: "comboCountPerPageUnsalable",
                xtype: "combobox",
                editable: false,
                width: 60,
                store: Ext.create("Ext.data.ArrayStore", {
                    fields: ["text"],
                    data: [
                        ["20"],
                        ["50"],
                        ["100"],
                        ["300"],
                        ["1000"]
                    ]
                }),
                value: 20,
                listeners: {
                    change: {
                        fn: function() {
                            store.pageSize = Ext
                                .getCmp("comboCountPerPageUnsalable")
                                .getValue();
                            store.currentPage = 1;
                            Ext.getCmp("pagingToobarUnsalable")
                                .doRefresh();
                        },
                        scope: me
                    }
                }
            }, {
                xtype: "displayfield",
                value: "条记录"
            },"-",{
                xtype: "button",
                text: "图表显示",
                width: 100,
                margin: "5 0 0 10",
                iconCls: "PSI-button-refresh",
                handler: me.onShowChart,
                cls: "button-background-gray",
                scope: me
            }],
            tbar: [{
                id: "editQueryDateUnsalable",
                xtype: 'monthfield',
                margin: "5, 0, 0, 0",
                format: "Y",
                labelAlign: "left",
                labelSeparator: "",
                width: 200,
                labelWidth: 60,
                fieldLabel: "选择年份",
                value: new Date()
            }, {
                id: "editQueryDrugUnsalable",
                labelWidth: 60,
                labelAlign: "right",
                labelSeparator: "",
                fieldLabel: "药品",
                margin: "5, 0, 0, 0",
                xtype: "psi_drug_field",
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
                    width: 50,
                    margin: "5 0 0 10",
                    iconCls: "PSI-button-refresh",
                    handler: me.onQueryUnsalable,
                    scope: me
                }, {
                    xtype: "button",
                    text: "导出到excel",
                    width: 100,
                    margin: "5, 0, 0, 10",
                    iconCls: "PSI-button-excelexport",
                    handler: me.onExportGrid2Excel4UnsableGrid,
                    scope: me
                }]
            }],
            listeners: {
                selectionchange: function(view, record, item, index, e) {
                    this.getView().refresh();
                },
                select: function(view, record, item, index, e) {
                    var data = this.getSelectionModel().getSelection();
                    console.log(data)
                    for (var i = 0; i < summaryFilters.length; i++) {
                        records[summaryFilters[i]] = 0;
                    }
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < summaryFilters.length; j++) {
                            var itemname = summaryFilters[j];
                            records[itemname] += Number.parseFloat(data[i].raw[itemname]);
                        }
                    }
                    // this.getView().refresh();
                },
                deselect: function(view, record, item, index, e) {
                    var data = this.getSelectionModel().getSelection();
                    console.log(data)
                    for (var i = 0; i < summaryFilters.length; i++) {
                        records[summaryFilters[i]] = 0;
                    }
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < summaryFilters.length; j++) {
                            var itemname = summaryFilters[j];
                            records[itemname] += Number.parseFloat(data[i].raw[itemname]);
                        }
                    }
                    // this.getView().refresh();
                }
            }
        });
        me.unsalableGrid = me.__unsalableGrid;

        var summaryColumns = me.__unsalableGrid.columns;
        for (var i = 0; i < summaryColumns.length; i++) {
            var itemname = summaryColumns[i].dataIndex;
            (function(itemname) {
                summaryColumns[i].summaryType = summaryFilters.indexOf(itemname) < 0 ? false : function() {
                    return records[itemname] || 0;
                }
                if (i === 1) {
                    summaryColumns[1].summaryType = function() {
                        return '合计'
                    }
                }
            })(itemname)
        }

        return me.unsalableGrid;
    },


    //渲染滞销表格

    renderUnsaledGrid:function(value, metaData, record, rowIndex, colIndex, store, view) {
        if (value > record.get("employee_alarm_month")) {
            return '<span style="background-color:green;">' + value + '</span>';
        } else{
            return '<span style="background-color:red;">' + value + '</span>';
        }
    },
    //滞销分析
    getGrossProfitGrid: function() {
        var me = this;
        if (me.__grossProfitGrid) {
            return me.__grossProfitGrid;
        }

        var modelName = "PSIReportSaleGrossProfitGrid";
        Ext.define(modelName, {
            extend: "Ext.data.Model",
            fields: ["drug_name", "drug_guige", "drug_manufacturer", "gross_profit", "saleroom", "gross_rate"]
        });
        var store = Ext.create("Ext.data.Store", {
            autoLoad: false,
            model: modelName,
            data: [],
            pageSize: 20,
            proxy: {
                type: "ajax",
                actionMethods: {
                    read: "POST"
                },
                url: PSI.Const.BASE_URL + "Home/Report/sellReportGrossProfitQueryData",
                reader: {
                    root: 'allData',
                    totalProperty: 'totalCount'
                }
            }
        });
        store.on("beforeload", function() {
            store.proxy.extraParams = me.getQueryParamGrossProfit();
        });
        var sm = Ext.create('Ext.selection.CheckboxModel', {
            injectCheckbox: 1, //checkbox位于哪一列，默认值为0
            //mode:'single',//multi,simple,single；默认为多选multi
            //checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
            //allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
            //enableKeyNav:false
        });
        me.__grossProfitGrid = Ext.create("Ext.grid.Panel", {
            viewConfig: {
                enableTextSelection: true
            },
            scroll: true,
            selModel: sm,
            title: "销售毛利分析",
            id:"__grossProfitGrid",
            features: [{
                ftype: 'summary',
                dock: 'bottom'
            }],
            border: 0,
            columnLines: true,
            columns: [{
                xtype: "rownumberer",
                width: 40
            }, {
                header: "药品",
                dataIndex: "drug_name",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "规格",
                dataIndex: "drug_guige",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "药品生产企业",
                width: 200,
                dataIndex: "drug_manufacturer",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "毛利",
                dataIndex: "gross_profit",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "销售额",
                dataIndex: "saleroom",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "毛利率",
                dataIndex: "gross_rate",
                menuDisabled: false,
                sortable: true,
            }, ],
            store: store,
            bbar: [{
                id: "pagingToobarGrossProfit",
                xtype: "pagingtoolbar",
                border: 0,
                store: store
            }, "-", {
                xtype: "displayfield",
                value: "每页显示"
            }, {
                id: "comboCountPerPageGrossProfit",
                xtype: "combobox",
                editable: false,
                width: 60,
                store: Ext.create("Ext.data.ArrayStore", {
                    fields: ["text"],
                    data: [
                        ["20"],
                        ["50"],
                        ["100"],
                        ["300"],
                        ["1000"]
                    ]
                }),
                value: 20,
                listeners: {
                    change: {
                        fn: function() {
                            store.pageSize = Ext
                                .getCmp("comboCountPerPageGrossProfit")
                                .getValue();
                            store.currentPage = 1;
                            Ext.getCmp("pagingToobarGrossProfit")
                                .doRefresh();
                        },
                        scope: me
                    }
                }
            }, {
                xtype: "displayfield",
                value: "条记录"
            },"-",{
                xtype: "button",
                text: "图表显示",
                width: 100,
                margin: "5 0 0 10",
                iconCls: "PSI-button-refresh",
                handler: me.onShowChart,
                cls: "button-background-gray",
                scope: me
            }],
            tbar: [{
                id: "editQueryDateGrossProfit",
                xtype: 'monthfield',
                margin: "5, 0, 0, 0",
                format: "Y-m",
                labelAlign: "left",
                labelSeparator: "",
                width: 200,
                labelWidth: 60,
                fieldLabel: "选择月份",
                value: new Date()
            }, {
                xtype: "container",
                items: [{
                    xtype: "button",
                    text: "查询",
                    width: 50,
                    margin: "5 0 0 10",
                    iconCls: "PSI-button-refresh",
                    handler: me.onQueryGrossProfit,
                    scope: me
                }, {
                    xtype: "button",
                    text: "导出到excel",
                    width: 100,
                    margin: "5, 0, 0, 10",
                    iconCls: "PSI-button-excelexport",
                    handler: me.onExportGrid2Excel4GrossProfit,
                    scope: me
                }]
            }],
            listeners: {
                selectionchange: function(view, record, item, index, e) {
                    this.getView().refresh();
                },
                select: function(view, record, item, index, e) {
                    var data = this.getSelectionModel().getSelection();
                    console.log(data)
                    for (var i = 0; i < summaryFilters.length; i++) {
                        records[summaryFilters[i]] = 0;
                    }
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < summaryFilters.length; j++) {
                            var itemname = summaryFilters[j];
                            records[itemname] += Number.parseFloat(data[i].raw[itemname]);
                        }
                    }
                    // this.getView().refresh();
                },
                deselect: function(view, record, item, index, e) {
                    var data = this.getSelectionModel().getSelection();
                    console.log(data)
                    for (var i = 0; i < summaryFilters.length; i++) {
                        records[summaryFilters[i]] = 0;
                    }
                    for (var i = 0; i < data.length; i++) {
                        for (var j = 0; j < summaryFilters.length; j++) {
                            var itemname = summaryFilters[j];
                            records[itemname] += Number.parseFloat(data[i].raw[itemname]);
                        }
                    }
                    // this.getView().refresh();
                }
            }
        });
        me.grossProfitGrid = me.__grossProfitGrid;

        var summaryColumns = me.__grossProfitGrid.columns;
        for (var i = 0; i < summaryColumns.length; i++) {
            var itemname = summaryColumns[i].dataIndex;
            (function(itemname) {
                summaryColumns[i].summaryType = summaryFilters.indexOf(itemname) < 0 ? false : function() {
                    var summary = records[itemname] ? records[itemname].toFixed(2) : 0;
                    return summary;
                }
                if (i === 1) {
                    summaryColumns[1].summaryType = function() {
                        return '合计'
                    }
                }
            })(itemname)
        }

        return me.grossProfitGrid;
    },




    onQuery: function() {
        this.refreshMainGrid();
    },
    onShowChart: function() {
        var me =this;
        if(!me.preSetInfo4Chart()){
            return ;
        }else{
            var form = Ext.create("PSI.Report.ShowChartForm", {
                id: 'htContainer',
                width: 900,
                height: 600,
                resizable:true,
                maximizable:true,
                maximized:false,
                panelTitle:me.hc_panelTitle,
                renderTo: Ext.getBody(),
                chart_title:me.hc_chart_title,//表格头部标题
                chart_type:me.hc_chart_type,//表格头部标题
                chart_subtitle:me.hc_chart_subtitle,//表格子标题
                chart_xAxis_categories:me.hc_chart_xAxis_categories,//表格x轴条目
                chart_yAxis_title:me.hc_chart_yAxis_title  ,//表格Y轴标题
                chart_series_data:me.getChartSeriesData()  //name和data的键值对数组
            });
            form.show();
        }

    },
    /*
    *提前设定一些关于标题的信息
    */
    preSetInfo4Chart:function () {
        var me = this;
        var selectedIndex = Ext.getCmp("main_tabpanel").getActiveTab().id;
        var items = Ext.getCmp("main_tabpanel").getActiveTab().getSelectionModel().getSelection();
        if (items == null || items.length < 1) {
            PSI.MsgBox.tip("请至少选择一行要展示的数据");
            return false;
        }
        switch (selectedIndex){
            case "__mainGrid":
                me.hc_panelTitle = "销售报表";
                me.hc_chart_title = Ext.Date.format(Ext.getCmp("editQueryDate").getValue(),"Y")+'销售报表';
                me.hc_chart_subtitle = "按照月份统计";
                me.hc_chart_yAxis_title = "销售数量";
                me.hc_chart_type = "line";
                me.hc_chart_xAxis_categories = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
                return true;
            case "__regionSortGrid":
                me.hc_panelTitle = "销售报表";
                me.hc_chart_title = "销售报表--按照地区查询";
                me.hc_chart_subtitle = "地区销量";
                me.hc_chart_yAxis_title = "销量";
                me.hc_chart_type = "line";
                me.hc_chart_xAxis_categories = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
                return true;
            case "__hospitalBusinessGrid":
                me.hc_panelTitle = "";
                me.hc_chart_title = "";
                me.hc_chart_subtitle = "";
                me.hc_chart_yAxis_title = "";
                me.hc_chart_type = "";
                me.hc_chart_xAxis_categories = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
                return true;
            case "__unsalableGrid":
                me.hc_panelTitle = "";
                me.hc_chart_title = "";
                me.hc_chart_subtitle = "";
                me.hc_chart_yAxis_title = "";
                me.hc_chart_type = "";
                me.hc_chart_xAxis_categories = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
                return true;
            case "__grossProfitGrid":
                me.hc_panelTitle = "";
                me.hc_chart_title = "";
                me.hc_chart_subtitle = "";
                me.hc_chart_yAxis_title = "";
                me.hc_chart_type = "";
                me.hc_chart_xAxis_categories = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
                return true;
            default :
                me.hc_panelTitle = "";
                me.hc_chart_title = "";
                me.hc_chart_subtitle = "";
                me.hc_chart_yAxis_title = "";
                me.hc_chart_type = "";
                me.hc_chart_xAxis_categories = "";
                return true;
        }
    },
    getSelectedTabpanel:function () {
        var me = this;
        var selectedIndex = Ext.getCmp("main_tabpanel").getActiveTab().id;
        switch (selectedIndex){
            case "__mainGrid":
                return me.getMainGrid();
            case "__regionSortGrid":
                return me.getRegionSortGrid();
            case "__hospitalBusinessGrid":
                return me.getHospitalBusinessGrid();
            case "__unsalableGrid":
                return me.getUnsalableGrid();
            case "__grossProfitGrid":
                return me.getGrossProfitGrid();
            default :
                return me.getMainGrid();
        }},
    /*
    * 每一个表格单独的得到封装的数据
    * */
    getChartSeriesData:function () {
        var me = this;
        var store = me.getSelectedTabpanel().getStore();
        var result = [];
        var data = {};
        var innerData = []
        var storeData = "";

        var items = Ext.getCmp("main_tabpanel").getActiveTab().getSelectionModel().getSelection();
        if (items == null || items.length < 1) {
            return ;
        }

        var selectedIndex = Ext.getCmp("main_tabpanel").getActiveTab().id;
        switch (selectedIndex){
            case "__mainGrid":
                for(var i = 0;i<items.length;i++){
                    data = {};
                    innerData = [];
                    storeData = items[i];
                    data.name = storeData.get('drug_name')+"/"+storeData.get('drug_manufacture');
                    for(var j = 1; j<13;j++){
                        if(j<10){
                            innerData.push(storeData.get("0"+j+"_month"))
                        }else(
                            innerData.push(storeData.get(j+"_month"))
                        )
                    }
                    data.data = innerData;
                    result.push(data);
                }
                return result;
            case "__regionSortGrid":
                for(var i = 0;i<items.length;i++){
                    data = {};
                    innerData = [];
                    storeData = items[i];
                    data.name = storeData.get('region_name')+"/"+storeData.get('hospital_name');
                    for(var j = 1; j<13;j++){
                        if(j<10){
                            innerData.push(storeData.get("0"+j+"_month"))
                        }else(
                            innerData.push(storeData.get(j+"_month"))
                        )
                    }
                    data.data = innerData;
                    result.push(data);
                }
                return result;
            case "__hospitalBusinessGrid":

            case "__unsalableGrid":

            case "__grossProfitGrid":

            default:

        }
    },


    onQueryByRegion: function() {
        this.refreshRegionSortGrid();
    },
    onQueryHospitalBusiness: function() {
        this.refreshHospitalBusinessGrid();
    },
    onQueryGrossProfit: function() {
        this.refreshGrossProfitGrid();
    },
    onQueryUnsalable: function() {
        this.refreshUnsalableGrid();
    },

    onClearQuery: function() {
        var me = this;
        // Ext.getCmp("editQueryDT").setValue(new Date());
        Ext.getCmp("editQueryDrug").setValue();
        Ext.getCmp("editQueryDrug").setIdValue();
        me.onQuery();
    },

    getQueryParam: function() {
        var me = this;

        var result = {};

        var dt = Ext.getCmp("editQueryDate").getValue();
        if (dt) {
            result.date = Ext.Date.format(dt, "Y");
        }

        var drug_id = Ext.getCmp("editQueryDrug").getIdValue();
        if (drug_id) {
            result.drug_id = drug_id;
        }

        return result;
    },

    //按照区域查询
    getQueryParamByRegion: function() {
        var me = this;

        var result = {};

        var dt = Ext.getCmp("editQueryDateByRegion").getValue();
        if (dt) {
            result.date = Ext.Date.format(dt, "Y");
        }

        var drug_id = Ext.getCmp("editQueryDrugIDByRegion").getValue();
        if (drug_id == "") {
            PSI.MsgBox.showInfo("请首先选择药品！")
            return;
        }
        if (drug_id) {
            result.drug_id = drug_id;
        }

        var region_id = Ext.getCmp("editQueryRegionIDByRegion").getValue();
        if (region_id) {
            result.region_id = region_id;
        }

        if (Ext.getCmp("if_by_region").getValue() == "是" && region_id == "") {
            return PSI.MsgBox.showInfo("请首先选择地区！");
        }

        var hospital_type = Ext.JSON.encode(Ext.getCmp("editHospitalType").getValue());
        if (hospital_type) {
            result.hospital_type = hospital_type;
        }

        var if_by_region = Ext.getCmp("if_by_region").getValue();
        if (if_by_region) {
            result.if_by_region = if_by_region;
        }
        return result;
    },

    //第三个tab页，进院情况的分析查询
    getQueryParamHospitalBusiness: function() {
        var me = this;

        var result = {};

        var dt = Ext.getCmp("editQueryDateHospitalBusiness").getValue();
        if (dt) {
            result.date = Ext.Date.format(dt, "Y-m");
        }

        var drug_id = Ext.getCmp("editQueryDrugHospitalBusiness").getIdValue();
        if (drug_id) {
            result.drug_id = drug_id;
        }

        var region_id = Ext.getCmp("editQueryRegionHospitalBusiness").getIdValue();
        if (region_id) {
            result.region_id = region_id;
        }

        var analyse_type = Ext.getCmp("editHospitalBusinessType").getValue();
        if (analyse_type) {
            result.analyse_type = analyse_type;
        }
        return result;
    },

    //第四个tab页，滞销情况的分析查询
    getQueryParamUnsalable: function() {
        var me = this;

        var result = {};

        var dt = Ext.getCmp("editQueryDateUnsalable").getValue();
        if (dt) {
            result.date = Ext.Date.format(dt, "Y");
        }

        var drug_id = Ext.getCmp("editQueryDrugUnsalable").getIdValue();
        if (drug_id == "") {
            PSI.MsgBox.showInfo("请首先选择药品！")
            return;
        }
        if (drug_id) {
            result.drug_id = drug_id;
        }

        return result;
    },
    //第五个tab页，销售毛利
    getQueryParamGrossProfit: function() {
        var me = this;

        var result = {};

        var dt = Ext.getCmp("editQueryDateGrossProfit").getValue();
        if (dt) {
            result.date = Ext.Date.format(dt, "Y-m");
        }
        return result;
    },


    refreshMainGrid: function(id) {
        Ext.getCmp("pagingToobar").doRefresh();
    },
    refreshRegionSortGrid: function(id) {
        if ((Ext.getCmp("if_by_region").getValue() == 1 && Ext.getCmp("editQueryRegionByRegion").getValue() == "") || (Ext.getCmp("editQueryDrugByRegion").getValue() == "") || Ext.getCmp("editHospitalType").getValue() == "") {
            PSI.MsgBox.showInfo("请选择药品，地区与医院等级！")
            return;
        }
        Ext.getCmp("pagingToobarByRegion").doRefresh();
    },
    refreshHospitalBusinessGrid: function(id) {
        if (Ext.getCmp("editQueryDrugHospitalBusiness").getValue() == "" || Ext.getCmp("editHospitalBusinessType").getValue() == "") {
            PSI.MsgBox.showInfo("请选择药品和业务类型！")
            return;
        }
        Ext.getCmp("pagingToobarHospitalBusiness").doRefresh();
    },
    refreshUnsalableGrid: function(id) {
        if (Ext.getCmp("editQueryDrugUnsalable").getValue() == "") {
            PSI.MsgBox.showInfo("请选择药品！")
            return;
        }
        Ext.getCmp("pagingToobarUnsalable").doRefresh();
    },
    refreshGrossProfitGrid: function(id) {
        Ext.getCmp("pagingToobarGrossProfit").doRefresh();
    },

    onSelectRegionInByRegionGrid: function(scope, data) {
        data = data.getData();
        var me = this;
        if (scope) {
            me = scope;
        }
        Ext.getCmp("editQueryRegionIDByRegion").setValue(data.id);
    },
    onSelectDrugInByRegionGrid: function(scope, data) {
        var me = this;
        if (scope) {
            me = scope;
        }
        Ext.getCmp("editQueryDrugIDByRegion").setValue(data.id);
    },
    hospitalBusinessAnalyseTypeChange: function() {
        if (Ext.getCmp("editHospitalBusinessType").getValue() == "未进院分析") {
            Ext.getCmp("editQueryDateHospitalBusiness").hide();
            Ext.getCmp("editQueryRegionHospitalBusiness").hide();
        }
        if (Ext.getCmp("editHospitalBusinessType").getValue() == "已进院分析") {
            Ext.getCmp("editQueryDateHospitalBusiness").show();
            Ext.getCmp("editQueryRegionHospitalBusiness").show();
        }
    },

    onExportGrid2Excel4Main: function() {
        var grid = this.getMainGrid();
        var config = {
            store: grid.getStore(),
            title: "销售总表"
        };
        ExportExcel(grid, config); //调用导出函数
    },

    onExportGrid2Excel4RegionSortGrid: function() {
        var grid = this.regionSortGrid;
        console.log('test', grid)
        var config = {
            store: grid.getStore(),
            title: "销售总表按照地区查询"
        };
        ExportExcel(grid, config); //调用导出函数
    },
    onExportGrid2Excel4HospitalBusinessGrid: function() {
        var grid = this.getHospitalBusinessGrid();
        var config = {
            store: grid.getStore(),
            title: "医院业务开发状况"
        };
        ExportExcel(grid, config); //调用导出函数
    },
    onExportGrid2Excel4UnsableGrid: function() {
        var grid = this.getUnsalableGrid();
        var config = {
            store: grid.getStore(),
            title: "滞销分析"
        };
        ExportExcel(grid, config); //调用导出函数
    },

    onExportGrid2Excel4GrossProfit: function() {
        var grid = this.grossProfitGrid;
        var config = {
            store: grid.getStore(),
            title: "销售毛利分析"
        };
        ExportExcel(grid, config); //调用导出函数
    },
    onIfByRegion: function() {
        if (Ext.getCmp("if_by_region").getValue() == 1) {
            //按照地区
            Ext.getCmp("editQueryRegionByRegion").show("display");
        } else {
            Ext.getCmp("editQueryRegionByRegion").hide("display");
        }
    }

});