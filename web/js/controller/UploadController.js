Ext.define('Web.controller.UploadController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.uploadctrl',

    views: ['FileView', 'UploadView'],
    stores: ['FileStore'],
    models: ['FileModel'],
    filePathFirst: [],

    // Добавить файл
    addFile: function (eOpts) {
        var grid = this.lookupReference('fileGrid');
        var upload = this.lookupReference('uploadForm').getForm();

        if (upload.isValid()) {
            upload.submit({
                url: '/site/add',
                method: 'POST',
                waitMsg: 'Uploading your file...',
                scope: this,
                success: function () {
                    window.location.reload();
                    history.go(0);
                },
                failure: function (response) {
                    console.dir(response);
                    window.location.reload();
                    history.go(0);
                    // alert("Ошибка: " + response.statusText);
                }
            });
        }
    },
});