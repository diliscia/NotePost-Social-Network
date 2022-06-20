const express = require("express"); 
const app = express(); 
const mysql = require("mysql");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");
// const database = require('./models');

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
  host: "localhost",
  port: "3360",
  user: "root",
  password: "password",
  database: "postnote",
});

//******************** TEST ***************
// app.get("/", (req, res) => {
//   db.query(
//     "INSERT INTO users (username, email, password, password_repeat) VALUES ('lyly01','quynhly.do@gmail.com','Linh2612','Linh2612')",
//     (err, result) => {
//       if (err) {
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
    "SELECT * FROM users WHERE email = ?",
    email,
    (err, result) => {
      if (err) {
        res.send({ err: err });
      } else if (result.length > 0) {
        res.sendStatus(400);
      } else {
        bcrypt.hash(password, saltRounds, (err, hash) => {
          db.query(
            "INSERT INTO users (firstname, lastname, username, email, password) VALUES (?,?,?,?,?)",
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
    "SELECT * FROM users WHERE email = ?",
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
        res.json({ auth: false, message: "You failed to authenticate" });
      } else {
        req.userId = decoded.id;
        next();
      }
    });
  }
};

app.listen(3001, ()=> {
  console.log("Your server is running on port 3001")
})
