import { WebhookManager } from "./WebhookManager";

const http = require("http");

const healthEndpoint = "/health";

const { PORT } = process.env;
if (!PORT) {
    throw new Error("Missing env PORT");
}

http.createServer((req, res) => {
    if (req.url === healthEndpoint) {
        res.writeHead(200);
        res.end();
        return;
    }

    res.writeHead(404);
    res.end();
}).listen(PORT);

console.debug(`Listening on :${PORT}`);


