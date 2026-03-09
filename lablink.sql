-- Active: 1678211070335@@127.0.0.1@3306
CREATE TABLE users(
    id TEXT PRIMARY KEY UNIQUE NOT NULL, 
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,  
    password TEXT NOT NULL, 
    role TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);
DROP TABLE users;

CREATE TABLE posts(
   id TEXT PRIMARY KEY UNIQUE NOT NULL,
   creator_id TEXT NOT NULL,
   content TEXT NOT NULL,
   likes INTEGER DEFAULT(0) NOT NULL,
   dislikes INTEGER DEFAULT(0) NOT NULL,
   comments INTEGER DEFAULT(0) NOT NULL,
   created_at TEXT NOT NULL,
   updated_at TEXT NOT NULL,
   FOREIGN KEY (creator_id) REFERENCES users(id)
   ON DELETE CASCADE
   ON UPDATE CASCADE
);
DROP TABLE posts;

CREATE TABLE comments(
    id TEXT PRIMARY KEY UNIQUE NOT NULL,
    creator_id TEXT NOT NULL,
    post_id TEXT NOT NULL,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT(0) NOT NULL, 
    dislikes INTEGER DEFAULT(0) NOT NULL, 
    created_at TEXT NOT NULL,
    updated_at TEXT,
    FOREIGN KEY (creator_id) REFERENCES users(id)
    FOREIGN key (post_id) REFERENCES posts(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
DROP TABLE comments;

CREATE TABLE likes_dislikes(
    user_id TEXT NOT NULL, 
    post_id TEXT NOT NULL, 
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);
DROP TABLE likes_dislikes;

CREATE TABLE likes_dislikes_comments(
    user_id TEXT NOT NULL, 
    comment_id TEXT NOT NULL, 
    post_id TEXT NOT NULL, 
    like INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts  (id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

DROP TABLE likes_dislikes_comments;

INSERT INTO users(id, name, email, password, role, created_at, updated_at)
VALUES
("u001", "Duncan Jason", "duncanj@gmail.com", "123456", "Admin", DATETIME('now'), DATETIME('now') ),
("u002", "Julio Matias", "matias@gmail.com", "123456", "User", DATETIME('now'), DATETIME('now')),
("u003", "Celeste Carolina", "celeste@email.com", "123456", "User", DATETIME('now'), DATETIME('now')),
("u004", "Valentina Pascal", "val@email.com", "123456", "User", DATETIME('now'), DATETIME('now'));

SELECT * FROM users;

INSERT INTO posts(id, creator_id, content, created_at, updated_at)
VALUES
("p001", "u001", "Post um", DATETIME('now'), DATETIME('now')),
("p002", "u002", "Post dois", DATETIME('now'), DATETIME('now')),
("p003", "u003", "Post três", DATETIME('now'), DATETIME('now')),
("p004", "u004", "Post quatro", DATETIME('now'), DATETIME('now'));
SELECT * FROM posts;

INSERT INTO comments(id, creator_id, post_id,content, created_at, updated_at)
VALUES
("c001", "u001", "p001", "comentário um", DATETIME('now'), DATETIME('now')),
("c002", "u002", "p002", "comentário dois", DATETIME('now'), DATETIME('now')),
("c003", "u003", "p003", "comentário três", DATETIME('now'), DATETIME('now')),
("c004", "u004", "p004", "comentário quatro", DATETIME('now'), DATETIME('now'));

SELECT * FROM comments;

LEFT JOIN comments ON comments.post_id = posts.id;

SELECT
    posts.id,
    posts.creator_id,
    posts.content,
    posts.likes,
    posts.dislikes ,
    posts.created_at,
    posts.updated_at,
    users.name AS creator_name
FROM posts
JOIN users
on posts.creator_id = users.id;

SELECT
    comments.id,
    comments.creator_id,
    comments.content,
    comments.likes,
    comments.dislikes ,
    comments.created_at,
    comments.updated_at,
    users.name AS creator_name
FROM comments
JOIN users
on comments.creator_id = users.id;


 


