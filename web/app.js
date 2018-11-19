Ext.application({
    requires: ['Ext.container.Viewport'],
    name: 'Web',

    appFolder: 'js',
    controllers: ['FileController'],

    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [{
                xtype: 'filelist'
            }]
        });

        var filesStore = Ext.create('Ext.data.Store', {
            extend: 'Ext.data.Store',
            model: 'Web.model.FileModel',
        });

        Ext.onReady(function () {
            Ext.Ajax.request({
                url: '/site/list',
                success: function (response) {
                    var jsonData = JSON.parse(response.responseText);
                    // this.lookupReferenceHolder().lookupReference('reference').getStore('FileStore').loadData(jsonData);
                    filesStore.loadData(jsonData);
                },
                failure: function (response) {
                    alert("Ошибка: " + response.statusText);
                }
            });
        });
    },
});