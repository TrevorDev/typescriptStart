import * as Tone from "tone"


// var synth = new Tone.Synth().toMaster()

// var notes:any = {}
// var a = Math.pow(2, 1/12)
// document.onkeydown= (e:any)=>{
//   var val = e.key*1-1
//   var freq = 440 * Math.pow(a, val)
//   if(!notes[freq]){
//     notes[freq] = synth.triggerAttack(freq)
//   } 
//   console.log(notes)
// } 
// document.onkeyup= (e:any)=>{
//   console.log(notes)
//   var val = e.key*1-1
//   var freq = 440 * Math.pow(a, val)
//   if(notes[freq]){
//     notes[freq].triggerRelease()
//     delete notes[freq]
//   } 
// }  