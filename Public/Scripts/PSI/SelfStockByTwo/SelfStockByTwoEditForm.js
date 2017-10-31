	/**
 * 自销入库单 - 编辑界面
 */
Ext.define("PSI.SelfStockByTwo.SelfStockByTwoEditForm", {
	extend : "Ext.window.Window",
	alias : "widget.psi_self_stock",

	config : {
		parentForm : null,
		entity : null
	},

	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		var entity = me.getEntity();
		me.entity=entity;

		me.adding = entity == null;

		var buttons = [];
		if (!entity) {
			buttons.push({
				text : "保存并继续新增",
				formBind : true,
				handler : function() {
					me.onOK(true);
				},
				scope : me
			});
		}

		buttons.push({
			id:'btn-save',
			text : "保存",
			formBind : true,
			iconCls : "PSI-button-ok",
			handler : function() {
				me.onOK(false);
			},
			scope : me
		}, {
			text : entity == null ? "关闭" : "取消",
			handler : function() {
				me.close();
			},
			scope : me
		});

		//这里是批号的store
		me.batchStore= new Ext.data.ArrayStore({
			fields : ['batch_num'],
			data : [],
			proxy : {
				type : "ajax",
				actionMethods : {
					read : "POST"
				},
				url : PSI.Const.BASE_URL + "Home/StockManage/getBatchList",
				reader : {
					root : 'all_data',
				}
			}
		});
		me.batchStore.on("beforeload", function() {
			me.batchStore.proxy.extraParams = me.getQueryParam();
		});


		Ext.apply(me, {
			title : "编辑自销入库单",
			modal : true,
			resizable : true,
			onEsc : Ext.emptyFn,
			width : 600,
			height : 600,
			layout : "fit",
			items : [{
				id : "editForm",
				xtype : "form",
				layout : {
					type : "table",
					columns : 6
				},
				height : "100%",
				bodyPadding : 10,
				defaultType : 'textfield',
				fieldDefaults : {
					labelWidth : 80,
					labelAlign : "right",
					labelSeparator : "：",
					msgTarget : 'side',
				},
				items : [{
					xtype : "hidden",
					name : "id",
					value :entity==null?null:entity.get("id")
				},{
					xtype : "hidden",
					name : "parent_id",
					value :entity==null?null:entity.get("parent_id")
				},{
					fieldLabel : "入库单号",
					xtype : "displayfield",
					colspan : 6,
					value :  entity.get("bill_code"),
				},{
					fieldLabel : "药品",
					xtype:'displayfield',
					colspan : 3,
					value : entity.get("common_name"),
				},{
					fieldLabel : "采购日期",
					xtype:'displayfield',
					colspan : 3,
					value : entity.get("buy_date"),
				}, {
					fieldLabel : "剂型",
					xtype:'displayfield',
					value : entity.get("jx"),
					colspan : 2,
				}, {
					fieldLabel : "规格",
					xtype:'displayfield',
					colspan : 4,
					width:300,
					value :entity.get("guige"),
				}, {
					fieldLabel : "生产厂家",
					xtype:'displayfield',
					value : entity.get("manufacturer"),
					colspan : 6,
				},{
					fieldLabel : "入库总量",
					colspan : 2,
					width:200,
					xtype : "displayfield",
					value : entity.get("stock_amount"),
				},{
					fieldLabel : "剩余入库量",
					colspan : 4,
					xtype : "displayfield",
					value : entity.get("need_amount"),
				},{
					id : "deliver",
					fieldLabel : "配送公司",
					allowBlank : false,
					emptyText : "选择配送公司",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					xtype:'psi_deliver_field',
					parentCmp:me,
					queryCondition:{
						queryConditionType: 'searchByDrugId',
						queryConditionKey : entity.get('drug_id')
					},
					colspan :6,
					value : entity == null ? null : entity.get("deliver_name"),
					width:500,
					callbackFunc:me.selectDeliver,
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						}
					}
				}, {
					id:"deliver_id",
					hidden:true,
					name:'deliver_id',
					value : entity == null ? null : entity.get("deliver_id"),
				},{
					id : "stock_num",
					fieldLabel : "入库数量",
					regex:/^\d+$/,
					regexText: '请输入正确的数据类型',
					allowBlank : false,
					blankText : "没有输入入库数量",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					name : "stock_num",
					colspan : 3,
					width:250,
					value : entity == null ? null : entity.get("stock_num"),
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						},
					},
				}, {
					id : "is_broken",
					fieldLabel : "破损部分？",
					name : "is_broken",
					xtype      : 'radiogroup',
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					defaults: {
						flex: 1
					},
					colspan : 3,
					width:250,
					layout: 'hbox',
					items: [

						{
							boxLabel  : '是',
							name      : 'is_broken',
							inputValue: '1',
							id        : 'is_broken_radio_yes',
							checked : entity.get("is_broken") == 1
						}, {
							boxLabel  : '否',
							name      : 'is_broken',
							inputValue: '0',
							id        : 'is_broken_radio_no',
							checked : entity.get("is_broken") == 0,
						}
					],
					value : entity.get("is_broken"),
					listeners : {
						change : {
							fn : me.onIsBrokenKey,
							scope : me
						}
					}
				},
					{
					id : "batch_num",
					fieldLabel : "批号",
					allowBlank : false,
					blankText : "没有输入批号",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					name : "batch_num",
					colspan : 6,
					width:300,
					value : entity == null ? null : entity.get("batch_num"),
                        listeners : {
                            specialkey : {
                                fn : me.onEditSpecialKey,
                                scope : me
                            }
                        }
				},{
					id: "tax_shuipiao_code",
					fieldLabel: "税票号",
					// allowBlank: false,
					// blankText: "没有输入税票号",
					// beforeLabelTextTpl: PSI.Const.REQUIRED,
					xtype: entity.get('isFund') ? 'displayfield' : '',
					name: "tax_shuipiao_code",
					colspan: 6,
					width: 300,
					value: entity == null ? null : entity.get("tax_shuipiao_code"),
					listeners: {
						specialkey: {
							fn: me.onEditSpecialKey,
							scope: me
						}
					}
				},{
					id : "instock_date",
					name : "instock_date",
					fieldLabel : "入库日期",
					allowBlank : false,
					blankText : "没有输入入库日期",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					xtype : "datefield",
					format : "Y-m-d",
					colspan:6,
					value : entity == null ? new Date() : entity.get("instock_date"),
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						}
					}
				},{
					id : "validity",
					name : "validity",
					fieldLabel : "有效日期",
					allowBlank : false,
					blankText : "没有输入有效日期",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					xtype : "datefield",
					format : "Y-m-d",
					colspan:6,
					value : entity == null ? new Date() : entity.get("validity"),
					listeners : {
						specialkey : {
							fn : me.onEditBizDTSpecialKey,
							scope : me
						}
					}
				},/*{
					id:'validity',
					name:'validity',
					fieldLabel:"有效日期期",
					xtype: 'displayfield',
					value : entity == null ? null : entity.get("validity"),
					colspan:6,
					width:550
				},*/{
					id:'note',
					name:'note',
					fieldLabel:"备注",
					xtype: 'textareafield',
					value : entity == null ? null : entity.get("note"),
					colspan:6,
					width:550
				}],
				buttons : buttons
			}],
			listeners : {
				show : {
					fn : me.onWndShow,
					scope : me
				},
				close : {
					fn : me.onWndClose,
					scope : me
				}
			}
		});

		me.callParent(arguments);

		// me.__editorList = ["pay_1st_account","pay_1st_amount","pay_2nd_account","pay_2nd_amount"];
	},

	//刷新批号列表
	refreshBatch:function () {
		this.batchStore.load();
	},
	//刷新批号时候获取药品id和配送公司id
	getQueryParam:function(){
		var me=this;
		var result={};
		result.drug_id=me.entity.get('drug_id');
		if(Ext.getCmp('deliver_id'))
			result.deliver_id=Ext.getCmp('deliver_id').getValue();
		return result;
	},

	onWndShow : function() {
		var me = this;

		var el = me.getEl();
	},

	onOK : function(thenAdd) {
		var me = this;
		var f = Ext.getCmp("editForm");
		var el = f.getEl();
		el.mask(PSI.Const.SAVING);

		if(Ext.getCmp("deliver").getIdValue())
			Ext.getCmp("deliver_id").setValue(Ext.getCmp("deliver").getIdValue());

		f.submit({
			url : PSI.Const.BASE_URL + "Home/SelfStockByTwo/editSelfStockByTwo",
			method : "POST",
			success : function(form, action) {
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
			failure : function(form, action) {
				el.unmask();
				PSI.MsgBox.showInfo(action.result.msg,
					function() {
						Ext.getCmp("editCode").focus();
					});
			}
		});
	},

	onEditSpecialKey : function(field, e) {
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

	onLastEditSpecialKey : function(field, e) {
		if (e.getKey() == e.ENTER) {
			var f = Ext.getCmp("editForm");
			if (f.getForm().isValid()) {
				var me = this;
				me.onOK(me.adding);
			}
		}
	},
	

	clearEdit : function() {
		Ext.getCmp("emCode").focus();

		var editors = [Ext.getCmp("emName"), Ext.getCmp("emCode"),
			Ext.getCmp("bankAccount"), Ext.getCmp("emPhone"),
			Ext.getCmp("emQQ"),Ext.getCmp("emEmail"),
			Ext.getCmp("emPYM"), Ext.getCmp("emAddress"),
			Ext.getCmp("emNote"),Ext.getCmp("isEmployee"),
			Ext.getCmp("isOffJob"), Ext.getCmp("clientUserName"),
			Ext.getCmp("clientPassword")];
		for (var i = 0; i < editors.length; i++) {
			var edit = editors[i];
			edit.setValue(null);
			edit.clearInvalid();
		}
	},
	onIsBrokenKey : function () {
		//点击破损的时候
		if(Ext.getCmp("is_broken").getChecked()[0].inputValue == 1){
			//是破损的时候
			// Ext.getCmp("deliver").hide("display");
			// Ext.getCmp("deliver").allowBlank = true;
		}else{
			// Ext.getCmp("deliver").show("display");
		}
	},
	onWndClose : function() {
		var me = this;
		me.getParentForm().__lastId = me.__lastId;
		me.getParentForm().refreshUnEditedGrid();
	},
	selectDeliver:function(scope,data){
		var me = this;
		if(scope){
			me = scope;
		}
		Ext.getCmp("deliver_id").setValue(data.deliver_id);
	}
	,
	getDeliverQueryCondition : function(){
		//根据药品类型选择对应的配送公司，配送公司的限制查询条件
		var drug_id  = Ext.getCmp("drug_id").getValue();
		drug_id = drug_id?drug_id:0;
		return {
			queryConditionType:"searchByDrugId",
			queryConditionKey:drug_id
		}
	}
});