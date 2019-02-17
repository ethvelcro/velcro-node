import WebSocket from "ws";

export class LogManager {
    private subscriptions: Map<string, WebSocket[]>;

    constructor() {
        this.subscriptions = new Map();
    }

    public subscribe(ipfsHash: string, ws: WebSocket) {
        this.subscriptions[ipfsHash];
        if (!this.subscriptions[ipfsHash]) {
            this.subscriptions[ipfsHash] = [];
        }

        this.subscriptions[ipfsHash].push(ws);

        console.info(`Log subscription ${ipfsHash} added to. Current: ${this.subscriptions[ipfsHash].length}`);
    }

    public unsubscribe(ipfsHash: string, ws: WebSocket) {
        if (!this.subscriptions[ipfsHash]) {
            return;
        }

        this.subscriptions[ipfsHash] = this.subscriptions[ipfsHash].filter((arrWs) => arrWs !== ws);

        console.info(`Log subscription ${ipfsHash} removed from. Current: ${this.subscriptions[ipfsHash].length}`);
    }

    public pushLog(ipfsHash: string, log: Object) {
      console.log(`pushLog ${ipfsHash}`, log)
        const wsArr = this.subscriptions[ipfsHash];
        if (!wsArr) {
            return;
        }

        wsArr.forEach((ws) => {
            try {
                ws.send(JSON.stringify(log));
            } catch (err) {
                console.error(err);
            }
        });
    }
}
