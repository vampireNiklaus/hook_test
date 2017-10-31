/**
 * 自销回款单 - 编辑界面
 */
Ext.define("PSI.SelfHuikuan.SelfHuikuanEditForm", {
	extend : "Ext.window.Window",
	alias : "widget.psi_self_huikuan",

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


		Ext.apply(me, {
			title : "编辑自销回款单",
			modal : true,
			resizable : false,
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
					fieldLabel : "回款单号",
					xtype : "displayfield",
					colspan : 3,
					width:250,
					value :  entity.get("bill_code"),
				},{
					fieldLabel : "税票单号",
					xtype : "displayfield",
					colspan : 3,
					value :  entity.get("tax_sub_bill_code"),
				},{
					fieldLabel : "药品",
					xtype:'displayfield',
					colspan : 6,
					width:550,
					value : entity.get("common_name"),
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
					fieldLabel : "供应商",
					xtype:'displayfield',
					colspan : 6,
					value :entity.get("supplier_name"),
				} ,{
					fieldLabel : "回款总量",
					colspan : 2,
					width:200,
					xtype : "displayfield",
					value : entity.get("huikuan_amount"),
				},{
					id:'need_amount',
					fieldLabel : "剩余回款量",
					colspan : 4,
					xtype : "displayfield",
					value : entity.get("need_amount"),
					renderer:function(value){
						return "<b style='color:red'>"+ value +"</b>";
					},
				},{
					id : "deliver",
					fieldLabel : "配送公司",
					xtype : "displayfield",
					colspan :6,
					value : entity.get("deliver_name"),
					width:300,
				}, {
					id:"deliver_id",
					hidden:true,
					name:'deliver_id',
					value : entity == null ? null : entity.get("deliver_id"),
				},{
					id : "huikuan_num",
					fieldLabel : "回款数量",
					regex:/^\d+$/,
					regexText: '请输入正确的数据类型',
					allowBlank : false,
					blankText : "没有输入回款数量",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					name : "huikuan_num",
					colspan : 6,
					width:200,
					value : entity.get('parent_id') == null ? null : entity.get("huikuan_num"),
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
					id : "kaipiao_unit_price",
					fieldLabel : "开票单价",
					xtype:'displayfield',
					name:"kaipiao_unit_price",
					colspan : 2,
					width:200,
					value : entity.get("kaipiao_unit_price"),
				}, {
					id : "sum_kaipiao_money",
					fieldLabel : "开票金额",
					xtype:'displayfield',
					colspan : 4,
					name : "sum_kaipiao_money",
					value : entity.get('parent_id') == null ? '<span style="color:#6B6B6B">系统自动生成</span>' : entity.get("sum_kaipiao_money"),
				},{
					id : "huikuan_account",
					fieldLabel : "回款账户",
					xtype : "psi_bank_account_field",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					blankText : '请输入银行账号',
					allowBlank : false,
					colspan : 6,
					width:350,
					value : entity.get('parent_id') == null ? null : entity.get("huikuan_account_name")+" 卡号："+entity.get("huikuan_account_num"),
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						}
					}
				},{
					id:'huikuan_account_id',
					name:'huikuan_account_id',
					value:entity.get('parent_id') == null ? null :entity.get('huikuan_account'),
					hidden:true
				},{
					id : "huikuan_code",
					fieldLabel : "单据编号",
					allowBlank : false,
					blankText : "请填写单据编号",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					name : "huikuan_code",
					colspan : 6,
					width:450,
					value : entity == null ? null : entity.get("huikuan_code"),
					listeners : {
						specialkey : {
							fn : me.onEditSpecialKey,
							scope : me
						},
					},
				},{
					id : "bill_date",
					fieldLabel : "业务日期",
					allowBlank : false,
					colspan : 6,
					width:200,
					blankText : "没有输入业务日期",
					beforeLabelTextTpl : PSI.Const.REQUIRED,
					xtype : "datefield",
					format : "Y-m-d",
					name : "bill_date",
					value : entity.get('yewu_date') == null ? new Date() : entity.get("bill_date"),
					listeners : {
						specialkey : {
							fn : me.onEditBizDTSpecialKey,
							scope : me
						}
					}
				}, {
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

	onWndShow : function() {
		var me = this;

		var el = me.getEl();
	},

	onOK : function(thenAdd) {
		var me = this;
		var f = Ext.getCmp("editForm");
		var el = f.getEl();
		var need=Ext.getCmp('need_amount').getValue();
		var huikuan_num=Ext.getCmp('huikuan_num').getValue();
		if(huikuan_num-need>0){
			PSI.MsgBox.showInfo('回款数不能大于剩余回款数！');
		}else{
			el.mask(PSI.Const.SAVING);
			if(Ext.getCmp("huikuan_account").getIdValue())
				Ext.getCmp("huikuan_account_id").setValue(Ext.getCmp("huikuan_account").getIdValue());
			f.submit({
				url : PSI.Const.BASE_URL + "Home/SelfHuikuan/editSelfHuikuan",
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
		}

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

	//计算所有的价格
	recountAll:function(){
		var config={
			'kaipiao_unit_price':'sum_kaipiao_money',
		};
		//获取数量
		var num = Ext.getCmp('huikuan_num').getValue();
		if(num&& Ext.getCmp('huikuan_num').isValid()){
			for(var key in config){
				var unit =Ext.getCmp(key).getValue();
				if(unit!=''&&Ext.getCmp(key).isValid())
					Ext.getCmp(config[key]).setValue((unit*num).toFixed(2));
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

	onWndClose : function() {
		var me = this;
		me.getParentForm().__lastId = me.__lastId;
		me.getParentForm().refreshUnEditedGrid();
	}
});