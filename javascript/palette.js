class Palette {
  constructor(){
    this.colours = []; // change to default one colour, black?
  }
  initColours(paletteSize = this.colours.length){
    this.colours = [];
    for (var i=0; i<paletteSize; i++){
      this.colours[i] = [this.rand256(),this.rand256(),this.rand256()];
    }
    this.activeColour = 0;
  }
  rand256(){
    return this.randInt(256);
  }
  randInt(n){
    return Math.floor(Math.random() * n);
  }
  random(){
    return this.colours[this.randomIndex()];
  }

  randomIndex() {
    return this.randInt(this.colours.length);
  }

  draw(){
    this.colours.forEach( (rgb, i) => {
      if(i==this.activeColour) stroke(255);
      fill(rgb[0],rgb[1],rgb[2]);
      rect(i%10*25,Math.floor(i/10)*25,20,20);
      if(i==this.activeColour) noStroke();
    });
    translate(0, this.rgbOffset());
    for(var rgb=0; rgb<3; rgb++){
      // Could also use CSS gradients instead of the following.
      var colourClone = [...this.colours[this.activeColour]];
      var bandValue = colourClone[rgb];
      for(var c=0; c<256; c++){
        colourClone[rgb]=c;
        stroke(...colourClone);
        line(c,0,c,20);
      }
      stroke(255);
      line(bandValue,0,bandValue,20);
      translate(0,30);
    }
    noStroke();
  }
  rgbOffset(){
    return Math.ceil(this.colours.length/10)*25 + 20;
  }
  mouseClicked(x,y){ // assert x,y >= 0 
    if(y<=this.rgbOffset()-20 && y%25<=20 && x<=250 && x%25<=20){
      this.activeColour = Math.floor(y/25)*10 + Math.floor(x/25);
      redraw();
    } else if (y>=this.rgbOffset()) {
      var rgbY = y-this.rgbOffset();
      if(rgbY<=80 && rgbY%30<=20 && x<=255){
        this.colours[this.activeColour][Math.floor(rgbY/30)] = x;
        redraw();
      }
    }
  }
}

export { Palette }
