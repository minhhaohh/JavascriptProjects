const quizData = [
    {
        question: "1 + 1 = ?",
        a: "0",
        b: "1",
        c: "2",
        d: "3",
        correct: "a",
    },
    {
        question: "Who is the President of US?",
        a: "Barack Obama",
        b: "Donald Trump",
        c: "Joe Biden",
        d: "Me",
        correct: "c",
    },
    {
        question: "What is the most used programming language in 2021?",
        a: "Java",
        b: "C",
        c: "Python",
        d: "Javascript",
        correct: "d",
    },
    {
        question: "What does HTML stand for?",
        a: "Hypertext Markup Language",
        b: "Cascading Style Sheet",
        c: "JavaScript Object Notation",
        d: "Application Programming Interface",
        correct: "a",
    },
    {
        question: "What was Javascript launched?",
        a: "1996",
        b: "1995",
        c: "1994",
        d: "None of above",
        correct: "b",
    },
];

const container = document.querySelector(".container");
const questionText = document.querySelector(".question-text");
const answerElements = document.querySelectorAll(".answer");
const answerA = document.getElementById("answer-a");
const answerB = document.getElementById("answer-b");
const answerC = document.getElementById("answer-c");
const answerD = document.getElementById("answer-d");
const submitBtn = document.getElementById("submit-btn");

let currentIndex = 0;
let score = 0;

loadQuiz();

function loadQuiz() {
    deselectAnswer();
    const currentQuiz = quizData[currentIndex];

    questionText.innerHTML = currentQuiz.question;
    answerA.innerHTML = currentQuiz.a;
    answerB.innerHTML = currentQuiz.b;
    answerC.innerHTML = currentQuiz.c;
    answerD.innerHTML = currentQuiz.d;
}

function getSelected() {
    let answer;

    answerElements.forEach((answerElement) => {
        if (answerElement.checked) {
            answer = answerElement.value;
        }
    });
    return answer;
}

function deselectAnswer() {
    answerElements.forEach((answerElement) => {
        answerElement.checked = false;
    });
}

submitBtn.addEventListener("click", () => {
    const answer = getSelected();
    if (answer) {
        if (answer === quizData[currentIndex].correct) {
            score++;
        }
        currentIndex++;
        if (currentIndex < quizData.length) {
            loadQuiz();
        } else {
            container.innerHTML = `
                <h1>You answered correctly at ${score}/${quizData.length} questions.</h1>
                <button onclick="location.reload()">Reload</button>
            `;
        }
    } else {
        alert("Please select a answer!");
    }
});
