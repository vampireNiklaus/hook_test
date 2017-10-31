/**
 * hospital - 新建或编辑界面
 */
Ext.define("PSI.Hospital.HospitalEditForm", {
	extend: "Ext.window.Window",

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
			text: "保存",
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

		var selectedRegion = me.getParentForm().getRegionGrid()
			.getSelectionModel().getSelection();
		var defaultRegionId = null;
		var defaultManager = null;
		if (selectedRegion != null && selectedRegion.length > 0) {
			defaultRegionId = selectedRegion[0].get("id");
		}

		Ext.apply(me, {
			title: entity == null ? "新增医院" : "编辑医院",
			modal: true,
			resizable: true,
			onEsc: Ext.emptyFn,
			width: 500,
			height: 200,
			layout: "fit",
			items: [{
				id: "editForm",
				xtype: "form",
				layout: {
					type: "table",
					columns: 2
				},
				height: "100%",
				bodyPadding: 5,
				defaultType: 'textfield',
				fieldDefaults: {
					labelWidth: 80,
					labelAlign: "right",
					labelSeparator: "",
					msgTarget: 'side'
				},
				items: [{
					xtype: "hidden",
					name: "id",
					value: entity == null ? null : entity
						.get("id")
				}, {
					id: "editHospitalName",
					fieldLabel: "医院名称",
					allowBlank: false,
					blankText: "没有输入医院名称",
					beforeLabelTextTpl: PSI.Const.REQUIRED,
					name: "hospital_name",
					value: entity == null ? null : entity
						.get("hospital_name"),
					listeners: {
						specialkey: {
							fn: me.onEditSpecialKey,
							scope: me
						}
					}
				}, {
					id: "editHospitalRegion",
					fieldLabel: "医院所在区域",
					allowBlank: false,
					blankText: "没有输入医院所在区域",
					beforeLabelTextTpl: PSI.Const.REQUIRED,
					xtype: "psi_regionfield",
					listeners: {
						specialkey: {
							fn: me.onEditSpecialKey,
							scope: me
						}
					}
				}, {
					id: "editRegionId",
					name: "region_id",
					xtype: "hidden",
					value: defaultRegionId
				}, {
					id: "editHospitalCode",
					fieldLabel: "医院编码",
					allowBlank: false,
					blankText: "没有输入医院编码",
					beforeLabelTextTpl: PSI.Const.REQUIRED,
					name: "hospital_code",
					value: entity == null ? null : entity
						.get("hospital_code"),
					listeners: {
						specialkey: {
							fn: me.onEditSpecialKey,
							scope: me
						}
					}
				}, {
					id: "editHospitalType",
					fieldLabel: "医院等级",
					allowBlank: false,
					blankText: "没有输入医院等级",
					beforeLabelTextTpl: PSI.Const.REQUIRED,
					name: "hospital_type",
					value: entity == null ? null : entity
						.get("hospital_type"),
					valueField: "name",
					displayField: "name",
					xtype: "combo",
					store: new Ext.data.ArrayStore({
						fields: ['id', 'name'],
						data: [
							["1", '二级以上'],
							["2", '卫生院'],
							["3", '民营医院'],
							["4", '药店'],
							["5", '诊所'],
							["6", '其他医疗单位'],
						]
					}),
					allowBlank: false,
					blankText: "没有选择医院等级",

					listeners: {
						specialkey: {
							fn: me.onEditSpecialKey,
							scope: me
						}
					}
				}, {
					id: "editHospitalManager",
					fieldLabel: "管理人员",
					allowBlank: true,
					blankText: "管理人员",
					colspan: 2,
					width: 470,
					xtype: "psi_employeefield",
					value: entity == null ? null : entity
						.get("manager"),
					listeners: {
						specialkey: {
							fn: me.onEditSpecialKey,
							scope: me
						}
					}
				}, {
					id: "editManager",
					name: "manager",
					xtype: "hidden",
					value: defaultManager
				}, {
					xtype: "hidden",
					name: "pym",
					value: entity == null ? null : entity
						.get("pym"),

				}, {
					id: "editNote",
					fieldLabel: "备注",
					colspan: 2,
					width: 470,
					name: "note",
					allowBlank: true,
					value: entity == null ? null : entity
						.get("note"),
					listeners: {
						specialkey: {
							fn: me.onEditSpecialKey,
							scope: me
						}
					}
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

		me.__editorList = ["editHospitalName", "editHospitalRegion", "editHospitalCode",
			"editHospitalType", "editHospitalManager", "editNote"
		];
	},

	onWndShow: function() {
		var me = this;
		var editHospitalName = Ext.getCmp("editHospitalName");
		editHospitalName.focus();
		editHospitalName.setValue(editHospitalName.getValue());

		var regionId = Ext.getCmp("editRegionId").getValue();
		var el = me.getEl();
		el.mask(PSI.Const.LOADING);
		Ext.Ajax.request({
			url: PSI.Const.BASE_URL + "Home/Hospital/hospitalInfo",
			params: {
				id: me.adding ? null : me.getEntity()
					.get("id"),
				region_id: regionId
			},
			method: "POST",
			callback: function(options, success, response) {
				if (success) {
					var data = Ext.JSON
						.decode(response.responseText);
					if (data.units) {
						unitStore.add(data.units);
					}

					if (!me.adding) {
						// 编辑商品信息
						Ext.getCmp("editHospitalRegion")
							.setIdValue(data.region_id);
						Ext.getCmp("editHospitalRegion")
							.setValue(data.region_name);

					} else {
						// 新增医院
						if (data.region_id) {
							Ext
								.getCmp("editHospitalRegion")
								.setIdValue(data.region_id);
							Ext
								.getCmp("editHospitalRegion")
								.setValue(data.region_name);
						}
					}
				}

				el.unmask();
			}
		});
	},

	onOK: function(thenAdd) {
		var me = this;

		var regionId = Ext.getCmp("editHospitalRegion").getIdValue();
		Ext.getCmp("editRegionId").setValue(regionId);

		var manager = Ext.getCmp("editHospitalManager").getValue();
		Ext.getCmp("editManager").setValue(manager);


		var f = Ext.getCmp("editForm");
		var el = f.getEl();
		el.mask(PSI.Const.SAVING);
		f.submit({
			url: PSI.Const.BASE_URL + "Home/Hospital/editHospital",
			method: "POST",
			success: function(form, action) {
				el.unmask();
				me.__lastId = action.result.id;
				me.getParentForm().__lastId = me.__lastId;

				me.getParentForm().freshRegionGrid();
				PSI.MsgBox.tip("数据保存成功");
				me.focus();

				if (thenAdd) {
					me.clearEdit();
				} else {
					me.close();
					me.getParentForm().freshHospitalGrid();
				}
			},
			failure: function(form, action) {
				el.unmask();
				PSI.MsgBox.showInfo(action.result.msg,
					function() {
						Ext.getCmp("editHospitalName").focus();
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

	clearEdit: function() {
		var editors = ["editHospitalName", "editHospitalRegion", "editRegionId", "editHospitalCode",
			"editHospitalType", "editHospitalManager", "editNote"
		];
		for (var i = 0; i < editors.length; i++) {
			var edit = Ext.getCmp(editors[i]);
			if (edit) {
				edit.setValue(null);
				edit.clearInvalid();
			}
		}
	},

	onWndClose: function() {
		var me = this;
		me.getParentForm().__lastId = me.__lastId;
		me.getParentForm().freshHospitalGrid();
	}
});