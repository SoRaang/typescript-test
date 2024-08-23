import express from 'express';
const app = express();
const PORT = 8001;
app.get('/', (req, res) => {
    res.send('Hello, World!');
});
app.listen({ port: PORT }, () => {
    console.log(`서버 실행 완료. localhost:${PORT}`);
});
