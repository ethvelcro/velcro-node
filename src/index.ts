import { LogManager } from "./LogManager";
import { WebhookManager } from "./WebhookManager";
import express from "express";
import enableWs from "express-ws";

const { PORT } = process.env;
if (!PORT) {
    throw new Error("Missing env PORT");
}

const logManager = new LogManager();

const app = express();
enableWs(app);

app.get("/health", (_, res) => {
    res.sendStatus(200);
});

// @ts-ignore: ws injected via express-ws
app.ws('/ipfsHash/:ipfsHash', (ws, req) => {
    const { ipfsHash } = req.params;
    logManager.subscribe(ipfsHash, ws);

    ws.on('close', () => {
        logManager.unsubscribe(ipfsHash);
    });
});

app.listen(PORT, () => {
    console.debug(`Listening on :${PORT}`);
});