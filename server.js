require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';

import connectToDb from './db/connect';

import user from './routes/user.route';
import group from './routes/group.route';
import message from './routes/messsage.route';

const server = express();

connectToDb();

server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  extended: false
}));

server.use(user);
server.use(group);
server.use(message);
server.use((e, req, res, next) => {
  return res.status(400).json({
    isSuccess: false,
    message: e.message,
    error: e.stack || e
  });
});

server.listen(3000, () => {
  console.log('Server started at: 3000');
});

