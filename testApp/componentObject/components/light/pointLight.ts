import { Color } from "../../../math/color";
import { Light } from "./light";

export class PointLight extends Light {
    color = new Color(1, 1, 1)
    intensity = 1
}