/* eslint-disable @typescript-eslint/no-var-requires */

const express = require('express');
const app = express();
const port = 3000;

const {imagePage, imageInfo} = require('./mocks');

app.get('/search/photos*', (req, res) => res.send(imagePage));
app.get('/photos*', (req, res) => res.send(imageInfo));

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`),
);
