const express = require("express");
const app = express();
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");
const multer = require('multer')
const upload = multer({ dest: 'upload/' })
const { uploadFile, getFileStream } = require('./s3')
const fs = require('fs')
const util = require('util')
const unlinkFile = util.promisify(fs.unlink)

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

// //******************** TEST ***************
// app.get("/", (req, res) => {
//   console.log("hello world");
//   db.query(
//     "INSERT INTO Users (firstname, lastname, username, email, password) VALUES"+ 
//     "('lyly','lyly','lyly01','quynhly.do@gmail.com','Linh2612')",

//     (err, result) => {
//       if (err) {
//         console.log("hello world before error");
//         res.sendStatus(500);
//       } else {
//         res.send("Success!")
//       }
//     }
//   );
// });

app.post("/register", (req, res) => {
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;

  db.query(
    "SELECT * FROM Users WHERE email = ?",
    email,
    (err, result) => {
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
    }
  );
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  db.query(
    "SELECT * FROM Users WHERE email = ?",
    email,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      }
      if (result.length > 0) {
        bcrypt.compare(password, result[0].password, (error, response) => {
          if (response) {
            const id = result[0].id;
            const token = jwt.sign({ id }, "jwtSecret", { expiresIn: 300 });
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
    }
  );
});

const verifyJWT = (req, res, next) => {
  const token = req.headers["x-access-token"];
  if (!token) {
    res.send("We need a token, pls give it to us next time");
  } else {
    jwt.verify(token, "jwtSecret", (err, decoded) => {
      if (err) {
        console.log(err)
        res.json({ auth: false, message: "You failed to authenticate" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

//================== Friends ==============

//verifyJWT,
// list friends of current user
app.get('/api/friendsList/:id', (req, res) => {
  const id = req.params.id;
  // console.log('id= ' + id)
  const sqlSelect = "Select u.id,u.firstName,u.lastName,u.userImage "
    + " From Users u join Friends f on u.id=f.user1Id "
    + " Where u.id!=?"
  db.query(sqlSelect, id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error while retrieving the list");
    }
    else {
      if (result.length > 0) {
        res.send(result);
      }
      else {
        res.status(404).send("List has a problem");
      }
    }
  })
});


//verifyJWT,
// list if available users that are not friends of current user
app.get('/api/availableFriends/:id', (req, res) => {
  const id = req.params.id;
  // console.log('id= ' + id)
  const sqlSelect = "Select u.id,u.firstName,u.lastName,u.userImage "
    + " From Users u left join Friends f on u.id=f.user1Id "
    + " Where f.id is null and u.id!=? ";
  db.query(sqlSelect, id, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error while retrieving the list");
    }
    else {
      if (result.length > 0) {
        res.send(result);
      }
      else {
        res.status(404).send("List has a problem");
      }
    }
  })
});
//, verifyJWT
app.post('/api/makeFriendship/:user1Id/:user2Id', (req, res) => {
  const user1Id = req.params.user1Id;
  const user2Id = req.params.user2Id;
  // console.log(user1Id, user2Id)
  const sqlInsert = "Insert Into Friends (user1Id,user2Id) Values (?,?) , (?,?) ";
  db.query(sqlInsert, [user1Id, user2Id, user2Id, user1Id], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error while Insert");
    }
    else {
      res.send(result);
    }
  })
});

//================== Profile ==============

app.get('/:username', verifyJWT, (req, res) => {
  const username = req.params.username;
  console.log("username " + username);
  const sqlQuery = "SELECT * FROM Users WHERE  username = ?";
  db.query(sqlQuery, username, (err, profile) => {
    if (err) {
      console.log( err);
      res.status(500).send("Error while retrieving profile info");
    }
    else {
      if (profile.length > 0) {
        console.log( profile);
        res.send(profile);
      }
      else {
        res.status(404).send("User does not exist");
      }
    }
  })
});


//================== Images ==============


app.post('/images', verifyJWT, upload.single('image'), async (req, res) => {
  const file = req.file

  //apply filter
  // resize 
  const result = await uploadFile(file)
  const description = req.body.description
  await unlinkFile(file.path)
  res.send({ imagePath: `/images/${result.Key}` })
})


app.get('/images/:key', (req, res) => {
  const key = req.params.key
  const readStream = getFileStream(key)
  readStream.pipe(res)
})

//================== Post ==============

app.post("/upload", verifyJWT, (req, res) => {
  const userId = req.userId;
  const postText = req.body.description;
  const postImage = "http://localhost:3001" + req.body.image

  db.query(
    "INSERT INTO Posts (userId, postText, postImage) VALUES (?, ?, ?)",
    [userId, postText, postImage],
    (err, results) => {
      res.send(results)
    }
  )
})

app.get("/api/posts", verifyJWT, (req, res) => {
  db.query("SELECT * FROM Posts", (err, results) => {
    if (err) {
      console.log(err)
    }
    res.send(results)
  })
})

app.listen(3001, () => {
  console.log("Your server is running on port 3001")
})
