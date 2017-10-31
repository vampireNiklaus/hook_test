/**
 * 自销采购单 - 新建或编辑界面
 */
Ext.define("PSI.Report.ShowChartPanel", {
    extend : "Ext.panel.Panel",

    collapsible: true,
    config : {
        chart_title:null,//表格头部标题
        chart_type:null,//表格头部标题
        chart_subtitle:null,//表格子标题
        chart_xAxis_categories:null,//表格x轴条目
        chart_yAxis_title:null,//表格Y轴标题
        chart_yAxis:null,//表格Y轴标题
        chart_series_data:null,//name和data的键值对数组
    },
    highchart: null,
    initComponent : function() {
        var me = this;
        me.__readOnly = false;
        var chart_title = me.getChart_title();//表格头部标题
        var chart_type = me.getChart_type();//表格头部标题
        var chart_subtitle = me.getChart_subtitle();//表格子标题
        var chart_xAxis_categories = me.getChart_xAxis_categories();//表格x轴条目
        var chart_yAxis_title = me.getChart_yAxis_title();//表格Y轴标题
        var chart_yAxis = me.getChart_yAxis();//表格Y轴标题
        var chart_series_data = me.getChart_series_data();//name和data的键值对数组
        Ext.apply(me, {
            border : 0,
            layout : "border",
            title: chart_title,
        });
        me.callParent(arguments);
    },

    afterComponentLayout: function(width, height, oldWidth, oldHeight) {
        var me = this;

        var chartId = me.id + "-body";

        highchart =  new Highcharts.Chart(chartId, {
            chart: {
                type: me.chart_type == null? 'line':me.chart_type                         //指定图表的类型，默认是折线图（line）
            },
            credits: {
                enabled:false//不显示highCharts版权信息
            },
            exporting:
                {
                    enabled:true,//默认为可用，当设置为false时，图表的打印及导出功能失效
                },
            title: {
                text: me.chart_title              //指定图表标题
            },
            xAxis: {
                categories: me.chart_xAxis_categories //指定x轴分组
            },
            yAxis:
                me.getChart_yAxis() == null?
                {
                    title: {
                        text: me.chart_yAxis_title                //指定y轴的标题
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                }   :   me.getChart_yAxis(),
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true          // 开启数据标签
                    },
                    enableMouseTracking: true // 关闭鼠标跟踪，对应的提示框、点击事件会失效
                },
                bar: {
                    dataLabels: {
                        enabled: true,
                        allowOverlap: true
                    }
                },
                column: {
                    dataLabels: {
                        enabled: true,
                        allowOverlap: true
                    }
                }
            },
            tooltip: {
                valueSuffix: ''
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: me.chart_series_data
        });

    },
    setXCategories:function (data) {
        var me = this;
        me.chart_xAxis_categories = data;
    },
    setSeriesData:function (data) {
        var me = this;
        me.chart_series_data = data;
    }
});