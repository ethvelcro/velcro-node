import WebSocket from "ws";

export class LogManager {
    private subscriptions: Map<string, WebSocket>;

    constructor() {
        this.subscriptions = new Map();
    }

    public subscribe(ipfsHash: string, ws: WebSocket) {
        this.subscriptions[ipfsHash] = ws;
        console.info(`Log subscription ${ipfsHash} addded`);
    }

    public unsubscribe(ipfsHash: string) {
        delete this.subscriptions[ipfsHash];
        console.info(`Log subscription ${ipfsHash} removed`);
    }

    public pushLog(ipfsHash: string, log: Object) {
        const ws = this.subscriptions[ipfsHash];
        if (!ws) {
            return;
        }

        try {
            ws.send(JSON.stringify(log));
        } catch (err) {
            console.error(err);
        }
    }
}