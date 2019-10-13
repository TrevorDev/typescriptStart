import * as twgl from "twgl.js"
export class Color {
    v: Float32Array
    constructor(r = 0, g = 0, b = 0, a = 1) {
        this.v = new Float32Array([r, g, b, a])
    }

    static createFromHex(hexString: string) {
        var r: any
        var g: any
        var b: any

        if (hexString.length == 4) {
            r = "0x" + hexString[1] + hexString[1];
            g = "0x" + hexString[2] + hexString[2];
            b = "0x" + hexString[3] + hexString[3];

        } else if (hexString.length == 7) {
            r = "0x" + hexString[1] + hexString[2];
            g = "0x" + hexString[3] + hexString[4];
            b = "0x" + hexString[5] + hexString[6];
        }

        r = +(r / 255 * 100).toFixed(1);
        g = +(g / 255 * 100).toFixed(1);
        b = +(b / 255 * 100).toFixed(1);

        return new Color(r, g, b)
    }

    set r(val: number) {
        this.v[0] = val;
    }
    set g(val: number) {
        this.v[1] = val;
    }
    set b(val: number) {
        this.v[2] = val;
    }
    set a(val: number) {
        this.v[3] = val;
    }

    get r() {
        return this.v[0];
    }
    get g() {
        return this.v[1];
    }
    get b() {
        return this.v[2];
    }
    get a() {
        return this.v[3];
    }
}