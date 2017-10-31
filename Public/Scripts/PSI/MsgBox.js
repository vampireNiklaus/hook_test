// 信息提示框
Ext.define("PSI.MsgBox", {
    statics: {
    	// 显示提示信息
        showInfo: function (info, func) {
            Ext.Msg.show({
                title: "提示",
                msg: info,
                icon: Ext.Msg.INFO,
                buttons: Ext.Msg.OK,
                modal: true,
                fn: function () {
                    if (func) {
                        func();
                    }
                }
            });
        },
        
        // 显示确认信息
        confirm: function (confirmInfo, funcOnYes) {
            Ext.Msg.show({
                title: "提示",
                msg: confirmInfo,
                icon: Ext.Msg.QUESTION,
                buttons: Ext.Msg.YESNO,
                modal: true,
                defaultFocus: "no",
                fn: function (id) {
                    if (id === "yes" && funcOnYes) {
                        funcOnYes();
                    }
                }
            });
        },

        // 显示审核信息
        verify: function (confirmInfo, funcOnYes, funcOnNo) {
            Ext.Msg.show({
                title: "提示",
                msg: confirmInfo,
                icon: Ext.Msg.QUESTION,
                buttons: Ext.Msg.YESNOCANCEL,
                buttonText:{yes: "通过", no: "未通过", cancel: "取消"},
                modal: true,
                defaultFocus: "cancel",
                fn: function (id) {
                    if (id === "yes" && funcOnYes) {
                        funcOnYes();
                    }else if(id==='no' && funcOnNo){
                        funcOnNo();
                    }
                }
            });
        },

        // 显示去编辑信息
        toedit: function (confirmInfo, funcOnYes, funcOnNo) {
            Ext.Msg.show({
                title: "提示",
                msg: confirmInfo,
                icon: Ext.Msg.QUESTION,
                buttons: Ext.Msg.YESNOCANCEL,
                buttonText:{yes: "去编辑", no: "放弃", cancel: "取消"},
                modal: true,
                defaultFocus: "cancel",
                fn: function (id) {
                    if (id === "yes" && funcOnYes) {
                        funcOnYes();
                    }else if(id==='no' && funcOnNo){
                        funcOnNo();
                    }
                }
            });
        },

        
        // 显示提示信息，提示信息会自动关闭
        tip: function (info) {
            var wnd = Ext.create("Ext.window.Window", {
                modal: false,
                onEsc: Ext.emptyFn,
                width: 300,
                height: 100,
                header: false,
                laytout: "fit",
                border: 0,
                items: [
                    {
                        xtype: "container",
                        html: "<h3>提示</h3><p>" + info + "</p>"
                    }
                ]
            });

            wnd.showAt(document.body.clientWidth / 2 - 150, 0);

            Ext.Function.defer(function () {
                wnd.hide();
                wnd.close();
            }, 2000);
        }
    }
});