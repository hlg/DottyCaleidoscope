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
  createCanvas(hexagon.width() + 300, hexagon.height());
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
      templateImg.loadPixels();
      templateImg.resize(hexagon.width(), hexagon.height());
      templateImg.updatePixels();
      var x=0; var y=0;
      palette.colours=[];
      var hx=hexagon.centerX(); var hy = hexagon.centerY();
      var noCols = select('#noOfColours').value();
      var cRes =2**(9-Math.floor(Math.log(noCols+1)/Math.log(2.5)));
      // cRes will be 256/128/64/32, max palette size 8/64/512/4096, much smaller on average
      // TODO: warn and don't show full palette when too large
      for(var d=0; d<hexagon.dots.length; d++){
        var region = templateImg.get(hexagon.a*(x-1)+hx, hexagon.b*(y-0.5)+hy, hexagon.a*2, hexagon.b);
        region.loadPixels();
        var average = [0,0,0];
        for(var rgb = 0; rgb<3; rbg++){
          for(var i=0; i<region.pixels.length; i+=4){
            average[rgb] += region.pixels[i+rgb];
          }
          average[rgb] = Math.floor(average[rgb]*4/region.pixels.length / cRes + 0.5)*cRes;
        }
        let existingColour = palette.colours.findIndex(function (col){
          return col.every(function(c,i){return c===average[i]});
        });
        if(existingColour===-1){
          palette.colours.push(average);
          existingColour = palette.colours.length-1;
        }
        hexagon.dots[d] = existingColour;
        if(x <= y-2){
          x += 2;
        } else {
          y++;
          x = y%2;
        }
      }
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
  hexagon.draw(palette);
  pop();
  translate(900,200); // palette position
  palette.draw();
}

window.mouseClicked = function(){
  if(mouseX >= 900 && mouseY >= 200) palette.mouseClicked(mouseX-900, mouseY-200);
  hexagon.mouseClicked(mouseX-hexagon.centerX(), hexagon.centerY()-mouseY, palette);
}


