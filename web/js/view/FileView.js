Ext.define('Web.view.FileView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.fileview',
    controller: 'filectrl',

    padding: '2px',

    items: [{
        title: 'Файловая система',
        xtype: 'grid',
        reference: 'fileGrid',
        alias: 'widget.myGrid',
        store: 'FileStore',

        columnLines: true,
        columns: [{
            header: 'Имя', dataIndex: 'name', flex: 1
        }, {
            header: 'Размер', dataIndex: 'size', width: 100
        }, {
            header: 'Тип', dataIndex: 'type', width: 100
        }, {
            header: 'Дата', dataIndex: 'date',
            xtype: 'datecolumn', format: 'Y-m-d H:i:s', width: 200
        }],

        listeners: {
            rowdblclick: 'changePath',
            itemcontextmenu: 'contextFile',
        },

        dockedItems: [{
            xtype: 'toolbar',
            dock: 'top',
            items: [{
                text: 'Файловое хранилище',
                tooltip: 'Выбрать локальное файловое хранилище',
                listeners: {

                }
            }, '-', {
                text: 'Amazon S3',
                tooltip: 'Выбрать файловое хранилище Amazon S3',
                listeners: {

                }
            }]
        },{
            xtype: 'toolbar',
            dock: 'bottom',
            items: [{
                text: 'Создать',
                tooltip: 'Создать новый файл',
                iconCls: 'new-icon',
                listeners: {
                    click: 'createFile'
                }
            }, '-', {
                text: 'Добавить',
                tooltip: 'Добавить файл',
                iconCls: 'add-icon',
                listeners: {
                    click: 'addFile'
                }
            }]
        }],
    }],
});