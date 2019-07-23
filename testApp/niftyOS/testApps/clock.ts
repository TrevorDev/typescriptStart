import { NiftyOS } from "../niftyOS";
import { SceneObjectCreator } from "../stage/sceneObjectCreator";
import THREE = require("three");
import * as html2canvas from "html2canvas"
import { MathHelper } from "../math/mathHelper";

class Bullet {
    mesh:THREE.Mesh
    vel:THREE.Vector3
    constructor(scene:THREE.Group){
        this.vel = new THREE.Vector3()
        this.mesh = SceneObjectCreator.createBox(scene)
        this.mesh.scale.setScalar(0.1)
    }

    // update(){
    //     this.mesh.position.add(this.vel)
    // }
}

var main = async()=>{
    var os = NiftyOS.GetOS()
    var input = os.getInputManager()
    var app = os.createApp()
    
    // Get time
    var time = new Date()
    var clockTime = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();

    var canEl = document.createElement('canvas')

    // Generate texture
    var el = document.createElement('div');
    var domString = '<div style="font-size: 5em;"><div>Time: '+clockTime+'</div></div>';
    el.innerHTML =  domString;
    document.body.appendChild(el);   
    document.body.appendChild(canEl);   
    debugger

    var ctx:any = canEl.getContext('2d');
    // ctx.beginPath();
    // ctx.arc(75,75,50,0,Math.PI*2,true); // Outer circle
    // ctx.moveTo(110,75);
    // ctx.arc(75,75,35,0,Math.PI,false);   // Mouth (clockwise)
    // ctx.moveTo(65,65);
    // ctx.arc(60,65,5,0,Math.PI*2,true);  // Left eye
    // ctx.moveTo(95,65);
    // ctx.arc(90,65,5,0,Math.PI*2,true);  // Right eye
    // ctx.stroke();
    await (html2canvas as any)(el.firstChild,{width: 512, height:512, canvas: ctx, allowTaint: true})
    
    // Debug overlay canvas
    // document.body.appendChild(c)
    canEl.style.position = "absolute"
    canEl.style.zIndex = "20"
    canEl.style.top = "0px"
    //canvas.style.backgroundColor = "red"

    var texture = new THREE.CanvasTexture(canEl)
    texture.needsUpdate = true
    // Setup screen
    var screenGeom = new THREE.PlaneGeometry( 1, 1 );
    //var videoTexture = new THREE.VideoTexture(localVideo)
    var screenMat = new THREE.MeshLambertMaterial( {map: texture} );
    var screen = new THREE.Mesh( screenGeom, screenMat );
    // screen.scale.setScalar(2)
    screen.position.y = 1
    app.scene.add(screen)
    
    
}
main()