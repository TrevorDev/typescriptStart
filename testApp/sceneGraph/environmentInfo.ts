import { TransformNode } from "./transformNode";
import { Matrix4 } from "../math/matrix4";
import { Camera } from "./camera";

export class EnvironmentInfo {
    private static _isOculusBrowser = navigator.userAgent.indexOf("OculusBrowser") > 0
    static isOculusBrowser(){
        return this._isOculusBrowser
    }
}