const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
    {
      question: "inside which HTML element do we put the javascript?",
      choice1: "<Script>",
      choice2: "<Javascript>",
      choice3: "<js>",
      choice4: "<scripting>",
      answer: 1,
    },
    {
      question:
        "what is the correct systanx to referring to an external script called 'xxx.js' ?",
      choice1: "<script href='xxx.js>",
      choice2: "<script name='xxx.js'>",
      choice3: "<script src='xxx.js'>",
      choice4: "<script file='xxx.js>",
      answer: 3,
    },
    {
      question: "How do you write 'Hello world' in an alert box?",
      choice1: "msBox('Hello world');",
      choice2: "alertBox('Hello world');",
      choice3: "msg('Hello world');",
      choice4: "alert('Hello world');",
      answer: 4,
    },
    {
        question: "How do you write 'Hello world' to console?",
        choice1: "console.log('Hello world');",
        choice2: "alertBox.log('Hello world');",
        choice3: "msg.log('Hello world');",
        choice4: "alert('Hello world');",
        answer: 1,
      },
  ];
  

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 4;

startGame = () => {
  questionCounter = 0;
  score = 0;
  availableQuestions = [...questions];
  console.log(availableQuestions);
  getNewQuestion();
};
getNewQuestion = () => {
    if(availableQuestions.length== 0 || questionCounter >= MAX_QUESTIONS){
        return window.location.assign('/end.html');
    }
    questionCounter++;
    progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
    // questionCounterText.innerText = questionCounter + "/" + MAX_QUESTIONS;

    const quenstionIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[quenstionIndex];
    question.innerText = currentQuestion.question;
  
    choices.forEach((choice) => {
      const number = choice.dataset["number"];
      choice.innerText = currentQuestion["choice" + number];
    });

    availableQuestions.splice(quenstionIndex, 1);
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
  
startGame();
