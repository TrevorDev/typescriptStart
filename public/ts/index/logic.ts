import $ = require("jquery")
import Vue = require("vue");

var main = async ()=>{
  console.log("helloWorld")
  var contentview = new Vue({
    el: '#content',
    data: {text: "HELLO WORLD"},
    methods: {}
  })
}
main()
