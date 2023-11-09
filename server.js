const express = require('express');
const path = require('path');

const app = express();

app.use(express.static(path.join(__dirname, '/client')));

const messages = [];

app.get('/', (req, res) => {
    res.render('/index');
  });

app.listen(8000, () => {
  console.log('Server is running on port: 8000');
});