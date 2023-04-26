
export default function Context() {
    this.context = {};
}
Context.prototype.set = function(name,value) {
    if(!this.context[name]) {
        this.context[name] = value;
    }else {
        console.log("este value ya esxiste");
    }
}
Context.prototype.get = function(name) {
    if(this.context[name]) {
        return this.context[name];
    }else {
        console.log("este valor no existe")
    }
}