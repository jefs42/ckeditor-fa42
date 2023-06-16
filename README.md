# FontAwesome fortyTwo IT

Font Awesome (FA) plugin for CKEditor 4

Covering FA versions 4 - 6, free and pro. Icon selection with preview. Style, sizing, color options. Effects and animations like spin, rotate, beat, bounce, flip. All relative to the version of Font Awesome you use it with.

![FontAwesome for CKEditor by fortyTwo IT](https://fortytwo-it.com/wp-content/uploads/2023/06/fa42Main.png)

Double click the icon in the editor to re-open the dialog box with the icons current settings to edit.

## Installation

Download ZIP file and extract.

Place the fa42/ directory into your CKEditor installation folder's /plugins/ directory

In your config.js file, add fa42 to config.extraPlugins directive

```
config.extraPlugins = 'fa42'; // only extra plugin
config.extraPlugins = 'etc,etc,etc,fa42'; // add to other extra plugins
```

**Note:** Generally speaking, CKEditor does not like empty tags and will remove them when saving. To allow your tag (default <i>) to not be removed, add the following *before* ```CKEDITOR.editorConfig = function( config ) {``` in your main config.js:

```js
CKEDITOR.dtd.$removeEmpty['i'] = 1; // replace or duplicate if you want to use <span> or any other tag instead of <i>

CKEDITOR.editorConfig = function( config ) { 
//...
}
```

**Extra Note:** There seems to be no consensus on making CKEditor4 not remove empty tags. But I'm hesitant to use  ``&nbsp;`` or ``&zwj;`` unless I really have to.

[Empty  tags removed automatically despite CKEDITOR.dtd settings · Issue #3267 · ckeditor/ckeditor4 · GitHub](https://github.com/ckeditor/ckeditor4/issues/3267)

## Configuration Options

The fa42 plugin defaults to FontAwesome v6.4.0 Free on Cloudflare CDN, and using the <i> tag for icons. The plugin will try to determine the version of FontAwesome from the CSS file being used.

```js
config.fa42 = {
    fa42Path: 'absolute/url/to/local or remote/fontawesome.css',
    fa42Tag: 'span'
}
```

If auto-detection of version is not working correctly for your specific FA stylesheet, you may override those settings. This *could* enable or disable specific features that may or may not be available for your version, so be careful if you do find the need to manually set them:

```js
config.fa42 = {
    // other options
    fa42Version: '10.4.2', // At least Major and Minor version
    fa42Level: 'pro' // 'free' or 'pro'
}
```

The above will force the plugin to (try) to work with FontAwesome Pro, version 10, subversion 4.

Technically, this would then make the plugin use v6 options/icons, and effects/etc available since 6.4.

## Future Versions

See [DEVNOTES.md](DEVNOTES.md) for notes on what I would like to add or update moving forward. The (currently useless) **Advanced** tab I would at least like to give the ability to include custom CSS styling. For example to add "fa-rotate-by" class, so user can then set a custom "--fa-rotate-angle: 42deg", or adjust colors and opacity levels of Dutone icons.
