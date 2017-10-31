/**
 * hospital - 新建或编辑界面
 */
Ext.define("PSI.Drug.Drug_AddHospitalFilterForm", {
	extend : "Ext.window.Window",

	config : {
		parentForm : null,
		entity : null
	},

	/**
	 * 初始化组件
	 */
	initComponent : function() {
		var me = this;
		var buttons = [];
		buttons.push({
			text : "确定并继续新增",
			formBind : true,
			handler : function() {
				me.onOK(true);
			},
			scope : me
		});
		buttons.push(
			{
			text : "关闭" ,
			handler : function() {
				me.close();
			},
			scope : me
		});

		Ext.apply(me, {
			title : "新增药品分配医院",
			modal : true,
			resizable : true,
			onEsc : Ext.emptyFn,
			resizable:true,
			width : 800,
			height : 600,
			layout : "fit",
			items : [{
				xtype:"psi_hospital_multiSelectPanel",
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
		me.multiSelectPanel = Ext.ComponentQuery.query("psi_hospital_multiSelectPanel")[0];
		me.parentForm = me.getParentForm();
		me.__editorList = ["editHospitalName", "editHospitalRegion", "editHospitalCode",
			"editHospitalType", "editHospitalManager", "editNote"];
	},

	onWndShow : function() {

	},

	onOK : function() {
		var me = this;
		var toAdditems  = me.multiSelectPanel.HospitalGrid.getSelectionModel().getSelection();
		if (toAdditems == null || toAdditems.length == 0) {
			PSI.MsgBox.showInfo("请选择要添加的医院");
			return;
		}
		var parentHospitalAssignGrid = me.parentForm.drugAssignHospitalGrid;
		var parentHospitalAssignGridStore = parentHospitalAssignGrid.getStore();
		var parentDrugCategory = me.parentForm.drugCategoryGrid;
		var drug_items = parentDrugCategory.getSelectionModel().getSelection();
		if(drug_items==null||drug_items.length!=1){
			PSI.MsgBox.showInfo("请先选择对应的药品类别");
			return;
		}
		var drugData = drug_items[0].getData();
		var result = {itemDatas:[]};
		for(var i= 0;i<toAdditems.length;i++)
			result.itemDatas.push(toAdditems[i].getData());

		var el = me.getEl() || Ext.getBody();
		el.mask(PSI.Const.LOADING);
		Ext.Ajax.request({
			url : PSI.Const.BASE_URL + "Home/Drug/addHospitalAssign",
			method : "POST",
			params : {itemDatas:Ext.JSON.encode(result),drugData:Ext.JSON.encode(drugData)},
			callback : function(options, success, response) {

				if (success) {
					var data = Ext.JSON.decode(response.responseText);
					var addEdItems = data["addedHospitalsList"];
					for( var i=0; i<addEdItems.length;i++){
						var item = addEdItems[i];
						parentHospitalAssignGridStore.add(item);
					}
				}
				el.unmask();
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
		var editors = ["editHospitalName", "editHospitalRegion", "editRegionId", "editHospitalCode",
			"editHospitalType", "editHospitalManager", "editNote"];
		for (var i = 0; i < editors.length; i++) {
			var edit = Ext.getCmp(editors[i]);
			if (edit) {
				edit.setValue(null);
				edit.clearInvalid();
			}
		}
	},

	onWndClose : function() {

	}
});