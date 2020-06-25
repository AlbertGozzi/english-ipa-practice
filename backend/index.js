let fs = require('fs');

let pronunciationsArray = fs.readFileSync(__dirname + "/data/cmudict-0.7b.txt").toString().split("\n");
let mostCommonWordsArray = fs.readFileSync(__dirname + "/data/google-10000-english-usa.txt").toString().split("\n");
let mostCommonWordsPronunciation = {};

pronunciationsArray.forEach(line => {
    if (line.slice(0,3) !== ';;;') {
        let word = line.split("  ")[0].toLowerCase();
        let pronunciation = line.split("  ")[1];
        if (mostCommonWordsArray.includes(word)) {
            mostCommonWordsPronunciation[word] = pronunciation;
            mostCommonWordsArray.splice(mostCommonWordsArray.indexOf(word), 1)
        }
    }
});

console.log(`Number of words with pronunciation: ${Object.keys(mostCommonWordsPronunciation).length}`);
console.log(`Remaining words: ${mostCommonWordsArray.length}`);
console.log(mostCommonWordsPronunciation)
