Ext.application({
    requires: ['Ext.container.Viewport'],
    name: 'Web',
    stores: [
        'FileStore'
    ],

    appFolder: 'js',

    launch: function () {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [{
                xtype: 'fileview',
            }]
        });
    },
});