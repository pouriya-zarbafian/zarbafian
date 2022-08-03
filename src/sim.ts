class Simulation {

    running: boolean = false;
    initialProcessCount: number = 10;
    joiningProcessCount: number = 0;


    displayLinks: boolean = true;
    displayMessages: boolean = false;
    speed: number = 20;

    onlinePeers: Peer[] = [];
    offlinePeers: Peer[] = [];
    peerMap: { [pid: number]: Peer } = {};

    push: boolean = true;
    pull: boolean = true;
    T: number = 1000;
    c: number = 16;
    H: number = 1;
    S: number = 7;

    init() {
        // generate network of all potential processes
        this.offlinePeers = this.generateNetwork();
        for(let peer of this.offlinePeers) {
            this.peerMap[peer.id] = peer;
        }
    }

    async toggleProcess(pid: number) {
        if(this.peerMap[pid]) {
            let peer = this.peerMap[pid];
            if(peer.running) {
                await peer.stop();
                console.log(`peer ${peer.id} has stopped`);
                for(let i=0; i<this.onlinePeers.length; i++) {
                    if(this.onlinePeers[i].id == peer.id) {
                        let removedPeer: Peer = this.onlinePeers.splice(i, 1)[0];
                        this.offlinePeers.push(removedPeer);
                        break;
                    }
                }
            }
            else {
                peer.start();
                console.log(`peer ${peer.id} has started`);
                for(let i=0; i<this.offlinePeers.length; i++) {
                    if(this.offlinePeers[i].id == peer.id) {
                        let removedPeer: Peer = this.offlinePeers.splice(i, 1)[0];
                        this.onlinePeers.push(removedPeer);
                        break;
                    }
                }
            }
        }
    }

    infect(pid: number) {
        if(this.peerMap[pid]) {
            let peer = this.peerMap[pid];
            if(peer.running) {
                peer.startInfection();
            }
        }
    }

    async start() {
        console.log('Starting simulation...');
        
        // select initial peers
        shuffleArray(this.offlinePeers);
        this.onlinePeers = this.offlinePeers.splice(0, this.initialProcessCount);

        // setup DNS with initial peers
        /*
        for(let i=0; i < Math.min(10, this.onlinePeers.length); i++) {
            DnsService.getInstance().registerPeer(this.onlinePeers[i].id);
        }
        */
        DnsService.getInstance().registerPeer(this.onlinePeers[0].id);

        // start peers
        for(let p of this.onlinePeers) {
            p.start();
        }

        console.log('...simulation started');
    }

    async stop() {
        console.log(`Stopping simulation...`);

        // stop each peer
        this.onlinePeers.forEach(p => p.running = false);
        for(let p of this.onlinePeers) {
            await p.stop();
            console.log(`peer ${p.id} has stopped`);
        }

        // clear online peers structure
        Array.prototype.push.apply(this.offlinePeers, this.onlinePeers.splice(0));

        // clear DNS peers
        DnsService.getInstance().clearPeers();

        console.log(`...simulation stopped`);
    }

    generateNetwork(): Peer[] {
        let creationProbability = 0.4;
        let areaSize = 24;
        let width = svgManager.width;
        let height = svgManager.height;
        let maxX = Math.floor(width / areaSize);
        let maxY = Math.floor(height / areaSize);
        
        let nextId = 1;
        let peers = [];

        for(let x = 1; x < maxX - 1; x++) {
            for (let y = 1; y < maxY - 1; y++) {
                let px = x * areaSize + getRandomInt(areaSize - 8) + 4 - svgManager.zero.x;
                let py = y * areaSize + getRandomInt(areaSize - 8) + 4 - svgManager.zero.y;

                let proba = Math.random();
                if(proba < creationProbability) {
                    let peer = new Peer(nextId, new Point(px, py));
                    nextId++;
                    peers.push(peer)
                    svgManager.createProcess(peer);
                }
            }
        }

        console.log(`Created ${peers.length} peers`);
        
        return peers;
    }
}