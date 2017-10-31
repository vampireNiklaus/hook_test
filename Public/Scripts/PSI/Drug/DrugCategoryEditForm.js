/**
 * 药品分类 - 新增或编辑界面
 */
Ext.define("PSI.Drug.DrugCategoryEditForm", {
			extend : "Ext.window.Window",
			config : {
				parentForm : null,
				entity : null
			},
			initComponent : function() {
				var me = this;
				var entity = me.getEntity();
				me.adding = entity == null;
				me.__lastId = entity == null ? null : entity.get("id");

				var buttons = [];
				if (!entity) {
					buttons.push({
								text : "保存并继续新增",
								formBind : true,
								handler : function() {
									me.onOK(true);
								},
								scope : this
							});
				}

				buttons.push({
							text : "保存",
							formBind : true,
							iconCls : "PSI-button-ok",
							handler : function() {
								me.onOK(false);
							},
							scope : this
						}, {
							text : entity == null ? "关闭" : "取消",
							handler : function() {
								me.close();
							},
							scope : me
						});

				Ext.apply(me, {
							title : entity == null ? "新增药品分类" : "编辑药品分类",
							modal : true,
							resizable : true,
							onEsc : Ext.emptyFn,
							width : 900,
							height : 650,
							//layout : "fit",
							layout: {
								type: 'hbox',
								align: 'middle ',
								pack: 'center'
							},
							items : [{
								id : "editForm",
								xtype : "form",
								layout : {
									type : "table",
									columns : 3
								},
								height : "100%",
								bodyPadding : 5,
								defaultType : 'textfield',
								fieldDefaults : {
									labelWidth : 100,
									labelAlign : "right",
									labelSeparator : "",
									msgTarget : 'side',
									width : 280,
									margin : "5"
								},
								items : [{
									xtype : "hidden",
									name : "id",
									value : entity == null ? null : entity
											.get("id")
								}, {
									id : "drug_code",
									fieldLabel : "药品编码",
									allowBlank : false,
									blankText : "没有输入药品编码",
									beforeLabelTextTpl : PSI.Const.REQUIRED,
									name : "drug_code",
									value : entity == null ? null : entity
											.get("drug_code"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										}
									}
								}, {
									id : "common_name",
									fieldLabel : "通用名",
									allowBlank : false,
									blankText : "没有输入药品名称",
									beforeLabelTextTpl : PSI.Const.REQUIRED,
									name : "common_name",
									value : entity == null ? null : entity
											.get("common_name"),
									listeners : {
										specialkey : {
											fn : me.onEditNameSpecialKey,
											scope : me
										}
									}
								}, {
									id : "goods_name",
									fieldLabel : "商品名",
									allowBlank : false,
									blankText : "没有输入商品名",
									beforeLabelTextTpl : PSI.Const.REQUIRED,
									name : "goods_name",
									value : entity == null ? null : entity
										.get("goods_name"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										}
									}
								}, {
									id : "jx",
									fieldLabel : "剂型",
									allowBlank : false,
									blankText : "没有输入药品剂型",
									beforeLabelTextTpl : PSI.Const.REQUIRED,
									name : "jx",
									value : entity == null ? null : entity
										.get("jx"),
									listeners : {
										specialkey : {
											fn : me.onEditNameSpecialKey,
											scope : me
										}
									}
								}, {
									id : "guige",
									fieldLabel : "规格",
									allowBlank : false,
									blankText : "没有输入药品规格",
									beforeLabelTextTpl : PSI.Const.REQUIRED,
									name : "guige",
									value : entity == null ? null : entity
										.get("guige"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										}
									}
								}, {
									id : "jldw",
									fieldLabel : "计量单位",
									name : "jldw",
									value : entity == null ? null : entity
										.get("jldw"),
									valueField : "name",
									displayField : "name",
									xtype : "combo",
									editable:false,
									store: new Ext.data.ArrayStore({
										fields : ['id', 'name'],
										data : [["1", '盒'], ["2", '件'],["3", '瓶'], ["4", '支']]}),
									allowBlank : false,
									blankText : "没有选择计量单位",
									beforeLabelTextTpl : PSI.Const.REQUIRED,
									listeners : {
										specialkey : {
											fn : me.onEditNameSpecialKey,
											scope : me
										}
									}
								}, {
									id : "manufacturer",
									fieldLabel : "生产企业",
									allowBlank : true,
									xtype:"psi_supplier_field",
									name : "manufacturer",
									value : entity == null ? null : entity
										.get("manufacturer"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										}
									}
								}, {
									id : "bid_type",
									fieldLabel : "中标类型",
									name : "bid_type",
									value : entity == null ? null : entity
										.get("bid_type"),
									valueField : "name",
									displayField : "name",
									xtype : "combo",
									editable:false,
									store: new Ext.data.ArrayStore({
										fields : ['id', 'name'],
										data : [["1", '国家基药'], ["2", '军标'],["3", '廉价药品'], ["4", '省增补药品'],
											["5", '省标'], ["6", '备案采购']]
									}),
									allowBlank : false,
									blankText : "没有选择中标类型",
									beforeLabelTextTpl : PSI.Const.REQUIRED,

									listeners : {
										specialkey : {
											fn : me.onEditSpecialKey,
											scope : me
										}
									}
								}, {
									id : "bid_price",
									fieldLabel : "中标价",
									allowBlank : true,
									allowDecimals: true,
									decimalPrecision: 3,
									name : "bid_price",
									value : entity == null ? null : entity
										.get("bid_price"),
									xtype:"numberfield",
									listeners : {
										specialkey : {
											fn : me.onEditNameSpecialKey,
											scope : me
										}

									}
								}, {
									id : "retail_price",
									fieldLabel : "零售价",
									name : "retail_price",
									xtype:"numberfield",
									decimalPrecision: 3,
									allowDecimals: true,
									value : entity == null ? null : entity
										.get("retail_price"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										},
										change : {
											fn : me.priceItemRelateUpdate,
											scope : me
										}
									}
								}, {
									id : "pym",
									fieldLabel : "拼音码",
									xtype:"hidden",
									name : "pym",
									value : entity == null ? null : entity
										.get("pym"),
									xtype:"hidden",
								}, {
									id : "kaipiao_price",
									fieldLabel : "开票价",
									name : "kaipiao_price",
                                    allowBlank : false,
                                    blankText : "没有输入开票价",
                                    beforeLabelTextTpl : PSI.Const.REQUIRED,
									allowDecimals: true,
									decimalPrecision: 3,
									xtype:"numberfield",
									value : entity == null ? '' : entity
										.get("kaipiao_price"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										},
										change : {
											fn : me.priceItemRelateUpdate,
											scope : me
										}
									}
								}, {
									id : "tax_price",
									fieldLabel : "税额",
									name : "tax_price",
									xtype:"numberfield",
									allowDecimals: true,
									decimalPrecision: 3,
									value : entity == null ? 0.00 : entity
										.get("tax_price"),
									listeners : {
										specialkey : {
											fn : me.onEditNameSpecialKey,
											scope : me
										},
										change : {
											fn : me.priceItemRelateUpdate,
											scope : me
										}
									}
								}, {
									id : "base_price",
									fieldLabel : "底价",
									xtype:"numberfield",
									allowDecimals: true,
									decimalPrecision: 3,
									name : "base_price",
									value : entity == null ? 0.00 : entity
										.get("base_price"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										},
										change : {
											fn : me.priceItemRelateUpdate,
											scope : me
										}
									}
								},{
									id : "other_price",
									fieldLabel : "其他费用",
									xtype:"numberfield",
									allowDecimals: true,
									decimalPrecision: 3,
									name : "other_price",
									value : entity == null ? 0.00 : entity
										.get("other_price"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										},
										change : {
											fn : me.priceItemRelateUpdate,
											scope : me
										}
									}
								}, {
									id : "profit",
									fieldLabel : "费用",
									xtype:"numberfield",
									allowDecimals: true,
									decimalPrecision: 3,
									name : "profit",
									value : entity == null ? 0.00 : entity
										.get("profit"),
									listeners : {
										specialkey : {
											fn : me.onEditNameSpecialKey,
											scope : me
										},
										change : {
											fn : me.priceItemRelateUpdate,
											scope : me
										}
									}
								}, {
									id : "is_self",
									fieldLabel : "是否自销药品",
									name : "is_self",
									xtype      : 'radiogroup',
									defaults: {
										flex: 1
									},
									layout: 'hbox',
									items: [

										{
											boxLabel  : '是',
											name      : 'is_self',
											inputValue: '1',
											id        : 'is_self_radio_yes',
											checked : entity === null ? true : entity.get("is_self") == 1
										}, {
											boxLabel  : '否',
											name      : 'is_self',
											inputValue: '0',
											id        : 'is_self_radio_no',
											checked : entity === null ? false : entity.get("is_self") == 0,
										}
									],
									value : entity == null ? null : entity
										.get("is_self"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										}
									}
								}, {
									id : "is_new",
									fieldLabel : "是否是新药分销",
									name : "is_new",
									xtype      : 'radiogroup',
									defaults: {
										flex: 1
									},
									layout: 'hbox',
									items: [
										{
											boxLabel  : '是',
											name      : 'is_new',
											inputValue: '1',
											id        : 'is_new_radio_yes',
											checked : entity === null ? true : entity.get("is_new") == 1
										}, {
											boxLabel  : '否',
											name      : 'is_new',
											inputValue: '0',
											id        : 'is_new_radio_no',
											checked : entity === null ? false : entity.get("is_new") == 0
										}
									],
									value : entity == null ? null : entity
										.get("is_new"),
									listeners : {
										specialkey : {
											fn : me.onEditNameSpecialKey,
											scope : me
										}
									}
								}, {
									id : "disabled",
									fieldLabel : "是否停用",
									name : "disabled",
									value : entity == null ? null : entity
										.get("disabled"),
									xtype      : 'radiogroup',
									defaults: {
										flex: 1
									},
									layout: 'hbox',
									items: [
										{
											boxLabel  : '是',
											name      : 'disabled',
											inputValue: '1',
											id        : 'disabled_radio_yes',
											checked : entity === null ? true : entity.get("disabled") == 1
										}, {
											boxLabel  : '否',
											name      : 'disabled',
											inputValue: '0',
											id        : 'disabled_radio_no',
											checked : entity === null ? false : entity.get("disabled") == 0
										}
									],
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										}
									}
								}, {
									title : "开票公司列表",
									xtype:"psi_drug_supplierListPanel",
									colspan : 1,
									width : 290,
									height:150,
									align : 'center',
									collapsed:false,
									collapsible:true,
                                    inData : entity == null ?null:entity.getData(),
									// inData : entity == null||entity.get("supplier_list")==null||entity.get("supplier_list")==""? [{}]:Ext.JSON.decode(entity.get("supplier_list")).drug_supplierList==null||Ext.JSON.decode(entity.get("supplier_list")).drug_supplierList==""?[{}]:Ext.JSON.decode(entity.get("supplier_list")).drug_supplierList,
								},  {
									id : "supplier_list",
									name : "supplier_list",
									xtype:"hidden",
								},{
									title : "配送公司列表",
									xtype:"psi_drug_deliverListPanel",
									colspan : 1,
									parentCmp:me,
									width : 290,
									height:150,
									collapsed:false,
									collapsible:true,
									align : 'center',
									inData : entity == null ?null:entity.getData(),
								},{
									id : "deliver_list",
									xtype:"hidden",
									name : "deliver_list",
									value : entity == null ? null : entity
										.get("deliver_list"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										}
									}
								}, {
									title : "代理商列表",
									xtype:"psi_drug_delegateListPanel",
									colspan : 1,
									width : 290,
									height:150,
									align : 'center',
									collapsed:false,
									collapsible:true,
                                    inData : entity == null ?null:entity.getData(),
									// inData : entity == null ||entity.get("delegate_list")==null||entity.get("delegate_list")==""? [{}]:Ext.JSON.decode(entity.get("delegate_list")).drug_delegateList==null||Ext.JSON.decode(entity.get("delegate_list")).drug_delegateList==""?[{}]:Ext.JSON.decode(entity.get("delegate_list")).drug_delegateList,
								}, {
									id : "delegate_list",
									xtype:"hidden",
									name : "delegate_list",
									value : entity == null ? null : entity
										.get("delegate_list"),
									listeners : {
										specialkey : {
											fn : me.onEditNameSpecialKey,
											scope : me
										}
									}
								}, {
									id : "medicare_code_province",
									fieldLabel : "省医保代码",
									name : "medicare_code_province",
									value : entity == null ? null : entity
										.get("medicare_code_province"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										}
									}
								}, {
									id : "medicare_code_country",
									fieldLabel : "国家医保代码",
									name : "medicare_code_country",
									value : entity == null ? null : entity
										.get("medicare_code_country"),
									listeners : {
										specialkey : {
											fn : me.onEditNameSpecialKey,
											scope : me
										}
									}
								},  {
									id : "approval_code",
									fieldLabel : "国药准字号",
									name : "approval_code",
									value : entity == null ? null : entity
										.get("approval_code"),
									listeners : {
										specialkey : {
											fn : me.onEditNameSpecialKey,
											scope : me
										}
									}
								},  {
									id : "protocol_region",
									fieldLabel : "协议区域",
									colspan : 3,
									width : 850,
									name : "protocol_region",
									value : entity == null ? null : entity
										.get("protocol_region"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										}
									}
								}, {
									id : "business_license_code",
									fieldLabel : "营业执照编号",
									name : "business_license_code",
									value : entity == null ? null : entity
										.get("business_license_code"),
									listeners : {
										specialkey : {
											fn : me.onEditNameSpecialKey,
											scope : me
										}
									}
								}, {
									id : "business_license_expire_time",
									fieldLabel : "营业执照有效期",
									name : "business_license_expire_time",
									xtype : "datefield",
									format : "Y-m-d",
									labelAlign : "right",
									labelSeparator : "",
									value : entity == null ? null : entity
										.get("business_license_expire_time"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										}
									}
								},{xtype:"displayfield",
									name:"textarea1",
								}, {
									id : "gmp_code",
									fieldLabel : "GMP编号",
									name : "gmp_code",
									value : entity == null ? null : entity
										.get("gmp_code"),
									listeners : {
										specialkey : {
											fn : me.onEditNameSpecialKey,
											scope : me
										}
									}
								}, {
									id : "gmp_expire_time",
									fieldLabel : "GMP有效期",
									name: "gmp_expire_time",
									value : entity == null ? null : entity
										.get("gmp_expire_time"),
									xtype : "datefield",
									format : "Y-m-d",
									labelAlign : "right",
									labelSeparator : "",
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										}
									}
								}, {xtype:"displayfield",
									name:"textarea1",
								},{
									id : "qs_code",
									fieldLabel : "生产许可证",
									name : "qs_code",
									value : entity == null ? null : entity
										.get("qs_code"),
									listeners : {
										specialkey : {
											fn : me.onEditNameSpecialKey,
											scope : me
										}
									}
								}, {
									id : "qs_expire_time",
									fieldLabel : "生产许可证有效期",
									name : "qs_expire_time",
									xtype : "datefield",
									format : "Y-m-d",
									labelAlign : "right",
									labelSeparator : "",
									value : entity == null ? null : entity
										.get("qs_expire_time"),
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										}
									}
								}, {xtype:"displayfield",
									name:"textarea1",
								},{
									id : "client_code",
									fieldLabel : "委托书",
									name : "client_code",
									value : entity == null ? null : entity
										.get("client_code"),
									listeners : {
										specialkey : {
											fn : me.onEditNameSpecialKey,
											scope : me
										}
									}
								}, {
									id : "client_expire_time",
									fieldLabel : "委托书有效期",
									value : entity == null ? null : entity
										.get("client_expire_time"),
									xtype : "datefield",
									format : "Y-m-d",
									name:"client_expire_time",
									labelAlign : "right",
									labelSeparator : "",
									listeners : {
										specialkey : {
											fn : me.onEditCodeSpecialKey,
											scope : me
										}
									}
								}, {xtype:"displayfield",
									name:"textarea1",
								}, {
									id : "note",
									fieldLabel : "备注",
									name : "note",
									colspan : 3,
									width : 850,
									value : entity == null ? null : entity
										.get("note"),
									listeners : {
										specialkey : {
											fn : me.onEditNameSpecialKey,
											scope : me
										}
									}
								},{
									id : "creator_id",
									fieldLabel : "创建人",
									name:"creator_id",
									value : entity == null ? null : entity
										.get("creator_id"),
									xtype:"hidden"
								}, {
									id : "create_time",
									fieldLabel : "创建时间",
									name: "create_time",
									value : entity == null ? null : entity
										.get("create_time"),
									xtype:"hidden"
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
				me.drug_delegateListPanel = Ext.ComponentQuery.query("psi_drug_delegateListPanel")[0];
				me.drug_deliverListPanel = Ext.ComponentQuery.query("psi_drug_deliverListPanel")[0];
				me.drug_supplierListPanel = Ext.ComponentQuery.query("psi_drug_supplierListPanel")[0];
			},
			// private	

			onOK : function(thenAdd) {
				var me = this;
				var f = Ext.getCmp("editForm");
				var drug_delegateItems = me.drug_delegateListPanel.delegateListGrid.getStore();
				var drug_deliverItems = me.drug_deliverListPanel.deliverListGrid.getStore();
				var drug_supplierItems = me.drug_supplierListPanel.supplierListGrid.getStore();

				var delegateList = {drug_delegateList:[]};
				var deliverList = {drug_deliverList:[]};
				var supplierList = {drug_supplierList:[]};

				if(drug_delegateItems!=null&&drug_delegateItems.getCount()!=0){
					for(var i = 0; i<drug_delegateItems.getCount();i++){
						var data = drug_delegateItems.getAt(i).getData();
						if(data.id==parseInt(data.id)){
							delegateList.drug_delegateList.push(data);
						}
					}
				}
				if(drug_deliverItems!=null&&drug_deliverItems.getCount()!=0){
					for(var i = 0; i<drug_deliverItems.getCount();i++){
						var data = drug_deliverItems.getAt(i).getData();
						if(data.id==parseInt(data.id)){
							deliverList.drug_deliverList.push(data);
						}
					}
				}
				if(drug_supplierItems!=null&&drug_supplierItems.getCount()!=0){
					for(var i = 0;i<drug_supplierItems.getCount();i++){
						var data = drug_supplierItems.getAt(i).getData();
						if(data.id==parseInt(data.id)){
							supplierList.drug_supplierList.push(data);
						}
					}
				}


				// Ext.getCmp("delegate_list").setValue(Ext.JSON.encode(delegateList));
				// Ext.getCmp("deliver_list").setValue(Ext.JSON.encode(deliverList));
				// Ext.getCmp("supplier_list").setValue(Ext.JSON.encode(supplierList));

				var el = f.getEl();
				el.mask(PSI.Const.SAVING);
				f.submit({
							url : PSI.Const.BASE_URL
									+ "Home/Drug/editDrugCategory",
							method : "POST",
							success : function(form, action) {
								el.unmask();
								PSI.MsgBox.tip("数据保存成功");
								me.focus();
								me.__lastId = action.result.id;
								if (thenAdd) {
									var drug_code = Ext.getCmp("drug_code");
									drug_code.setValue(null);
									drug_code.clearInvalid();
									drug_code.focus();

									var editName = Ext.getCmp("editName");
									editName.setValue(null);
									editName.clearInvalid();
								} else {
									me.close();
                                    me.getParentForm().freshDrugCategoryGrid();
								}
							},
							failure : function(form, action) {
								el.unmask();
								PSI.MsgBox.showInfo(action.result.msg,
										function() {
											Ext.getCmp("drug_code").focus();
										});
							}
						});
			},
			onEditCodeSpecialKey : function(field, e) {
				if (e.getKey() == e.ENTER) {
					var editName = Ext.getCmp("editName");
					editName.focus();
					editName.setValue(editName.getValue());
				}
			},
			onEditNameSpecialKey : function(field, e) {
				if (e.getKey() == e.ENTER) {
					var f = Ext.getCmp("editForm");
					if (f.getForm().isValid()) {
						var me = this;
						Ext.getCmp("drug_code").focus();
						me.onOK(me.adding);
					}
				}
			},
			onWndClose : function() {
				var me = this;
				if (me.__lastId) {
					me.getParentForm().freshDrugCategoryGrid(me.__lastId);
				}
			},
			onWndShow : function() {
				var me = this;
				var drug_code = Ext.getCmp("drug_code");
				drug_code.focus();
				drug_code.setValue(drug_code.getValue());
				//刷新配送公司列表
				me.drug_deliverListPanel.refreshdrug2deliverGrid();
			},
			priceItemRelateUpdate : function(){
				var profit = Ext.getCmp("kaipiao_price").getValue()-Ext.getCmp("tax_price").getValue()-Ext.getCmp("base_price").getValue()-Ext.getCmp("other_price").getValue();
				Ext.getCmp("profit").setValue(profit);
			}
		});