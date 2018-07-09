import express from 'express';
import path from 'path';

const app = express();
const port = process.env.PORT || 5001;

app.listen(port, () => console.log(`Listening on port ${port}`));

app.use(express.static(__dirname + '/client/build'));

app.get('/splash', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/splash.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});