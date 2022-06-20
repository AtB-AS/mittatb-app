import {BWIPJS} from './bwipjs'
import {bwipp_lookup, bwipp_encode, bwipp_pharmacode2} from './bwipp'


function FixupOptions(opts) {
	var scale	= opts.scale || 2;
	var scaleX	= +opts.scaleX || scale;
	var scaleY	= +opts.scaleY || scaleX;

	// Fix up padding.
	opts.paddingleft = padding(opts.paddingleft, opts.paddingwidth, opts.padding, scaleX);
	opts.paddingright = padding(opts.paddingright, opts.paddingwidth, opts.padding, scaleX);
	opts.paddingtop = padding(opts.paddingtop, opts.paddingheight, opts.padding, scaleY);
	opts.paddingbottom = padding(opts.paddingbottom, opts.paddingheight, opts.padding, scaleY);

	// We override BWIPP's background color functionality.  If in CMYK, convert to RGB so
	// the drawing interface is consistent.
	if (/^[0-9a-fA-F]{8}$/.test(''+opts.backgroundcolor)) {
		var cmyk = opts.backgroundcolor;
		var c = parseInt(cmyk.substr(0,2), 16) / 255;
		var m = parseInt(cmyk.substr(2,2), 16) / 255;
		var y = parseInt(cmyk.substr(4,2), 16) / 255;
		var k = parseInt(cmyk.substr(6,2), 16) / 255;
		var r = Math.floor((1-c) * (1-k) * 255).toString(16);
		var g = Math.floor((1-m) * (1-k) * 255).toString(16);
		var b = Math.floor((1-y) * (1-k) * 255).toString(16);
		opts.backgroundcolor = (
			(r.length == 1 ? '0' : '') + r +
			(g.length == 1 ? '0' : '') + g +
			(b.length == 1 ? '0' : '') + b
		);
	}

	return opts;

	function padding(a, b, c, s) {
		if (a != null) {
			return a*s;
		}
		if (b != null) {
			return b*s;
		}
		return c*s || 0;
	}
}

var BWIPJS_OPTIONS = {
	bcid:1,
	text:1,
	scale:1,
	scaleX:1,
	scaleY:1,
	rotate:1,
	padding:1,
	paddingwidth:1,
	paddingheight:1,
	paddingtop:1,
	paddingleft:1,
	paddingright:1,
	paddingbottom:1,
	backgroundcolor:1,
};

// Browser and nodejs usage.
export function Render(params, drawing) {
    return _Render(bwipp_lookup(params.bcid), params, drawing);
}

// Called by the public exports
function _Render(encoder, params, drawing) {
	var text = params.text;
	if (!text) {
		throw new ReferenceError('bwip-js: bar code text not specified.');
	}

	// Set the bwip-js defaults
    FixupOptions(params);
	var scale	= params.scale || 2;
	var scaleX	= +params.scaleX || scale;
	var scaleY	= +params.scaleY || scaleX;
	// var rotate	= params.rotate || 'N';

	// Create a barcode writer object.  This is the interface between
	// the low-level BWIPP code, the bwip-js graphics context, and the
	// drawing interface.
	var bw = new BWIPJS(drawing);

	// Set the BWIPP options
	var opts = {};
	for (var id in params) {
		if (!BWIPJS_OPTIONS[id]) {
			opts[id] = params[id];
		}
	}

	// Fix a disconnect in the BWIPP rendering logic
	if (opts.alttext) {
		opts.includetext = true;
	}
	// We use mm rather than inches for height - except pharmacode2 height
	// which is already in mm.
	if (+opts.height && encoder != bwipp_pharmacode2) {
		opts.height = opts.height / 25.4 || 0.5;
	}
	// Likewise, width
	if (+opts.width) {
		opts.width = opts.width / 25.4 || 0;
	}

	// Scale the image
	bw.scale(scaleX, scaleY);

	// Call into the BWIPP cross-compiled code and render the image.
    bwipp_encode(bw, encoder, text, opts);
	return bw.render();		// Return whatever drawing.end() returns
}
