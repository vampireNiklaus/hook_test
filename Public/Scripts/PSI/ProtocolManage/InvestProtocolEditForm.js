/**
 * 招商协议单
 *
 * @author rcg
 */
Ext.define("PSI.ProtocolManage.InvestProtocolEditForm",{
    extend:"Ext.window.Window",

    config:{
        parentForm:null,
        entity:null,
        status:null,
        pProtocolDetailDelete:null,
        pProtocolDetailAdd:null

    },

    detailGrid:[],

    /**
     * 初始化组件
     */
    initComponent:function(){
        var me = this;
        var entity = me.getEntity();
        var status = Number.parseInt(me.getStatus());
        me.adding = entity == null;
        if(!me.adding)
            me.entity = entity;
        var buttons = [];

        buttons.push({
            text:'保存修改',
            formBind:true,
            iconCls:"PSI-button-ok",
            handler:function(){
                me.onOk();
            },
            scope:me
        });
        buttons.push({
            text:'添加协议明细',
            formBind:true,
            iconCls:"PSI-button-ok",
            handler:function(){
                me.onAddInvestProtocolDetail();
            },
            scope:me
        });
        buttons.push({
            text:"关闭",
            handler:function(){
                me.close();
            },
            scope:me
        });


        Ext.apply(me,{
            title:entity == null ? "新增招商协议单" : "编辑招商协议单",

            resizable:true,
            maximizable:true,
            maximized:true,
            onEsc:Ext.emptyFn,
            width:600,
            height:500,
            layout:"fit",
            items:[{
                id:"importForm",
                xtype:"form",
                layout:"border",
                items:[{
                    region:'center',
                    layout:"border",
                    xtype:"container",
                    border:0,
                    height:600,
                    items:[{
                        region:"center",
                        height:400,
                        border:0,
                        layout:"border",
                        items:[{
                            xtype:"panel",
                            region:"center",
                            border:0,
                            layout:"fit",
                            items:me.getInvestProtocolSubGrid()
                        }]
                    },{
                        region:'north',
                        layout:{
                            type:"table",
                            columns:10
                        },
                        height:100,
                        hidden:status === 1,
                        border:0,
                        title:"选择协议基础数据",
                        items:[{
                            id : "edit_drug_name",
                            fieldLabel : "药品",
                            allowBlank : false,
                            emptyText : "选择药品",
                            beforeLabelTextTpl : PSI.Const.REQUIRED,
                            name:"drug_name",
                            xtype : "psi_drug_field",
                            selfDrug:true,
                            callbackFunc:me.selectDrug,
                            margin:'5px',
                            width:300,
                            value : entity == null ? null : entity.get("drug_name"),
                            listeners : {
                                specialkey : {
                                    fn : me.onEditSpecialKey,
                                    scope : me
                                }
                            }
                        },{
                            id : "id",
                            xtype:'hidden',
                            value : entity == null ? null : entity.get("id"),
                        },{
                            id : "edit_drug_id",
                            xtype:'hidden',
                            value : entity == null ? null : entity.get("drug_id"),
                        },{
                            id : "eidt_drug_jx",
                            fieldLabel : "剂型",
                            xtype:'displayfield',
                            value : entity == null ? '<span style="color:#6B6B6B">根据药品信息生成</span>' : entity.get("drug_jx"),
                        }, {
                            id : "edit_drug_guige",
                            fieldLabel : "规格",
                            xtype:'displayfield',
                            value : entity == null ? '<span style="color:#6B6B6B">根据药品信息生成</span>' : entity.get("drug_guige"),
                        },{
                            id:'edit_drug_jldw',
                            fieldLabel : "计量单位",
                            value : entity == null ? '<span style="color:#6B6B6B">根据药品信息生成</span>' : entity.get("drug_jldw"),
                            xtype:'displayfield',
                            listeners:{
                                specialkey:{
                                    fn:me.onEditSpecialKey,
                                    scope:me
                                }
                            }
                        }, {
                            id : "edit_agent_name",
                            allowBlank : false,
                            fieldLabel : "代理商",
                            xtype:'psi_agent_field',
                            colspan : 6,
                            width:250,
                            emptyText : "选择代理商",
                            name:"agent_name",
                            beforeLabelTextTpl : PSI.Const.REQUIRED,
                            value : entity == null ? null : entity.get("agent_name"),
                            listeners : {
                                specialkey : {
                                    fn : me.onEditSpecialKey,
                                    scope : me
                                }
                            },
                            callbackFunc:me.selectAgent
                        },{
                            id : "edit_agent_id",
                            xtype:'hidden',
                            value : entity == null ? null : entity.get("agent_id"),
                        },{
                            id:"edit_protocol_number",
                            fieldLabel:"协议编号",
                            xtype: "displayfield",
                            width:300,
                            name:"protocol_number",
                            value:entity == null ? '<span style="color:#6B6B6B">自动生成</span>' : entity.get("protocol_number"),
                            listeners:{
                                specialkey:{
                                    fn:me.onEditSpecialKey,
                                    scope:me
                                }
                            }

                        },{
                            fieldLabel:"开始日期",
                            labelSeparator:"：",
                            labelAlign:"right",
                            xtype:'datefield',
                            format:"Y-m-d",
                            id:"edit_start_date",
                            beforeLabelTextTpl : PSI.Const.REQUIRED,
                            margin:'5px',
                            value:entity == null ? new Date() : entity.get('start_date'),
                        },{
                            fieldLabel:"结束日期",
                            labelSeparator:"：",
                            labelAlign:"right",
                            xtype:'datefield',
                            format:"Y-m-d",
                            id:"edit_end_date",
                            margin:'5px',
                            beforeLabelTextTpl:PSI.Const.REQUIRED,
                            value:entity == null ? new Date() : entity.get('end_date'),
                            listeners:{
                                specialkey:{
                                    fn:me.onEditBizDTSpecialKey,
                                    scope:me
                                }
                            }
                        },{
                            fieldLabel:"执行时间",
                            labelSeparator:"：",
                            labelAlign:"right",
                            xtype:'datefield',
                            format:"Y-m-d",
                            id:"edit_execute_date",
                            margin:'5px',
                            beforeLabelTextTpl:PSI.Const.REQUIRED,
                            value:entity == null ? new Date() : entity.get('execute_date'),
                        }]
                    }]
                }]
            }],
            buttons:buttons,
            listeners:{
                // show : {
                // 	fn : me.onWndShow,
                // 	scope : me
                // },
                close:{
                    fn:function(){
                        // me.getParentForm().freshInvestProtocolGrid();
                    },
                    scope:me
                }
            }
        });

        me.callParent(arguments);
        me.refreshInvestProtocolGrid(1);
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

    getQueryCmp:function(){
        var me = this;
        return [{
            id:"editQueryEmployee",
            labelWidth:60,
            labelAlign:"right",
            labelSeparator:"",
            fieldLabel:"业务员",
            margin:"5, 0, 0, 0",
            xtype:"psi_employeefield",
            listeners:{
                change:function(){

                }
            }
        },{
            id:"editQueryDate",
            xtype:'monthfield',
            fieldLabel:'业务日期',
            editable:false,
            margin:"5, 0, 0, 0",
            labelWidth:60,
            labelAlign:'right',
            format:'Y-m',
            value:new Date()
        },{
            id:"editQuerySearchDateFrom",
            labelWidth:120,
            labelAlign:"right",
            labelSeparator:"：",
            fieldLabel:"业务日期范围（起）",
            margin:"5, 0, 0, 0",
            allowBlank:false,
            width:300,
            xtype:"datefield",
            format:"Y-m-d",
            value:new Date(),
            listeners:{
                change:function(){

                }
            }
        },{
            id:"editQuerySearchDateTo",
            labelWidth:120,
            labelAlign:"right",
            labelSeparator:"：",
            fieldLabel:"业务日期范围（止）",
            margin:"5, 0, 0, 0",
            allowBlank:false,
            width:300,
            xtype:"datefield",
            format:"Y-m-d",
            value:new Date(),
            listeners:{
                change:function(){

                }
            }
        },{
            xtype:"container",
            items:[{
                xtype:"button",
                text:"查询",
                width:100,
                margin:"5 0 0 10",
                iconCls:"PSI-button-refresh",
                handler:me.onQuery,
                scope:me
            },{
                xtype:"button",
                text:"清空查询条件",
                width:100,
                margin:"5, 0, 0, 10",
                handler:me.onClearQuery,
                scope:me
            }]
        }];
    },


    //获取协议明细列表
    getInvestProtocolSubGrid:function(){
        var me = this;
        if(me.investProtocolSubGrid){
            return me.investProtocolSubGrid;
        }
        me.deselectArr = [];
        var modelName = "PSIInvestProtocol";
        Ext.define(modelName,{
            extend:"Ext.data.Model",
            fields:["id", "parent_protocol_id", "region",
                "hospital_name","drug_name", "drug_id","cover_business",
                "drug_guige", "cash_deposit","if_pay",
                "agent_name", "protocol_amount", "bidding_price",
                "commission","flow_type", "zs_employee","zs_commission",
                "develop_time","execute_date", "start_date", "end_date", "note"
            ]
        });
        var url = me.adding ? "Home/ProtocolManage/getInvestProtocolDetail" : "Home/ProtocolManage/getEditInvestProtocolDetail";
        var sm = Ext.create('Ext.selection.CheckboxModel',{
            injectCheckbox:0, //checkbox位于哪一列，默认值为0
            //mode:'single',//multi,simple,single；默认为多选multi
            checkOnly:true, //如果值为true，则只用点击checkbox列才能选中此条记录
            //allowDeselect:true,//如果值true，并且mode值为单选（single）时，可以通过点击checkbox取消对其的选择
            //enableKeyNav:false,
            // renderer:function(){
            //
            // }
        });
        var store = Ext.create("Ext.data.Store",{
            autoLoad:true,
            model:modelName,
            data:[],
            pageSize:20,
            proxy:{
                type:"ajax",
                actionMethods:{
                    read:"POST"
                },
                url:PSI.Const.BASE_URL + url,
                reader:{
                    root:'protocolDetailList',
                    totalProperty:'totalCount'
                }
            }
        });
        store.on("beforeload",function(){
            if(me.adding) //新建
                store.proxy.extraParams = me.getParentSelectParam();
            else{
                store.proxy.extraParams = me.getParentSelectParam4Edit();
            }
        });
        store.on("load",function(e,records,successful){
            if(successful){
                sm.selectAll();
                for(var i in records){
                    if(records[i].get('paybill_id') == '0'){
                        sm.deselect(records[i]);
                    }
                }
            }
        });

        me.__cellEditing = Ext.create("PSI.UX.CellEditing",{
            clicksToEdit:1,
            listeners:{
                edit:{
                    fn:me.cellEditingAfterEdit,
                    scope:me
                }
            }
        });

        me.investProtocolSubGrid = Ext.create("Ext.grid.Panel",{
            viewConfig:{
                enableTextSelection:true,
                scroll:'horizontal',
                autoScroll:true
            },
            border:0,
            deferRowRender:false,
            title:"协议明细列表",
            selModel:sm,
            columnLines:true,
            features:[{
                ftype:'summary'
            }],
            columns:[Ext.create("Ext.grid.RowNumberer",{
                text:"序号",
                width:30
            }),{
                header:"地区",
                dataIndex:"region",
                menuDisabled:false,
                sortable:false,
            },{
                header:"医院名称",
                dataIndex:"hospital_name",
                menuDisabled:false,
                sortable:false,
            },{
                header:"药品名称",
                dataIndex:"drug_name",
                menuDisabled:false,
                sortable:false,
            },{
                header:"药品规格",
                dataIndex:"drug_guige",
            },{
                header:"保证金",
                dataIndex:"cash_deposit",
            },{
                header:"保证金到账情况",
                dataIndex:"if_pay",
                renderer : function(v){
                    if(v == 0){
                        return '<span style="color:red">未到账</span>';
                    }
                    if(v == 1){
                        return '<span style="color:blue">已到账</span>';
                    }

                }
            },{
                header:"开发时间",
                dataIndex:"develop_time",
            },{
                header:"协议销量",
                dataIndex:"protocol_amount",
            },{
                header:"中标价",
                dataIndex:"bidding_price",
            },{
                header:"佣金",
                dataIndex:"commission",

            },{
                header:"覆盖商业",
                dataIndex:"cover_business",

            },{
                header:"流向形式",
                dataIndex:"flow_type",

            },{
                header:"招商人员",
                dataIndex:"zs_employee",

            },{
                header:"招商佣金",
                dataIndex:"zs_commission",
            },{
                header:"删除",
                id:"protocolDetailColumnActionDelete",
                disabled:me.getPProtocolDetailDelete() == "0",
                align:"center",
                menuDisabled:false,
                draggable:false,
                width:50,
                xtype:"actioncolumn",
                items:[{
                    icon:PSI.Const.BASE_URL + "Public/Images/icons/delete.png",
                    handler:function(grid,row){
                        // if(me.getPProtocolDetailDelete() == "0"){
                        //     PSI.MsgBox.showInfo("没有操作权限");
                        //     return;
                        // }
                        me.onDeleteProtocolDetailItem(grid,row);
                    },
                    scope:me
                }]
            },{
                header:"编辑",
                id:"protocolDetailColumnActionEdit",
                align:"center",
                menuDisabled:false,
                draggable:false,
                width:50,
                xtype:"actioncolumn",
                items:[{
                    icon:PSI.Const.BASE_URL + "Public/Images/icons/edit.png",
                    handler:function(grid,row){
                        me.onEditProtocolDetailItem(grid,row);
                    },
                    scope:me
                }]
            }],
            store:store,
            listeners:{
                itemdblclick:{
                    fn:function(){
                        return false;
                    },
                    scope:me
                }
            },
        });

        if(!me.adding)
            store.load();

        return me.investProtocolSubGrid;
    },


    //获取查询的字段
    getQueryParam:function(){
        var me = this;

        var result = {};
        var entity = me.getEntity();

        var employee_id = Ext.getCmp("editQueryEmployee").getIdValue();
        if(employee_id){
            result.employee_id = employee_id;
        }

        // var date = Ext.getCmp("editQueryDate").getValue();
        var date = "";
        if(date){
            result.date = Ext.Date.format(date,"Y-m");
        }
        var search_date_from = Ext.getCmp('editQuerySearchDateFrom').getValue();
        if(search_date_from){
            result.search_date_from = Ext.Date.format(search_date_from,"Y-m-d");
        }
        var search_date_to = Ext.getCmp('editQuerySearchDateTo').getValue();
        if(search_date_to){
            result.search_date_to = Ext.Date.format(search_date_to,"Y-m-d");
        }
        result.edit_id = me.adding ? null : {
            'edit_id':entity.get('id')
        };
        return result;
    },

    onOk:function(){

        var me = this;
        var id = Ext.getCmp('id').getValue();
        var parentDrug_id = Ext.getCmp('edit_drug_id').getValue();
        var parentAgent_id = Ext.getCmp('edit_agent_id').getValue();
        var start_date = Ext.Date.format(Ext.getCmp('edit_start_date').getValue(), "Y-m-d");
        var end_date = Ext.Date.format(Ext.getCmp('edit_end_date').getValue(), "Y-m-d");
        var protocol_number = Ext.getCmp('edit_protocol_number').getValue();
        var execute_date = Ext.Date.format(Ext.getCmp('edit_execute_date').getValue(), "Y-m-d");

        var result = {
            itemDatas:[],
            id:id,
            parentDrug_id:parentDrug_id,
            parentAgent_id:parentAgent_id,
            start_date:start_date,
            end_date:end_date,
            execute_date:execute_date,
            protocol_number:protocol_number
        };

        var selected_items = me.getInvestProtocolSubGrid().getSelectionModel().getSelection();
        for(var i= 0;i<selected_items.length;i++)
            result.itemDatas.push(selected_items[i].getData());

        var el = me.getEl() || Ext.getBody();
        el.mask(PSI.Const.LOADING);
        Ext.Ajax.request({
            url : PSI.Const.BASE_URL + "Home/ProtocolManage/editProtocolParentManage",
            method : "POST",
            params : {itemDatas:Ext.JSON.encode(result)},
            callback : function(options, success, response) {
                if (success) {
                    el.unmask();
                    me.close();
                }
            }
        });

    },

    //搜索查询
    onQuery:function(){
        var me = this;
        var grid = me.dailySellGrid;
        var params = me.getQueryParam();
        var store = grid.getStore();
        store.load();
    },
    refreshInvestProtocolGrid:function(id){

    },

    //新增协议明细
    onAddInvestProtocolDetail:function(){
        var me = this;
        if(me.getPProtocolDetailAdd() == "0"){
            PSI.MsgBox.showInfo("没有操作权限");
            return;
        }
        var form = Ext.create("PSI.ProtocolManage.InvestProtocolDetailAddEditForm",{
            parentForm:this
        });

        form.show();
    },

    //搜索查询
    onQuery4Edit:function(){
        var me = this;
        var grid = me.investProtocolSubGrid;
        var store = grid.getStore();
        store.removeAll();
        store.load();
    },

    //清空查询条件
    onClearQuery:function(){
        Ext.getCmp("editQueryDate").setValue(new Date());
        Ext.getCmp("editQueryEmployee").setValue(null);
        Ext.getCmp("editQueryEmployee").setIdValue(null);
        this.onQuery();
    },


    getParentSelectParam4Edit:function(){
        var me = this;

        return {
            'parent_id':me.entity.get('id'),

        };
    },

    //获取选中的
    getSelectSell:function(){
        var me = this;
        var result = [];
        var grid = me.investProtocolSubGrid;
        var selects = grid.getSelectionModel().getSelection();

        //遍历获取id，塞进数组
        for(var i in selects){
            result['select_' + i] = {
                'sell_id_list':selects[i].get('sell_id_list'),
            };
        }
        return result;
    },
    // onDeleteProtocolDetailItem:function(grid,row){
    //     var me = this;
    //     var store = grid.getStore();
    //     store.remove(store.getAt(row));
    // },
    //删除协议明细列表条目
    onDeleteProtocolDetailItem: function(grid, row) {
        var me = this;
        var store = grid.getStore();
        var item = store.getAt(row).getData();
        var target_id = item.id;
        if (target_id == "" || parseInt(target_id) != target_id) {
            store.remove(store.getAt(row));
            return;
        }
        var info = "请确认是否删除该条协议明细:药品名称为 <span style='color:red'>" + item.drug_name + " " + "</span>";

        PSI.MsgBox.confirm(info, function() {
            var el = Ext.getBody();
            el.mask("正在删除中...");
            Ext.Ajax.request({
                url: PSI.Const.BASE_URL + "Home/ProtocolManage/deleteProtocolDetailItem",
                method: "POST",
                params: {
                    id: target_id
                },
                callback: function(options, success, response) {
                    el.unmask();
                    if (success) {
                        var data = Ext.JSON
                            .decode(response.responseText);
                        if (data.success) {
                            PSI.MsgBox.tip("成功完成删除操作");
                            store.remove(store.getAt(row));
                            if (store.getCount() == 0) {
                                store.add({});
                            }
                            me.refreshInvestProtocolGrid();
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
     * 编辑协议明细条目
     */
    onEditProtocolDetailItem: function(grid,row) {
        var me = this;

        var item = grid.getStore().getAt(row);
        if (item == null){
            PSI.MsgBox.showInfo("请选择要编辑的协议管理");
            return;
        }

        var protocolDetail = item;

        var form = Ext.create("PSI.ProtocolManage.InvestProtocolDetailAddEditForm", {
            parentForm: this,
            entity: protocolDetail
        });

        form.show();
    },
    selectDrug : function(scope,data){
        //这个方法被调用的时候，this指向的是window
        Ext.getCmp('eidt_drug_jx').setValue(data.jx);
        Ext.getCmp('edit_drug_guige').setValue(data.guige);
        Ext.getCmp('edit_drug_jldw').setValue(data.jldw);
        Ext.getCmp('edit_drug_id').setValue(data.id);
    },

    selectAgent:function(scope,data){
        var me = this;
        if(scope){
            me = scope;
        }
        Ext.getCmp("edit_agent_id").setValue(data.id);
    },
    addProtocolDetailData:function(data){
        var me = this;
        var store = me.investProtocolSubGrid.getStore();
        if(data.id) {
            var index = store.findExact("id",data.get("id"));
            store.getAt(index).set('region',data.region);
            store.getAt(index).set('hospital_name',data.hospital_name);
            store.getAt(index).set('drug_name',data.drug_name);
            store.getAt(index).set('drug_guige',data.drug_guige);
            store.getAt(index).set('cash_deposit',data.cash_deposit);
            store.getAt(index).set('if_pay',data.if_pay);
            store.getAt(index).set('develop_time',data.develop_time);
            store.getAt(index).set('protocol_amount',data.protocol_amount);
            store.getAt(index).set('bidding_price',data.bidding_price);
            store.getAt(index).set('commission',data.commission);
            store.getAt(index).set('flow_type',data.flow_type);
            store.getAt(index).set('cover_business',data.cover_business);
            store.getAt(index).set('zs_employee',data.zs_employee);
            store.getAt(index).set('zs_commission',data.zs_commission);
        }else {
            store.add(data);
        }



    },


});