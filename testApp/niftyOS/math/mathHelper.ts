import { Matrix4, Vector3, Quaternion } from "three";
import THREE = require("three");

export class MathHelper {
    private static tmpMatrix = new Matrix4()
    // private static forward = new THREE.Vector3( 0, 0, -1 );
    // private static tmpVector3 = new Vector3()
    private static tmpQuaternion = new Quaternion()
    private static tmpEuler = new THREE.Euler(0,0,0)

    static addAsChildKeepWorldMatrix(child:THREE.Object3D, parent:THREE.Object3D){
        this.tmpMatrix.getInverse(parent.matrix)
        this.tmpMatrix.multiplyMatrices(this.tmpMatrix, child.matrixWorld)
        this.tmpMatrix.decompose(child.position, child.quaternion, child.scale)
        parent.add(child)
    }

    static getForwardFromMatrix(matrix:THREE.Matrix4, result:THREE.Vector3){
        this.tmpMatrix.identity()
        result.set(0,0,-1)
        this.tmpMatrix.extractRotation( matrix );
        result.applyMatrix4(this.tmpMatrix)
    }

    static decomposeMatrixToObject(matrix:THREE.Matrix4, obj:THREE.Object3D){
        obj.matrix.copy(matrix)
        matrix.decompose(obj.position, obj.quaternion, obj.scale)
    }

    static rotateMatrixByEuler(x:number,y:number,z:number,matrix:THREE.Matrix4){
        this.tmpEuler.set(x,y,z)
        this.tmpMatrix.identity()
        this.tmpQuaternion.setFromEuler(this.tmpEuler)
        this.tmpMatrix.makeRotationFromQuaternion(this.tmpQuaternion)
        matrix.multiply(this.tmpMatrix)
    }

    static setRayFromObject(obj:THREE.Object3D, ray:THREE.Ray){
        ray.origin.copy(obj.position)
        MathHelper.getForwardFromMatrix(obj.matrix, ray.direction)
    }
}