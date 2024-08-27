"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const uuid_1 = require("uuid");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const users_1 = __importDefault(require("./models/users"));
const database_1 = __importDefault(require("./database"));
// --- Settings
const app = (0, express_1.default)();
const PORT = 8001;
const router = express_1.default.Router();
const corsOptions = {
    origin: '*',
    credential: true
};
app.use(body_parser_1.default.json());
app.use((0, cors_1.default)(corsOptions));
app.use(router);
(0, database_1.default)();
// --- JWT
const sec = process.env.TOKEN_SECRET;
const generateAccessToken = (userName) => {
    return jsonwebtoken_1.default.sign({ userName }, sec, { expiresIn: '600s' });
};
router.post('/api/v1/auth', (req, res) => {
    const token = generateAccessToken({ userName: req.body.username });
    res.json(token);
});
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        return res.status(401);
    }
    jsonwebtoken_1.default.verify(token, sec, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: '접근이 제한되었습니다.', error: err.message });
        }
        req = decoded;
    });
    next();
};
// --- Views
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use(express_1.default.static(path_1.default.join(__dirname, '../dist')));
app.get('/', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, 'views', 'index.html'));
});
// --- RestAPI
router.get('/api/v1/users', authenticateToken, async (req, res) => {
    try {
        const users = await users_1.default.find();
        res.json(users);
    }
    catch (error) {
        console.error('사용자 정보 조회 실패 : ', error);
        res.status(500).json({ error: '조회 중 오류가 발생하였습니다.' });
    }
});
router.get('/api/v1/users/:id', async (req, res) => {
    try {
        const user = await users_1.default.findOne({ id: req.params.id });
        res.json(user);
    }
    catch (error) {
        console.error('사용자 정보 조회 실패 : ', error);
        res.status(500).json({ error: '조회 중 오류가 발생하였습니다.' });
    }
});
router.post('/api/v1/users', async (req, res) => {
    const user = req.body;
    const newUser = new users_1.default({
        id: (0, uuid_1.v4)(),
        name: user.name,
        address: user.address,
        email: user.email,
        description: user.description
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    }
    catch (error) {
        console.error('사용자 정보 입력 실패 : ', error);
        res.status(500).json({ error: '저장 중 오류가 발생하였습니다.' });
    }
});
router.put('/api/v1/users/:id', async (req, res) => {
    try {
        const user = await users_1.default.findOneAndUpdate({ id: req.params.id, new: true }, req.body);
        res.json(user);
    }
    catch (error) {
        console.error('사용자 정보 수정 실패 : ', error);
        res.status(500).json({ error: '저장 중 오류가 발생하였습니다.' });
    }
});
router.delete('/api/v1/users/:id', async (req, res) => {
    try {
        const result = await users_1.default.findOneAndDelete({ id: req.params.id });
        res.status(200).json({ message: '사용자 정보가 제거되었습니다.' });
    }
    catch (error) {
        console.error('사용자 정보 제거 실패 : ', error);
        res.status(500).json({ error: '삭제 중 오류가 발생하였습니다.' });
    }
});
// --- Server Start
app.listen({ port: PORT }, () => {
    console.log(`서버 실행 완료. [ http://localhost:${PORT} ]`);
});
exports.default = app;
