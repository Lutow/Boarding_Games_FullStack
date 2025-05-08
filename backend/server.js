// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.send('API Server Running');
});


app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from Node backend!' });
});

app.get('/api/login', (req, res) => {
    const { email, password } = req.body;
    res.json({ message: 'Login success!' });
})

app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
