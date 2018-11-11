let loadedData = '[{"name":"first.html","size":"20","date":"2012-4-12 12:34:00"},' +
    '{"name":"second.bin","size":"220","date":"2016-11-14 12:05:21"},' +
    '{"name":"third.exe","size":"25","date":"2015-1-24 08:23:12"},' +
    '{"name":"app.js","size":"32","date":"2016-4-12 09:13:22"},' +
    '{"name":"main.php","size":"4","date":"2014-11-14 10:56:59"},' +
    '{"name":"index.html","size":"8","date":"2007-7-17 18:23:53"}]';

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
    name: 'FileManagerApp',

    launch: function () {
        let store = Ext.create('Ext.data.Store', {
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
                    selModel: {
                        type: 'checkboxmodel',
                        checkOnly: true
                    },

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
                        text: 'Скачать',
                        tooltip: 'Скачать файлы',
                    }, '-', {
                        text: 'Удалить',
                        tooltip: 'Удалить файл',
                    }],
                }
            }]
        });

        let testJS = JSON.parse(loadedData);
        store.loadData(testJS);
    }
});