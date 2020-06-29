// Dependencies 
require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const Pronunciation = require('./models/Pronunciation.js');

// Setting up server
const app = express();
const server = http.Server(app);
app.use(cors());
app.use(express.static(path.join(__dirname, '../../client/build')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/', 'index.html'));
});

// Starting server
let port = process.env.PORT;
app.set('port', port);
server.listen(port, function() {
    console.log(`Starting server on port ${port}`);
});

// Connect to database
mongoose
  .connect(process.env.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(self => {
    console.log(`Connected to the database: "${self.connection.name}"`);
    // Before adding any documents to the database, let's delete all previous entries
    // return self.connection.dropDatabase();
  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });

app.get('/api/pronunciations', (req, res, next) => {
  Pronunciation.find({})
    .then(data => res.send(data))
    .catch(error => console.log(error));
})