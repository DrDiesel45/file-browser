Ext.define('Web.store.FileStore', {
    extend: 'Ext.data.Store',
    model: 'Web.model.FileModel',
    sorters : [{
        property: 'name', direction : 'ASC'
    }],


    storeId: 'FileStore',
});