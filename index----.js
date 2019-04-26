//script 
var a = 1;

function b() {
    console.log(a)
}



let  mod = (function() {
    var a = 1;

    function b() {

    }


    return {
        a,
        b
    }
})();

mod.a

mod.b();

// script

class A {
    t;
    m;

}

class B extends A {
    t;
    m;
    c() {
        this.t++;
    }
}

function C(p) {
    this.c = p;

}

C.prototype.b = function(){

}

C.__proto__.b = function () {}

C.prototype = this = m;


var m = new C("a");
m.c

var a = C("c");


function B(b) {
    this.b = b;
    this.cmd = function(b) {
        this.b = b;
    }
}


var b = new B();

b.cmd();




function React(props) {
    this.props = prop;
}

function App(props) {

}