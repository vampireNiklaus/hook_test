/**
 * 银行存取款 - 主界面
 */
var summaryFilters = ['amount'];
Ext.define("PSI.BankDeposit.MainForm",{
    extend:"Ext.panel.Panel",

    config:{
        pAddBankDeposit:null,
        pEditBankDeposit:null,
        pDeleteBankDeposit:null,
        pAddBankDepositAssign:null,
        pEditBankDepositAssign:null,
        pDeleteBankDepositAssign:null
    },

    /**
     * 页面初始化
     */
    initComponent:function(){
        var me = this;
        //定义银行账户数据字段模型
        Ext.define("PSIBankAccountAssign",{
            extend:"Ext.data.Model",
            fields:["id","account_name","account_num","bank_name","init_money",
                "now_money","is_cash","disabled","is_cash_str","disabled_str","operate_info"
            ]
        });
        //账户数据
        var bankAccountStore = Ext.create("Ext.data.Store",{
            autoLoad:false,
            model:"PSIBankAccountAssign",
            data:[],
            pageSize:20,
            proxy:{
                type:"ajax",
                actionMethods:{
                    read:"POST"
                },
                url:PSI.Const.BASE_URL + "Home/BankDeposit/bankAccountList",
                reader:{
                    root:'bankAccountList',
                    totalProperty:'totalCount'
                }
            },
            listeners:{
                beforeload:{
                    fn:function(){
                        bankAccountStore.proxy.extraParams = me.getQueryParam();
                    },
                    scope:me
                },
                load:{
                    fn:function(e,records,successful){
                        if(successful){
                            me.refreshBankAccountGrid();
                            me.gotoBankAccountGridRecord(me.__lastId);
                        }
                    },
                    scope:me
                }
            }
        });
        //定义一个银行账户列表实例
        var bankAccountGrid = Ext.create("Ext.grid.Panel",{
            viewConfig:{
                enableTextSelection:true,
                forceFit:true
            },
            title:"账户列表",
            columnLines:true,
            columns:[Ext.create("Ext.grid.RowNumberer",{
                text:"序号",
                sortable:true,
                width:40
            }),{
                header:'id',
                dataIndex:'id',
                hidden:true
            },{
                header:"帐户名",
                dataIndex:"account_name",
                menuDisabled:false,
                sortable:true
            },{
                header:"银行卡号",
                dataIndex:"account_num",
                menuDisabled:false,
                sortable:true,
            },{
                header:"所在银行",
                dataIndex:"bank_name",
                menuDisabled:false,
                sortable:true
            },{
                header:"初始余额",
                dataIndex:"init_money",
                menuDisabled:false,
                sortable:true
            },{
                header:"当前余额",
                dataIndex:"now_money",
                menuDisabled:false,
                sortable:true
            },{
                header:"是否为现金账户",
                dataIndex:"is_cash_str",
                menuDisabled:false,
                sortable:true
            },{
                header:"资金流动详情",
                dataIndex:"operate_info",
                menuDisabled:false,
                sortable:true,
                hidden:true
            },{
                header:"是否已经停用",
                dataIndex:"disabled_str",
                menuDisabled:false,
                sortable:true
            }],
            store:bankAccountStore,
            bbar:[{
                id:"pagingToolbarBankAccount",
                border:0,
                xtype:"pagingtoolbar",
                store:bankAccountStore
            },"-",{
                xtype:"displayfield",
                value:"每页显示"
            },{
                id:"comboCountPerPageBankAccount",
                xtype:"combobox",
                editable:false,
                width:60,
                store:Ext.create("Ext.data.ArrayStore",{
                    fields:["text"],
                    data:[
                        ["20"],
                        ["50"],
                        ["100"],
                        ["300"],
                        ["1000"]
                    ]
                }),
                value:20,
                listeners:{
                    change:{
                        fn:function(){
                            bankAccountStore.pageSize = Ext.getCmp("comboCountPerPageBankAccount").getValue();
                            bankAccountStore.currentPage = 1;
                            Ext.getCmp("pagingToolbarBankAccount").doRefresh();
                        },
                        scope:me
                    }
                }
            },{
                xtype:"displayfield",
                value:"条记录"
            }],
            listeners:{
                select:{
                    fn:me.onBankAccountGridSelect,
                    scope:me
                },
                itemdblclick:{
                    fn:me.onEditBankAccount,
                    scope:me
                }
            }
        });
        bankAccountGrid.getView().on('render',function(view){
            view.tip = Ext.create('Ext.tip.ToolTip',{
                width:300,
                title:'采购单详情',
                padding:'5',
                // 所有的目标元素
                target:view.el,
                // 每个网格行导致其自己单独的显示和隐藏。
                delegate:view.itemSelector,
                // 在行上移动不能隐藏提示框
                trackMouse:true,
                // 立即呈现，tip.body可参照首秀前。
                renderTo:Ext.getBody(),
                autoHide:false,
                listeners:{
                    // 当元素被显示时动态改变内容.
                    beforeshow:function updateTipBody(tip){
                        var re = view.getRecord(tip.triggerElement);
                        tip.update(
                            "账户名称：" + re.get('account_name') + "</br>" +
                            "账号：" + re.get('account_num') + "</span></br>" +
                            "所在银行：" + re.get('bank_name') + "</span></br>" +
                            "起初余额：" + re.get('init_money') + "</span></br>" +
                            "当前余额：" + re.get('now_money') + "</br>"
                        );
                    }
                }
            });
        });
        me.bankAccountGrid = bankAccountGrid;


        //定义转账单数据字段模型
        Ext.define("PSIBankIOAssign",{
            extend:"Ext.data.Model",
            fields:["id","out_account_name","out_account_num","out_account_id",
                "in_account_name","in_account_num","in_account_id","amount","purpose","piaoju_code",
                "danju_code","create_time","creator_id","creator_name","verify_time","verifier_id","verifier_name","note","operate_info","status"
            ]
        });
        //转账单数据
        var bankIOStore = Ext.create("Ext.data.Store",{
            autoLoad:false,
            model:"PSIBankIOAssign",
            data:[],
            pageSize:20,
            proxy:{
                type:"ajax",
                actionMethods:{
                    read:"POST"
                },
                url:PSI.Const.BASE_URL + "Home/BankDeposit/bankIOList",
                reader:{
                    root:'bankIOList',
                    totalProperty:'totalCount'
                }
            },
            listeners:{
                beforeload:{
                    fn:function(){
                        bankIOStore.proxy.extraParams = me.getQueryParam();
                    },
                    scope:me
                },
                load:{
                    fn:function(e,records,successful){
                        if(successful){
                            me.refreshBankIOGrid();
                            me.gotoBankIOGridRecord(me.__lastId);
                        }
                    },
                    scope:me
                }
            }
        });
        var bankIOGrid = Ext.create("Ext.grid.Panel",{
            viewConfig:{
                enableTextSelection:true
            },
            title:"转账单列表",
            features:[{
                ftype:'summary',
                dock:'bottom'
            }],
            columnLines:true,
            columns:[Ext.create("Ext.grid.RowNumberer",{
                text:"序号",
                width:40
            }),{
                header:'id',
                dataIndex:'id',
                hidden:true
            },{
                header:"付款账户",
                dataIndex:"out_account_name",
                menuDisabled:false,
                sortable:false
            },{
                header:"付款卡号",
                dataIndex:"out_account_num",
                menuDisabled:false,
                sortable:false
            },{
                header:'out_account_id',
                dataIndex:'out_account_id',
                hidden:true
            },{
                header:"收款账户",
                dataIndex:"in_account_name",
                menuDisabled:false,
                sortable:false
            },{
                header:"收款卡号",
                dataIndex:"in_account_num",
                menuDisabled:false,
                sortable:false
            },{
                header:'in_account_id',
                dataIndex:'in_account_id',
                hidden:true
            },{
                header:"金额",
                dataIndex:"amount",
                menuDisabled:false,
                sortable:false,
            },{
                header:"用途",
                dataIndex:"purpose",
                menuDisabled:false,
                sortable:false
            },{
                header:"票据编号",
                dataIndex:"piaoju_code",
                menuDisabled:false,
                sortable:false
            },{
                header:"单据编号",
                dataIndex:"danju_code",
                menuDisabled:false,
                sortable:false
            },{
                header:"开单日期",
                dataIndex:"create_time",
                menuDisabled:false,
                sortable:false
            },{
                header:"开单人",
                dataIndex:"creator_name",
                menuDisabled:false,
                sortable:false
            },{
                header:"审核日期",
                dataIndex:"verify_time",
                menuDisabled:false,
                sortable:false
            },{
                header:"审核人",
                dataIndex:"verifier_name",
                menuDisabled:false,
                sortable:false
            },{
                header:"备注",
                dataIndex:"note",
                menuDisabled:false,
                sortable:false
            },{
                header:"操作详情",
                dataIndex:"operate_info",
                menuDisabled:false,
                sortable:false
            },{
                header:"状态",
                dataIndex:"status",
                menuDisabled:false,
                sortable:false,
                renderer : function(v){
                    if(v == 0){
                        return '<span style="color:red">未审核</span>';
                    }
                    if(v == 1){
                        return '<span style="color:blue">审核已通过</span>';
                    }
                    if(v == 2){
                        return '<span style="color:red">审核未通过</span>';
                    }
                }
            }],
            store:bankIOStore,
            bbar:[{
                id:"pagingToolbar",
                border:0,
                xtype:"pagingtoolbar",
                store:bankIOStore
            },"-",{
                xtype:"displayfield",
                value:"每页显示"
            },{
                id:"comboCountPerPage",
                xtype:"combobox",
                editable:false,
                width:60,
                store:Ext.create("Ext.data.ArrayStore",{
                    fields:["text"],
                    data:[
                        ["20"],
                        ["50"],
                        ["100"],
                        ["300"],
                        ["1000"]
                    ]
                }),
                value:20,
                listeners:{
                    change:{
                        fn:function(){
                            store.pageSize = Ext
                                .getCmp("comboCountPerPage")
                                .getValue();
                            store.currentPage = 1;
                            Ext.getCmp("pagingToolbar")
                                .doRefresh();
                        },
                        scope:me
                    }
                }
            },{
                xtype:"displayfield",
                value:"条记录"
            }],
            listeners:{
                itemdblclick:{
                    fn:me.onEditBankIO,
                    scope:me
                }
            }
        });
        var summaryColumns = bankIOGrid.columns;
        for(var i = 0; i < summaryColumns.length; i++){
            var itemname = summaryColumns[i].dataIndex;
            (function(itemname){
                summaryColumns[i].summaryType = summaryFilters.indexOf(itemname) < 0 ? false : function(records){
                    var gridSum = 0;
                    for(var i = 0; i < records.length; i++){
                        var item = records[i].get(itemname);
                        var itemPrice = Number.parseFloat(item);
                        gridSum += itemPrice;
                    }
                    return gridSum;
                }
                if(i === 1){
                    summaryColumns[1].summaryType = function(){
                        return '合计'
                    }
                }
            })(itemname)
        }
        bankIOGrid.getView().on('render',function(view){
            view.tip = Ext.create('Ext.tip.ToolTip',{
                width:300,
                title:'银行存取款单据详情',
                padding:'5',
                // 所有的目标元素
                target:view.el,
                // 每个网格行导致其自己单独的显示和隐藏。
                delegate:view.itemSelector,
                // 在行上移动不能隐藏提示框
                trackMouse:true,
                // 立即呈现，tip.body可参照首秀前。
                renderTo:Ext.getBody(),
                autoHide:false,
                listeners:{
                    // 当元素被显示时动态改变内容.
                    beforeshow:function updateTipBody(tip){
                        var re = view.getRecord(tip.triggerElement);
                        tip.update(
                            "付款账户：" + re.get('out_account_name') + "</br>" +
                            "付款卡号：" + re.get('out_account_num') + "</br>" +
                            "收款账户：" + re.get('in_account_name') + "</br>" +
                            "收款卡号：" + re.get('in_account_num') + "</br>" +
                            "金额：" + re.get('amount') + "</br>" +
                            "票据编号：" + re.get('piaoju_code') + "</span></br>" +
                            "创建时间：" + re.get('create_time') + "</span></br>" +
                            "备注：" + re.get('note') + "</span></br>" +
                            "操作详情：" + re.get('operate_info')
                        );
                    }
                }
            });
        });
        me.bankIOGrid = bankIOGrid;

        Ext.apply(me,{
            border:0,
            layout:"border",
            tbar:[{
                text:"新增转账单",
                iconCls:"PSI-button-add",
                handler:this.onAddBankIO,
                scope:this
            },{
                text:"编辑转账单",
                iconCls:"PSI-button-edit",
                handler:this.onEditBankIO,
                scope:this
            },{
                text:"删除转账单",
                iconCls:"PSI-button-delete",
                handler:this.onDeleteBankIO,
                scope:this
            },"-","-",{
                text:"流水详情",
                iconCls:"PSI-button-refresh",
                handler:this.onBankIODetail,
                scope:this
            },"-",{
                text:"新增银行账户",
                iconCls:"PSI-button-add-detail",
                handler:this.onAddBankAccount,
                scope:this
            },{
                text:"修改银行账户",
                iconCls:"PSI-button-edit-detail",
                handler:this.onEditBankAccount,
                scope:this
            },{
                text:"删除银行账户",
                iconCls:"PSI-button-delete-detail",
                handler:this.onDeleteBankAccount,
                scope:this
            },"-",{
                text:"审核",
                iconCls:"PSI-button-verify",
                scope:me,
                handler:me.onCommit,
                id:"buttonVerify"
            },{
                text:"反审核",
                iconCls:"PSI-button-revert-verify",
                scope:me,
                handler:me.onCommitReturn,
                id:"buttonRevertVerify"
            },"-",{
                text:"帮助",
                iconCls:"PSI-help",
                handler:function(){
                    window
                        .open("http://www.kangcenet.com");
                }
            },"-",{
                text:"关闭",
                iconCls:"PSI-button-exit",
                handler:function(){
                    location.replace(PSI.Const.BASE_URL);
                }
            }],
            items:[{
                region:"north",
                height:60,
                border:0,
                collapsible:true,
                title:"查询条件",
                layout:{
                    type:"table",
                    columns:4
                },
                items:[{
                    id:"editQueryAccountName",
                    labelWidth:60,
                    labelAlign:"right",
                    labelSeparator:"",
                    fieldLabel:"账户名",
                    margin:"5, 0, 0, 0",
                    xtype:"textfield",
                    listeners:{
                        specialkey:{
                            fn:me.onQueryEditSpecialKey,
                            scope:me
                        }
                    }
                },{
                    id:"editQueryAccountNum",
                    labelWidth:60,
                    labelAlign:"right",
                    labelSeparator:"",
                    fieldLabel:"银行卡号",
                    margin:"5, 0, 0, 0",
                    xtype:"textfield",
                    listeners:{
                        specialkey:{
                            fn:me.onQueryEditSpecialKey,
                            scope:me
                        }
                    }
                },{
                    xtype:"container",
                    items:[{
                        xtype:"button",
                        text:"查询",
                        width:100,
                        iconCls:"PSI-button-refresh",
                        margin:"5, 0, 0, 20",
                        handler:me.onQuery,
                        scope:me
                    },{
                        xtype:"button",
                        text:"清空查询条件",
                        width:100,
                        iconCls:"PSI-button-cancel",
                        margin:"5, 0, 0, 5",
                        handler:me.onClearQuery,
                        scope:me
                    }]
                }]
            },{
                region:"center",
                xtype:"container",
                layout:"border",
                border:0,
                items:[{
                    xtype:"panel",
                    layout:"fit",
                    border:0,
                    collapsible:true,
                    region:"center",
                    items:[bankIOGrid]
                },{
                    xtype:"panel",
                    collapsible:true,
                    region:"west",
                    layout:"fit",
                    width:'60%',
                    split:true,
                    border:0,
                    items:[bankAccountGrid]
                }]
            }]
        });


        me.callParent(arguments);

        me.__queryEditNameList = ["editQueryAccountName","editQueryAccountNum"];

        me.freshBankAccountGrid();
        me.freshBankIOGrid();
    },

    /**
     * 新增转账单
     */
    onAddBankIO:function(){
        var form = Ext.create("PSI.BankDeposit.BankIOEditForm",{
            parentForm:this
        });

        form.show();
    },

    /**
     * 编辑转账单
     */
    onEditBankIO:function(){
        var me = this;
        if(me.getPEditBankDeposit() == "0"){
            return;
        }

        var item = this.bankIOGrid.getSelectionModel().getSelection();
        if(item == null || item.length != 1){
            PSI.MsgBox.showInfo("请选择要编辑的转账单");
            return;
        }

        var io = item[0];
        if(io.get('status') == 1){
            PSI.MsgBox.showInfo("已审核，不得修改");
        }else{
            var form = Ext.create("PSI.BankDeposit.BankIOEditForm",{
                parentForm:this,
                entity:io
            });

            form.show();
        }

    },

    /**
     * 删除转账单
     */
    onDeleteBankIO:function(){
        var item = this.bankIOGrid.getSelectionModel().getSelection();
        if(item == null || item.length != 1){
            PSI.MsgBox.showInfo("请选择要删除的转账单");
            return;
        }

        var io = item[0];
        if(io.get('status') == 1){
            PSI.MsgBox.showInfo("已审核的转账单无法删除！");
            return;
        }
        var info = "请确认是否删除该转账单: <span style='color:red'>付款账户：" + io.get("out_account_name") + "，收款账户：" + io.get('in_account_name') + "</span>";
        var me = this;

        var store = me.bankIOGrid.getStore();
        var index = store.findExact("id",io.get("id"));
        index--;
        var preIndex = null;
        var preItem = store.getAt(index);
        if(preItem){
            preIndex = preItem.get("id");
        }

        PSI.MsgBox.confirm(info,function(){
            var el = Ext.getBody();
            el.mask("正在删除中...");
            Ext.Ajax.request({
                url:PSI.Const.BASE_URL + "Home/BankDeposit/deleteBankIO",
                method:"POST",
                params:{
                    id:io.get("id")
                },
                callback:function(options,success,response){
                    el.unmask();

                    if(success){
                        var data = Ext.JSON
                            .decode(response.responseText);
                        if(data.success){
                            PSI.MsgBox.tip("成功完成删除操作");
                            me.freshBankIOGrid(preIndex);
                        }else{
                            PSI.MsgBox.showInfo(data.msg);
                        }
                    }
                }
            });
        });
    },


    /**
     * 银行账户流水详情
     */
    onBankIODetail:function(){
        var item = this.bankAccountGrid.getSelectionModel().getSelection();
        if(item == null || item.length != 1){
            PSI.MsgBox.showInfo("请选择要查看的转账单");
            return;
        }
        var form = Ext.create("PSI.BankDeposit.BankIODetailForm",{
            parentForm:this,
            entity:item[0].data
        });
        form.show();
    },

    /**
     * 刷新账户列表
     */
    freshBankAccountGrid:function(){
        var me = this;
        var grid = me.bankAccountGrid;
        var store = grid.getStore();
        store.removeAll();
        store.load();
    },

    /**
     * 刷新转账单列表
     */
    freshBankIOGrid:function(){
        var me = this;
        var grid = me.bankIOGrid;
        var store = grid.getStore();
        store.removeAll();
        store.load();
    },
    refreshBankIOGrid:function(){
        var me = this;
        var item = me.bankIOGrid.getSelectionModel().getSelection();
        if(item == null || item.length != 1){
            return;
        }
    },
    refreshBankAccountGrid:function(){
        var me = this;
        var item = me.bankAccountGrid.getSelectionModel().getSelection();
        if(item == null || item.length != 1){
            return;
        }
        me.bankIOGrid.getStore().commitChanges();
    },

    /**
     * 银行账户被选中时候，刷新转账单
     */
    onBankAccountGridSelect:function(){
        var me = this;
        me.bankIOGrid.getStore().currentPage = 1;
        me.freshBankIOGrid();
    },

    /**
     * 新增银行账户
     */
    onAddBankAccount:function(){
        var form = Ext.create("PSI.BankDeposit.BankAccountEditForm",{
            parentForm:this
        });

        form.show();
    },

    /**
     * 编辑银行账户
     */
    onEditBankAccount:function(){
        var me = this;
        // if (me.getPEditBankAccount() == "0") {
        // 	return;
        // }

        var item = this.bankAccountGrid.getSelectionModel().getSelection();
        if(item == null || item.length != 1){
            PSI.MsgBox.showInfo("没有选择银行账户");
            return;
        }
        var account = item[0];

        var form = Ext.create("PSI.BankDeposit.BankAccountEditForm",{
            parentForm:this,
            entity:account
        });
        form.show();


    },

    /**
     * 删除银行账户
     */
    onDeleteBankAccount:function(){
        var me = this;
        var item = me.bankAccountGrid.getSelectionModel().getSelection();
        if(item == null || item.length != 1){
            PSI.MsgBox.showInfo("请选择要删除的银行账户");
            return;
        }

        var account = item[0];

        var store = me.bankAccountGrid.getStore();
        var index = store.findExact("id",account.get("id"));
        index--;
        var preIndex = null;
        var preItem = store.getAt(index);
        if(preItem){
            preIndex = preItem.get("id");
        }

        var info = "请确认是否删除银行账户: <span style='color:red'>" + account.get("account_name") + "</span>";
        var me = this;
        PSI.MsgBox.confirm(info,function(){
            var el = Ext.getBody();
            el.mask("正在删除中...");
            Ext.Ajax.request({
                url:PSI.Const.BASE_URL + "Home/BankDeposit/deleteBankAccount",
                method:"POST",
                params:{
                    id:account.get("id")
                },
                callback:function(options,success,response){
                    el.unmask();

                    if(success){
                        var data = Ext.JSON.decode(response.responseText);
                        if(data.success){
                            PSI.MsgBox.tip("成功完成删除操作");
                            me.freshBankAccountGrid(preIndex);
                        }else{
                            PSI.MsgBox.showInfo(data.msg);
                        }
                    }
                }

            });
        });
    },

    gotoBankAccountGridRecord:function(id){
        var me = this;
        var grid = me.bankAccountGrid;
        var store = grid.getStore();
        if(id){
            var r = store.findExact("id",id);
            if(r != -1){
                grid.getSelectionModel().select(r);
            }else{
                grid.getSelectionModel().select(0);
            }
        }
    },
    gotoBankIOGridRecord:function(id){
        var me = this;
        var grid = me.bankIOGrid;
        var store = grid.getStore();
        if(id){
            var r = store.findExact("id",id);
            if(r != -1){
                grid.getSelectionModel().select(r);
            }else{
                grid.getSelectionModel().select(0);
            }
        }else{
            grid.getSelectionModel().select(0);
        }
    },


    // 提交采购入库单
    onCommit:function(){
        var me = this;
        var item = me.bankIOGrid.getSelectionModel().getSelection();
        if(item == null || item.length != 1){
            PSI.MsgBox.showInfo("没有选择要编辑的转账单");
            return;
        }
        var bill = item[0];

        if(bill.get("status") == 1){
            PSI.MsgBox.showInfo("该转账单已经审核过了");
            return;
        }

        var info = "请确认转账单: <span style='color:red'>付款账户：" + bill.get("out_account_name") + "，收款账户：" + bill.get("in_account_name") + "，金额：" + bill.get("amount") + "</span> 审核通过?";
        PSI.MsgBox.verify(info,function(){
            //审核通过
            me.verifyRequest(bill,'yes')
        },function(){
            //审核不通过
            me.verifyRequest(bill,'no')
        });
    },
    onCommitReturn:function(){
        var me = this;
        var item = me.bankIOGrid.getSelectionModel().getSelection();
        if(item == null || item.length != 1){
            PSI.MsgBox.showInfo("没有选择要编辑的转账单");
            return;
        }
        var bill = item[0];

        if(bill.get("status") != 1){
            PSI.MsgBox.showInfo("该转账单无法进行此操作");
            return;
        }
        var info = "确认要反审核该转账单: <span style='color:red'>付款账户：" + bill.get("out_account_name") + "，收款账户：" + bill.get("in_account_name") + "，金额：" + bill.get("amount") + "</span> ？";
        PSI.MsgBox.confirm(info,function(){
            me.verifyRequest(bill,'return')
        });
    },

    verifyRequest:function(bill,type){
        var id = bill.get("id");
        var me = this;
        var el = Ext.getBody();
        el.mask("正在提交中...");
        Ext.Ajax.request({
            url:PSI.Const.BASE_URL + "Home/BankDeposit/IOstatus",
            method:"POST",
            params:{
                id:id,
                type:type
            },
            callback:function(options,success,response){
                el.unmask();

                if(success){
                    var data = Ext.JSON.decode(response.responseText);
                    if(data.success){
                        PSI.MsgBox.showInfo("操作成功",function(){
                            me.freshBankIOGrid();
                            me.freshBankAccountGrid();
                        });
                    }else{
                        PSI.MsgBox.showInfo(data.msg);
                    }
                }else{
                    PSI.MsgBox.showInfo("网络错误",function(){
                        window.location.reload();
                    });
                }
            }
        });
    },


    onQueryEditSpecialKey:function(field,e){
        if(e.getKey() === e.ENTER){
            var me = this;
            var id = field.getId();
            for(var i = 0; i < me.__queryEditNameList.length - 1; i++){
                var editorId = me.__queryEditNameList[i];
                if(id === editorId){
                    var edit = Ext.getCmp(me.__queryEditNameList[i + 1]);
                    edit.focus();
                    edit.setValue(edit.getValue());
                }
            }
        }
    },

    onLastQueryEditSpecialKey:function(field,e){
        if(e.getKey() === e.ENTER){
            this.onQuery();
        }
    },

    getQueryParam:function(){
        var me = this;
        var item = me.bankAccountGrid.getSelectionModel().getSelection();
        var accountId;
        if(item == null || item.length != 1){
            accountId = null;
        }else{
            accountId = item[0].get("id");
        }

        var result = {
            account_id:accountId
        };

        var account_name = Ext.getCmp("editQueryAccountName").getValue();
        if(account_name){
            result.account_name = account_name;
        }

        var account_num = Ext.getCmp("editQueryAccountNum").getValue();
        if(account_num){
            result.account_num = account_num;
        }

        return result;
    },

    onQuery:function(){
        this.freshBankAccountGrid();
    },

    onClearQuery:function(){
        var nameList = this.__queryEditNameList;
        for(var i = 0; i < nameList.length; i++){
            var name = nameList[i];
            var edit = Ext.getCmp(name);
            if(edit){
                edit.setValue(null);
            }
        }
        this.bankAccountGrid.getSelectionModel().clearSelections();
        this.onQuery();
        this.freshBankAccountGrid();
        this.freshBankIOGrid();
    }
});