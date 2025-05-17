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
    password: 'root', // <-- Replace with your MySQL password
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

// Handle registration
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;

    const query = 'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)';
    const values = [username, email, password];

    db.query(query, values, (err, results) => {
        if (err) {
            if (err.sqlState === '45000') { // Trigger to check for already existing users
                return res.status(400).json({ error: err.message }); // 'Username already exists'
            }

            console.error('Database error:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }

        res.status(201).json({ message: 'User registered successfully!' });
    });
});

// Handle Log in
const jwt = require('jsonwebtoken'); // Import JWT
const SECRET_KEY = 'your_secret_key'; // Change this to a secure secret key
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM Users WHERE email = ? AND password = ?';

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error('Login query error:', err);
            return res.status(500).json({ message: 'Database error' });
        }

        if (results.length > 0) {
            // Generate a JWT token
            const token = jwt.sign({ email: results[0].email, id: results[0].id }, SECRET_KEY, {
                expiresIn: '1h',
            });

            res.json({ message: 'Login success!', user: results[0], token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

app.post('/api/register', async (req, res) => {
    try {
        const { email, password, username } = req.body;

        // Validation
        if (!email || !password || !username) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (password.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters' });
        }

        // Check if user exists
        const checkUserSql = 'SELECT * FROM Users WHERE email = ? OR username = ?';
        db.query(checkUserSql, [email, username], async (err, results) => {
            if (err) {
                console.error('Check user query failed:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (results.length > 0) {
                return res.status(409).json({ message: 'Email or username already exists' });
            }

            // Insert new user
            const insertSql = 'INSERT INTO Users (username, email, password) VALUES (?, ?, ?)';
            db.query(insertSql, [username, email, password], (err, results) => {
                if (err) {
                    console.error('Register query failed:', err);
                    return res.status(500).json({ message: 'Database error' });
                }

                return res.status(201).json({
                    message: 'User registered successfully',
                    userId: results.insertId
                });
            });
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
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


const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from headers

    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded;
        next();
    });
};

// Fetch user profile using decoded token data
app.get("/api/user/profile", verifyToken, (req, res) => {
    const userEmail = req.user.email;

    const sql = "SELECT username, email FROM Users WHERE email = ?";
    db.query(sql, [userEmail], (err, results) => {
        if (err) {
            console.error("Error fetching user profile:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json(results[0]); // Return username & email
    });
});



app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});
