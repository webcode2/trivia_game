const first = document.querySelector(".problem .first")
const correction = document.querySelector(".correction")
const answers_btn = document.querySelector(".answers_btn")
const level_form = document.querySelector("form#level")
const category = document.querySelector("p#category span")

const score = document.querySelector(".score")
const wrong = document.querySelector(".wrong")
let max;

navigator.getBattery().then(function(battery) {
    console.log("Battery will drain in ", battery.dischargingTime+"seconds");
});

function fetch_data() {
    return new Promise(async (resolve, reject) => {
        let data = await fetch("./quiz.json")
        if (data.ok) {
            data = await data.json()
            resolve(data)
            return
        }
        reject("there was a problem retriving data, Plase try again by Refreshing the page")

    });

}


function addEvent() {
    Array.from(answers_btn.children).forEach((option) => {
        option.addEventListener('click', handle_submition)
    })
}

let game = {
    current_problem: "",
    problem: "",
    score: 0,
    wrong_answer: 0,
    Data: {}
}


fetch_data().then((data) => {
    Data = data.results
    max = Data.length
    game.problem = next(max)

    console.log(Data.length);

    updateUI(game.problem)
    addEvent()
}).catch((value) => {
    category.parentElement.innerHTML = ""
    first.innerHTML = value
    first.nextElementSibling.innerHTML = ''
    score.parentElement.innerHTML = ""
})


function next(max) {
    let number = random_problem(max)
    console.log(number);
    game.current_problem = Data[number]
    return game.current_problem
}

function updateUI(problem) {
    let answers = problem.incorrect_answers.concat(problem.correct_answer)
    answers = answers.sort()

    score.innerHTML = game.score
    wrong.innerHTML = game.wrong_answer

    category.innerHTML = problem.category
    first.innerHTML = problem.question
    answers.forEach((option) => {
        first.nextElementSibling.insertAdjacentHTML("beforeend", ` <button class="btn btn-outline-primary mr-2 mt-2">${option}</button>`)
    })
    return true
}

function handle_submition(e) {
    first.innerHTML = ""
    first.nextElementSibling.innerHTML = ""

    if (game.current_problem.correct_answer == e.target.innerHTML) {
        game.score = game.score + 1
        if (updateUI(next(max))) {
            addEvent()
        }
        return
    }
    game.wrong_answer = game.wrong_answer + 1

    if (updateUI(next(max))) {
        addEvent()
    }
}

function random_problem(max) {
    return Math.floor(Math.random() * (max + 1))
}
