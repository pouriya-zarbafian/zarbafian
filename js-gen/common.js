var Html;
(function (Html) {
    Html.display = "display";
    Html.svg = "svg";
})(Html || (Html = {}));
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
var Color;
(function (Color) {
    Color["Background"] = "#FFFFFF";
    Color["ProcessOnline"] = "#44ff44";
    Color["ProcessInfected"] = "#2222ff";
    Color["ProcessRemoved"] = "#ff4444";
    Color["MessageSampling"] = "#44ff44";
    Color["MessageInfected"] = "#4444ff";
    Color["LinkDefault"] = "#000000";
})(Color || (Color = {}));
var MouseButton;
(function (MouseButton) {
    MouseButton[MouseButton["Left"] = 0] = "Left";
    MouseButton[MouseButton["Middle"] = 1] = "Middle";
    MouseButton[MouseButton["Right"] = 2] = "Right";
})(MouseButton || (MouseButton = {}));
//# sourceMappingURL=common.js.map