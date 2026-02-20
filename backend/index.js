const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const puppeteer = require('puppeteer');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

let browser;
let page;
let devToolsConnections = new Set();

async function launchBrowser() {
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        page = await browser.newPage();
        await page.goto('https://example.com');
    } catch (error) {
        console.error('Error launching browser:', error);
    }
}

wss.on('connection', async (ws) => {
    console.log('Client connected');

    const devToolsConnection = await page.target().createCDPSession();
    devToolsConnections.add(devToolsConnection);

    devToolsConnection.on('message', (message) => {
        ws.send(JSON.stringify(message));
    });

    // Forward console messages to the client
    devToolsConnection.on('Runtime.consoleAPICalled', (params) => {
        ws.send(JSON.stringify({ method: 'Runtime.consoleAPICalled', params }));
    });

    await devToolsConnection.send('Runtime.enable');
    await devToolsConnection.send('CSS.enable');


    ws.on('message', async (message) => {
        try {
            const parsedMessage = JSON.parse(message);

            if (parsedMessage.method === 'getStyleSheetId') {
                const styleSheets = await devToolsConnection.send('CSS.getAllStyleSheets');
                const styleSheetId = styleSheets.headers[0].styleSheetId;
                ws.send(JSON.stringify({ styleSheetId }));
            } else {
                devToolsConnection.send(parsedMessage.method, parsedMessage.params);

                // Broadcast to other clients
                wss.clients.forEach(client => {
                    if (client !== ws && client.readyState === WebSocket.OPEN) {
                        client.send(JSON.stringify(parsedMessage));
                    }
                });
            }

        } catch (error) {
            console.error('Error processing message:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        devToolsConnection.detach();
        devToolsConnections.delete(devToolsConnection);
    });
});

const PORT = process.env.PORT || 3001;

launchBrowser().then(() => {
    server.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });
});
