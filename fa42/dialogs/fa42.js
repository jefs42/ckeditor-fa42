var fa42CSS = ''; // contents of Font Awesome styelsheet
var fa42Classes = []; // class list of icons found from Font Awesome stylesheet, minus below
var fa42SkipClasses = [ // classes to leave out of icon selection
'fa-fw','fa-regular','fa-solid','fa-light','fa-thin','fa-duotone','fa-sharp','fa-brands', // styles
'fa-ul','fa-li','fa-pull-left','fa-pull-right',"fa-stack","fa-stack-1x","fa-stack-2x","fa-inverse","fa-border", // layout
'fa-spin','fa-pulse','fa-spin-pulse','fa-spin-reverse','fa-beat','fa-fade','fa-beat-fade','fa-bounce','fa-flip','fa-shake', // animations
"fa-rotate-90","fa-rotate-180","fa-rotate-270","fa-flip-horizontal","fa-flip-vertical","fa-flip-both",'fa-swap-opacity' // transformations
];
var fa42Styles = [
    'fa', 'far', 'fas', 'fal', 'fat', 'fad', 'fass','fasr','fasl','fast','fasd','fa-regular','fa-solid','fa-light','fa-thin','fa-duotone'
];
var fa42Sizes = [
    'fa-1x','fa-2x','fa-3x','fa-4x','fa-5x','fa-6x','fa-7x','fa-8x','fa-9x','fa-10x', 'fa-2xs', 'fa-xs', 'fa-sm', 'fa-lg', 'fa-xl', 'fa-2xl'
];
//var fa42Brands = []; // list of brand classes from current brands.css
var fa42Version = null; // full version of linked FontAwesome stylesheet
var fa42Major = 0; // major version of current FontAwesome stylesheet to adjust settings/features
var fa42Minor = 0; // minor version of current FontAwesome stylesheet to adjust settings/features
var fa42Level = 'free'; // free or pro (does the diffrence come in use here?)
var fa42Tag = 'i'; // tag to use for inclusion, default <i></i>
var fa42Regular = 'fa'; // class to use for display in Regular style
var fa42Solid = 'fa'; // class to use for display in Regular style
var fa42Light = 'fa'; // class to use for display in Regular style
var fa42Duotone = 'fa'; // class to use for display in Regular style
var fa42Brand = 'fab'; // class to use for brand types to switch to correct FontAwesome font file

var previewIcon, previewIcon2; // elements of the preview icon to add/remove/fetch icon info from

var fa42DialogObj = CKEDITOR.dialog.add('fa42Dialog', function( editor ) {
    var fa42Dialog = this;
    var config = editor.fa42Config;
    var colorDialog = editor.plugins.colordialog; // setup for pre-selecting the color of the icon
    var fa42Tag = config.fa42Tag; // tag to use for inclusion, default <i></i>
    console.log(config.fa42Path);
    // get Font Awesome classes from main stylesheet
    $.ajax({
       url: config.fa42Path,
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
            console.log(config);
            fa42Version = config.fa42Version ? config.fa42Version : (cpline ? cpline[1] : 'Un.know.n');
            fa42Level = config.fa42Level ? config.fa42Level : faType;
            console.log(fa42Version);
            var parts = fa42Version.split(".");
            fa42Major = parseInt(parts[0]);
            fa42Minor = parseInt(parts[1]);
            // override major/minor/level if set in config


            // set defaults
            if (fa42Major == 5) {fa42Regular = 'far'; fa42Brand = 'fab'; } // Version 5
            if (fa42Major == 6) {fa42Regular = fa42Version == 'pro' ? 'fa-regular' : 'fa-solid'; fa42Brand = 'fab'} // Version 6 (but no "fa-brands"?)
            if (fa42Major == 4) {
                fa42Sizes = ['fa-1x','fa-2x','fa-3x','fa-4x','fa-5x','fa-lg'];
            }
            // collect class names from css file
            var classRegex = /\.([\w-]+)/g;
            var match;
            while ((match = classRegex.exec(fa42CSS)) !== null) {
                if (match[1].match(/^fa\-/) && fa42Classes.indexOf(match[1]) == -1 && fa42SkipClasses.indexOf(match[1]) == -1 && fa42Sizes.indexOf(match[1]) == -1) {
                    fa42Classes.push(match[1]);
                }
             }
             // getFontAwesomeBrands();
       },
       error: function (jqXHR, status, errorMsg) {
        alert("Error loading Font Awesome CSS: \n" + config.fa42Path);
       }
    });
    function getFontAwesomeBrands() {
     // get Font Awesome brand classes from main stylesheet
     $.ajax({
        url: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/' + fa42Version + '/css/brands.min.css',
        type: 'get',
        dataType: 'html',
        async: false,
        success: function(response) {
             // collect class names from css file
             var classRegex = /\.([\w-]+)/g;
             var match;
             while ((match = classRegex.exec(response)) !== null) {
                 if (match[1].match(/^fa\-/) && fa42SkipClasses.indexOf(match[1]) == -1) {
                     fa42Brands.push(match[1]);
                 }
              }
              console.log(fa42Brands);
        },
        error: function (jqXHR, status, errorMsg) {
            // brands icons won't display nicely....
        }
     });
    }
	function getSizeOptions(selectList){
        for (i in fa42Sizes) {
            selectList.add(fa42Sizes[i].replace(/fa-/,''), fa42Sizes[i]);
	   	}
	}

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
                //selectList.add('Brands','fab');
            break;
            case 6:
                if (fa42Level == 'pro') {
                    selectList.add('Regular','fa-regular');
                    selectList.add('Solid','fa-solid');
                    selectList.add('Light','fa-light');
                    selectList.add('Thin','fa-thin');
                    selectList.add('Duotone','fa-duotone');
                    //selectList.add('--------','fa-regular');
                } else {
                    selectList.add('Solid','fa-solid');
                }
                if (fa42Minor >= 2 && fa42Level == 'pro') {
                    if (fa42Minor >= 3) {
                        selectList.add('Sharp Regular','fasr');
                    }
                    selectList.add('Sharp Solid','fass');
                    if (fa42Minor >= 4) {
                        selectList.add('Sharp Light','fasl');
                    }
                    //selectList.add('Sharp Thin','fast');
                    //selectList.add('Sharp Duotone','fasd');
                    //selectList.add('--------','fa-regular');
                }
                //selectList.add('Brands','fab');
                console.log(selectList);

            break;
        }
    }
    function getIconLayout() {
        fa42Classes.sort();
        var iconList = '<ul id="fa42-iconlist">';
        for (i in fa42Classes) {
            var regx = new RegExp(/-/,"g");
            var title = fa42Classes[i].replace(/^fa-/,'').replace(regx,' ');
            var iconID = fa42Classes[i].replace(/^fa-/,'');
            iconList += '<li onclick="_fa42IconOnClick(this)" id="fa42-icon-' + iconID + '" class="fa42-icon"><' + fa42Tag + ' class="' +  fa42Regular + ' fa-fw fa-2x '
                + fa42Classes[i] + '"></' + fa42Tag + '><div>' + title + '</div></li>';
        }
        iconList += '</ul>';
        return iconList;
    }

    return {
        title: 'fa42 using config: Font Awesome v' + fa42Version + ' (' + fa42Level + ')',
        minWidth: 720,
        minHeight: 200,

        contents: [
            {
                id: 'options',
                label: 'Main Options',
                elements: [
                    {
                        type: 'hbox',
                        widths: ['76%','24%'],
                        children: [
                            {
                                type: 'html',
                                id: 'fa42List',
                                label: 'Select Font Awesome Icon',
                                html: '<label>Select Font Awesome Icon</label>' + getIconLayout() +
                                    '<div id="fa42IconSearch"><input type="text" id="fa42IconSearchField" placeholder="Search..." onkeyup="_fa42Search(this.value)">' +
                                    '<i class="fa fa-times-circle" onclick="_fa42Search(\'_clear\')" style="cursor:default;"></i>' +
                                    '</div>'
                            },
                            {
                                type: 'vbox',
                                children: (function(){
                                    var children = [
                                        {
                                            type: 'html',
                                            id: 'fa42Icon',
                                            html: '<div id="fa42-icon"><label>Font Awesome Icon Preview</label><p class="fa42IconPreview"><' + fa42Tag + ' id="fa42-icon-preview" class="' + fa42Regular + ' fa-flag"></' + fa42Tag + '></p></div>',
                                            onShow: function() {
                                                // set global preview box 1 for later use
                                                previewIcon = document.getElementById('fa42-icon-preview');
                                            }
                                        },
                                        {
                                            type: 'html',
                                            id: 'fa42Control',
                                            html: '<h5 style="text-align:center;font-weight:bold;">------- Basic Style Options -------</h5>'
                                        }
                                    ];
                                    if (fa42Major > 4) {
                                        children.push({
                                            type: 'checkbox',
                                            id: 'fa42Brand',
                                            label: '   Brand Icon?',
                                            onClick: function(widget) {
                                                _fa42SetBrand(this.getValue());
                                            }
                                        },                                        {
                                            type: 'html',
                                            html: '<div style="border-top:1px solid #e7e7e7;font-size:1px">&nbsp;</div>'
                                        });
                                    }
                                    children.push(
                                        {
                                            type: 'select',
                                            id: 'fa42FontStyle',
                                            label: 'Font Style',
                                            items: [],
                                            onLoad: function(widget) {
                                                getStyleOptions(this);
                                            },
                                            onChange: function(widget) {
                                                _fa42ChangeFontStyle(this.getValue())
                                            }
                                        });
                                    if (fa42Major > 4) {
                                        children.push({
                                            type: 'checkbox',
                                            id: 'fa42-fa-swap-opacity',
                                            label: ' Swap Opacity (Duotone)',
                                            onClick: function(widget) {
                                                if (this.getValue() == true) {
                                                    previewIcon.classList.add('fa-swap-opacity');
                                                    previewIcon2.classList.add('fa-swap-opacity');
                                                } else {
                                                    previewIcon.classList.remove('fa-swap-opacity');
                                                    previewIcon.classList.remove('fa-swap-opacity');
                                                }
                                            }
                                        })
                                    }
                                    children.push(
                                        {
                                            type: 'html',
                                            html: '<div style="border-top:1px solid #e7e7e7;font-size:1px">&nbsp;</div>'
                                        },
                                        {
                                        type: 'select',
                                        id: 'fa42FontSize',
                                        label: 'Font Size',
                                        items: [[ editor.lang.common.notSet, '' ]],
                                        onLoad: function(widget) {
                                            getSizeOptions(this);
                                        },
                                        onChange: function(widget) {
                                            _fa42ChangeFontSize(this.getValue());
                                        }
                                        },
                                        {
                                        type: 'html',
                                        html: '<div style="border-top:1px solid #e7e7e7;font-size:1px">&nbsp;</div>'
                                        },
                                        {
                                            type: 'checkbox',
                                            id: 'fa42-fa-fw',
                                            label: ' Fixed Width',
                                            onClick: function(widget) {
                                                if (this.getValue() == true) {
                                                    previewIcon.classList.add('fa-fw');
                                                    previewIcon2.classList.add('fa-fw');
                                                } else {
                                                    previewIcon.classList.remove('fa-fw');
                                                    previewIcon.classList.remove('fa-fw');
                                                }
                                            }
                                        },
                                        {
                                            type: 'html',
                                            html: '<div style="border-top:1px solid #e7e7e7;font-size:1px">&nbsp;</div>'
                                        },
                                        {
                                            type: 'button',
                                            id: 'fa42FontColor',
                                            label: 'Change Icon Color',
                                            onload: function() { },
                                            onClick: function() {
                                                editor.getColorFromDialog( function(color) {
                                                    if (color) {
                                                        _fa42ChangeFontColor(color);
                                                    }
                                                    this.focus();
                                                }, this);
                                            }
                                        },
                                        {
                                        type: 'html',
                                        id: 'fa42Control',
                                        html: '<input type="hidden" name="_fa42Icon" value="fa-flag">' +
                                        '<input type="hidden" name="_fa42IconStyle" value="' + fa42Regular + '">' +
                                        '<input type="hidden" name="_fa42IconSize" value="">' +
                                        '<input type="hidden" name="_fa42IconAnimations" value="">' +
                                        '<input type="hidden" name="_fa42IconColor" value="">'
                                        }
                                    );
                                    return children;
                                })()
                            }
                        ]
                    },
                ]
            },
            {
                id: 'effects',
                label: 'Effects',
                elements: [
                    {
                        type:'hbox',
                        widths: ['70%','30%'],
                        children: [
                            {
                                    type: 'vbox',
                                    children: [
                                        {
                                            type: 'html',
                                            html: '<label style="font-weight:bold">Transformations</label>'
                                        },
                                        {
                                            type: 'hbox',
                                            children: [
                                                {
                                                    type: 'checkbox',
                                                    id: 'fa42-fa-rotate-90',
                                                    label: ' Rotate 90deg',
                                                    onClick: function() {
                                                        _fa42UpdateTransformations(this.getValue(), 'fa-rotate-90');
                                                    }
                                                },
                                                {
                                                    type: 'checkbox',
                                                    id: 'fa42-fa-rotate-180',
                                                    label: ' Rotate 180deg',
                                                    onClick: function() {
                                                        _fa42UpdateTransformations(this.getValue(), 'fa-rotate-180');
                                                    }
                                                },
                                                {
                                                    type: 'checkbox',
                                                    id: 'fa42-fa-rotate-270',
                                                    label: ' Rotate 270deg',
                                                    onClick: function() {
                                                        _fa42UpdateTransformations(this.getValue(), 'fa-rotate-270');
                                                    }
                                                }                                            ]
                                        },
                                        {
                                            type: 'hbox',
                                            children: [
                                                {
                                                    type: 'checkbox',
                                                    id: 'fa42-fa-flip-horizontal',
                                                    label: ' Flip Horizontal',
                                                    onClick: function() {
                                                        _fa42UpdateTransformations(this.getValue(), 'fa-flip-horizontal');
                                                    }
                                                },
                                                {
                                                    type: 'checkbox',
                                                    id: 'fa42-fa-flip-vertical',
                                                    label: ' Flip Vertical',
                                                    onClick: function() {
                                                        _fa42UpdateTransformations(this.getValue(), 'fa-flip-vertical');
                                                    }
                                                },
                                                {
                                                    type: 'checkbox',
                                                    id: 'fa42-fa-flip-both',
                                                    label: ' Flip Both',
                                                    onClick: function() {
                                                        _fa42UpdateTransformations(this.getValue(), 'fa-flip-both');
                                                    }
                                                }                                            ]
                                        },
                                        {
                                            type: 'html',
                                            html: '<label style="font-weight:bold">Animations</label>'
                                        },
                                        {
                                            type: 'hbox',
                                            children: (function() {
                                                var children = [
                                                {
                                                    type: 'checkbox',
                                                    id: 'fa42-fa-spin',
                                                    label: ' Spin',
                                                    onClick: function() {
                                                        _fa42UpdateTransformations(this.getValue(), 'fa-spin');
                                                    }
                                                }
                                                ];
                                                if (fa42Major > 5) {
                                                    children.push(
                                                        {
                                                            type: 'checkbox',
                                                            id: 'fa42fa-spin-pulse',
                                                            label: 'Pulse',
                                                            onClick: function() {
                                                                _fa42UpdateTransformations(this.getValue(), 'fa-spin-pulse');
                                                            }
                                                        },
                                                        {
                                                            type: 'checkbox',
                                                            id: 'fa42-fa-spin-reverse',
                                                            label: 'Reverse',
                                                            onClick: function() {
                                                                _fa42UpdateTransformations(this.getValue(), 'fa-spin-reverse');
                                                            }
                                                        }
                                                    );
                                                } else {
                                                    children.push(
                                                        {
                                                            type: 'checkbox',
                                                            id: 'fa42-fa-pulse',
                                                            label: ' Pulse',
                                                            onClick: function() {
                                                                _fa42UpdateTransformations(this.getValue(), 'fa-pulse');
                                                            }
                                                        }
                                                    );
                                                }
                                                return children;
                                            })()
                                        },
                                    ]
                            },
                            {
                                type: 'html',
                                id: 'fa42Icon',
                                html: '<div id="fa42-icon2"><label>Font Awesome Icon Preview</label><p class="fa42IconPreview"><' + fa42Tag + ' id="fa42-icon-preview2" class="' + fa42Regular + ' fa-flag"></' + fa42Tag + '></p></div>',
                                onShow: function() {
                                    // set global preview box 2 for later use
                                    previewIcon2 = document.getElementById('fa42-icon-preview2');
                                }
                            }

                        ]
                    }
                ]
            },
            {
                id: 'advanced',
                label: 'Advanced',
                elements: [
                    {
                        type: 'html',
                        html: 'A description? It\'s advanced... maybe just put in the fields with titles...<br><br>Custom <i>style</i> fields? <br><br>' +
                            '--fa-primary-opacity. --fa-secondary-opacity, --fa-primary-color, --fa-secondary-color<br>--fa-beat-scale, --fa-fade-opacity, --etc'
                    }
                ]


            }
        ],
        onShow: function( evt ) {
            previewIcon = document.getElementById('fa42-icon-preview');
            previewIcon2 = document.getElementById('fa42-icon-preview2');
            // reload selected icon if set
            if (editor.fa42Selected) {
                var currIcon = document.getElementsByName("_fa42Icon")[0].value;
                var iconClasses = editor.fa42Selected.getAttribute('class').split(' ');
                var dialog = CKEDITOR.dialog.getCurrent();
                var fontStyleElement = dialog.getContentElement('options','fa42FontStyle');
                for (i in iconClasses) {
                    if (fa42Classes.indexOf(iconClasses[i]) > -1) {
                        previewIcon.classList.remove(currIcon);
                        previewIcon.classList.add(iconClasses[i]);
                        previewIcon2.classList.remove(currIcon);
                        previewIcon2.classList.add(iconClasses[i]);
                        document.getElementsByName("_fa42Icon")[0].value = iconClasses[i];
                    }
                    else if (fa42Sizes.indexOf(iconClasses[i]) > -1) {
                        this.setValueOf('options', 'fa42FontSize', iconClasses[i]);
                    }
                    else if (iconClasses[i] == fa42Brand) {
                        this.setValueOf('options', 'fa42Brand', true);
                    } else if (fa42Styles.indexOf(iconClasses[i]) > -1) {
                        this.setValueOf('options', 'fa42FontStyle', iconClasses[i]);
                    } else {
                        // see if it's a checkbox (options page)
                        if (this.getContentElement('options','fa42-' + iconClasses[i])) {
                            this.setValueOf('options', 'fa42-' + iconClasses[i], true);
                        }
                        // see if it's a checkbox (effects page)
                        if (this.getContentElement('effects','fa42-' + iconClasses[i])) {
                            this.setValueOf('effects', 'fa42-' + iconClasses[i], true);
                        }
                        previewIcon.classList.add(iconClasses[i]);
                        previewIcon2.classList.add(iconClasses[i]);
                    }
                }
                if (editor.fa42Selected.$.style.color) {
                    previewIcon.style.color = editor.fa42Selected.$.style.color;
                    previewIcon2.style.color = editor.fa42Selected.$.style.color;
                    document.getElementsByName("_fa42IconColor")[0].value = editor.fa42Selected.$.style.color;
                }
            } else {

            }
            editor.fa42Selected = null;
        },
        onOk: function() {
            var fa42Insert = editor.document.createElement(fa42Tag);

            //var fa42Icon = document.getElementsByName("_fa42Icon")[0].value;
            //var fa42Style = dialog.getValueOf('options', 'fa42FontStyle');
            //var fa42Size = dialog.getValueOf('options', 'fa42FontSize');
            //var fa42IsBrand = dialog.getValueOf('options', 'fa42Brand');
            //var fa42IconClass = (fa42IsBrand ? fa42Brand : fa42Style) + (fa42Size != '' ? " " + fa42Size : '') + " " + fa42Icon;
            var fa42Color = document.getElementsByName("_fa42IconColor")[0].value;
            //fa42Insert.setAttribute('class', fa42IconClass );
            fa42Insert.setAttribute('class', document.getElementById('fa42-icon-preview').className);
            fa42Insert.setAttribute('style','display:inline-block;' + (fa42Color != '' ? 'color:' + fa42Color : '') );

            fa42Insert.setAttribute('data-fa42','true');
            //fa42Insert.appendHtml("&zwj;");
            editor.insertElement(fa42Insert);
        }
    };

});
// end addDialog

//======= utility functions

/* Set actual font awesome icon */
function _fa42IconOnClick(item) {
    var dObj = CKEDITOR.dialog.getCurrent();
    var faIcon = item.children.item(0);
    var classes = faIcon.className.split(' ');
    var iconClass = classes[classes.length - 1];
    var currIcon = document.getElementsByName("_fa42Icon")[0].value;
    document.getElementsByName("_fa42Icon")[0].value = iconClass;
    previewIcon.classList.remove(currIcon);
    previewIcon.classList.add(iconClass);
    previewIcon2.classList.remove(currIcon);
    previewIcon2.classList.add(iconClass);
}
/* Update icon style (regular, solid, etc) */
function _fa42ChangeFontStyle(newStyle) {
    if (!newStyle) { return;}
    var dObj = CKEDITOR.dialog.getCurrent();
    var currentStyle = document.getElementsByName("_fa42IconStyle")[0].value;
    var isBrand = dObj.getContentElement('options','fa42Brand') ? dObj.getValueOf('options', 'fa42Brand') : false;
    if (isBrand) {
        alert("Brand selected, regular font styles irrelevant and will be ignored.");
        return false;
    }
    previewIcon.classList.remove(currentStyle);
    previewIcon.classList.add(newStyle);
    previewIcon2.classList.remove(currentStyle);
    previewIcon2.classList.add(newStyle);
    document.getElementsByName("_fa42IconStyle")[0].value = newStyle;
}
/* Update icon size */
function _fa42ChangeFontSize(newSize) {
    var currentSize = document.getElementsByName("_fa42IconSize")[0].value;
    if (currentSize.match(/^fa/)) {
        previewIcon.classList.remove(currentSize);
        previewIcon2.classList.remove(currentSize);
    } else {
        // remove font-size style
        // maybe... or just offer fa-#x sizing options
    }
    if (newSize.match(/^fa/)) {
        previewIcon.classList.add(newSize);
        previewIcon2.classList.add(newSize);
    } else {
        // remove font-size style
        // maybe... or just offer fa-#x sizing options
    }
    document.getElementsByName("_fa42IconSize")[0].value = newSize;
}
/* Update icon color */
function _fa42ChangeFontColor(newColor) {
    var currentColor = document.getElementsByName("_fa42IconColor")[0].value;
    previewIcon.style.color = newColor;
    previewIcon2.style.color = newColor;
    document.getElementsByName("_fa42IconColor")[0].value = newColor;
}
/* Update if icon is a brand-type icon (fa 5+) */
function _fa42SetBrand(isBrand) {
    var dObj = CKEDITOR.dialog.getCurrent();
    var classes = previewIcon.className.split(' ');
    var currentStyle = dObj.getValueOf('options', 'fa42FontStyle');
    if (isBrand) {
        classes.splice(classes.indexOf(currentStyle), 1);
        classes.unshift(fa42Brand);
        previewIcon.className = classes.join(' ');
        previewIcon2.className = classes.join(' ');
    } else {
        classes.splice(classes.indexOf(fa42Brand), 1);
        classes.unshift(currentStyle);
        previewIcon.className = classes.join(' ');
        previewIcon2.className = classes.join(' ');
    }
}
/* Update various transformations - rotate, flip, spin, animate */
function _fa42UpdateTransformations(value,className) {
    if (value == true) {
        previewIcon.classList.add(className);
        previewIcon2.classList.add(className);
    } else {
        previewIcon.classList.remove(className);
        previewIcon2.classList.remove(className);
    }
}
/* Search/filter icon list */
function _fa42Search(keyword) {
    var iconList = document.querySelectorAll(".fa42-icon");
    if (keyword == '_clear' || keyword == '') {
        document.getElementById('fa42IconSearchField').value = '';
        iconList.forEach(icon => {
            icon.style.display = 'block';
        });
        return;
    }
    if (keyword.length > 2) {
        iconList.forEach(icon => {
            icon.style.display = icon.id.match(keyword) ? 'block' : 'none';
        });
    }
}