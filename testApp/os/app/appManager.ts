import { AppContainer } from "./appContainer";
import { Stage } from "../../extensions/stage";
import { InputManager } from "../input/inputManager";
import { XRController } from "../input/xrController";

export class AppManager {
    activeApp: AppContainer | null = null;
    appContainers = new Array<AppContainer>()
    constructor(private globalStage: Stage, private inputManager: InputManager) {

    }
    update(delta: number, curTime: number, controllers: Array<XRController>) {
        this.appContainers.forEach((c) => {
            c.update(delta, curTime, controllers)
        })
    }

    createApp() {
        var appContainer = new AppContainer(this.globalStage, this.inputManager);
        this.appContainers.push(appContainer)

        appContainer.containerSpace.transform.position.set(0, 1.5, -1.5)

        return appContainer
    }

}