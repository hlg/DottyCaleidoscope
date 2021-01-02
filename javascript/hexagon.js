class Hexagon {
    constructor() {
        this.dots = []; // change to default size one, black dot?
    }
    initSize(sizeInDots){
        this.s = sizeInDots;
        this.diameter = 400.0/sizeInDots;
        this.distance = this.diameter/10.0;
        this.radius = this.diameter/2.0;
        this.a = this.radius + this.distance/2.0;
        this.b =  this.a * Math.sqrt(3); // 2*a * Math.cos(Math.toRadians(30))
        // this.randomDots();
    }
    width(){
        return 2* this.a * (2 * this.s - 1);
    }
    height(){
        return 2*(this.b*(this.s-1) + this.a);
    }
    randomDots(palette){
        this.dots = []
        for(var i=0; i<Math.ceil((this.s/2+1)*this.s)/2; i++){ // equivalent: i < (s%2 ? (s+1)**2 : s*(s+2))/4
            this.dots[i] = palette.randomIndex();
        }
    }

    iterateDots(payload){
        var x=0; var y=0;
        this.dots.forEach((ci,di) => {
            payload.bind(this)(x,y,ci,di);
            if(x <= y-2){
                x += 2;
            } else {
                y++;
                x = y%2;
            }
        });
    }

    dotsFromImage(templateImg, palette){
        palette.colours=[];
        var hx=this.centerX(); var hy = this.centerY();
        var noCols = select('#noOfColours').value();
        var cRes =2**(9-Math.floor(Math.log(noCols+1)/Math.log(2.5)));
        // cRes will be 256/128/64/32, max palette size 8/64/512/4096, much smaller on average
        // TODO: warn and don't show full palette when too large
        this.iterateDots(function(x,y,ci,d){
            var region = templateImg.get(this.a*(x-1)+hx, this.b*(y-0.5)+hy, this.a*2, this.b);
            region.loadPixels();
            var average = [0,0,0];
            for(var rgb = 0; rgb<3; rgb++){
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
            this.dots[d] = existingColour;
        });
    }

    drawHexagon(palette){
        strokeWeight(0.4);
        this.iterateDots( this.drawDotFunction(palette));
        if(debug) this.drawCenterMark();
    }

    drawDotFunction(palette){
        // TODO I think hexagon should know its palette. Then this curry can be removed.
        return function (x,y,ci, di){
            this.drawDot.bind(this)(palette.colours[ci], x, y);
        }
    }

    drawDot(RGB, x, y) {
        var R = RGB[0];
        var G = RGB[1];
        var B = RGB[2];
        for (var n = 0; n < 6; n++) {
            for (var m = 0; m < 2; m++) {
                if (RGB[0] + RGB[1] + RGB[2] < 32) stroke(255); else noStroke();
                if (debug) stroke(255 * m);
                scale(-1, 1);
                fill(R, G, B);
                ellipse(this.a * x, this.b * y, this.diameter, this.diameter);
            }
            rotate(Math.PI / 3);
        }
    }

    drawCenterMark() {
        fill(255, 0, 0);
        ellipse(0, 0, 5, 5);
    }

    centerY() {
        return this.a + this.b * (this.s - 1);
    }

    centerX() {
        return this.a * (2 * this.s - 1);
    }
    mouseClicked(x,y,palette){
        var yi = Math.floor(y/this.b+0.5);
        if(yi>=0 && yi<this.s){
            var xi = Math.floor((x/this.a+((yi+1)%2))/2);
            if(xi>=0 && xi<=Math.floor(yi/2)){
                var ci = yi===0 ? 0 : (Math.ceil((yi/2+1)*yi)/2 + xi);
                this.dots[ci] = palette.activeColour;
                redraw();
            }
        }
    }
}

export { Hexagon }