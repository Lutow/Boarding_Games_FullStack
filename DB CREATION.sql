-- TABLE CREATION
CREATE TABLE Game(
   game_id INT,
   game_image VARCHAR(50),
   name VARCHAR(50),
   year_published VARCHAR(50),
   min_players INT,
   max_players DECIMAL(15,2),
   playingtime INT,
   theme VARCHAR(50),
   description VARCHAR(500),
   game_mechanic VARCHAR(50),
   purchase_link VARCHAR(50),
   duration_level VARCHAR(20), -- ✅ must be here before trigger
   PRIMARY KEY(game_id)
);


CREATE TABLE Category(
   category_id INT,
   category_name VARCHAR(50),
   PRIMARY KEY(category_id)
);

CREATE TABLE Users(
   user_id INT,
   password VARCHAR(50),
   email VARCHAR(50),
   username VARCHAR(50),
   PRIMARY KEY(user_id)
);

CREATE TABLE Review(
   game_id INT,
   user_id INT,
   review_id VARCHAR(50),
   review_text VARCHAR(500),
   PRIMARY KEY(game_id, user_id),
   FOREIGN KEY(game_id) REFERENCES Game(game_id),
   FOREIGN KEY(user_id) REFERENCES Users(user_id)
);

CREATE TABLE describes(
   game_id INT,
   category_id INT,
   game_category_id VARCHAR(50),
   PRIMARY KEY(game_id, category_id),
   FOREIGN KEY(game_id) REFERENCES Game(game_id),
   FOREIGN KEY(category_id) REFERENCES Category(category_id)
);

-- VIEWS
CREATE VIEW avg_playingtime_per_category AS
SELECT 
    c.category_name,
    AVG(g.playingtime) AS avg_playingtime
FROM 
    Game g
JOIN describes d ON g.game_id = d.game_id
JOIN Category c ON c.category_id = d.category_id
GROUP BY c.category_name;

CREATE VIEW reviews_count_per_game AS
SELECT 
    g.name AS game_name,
    COUNT(r.review_id) AS review_count
FROM 
    Game g
LEFT JOIN Review r ON g.game_id = r.game_id
GROUP BY g.name;

CREATE VIEW user_review_summary AS
SELECT 
    u.username,
    COUNT(r.review_id) AS total_reviews
FROM 
    Users u
LEFT JOIN Review r ON u.user_id = r.user_id
GROUP BY u.username;

-- INDEXES
CREATE INDEX idx_game_name ON Game(name);
CREATE INDEX idx_category_name ON Category(category_name);
CREATE INDEX idx_review_user_id ON Review(user_id);

-- TRIGGERS
DELIMITER $$

CREATE TRIGGER trg_duration_level
BEFORE INSERT ON Game
FOR EACH ROW
BEGIN
    IF NEW.playingtime < 30 THEN
        SET NEW.duration_level = 'Short';
    ELSEIF NEW.playingtime BETWEEN 30 AND 90 THEN
        SET NEW.duration_level = 'Medium';
    ELSE
        SET NEW.duration_level = 'Long';
    END IF;
END$$

CREATE TRIGGER trg_prevent_duplicate_usernames
BEFORE INSERT ON Users
FOR EACH ROW
BEGIN
    IF EXISTS (SELECT 1 FROM Users WHERE username = NEW.username) THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Username already exists!';
    END IF;
END$$

CREATE TRIGGER trg_auto_generate_game_category_id
BEFORE INSERT ON describes
FOR EACH ROW
BEGIN
    SET NEW.game_category_id = CONCAT('G', NEW.game_id, 'C', NEW.category_id);
END$$

DELIMITER ;

-- STORED PROCEDURES
DELIMITER $$

CREATE PROCEDURE add_user(
    IN p_username VARCHAR(50), 
    IN p_password VARCHAR(50), 
    IN p_email VARCHAR(50)
)
BEGIN
    INSERT INTO Users(username, password, email)
    VALUES (p_username, p_password, p_email);
END$$

CREATE PROCEDURE add_review(
    IN p_game_id INT,
    IN p_user_id INT,
    IN p_review_text VARCHAR(500)
)
BEGIN
    INSERT INTO Review(game_id, user_id, review_id, review_text)
    VALUES (p_game_id, p_user_id, CONCAT('R', p_game_id, '_', p_user_id), p_review_text);
END$$

CREATE PROCEDURE get_reviews_by_game(
    IN p_game_title VARCHAR(50)
)
BEGIN
    SELECT u.username, r.review_text
    FROM Review r
    JOIN Users u ON r.user_id = u.user_id
    JOIN Game g ON g.game_id = r.game_id
    WHERE g.name = p_game_title;
END$$

DELIMITER ;


ALTER TABLE Game MODIFY game_image VARCHAR(255);
