const SVG_NS = "http://www.w3.org/2000/svg";

function getAnimationDuration(distance: number) {
    let numberOfTimeUnits = distance / 300;
    let durationPerTimeUnit = 20 / simulation.speed;
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

const PATHS_OLD = [
    "M0 0 0-7A7 7 0 0 1 5-5Z", 
    "M0 0 5-5A7 7 0 0 1 7 0Z", 
    "M0 0 7 0A7 7 0 0 1 5 5Z", 
    "M0 0 5 5A7 7 0 0 1 0 7Z", 
    "M0 0 0 7A7 7 0 0 1-5 5Z", 
    "M0 0-5 5A7 7 0 0 1-7 0Z", 
    "M0 0-7 0A7 7 0 0 1-5-5Z", 
    "M0 0-5-5A7 7 0 0 1 0-7Z"
];

const PATHS = [
    "M0 0 0-14A14 14 0 0 1 10-10Z", 
    "M0 0 10-10A14 14 0 0 1 14 0Z", 
    "M0 0 14 0A14 14 0 0 1 10 10Z", 
    "M0 0 10 10A14 14 0 0 1 0 14Z", 
    "M0 0 0 14A14 7 0 0 1-10 10Z", 
    "M0 0-10 10A14 14 0 0 1-14 0Z", 
    "M0 0-14 0A14 14 0 0 1-10-10Z", 
    "M0 0-10-10A14 14 0 0 1 0-14Z"
];

function testStartData() {
    if (!simulation.running) {
        window.alert("You must start a simulation first.");
        return;
    }
    let pid = simulation.onlinePeers[getRandomInt(simulation.onlinePeers.length)].id;
    console.log(`selected random peer ${pid} to notify part ${svgManager.nextPart}`);
    simulation.peerMap[pid].onDataPart(svgManager.nextPart);
    svgManager.nextPart = (svgManager.nextPart + 1) % 8;
}

class SvgManager {
    id: string;
    width: number;
    height: number;
    zero: Point;

    point: any;

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
        
        this.point = svg.createSVGPoint();

        let leftClickHandler = (event: any) => {
            if(event.button == MouseButton.Left) {
                let pid = this.parseProcessId(event.target.id);
                //console.log(`left clicked: pid=${pid}`);
                simulation.toggleProcess(pid);
            }
        };
        let rightClickHandler = (event: any) => {
            event.preventDefault();
            let pid = this.parseProcessId(event.target.id);
            //console.log(`right clicked: pid=${pid}`);
            simulation.infect(pid);
        };

        svg.addEventListener('mouseup', leftClickHandler);
        svg.addEventListener('contextmenu', rightClickHandler);

        document.getElementById(Html.display).appendChild(svg);
    }

    parseProcessId(htmlId: string): number {
        return parseInt(htmlId.substring(htmlId.lastIndexOf('_') + 1));
    }

    getMousePosition(event: any): Point {
        var CTM = (document.getElementById(this.id) as unknown as SVGGraphicsElement).getScreenCTM();
        return new Point((event.clientX - CTM.e) / CTM.a, (event.clientY - CTM.f) / CTM.d);
    }

    parseTransform(transform: string): Point {
        let begin = transform.indexOf("(") + 1;
        let middle = transform.indexOf(",");
        let end = transform.indexOf(")");
        let x = parseFloat(transform.substring(begin, middle));
        let y = parseFloat(transform.substring(middle + 1, end));
        return new Point(x, y);
    }

    // convert screen coordinates to cartesian coordinates
    private screenToCartesian(point: Point) {
        let raw = new Point(point.x - this.zero.x, this.zero.y - point.y);
        return new Point(raw.x, raw.y);
    }
    // convert cartesian coordinates to screen coordinates
    private cartesianToScreen(point: Point) {
        return new Point(point.x + this.zero.x, -point.y + this.zero.y);
    }

    //createProcess(process: Process) {
    createProcess(peer: Peer) {

        let center = this.cartesianToScreen(peer.position);

        let group = document.createElementNS(SVG_NS, "g");
        group.setAttributeNS(null, "id", "g_" + peer.id);
        group.setAttributeNS(null, "text-anchor", "middle");
        group.setAttributeNS(null, "transform", "translate(" + center.x + "," + center.y + ")");
        
        // circle for process
        let circle = document.createElementNS(SVG_NS, "circle");
        circle.setAttributeNS(null, "id", "circle_" + peer.id );
        circle.setAttributeNS(null, "cx", "0");
        circle.setAttributeNS(null, "cy", "0");
        circle.setAttributeNS(null, "r", "3");
        //circle.setAttributeNS(null, "r", PROCESS_SIZE.toString());
        circle.setAttributeNS(null, "fill", Color.ProcessOffline);
        circle.setAttributeNS(null, "opacity", "1");
        //circle.setAttributeNS(null, "fill", process.byzantine ? Color.ByzantineProcess : Color.CorrectProcess);
        circle.setAttributeNS(null, "stroke", "black");
        circle.setAttributeNS(null, "stroke-opacity", "0.1");
        circle.setAttributeNS(null, "class", "draggable peer");

        group.appendChild(circle);

        /*
        // process label
        let label = document.createElementNS(SVG_NS, "text");
        label.setAttributeNS(null, "id", peer.id + "label");
        label.setAttributeNS(null, "x", "0");
        label.setAttributeNS(null, "y", "0");
        label.setAttributeNS(null, "y", "0");
        label.setAttributeNS(null, "class", "label");
        label.setAttributeNS(null, "opacity", "0");
        let labelNode = document.createTextNode(peer.id.toString());
        label.appendChild(labelNode);
        group.appendChild(label);
        */

        document.getElementById(this.id).appendChild(group);
    }

    createLink(id: string, start: Point, end: Point) {
        
        let startScreen = this.cartesianToScreen(start);
        let endScreen = this.cartesianToScreen(end);
        
        let line = document.createElementNS(SVG_NS, "line");
        line.setAttributeNS(null, "id", id);
        line.setAttributeNS(null, "x1", startScreen.x.toString());
        line.setAttributeNS(null, "y1", startScreen.y.toString());
        line.setAttributeNS(null, "x2", endScreen.x.toString());
        line.setAttributeNS(null, "y2", endScreen.y.toString());
        line.setAttributeNS(null, "stroke", Color.LinkDefault);
        line.setAttributeNS(null, "stroke-width", "1px");
        line.setAttributeNS(null, "stroke-opacity", "0.2");
        line.setAttributeNS(null, "class", "link");
        line.setAttributeNS(null, "opacity", "0.5");

        let svgElement = document.getElementById(this.id);
        svgElement.insertBefore(line, svgElement.firstChild);
    }

    removeLink(link: Link): void {
        let svgElement = document.getElementById(this.id);
        let linkElement = document.getElementById(link.toId());
        svgElement.removeChild(linkElement);
    }

    newMessage(id: string, position: Point, color: string): SVGGraphicsElement {

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

    addDataPart(pid: number, parseIndex: PartIndex) {
        let d = PATHS[parseIndex];
        let fill = Color.ProcessInfected;
        let circlePart = document.createElementNS(SVG_NS, "path");
        circlePart.setAttributeNS(null, "id", "part" + parseIndex + "_" + pid);
        circlePart.setAttributeNS(null, "d", d);
        circlePart.setAttributeNS(null, "fill", part_colors[parseIndex]);
        document.getElementById("g_" + pid).appendChild(circlePart);
    }

    clearDataParts(pid: number) {
        for(let i=0; i<8; i++) {
            let partElement = document.getElementById("part" + i + "_" + pid);
            if(partElement != null) {
                document.getElementById("g_" + pid).removeChild(partElement);
            }
        }
    }
 
    setSourceProcess(pid: number) {
        // circle for source
        let circle = document.createElementNS(SVG_NS, "circle");
        circle.setAttributeNS(null, "id", "source_" + pid);
        circle.setAttributeNS(null, "cx", "0");
        circle.setAttributeNS(null, "cy", "0");
        circle.setAttributeNS(null, "r", "10");
        circle.setAttributeNS(null, "fill", Color.ProcessInfected);
        circle.setAttributeNS(null, "opacity", "0.3");

        document.getElementById("g_" + pid).appendChild(circle);
    }

    clearSourceProcess(pid: number) {
        let group = document.getElementById("g_" + pid);
        let source = document.getElementById("source_" + pid);
        group.removeChild(source);
    }

    send(process: Peer, targets: Peer[], message: Message) {
        for (let target of targets) {
            let msgId = "msgFROM" + process.id + "TO" + target.id;
            let svgElement = this.newMessage(msgId, process.position, message.epidemic ? Color.MessageInfected : Color.MessageSampling);
            let senderPositionScreen = this.cartesianToScreen(process.position);
            let targetPositionScreen = this.cartesianToScreen(target.position);

            let d = distance(process.position, target.position);
            let t = getAnimationDuration(d);
            let animation = new MessageAnimation(svgElement, senderPositionScreen, targetPositionScreen, t);
            const onCompletion = () => {
                MessageBus.getInstance().notify(message, target.id.toString());
            };
            animation.start(onCompletion);
        }
    }

    setProcessStatus(pid: number, status: PeerStatus) {
        let color;
        switch(status) {
            case PeerStatus.Online:
                color = Color.ProcessOnline;
                //document.getElementById(pid + "label").setAttributeNS(null, "opacity", "1");;
                break;
            case PeerStatus.Offline:
                color = Color.ProcessOffline;
                break;
            case PeerStatus.Infected:
                color = Color.ProcessInfected;
                break;
            case PeerStatus.Removed:
                color = Color.ProcessRemoved;
                break;
            default:
                console.log(`unknown status ${status}`);
        }
        document.getElementById("circle_" + pid).setAttributeNS(null, "fill", color);
    }
}