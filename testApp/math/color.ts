import * as twgl from "twgl.js"

/**
 * RGBA Color values between 0-1
 */
export class Color {
    v: Float32Array
    /**
     * Creates a color with RGBA values between 0-1
     * @param r 
     * @param g 
     * @param b 
     * @param a 
     */
    constructor(r = 0, g = 0, b = 0, a = 1) {
        this.v = new Float32Array([r, g, b, a])
    }

    /**
     * save RGBA Color values between 0-1
     */
    set(r = 0, g = 0, b = 0, a = 1) {
        this.r = r
        this.g = g
        this.b = b
        this.a = a
    }

    copyFrom(from: Color) {
        this.set(from.r, from.g, from.b, from.a)
    }

    toHex() {
        var colors = [this.r, this.g, this.b]
        return colors.map((c) => {
            var hex = Math.floor(Math.abs(c) * 255).toString(16)
            if (hex.length < 2) {
                hex = "0" + hex
            }
            return hex
        }).reduce((prev, cur) => {
            return prev + cur
        }, "#")
    }

    clone() {
        return new Color(this.r, this.g, this.b, this.a)
    }

    /**
     * Adds a value to rgb
     * @param value to add
     */
    AddInplace(value: number) {
        this.r += value
        this.g += value
        this.b += value
    }

    scaleInPlace(value: number) {
        this.r *= value
        this.g *= value
        this.b *= value
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

        r = +(r / 255);
        g = +(g / 255);
        b = +(b / 255);

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
    toJSON() {
        return { r: this.r, g: this.g, b: this.b, a: this.a }
    }
}