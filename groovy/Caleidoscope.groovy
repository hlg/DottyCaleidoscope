import processing.core.PApplet

class Caleidoscope extends PApplet{
  double diameter = 10
  int s = 40
  int paletteSize = 5 
  double distance = diameter/10
  double radius = diameter/2
  double a = radius + distance/2
  double b =  a * Math.sqrt(3) // 2*a * Math.cos(Math.toRadians(30))
  boolean debug = false
  Random randomizer = new Random()
  def palette = (1..paletteSize).collect{[rand256(),rand256(),rand256()]}

  void setup(){
    background(0)
    println("a=$a, b=$b")
    int h = a*(4*s-2)
    int w = b*(2*s-2) + a*2
    size(h,w) 
    translate(a*(2*s-1) as float,a+b*(s-1) as float)
    (-(s-1)..0).each{ y ->
      (y..0).step(2){ x ->
        def (R,G,B) = palette[randomizer.nextInt(paletteSize)]
        6.times{
          2.times{ m ->
            if(debug) stroke(255*m)
            scale(-1,1)
            fill(R,G,B)
            ellipse(a*x as float, b*y as float, diameter as float, diameter as float)
          }
          rotate(Math.toRadians(60.0) as float)
        }
      }
    }
    if(debug) fill(255,0,0)
    if(debug) ellipse(0,0,5,5)
  }

  void draw(){
  }
  
  private int rand256(){
    randomizer.nextInt(256)
  }

  public static void main(String[] args) {
    PApplet.main(["Caleidoscope"] as String[])
  }

}

