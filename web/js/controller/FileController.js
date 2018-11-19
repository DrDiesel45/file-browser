// var filePathFirst = [];
Ext.define('Web.controller.FileController', {
    extend: 'Ext.app.Controller',

    views: ['FileList', 'FileView'],
    stores: ['FileStore'],
    models: ['FileModel'],

    init: function () {

        this.control({
            'viewport > filelist': {
                itemdblclick: this.editFile
            },
            'filewindow button [action=new]': {
                click: this.createFile
            },
            'filewindow button [action=add]': {
                click: this.addFile
            },
            'filewindow button [action=save]': {
                click: this.saveFile
            },
            'filewindow button [action=delete]': {
                click: this.deleteFile
            }
        });
    },
    // Создание
    createFile: function (button) {
        form = window.down('form'),
            values = form.getValues();
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
        form = window.down('form'),
            values = form.getValues();
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
    saveFile: function (button) {
        var window = button.up('window'),
            form = window.down('form'),
            values = form.getValues(),
            id = form.getRecord().get('id');
        values.id = id;
        Ext.Ajax.request({
            url: '/site/save',
            params: values,
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.success) {
                    Ext.Msg.Alert('Сохранение', data.message);
                    var store = Ext.widget('filelist').getStore();
                    store.load();
                }
                else {
                    Ext.Msg.alert('Сохранение', 'Не удалось сохранить файл');
                }
            }
        });
    },
    // Удаление
    deleteFile: function (button) {
        var window = button.up('window'),
            form = window.down('form'),
            values = form.getValues(),
            id = form.getRecord().get('id');
        Ext.Ajax.request({
            url: '/site/delete',
            params: {id:id},
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.success) {
                    Ext.Msg.Alert('Удаление', data.message);
                    var store = Ext.widget('filelist').getStore();
                    var record = store.getById(id);
                    store.remove(record);
                    form.getForm.reset();
                }
                else {
                    Ext.Msg.alert('Удаление', 'Не удалось удалить файл');
                }
            }
        });
    },

    // editFile: function (grid, rowIndex) {
    //     // массив для хранения имен нажатых строк
    //     // модель выбора строки из grid
    //     var selectionModel = grid.getSelectionModel(), record;
    //     // выделение нажатой строки
    //     selectionModel.select(rowIndex);
    //     // получение модели, которая отображена на выделенной строке в переменную
    //     // record для дальнейшей манипуляции
    //     record = selectionModel.getSelection()[0];
    //     if (record.get('type') === 'file') {
    //         return;
    //     } else {
    //         // проверка условий и внесение имен в массив
    //         if (record.get('name') !== '..') {
    //             filePathFirst.push(record.get('name'));
    //             // удаление последнего элемента из массива
    //         } else filePathFirst.pop();
    //         // склеивание элементов массива через / в строку с путем по папкам
    //         var filePath = filePathFirst.join('/');
    //         console.log(filePath);
    //
    //         // передача строки с путём на сервер
    //         Ext.Ajax.request({
    //             url: '/site/list',
    //             method: 'GET',
    //             params: {
    //                 path: filePath
    //             },
    //             success: function (response) {
    //                 var jsonData = JSON.parse(response.responseText);
    //                 fileStore.loadData(jsonData);
    //             },
    //             failure: function (response) {
    //                 alert("Ошибка: " + response.statusText);
    //                 filePathFirst.pop();
    //             }
    //         });
    //     }
    editFile: function (grid, record) {
        var view = Ext.widget('filewindow');
        view.down('form').loadRecord(record);
    }
});