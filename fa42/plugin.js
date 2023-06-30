/**
 *   FontAwesome
 *   =========
 *   https://fortytwo-it.com/ckeditor/fontawesome/
 *
 *   Copyright (C) 2023 by fortyTwo IT
 *   Licence under GNU GPL v3.
 */
CKEDITOR.plugins.add('fa42', {
        requires: 'colordialog',
        version: '0.0.1',
        icons: 'fa42',
        onLoad: function() {
            CKEDITOR.document.appendStyleSheet(CKEDITOR.plugins.get("fa42").path + 'dialogs/fa42.css?v=' + fa42MakeID(7));
            // try to allow empty tags for i and span
            CKEDITOR.dtd.$removeEmpty.i = false;
            CKEDITOR.dtd.$removeEmpty.span = false;
        },
        init: function (editor) {
        var rootPath = CKEDITOR.plugins.get("fa42").path,
                defaultConfig = {
                    fa42Path: '//cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
                    fa42Tag: 'i'
                }
        var config = CKEDITOR.tools.extend(defaultConfig, editor.config.fa42 || {}, true);
        editor.fa42Config = config;
        var command = editor.addCommand('fa42', new CKEDITOR.dialogCommand('fa42Dialog', {allowedContent: 'i[class,style]{color,font-size}(*);span[class,style]{color,font-size}(*);'}));
        var dialog = CKEDITOR.dialog.add('fa42Dialog', CKEDITOR.plugins.get("fa42").path + 'dialogs/fa42.js?v=' + fa42MakeID(7));
        editor.ui.addButton( 'fa42', {
                label: 'Insert Font Awesome',
                command: 'fa42',
                toolbar: 'insert',
        });
            CKEDITOR.document.appendStyleSheet(config.fa42Path);
   	        if( editor.addContentsCss ) {
			    editor.addContentsCss(config.fa42Path);
		    }
            editor.on( 'doubleclick', function( evt ) {
                var element = evt.data.element;
                if (element.$.getAttribute('data-fa42') == 'true') {
                    evt.data.dialog = 'fa42Dialog';
                    evt.data.fa42Icon = element;
                    editor.fa42Selected = element;
                }
            }, null, null, 0);
        } // end init
    }); // end plugins.add

    function fa42MakeID(length) {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        var counter = 0;
        while (counter < length) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
          counter += 1;
        }
        return result;
    }
