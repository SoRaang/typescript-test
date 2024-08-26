import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { User, Product } from './types';
import dataBase from './database';

const app = express();
const PORT = 8001;
const router = express.Router();

const corsOptions = {
    origin: '*',
    credential: true
}

app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(router);

// --- Utils

const randID = () => {
    return Math.floor(Math.random() * 1000);
}

// ---

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// --- RestAPI

router.get('/api/v1/users', (req, res) => {
    res.send(dataBase.user);
});

router.get('/api/v1/users/:id', (req, res) => {
    const user = dataBase.user.find(user => user.id === parseInt(req.params.id));

    if (typeof user === 'undefined') {
        res.sendStatus(404);
    } else {
        res.send(user);
    }
});

router.post('/api/v1/users', (req, res) => {
    const user: User = req.body;

    dataBase.user.push({
        id: randID(),
        name: user.name,
        address: user.address,
        email: user.email,
        description: user.description
    });

    res.sendStatus(200);
});

router.put('/api/v1/users/:id', (req, res) => {
    const idx = dataBase.user.findIndex(user => user.id === parseInt(req.params.id));

    if (idx !== -1) {
        const input = req.body;
        const prev = dataBase.user[idx];
        const user = {
            id: prev.id,
            name: input.name,
            address: input.address,
            email: input.email,
            description: input.description
        }

        dataBase.user[idx] = user;
        res.sendStatus(200);
    }
});

router.delete('/api/v1/users/:id', (req, res) => {
    dataBase.user = dataBase.user.filter(user => user.id !== parseInt(req.params.id));

    res.sendStatus(200);
});

// --- Server Start

app.listen({ port: PORT }, () => {
    console.log(`서버 실행 완료. [ http://localhost:${ PORT } ]`);
});

export default app;