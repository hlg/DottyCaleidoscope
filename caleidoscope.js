import { Palette } from "./palette.js";

var s = 20.0;
var debug = false;
var s1, s2;
var diameter;
var distance;
var radius;
var a, b;
var palette = new Palette();
var expert = true;

function initSize(){
  diameter = 400.0/s;
  distance = diameter/10.0;
  radius = diameter/2.0;
  a = radius + distance/2.0;
  b =  a * Math.sqrt(3); // 2*a * Math.cos(Math.toRadians(30))
}

window.setup = function() {
  initSize();
  palette.initColours(10);
  var h = a*(4*s-2) + 300;
  var w = b*(2*s-2) + a*2;
  createCanvas(h, w);
  select('#noOfDots').changed(changeSize);
  select('#noOfColours').changed(changeColour);
  select('#redraw').mousePressed(redraw);
  select('#newColours').mousePressed(redrawWithNewColours);
  noLoop();
  strokeWeight(2);
  noStroke();
  redraw(); 
}

function changeSize(){
  s = select('#noOfDots').value();
  initSize(); 
  redraw();
}

function changeColour(){
  palette.initColours(select('#noOfColours').value()); 
  redraw();
}

function redrawWithNewColours(){
  palette.initColours(); 
  redraw();
}

window.draw = function() {
  background(0);
  push();
  // TODO move to to Hexagon class
  translate(a*(2*s-1), a+b*(s-1));
  for(var y = -(s-1); y<=0; y++){ 
    for(var x = y; x<=0; x+=2){ 
      var RGB = palette.random();
      var R = RGB[0]; var G = RGB[1]; var B = RGB[2];
      for(var n=0; n<6; n++){
        for(var m=0; m<2; m++){ 
          if(debug) stroke(255*m);
          scale(-1,1);
          fill(R,G,B);
          ellipse(a*x, b*y, diameter, diameter);
        }
        rotate(Math.PI/3);
      }
    }
  }
  if(debug) fill(255,0,0);
  if(debug) ellipse(0,0,5,5);
  pop();
  translate(900,200);
  palette.colours.forEach( (rgb, i) => {
    if(i==0) stroke(255);
    fill(rgb[0],rgb[1],rgb[2]);
    rect(i%10*25,Math.floor(i/10)*25,20,20);
    if(i==0) noStroke();
  });
  translate(0,Math.ceil(palette.colours.length/10)*25 + 20);
  var activeColour = 0;
  for(var rgb=0; rgb<3; rgb++){
    var colourClone = [...palette.colours[activeColour]];
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



