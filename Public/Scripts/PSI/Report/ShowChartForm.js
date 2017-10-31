/**
 * 自销采购单 - 新建或编辑界面
 */
Ext.define("PSI.Report.ShowChartForm", {
	extend : "Ext.window.Window",

	config : {
		parentForm : null,
		entity : null,
		title:null,
        chart_title:null,//表格头部标题
        chart_type:null,//表格头部标题
        chart_subtitle:null,//表格子标题
        chart_xAxis_categories:null,//表格x轴条目
        chart_yAxis_title:null,//表格Y轴标题
        chart_series_data:null,//name和data的键值对数组
	},

	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		var columnChart = null;
		var lineChart = null;
		var pieChart = null;
		var entity = me.getEntity();
		var title = me.getTitle();
		var highchart = null;

        var chart_title = me.getChart_title();//表格头部标题
        var chart_type = me.getChart_type();//表格头部标题
        var chart_subtitle = me.getChart_subtitle();//表格子标题
        var chart_xAxis_categories = me.getChart_xAxis_categories();//表格x轴条目
        var chart_yAxis_title = me.getChart_yAxis_title();//表格Y轴标题
        var chart_series_data = me.getChart_series_data();//name和data的键值对数组

        Ext.apply(me, {
			title : title == null? "":title,
			modal : true,
			resizable : true,
			onEsc : Ext.emptyFn,
			width : 850,
			height : 550,
            xtype: "tabpanel",
            layout:'anchor',
            items:[
			    me.getChartPanel()
            ]
		});
		me.callParent(arguments);

    },



	onWndShow : function() {
    },
    getChartPanel:function () {
	    var me = this;
	    if(me.__chartPanel){
	        return me.__chartPanel;
        }
        me.__chartPanel = Ext.create('PSI.Report.ShowChartPanel', {
            bodyPadding: 5,  // 避免Panel中的子元素紧邻边框
            width: 800,
            height: 500,
            anchor:'100% 100%',
            id:"chartPanel",
            chart_title:me.chart_title,//表格头部标题
            chart_type:me.chart_type,//表格头部标题
            chart_subtitle:me.chart_subtitle,//表格子标题
            chart_xAxis_categories:me.chart_xAxis_categories,//表格x轴条目
            chart_yAxis_title:me.chart_yAxis_title ,//表格Y轴标题
            chart_series_data:me.chart_series_data,//name和data的键值对数组
        });

        me.highchart = me.__chartPanel;
	    return me.__chartPanel;
    },
	onWndClose : function() {
		var me = this;
	}


});