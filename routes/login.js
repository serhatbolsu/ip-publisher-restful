const express = require('express');
const router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const jwt = require('jsonwebtoken');


const users = [
  {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    role: 'admin'
  }
];
const accessTokenSecret = process.env.SECRET;

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

router.get('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => {
    return u.username == username && u.password ==password});

  if (user) {
    // Generate and access token
    const accessToken = jwt.sign({
      username: user.username, role: user.role
    }, accessTokenSecret);
    res.json({accessToken});
  } else {
    res.send('Username or password incorrect');
  }
});

module.exports = { router, authenticateJWT};
