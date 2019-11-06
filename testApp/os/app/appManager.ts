import { AppContainer } from "./appContainer";
import { Stage } from "../../extensions/stage";
import { InputManager } from "../input/inputManager";
import { XRController } from "../input/xrController";
import { App } from "./app";

export class AppManager {
    activeApp: AppContainer | null = null;
    appContainers = new Array<AppContainer>()

    isActiveForApp(app: App) {
        return this.activeApp && this.activeApp.app == app
    }

    constructor(private globalStage: Stage, private inputManager: InputManager) {

    }
    update(delta: number, curTime: number, controllers: Array<XRController>) {
        this.appContainers.forEach((c) => {
            c.update(delta, curTime, controllers)
        })
    }

    disposeApp(container: AppContainer) {
        var ind = this.appContainers.indexOf(container)
        if (ind > -1) {
            this.appContainers.splice(ind, 1)
        }
        container.dispose()
    }

    createApp() {
        var appContainer = new AppContainer(this.globalStage, this.inputManager);
        this.appContainers.push(appContainer)

        appContainer.containerSpace.transform.position.set(0, 1.5, -1.5)

        return appContainer
    }

}