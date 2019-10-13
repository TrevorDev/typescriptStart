import { Component } from "../components/component";
import { TransformObject } from "./transformObject";

export class BaseObject {
    components: { [componentType: number]: Array<Component> } = {};
    constructor() {
    }

    update() {

    }

    addComponent(component: Component) {
        if (!this.components[component.getType()]) {
            this.components[component.getType()] = []
        }
        component.object = this as any as TransformObject;
        this.components[component.getType()].push(component)
    }

    getComponent<T extends Component>(componentType: number): T | undefined {
        var list = this.getComponents<T>(componentType);
        return list != undefined ? list[0] : undefined
    }
    getComponents<T extends Component>(componentType: number): Array<T> | undefined {
        return this.components[componentType] as Array<T>
    }
}