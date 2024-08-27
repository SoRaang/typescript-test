import express, { NextFunction, Request, Response } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import jwt, { VerifyErrors } from 'jsonwebtoken';

import { User, Product } from './types';
import UserModel from './models/users';
import connectDB from './database';

// --- Settings

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

connectDB();

// --- JWT

const sec: string = process.env.TOKEN_SECRET as string;

const generateAccessToken = (userName: any) => {
    return jwt.sign({ userName }, sec, { expiresIn: '600s' });
}

router.post('/api/v1/auth', (req, res) => { // 토큰 생성하여 받아오기
    const token = generateAccessToken({ userName: req.body.username });

    res.json(token);
});

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401);
    }

    jwt.verify(token, sec, (err: VerifyErrors | null, decoded: any) => {
        if (err) {
            return res.status(403).json({ message: '접근이 제한되었습니다.', error: err.message });
        }

        (req as any) = decoded;
    });

    next();
}

// --- Views

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '../dist')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

// --- RestAPI

router.get('/api/v1/users', authenticateToken, async (req, res) => { // 전체 사용자 데이터 조회
    try {
        const users = await UserModel.find();

        res.json(users);
    } catch(error) {
        console.error('사용자 정보 조회 실패 : ', error);
        res.status(500).json({ error: '조회 중 오류가 발생하였습니다.' });
    }
});

router.get('/api/v1/users/:id', async (req, res) => { // 특정 사용자 조회
    try {
        const user = await UserModel.findOne({ id: req.params.id });

        res.json(user);
    } catch(error) {
        console.error('사용자 정보 조회 실패 : ', error);
        res.status(500).json({ error: '조회 중 오류가 발생하였습니다.' });
    }
});

router.post('/api/v1/users', async (req, res) => { // 사용자 생성
    const user: Omit <User, 'id'> = req.body;
    const newUser = new UserModel({
        id: uuidv4(),
        name: user.name,
        address: user.address,
        email: user.email,
        description: user.description
    });

    try {
        const savedUser = await newUser.save();

        res.status(201).json(savedUser);
    } catch(error) {
        console.error('사용자 정보 입력 실패 : ', error);
        res.status(500).json({ error: '저장 중 오류가 발생하였습니다.' });
    }
});

router.put('/api/v1/users/:id', async (req, res) => { // 사용자 정보 수정
    try {
        const user = await UserModel.findOneAndUpdate({ id: req.params.id, new: true }, req.body);

        res.json(user);
    } catch(error) {
        console.error('사용자 정보 수정 실패 : ', error);
        res.status(500).json({ error: '저장 중 오류가 발생하였습니다.' });
    }
});

router.delete('/api/v1/users/:id', async (req, res) => { // 사용자 삭제
    try {
        const result = await UserModel.findOneAndDelete({ id: req.params.id });

        res.status(200).json({ message: '사용자 정보가 제거되었습니다.' });
    } catch(error) {
        console.error('사용자 정보 제거 실패 : ', error);
        res.status(500).json({ error: '삭제 중 오류가 발생하였습니다.' });
    }
});

// --- Server Start

app.listen({ port: PORT }, () => {
    console.log(`서버 실행 완료. [ http://localhost:${ PORT } ]`);
});

export default app;