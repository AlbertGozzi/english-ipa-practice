import React, {useState, useRef, useEffect} from 'react';
import './App.css';

const App = () => {
  let [answerMessage, setAnswerMessage] = useState([]);
  let [word, setWord] = useState([]);
  const inputRef = useRef(null);

  const displayWord = (word) => {
    return <div className='wordToTranslate'><p>{word}</p></div>
  }

  const checkAnswer = () => {
    let rightAnswer = 'test';
    let attempt = inputRef.current?.value;

    if (attempt.toLowerCase() === rightAnswer) { 
        setAnswerMessage(<div className='wordTranslationAnswer correct'> Correct! :) </div>);
        setWord(getRandomWord());
        inputRef.current.value = '';
    } else {
        setAnswerMessage(<div className='wordTranslationAnswer incorrect'> Incorrect :( Please try again. </div>);
        console.log(`Right answer: ${rightAnswer}`)
    }
  }

  const getRandomWord = () => {
    let words = ['ham', 'cheese', 'bacon'];
    let randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }

  useEffect(() => {
    setWord(getRandomWord())
  }, [])

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