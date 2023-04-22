const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const timerDisplay = document.getElementById('timeLeft');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [];
fetch("https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple")
  .then(res => {
    return res.json();
  })
  .then(loadedQuestions => {
    console.log(loadedQuestions.results);
    questions = loadedQuestions.results.map( loadedQuestions => {
      const formattedQuestion = {
        question: loadedQuestions.question
      };

      const answerChoices = [...loadedQuestions.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
      answerChoices.splice(formattedQuestion.answer -1, 0, loadedQuestions.correct_answer);

      answerChoices.forEach((choice, index) =>{
        formattedQuestion["choice" + (index+1)] = choice;
      })

      return formattedQuestion;
    })

  

   startGame();
  })
  .catch(err => {
    console.error(err);
  });



  

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  console.log(availableQuestions);
  getNewQuestion();

  game.classList.remove("hidden");
  loader.classList.add("hidden");
};
let timerInterval;
getNewQuestion = () => {
  // If there are no more questions or the maximum number of questions has been reached
  if (availableQuestions.length == 0 || questionCounter >= MAX_QUESTIONS) {
      // Save the final score to local storage
      localStorage.setItem("mostRecentScore", score);
      // Redirect to the end page
      return window.location.assign('/end.html');
  }// Clear the previous timer interval
  clearInterval(timerInterval);
  // Reset the timer display element
  timerDisplay.innerText = '30';
  // set initial time left to 30 seconds
  let timeLeft = 30;

  // Start the timer and update the timer display element every second
  timerInterval = setInterval(() => {
    timeLeft--;
    timerDisplay.innerText = ` ${timeLeft}`;

    if (timeLeft == 0) {
      // Time's up! Clear the timer and move on to the next question
      clearInterval(timerInterval);
      getNewQuestion();
    }
  }, 1000);
  // Increment the question counter and update the progress text and bar
  questionCounter++;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  // Choose a random question from the remaining available questions
  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerText = currentQuestion.question;

  // Update the answer choices for the current question
  choices.forEach((choice) => {
      const number = choice.dataset["number"];
      choice.innerText = currentQuestion["choice" + number];
  });

  // Remove the current question from the available questions array
  availableQuestions.splice(questionIndex, 1);

  // Save the current score and remaining questions to local storage
  localStorage.setItem("currentScore", score);
  localStorage.setItem("remainingQuestions", JSON.stringify(availableQuestions));

  // Set acceptingAnswers to true to allow the user to select an answer
  acceptingAnswers = true;

};


  choices.forEach(choice => {
    choice.addEventListener("click", e =>{
       if(!acceptingAnswers) return;

       acceptingAnswers = false;
       const selectedChoice = e.target;
       const selectedAnswer = selectedChoice.dataset["number"];

    //    const classToApply = 'incorrect';
    //    if(selectedAnswer == currentQuestion.answer){
    //     classToApply = 'Correct';
    //    };
const classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

if(classToApply == "correct"){
    incrementScore(CORRECT_BONUS);
}
selectedChoice.parentElement.classList.add(classToApply);
setTimeout(() => {
    selectedChoice.parentElement.classList.remove(classToApply);

    getNewQuestion();
}, 1000)

    });
  });

  incrementScore = num =>{
    score +=num;
    scoreText.innerText = score;
  }