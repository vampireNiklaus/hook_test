/**
 * 自销税票单 - 编辑界面
 */
Ext.define("PSI.SelfTax.SelfTaxEditForm", {
	extend: "Ext.window.Window",
	alias: "widget.psi_self_tax",

	config: {
		parentForm: null,
		entity: null
	},

	/**
	 * 初始化组件
	 */
	initComponent: function() {
		var me = this;
		var entity = me.getEntity();

		me.adding = entity == null;

		var buttons = [];
		if (!entity) {
			buttons.push({
				text: "保存并继续新增",
				formBind: true,
				handler: function() {
					me.onOK(true);
				},
				scope: me
			});
		}

		buttons.push({
			id: 'btn-save',
			text: entity.get("status") == 1 ? "审核通过" : "保存",
			formBind: true,
			iconCls: "PSI-button-ok",
			handler: function() {
				me.onOK(false);
			},
			scope: me
		}, {
			text: entity == null ? "关闭" : "取消",
			handler: function() {
				me.close();
			},
			scope: me
		});


		Ext.apply(me, {
			title: "编辑自销税票单",
			modal: true,
			resizable: true,
			onEsc: Ext.emptyFn,
			width: 600,
			height: 600,
			layout: "fit",
			items: [{
				id: "editForm",
				xtype: "form",
				layout: {
					type: "table",
					columns: 6
				},
				height: "100%",
				bodyPadding: 10,
				defaultType: 'textfield',
				fieldDefaults: {
					labelWidth: 80,
					labelAlign: "right",
					labelSeparator: "：",
					msgTarget: 'side',
				},
				items: [{
					xtype: "hidden",
					name: "id",
					value: entity == null ? null : entity.get("id")
				}, {
					fieldLabel: "税票单号",
					xtype: "hidden",
					colspan: 3,
					width: 250,
					value: entity.get("bill_code"),
				}, {
					fieldLabel: "入库单号",
					xtype: "hidden",
					colspan: 3,
					value: entity.get("stock_sub_bill_code"),
				}, {
					fieldLabel: "药品",
					xtype: 'displayfield',
					colspan: 6,
					width: 550,
					value: entity.get("common_name"),
				}, {
					fieldLabel: "剂型",
					xtype: 'displayfield',
					value: entity.get("jx"),
					colspan: 2,
				}, {
					fieldLabel: "规格",
					xtype: 'displayfield',
					colspan: 4,
					width: 300,
					value: entity.get("guige"),
				}, {
					fieldLabel: "生产厂家",
					xtype: 'displayfield',
					value: entity.get("manufacturer"),
					colspan: 6,
				}, {
					fieldLabel: "供应商",
					xtype: 'displayfield',
					colspan: 6,
					value: entity.get("supplier_name"),
				}, {
					fieldLabel: "开票总量",
					colspan: 2,
					width: 200,
					xtype: "displayfield",
					value: entity.get("kaipiao_amount"),
				}, {
					id: 'need_amount',
					fieldLabel: "剩余开票量",
					colspan: 4,
					xtype: "displayfield",
					value: entity.get("need_amount"),
					renderer: function(value) {
						return "<b style='color:red'>" + value + "</b>";
					},
				}, {
					id: "supplier",
					fieldLabel: "开票公司",
					xtype: "displayfield",
					colspan: 3,
					value: entity.get("supplier_name"),
					width: 300,
				}, {
					id: "deliver",
					fieldLabel: "配送公司",
					xtype: "displayfield",
					colspan: 3,
					value: entity.get("deliver_name"),
					width: 300,
				}, {
					id: "in_stock_date",
					fieldLabel: "入库日期",
					xtype: "displayfield",
					colspan: 6,
					value: entity.get("instock_date"),
					width: 300,
				}, {
					id: "deliver_id",
					hidden: true,
					name: 'deliver_id',
					value: entity == null ? null : entity.get("deliver_id"),
				}, {
					id: "kaipiao_num",
					fieldLabel: "开票数量",
					regex: /^\d+$/,
					regexText: '请输入正确的数据类型',
					allowBlank: false,
					blankText: "没有输入入库数量",
					beforeLabelTextTpl: PSI.Const.REQUIRED,
					xtype: entity.get('isFund') ? 'displayfield' : '',
					name: "kaipiao_num",
					colspan: 6,
					width: 200,
					value: entity.get('parent_id') == null ? null : entity.get("kaipiao_num"),
					listeners: {
						specialkey: {
							fn: me.onEditSpecialKey,
							scope: me
						},
						change: {
							fn: me.recountAll,
							scope: me
						}
					},
				}, {
					name: "kaipiao_unit_price",
					fieldLabel: "开票单价",
					xtype: 'hidden',
					colspan: 2,
					width: 200,
					value: entity.get("kaipiao_unit_price"),
				}, {
					name: "sum_kaipiao_money",
					fieldLabel: "开票金额",
					xtype: 'hidden',
					colspan: 4,
					name: "sum_kaipiao_money",
					value: entity.get('parent_id') == null ? '<span style="color:#6B6B6B">系统自动生成</span>' : entity.get("sum_kaipiao_money"),
				}, {
					id: "kaipiao_unit_price",
					fieldLabel: "开票单价",
					xtype: 'displayfield',
					colspan: 2,
					width: 200,
					value: entity.get("kaipiao_unit_price"),
				}, {
					id: "sum_kaipiao_money",
					fieldLabel: "开票金额",
					xtype: 'displayfield',
					colspan: 4,
					value: entity.get('parent_id') == null ? '<span style="color:#6B6B6B">系统自动生成</span>' : entity.get("sum_kaipiao_money"),
				}, {
					id: "tax_unit_price",
					name: "tax_unit_price",
					fieldLabel: "税价",
					xtype: 'numberfield',
					allowBlank: false,
					blankText: "没有输入税价",
					beforeLabelTextTpl: PSI.Const.REQUIRED,
					decimalPrecision: 3,
					minValue: 0,
					colspan: 2,
					width: 200,
					value: entity.get("tax_unit_price"),
				}, {
					id: "sum_tax_money",
					name: "sum_tax_money",
					fieldLabel: "税额",
					xtype: 'numberfield',
					allowBlank: false,
					blankText: "没有输入税额",
					beforeLabelTextTpl: PSI.Const.REQUIRED,
					decimalPrecision: 3,
					minValue: 0,
					colspan: 4,
					value: entity.get('parent_id') == null ? '<span style="color:#6B6B6B">系统自动生成</span>' : entity.get("sum_tax_money"),
				}, {
					id: "pay_account",
					fieldLabel: "付款账户",
					xtype: entity.get('isFund') ? 'displayfield' : 'psi_bank_account_field',
					beforeLabelTextTpl: PSI.Const.REQUIRED,
					blankText: '请输入银行账号',
					allowBlank: false,
					colspan: 6,
					width: 350,
					value: entity.get('pay_account') == null ? null : entity.get("pay_account_name") + " 卡号：" + entity.get("pay_account_num"),
					listeners: {
						specialkey: {
							fn: me.onEditSpecialKey,
							scope: me
						}
					}
				}, {
					id: 'pay_account_id',
					name: 'pay_account_id',
					value: entity.get('pay_account') == null ? null : entity.get('pay_account'),
					hidden: true
				}, /*{
					id: "tax_danju_code",
					fieldLabel: "单据编号",
					xtype: entity.get('isFund') ? 'displayfield' : '',
					name: "tax_danju_code",
					colspan: 6,
					width: 450,
					value: entity == null ? null : entity.get("tax_danju_code"),
					listeners: {
						specialkey: {
							fn: me.onEditSpecialKey,
							scope: me
						},
					},
				}, */{
					id: "tax_shuipiao_code",
					fieldLabel: "税票号",
					allowBlank: false,
					blankText: "没有输入税票号",
					beforeLabelTextTpl: PSI.Const.REQUIRED,
					xtype: entity.get('isFund') ? 'displayfield' : '',
					name: "tax_shuipiao_code",
					colspan: 6,
					width: 450,
					value: entity == null ? null : entity.get("tax_shuipiao_code"),
					listeners: {
						specialkey: {
							fn: me.onEditSpecialKey,
							scope: me
						}
					}
				}, {
					id: "yewu_date",
					fieldLabel: "业务日期",
					allowBlank: false,
					colspan: 3,
					width: 200,
					blankText: "没有输入业务日期",
					beforeLabelTextTpl: PSI.Const.REQUIRED,
					xtype: entity.get('isFund') ? 'displayfield' : 'datefield',
					format: "Y-m-d",
					name: "yewu_date",
					value: entity.get('yewu_date') == null ? new Date() : entity.get("yewu_date"),
					listeners: {
						specialkey: {
							fn: me.onEditBizDTSpecialKey,
							scope: me
						}
					}
				}, {
                    id: "taxbill_create_date",
                    fieldLabel: "开票日期",
                    allowBlank: false,
                    colspan: 3,
                    width: 200,
                    blankText: "没有输入开票日期",
                    beforeLabelTextTpl: PSI.Const.REQUIRED,
                    xtype: entity.get('isFund') ? 'displayfield' : 'datefield',
                    format: "Y-m-d",
                    name: "taxbill_create_date",
                    value: entity.get('taxbill_create_date') == null ? new Date() : entity.get("taxbill_create_date"),
                    listeners: {
                        specialkey: {
                            fn: me.onEditBizDTSpecialKey,
                            scope: me
                        }
                    }
                },/*{
					id: "stock_date",
					fieldLabel: "入库日期",
					colspan: 3,
					width: 200,
					xtype: 'displayfield',
					value: entity.get('instock_date'),

				}, {
					id: "fund_date",
					fieldLabel: "打款日期",
					allowBlank: false,
					colspan: 6,
					width: 200,
					blankText: "没有输入采购日期",
					beforeLabelTextTpl: PSI.Const.REQUIRED,
					xtype: "datefield",
					format: "Y-m-d",
					name: "fund_date",
					value: entity.get('fund_date') ? entity.get("fund_date") : new Date(),
					hidden: entity.get('isFund') ? false : true,
					disabled: entity.get('isFund') ? false : true,
					listeners: {
						specialkey: {
							fn: me.onEditBizDTSpecialKey,
							scope: me
						}
					}
				},*/ {
					id: 'note',
					name: 'note',
					fieldLabel: "备注",
					xtype: 'textareafield',
					value: entity == null ? null : entity.get("note"),
					colspan: 6,
					width: 550
				}, {
					name: 'isParent',
					value: entity.get('pay_account') == null ? 1 : 0,
					hidden: true,
				}, {
					id: 'isFund',
					name: 'isFund',
					value: entity.get('isFund') ? 1 : 0,
					hidden: true,
				}, {
					xtype: "hidden",
					name: "parent_id",
					value: entity == null ? null : entity.get("parent_id")
				}],
				buttons: buttons
			}],
			listeners: {
				show: {
					fn: me.onWndShow,
					scope: me
				},
				close: {
					fn: me.onWndClose,
					scope: me
				}
			}
		});

		me.callParent(arguments);

		// me.__editorList = ["pay_1st_account","pay_1st_amount","pay_2nd_account","pay_2nd_amount"];
	},

	onWndShow: function() {
		var me = this;

		var el = me.getEl();
	},

	onOK: function(thenAdd) {
		var me = this;
		var f = Ext.getCmp("editForm");
		var el = f.getEl();
		el.mask(PSI.Const.SAVING);
		if (Ext.getCmp("isFund").getValue() == false) {
			var need = Ext.getCmp('need_amount').getValue();
			var kaipiao_num = Ext.getCmp('kaipiao_num').getValue();
			if (kaipiao_num - need > 0) {
				el.unmask();
				PSI.MsgBox.showInfo('开票数不能大于剩余开票数！');
				return;
			} else {
				if (Ext.getCmp("pay_account").getIdValue())
					Ext.getCmp("pay_account_id").setValue(Ext.getCmp("pay_account").getIdValue());
			}
		}
		f.submit({
			url: PSI.Const.BASE_URL + "Home/SelfTax/editSelfTax",
			method: "POST",
			success: function(form, action) {
				el.unmask();
				me.__lastId = action.result.id;
				me.getParentForm().__lastId = me.__lastId;

				PSI.MsgBox.tip("数据保存成功");
				me.focus();

				if (thenAdd) {
					me.clearEdit();
				} else {
					me.close();
					me.getParentForm().refreshUnEditedGrid();
					me.getParentForm().refreshEditedGrid();
				}
			},
			failure: function(form, action) {
				el.unmask();
				PSI.MsgBox.showInfo(action.result.msg,
					function() {
						Ext.getCmp("editCode").focus();
					});
			}
		});

	},

	onEditSpecialKey: function(field, e) {
		if (e.getKey() === e.ENTER) {
			var me = this;
			var id = field.getId();
			for (var i = 0; i < me.__editorList.length; i++) {
				var editorId = me.__editorList[i];
				if (id === editorId) {
					var edit = Ext.getCmp(me.__editorList[i + 1]);
					edit.focus();
					edit.setValue(edit.getValue());
				}
			}
		}
	},

	onLastEditSpecialKey: function(field, e) {
		if (e.getKey() == e.ENTER) {
			var f = Ext.getCmp("editForm");
			if (f.getForm().isValid()) {
				var me = this;
				me.onOK(me.adding);
			}
		}
	},

	//计算所有的价格
	recountAll: function() {
		var config = {
			'kaipiao_unit_price': 'sum_kaipiao_money',
			'tax_unit_price': 'sum_tax_money',
		};
		//获取数量
		var num = Ext.getCmp('kaipiao_num').getValue();
		if (num && Ext.getCmp('kaipiao_num').isValid()) {
			for (var key in config) {
				var unit = Ext.getCmp(key).getValue();
				if (unit != '' && Ext.getCmp(key).isValid())
					Ext.getCmp(config[key]).setValue((unit * num).toFixed(2));
			}
		}
	},

	clearEdit: function() {
		Ext.getCmp("emCode").focus();

		var editors = [Ext.getCmp("emName"), Ext.getCmp("emCode"),
			Ext.getCmp("bankAccount"), Ext.getCmp("emPhone"),
			Ext.getCmp("emQQ"), Ext.getCmp("emEmail"),
			Ext.getCmp("emPYM"), Ext.getCmp("emAddress"),
			Ext.getCmp("emNote"), Ext.getCmp("isEmployee"),
			Ext.getCmp("isOffJob"), Ext.getCmp("clientUserName"),
			Ext.getCmp("clientPassword")
		];
		for (var i = 0; i < editors.length; i++) {
			var edit = editors[i];
			edit.setValue(null);
			edit.clearInvalid();
		}
	},

	onWndClose: function() {
		var me = this;
		me.getParentForm().__lastId = me.__lastId;
	}
});