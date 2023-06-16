CKEDITOR.dialog.add('ckawesomeDialog', function( editor ) {
    var fa42CSS = ''; // contents of Font Awesome styelsheet
    var fa42Classes = []; // class list of icons found from Font Awesome stylesheet, minus below
    var fa42SkipClasses = [ // classes to leave out of icon selection
    'fa-fw','fa-lg','fa-xs','fa-sm','fa-1x','fa-2x','fa-3x','fa-4x','fa-5x','fa-6x','fa-7x','fa-8x','fa-9x','fa-10x', // size class
    'fa-regular','fa-solid','fa-light','fa-thin','fa-duotone','fa-sharp','fa-brands', // styles
    'fa-ul','fa-li','fa-pull-left','fa-pull-right',"fa-stack","fa-stack-1x","fa-stack-2x","fa-inverse","fa-border", // layout
    'fa-spin','fa-pulse','fa-spin-pulse','fa-beat','fa-fade','fa-beat-fade','fa-bounce','fa-flip','fa-shake', // animations
    "fa-rotate-90","fa-rotate-180","fa-rotate-270","fa-flip-horizontal","fa-flip-vertical","fa-flip-both",'fa-swap-opacity' // transformations
    ];
    var fa42Brands = []; // list of brand classes from current brands.css
    var fa42Version = null; // full version of linked FontAwesome stylesheet
    var fa42Major = 0; // major version of current FontAwesome stylesheet to adjust settings/features
    var fa42Minor = 0; // minor version of current FontAwesome stylesheet to adjust settings/features
    var fa42Level = 'free'; // free or pro (does the diffrence come in use here?)
    var fa42Tag = 'i'; // tag to use for inclusion, default <i></i>
    var fa42Regular = 'fa'; // class to use for display in Regular style
    var fa42Brand = ''; // class to use for brand types to switch to correct FontAwesome font file
    var colorDialog = editor.plugins.colordialog; // setup for pre-selecting the color of the icon

    console.log(editor);

    fa42Tag = editor.config.fontawesomeTag ? editor.config.fontawesomeTag : 'i';

    // get Font Awesome classes from main stylesheet
    $.ajax({
       url: editor.fa42Path,
       type: 'get',
       dataType: 'html',
       async: false,
       success: function(response) {
            fa42CSS = response;
            // Try to find version and pro/free
            var vregex = new RegExp(/Font Awesome Pro (\d?\d\.\d?\d\.\d?\d)/,"g");
            var cpline = vregex.exec(response);
            var faType = 'pro';
            if (!cpline) {
                vregex = new RegExp(/Font Awesome.*(\d?\d\.\d?\d\.\d?\d)/,"g");
                cpline = vregex.exec(response);
                faType = 'free';
            }
            fa42Version = editor.fontawesomeVersion ? editor.fontawesomeVersion : (cpline ? cpline[1] : 'Un.know.n');
            fa42Level = editor.fontawesomeLevel ? editor.fontawesomeLevel : faType;
            var parts = fa42Version.split(".");
            fa42Major = parseInt(parts[0]);
            fa42Minor = parseInt(parts[1]);
            // set defaults
            if (fa42Major > 4) {fa42Regular = 'far'; fa42Brand = 'fab'; }
            if (fa42Major > 5) {fa42Regular = 'fa-regular'; fa42Brand = 'fa-brands'}
            // collect class names from css file
            var classRegex = /\.([\w-]+)/g;
            var match;
            while ((match = classRegex.exec(fa42CSS)) !== null) {
                if (match[1].match(/^fa\-/) && fa42Classes.indexOf(match[1]) == -1 && fa42SkipClasses.indexOf(match[1]) == -1) {
                    fa42Classes.push(match[1]);
                }
             }
       },
       error: function (jqXHR, status, errorMsg) {
        alert("Error loading Font Awesome CSS: \n" + editor.fa42Path);
       }
    });

    // get Font Awesome classes from main stylesheet
    $.ajax({
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/brands.min.css',
        type: 'get',
        dataType: 'html',
        async: false,
        success: function(response) {
             // collect class names from css file
             var classRegex = /\.([\w-]+)/g;
             var match;
             while ((match = classRegex.exec(response)) !== null) {
                 if (match[1].match(/^fa\-/) && fa42Brands.indexOf(match[1]) == -1 && fa42SkipClasses.indexOf(match[1]) == -1) {
                     fa42Brands.push(match[1]);
                 }
              }
        },
        error: function (jqXHR, status, errorMsg) {
            // brands icons won't display nicely....
        }
     });


	function getCKAwesomeIcons(selectList ){
	    fa42Classes.sort();
	    $.each(fa42Classes, function( index, value ) {
       		selectList.add(value, value);
       	});
	}

	function getSelectionOptions(selectList, start, inc, many){
	    var result = [];
	    var val = start;

	    result.push(start);

	    many = many > 0 ? many : 5;
	    for(var i = 0; i < many; i++){
	    	val += inc;
	    	result.push(val);
	    }

	    $.each(result, function( index, value ) {
	   		selectList.add(value, value);
	   	})
	}

	function formatCKAwesome (icon) {
	  if (!icon.id) { return icon.text; }
	  var text = icon.text.replace(/fa-|\.|\-/gi, " ");
	  var icon = $('<span class="ckawesome_options"><i class="fa ' + icon.element.value + ' fa-fw"></i> ' + text + "</span>");
	  return icon;
	};

    function getStyleOptions (selectList) {
        switch (parseInt(fa42Major)) {
            case 4:
                selectList.add('Regular','fa');
                break;
            case 5:
                selectList.add('Regular','far');
                selectList.add('Solid','fas');
                selectList.add('Light','fal');
                selectList.add('Duotone','fad');
                selectList.add('--------','far');
                selectList.add('Brands','fab');
            break;
            case 6:
                selectList.add('Regular','fa-regular');
                selectList.add('Solid','fa-solid');
                selectList.add('Light','fa-light');
                selectList.add('Thin','fa-thin');
                selectList.add('Duotone','fa-duotone');
                selectList.add('--------','fa-regular');
                if (fa42Minor >= 2) {
                    if (fa42Minor >= 3) {
                        selectList.add('Sharp Regular','fa-sharp fa-regular');
                    }
                    selectList.add('Sharp Solid','fa-sharp fa-solid');
                    if (fa42Minor >= 4) {
                        selectList.add('Sharp Light','fa-sharp fa-light');
                    }
                    //selectList.add('Sharp Thin','fa-sharp fa-thin');
                    //selectList.add('Sharp Duotone','fa-sharp fa-duotone');
                    selectList.add('--------','fa-regular');
                }
                selectList.add('Brands','fa-brands');

            break;
        }
    }
    function getIconLayout() {
        fa42Classes.sort();
        var iconList = '<ul id="fa42-iconlist">';
        for (i in fa42Classes) {
            var title = fa42Classes[i].replace(/^fa-/,'').replace(/-/,' ');
            iconList += '<li id="fa42-icon-' + title + '"><' + fa42Tag + ' class="' + (fa42Brands.indexOf(fa42Classes[i]) != -1 ? fa42Brand + ' ' : '') + fa42Regular + ' fa-fw fa-2x ' + fa42Classes[i] + '"></' + fa42Tag + '><div>' + title + '</div></li>';
        }
        iconList += '</ul>';
        return iconList;
    }

    return {
        title: 'fortyTwo Font Awesome for v' + fa42Version,
        minWidth: 640,
        minHeight: 200,

        contents: [
            {
                id: 'options',
                label: 'Main Options',
                elements: [
                    {
                        type: 'hbox',
                        widths: ['75%','25%'],
                        children: [
                            {
                                type: 'html',
                                id: 'fa42List',
                                label: 'Select Font Awesome Icon',
                                html: '<label>Select Font Awesome Icon</label>' + getIconLayout()
                            },
                            {
                                type: 'html',
                                id: 'fa42Icon',
                                html: '<div id="fa42-icon"><label>Font Awesome Icon Preview</label><p><i class="far fa-fw fa-4x fa-abacus></i></p></div>'
                            }
                        ]
                    },
                    /*
                    {
					    type: 'select',
					    id: 'ckawesomebox',
					    label: 'Select font Awesome',
					    validate: CKEDITOR.dialog.validate.notEmpty( "Font Awesome field cannot be empty." ),
					    items: [[ editor.lang.common.notSet, '' ]],
					    onLoad: function () {
						   	getCKAwesomeIcons(this);
						   	var selectbx = $('#' + this.getInputElement().getAttribute('id'));
						   	$(selectbx).select2({ width: "100%", templateResult: formatCKAwesome, templateSelection: formatCKAwesome});
					    },
					    onShow: function(){
					    	var selectbx = $('#' + this.getInputElement().getAttribute('id'));
					    	$(selectbx).val('').trigger('change') ;
					    }
                    },
                    */
                    {
                        type: 'select',
                        id: 'fontstyle',
                        label: 'Select Style',
					    items: [],
                        onLoad: function(widget) {
                            getStyleOptions(this);
                        }
                    },
                    {
                        type: 'select',
                        id: 'textsize',
                        label: 'Select  size',
                        items: [[ editor.lang.common.notSet, '' ]],
                        onLoad: function (widget) {
                        	getSelectionOptions(this, 8, 1, 42);
                        }
                    },
                    {
                        type: 'checkbox',
                        id: 'fixedwidth',
                        label: 'Fixed Width?',
                        'default': 'checked'
                    },
                    {
                        type: "hbox",
                        padding: 0,
                        widths: ["80%", "20%"],
                        children: [
                            {
                                id: 'fontcolor',
                                type: 'text',
                                label: 'Select color',
                                onChange: function( element ) {
                                	var idEl = $('#' +this.getInputElement().getAttribute('id'));
                                	idEl.css("background-color", idEl.val());
                                },
                                onKeyUp: function( element ) {
                                	var idEl = $('#' + this.getInputElement().getAttribute('id'));
                                	idEl.css("background-color", idEl.val());
                                },
        					    onShow: function(){
        					    	var idEl = $('#' + this.getInputElement().getAttribute('id'));
                                	idEl.css("background-color", "");
        					    }
                            },
                            {
                                type: "button",
                                id: "fontcolorChooser",
                                "class": "colorChooser",
                                label: "Color",
                                style: "margin-left: 8px",
                                onLoad: function () {
                                    this.getElement().getParent().setStyle("vertical-align", "bottom")
                                },
                                onClick: function () {
                                    editor.getColorFromDialog(function (color) {
                                        color && this.getDialog().getContentElement("options", "fontcolor").setValue( color );
                                        this.focus()
                                    }, this)
                                }
                            }
                        ]
                    }
                ]
            },
            /*
            {
                id: 'animation',
                label: 'Animations',
                elements: [
                    {

                    }
                ]
            }
            */
        ],
        onOk: function() {
            var dialog = this;

            var cka = editor.document.createElement(editor.fa42Tag );

            var cka_size = dialog.getValueOf( 'options', 'textsize' );
            var cka_color = dialog.getValueOf( 'options', 'fontcolor' );
            var cka_style = dialog.getValueOf( 'options', 'fontstyle');
            var cka_fw = dialog.getValueOf( 'options', 'fixedwidth');
            var cka_class = cka_style + (cka_fw ? " fa-fw" : '') + " " + dialog.getValueOf( 'options', 'ckawesomebox' );
            var cka_style = ( cka_size != '' ? 'font-size: '+cka_size+'px;' : '' ) + ( cka_color != '' ? 'color: '+cka_color+';' : '' ) ;

            cka.setAttribute( 'class', cka_class );
            if ( cka_style ) cka.setAttribute( 'style', cka_style );
            //cka.appendHtml("&nbsp;");
            editor.insertElement( cka );
        }
    };
});

