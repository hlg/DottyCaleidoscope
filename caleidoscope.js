import {Palette} from "./palette.js";
import {Hexagon} from "./hexagon.js";

window.debug = false;
var expert = true; // TODO remove control UI for leisure mode
var palette = new Palette();
var hexagon = new Hexagon();

window.setup = function() {
  hexagon.initSize(20);
  palette.initColours(10);
  hexagon.randomDots(palette); // TODO move to hexagon.initSize
  createCanvas(hexagon.width() + 300, hexagon.height());
  select('#noOfDots').changed(changeHexagonSize);
  select('#noOfColours').changed(changePaletteSize);
  select('#redraw').mousePressed(redrawWithNewDots);
  select('#newColours').mousePressed(redrawWithNewColours);
  strokeWeight(2);
  noStroke();
  noLoop();
  redraw();
}

function changeHexagonSize(){
  // TODO keep as much of hexagon as possible when changing size
  hexagon.initSize(select('#noOfDots').value());
  hexagon.randomDots(palette);
  redraw();
}

function changePaletteSize(){
  // TODO keep as much of palette as possible when changing size
  palette.initColours(select('#noOfColours').value());
  hexagon.randomDots(palette); // TODO extra function or flag that keeps those indizes which are still valid
  redraw();
}

function redrawWithNewColours(){
  palette.initColours();
  redraw();
}

function redrawWithNewDots(){
  hexagon.randomDots(palette);
  redraw();
}

window.draw = function() {
  background(0);
  push();
  translate(hexagon.centerX(), hexagon.centerY());
  hexagon.draw(palette);
  pop();
  translate(900,200); // palette position
  palette.draw();
}

window.mouseClicked = function(){
  if(mouseX >= 900 && mouseY >= 200) palette.mouseClicked(mouseX-900, mouseY-200);
  hexagon.mouseClicked(mouseX-hexagon.centerX(), hexagon.centerY()-mouseY, palette);
}


