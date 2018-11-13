var loadedData = '[{"name":"first.html","size":"20","date":"2012-4-12 12:34:00"},' +
    '{"name":"second.bin","size":"220","date":"2016-11-14 12:05:21"},' +
    '{"name":"third.exe","size":"25","date":"2015-1-24 08:23:12"},' +
    '{"name":"app.js","size":"32","date":"2016-4-12 09:13:22"},' +
    '{"name":"main.php","size":"4","date":"2014-11-14 10:56:59"},' +
    '{"name":"index.html","size":"8","date":"2007-7-17 18:23:53"}]';

Ext.define('Files', {
    extend: 'Ext.data.Model',
    fields: [
        {
            name: 'name', type: 'string'
        },
        {
            name: 'size', type: 'string'
        },
        {
            name: 'date', type: 'date', dateFormat: 'Y-m-d H:i:s O'
        }
    ]
});


Ext.application({
    name: 'FileManagerApp',

    launch: function () {
        var filesStore = Ext.create('Ext.data.Store', {
            model: 'Files',
        });

        Ext.onReady(function () {
            Ext.Ajax.request({
                url: '/site/list',
                success: function (response) {
                    var jsonData = JSON.parse(response.responseText);
                    filesStore.loadData(jsonData);
                },
                failure: function (response) {
                    alert("Ошибка: " + response.statusText);
                }
            })
        });

        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [{
                region: 'north',
                xtype: 'form',
                // title: 'Загрузка файла',
                padding: '2px',
                bodyStyle: 'padding: 5px 5px 0',
                width: 400,
                height: 100,
                renderTo: Ext.getBody(),
                items: [{
                    xtype: 'filefield',
                    name: 'document',
                    fieldLabel: 'Выберите файл: ',
                    msgTarget: 'side',
                    allowBlank: false,
                }],
                buttons: [{
                    text: 'Загрузить файл',
                    handler: function () {
                        var form = this.up('form').getForm();
                        if (form.isValid()) {
                            form.submit({
                                url: 'php/upload.php',
                                waitMsg: 'Загрузка...',
                                success: function (fp, o) {
                                    Ext.Msg.alert('Загрузка прошла успешно', 'Файл ' + o.result.file + ' загружен');
                                }
                            });
                        }
                    }
                }]
            },
                {
                    region: 'center',
                    xtype: 'tabpanel',
                    activeTab: 0,
                    padding: '2px',
                    items: [{
                        title: 'Файловая система',
                        xtype: 'grid',
                        columnLines: true,
                        store: filesStore,
                        selModel: {
                            type: 'checkboxmodel',
                            checkOnly: true
                        },

                        columns: [{
                            header: 'Имя', dataIndex: 'name', flex: 1
                        }, {
                            header: 'Размер', dataIndex: 'size', width: 200
                        }, {
                            header: 'Дата', dataIndex: 'date',
                            xtype: 'datecolumn', format: 'Y-m-d H:i:s', width: 200
                        }],

                        listeners: {
                            itemdblclick: function() {

                            }
                        },

                        tbar: [{
                            xtype: 'button', text: 'Добавить',
                            tooltip: 'Добавить новый файл',
                            listeners: {
                                click: function () {
                                    // TODO: сделать функционал кнопки
                                }
                            }
                        }, '-', {
                            xtype: 'button', text: 'Скачать',
                            tooltip: 'Скачать выбранные файлы',
                            listeners: {
                                click: function () {
                                    // TODO: сделать функционал кнопки
                                }
                            }
                        }, '-', {
                            xtype: 'button', text: 'Удалить',
                            tooltip: 'Удалить выбранные файлы',
                            listeners: {
                                click: function () {
                                    // TODO: сделать функционал кнопки
                                }
                            }
                        }],
                    }, {
                        title: 'Dropbox',
                        xtype: 'grid',
                        columnLines: true,
                        store: filesStore,
                        selModel: {
                            type: 'checkboxmodel',
                            checkOnly: true
                        },

                        columns: [{
                            header: 'Имя', dataIndex: 'name', flex: 1
                        }, {
                            header: 'Размер', dataIndex: 'size',
                            xtype: 'numbercolumn', format: '0', width: 200
                        }, {
                            header: 'Дата', dataIndex: 'date',
                            xtype: 'datecolumn', format: 'Y-m-d H:i:s', width: 200
                        }],

                        tbar: [{
                            xtype: 'button', text: 'Добавить',
                            tooltip: 'Добавить новый файл',
                            listeners: {
                                click: function () {
                                    // TODO: сделать функционал кнопки
                                }
                            }
                        }, '-', {
                            xtype: 'button', text: 'Скачать',
                            tooltip: 'Скачать выбранные файлы',
                            listeners: {
                                click: function () {
                                    // TODO: сделать функционал кнопки
                                }
                            }
                        }, '-', {
                            xtype: 'button', text: 'Удалить',
                            tooltip: 'Удалить выбранные файлы',
                            listeners: {
                                click: function () {
                                    // TODO: сделать функционал кнопки
                                }
                            }
                        }],
                    }]
                }]
        });
    }
});