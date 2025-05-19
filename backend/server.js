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
    user: 'root',         // <-- your MySQL username
    password: 'Timothee.5', // <-- your MySQL password
    database: 'boarding_games'   // <-- your DB
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

    const query = 'CALL add_user(?, ?, ?)';
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
            console.log("Login DB result:", results[0]);
            const token = jwt.sign({ email: results[0].email, user_id: results[0].user_id }, SECRET_KEY, {
                expiresIn: '1h',
            });

            res.json({ message: 'Login success!', user: results[0], token });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// Fetch all games
app.get('/api/games', (req, res) => {
    let sql = `
        SELECT
            g.*,
            GROUP_CONCAT(c.category_name) AS categories
        FROM Game g
                 LEFT JOIN describes d ON g.game_id = d.game_id
                 LEFT JOIN Category c ON d.category_id = c.category_id
    `;

    const { category, sortBy, search } = req.query;
    const values = [];
    const conditions = [];

    if (category && category !== 'all') {
        conditions.push('c.category_name = ?');
        values.push(category);
    }

    if (search) {
        conditions.push('g.name LIKE ?');
        values.push(`%${search}%`);
    }

    if (conditions.length) {
        sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += `
    GROUP BY g.game_id
  `;

    if (sortBy === 'name') {
        sql += ' ORDER BY g.name ASC';
    } else if (sortBy === 'rating') {
        sql += ' ORDER BY g.rating DESC'; // Only if rating exists
    }

    sql += ' LIMIT 30';

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error fetching games:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json(results);
    });
});

app.get('/api/game/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid game ID' });
    }

    const sql = `
        SELECT g.*, c.category_name
        FROM Game g
                 LEFT JOIN describes d ON g.game_id = d.game_id
                 LEFT JOIN Category c ON d.category_id = c.category_id
        WHERE g.game_id = ?`;

    console.log('Querying game ID:', id); // Debug log

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Game not found' });
        }
        res.json(results[0]); // Return the first (and only) match
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

// POST a review (requires authentication)
app.post('/api/game/:id/review', verifyToken, (req, res) => {
    const gameId = parseInt(req.params.id);
    const userId = req.user.user_id; // from decoded JWT
    const reviewText = req.body.review;

    const reviewId = `R${gameId}_${userId}`;

    const sql = `
        INSERT INTO Review (game_id, user_id, review_id, review_text)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE review_text = VALUES(review_text);`;

    db.query(sql, [gameId, userId, reviewId, reviewText], (err, result) => {
        if (err) {
            console.log("Decoded user:", req.user);
            console.error('Error inserting review:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json({ message: 'Review submitted successfully' });
    });
});

app.get('/api/game/:id/reviews', (req, res) => {
    const gameId = parseInt(req.params.id);

    const sql = `
        SELECT u.username, r.review_text
        FROM Review r
        JOIN Users u ON r.user_id = u.user_id
        WHERE r.game_id = ?`;

    db.query(sql, [gameId], (err, results) => {
        if (err) {
            console.error('Error fetching reviews:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.json(results);
    });
});


app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});

