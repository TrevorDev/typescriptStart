import * as THREE from "three"
var vr = require("./vr")

export class Stage {
    scene:THREE.Scene
    camera:THREE.PerspectiveCamera
    renderer:THREE.WebGLRenderer
    canvas:HTMLCanvasElement

    constructor(divElement:HTMLDivElement){
        this.scene = new THREE.Scene()

        // Create camera
        var width =  divElement.clientWidth
        var height =  divElement.clientHeight
        var viewAngle = 45
        var nearClipping = 0.1
        var farClipping = 9999
        this.camera = new THREE.PerspectiveCamera( viewAngle, width / height, nearClipping, farClipping )
        this.camera.position.y = 1.7;

        // Create canvas and renderer
        this.canvas = document.createElement("canvas")
        this.canvas.style.width = "100%"
        this.canvas.style.height = "100%"
        this.canvas.width = width
        this.canvas.height = height
        divElement.appendChild(this.canvas)
        var tmp = console.log
        console.log = ()=>{}
        this.renderer = new THREE.WebGLRenderer({canvas: this.canvas, antialias: true})
        console.log = tmp

        this.renderer.vr.enabled = true
        document.body.appendChild(vr.default.createButton(this.renderer, undefined));
        
        // var c= (this.renderer.vr as any).getController(0)
        // console.log(c)
        
        // TODO handle resize here or when requested
        // window.onresize = ()=>{
        // }
    }

    startRenderLoop(onBeforeRender:(delta:number, curTime:number)=>void){
        // Render on every frame
        // var animate = ()=> {
        //     requestAnimationFrame( animate )
        //     onBeforeRender();
        //     this.renderer.render( this.scene, this.camera )
        // }
        // animate()
        var lastTime = 0;
        this.renderer.setAnimationLoop((curTime:number)=>{
            var delta = curTime - lastTime
            lastTime = curTime
            onBeforeRender(delta, curTime);
            this.renderer.render( this.scene, this.camera )
        })

    }
}