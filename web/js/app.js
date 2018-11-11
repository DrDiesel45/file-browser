var loadedData = '[{"name":"first","size":"20","date":"2012-4-12 12:34:00"},{"name":"second","size":"220","date":"2018-2-25 14:55:46"}]';

Ext.define('Files', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'name',
            type: 'string'
        },
        {
            name: 'size',
            type: 'number'
        },
        {
            name: 'date',
            type: 'date',
            dateFormat: 'Y-n-d H:i:s'
        }
    ]
});

Ext.application({
    name: 'Application For FB',
    launch: function () {
        var store = Ext.create('Ext.data.Store', {
            model: 'Files',
        });

        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [{
                region: 'center',
                xtype: 'panel',
                activeTab: 0,
                items: {
                    title: 'Файловый менеджер',
                    xtype: 'grid',
                    columnLines: true,
                    store: store,
                    columns: [{
                        header: 'Имя',
                        dataIndex: 'name',
                        flex: 1
                    }, {
                        header: 'Размер',
                        dataIndex: 'size',
                        xtype: 'numbercolumn',
                        format: '0',
                        width: 200
                    }, {
                        header: 'Дата',
                        dataIndex: 'date',
                        xtype: 'datecolumn',
                        format: 'Y-m-d H:i:s',
                        width: 200
                    }],

                    tbar: [{
                        text: 'Добавить',
                        tooltip: 'Добавить новый файл',
                    }, '-', {
                        text: 'Получить',
                        tooltip: 'Получить файлы',
                    }, '-', {
                        text: 'Удалить',
                        tooltip: 'Удалить файл',
                    }],
                }
            }]
        });

        var testJS = JSON.parse(loadedData);
        store.loadData(testJS);
    }
});