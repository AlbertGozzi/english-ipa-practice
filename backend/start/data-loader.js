const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const Pronunciation = require('../models/Pronunciation');

const MONGODB_URI = 'mongodb://localhost:27017/english-ipa-pronunciations';

// Connect to database
mongoose
  .connect(MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(self => {
    console.log(`Connected to the database: "${self.connection.name}"`);

  })
  .catch(error => {
    console.error('Error connecting to the database', error);
  });

let mostCommonWordsArray = fs.readFileSync(__dirname + "/data/google-10000-english-usa.txt").toString().split("\n");

const getData = async () => {
    for (let i = 0; i < mostCommonWordsArray.length; i++) {
        let word = mostCommonWordsArray[i];
    
        axios.get(`https://www.dictionary.com/browse/${word}?s=t`)
        .then((response) => {
          const html = response.data;
          const $ = cheerio.load(html);
          let ipaPronunciation = $('.pron-ipa-content').first().text();
          let pronunciation = {
              word: word,
              pronunciation: ipaPronunciation,
              frequency: i,
          }
    
          Pronunciation.create(pronunciation)
            .then(res => console.log(`Added ${word} - i: ${i}`))
            .catch(err => console.log(`Error`));
        //   console.log(`Word: ${word} Pronunciation: ${ipaPronunciation}`);
        })
        .catch(err => console.log(err));
    
        await new Promise(resolve => setTimeout(resolve, 500));
    }    
}

getData();