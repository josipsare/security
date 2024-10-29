import express = require('express');
import cors from 'cors';
import escapeHtml from 'escape-html'
const app = express();
app.use(cors())


type User = {
    accNumber: string;
};

type Users = {
    [key: string]: User; // Index signature for any string key
};

type UserInfo = {
    name: string;
    balance: number;
};

type UserInfoMap = {
    [key: string]: UserInfo; // Index signature for any string key
};

const userInfo: UserInfoMap = {
    '6065': { name: 'Alice', balance: 1000 },
    '6066': { name: 'Bob', balance: 500 },
};

const users: Users = {
    'Alice' : {accNumber: '6065'},
    'Bob' : {accNumber: '6066'}
}

app.get("/", (req, res) => {
    console.log('getting started');
    res.send("Hello World!");
})

app.get('/accountInfo', (req, res) => {
    console.log('u accountInfo sam');
    const accName = req.query.accname as string;
    console.log(`Requested account for: ${accName}`);
    const accNumber = users[accName];
    res.send(accNumber);
})

app.get('/user', (req, res) => {
    const accNum = req.query.accnum as string;
    console.log(`Requested account for: ${accNum}`);
    const accDetails = userInfo[accNum];
    res.send(accDetails);
})

app.get('/helloStrong', (req, res) => {

    const { name } = req.query;

    const safeName = typeof name === 'string' ? escapeHtml(name) : 'Guest';

    console.log(safeName)
    res.send(`<p>Hello ${safeName}!</p>`);
})


app.get('/helloBad', (req, res) => {
    const { name } = req.query;
    console.log(name)
    res.send(`<p>Hello ${name}!</p>`);
})

app.listen(8080, () => {
    console.log('server listening on port 8080')
})
//XSS
//Broken Access Control
