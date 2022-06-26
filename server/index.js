const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const upload = multer({ dest: "upload/" });
const { uploadFile, getFileStream, deleteFile } = require("./s3");
const fs = require("fs");
const util = require("util");
const unlinkFile = util.promisify(fs.unlink);
const path = require('path');
require('dotenv').config();

app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

app.use(express.json());
const bcrypt = require("bcrypt");
const saltRounds = 10;

const db = mysql.createConnection({
  host: "carrental.cnammikteevs.us-east-1.rds.amazonaws.com",
  port: "3306",
  user: "admin",
  password: "y6mw6Gkf",
  database: "postnote",
});

app.post("/register", (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  db.query("SELECT * FROM Users WHERE email = ?", email, (err, result) => {
    if (err) {
      res.send({ err: err });
    } else if (result.length > 0) {
      res.sendStatus(400);
    } else {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        db.query(
          "INSERT INTO Users (firstname, lastname, username, email, password) VALUES (?,?,?,?,?)",
          [firstname, lastname, username, email, hash],
          (err, result) => {
            if (err) {
              res.sendStatus(500);
            } else {
              res.send("Success!");
            }
          }
        );
      });
    }
  });
});

app.post("/addUser", (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

  db.query("SELECT * FROM Users WHERE email = ?", email, (err, result) => {
    if (err) {
      res.send({ err: err });
    } else if (result.length > 0) {
      res.sendStatus(400);
    } else {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        db.query(
          "INSERT INTO Users (firstname, lastname, username, email, role, password) VALUES (?,?,?,?,?, ?)",
          [firstname, lastname, username, email, role, hash],
          (err, result) => {
            if (err) {
              res.sendStatus(500);
            } else {
              res.send("Success!");
            }
          }
        );
      });
    }
  });
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.query("SELECT * FROM Users WHERE email = ?", email, (err, result) => {
    if (err) {
      res.send({ err: err });
    }
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (response) {
          const id = result[0].id;
          const token = jwt.sign({ id }, "jwtSecret", { expiresIn: 600 });
          req.session.user = result;
          res.json({ auth: true, token: token, result: result });
        } else {
          res.json({
            auth: false,
            message: "Wrong email/password combination!",
          });
        }
      });
    } else {
      res.json({ auth: false, message: "User does not exist" });
    }
  });
});

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.send("We need a token, pls give it to us next time");
  } else {
    jwt.verify(token, "jwtSecret", (err, decoded) => {
      if (err) {
        res.json({ auth: false, message: "You failed to authenticate" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

//================= Statistics
app.get("/api/postsByDate", verifyJWT, (req, res) => {
  const sqlSelect = " SELECT count(*) c, date(createdAt) day FROM postnote.Posts "
    + " group by date(createdAt)";
  db.query(sqlSelect, (err, result) => {
    if (err) {
      res.status(500).send("Error while retrieving data");
    }
    else {
      if (result.length > 0) {
        console.log(result)
        res.send(result);
      } else {
        res.status(404).send("List has a problem");
      }
    }
  });
});

//================== Friends ==============
app.get("/api/friendsList", verifyJWT, (req, res) => {
  const id = req.userId;
  const sqlSelect = "SELECT f.user1Id, f.user2Id, f.status, u.id as 'friendId', u.userImage, u.firstname, u.lastname, u.username FROM postnote.Friends f JOIN postnote.Users u on user2Id = u.id WHERE status='ACCEPTED' and user1Id = ? union SELECT f.user1Id, f.user2Id, f.status, u.id as 'friendId', u.userImage, u.firstname, u.lastname, u.username FROM postnote.Friends f JOIN postnote.Users u on user1Id = u.id WHERE status='ACCEPTED' and user2Id = ?"
  db.query(sqlSelect, [id, id], (err, result) => {
    if (err) {
      res.status(500).send("Error while retrieving the list");
    }
    else {
      res.send(result);
    }
  });
});

app.get("/api/availableFriends", verifyJWT, (req, res) => {
  const id = req.userId;
  const sqlSelect = "Select u.id as 'userId', u.email, u.password, u.firstname, u.lastname, u.userImage, u.role, u.username, f.status, f.user1Id from postnote.Users u join postnote.Friends f on f.user2Id = u.id where f.user1Id = ? and status = 'PENDING' Union Select u.id as 'userId', u.email, u.password, u.firstname, u.lastname, u.userImage, u.role, u.username, f.status, f.user1Id from postnote.Users u join postnote.Friends f on f.user1Id = u.id where f.user2Id = ? and status = 'PENDING' Union Select u.id, u.email, u.password, u.firstName,u.lastName,u.userImage, u.role, u.username, null as 'status', null as 'user1Id'  From Users u where u.id != ? and u.id not in  (Select f.user2Id From Users u left join Friends f on u.id=f.user1Id where f.user1Id = ? union Select f.user1Id From Users u left join Friends f on u.id=f.user2Id where f.user2Id = ?)";
  db.query(sqlSelect, [id, id, id, id, id], (err, result) => {
    if (err) {
      res.status(500).send("Error while retrieving the list");
    } else {
      if (result.length > 0) {
        res.send(result);
      } else {
        res.status(404).send("List has a problem");
      }
    }
  });
});


app.post("/api/makeRequest/:user2Id", verifyJWT, (req, res) => {
  const user2Id = req.params.user2Id;
  const sqlInsert =
    "Insert Into Friends (user1Id,user2Id) Values (?,?)  ";
  db.query(sqlInsert, [req.userId, user2Id], (err, result) => {
    if (err) {
      res.status(500).send("Server Error");
    } else {
      res.sendStatus(204)
    }
  });
});

app.delete("/api/cancelRequest/:user2Id", verifyJWT, (req, res) => {
  const user2Id = req.params.user2Id;
  const sqlDelete =
    "Delete from Friends where user1Id = ? and user2Id= ?";
  db.query(sqlDelete, [req.userId, user2Id], (err, result) => {
    if (err) {
      res.status(500).send("Error while Delete");
    } else {
      res.sendStatus(204)
    }
  });
});

app.put("/api/acceptRequest/:user1Id", verifyJWT, (req, res) => {
  const user1Id = req.params.user1Id;
  const sqlUpdate =
    "Update Friends set status='ACCEPTED' where user1Id = ? and user2Id= ?   ";
  db.query(sqlUpdate, [user1Id, req.userId], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error while Accept Friendship");
    } else {
      res.send(result);
    }
  });
});

app.delete("/api/declineRequest/:user1Id", verifyJWT, (req, res) => {
  const user2Id = req.params.user1Id;
  const sqlDelete =
    "Delete from Friends where user1Id = ? and user2Id= ?";
  db.query(sqlDelete, [user2Id, req.userId], (err, result) => {
    if (err) {
      res.status(500).send("Error while Delete");
    } else {
      res.sendStatus(204)
    }
  });
});


//================== Profile ==============

app.get("/api/profile", verifyJWT, (req, res) => {
  const sqlQuery = "SELECT * FROM Users WHERE id = ?";
  db.query(sqlQuery, req.userId, (err, profile) => {
    if (err) {
      res.status(500).send("Error while retrieving profile info");
    } else {
      if (profile.length > 0) {
        res.send(profile);
      } else {
        res.status(404).send("User does not exist");
      }
    }
  });
});

// Edit profile
app.put("/api/profile/edit", verifyJWT, (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;

  const sqlUpdate =
    "UPDATE Users SET firstname=?, lastname=?, username=? where id=?";
  db.query(
    sqlUpdate,
    [firstname, lastname, username, req.userId],
    (err, result) => {
      if (err) {
        res.status(400).send("Error updating the profile. Please try again");
      } else {
        res.sendStatus(201);
      }
    }
  );
});

app.put("/uploadProfilePicture", verifyJWT, (req, res) => {
  const userId = req.userId;
  const userImage = req.body.image;

  db.query(
    "UPDATE Users SET userImage=? where id=?",
    [userImage, userId],
    (err, results) => {
      if (err) {
        res.sendStatus(500).send("Server error!");
      } else {
        res.sendStatus(201);
      }
    }
  );
});

//================== Images ==============

app.post("/images", upload.single("image"), verifyJWT, async (req, res) => {
  const file = req.file;
  file.filename = "images/" + file.filename;
  //apply filter
  // resize
  const result = await uploadFile(file);
  await unlinkFile(file.path);
  res.send({ imagePath: result.Key });
});

// app.get("/images/:key", (req, res) => {
//   const key = req.params.key;
//   const readStream = getFileStream(key);
//   readStream.pipe(res);
// });

app.delete("/images/images/:key", verifyJWT, async (req, res) => {
  const key = 'images/'+req.params.key;
  console.log(key)
  await deleteFile(key);
  res.send("File deleted successfully")
})

//================== Post ==============

app.post("/upload", verifyJWT, (req, res) => {
  const userId = req.userId;
  const postText = req.body.postText;

  if (req.body.image === undefined) {
    db.query(
      "INSERT INTO Posts (userId, postText) VALUES (?, ?)",
      [userId, postText],
      (err, results) => {
        if (err) {
          res.sendStatus(500).send("Server error!");
        } else {
          res.sendStatus(201);
        }
      }
    );
  } else {
    const postImage = req.body.image;

    db.query(
      "INSERT INTO Posts (userId, postText, postImage) VALUES (?, ?, ?)",
      [userId, postText, postImage],
      (err, results) => {
        if (err) {
          res.sendStatus(500).send("Server error!");
        } else {
          res.sendStatus(201);
        }
      }
    );
  }
});

app.get("/api/posts", verifyJWT, (req, res) => {
  db.query(
    "SELECT * FROM Posts WHERE userId = ? ORDER BY createdAt DESC",
    req.userId,
    (err, results) => {
      if (err) {
        res.sendStatus(500).send("Server error!");
      } else {
        res.send(results); 
      }
    }
  );
});

app.get("/api/allposts", verifyJWT, (req, res) => {
  db.query(
    "SELECT * FROM Users as u INNER JOIN Posts p ON p.userId = u.id ORDER BY p.createdAt DESC",
    (err, results) => {
      if (err) {
        res.sendStatus(500).send("Server error!");
      } else {
        res.send(results)
      }
    }
  );
});

app.get("/api/allpostsUser", verifyJWT, (req, res) => {
  db.query(
    "SELECT p.id as 'postId', p.userId as 'postUserId', p.postText, p.postImage, p.createdAt, p.updatedAt, u.username,  u.firstname, u.lastname, u.userImage" +
    " FROM postnote.Posts p inner join Users u on p.userId=u.id" +
    " WHERE p.userId= ? Or p.userId in" +
    " (SELECT u.id  FROM Friends f JOIN Users u on user2Id = u.id" +
    " WHERE status='ACCEPTED' and user1Id = ?" +
    " union" +
    " SELECT  u.id FROM Friends f JOIN Users u on user1Id = u.id" +
    " WHERE status='ACCEPTED' and user2Id = ?)" +
    " ORDER BY p.createdAt DESC", 
    [req.userId, req.userId, req.userId],
    (err, results) => {
      if (err) {
        res.sendStatus(500).send("Server error!");
      } else {
        res.send(results)
      }
    }
  );
});

app.get("/api/update-post/:id", verifyJWT, (req, res) => {
  const id = req.params.id;
  const sqlSelectArticle = "SELECT * FROM Posts JOIN Users ON Users.id = Posts.userId WHERE Posts.id = ?";
  db.query(sqlSelectArticle, id, (err, result) => {
    if (err) {
      console.log(err)
      res.sendStatus(500).send("Server error! Unable to get the post");
    } else {
      console.log(result)
      res.send(result);
    }
  });
});

app.put("/api/update-post/:id", verifyJWT, (req, res) => {
  const id = req.params.id;
  const postText = req.body.postText;
  if (req.body.image === undefined) {
    const sqlUpdate = "UPDATE Posts SET postText = ? WHERE id = ?";
    db.query(sqlUpdate, [postText, id], (err, result) => {
      if (err) {
        res.sendStatus(500).send("Server error! Unable to update the articles");
      } else {
        res.sendStatus(204);
      }
    });
  } else {
    const postImage = req.body.image;
    const sqlUpdate =
      "UPDATE Posts SET postText = ?, postImage = ? WHERE id = ?";
    db.query(sqlUpdate, [postText, postImage, id], (err, result) => {
      if (err) {
        res.sendStatus(500).send("Server error! Unable to update the articles");
      } else {
        res.sendStatus(204);
      }
    });
  }
});

app.delete("/api/delete-post/:id", verifyJWT, (req, res) => {
  const id = req.params.id;
  const sqlDelete = "DELETE FROM Posts WHERE id=? ";
  db.query(sqlDelete, id, (err, result) => {
    if (err) {
      res.sendStatus(500).send("Server error");
    } else {
      res.sendStatus(204);
    }
  });
});


//================== Comments ==============
app.get("/api/comment/listcomments/:id", verifyJWT, (req, res) => {
  const id = req.params.id;
  const sqlComments = "SELECT c.id, c.userId, c.postId, c.commentText, c.createdAt, u.firstname, u.lastname, u.userImage FROM Comments c JOIN Users u On c.userId = u.id WHERE c.postId =? ORDER BY createdAt DESC"
  db.query(sqlComments, id, (err, result) => {
    if (err) {
      res.sendStatus(500).send("Server error")
    } else {
      res.send(result)
    }
  })
})

app.post("/api/comment/addcomment/:id", verifyJWT, (req, res) =>{
  const id = req.params.id
  const comment = req.body.formValues.comment
  const sqlAddComment ="INSERT INTO Comments (userId, postId, commentText) VALUES (?,?,?)"
  db.query(sqlAddComment, [req.userId, id, comment], (err, result) => {
    if (err) {
      res.sendStatus(500).send("Server error! Unable to post the article");
    } else {
      res.sendStatus(201);
    }
  })
})

app.delete("/api/comment/deletecomment/:id", verifyJWT, (req, res) => {
  const id = req.params.id
  const sqlDelete = "DELETE FROM Comments where id=?"
  db.query(sqlDelete, [id], (err, result) => {
    if (err) {
      res.sendStatus(500).send("Server error")
  }
  else {
      res.send("Successfully deleted!")
  }
})
});

//================= Admin ===============

app.get('/api/users', verifyJWT, (req, res) => {
  const sqlQuery = "SELECT * FROM Users"
  db.query(sqlQuery, req.userId, (err, users) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error trying to retrieve articles.");
    }
    else {
      console.log(sqlQuery);
      console.log(users);
      res.send(users);
    }
  })
});

app.get("/editUser/:id", verifyJWT, (req, res) => {
  const id = req.params.id;
  const sqlQuery = "SELECT * FROM Users WHERE id = ?";
  db.query(sqlQuery, id, (err, result) => {
    if (err) {
      console.log(err)
      res.sendStatus(500).send("Server error! Unable to get the user");
    } else {
      console.log(result)
      res.send(result);
    }
  });
});

// Update user
app.put('/editUser/:id', verifyJWT, (req, res) => {
  const id = req.params.id;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const role = req.body.role;

  const sqlUpdate = "UPDATE Users SET firstname=?, lastname=?, username=?, role=? where id=?"
  db.query(sqlUpdate, [firstname, lastname, username, role, id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(400).send("Error updating the user. Please try again");
    }
    else {
      console.log(result);
      res.sendStatus(201);
    }
  })
});

// Delete
app.delete('/api/delete/:id', verifyJWT, (req, res) => {
  const id = req.params.id;
  const sqlDelete = "DELETE FROM Users where id=?"
  db.query(sqlDelete, [id, req.userId], (err, user) => {
    if (err) {
      res.status(500).send("Error trying to delete the article")
      console.log(err);
    }
    else {
      console.log(user);
      res.send(user);
    }
  })
});

//================== Ports ==============

const port = process.env.PORT || 3001

if (process.env.NODE_ENV === "production") {
  app.use(express.static())
  app.get('*', (req, res) => {
    req.sendFile(path.resolve(__dirname, 'public', 'index.html'))
  })
}

app.listen(port, (err) => {
  if (err) return console.log(err);
  console.log('Server running on port: ', port)
});

