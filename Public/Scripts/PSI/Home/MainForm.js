/**
 * 首页
 */

Ext.define("PSI.Home.MainForm", {
    extend: "Ext.panel.Panel",

    config: {
        pSale: "",
        pInventory: "",
        pPurchase: "",
        pBusiness: "",
        pLoginType: "",
        pMoney: "",
        pBusinessInfoPortal:"",
        pAlarmInfoPortal:"",
    },

    border: 0,
    bodyPadding: 5,

    getPortal: function(index) {
        var me = this;
        var loginType = me.getPLoginType();
        if (loginType == null || loginType == "") {
            loginType = 2;
        }
        if (loginType == 1) {
            //业务员身份登陆
            //if (!me.__portalList) {
            //	me.__portalList = [];
            //	var pSale = me.getPSale() == "1";
            //	if (pSale) {
            //		me.__portalList.push(me.getSalePortal());
            //	}
            //
            //	var pInventory = me.getPInventory() == "1";
            //	if (pInventory) {
            //		me.__portalList.push(me.getInventoryPortal());
            //	}
            //
            //	var pPurchase = me.getPPurchase() == "1";
            //	if (pPurchase) {
            //		me.__portalList.push(me.getPurchasePortal());
            //	}
            //
            //	var pMoney = me.getPMoney() == "1";
            //	if (pMoney) {
            //		me.__portalList.push(me.getMoneyPortal());
            //	}
            //}
        } else if (loginType == 2) {
            //公司员工身份登陆
            if (!me.__portalList) {
                me.__portalList = [];
                var pSale = me.getPSale() == "1";
                if (pSale) {
                    me.__portalList.push(me.getSaleChartPanel());
                }
                var pInventory = me.getPInventory() == "1";
                if (pInventory)
                {
                    me.__portalList.push(me.getInventoryChartPanel());
                }

                var pPurchase = me.getPPurchase() == "1";
                if (pPurchase) {
                    me.__portalList.push(me.getPurchaseChartPanel());
                }

                var pMoney = me.getPMoney() == "1";
                if (pMoney) {
                    me.__portalList.push(me.getMoneyChartPanel());
                }
            }
        }

        if (index == 0 && me.__portalList.length == 0) {
            return me.getInfoPortal();
        }

        if (index >= me.__portalList.length || index < 0) {
            return {
                border: 0
            };
        }

        return me.__portalList[index];
    },

    initComponent: function() {
        var me = this;

        Ext.apply(me, {
            layout: "border",
            items: [
                {
                    region : "center",
                    xtype : "panel",
                    layout : {
                        type:"vbox",
                        align: 'center',

                    },
                    items: [
                        {
                            flex: 3,
                            layout: "hbox",
                            width:"100%",
                            border: 5,
                            items: [me.getPortal(0),
                                me.getPortal(1)
                            ]
                        }, {
                            flex: 3,
                            layout: "hbox",
                            width:"100%",
                            border: 5,
                            items: [me.getPortal(2),
                                me.getPortal(3)
                            ]
                        }



                    ]
                },
                {
                    xtype : "panel",
                    region : "east",
                    layout : "fit",
                    split: true,
                    width : "25%",
                    minWidth : 300,
                    border : 5,
                    layout : {
                        type:"vbox",
                        align: 'center',

                    },
                    items:[
                        {
                            flex: 2,
                            layout: "fit",
                            width:"100%",
                            border: 10,
                            xtype:"tabpanel",
                            items: [
                                me.getOutDateDrugAlarmInfo(),
                                me.getStockAmountAlarmInfo(),
                                // me.getEmployeeDelaySaleAlarmInfo()
                            ]
                        }, {
                            flex: 3,
                            layout: "fit",
                            width:"100%",
                            items: [
                                me.getBusinessInfoPortal()
                            ]
                        }

                    ]

                }

            ]
        });
        me.queryAllPortalData();
        me.queryAllAlarmData();
        me.callParent(arguments);
    },

    getSaleChartPanel: function(refresh) {
        var me = this;
        if(me.__saleChartPanel){
            return me.__saleChartPanel;
        }
        me.__saleChartPanel = Ext.create('PSI.Report.ShowChartPanel', {
            bodyPadding: 5,  // 避免Panel中的子元素紧邻边框
            width: "50%",
            height: "100%",
            iconCls: "PSI-portal-sale",
            id:"sale_chartPanel",
            chart_title:"销售看板",//表格头部标题
            chart_type:"line",//表格头部标题
            chart_subtitle:"近半年销售看板",//表格子标题
            chart_xAxis_categories:[],//表格x轴条目
            chart_yAxis_title:"数量，利润" ,//表格Y轴标题
            chart_yAxis :
                [
                    { // Primary yAxis
                        labels: {
                            format: '{value}元',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        title: {
                            text: '金额',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        }
                    }, { // Secondary yAxis
                    title: {
                        text: '利率',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} %',
                    },
                    opposite: true
                    }
                ] ,//表格Y轴
            chart_series_data:[],//name和data的键值对数组
        });
        return me.__saleChartPanel;
    },

    getPurchaseChartPanel: function() {
        var me = this;
        if (me.__purchaseChartPanel) {
            return me.__purchaseChartPanel;
        }
        me.__purchaseChartPanel =  Ext.create('PSI.Report.ShowChartPanel', {
            bodyPadding: 5,  // 避免Panel中的子元素紧邻边框
            width: "50%",
            height: "100%",
            iconCls: "PSI-portal-purchase",
            id:"purchase_chartPanel",
            chart_title:"采购看板",//表格头部标题
            chart_type:"line",//表格头部标题
            chart_subtitle:"近半年采购",//表格子标题
            chart_xAxis_categories:[],//表格x轴条目
            chart_yAxis_title:"数量" ,//表格Y轴标题
            chart_yAxis :
                [
                    { // Primary yAxis
                        labels: {
                            format: '{value}元',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        },
                        title: {
                            text: '金额',
                            style: {
                                color: Highcharts.getOptions().colors[1]
                            }
                        }
                    }, { // Secondary yAxis
                    title: {
                        text: '数量',
                        style: {
                            color: Highcharts.getOptions().colors[0]
                        }
                    },
                    labels: {
                        format: '{value} 个',
                    },
                    opposite: true
                }
                ] ,//表格Y轴
            chart_series_data:[],//name和data的键值对数组
        });
        return me.__purchaseChartPanel;
    },

    getInventoryChartPanel: function() {
        var me = this;
        if (me.__inventoryChartPanel) {
            return me.__inventoryChartPanel;
        }
        me.__inventoryChartPanel = Ext.create('PSI.Report.ShowChartPanel', {
            bodyPadding: 5,  // 避免Panel中的子元素紧邻边框
            iconCls: "PSI-portal-inventory",
            id:"inventory_chartPanel",
            width: "50%",
            height: "100%",
            chart_title:"库存情况",//表格头部标题
            chart_type:"bar",//表格头部标题
            chart_subtitle:"存货最多6个品种",//表格子标题
            chart_xAxis_categories:[],//表格x轴条目
            chart_yAxis_title:"数量/金额" ,//表格Y轴标题
            chart_series_data:[],//name和data的键值对数组
        });
        return me.__inventoryChartPanel;
    },

    getMoneyChartPanel: function() {
        var me = this;
        if (me.__moneyChartPanel) {
            return me.__moneyChartPanel;
        }
        me.__moneyChartPanel = Ext.create('PSI.Report.ShowChartPanel', {
            bodyPadding: 5,  // 避免Panel中的子元素紧邻边框
            width: "50%",
            iconCls: "PSI-portal-money",
            height: "100%",
            id:"money_chartPanel",
            chart_title:"资金看板",//表格头部标题
            chart_type:"line",//表格头部标题
            chart_subtitle:"资金看板",//表格子标题
            chart_xAxis_categories:[],//表格x轴条目
            chart_yAxis_title:"金额（元）" ,//表格Y轴标题
            chart_series_data:[],//name和data的键值对数组
        });
        return me.__moneyChartPanel;
    },




    getBusinessInfoPortal: function() {
        var me = this;
        if(!me.getPBusinessInfoPortal() == "1"){
            return null;
        }
        return {
            header: {
                title: "<span style='font-size:80%'>医药智联</span>",
                iconCls: "PSI-portal-money",
                height: 30
            },
            flex: 1,
            width: "100%",
            height: "100%",
            margin: "5",
            layout: "fit",
            tbar:[{
                xtype: "button",
                text: "刷新",
                width: 100,
                margin: "5 0 0 10",
                iconCls: "PSI-button-refresh",
                handler: me.queryAllAlarmData,
                cls: "button-background-gray",
                scope: me
            }],
            items: [

            ]
        };
    },


    getOutDateDrugAlarmInfo: function() {
        var me = this;
        if (me.__outDateDrugAlarmGrid) {
            return me.__outDateDrugAlarmGrid;
        }

        var modelName = "PSIReportOutDateDrugAlarm";
        Ext.define(modelName, {
            extend: "Ext.data.Model",
            fields: [ "drug_name", "guige", "manufacturer","batch_num", "expire_time"]
        });
        var store = Ext.create("Ext.data.Store", {
            autoLoad: false,
            model: modelName,
            data: [],
            pageSize: 20,
            proxy: {
                // type: "ajax",
                // actionMethods: {
                //     read: "POST"
                // },
                // url: PSI.Const.BASE_URL + "Home/Portal/getOutDateDrugAlarmInfo",
                // reader: {
                //     root: 'allData',
                //     totalProperty: 'totalCount'
                // }
            }
        });
        store.on("beforeload", function() {
        });

        me.__outDateDrugAlarmGrid = Ext.create("Ext.grid.Panel", {
            viewConfig: {
                enableTextSelection: true
            },
            height:"100%",
            scroll: true,
            title: "药品过期提醒",
            border: 0,
            id:"__outDateDrugAlarmGrid",
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
                dataIndex: "guige",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "批号",
                dataIndex: "batch_num",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "药品生产企业",
                width: 200,
                dataIndex: "manufacturer",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "过期日期",
                dataIndex: "expire_time",
                menuDisabled: false,
                sortable: true,
            }],
            store: store
        });
        me.outDateDrugAlarmGrid = me.__outDateDrugAlarmGrid;
        return me.__outDateDrugAlarmGrid;

    },

    getStockAmountAlarmInfo: function() {
        var me = this;
        if (me.__stockAmountAlarmGrid) {
            return me.__stockAmountAlarmGrid;
        }

        var modelName = "PSIReportStockAmountAlarm";
        Ext.define(modelName, {
            extend: "Ext.data.Model",
            fields: [ "drug_name", "guige", "manufacturer","deliver_name", "sum_amount", "alarm_amount"]
        });



        var store = Ext.create("Ext.data.Store", {
            autoLoad: false,
            model: modelName,
            data: [],
            pageSize: 20,
            proxy: {
                // type: "ajax",
                // actionMethods: {
                //     read: "POST"
                // },
                // url: PSI.Const.BASE_URL + "Home/Portal/getStockAmountAlarmInfo",
                // reader: {
                //     root: 'allData',
                //     totalProperty: 'totalCount'
                // }
            }
        });
        store.on("beforeload", function() {
        });

        me.__stockAmountAlarmGrid = Ext.create("Ext.grid.Panel", {
            viewConfig: {
                enableTextSelection: true
            },
            height:"100%",
            scroll: true,
            title: "库存数量预警",
            border: 0,
            id:"__stockAmountAlarmGrid",
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
                dataIndex: "guige",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "药品生产企业",
                width: 200,
                dataIndex: "manufacturer",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "对应仓库",
                width: 200,
                dataIndex: "deliver_name",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "当前库存",
                dataIndex: "sum_amount",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "报警值",
                dataIndex: "alarm_amount",
                menuDisabled: false,
                sortable: true,
            }],
            store: store
        });
        me.stockAmountAlarmGrid = me.__stockAmountAlarmGrid;
        return me.__stockAmountAlarmGrid;
    },


    getEmployeeDelaySaleAlarmInfo: function() {
        var me = this;
        if (me.__employeeSaleAmountAlarmGrid) {
            return me.__employeeSaleAmountAlarmGrid;
        }

        var modelName = "PSIReportEmployeeSaleAmountAlarm";
        Ext.define(modelName, {
            extend: "Ext.data.Model",
            fields: ["employee_name", "month", "sale_amount","alarm_amount"]
        });
        var store = Ext.create("Ext.data.Store", {
            autoLoad: false,
            model: modelName,
            data: [],
            pageSize: 20,
            proxy: {
                // type: "ajax",
                // actionMethods: {
                //     read: "POST"
                // },
                // url: PSI.Const.BASE_URL + "Home/Portal/getEmployeeDelaySaleAlarmInfo",
                // reader: {
                //     root: 'allData',
                //     totalProperty: 'totalCount'
                // }
            }
        });
        store.on("beforeload", function() {
        });

        me.__employeeSaleAmountAlarmGrid = Ext.create("Ext.grid.Panel", {
            viewConfig: {
                enableTextSelection: true
            },
            height:"100%",
            scroll: true,
            title: "业务员销售预警",
            border: 0,
            id:"__employeeSaleAmountAlarmGrid",
            columnLines: true,
            columns: [{
                xtype: "rownumberer",
                width: 40
            }, {
                header: "业务员姓名",
                dataIndex: "employee_name",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "月份",
                dataIndex: "month",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "销量",
                dataIndex: "sale_amount",
                menuDisabled: false,
                sortable: true,
            }, {
                header: "预警值",
                width: 200,
                dataIndex: "alarm_amount",
                menuDisabled: false,
                sortable: true,
            }],
            store: store
        });
        me.employeeSaleAmountAlarmGrid = me.__employeeSaleAmountAlarmGrid;
        return me.__employeeSaleAmountAlarmGrid;

    },


    queryAllPortalData:function () {
        var me = this;
        Ext.Ajax.request({
            url: PSI.Const.BASE_URL + "Home/Portal/getAllPortalData",
            method: "POST",
            callback: function(options, success, response) {

                if (success) {
                    var all_result = Ext.JSON.decode(response.responseText);
                    //准备各类数据

                    if(me.getPMoney() == 1){
                        //money_data处理
                        var data = all_result.money_data;
                        me.__moneyData_x_categories = [];
                        me.__moneyData_series_data = [];
                        me.__moneyData_series_data_bankMoney = [];
                        me.__moneyData_series_data_2buy = [];
                        me.__moneyData_series_data_2huikuan = [];
                        me.__moneyData_series_data_2pay = [];

                        if(data){
                                me.__moneyData_series_data_bankMoney.push(parseFloat(data.bankMoney));
                                me.__moneyData_series_data_2buy.push(parseFloat(data.to_buy));
                                me.__moneyData_series_data_2huikuan.push(parseFloat(data.to_huikuan));
                                me.__moneyData_series_data_2pay.push(parseFloat(data.to_pay));

                        }
                        me.__moneyData_series_data.push(
                            {
                                name:"账户总余额",
                                data:me.__moneyData_series_data_bankMoney,
                                type:"column"
                            },{
                                name:"待买货",
                                data:me.__moneyData_series_data_2buy,
                                type:"column"
                            },{
                                name:"待回款",
                                data:me.__moneyData_series_data_2huikuan,
                                type:"column"
                            },{
                                name:"待支付业务费",
                                data:me.__moneyData_series_data_2pay,
                                type:"column"
                            }
                        )
                        me.__moneyChartPanel.setSeriesData(me.__moneyData_series_data);
                        me.__moneyChartPanel.setXCategories(me.__moneyData_x_categories);
                        me.__moneyChartPanel.update();

                }



                    //purchase_data处理
                    if(me.getPPurchase() == 1){
                        var data = all_result.purchase_data;
                        me.__purchaseData_x_categories = [];
                        me.__purchaseData_series_data = [];
                        me.__purchaseData_series_data_purchaseMoney = [];
                        me.__purchaseData_series_data_purchaseAmount = [];
                        if(data.length>0){
                            for(var i = 0;i<6;i++){
                                me.__purchaseData_x_categories.push(data[i].month);
                                me.__purchaseData_series_data_purchaseMoney.push(parseFloat(data[i].purchaseMoney));
                                me.__purchaseData_series_data_purchaseAmount.push(parseFloat(data[i].purchaseAmount));
                            }
                        }
                        me.__purchaseData_series_data.push(
                            {
                                name:"采购额",
                                data:me.__purchaseData_series_data_purchaseMoney,
                                type:"column"
                            },{
                                name:"采购数量",
                                data:me.__purchaseData_series_data_purchaseAmount,
                                yAxis: 1


                            }
                        )
                        me.__purchaseChartPanel.setSeriesData(me.__purchaseData_series_data);
                        me.__purchaseChartPanel.setXCategories(me.__purchaseData_x_categories);
                        me.__purchaseChartPanel.update();

                    }


                    if(me.getPSale() == 1){
                        //sale_data处理
                        var data = all_result.sale_data;
                        me.__saleData_x_categories = [];
                        me.__saleData_series_data = [];
                        me.__saleData_series_data_saleMoney = [];
                        me.__saleData_series_data_profit = [];
                        me.__saleData_series_data_rate = [];
                        for(var i = 0;i<6;i++){
                            me.__saleData_x_categories.push(data[i].month);
                            me.__saleData_series_data_saleMoney.push(data[i]==""?0:parseFloat(data[i].saleMoney));
                            me.__saleData_series_data_profit.push(data[i]==""?0:parseFloat(data[i].profit));
                            me.__saleData_series_data_rate.push(data[i]==""?0:parseFloat(data[i].rate));
                        }
                        me.__saleData_series_data.push(
                            {
                                name:"销售额",
                                type:"column",
                                data:me.__saleData_series_data_saleMoney
                            },{
                                name:"毛利",
                                type:"column",
                                data:me.__saleData_series_data_profit
                            },{
                                name:"毛利率",
                                yAxis: 1,
                                data:me.__saleData_series_data_rate
                            }
                        )
                        me.__saleChartPanel.setSeriesData(me.__saleData_series_data);
                        me.__saleChartPanel.setXCategories(me.__saleData_x_categories);
                        me.__saleChartPanel.update();

                    }

                    if(me.getPInventory() == 1){
                        //库存数据处理
                        var data = all_result.inventory_data;
                        me.__inventoryData_x_categories = [];
                        me.__inventoryData_series_data = [];
                        me.__inventoryData_series_data_inventoryMoney = [];
                        me.__inventoryData_series_data_amount = [];
                        if(data.length>0) {
                            for (var i = 0; i < 6; i++) {
                                me.__inventoryData_x_categories.push(data[i].drug_name + data[i].guige);
                                me.__inventoryData_series_data_amount.push(parseInt(data[i].sum_amount));
                            }
                            me.__inventoryData_series_data.push(
                                {
                                    name: "库存数量",
                                    data: me.__inventoryData_series_data_amount
                                }
                            )
                            me.__inventoryChartPanel.setSeriesData(me.__inventoryData_series_data);
                            me.__inventoryChartPanel.setXCategories(me.__inventoryData_x_categories);
                        }
                        me.__inventoryChartPanel.update();
                    }


                }
            }
        });
    },
    queryAllAlarmData:function () {
        var me = this;
        var grid  = null;

        grid = me.__outDateDrugAlarmGrid;
        var el0  = grid.getEl() || Ext.getBody();

        grid = me.__stockAmountAlarmGrid;
        var el1  = grid.getEl() || Ext.getBody();

        // grid = me.__employeeSaleAmountAlarmGrid;
        // var el2  = grid.getEl() || Ext.getBody();

        el0.mask(PSI.Const.LOADING);
        el1.mask(PSI.Const.LOADING);
        // el2.mask(PSI.Const.LOADING);

        Ext.Ajax.request({
            url: PSI.Const.BASE_URL + "Home/Portal/getAllAlarmData",
            method: "POST",
            callback: function(options, success, response) {

                if (success) {
                    var all_result = Ext.JSON.decode(response.responseText);
                    //准备各类数据
                    me.__outDateDrugAlarmGrid.getStore().removeAll();
                    me.__outDateDrugAlarmGrid.getStore().add(all_result.drug_alarm);

                    me.__stockAmountAlarmGrid.getStore().removeAll();
                    me.__stockAmountAlarmGrid.getStore().add(all_result.stock_alarm);

                    me.__employeeSaleAmountAlarmGrid.getStore().removeAll();
                    me.__employeeSaleAmountAlarmGrid.getStore().add(all_result.employee_alarm);

                    el0.unmask();
                    el1.unmask();
                    // el2.unmask();
                }

            }
        });
    },

    getInfoPortal: function() {
        return {
            border: 0,
            html: "<h1>欢迎使用'E+'医药进销存管理系统</h1>"
        }
    }
});