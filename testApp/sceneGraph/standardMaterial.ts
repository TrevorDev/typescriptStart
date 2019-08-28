import { Material } from "./material";

export class StandardMaterialFactory {
    createInstance(){
        return new StandardMaterial()
    }
}

export class StandardMaterial implements Material {
    
}