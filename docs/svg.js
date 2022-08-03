const SVG_NS = "http://www.w3.org/2000/svg";
function getAnimationDuration(distance) {
    let numberOfTimeUnits = distance / 300;
    let durationPerTimeUnit = 20 / 33333333;
    return Math.round(durationPerTimeUnit * numberOfTimeUnits * 1000);
}
function toLinkId(id1, id2) {
    return id1 + "-" + id2;
}
var part_colors = [
    "#000000",
    "#DF5B3E",
    "#068A4B",
    "#80188F",
    "#D47A11",
    "#679BE2",
    "#D411A6",
    "#26AC17",
];
var PartIndex;
(function (PartIndex) {
    PartIndex[PartIndex["P0"] = 0] = "P0";
    PartIndex[PartIndex["P1"] = 1] = "P1";
    PartIndex[PartIndex["P2"] = 2] = "P2";
    PartIndex[PartIndex["P3"] = 3] = "P3";
    PartIndex[PartIndex["P4"] = 4] = "P4";
    PartIndex[PartIndex["P5"] = 5] = "P5";
    PartIndex[PartIndex["P6"] = 6] = "P6";
    PartIndex[PartIndex["P7"] = 7] = "P7";
})(PartIndex || (PartIndex = {}));
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
    constructor(id, width, height) {
        this.fromElement = null;
        this.toElement = null;
        this.nextPart = 0;
        this.id = id;
        this.width = width;
        this.height = height;
        this.zero = new Point(Math.round(this.width / 2), Math.round(this.height / 2));
    }
    init() {
        let svg = document.createElementNS(SVG_NS, "svg");
        svg.setAttribute("id", this.id);
        svg.setAttribute("width", this.width.toString());
        svg.setAttribute("height", this.height.toString());
        svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
        document.getElementById(Html.display).appendChild(svg);
        this.drawMenu();
    }
    drawMenu() {
        let rect = document.createElementNS(SVG_NS, 'rect');
        rect.setAttribute('x', '5');
        rect.setAttribute('y', '5');
        rect.setAttribute('width', '50');
        rect.setAttribute('height', '500');
        rect.setAttribute('fill', '#95B3D7');
        document.getElementById(this.id).appendChild(rect);
    }
    draw() {
        this.newCircle("test", { x: 100, y: 100 }, Color.Background);
    }
    newCircle(id, position, color) {
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
    cartesianToScreen(point) {
        return new Point(point.x + this.zero.x, -point.y + this.zero.y);
    }
    getMousePosition(event) {
        var CTM = document.getElementById(this.id).getScreenCTM();
        return new Point((event.clientX - CTM.e) / CTM.a, (event.clientY - CTM.f) / CTM.d);
    }
}
//# sourceMappingURL=svg.js.map