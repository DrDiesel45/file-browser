Ext.define('Web.model.FileModel', {
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