'use client';

import React, { useState, useEffect } from 'react';

const ItalianBrainrotQuiz = () => {
  const [characters, setCharacters] = useState([]);
  const [currentCharacter, setCurrentCharacter] = useState(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [feedback, setFeedback] = useState('');

  // Load characters data from JSON file
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Load character data
        let charactersData;
        
        if (typeof window !== 'undefined' && window.fs && window.fs.readFile) {
          const data = await window.fs.readFile('D:\\workspace\\quiz\\italian_brainrot_characters.json', { encoding: 'utf8' });
          charactersData = JSON.parse(data);
        } else {
          const response = await fetch('/italian_brainrot_characters.json');
          if (!response.ok) {
            throw new Error('Failed to fetch character data');
          }
          charactersData = await response.json();
        }
        
        if (!charactersData || !charactersData.characters || !Array.isArray(charactersData.characters)) {
          throw new Error('Invalid character data format');
        }
        
        setCharacters(charactersData.characters);
        
        // Create a set of quiz questions (10 random characters)
        createQuiz(charactersData.characters);
        
        setLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setError('Failed to load quiz data. Please check the file paths and permissions.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);
  
  // Create a quiz with 10 random characters
  const createQuiz = (characters) => {
    // Shuffle the characters array
    const shuffled = [...characters].sort(() => 0.5 - Math.random());
    
    // Take the first 10 characters for the quiz
    const selected = shuffled.slice(0, 10);
    
    // Create quiz questions
    const questions = selected.map(character => {
      return {
        character,
        answered: false,
        userAnswer: '',
        isCorrect: null
      };
    });
    
    setQuizQuestions(questions);
    loadQuestion(0, questions);
  };
  
  // Load a specific question
  const loadQuestion = (index, questions = quizQuestions) => {
    if (index >= 0 && index < questions.length) {
      const question = questions[index];
      setCurrentCharacter(question.character);
      setUserAnswer(question.userAnswer || '');
      setIsCorrect(question.isCorrect);
      setFeedback(question.answered ? (question.isCorrect ? 'Correct! 🎉' : `Incorrect. The correct answer is: ${question.character.text}`) : '');
      setCurrentQuestionIndex(index);
    }
  };
  
  // Handle answer submission
  const handleSubmitAnswer = () => {
    // Skip if already answered or no answer
    if (quizQuestions[currentQuestionIndex].answered || !userAnswer.trim()) {
      return;
    }
    
    // Check if the answer is correct (case insensitive)
    const correct = userAnswer.trim().toLowerCase() === currentCharacter.text.toLowerCase();
    
    // Update question state
    const updatedQuestions = [...quizQuestions];
    updatedQuestions[currentQuestionIndex] = {
      ...updatedQuestions[currentQuestionIndex],
      answered: true,
      userAnswer: userAnswer,
      isCorrect: correct
    };
    
    // Update score and questions answered
    if (correct) {
      setScore(prevScore => prevScore + 1);
    }
    setQuestionsAnswered(prevTotal => prevTotal + 1);
    
    // Update state
    setQuizQuestions(updatedQuestions);
    setIsCorrect(correct);
    setFeedback(correct ? 'Correct! 🎉' : `Incorrect. The correct answer is: ${currentCharacter.text}`);
    
    // Check if quiz is complete
    if (questionsAnswered + 1 >= quizQuestions.length) {
      setQuizComplete(true);
    }
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    setUserAnswer(e.target.value);
  };
  
  // Handle key press (Enter to submit)
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmitAnswer();
    }
  };
  
  // Handle next question button
  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < quizQuestions.length) {
      loadQuestion(nextIndex);
    }
  };
  
  // Handle previous question button
  const handlePrevQuestion = () => {
    const prevIndex = currentQuestionIndex - 1;
    if (prevIndex >= 0) {
      loadQuestion(prevIndex);
    }
  };
  
  // Restart the quiz
  const handleRestartQuiz = () => {
    setScore(0);
    setQuestionsAnswered(0);
    setQuizComplete(false);
    setUserAnswer('');
    setIsCorrect(null);
    setFeedback('');
    createQuiz(characters);
  };
  
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading quiz data...</div>;
  }
  
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-md p-6 bg-red-50 rounded-lg border border-red-200">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <p className="mt-4 text-gray-700 text-sm">
            Make sure the Italian Brainrot JSON file is in the correct location and accessible.
          </p>
        </div>
      </div>
    );
  }
  
  // Quiz summary/results screen
  if (quizComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 space-y-6">
          <h1 className="text-2xl font-bold text-center text-indigo-700">Quiz Complete!</h1>
          
          <div className="text-center py-6">
            <p className="text-3xl font-bold text-indigo-800 mb-2">Your Score: {score}/{quizQuestions.length}</p>
            <p className="text-gray-600">
              {score === quizQuestions.length ? 'Perfect score! You\'re an Italian Brainrot expert!' :
               score >= quizQuestions.length * 0.8 ? 'Excellent! You know your Italian Brainrot characters well!' :
               score >= quizQuestions.length * 0.6 ? 'Good job! You have a solid knowledge of Italian Brainrot.' :
               score >= quizQuestions.length * 0.4 ? 'Not bad! You\'re getting familiar with these characters.' :
               'Keep practicing to improve your Italian Brainrot knowledge!'}
            </p>
          </div>
          
          <div className="flex justify-center pt-4">
            <button
              onClick={handleRestartQuiz}
              className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition font-medium"
            >
              Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  // Quiz question screen
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-center text-indigo-700">Italian Brainrot Quiz</h1>
        
        <div className="text-center">
          <p className="text-gray-600 mb-2">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full"
              style={{ width: `${(questionsAnswered / quizQuestions.length) * 100}%` }}
            ></div>
          </div>
          <p className="text-gray-600 mt-2">Score: {score}/{questionsAnswered}</p>
        </div>
        
        {currentCharacter && (
          <div className="space-y-6">
            <div className="flex justify-center">
              <img 
                src={currentCharacter.src} 
                alt="Character Image" 
                className="w-64 h-64 object-contain border border-gray-300 rounded"
              />
            </div>
            
            <div className="space-y-4">
              <p className="text-center font-medium">Who is this character?</p>
              
              <div className="relative">
                <input
                  list="characters-list"
                  type="text"
                  value={userAnswer}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type or select character name"
                  disabled={quizQuestions[currentQuestionIndex].answered}
                  className={`w-full px-4 py-2 border ${
                    quizQuestions[currentQuestionIndex].answered 
                      ? isCorrect
                        ? 'border-green-300 bg-green-50'
                        : 'border-red-300 bg-red-50'
                      : 'border-gray-300'
                  } rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                />
                <datalist id="characters-list">
                  {characters.map((character) => (
                    <option key={character.id} value={character.text} />
                  ))}
                </datalist>
              </div>
              
              {!quizQuestions[currentQuestionIndex].answered && (
                <div className="flex justify-center">
                  <button
                    onClick={handleSubmitAnswer}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                  >
                    Submit Answer
                  </button>
                </div>
              )}
              
              {feedback && (
                <div className={`p-3 rounded-md text-center ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {feedback}
                </div>
              )}
            </div>
          </div>
        )}
        
        <div className="flex justify-between pt-4">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className={`px-4 py-2 rounded-md ${
              currentQuestionIndex === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-800 hover:bg-gray-400 transition'
            }`}
          >
            Previous
          </button>
          
          {quizQuestions[currentQuestionIndex].answered ? (
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === quizQuestions.length - 1}
              className={`px-4 py-2 rounded-md ${
                currentQuestionIndex === quizQuestions.length - 1
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 transition'
              }`}
            >
              Next
            </button>
          ) : (
            <button className="invisible px-4 py-2">Next</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItalianBrainrotQuiz;