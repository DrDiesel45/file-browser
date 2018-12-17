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

        // получение значения csrf-token
        // var token = document.querySelector("meta[name='csrf-token']").getAttribute("content");
        var token = $('meta[name=csrf-token]').attr("content");
        var _csrf = $('meta[name=csrf-param]').attr("content");

        if (upload.isValid()) {
            upload.submit({
                url: '/site/add',
                method: 'POST',
                // data: {_csrf: token},
                waitMsg: 'Uploading your file...',
                success: function (response) {
                },
                failure: function (response) {
                    alert("Ошибка: " + response.statusText);
                }
            });
        }

        // Ext.Ajax.request({
        //     url: '/site/add',
        //     method: 'POST',
        //     data: {_csrf: token},
        //     params: upload.getValues(),
        //     // params: {
        //     // token: token,
        //     // param: param
        //     // },
        //     success: function (response) {
        //     },
        //     failure: function (response) {
        //         alert("Ошибка: " + response.statusText);
        //     }
        // });

        // var csrfToken = $('meta[name="csrf-token"]').attr("content");
        // $.ajax({
        //     url: 'site/add',
        //     type: 'POST',
        //     dataType: 'json',
        //     data: {
        //         csrfParam : csrfToken
        //     },
        //     params: upload.getValues(),
        // });

        // var fileName = this.lookupReference('fileData').getValue();
        // var fileName = value;
        // var fileName = value.replace(/C:\\fakepath\\/g, '');
        // me.setRawValue(fileName);
        // console.log('trigger upload of file:', fileName);
        //
        // var filePath = this.filePathFirst.join('') + '/' + fileName;
        // var filePath = this.filePathFirst.join('');
        // console.log(filePath);
        // var redirect = '/site/add?path=' + filePath;
        //
        // Ext.Ajax.request({
        //     url: '/site/add',
        //     params: {
        //         path: filePath
        //     },
        //     success: function (response) {
        //         window.location.href = redirect;
        //         grid.getStore().add(JSON.parse(response.responseText));
        //     },
        //     failure: function (response) {
        //         alert("Ошибка: " + response.statusText);
        //     }
        // });

        // var form = filefield.up('uploadForm').getForm();

        // if (upload.isValid()) {
        //     var url = '/site/add';
        //     Ext.Ajax.request({
        //         // url: '/site/add',
        //         url: url,
        //         // method: 'POST',
        //         method: 'GET',
        //         params: {
        //             token: headContent
        //         },
        //         autoAbort: false,
        //         success: function (response, result) {
        //             if (result.status === 204) {
        //                 Ext.Msg.alert('Empty Report', 'There is no data');
        //             } else if (result.status === 200) {
        //                 Ext.DomHelper.append(Ext.getBody(), {
        //                     tag: 'iframe',
        //                     frameBorder: 0,
        //                     width: 0,
        //                     height: 0,
        //                     css: 'display:none;visibility:hidden;height:0px;',
        //                     // src: url
        //                 });
        //             }
        //             // grid.getStore().add(JSON.parse(response.responseText));
        //         },
        //         failure: function (response) {
        //             alert("Ошибка: " + response.statusText);
        //         }
        //     })
        // }

    },
});