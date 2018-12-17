Ext.define('Web.view.UploadView', {
        extend: 'Ext.window.Window',

        alias: 'widget.uploadview',
        controller: 'uploadctrl',

        title: 'Загрузка файлов',
        items: [],
        // constructor: function () {
        //     this.callParent();
        // }

        initComponent: function (config) {
            this.initConfig(config);
            this.callParent(arguments);

            var param = $('meta[name=csrf-param]').attr("content");
            var token = $('meta[name=csrf-token]').attr("content");
            console.dir(this);
            // this.items.push({
            //     xtype: 'form',
            //     reference: 'uploadForm',
            //     width: 200,
            //     frame: true,
            //     bodyPadding: '10 10 0',
            //     url: 'site/add',
            //     defaults: {
            //         anchor: '100%',
            //         allowBlank: false,
            //         msgTarget: 'side',
            //         labelWidth: 50
            //     },
            //     items: [{
            //         xtype: 'filefield',
            //         buttonOnly: true,
            //         width: 100,
            //         reference: 'fileField',
            //         id: 'form-file',
            //         name: 'fileUpload',
            //         buttonConfig: {
            //             text: 'Выберите файл',
            //             width: '100%',
            //         },
            //         listeners: {
            //             change: 'addFile'
            //         },
            //     }, {
            //         xtype: 'hidden',
            //         name: param,
            //         value: token
            //     }],
            // });
        }
    }
);