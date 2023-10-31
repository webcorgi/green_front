const express = require('express');
const app = express();
const ejs = require('ejs');
const path = require('path');
const PORT = 8000
const cors = require('cors')
// const book = require('./book')


app.use(express.urlencoded());
app.use(express.json());
// app.use(cors())

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'static')));

// 홈페이지 열기
app.get('/', (req, res) => {
  res.render('index');
});
/* 
app.use('/api/book', book); */

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});