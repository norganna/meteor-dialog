meteor-dialog
=============

A drop in stack based dialog system for meteor apps.

## Usage:

Copy the dialog folder to your meteor app's client folder.

Add the following to the bottom of your meteor app's main &lt;body&gt; template section:

    {{> dialog-modal}}
    
From within an event helper (or anywhere else in javascript land) call the `dialog_modal()` function to push your dialog onto the stack.

## Parameters:

### dialog_modal(options);

Pushes a dialog modal onto the stack.

Where options is an object containing one or more of the following keys:
 * *title*: The title to place at the top of the dialog.
 * *template*: The template to use to render the dialog (default: `'default_dialog'`).
 * *content*: The object to pass to the template as data (default: `{}`).
 * *size*: A size string, eg: `'470 x 320'`, `'640 x 60%'`, `'40% x 600'`, `'320 x auto'` (default: `'960 x 80%'`).
 * *html*: If supplied, gets helpfully placed into `content['html']` as the raw html.
 * *text*: If supplied, gets helpfully html escaped and placed into `content['html']` as the encoded text.
 * *replace*: Boolean if supplied, replaces the current dialog instead of pushing.

### dialog_close();

Closes the topmost dialog from the stack.

## Example

    <head>
      <title>TF2WH Admin</title>
    </head>
    
    <body>
      <span onclick="dialog_modal({title: 'hello', template: 'hello', content: { what: 'world' }});">Click</span>
      {{>dialog-modal}}
    </body>
    
    <template name="hello">
      Hello {{what}}
    </template>

## License:

Project code is released under CC0 license:

<a rel="license" href="http://creativecommons.org/publicdomain/zero/1.0/">
<img src="http://i.creativecommons.org/p/zero/1.0/88x31.png" style="border-style: none;" alt="CC0" />
</a>
