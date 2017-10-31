/**
 * 药品信息导入
 * 
 * @author Baoyu Li
 */
Ext.define("PSI.Drug.DrugImportForm", {
	extend: "Ext.window.Window",

	config: {
		parentForm: null
	},

	/**
	 * 初始化组件
	 */
	initComponent: function() {
		var me = this;

		var buttons = [];

		buttons.push({
				text: "导入药品表格",
				formBind: true,
				iconCls: "PSI-button-ok",
				handler: function() {
					me.onUploadExcel();
				},
				scope: me
			},
			//{
			//	text : "确认药品信息",
			//	formBind : true,
			//	iconCls : "PSI-button-ok",
			//	handler : function() {
			//		me.onConfirmExcel();
			//	},
			//	scope : me
			//},
			{
				text: "关闭",
				handler: function() {
					me.close();
				},
				scope: me
			});

		Ext.apply(me, {
			title: "导入药品信息",
			modal: true,
			resizable: true,
			onEsc: Ext.emptyFn,
			width: 850,
			height: 150,
			layout: "fit",
			items: [{
				id: "importForm",
				xtype: "form",
				layout: {
					type: "table",
					columns: 1
				},
				height: "100%",
				bodyPadding: 5,
				fieldDefaults: {
					labelWidth: 60,
					labelAlign: "right",
					labelSeparator: "",
					msgTarget: 'side'
				},
				items: [{
						xtype: 'filefield',
						name: 'data_file',
						afterLabelTextTpl: '<span style="color:red;font-weight:bold" data-qtip="必需填写">*</span>',
						fieldLabel: '文件',
						labelWidth: 50,
						width: 830,
						msgTarget: 'side',
						allowBlank: false,
						anchor: '100%',
						buttonText: '选择药品信息文件'
					}, {
						html: "<a href=../Uploads/Drug/DrugModelFile.xls ><h4>药品信息导入模板下载</h4></a>",
						border: 0
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
				buttons: buttons
			}]
		});

		me.callParent(arguments);

	},

	onUploadExcel: function() {
		var me = this;
		var f = Ext.getCmp("importForm");
		var el = f.getEl();
		el.mask('正在导入...');
		f.submit({
			url: PSI.Const.BASE_URL + "Home/Drug/importDrug",
			method: "POST",
			success: function(form, action) {
				el.unmask();
				PSI.MsgBox.showInfo("数据导入成功" + action.result.msg);
				me.focus();
				me.close();
				me.getParentForm().refreshAllGrid();
			},
			failure: function(form, action) {
				el.unmask();
				PSI.MsgBox.showInfo(action.result.msg, function() {});
			}
		});
	},
});