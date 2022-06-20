// bwip-js/examples/drawing-svg.js
//
// This is an advanced demonstation of using the drawing interface.
//
// Converts the drawing primitives into the equivalent SVG.  Linear barcodes
// are rendered as a series of stroked paths.  2D barcodes are rendered as a 
// series of filled paths.
//
// Rotation is handled during drawing.  The resulting SVG will contain the 
// already-rotated barcode without an SVG transform.
//
// If the requested barcode image contains text, the glyph paths are 
// extracted from the font file (via the builtin FontLib and stb_truetype.js)
// and added as filled SVG paths.
//
// This code can run in the browser and in nodejs.
export function DrawingSVG(opts, FontLib) {
    // Unrolled x,y rotate/translate matrix
    let tx0 = 0
    let tx1 = 0
    let tx2 = 0
    const tx3 = 0;
    let ty0 = 0
    let ty1 = 0
    const ty2 = 0
    let ty3 = 0;

    let svg = '';
    let path;
    const lines = {};

    // Magic number to approximate an ellipse/circle using 4 cubic beziers.
    const ELLIPSE_MAGIC = 0.55228475 - 0.00045;

    // Global graphics state
    let gs_width, gs_height;    // image size, in pixels
    let gs_dx, gs_dy;           // x,y translate (padding)

    return {
        scale() {
            // Make no adjustments
        },
        // Measure text.  This and scale() are the only drawing primitives that
        // are called before init().
        //
        // `font` is the font name typically OCR-A or OCR-B.
        // `fwidth` and `fheight` are the requested font cell size.  They will
        // usually be the same, except when the scaling is not symetric.
        measure(str, font, fwidth, fheight) {
            // fwidth = fwidth|0;
            // fheight = fheight|0;

            // const fontid = FontLib.lookup(font);
            // let width = 0;
            // let ascent = 0;
            // let descent = 0;
            // for (let i = 0; i < str.length; i++) {
            //     const ch = str.charCodeAt(i);
            //     const glyph = FontLib.getpaths(fontid, ch, fwidth, fheight);
            //     if (!glyph) {
            //         continue;
            //     }
            //     ascent  = Math.max(ascent, glyph.ascent);
            //     descent = Math.max(descent, -glyph.descent);
            //     width  += glyph.advance;
            // }
            // return { width, ascent, descent };
            return { width: 0, ascent: 0, descent: 0 };
        },

        // width and height represent the maximum bounding box the graphics will occupy.
        // The dimensions are for an unrotated rendering.  Adjust as necessary.
        init(width, height) {
            // Add in the effects of padding.  These are always set before the
            // drawing constructor is called.
            const padl = opts.paddingleft;
            const padr = opts.paddingright;
            const padt = opts.paddingtop;
            const padb = opts.paddingbottom;
            const rot  = opts.rotate || 'N';

            width  += padl + padr;
            height += padt + padb;

            // Transform indexes are: x, y, w, h
            switch (rot) {
            // tx = w-y, ty = x
            case 'R': tx1 = -1; tx2 = 1; ty0 = 1; break;
            // tx = w-x, ty = h-y
            case 'I': tx0 = -1; tx2 = 1; ty1 = -1; ty3 = 1; break;
            // tx = y, ty = h-x
            case 'L': tx1 = 1; ty0 = -1; ty3 = 1; break;
            // tx = x, ty = y
            default:  tx0 = ty1 = 1; break;
            }

            // Setup the graphics state
            const swap = rot == 'L' || rot == 'R';
            gs_width  = swap ? height : width;
            gs_height = swap ? width : height;
            gs_dx = padl;
            gs_dy = padt;

            svg = '';
        },
        // Unconnected stroked lines are used to draw the bars in linear barcodes.
        // No line cap should be applied.  These lines are always orthogonal.
        line(x0, y0, x1, y1, lw, rgb) {
            // Try to get non-blurry lines...
            x0 = x0|0;
            y0 = y0|0;
            x1 = x1|0;
            y1 = y1|0;
            lw = Math.round(lw);

            // Try to keep the lines "crisp" by using with the SVG line drawing spec to
            // our advantage.
            if (lw & 1) {
                if (x0 == x1) {
                    x0 += 0.5;
                    x1 += 0.5;
                }
                if (y0 == y1) {
                    y0 += 0.5;
                    y1 += 0.5;
                }
            }

            // Group together all lines of the same width and emit as single paths.
            // Dramatically reduces resulting text size.
            const key = '' + lw + '#' + rgb;
            if (!lines[key]) {
                lines[key] = '<path stroke="#' + rgb + '" stroke-width="' + lw + '" d="';
            }
            lines[key] += 'M' + transform(x0, y0) + 'L' + transform(x1, y1);
        },
        // Polygons are used to draw the connected regions in a 2d barcode.
        // These will always be unstroked, filled, non-intersecting,
        // orthogonal shapes.
        // You will see a series of polygon() calls, followed by a fill().
        polygon(pts) {
            if (!path) {
                path = '<path d="';
            }
            path += 'M' + transform(pts[0][0], pts[0][1]);
            for (let i = 1, n = pts.length; i < n; i++) {
                const p = pts[i];
                path += 'L' + transform(p[0], p[1]);
            }
            path += 'Z';
        },
        // An unstroked, filled hexagon used by maxicode.  You can choose to fill
        // each individually, or wait for the final fill().
        //
        // The hexagon is drawn from the top, counter-clockwise.
        hexagon(pts, rgb) {
            this.polygon(pts); // A hexagon is just a polygon...
        },
        // An unstroked, filled ellipse.  Used by dotcode and maxicode at present.
        // maxicode issues pairs of ellipse calls (one cw, one ccw) followed by a fill()
        // to create the bullseye rings.  dotcode issues all of its ellipses then a
        // fill().
        ellipse(x, y, rx, ry, ccw) {
            if (!path) {
                path = '<path d="';
            }
            const dx = rx * ELLIPSE_MAGIC;
            const dy = ry * ELLIPSE_MAGIC;

            // Since we fill with even-odd, don't worry about cw/ccw
            path += 'M' + transform(x - rx, y) +
                    'C' + transform(x - rx, y - dy) + ' ' +
                          transform(x - dx, y - ry) + ' ' +
                          transform(x,      y - ry) +
                    'C' + transform(x + dx, y - ry) + ' ' +
                          transform(x + rx, y - dy) + ' ' +
                          transform(x + rx, y) + 
                    'C' + transform(x + rx, y + dy) + ' ' +
                          transform(x + dx, y + ry) + ' ' +
                          transform(x,      y + ry) +  
                    'C' + transform(x - dx, y + ry) + ' ' +
                          transform(x - rx, y + dy) + ' ' +
                          transform(x - rx, y) + 
                    'Z';
        },
        // PostScript's default fill rule is even-odd.
        fill(rgb) {
            if (path) {
                svg += path + '" fill="#' + rgb + '" fill-rule="evenodd" />\n';
                path = null;
            }
        },
        // Draw text with optional inter-character spacing.  `y` is the baseline.
        // font is an object with properties { name, width, height, dx }
        // width and height are the font cell size.
        // dx is extra space requested between characters (usually zero).
        text(x, y, str, rgb, font) {
            // const fontid  = FontLib.lookup(font.name);
            // const fwidth  = font.width|0;
            // const fheight = font.height|0;
            // const dx      = font.dx|0;
            // let path = '';
            // for (let k = 0; k < str.length; k++) {
            //     const ch = str.charCodeAt(k);
            //     const glyph = FontLib.getpaths(fontid, ch, fwidth, fheight);
            //     if (!glyph) {
            //         continue;
            //     }
            //     if (glyph.length) {
            //         // A glyph is composed of sequence of curve and line segments.
            //         // M is move-to
            //         // L is line-to
            //         // Q is quadratic bezier curve-to
            //         // C is cubic bezier curve-to
            //         for (let i = 0, l = glyph.length; i < l; i++) {
            //             const seg = glyph[i];
            //             if (seg.type == 'M' || seg.type == 'L') {
            //                 path += seg.type + transform(seg.x + x, y - seg.y);
            //             } else if (seg.type == 'Q') {
            //                 path += seg.type + transform(seg.cx + x, y - seg.cy) + ' ' +
            //                                    transform(seg.x + x,  y - seg.y);
            //             } else if (seg.type == 'C') {
            //                 path += seg.type + transform(seg.cx1 + x, y - seg.cy1) + ' ' +
            //                                    transform(seg.cx2 + x, y - seg.cy2) + ' ' +
            //                                    transform(seg.x + x,   y - seg.y);
            //             }
            //         }
            //         // Close the shape
            //         path += 'Z';
            //     }
            //     x += glyph.advance + dx;
            // }
            // if (path) {
            //     svg += '<path d="' + path + '" fill="#' + rgb + '" />\n';
            // }
        },
        // Called after all drawing is complete.  The return value from this method
        // is the return value from `bwipjs.render()`.
        end() {
            let linesvg = '';
            for (const key in lines) {
                linesvg += lines[key] + '" />\n';
            }
            const bg = opts.backgroundcolor;
            return (
                '<svg' +
                    ' version="1.1"' +
                    ' width="' + gs_width + '"' +
                    ' height="' + gs_height + '"' +
                    ' viewBox="0 0 ' + gs_width + ' ' + gs_height + '"' +
                    ' xmlns="http://www.w3.org/2000/svg"' +
                '>\n' +
                    (/^[0-9A-Fa-f]{6}$/.test(''+bg)
                        ? '<rect width="100%" height="100%" fill="#' + bg + '" />\n'
                        : '') +
                    linesvg + svg +
                '</svg>'
            );
        },
    };

    // translate/rotate and return as an SVG coordinate pair
    function transform(x, y) {
        x += gs_dx;
        y += gs_dy;
        const tx = tx0 * x + tx1 * y + tx2 * (gs_width-1) + tx3 * (gs_height-1);
        const ty = ty0 * x + ty1 * y + ty2 * (gs_width-1) + ty3 * (gs_height-1);
        return '' + ((tx|0) == tx ? tx : tx.toFixed(2)) + ' ' +
                    ((ty|0) == ty ? ty : ty.toFixed(2));
    }
}
