export class Loop {
    private running = true
    private stopResolve:Function
    constructor(repeater:Function, fn:Function){
        var loop = () => {
            if(this.running){
                repeater(loop)
            }else{
                this.stopResolve()
            }
            fn()
        }
        repeater(loop)
    }
    stop(){
        return new Promise((res)=>{
            this.stopResolve = res
            this.running = false;
        })
    }
}