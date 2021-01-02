import {Palette} from "./palette.js";
import {Hexagon} from "./hexagon.js";

window.debug = false;
var expert = true; // TODO remove control UI for leisure mode
var palette = new Palette();
var hexagon = new Hexagon();
var templateImg;

window.setup = function() {
  hexagon.initSize(20);
  palette.initColours(10);
  hexagon.randomDots(palette);
  createCanvas(1200, 800);
  select('#noOfDots').changed(changeHexagonSize);
  select('#noOfColours').changed(changePaletteSize);
  select('#redraw').mouseClicked(redrawWithNewDots);
  select('#newColours').mouseClicked(redrawWithNewColours);
  select('#saveJson').mouseClicked(saveJson);
  select('#loadJson').changed(loadJson);
  select('#savePng').mouseClicked(savePng);
  select('#loadTemplate').changed(loadTemplate);
  select('#showTemplate').changed(redraw);
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
  hexagon.randomDots(palette); // TODO keeps those indizes which are still valid
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
  // TODO reader.onerror // and error handling in general
  reader.readAsText(event.target.files[0]);
}

function loadTemplate(event){
  var reader = new FileReader();
  reader.onload = function (e){
    loadImage(e.target.result, function(img){
      templateImg = img;
      templateImg.resize(hexagon.width(), hexagon.height());
      templateImg.loadPixels();
      hexagon.dotsFromImage(templateImg, palette);
      select('#noOfColours').value(palette.colours.length);
      var showTemplate = select("#showTemplate");
      showTemplate.elt.disabled = false;
      showTemplate.elt.checked = true;
      redraw();
    });
  }
  reader.readAsDataURL(event.target.files[0]);
}

function savePng(){
  get(0,0,hexagon.width(),hexagon.height()).save('design','png');
}

window.draw = function() {
  background(0);
  if(select("#showTemplate").elt.checked && templateImg) image(templateImg,0,0); //, hexagon.width(), hexagon.width()/templateImg.width*templateImg.height);
  push();
  translate(hexagon.centerX(), hexagon.centerY());
  hexagon.drawHexagon(palette);
  pop();
  translate(900,200); // palette position
  palette.draw();
}

window.mouseClicked = function(){
  if(mouseX >= 900 && mouseY >= 200) palette.mouseClicked(mouseX-900, mouseY-200);
  hexagon.mouseClicked(mouseX-hexagon.centerX(), hexagon.centerY()-mouseY, palette);
}


