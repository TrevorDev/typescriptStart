import * as THREE from "three"

// MeshStandardMaterial is PBR but it may be too expensive on mobile
// MeshLambertMaterial is a cheaper alternative that looks fine

export class DefaultMaterials {
    static DEFAULT = new THREE.MeshLambertMaterial({
		//map: new THREE.TextureLoader().load('/public/img/cubeFace.png')
	})
}