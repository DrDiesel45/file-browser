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
            name: 'type', type: 'string'
        },
        {
            name: 'date', type: 'date', dateFormat: 'Y-m-d H:i:s O'
        }
    ]
});

Ext.application({
    requires: ['Ext.container.Viewport'],
    name: 'FileManagerApp',

    launch: function () {
        var filesStore = Ext.create('Ext.data.Store', {
            extend: 'Ext.data.Store',
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
            });
        });

        var filePathFirst = [];

        Ext.create('Ext.container.Viewport', {
            layout: 'border',
            items: [
                // {
                //     region: 'north',
                //     xtype: 'form',
                //     // title: 'Загрузка файла',
                //     padding: '2px',
                //     bodyStyle: 'padding: 5px 5px 0',
                //     width: 400,
                //     height: 100,
                //     renderTo: Ext.getBody(),
                //     items: [{
                //         xtype: 'filefield',
                //         name: 'document',
                //         fieldLabel: 'Выберите файл: ',
                //         labelWidth: 100,
                //         anchor: '100%',
                //         buttonText: 'Выбрать',
                //         listeners: {
                //             change: function (fld, value) {
                //                 var newValue = value.replace(/\\path\\/g, '');
                //                 fld.setRawValue(newValue);
                //             }
                //         },
                //         msgTarget: 'side',
                //         allowBlank: false,
                //         // buttonOnly: true,
                //         hideLabel: true,
                //     }],
                //     buttons: [{
                //         text: 'Загрузить файл',
                //         handler: function () {
                //             var form = this.up('form').getForm();
                //             console.log(form);
                //             console.log(form.isValid());
                //             if (form.isValid()) {
                //                 form.submit({
                //                     url: '/site/upload',
                //                     waitMsg: 'Загрузка...',
                //                     success: function (fp, o) {
                //                         Ext.Msg.alert('Загрузка прошла успешно', 'Файл ' + o.result.file + ' загружен');
                //                     }
                //                 });
                //             }
                //         }
                //     }]
                // },

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
                            header: 'Размер', dataIndex: 'size', width: 100
                        }, {
                            header: 'Тип', dataIndex: 'type', width: 100
                        }, {
                            header: 'Дата', dataIndex: 'date',
                            xtype: 'datecolumn', format: 'Y-m-d H:i:s', width: 200
                        }],
                        // По двойному клику на строку создается путь до файла, путем сложения корня и имени
                        // нажатой папки, в которой он лежит. Если двойной клик по точкам (.. или .), то
                        // происходит возврат на уровень выше, путем удаления имени папки, из которой мы вышли
                        listeners: {
                            rowdblclick: function (grid, rowIndex) {
                                // массив для хранения имен нажатых строк
                                // модель выбора строки из grid
                                var selectionModel = grid.getSelectionModel(), record;
                                // выделение нажатой строки
                                selectionModel.select(rowIndex);
                                // получение модели, которая отображена на выделенной строке в переменную
                                // record для дальнейшей манипуляции
                                record = selectionModel.getSelection()[0];
                                if (record.get('type') === 'file') {
                                    return;
                                } else {
                                    // проверка условий и внесение имен в массив
                                    if (record.get('name') !== '..') {
                                        filePathFirst.push(record.get('name'));
                                        // удаление последнего элемента из массива
                                    } else filePathFirst.pop();
                                    // склеивание элементов массива через / в строку с путем по папкам
                                    var filePath = filePathFirst.join('/');
                                    console.log(filePath);

                                    // передача строки с путём на сервер
                                    Ext.Ajax.request({
                                        url: '/site/list',
                                        method: 'GET',
                                        params: {
                                            path: filePath
                                        },
                                        success: function (response) {
                                            var jsonData = JSON.parse(response.responseText);
                                            filesStore.loadData(jsonData);
                                        },
                                        failure: function (response) {
                                            alert("Ошибка: " + response.statusText);
                                            filePathFirst.pop();
                                        }
                                    });
                                }
                            }
                        },

                        tbar: [{
                            xtype: 'button', text: 'Создать',
                            tooltip: 'Создать файл',
                            iconCls: 'new-icon',
                            handler: function () {
                            }
                        }, '-', {
                            xtype: 'button', text: 'Добавить',
                            tooltip: 'Добавить новый файл',
                            iconCls: 'add-icon',
                            handler: function () {
                                // var form = this.up('form').getForm();
                                // if(form.isValid()){
                                //     form.submit({
                                //         url: 'file-upload.php',
                                //         waitMsg: 'Uploading your photo...',
                                //         success: function(fp, o) {
                                //             msg('Success', tpl.apply(o.result));
                                //         }
                                //     });
                                // }
                                // TODO: сделать функционал кнопки
                                //     var form = this.up('form').getForm();
                                //     if (form.isValid()) {
                                //         form.submit({
                                //             url: 'upload.php',
                                //             waitMsg: 'Загрузка...',
                                //             success: function (fp, o) {
                                //                 Ext.Msg.alert('Загрузка прошла успешно', 'Файл ' + o.result.file + " загружен");
                                //             }
                                //         });
                                //     }
                            }
                        }, '-', {
                            xtype: 'button', text: 'Скачать',
                            tooltip: 'Скачать выбранные файлы',
                            iconCls: 'save-icon',
                            handler: function () {
                                Ext.Msg.alert('Message', 'RARARA');
                                // TODO: сделать функционал кнопки
                            }
                        }, '-', {
                            xtype: 'button', text: 'Удалить',
                            tooltip: 'Удалить выбранные файлы',
                            iconCls: 'delete-icon',
                            handler: function (grid, rowIndex) {
                                // Ext.Msg.alert('message', 'kuliti!');
                                var selectionModel = grid.getSelectionModel(), record;
                                selectionModel.select(rowIndex);
                                record = selectionModel.getSelection()[0];
                                // grid.getSelection()[0];
                                if (record.get('name') !== '..') {
                                    filePathFirst.push(record.get('name'));
                                } else filePathFirst.pop();
                                var filePath = filePathFirst.join('/');
                                console.log(filePath);

                                Ext.Ajax.request({
                                    url: '/site/delete',
                                    method: 'GET',
                                    params: {
                                        path: filePath
                                    },
                                    success: function (response) {
                                        var jsonData = JSON.parse(response.responseText);
                                        filesStore.loadData(jsonData);
                                    },
                                    failure: function (response) {
                                        alert("Ошибка: " + response.statusText);
                                        filePathFirst.pop();
                                    }
                                });
                                // TODO: сделать функционал кнопки
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
                            header: 'Размер', dataIndex: 'size', width: 100
                        }, {
                            header: 'Тип', dataIndex: 'type', width: 100
                        }, {
                            header: 'Дата', dataIndex: 'date',
                            xtype: 'datecolumn', format: 'Y-m-d H:i:s', width: 200
                        }],

                        // По двойному клику на строку создается путь до файла, путем сложения корня и имени
                        // нажатой папки, в которой он лежит. Если двойной клик по точкам (.. или .), то
                        // происходит возврат на уровень выше, путем удаления имени папки, из которой мы вышли
                        listeners: {
                            rowdblclick: function (grid, rowIndex) {
                                // массив для хранения имен нажатых строк
                                // модель выбора строки из grid
                                var selectionModel = grid.getSelectionModel(), record;
                                // выделение нажатой строки
                                selectionModel.select(rowIndex);
                                // получение модели, которая отображена на выделенной строке в переменную
                                // record для дальнейшей манипуляции
                                record = selectionModel.getSelection()[0];
                                // проверка условий и внесение имен в массив
                                if (record.get('name') !== '..') {
                                    filePathFirst.push(record.get('name'));
                                    // удаление последнего элемента из массива
                                } else filePathFirst.pop();
                                // склеивание элементов массива через / в строку с путем по папкам
                                var filePath = filePathFirst.join('/');
                                console.log(filePath);

                                // передача строки с путём на сервер
                                Ext.Ajax.request({
                                    url: '/site/list',
                                    method: 'GET',
                                    params: {
                                        path: filePath
                                    },
                                    success: function (response) {
                                        var jsonData = JSON.parse(response.responseText);
                                        filesStore.loadData(jsonData);
                                    },
                                    failure: function (response) {
                                        alert("Ошибка: " + response.statusText);
                                        filePathFirst.pop();
                                    }
                                });
                            }
                        },

                        tbar: [{
                            xtype: 'button', text: 'Создать',
                            tooltip: 'Создать файл',
                            iconCls: 'new-icon',
                            handler: function () {
                            }
                        }, '-', {
                            xtype: 'button', text: 'Добавить',
                            tooltip: 'Добавить новый файл',
                            iconCls: 'add-icon',
                            listeners: {
                                click: function () {
                                    // TODO: сделать функционал кнопки
                                }
                            }
                        }, '-', {
                            xtype: 'button', text: 'Скачать',
                            tooltip: 'Скачать выбранные файлы',
                            iconCls: 'save-icon',
                            listeners: {
                                click: function () {
                                    // TODO: сделать функционал кнопки
                                }
                            }
                        }, '-', {
                            xtype: 'button', text: 'Удалить',
                            tooltip: 'Удалить выбранные файлы',
                            iconCls: 'delete-icon',
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