import express = require('express');
import cors from 'cors';
import escapeHtml from 'escape-html'
import crypto from 'crypto';
const app = express();
app.use(cors({
    origin: 'https://security-front.onrender.com/'
}));


type User = {
    accNumber: string;
};

type Users = {
    [key: string]: User;
};

type UserInfo = {
    name: string;
    balance: number;
};

type UserInfoMap = {
    [key: string]: UserInfo;
};

const userInfo: UserInfoMap = {
    '6065': { name: 'Alice', balance: 1000 },
    '6066': { name: 'Bob', balance: 500 },
    '6064' : {name: 'Mike', balance: 8000 },
};

const users: Users = {
    'Alice' : {accNumber: '6065'},
    'Bob' : {accNumber: '6066'},
    'Mike' : {accNumber: '6064'}
}


type AccessReferenceMap = { [tempId: string]: string };
const accessReferenceMap: AccessReferenceMap = {};

function generateTempId() {
    return crypto.randomBytes(3).toString('hex');
}

// @ts-ignore
app.get('/generateTempId', (req, res) => {
    const accName = req.query.accname as string;
    const userAccount = users[accName];

    if (accName && userAccount) {
        const tempId = generateTempId();
        accessReferenceMap[tempId] = userAccount.accNumber;
        return res.json({ tempId });
    } else {
        res.status(403).send({ error: "Access Denied: Unauthorized access." });
    }
});

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

app.get('/userWeak', (req, res) => {
    const accNum = req.query.accnum as string;
    console.log(`Requested account for: ${accNum}`);
    const accDetails = userInfo[accNum];
    res.send(accDetails);
})


app.get('/user', (req, res) => {
    const tempId = req.query.tempId as string;
    const accNumber = accessReferenceMap[tempId];

    if (accNumber) {
        const accDetails = userInfo[accNumber];
        res.send(accDetails);
    } else {
        res.status(403).send('Access Denied: Invalid or expired reference');
    }
});



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
