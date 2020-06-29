import React, {useState, useRef, useEffect} from 'react';
import { Radio, Button } from 'antd';
import axios from 'axios';
import 'antd/dist/antd.css';

import './App.css';

// const ALL_SOUNDS = ['ɑ', 'ɒ', 'ɔ', 'ə', 'ɛ', 'ɜ', 'ɪ', 'ŋ', 'ʃ', 'ʊ', 'ʌ', 'ʒ', 'θ', 'æ', 'ð', 'a', 'b', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'r', 's', 't', 'u', 'v', 'w', 'y', 'z'];
const PRACTICE_OPTIONS = {
  frontVowels: [ 'i', 'ɪ', 'e', 'ɛ'],
  midVowels: [ 'ə', 'ʌ', 'a'],
  backVowels: [ 'u', 'ʊ', 'o', 'ɔ', 'ɑ'],
}

const App = () => {
  let [allWords, setAllWords] = useState([]);
  let [answerMessage, setAnswerMessage] = useState([]);
  let [word, setWord] = useState({
    original: 'Loading...',
    pronunciation: 'Loading...',
    answer: 'Loading...',
    lettersToInput: []
  });
  let [practiceType, setPracticeType] = useState('frontVowels');
  const inputRef = useRef(null);

  const checkAnswer = () => {
    let rightAnswer = word.answer;
    let attempt = inputRef.current?.value;

    if (attempt.toLowerCase() === rightAnswer) { 
        setAnswerMessage(<div className='wordTranslationAnswer correct'> Correct! :) </div>);
        setRandomWord();
        inputRef.current.value = '';
    } else {
        setAnswerMessage(<div className='wordTranslationAnswer incorrect'> Incorrect :( Please try again. </div>);
        console.log(`Right answer: ${rightAnswer}`)
    }
  }

  const setRandomWord = () => {    
    let randomIndex = Math.floor(Math.random() * allWords.length);
    let wordObject = allWords[randomIndex];

    let wordPronunciation = wordObject.pronunciation;
    let replaced = false;
    let lettersToReplace = PRACTICE_OPTIONS[practiceType];

    lettersToReplace.forEach(letter => {
      if (wordPronunciation.indexOf(letter) !== -1) {replaced = true}
      wordPronunciation = wordPronunciation.replace(letter, '_');
    })

    if (replaced) {
      // Define answer letters
      let letterstoInputArray = [];

      [...wordObject.pronunciation].forEach((letter,i) => {
        if (wordPronunciation[i] === "_") { letterstoInputArray.push(letter) };
      })

      let wordToSet = {
        original: wordObject.word,
        pronunciation: wordPronunciation,
        answer: wordObject.pronunciation,
        lettersToInput: letterstoInputArray,
      }

      setWord(wordToSet);
    } else {
      setRandomWord();
    }
  }

  const checkAnsw = (e) => {
    let attempt = e.currentTarget.value;
    let rightAnswer = word.lettersToInput[0];

    // console.log(attempt, rightAnswer)

    if (attempt.toLowerCase() === rightAnswer) {
      if (word.lettersToInput.length > 1) {

        // Replace _ in letter
        let pronunciationCopy = word.pronunciation;
        pronunciationCopy = pronunciationCopy.replace('_', rightAnswer);

        // Remove letter from lettersToInput
        let lettersToInputCopy = word.lettersToInput;
        lettersToInputCopy.splice(0, 1);

        // Update into state
        let wordCopy = {
          original: word.original,
          pronunciation: pronunciationCopy,
          answer: word.answer,
          lettersToInput: lettersToInputCopy,
        }
        setWord(wordCopy)

        // Update message
        setAnswerMessage(<div className='wordTranslationAnswer correct'> Correct! You have {wordCopy.lettersToInput.length} more letter{wordCopy.lettersToInput.length === 0 ? 's' : ''} to go. </div>);
      } else {
        // Update message
        setAnswerMessage(<div className='wordTranslationAnswer correct'> Correct! You've completed the word :) </div>);
        // Reset
        setRandomWord();  
      }
    } else {
      setAnswerMessage(<div className='wordTranslationAnswer incorrect'> Incorrect :( Please try again. </div>);
      console.log(`Right answer: ${rightAnswer}`)
    }
  }

  const displayInputs = () => {
    return PRACTICE_OPTIONS[practiceType].map((letter, i) => {
      return <Button value={letter} className="inputOption" key={i} onClick={(e) => checkAnsw(e)}>{letter}</Button>
    })
  }

  useEffect(() => {
    axios.get('http://localhost:5000/api/pronunciations')
      .then((res) => setAllWords(res.data))
      .catch((err) => console.log(err));
  }, [])

  useEffect(() => {
    if (allWords.length) {setRandomWord();}
  }, [allWords, practiceType])

  return (
    <div className="App">
      <h2>English Pronunciation Practice</h2>
      <Radio.Group className="practiceOptions" value={practiceType} onChange={(e) => setPracticeType(e.target.value)} defaultValue="frontVowels" buttonStyle="solid">
        <Radio.Button value="frontVowels">Front Vowels <br/> ({PRACTICE_OPTIONS.frontVowels.toString(' - ')})</Radio.Button>
        <Radio.Button value="midVowels">Mid Vowels <br/> ({PRACTICE_OPTIONS.midVowels.toString(' - ')})</Radio.Button>
        <Radio.Button value="backVowels">Back Vowels <br/> ({PRACTICE_OPTIONS.backVowels.toString(' - ')})</Radio.Button>
      </Radio.Group>
      <div className='wordPronunciationPair'>
        <div>
          <h3>Word</h3>
          <div className='wordToTranslate'><p>{word.original}</p></div>
        </div>
        <div>
          <h3>Pronunciation</h3>
          <div className='wordToTranslate'><p>{word.pronunciation}</p></div>
        </div>
      </div>
      <div className='inputs'>
        {displayInputs()}
      </div>
      {/* <input ref={inputRef} className="wordTranslationInput" placeholder="Your answer here." onKeyPress={event => {if (event.key === 'Enter') {checkAnswer()}}}></input> */}
      {answerMessage}
    </div>
  );
};

export default App;