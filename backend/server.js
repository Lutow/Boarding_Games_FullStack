const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 🔗 MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',         // <-- Replace with your MySQL username
    password: 'Timothee.5', // <-- Replace with your MySQL password
    database: 'boarding_games'   // <-- Replace with your actual DB name
});

// Check DB connection
db.connect((err) => {
    if (err) {
        console.error('DB connection failed:', err.stack);
        return;
    }
    console.log('Connected to MySQL as ID ' + db.threadId);
});

// Sample API Routes
app.get('/', (req, res) => {
    res.send('API Server Running');
});

app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from Node backend!' });
});

// app.post('/api/register', (req, res) => {
//     const { email, password } = req.body;
//     const sql = 'INSERT '
// })

// Handle Log in
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM Users WHERE email = ? AND password = ?';

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Login query error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            res.json({ message: 'Login success!', user: results[0] });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// Example: Fetch all games
app.get('/api/games', (req, res) => {
    const sql = 'SELECT * FROM Game LIMIT 30';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching games:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        console.log('Fetched games:', results); // 🔍 Log output
        res.json(results);
    });
});



app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
