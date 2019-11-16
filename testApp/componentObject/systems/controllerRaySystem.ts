import { MeshObject } from "../baseObjects/meshObject";
import { HitResult, Hit } from "../../extensions/hit";
import { XRController } from "../../os/input/xrController";
import { PointerEventComponent } from "../components/behavior/pointerEventComponent";
import { App } from "../../os/app/app";

export class ControllerRaySystem {
    hitable = new Array<MeshObject>()
    castResults: { [key: string]: HitResult } = {}
    constructor(private app: App) {

    }

    castRay(controller: XRController, result: HitResult) {
        if (!this.castResults[controller.hand]) {
            this.castResults[controller.hand] = new HitResult()
        }
        Hit.rayIntersectsMeshes(controller.ray, this.hitable, this.castResults[controller.hand])
        result.copyFrom(this.castResults[controller.hand])
    }

    update(controllers: Array<XRController>) {
        this.hitable.forEach((o) => {
            var p = o.getComponent<PointerEventComponent>(PointerEventComponent.type)
            if (p) {
                var hit = false;
                for (var c of controllers) {
                    if (this.castResults[c.hand]) {
                        var obj = this.castResults[c.hand].hitObject
                        if (obj == o && c.isHoveringApp(this.app)) {
                            hit = true
                            break;
                        }
                    }
                }
                p.setHovered(hit)
            }
        })
        controllers.forEach((c) => {
            if (this.castResults[c.hand]) {
                var obj = this.castResults[c.hand].hitObject
                if (c.primaryButton.justDown && obj) {
                    var p = obj.getComponent<PointerEventComponent>(PointerEventComponent.type)
                    if (p && !c.hoveredTaskbar && c.isHoveringApp(this.app)) {
                        p.click()
                    }
                }
            }

        })
    }
}