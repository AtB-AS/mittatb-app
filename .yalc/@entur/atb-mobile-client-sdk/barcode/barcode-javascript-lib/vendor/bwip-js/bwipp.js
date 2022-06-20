// bwip-js // Barcode Writer in Pure JavaScript
// https://github.com/metafloor/bwip-js
//
// This code was automatically generated from:
// Barcode Writer in Pure PostScript - Version 2021-02-06
//
// Copyright (c) 2011-2021 Mark Warren
// Copyright (c) 2004-2021 Terry Burton
//
// Licensed MIT. See the LICENSE file in the bwip-js root directory.
// bwip-js/barcode-hdr.js
//
// This code is injected above the cross-compiled barcode.js.

// The BWIPJS object (graphics interface)
var $$ = null;
var $j = 0; // stack pointer
var $k = []; // operand stack

// Global state defined at runtime
var $0 = {
    $error: new Map,
};

// Array ctor
//	$a()	: Build a new array up to the Infinity-marker on the stack.
//	$a(arr)	: Convert native array to a "view" of the array.
//	$a(len)	: Create a new array of length `len`
function $a(a) {
    if (!arguments.length) {
        for (var i = $j - 1; i >= 0 && $k[i] !== Infinity; i--);
        if (i < 0) {
            throw new Error('array-marker-not-found');
        }
        a = $k.splice(i + 1, $j - 1 - i);
        $j = i;
    } else if (!(a instanceof Array)) {
        a = new Array(+arguments[0]);
        for (var i = 0, l = a.length; i < l; i++) {
            a[i] = null;
        }
    }
    a.b = a; // base array
    a.o = 0; // offset into base
    return a;
}

// dict ctor
//	$d() : look for the Infinity marker on the stack
function $d() {
    // Build the dictionary in the order the keys/values were pushed so enumeration
    // occurs in the correct sequence.
    for (var mark = $j - 1; mark >= 0 && $k[mark] !== Infinity; mark -= 2) {
        if ($k[mark - 1] === Infinity) {
            throw new Error('dict-malformed-stack');
        }
    }
    if (mark < 0) {
        throw 'dict-marker-not-found';
    }
    var d = new Map;
    for (var i = mark + 1; i < $j; i += 2) {
        // Unlike javascript, postscript dict keys differentiate between
        // numbers and the string representation of a number.
        var k = $k[i]; // "key" into the dict entry
        var t = typeof k;
        if (t == 'number' || t == 'string') {
            d.set(k, $k[i + 1]);
        } else if (k instanceof Uint8Array) {
            d.set($z(k), $k[i + 1]);
        } else {
            throw 'dict-not-a-valid-key(' + k + ')';
        }
    }
    $j = mark;
    return d;
}

// string ctor
//	s(number)	: create zero-filled string of number-length
//	s(string)	: make a copy of the string
//	s(uint8[])	: make a copy of the string
//
// Returns a Uint8Array-string.
function $s(v) {
    var t = typeof v;
    if (t === 'number') {
        return new Uint8Array(v);
    }
    if (t !== 'string') {
        v = '' + v;
    }
    var s = new Uint8Array(v.length);
    for (var i = 0; i < v.length; i++) {
        s[i] = v.charCodeAt(i);
    }
    return s;
}

// Primarily designed to convert uint8-string to string, but will call the
// the toString() method on any value.
function $z(s) {
    if (s instanceof Uint8Array) {
        // Postscript treats nul-char as end of string, even if string is
        // longer.
        for (var i = 0, l = s.length; i < l && s[i]; i++);
        if (i < l) {
            return String.fromCharCode.apply(null, s.subarray(0, i));
        }
        return String.fromCharCode.apply(null, s)
    }
    return '' + s;
}

// Copies source to dest and returns a view of just the copied characters
function $strcpy(dst, src) {
    if (typeof dst === 'string') {
        dst = $s(dst);
    }
    if (src instanceof Uint8Array) {
        for (var i = 0, l = src.length; i < l; i++) {
            dst[i] = src[i];
        }
    } else {
        for (var i = 0, l = src.length; i < l; i++) {
            dst[i] = src.charCodeAt(i);
        }
    }
    return src.length < dst.length ? dst.subarray(0, src.length) : dst;
}

// cvrs operator - convert a number to a radix string
//	s : string to store into
//	n : number
//	r : radix
function $cvrs(s, n, r) {
    return $strcpy(s, (~~n).toString(r).toUpperCase());
}

// get operator
//	s : source
//	k : key
function $get(s, k) {
    if (s instanceof Uint8Array) {
        return s[k];
    }
    if (typeof s === 'string') {
        return s.charCodeAt(k);
    }
    if (s instanceof Array) {
        return s.b[s.o + k];
    }
    if (k instanceof Uint8Array) {
        return s.get($z(k));
    }
    return s.get(k);
}

// put operator
//	d : dest
//	k : key
//	v : value
function $put(d, k, v) {
    if (d instanceof Uint8Array) {
        d[k] = v;
    } else if (d instanceof Array) {
        d.b[d.o + k] = v;
    } else if (typeof d == 'object') {
        if (k instanceof Uint8Array) {
            d.set($z(k), v);
        } else {
            d.set(k, v);
        }
    } else {
        throw 'put-not-writable-' + (typeof d);
    }
}

// getinterval operator
//	s : src
//	o : offset
//	l : length
function $geti(s, o, l) {
    if (s instanceof Uint8Array) {
        return s.subarray(o, o + l);
    }
    if (s instanceof Array) {
        var a = new Array(l);
        a.b = s.b; // base array
        a.o = s.o + o; // offset into base
        return a;
    }
    // Must be a string
    return s.substr(o, l);
}

// putinterval operator
//	d : dst
//	o : offset
//	s : src
function $puti(d, o, s) {
    if (d instanceof Uint8Array) {
        if (typeof s == 'string') {
            for (var i = 0, l = s.length; i < l; i++) {
                d[o + i] = s.charCodeAt(i);
            }
        } else {
            // When both d and s are the same, we want to copy
            // backwards, which works for the general case as well.
            for (var i = s.length - 1; i >= 0; i--) {
                d[o + i] = s[i];
            }
        }
    } else if (d instanceof Array) {
        // Operate on the base arrays
        var darr = d.b;
        var doff = o + d.o;
        var sarr = s.b;
        var soff = s.o;

        for (var i = 0, l = s.length; i < l; i++) {
            darr[doff + i] = sarr[soff + i];
        }
    } else {
        throw 'putinterval-not-writable-' + (typeof d);
    }
}

// type operator
function $type(v) {
    // null can be mis-typed - get it out of the way
    if (v === null || v === undefined) {
        return 'nulltype';
    }
    var t = typeof v;
    if (t == 'number') {
        return v % 1 ? 'realtype' : 'integertype';
    }
    if (t == 'boolean') {
        return 'booleantype';
    }
    if (t == 'string' || v instanceof Uint8Array) {
        return 'stringtype';
    }
    if (t == 'function') {
        return 'operatortype';
    }
    if (v instanceof Array) {
        return 'arraytype';
    }
    return 'dicttype';
    // filetype
    // fonttype
    // gstatetype
    // marktype	(v === Infinity)
    // nametype
    // savetype
}

// search operator
//		string seek search suffix match prefix true %if-found
//						   string false				%if-not-found
function $search(str, seek) {
    if (!(str instanceof Uint8Array)) {
        str = $s(str);
    }
    var ls = str.length;

    // Virtually all uses of search in BWIPP are for single-characters.
    // Optimize for that case.
    if (seek.length == 1) {
        var lk = 1;
        var cd = seek instanceof Uint8Array ? seek[0] : seek.charCodeAt(0);
        for (var i = 0; i < ls && str[i] != cd; i++);
    } else {
        // Slow path, 
        if (!(seek instanceof Uint8Array)) {
            seek = $(seek);
        }
        var lk = seek.length;
        var cd = seek[0];
        for (var i = 0; i < ls && str[i] != cd; i++);
        while (i < ls) {
            for (var j = 1; j < lk && str[i + j] === seek[j]; j++);
            if (j === lk) {
                break;
            }
            for (i++; i < ls && str[i] != cd; i++);
        }
    }
    if (i < ls) {
        $k[$j++] = str.subarray(i + lk);
        $k[$j++] = str.subarray(i, i + lk);
        $k[$j++] = str.subarray(0, i);
        $k[$j++] = true;
    } else {
        $k[$j++] = str;
        $k[$j++] = false;
    }
}

// The callback is omitted when forall is being used just to push onto the
// stack.  The callback normally returns undefined.  A return of true means break.
function $forall(o, cb) {
    if (o instanceof Uint8Array) {
        for (var i = 0, l = o.length; i < l; i++) {
            $k[$j++] = o[i];
            if (cb && cb()) break;
        }
    } else if (o instanceof Array) {
        // The array may be a view.
        for (var a = o.b, i = o.o, l = o.o + o.length; i < l; i++) {
            $k[$j++] = a[i];
            if (cb && cb()) break;
        }
    } else if (typeof o === 'string') {
        for (var i = 0, l = o.length; i < l; i++) {
            $k[$j++] = o.charCodeAt(i);
            if (cb && cb()) break;
        }
    } else if (o instanceof Map) {
        for (var keys = o.keys(), i = 0, l = o.size; i < l; i++) {
            var id = keys.next().value;
            $k[$j++] = id;
            $k[$j++] = o.get(id);
            if (cb && cb()) break;
        }
    } else {
        for (var id in o) {
            $k[$j++] = id;
            $k[$j++] = o[id];
            if (cb && cb()) break;
        }
    }
}

function $cleartomark() {
    while ($j > 0 && $k[--$j] !== Infinity);
}

function $counttomark() {
    for (var i = $j - 1; i >= 0 && $k[i] !== Infinity; i--);
    return $j - i - 1;
}

function $aload(a) {
    for (var i = 0, l = a.length, b = a.b, o = a.o; i < l; i++) {
        $k[$j++] = b[o + i];
    }
    // This push has been optimized out.  See $.aload() in psc.js.
    //$k[$j++] = a;
}

function $astore(a) {
    for (var i = 0, l = a.length, b = a.b, o = a.o + l - 1; i < l; i++) {
        b[o - i] = $k[--$j];
    }
    $k[$j++] = a;
}

function $eq(a, b) {
    if (typeof a === 'string' && typeof b === 'string') {
        return a == b;
    }
    if (a instanceof Uint8Array && b instanceof Uint8Array) {
        if (a.length != b.length) {
            return false;
        }
        for (var i = 0, l = a.length; i < l; i++) {
            if (a[i] != b[i]) {
                return false;
            }
        }
        return true;
    }
    if (a instanceof Uint8Array && typeof b === 'string' ||
        b instanceof Uint8Array && typeof a === 'string') {
        if (a instanceof Uint8Array) {
            a = $z(a);
        } else {
            b = $z(b);
        }
        return a == b;
    }
    return a == b;
}

function $ne(a, b) {
    return !$eq(a, b);
}

function $lt(a, b) {
    if (a instanceof Uint8Array) {
        a = $z(a);
    }
    if (b instanceof Uint8Array) {
        b = $z(b);
    }
    return a < b;
}

function $gt(a, b) {
    if (a instanceof Uint8Array) {
        a = $z(a);
    }
    if (b instanceof Uint8Array) {
        b = $z(b);
    }
    return a > b;
}

function $ge(a, b) {
    if (a instanceof Uint8Array) {
        a = $z(a);
    }
    if (b instanceof Uint8Array) {
        b = $z(b);
    }
    return a >= b;
}

function $an(a, b) { // and
    return (typeof a === 'boolean') ? a && b : a & b;
}

function $or(a, b) { // or
    return (typeof a === 'boolean') ? a || b : a | b;
}

function $xo(a, b) { // xor
    return (typeof a === 'boolean') ? !a && b || a && !b : a ^ b;
}

function $nt(a) {
    return typeof a == 'boolean' ? !a : ~a;
}
// emulate single-precision floating-point (pseudo-polyfill for Math.fround)
var $f = (function(fa) {
    return function(v) {
        return Number.isInteger(v) ? v : (fa[0] = v, fa[0]);
    };
})(new Float32Array(1));

function bwipp_raiseerror() {
    $put($0.$error, 'errorinfo', $k[--$j]); //#55
    $put($0.$error, 'errorname', $k[--$j]); //#56
    $put($0.$error, 'command', null); //#57
    $put($0.$error, 'newerror', true); //#58
    throw new Error($z($0.$error.get("errorname")) + ": " + $z($0.$error.get("errorinfo"))); //#59
}

function bwipp_parseinput() {
    var $1 = {}; //#80
    $1.fncvals = $k[--$j]; //#82
    $1.barcode = $k[--$j]; //#83
    var _2 = 'parse'; //#85
    $1[_2] = $get($1.fncvals, _2); //#85
    delete $1.fncvals[_2]; //#85
    var _6 = 'parsefnc'; //#86
    $1[_6] = $get($1.fncvals, _6); //#86
    delete $1.fncvals[_6]; //#86
    var _A = 'parseonly'; //#87
    var _C = $get($1.fncvals, _A) !== undefined; //#87
    $1[_A] = _C; //#87
    delete $1.fncvals[_A]; //#87
    var _E = 'eci'; //#88
    var _G = $get($1.fncvals, _E) !== undefined; //#88
    $1[_E] = _G; //#88
    delete $1.fncvals[_E]; //#88
    $1.msg = $a($1.barcode.length); //#90
    $1.j = 0; //#91
    $k[$j++] = $1.barcode; //#186
    for (;;) { //#186
        $search($k[--$j], "^"); //#93
        var _M = $k[--$j]; //#93
        var _N = $k[--$j]; //#93
        $k[$j++] = _M; //#96
        $k[$j++] = _N.length; //#96
        $k[$j++] = $1.msg; //#96
        $k[$j++] = $1.j; //#96
        $k[$j++] = _N; //#96
        $k[$j++] = Infinity; //#96
        var _Q = $k[--$j]; //#96
        var _R = $k[--$j]; //#96
        $k[$j++] = _Q; //#96
        $forall(_R); //#96
        var _S = $a(); //#96
        var _T = $k[--$j]; //#96
        $puti($k[--$j], _T, _S); //#96
        $1.j = $f($k[--$j] + $1.j); //#97
        if ($k[--$j]) { //#184
            $j--; //#99
            for (var _Y = 0, _Z = 1; _Y < _Z; _Y++) { //#182
                if ($an($nt($1.parse), $nt($1.parsefnc))) { //#106
                    $put($1.msg, $1.j, 94); //#103
                    $1.j = $f($1.j + 1); //#104
                    break; //#105
                } //#105
                $put($1.msg, $1.j, 94); //#109
                $1.j = $f($1.j + 1); //#110
                if ($1.parse) { //#129
                    var _j = $k[--$j]; //#114
                    $k[$j++] = _j; //#128
                    if (_j.length >= 3) { //#128
                        var _k = $k[--$j]; //#115
                        var _l = $geti(_k, 0, 3); //#115
                        $k[$j++] = _k; //#117
                        $k[$j++] = true; //#117
                        for (var _m = 0, _n = _l.length; _m < _n; _m++) { //#117
                            var _o = $get(_l, _m); //#117
                            if ((_o < 48) || (_o > 57)) { //#116
                                $j--; //#116
                                $k[$j++] = false; //#116
                            } //#116
                        } //#116
                        if ($k[--$j]) { //#127
                            var _q = $k[--$j]; //#119
                            var _r = $geti(_q, 0, 3); //#119
                            var _s = ~~$z(_r); //#119
                            $k[$j++] = _q; //#122
                            $k[$j++] = _s; //#122
                            if (_s > 255) { //#122
                                $j -= 2; //#120
                                $k[$j++] = 'bwipp.invalidOrdinal'; //#121
                                $k[$j++] = "Ordinal must be 000 to 255"; //#121
                                bwipp_raiseerror(); //#121
                            } //#121
                            $1.j = $f($1.j - 1); //#123
                            $put($1.msg, $1.j, $k[--$j]); //#124
                            $1.j = $f($1.j + 1); //#125
                            var _y = $k[--$j]; //#126
                            $k[$j++] = $geti(_y, 3, _y.length - 3); //#126
                        } //#126
                    } //#126
                } //#126
                if (($or($1.parseonly, $nt($1.parsefnc))) || ($get($1.msg, $f($1.j - 1)) != 94)) { //#134
                    break; //#134
                } //#134
                $1.j = $f($1.j - 1); //#137
                var _16 = $k[--$j]; //#138
                $k[$j++] = _16; //#141
                if (_16.length < 3) { //#141
                    $j--; //#139
                    $k[$j++] = 'bwipp.truncatedFNC'; //#140
                    $k[$j++] = "Function character truncated"; //#140
                    bwipp_raiseerror(); //#140
                } //#140
                var _17 = $k[--$j]; //#142
                $k[$j++] = _17; //#147
                if ($get(_17, 0) == 94) { //#147
                    $put($1.msg, $1.j, 94); //#143
                    $1.j = $f($1.j + 1); //#144
                    var _1C = $k[--$j]; //#145
                    $k[$j++] = $geti(_1C, 1, _1C.length - 1); //#146
                    break; //#146
                } //#146
                var _1E = $k[--$j]; //#148
                $k[$j++] = _1E; //#165
                if ($eq($geti(_1E, 0, 3), "ECI") && $1.eci) { //#165
                    var _1H = $k[--$j]; //#149
                    $k[$j++] = _1H; //#152
                    if (_1H.length < 9) { //#152
                        $j--; //#150
                        $k[$j++] = 'bwipp.truncatedECI'; //#151
                        $k[$j++] = "ECI truncated"; //#151
                        bwipp_raiseerror(); //#151
                    } //#151
                    var _1I = $k[--$j]; //#153
                    var _1J = $geti(_1I, 3, 6); //#153
                    $k[$j++] = _1I; //#159
                    $k[$j++] = _1J; //#159
                    for (var _1K = 0, _1L = _1J.length; _1K < _1L; _1K++) { //#159
                        var _1M = $get(_1J, _1K); //#159
                        if ((_1M < 48) || (_1M > 57)) { //#158
                            $j -= 2; //#156
                            $k[$j++] = 'bwipp.invalidECI'; //#157
                            $k[$j++] = "ECI must be 000000 to 999999"; //#157
                            bwipp_raiseerror(); //#157
                        } //#157
                    } //#157
                    var _1N = $k[--$j]; //#160
                    $k[$j++] = 0; //#160
                    $forall(_1N, function() { //#160
                        var _1O = $k[--$j]; //#160
                        var _1P = $k[--$j]; //#160
                        $k[$j++] = ($f(_1P - $f(_1O - 48))) * 10; //#160
                    }); //#160
                    $put($1.msg, $1.j, (~~($k[--$j] / 10)) - 1000000); //#161
                    $1.j = $f($1.j + 1); //#162
                    var _1U = $k[--$j]; //#163
                    $k[$j++] = $geti(_1U, 9, _1U.length - 9); //#164
                    break; //#164
                } //#164
                var _1W = $k[--$j]; //#166
                $k[$j++] = _1W; //#169
                if (_1W.length < 4) { //#169
                    $j--; //#167
                    $k[$j++] = 'bwipp.truncatedFNC'; //#168
                    $k[$j++] = "Function character truncated"; //#168
                    bwipp_raiseerror(); //#168
                } //#168
                var _1X = $k[--$j]; //#170
                var _1Y = $geti(_1X, 0, 4); //#170
                var _1a = $get($1.fncvals, _1Y) !== undefined; //#170
                $k[$j++] = _1X; //#175
                $k[$j++] = _1Y; //#175
                if (!_1a) { //#175
                    var _1b = $k[--$j]; //#171
                    var _1c = $s(_1b.length + 28); //#171
                    $puti(_1c, 28, _1b); //#171
                    $puti(_1c, 0, "Unknown function character: "); //#172
                    var _1d = $k[--$j]; //#173
                    $k[$j++] = _1c; //#173
                    $k[$j++] = _1d; //#173
                    $j--; //#173
                    var _1e = $k[--$j]; //#174
                    $k[$j++] = 'bwipp.unknownFNC'; //#174
                    $k[$j++] = _1e; //#174
                    bwipp_raiseerror(); //#174
                } //#174
                $put($1.msg, $1.j, $get($1.fncvals, $k[--$j])); //#177
                $1.j = $f($1.j + 1); //#178
                var _1l = $k[--$j]; //#179
                $k[$j++] = $geti(_1l, 4, _1l.length - 4); //#180
                break; //#180
            } //#180
        } else { //#184
            break; //#184
        } //#184
    } //#184
    if ($nt($1.parseonly)) { //#192
        $k[$j++] = $geti($1.msg, 0, $1.j); //#189
    } else { //#192
        $k[$j++] = $s($1.j); //#192
        for (var _1v = 0, _1u = $f($1.j - 1); _1v <= _1u; _1v += 1) { //#192
            var _1w = $k[--$j]; //#192
            $put(_1w, _1v, $get($1.msg, _1v)); //#192
            $k[$j++] = _1w; //#192
        } //#192
    } //#192
}

function bwipp_renmatrix() {
    if ($0.bwipjs_dontdraw) { //#2145
        return; //#2145
    } //#2145
    var $1 = {}; //#2147
    $1.args = $k[--$j]; //#2149
    $1.width = 1; //#2152
    $1.height = 1; //#2153
    $1.barcolor = "unset"; //#2154
    $1.backgroundcolor = "unset"; //#2155
    $1.colormap = "unset"; //#2156
    $1.dotty = false; //#2157
    $1.inkspread = 0; //#2158
    $1.inkspreadh = 0; //#2159
    $1.inkspreadv = 0; //#2160
    $1.includetext = false; //#2161
    $1.txt = $a([]); //#2162
    $1.textcolor = "unset"; //#2163
    $1.textxalign = "unset"; //#2164
    $1.textyalign = "unset"; //#2165
    $1.textfont = "OCR-B"; //#2166
    $1.textsize = 10; //#2167
    $1.textxoffset = 0; //#2168
    $1.textyoffset = 0; //#2169
    $1.textgaps = 0; //#2170
    $1.alttext = ""; //#2171
    $forall($1.args, function() { //#2174
        var _4 = $k[--$j]; //#2174
        $1[$k[--$j]] = _4; //#2174
    }); //#2174
    var _6 = $1.opt; //#2175
    for (var _B = _6.size, _A = _6.keys(), _9 = 0; _9 < _B; _9++) { //#2175
        var _7 = _A.next().value; //#2175
        $1[_7] = _6.get(_7); //#2175
    } //#2175
    $1.width = +$1.width; //#2177
    $1.height = +$1.height; //#2178
    $1.barcolor = "" + $1.barcolor; //#2179
    $1.backgroundcolor = "" + $1.backgroundcolor; //#2180
    $1.inkspread = +$1.inkspread; //#2181
    $1.inkspreadh = +$1.inkspreadh; //#2182
    $1.inkspreadv = +$1.inkspreadv; //#2183
    $1.textcolor = "" + $1.textcolor; //#2184
    $1.textxalign = "" + $1.textxalign; //#2185
    $1.textyalign = "" + $1.textyalign; //#2186
    $1.textfont = "" + $1.textfont; //#2187
    $1.textsize = +$1.textsize; //#2188
    $1.textxoffset = +$1.textxoffset; //#2189
    $1.textyoffset = +$1.textyoffset; //#2190
    $1.textgaps = +$1.textgaps; //#2191
    $1.alttext = "" + $1.alttext; //#2192
    if ($1.inkspread != 0) { //#2194
        $1.inkspreadh = $1.inkspread; //#2194
    } //#2194
    if ($1.inkspread != 0) { //#2195
        $1.inkspreadv = $1.inkspread; //#2195
    } //#2195
    $1.xyget = function() {
        var _X = $k[--$j]; //#2197
        var _a = $get($1.pixs, $f($k[--$j] + (_X * $1.pixx))); //#2197
        $k[$j++] = _a; //#2197
    }; //#2197
    $1.cget = function() {
        var _c = $k[--$j]; //#2198
        var _f = $get($1.cache, $f($k[--$j] + (_c * $1.pixx))); //#2198
        var _g = $k[--$j]; //#2198
        $k[$j++] = $an(_g, _f); //#2198
    }; //#2198
    $1.cput = function() {
        var _h = $k[--$j]; //#2200
        $k[$j++] = _h; //#2204
        if ((_h % 4) == 0) { //#2203
            var _i = $k[--$j]; //#2201
            var _j = $k[--$j]; //#2201
            var _k = $k[--$j]; //#2201
            var _l = $1.pixx; //#2201
            var _m = $1.cache; //#2201
            $put(_m, $f(_k + (_j * _l)), $or($get(_m, $f(_k + (_j * _l))), _i)); //#2201
        } else { //#2203
            $j -= 3; //#2203
        } //#2203
    }; //#2205
    $1.abcd = function() {
        $k[$j++] = $s(4); //#2212
        $k[$j++] = 0; //#2212
        $k[$j++] = Infinity; //#2212
        var _p = $k[--$j]; //#2209
        var _q = $k[--$j]; //#2209
        var _r = $k[--$j]; //#2209
        var _s = $k[--$j]; //#2209
        var _v = $f($k[--$j] + (_s * $1.pixx)); //#2210
        $k[$j++] = _r; //#2211
        $k[$j++] = _q; //#2211
        $k[$j++] = _p; //#2211
        $k[$j++] = _v; //#2211
        $aload($geti($1.pixs, _v, 2)); //#2211
        var _y = $k[--$j]; //#2211
        var _z = $k[--$j]; //#2211
        var _13 = $geti($1.pixs, $f($k[--$j] + $1.pixx), 2); //#2212
        $k[$j++] = _z; //#2212
        $k[$j++] = _y; //#2212
        $aload(_13); //#2212
        var _14 = $a(); //#2212
        for (var _15 = 0, _16 = _14.length; _15 < _16; _15++) { //#2213
            var _18 = $k[--$j]; //#2213
            var _19 = $k[--$j]; //#2213
            $put(_19, _18, $f($get(_14, _15) + 48)); //#2213
            $k[$j++] = _19; //#2213
            $k[$j++] = $f(_18 + 1); //#2213
        } //#2213
        $j--; //#2213
    }; //#2214
    $1.right = function() {
        if ($1.dir != 1) { //#2216
            $k[$j++] = $1.x; //#2216
            $k[$j++] = $1.y; //#2216
            $k[$j++] = $1.dir; //#2216
            $1.cput(); //#2216
            $k[$j++] = $a([$1.x, $1.y]); //#2216
        } //#2216
        $1.x = $1.x + 1; //#2216
        $1.dir = 1; //#2216
    }; //#2216
    $1.down = function() {
        if ($1.dir != 2) { //#2217
            $k[$j++] = $1.x; //#2217
            $k[$j++] = $1.y; //#2217
            $k[$j++] = $1.dir; //#2217
            $1.cput(); //#2217
            $k[$j++] = $a([$1.x, $1.y]); //#2217
        } //#2217
        $1.y = $1.y + 1; //#2217
        $1.dir = 2; //#2217
    }; //#2217
    $1.left = function() {
        if ($1.dir != 4) { //#2218
            $k[$j++] = $1.x; //#2218
            $k[$j++] = $1.y; //#2218
            $k[$j++] = $1.dir; //#2218
            $1.cput(); //#2218
            $k[$j++] = $a([$1.x, $1.y]); //#2218
        } //#2218
        $1.x = $1.x - 1; //#2218
        $1.dir = 4; //#2218
    }; //#2218
    $1.up = function() {
        if ($1.dir != 8) { //#2219
            $k[$j++] = $1.x; //#2219
            $k[$j++] = $1.y; //#2219
            $k[$j++] = $1.dir; //#2219
            $1.cput(); //#2219
            $k[$j++] = $a([$1.x, $1.y]); //#2219
        } //#2219
        $1.y = $1.y - 1; //#2219
        $1.dir = 8; //#2219
    }; //#2219
    $1.trace = function() {
        $1.y = $k[--$j]; //#2223
        $1.x = $k[--$j]; //#2223
        $k[$j++] = 'dir'; //#2225
        $k[$j++] = $f($1.x + 1); //#2225
        $k[$j++] = $f($1.y + 1); //#2225
        $1.xyget(); //#2225
        var _1l = ($k[--$j] == 1) ? 8 : 4; //#2225
        $1[$k[--$j]] = _1l; //#2225
        $1.sx = $1.x; //#2226
        $1.sy = $1.y; //#2226
        $1.sdir = $1.dir; //#2226
        $k[$j++] = Infinity; //#2230
        for (;;) { //#2244
            $k[$j++] = $1.x; //#2231
            $k[$j++] = $1.y; //#2231
            $1.abcd(); //#2231
            for (var _1s = 0, _1t = 1; _1s < _1t; _1s++) { //#2242
                var _1u = $k[--$j]; //#2233
                $k[$j++] = _1u; //#2233
                if ($eq(_1u, "0001") || ($eq(_1u, "0011") || $eq(_1u, "1011"))) { //#2233
                    $j--; //#2233
                    $1.right(); //#2233
                    break; //#2233
                } //#2233
                var _1v = $k[--$j]; //#2234
                $k[$j++] = _1v; //#2234
                if ($eq(_1v, "0010") || ($eq(_1v, "1010") || $eq(_1v, "1110"))) { //#2234
                    $j--; //#2234
                    $1.down(); //#2234
                    break; //#2234
                } //#2234
                var _1w = $k[--$j]; //#2235
                $k[$j++] = _1w; //#2235
                if ($eq(_1w, "1000") || ($eq(_1w, "1100") || $eq(_1w, "1101"))) { //#2235
                    $j--; //#2235
                    $1.left(); //#2235
                    break; //#2235
                } //#2235
                var _1x = $k[--$j]; //#2236
                $k[$j++] = _1x; //#2236
                if ($eq(_1x, "0100") || ($eq(_1x, "0101") || $eq(_1x, "0111"))) { //#2236
                    $j--; //#2236
                    $1.up(); //#2236
                    break; //#2236
                } //#2236
                var _1y = $k[--$j]; //#2237
                $k[$j++] = _1y; //#2241
                if ($eq(_1y, "1001")) { //#2240
                    if ($1.dir == 2) { //#2238
                        $j--; //#2238
                        $1.left(); //#2238
                        break; //#2238
                    } else { //#2238
                        $j--; //#2238
                        $1.right(); //#2238
                        break; //#2238
                    } //#2238
                } else { //#2240
                    if ($1.dir == 1) { //#2240
                        $j--; //#2240
                        $1.down(); //#2240
                        break; //#2240
                    } else { //#2240
                        $j--; //#2240
                        $1.up(); //#2240
                        break; //#2240
                    } //#2240
                } //#2240
            } //#2240
            if (($eq($1.x, $1.sx) && $eq($1.y, $1.sy)) && ($1.dir == $1.sdir)) { //#2243
                break; //#2243
            } //#2243
        } //#2243
        $astore($a($counttomark())); //#2245
        var _29 = $k[--$j]; //#2245
        var _2A = $k[--$j]; //#2245
        $k[$j++] = _29; //#2245
        $k[$j++] = _2A; //#2245
        $j--; //#2245
    }; //#2247
    $1.drawlayer = function() {
        $1.pixsorig = $1.pixs; //#2263
        $1.pixs = $k[--$j]; //#2264
        $k[$j++] = Infinity; //#2274
        for (var _2E = 0, _2F = $1.pixx + 2; _2E < _2F; _2E++) { //#2268
            $k[$j++] = 0; //#2268
        } //#2268
        for (var _2J = 0, _2K = $1.pixx, _2I = $1.pixs.length - 1; _2K < 0 ? _2J >= _2I : _2J <= _2I; _2J += _2K) { //#2273
            $k[$j++] = 0; //#2271
            $aload($geti($1.pixs, _2J, $1.pixx)); //#2271
            $k[$j++] = 0; //#2272
        } //#2272
        for (var _2P = 0, _2Q = $1.pixx + 2; _2P < _2Q; _2P++) { //#2274
            $k[$j++] = 0; //#2274
        } //#2274
        $1.pixs = $a(); //#2274
        $1.pixx = $1.pixx + 2; //#2276
        $1.pixy = $1.pixy + 2; //#2277
        $k[$j++] = Infinity; //#2280
        for (var _2V = 0, _2W = $1.pixs.length; _2V < _2W; _2V++) { //#2280
            $k[$j++] = 0; //#2280
        } //#2280
        $1.cache = $a(); //#2280
        $k[$j++] = Infinity; //#2296
        for (var _2a = 0, _2Z = $1.pixy - 2; _2a <= _2Z; _2a += 1) { //#2300
            $1.j = _2a; //#2285
            for (var _2d = 0, _2c = $1.pixx - 2; _2d <= _2c; _2d += 1) { //#2299
                $1.i = _2d; //#2287
                $k[$j++] = 'k'; //#2288
                $k[$j++] = $1.i; //#2288
                $k[$j++] = $1.j; //#2288
                $1.abcd(); //#2288
                var _2g = $k[--$j]; //#2288
                $1[$k[--$j]] = _2g; //#2288
                if ($eq($1.k, "0001") || $eq($1.k, "1001")) { //#2293
                    $k[$j++] = 8; //#2290
                    $k[$j++] = $1.i; //#2290
                    $k[$j++] = $1.j; //#2290
                    $1.cget(); //#2290
                    if ($k[--$j] == 0) { //#2292
                        $k[$j++] = $1.i; //#2291
                        $k[$j++] = $1.j; //#2291
                        $1.trace(); //#2291
                    } //#2291
                } //#2291
                if ($eq($1.k, "1110")) { //#2298
                    $k[$j++] = 4; //#2295
                    $k[$j++] = $1.i; //#2295
                    $k[$j++] = $1.j; //#2295
                    $1.cget(); //#2295
                    if ($k[--$j] == 0) { //#2297
                        $k[$j++] = $1.i; //#2296
                        $k[$j++] = $1.j; //#2296
                        $1.trace(); //#2296
                    } //#2296
                } //#2296
            } //#2296
        } //#2296
        $1.paths = $a(); //#2296
        $1.pixx = $1.pixx - 2; //#2304
        $1.pixy = $1.pixy - 2; //#2305
        $$.newpath(); //#2308
        var _2y = $1.paths; //#2309
        for (var _2z = 0, _30 = _2y.length; _2z < _30; _2z++) { //#2327
            $1.p = $get(_2y, _2z); //#2310
            $1.len = $1.p.length; //#2311
            $aload($get($1.p, $1.len - 1)); //#2312
            $aload($get($1.p, 0)); //#2313
            for (var _3A = 0, _39 = $1.len - 1; _3A <= _39; _3A += 1) { //#2324
                $1.i = _3A; //#2315
                $aload($get($1.p, ($1.i + 1) % $1.len)); //#2316
                var _3F = $k[--$j]; //#2316
                var _3G = $k[--$j]; //#2316
                var _3H = $k[--$j]; //#2316
                var _3I = $k[--$j]; //#2316
                var _3J = $k[--$j]; //#2316
                var _3K = $k[--$j]; //#2316
                $k[$j++] = _3I; //#2318
                $k[$j++] = _3H; //#2318
                $k[$j++] = _3G; //#2318
                $k[$j++] = _3F; //#2318
                $k[$j++] = _3K; //#2318
                $k[$j++] = _3I; //#2318
                $k[$j++] = $1.inkspreadh; //#2318
                if ($lt(_3F, _3J)) { //#2318
                    var _3M = $k[--$j]; //#2318
                    var _3N = $k[--$j]; //#2318
                    $k[$j++] = $f(_3N + _3M); //#2318
                } else { //#2318
                    var _3O = $k[--$j]; //#2318
                    var _3P = $k[--$j]; //#2318
                    $k[$j++] = $f(_3P - _3O); //#2318
                } //#2318
                var _3Q = $k[--$j]; //#2319
                var _3R = $k[--$j]; //#2319
                var _3S = $k[--$j]; //#2319
                var _3T = $k[--$j]; //#2319
                var _3U = $k[--$j]; //#2320
                $k[$j++] = _3U; //#2321
                $k[$j++] = _3Q; //#2321
                $k[$j++] = _3T; //#2321
                $k[$j++] = _3S; //#2321
                $k[$j++] = _3U; //#2321
                $k[$j++] = $1.inkspreadv; //#2321
                if ($gt(_3T, _3R)) { //#2321
                    var _3W = $k[--$j]; //#2321
                    var _3X = $k[--$j]; //#2321
                    $k[$j++] = $f(_3X + _3W); //#2321
                } else { //#2321
                    var _3Y = $k[--$j]; //#2321
                    var _3Z = $k[--$j]; //#2321
                    $k[$j++] = $f(_3Z - _3Y); //#2321
                } //#2321
                var _3a = $k[--$j]; //#2322
                var _3b = $k[--$j]; //#2322
                var _3c = $k[--$j]; //#2322
                var _3d = $k[--$j]; //#2322
                $k[$j++] = _3c; //#2323
                $k[$j++] = _3b; //#2323
                $k[$j++] = _3d; //#2323
                $k[$j++] = $f($1.pixy - _3a); //#2323
                if ($1.i == 0) { //#2323
                    var _3g = $k[--$j]; //#2323
                    $$.moveto($k[--$j], _3g); //#2323
                } else { //#2323
                    var _3i = $k[--$j]; //#2323
                    $$.lineto($k[--$j], _3i); //#2323
                } //#2323
            } //#2323
            $$.closepath(); //#2325
            $j -= 4; //#2326
        } //#2326
        $$.fill(); //#2328
        $1.pixs = $1.pixsorig; //#2330
    }; //#2332
    $1.drawlayerdots = function() {
        $1.pixsorig = $1.pixs; //#2336
        $1.pixs = $k[--$j]; //#2337
        $$.newpath(); //#2339
        for (var _3p = 0, _3o = $1.pixs.length - 1; _3p <= _3o; _3p += 1) { //#2347
            $1.x = _3p % $1.pixx; //#2341
            $1.y = ~~(_3p / $1.pixx); //#2342
            $k[$j++] = $1.x; //#2343
            $k[$j++] = $1.y; //#2343
            $1.xyget(); //#2343
            if ($k[--$j] == 1) { //#2346
                $$.moveto($f($1.x + 0.5), $f(($1.pixy - $1.y) - 0.5)); //#2344
                $$.arc($f($1.x + 0.5), $f(($1.pixy - $1.y) - 0.5), $f(0.5 - $1.inkspread), 0, 360, 1); //#2345
            } //#2345
        } //#2345
        $$.fill(); //#2348
        $1.pixs = $1.pixsorig; //#2350
    }; //#2352
    $$.save(); //#2354
    $1.inkspread = $1.inkspread / 2; //#2357
    $1.inkspreadh = $1.inkspreadh / 2; //#2358
    $1.inkspreadv = $1.inkspreadv / 2; //#2359
    var _46 = $$.currpos(); //#2360
    $$.translate(_46.x, _46.y); //#2360
    $$.scale(($1.width / $1.pixx) * 72, ($1.height / $1.pixy) * 72); //#2361
    $$.moveto(0, 0); //#2362
    $$.lineto($1.pixx, 0); //#2362
    $$.lineto($1.pixx, $1.pixy); //#2362
    $$.lineto(0, $1.pixy); //#2362
    $$.closepath(); //#2362
    if ($eq($1.colormap, "unset")) { //#2367
        var _4H = new Map([
            [1, $1.barcolor]
        ]); //#2366
        $1.colormap = _4H; //#2366
    } //#2366
    var _4I = $1.colormap; //#2369
    for (var _4N = _4I.size, _4M = _4I.keys(), _4L = 0; _4L < _4N; _4L++) { //#2375
        var _4J = _4M.next().value; //#2375
        $$.setcolor(_4I.get(_4J)); //#2370
        $1.key = _4J; //#2371
        $k[$j++] = Infinity; //#2373
        var _4O = $1.pixs; //#2373
        for (var _4P = 0, _4Q = _4O.length; _4P < _4Q; _4P++) { //#2373
            var _4T = $eq($get(_4O, _4P), $1.key) ? 1 : 0; //#2373
            $k[$j++] = _4T; //#2373
        } //#2373
        var _4U = $a(); //#2373
        $k[$j++] = _4U; //#2374
        if ($1.dotty) { //#2374
            $1.drawlayerdots(); //#2374
        } else { //#2374
            $1.drawlayer(); //#2374
        } //#2374
    } //#2374
    if ($ne($1.textcolor, "unset")) { //#2378
        $$.setcolor($1.textcolor); //#2378
    } //#2378
    if ($1.includetext) { //#2435
        if (($eq($1.textxalign, "unset") && $eq($1.textyalign, "unset")) && $eq($1.alttext, "")) { //#2433
            $1.s = 0; //#2381
            $1.fn = ""; //#2381
            var _4c = $1.txt; //#2382
            for (var _4d = 0, _4e = _4c.length; _4d < _4e; _4d++) { //#2391
                $forall($get(_4c, _4d)); //#2383
                var _4g = $k[--$j]; //#2384
                var _4h = $k[--$j]; //#2384
                $k[$j++] = _4h; //#2389
                $k[$j++] = _4g; //#2389
                if ((_4g != $1.s) || $ne(_4h, $1.fn)) { //#2388
                    var _4k = $k[--$j]; //#2385
                    var _4l = $k[--$j]; //#2385
                    $1.s = _4k; //#2385
                    $1.fn = _4l; //#2385
                    $$.selectfont(_4l, _4k); //#2386
                } else { //#2388
                    $j -= 2; //#2388
                } //#2388
                var _4m = $k[--$j]; //#2390
                $$.moveto($k[--$j], _4m); //#2390
                $$.show($k[--$j], 0, 0); //#2390
            } //#2390
        } else { //#2433
            $$.selectfont($1.textfont, $1.textsize); //#2393
            if ($eq($1.alttext, "")) { //#2399
                $k[$j++] = Infinity; //#2395
                var _4s = $1.txt; //#2395
                for (var _4t = 0, _4u = _4s.length; _4t < _4u; _4t++) { //#2395
                    $forall($get($get(_4s, _4t), 0)); //#2395
                } //#2395
                $1.txt = $a(); //#2395
                $1.tstr = $s($1.txt.length); //#2396
                for (var _52 = 0, _51 = $1.txt.length - 1; _52 <= _51; _52 += 1) { //#2397
                    $put($1.tstr, _52, $get($1.txt, _52)); //#2397
                } //#2397
            } else { //#2399
                $1.tstr = $1.alttext; //#2399
            } //#2399
            if ($1.tstr.length == 0) { //#2409
                $k[$j++] = 0; //#2404
            } else { //#2409
                $$.save(); //#2406
                $$.newpath(); //#2407
                $$.moveto(0, 0); //#2407
                $$.charpath("0", false); //#2407
                var _58 = $$.pathbbox(); //#2407
                $$.restore(); //#2409
                $k[$j++] = _58.ury; //#2409
            } //#2409
            $1.textascent = $k[--$j]; //#2418
            var _5B = $$.stringwidth($1.tstr); //#2419
            $1.textwidth = $f(_5B.w + (($1.tstr.length - 1) * $1.textgaps)); //#2419
            $1.textxpos = $f($1.textxoffset + ($f($1.x - $1.textwidth) / 2)); //#2421
            if ($eq($1.textxalign, "left")) { //#2422
                $1.textxpos = $1.textxoffset; //#2422
            } //#2422
            if ($eq($1.textxalign, "right")) { //#2423
                $1.textxpos = $f($f($1.x - $1.textxoffset) - $1.textwidth); //#2423
            } //#2423
            if ($eq($1.textxalign, "offleft")) { //#2424
                $1.textxpos = -$f($1.textwidth + $1.textxoffset); //#2424
            } //#2424
            if ($eq($1.textxalign, "offright")) { //#2425
                $1.textxpos = $f($1.x + $1.textxoffset); //#2425
            } //#2425
            if ($eq($1.textxalign, "justify") && ($1.textwidth < $1.x)) { //#2429
                $1.textxpos = 0; //#2427
                $1.textgaps = $f($1.x - $1.textwidth) / ($1.tstr.length - 1); //#2428
            } //#2428
            $1.textypos = -($f($f($1.textyoffset + $1.textascent) + 1)); //#2430
            if ($eq($1.textyalign, "above")) { //#2431
                $1.textypos = $f($f($1.textyoffset + $1.pixy) + 1); //#2431
            } //#2431
            if ($eq($1.textyalign, "center")) { //#2432
                $1.textypos = $f($1.textyoffset + ($f($1.pixy - $1.textascent) / 2)); //#2432
            } //#2432
            $$.moveto($1.textxpos, $1.textypos); //#2433
            $$.show($1.tstr, $1.textgaps, 0); //#2433
        } //#2433
    } //#2433
    $$.restore(); //#2437
}

export function bwipp_pharmacode2() {
}

function bwipp_qrcode() {
    var $1 = {}; //#18235
    $1.options = $k[--$j]; //#18237
    $1.barcode = $k[--$j]; //#18238
    $1.dontdraw = false; //#18240
    $1.format = "unset"; //#18241
    $1.version = "unset"; //#18242
    $1.eclevel = "unset"; //#18243
    $1.parse = false; //#18244
    $1.parsefnc = false; //#18245
    $1.mask = -1; //#18246
    $forall($1.options, function() { //#18257
        var _3 = $k[--$j]; //#18257
        $1[$k[--$j]] = _3; //#18257
    }); //#18257
    $1.mask = ~~$1.mask; //#18259
    if ($ne($1.version, "unset")) { //#18270
        if ($eq($1.format, "unset")) { //#18268
            $k[$j++] = "full"; //#18265
            if ($eq($geti($1.version, 0, 1), "M")) { //#18265
                $j--; //#18265
                $k[$j++] = "micro"; //#18265
            } //#18265
            if ($eq($geti($1.version, 0, 1), "R")) { //#18266
                $j--; //#18266
                $k[$j++] = "rmqr"; //#18266
            } //#18266
            $1.format = $k[--$j]; //#18267
        } //#18267
    } else { //#18270
        if ($eq($1.format, "unset")) { //#18270
            $1.format = "full"; //#18270
        } //#18270
    } //#18270
    if ($eq($1.eclevel, "unset")) { //#18274
        $k[$j++] = 'eclevel'; //#18274
        if ($ne($1.format, "micro")) { //#18274
            $k[$j++] = "M"; //#18274
        } else { //#18274
            $k[$j++] = "L"; //#18274
        } //#18274
        var _G = $k[--$j]; //#18274
        $1[$k[--$j]] = _G; //#18274
    } //#18274
    $1.fn1 = -1; //#18277
    var _L = new Map([
        ["parse", $1.parse],
        ["parsefnc", $1.parsefnc],
        ["eci", true],
        ["FNC1", $1.fn1]
    ]); //#18282
    $1.fncvals = _L; //#18283
    $k[$j++] = 'msg'; //#18284
    $k[$j++] = $1.barcode; //#18284
    $k[$j++] = $1.fncvals; //#18284
    bwipp_parseinput(); //#18284
    var _O = $k[--$j]; //#18284
    $1[$k[--$j]] = _O; //#18284
    $1.msglen = $1.msg.length; //#18285
    $1.fnc1first = false; //#18288
    if ($1.msglen > 0) { //#18295
        if ($get($1.msg, 0) == $1.fn1) { //#18294
            $1.fnc1first = true; //#18291
            $k[$j++] = Infinity; //#18292
            var _X = $geti($1.msg, 1, $1.msglen - 1); //#18292
            for (var _Y = 0, _Z = _X.length; _Y < _Z; _Y++) { //#18292
                var _a = $get(_X, _Y); //#18292
                $k[$j++] = _a; //#18292
                if (_a == 37) { //#18292
                    var _b = $k[--$j]; //#18292
                    $k[$j++] = _b; //#18292
                    $k[$j++] = _b; //#18292
                } //#18292
            } //#18292
            $1.msg = $a(); //#18292
            $1.msglen = $1.msg.length; //#18293
        } //#18293
    } //#18293
    var _e = $a(['v1to9', 'v10to26', 'v27to40', 'vM1', 'vM2', 'vM3', 'vM4', 'vR7x43', 'vR7x59', 'vR7x77', 'vR7x99', 'vR7x139', 'vR9x43', 'vR9x59', 'vR9x77', 'vR9x99', 'vR9x139', 'vR11x27', 'vR11x43', 'vR11x59', 'vR11x77', 'vR11x99', 'vR11x139', 'vR13x27', 'vR13x43', 'vR13x59', 'vR13x77', 'vR13x99', 'vR13x139', 'vR15x43', 'vR15x59', 'vR15x77', 'vR15x99', 'vR15x139', 'vR17x43', 'vR17x59', 'vR17x77', 'vR17x99', 'vR17x139']); //#18306
    $k[$j++] = 0; //#18307
    for (var _f = 0, _g = _e.length; _f < _g; _f++) { //#18307
        var _i = $k[--$j]; //#18307
        $1[$get(_e, _f)] = _i; //#18307
        $k[$j++] = $f(_i + 1); //#18307
    } //#18307
    $j--; //#18307
    $1.N = 0; //#18313
    $1.A = 1; //#18313
    $1.B = 2; //#18313
    $1.K = 3; //#18313
    $1.E = 4; //#18313
    $k[$j++] = Infinity; //#18318
    $k[$j++] = Infinity; //#18317
    for (var _j = 48; _j <= 57; _j += 1) { //#18317
        $k[$j++] = _j; //#18317
    } //#18317
    var _k = $a(); //#18317
    for (var _l = 0, _m = _k.length; _l < _m; _l++) { //#18318
        $k[$j++] = $get(_k, _l); //#18318
        $k[$j++] = -1; //#18318
    } //#18318
    $1.Nexcl = $d(); //#18319
    $k[$j++] = Infinity; //#18326
    $k[$j++] = Infinity; //#18325
    $k[$j++] = 32; //#18324
    $k[$j++] = 36; //#18324
    $k[$j++] = 37; //#18324
    $k[$j++] = 42; //#18324
    $k[$j++] = 43; //#18324
    $k[$j++] = 45; //#18324
    $k[$j++] = 46; //#18324
    $k[$j++] = 47; //#18324
    $k[$j++] = 58; //#18324
    for (var _p = 65; _p <= 90; _p += 1) { //#18324
        $k[$j++] = _p; //#18324
    } //#18324
    $k[$j++] = $1.fn1; //#18325
    var _r = $a(); //#18325
    for (var _s = 0, _t = _r.length; _s < _t; _s++) { //#18326
        $k[$j++] = $get(_r, _s); //#18326
        $k[$j++] = -1; //#18326
    } //#18326
    $1.Aexcl = $d(); //#18327
    $k[$j++] = Infinity; //#18336
    $k[$j++] = Infinity; //#18335
    for (var _w = 0; _w <= 31; _w += 1) { //#18331
        $k[$j++] = _w; //#18331
    } //#18331
    $k[$j++] = 33; //#18333
    $k[$j++] = 34; //#18333
    $k[$j++] = 35; //#18333
    $k[$j++] = 38; //#18333
    $k[$j++] = 39; //#18333
    $k[$j++] = 40; //#18333
    $k[$j++] = 41; //#18333
    $k[$j++] = 44; //#18333
    for (var _x = 59; _x <= 64; _x += 1) { //#18333
        $k[$j++] = _x; //#18333
    } //#18333
    for (var _y = 91; _y <= 127; _y += 1) { //#18334
        $k[$j++] = _y; //#18334
    } //#18334
    for (var _z = 160; _z <= 223; _z += 1) { //#18335
        $k[$j++] = _z; //#18335
    } //#18335
    var _10 = $a(); //#18335
    for (var _11 = 0, _12 = _10.length; _11 < _12; _11++) { //#18336
        $k[$j++] = $get(_10, _11); //#18336
        $k[$j++] = -1; //#18336
    } //#18336
    $1.Bexcl = $d(); //#18337
    $k[$j++] = Infinity; //#18343
    $k[$j++] = Infinity; //#18342
    for (var _15 = 129; _15 <= 159; _15 += 1) { //#18341
        $k[$j++] = _15; //#18341
    } //#18341
    for (var _16 = 224; _16 <= 235; _16 += 1) { //#18342
        $k[$j++] = _16; //#18342
    } //#18342
    var _17 = $a(); //#18342
    for (var _18 = 0, _19 = _17.length; _18 < _19; _18++) { //#18343
        $k[$j++] = $get(_17, _18); //#18343
        $k[$j++] = -1; //#18343
    } //#18343
    $1.Kexcl = $d(); //#18344
    $k[$j++] = Infinity; //#18356
    $k[$j++] = $a(["0001", "0010", "0100", "1000", "0111"]); //#18357
    $k[$j++] = $a(["0001", "0010", "0100", "1000", "0111"]); //#18357
    $k[$j++] = $a(["0001", "0010", "0100", "1000", "0111"]); //#18357
    $k[$j++] = $a(["", -1, -1, -1, -1]); //#18357
    $k[$j++] = $a(["0", "1", -1, -1, -1]); //#18357
    $k[$j++] = $a(["00", "01", "10", "11", -1]); //#18357
    $k[$j++] = $a(["000", "001", "010", "011", -1]); //#18357
    for (var _1J = 0, _1K = 32; _1J < _1K; _1J++) { //#18357
        $k[$j++] = $a(["001", "010", "011", "100", -1]); //#18356
    } //#18356
    $1.mids = $a(); //#18356
    $1.cclens = $a([$a([10, 9, 8, 8]), $a([12, 11, 16, 10]), $a([14, 13, 16, 12]), $a([3, -1, -1, -1]), $a([4, 3, -1, -1]), $a([5, 4, 4, 3]), $a([6, 5, 5, 4]), $a([4, 3, 3, 2]), $a([5, 5, 4, 3]), $a([6, 5, 5, 4]), $a([7, 6, 5, 5]), $a([7, 6, 6, 5]), $a([5, 5, 4, 3]), $a([6, 5, 5, 4]), $a([7, 6, 5, 5]), $a([7, 6, 6, 5]), $a([8, 7, 6, 6]), $a([4, 4, 3, 2]), $a([6, 5, 5, 4]), $a([7, 6, 5, 5]), $a([7, 6, 6, 5]), $a([8, 7, 6, 6]), $a([8, 7, 7, 6]), $a([5, 5, 4, 3]), $a([6, 6, 5, 5]), $a([7, 6, 6, 5]), $a([8, 7, 6, 6]), $a([8, 7, 7, 6]), $a([8, 8, 7, 7]), $a([7, 6, 6, 5]), $a([7, 7, 6, 5]), $a([8, 7, 7, 6]), $a([8, 7, 7, 6]), $a([9, 8, 7, 7]), $a([7, 6, 6, 5]), $a([8, 7, 6, 6]), $a([8, 7, 7, 6]), $a([8, 8, 7, 6]), $a([9, 8, 8, 7])]); //#18400
    $k[$j++] = Infinity; //#18411
    for (var _21 = 0, _22 = 3; _21 < _22; _21++) { //#18405
        $k[$j++] = 4; //#18404
    } //#18404
    $k[$j++] = 3; //#18412
    $k[$j++] = 5; //#18412
    $k[$j++] = 7; //#18412
    $k[$j++] = 9; //#18412
    for (var _23 = 0, _24 = 32; _23 < _24; _23++) { //#18412
        $k[$j++] = 3; //#18411
    } //#18411
    $1.termlens = $a(); //#18411
    $1.tobin = function() {
        var _27 = $s($k[--$j]); //#18417
        $k[$j++] = _27; //#18417
        for (var _29 = 0, _28 = _27.length - 1; _29 <= _28; _29 += 1) { //#18417
            var _2A = $k[--$j]; //#18417
            $put(_2A, _29, 48); //#18417
            $k[$j++] = _2A; //#18417
        } //#18417
        var _2B = $k[--$j]; //#18418
        var _2E = $cvrs($s(_2B.length), $k[--$j], 2); //#18418
        $puti(_2B, _2B.length - _2E.length, _2E); //#18418
        $k[$j++] = _2B; //#18418
    }; //#18419
    $1.charmap = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ $%*+-./:"; //#18422
    $1.charvals = new Map; //#18423
    for (var _2F = 0; _2F <= 44; _2F += 1) { //#18424
        $put($1.charvals, $get($1.charmap, _2F), _2F); //#18424
    } //#18424
    $1.encA = function() {
        $1.in = $k[--$j]; //#18427
        if ($1.fnc1first) { //#18430
            $k[$j++] = Infinity; //#18429
            $forall($1.in, function() { //#18429
                var _2M = $k[--$j]; //#18429
                $k[$j++] = _2M; //#18429
                if (_2M == $1.fn1) { //#18429
                    $j--; //#18429
                    $k[$j++] = 37; //#18429
                } //#18429
            }); //#18429
            $1.in = $a(); //#18429
        } //#18429
        $1.out = $s((~~(($1.in.length * 11) / 2)) + 1); //#18431
        $1.k = 0; //#18432
        $1.m = 0; //#18432
        for (;;) { //#18443
            if ($1.k == $1.in.length) { //#18433
                break; //#18433
            } //#18433
            if ($1.k < ($1.in.length - 1)) { //#18439
                $k[$j++] = $f(($get($1.charvals, $get($1.in, $1.k)) * 45) + $get($1.charvals, $get($1.in, $1.k + 1))); //#18435
                $k[$j++] = 11; //#18435
                $1.tobin(); //#18435
                $1.k = $1.k + 2; //#18436
            } else { //#18439
                $k[$j++] = $get($1.charvals, $get($1.in, $1.k)); //#18438
                $k[$j++] = 6; //#18438
                $1.tobin(); //#18438
                $1.k = $1.k + 1; //#18439
            } //#18439
            var _2m = $k[--$j]; //#18441
            $puti($1.out, $1.m, _2m); //#18441
            $1.m = _2m.length + $1.m; //#18442
        } //#18442
        $k[$j++] = $geti($1.out, 0, $1.m); //#18444
    }; //#18445
    $1.encN = function() {
        $1.in = $k[--$j]; //#18448
        $1.out = $s((~~(($1.in.length * 10) / 3)) + 1); //#18449
        $1.k = 0; //#18450
        $1.m = 0; //#18450
        for (;;) { //#18466
            if ($1.k == $1.in.length) { //#18451
                break; //#18451
            } //#18451
            if ($1.k < ($1.in.length - 2)) { //#18461
                var _32 = $geti($1.in, $1.k, 3); //#18453
                $k[$j++] = 0; //#18453
                for (var _33 = 0, _34 = _32.length; _33 < _34; _33++) { //#18453
                    var _36 = $k[--$j]; //#18453
                    $k[$j++] = $f($get(_32, _33) + ($f((_36 * 10) - 48))); //#18453
                } //#18453
                $k[$j++] = 10; //#18453
                $1.tobin(); //#18453
                $1.k = $1.k + 3; //#18454
            } else { //#18461
                if ($1.k == ($1.in.length - 2)) { //#18461
                    var _3C = $geti($1.in, $1.k, 2); //#18457
                    $k[$j++] = 0; //#18457
                    for (var _3D = 0, _3E = _3C.length; _3D < _3E; _3D++) { //#18457
                        var _3G = $k[--$j]; //#18457
                        $k[$j++] = $f($get(_3C, _3D) + ($f((_3G * 10) - 48))); //#18457
                    } //#18457
                    $k[$j++] = 7; //#18457
                    $1.tobin(); //#18457
                    $1.k = $1.k + 2; //#18458
                } else { //#18461
                    var _3K = $geti($1.in, $1.k, 1); //#18460
                    $k[$j++] = 0; //#18460
                    for (var _3L = 0, _3M = _3K.length; _3L < _3M; _3L++) { //#18460
                        var _3O = $k[--$j]; //#18460
                        $k[$j++] = $f($get(_3K, _3L) + ($f((_3O * 10) - 48))); //#18460
                    } //#18460
                    $k[$j++] = 4; //#18460
                    $1.tobin(); //#18460
                    $1.k = $1.k + 1; //#18461
                } //#18461
            } //#18461
            var _3Q = $k[--$j]; //#18464
            $puti($1.out, $1.m, _3Q); //#18464
            $1.m = _3Q.length + $1.m; //#18465
        } //#18465
        $k[$j++] = $geti($1.out, 0, $1.m); //#18467
    }; //#18468
    $1.encB = function() {
        $1.in = $k[--$j]; //#18471
        if ($1.fnc1first) { //#18474
            $k[$j++] = Infinity; //#18473
            $forall($1.in, function() { //#18473
                var _3a = $k[--$j]; //#18473
                $k[$j++] = _3a; //#18473
                if (_3a == $1.fn1) { //#18473
                    $j--; //#18473
                    $k[$j++] = 29; //#18473
                } //#18473
            }); //#18473
            $1.in = $a(); //#18473
        } //#18473
        $1.out = $s($1.in.length * 8); //#18475
        for (var _3h = 0, _3g = $1.in.length - 1; _3h <= _3g; _3h += 1) { //#18480
            $1.k = _3h; //#18477
            $k[$j++] = ~~$z($get($1.in, $1.k)); //#18478
            $k[$j++] = 8; //#18478
            $1.tobin(); //#18478
            $puti($1.out, $1.k * 8, $k[--$j]); //#18479
        } //#18479
        $k[$j++] = $1.out; //#18481
    }; //#18482
    $1.encK = function() {
        $1.in = $k[--$j]; //#18485
        $1.out = $s((~~($1.in.length / 2)) * 13); //#18486
        $1.k = 0; //#18487
        $1.m = 0; //#18487
        for (;;) { //#18495
            if ($1.k == $1.in.length) { //#18488
                break; //#18488
            } //#18488
            var _40 = $f(($get($1.in, $1.k) * 256) + $get($1.in, $1.k + 1)); //#18490
            $k[$j++] = _40; //#18490
            if (_40 < 57408) { //#18490
                $k[$j++] = 33088; //#18490
            } else { //#18490
                $k[$j++] = 49472; //#18490
            } //#18490
            var _41 = $k[--$j]; //#18490
            var _43 = $f($k[--$j] - _41); //#18491
            $k[$j++] = $f(((_43 >>> 8) * 192) + (_43 & 255)); //#18492
            $k[$j++] = 13; //#18492
            $1.tobin(); //#18492
            var _44 = $k[--$j]; //#18492
            $puti($1.out, $1.m, _44); //#18492
            $1.m = _44.length + $1.m; //#18493
            $1.k = $1.k + 2; //#18494
        } //#18494
        $k[$j++] = $1.out; //#18496
    }; //#18497
    $1.encE = function() {
        var _4C = $f((-$get($k[--$j], 0)) - 1000000); //#18501
        $k[$j++] = _4C; //#18507
        if (_4C <= 127) { //#18506
            $k[$j++] = 8; //#18502
            $1.tobin(); //#18502
        } else { //#18506
            var _4D = $k[--$j]; //#18503
            $k[$j++] = _4D; //#18507
            if (_4D <= 16383) { //#18506
                var _4E = $k[--$j]; //#18504
                $k[$j++] = $f(_4E + 32768); //#18504
                $k[$j++] = 16; //#18504
                $1.tobin(); //#18504
            } else { //#18506
                var _4F = $k[--$j]; //#18506
                $k[$j++] = $f(_4F + 12582912); //#18506
                $k[$j++] = 24; //#18506
                $1.tobin(); //#18506
            } //#18506
        } //#18506
    }; //#18508
    $1.encfuncs = $a(['encN', 'encA', 'encB', 'encK', 'encE']); //#18510
    $1.addtobits = function() {
        var _4H = $k[--$j]; //#18513
        $puti($1.bits, $1.j, _4H); //#18513
        $1.j = _4H.length + $1.j; //#18514
    }; //#18515
    $k[$j++] = Infinity; //#18517
    for (var _4M = 0, _4N = $1.msglen; _4M < _4N; _4M++) { //#18517
        $k[$j++] = 0; //#18517
    } //#18517
    $k[$j++] = 0; //#18517
    $1.numNs = $a(); //#18517
    $k[$j++] = Infinity; //#18518
    for (var _4Q = 0, _4R = $1.msglen; _4Q < _4R; _4Q++) { //#18518
        $k[$j++] = 0; //#18518
    } //#18518
    $k[$j++] = 0; //#18518
    $1.numAs = $a(); //#18518
    $k[$j++] = Infinity; //#18519
    for (var _4U = 0, _4V = $1.msglen; _4U < _4V; _4U++) { //#18519
        $k[$j++] = 0; //#18519
    } //#18519
    $k[$j++] = 0; //#18519
    $1.numBs = $a(); //#18519
    $k[$j++] = Infinity; //#18520
    for (var _4Y = 0, _4Z = $1.msglen; _4Y < _4Z; _4Y++) { //#18520
        $k[$j++] = 0; //#18520
    } //#18520
    $k[$j++] = -1; //#18520
    $1.numKs = $a(); //#18520
    $k[$j++] = Infinity; //#18521
    for (var _4c = 0, _4d = $1.msglen; _4c < _4d; _4c++) { //#18521
        $k[$j++] = 0; //#18521
    } //#18521
    $k[$j++] = 9999; //#18521
    $1.nextNs = $a(); //#18521
    $k[$j++] = Infinity; //#18522
    for (var _4g = 0, _4h = $1.msglen; _4g < _4h; _4g++) { //#18522
        $k[$j++] = 0; //#18522
    } //#18522
    $k[$j++] = 9999; //#18522
    $1.nextBs = $a(); //#18522
    $k[$j++] = Infinity; //#18523
    for (var _4k = 0, _4l = $1.msglen; _4k < _4l; _4k++) { //#18523
        $k[$j++] = 0; //#18523
    } //#18523
    $k[$j++] = 9999; //#18523
    $1.nextAs = $a(); //#18523
    $k[$j++] = Infinity; //#18524
    for (var _4o = 0, _4p = $1.msglen; _4o < _4p; _4o++) { //#18524
        $k[$j++] = 0; //#18524
    } //#18524
    $k[$j++] = 9999; //#18524
    $1.nextKs = $a(); //#18524
    $1.isECI = $a($1.msglen); //#18525
    for (var _4u = $1.msglen - 1; _4u >= 0; _4u -= 1) { //#18554
        $1.i = _4u; //#18527
        $1.barchar = $get($1.msg, $1.i); //#18528
        var _50 = $get($1.Kexcl, $1.barchar) !== undefined; //#18529
        if (_50) { //#18533
            $put($1.nextKs, $1.i, 0); //#18530
            $put($1.numKs, $1.i, $f($get($1.numKs, $1.i + 1) + 1)); //#18531
        } else { //#18533
            $put($1.nextKs, $1.i, $f($get($1.nextKs, $1.i + 1) + 1)); //#18533
        } //#18533
        var _5F = $get($1.Nexcl, $1.barchar) !== undefined; //#18535
        if (_5F) { //#18539
            $put($1.nextNs, $1.i, 0); //#18536
            $put($1.numNs, $1.i, $f($get($1.numNs, $1.i + 1) + 1)); //#18537
        } else { //#18539
            $put($1.nextNs, $1.i, $f($get($1.nextNs, $1.i + 1) + 1)); //#18539
        } //#18539
        var _5U = $get($1.Bexcl, $1.barchar) !== undefined; //#18541
        if (_5U) { //#18545
            $put($1.nextBs, $1.i, 0); //#18542
            $put($1.numBs, $1.i, $f($get($1.numBs, $1.i + 1) + 1)); //#18543
        } else { //#18545
            $put($1.nextBs, $1.i, $f($get($1.nextBs, $1.i + 1) + 1)); //#18545
        } //#18545
        var _5j = $get($1.Aexcl, $1.barchar) !== undefined; //#18547
        if (_5j) { //#18551
            $put($1.nextAs, $1.i, 0); //#18548
            $put($1.numAs, $1.i, $f($get($1.numAs, $1.i + 1) + 1)); //#18549
        } else { //#18551
            $put($1.nextAs, $1.i, $f($get($1.nextAs, $1.i + 1) + 1)); //#18551
        } //#18551
        $put($1.isECI, $1.i, $1.barchar <= -1000000); //#18553
    } //#18553
    $k[$j++] = Infinity; //#18555
    var _5z = $1.numKs; //#18555
    for (var _60 = 0, _61 = _5z.length; _60 < _61; _60++) { //#18555
        $k[$j++] = ~~($f($get(_5z, _60) + 1) / 2); //#18555
    } //#18555
    $1.numKs = $a(); //#18555
    $1.KbeforeB = function() {
        var _67 = $get($k[--$j], $1.ver); //#18557
        $k[$j++] = $ge($1.numK, _67) && ($get($1.nextBs, $f(($1.numK * 2) + $1.i)) == 0); //#18557
    }; //#18557
    $1.KbeforeA = function() {
        var _6F = $get($k[--$j], $1.ver); //#18558
        $k[$j++] = $ge($1.numK, _6F) && ($get($1.nextAs, $f(($1.numK * 2) + $1.i)) == 0); //#18558
    }; //#18558
    $1.KbeforeN = function() {
        var _6N = $get($k[--$j], $1.ver); //#18559
        $k[$j++] = $ge($1.numK, _6N) && ($get($1.nextNs, $f(($1.numK * 2) + $1.i)) == 0); //#18559
    }; //#18559
    $1.KbeforeE = function() {
        var _6V = $get($k[--$j], $1.ver); //#18560
        $k[$j++] = $ge($1.numK, _6V) && (($f(($1.numK * 2) + $1.i)) == $1.msglen); //#18560
    }; //#18560
    $1.AbeforeK = function() {
        var _6c = $get($k[--$j], $1.ver); //#18561
        $k[$j++] = $ge($1.numA, _6c) && ($get($1.nextKs, $f($1.numA + $1.i)) == 0); //#18561
    }; //#18561
    $1.AbeforeB = function() {
        var _6k = $get($k[--$j], $1.ver); //#18562
        $k[$j++] = $ge($1.numA, _6k) && ($get($1.nextBs, $f($1.numA + $1.i)) == 0); //#18562
    }; //#18562
    $1.AbeforeN = function() {
        var _6s = $get($k[--$j], $1.ver); //#18563
        $k[$j++] = $ge($1.numA, _6s) && ($get($1.nextNs, $f($1.numA + $1.i)) == 0); //#18563
    }; //#18563
    $1.AbeforeE = function() {
        var _70 = $get($k[--$j], $1.ver); //#18564
        $k[$j++] = $ge($1.numA, _70) && ($f($1.numA + $1.i) == $1.msglen); //#18564
    }; //#18564
    $1.NbeforeK = function() {
        var _77 = $get($k[--$j], $1.ver); //#18565
        $k[$j++] = $ge($1.numN, _77) && ($get($1.nextKs, $f($1.numN + $1.i)) == 0); //#18565
    }; //#18565
    $1.NbeforeB = function() {
        var _7F = $get($k[--$j], $1.ver); //#18566
        $k[$j++] = $ge($1.numN, _7F) && ($get($1.nextBs, $f($1.numN + $1.i)) == 0); //#18566
    }; //#18566
    $1.NbeforeA = function() {
        var _7N = $get($k[--$j], $1.ver); //#18567
        $k[$j++] = $ge($1.numN, _7N) && ($get($1.nextAs, $f($1.numN + $1.i)) == 0); //#18567
    }; //#18567
    $1.NbeforeE = function() {
        var _7V = $get($k[--$j], $1.ver); //#18568
        $k[$j++] = $ge($1.numN, _7V) && ($f($1.numN + $1.i) == $1.msglen); //#18568
    }; //#18568
    if ($ne($1.version, "unset")) { //#18599
        $k[$j++] = Infinity; //#18594
        for (var _7a = 0; _7a <= 9; _7a += 1) { //#18581
            $k[$j++] = $cvrs($s(2), _7a, 10); //#18581
            $k[$j++] = $1.v1to9; //#18581
        } //#18581
        for (var _7e = 10; _7e <= 26; _7e += 1) { //#18582
            $k[$j++] = $cvrs($s(2), _7e, 10); //#18582
            $k[$j++] = $1.v10to26; //#18582
        } //#18582
        for (var _7i = 27; _7i <= 40; _7i += 1) { //#18583
            $k[$j++] = $cvrs($s(2), _7i, 10); //#18583
            $k[$j++] = $1.v27to40; //#18583
        } //#18583
        $k[$j++] = "M1"; //#18594
        $k[$j++] = $1.vM1; //#18594
        $k[$j++] = "M2"; //#18594
        $k[$j++] = $1.vM2; //#18594
        $k[$j++] = "M3"; //#18594
        $k[$j++] = $1.vM3; //#18594
        $k[$j++] = "M4"; //#18594
        $k[$j++] = $1.vM4; //#18594
        $k[$j++] = "R7x43"; //#18594
        $k[$j++] = $1.vR7x43; //#18594
        $k[$j++] = "R7x59"; //#18594
        $k[$j++] = $1.vR7x59; //#18594
        $k[$j++] = "R7x77"; //#18594
        $k[$j++] = $1.vR7x77; //#18594
        $k[$j++] = "R7x99"; //#18594
        $k[$j++] = $1.vR7x99; //#18594
        $k[$j++] = "R7x139"; //#18594
        $k[$j++] = $1.vR7x139; //#18594
        $k[$j++] = "R9x43"; //#18594
        $k[$j++] = $1.vR9x43; //#18594
        $k[$j++] = "R9x59"; //#18594
        $k[$j++] = $1.vR9x59; //#18594
        $k[$j++] = "R9x77"; //#18594
        $k[$j++] = $1.vR9x77; //#18594
        $k[$j++] = "R9x99"; //#18594
        $k[$j++] = $1.vR9x99; //#18594
        $k[$j++] = "R9x139"; //#18594
        $k[$j++] = $1.vR9x139; //#18594
        $k[$j++] = "R11x27"; //#18594
        $k[$j++] = $1.vR11x27; //#18594
        $k[$j++] = "R11x43"; //#18594
        $k[$j++] = $1.vR11x43; //#18594
        $k[$j++] = "R11x59"; //#18594
        $k[$j++] = $1.vR11x59; //#18594
        $k[$j++] = "R11x77"; //#18594
        $k[$j++] = $1.vR11x77; //#18594
        $k[$j++] = "R11x99"; //#18594
        $k[$j++] = $1.vR11x99; //#18594
        $k[$j++] = "R11x139"; //#18594
        $k[$j++] = $1.vR11x139; //#18594
        $k[$j++] = "R13x27"; //#18594
        $k[$j++] = $1.vR13x27; //#18594
        $k[$j++] = "R13x43"; //#18594
        $k[$j++] = $1.vR13x43; //#18594
        $k[$j++] = "R13x59"; //#18594
        $k[$j++] = $1.vR13x59; //#18594
        $k[$j++] = "R13x77"; //#18594
        $k[$j++] = $1.vR13x77; //#18594
        $k[$j++] = "R13x99"; //#18594
        $k[$j++] = $1.vR13x99; //#18594
        $k[$j++] = "R13x139"; //#18594
        $k[$j++] = $1.vR13x139; //#18594
        $k[$j++] = "R15x43"; //#18594
        $k[$j++] = $1.vR15x43; //#18594
        $k[$j++] = "R15x59"; //#18594
        $k[$j++] = $1.vR15x59; //#18594
        $k[$j++] = "R15x77"; //#18594
        $k[$j++] = $1.vR15x77; //#18594
        $k[$j++] = "R15x99"; //#18594
        $k[$j++] = $1.vR15x99; //#18594
        $k[$j++] = "R15x139"; //#18594
        $k[$j++] = $1.vR15x139; //#18594
        $k[$j++] = "R17x43"; //#18594
        $k[$j++] = $1.vR17x43; //#18594
        $k[$j++] = "R17x59"; //#18594
        $k[$j++] = $1.vR17x59; //#18594
        $k[$j++] = "R17x77"; //#18594
        $k[$j++] = $1.vR17x77; //#18594
        $k[$j++] = "R17x99"; //#18594
        $k[$j++] = $1.vR17x99; //#18594
        $k[$j++] = "R17x139"; //#18594
        $k[$j++] = $1.vR17x139; //#18594
        var _8O = $get($d(), $1.version); //#18595
        $k[$j++] = 'verset'; //#18595
        $k[$j++] = _8O; //#18595
        $k[$j++] = Infinity; //#18595
        var _8P = $k[--$j]; //#18595
        var _8Q = $k[--$j]; //#18595
        $k[$j++] = _8P; //#18595
        $k[$j++] = _8Q; //#18595
        var _8R = $a(); //#18595
        $1[$k[--$j]] = _8R; //#18595
    } else { //#18599
        if ($eq($1.format, "full")) { //#18598
            $1.verset = $a([$1.v1to9, $1.v10to26, $1.v27to40]); //#18598
        } //#18598
        if ($eq($1.format, "micro")) { //#18599
            $1.verset = $a([$1.vM1, $1.vM2, $1.vM3, $1.vM4]); //#18599
        } //#18599
    } //#18599
    $k[$j++] = Infinity; //#18604
    for (var _8e = 0, _8f = 39; _8e < _8f; _8e++) { //#18604
        $k[$j++] = -1; //#18604
    } //#18604
    $1.msgbits = $a(); //#18604
    $1.e = 10000; //#18605
    var _8h = $1.verset; //#18606
    for (var _8i = 0, _8j = _8h.length; _8i < _8j; _8i++) { //#18741
        $1.ver = $get(_8h, _8i); //#18607
        $1.mode = -1; //#18610
        $1.seq = $a([]); //#18610
        $1.i = 0; //#18610
        for (;;) { //#18711
            if ($1.i >= $1.msglen) { //#18611
                break; //#18611
            } //#18611
            $1.numK = $get($1.numKs, $1.i); //#18612
            $1.numB = $get($1.numBs, $1.i); //#18613
            $1.numA = $get($1.numAs, $1.i); //#18614
            $1.numN = $get($1.numNs, $1.i); //#18615
            $1.eci = $get($1.isECI, $1.i); //#18616
            if ($eq($1.ver, $1.vM1) && ($1.numA >= 1)) { //#18617
                $1.seq = -1; //#18617
                break; //#18617
            } //#18617
            if ($eq($1.ver, $1.vM1) && ($1.numB >= 1)) { //#18618
                $1.seq = -1; //#18618
                break; //#18618
            } //#18618
            if ($eq($1.ver, $1.vM1) && ($1.numK >= 1)) { //#18619
                $1.seq = -1; //#18619
                break; //#18619
            } //#18619
            if ($eq($1.ver, $1.vM1) && $1.eci) { //#18620
                $1.seq = -1; //#18620
                break; //#18620
            } //#18620
            if ($eq($1.ver, $1.vM2) && ($1.numB >= 1)) { //#18621
                $1.seq = -1; //#18621
                break; //#18621
            } //#18621
            if ($eq($1.ver, $1.vM2) && ($1.numK >= 1)) { //#18622
                $1.seq = -1; //#18622
                break; //#18622
            } //#18622
            if ($eq($1.ver, $1.vM2) && $1.eci) { //#18623
                $1.seq = -1; //#18623
                break; //#18623
            } //#18623
            if ($eq($1.ver, $1.vM3) && $1.eci) { //#18624
                $1.seq = -1; //#18624
                break; //#18624
            } //#18624
            if ($eq($1.ver, $1.vM4) && $1.eci) { //#18625
                $1.seq = -1; //#18625
                break; //#18625
            } //#18625
            if ($ge($1.ver, $1.vR7x43) && $1.eci) { //#18626
                $1.seq = -1; //#18626
                break; //#18626
            } //#18626
            for (;;) { //#18691
                if ($1.eci) { //#18630
                    $k[$j++] = $1.E; //#18629
                    break; //#18629
                } //#18629
                if ($ge($1.ver, $1.vR7x43)) { //#18633
                    $k[$j++] = $1.B; //#18632
                    break; //#18632
                } //#18632
                if ($1.mode == -1) { //#18652
                    $k[$j++] = $a([1, 1, 1, $1.e, $1.e, 1, 1]); //#18635
                    $1.KbeforeA(); //#18635
                    if ($k[--$j]) { //#18635
                        $k[$j++] = $1.K; //#18635
                        break; //#18635
                    } //#18635
                    $k[$j++] = $a([1, 1, 1, $1.e, $1.e, 1, 1]); //#18636
                    $1.KbeforeN(); //#18636
                    if ($k[--$j]) { //#18636
                        $k[$j++] = $1.K; //#18636
                        break; //#18636
                    } //#18636
                    $k[$j++] = $a([5, 5, 6, $1.e, $1.e, 2, 3]); //#18637
                    $1.KbeforeB(); //#18637
                    if ($k[--$j]) { //#18637
                        $k[$j++] = $1.K; //#18637
                        break; //#18637
                    } //#18637
                    $k[$j++] = $a([1, 1, 1, $1.e, $1.e, 1, 1]); //#18638
                    $1.KbeforeE(); //#18638
                    if ($k[--$j]) { //#18638
                        $k[$j++] = $1.K; //#18638
                        break; //#18638
                    } //#18638
                    if ($1.numK >= 1) { //#18639
                        $k[$j++] = $1.B; //#18639
                        break; //#18639
                    } //#18639
                    $k[$j++] = $a([6, 7, 8, $1.e, $1.e, 3, 4]); //#18640
                    $1.AbeforeB(); //#18640
                    if ($k[--$j]) { //#18640
                        $k[$j++] = $1.A; //#18640
                        break; //#18640
                    } //#18640
                    $k[$j++] = $a([1, 1, 1, $1.e, 1, 1, 1]); //#18641
                    $1.AbeforeN(); //#18641
                    if ($k[--$j]) { //#18641
                        $k[$j++] = $1.A; //#18641
                        break; //#18641
                    } //#18641
                    $k[$j++] = $a([1, 1, 1, $1.e, 1, 1, 1]); //#18642
                    $1.AbeforeE(); //#18642
                    if ($k[--$j]) { //#18642
                        $k[$j++] = $1.A; //#18642
                        break; //#18642
                    } //#18642
                    if ($1.numA >= 1) { //#18645
                        var _AF = $ne($1.ver, $1.vM2) ? $1.B : $1.A; //#18644
                        $k[$j++] = _AF; //#18644
                        break; //#18644
                    } //#18644
                    $k[$j++] = $a([4, 4, 5, $1.e, $1.e, 2, 3]); //#18646
                    $1.NbeforeB(); //#18646
                    if ($k[--$j]) { //#18646
                        $k[$j++] = $1.N; //#18646
                        break; //#18646
                    } //#18646
                    $k[$j++] = $a([1, 1, 1, $1.e, $1.e, 1, 1]); //#18647
                    $1.NbeforeB(); //#18647
                    if ($k[--$j]) { //#18647
                        $k[$j++] = $1.B; //#18647
                        break; //#18647
                    } //#18647
                    $k[$j++] = $a([7, 8, 9, $1.e, 3, 4, 5]); //#18648
                    $1.NbeforeA(); //#18648
                    if ($k[--$j]) { //#18648
                        $k[$j++] = $1.N; //#18648
                        break; //#18648
                    } //#18648
                    $k[$j++] = $a([1, 1, 1, $1.e, 1, 1, 1]); //#18649
                    $1.NbeforeA(); //#18649
                    if ($k[--$j]) { //#18649
                        $k[$j++] = $1.A; //#18649
                        break; //#18649
                    } //#18649
                    if ($1.numN >= 1) { //#18650
                        $k[$j++] = $1.N; //#18650
                        break; //#18650
                    } //#18650
                    $k[$j++] = $1.B; //#18651
                    break; //#18651
                } //#18651
                if ($1.mode == $1.B) { //#18667
                    $k[$j++] = $a([9, 12, 13, $1.e, $1.e, 4, 5]); //#18654
                    $1.KbeforeB(); //#18654
                    if ($k[--$j]) { //#18654
                        $k[$j++] = $1.K; //#18654
                        break; //#18654
                    } //#18654
                    $k[$j++] = $a([9, 10, 12, $1.e, $1.e, 4, 5]); //#18655
                    $1.KbeforeA(); //#18655
                    if ($k[--$j]) { //#18655
                        $k[$j++] = $1.K; //#18655
                        break; //#18655
                    } //#18655
                    $k[$j++] = $a([9, 10, 11, $1.e, $1.e, 5, 6]); //#18656
                    $1.KbeforeN(); //#18656
                    if ($k[--$j]) { //#18656
                        $k[$j++] = $1.K; //#18656
                        break; //#18656
                    } //#18656
                    $k[$j++] = $a([4, 5, 6, $1.e, $1.e, 2, 3]); //#18657
                    $1.KbeforeE(); //#18657
                    if ($k[--$j]) { //#18657
                        $k[$j++] = $1.K; //#18657
                        break; //#18657
                    } //#18657
                    $k[$j++] = $a([11, 12, 14, $1.e, $1.e, 5, 7]); //#18658
                    $1.AbeforeK(); //#18658
                    if ($k[--$j]) { //#18658
                        $k[$j++] = $1.A; //#18658
                        break; //#18658
                    } //#18658
                    $k[$j++] = $a([11, 15, 16, $1.e, $1.e, 6, 7]); //#18659
                    $1.AbeforeB(); //#18659
                    if ($k[--$j]) { //#18659
                        $k[$j++] = $1.A; //#18659
                        break; //#18659
                    } //#18659
                    $k[$j++] = $a([12, 13, 15, $1.e, $1.e, 6, 8]); //#18660
                    $1.AbeforeN(); //#18660
                    if ($k[--$j]) { //#18660
                        $k[$j++] = $1.A; //#18660
                        break; //#18660
                    } //#18660
                    $k[$j++] = $a([6, 7, 8, $1.e, $1.e, 3, 4]); //#18661
                    $1.AbeforeE(); //#18661
                    if ($k[--$j]) { //#18661
                        $k[$j++] = $1.A; //#18661
                        break; //#18661
                    } //#18661
                    $k[$j++] = $a([6, 7, 8, $1.e, $1.e, 3, 4]); //#18662
                    $1.NbeforeK(); //#18662
                    if ($k[--$j]) { //#18662
                        $k[$j++] = $1.N; //#18662
                        break; //#18662
                    } //#18662
                    $k[$j++] = $a([6, 8, 9, $1.e, $1.e, 3, 4]); //#18663
                    $1.NbeforeB(); //#18663
                    if ($k[--$j]) { //#18663
                        $k[$j++] = $1.N; //#18663
                        break; //#18663
                    } //#18663
                    $k[$j++] = $a([6, 7, 8, $1.e, $1.e, 3, 4]); //#18664
                    $1.NbeforeA(); //#18664
                    if ($k[--$j]) { //#18664
                        $k[$j++] = $1.N; //#18664
                        break; //#18664
                    } //#18664
                    $k[$j++] = $a([3, 4, 5, $1.e, $1.e, 2, 3]); //#18665
                    $1.NbeforeE(); //#18665
                    if ($k[--$j]) { //#18665
                        $k[$j++] = $1.N; //#18665
                        break; //#18665
                    } //#18665
                    $k[$j++] = $1.B; //#18666
                    break; //#18666
                } //#18666
                if ($1.mode == $1.A) { //#18676
                    if ($1.numK >= 1) { //#18669
                        $k[$j++] = $1.K; //#18669
                        break; //#18669
                    } //#18669
                    if ($1.numB >= 1) { //#18670
                        $k[$j++] = $1.B; //#18670
                        break; //#18670
                    } //#18670
                    $k[$j++] = $a([13, 15, 17, $1.e, 5, 7, 9]); //#18671
                    $1.NbeforeA(); //#18671
                    if ($k[--$j]) { //#18671
                        $k[$j++] = $1.N; //#18671
                        break; //#18671
                    } //#18671
                    $k[$j++] = $a([13, 17, 18, $1.e, $1.e, 7, 9]); //#18672
                    $1.NbeforeB(); //#18672
                    if ($k[--$j]) { //#18672
                        $k[$j++] = $1.N; //#18672
                        break; //#18672
                    } //#18672
                    $k[$j++] = $a([7, 8, 9, $1.e, 3, 4, 5]); //#18673
                    $1.NbeforeE(); //#18673
                    if ($k[--$j]) { //#18673
                        $k[$j++] = $1.N; //#18673
                        break; //#18673
                    } //#18673
                    if (($1.numA >= 1) || ($1.numN >= 1)) { //#18674
                        $k[$j++] = $1.A; //#18674
                        break; //#18674
                    } //#18674
                    $k[$j++] = $1.B; //#18675
                    break; //#18675
                } //#18675
                if ($1.mode == $1.N) { //#18683
                    if ($1.numK >= 1) { //#18678
                        $k[$j++] = $1.K; //#18678
                        break; //#18678
                    } //#18678
                    if ($1.numB >= 1) { //#18679
                        $k[$j++] = $1.B; //#18679
                        break; //#18679
                    } //#18679
                    if ($1.numA >= 1) { //#18680
                        $k[$j++] = $1.A; //#18680
                        break; //#18680
                    } //#18680
                    if ($1.numN >= 1) { //#18681
                        $k[$j++] = $1.N; //#18681
                        break; //#18681
                    } //#18681
                    $k[$j++] = $1.B; //#18682
                    break; //#18682
                } //#18682
                if ($1.mode == $1.K) { //#18690
                    if ($1.numB >= 1) { //#18685
                        $k[$j++] = $1.B; //#18685
                        break; //#18685
                    } //#18685
                    if ($1.numA >= 1) { //#18686
                        $k[$j++] = $1.A; //#18686
                        break; //#18686
                    } //#18686
                    if ($1.numN >= 1) { //#18687
                        $k[$j++] = $1.N; //#18687
                        break; //#18687
                    } //#18687
                    if ($1.numK >= 1) { //#18688
                        $k[$j++] = $1.K; //#18688
                        break; //#18688
                    } //#18688
                    $k[$j++] = $1.B; //#18689
                    break; //#18689
                } //#18689
            } //#18689
            var _CL = $k[--$j]; //#18692
            $k[$j++] = _CL; //#18692
            if ((_CL == $1.K) && $1.fnc1first) { //#18692
                $j--; //#18692
                $k[$j++] = $1.B; //#18692
            } //#18692
            var _CP = $k[--$j]; //#18693
            $k[$j++] = _CP; //#18709
            if (_CP == $1.mode) { //#18708
                $j--; //#18694
                var _CV = ($1.mode == $1.K) ? 2 : 1; //#18695
                $1.dat = $geti($1.msg, $1.i, _CV); //#18695
                $k[$j++] = Infinity; //#18698
                $aload($1.seq); //#18697
                $k[$j++] = Infinity; //#18698
                var _CY = $k[--$j]; //#18698
                var _CZ = $k[--$j]; //#18698
                $k[$j++] = _CY; //#18698
                $aload(_CZ); //#18698
                $aload($1.dat); //#18698
                var _Cb = $a(); //#18698
                $k[$j++] = _Cb; //#18698
                $1.seq = $a(); //#18698
            } else { //#18708
                $1.mode = $k[--$j]; //#18701
                if ($1.mode == $1.K) { //#18702
                    $k[$j++] = $1.K; //#18702
                    $k[$j++] = $geti($1.msg, $1.i, $1.numK * 2); //#18702
                } //#18702
                if ($1.mode == $1.B) { //#18703
                    $k[$j++] = $1.B; //#18703
                    $k[$j++] = $geti($1.msg, $1.i, $1.numB); //#18703
                } //#18703
                if ($1.mode == $1.A) { //#18704
                    $k[$j++] = $1.A; //#18704
                    $k[$j++] = $geti($1.msg, $1.i, $1.numA); //#18704
                } //#18704
                if ($1.mode == $1.N) { //#18705
                    $k[$j++] = $1.N; //#18705
                    $k[$j++] = $geti($1.msg, $1.i, $1.numN); //#18705
                } //#18705
                if ($1.mode == $1.E) { //#18706
                    $1.mode = -1; //#18706
                    $k[$j++] = $1.E; //#18706
                    $k[$j++] = $geti($1.msg, $1.i, 1); //#18706
                } //#18706
                $1.dat = $k[--$j]; //#18707
                $1.sw = $k[--$j]; //#18707
                $k[$j++] = Infinity; //#18708
                $aload($1.seq); //#18708
                $k[$j++] = $1.sw; //#18708
                $k[$j++] = $1.dat; //#18708
                $1.seq = $a(); //#18708
            } //#18708
            $1.i = $1.i + $1.dat.length; //#18710
        } //#18710
        for (;;) { //#18740
            if ($1.seq == -1) { //#18715
                break; //#18715
            } //#18715
            $1.bits = $s(23648); //#18716
            $1.j = 0; //#18717
            if ($1.fnc1first) { //#18720
                if ($lt($1.ver, $1.vR7x43)) { //#18719
                    $k[$j++] = "0101"; //#18719
                } else { //#18719
                    $k[$j++] = "101"; //#18719
                } //#18719
                $1.addtobits(); //#18719
            } //#18719
            $1.abort = false; //#18721
            for (var _DR = 0, _DQ = $1.seq.length - 1; _DR <= _DQ; _DR += 2) { //#18735
                $1.i = _DR; //#18723
                $1.mode = $get($1.seq, $1.i); //#18724
                $k[$j++] = $get($get($1.mids, $1.ver), $1.mode); //#18725
                $1.addtobits(); //#18725
                $1.chars = $get($1.seq, $1.i + 1); //#18726
                if ($1.mode != $1.E) { //#18733
                    $1.cclen = $get($get($1.cclens, $1.ver), $1.mode); //#18728
                    if ($1.chars.length >= (~~Math.pow(2, $1.cclen))) { //#18731
                        $1.abort = true; //#18730
                        break; //#18730
                    } //#18730
                    $k[$j++] = $1.chars.length; //#18732
                    if ($1.mode == $1.K) { //#18732
                        var _Dp = $k[--$j]; //#18732
                        $k[$j++] = ~~(_Dp / 2); //#18732
                    } //#18732
                    $k[$j++] = $1.cclen; //#18732
                    $1.tobin(); //#18732
                    $1.addtobits(); //#18732
                } //#18732
                $k[$j++] = $1.chars; //#18734
                if ($1[$get($1.encfuncs, $1.mode)]() === true) {
                    break;
                } //#18734
                $1.addtobits(); //#18734
            } //#18734
            if ($1.abort) { //#18736
                break; //#18736
            } //#18736
            $1.bits = $geti($1.bits, 0, $1.j); //#18737
            $put($1.msgbits, $1.ver, $1.bits); //#18738
            break; //#18739
        } //#18739
    } //#18739
    $1.metrics = $a([$a(["micro", "M1", $1.vM1, 11, 11, 98, 99, 36, $a([2, 99, 99, 99]), $a([1, 0, -1, -1, -1, -1, -1, -1])]), $a(["micro", "M2", $1.vM2, 13, 13, 98, 99, 80, $a([5, 6, 99, 99]), $a([1, 0, 1, 0, -1, -1, -1, -1])]), $a(["micro", "M3", $1.vM3, 15, 15, 98, 99, 132, $a([6, 8, 99, 99]), $a([1, 0, 1, 0, -1, -1, -1, -1])]), $a(["micro", "M4", $1.vM4, 17, 17, 98, 99, 192, $a([8, 10, 14, 99]), $a([1, 0, 1, 0, 1, 0, -1, -1])]), $a(["full", "1", $1.v1to9, 21, 21, 98, 99, 208, $a([7, 10, 13, 17]), $a([1, 0, 1, 0, 1, 0, 1, 0])]), $a(["full", "2", $1.v1to9, 25, 25, 18, 99, 359, $a([10, 16, 22, 28]), $a([1, 0, 1, 0, 1, 0, 1, 0])]), $a(["full", "3", $1.v1to9, 29, 29, 22, 99, 567, $a([15, 26, 36, 44]), $a([1, 0, 1, 0, 2, 0, 2, 0])]), $a(["full", "4", $1.v1to9, 33, 33, 26, 99, 807, $a([20, 36, 52, 64]), $a([1, 0, 2, 0, 2, 0, 4, 0])]), $a(["full", "5", $1.v1to9, 37, 37, 30, 99, 1079, $a([26, 48, 72, 88]), $a([1, 0, 2, 0, 2, 2, 2, 2])]), $a(["full", "6", $1.v1to9, 41, 41, 34, 99, 1383, $a([36, 64, 96, 112]), $a([2, 0, 4, 0, 4, 0, 4, 0])]), $a(["full", "7", $1.v1to9, 45, 45, 22, 38, 1568, $a([40, 72, 108, 130]), $a([2, 0, 4, 0, 2, 4, 4, 1])]), $a(["full", "8", $1.v1to9, 49, 49, 24, 42, 1936, $a([48, 88, 132, 156]), $a([2, 0, 2, 2, 4, 2, 4, 2])]), $a(["full", "9", $1.v1to9, 53, 53, 26, 46, 2336, $a([60, 110, 160, 192]), $a([2, 0, 3, 2, 4, 4, 4, 4])]), $a(["full", "10", $1.v10to26, 57, 57, 28, 50, 2768, $a([72, 130, 192, 224]), $a([2, 2, 4, 1, 6, 2, 6, 2])]), $a(["full", "11", $1.v10to26, 61, 61, 30, 54, 3232, $a([80, 150, 224, 264]), $a([4, 0, 1, 4, 4, 4, 3, 8])]), $a(["full", "12", $1.v10to26, 65, 65, 32, 58, 3728, $a([96, 176, 260, 308]), $a([2, 2, 6, 2, 4, 6, 7, 4])]), $a(["full", "13", $1.v10to26, 69, 69, 34, 62, 4256, $a([104, 198, 288, 352]), $a([4, 0, 8, 1, 8, 4, 12, 4])]), $a(["full", "14", $1.v10to26, 73, 73, 26, 46, 4651, $a([120, 216, 320, 384]), $a([3, 1, 4, 5, 11, 5, 11, 5])]), $a(["full", "15", $1.v10to26, 77, 77, 26, 48, 5243, $a([132, 240, 360, 432]), $a([5, 1, 5, 5, 5, 7, 11, 7])]), $a(["full", "16", $1.v10to26, 81, 81, 26, 50, 5867, $a([144, 280, 408, 480]), $a([5, 1, 7, 3, 15, 2, 3, 13])]), $a(["full", "17", $1.v10to26, 85, 85, 30, 54, 6523, $a([168, 308, 448, 532]), $a([1, 5, 10, 1, 1, 15, 2, 17])]), $a(["full", "18", $1.v10to26, 89, 89, 30, 56, 7211, $a([180, 338, 504, 588]), $a([5, 1, 9, 4, 17, 1, 2, 19])]), $a(["full", "19", $1.v10to26, 93, 93, 30, 58, 7931, $a([196, 364, 546, 650]), $a([3, 4, 3, 11, 17, 4, 9, 16])]), $a(["full", "20", $1.v10to26, 97, 97, 34, 62, 8683, $a([224, 416, 600, 700]), $a([3, 5, 3, 13, 15, 5, 15, 10])]), $a(["full", "21", $1.v10to26, 101, 101, 28, 50, 9252, $a([224, 442, 644, 750]), $a([4, 4, 17, 0, 17, 6, 19, 6])]), $a(["full", "22", $1.v10to26, 105, 105, 26, 50, 10068, $a([252, 476, 690, 816]), $a([2, 7, 17, 0, 7, 16, 34, 0])]), $a(["full", "23", $1.v10to26, 109, 109, 30, 54, 10916, $a([270, 504, 750, 900]), $a([4, 5, 4, 14, 11, 14, 16, 14])]), $a(["full", "24", $1.v10to26, 113, 113, 28, 54, 11796, $a([300, 560, 810, 960]), $a([6, 4, 6, 14, 11, 16, 30, 2])]), $a(["full", "25", $1.v10to26, 117, 117, 32, 58, 12708, $a([312, 588, 870, 1050]), $a([8, 4, 8, 13, 7, 22, 22, 13])]), $a(["full", "26", $1.v10to26, 121, 121, 30, 58, 13652, $a([336, 644, 952, 1110]), $a([10, 2, 19, 4, 28, 6, 33, 4])]), $a(["full", "27", $1.v27to40, 125, 125, 34, 62, 14628, $a([360, 700, 1020, 1200]), $a([8, 4, 22, 3, 8, 26, 12, 28])]), $a(["full", "28", $1.v27to40, 129, 129, 26, 50, 15371, $a([390, 728, 1050, 1260]), $a([3, 10, 3, 23, 4, 31, 11, 31])]), $a(["full", "29", $1.v27to40, 133, 133, 30, 54, 16411, $a([420, 784, 1140, 1350]), $a([7, 7, 21, 7, 1, 37, 19, 26])]), $a(["full", "30", $1.v27to40, 137, 137, 26, 52, 17483, $a([450, 812, 1200, 1440]), $a([5, 10, 19, 10, 15, 25, 23, 25])]), $a(["full", "31", $1.v27to40, 141, 141, 30, 56, 18587, $a([480, 868, 1290, 1530]), $a([13, 3, 2, 29, 42, 1, 23, 28])]), $a(["full", "32", $1.v27to40, 145, 145, 34, 60, 19723, $a([510, 924, 1350, 1620]), $a([17, 0, 10, 23, 10, 35, 19, 35])]), $a(["full", "33", $1.v27to40, 149, 149, 30, 58, 20891, $a([540, 980, 1440, 1710]), $a([17, 1, 14, 21, 29, 19, 11, 46])]), $a(["full", "34", $1.v27to40, 153, 153, 34, 62, 22091, $a([570, 1036, 1530, 1800]), $a([13, 6, 14, 23, 44, 7, 59, 1])]), $a(["full", "35", $1.v27to40, 157, 157, 30, 54, 23008, $a([570, 1064, 1590, 1890]), $a([12, 7, 12, 26, 39, 14, 22, 41])]), $a(["full", "36", $1.v27to40, 161, 161, 24, 50, 24272, $a([600, 1120, 1680, 1980]), $a([6, 14, 6, 34, 46, 10, 2, 64])]), $a(["full", "37", $1.v27to40, 165, 165, 28, 54, 25568, $a([630, 1204, 1770, 2100]), $a([17, 4, 29, 14, 49, 10, 24, 46])]), $a(["full", "38", $1.v27to40, 169, 169, 32, 58, 26896, $a([660, 1260, 1860, 2220]), $a([4, 18, 13, 32, 48, 14, 42, 32])]), $a(["full", "39", $1.v27to40, 173, 173, 26, 54, 28256, $a([720, 1316, 1950, 2310]), $a([20, 4, 40, 7, 43, 22, 10, 67])]), $a(["full", "40", $1.v27to40, 177, 177, 30, 58, 29648, $a([750, 1372, 2040, 2430]), $a([19, 6, 18, 31, 34, 34, 20, 61])]), $a(["rmqr", "R7x43", $1.vR7x43, 7, 43, 22, 99, 104, $a([99, 7, 99, 10]), $a([-1, -1, 1, 0, -1, -1, 1, 0])]), $a(["rmqr", "R7x59", $1.vR7x59, 7, 59, 20, 40, 171, $a([99, 9, 99, 14]), $a([-1, -1, 1, 0, -1, -1, 1, 0])]), $a(["rmqr", "R7x77", $1.vR7x77, 7, 77, 26, 52, 261, $a([99, 12, 99, 22]), $a([-1, -1, 1, 0, -1, -1, 1, 0])]), $a(["rmqr", "R7x99", $1.vR7x99, 7, 99, 24, 50, 358, $a([99, 16, 99, 30]), $a([-1, -1, 1, 0, -1, -1, 1, 0])]), $a(["rmqr", "R7x139", $1.vR7x139, 7, 139, 28, 56, 545, $a([99, 24, 99, 44]), $a([-1, -1, 1, 0, -1, -1, 2, 0])]), $a(["rmqr", "R9x43", $1.vR9x43, 9, 43, 22, 99, 170, $a([99, 9, 99, 14]), $a([-1, -1, 1, 0, -1, -1, 1, 0])]), $a(["rmqr", "R9x59", $1.vR9x59, 9, 59, 20, 40, 267, $a([99, 12, 99, 22]), $a([-1, -1, 1, 0, -1, -1, 1, 0])]), $a(["rmqr", "R9x77", $1.vR9x77, 9, 77, 26, 52, 393, $a([99, 18, 99, 32]), $a([-1, -1, 1, 0, -1, -1, 1, 1])]), $a(["rmqr", "R9x99", $1.vR9x99, 9, 99, 24, 50, 532, $a([99, 24, 99, 44]), $a([-1, -1, 1, 0, -1, -1, 2, 0])]), $a(["rmqr", "R9x139", $1.vR9x139, 9, 139, 28, 56, 797, $a([99, 36, 99, 66]), $a([-1, -1, 1, 1, -1, -1, 3, 0])]), $a(["rmqr", "R11x27", $1.vR11x27, 11, 27, 98, 99, 122, $a([99, 8, 99, 10]), $a([-1, -1, 1, 0, -1, -1, 1, 0])]), $a(["rmqr", "R11x43", $1.vR11x43, 11, 43, 22, 99, 249, $a([99, 12, 99, 20]), $a([-1, -1, 1, 0, -1, -1, 1, 0])]), $a(["rmqr", "R11x59", $1.vR11x59, 11, 59, 20, 40, 376, $a([99, 16, 99, 32]), $a([-1, -1, 1, 0, -1, -1, 1, 1])]), $a(["rmqr", "R11x77", $1.vR11x77, 11, 77, 26, 52, 538, $a([99, 24, 99, 44]), $a([-1, -1, 1, 0, -1, -1, 1, 1])]), $a(["rmqr", "R11x99", $1.vR11x99, 11, 99, 24, 50, 719, $a([99, 32, 99, 60]), $a([-1, -1, 1, 1, -1, -1, 1, 1])]), $a(["rmqr", "R11x139", $1.vR11x139, 11, 139, 28, 56, 1062, $a([99, 48, 99, 90]), $a([-1, -1, 2, 0, -1, -1, 3, 0])]), $a(["rmqr", "R13x27", $1.vR13x27, 13, 27, 98, 99, 172, $a([99, 9, 99, 14]), $a([-1, -1, 1, 0, -1, -1, 1, 0])]), $a(["rmqr", "R13x43", $1.vR13x43, 13, 43, 22, 99, 329, $a([99, 14, 99, 28]), $a([-1, -1, 1, 0, -1, -1, 1, 0])]), $a(["rmqr", "R13x59", $1.vR13x59, 13, 59, 20, 40, 486, $a([99, 22, 99, 40]), $a([-1, -1, 1, 0, -1, -1, 2, 0])]), $a(["rmqr", "R13x77", $1.vR13x77, 13, 77, 26, 52, 684, $a([99, 32, 99, 56]), $a([-1, -1, 1, 1, -1, -1, 1, 1])]), $a(["rmqr", "R13x99", $1.vR13x99, 13, 99, 24, 50, 907, $a([99, 40, 99, 78]), $a([-1, -1, 1, 1, -1, -1, 1, 2])]), $a(["rmqr", "R13x139", $1.vR13x139, 13, 139, 28, 56, 1328, $a([99, 60, 99, 112]), $a([-1, -1, 2, 1, -1, -1, 2, 2])]), $a(["rmqr", "R15x43", $1.vR15x43, 15, 43, 22, 99, 409, $a([99, 18, 99, 36]), $a([-1, -1, 1, 0, -1, -1, 1, 1])]), $a(["rmqr", "R15x59", $1.vR15x59, 15, 59, 20, 40, 596, $a([99, 26, 99, 48]), $a([-1, -1, 1, 0, -1, -1, 2, 0])]), $a(["rmqr", "R15x77", $1.vR15x77, 15, 77, 26, 52, 830, $a([99, 36, 99, 72]), $a([-1, -1, 1, 1, -1, -1, 2, 1])]), $a(["rmqr", "R15x99", $1.vR15x99, 15, 99, 24, 50, 1095, $a([99, 48, 99, 88]), $a([-1, -1, 2, 0, -1, -1, 4, 0])]), $a(["rmqr", "R15x139", $1.vR15x139, 15, 139, 28, 56, 1594, $a([99, 72, 99, 130]), $a([-1, -1, 2, 1, -1, -1, 1, 4])]), $a(["rmqr", "R17x43", $1.vR17x43, 17, 43, 22, 99, 489, $a([99, 22, 99, 40]), $a([-1, -1, 1, 0, -1, -1, 1, 1])]), $a(["rmqr", "R17x59", $1.vR17x59, 17, 59, 20, 40, 706, $a([99, 32, 99, 60]), $a([-1, -1, 2, 0, -1, -1, 2, 0])]), $a(["rmqr", "R17x77", $1.vR17x77, 17, 77, 26, 52, 976, $a([99, 44, 99, 84]), $a([-1, -1, 2, 0, -1, -1, 1, 2])]), $a(["rmqr", "R17x99", $1.vR17x99, 17, 99, 24, 50, 1283, $a([99, 60, 99, 104]), $a([-1, -1, 2, 1, -1, -1, 4, 0])]), $a(["rmqr", "R17x139", $1.vR17x139, 17, 139, 28, 56, 1860, $a([99, 80, 99, 156]), $a([-1, -1, 4, 0, -1, -1, 2, 4])])]); //#18823
    $k[$j++] = 'eclval'; //#18824
    $search("LMQH", $1.eclevel); //#18824
    $j--; //#18824
    var _Iz = $k[--$j]; //#18824
    var _J0 = $k[--$j]; //#18824
    $k[$j++] = _Iz.length; //#18824
    $k[$j++] = _J0; //#18824
    $j--; //#18824
    var _J1 = $k[--$j]; //#18824
    var _J2 = $k[--$j]; //#18824
    $k[$j++] = _J1; //#18824
    $k[$j++] = _J2; //#18824
    $j--; //#18824
    var _J3 = $k[--$j]; //#18824
    $1[$k[--$j]] = _J3; //#18824
    for (var _J7 = 0, _J6 = $1.metrics.length - 1; _J7 <= _J6; _J7 += 1) { //#18863
        $1.i = _J7; //#18826
        $1.m = $get($1.metrics, $1.i); //#18827
        $1.frmt = $get($1.m, 0); //#18828
        $1.vers = $get($1.m, 1); //#18829
        $1.vergrp = $get($1.m, 2); //#18830
        $1.verind = $1.i - 44; //#18831
        $1.rows = $get($1.m, 3); //#18832
        $1.cols = $get($1.m, 4); //#18833
        $1.asp2 = $get($1.m, 5); //#18834
        $1.asp3 = $get($1.m, 6); //#18835
        $1.nmod = $get($1.m, 7); //#18836
        $1.ncws = ~~($1.nmod / 8); //#18837
        $1.rbit = $1.nmod % 8; //#18838
        $1.lc4b = false; //#18839
        if ($eq($1.vers, "M1") || $eq($1.vers, "M3")) { //#18844
            $1.ncws = $1.ncws + 1; //#18841
            $1.rbit = 0; //#18842
            $1.lc4b = true; //#18843
        } //#18843
        $1.ecws = $get($get($1.m, 8), $1.eclval); //#18845
        $1.dcws = $f($1.ncws - $1.ecws); //#18846
        var _Jf = $1.lc4b ? 4 : 0; //#18847
        $1.dmod = $f(($1.dcws * 8) - _Jf); //#18847
        $1.ecb1 = $get($get($1.m, 9), $1.eclval * 2); //#18848
        $1.ecb2 = $get($get($1.m, 9), $f(($1.eclval * 2) + 1)); //#18849
        $1.okay = true; //#18850
        if ($ne($1.format, $1.frmt)) { //#18851
            $1.okay = false; //#18851
        } //#18851
        if ($eq($1.frmt, "micro") && $1.fnc1first) { //#18852
            $1.okay = false; //#18852
        } //#18852
        if ($ne($1.version, "unset") && $ne($1.version, $1.vers)) { //#18853
            $1.okay = false; //#18853
        } //#18853
        if (($1.ecb1 == -1) || ($1.ecb2 == -1)) { //#18854
            $1.okay = false; //#18854
        } //#18854
        $1.verbits = $get($1.msgbits, $1.vergrp); //#18855
        if ($1.verbits == -1) { //#18859
            $1.okay = false; //#18857
        } else { //#18859
            if ($1.verbits.length > $1.dmod) { //#18859
                $1.okay = false; //#18859
            } //#18859
        } //#18859
        $1.term = $geti("000000000", 0, $get($1.termlens, $1.vergrp)); //#18861
        if ($1.okay) { //#18862
            break; //#18862
        } //#18862
    } //#18862
    if (!$1.okay) { //#18867
        $k[$j++] = 'bwipp.qrcodeNoValidSymbol'; //#18866
        $k[$j++] = "No valid symbol available"; //#18866
        bwipp_raiseerror(); //#18866
    } //#18866
    $1.format = $1.frmt; //#18869
    $1.version = $1.vers; //#18870
    $1.msgbits = $1.verbits; //#18871
    $1.dcpb = ~~($1.dcws / $f($1.ecb1 + $1.ecb2)); //#18872
    $1.ecpb = (~~($1.ncws / $f($1.ecb1 + $1.ecb2))) - $1.dcpb; //#18873
    var _KJ = $1.term; //#18876
    var _KK = $1.dmod; //#18876
    var _KL = $1.msgbits; //#18876
    var _KM = $1.term; //#18876
    var _KN = _KM.length; //#18876
    var _KO = $f(_KK - _KL.length); //#18876
    if ($f(_KK - _KL.length) > _KM.length) { //#18876
        var _ = _KN; //#18876
        _KN = _KO; //#18876
        _KO = _; //#18876
    } //#18876
    $1.term = $geti(_KJ, 0, _KO); //#18876
    var _KS = $s($1.msgbits.length + $1.term.length); //#18877
    $puti(_KS, 0, $1.msgbits); //#18878
    $puti(_KS, $1.msgbits.length, $1.term); //#18879
    $1.msgbits = _KS; //#18880
    $1.pad = $s($1.dmod); //#18883
    for (var _Ka = 0, _KZ = $1.pad.length - 1; _Ka <= _KZ; _Ka += 1) { //#18884
        $put($1.pad, _Ka, 48); //#18884
    } //#18884
    $puti($1.pad, 0, $1.msgbits); //#18885
    $1.padstrs = $a(["11101100", "00010001"]); //#18886
    $1.padnum = 0; //#18887
    var _Ki = $1.lc4b ? 5 : 1; //#18888
    for (var _Kk = ~~(Math.ceil($1.msgbits.length / 8) * 8), _Kj = $f($1.dmod - _Ki); _Kk <= _Kj; _Kk += 8) { //#18891
        $puti($1.pad, _Kk, $get($1.padstrs, $1.padnum)); //#18889
        $1.padnum = ($1.padnum + 1) % 2; //#18890
    } //#18890
    $1.cws = $a($1.dcws); //#18894
    for (var _Ku = 0, _Kt = $1.cws.length - 1; _Ku <= _Kt; _Ku += 1) { //#18906
        $1.c = _Ku; //#18896
        $1.bpcw = 8; //#18897
        if ($1.lc4b && ($1.c == ($1.cws.length - 1))) { //#18898
            $1.bpcw = 4; //#18898
        } //#18898
        $1.cwb = $geti($1.pad, $1.c * 8, $1.bpcw); //#18899
        $1.cw = 0; //#18900
        for (var _L4 = 0, _L3 = $1.bpcw - 1; _L4 <= _L3; _L4 += 1) { //#18904
            $1.i = _L4; //#18902
            $1.cw = $f($1.cw + ((~~(Math.pow(2, ($1.bpcw - $1.i) - 1))) * $f($get($1.cwb, $1.i) - 48))); //#18903
        } //#18903
        $put($1.cws, $1.c, $1.cw); //#18905
    } //#18905
    if ($1.lc4b) { //#18909
        var _LF = $1.cws; //#18909
        var _LG = $1.cws; //#18909
        $put(_LF, _LG.length - 1, $get(_LF, _LG.length - 1) << 4); //#18909
    } //#18909
    var _LJ = $get($1.options, 'debugcws') !== undefined; //#18911
    if (_LJ) { //#18911
        $k[$j++] = 'bwipp.debugcws'; //#18911
        $k[$j++] = $1.cws; //#18911
        bwipp_raiseerror(); //#18911
    } //#18911
    $k[$j++] = Infinity; //#18914
    $k[$j++] = 1; //#18914
    for (var _LL = 0, _LM = 255; _LL < _LM; _LL++) { //#18914
        var _LN = $k[--$j]; //#18914
        var _LO = _LN * 2; //#18914
        $k[$j++] = _LN; //#18914
        $k[$j++] = _LO; //#18914
        if (_LO >= 256) { //#18914
            var _LP = $k[--$j]; //#18914
            $k[$j++] = _LP ^ 285; //#18914
        } //#18914
    } //#18914
    $1.rsalog = $a(); //#18914
    $1.rslog = $a(256); //#18915
    for (var _LS = 1; _LS <= 255; _LS += 1) { //#18916
        $put($1.rslog, $get($1.rsalog, _LS), _LS); //#18916
    } //#18916
    $1.rsprod = function() {
        var _LW = $k[--$j]; //#18920
        var _LX = $k[--$j]; //#18920
        $k[$j++] = _LX; //#18924
        $k[$j++] = _LW; //#18924
        if ((_LW != 0) && (_LX != 0)) { //#18923
            var _La = $get($1.rslog, $k[--$j]); //#18921
            var _Lf = $get($1.rsalog, $f(_La + $get($1.rslog, $k[--$j])) % 255); //#18921
            $k[$j++] = _Lf; //#18921
        } else { //#18923
            $j -= 2; //#18923
            $k[$j++] = 0; //#18923
        } //#18923
    }; //#18925
    $k[$j++] = Infinity; //#18928
    $k[$j++] = 1; //#18928
    for (var _Lh = 0, _Li = $1.ecpb; _Lh < _Li; _Lh++) { //#18928
        $k[$j++] = 0; //#18928
    } //#18928
    $1.coeffs = $a(); //#18928
    for (var _Lm = 0, _Ll = $1.ecpb - 1; _Lm <= _Ll; _Lm += 1) { //#18937
        $1.i = _Lm; //#18930
        $put($1.coeffs, $1.i + 1, $get($1.coeffs, $1.i)); //#18931
        for (var _Lt = $1.i; _Lt >= 1; _Lt -= 1) { //#18935
            $1.j = _Lt; //#18933
            $k[$j++] = $1.coeffs; //#18934
            $k[$j++] = $1.j; //#18934
            $k[$j++] = $get($1.coeffs, $1.j - 1); //#18934
            $k[$j++] = $get($1.coeffs, $1.j); //#18934
            $k[$j++] = $get($1.rsalog, $1.i); //#18934
            $1.rsprod(); //#18934
            var _M5 = $k[--$j]; //#18934
            var _M6 = $k[--$j]; //#18934
            var _M7 = $k[--$j]; //#18934
            $put($k[--$j], _M7, $xo(_M6, _M5)); //#18934
        } //#18934
        $k[$j++] = $1.coeffs; //#18936
        $k[$j++] = 0; //#18936
        $k[$j++] = $get($1.coeffs, 0); //#18936
        $k[$j++] = $get($1.rsalog, $1.i); //#18936
        $1.rsprod(); //#18936
        var _MF = $k[--$j]; //#18936
        var _MG = $k[--$j]; //#18936
        $put($k[--$j], _MG, _MF); //#18936
    } //#18936
    $1.coeffs = $geti($1.coeffs, 0, $1.coeffs.length - 1); //#18938
    $1.rscodes = function() {
        $1.rscws = $k[--$j]; //#18942
        $1.rsnd = $1.rscws.length; //#18943
        $k[$j++] = Infinity; //#18944
        $forall($1.rscws); //#18944
        for (var _MP = 0, _MQ = $1.ecpb; _MP < _MQ; _MP++) { //#18944
            $k[$j++] = 0; //#18944
        } //#18944
        $1.rscws = $a(); //#18944
        for (var _MU = 0, _MT = $1.rsnd - 1; _MU <= _MT; _MU += 1) { //#18952
            $1.m = _MU; //#18946
            $1.k = $get($1.rscws, $1.m); //#18947
            for (var _Ma = 0, _MZ = $1.ecpb - 1; _Ma <= _MZ; _Ma += 1) { //#18951
                $1.j = _Ma; //#18949
                $k[$j++] = $1.rscws; //#18950
                $k[$j++] = ($1.m + $1.j) + 1; //#18950
                $k[$j++] = $get($1.coeffs, ($1.ecpb - $1.j) - 1); //#18950
                $k[$j++] = $1.k; //#18950
                $1.rsprod(); //#18950
                var _Mn = $k[--$j]; //#18950
                var _Mo = $k[--$j]; //#18950
                $put($k[--$j], _Mo, $xo(_Mn, $get($1.rscws, ($1.m + $1.j) + 1))); //#18950
            } //#18950
        } //#18950
        $k[$j++] = $geti($1.rscws, $1.rsnd, $1.ecpb); //#18953
    }; //#18954
    $1.dcwsb = $a($f($1.ecb1 + $1.ecb2)); //#18957
    $1.ecwsb = $a($f($1.ecb1 + $1.ecb2)); //#18958
    for (var _N2 = 0, _N1 = $f($1.ecb1 - 1); _N2 <= _N1; _N2 += 1) { //#18963
        $1.i = _N2; //#18960
        $put($1.dcwsb, $1.i, $geti($1.cws, $1.i * $1.dcpb, $1.dcpb)); //#18961
        $k[$j++] = $1.ecwsb; //#18962
        $k[$j++] = $1.i; //#18962
        $k[$j++] = $get($1.dcwsb, $1.i); //#18962
        $1.rscodes(); //#18962
        var _NF = $k[--$j]; //#18962
        var _NG = $k[--$j]; //#18962
        $put($k[--$j], _NG, _NF); //#18962
    } //#18962
    for (var _NK = 0, _NJ = $f($1.ecb2 - 1); _NK <= _NJ; _NK += 1) { //#18968
        $1.i = _NK; //#18965
        $put($1.dcwsb, $f($1.ecb1 + $1.i), $geti($1.cws, $f(($1.ecb1 * $1.dcpb) + ($1.i * ($1.dcpb + 1))), $1.dcpb + 1)); //#18966
        $k[$j++] = $1.ecwsb; //#18967
        $k[$j++] = $f($1.ecb1 + $1.i); //#18967
        $k[$j++] = $get($1.dcwsb, $f($1.ecb1 + $1.i)); //#18967
        $1.rscodes(); //#18967
        var _Nc = $k[--$j]; //#18967
        var _Nd = $k[--$j]; //#18967
        $put($k[--$j], _Nd, _Nc); //#18967
    } //#18967
    $1.cws = $a($1.ncws); //#18971
    $1.cw = 0; //#18972
    for (var _Nj = 0, _Ni = $1.dcpb; _Nj <= _Ni; _Nj += 1) { //#18982
        $1.i = _Nj; //#18974
        for (var _Nn = 0, _Nm = $f($f($1.ecb1 + $1.ecb2) - 1); _Nn <= _Nm; _Nn += 1) { //#18981
            $1.j = _Nn; //#18976
            if ($1.i < $get($1.dcwsb, $1.j).length) { //#18980
                $put($1.cws, $1.cw, $get($get($1.dcwsb, $1.j), $1.i)); //#18978
                $1.cw = $1.cw + 1; //#18979
            } //#18979
        } //#18979
    } //#18979
    for (var _O2 = 0, _O1 = $1.ecpb - 1; _O2 <= _O1; _O2 += 1) { //#18990
        $1.i = _O2; //#18984
        for (var _O6 = 0, _O5 = $f($f($1.ecb1 + $1.ecb2) - 1); _O6 <= _O5; _O6 += 1) { //#18989
            $1.j = _O6; //#18986
            $put($1.cws, $1.cw, $get($get($1.ecwsb, $1.j), $1.i)); //#18987
            $1.cw = $1.cw + 1; //#18988
        } //#18988
    } //#18988
    if ($1.rbit > 0) { //#18998
        $1.pad = $a($1.cws.length + 1); //#18994
        $puti($1.pad, 0, $1.cws); //#18995
        $put($1.pad, $1.pad.length - 1, 0); //#18996
        $1.cws = $1.pad; //#18997
    } //#18997
    if ($1.lc4b) { //#19009
        var _OO = $1.cws; //#19002
        var _OP = $1.dcws; //#19002
        $put(_OO, $f(_OP - 1), $get(_OO, $f(_OP - 1)) >>> 4); //#19002
        for (var _OU = $f($1.dcws - 1), _OT = $1.ncws - 2; _OU <= _OT; _OU += 1) { //#19007
            $1.i = _OU; //#19004
            $put($1.cws, $1.i, ($get($1.cws, $1.i) & 15) << 4); //#19005
            $put($1.cws, $1.i, (($get($1.cws, $1.i + 1) >>> 4) & 15) | $get($1.cws, $1.i)); //#19006
        } //#19006
        $put($1.cws, $1.ncws - 1, ($get($1.cws, $1.ncws - 1) & 15) << 4); //#19008
    } //#19008
    var _Oo = $get($1.options, 'debugecc') !== undefined; //#19011
    if (_Oo) { //#19011
        $k[$j++] = 'bwipp.debugecc'; //#19011
        $k[$j++] = $1.cws; //#19011
        bwipp_raiseerror(); //#19011
    } //#19011
    $k[$j++] = Infinity; //#19014
    for (var _Os = 0, _Ot = $1.rows * $1.cols; _Os < _Ot; _Os++) { //#19014
        $k[$j++] = -1; //#19014
    } //#19014
    $1.pixs = $a(); //#19014
    $1.qmv = function() {
        var _Ow = $k[--$j]; //#19015
        var _Ox = $k[--$j]; //#19015
        $k[$j++] = $f(_Ox + (_Ow * $1.cols)); //#19015
    }; //#19015
    if ($eq($1.format, "full")) { //#19024
        for (var _P1 = 8, _P0 = $f($1.cols - 9); _P1 <= _P0; _P1 += 1) { //#19023
            $1.i = _P1; //#19020
            $k[$j++] = $1.pixs; //#19021
            $k[$j++] = $1.i; //#19021
            $k[$j++] = 6; //#19021
            $1.qmv(); //#19021
            var _P5 = $k[--$j]; //#19021
            $put($k[--$j], _P5, ($1.i + 1) % 2); //#19021
            $k[$j++] = $1.pixs; //#19022
            $k[$j++] = 6; //#19022
            $k[$j++] = $1.i; //#19022
            $1.qmv(); //#19022
            var _PA = $k[--$j]; //#19022
            $put($k[--$j], _PA, ($1.i + 1) % 2); //#19022
        } //#19022
    } //#19022
    if ($eq($1.format, "micro")) { //#19031
        for (var _PF = 8, _PE = $f($1.cols - 1); _PF <= _PE; _PF += 1) { //#19030
            $1.i = _PF; //#19027
            $k[$j++] = $1.pixs; //#19028
            $k[$j++] = $1.i; //#19028
            $k[$j++] = 0; //#19028
            $1.qmv(); //#19028
            var _PJ = $k[--$j]; //#19028
            $put($k[--$j], _PJ, ($1.i + 1) % 2); //#19028
            $k[$j++] = $1.pixs; //#19029
            $k[$j++] = 0; //#19029
            $k[$j++] = $1.i; //#19029
            $1.qmv(); //#19029
            var _PO = $k[--$j]; //#19029
            $put($k[--$j], _PO, ($1.i + 1) % 2); //#19029
        } //#19029
    } //#19029
    if ($eq($1.format, "rmqr")) { //#19050
        for (var _PT = 3, _PS = $f($1.cols - 4); _PT <= _PS; _PT += 1) { //#19037
            $1.i = _PT; //#19034
            $k[$j++] = $1.pixs; //#19035
            $k[$j++] = $1.i; //#19035
            $k[$j++] = 0; //#19035
            $1.qmv(); //#19035
            var _PX = $k[--$j]; //#19035
            $put($k[--$j], _PX, ($1.i + 1) % 2); //#19035
            $k[$j++] = $1.pixs; //#19036
            $k[$j++] = $1.i; //#19036
            $k[$j++] = $f($1.rows - 1); //#19036
            $1.qmv(); //#19036
            var _Pd = $k[--$j]; //#19036
            $put($k[--$j], _Pd, ($1.i + 1) % 2); //#19036
        } //#19036
        for (var _Ph = 3, _Pg = $f($1.rows - 4); _Ph <= _Pg; _Ph += 1) { //#19042
            $1.i = _Ph; //#19039
            $k[$j++] = $1.pixs; //#19040
            $k[$j++] = 0; //#19040
            $k[$j++] = $1.i; //#19040
            $1.qmv(); //#19040
            var _Pl = $k[--$j]; //#19040
            $put($k[--$j], _Pl, ($1.i + 1) % 2); //#19040
            $k[$j++] = $1.pixs; //#19041
            $k[$j++] = $f($1.cols - 1); //#19041
            $k[$j++] = $1.i; //#19041
            $1.qmv(); //#19041
            var _Pr = $k[--$j]; //#19041
            $put($k[--$j], _Pr, ($1.i + 1) % 2); //#19041
        } //#19041
        for (var _Py = $f($1.asp2 - 1), _Pz = $f($1.asp3 - $1.asp2), _Px = $f($1.cols - 13); _Pz < 0 ? _Py >= _Px : _Py <= _Px; _Py += _Pz) { //#19049
            $1.i = _Py; //#19044
            for (var _Q2 = 3, _Q1 = $f($1.rows - 4); _Q2 <= _Q1; _Q2 += 1) { //#19048
                $1.j = _Q2; //#19046
                $k[$j++] = $1.pixs; //#19047
                $k[$j++] = $1.i; //#19047
                $k[$j++] = $1.j; //#19047
                $1.qmv(); //#19047
                var _Q7 = $k[--$j]; //#19047
                $put($k[--$j], _Q7, ($1.j + 1) % 2); //#19047
            } //#19047
        } //#19047
    } //#19047
    $1.fpat = $a([$a([1, 1, 1, 1, 1, 1, 1, 0]), $a([1, 0, 0, 0, 0, 0, 1, 0]), $a([1, 0, 1, 1, 1, 0, 1, 0]), $a([1, 0, 1, 1, 1, 0, 1, 0]), $a([1, 0, 1, 1, 1, 0, 1, 0]), $a([1, 0, 0, 0, 0, 0, 1, 0]), $a([1, 1, 1, 1, 1, 1, 1, 0]), $a([0, 0, 0, 0, 0, 0, 0, 0])]); //#19062
    $1.fsubpat = $a([$a([1, 1, 1, 1, 1, 9, 9, 9]), $a([1, 0, 0, 0, 1, 9, 9, 9]), $a([1, 0, 1, 0, 1, 9, 9, 9]), $a([1, 0, 0, 0, 1, 9, 9, 9]), $a([1, 1, 1, 1, 1, 9, 9, 9]), $a([9, 9, 9, 9, 9, 9, 9, 9]), $a([9, 9, 9, 9, 9, 9, 9, 9]), $a([9, 9, 9, 9, 9, 9, 9, 9])]); //#19072
    $1.fcorpat = $a([$a([1, 1, 1, 9, 9, 9, 9, 9]), $a([1, 0, 9, 9, 9, 9, 9, 9]), $a([1, 9, 9, 9, 9, 9, 9, 9]), $a([9, 9, 9, 9, 9, 9, 9, 9]), $a([9, 9, 9, 9, 9, 9, 9, 9]), $a([9, 9, 9, 9, 9, 9, 9, 9]), $a([9, 9, 9, 9, 9, 9, 9, 9]), $a([9, 9, 9, 9, 9, 9, 9, 9])]); //#19082
    $1.fnullpat = $a([$a([9, 9, 9, 9, 9, 9, 9, 9]), $a([9, 9, 9, 9, 9, 9, 9, 9]), $a([9, 9, 9, 9, 9, 9, 9, 9]), $a([9, 9, 9, 9, 9, 9, 9, 9]), $a([9, 9, 9, 9, 9, 9, 9, 9]), $a([9, 9, 9, 9, 9, 9, 9, 9]), $a([9, 9, 9, 9, 9, 9, 9, 9]), $a([9, 9, 9, 9, 9, 9, 9, 9])]); //#19092
    var _Qy = new Map([
        ["full", $a([$1.fpat, $1.fpat, $1.fpat, $1.fnullpat])],
        ["micro", $a([$1.fpat, $1.fnullpat, $1.fnullpat, $1.fnullpat])],
        ["rmqr", $a([$1.fpat, $1.fcorpat, $1.fcorpat, $1.fsubpat])]
    ]); //#19097
    $1.fpats = $get(_Qy, $1.format); //#19098
    for (var _R1 = 0; _R1 <= 7; _R1 += 1) { //#19112
        $1.y = _R1; //#19100
        for (var _R2 = 0; _R2 <= 7; _R2 += 1) { //#19111
            $1.x = _R2; //#19102
            $1.fpb0 = $get($get($get($1.fpats, 0), $1.y), $1.x); //#19103
            $1.fpb1 = $get($get($get($1.fpats, 1), $1.y), $1.x); //#19104
            $1.fpb2 = $get($get($get($1.fpats, 2), $1.y), $1.x); //#19105
            $1.fpb3 = $get($get($get($1.fpats, 3), $1.y), $1.x); //#19106
            if (($1.fpb0 != 9) && ($1.y < $1.rows)) { //#19107
                $k[$j++] = $1.pixs; //#19107
                $k[$j++] = $1.x; //#19107
                $k[$j++] = $1.y; //#19107
                $1.qmv(); //#19107
                var _RY = $k[--$j]; //#19107
                $put($k[--$j], _RY, $1.fpb0); //#19107
            } //#19107
            if ($1.fpb1 != 9) { //#19108
                $k[$j++] = $1.pixs; //#19108
                $k[$j++] = $f($f($1.cols - $1.x) - 1); //#19108
                $k[$j++] = $1.y; //#19108
                $1.qmv(); //#19108
                var _Rg = $k[--$j]; //#19108
                $put($k[--$j], _Rg, $1.fpb1); //#19108
            } //#19108
            if ($1.fpb2 != 9) { //#19109
                $k[$j++] = $1.pixs; //#19109
                $k[$j++] = $1.x; //#19109
                $k[$j++] = $f($f($1.rows - $1.y) - 1); //#19109
                $1.qmv(); //#19109
                var _Ro = $k[--$j]; //#19109
                $put($k[--$j], _Ro, $1.fpb2); //#19109
            } //#19109
            if ($1.fpb3 != 9) { //#19110
                $k[$j++] = $1.pixs; //#19110
                $k[$j++] = $f($f($1.cols - $1.x) - 1); //#19110
                $k[$j++] = $f($f($1.rows - $1.y) - 1); //#19110
                $1.qmv(); //#19110
                var _Rx = $k[--$j]; //#19110
                $put($k[--$j], _Rx, $1.fpb3); //#19110
            } //#19110
        } //#19110
    } //#19110
    $1.putalgnpat = function() {
        $1.py = $k[--$j]; //#19116
        $1.px = $k[--$j]; //#19117
        for (var _S1 = 0; _S1 <= 4; _S1 += 1) { //#19127
            $1.pb = _S1; //#19119
            for (var _S2 = 0; _S2 <= 4; _S2 += 1) { //#19126
                $1.pa = _S2; //#19121
                $1.algnb = $get($get($1.algnpat, $1.pb), $1.pa); //#19122
                if ($1.algnb != 9) { //#19125
                    $k[$j++] = $1.pixs; //#19124
                    $k[$j++] = $f($1.px + $1.pa); //#19124
                    $k[$j++] = $f($1.py + $1.pb); //#19124
                    $1.qmv(); //#19124
                    var _SF = $k[--$j]; //#19124
                    $put($k[--$j], _SF, $1.algnb); //#19124
                } //#19124
            } //#19124
        } //#19124
    }; //#19128
    if ($eq($1.format, "full")) { //#19149
        $1.algnpat = $a([$a([1, 1, 1, 1, 1]), $a([1, 0, 0, 0, 1]), $a([1, 0, 1, 0, 1]), $a([1, 0, 0, 0, 1]), $a([1, 1, 1, 1, 1])]); //#19136
        for (var _ST = $f($1.asp2 - 2), _SU = $f($1.asp3 - $1.asp2), _SS = $f($1.cols - 13); _SU < 0 ? _ST >= _SS : _ST <= _SS; _ST += _SU) { //#19141
            $1.i = _ST; //#19138
            $k[$j++] = $1.i; //#19139
            $k[$j++] = 4; //#19139
            $1.putalgnpat(); //#19139
            $k[$j++] = 4; //#19140
            $k[$j++] = $1.i; //#19140
            $1.putalgnpat(); //#19140
        } //#19140
        for (var _Sc = $f($1.asp2 - 2), _Sd = $f($1.asp3 - $1.asp2), _Sb = $f($1.cols - 9); _Sd < 0 ? _Sc >= _Sb : _Sc <= _Sb; _Sc += _Sd) { //#19148
            $1.x = _Sc; //#19143
            for (var _Sj = $f($1.asp2 - 2), _Sk = $f($1.asp3 - $1.asp2), _Si = $f($1.rows - 9); _Sk < 0 ? _Sj >= _Si : _Sj <= _Si; _Sj += _Sk) { //#19147
                $1.y = _Sj; //#19145
                $k[$j++] = $1.x; //#19146
                $k[$j++] = $1.y; //#19146
                $1.putalgnpat(); //#19146
            } //#19146
        } //#19146
    } //#19146
    if ($eq($1.format, "rmqr")) { //#19163
        $1.algnpat = $a([$a([1, 1, 1, 9, 9]), $a([1, 0, 1, 9, 9]), $a([1, 1, 1, 9, 9]), $a([9, 9, 9, 9, 9]), $a([9, 9, 9, 9, 9])]); //#19157
        for (var _Sz = $f($1.asp2 - 2), _T0 = $f($1.asp3 - $1.asp2), _Sy = $f($1.cols - 13); _T0 < 0 ? _Sz >= _Sy : _Sz <= _Sy; _Sz += _T0) { //#19162
            $1.i = _Sz; //#19159
            $k[$j++] = $1.i; //#19160
            $k[$j++] = 0; //#19160
            $1.putalgnpat(); //#19160
            $k[$j++] = $1.i; //#19161
            $k[$j++] = $f($1.rows - 3); //#19161
            $1.putalgnpat(); //#19161
        } //#19161
    } //#19161
    var _W1 = new Map([
        ["full", $a([$a([$a([0, 8]), $a([8, $f($1.cols - 1)])]), $a([$a([1, 8]), $a([8, $f($1.cols - 2)])]), $a([$a([2, 8]), $a([8, $f($1.cols - 3)])]), $a([$a([3, 8]), $a([8, $f($1.cols - 4)])]), $a([$a([4, 8]), $a([8, $f($1.cols - 5)])]), $a([$a([5, 8]), $a([8, $f($1.cols - 6)])]), $a([$a([7, 8]), $a([8, $f($1.cols - 7)])]), $a([$a([8, 8]), $a([$f($1.cols - 8), 8])]), $a([$a([8, 7]), $a([$f($1.cols - 7), 8])]), $a([$a([8, 5]), $a([$f($1.cols - 6), 8])]), $a([$a([8, 4]), $a([$f($1.cols - 5), 8])]), $a([$a([8, 3]), $a([$f($1.cols - 4), 8])]), $a([$a([8, 2]), $a([$f($1.cols - 3), 8])]), $a([$a([8, 1]), $a([$f($1.cols - 2), 8])]), $a([$a([8, 0]), $a([$f($1.cols - 1), 8])])])],
        ["micro", $a([$a([$a([1, 8])]), $a([$a([2, 8])]), $a([$a([3, 8])]), $a([$a([4, 8])]), $a([$a([5, 8])]), $a([$a([6, 8])]), $a([$a([7, 8])]), $a([$a([8, 8])]), $a([$a([8, 7])]), $a([$a([8, 6])]), $a([$a([8, 5])]), $a([$a([8, 4])]), $a([$a([8, 3])]), $a([$a([8, 2])]), $a([$a([8, 1])])])],
        ["rmqr", $a([$a([$a([11, 3]), $a([$f($1.cols - 3), $f($1.rows - 6)])]), $a([$a([11, 2]), $a([$f($1.cols - 4), $f($1.rows - 6)])]), $a([$a([11, 1]), $a([$f($1.cols - 5), $f($1.rows - 6)])]), $a([$a([10, 5]), $a([$f($1.cols - 6), $f($1.rows - 2)])]), $a([$a([10, 4]), $a([$f($1.cols - 6), $f($1.rows - 3)])]), $a([$a([10, 3]), $a([$f($1.cols - 6), $f($1.rows - 4)])]), $a([$a([10, 2]), $a([$f($1.cols - 6), $f($1.rows - 5)])]), $a([$a([10, 1]), $a([$f($1.cols - 6), $f($1.rows - 6)])]), $a([$a([9, 5]), $a([$f($1.cols - 7), $f($1.rows - 2)])]), $a([$a([9, 4]), $a([$f($1.cols - 7), $f($1.rows - 3)])]), $a([$a([9, 3]), $a([$f($1.cols - 7), $f($1.rows - 4)])]), $a([$a([9, 2]), $a([$f($1.cols - 7), $f($1.rows - 5)])]), $a([$a([9, 1]), $a([$f($1.cols - 7), $f($1.rows - 6)])]), $a([$a([8, 5]), $a([$f($1.cols - 8), $f($1.rows - 2)])]), $a([$a([8, 4]), $a([$f($1.cols - 8), $f($1.rows - 3)])]), $a([$a([8, 3]), $a([$f($1.cols - 8), $f($1.rows - 4)])]), $a([$a([8, 2]), $a([$f($1.cols - 8), $f($1.rows - 5)])]), $a([$a([8, 1]), $a([$f($1.cols - 8), $f($1.rows - 6)])])])]
    ]); //#19185
    $1.formatmap = $get(_W1, $1.format); //#19187
    $forall($1.formatmap, function() { //#19190
        $forall($k[--$j], function() { //#19189
            $forall($k[--$j]); //#19189
            $1.qmv(); //#19189
            $put($1.pixs, $k[--$j], 1); //#19189
        }); //#19189
    }); //#19189
    if ($eq($1.format, "full") && ($1.cols >= 45)) { //#19206
        $1.versionmap = $a([$a([$a([$f($1.cols - 9), 5]), $a([5, $f($1.cols - 9)])]), $a([$a([$f($1.cols - 10), 5]), $a([5, $f($1.cols - 10)])]), $a([$a([$f($1.cols - 11), 5]), $a([5, $f($1.cols - 11)])]), $a([$a([$f($1.cols - 9), 4]), $a([4, $f($1.cols - 9)])]), $a([$a([$f($1.cols - 10), 4]), $a([4, $f($1.cols - 10)])]), $a([$a([$f($1.cols - 11), 4]), $a([4, $f($1.cols - 11)])]), $a([$a([$f($1.cols - 9), 3]), $a([3, $f($1.cols - 9)])]), $a([$a([$f($1.cols - 10), 3]), $a([3, $f($1.cols - 10)])]), $a([$a([$f($1.cols - 11), 3]), $a([3, $f($1.cols - 11)])]), $a([$a([$f($1.cols - 9), 2]), $a([2, $f($1.cols - 9)])]), $a([$a([$f($1.cols - 10), 2]), $a([2, $f($1.cols - 10)])]), $a([$a([$f($1.cols - 11), 2]), $a([2, $f($1.cols - 11)])]), $a([$a([$f($1.cols - 9), 1]), $a([1, $f($1.cols - 9)])]), $a([$a([$f($1.cols - 10), 1]), $a([1, $f($1.cols - 10)])]), $a([$a([$f($1.cols - 11), 1]), $a([1, $f($1.cols - 11)])]), $a([$a([$f($1.cols - 9), 0]), $a([0, $f($1.cols - 9)])]), $a([$a([$f($1.cols - 10), 0]), $a([0, $f($1.cols - 10)])]), $a([$a([$f($1.cols - 11), 0]), $a([0, $f($1.cols - 11)])])]); //#19204
    } else { //#19206
        $1.versionmap = $a([]); //#19206
    } //#19206
    var _Xf = $1.versionmap; //#19208
    for (var _Xg = 0, _Xh = _Xf.length; _Xg < _Xh; _Xg++) { //#19210
        $forall($get(_Xf, _Xg), function() { //#19209
            $forall($k[--$j]); //#19209
            $1.qmv(); //#19209
            $put($1.pixs, $k[--$j], 0); //#19209
        }); //#19209
    } //#19209
    if ($eq($1.format, "full")) { //#19215
        $k[$j++] = $1.pixs; //#19214
        $k[$j++] = 8; //#19214
        $k[$j++] = $f($1.rows - 8); //#19214
        $1.qmv(); //#19214
        var _Xp = $k[--$j]; //#19214
        $put($k[--$j], _Xp, 0); //#19214
    } //#19214
    var _Y9 = $a([function() {
        var _Xr = $k[--$j]; //#19220
        var _Xs = $k[--$j]; //#19220
        $k[$j++] = $f(_Xs + _Xr) % 2; //#19220
    }, function() {
        var _Xt = $k[--$j]; //#19221
        var _Xu = $k[--$j]; //#19221
        $k[$j++] = _Xt; //#19221
        $k[$j++] = _Xu; //#19221
        $j--; //#19221
        var _Xv = $k[--$j]; //#19221
        $k[$j++] = _Xv % 2; //#19221
    }, function() {
        $j--; //#19222
        var _Xw = $k[--$j]; //#19222
        $k[$j++] = _Xw % 3; //#19222
    }, function() {
        var _Xx = $k[--$j]; //#19223
        var _Xy = $k[--$j]; //#19223
        $k[$j++] = $f(_Xy + _Xx) % 3; //#19223
    }, function() {
        var _Xz = $k[--$j]; //#19224
        var _Y0 = $k[--$j]; //#19224
        $k[$j++] = ((~~(_Xz / 2)) + (~~(_Y0 / 3))) % 2; //#19224
    }, function() {
        var _Y1 = $k[--$j]; //#19225
        var _Y3 = $k[--$j] * _Y1; //#19225
        $k[$j++] = $f((_Y3 % 2) + (_Y3 % 3)); //#19225
    }, function() {
        var _Y4 = $k[--$j]; //#19226
        var _Y6 = $k[--$j] * _Y4; //#19226
        $k[$j++] = ($f((_Y6 % 2) + (_Y6 % 3))) % 2; //#19226
    }, function() {
        var _Y7 = $k[--$j]; //#19227
        var _Y8 = $k[--$j]; //#19227
        $k[$j++] = ($f(((_Y8 * _Y7) % 3) + ($f(_Y8 + _Y7) % 2))) % 2; //#19227
    }]); //#19227
    var _YK = $a([function() {
        var _YA = $k[--$j]; //#19230
        var _YB = $k[--$j]; //#19230
        $k[$j++] = _YA; //#19230
        $k[$j++] = _YB; //#19230
        $j--; //#19230
        var _YC = $k[--$j]; //#19230
        $k[$j++] = _YC % 2; //#19230
    }, function() {
        var _YD = $k[--$j]; //#19231
        var _YE = $k[--$j]; //#19231
        $k[$j++] = ((~~(_YD / 2)) + (~~(_YE / 3))) % 2; //#19231
    }, function() {
        var _YF = $k[--$j]; //#19232
        var _YH = $k[--$j] * _YF; //#19232
        $k[$j++] = ($f((_YH % 2) + (_YH % 3))) % 2; //#19232
    }, function() {
        var _YI = $k[--$j]; //#19233
        var _YJ = $k[--$j]; //#19233
        $k[$j++] = ($f(((_YJ * _YI) % 3) + ($f(_YJ + _YI) % 2))) % 2; //#19233
    }]); //#19233
    var _YN = $a([function() {
        var _YL = $k[--$j]; //#19236
        var _YM = $k[--$j]; //#19236
        $k[$j++] = ((~~(_YL / 2)) + (~~(_YM / 3))) % 2; //#19236
    }]); //#19236
    var _YO = new Map([
        ["full", _Y9],
        ["micro", _YK],
        ["rmqr", _YN]
    ]); //#19236
    $1.maskfuncs = $get(_YO, $1.format); //#19238
    if ($1.mask != -1) { //#19242
        $1.maskfuncs = $a([$get($1.maskfuncs, $1.mask - 1)]); //#19240
        $1.bestmaskval = $1.mask - 1; //#19241
    } //#19241
    $1.masks = $a($1.maskfuncs.length); //#19243
    for (var _Yb = 0, _Ya = $1.masks.length - 1; _Yb <= _Ya; _Yb += 1) { //#19257
        $1.m = _Yb; //#19245
        $1.mask = $a($1.rows * $1.cols); //#19246
        for (var _Yh = 0, _Yg = $f($1.rows - 1); _Yh <= _Yg; _Yh += 1) { //#19255
            $1.j = _Yh; //#19248
            for (var _Yk = 0, _Yj = $f($1.cols - 1); _Yk <= _Yj; _Yk += 1) { //#19254
                $1.i = _Yk; //#19250
                $k[$j++] = $1.i; //#19251
                $k[$j++] = $1.j; //#19251
                if ($get($1.maskfuncs, $1.m)() === true) {
                    break;
                } //#19251
                var _Yq = $k[--$j]; //#19251
                $k[$j++] = _Yq == 0; //#19252
                $k[$j++] = $1.pixs; //#19252
                $k[$j++] = $1.i; //#19252
                $k[$j++] = $1.j; //#19252
                $1.qmv(); //#19252
                var _Yu = $k[--$j]; //#19252
                var _Yw = $get($k[--$j], _Yu); //#19252
                var _Yx = $k[--$j]; //#19252
                var _Yy = (_Yx && (_Yw == -1)) ? 1 : 0; //#19252
                $k[$j++] = _Yy; //#19253
                $k[$j++] = $1.mask; //#19253
                $k[$j++] = $1.i; //#19253
                $k[$j++] = $1.j; //#19253
                $1.qmv(); //#19253
                var _Z2 = $k[--$j]; //#19253
                var _Z3 = $k[--$j]; //#19253
                $put(_Z3, _Z2, $k[--$j]); //#19253
            } //#19253
        } //#19253
        $put($1.masks, $1.m, $1.mask); //#19256
    } //#19256
    var _ZA = $ne($1.format, "rmqr") ? 1 : 2; //#19260
    $1.posx = $f($1.cols - _ZA); //#19260
    $1.posy = $f($1.rows - 1); //#19261
    $1.dir = -1; //#19262
    $1.col = 1; //#19263
    $1.num = 0; //#19264
    for (;;) { //#19287
        if ($1.posx < 0) { //#19266
            break; //#19266
        } //#19266
        $k[$j++] = $1.pixs; //#19267
        $k[$j++] = $1.posx; //#19267
        $k[$j++] = $1.posy; //#19267
        $1.qmv(); //#19267
        var _ZG = $k[--$j]; //#19267
        if ($get($k[--$j], _ZG) == -1) { //#19271
            var _ZL = $get($1.cws, ~~($1.num / 8)); //#19268
            var _ZN = -(7 - ($1.num % 8)); //#19268
            $k[$j++] = ((_ZN < 0 ? _ZL >>> -_ZN : _ZL << _ZN)) & 1; //#19269
            $k[$j++] = $1.pixs; //#19269
            $k[$j++] = $1.posx; //#19269
            $k[$j++] = $1.posy; //#19269
            $1.qmv(); //#19269
            var _ZR = $k[--$j]; //#19269
            var _ZS = $k[--$j]; //#19269
            $put(_ZS, _ZR, $k[--$j]); //#19269
            $1.num = $1.num + 1; //#19270
        } //#19270
        if ($1.col == 1) { //#19284
            $1.col = 0; //#19273
            $1.posx = $f($1.posx - 1); //#19274
        } else { //#19284
            $1.col = 1; //#19276
            $1.posx = $f($1.posx + 1); //#19277
            $1.posy = $f($1.posy + $1.dir); //#19278
            if (($1.posy < 0) || ($1.posy >= $1.rows)) { //#19285
                $1.dir = $1.dir * -1; //#19280
                $1.posy = $f($1.posy + $1.dir); //#19281
                $1.posx = $f($1.posx - 2); //#19282
                if ($eq($1.format, "full") && ($1.posx == 6)) { //#19284
                    $1.posx = $f($1.posx - 1); //#19284
                } //#19284
            } //#19284
        } //#19284
    } //#19284
    $1.evalfulln1n3 = function() {
        $1.scrle = $k[--$j]; //#19291
        $k[$j++] = 'scr1'; //#19293
        $k[$j++] = 0; //#19293
        $forall($1.scrle, function() { //#19293
            var _Zm = $k[--$j]; //#19293
            $k[$j++] = _Zm; //#19293
            if (_Zm >= 5) { //#19293
                var _Zn = $k[--$j]; //#19293
                var _Zp = $f($f($k[--$j] + _Zn) - 2); //#19293
                $k[$j++] = _Zp; //#19293
                $k[$j++] = _Zp; //#19293
            } //#19293
            $j--; //#19293
        }); //#19293
        var _Zq = $k[--$j]; //#19293
        $1[$k[--$j]] = _Zq; //#19293
        $1.scr3 = 0; //#19295
        for (var _Zu = 3, _Zt = $1.scrle.length - 3; _Zu <= _Zt; _Zu += 2) { //#19310
            $1.j = _Zu; //#19297
            if (($get($1.scrle, $1.j) % 3) == 0) { //#19309
                $1.fact = ~~($get($1.scrle, $1.j) / 3); //#19299
                var _a3 = $geti($1.scrle, $1.j - 2, 5); //#19300
                for (var _a4 = 0, _a5 = _a3.length; _a4 < _a5; _a4++) { //#19300
                    $k[$j++] = $get(_a3, _a4) == $1.fact; //#19300
                } //#19300
                var _a8 = $k[--$j]; //#19300
                var _a9 = $k[--$j]; //#19300
                var _aA = $k[--$j]; //#19300
                $k[$j++] = $an(_a9, _a8); //#19300
                $k[$j++] = _aA; //#19300
                $j--; //#19300
                var _aB = $k[--$j]; //#19300
                var _aC = $k[--$j]; //#19300
                var _aD = $k[--$j]; //#19300
                if (_aD && (_aC && _aB)) { //#19308
                    if (($1.j == 3) || (($1.j + 4) >= $1.scrle.length)) { //#19305
                        $1.scr3 = $1.scr3 + 40; //#19302
                    } else { //#19305
                        if (($get($1.scrle, $1.j - 3) >= 4) || ($get($1.scrle, $1.j + 3) >= 4)) { //#19306
                            $1.scr3 = $1.scr3 + 40; //#19305
                        } //#19305
                    } //#19305
                } //#19305
            } //#19305
        } //#19305
        $k[$j++] = $1.scr1; //#19311
        $k[$j++] = $1.scr3; //#19311
    }; //#19312
    $1.evalfull = function() {
        $1.sym = $k[--$j]; //#19316
        $1.n1 = 0; //#19318
        $1.n2 = 0; //#19318
        $1.n3 = 0; //#19318
        $1.rle = $a($f($1.cols + 1)); //#19319
        $1.lastpairs = $a($1.cols); //#19320
        $1.thispairs = $a($1.cols); //#19321
        $1.colsadd1 = $f($1.cols + 1); //#19322
        for (var _ab = 0, _aa = $f($1.cols - 1); _ab <= _aa; _ab += 1) { //#19361
            $1.i = _ab; //#19324
            $k[$j++] = Infinity; //#19327
            var _ad = $1.cols; //#19328
            $k[$j++] = 0; //#19330
            $k[$j++] = 0; //#19330
            for (var _af = $1.i, _ag = _ad, _ae = $f((_ad * _ad) - 1); _ag < 0 ? _af >= _ae : _af <= _ae; _af += _ag) { //#19330
                var _ai = $get($1.sym, _af); //#19329
                var _aj = $k[--$j]; //#19329
                $k[$j++] = _ai; //#19329
                if ($eq(_aj, _ai)) { //#19329
                    var _ak = $k[--$j]; //#19329
                    var _al = $k[--$j]; //#19329
                    $k[$j++] = $f(_al + 1); //#19329
                    $k[$j++] = _ak; //#19329
                } else { //#19329
                    var _am = $k[--$j]; //#19329
                    $k[$j++] = 1; //#19329
                    $k[$j++] = _am; //#19329
                } //#19329
            } //#19329
            $j--; //#19331
            var _ao = $counttomark() + 2; //#19332
            $astore($geti($1.rle, 0, _ao - 2)); //#19332
            $1.evalfulln1n3(); //#19333
            $1.n3 = $f($k[--$j] + $1.n3); //#19333
            $1.n1 = $f($k[--$j] + $1.n1); //#19333
            $j--; //#19334
            $1.symrow = $geti($1.sym, $1.i * $1.cols, $1.cols); //#19337
            $k[$j++] = Infinity; //#19338
            var _az = $1.symrow; //#19339
            $k[$j++] = 0; //#19341
            $k[$j++] = 0; //#19341
            for (var _b0 = 0, _b1 = _az.length; _b0 < _b1; _b0++) { //#19341
                var _b2 = $get(_az, _b0); //#19341
                var _b3 = $k[--$j]; //#19340
                $k[$j++] = _b2; //#19340
                if ($eq(_b3, _b2)) { //#19340
                    var _b4 = $k[--$j]; //#19340
                    var _b5 = $k[--$j]; //#19340
                    $k[$j++] = $f(_b5 + 1); //#19340
                    $k[$j++] = _b4; //#19340
                } else { //#19340
                    var _b6 = $k[--$j]; //#19340
                    $k[$j++] = 1; //#19340
                    $k[$j++] = _b6; //#19340
                } //#19340
            } //#19340
            $j--; //#19342
            var _b8 = $counttomark() + 2; //#19343
            $astore($geti($1.rle, 0, _b8 - 2)); //#19343
            $1.evalfulln1n3(); //#19344
            $1.n3 = $f($k[--$j] + $1.n3); //#19344
            $1.n1 = $f($k[--$j] + $1.n1); //#19344
            $j--; //#19345
            var _bE = $1.thispairs; //#19348
            $1.thispairs = $1.lastpairs; //#19348
            $1.lastpairs = _bE; //#19348
            var _bI = ($get($1.symrow, 0) == 1) ? 0 : 1; //#19349
            var _bJ = $1.symrow; //#19350
            $k[$j++] = _bI; //#19350
            for (var _bK = 0, _bL = _bJ.length; _bK < _bL; _bK++) { //#19350
                var _bM = $get(_bJ, _bK); //#19350
                var _bN = $k[--$j]; //#19350
                $k[$j++] = $f(_bN + _bM); //#19350
                $k[$j++] = _bM; //#19350
            } //#19350
            $j--; //#19351
            $astore($1.thispairs); //#19352
            $j--; //#19352
            if ($1.i > 0) { //#19359
                $k[$j++] = Infinity; //#19354
                $aload($1.lastpairs); //#19355
                $aload($1.thispairs); //#19355
                $k[$j++] = $1.n2; //#19356
                for (var _bU = 0, _bV = $1.cols; _bU < _bV; _bU++) { //#19356
                    var _bW = $k[--$j]; //#19356
                    var _bX = $k[--$j]; //#19356
                    $k[$j++] = _bW; //#19356
                    $k[$j++] = _bX; //#19356
                    var _bZ = $k[$j - 1 - $1.colsadd1]; //#19356
                    if (($f($k[--$j] + _bZ) & 3) == 0) { //#19356
                        var _bb = $k[--$j]; //#19356
                        $k[$j++] = $f(_bb + 3); //#19356
                    } //#19356
                } //#19356
                $1.n2 = $k[--$j]; //#19357
                $cleartomark(); //#19358
            } //#19358
        } //#19358
        $k[$j++] = 'dark'; //#19364
        $k[$j++] = 0; //#19364
        $forall($1.sym, function() { //#19364
            var _be = $k[--$j]; //#19364
            var _bf = $k[--$j]; //#19364
            $k[$j++] = $f(_bf + _be); //#19364
        }); //#19364
        var _bg = $k[--$j]; //#19364
        $1[$k[--$j]] = _bg; //#19364
        var _bj = $1.cols; //#19365
        $1.n4 = (~~((Math.abs($f((($1.dark * 100) / (_bj * _bj)) - 50))) / 5)) * 10; //#19365
        $k[$j++] = $f(($f($f($1.n1 + $1.n2) + $1.n3)) + $1.n4); //#19367
    }; //#19368
    $1.evalmicro = function() {
        $1.sym = $k[--$j]; //#19372
        $1.dkrhs = 0; //#19373
        $1.dkbot = 0; //#19373
        for (var _br = 1, _bq = $f($1.cols - 1); _br <= _bq; _br += 1) { //#19378
            $1.i = _br; //#19375
            $k[$j++] = 'dkrhs'; //#19376
            $k[$j++] = $1.dkrhs; //#19376
            $k[$j++] = $1.sym; //#19376
            $k[$j++] = $f($1.cols - 1); //#19376
            $k[$j++] = $1.i; //#19376
            $1.qmv(); //#19376
            var _bw = $k[--$j]; //#19376
            var _by = $get($k[--$j], _bw); //#19376
            var _bz = $k[--$j]; //#19376
            $1[$k[--$j]] = $f(_bz + _by); //#19376
            $k[$j++] = 'dkbot'; //#19377
            $k[$j++] = $1.dkbot; //#19377
            $k[$j++] = $1.sym; //#19377
            $k[$j++] = $1.i; //#19377
            $k[$j++] = $f($1.cols - 1); //#19377
            $1.qmv(); //#19377
            var _c5 = $k[--$j]; //#19377
            var _c7 = $get($k[--$j], _c5); //#19377
            var _c8 = $k[--$j]; //#19377
            $1[$k[--$j]] = $f(_c8 + _c7); //#19377
        } //#19377
        if ($1.dkrhs <= $1.dkbot) { //#19382
            $k[$j++] = -(($1.dkrhs * 16) + $1.dkbot); //#19380
        } else { //#19382
            $k[$j++] = -(($1.dkbot * 16) + $1.dkrhs); //#19382
        } //#19382
    }; //#19384
    $1.bestscore = 999999999; //#19387
    for (var _cI = 0, _cH = $1.masks.length - 1; _cI <= _cH; _cI += 1) { //#19409
        $1.m = _cI; //#19389
        $1.masksym = $a($1.rows * $1.cols); //#19390
        for (var _cP = 0, _cO = $f(($1.rows * $1.cols) - 1); _cP <= _cO; _cP += 1) { //#19394
            $1.i = _cP; //#19392
            $put($1.masksym, $1.i, $xo($get($1.pixs, $1.i), $get($get($1.masks, $1.m), $1.i))); //#19393
        } //#19393
        if ($1.masks.length != 1) { //#19407
            if ($eq($1.format, "full")) { //#19399
                $k[$j++] = $1.masksym; //#19397
                $1.evalfull(); //#19397
                $1.score = $k[--$j]; //#19397
            } else { //#19399
                $k[$j++] = $1.masksym; //#19399
                $1.evalmicro(); //#19399
                $1.score = $k[--$j]; //#19399
            } //#19399
            if ($1.score < $1.bestscore) { //#19405
                $1.bestsym = $1.masksym; //#19402
                $1.bestmaskval = $1.m; //#19403
                $1.bestscore = $1.score; //#19404
            } //#19404
        } else { //#19407
            $1.bestsym = $1.masksym; //#19407
        } //#19407
    } //#19407
    $1.pixs = $1.bestsym; //#19410
    if ($eq($1.format, "full")) { //#19415
        $k[$j++] = $1.pixs; //#19414
        $k[$j++] = 8; //#19414
        $k[$j++] = $f($1.cols - 8); //#19414
        $1.qmv(); //#19414
        var _cq = $k[--$j]; //#19414
        $put($k[--$j], _cq, 1); //#19414
    } //#19414
    if ($eq($1.format, "full")) { //#19433
        $1.fmtvals = $a([21522, 20773, 24188, 23371, 17913, 16590, 20375, 19104, 30660, 29427, 32170, 30877, 26159, 25368, 27713, 26998, 5769, 5054, 7399, 6608, 1890, 597, 3340, 2107, 13663, 12392, 16177, 14854, 9396, 8579, 11994, 11245]); //#19424
        $k[$j++] = 'ecid'; //#19425
        $search("MLHQ", $1.eclevel); //#19425
        $j--; //#19425
        var _cv = $k[--$j]; //#19425
        var _cw = $k[--$j]; //#19425
        $k[$j++] = _cv.length; //#19425
        $k[$j++] = _cw; //#19425
        $j--; //#19425
        var _cx = $k[--$j]; //#19425
        var _cy = $k[--$j]; //#19425
        $k[$j++] = _cx; //#19425
        $k[$j++] = _cy; //#19425
        $j--; //#19425
        var _cz = $k[--$j]; //#19425
        $1[$k[--$j]] = _cz; //#19425
        $1.fmtval = $get($1.fmtvals, ($1.ecid << 3) + $1.bestmaskval); //#19426
        for (var _d7 = 0, _d6 = $1.formatmap.length - 1; _d7 <= _d6; _d7 += 1) { //#19432
            $1.i = _d7; //#19428
            $forall($get($1.formatmap, $1.i), function() { //#19431
                var _dC = $k[--$j]; //#19430
                $k[$j++] = $1.pixs; //#19430
                $aload(_dC); //#19430
                $1.qmv(); //#19430
                var _dD = $1.fmtval; //#19430
                var _dF = -(14 - $1.i); //#19430
                var _dG = $k[--$j]; //#19430
                $put($k[--$j], _dG, ((_dF < 0 ? _dD >>> -_dF : _dD << _dF)) & 1); //#19430
            }); //#19430
        } //#19430
    } //#19430
    if ($eq($1.format, "micro")) { //#19447
        $1.fmtvals = $a([17477, 16754, 20011, 19228, 21934, 20633, 24512, 23287, 26515, 25252, 28157, 26826, 30328, 29519, 31766, 31009, 1758, 1001, 3248, 2439, 5941, 4610, 7515, 6252, 9480, 8255, 12134, 10833, 13539, 12756, 16013, 15290]); //#19440
        $1.symid = $get($get($a([$a([0]), $a([1, 2]), $a([3, 4]), $a([5, 6, 7])]), ~~($f($1.cols - 11) / 2)), $1.eclval); //#19441
        $1.fmtval = $get($1.fmtvals, ($1.symid << 2) + $1.bestmaskval); //#19442
        for (var _dZ = 0, _dY = $1.formatmap.length - 1; _dZ <= _dY; _dZ += 1) { //#19446
            $1.i = _dZ; //#19444
            $k[$j++] = $1.pixs; //#19445
            $aload($get($get($1.formatmap, $1.i), 0)); //#19445
            $1.qmv(); //#19445
            var _df = $1.fmtval; //#19445
            var _dh = -(14 - $1.i); //#19445
            var _di = $k[--$j]; //#19445
            $put($k[--$j], _di, ((_dh < 0 ? _df >>> -_dh : _df << _dh)) & 1); //#19445
        } //#19445
    } //#19445
    if ($eq($1.format, "rmqr")) { //#19477
        $1.fmtvals1 = $a([129714, 124311, 121821, 115960, 112748, 108361, 104707, 99878, 98062, 90155, 89697, 82244, 81360, 74485, 72895, 66458, 61898, 61167, 53413, 53120, 45844, 44081, 37499, 36190, 29814, 27475, 21785, 19004, 13992, 10637, 6087, 2274, 258919, 257090, 250376, 249133, 242105, 241308, 233686, 233459, 227035, 223742, 219060, 215185, 209925, 207648, 202090, 199247, 194591, 190266, 186736, 181845, 178881, 173540, 170926, 165003, 163235, 156294, 154828, 148457, 147325, 139352, 138770, 131383]); //#19458
        $1.fmtvals2 = $a([133755, 136542, 142100, 144433, 149669, 153472, 158154, 161519, 167879, 168162, 175784, 176525, 183577, 184892, 191606, 193363, 196867, 204326, 204908, 212809, 213981, 220408, 221874, 228759, 230591, 236442, 239056, 244469, 247393, 252228, 255758, 260139, 942, 7307, 8897, 15844, 16752, 24149, 24607, 32570, 34322, 39223, 42877, 47192, 50380, 56297, 58787, 64134, 67798, 71667, 76217, 79516, 84488, 87341, 93031, 95298, 101738, 102991, 109573, 111392, 118708, 118929, 126683, 127486]); //#19468
        $k[$j++] = 'fmtvalu'; //#19469
        $search("MH", $1.eclevel); //#19469
        $j--; //#19469
        var _do = $k[--$j]; //#19469
        var _dp = $k[--$j]; //#19469
        $k[$j++] = _do.length; //#19469
        $k[$j++] = _dp; //#19469
        $j--; //#19469
        var _dq = $k[--$j]; //#19469
        var _dr = $k[--$j]; //#19469
        $k[$j++] = _dq; //#19469
        $k[$j++] = _dr; //#19469
        $j--; //#19469
        var _ds = $k[--$j]; //#19469
        $1[$k[--$j]] = (_ds << 5) + $1.verind; //#19469
        $1.fmtval1 = $get($1.fmtvals1, $1.fmtvalu); //#19470
        $1.fmtval2 = $get($1.fmtvals2, $1.fmtvalu); //#19471
        for (var _e3 = 0, _e2 = $1.formatmap.length - 1; _e3 <= _e2; _e3 += 1) { //#19476
            $1.i = _e3; //#19473
            $k[$j++] = $1.pixs; //#19474
            $aload($get($get($1.formatmap, $1.i), 0)); //#19474
            $1.qmv(); //#19474
            var _e9 = $1.fmtval1; //#19474
            var _eB = -(17 - $1.i); //#19474
            var _eC = $k[--$j]; //#19474
            $put($k[--$j], _eC, ((_eB < 0 ? _e9 >>> -_eB : _e9 << _eB)) & 1); //#19474
            $k[$j++] = $1.pixs; //#19475
            $aload($get($get($1.formatmap, $1.i), 1)); //#19475
            $1.qmv(); //#19475
            var _eJ = $1.fmtval2; //#19475
            var _eL = -(17 - $1.i); //#19475
            var _eM = $k[--$j]; //#19475
            $put($k[--$j], _eM, ((_eL < 0 ? _eJ >>> -_eL : _eJ << _eL)) & 1); //#19475
        } //#19475
    } //#19475
    if ($eq($1.format, "full") && ($1.cols >= 45)) { //#19495
        $1.vervals = $a([31892, 34236, 39577, 42195, 48118, 51042, 55367, 58893, 63784, 68472, 70749, 76311, 79154, 84390, 87683, 92361, 96236, 102084, 102881, 110507, 110734, 117786, 119615, 126325, 127568, 133589, 136957, 141498, 145311, 150283, 152622, 158308, 161089, 167017]); //#19487
        $1.verval = $get($1.vervals, (~~($f($1.cols - 17) / 4)) - 7); //#19488
        for (var _eW = 0, _eV = $1.versionmap.length - 1; _eW <= _eV; _eW += 1) { //#19494
            $1.i = _eW; //#19490
            $forall($get($1.versionmap, $1.i), function() { //#19493
                var _eb = $k[--$j]; //#19492
                $k[$j++] = $1.pixs; //#19492
                $forall(_eb); //#19492
                $1.qmv(); //#19492
                var _ec = $1.verval; //#19492
                var _ee = -(17 - $1.i); //#19492
                var _ef = $k[--$j]; //#19492
                $put($k[--$j], _ef, ((_ee < 0 ? _ec >>> -_ee : _ec << _ee)) & 1); //#19492
            }); //#19492
        } //#19492
    } //#19492
    var _en = new Map([
        ["ren", bwipp_renmatrix],
        ["pixs", $1.pixs],
        ["pixx", $1.cols],
        ["pixy", $1.rows],
        ["height", ($1.rows * 2) / 72],
        ["width", ($1.cols * 2) / 72],
        ["opt", $1.options]
    ]); //#19505
    $k[$j++] = _en; //#19508
    if (!$1.dontdraw) { //#19508
        bwipp_renmatrix(); //#19508
    } //#19508
}

function bwipp_azteccode() {
    var $1 = {}; //#20399
    $1.options = $k[--$j]; //#20401
    $1.barcode = $k[--$j]; //#20402
    $1.dontdraw = false; //#20404
    $1.format = "unset"; //#20405
    $1.readerinit = false; //#20406
    $1.layers = -1; //#20407
    $1.eclevel = 23; //#20408
    $1.ecaddchars = 3; //#20409
    $1.raw = false; //#20410
    $1.parse = false; //#20411
    $1.parsefnc = false; //#20412
    $forall($1.options, function() { //#20423
        var _3 = $k[--$j]; //#20423
        $1[$k[--$j]] = _3; //#20423
    }); //#20423
    $1.layers = ~~$1.layers; //#20425
    $1.eclevel = +$1.eclevel; //#20426
    $1.ecaddchars = ~~$1.ecaddchars; //#20427
    $1.fn1 = -1; //#20430
    var _B = new Map([
        ["parse", $1.parse],
        ["parsefnc", $1.parsefnc],
        ["eci", true],
        ["FNC1", $1.fn1]
    ]); //#20435
    $1.fncvals = _B; //#20436
    $k[$j++] = 'msg'; //#20437
    $k[$j++] = $1.barcode; //#20437
    $k[$j++] = $1.fncvals; //#20437
    bwipp_parseinput(); //#20437
    var _E = $k[--$j]; //#20437
    $1[$k[--$j]] = _E; //#20437
    $1.msglen = $1.msg.length; //#20438
    $1.msgbits = ""; //#20441
    if ($ne($1.format, "rune") && $1.raw) { //#20442
        $1.msgbits = $1.barcode; //#20442
    } //#20442
    if ($ne($1.format, "rune") && (!$1.raw)) { //#20780
        $1.U = 0; //#20446
        $1.L = 1; //#20446
        $1.M = 2; //#20446
        $1.P = 3; //#20446
        $1.D = 4; //#20446
        $1.B = 5; //#20446
        $1.lu = -2; //#20449
        $1.ll = -3; //#20449
        $1.lm = -4; //#20449
        $1.lp = -5; //#20450
        $1.ld = -6; //#20450
        $1.su = -7; //#20450
        $1.sp = -8; //#20451
        $1.sb = -9; //#20451
        $1.fl = -10; //#20451
        $1.p2 = -11; //#20452
        $1.p3 = -12; //#20452
        $1.p4 = -13; //#20452
        $1.p5 = -14; //#20452
        $1.charmaps = $a([$a([$1.sp, $1.sp, $1.sp, $1.fl, $1.sp]), $a([32, 32, 32, 13, 32]), $a(["A", "a", 1, $1.p2, "0"]), $a(["B", "b", 2, $1.p3, "1"]), $a(["C", "c", 3, $1.p4, "2"]), $a(["D", "d", 4, $1.p5, "3"]), $a(["E", "e", 5, "!", "4"]), $a(["F", "f", 6, "\"", "5"]), $a(["G", "g", 7, "#", "6"]), $a(["H", "h", 8, "$", "7"]), $a(["I", "i", 9, "%", "8"]), $a(["J", "j", 10, "&", "9"]), $a(["K", "k", 11, "'", ","]), $a(["L", "l", 12, 40, "."]), $a(["M", "m", 13, 41, $1.lu]), $a(["N", "n", 27, "*", $1.su]), $a(["O", "o", 28, "+", -99]), $a(["P", "p", 29, ",", -99]), $a(["Q", "q", 30, "-", -99]), $a(["R", "r", 31, ".", -99]), $a(["S", "s", "@", "/", -99]), $a(["T", "t", 92, ":", -99]), $a(["U", "u", "^", ";", -99]), $a(["V", "v", "_", "<", -99]), $a(["W", "w", "`", "=", -99]), $a(["X", "x", "|", ">", -99]), $a(["Y", "y", "~", "?", -99]), $a(["Z", "z", 127, "[", -99]), $a([$1.ll, $1.su, $1.ll, "]", -99]), $a([$1.lm, $1.lm, $1.lu, "{", -99]), $a([$1.ld, $1.ld, $1.lp, "}", -99]), $a([$1.sb, $1.sb, $1.sb, $1.lu, -99])]); //#20489
        $1.charvals = $a([new Map, new Map, new Map, new Map, new Map]); //#20492
        for (var _1K = 0, _1J = $1.charmaps.length - 1; _1K <= _1J; _1K += 1) { //#20501
            $1.i = _1K; //#20494
            $1.encs = $get($1.charmaps, $1.i); //#20495
            for (var _1O = 0; _1O <= 4; _1O += 1) { //#20500
                $1.j = _1O; //#20497
                var _1R = $get($1.encs, $1.j); //#20498
                $k[$j++] = _1R; //#20498
                if ($eq($type(_1R), 'stringtype')) { //#20498
                    var _1U = $get($k[--$j], 0); //#20498
                    $k[$j++] = _1U; //#20498
                } //#20498
                $put($get($1.charvals, $1.j), $k[--$j], $1.i); //#20499
            } //#20499
        } //#20499
        var _1e = new Map([
            ["\x0d\x0a", $1.p2],
            [". ", $1.p3],
            [", ", $1.p4],
            [": ", $1.p5]
        ]); //#20508
        $1.pcomp = _1e; //#20509
        $1.e = 10000; //#20511
        $1.latlen = $a([$a([0, 5, 5, 10, 5, 10]), $a([9, 0, 5, 10, 5, 10]), $a([5, 5, 0, 5, 10, 10]), $a([5, 10, 10, 0, 10, 15]), $a([4, 9, 9, 14, 0, 14]), $a([0, 0, 0, 0, 0, 0])]); //#20521
        $1.latseq = $a([$a([$a([]), $a([$1.ll]), $a([$1.lm]), $a([$1.lm, $1.lp]), $a([$1.ld]), $a([$1.sb])]), $a([$a([$1.ld, $1.lu]), $a([]), $a([$1.lm]), $a([$1.lm, $1.lp]), $a([$1.ld]), $a([$1.sb])]), $a([$a([$1.lu]), $a([$1.ll]), $a([]), $a([$1.lp]), $a([$1.lu, $1.ld]), $a([$1.sb])]), $a([$a([$1.lu]), $a([$1.lu, $1.ll]), $a([$1.lu, $1.lm]), $a([]), $a([$1.lu, $1.ld]), $a([$1.lu, $1.sb])]), $a([$a([$1.lu]), $a([$1.lu, $1.ll]), $a([$1.lu, $1.lm]), $a([$1.lu, $1.lm, $1.lp]), $a([]), $a([$1.lu, $1.sb])]), $a([$a([$1.lu]), $a([$1.ll]), $a([$1.lm]), $a([]), $a([]), $a([])])]); //#20531
        $1.shftlen = $a([$a([$1.e, $1.e, $1.e, 5, $1.e]), $a([5, $1.e, $1.e, 5, $1.e]), $a([$1.e, $1.e, $1.e, 5, $1.e]), $a([$1.e, $1.e, $1.e, $1.e, $1.e]), $a([4, $1.e, $1.e, 4, $1.e])]); //#20540
        $1.charsize = function() {
            var _3X = $k[--$j]; //#20543
            $k[$j++] = _3X; //#20554
            if (_3X >= 0) { //#20552
                $j--; //#20545
                var _3a = $get($a([5, 5, 5, 5, 4, 8]), $k[--$j]); //#20545
                $k[$j++] = _3a; //#20545
            } else { //#20552
                var _3b = $k[--$j]; //#20547
                var _3c = $k[--$j]; //#20547
                $k[$j++] = _3b; //#20547
                $k[$j++] = _3c; //#20547
                $j--; //#20547
                var _3d = $k[--$j]; //#20548
                $k[$j++] = _3d; //#20553
                if (_3d == $1.fn1) { //#20552
                    $j--; //#20549
                    $k[$j++] = 8; //#20549
                } else { //#20552
                    var _3g = $f((-$k[--$j]) - 1000000); //#20551
                    $k[$j++] = _3g; //#20551
                    if (_3g == 0) { //#20551
                        $j--; //#20551
                        $k[$j++] = 1; //#20551
                    } //#20551
                    var _3h = $k[--$j]; //#20552
                    $k[$j++] = (((~~(Math.log(_3h) / Math.log(10))) + 1) * 4) + 8; //#20552
                } //#20552
            } //#20552
        }; //#20555
        $1.curlen = $a([0, $1.e, $1.e, $1.e, $1.e, $1.e]); //#20558
        $1.curseq = $a([$a([]), $a([]), $a([]), $a([]), $a([]), $a([])]); //#20559
        $1.backto = $1.U; //#20561
        $1.lastchar = ""; //#20562
        $forall($1.msg, function() { //#20664
            $1.char = $k[--$j]; //#20567
            for (;;) { //#20593
                $1.imp = false; //#20571
                var _44 = $a([$1.U, $1.L, $1.M, $1.P, $1.D, $1.B]); //#20572
                for (var _45 = 0, _46 = _44.length; _45 < _46; _45++) { //#20591
                    $1.x = $get(_44, _45); //#20573
                    var _4E = $a([$1.U, $1.L, $1.M, $1.P, $1.D, $1.B]); //#20574
                    for (var _4F = 0, _4G = _4E.length; _4F < _4G; _4F++) { //#20590
                        $1.y = $get(_4E, _4F); //#20575
                        if (($1.x != $1.B) || ($1.y == $1.backto)) { //#20589
                            $1.cost = $f($get($1.curlen, $1.x) + $get($get($1.latlen, $1.x), $1.y)); //#20577
                            if ($1.cost < $get($1.curlen, $1.y)) { //#20588
                                $put($1.curlen, $1.y, $1.cost); //#20579
                                $k[$j++] = $1.curseq; //#20582
                                $k[$j++] = $1.y; //#20582
                                $k[$j++] = Infinity; //#20582
                                $aload($get($1.curseq, $1.x)); //#20581
                                $aload($get($get($1.latseq, $1.x), $1.y)); //#20582
                                var _4l = $a(); //#20582
                                var _4m = $k[--$j]; //#20583
                                $put($k[--$j], _4m, _4l); //#20583
                                if ($1.y == $1.B) { //#20586
                                    $k[$j++] = 'backto'; //#20585
                                    if (($1.x == $1.P) || ($1.x == $1.D)) { //#20585
                                        $k[$j++] = $1.U; //#20585
                                    } else { //#20585
                                        $k[$j++] = $1.x; //#20585
                                    } //#20585
                                    var _4w = $k[--$j]; //#20585
                                    $1[$k[--$j]] = _4w; //#20585
                                } //#20585
                                $1.imp = true; //#20587
                            } //#20587
                        } //#20587
                    } //#20587
                } //#20587
                if (!$1.imp) { //#20592
                    break; //#20592
                } //#20592
            } //#20592
            $1.nxtlen = $a([$1.e, $1.e, $1.e, $1.e, $1.e, $1.e]); //#20596
            $1.nxtseq = $a(6); //#20597
            var _5D = $a([$1.U, $1.L, $1.M, $1.P, $1.D, $1.B]); //#20599
            for (var _5E = 0, _5F = _5D.length; _5E < _5F; _5E++) { //#20638
                $1.x = $get(_5D, _5E); //#20600
                for (;;) { //#20636
                    if ($1.char >= 0) { //#20608
                        if ($1.x != $1.B) { //#20606
                            var _5O = $get($get($1.charvals, $1.x), $1.char) !== undefined; //#20606
                            if (!_5O) { //#20606
                                break; //#20606
                            } //#20606
                        } //#20606
                    } else { //#20608
                        if ($1.x != $1.P) { //#20608
                            break; //#20608
                        } //#20608
                    } //#20608
                    $k[$j++] = 'cost'; //#20612
                    $k[$j++] = $get($1.curlen, $1.x); //#20612
                    $k[$j++] = $1.x; //#20612
                    $k[$j++] = $1.char; //#20612
                    $1.charsize(); //#20612
                    var _5W = $k[--$j]; //#20612
                    var _5X = $k[--$j]; //#20612
                    $1[$k[--$j]] = $f(_5X + _5W); //#20612
                    if ($1.cost < $get($1.nxtlen, $1.x)) { //#20616
                        $put($1.nxtlen, $1.x, $1.cost); //#20614
                        $k[$j++] = $1.nxtseq; //#20615
                        $k[$j++] = $1.x; //#20615
                        $k[$j++] = Infinity; //#20615
                        $aload($get($1.curseq, $1.x)); //#20615
                        $k[$j++] = $1.char; //#20615
                        var _5m = $a(); //#20615
                        var _5n = $k[--$j]; //#20615
                        $put($k[--$j], _5n, _5m); //#20615
                    } //#20615
                    if ($1.x == $1.B) { //#20619
                        break; //#20619
                    } //#20619
                    var _5w = $a([$1.U, $1.L, $1.M, $1.P, $1.D]); //#20620
                    for (var _5x = 0, _5y = _5w.length; _5x < _5y; _5x++) { //#20633
                        $1.y = $get(_5w, _5x); //#20621
                        if ($ne($1.x, $1.y)) { //#20632
                            $k[$j++] = 'cost'; //#20623
                            $k[$j++] = $f($get($1.curlen, $1.y) + $get($get($1.shftlen, $1.y), $1.x)); //#20623
                            $k[$j++] = $1.x; //#20623
                            $k[$j++] = $1.char; //#20623
                            $1.charsize(); //#20623
                            var _6C = $k[--$j]; //#20623
                            var _6D = $k[--$j]; //#20623
                            $1[$k[--$j]] = $f(_6D + _6C); //#20623
                            if ($1.cost < $get($1.nxtlen, $1.y)) { //#20631
                                $put($1.nxtlen, $1.y, $1.cost); //#20625
                                $k[$j++] = $1.nxtseq; //#20629
                                $k[$j++] = $1.y; //#20629
                                $k[$j++] = Infinity; //#20629
                                $aload($get($1.curseq, $1.y)); //#20627
                                var _6T = ($1.x == $1.U) ? $1.su : $1.sp; //#20628
                                $k[$j++] = _6T; //#20629
                                $k[$j++] = $1.char; //#20629
                                var _6V = $a(); //#20629
                                var _6W = $k[--$j]; //#20630
                                $put($k[--$j], _6W, _6V); //#20630
                            } //#20630
                        } //#20630
                    } //#20630
                    break; //#20635
                } //#20635
            } //#20635
            if ($ne($1.lastchar, "") && ($1.char >= 0)) { //#20649
                var _6a = $s(2); //#20642
                $put(_6a, 0, $1.lastchar); //#20642
                $put(_6a, 1, $1.char); //#20642
                $1.pchars = _6a; //#20642
                var _6f = $get($1.pcomp, $1.pchars) !== undefined; //#20643
                if (_6f) { //#20648
                    if ($lt($get($1.curlen, $1.P), $get($1.nxtlen, $1.P))) { //#20647
                        $put($1.nxtlen, $1.P, $get($1.curlen, $1.P)); //#20645
                        $k[$j++] = $1.nxtseq; //#20646
                        $k[$j++] = $1.P; //#20646
                        $k[$j++] = Infinity; //#20646
                        $aload($get($1.curseq, $1.P)); //#20646
                        $j--; //#20646
                        $k[$j++] = $get($1.pcomp, $1.pchars); //#20646
                        var _6z = $a(); //#20646
                        var _70 = $k[--$j]; //#20646
                        $put($k[--$j], _70, _6z); //#20646
                    } //#20646
                } //#20646
            } //#20646
            if ($ne($get($1.nxtseq, $1.B), null)) { //#20658
                $1.numbytes = 0; //#20653
                $forall($get($1.nxtseq, $1.B), function() { //#20656
                    if ($k[--$j] == $1.sb) { //#20655
                        $k[$j++] = 0; //#20655
                    } else { //#20655
                        $k[$j++] = $1.numbytes + 1; //#20655
                    } //#20655
                    $1.numbytes = $k[--$j]; //#20655
                }); //#20655
                if ($1.numbytes == 32) { //#20657
                    $put($1.nxtlen, $1.B, $f($get($1.nxtlen, $1.B) + 11)); //#20657
                } //#20657
            } //#20657
            $1.curlen = $1.nxtlen; //#20660
            $1.curseq = $1.nxtseq; //#20661
            $k[$j++] = 'lastchar'; //#20662
            if ($1.char >= 0) { //#20662
                $k[$j++] = $1.char; //#20662
            } else { //#20662
                $k[$j++] = ""; //#20662
            } //#20662
            var _7M = $k[--$j]; //#20662
            $1[$k[--$j]] = _7M; //#20662
        }); //#20662
        $1.minseq = $1.e; //#20667
        var _7V = $a([$1.U, $1.L, $1.M, $1.P, $1.D, $1.B]); //#20668
        for (var _7W = 0, _7X = _7V.length; _7W < _7X; _7W++) { //#20674
            $1.i = $get(_7V, _7W); //#20669
            if ($get($1.curlen, $1.i) < $1.minseq) { //#20673
                $1.minseq = $get($1.curlen, $1.i); //#20671
                $1.seq = $get($1.curseq, $1.i); //#20672
            } //#20672
        } //#20672
        $1.tobin = function() {
            var _7k = $s($k[--$j]); //#20678
            $k[$j++] = _7k; //#20678
            for (var _7m = 0, _7l = _7k.length - 1; _7m <= _7l; _7m += 1) { //#20678
                var _7n = $k[--$j]; //#20678
                $put(_7n, _7m, 48); //#20678
                $k[$j++] = _7n; //#20678
            } //#20678
            var _7o = $k[--$j]; //#20679
            var _7r = $cvrs($s(_7o.length), $k[--$j], 2); //#20679
            $puti(_7o, _7o.length - _7r.length, _7r); //#20679
            $k[$j++] = _7o; //#20679
        }; //#20680
        $1.encu = function() {
            var _7w = $get($get($1.charvals, $1.U), $k[--$j]); //#20682
            $k[$j++] = _7w; //#20682
            $k[$j++] = 5; //#20682
            $1.tobin(); //#20682
        }; //#20682
        $1.encl = function() {
            var _81 = $get($get($1.charvals, $1.L), $k[--$j]); //#20683
            $k[$j++] = _81; //#20683
            $k[$j++] = 5; //#20683
            $1.tobin(); //#20683
        }; //#20683
        $1.encm = function() {
            var _86 = $get($get($1.charvals, $1.M), $k[--$j]); //#20684
            $k[$j++] = _86; //#20684
            $k[$j++] = 5; //#20684
            $1.tobin(); //#20684
        }; //#20684
        $1.encd = function() {
            var _8B = $get($get($1.charvals, $1.D), $k[--$j]); //#20685
            $k[$j++] = _8B; //#20685
            $k[$j++] = 4; //#20685
            $1.tobin(); //#20685
        }; //#20685
        $1.encp = function() {
            var _8C = $k[--$j]; //#20688
            $k[$j++] = _8C; //#20705
            if (_8C == $1.fn1) { //#20704
                $j--; //#20689
                $k[$j++] = "00000000"; //#20689
            } else { //#20704
                var _8E = $k[--$j]; //#20691
                $k[$j++] = _8E; //#20705
                if (_8E <= -1000000) { //#20704
                    var _8G = $f((-$k[--$j]) - 1000000); //#20692
                    $k[$j++] = _8G; //#20692
                    $k[$j++] = _8G; //#20692
                    if (_8G == 0) { //#20692
                        $j--; //#20692
                        $k[$j++] = 1; //#20692
                    } //#20692
                    var _8I = ~~(Math.log($k[--$j]) / Math.log(10)); //#20694
                    var _8J = $s(((_8I + 1) * 4) + 8); //#20694
                    $puti(_8J, 0, "00000"); //#20695
                    $k[$j++] = _8I; //#20696
                    $k[$j++] = _8J; //#20696
                    $k[$j++] = _8J; //#20696
                    $k[$j++] = _8I + 1; //#20696
                    $k[$j++] = 3; //#20696
                    $1.tobin(); //#20696
                    var _8K = $k[--$j]; //#20696
                    $puti($k[--$j], 5, _8K); //#20696
                    var _8M = $k[--$j]; //#20697
                    var _8N = $k[--$j]; //#20697
                    var _8O = $k[--$j]; //#20697
                    $k[$j++] = _8M; //#20701
                    $k[$j++] = _8O; //#20701
                    for (var _8P = _8N; _8P >= 0; _8P -= 1) { //#20701
                        var _8Q = $k[--$j]; //#20698
                        var _8R = $k[--$j]; //#20699
                        $k[$j++] = _8R; //#20700
                        $k[$j++] = ~~(_8Q / 10); //#20700
                        $k[$j++] = _8R; //#20700
                        $k[$j++] = (_8P * 4) + 8; //#20700
                        $k[$j++] = $f((_8Q % 10) + 2); //#20700
                        $k[$j++] = 4; //#20700
                        $1.tobin(); //#20700
                        var _8S = $k[--$j]; //#20700
                        var _8T = $k[--$j]; //#20700
                        $puti($k[--$j], _8T, _8S); //#20700
                    } //#20700
                    $j--; //#20702
                } else { //#20704
                    var _8Z = $get($get($1.charvals, $1.P), $k[--$j]); //#20704
                    $k[$j++] = _8Z; //#20704
                    $k[$j++] = 5; //#20704
                    $1.tobin(); //#20704
                } //#20704
            } //#20704
        }; //#20706
        $1.encfuncs = $a(['encu', 'encl', 'encm', 'encp', 'encd']); //#20708
        $1.addtomsgbits = function() {
            $1.v = $k[--$j]; //#20711
            $puti($1.msgbits, $1.j, $1.v); //#20712
            $1.j = $1.j + $1.v.length; //#20713
        }; //#20714
        $1.state = $1.U; //#20717
        $1.msgbits = $s($1.minseq); //#20718
        $1.i = 0; //#20719
        $1.j = 0; //#20719
        for (;;) { //#20778
            if ($1.i >= $1.seq.length) { //#20720
                break; //#20720
            } //#20720
            if ($1.state != $1.B) { //#20773
                $1.char = $get($1.seq, $1.i); //#20724
                $k[$j++] = $1.char; //#20727
                if ($1[$get($1.encfuncs, $1.state)]() === true) {
                    break;
                } //#20727
                $1.addtomsgbits(); //#20727
                $1.i = $1.i + 1; //#20728
                if (($1.char == $1.su) || ($1.char == $1.sp)) { //#20734
                    $k[$j++] = $get($1.seq, $1.i); //#20732
                    if ($1.char == $1.su) { //#20732
                        $1.encu(); //#20732
                    } else { //#20732
                        $1.encp(); //#20732
                    } //#20732
                    $1.addtomsgbits(); //#20732
                    $1.i = $1.i + 1; //#20733
                } //#20733
                if ($1.char == $1.lu) { //#20737
                    $1.state = $1.U; //#20737
                } //#20737
                if ($1.char == $1.ll) { //#20738
                    $1.state = $1.L; //#20738
                } //#20738
                if ($1.char == $1.lm) { //#20739
                    $1.state = $1.M; //#20739
                } //#20739
                if ($1.char == $1.lp) { //#20740
                    $1.state = $1.P; //#20740
                } //#20740
                if ($1.char == $1.ld) { //#20741
                    $1.state = $1.D; //#20741
                } //#20741
                if ($1.char == $1.sb) { //#20742
                    $1.state = $1.B; //#20742
                } //#20742
            } else { //#20773
                $1.numbytes = 0; //#20747
                for (;;) { //#20751
                    if (($1.i + $1.numbytes) >= $1.seq.length) { //#20748
                        break; //#20748
                    } //#20748
                    if ($get($1.seq, $1.i + $1.numbytes) < 0) { //#20749
                        break; //#20749
                    } //#20749
                    $1.numbytes = $1.numbytes + 1; //#20750
                } //#20750
                if ($1.numbytes <= 31) { //#20758
                    $k[$j++] = $1.numbytes; //#20755
                    $k[$j++] = 5; //#20755
                    $1.tobin(); //#20755
                    $1.addtomsgbits(); //#20755
                } else { //#20758
                    $k[$j++] = 0; //#20757
                    $k[$j++] = 5; //#20757
                    $1.tobin(); //#20757
                    $1.addtomsgbits(); //#20757
                    $k[$j++] = $1.numbytes - 31; //#20758
                    $k[$j++] = 11; //#20758
                    $1.tobin(); //#20758
                    $1.addtomsgbits(); //#20758
                } //#20758
                for (var _9b = 0, _9c = $1.numbytes; _9b < _9c; _9b++) { //#20765
                    $k[$j++] = $get($1.seq, $1.i); //#20763
                    $k[$j++] = 8; //#20763
                    $1.tobin(); //#20763
                    $1.addtomsgbits(); //#20763
                    $1.i = $1.i + 1; //#20764
                } //#20764
                if ($1.i < $1.seq.length) { //#20774
                    $1.char = $get($1.seq, $1.i); //#20769
                    $1.i = $1.i + 1; //#20770
                    if ($1.char == $1.lu) { //#20771
                        $1.state = $1.U; //#20771
                    } //#20771
                    if ($1.char == $1.ll) { //#20772
                        $1.state = $1.L; //#20772
                    } //#20772
                    if ($1.char == $1.lm) { //#20773
                        $1.state = $1.M; //#20773
                    } //#20773
                } //#20773
            } //#20773
        } //#20773
    } //#20773
    $1.metrics = $a([$a(["rune", 0, 0, 0, 6]), $a(["compact", 1, 1, 17, 6]), $a(["full", 1, 1, 21, 6]), $a(["compact", 2, 0, 40, 6]), $a(["full", 2, 1, 48, 6]), $a(["compact", 3, 0, 51, 8]), $a(["full", 3, 1, 60, 8]), $a(["compact", 4, 0, 76, 8]), $a(["full", 4, 1, 88, 8]), $a(["full", 5, 1, 120, 8]), $a(["full", 6, 1, 156, 8]), $a(["full", 7, 1, 196, 8]), $a(["full", 8, 1, 240, 8]), $a(["full", 9, 1, 230, 10]), $a(["full", 10, 1, 272, 10]), $a(["full", 11, 1, 316, 10]), $a(["full", 12, 1, 364, 10]), $a(["full", 13, 1, 416, 10]), $a(["full", 14, 1, 470, 10]), $a(["full", 15, 1, 528, 10]), $a(["full", 16, 1, 588, 10]), $a(["full", 17, 1, 652, 10]), $a(["full", 18, 1, 720, 10]), $a(["full", 19, 1, 790, 10]), $a(["full", 20, 1, 864, 10]), $a(["full", 21, 1, 940, 10]), $a(["full", 22, 1, 1020, 10]), $a(["full", 23, 0, 920, 12]), $a(["full", 24, 0, 992, 12]), $a(["full", 25, 0, 1066, 12]), $a(["full", 26, 0, 1144, 12]), $a(["full", 27, 0, 1224, 12]), $a(["full", 28, 0, 1306, 12]), $a(["full", 29, 0, 1392, 12]), $a(["full", 30, 0, 1480, 12]), $a(["full", 31, 0, 1570, 12]), $a(["full", 32, 0, 1664, 12])]); //#20797
    $1.i = 0; //#20799
    for (;;) { //#20817
        $1.m = $get($1.metrics, $1.i); //#20801
        $1.frmt = $get($1.m, 0); //#20802
        $1.mlyr = $get($1.m, 1); //#20803
        $1.icap = $get($1.m, 2); //#20804
        $1.ncws = $get($1.m, 3); //#20805
        $1.bpcw = $get($1.m, 4); //#20806
        $1.numecw = ~~(Math.ceil($f((($1.ncws * $1.eclevel) / 100) + $1.ecaddchars))); //#20807
        if ($1.msgbits.length == 0) { //#20808
            $1.numecw = 0; //#20808
        } //#20808
        $1.numdcw = $f($1.ncws - $1.numecw); //#20809
        $1.okay = true; //#20810
        if ($ne($1.format, "unset") && $ne($1.format, $1.frmt)) { //#20811
            $1.okay = false; //#20811
        } //#20811
        if ($1.readerinit && ($1.icap != 1)) { //#20812
            $1.okay = false; //#20812
        } //#20812
        if (($1.layers != -1) && ($1.layers != $1.mlyr)) { //#20813
            $1.okay = false; //#20813
        } //#20813
        if ((~~Math.ceil($1.msgbits.length / $1.bpcw)) > $1.numdcw) { //#20814
            $1.okay = false; //#20814
        } //#20814
        if ($1.okay) { //#20815
            break; //#20815
        } //#20815
        $1.i = $1.i + 1; //#20816
    } //#20816
    $1.layers = $1.mlyr; //#20818
    $1.format = $1.frmt; //#20819
    $1.allzero = function() {
        var _B6 = $k[--$j]; //#20822
        $k[$j++] = $eq(_B6, $geti("000000000000", 0, _B6.length)); //#20822
    }; //#20822
    $1.allones = function() {
        var _B8 = $k[--$j]; //#20823
        $k[$j++] = $eq(_B8, $geti("111111111111", 0, _B8.length)); //#20823
    }; //#20823
    $1.cws = $a($1.ncws); //#20824
    $1.m = 0; //#20825
    $1.c = 0; //#20825
    for (;;) { //#20852
        if ($1.msgbits.length <= $1.m) { //#20827
            break; //#20827
        } //#20827
        if (($1.msgbits.length - $1.m) >= $1.bpcw) { //#20841
            $1.cwb = $geti($1.msgbits, $1.m, $f($1.bpcw - 1)); //#20829
            $1.cwf = $geti($1.msgbits, $f($f($1.m + $1.bpcw) - 1), 1); //#20830
            $k[$j++] = $1.cwb; //#20831
            $1.allzero(); //#20831
            if ($k[--$j]) { //#20831
                $1.cwf = "1"; //#20831
                $1.m = $1.m - 1; //#20831
            } //#20831
            $k[$j++] = $1.cwb; //#20832
            $1.allones(); //#20832
            if ($k[--$j]) { //#20832
                $1.cwf = "0"; //#20832
                $1.m = $1.m - 1; //#20832
            } //#20832
            var _BV = $s(12); //#20834
            $puti(_BV, 0, $1.cwb); //#20834
            $puti(_BV, $f($1.bpcw - 1), $1.cwf); //#20835
            $1.cwb = $geti(_BV, 0, $1.bpcw); //#20837
        } else { //#20841
            $1.cwb = $geti($1.msgbits, $1.m, $1.msgbits.length - $1.m); //#20839
            var _Bh = $strcpy($s(12), "111111111111"); //#20840
            $puti(_Bh, 0, $1.cwb); //#20840
            $1.cwb = $geti(_Bh, 0, $1.bpcw); //#20840
            $k[$j++] = $1.cwb; //#20841
            $1.allones(); //#20841
            if ($k[--$j]) { //#20841
                $puti($1.cwb, $1.cwb.length - 1, "0"); //#20841
            } //#20841
        } //#20841
        $1.cw = 0; //#20844
        for (var _Br = 0, _Bq = $f($1.bpcw - 1); _Br <= _Bq; _Br += 1) { //#20848
            $1.i = _Br; //#20846
            $1.cw = $f($1.cw + ((~~(Math.pow(2, $f($f($1.bpcw - $1.i) - 1)))) * $f($get($1.cwb, $1.i) - 48))); //#20847
        } //#20847
        $put($1.cws, $1.c, $1.cw); //#20849
        $1.m = $f($1.m + $1.bpcw); //#20850
        $1.c = $1.c + 1; //#20851
    } //#20851
    $1.cws = $geti($1.cws, 0, $1.c); //#20853
    $1.rscodes = function() {
        $1.rspm = $k[--$j]; //#20858
        $1.rsgf = $k[--$j]; //#20859
        $1.rsnc = $k[--$j]; //#20860
        $1.rscws = $k[--$j]; //#20861
        $k[$j++] = Infinity; //#20864
        $k[$j++] = 1; //#20864
        for (var _CC = 0, _CD = $f($1.rsgf - 1); _CC < _CD; _CC++) { //#20864
            var _CE = $k[--$j]; //#20864
            var _CF = _CE * 2; //#20864
            $k[$j++] = _CE; //#20864
            $k[$j++] = _CF; //#20864
            if (_CF >= $1.rsgf) { //#20864
                var _CI = $k[--$j]; //#20864
                $k[$j++] = $xo(_CI, $1.rspm); //#20864
            } //#20864
        } //#20864
        $1.rsalog = $a(); //#20864
        $1.rslog = $a($1.rsgf); //#20865
        for (var _CO = 1, _CN = $f($1.rsgf - 1); _CO <= _CN; _CO += 1) { //#20866
            $put($1.rslog, $get($1.rsalog, _CO), _CO); //#20866
        } //#20866
        $1.rsprod = function() {
            var _CS = $k[--$j]; //#20870
            var _CT = $k[--$j]; //#20870
            $k[$j++] = _CT; //#20874
            $k[$j++] = _CS; //#20874
            if ((_CS != 0) && (_CT != 0)) { //#20873
                var _CW = $get($1.rslog, $k[--$j]); //#20871
                var _Cc = $get($1.rsalog, $f(_CW + $get($1.rslog, $k[--$j])) % $f($1.rsgf - 1)); //#20871
                $k[$j++] = _Cc; //#20871
            } else { //#20873
                $j -= 2; //#20873
                $k[$j++] = 0; //#20873
            } //#20873
        }; //#20875
        $k[$j++] = Infinity; //#20878
        $k[$j++] = 1; //#20878
        for (var _Ce = 0, _Cf = $1.rsnc; _Ce < _Cf; _Ce++) { //#20878
            $k[$j++] = 0; //#20878
        } //#20878
        $1.coeffs = $a(); //#20878
        for (var _Cj = 1, _Ci = $1.rsnc; _Cj <= _Ci; _Cj += 1) { //#20887
            $1.i = _Cj; //#20880
            $put($1.coeffs, $1.i, $get($1.coeffs, $1.i - 1)); //#20881
            for (var _Cq = $1.i - 1; _Cq >= 1; _Cq -= 1) { //#20885
                $1.j = _Cq; //#20883
                $k[$j++] = $1.coeffs; //#20884
                $k[$j++] = $1.j; //#20884
                $k[$j++] = $get($1.coeffs, $1.j - 1); //#20884
                $k[$j++] = $get($1.coeffs, $1.j); //#20884
                $k[$j++] = $get($1.rsalog, $1.i); //#20884
                $1.rsprod(); //#20884
                var _D2 = $k[--$j]; //#20884
                var _D3 = $k[--$j]; //#20884
                var _D4 = $k[--$j]; //#20884
                $put($k[--$j], _D4, $xo(_D3, _D2)); //#20884
            } //#20884
            $k[$j++] = $1.coeffs; //#20886
            $k[$j++] = 0; //#20886
            $k[$j++] = $get($1.coeffs, 0); //#20886
            $k[$j++] = $get($1.rsalog, $1.i); //#20886
            $1.rsprod(); //#20886
            var _DC = $k[--$j]; //#20886
            var _DD = $k[--$j]; //#20886
            $put($k[--$j], _DD, _DC); //#20886
        } //#20886
        $1.nd = $1.rscws.length; //#20890
        $k[$j++] = Infinity; //#20891
        $forall($1.rscws); //#20891
        for (var _DI = 0, _DJ = $1.rsnc; _DI < _DJ; _DI++) { //#20891
            $k[$j++] = 0; //#20891
        } //#20891
        $k[$j++] = 0; //#20891
        $1.rscws = $a(); //#20891
        for (var _DN = 0, _DM = $1.nd - 1; _DN <= _DM; _DN += 1) { //#20898
            $1.k = $xo($get($1.rscws, _DN), $get($1.rscws, $1.nd)); //#20893
            for (var _DV = 0, _DU = $f($1.rsnc - 1); _DV <= _DU; _DV += 1) { //#20897
                $1.j = _DV; //#20895
                $k[$j++] = $1.rscws; //#20896
                $k[$j++] = $1.nd + $1.j; //#20896
                $k[$j++] = $get($1.rscws, ($1.nd + $1.j) + 1); //#20896
                $k[$j++] = $1.k; //#20896
                $k[$j++] = $get($1.coeffs, $f($f($1.rsnc - $1.j) - 1)); //#20896
                $1.rsprod(); //#20896
                var _Di = $k[--$j]; //#20896
                var _Dj = $k[--$j]; //#20896
                var _Dk = $k[--$j]; //#20896
                $put($k[--$j], _Dk, $xo(_Dj, _Di)); //#20896
            } //#20896
        } //#20896
        $k[$j++] = $geti($1.rscws, 0, $1.rscws.length - 1); //#20901
    }; //#20903
    if ($eq($1.format, "full")) { //#20916
        $1.mode = ($f($1.layers - 1) << 11) + ($1.cws.length - 1); //#20907
        if ($1.readerinit) { //#20908
            $1.mode = $1.mode | 1024; //#20908
        } //#20908
        $1.mode = $a([($1.mode & 61440) >>> 12, ($1.mode & 3840) >>> 8, ($1.mode & 240) >>> 4, $1.mode & 15]); //#20914
        $k[$j++] = 'mode'; //#20915
        $k[$j++] = $1.mode; //#20915
        $k[$j++] = 6; //#20915
        $k[$j++] = 16; //#20915
        $k[$j++] = 19; //#20915
        $1.rscodes(); //#20915
        var _E0 = $k[--$j]; //#20915
        $1[$k[--$j]] = _E0; //#20915
    } //#20915
    if ($eq($1.format, "compact")) { //#20925
        $1.mode = ($f($1.layers - 1) << 6) + ($1.cws.length - 1); //#20918
        if ($1.readerinit) { //#20919
            $1.mode = $1.mode | 32; //#20919
        } //#20919
        $1.mode = $a([($1.mode & 240) >>> 4, $1.mode & 15]); //#20923
        $k[$j++] = 'mode'; //#20924
        $k[$j++] = $1.mode; //#20924
        $k[$j++] = 5; //#20924
        $k[$j++] = 16; //#20924
        $k[$j++] = 19; //#20924
        $1.rscodes(); //#20924
        var _EB = $k[--$j]; //#20924
        $1[$k[--$j]] = _EB; //#20924
    } //#20924
    if ($eq($1.format, "rune")) { //#20934
        $1.mode = ~~$z($1.barcode); //#20927
        $1.mode = $a([($1.mode & 240) >>> 4, $1.mode & 15]); //#20931
        $k[$j++] = 'mode'; //#20932
        $k[$j++] = $1.mode; //#20932
        $k[$j++] = 5; //#20932
        $k[$j++] = 16; //#20932
        $k[$j++] = 19; //#20932
        $1.rscodes(); //#20932
        var _EJ = $k[--$j]; //#20932
        $1[$k[--$j]] = _EJ; //#20932
        $k[$j++] = Infinity; //#20933
        var _EL = $1.mode; //#20933
        for (var _EM = 0, _EN = _EL.length; _EM < _EN; _EM++) { //#20933
            $k[$j++] = $get(_EL, _EM) ^ 10; //#20933
        } //#20933
        $1.mode = $a(); //#20933
    } //#20933
    $1.modebits = $s($1.mode.length * 4); //#20935
    for (var _EU = 0, _ET = $1.modebits.length - 1; _EU <= _ET; _EU += 1) { //#20936
        $puti($1.modebits, _EU, "0"); //#20936
    } //#20936
    for (var _EY = 0, _EX = $1.mode.length - 1; _EY <= _EX; _EY += 1) { //#20940
        $1.i = _EY; //#20938
        var _Ee = $cvrs($s(4), $get($1.mode, $1.i), 2); //#20939
        $puti($1.modebits, (4 - _Ee.length) + (4 * $1.i), _Ee); //#20939
    } //#20939
    $1.rsparams = $a([$a([]), $a([]), $a([]), $a([]), $a([]), $a([]), $a([64, 67]), $a([]), $a([256, 301]), $a([]), $a([1024, 1033]), $a([]), $a([4096, 4201])]); //#20952
    $k[$j++] = 'cws'; //#20953
    $k[$j++] = $1.cws; //#20953
    $k[$j++] = $f($1.ncws - $1.cws.length); //#20953
    $forall($get($1.rsparams, $1.bpcw)); //#20953
    $1.rscodes(); //#20953
    var _F0 = $k[--$j]; //#20953
    $1[$k[--$j]] = _F0; //#20953
    if ($eq($1.format, "full")) { //#20957
        $1.databits = $s($f((($1.layers * $1.layers) * 16) + ($1.layers * 112))); //#20955
    } else { //#20957
        $1.databits = $s($f((($1.layers * $1.layers) * 16) + ($1.layers * 88))); //#20957
    } //#20957
    for (var _FD = 0, _FC = $1.databits.length - 1; _FD <= _FC; _FD += 1) { //#20959
        $puti($1.databits, _FD, "0"); //#20959
    } //#20959
    for (var _FH = 0, _FG = $f($1.ncws - 1); _FH <= _FG; _FH += 1) { //#20965
        $1.i = _FH; //#20961
        var _FO = $cvrs($s($1.bpcw), $get($1.cws, $1.i), 2); //#20962
        $puti($1.databits, $f(($f($f($1.bpcw - _FO.length) + ($1.bpcw * $1.i))) + ($f($1.databits.length - ($1.ncws * $1.bpcw)))), _FO); //#20964
    } //#20964
    $1.cmv = function() {
        var _FW = $k[--$j]; //#20968
        var _FX = $k[--$j]; //#20968
        $k[$j++] = $f(($f(_FX - (_FW * $1.size))) + $1.mid); //#20968
    }; //#20968
    $1.lmv = function() {
        $1.lbit = $k[--$j]; //#20972
        $1.llyr = $k[--$j]; //#20973
        $1.lwid = $f($1.fw + ($1.llyr * 4)); //#20974
        $1.ldir = ~~((~~($1.lbit / 2)) / $1.lwid); //#20975
        if ($1.ldir == 0) { //#20980
            $k[$j++] = $f(((-(~~($f($1.lwid - 1) / 2))) + 1) + ((~~($1.lbit / 2)) % $1.lwid)); //#20979
            $k[$j++] = $f(($f((~~(($1.fw - 1) / 2)) + ($1.llyr * 2))) + ($1.lbit % 2)); //#20979
            $1.cmv(); //#20979
        } //#20979
        if ($1.ldir == 1) { //#20985
            $k[$j++] = $f(($f((~~($1.fw / 2)) + ($1.llyr * 2))) + ($1.lbit % 2)); //#20984
            $k[$j++] = $f(((~~($f($1.lwid - 1) / 2)) - 1) - ((~~($1.lbit / 2)) % $1.lwid)); //#20984
            $1.cmv(); //#20984
        } //#20984
        if ($1.ldir == 2) { //#20990
            $k[$j++] = -($f(((-(~~($1.lwid / 2))) + 1) + ((~~($1.lbit / 2)) % $1.lwid))); //#20989
            $k[$j++] = -($f(($f((~~($1.fw / 2)) + ($1.llyr * 2))) + ($1.lbit % 2))); //#20989
            $1.cmv(); //#20989
        } //#20989
        if ($1.ldir == 3) { //#20995
            $k[$j++] = -($f(($f((~~(($1.fw - 1) / 2)) + ($1.llyr * 2))) + ($1.lbit % 2))); //#20994
            $k[$j++] = -($f(((~~($1.lwid / 2)) - 1) - ((~~($1.lbit / 2)) % $1.lwid))); //#20994
            $1.cmv(); //#20994
        } //#20994
    }; //#20996
    if ($eq($1.format, "full")) { //#21000
        $1.fw = 12; //#21000
    } else { //#21000
        $1.fw = 9; //#21000
    } //#21000
    $1.size = $f(($f($1.fw + ($1.layers * 4))) + 2); //#21001
    $k[$j++] = Infinity; //#21002
    for (var _GC = 0, _GD = $1.size * $1.size; _GC < _GD; _GC++) { //#21002
        $k[$j++] = -1; //#21002
    } //#21002
    $1.pixs = $a(); //#21002
    $1.mid = $f(((~~($f($1.size - 1) / 2)) * $1.size) + (~~($f($1.size - 1) / 2))); //#21003
    $1.i = 0; //#21006
    for (var _GK = 1, _GJ = $1.layers; _GK <= _GJ; _GK += 1) { //#21014
        $1.layer = _GK; //#21008
        for (var _GO = 0, _GN = (($1.fw + ($1.layer * 4)) * 8) - 1; _GO <= _GN; _GO += 1) { //#21013
            $1.pos = _GO; //#21010
            $k[$j++] = $1.pixs; //#21011
            $k[$j++] = $1.layer; //#21011
            $k[$j++] = $1.pos; //#21011
            $1.lmv(); //#21011
            var _GW = $k[--$j]; //#21011
            $put($k[--$j], _GW, $get($1.databits, ($1.databits.length - $1.i) - 1) - 48); //#21011
            $1.i = $1.i + 1; //#21012
        } //#21012
    } //#21012
    if ($eq($1.format, "full")) { //#21041
        $1.fw = 13; //#21018
        $1.size = $f(($f(($f($1.fw + ($1.layers * 4))) + 2)) + ((~~($f(($f($1.layers + 10.5) / 7.5) - 1))) * 2)); //#21019
        $1.mid = ~~(($1.size * $1.size) / 2); //#21020
        $k[$j++] = Infinity; //#21021
        for (var _Gh = 0, _Gi = $1.size * $1.size; _Gh < _Gi; _Gh++) { //#21021
            $k[$j++] = -2; //#21021
        } //#21021
        $1.npixs = $a(); //#21021
        for (var _Gm = 0, _Gl = ~~($1.size / 2); _Gm <= _Gl; _Gm += 16) { //#21031
            $1.i = _Gm; //#21023
            for (var _Gp = 0, _Go = $f($1.size - 1); _Gp <= _Go; _Gp += 1) { //#21030
                $1.j = _Gp; //#21025
                $k[$j++] = $1.npixs; //#21026
                $k[$j++] = (-(~~($1.size / 2))) + $1.j; //#21026
                $k[$j++] = $1.i; //#21026
                $1.cmv(); //#21026
                var _Gy = $k[--$j]; //#21026
                $puti($k[--$j], _Gy, $a([((((~~($1.size / 2)) + $1.j) + $1.i) + 1) % 2])); //#21026
                $k[$j++] = $1.npixs; //#21027
                $k[$j++] = (-(~~($1.size / 2))) + $1.j; //#21027
                $k[$j++] = -$1.i; //#21027
                $1.cmv(); //#21027
                var _H8 = $k[--$j]; //#21027
                $puti($k[--$j], _H8, $a([((((~~($1.size / 2)) + $1.j) + $1.i) + 1) % 2])); //#21027
                $k[$j++] = $1.npixs; //#21028
                $k[$j++] = $1.i; //#21028
                $k[$j++] = (-(~~($1.size / 2))) + $1.j; //#21028
                $1.cmv(); //#21028
                var _HI = $k[--$j]; //#21028
                $puti($k[--$j], _HI, $a([((((~~($1.size / 2)) + $1.j) + $1.i) + 1) % 2])); //#21028
                $k[$j++] = $1.npixs; //#21029
                $k[$j++] = -$1.i; //#21029
                $k[$j++] = (-(~~($1.size / 2))) + $1.j; //#21029
                $1.cmv(); //#21029
                var _HS = $k[--$j]; //#21029
                $puti($k[--$j], _HS, $a([((((~~($1.size / 2)) + $1.j) + $1.i) + 1) % 2])); //#21029
            } //#21029
        } //#21029
        $1.j = 0; //#21032
        for (var _HW = 0, _HV = $1.npixs.length - 1; _HW <= _HV; _HW += 1) { //#21039
            $1.i = _HW; //#21034
            if ($get($1.npixs, $1.i) == -2) { //#21038
                $put($1.npixs, $1.i, $get($1.pixs, $1.j)); //#21036
                $1.j = $1.j + 1; //#21037
            } //#21037
        } //#21037
        $1.pixs = $1.npixs; //#21040
    } //#21040
    $1.fw = ~~($1.fw / 2); //#21044
    for (var _Hl = -$1.fw, _Hk = $1.fw; _Hl <= _Hk; _Hl += 1) { //#21053
        $1.i = _Hl; //#21046
        for (var _Hp = -$1.fw, _Ho = $1.fw; _Hp <= _Ho; _Hp += 1) { //#21052
            $1.j = _Hp; //#21048
            $k[$j++] = $1.pixs; //#21049
            $k[$j++] = $1.i; //#21049
            $k[$j++] = $1.j; //#21049
            $1.cmv(); //#21049
            if (Math.abs($1.i) > Math.abs($1.j)) { //#21050
                $k[$j++] = Math.abs($1.i); //#21050
            } else { //#21050
                $k[$j++] = Math.abs($1.j); //#21050
            } //#21050
            var _Hx = $k[--$j]; //#21050
            var _Hy = $k[--$j]; //#21051
            $put($k[--$j], _Hy, $f(_Hx + 1) % 2); //#21051
        } //#21051
    } //#21051
    var _Ia = $a([$a([-($1.fw + 1), $1.fw, 1]), $a([-($1.fw + 1), $1.fw + 1, 1]), $a([-$1.fw, $1.fw + 1, 1]), $a([$1.fw + 1, $1.fw + 1, 1]), $a([$1.fw + 1, $1.fw, 1]), $a([$1.fw + 1, -$1.fw, 1]), $a([$1.fw, $1.fw + 1, 0]), $a([$1.fw + 1, -($1.fw + 1), 0]), $a([$1.fw, -($1.fw + 1), 0]), $a([-$1.fw, -($1.fw + 1), 0]), $a([-($1.fw + 1), -($1.fw + 1), 0]), $a([-($1.fw + 1), -$1.fw, 0])]); //#21061
    for (var _Ib = 0, _Ic = _Ia.length; _Ib < _Ic; _Ib++) { //#21062
        $k[$j++] = $1.pixs; //#21062
        $forall($get(_Ia, _Ib)); //#21062
        var _If = $k[--$j]; //#21062
        var _Ig = $k[--$j]; //#21062
        var _Ih = $k[--$j]; //#21062
        $k[$j++] = _If; //#21062
        $k[$j++] = _Ih; //#21062
        $k[$j++] = _Ig; //#21062
        $1.cmv(); //#21062
        var _Ii = $k[--$j]; //#21062
        var _Ij = $k[--$j]; //#21062
        $put($k[--$j], _Ii, _Ij); //#21062
    } //#21062
    if ($eq($1.format, "full")) { //#21078
        $1.modemap = $a([$a([-5, 7]), $a([-4, 7]), $a([-3, 7]), $a([-2, 7]), $a([-1, 7]), $a([1, 7]), $a([2, 7]), $a([3, 7]), $a([4, 7]), $a([5, 7]), $a([7, 5]), $a([7, 4]), $a([7, 3]), $a([7, 2]), $a([7, 1]), $a([7, -1]), $a([7, -2]), $a([7, -3]), $a([7, -4]), $a([7, -5]), $a([5, -7]), $a([4, -7]), $a([3, -7]), $a([2, -7]), $a([1, -7]), $a([-1, -7]), $a([-2, -7]), $a([-3, -7]), $a([-4, -7]), $a([-5, -7]), $a([-7, -5]), $a([-7, -4]), $a([-7, -3]), $a([-7, -2]), $a([-7, -1]), $a([-7, 1]), $a([-7, 2]), $a([-7, 3]), $a([-7, 4]), $a([-7, 5])]); //#21071
    } else { //#21078
        $1.modemap = $a([$a([-3, 5]), $a([-2, 5]), $a([-1, 5]), $a([0, 5]), $a([1, 5]), $a([2, 5]), $a([3, 5]), $a([5, 3]), $a([5, 2]), $a([5, 1]), $a([5, 0]), $a([5, -1]), $a([5, -2]), $a([5, -3]), $a([3, -5]), $a([2, -5]), $a([1, -5]), $a([0, -5]), $a([-1, -5]), $a([-2, -5]), $a([-3, -5]), $a([-5, -3]), $a([-5, -2]), $a([-5, -1]), $a([-5, 0]), $a([-5, 1]), $a([-5, 2]), $a([-5, 3])]); //#21078
    } //#21078
    for (var _Jw = 0, _Jv = $1.modemap.length - 1; _Jw <= _Jv; _Jw += 1) { //#21083
        $1.i = _Jw; //#21081
        $k[$j++] = $1.pixs; //#21082
        $forall($get($1.modemap, $1.i)); //#21082
        $1.cmv(); //#21082
        var _K4 = $k[--$j]; //#21082
        $put($k[--$j], _K4, $get($1.modebits, $1.i) - 48); //#21082
    } //#21082
    var _KC = new Map([
        ["ren", bwipp_renmatrix],
        ["pixs", $1.pixs],
        ["pixx", $1.size],
        ["pixy", $1.size],
        ["height", ($1.size * 2) / 72],
        ["width", ($1.size * 2) / 72],
        ["opt", $1.options]
    ]); //#21092
    $k[$j++] = _KC; //#21095
    if (!$1.dontdraw) { //#21095
        bwipp_renmatrix(); //#21095
    } //#21095
}

// bwip-js/barcode-ftr.js
//
// This code is injected below the cross-compiled barcode.js.

// `encoder` is one of the $0_* BWIPP functions
export function bwipp_encode(bwipjs, encoder, text, opts, dontdraw) {
    if (typeof text !== 'string') {
        throw new Error('bwipp.typeError: barcode text not a string (' +
            text + ')');
    }
    opts = opts || {};
    if (typeof opts === 'string') {
        var tmp = opts.split(' ');
        opts = {};
        for (var i = 0; i < tmp.length; i++) {
            if (!tmp[i]) {
                continue;
            }
            var eq = tmp[i].indexOf('=');
            if (eq == -1) {
                opts[tmp[i]] = true;
            } else {
                opts[tmp[i].substr(0, eq)] = tmp[i].substr(eq + 1);
            }
        }
    } else if (typeof opts !== 'object' || opts.constructor !== Object) {
        throw new Error('bwipp.typeError: options not an object');
    }

    // Convert utf-16 to utf-8 but leave binary (8-bit) strings untouched.
    if (/[\u0100-\uffff]/.test(text)) {
        text = unescape(encodeURIComponent(text));
    }

    // Don't draw? (See file runtest)
    $0.bwipjs_dontdraw = opts.dontdraw || dontdraw || false;

    // Convert opts to a Map
    var map = new Map;
    for (var id in opts) {
        if (opts.hasOwnProperty(id)) {
            map.set(id, opts[id]);
        }
    }

    // Invoke the encoder
    $$ = bwipjs;
    $k = [text, map];
    $j = 2;
    encoder();

    // Return what is left on the stack.  This branch should only be taken
    // when running with the dontdraw option.
    if ($j) {
        return $k.splice(0, $j);
    }

    return true;
}

export function bwipp_lookup(symbol) {
    if (!symbol) {
        throw new Error("bwipp.undefinedEncoder: bcid is not defined");
    }
    switch (symbol.replace(/-/g, "_")) {
        // case "auspost":
        //     return bwipp_auspost;
        case "azteccode":
            return bwipp_azteccode;
        // case "azteccodecompact":
        //     return bwipp_azteccodecompact;
        // case "aztecrune":
        //     return bwipp_aztecrune;
        // case "bc412":
        //     return bwipp_bc412;
        // case "channelcode":
        //     return bwipp_channelcode;
        // case "codablockf":
        //     return bwipp_codablockf;
        // case "code11":
        //     return bwipp_code11;
        // case "code128":
        //     return bwipp_code128;
        // case "code16k":
        //     return bwipp_code16k;
        // case "code2of5":
        //     return bwipp_code2of5;
        // case "code32":
        //     return bwipp_code32;
        // case "code39":
        //     return bwipp_code39;
        // case "code39ext":
        //     return bwipp_code39ext;
        // case "code49":
        //     return bwipp_code49;
        // case "code93":
        //     return bwipp_code93;
        // case "code93ext":
        //     return bwipp_code93ext;
        // case "codeone":
        //     return bwipp_codeone;
        // case "coop2of5":
        //     return bwipp_coop2of5;
        // case "daft":
        //     return bwipp_daft;
        // case "databarexpanded":
        //     return bwipp_databarexpanded;
        // case "databarexpandedcomposite":
        //     return bwipp_databarexpandedcomposite;
        // case "databarexpandedstacked":
        //     return bwipp_databarexpandedstacked;
        // case "databarexpandedstackedcomposite":
        //     return bwipp_databarexpandedstackedcomposite;
        // case "databarlimited":
        //     return bwipp_databarlimited;
        // case "databarlimitedcomposite":
        //     return bwipp_databarlimitedcomposite;
        // case "databaromni":
        //     return bwipp_databaromni;
        // case "databaromnicomposite":
        //     return bwipp_databaromnicomposite;
        // case "databarstacked":
        //     return bwipp_databarstacked;
        // case "databarstackedcomposite":
        //     return bwipp_databarstackedcomposite;
        // case "databarstackedomni":
        //     return bwipp_databarstackedomni;
        // case "databarstackedomnicomposite":
        //     return bwipp_databarstackedomnicomposite;
        // case "databartruncated":
        //     return bwipp_databartruncated;
        // case "databartruncatedcomposite":
        //     return bwipp_databartruncatedcomposite;
        // case "datalogic2of5":
        //     return bwipp_datalogic2of5;
        // case "datamatrix":
        //     return bwipp_datamatrix;
        // case "datamatrixrectangular":
        //     return bwipp_datamatrixrectangular;
        // case "datamatrixrectangularextension":
        //     return bwipp_datamatrixrectangularextension;
        // case "dotcode":
        //     return bwipp_dotcode;
        // case "ean13":
        //     return bwipp_ean13;
        // case "ean13composite":
        //     return bwipp_ean13composite;
        // case "ean14":
        //     return bwipp_ean14;
        // case "ean2":
        //     return bwipp_ean2;
        // case "ean5":
        //     return bwipp_ean5;
        // case "ean8":
        //     return bwipp_ean8;
        // case "ean8composite":
        //     return bwipp_ean8composite;
        // case "flattermarken":
        //     return bwipp_flattermarken;
        // case "gs1_128":
        //     return bwipp_gs1_128;
        // case "gs1_128composite":
        //     return bwipp_gs1_128composite;
        // case "gs1_cc":
        //     return bwipp_gs1_cc;
        // case "gs1datamatrix":
        //     return bwipp_gs1datamatrix;
        // case "gs1datamatrixrectangular":
        //     return bwipp_gs1datamatrixrectangular;
        // case "gs1dotcode":
        //     return bwipp_gs1dotcode;
        // case "gs1northamericancoupon":
        //     return bwipp_gs1northamericancoupon;
        // case "gs1qrcode":
        //     return bwipp_gs1qrcode;
        // case "hanxin":
        //     return bwipp_hanxin;
        // case "hibcazteccode":
        //     return bwipp_hibcazteccode;
        // case "hibccodablockf":
        //     return bwipp_hibccodablockf;
        // case "hibccode128":
        //     return bwipp_hibccode128;
        // case "hibccode39":
        //     return bwipp_hibccode39;
        // case "hibcdatamatrix":
        //     return bwipp_hibcdatamatrix;
        // case "hibcdatamatrixrectangular":
        //     return bwipp_hibcdatamatrixrectangular;
        // case "hibcmicropdf417":
        //     return bwipp_hibcmicropdf417;
        // case "hibcpdf417":
        //     return bwipp_hibcpdf417;
        // case "hibcqrcode":
        //     return bwipp_hibcqrcode;
        // case "iata2of5":
        //     return bwipp_iata2of5;
        // case "identcode":
        //     return bwipp_identcode;
        // case "industrial2of5":
        //     return bwipp_industrial2of5;
        // case "interleaved2of5":
        //     return bwipp_interleaved2of5;
        // case "isbn":
        //     return bwipp_isbn;
        // case "ismn":
        //     return bwipp_ismn;
        // case "issn":
        //     return bwipp_issn;
        // case "itf14":
        //     return bwipp_itf14;
        // case "jabcode":
        //     return bwipp_jabcode;
        // case "japanpost":
        //     return bwipp_japanpost;
        // case "kix":
        //     return bwipp_kix;
        // case "leitcode":
        //     return bwipp_leitcode;
        // case "mailmark":
        //     return bwipp_mailmark;
        // case "matrix2of5":
        //     return bwipp_matrix2of5;
        // case "maxicode":
        //     return bwipp_maxicode;
        // case "micropdf417":
        //     return bwipp_micropdf417;
        // case "microqrcode":
        //     return bwipp_microqrcode;
        // case "msi":
        //     return bwipp_msi;
        // case "onecode":
        //     return bwipp_onecode;
        // case "pdf417":
        //     return bwipp_pdf417;
        // case "pdf417compact":
        //     return bwipp_pdf417compact;
        // case "pharmacode":
        //     return bwipp_pharmacode;
        // case "pharmacode2":
        //     return bwipp_pharmacode2;
        // case "planet":
        //     return bwipp_planet;
        // case "plessey":
        //     return bwipp_plessey;
        // case "posicode":
        //     return bwipp_posicode;
        // case "postnet":
        //     return bwipp_postnet;
        // case "pzn":
        //     return bwipp_pzn;
        case "qrcode":
            return bwipp_qrcode;
        // case "rationalizedCodabar":
        //     return bwipp_rationalizedCodabar;
        // case "raw":
        //     return bwipp_raw;
        // case "rectangularmicroqrcode":
        //     return bwipp_rectangularmicroqrcode;
        // case "royalmail":
        //     return bwipp_royalmail;
        // case "sscc18":
        //     return bwipp_sscc18;
        // case "swissqrcode":
        //     return bwipp_swissqrcode;
        // case "symbol":
        //     return bwipp_symbol;
        // case "telepen":
        //     return bwipp_telepen;
        // case "telepennumeric":
        //     return bwipp_telepennumeric;
        // case "ultracode":
        //     return bwipp_ultracode;
        // case "upca":
        //     return bwipp_upca;
        // case "upcacomposite":
        //     return bwipp_upcacomposite;
        // case "upce":
        //     return bwipp_upce;
        // case "upcecomposite":
        //     return bwipp_upcecomposite;
    }
    throw new Error("bwipp.unknownEncoder: unknown encoder name: " + symbol);
}
