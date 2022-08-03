const SVG_NS = "http://www.w3.org/2000/svg";

function getAnimationDuration(distance: number) {
    let numberOfTimeUnits = distance / 300;
    let durationPerTimeUnit = 20 / 33333333;
    return Math.round(durationPerTimeUnit * numberOfTimeUnits * 1000);
}

// (id1 ,id2) -> id1-id2
function toLinkId(id1: number, id2: number): string {
    return id1 + "-" + id2;
}

var part_colors= [
    "#000000", 
    "#DF5B3E", 
    "#068A4B", 
    "#80188F",
    "#D47A11", 
    "#679BE2", 
    "#D411A6", 
    "#26AC17",
];


enum PartIndex {
    P0, 
    P1, 
    P2, 
    P3,
    P4, 
    P5, 
    P6, 
    P7,
}
const PATHS = [
    "M0 0 0-7A7 7 0 0 1 5-5Z", 
    "M0 0 5-5A7 7 0 0 1 7 0Z", 
    "M0 0 7 0A7 7 0 0 1 5 5Z", 
    "M0 0 5 5A7 7 0 0 1 0 7Z", 
    "M0 0 0 7A7 7 0 0 1-5 5Z", 
    "M0 0-5 5A7 7 0 0 1-7 0Z", 
    "M0 0-7 0A7 7 0 0 1-5-5Z", 
    "M0 0-5-5A7 7 0 0 1 0-7Z"
];

class SvgManager {
    id: string;
    width: number;
    height: number;
    zero: Point;

    //point: any;

    // link edition
    fromElement: SVGGraphicsElement = null;
    toElement: SVGGraphicsElement = null;

    nextPart: number = 0;

    constructor(id: string, width: number, height: number) {
        this.id = id;
        this.width = width;
        this.height = height;
        this.zero = new Point(Math.round(this.width/2), Math.round(this.height/2));
    }

    init() {
        let svg = document.createElementNS(SVG_NS, "svg");

        svg.setAttribute("id", this.id);
        //svg.setAttribute("style", "border: 1px solid #444444");
        svg.setAttribute("width", this.width.toString());
        svg.setAttribute("height", this.height.toString());
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");

        document.getElementById(Html.display).appendChild(svg);

        this.drawMenu();
    }

    drawMenu() {
        let rect = document.createElementNS(SVG_NS,'rect');
        rect.setAttribute('x', '5');
        rect.setAttribute('y', '5');
        rect.setAttribute('width', '50');
        rect.setAttribute('height', '500');
        rect.setAttribute('fill','#95B3D7');

        document.getElementById(this.id).appendChild(rect);
    }

    draw() {
        this.newCircle("test", {x: 100, y: 100}, Color.Background)
    }

    newCircle(id: string, position: Point, color: string): SVGGraphicsElement {

        let center = this.cartesianToScreen(position);

        let circle = document.createElementNS(SVG_NS, "circle");
        circle.setAttributeNS(null, "id", id);
        circle.setAttributeNS(null, "cx", center.x.toString());
        circle.setAttributeNS(null, "cy", center.y.toString());
        circle.setAttributeNS(null, "r", "4");
        circle.setAttributeNS(null, "fill", color);
        circle.setAttributeNS(null, "stroke", "none");
        circle.setAttributeNS(null, "class", "message");
        circle.setAttributeNS(null, "opacity", "0.7");
        document.getElementById(this.id).appendChild(circle);

        return circle;
    }

    private cartesianToScreen(point: Point) {
        return new Point(point.x + this.zero.x, -point.y + this.zero.y);
    }

    getMousePosition(event: any): Point {
        var CTM = (document.getElementById(this.id) as unknown as SVGGraphicsElement).getScreenCTM();
        return new Point((event.clientX - CTM.e) / CTM.a, (event.clientY - CTM.f) / CTM.d);
    }


}