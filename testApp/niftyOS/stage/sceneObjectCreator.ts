import * as THREE from "three"
import { DefaultMaterials } from "./defaultMaterials";

export class SceneObjectCreator {
    static createDefaultLights(scene: THREE.Object3D){
        var lights = {
			ambiant: new THREE.AmbientLight(0xFFFFFF, 0.1),
			point1: new THREE.PointLight(),
			point2: new THREE.PointLight()
		}
		scene.add(lights.ambiant);

		lights.point1.position.y += 3
		lights.point1.position.z += 3
		scene.add(lights.point1);

		lights.point2.position.y += 0
		lights.point2.position.x += 2
        scene.add(lights.point2);
        
		return lights
    }

    static createFloor(scene: THREE.Object3D){

		var groundGeo = new THREE.PlaneGeometry(50,50)
		var ground = new THREE.Mesh(groundGeo, DefaultMaterials.DEFAULT )
		ground.rotateX(-Math.PI/2);
		ground.position.y -= 0;

		scene.add( ground );
		return ground
	}
	
	static createBox(scene: THREE.Object3D){

		var boxGeo = new THREE.BoxGeometry(1, 1, 1)
		var box = new THREE.Mesh(boxGeo, DefaultMaterials.DEFAULT )

		scene.add( box );
		return box
	}

	static createRay(scene: THREE.Object3D){
        var obj = new THREE.Object3D()

		var rayGeo = new THREE.CylinderGeometry(1, 1, 1, 32)
		var ray = new THREE.Mesh(rayGeo, DefaultMaterials.DEFAULT )
		ray.rotateX(-Math.PI/2);
		ray.position.z -= 0.5;

		obj.add(ray)

		scene.add( obj );
		return obj
	}
}