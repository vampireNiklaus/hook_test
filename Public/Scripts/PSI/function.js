/**
 * Created by Administrator on 2016/4/29 0029.
 */
Ext.apply(Ext.form.field.VTypes, {
    OnlyNum:function (val, field) {
        return /^\d+(\.\d{1,2})?$/.test(val);
    },
    OnlyNumText: '只能输入数字小数点',
    OnlyNumMask: /[\d\.]/i
});