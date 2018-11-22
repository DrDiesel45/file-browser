Ext.define('Web.controller.FileController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.filectrl',

    views: ['FileView'],
    stores: ['FileStore'],
    models: ['FileModel'],
    filePathFirst: [],
    filePathDelete: [],

    init: function () {
        var fileGridStore = this.lookupReference('fileGrid').getStore();
        Ext.Ajax.request({
            url: '/site/list',
            success: function (response) {
                var jsonData = JSON.parse(response.responseText);
                fileGridStore.loadData(jsonData);
            },
            failure: function (response) {
                alert("Ошибка: " + response.statusText);
            }
        });
        this.control({
            'filewindow button[action=delete]': {
                click: this.deleteFile
            },
        });

    },
    // Создание
    createFile: function (button) {
        var form = window.down('form');
        var values = form.getValues();
        Ext.Ajax.request({
            url: '/site/create',
            params: values,
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.success) {
                    Ext.Msg.Alert('Создание', data.message);
                    var store = Ext.widget('filelist').getStore();
                    store.load();
                }
                else {
                    Ext.Msg.alert('Создание', 'Не удалось добавить файл');
                }
            }
        });
    },
    // Добавление
    addFile: function (button) {
        var form = window.down('form');
        var values = form.getValues();
        Ext.Ajax.request({
            url: '/site/add',
            params: values,
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.success) {
                    Ext.Msg.Alert('Добавление', data.message);
                    var store = Ext.widget('filelist').getStore();
                    store.load();
                }
                else {
                    Ext.Msg.alert('Добавление', 'Не удалось добавить файл');
                }
            }
        });
    },
    // Сохранение
    saveFile: function (button, rowIndex) {
        var grid = this.lookupReference('fileGrid');
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
                this.filePathFirst.push(record.get('name'));
                // удаление последнего элемента из массива
            } else {
                this.filePathFirst.pop();
            }
            // склеивание элементов массива через / в строку с путем по папкам
            var filePath = this.filePathFirst.join('/');
            console.log(filePath);

            // передача строки с путём на сервер
            Ext.Ajax.request({
                url: '/site/save',
                method: 'GET',
                params: {
                    path: filePath
                },
                success: function () {
                },
                failure: function (response) {
                    alert("Ошибка: " + response.statusText);
                    this.filePathFirst.pop();
                }
            });
        }
    },

    // Удаление
    deleteFile: function (button, rowIndex) {
        var grid = this.lookupReference('fileGrid');
        var selectionModel = grid.getSelectionModel();
        selectionModel.select(rowIndex);
        var record = selectionModel.getSelection()[0];
        {
            if (record.get('name') !== '..') {
                this.filePathDelete.push(record.get('name'));
            } else this.filePathDelete.pop();
            var filePath = this.filePathDelete.join('/');
            console.log(filePath);
            this.filePathDelete.pop();

            Ext.Ajax.request({
                url: '/site/delete',
                method: 'GET',
                params: {
                    path: filePath
                },
                success: function () {
                    grid.getStore().remove(record);
                },
                failure: function (response) {
                    alert("Ошибка: " + response.statusText);
                }
            });
        }
    },

    // По двойному клику на строку создается путь до файла, путем сложения корня и имени
    // нажатой папки, в которой он лежит. Если двойной клик по точкам (.. или .), то
    // происходит возврат на уровень выше, путем удаления имени папки, из которой мы вышли
    changePath: function (grid, rowIndex) {
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
                this.filePathFirst.push(record.get('name'));
                // удаление последнего элемента из массива
            } else {
                this.filePathFirst.pop();
            }
            // склеивание элементов массива через / в строку с путем по папкам
            var filePath = this.filePathFirst.join('/');
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
                    grid.getStore().loadData(jsonData);
                },
                failure: function (response) {
                    alert("Ошибка: " + response.statusText);
                    this.filePathFirst.pop();
                }
            });
        }
    },
    // вызов меню по нажатию правой кнопки мыши на строку для удаления или скачивания файла
    contextFile: function (record, item, index, e, eOpts) {
        var me = this;
        var xy = eOpts.getXY();
        Ext.create('Ext.menu.Menu', {
            listeners: {
                click: function (menu, item) {
                    if (item.cls === 'deleteItem') {
                        me.deleteFile();
                    } else {
                        me.saveFile();
                    }
                }
            },
            items: [{
                text: 'Скачать',
                iconCls: 'save-icon',
            }, {
                text: 'Удалить',
                iconCls: 'delete-icon',
                cls: 'deleteItem'
            }]
        }).showAt(xy);
        eOpts.stopEvent();
    },
    alertRow: function (button) {
        Ext.Msg.alert('SEKA', 'KEKA');
    },
});