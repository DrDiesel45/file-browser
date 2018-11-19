Ext.define('Web.view.FileView', {
    extend: 'Ext.window.Window',
    alias: 'widget.filewindow',

    title: 'Файл',
    layout: 'fit',
    autoShow: true,

    initComponent: function () {
        this.items = [{
            xtype: 'form',
            items: [{
                xtype: 'textfield',
                name: 'name',
                fieldLabel: 'Название'
            },{
                xtype: 'textfield',
                name: 'type',
                fieldLabel: 'Тип'
            }]
        }];
        this.dockedItems = [{
            xtype: 'toolbar',
            docked: 'top',
            items: [{
                text: 'Создать',
                iconCls: 'new-icon',
                action: 'new'
            },{
                text: 'Добавить',
                iconCls: 'add-icon',
                action: 'add'
            },{
                text: 'Сохранить',
                iconCls: 'save-icon',
                action: 'save'
            },{
                text: 'Удалить',
                iconCls: 'delete-icon',
                action: 'delete'
            }]
        }];

        this.callParent(arguments);
    }
});