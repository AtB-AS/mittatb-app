// From https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/bwip-js/index.d.ts
export type Options = {
    bcid: 'azteccode' | 'qrcode';
    text: string;

    parse?: boolean | undefined;
    parsefnc?: boolean | undefined;

    height?: number | undefined;
    width?: number | undefined;

    scaleX?: number | undefined;
    scaleY?: number | undefined;
    scale?: number | undefined;

    rotate?: "N" | "R" | "L" | "I" | undefined;

    paddingwidth?: number | undefined;
    paddingheight?: number | undefined;

    monochrome?: boolean | undefined;
    alttext?: string | undefined;

    includetext?: boolean | undefined;
    textfont?: string | undefined;
    textsize?: number | undefined;
    textgaps?: number | undefined;

    textxalign?: "offleft" | "left" | "center" | "right" | "offright" | "justify" | undefined;
    textyalign?: "below" | "center" | "above" | undefined;
    textxoffset?: number | undefined;
    textyoffset?: number | undefined;

    showborder?: boolean | undefined;
    borderwidth?: number | undefined;
    borderleft?: number | undefined;
    borderright?: number | undefined;
    bordertop?: number | undefined;
    boraderbottom?: number | undefined;

    barcolor?: string | undefined;
    backgroundcolor?: string | undefined;
    bordercolor?: string | undefined;
    textcolor?: string | undefined;

    addontextxoffset?: number | undefined;
    addontextyoffset?: number | undefined;
    addontextfont?: string | undefined;
    addontextsize?: number | undefined;

    guardwhitespace?: boolean | undefined;
    guardwidth?: number | undefined;
    guardheight?: number | undefined;
    guardleftpos?: number | undefined;
    guardrightpos?: number | undefined;
    guardleftypos?: number | undefined;
    guardrightypos?: number | undefined;

    sizelimit?: number | undefined;

    includecheck?: boolean | undefined;
    includecheckintext?: boolean | undefined;

    inkspread?: number | undefined;
    inkspreadh?: number | undefined;
    inkspreadv?: number | undefined;
}

export function Render(options: Options, drawing: any): string
