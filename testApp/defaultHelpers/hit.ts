import { Ray } from "../math/ray";
import { Mesh } from "../sceneGraph/mesh";
import { Vector3 } from "../math/vector3";
import { Matrix4 } from "../math/matrix4";
import { Triangle } from "../math/triangle";
import { TransformNode, NodeType } from "../sceneGraph/transformNode";

export class HitResult {
    hitDistance: null | number
    constructor() {
        this.reset()
    }
    reset() {
        this.hitDistance = null;
    }
    copyFrom(h: HitResult) {
        this.hitDistance = h.hitDistance
    }
}

// TODO cleanup and document better, hittest for camera
export class Hit {
    static _tempTri = new Triangle()
    static _tempRay = new Ray()
    static _tempMat = new Matrix4()
    static _tempVecA = new Vector3()
    static _tempVecB = new Vector3()
    static _tempVecC = new Vector3()
    static _tmpHit = new HitResult()
    static _tmpHitB = new HitResult()
    static rayIntersectsTriangle(ray: Ray, tri: Triangle, normal: null | Vector3, res: HitResult) {
        // See https://github.com/TrevorDev/outLine/blob/master/public/custom/moreSpace/collision.js
        //when line collides with plane:
        //from + x*line = face.a + y*planeX + z*planeY
        //x*line + y*-planeX + z*-planeY = face.a - from
        //x y z = right

        if (normal) {
            ray.direction.normalizeToRef(this._tempVecA)
            normal.normalizeToRef(normal)
            var dot = normal.dot(this._tempVecA)
            if (dot > 0) {
                res.hitDistance = null;
                return;
            }
        }
        //debugger

        var direction = ray.direction;
        var originToPlaneMainPoint = this._tempVecA
        var planeX = this._tempVecB
        var planeY = this._tempVecC

        tri.points[0].subtractToRef(ray.origin, originToPlaneMainPoint)
        tri.points[0].subtractToRef(tri.points[1], planeX)
        tri.points[0].subtractToRef(tri.points[2], planeY)

        // 3 equations 3 unknowns solve
        var det = direction.x * ((planeX.y * planeY.z) - (planeX.z * planeY.y)) - planeX.x * ((direction.y * planeY.z) - (direction.z * planeY.y)) + planeY.x * ((direction.y * planeX.z) - (direction.z * planeX.y));
        var detX = originToPlaneMainPoint.x * ((planeX.y * planeY.z) - (planeX.z * planeY.y)) - planeX.x * ((originToPlaneMainPoint.y * planeY.z) - (originToPlaneMainPoint.z * planeY.y)) + planeY.x * ((originToPlaneMainPoint.y * planeX.z) - (originToPlaneMainPoint.z * planeX.y));
        var detY = direction.x * ((originToPlaneMainPoint.y * planeY.z) - (originToPlaneMainPoint.z * planeY.y)) - originToPlaneMainPoint.x * ((direction.y * planeY.z) - (direction.z * planeY.y)) + planeY.x * ((direction.y * originToPlaneMainPoint.z) - (direction.z * originToPlaneMainPoint.y));
        var detZ = direction.x * ((planeX.y * originToPlaneMainPoint.z) - (planeX.z * originToPlaneMainPoint.y)) - planeX.x * ((direction.y * originToPlaneMainPoint.z) - (direction.z * originToPlaneMainPoint.y)) + originToPlaneMainPoint.x * ((direction.y * planeX.z) - (direction.z * planeX.y));

        if (det != 0) {
            var x = detX / det; // ratio of direction
            var y = detY / det; // ratio of lineA direction
            var z = detZ / det; // ratio of lineB direction
            //debugger
            // If inifinite plane needs support
            // if(infiniteLength || (x>=0&&x<=1&&y>=0&&y<=1&&z>=0&&z<=1&&(y+z)<=1)){
            if ((x >= 0 && y >= 0 && y <= 1 && z >= 0 && z <= 1 && (y + z) <= 1)) {
                res.hitDistance = x;
                return;
            }
        }
        res.hitDistance = null;
        return;
    }

    /**
     * Ray direction must be normalized
     * @param ray 
     * @param node 
     */
    static rayIntersectsMesh(ray: Ray, node: TransformNode, res: HitResult) {
        res.reset()

        if (node.type == NodeType.MESH) {
            var mesh = node as Mesh
            mesh.computeWorldMatrix(true)
            mesh.worldMatrix.inverseToRef(Hit._tempMat)
            ray.applyMatrixToRef(Hit._tempMat, Hit._tempRay)
            //console.log(Hit._tempRay.direction.v)

            var p = mesh.vertData.getPositions()
            var ind = mesh.vertData.getIndices()
            var triCount = mesh.vertData.getIndices().length / 3;
            for (var i = 0; i < triCount; i++) {
                for (var j = 0; j < 3; j++) {
                    Hit._tempTri.points[j].x = p[(ind[(i * 3) + j] * 3) + 0]
                    Hit._tempTri.points[j].y = p[(ind[(i * 3) + j] * 3) + 1]
                    Hit._tempTri.points[j].z = p[(ind[(i * 3) + j] * 3) + 2]

                }
                var hitRes = {}
                //debugger
                this.rayIntersectsTriangle(this._tempRay, Hit._tempTri, null, this._tmpHit)
                if (this._tmpHit.hitDistance != null && (res.hitDistance == null || res.hitDistance > this._tmpHit.hitDistance)) {
                    res.copyFrom(this._tmpHit)
                }
            }
        }

        return null
    }

    static rayIntersectsMeshes(ray: Ray, nodes: Array<TransformNode>, res: HitResult) {
        res.reset()
        Hit._tmpHitB.reset()

        for (var n of nodes) {
            Hit.rayIntersectsMesh(ray, n, Hit._tmpHitB);
            if (res.hitDistance == null || (Hit._tmpHitB.hitDistance != null && Hit._tmpHitB.hitDistance < res.hitDistance)) {
                res.copyFrom(Hit._tmpHitB)
            }
        }
    }
}