meteor-dialog
=============

A drop in stack based dialog system for meteor apps.

## Usage:

Copy the dialog folder to your meteor app's client folder.

Add the following to the bottom of your meteor app's main &lt;body&gt; template section:

    {{> dialog-modal}}

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

