Ext.define('Web.store.FileStore', {
    extend: 'Ext.data.Store',
    model: 'Web.model.FileModel',

    storeId: 'FileStore',
    proxy: {
        type: 'ajax',
        url: '/js/data/files.json',
        reader: {
            type: 'json',
            successProperty: 'success'
        }
    }
});