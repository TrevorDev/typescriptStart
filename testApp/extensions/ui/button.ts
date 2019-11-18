import { GPUDevice } from "../../gpu/gpuDevice";
import { DefaultMesh } from "../defaultMesh";
import { CanvasTexture } from "../canvasTexture";
import { MeshObject } from "../../componentObject/baseObjects/meshObject";
import { DefaultVertexData } from "../defaultVertexData";
import { Vector3 } from "../../math/vector3";
import { PointerEventComponent } from "../../componentObject/components/behavior/pointerEventComponent";
import { Color } from "../../math/color";

export class Button {
    mesh: MeshObject
    canvasTexture: CanvasTexture
    backgroundColor = new Color(0.1, 0.13, 0.2)
    hoveredBackgroundColor = new Color(0.1 / 2, 0.13 / 2, 0.2 / 2)

    private isHovered = false;
    pointerEvent = new PointerEventComponent()
    constructor(device: GPUDevice, public text = "") {
        var canEl = document.createElement('canvas')
        canEl.width = 512
        canEl.height = 128
        this.canvasTexture = new CanvasTexture(device, canEl)


        this.mesh = DefaultMesh.createMesh(device, { vertexData: DefaultVertexData.createVerticlePlaneVertexData(device), texture: this.canvasTexture.texture });
        this.mesh.transform.scale.x = canEl.width / canEl.height
        this.mesh.transform.scale.scaleInPlace(0.1)
        this.mesh.transform.rotation.fromEuler(new Vector3(0, Math.PI, 0))

        this.mesh.addComponent(this.pointerEvent)

        this.pointerEvent.onHoverChanged = (isHovered) => {
            this.isHovered = isHovered
            this.update()
        }

        this.update()

    }

    /**
     * Redraws the button with its current text and colors
     */
    update() {
        var size = 50 * 2
        var ctx = this.canvasTexture.canvas.getContext("2d")!
        ctx.fillStyle = (!this.isHovered ? this.backgroundColor : this.hoveredBackgroundColor).toHex();
        ctx.fillRect(0, 0, this.canvasTexture.canvas.width, this.canvasTexture.canvas.height)
        ctx.fillStyle = '#ecf0f1';
        ctx.font = size + 'px serif';
        var dim = ctx.measureText("M")
        ctx.fillText("" + this.text, 10, 100);
        this.canvasTexture.update()
    }
}