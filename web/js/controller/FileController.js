Ext.define('Web.controller.FileController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.filectrl',

    views: ['FileView'],
    stores: ['FileStore'],
    models: ['FileModel'],
    filePathFirst: [],
    filePathDelete: [],
    filePathLoad: [],

    init: function () {
        var fileGridStore = this.lookupReference('fileGrid').getStore();
        // отправка запроса на сервер
        Ext.Ajax.request({
            url: '/site/list',
            success: function (response) {
                // при успешном запросе отображается содержимое хранилища в таблице
                var jsonData = JSON.parse(response.responseText);
                fileGridStore.loadData(jsonData);
            },
            failure: function (response) {
                alert("Ошибка: " + response.statusText);
            }
        });
    },

    // Создать папку
    createDir: function () {
        var grid = this.lookupReference('fileGrid');

        // получение значения, записанного в строку "название папки"
        var dirName = this.lookupReference('newFolderName').getValue();
        if (dirName === '') {
            Ext.Msg.alert('Внимание', 'Введите имя папки!!');
            return;
        }
        // присвоение переменной пути до папки
        var dirPath = this.filePathFirst.join('') + '/' + dirName;

        // очистка строки "название папки"
        this.lookupReference('newFolderName').setValue();

        // отправка запроса на сервер
        Ext.Ajax.request({
            url: '/site/create',
            method: 'GET',
            params: {
                path: dirPath,
            },
            success: function (response) {
                // обновление таблицы для отображения созданной папки
                grid.getStore().add(JSON.parse(response.responseText));
            },
            failure: function (response) {
                alert("Ошибка: " + response.statusText);
            }
        });
    },

    // Добавить файл
    addFile: function (button, rowIndex) {
        var grid = this.lookupReference('fileGrid');

        var fileName = this.lookupReference('fileData').getValue();

        Ext.Ajax.request({
            url: '/site/add',
            params: values,
            success: function (response) {
            },
            failure: function (response) {
                alert("Ошибка: " + response.statusText);
            }
        });
    },

    // Скачать файл
    loadFile: function (button, rowIndex) {
        var me = this;
        var grid = this.lookupReference('fileGrid');

        // модель выбора строки из grid
        var selectionModel = grid.getSelectionModel();
        // выделение нажатой строки
        selectionModel.select(rowIndex);
        // получение модели, которая отображена на выделенной строке в переменную
        // record для дальнейшей манипуляции
        var record = selectionModel.getSelection()[0];
        {
            if (record.get('type') !== 'file') {
                Ext.Msg.alert('ВНИМАНИЕ!', 'Вы можете скачивать только файлы!');
                return;
            } else this.filePathLoad.push(record.get('name'));

            var filePath = me.filePathFirst.join('/') + '/' + this.filePathLoad.join('');
            console.log(filePath);
            this.filePathLoad.pop();
            var redirect = '/site/load?path=' + filePath;

            Ext.Ajax.request({
                url: '/site/load',
                method: 'GET',
                params: {
                    path: filePath
                },
                success: function () {
                    window.location.href = redirect;
                },
                failure: function (response) {
                    alert("Ошибка: " + response.statusText);
                }
            });
        }
    },

    // Удаление файла или папки
    deleteFile: function (button, rowIndex) {
        var me = this;
        var grid = this.lookupReference('fileGrid');

        // модель выбора строки из grid
        var selectionModel = grid.getSelectionModel();
        // выделение нажатой строки
        selectionModel.select(rowIndex);
        // получение модели, которая отображена на выделенной строке в переменную
        // record для дальнейшей манипуляции
        var record = selectionModel.getSelection()[0];
        {
            if (record.get('name') !== '..') {
                me.filePathDelete.push(record.get('name'));
            } else {
                Ext.Msg.alert('ВНИМАНИЕ!', 'Вы не можете удалять это!');
                return;
            }

            // занесение в переменную filePath пути до удаляемого файла или папки
            var filePath = me.filePathFirst.join('/') + '/' + me.filePathDelete.join('');
            // очистка массива, в котором хранятся названия папок или файлов, которые удаляются
            me.filePathDelete.pop();

            // отправка запроса на сервер
            Ext.Ajax.request({
                url: '/site/delete',
                method: 'GET',
                params: {
                    path: filePath
                },
                success: function () {
                    // при успешном запросе, запись удаляется из хранилища и таблицы
                    grid.getStore().remove(record);
                },
                failure: function (response) {
                    alert("Ошибка: " + response.statusText);
                }
            });
        }
    },

// По двойному клику на строку создается путь до файла, путем сложения корня и имени
// нажатой папки, в которой он лежит. Если двойной клик по точкам (..), то
// происходит возврат на уровень выше, путем удаления имени папки, из которой мы вышли, из массива
    changePath: function (grid, rowIndex) {
        // модель выбора строки из grid
        var selectionModel = grid.getSelectionModel();
        // выделение нажатой строки
        selectionModel.select(rowIndex);
        // получение модели, которая отображена на выделенной строке в переменную
        // record для дальнейшей манипуляции
        var record = selectionModel.getSelection()[0];
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
            var pathFile = this.filePathFirst.join('/');
            console.log(pathFile);

            // передача строки с путём на сервер
            Ext.Ajax.request({
                url: '/site/list',
                method: 'GET',
                params: {
                    path: pathFile
                },
                success: function (response) {
                    var jsonData = JSON.parse(response.responseText);
                    grid.getStore().loadData(jsonData);
                },
                failure: function (response) {
                    alert("Ошибка: " + response.statusText);
                    // this.filePathFirst.pop();
                }
            });
        }
    },

// нажатие правой кнопки мыши на строку для вызова контекстного меню,
// в котором есть кнопки выбора для удаления или скачивания файла
    contextFile: function (record, item, index, e, eOpts) {
        var me = this;
        var xy = eOpts.getXY();
        Ext.create('Ext.menu.Menu', {
            listeners: {
                click: function (menu, item) {
                    if (item.cls === 'deleteItem') {
                        me.deleteFile();
                    } else if (item.cls === 'loadFile') {
                        me.loadFile();
                    }
                }
            },
            items: [{
                text: 'Скачать',
                iconCls: 'save-icon',
                cls: 'loadFile',
            }, {
                text: 'Удалить',
                iconCls: 'delete-icon',
                cls: 'deleteItem'
            }]
        }).showAt(xy);
        // отключение отображения контекстного меню браузера при однократном нажатии ПКМ,
        // для отображения контекстного меню браузера необходимо нажать ПКМ ещё раз
        eOpts.stopEvent();
    },
});