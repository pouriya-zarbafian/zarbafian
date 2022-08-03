namespace Html {
    export const display = "display";
    export const svg = "svg";
}

class Point {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

enum Color {
    Background = "#FFFFFF",
    //
    ProcessOnline = "#44ff44",
    ProcessInfected = "#2222ff",
    ProcessRemoved = "#ff4444",
    MessageSampling = "#44ff44",
    MessageInfected = "#4444ff",
    LinkDefault = "#000000",
}
enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
}