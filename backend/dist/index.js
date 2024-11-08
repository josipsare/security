"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors_1 = __importDefault(require("cors"));
const escape_html_1 = __importDefault(require("escape-html"));
const crypto_1 = __importDefault(require("crypto"));
const app = express();
app.use((0, cors_1.default)());
const userInfo = {
    '6065': { name: 'Alice', balance: 1000 },
    '6066': { name: 'Bob', balance: 500 },
    '6064': { name: 'Mike', balance: 8000 },
};
const users = {
    'Alice': { accNumber: '6065' },
    'Bob': { accNumber: '6066' },
    'Mike': { accNumber: '6064' }
};
const accessReferenceMap = {};
function generateTempId() {
    return crypto_1.default.randomBytes(3).toString('hex');
}
// @ts-ignore
app.get('/generateTempId', (req, res) => {
    const accName = req.query.accname;
    const userAccount = users[accName];
    if (accName && userAccount) {
        const tempId = generateTempId();
        accessReferenceMap[tempId] = userAccount.accNumber;
        return res.json({ tempId });
    }
    else {
        res.status(403).send({ error: "Access Denied: Unauthorized access." });
    }
});
app.get("/", (req, res) => {
    console.log('getting started');
    res.send("Hello World!");
});
app.get('/accountInfo', (req, res) => {
    console.log('u accountInfo sam');
    const accName = req.query.accname;
    console.log(`Requested account for: ${accName}`);
    const accNumber = users[accName];
    res.send(accNumber);
});
app.get('/userWeak', (req, res) => {
    const accNum = req.query.accnum;
    console.log(`Requested account for: ${accNum}`);
    const accDetails = userInfo[accNum];
    res.send(accDetails);
});
app.get('/user', (req, res) => {
    const tempId = req.query.tempId;
    const accNumber = accessReferenceMap[tempId];
    if (accNumber) {
        const accDetails = userInfo[accNumber];
        res.send(accDetails);
    }
    else {
        res.status(403).send('Access Denied: Invalid or expired reference');
    }
});
app.get('/userBad', (req, res) => {
    const accNum = req.query.accnum;
    console.log(`Requested account for: ${accNum}`);
    const accDetails = userInfo[accNum];
    res.send(accDetails);
});
app.get('/helloStrong', (req, res) => {
    const { name } = req.query;
    const safeName = typeof name === 'string' ? (0, escape_html_1.default)(name) : 'Guest';
    console.log(safeName);
    res.send(`<p>Hello ${safeName}!</p>`);
});
app.get('/helloBad', (req, res) => {
    const { name } = req.query;
    console.log(name);
    res.send(`<p>Hello ${name}!</p>`);
});
app.listen(8080, () => {
    console.log('server listening on port 8080');
});
//XSS
//Broken Access Control
