"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors_1 = __importDefault(require("cors"));
const escape_html_1 = __importDefault(require("escape-html"));
const app = express();
app.use((0, cors_1.default)());
const userInfo = {
    '6065': { name: 'Alice', balance: 1000 },
    '6066': { name: 'Bob', balance: 500 },
};
const users = {
    'Alice': { accNumber: '6065' },
    'Bob': { accNumber: '6066' }
};
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
app.get('/user', (req, res) => {
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
