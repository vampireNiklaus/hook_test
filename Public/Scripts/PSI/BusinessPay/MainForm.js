/**
 *业务支付 - 主界面
 *
 * @author Baoyu Li
 */
var summaryFilters = ['pay_amount']
var records = {}
Ext.define("PSI.BusinessPay.MainForm", {
	extend: "Ext.panel.Panel",

	config: {
		pAddBusinessPay: null,
		pEditBusinessPay: null,
		pDeleteBusinessPay: null,
		pImportBusinessPay: null,
		pExportBusinessPay: null,
		pVerifyBusinessPay: null,
		pRevertVerifyBusinessPay: null,
		pViewBusinessPayDetail: null,
		pBusinessPaySearch: null,
	},

	/**
	 * 初始化组件
	 */
	initComponent: function() {
		var me = this;
		me.newBusinessPayGrid = null;
		me.allBusinessPayGrid = null;

		me.modelName = "PSINewBusinessPay";
		Ext.define(me.modelName, {
			extend: "Ext.data.Model",
			fields: ["id", "employee_id", "employee_name", "pay_account_id", "pay_account_name", "pay_amount", "bill_date", "bill_code",
				"creator_id", "creator_name", "note", "status", "pay_month", "verifier_id", "verifier_name",
				"operation_detail", "create_time", "operate_info"
			]
		});

		Ext.apply(me, {
			border: 0,
			layout: "border",
			tbar: [{
				text: "新增业务支付条目",
				disabled: me.getPAddBusinessPay() == "0",
				iconCls: "PSI-button-add",
				handler: me.onAddBusinessPayItem,
				scope: me
			}, {
				text: "编辑业务支付条目",
				disabled: me.getPEditBusinessPay() == "0",
				iconCls: "PSI-button-edit",
				handler: me.onEditBusinessPay,
				scope: me
			}, {
				text: "删除业务支付条目",
				disabled: me.getPDeleteBusinessPay() == "0",
				iconCls: "PSI-button-delete",
				handler: me.onDeleteBusinessPay,
				scope: me
			}, "-", {
				text: "审核",
				disabled: me.getPVerifyBusinessPay() == "0",
				iconCls: "PSI-button-verify",
				scope: me,
				handler: me.onCommit,
				id: "buttonVerify"
			}, {
				text: "反审核",
				iconCls: "PSI-button-revert-verify",
				disabled: me.getPRevertVerifyBusinessPay() == "0",
				scope: me,
				handler: me.onCommitReturn,
				id: "buttonRevertVerify"
			}, "-", {
				id: "editSMSEnable",
				labelWidth: 50,
				width: 100,
				labelAlign: "right",
				labelSeparator: "",
				fieldLabel: "短信开关",
				margin: "5, 0, 0, 0",
				valueField: "id",
				displayField: "name",
				xtype: "combo",
				store: new Ext.data.ArrayStore({
					fields: ['id', 'name'],
					data: [
						[0, '关'],
						[1, '开']
					]
				}),
				value: 1,
				allowBlank: false,
				blankText: "没有选择短信开关",
			}, "-", {
				text: "导出业务支付信息",
				disabled: me.getPExportBusinessPay() == 0,
				iconCls: "PSI-button-excelexport",
				handler: me.onExportBusinessPay,
				scope: me
			}, "-", {
				text: "关闭",
				iconCls: "PSI-button-exit",
				handler: function() {
					location.replace(PSI.Const.BASE_URL);
				}
			}],
			items: [me.getPBusinessPaySearch() == "0" ? {} : {
				region: "north",
				border: 0,
				height: 60,
				title: "查询条件",
				collapsible: true,
				layout: {
					type: "table",
					columns: 5
				},
				items: [me.getPBusinessPaySearch() == "0" ? {} : {
					id: "editQueryName",
					labelWidth: 60,
					labelAlign: "right",
					labelSeparator: "",
					fieldLabel: "业务员",
					margin: "5, 0, 0, 0",
					xtype: "psi_employeefield",
					listeners: {
						specialkey: {
							fn: me.onQueryEditSpecialKey,
							scope: me
						}
					}
				}, {
					id: "editQueryEmployeeId",
					xtype: "hidden",

				}, {
					id: "editQueryType",
					labelWidth: 60,
					labelAlign: "right",
					labelSeparator: "",
					fieldLabel: "单据类型",
					margin: "5, 0, 0, 0",
					valueField: "id",
					displayField: "name",
					xtype: "combo",
					store: new Ext.data.ArrayStore({
						fields: ['id', 'name'],
						data: [
							[-1, '全部'],
							[0, '未审核'],
							[1, '已审核']
						]
					}),
					value: 0,
					allowBlank: false,
					blankText: "没有选择业务支付等级",
					listeners: {
						specialkey: {
							fn: me.onQueryEditSpecialKey,
							scope: me
						}
					}
				}, {
					id: "editQueryFromDT",
					xtype: "datefield",
					margin: "5, 0, 0, 0",
					format: "Y-m-d",
					labelAlign: "right",
					labelSeparator: "",
					value: new Date("2017-1-1"),
					fieldLabel: "业务日期（起）",
					listeners: {
						specialkey: {
							fn: me.onQueryEditSpecialKey,
							scope: me
						}
					}
				}, {
					id: "editQueryToDT",
					xtype: "datefield",
					margin: "5, 0, 0, 0",
					format: "Y-m-d",
					labelAlign: "right",
					labelSeparator: "",
					fieldLabel: "业务日期（止）",
					value: new Date(),
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
						iconCls: "PSI-button-refresh",
						margin: "5, 0, 0, 20",
						handler: me.onQuery,
						scope: me
					}, {
						xtype: "button",
						text: "清空查询条件",
						width: 100,
						iconCls: "PSI-button-cancel",
						margin: "5, 0, 0, 5",
						handler: me.onClearQuery,
						scope: me
					}]
				}]
			}, {
				region: "center",
				xtype: "panel",
				layout: "fit",
				border: 0,
				items: me.getNewBusinessPayGrid()
			}]
		});

		me.callParent(arguments);

		me.queryTotalBusinessPayCount();
		me.freshBusinessPayGrid();
		me.__queryEditNameList = ["editQueryName",
			"editQueryType"
		];
	},
	//获取新添加未确认的业务支付记录
	getNewBusinessPayGrid: function() {
		var me = this;
		var sm = Ext.create('Ext.selection.CheckboxModel', {
			injectCheckbox: 1, //checkbox位于哪一列，默认值为0
			//mode:'single',//multi,simple,single；默认为多选multi
			//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
			//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
			//enableKeyNav:false
		});
		if (me.__newBusinessPayGrid) {
			return me.__newBusinessPayGrid;
		}
		var modelName = "PSIBusinessPayModel";
		Ext.define(modelName, {
			extend: "Ext.data.Model",
			fields: ['id', "employee_id", 'pay_amount', "employee_name", "employee_bank_account", 'pay_account_num', "pay_account_id",
				'pay_account_name', 'pay_month', 'bill_code', 'bill_date', 'status'
			]
		});
		var store = Ext.create("Ext.data.Store", {
			autoLoad: true,
			model: modelName,
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/BusinessPay/getNewBusinessPay",
				reader: {
					root: 'all_data',
					totalProperty: 'totalCount'
				}
			}
		});
		store.on("beforeload", function() {
			store.proxy.extraParams = me.getQueryParam();
		});
		store.on("load", function(e, records, successful) {});
		// var sm = Ext.create('Ext.selection.CheckboxModel',
		// 	{
		// 		injectCheckbox:0,//checkbox位于哪一列，默认值为0
		// 		//mode:'single',//multi,simple,single；默认为多选multi
		// 		//checkOnly:true,//如果值为true，则只用点击checkbox列才能选中此条记录
		// 		//allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
		// 		//enableKeyNav:false
		// 	});
		me.__newBusinessPayGrid = Ext.create("Ext.grid.Panel", {
			viewConfig: {
				enableTextSelection: true
			},
			scroll: true,
			forceFit: true,
			border: 0,
			title: "业务支付单列表",
			features: [{
				ftype: 'summary',
				dock: 'bottom'
			}],
			columnLines: true,
			selModel: sm,
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				width: 40
			}), {
				header: "状态",
				dataIndex: "status",
				renderer: function(v) {
					switch (v) {
						case '0':
							return "<span style='color:red'>待确认</span>";
							break;
						case '1':
							return "<span style='color:green'>已审核</span>";
							break;
					}
				}
			}, {
				header: "单据编号",
				dataIndex: "bill_code",
				menuDisabled: false,
				width: 200,
				sortable: false
			}, {
				header: "业务员",
				dataIndex: "employee_name",
				menuDisabled: false,
				sortable: true,
				width: 200,
				renderer: function(v) {
					return "<b style='color:#000'>" + v + "</b>";
				}
			}, {
				header: "业务员银行卡号",
				dataIndex: "employee_bank_account",
				menuDisabled: false,
				sortable: true,
				width: 200,
				renderer: function(v) {
					return "<b style='color:#000'>" + v + "</b>";
				}
			}, {
				header: "待支付金额",
				dataIndex: "pay_amount",
				menuDisabled: false,
				sortable: false,
				renderer: function(v) {
					return "<b style='color:red'>" + v + "</b>";
				}
			}, {
				header: "支付账户",
				dataIndex: "pay_account_name",
				menuDisabled: false,
				sortable: false,
				width: 200,
			}, {
				header: "银行卡号",
				dataIndex: "pay_account_num",
				menuDisabled: false,
				sortable: false,
				width: 200,
			}, {
				header: "所支付月份",
				dataIndex: "pay_month",
			}, {
				header: "操作详情",
				dataIndex: "operate_info",
			}, {
				header: "支付日期",
				dataIndex: "bill_date",
				renderer: function(v) {
					if (v == '0000-00-00') return '';
					return v;
				}
			}],
			store: store,
			// plugins: [{
			// 	ptype: 'rowexpander',
			// 	rowBodyTpl: [
			// 		'<div id="r_{id}" style="margin: 5px 0 30px 80px">',
			// 		'</div>'
			// 	]
			// }],
			listeners: {
				itemdblclick: {
					fn: function() {
						me.onEditBusinessPay();
						return false;
					},
					scope: me
				},
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
                    me.__newBusinessPayGrid.update();
				},
			}
		});

		var summaryColumns = me.__newBusinessPayGrid.columns;
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

		me.__newBusinessPayGrid.view.on('expandBody', function(rowNode, record, expandRow, eOpts) {
			if (me.getPViewBusinessPayDetail() == "0") {
				PSI.MsgBox.showInfo("没有查看销售详情权限");
				return;
			}
			me.displayInnerGrid('r_' + record.get('id'));
		});

		me.__newBusinessPayGrid.view.on('collapsebody', function(rowNode, record, expandRow, eOpts) {
			me.destroyInnerGrid('r_' + record.get('id'));
			if (me.getPViewBusinessPayDetail() == "0") {
				PSI.MsgBox.showInfo("没有查看销售详情权限");
				return;
			}
		});
		me.newBusinessPayGrid = me.__newBusinessPayGrid;
		return me.__newBusinessPayGrid;
	},

	displayInnerGrid: function(renderId) {
		var modelName = renderId + '_model';
		Ext.define(modelName, {
			extend: 'Ext.data.Model',
			fields: ["employee_id", "employee_des", "employee_profit", 'pay_sum_money',
				"employee_name", "drug_id", "drug_name", "drug_guige", "drug_manufacture",
				"hospital_id", "hospital_name", "drug2deliver_id", "deliver_id", "deliver_name",
				"batch_num", "sell_amount", "sell_date", "create_time", 'bill_code',
				"creator_id", "note", "if_paid", "pay_time", "paybill_id", "status", "sell_month"
			]
		});
		var store = Ext.create('Ext.data.Store', {
			autoLoad: false,
			model: modelName,
			data: [],
			pageSize: 20,
			proxy: {
				type: "ajax",
				actionMethods: {
					read: "POST"
				},
				url: PSI.Const.BASE_URL + "Home/BusinessPay/getDailySellById",
				extraParams: {
					'id': renderId
				},
				reader: {
					root: 'all_data',
					totalProperty: 'totalCount'
				}
			}
		});
		var innerGrid = Ext.create('Ext.grid.Panel', {
			store: store,
			forceFit: true,
			columns: [Ext.create("Ext.grid.RowNumberer", {
				text: "序号",
				width: 30
			}), {
				header: "销售月份",
				dataIndex: "sell_month",
				width: 30,
				menuDisabled: false,
				sortable: false,
			}, {
				header: "业务员",
				dataIndex: "employee_name",
				width: 30,
				menuDisabled: false,
				sortable: false,
			}, {
				header: "业务员身份",
				dataIndex: "employee_des",
				width: 40,
				menuDisabled: false,
				sortable: false,
			}, {
				header: "支付金额",
				dataIndex: "pay_sum_money",
				menuDisabled: false,
				width: 40,
				sortable: true,
				renderer: function(v) {
					return "<b style='color:blue'>" + v + "</b>";
				}
			}, {
				header: "销售数量",
				dataIndex: "sell_amount",
				menuDisabled: false,
				width: 40,
				sortable: true,
				renderer: function(v) {
					return "<b style='color:blue'>" + v + "</b>";
				}
			}, {
				header: "业务日期",
				dataIndex: "sell_date",
				width: 30,
				menuDisabled: false,
				sortable: true,
			}, {
				header: "药品",
				dataIndex: "drug_name",
				width: 150,
				menuDisabled: false,
				sortable: true,
			}, {
				header: "医院",
				width: 150,
				dataIndex: "hospital_name",
				menuDisabled: false,
				sortable: true,
			}],
			columnLines: true,
			renderTo: renderId,
		});
		innerGrid.getEl().swallowEvent([
			'mousedown', 'mouseup', 'click',
			'contextmenu', 'mouseover', 'mouseout',
			'dblclick', 'mousemove'
		]);
		store.load();
	},
	destroyInnerGrid: function(record) {
		var parent = document.getElementById(record);
		var child = parent.firstChild;

		while (child) {
			child.parentNode.removeChild(child);
			child = child.nextSibling;
		}
	},

	gotoBusinessPayGridRecord: function() {
		var me = this;
		var grid = me.BusinessPayGrid;
		var store = grid.getStore();
		if (id) {
			var r = store.findExact("id", id);
			if (r != -1) {
				grid.getSelectionModel().select(r);
			} else {
				grid.getSelectionModel().select(0);
			}
		}
	},
	refreshRegionCount: function() {
		var me = this;
		var item = me.getRegionGrid().getSelectionModel().getSelection();
		if (item == null || item.length != 1) {
			return;
		}
	},

	getQueryParam: function() {
		var me = this;
		var result = {};
		var employee_name = Ext.getCmp("editQueryName").getValue();
		if (employee_name) {
			result.employee_name = employee_name;
		} else {
			result.employee_name = "";
		}

		var status = Ext.getCmp("editQueryType").getValue();
		if (status != -1) {
			result.status = status;
		}

		var bill_date_from = Ext.getCmp("editQueryFromDT").getValue();
		if (bill_date_from != "") {
			result.bill_date_from = bill_date_from;
		}

		var bill_date_to = Ext.getCmp("editQueryToDT").getValue();
		if (bill_date_to != "") {
			result.bill_date_to = bill_date_to;
		}

		if (bill_date_from != "" && bill_date_to != "") {
			if (bill_date_from > bill_date_to) {
				var temp = bill_date_from;
				bill_date_from = bill_date_to;
				bill_date_to = temp;
				result.bill_date_from = bill_date_from;
				result.bill_date_to = bill_date_to;
			}
		}
		return result;
	},

	/**
	 * 新增BusinessPay
	 */
	onAddBusinessPay: function() {
		if (this.getRegionGrid().getStore().getCount() == 0) {
			PSI.MsgBox.showInfo("没有选择区域，请先选择区域");
			return;
		}
		var form = Ext.create("PSI.BusinessPay.BusinessPayEditForm", {
			parentForm: this
		});
		form.show();
	},

	/**
	 * 编辑BusinessPay
	 */
	onEditBusinessPay: function() {
		var me = this;
		if (me.getPEditBusinessPay() == "0") {
			PSI.MsgBox.showInfo("没有编辑权限，无法编辑！");
			return;
		}
		var item = this.newBusinessPayGrid.getSelectionModel().getSelection();;
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("请选择支付单");
			return;
		}
		// if (item[0].get('status') == 1) {
		// PSI.MsgBox.showInfo("已审核，无法编辑！");
		// return;
		// }
		var form = Ext.create("PSI.BusinessPay.BusinessPayEditForm", {
			parentForm: this,
			entity: item[0],
			status: item[0].get('status')
		});

		form.show();
	},

	/**
	 * 删除业务支付
	 */
	onDeleteBusinessPay: function() {
		var me = this;
		var item = me.newBusinessPayGrid.getSelectionModel().getSelection();

		if (item == null || item.length == 0) {
			PSI.MsgBox.showInfo("请选择要删除的业务支付");
			return;
		}


		var info = "确认要删除选中的" + item.length + "条业务支付单吗？";

		PSI.MsgBox.confirm(info, function() {
			var el = Ext.getBody();
			var params = me.getSelects();
			el.mask("正在删除中...");
			Ext.Ajax.request({
				url: PSI.Const.BASE_URL + "Home/BusinessPay/deleteBusinessPay",
				method: "POST",
				params: params,
				callback: function(options, success, response) {
					el.unmask();

					if (success) {
						var data = Ext.JSON
							.decode(response.responseText);
						if (data.success) {
							PSI.MsgBox.tip("成功完成删除操作");
							me.freshBusinessPayGrid();
						} else {
							PSI.MsgBox.showInfo(data.msg);
						}
					} else {
						PSI.MsgBox.showInfo("网络错误", function() {
							window.location.reload();
						});
					}
				}
			});
		});
	},

	/**
	 * 获取选中时候的id
	 */
	onSelectBusinessPay: function() {
		var item = this.newBusinessPayGrid.getSelectionModel().getSelection();
		return item[0];
	},

	/**
	 * 导入业务支付信息
	 */
	onAddBusinessPayItem: function() {
		var form = Ext.create("PSI.BusinessPay.BusinessPayEditForm", {
			parentForm: this,
		});
		form.show();
	},

	/**
	 * 导出业务支付信息
	 */
	onExportBusinessPay: function() {
		//var url = PSI.Const.BASE_URL + "Home/BusinessPay/exportBusinessPay";
		//window.open(url);
		var me = this;
		var config = {
			store: me.__newBusinessPayGrid.getStore(),
			title: "业务支付业务支付单表格"
		};
		//var tab=tabPanel.getActiveTab();//当前活动状态的Panel
		ExportExcel(me.__newBusinessPayGrid, config); //调用导出函数
	},

	getExportData: function() {
		var result = {
			items: []
		};
		var store = this.newBusinessPayGrid.getStore();
		for (var i = 0; i < store.getCount(); i++) {
			var item = store.getAt(i);
			result.items.push({
				"状态": item.get("status") == 0 ? "待确认" : "已审核",
				"单据编号": item.get("bill_code"),
				"业务员": item.get("employee_name"),
				"待支付金额": item.get("pay_amount"),
				"支付账户": item.get("pay_account_name"),
				"银行卡号": item.get("pay_account_num"),
				"所支付月份": item.get("pay_month"),

			});
		}
		return Ext.JSON.encode(result);
	},

	onQueryEditSpecialKey: function(field, e) {
		if (e.getKey() === e.ENTER) {
			var me = this;
			var id = field.getId();
			if (id === "editQueryName" || id === "editQueryType" || id === "editQueryFromDT" || id === "editQueryToDT") {
				me.onQuery();
			}
		}
	},

	onLastQueryEditSpecialKey: function(field, e) {
		if (e.getKey() === e.ENTER) {
			this.onQuery();
		}
	},


	/**
	 * 查询
	 */
	onQuery: function() {
		var me = this;
		me.freshBusinessPayGrid();
	},

	/**
	 * 清除查询条件
	 */
	onClearQuery: function() {
		var me = this;
		var nameList = me.__queryEditNameList;
		for (var i = 0; i < nameList.length; i++) {
			var name = nameList[i];
			var edit = Ext.getCmp(name);
			if (edit) {
				edit.setValue(null);
			}
		}

		me.onQuery();
	},


	/**
	 * 刷新业务支付Grid
	 */
	freshBusinessPayGrid: function(id) {
		var me = this;
		var grid = me.newBusinessPayGrid;
		var store = grid.getStore();
		store.removeAll();
		store.load();
	},

	/**
	 * 刷新区域Grid
	 */
	freshRegionGrid: function() {
		var me = this;
		var grid = me.regionGrid;
		var store = grid.getStore();
		store.load();


	},



	onRegionTreeStoreLoad: function() {

	},
	onRegionGridNodeSelect: function(record) {
		if (!record) {
			return;
		}
		this.onRegionGridSelect();
	},

	onRegionGridSelect: function() {
		var me = this;
		me.BusinessPayGrid.getStore().currentPage = 1;
		me.freshBusinessPayGrid();
	},
	queryTotalBusinessPayCount: function() {
		var me = this;
		// Ext.Ajax.request({
		// 	url : PSI.Const.BASE_URL + "Home/BusinessPay/getTotalBusinessPayCount",
		// 	method : "POST",
		// 	params : me.getQueryParamForRegion(),
		// 	callback : function(options, success, response) {
		//
		// 		if (success) {
		// 			var data = Ext.JSON.decode(response.responseText);
		// 			Ext.getCmp("fieldTotalBusinessPayCount").setValue("共有业务支付"
		// 				+ data.cnt + "家");
		// 		}
		// 	}
		// });
	},
	getQueryParamForRegion: function() {
		var me = this;
		var result = {};
		return result;
	},


	//获取选中的
	getSelects: function() {
		var me = this;
		var result = [];
		var grid = me.newBusinessPayGrid;
		var selects = grid.getSelectionModel().getSelection();

		//遍历获取id，塞进数组
		for (var i in selects) {
			result.push(selects[i].get('id'));
		}
		return {
			'list': JSON.stringify(result)
		};
	},

	// 审核
	onCommit: function() {
		var me = this;
		var item = me.newBusinessPayGrid.getSelectionModel().getSelection();
		var list = [];
		if (item == null || item.length == 0) {
			PSI.MsgBox.showInfo("没有选择要操作的业务支付单");
			return;
		}

		for( var i  =0;i<item.length;i++){
			if(item[i]['pay_account_name'] == "" ||item[i]['pay_account_num'] == "" ||item[i]['pay_month'] == "" ||item[i]['pay_account_id'] == ""){
                PSI.MsgBox.showInfo("请先选择付款账号,请先选择支付日期,请先选择支付月份");
                return;
			}
		}
		// for(var i in item){
		// 	if(item[i].get('status')==0){
		// 		list.push(item[i].get('id'));
		// 	}
		// }
		if (item[0].get('status') == 0) {
			list.push(item[0].get('id'));
		}

		if (list.length == 0) {
			PSI.MsgBox.showInfo("该业务支付单已通过审核！");
			return;
		}

		var info = "确认选中的业务支付单审核通过?（自动过滤已审核）";
		// PSI.MsgBox.verify(info, function() {
		// 	//审核通过
		// 	me.verifyRequest(list,'yes')
		// },function(){
		// 	//审核不通过
		// 	me.verifyRequest(list,'no')
		// });
		PSI.MsgBox.confirm(info, function() {
			me.verifyRequest(list, 'yes');
		})
	},
	// 反审核
	onCommitReturn: function() {
		var me = this;
		var item = me.newBusinessPayGrid.getSelectionModel().getSelection();
		var list = [];
		if (item == null || item.length != 1) {
			PSI.MsgBox.showInfo("没有选择要操作的业务支付单");
			return;
		}
		// for(var i in item){
		// 	if(item[i].get('status')==1){
		// 		list.push(item[i].get('id'));
		// 	}
		// }
		if (item[0].get('status') == 1) {
			list.push(item[0].get('id'));
		}
		console.log(list);

		if (list.length == 0) {
			PSI.MsgBox.showInfo("该业务支付单无法进行此操作");
			return;
		}

		var info = "确认要反审核该业务支付单？";
		PSI.MsgBox.confirm(info, function() {
			me.verifyRequest(list, 'return')
		});
	},

	verifyRequest: function(list, type) {
		var list = JSON.stringify(list);
		var me = this;
		var el = Ext.getBody();
		el.mask("正在提交中...");
		Ext.Ajax.request({
			url: PSI.Const.BASE_URL + "Home/BusinessPay/businessPayStatus",
			method: "POST",
			params: {
				list: list,
				type: type,
				sms_enable: Ext.getCmp("editSMSEnable").getValue()
			},
			callback: function(options, success, response) {
				el.unmask();
				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					if (data.success) {
						PSI.MsgBox.showInfo("操作成功", function() {
							me.freshBusinessPayGrid();
						});
					} else {
						PSI.MsgBox.showInfo(data.msg);
					}
				} else {
					PSI.MsgBox.showInfo("网络错误", function() {
						window.location.reload();
					});
				}
				me.newBusinessPayGrid.deselectAll();
			}
		});
	},

});