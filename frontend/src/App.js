import React, {useState, useRef, useEffect} from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  let [allWords, setAllWords] = useState([]);
  let [answerMessage, setAnswerMessage] = useState([]);
  let [word, setWord] = useState(['Loading...']);
  let [answer, setAnswer] = useState(['Loading...']);
  const inputRef = useRef(null);

  const displayWord = (word) => {
    return <div className='wordToTranslate'><p>{word}</p></div>
  }

  const checkAnswer = () => {
    let rightAnswer = answer;
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
    setWord(wordObject.word);
    setAnswer(wordObject.pronunciation);
  }

  useEffect(() => {
    axios.get('http://localhost:5000/pronunciations')
      .then((res) => setAllWords(res.data))
      .catch((err) => console.log(err));
  }, [])

  useEffect(() => {
    if (allWords.length) {setRandomWord();}
  }, [allWords])

  return (
    <div className="App">
      <h2>English Pronunciation Practice</h2>
      {displayWord(word)}
      <input ref={inputRef} className="wordTranslationInput" placeholder="Your answer here." onKeyPress={event => {if (event.key === 'Enter') {checkAnswer()}}}></input>
      {answerMessage}
    </div>
  );
};

export default App;