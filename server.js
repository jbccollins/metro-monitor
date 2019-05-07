import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import runApp from './runApp';
dotenv.config();

const app = express();
const DEFAULT_PORT = 5001;
const port = process.env.PORT || DEFAULT_PORT;

runApp(app, port);

app.use(express.static(__dirname + '/client/build'));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});