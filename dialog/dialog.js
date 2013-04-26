function dialog_push(dialog, replace) {
	var stack = Session.get('dialog_stack');

	if (!stack) stack = [];
	if (replace && stack.length > 0) {
		stack.pop();
	}
	stack.push(dialog);
	Session.set('dialog_stack', stack);
}

function dialog_top() {
	var stack = Session.get('dialog_stack');

	if (stack && stack.length > 0) {
		return _.last(stack);
	}

	return false;
}

var escape_chars = {
	'&': 'amp',
	'<': 'lt',
	'>': 'gt',
	'"': 'quot',
	"'": 'apos'
};

function escape_html(what) {
	return String(what).replace(/[&<>"']/g, function(v){
		return '&' + escape_chars[v] + ';';
	});
}

/**
 * Put up a modal dialog.
 *
 * Examples:
 *   dialog_modal({title: 'Table', html: '...', size: '480'}) // Autosize height from width
 *   dialog_modal({title: 'List', html: '...', size: '640 x 80%'}) // Width in px, height in %
 *
 * @param options Dialog options:
 *   title: The title of the dialog.
 *   template: The template to render.
 *   size: The "width x height" of the dialog.
 *   content: Parameters to pass to the dialog template for rendering.
 *
 */
function dialog_modal(options) {
	if ('object' !== typeof options) {
		options = {
			html: options
		}
	}

	var template = options.template?options.template:false,
		title = options.title?options.title:'Data',
		size = (options.size?options.size.toString():'960 x 80%').split(/\s+x\s+/),
		content = options.content?options.content:{},
		dialog = {};

	var width, height = 0,
		width_type = 'px',
		height_type = 'px';

	width = size[0];
	if (width.substr(width.length-1, 1) == '%') {
		width = width.substr(0, width.length-1);
		width_type = '%';
	}
	width = parseInt(width);

	if (size.length < 2) {
		height = ~~(width * 2/3);
		height_type = width_type;
	}
	else if (size[1] == 'auto') {
		height = 'auto';
		height_type = '';
	}
	else {
		height = size[1];

		if (height.substr(height.length-1, 1) == '%') {
			height = height.substr(0, height.length-1);
			height_type = '%';
		}
		height = parseInt(height);
	}

	if (title) dialog.title = title;
	else dialog.title = 'Dialog';

	if (!template) {
		dialog.template = 'default_dialog';
	}
	else {
		dialog.template = template;
	}

	if (options.html) content.html = options.html;
	else if (options.text) content.html = escape_html(options.text);

	dialog.width = width + width_type;
	dialog.height = height != 'auto' ? height + height_type : false;
	dialog.content = content;

	if (height == 'auto' && options.footer) dialog.footer = options.footer;

	dialog_push(dialog, options.replace);
};

/**
 * Close the current top level dialog and return to the next one in the stack.
 */
function dialog_close() {
	var stack = Session.get('dialog_stack');

	if (stack && stack.length > 0) {
		stack.pop();
		Session.set('dialog_stack', stack);
	}
};

window.dialog_close = dialog_close;
window.dialog_modal = dialog_modal;


_.each(['dialog-modal', 'dialog-modal-body'], function(what) {
	var t = Template[what];
	t.helpers({
		dialog_visibility: function() {
			if (dialog_top()) {
				return '';
			}
			return ' hidden';
		},

		dialog_dimensions: function() {
			var dialog = dialog_top();

			if (dialog) {
				var style =
					(dialog.height ? '' : ' auto-size') + '" style="' +
					'width: ' + dialog.width + '; ' +
					'height: ' + (dialog.height ? dialog.height : 'auto');
				return style;
			}

			return '';
		},

		dialog_title: function() {
			var dialog = dialog_top();

			if (dialog) return dialog.title;
			return 'Unknown';
		},

		dialog_footer: function() {
			var dialog = dialog_top();

			if (dialog) return dialog.footer === true ? ' ' : dialog.footer;
			return '';
		},

		dialog_content: function() {
			var dialog = dialog_top();
			if (!dialog) return '';

			if (!dialog.template) dialog.template = 'default_dialog';

			var result;
			if (Template[dialog.template]) {
				result = Template[dialog.template](dialog.content);
			}
			else {
				result = "<div class=container><h3><span class=aicon-warning-sign></span> Error</h3>" +
					"<hr/>" +
					"<b>Dialog not found</b>" +
					"<p>The dialog “" + dialog.template + "” was not found.</p>" +
					"</div>";
			}
			return new Handlebars.SafeString(result);
		}
	});

	t.events({
		'click .dialog-close': dialog_close,
		'click .dialog-direct-close': function(e) {
			if ($(e.target).is('.dialog-direct-close')) {
				dialog_close(e);
			}
		}
	});
});
