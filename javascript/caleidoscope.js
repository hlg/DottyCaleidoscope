import {Palette} from "./palette.js";
import {Hexagon} from "./hexagon.js";

window.debug = false;
var expert = true; // TODO remove control UI for leisure mode
var palette = new Palette();
var hexagon = new Hexagon();

window.setup = function() {
  hexagon.initSize(20);
  palette.initColours(10);
  createCanvas(hexagon.width() + 300, hexagon.height());
  select('#noOfDots').changed(changeSize);
  select('#noOfColours').changed(changeColour);
  select('#redraw').mousePressed(redraw);
  select('#newColours').mousePressed(redrawWithNewColours);
  strokeWeight(2);
  noStroke();
  noLoop();
  redraw();
}

function changeSize(){
  hexagon.initSize(select('#noOfDots').value());
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
  hexagon.draw(palette);
  pop();
  translate(900,200); // palette position
  palette.draw();
}

window.mouseClicked = function(){
  if(mouseX >= 900 && mouseY >= 200) palette.mouseClicked(mouseX-900, mouseY-200);
}


