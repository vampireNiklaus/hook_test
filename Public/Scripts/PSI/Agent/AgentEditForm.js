/**
 * 代理商档案 - 新建或编辑界面
 */
Ext.define("PSI.Agent.AgentEditForm",{
    extend:"Ext.window.Window",

    config:{
        parentForm:null,
        entity:null
    },

    initComponent:function(){
        var me = this;
        var entity = me.getEntity();
        this.adding = entity == null;

        var buttons = [];
        if(!entity){
            buttons.push({
                text:"保存并继续新增",
                formBind:true,
                handler:function(){
                    me.onOK(true);
                },
                scope:me
            });
        }

        buttons.push({
            text:"保存",
            formBind:true,
            iconCls:"PSI-button-ok",
            handler:function(){
                me.onOK(false);
            },
            scope:me
        },{
            text:entity == null ? "关闭" : "取消",
            handler:function(){
                me.close();
            },
            scope:me
        });


        Ext.apply(me,{
            title:entity == null ? "新增代理商" : "编辑代理商",
            modal:true,
            resizable:true,
            onEsc:Ext.emptyFn,
            width:550,
            height:480,
            layout:"fit",
            items:[{
                id:"editForm",
                xtype:"form",
                layout:{
                    type:"table",
                    columns:2
                },
                height:"100%",
                bodyPadding:5,
                defaultType:'textfield',
                fieldDefaults:{
                    labelWidth:90,
                    labelAlign:"right",
                    labelSeparator:"",
                    msgTarget:'side'
                },
                items:[{
                    xtype:"hidden",
                    name:"id",
                    value:entity == null ? null : entity.get("id")
                },{
                    id:"editCode",
                    fieldLabel:"代理商编号",
                    allowBlank:false,
                    blankText:"没有输入代理商编号",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"code",
                    value:entity == null ? null : entity.get("code"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
                },{
                    id:"editAgentName",
                    fieldLabel:"代理商名称",
                    allowBlank:false,
                    blankText:"没有输入代理商名称",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"agent_name",
                    value:entity == null ? null : entity.get("agent_name"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
                },{
                    id:"editRegion",
                    fieldLabel:"所属地区",
                    allowBlank:false,
                    blankText:"没有输入所属地区",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"region",
                    value:entity == null ? null : entity.get("region"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }

                },{
                    id:"editDutyEmployee",
                    fieldLabel:"负责人",
                    allowBlank:false,
                    blankText:"没有输入负责人信息",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"duty_employee",
                    value:entity == null ? null : entity.get("duty_employee"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
                },{
                    id:"editAddress",
                    fieldLabel:"公司地址",
                    name:"address",
                    value:entity == null ? null : entity.get("address"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
                },{
                    id:"editLinkName",
                    fieldLabel:"联系人姓名",
                    allowBlank:false,
                    blankText:"没有输入联系人姓名",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"link_name",
                    value:entity == null ? null : entity.get("link_name"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
                },{
                    id:"editGender",
                    fieldLabel:"联系人性别",
                    allowBlank:false,
                    blankText:"没有输入联系人性别",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"gender",
                    value:entity == null ? null : entity.get("gender"),
                    valueField: "name",
                    displayField: "name",
                    xtype: "combo",
                    store: new Ext.data.ArrayStore({
                        fields: ['id', 'name'],
                        data: [
                            ["1", '男'],
                            ["2", '女'],
                            ["3", '保密'],
                        ]
                    }),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
                },{
                    id:"editMobilePhone",
                    fieldLabel:"手机号码",
                    allowBlank:false,
                    blankText:"没有输入手机号码",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"mobile_phone",
                    value:entity == null ? null : entity.get("mobile_phone"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
                },{
                    id:"editPaymentWay",
                    fieldLabel:"付款方式",
                    allowBlank:false,
                    blankText:"没有输入付款方式",
                    beforeLabelTextTpl:PSI.Const.REQUIRED,
                    name:"payment_way",
                    value:entity == null ? null : entity.get("payment_way"),
                    valueField: "name",
                    displayField: "name",
                    xtype: "combo",
                    store: new Ext.data.ArrayStore({
                        fields: ['id', 'name'],
                        data: [
                            ["1", '现金'],
                            ["2", '电汇'],
                            ["3", '承兑'],
                        ]
                    }),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
                },{
                    id:"editTelephone",
                    fieldLabel:"固定电话",
                    name:"telephone",
                    value:entity == null ? null : entity.get("telephone"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
                },{
                    id:"editFax",
                    fieldLabel:"传真",
                    name:"fax",
                    value:entity == null ? null : entity.get("fax"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
                },{
                    id:"editQq",
                    fieldLabel:"QQ/微信",
                    name:"qq",
                    value:entity == null ? null : entity.get("qq"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
                },{
                    id:"editEmail",
                    fieldLabel:"邮箱",
                    name:"email",
                    value:entity == null ? null : entity.get("email"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
                },{
                    id:"editIdCard",
                    fieldLabel:"身份证号码",
                    name:"id_card",
                    value:entity == null ? null : entity.get("id_card"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    }
                },{
                    id:"editBankAccount",
                    fieldLabel:"银行账号",
                    name:"bank_account",
                    value:entity == null ? null : entity.get("bank_account"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    },
                    colspan:2,
                    width:490
                },{
                    id:"editNote",
                    fieldLabel:"备注",
                    name:"note",
                    value:entity == null ? null : entity.get("note"),
                    listeners:{
                        specialkey:{
                            fn:me.onEditSpecialKey,
                            scope:me
                        }
                    },
                    colspan:2,
                    width:490
                }],
                buttons:buttons
            }],
            listeners:{
                show:{
                    fn:me.onWndShow,
                    scope:me
                },
                close:{
                    fn:me.onWndClose,
                    scope:me
                }
            }
        });

        me.callParent(arguments);

        me.__editorList = ["editCode","editAgentName","editRegion",
            "editDutyEmployee","editAddress","editLinkName","editGender","editMobilePhone",
            "editPaymentWay","editTelephone","editFax","editQq","editEmail","editIdCard",
            "editBankAccount","editNote"];
    },
    onWndShow:function(){
        var me = this;
        if(me.adding){
            // 新建
            var grid = me.getParentForm().agentGrid;
            var item = grid.getSelectionModel().getSelection();
            if(item == null || item.length != 1){
                return;
            }
        }else{
            // 编辑
            var el = me.getEl();
            //el.mask(PSI.Const.LOADING);
            //Ext.Ajax.request({
            //			url : PSI.Const.BASE_URL + "Home/Agent/agentInfo",
            //			params : {
            //				id : me.getEntity().get("id")
            //			},
            //			method : "POST",
            //			callback : function(options, success, response) {
            //				if (success) {
            //					var data = Ext.JSON
            //							.decode(response.responseText);
            //					Ext.getCmp("editCategory")
            //							.setValue(data.categoryId);
            //					Ext.getCmp("editCode").setValue(data.code);
            //					Ext.getCmp("editName").setValue(data.name);
            //					Ext.getCmp("editManagerName")
            //							.setValue(data.address);
            //					Ext.getCmp("editManagerPhone")
            //							.setValue(data.contact01);
            //					Ext.getCmp("editManagerFax")
            //							.setValue(data.mobile01);
            //					Ext.getCmp("editInnerEmName").setValue(data.tel01);
            //					Ext.getCmp("editInnerEmPhone").setValue(data.qq01);
            //					Ext.getCmp("editInnerEmFax")
            //							.setValue(data.contact02);
            //					Ext.getCmp("editAccountantName")
            //							.setValue(data.mobile02);
            //					Ext.getCmp("editAccountantPhone").setValue(data.tel02);
            //					Ext.getCmp("editAccountantQQ").setValue(data.qq02);
            //					Ext.getCmp("editCompanyEmail")
            //							.setValue(data.addressShipping);
            //					Ext.getCmp("editInitPayables")
            //							.setValue(data.initPayables);
            //					Ext.getCmp("editInitPayablesDT")
            //							.setValue(data.initPayablesDT);
            //					Ext.getCmp("editCompanyPostcode")
            //							.setValue(data.bankName);
            //					Ext.getCmp("editCompanyBankaccount")
            //							.setValue(data.bankAccount);
            //					Ext.getCmp("editCompanyAddress").setValue(data.tax);
            //					Ext.getCmp("editNote").setValue(data.fax);
            //					Ext.getCmp("editNote").setValue(data.note);
            //				}
            //
            //				el.unmask();
            //			}
            //		});
        }

        var editCode = Ext.getCmp("editCode");
        editCode.focus();
        editCode.setValue(editCode.getValue());
    },
    // private
    onOK:function(thenAdd){
        var me = this;
        var f = Ext.getCmp("editForm");
        var el = f.getEl();
        el.mask(PSI.Const.SAVING);
        f.submit({
            url:PSI.Const.BASE_URL + "Home/Agent/editAgent",
            method:"POST",
            success:function(form,action){
                el.unmask();
                PSI.MsgBox.tip("数据保存成功");
                me.focus();
                me.__lastId = action.result.id;
                if(thenAdd){
                    me.clearEdit();
                }else{
                    me.close();
                }
            },
            failure:function(form,action){
                el.unmask();
                PSI.MsgBox.showInfo(action.result.msg,function(){
                    Ext.getCmp("editCode").focus();
                });
            }
        });
        me.getParentForm().freshAgentGrid;
    },
    onEditSpecialKey:function(field,e){
        if(e.getKey() === e.ENTER){
            var me = this;
            var id = field.getId();
            for(var i = 0; i < me.__editorList.length; i++){
                var editorId = me.__editorList[i];
                if(id === editorId){
                    var edit = Ext.getCmp(me.__editorList[i + 1]);
                    edit.focus();
                    edit.setValue(edit.getValue());
                }
            }
        }
    },
    onEditLastSpecialKey:function(field,e){
        if(e.getKey() === e.ENTER){
            var f = Ext.getCmp("editForm");
            if(f.getForm().isValid()){
                var me = this;
                me.onOK(me.adding);
            }
        }
    },
    clearEdit:function(){
        Ext.getCmp("editCode").focus();

        var editors = ["editCode","editAgentName","editRegion",
            "editDutyEmployee","editAddress","editLinkName","editGender","editMobilePhone",
            "editPaymentWay","editTelephone","editFax","editQq","editEmail","editIdCard",
            "editBankAccount","editNote"];
        for(var i = 0; i < editors.length; i++){
            var edit = Ext.getCmp(editors[i]);
            if(edit){
                edit.setValue(null);
                edit.clearInvalid();
            }
        }
    },
    onWndClose:function(){
        var me = this;
        if(me.__lastId){
            me.getParentForm().freshAgentGrid(me.__lastId);
        }
    }
});