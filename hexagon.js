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
    }
    width(){
        return this.a*(4*this.s-2);
    }
    height(){
        return this.b*(2*this.s-2) + this.a*2;
    }
    draw(palette){
        for(var y = 0; y<= this.s-1; y++){
            for(var x=y; x>=0; x-=2){
                var RGB = palette.random();
                var R = RGB[0]; var G = RGB[1]; var B = RGB[2];
                for(var n=0; n<6; n++){
                    for(var m=0; m<2; m++){
                        if(debug) stroke(255*m);
                        scale(-1,1);
                        fill(R,G,B);
                        ellipse(this.a*x, this.b*y, this.diameter, this.diameter);
                    }
                    rotate(Math.PI/3);
                }
            }
        }
        if(debug) this.drawCenterMark();
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
}

export { Hexagon }