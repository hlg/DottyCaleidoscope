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
  select('#redraw').mouseClicked(redrawWithNewDots);
  select('#newColours').mouseClicked(redrawWithNewColours);
  select('#saveJson').mouseClicked(saveJson);
  select('#loadJson').changed(loadJson);
  select('#savePng').mouseClicked(savePng);
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

function saveJson(){
  var json = {};
  json.colours = palette.colours;
  json.dots = hexagon.dots;
  json.dotSize = hexagon.s;
  saveJSON(json, "design.json");
}

function loadJson(event){
  var reader = new FileReader();
  reader.onload = function (ev){
      var json = JSON.parse(ev.target.result);
      hexagon.initSize(json.dotSize);
      palette.colours = json.colours;
      hexagon.dots = json.dots;
      select('#noOfDots').value(json.dotSize);
      select('#noOfColours').value(json.colours.length);
      redraw();
  };
  // TODO reader.onerror
  reader.readAsText(event.target.files[0]);
}

function savePng(){
  get(0,0,hexagon.width(),hexagon.height()).save('design','png');
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


