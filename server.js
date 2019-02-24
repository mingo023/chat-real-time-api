require('dotenv').config();
import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

import connectToDb from './db/connect';

import chat from './routes/chat-route';
/** 
  @API
**/
import { apiGroupRoute,
  apiMessageRoute,
  apiUploadRoute,
  apiUserRoute 
} from './api/routes';

import { initSocket } from './socket-handler';

const server = express();

const http = require('http').Server(server);
initSocket(http);

connectToDb();

server.use(cookieParser());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({
  extended: false
}));

server.use(express.static('public'));



/** 
  @API
**/
server.use('/api', apiUserRoute);
server.use('/api', apiGroupRoute);
server.use('/api', apiMessageRoute);
server.use('/api', apiUploadRoute);

server.use((e, req, res, next) => {
  return res.status(400).json({
    isSuccess: false,
    message: e.message,
    error: e.stack || e
  });
});

http.listen(3000, () => {
  console.log('Server started at: 3000');
});

