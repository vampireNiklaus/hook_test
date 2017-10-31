/**
 * 销售信息导入
 * 
 * @author Baoyu Li
 */
Ext.define("PSI.DailySell.DailySellsImportForm", {
	extend : "Ext.window.Window",

	config : {
		parentForm : null
	},

	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;

		var buttons = [];

		buttons.push({
					text : "导入销售表格",
					formBind : true,
					iconCls : "PSI-button-ok",
					handler : function() {
						me.onUploadExcel();
					},
					scope : me
				},
				//{
				//	text : "确认销售信息",
				//	formBind : true,
				//	iconCls : "PSI-button-ok",
				//	handler : function() {
				//		me.onConfirmExcel();
				//	},
				//	scope : me
				//},
				{
					text : "关闭",
					handler : function() {
						me.close();
					},
					scope : me
				});

		Ext.apply(me, {
			title : "导入销售信息",
			modal : true,
			resizable : true,
			onEsc : Ext.emptyFn,
			width : 850,
			height : 150,
			layout : "fit",
			items : [{
				id : "importForm",
				xtype : "form",
				layout : {
					type : "table",
					columns : 1
				},
				height : "100%",
				bodyPadding : 5,
				fieldDefaults : {
					labelWidth : 60,
					labelAlign : "right",
					labelSeparator : "",
					msgTarget : 'side'
				},
				items : [{
					xtype : 'filefield',
					name : 'data_file',
					afterLabelTextTpl : '<span style="color:red;font-weight:bold" data-qtip="必需填写">*</span>',
					fieldLabel : '文件',
					labelWidth : 50,
					width : 830,
					msgTarget : 'side',
					allowBlank : false,
					anchor : '100%',
					buttonText : '选择销售信息文件'
				}, {
					html : "<a href=../Uploads/DailySell/dailySellModelFile.xls ><h4>销售信息导入模板下载</h4></a>",
					border : 0
				}
				//,{
				//	xtype : 'psi_dailySell_importPanel',
				//	colspan : 1,
				//	collapsed:false,
				//	width : 850,
				//	height : 700,
				//	collapsible:false,
				//	align : 'center',
				//}

				],
				buttons : buttons
			}]
		});

		me.callParent(arguments);

		me.dailySellItemPanel = Ext.ComponentQuery.query("psi_dailySell_importPanel")[0];
	},

	onUploadExcel : function() {
		var me = this;
		var f = Ext.getCmp("importForm");
		var el = f.getEl();
		el.mask('正在导入...');
		f.submit({
					url : PSI.Const.BASE_URL + "Home/DailySell/import",
					method : "POST",
					success : function(form, action) {
						el.unmask();
						//var data = Ext.JSON.decode(action.result);
						//var matchedStore = me.dailySellItemPanel.matchedDailySellGrid.getStore();
						//var unMatchedStore = me.dailySellItemPanel.unMatchedDailySellGrid.getStore();
						//matchedStore.removeAll();
						//unMatchedStore.removeAll();
						//matchedStore.add(data.matchedItems);
						//unMatchedStore.add(data.unMatchedItems);
						PSI.MsgBox.showInfo("数据导入成功" + action.result.msg);
						me.focus();
						me.close();
						me.getParentForm().refreshAllGrid();
					},
					failure : function(form, action) {
						el.unmask();
						PSI.MsgBox.showInfo(action.result.msg, function() {
								});
					}
				});
	},
	onConfirmExcel : function() {
		var me = this;
		var f = Ext.getCmp("importForm");
		var el = f.getEl();
		el.mask('正在导入...');
		f.submit({
			url : PSI.Const.BASE_URL + "Home/DailySell/import",
			method : "POST",
			success : function(form, action) {
				el.unmask();

				PSI.MsgBox.showInfo("数据导入成功" + action.result.msg);
				me.focus();
				me.close();
				me.getParentForm().freshGoodsGrid();
			},
			failure : function(form, action) {
				el.unmask();
				PSI.MsgBox.showInfo(action.result.msg, function() {
					Ext.getCmp("editFileData").focus();
				});
			}
		});
	},
});