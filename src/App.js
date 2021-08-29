// Importing statics
import './static/css/animate.css';

// Importing Components
import Loading from './components/Loading.js';
import Header from './components/Header.js';
import AnalyzingSection from './components/AnalyzingSection.js';
import LearningSection from './components/LearningSection.js';
import InterpretingSection from './components/InterpretingSection.js';
import TestResult from './components/TestResult.js';

import { React, useState } from 'react';
import { saveAs } from 'file-saver';


function App() {
  // Hooks
  // The letters that meant to be recognized
  const [letters, setLetters] = useState([]);
  // The Data used in ml module.
  const [texts, setTexts] = useState([]);
  const [imgs, setImgs] = useState([]);

  const [testResult, setTestResult] = useState(null);

  // Some Hooks for loading layout purpose
  const [getStarted, setGetStarted] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);
  const [learned, setLearned] = useState(false);

  const [loading, setLoading] = useState(false);
  const [loadingState, setLoadingState] = useState('');

  // Add letters using letters hook... is implemented while analyzing
  const addLetter = (letter) => {
    setLetters((prev) => {
      let newList = [...prev];
      newList.push(letter);
      return newList;
    });
  }

  // Called after hitting the analyze button to reset every thing
  const clear = () => {
    setLetters([]);
    setTexts([]);
    setImgs([]);
  }

  // Called when hitting any submit button in learning section
  // Adds new text to learn and its img pixels using hooks.
  const addToDBListener = (text, img) => {
    setTexts((prev) => {
      let newList = [...prev];
      newList.push(text);
      return newList;
    });

    setImgs((prev) => {
      let newList = [...prev];
      newList.push(img);
      return newList;
    });
  }

  const showTestResult = (image) => {
    setTestResult(image);
  }
  const hideTestResult = () => {
    setTestResult(null);
  }

  // Save the learned data as a json file in local machine
  const saveLearningData = () => {
    let jsonData = {
      images: imgs,
      texts: texts
    }
    let blob = new Blob([JSON.stringify(jsonData)], {type: "text/plain;charset=utf-8"});
    saveAs(blob, "ArabicOCR-LearningData.json");
  }

  // Load saved data files  from local machine
  const loadLearingData = (e) => {
    setTexts([]);
    setImgs([]);
    const files = e.target.files;
    const filesNum = files.length;

    for (let i = 0; i < filesNum; i++) {
      const reader = new FileReader();

      reader.onload = (evt) => {
        const data = JSON.parse(evt.target.result);
        
        setImgs((prev) => [...prev, ...data.images]);
        setTexts((prev) => [...prev, ...data.texts]);
      }

      reader.readAsText(files[i]);
    }
  }

  // Some Listeners to control sections appearance
  const getStartedListener = () => {
    setGetStarted(true);
  }
  const finishedAnalyzing = () => {
    setAnalyzed(true);
    setLoading(false);
  }
  const toggleLearned = () => {
    setLearned((prev) => !prev);
  }
  const toggleLoading = () => {
    setLoading((prev) => !prev);
  }

  // Set Loading state from preprocessing to fetching data...etc
  const changeLoadingState = (state) => {
    setLoadingState(state);
  }

  return (
    <div>
      {loading && <Loading state={loadingState} />}
      {testResult && 
      <TestResult 
        result={testResult} 
        hideTestResult={hideTestResult} 
      />}

      {learned &&
        <InterpretingSection 
          texts={texts} 
          images={imgs} 
          letters={letters} 
          toggleLearnedHandler={toggleLearned}
        />
      }
      

      <div className={`flex flex-col justify-between bg-center bg-cover bg-fixed
      overflow-hidden ${(loading || testResult || learned) && 'filter blur-sm grayscale'}`}
      style={{backgroundImage: `url("header.jpg")`}}>

        <Header 
          getStartedHandler={getStartedListener} 
        />
        <AnalyzingSection 
          appear={getStarted}
          showTestResultHandler={showTestResult}
          addLetterHandler={addLetter} 
          clearLettersHandler={clear} 
          finalizeHandler={finishedAnalyzing} 
          toggleLoading={toggleLoading}
          setLoadingStateHandler={changeLoadingState}
        />
        <LearningSection 
          letters={letters} 
          addToDB={addToDBListener} 
          learnedTexts={texts} 
          appear={analyzed}
          finalizeHandler={toggleLearned} 
          saveDataHandler={saveLearningData}
          loadDataHandler={loadLearingData}
        />
      </div>
    </div>
  );
}

export default App;
