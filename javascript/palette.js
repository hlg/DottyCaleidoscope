class Palette {
  constructor(){
    this.colours = []; 
  }
  initColours(paletteSize = this.colours.length){
    this.colours = [];
    for (var i=0; i<paletteSize; i++){
      this.colours[i] = [this.rand256(),this.rand256(),this.rand256()];
    }
  }
  rand256(){
    return this.randInt(256);
  }
  randInt(n){
    return Math.floor(Math.random() * n);
  }
  random(){
    return this.colours[this.randInt(this.colours.length)];
  }

}
export { Palette }
