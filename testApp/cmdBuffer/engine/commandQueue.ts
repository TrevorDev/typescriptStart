import { CommandBuffer } from "./commandBuffer";
import { GPUDevice } from "../../gpu/gpuDevice";

export class CommandQueue {
    constructor(public device:GPUDevice){}
    makeCommandBuffer(){
        return new CommandBuffer(this.device)
    }
}