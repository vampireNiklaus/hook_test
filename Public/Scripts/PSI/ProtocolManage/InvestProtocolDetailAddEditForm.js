/**
 * 自销采购单 - 新建或编辑界面
 */
Ext.define("PSI.ProtocolManage.InvestProtocolDetailAddEditForm", {
	extend : "Ext.window.Window",
	alias : "widget.psi_self_purchase",

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

		me.adding = entity == null;

		var buttons = [];
		if (!entity) {
			buttons.push({
						text : "保存并继续新增",
						formBind : true,
						handler : function() {
							me.onOK(entity, true);
						},
						scope : me
					});
		}

		buttons.push({
					text : "保存",
					formBind : true,
					iconCls : "PSI-button-ok",
					handler : function() {
						me.onOK(entity, false);
					},
					scope : me
				}, {
					text : entity == null ? "关闭" : "取消",
					handler : function() {
						me.close();
					},
					scope : me
				});


		Ext.apply(me, {
			title : entity == null ? "新增协议明细" : "编辑协议明细",
			modal : true,
			resizable : true,
			onEsc : Ext.emptyFn,
			width : 570,
			height : 400,
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
					id : "edit_id",
					xtype : "hidden",
					value : entity == null ? null : entity.get("id")
				},{
					id:'purchaseKey',
					value:'1314',
					hidden:true
				},{
                    id:"edit_detail_region",
                    fieldLabel:"所属地区",
                    allowBlank:false,
                    blankText:"没有输入所属地区",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"region",
                    colspan : 3,
                    value:entity == null ? null : entity.get("region"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }

                },{
                    id:"edit_detail_hospital_name",
                    fieldLabel:"医院名称",
                    allowBlank:false,
                    xtype:'psi_hospital_field',
                    blankText:"没有输入医院名称",
                    emptyText : "选择医院名称",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"hospital_name",
                    colspan : 3,
                    value:entity == null ? null : entity.get("hospital_name"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }

                },{
					id : "edit_detail_drug_name",
					fieldLabel : "药品",
					allowBlank : false,
					emptyText : "选择药品",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
                    name:"drug_name",
					xtype : "psi_drug_field",
					selfDrug:true,
					callbackFunc:me.selectDrug,
					colspan : 6,
					width:470,
					value : entity == null ? null : entity.get("drug_name"),
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						}
					}
				},{
					id : "edit_detail_drug_id",
					xtype : "hidden",
					name : "drug_id",
					value : entity == null ? null : entity.get("drug_id")
				},{
					id:'edit_detail_drug_jldw',
					fieldLabel : "计量单位",
					name : "jldw",
					value : entity == null ? '<span style="color:#6B6B6B">根据药品信息生成</span>' : entity.get("drug_jldw"),
					xtype:'displayfield',
					colspan:6,
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
				},{
					id : "edit_detail_drug_jx",
					fieldLabel : "剂型",
                    name : "jx",
					xtype:'displayfield',
					value : entity == null ? '<span style="color:#6B6B6B">根据药品信息生成</span>' : entity.get("drug_jx"),
					colspan : 3,
				}, {
					id : "edit_detail_drug_guige",
					fieldLabel : "规格",
                    name : "guige",
					xtype:'displayfield',
					colspan : 3,
					value : entity == null ? '<span style="color:#6B6B6B">根据药品信息生成</span>' : entity.get("drug_guige"),
				}, {
					id : "edit_detail_agent_id",
					xtype : "hidden",
					name : "agent_id",
					value : entity == null ? null : entity.get("agent_id")
				},{
                    id:"edit_detail_cash_deposit",
                    fieldLabel:"保证金",
                    allowBlank:false,
                    blankText:"没有输入保证金",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"cash_deposit",
                    colspan : 3,
                    value:entity == null ? null : entity.get("cash_deposit"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }

                },{
                    id:"edit_detail_if_pay",
                    fieldLabel:"保证金是否到账",
                    allowBlank:false,
                    blankText:"没有填写保证金保证金到账情况",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"if_pay",
                    colspan : 3,
                    value:entity == null ? null : entity.get("if_pay"),
                    valueField: "id",
                    displayField: "pay",
                    xtype: "combo",
                    store: new Ext.data.ArrayStore({
                        fields: ['id', 'pay'],
                        data: [
                            ["0", '未到账'],
                            ["1", '已到账']

                        ]
                    }),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
                },{
					id : "edit_detail_protocol_amount",
					fieldLabel : "协议销量",
					regex:/^\d+$/,
					regexText: '请输入正确的数据类型',
					allowBlank : false,
					blankText : "没有输入协议销售数量",
					name : "protocol_amount",
                    colspan : 3,
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					value : entity == null ? null : entity.get("protocol_amount"),
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						},
						change:{
							fn:me.recountAll,
							scope:me
						}
					},
				},{
                    id:"edit_detail_bidding_price",
                    fieldLabel:"中标价",
                    allowBlank:false,
                    blankText:"没有输入中标价",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"bidding_price",
                    colspan : 3,
                    value:entity == null ? null : entity.get("bidding_price"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }

                },{
                    id:"edit_detail_commission",
                    fieldLabel:"佣金",
                    allowBlank:false,
                    blankText:"没有输入佣金",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"commission",
                    colspan : 3,
                    value:entity == null ? null : entity.get("commission"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }

                },{
                    id:"edit_detail_cover_business",
                    fieldLabel:"覆盖商业",
                    name:"cover_business",
                    allowBlank : false,
                    xtype:'psi_supplier_field',
                    emptyText : "选择供应商",
                    colspan : 3,
                    beforeLabelTextTpl : PSI.Const.REQUIRED,
                    value:entity == null ? null : entity.get("cover_business"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }

                },{
                    id:"edit_detail_flow_type",
                    fieldLabel:"流向形式",
                    allowBlank:false,
                    blankText:"没有输入流向形式",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"flow_type",
                    colspan : 3,
                    value:entity == null ? null : entity.get("flow_type"),
                    valueField: "type",
                    displayField: "type",
                    xtype: "combo",
                    store: new Ext.data.ArrayStore({
                        fields: ['id', 'type'],
                        data: [
                            ["1", '电子'],
                            ["2", '纸质']

                        ]
                    }),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
                },{
                    id:"edit_detail_zs_employee",
                    fieldLabel:"招商人员",
                    allowBlank:false,
                    blankText:"没有输入招商人员",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"zs_employee",
                    colspan : 3,
                    value:entity == null ? null : entity.get("zs_employee"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }

                },{
                    id:"edit_detail_zs_commission",
                    fieldLabel:"招商佣金",
                    allowBlank:false,
                    blankText:"没有输入招商佣金",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"zs_commission",
                    colspan : 3,
                    value:entity == null ? null : entity.get("zs_commission"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }

                },{
                    id:"edit_detail_develop_time",
                    fieldLabel:"开发时间",
                    allowBlank:false,
                    blankText:"没有输入开发时间",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"develop_time",
                    colspan : 3,
                    value:entity == null ? null : entity.get("develop_time"),
                    valueField: "month",
                    displayField: "month",
                    xtype: "combo",
                    store: new Ext.data.ArrayStore({
                        fields: ['id', 'month'],
                        data: [
                            ["1", '1个月'],
                            ["2", '2个月'],
                            ["3", '3个月'],
                            ["4", '4个月'],
                            ["5", '5个月'],
                            ["6", '6个月']
                        ]
                    }),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
                },{
					id:'edit_detail_note',
					name:'note',
					fieldLabel:"备注",
                    colspan : 6,
					xtype: 'textareafield',
					value : entity == null ? null : entity.get("note"),
					width:470
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

		me.__editorList = [];
	},

	onWndShow : function() {

	},

	onOK : function(oldEntity, bol) {

		if(oldEntity) {
            var entity = oldEntity;
		}else {
			var entity = {};
		}


		entity.region = Ext.getCmp("edit_detail_region").getValue();
		entity.hospital_name = Ext.getCmp("edit_detail_hospital_name").getValue();
		entity.drug_name = Ext.getCmp("edit_detail_drug_name").getValue();
		entity.drug_id = Ext.getCmp("edit_detail_drug_id").getValue();
		entity.drug_guige = Ext.getCmp("edit_detail_drug_guige").getValue();
		entity.drug_jx = Ext.getCmp("edit_detail_drug_jx").getValue();
		entity.drug_jldw = Ext.getCmp("edit_detail_drug_jldw").getValue();
		entity.cash_deposit = Ext.getCmp("edit_detail_cash_deposit").getValue();
		entity.if_pay = Ext.getCmp("edit_detail_if_pay").getValue();
		entity.protocol_amount = Ext.getCmp("edit_detail_protocol_amount").getValue();
		entity.bidding_price = Ext.getCmp("edit_detail_bidding_price").getValue();
		entity.commission = Ext.getCmp("edit_detail_commission").getValue();
		entity.cover_business = Ext.getCmp("edit_detail_cover_business").getValue();
		entity.flow_type = Ext.getCmp("edit_detail_flow_type").getValue();
		entity.zs_employee = Ext.getCmp("edit_detail_zs_employee").getValue();
		entity.zs_commission = Ext.getCmp("edit_detail_zs_commission").getValue();
		entity.develop_time = Ext.getCmp("edit_detail_develop_time").getValue();
		entity.note = Ext.getCmp("edit_detail_note").getValue();

		this.getParentForm().addProtocolDetailData(entity);

		this.close();
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
				me.onOK(me.adding, false);
			}
		}
	},


	clearEdit : function() {
		var editors = [];
		for (var i = 0; i < editors.length; i++) {
			var edit = editors[i];
			edit.setValue(null);
			edit.clearInvalid();
		}
	},

	onWndClose : function() {
		var me = this;
	},

	selectDrug : function(scope,data){
		//这个方法被调用的时候，this指向的是window
		Ext.getCmp("edit_detail_drug_id").setValue(data.id);
		Ext.getCmp('edit_detail_drug_jx').setValue(data.jx);
		Ext.getCmp('edit_detail_drug_guige').setValue(data.guige);
		Ext.getCmp('edit_detail_drug_jldw').setValue(data.jldw);
		('tax_unit_price').setValue(data.tax_price);
		var config={
			'base_price':'sum_pay',
			// 'kaipiao_unit_price':'sum_kaipiao_money',
			// 'tax_unit_price':'sum_tax_money',
		};
		//用于判断是否已经选择了药品
		var drug=Ext.getCmp('edit_detail_drug_id').getValue();
		//获取数量
		var num = Ext.getCmp('edit_detail_protocol_amount').getValue();
		if(drug&&num&& Ext.getCmp('edit_detail_protocol_amount').isValid()){
			for(var key in config){
				var unit =Ext.getCmp(key).getValue();
				if(unit!=''&&Ext.getCmp(key).isValid())
					Ext.getCmp(config[key]).setValue((unit*num).toFixed(2));
			}
		}
	},

	selectSupplier:function(scope,data){
		var me = this;
		if(scope){
			me = scope;
		}
		Ext.getCmp("supplier_id").setValue(data.id);
	},
	selectAgent:function(scope,data){
		var me = this;
		if(scope){
			me = scope;
		}
		Ext.getCmp("agent_name").setValue(data.agent_name);
	},
});