Ext.define('Web.view.FileView', {
    extend: 'Ext.panel.Panel',
    alias: 'widget.fileview',
    controller: 'filectrl',
    layout: 'fit',

    padding: '2px',

    items: [{
        title: 'Файловая система',
        xtype: 'grid',
        reference: 'fileGrid',
        alias: 'widget.myGrid',
        store: 'FileStore',
        enableColumnResize: true,

        columnLines: true,
        columns: [{
            header: 'Имя', dataIndex: 'name', flex: 3
        }, {
            header: 'Размер', dataIndex: 'size', width: 100
        }, {
            header: 'Тип', dataIndex: 'type', width: 100
        }, {
            header: 'Дата', dataIndex: 'date',
            xtype: 'datecolumn', format: 'Y-m-d H:i:s', flex: 1
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
                listeners: {}
            }, '-', {
                text: 'Amazon S3',
                tooltip: 'Выбрать файловое хранилище Amazon S3',
                listeners: {}
            }]
        }, {
            xtype: 'toolbar',
            dock: 'bottom',
            items: [{
                text: 'Создать папку:',
                tooltip: 'Создать новую папку',
                iconCls: 'new-icon',
                listeners: {
                    click: 'createDir'
                }
            }, {
                reference: 'newFolderName',
                emptyText: 'Введите имя папки',
                xtype: 'textfield',
                width: 120
            }, '-', {
                xtype: 'filefield',
                reference: 'fileData',
                width: 0,
                buttonText: 'Добавить файл',
                buttonOnly: true,
                listeners: {

                }
                // tooltip: 'Добавить файл',
                // iconCls: 'add-icon',
                // listeners: {
                //     click: 'addFile'
                // }
            }]
        }],
    }],
});