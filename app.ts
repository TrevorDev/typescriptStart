import "babel-polyfill"
import testLib from "./lib/testLib"

var testFunc = function(){
  return new Promise((res, rej)=>{
    res(testLib.add(testLib.num))
  })
}

var main = async ()=>{
  var answer = await testFunc()
  console.log(answer)
}
main()
