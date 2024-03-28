let sessionID = getCookie("sessionID");
const questionTextElement = document.getElementById("questionText");
const skipbutton = document.getElementById("skipbutton");
const qNoHeader = document.getElementById("questionNo");
const textAnswerBlock = document.getElementById("textAnswerBlock");
const intAnswerBlock = document.getElementById("intAnswerBlock");
const numAnswerBlock = document.getElementById("numAnswerBlock");
const mcqAnswerBlock = document.getElementById("mcqAnswerBlock");
const boolAnswerBlock = document.getElementById("boolAnswerBlock");
const playerscore = document.getElementById("playerscoreheading");
const scoreboard = document.getElementById("innerscoreboardiv");
const scoreboardlink=document.getElementById("scoreboardlink");

function getQuestion() {
    fetch(`https://codecyprus.org/th/api/question?session=${sessionID}`)
        .then(response => response.json())
        .then(jsonObject => {
            console.log(jsonObject);
            if (jsonObject.status == 'OK') {
                if (jsonObject.completed === false) {
                    questionTextElement.innerHTML = jsonObject.questionText;
                    qNoHeader.innerText = `Question ${(jsonObject.currentQuestionIndex + 1)}/${jsonObject.numOfQuestions}`;

                    switch (jsonObject.questionType) {

                        case "BOOLEAN":
                            boolAnswerBlock.style.display = "flex";
                            break;
                        case "INTEGER":
                            intAnswerBlock.style.display = "flex";
                            break;
                        case "NUMERIC":
                            numAnswerBlock.style.display = "flex";
                            break;
                        case "MCQ":
                            mcqAnswerBlock.style.display = "flex";
                            break;
                        case "TEXT":
                            textAnswerBlock.style.display = "flex";
                            break;

                    }
                    if (jsonObject.requiresLocation == true) {
                        console.log("attempting to send location");
                        get_location();
                    }
                    score();
                    update_scoreboard();

                    if (jsonObject.canBeSkipped == true) {
                        skipbutton.style.display = "flex";
                    } else {
                        skipbutton.style.display = "none";
                    }


                } else {
                    questionTextElement.innerHTML = "<h1>Congratulations! You have finished the quiz!</h1>"
                    skipbutton.style.display = "none";
                }
            } else {
                session_ok=false;
                console.log(jsonObject.errorMessages);
                questionTextElement.innerHTML = "<h1>Sorry! An error has occurred!</h1>"
                let goback = document.createElement("button");
                goback.innerText = "Go Back";
                goback.onclick = () => {
                    window.location.href = "app.html";
                    questionTextElement.removeChild(goback);
                };
                questionTextElement.appendChild(goback);

            }
        });
}

function get_location() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(send_location);
    } else {
        alert("Please enable geolocation on your device to continue");
    }
}

function send_location(position) {
    console.log("The latitude is" + position.coords.latitude + "and the longtitude is" + position.coords.longitude);
    fetch(`https://codecyprus.org/th/api/location?session=${sessionID}&latitude=${position.coords.latitude}&longitude=${position.coords.longitude}`)
        .then(reply => reply.json())
        .then(object => console.log(object));

}

function answer(type, BoolButtonValue = null) {
    event.preventDefault();
    let answerValue;
    let alphabetregex = /^[a-zA-Z0-9]+$/; //Regular expression found in https://www.w3resource.com/javascript/form/all-letters-field.php;

    switch (type) {
        case "TEXT":
            let TextAnswerFieldElement = document.getElementById("textAnswerField");
            if (alphabetregex.test(TextAnswerFieldElement.value)) { //ensuring the answer given is alphanumeric-that is, letters and numbers only
                answerValue = TextAnswerFieldElement.value;
                TextAnswerFieldElement.value = "";
            } else {
                alert("Invalid input: No special characters allowed");
                return;
            }
            break;
        case "INTEGER":
            const IntAnswerFieldElement = document.getElementById("intAnswerField");
            let numberfiedstring = Number(IntAnswerFieldElement.value);
            if (Number.isInteger(numberfiedstring)) { //The point of differentiating between number questions and integer questions is that integer questions only accept integers as a response
                answerValue = IntAnswerFieldElement.value;
                IntAnswerFieldElement.value = "";
            } else {
                alert("Invalid input: Number given must be an integer");
                return;
            }
            break;
        case"NUMERIC":
            const NumAnswerFieldElement = document.getElementById("numAnswerField");
            answerValue = NumAnswerFieldElement.value;
            NumAnswerFieldElement.value = "";
            break;
        case "BOOLEAN":
            answerValue = BoolButtonValue;
            break;
        case "MCQ":
            answerValue = BoolButtonValue;
    }

    fetch(`https://codecyprus.org/th/api/answer?session=${sessionID}&answer=${answerValue}`)
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK") {
                if (jsonObject.correct) {
                    alert(jsonObject.message);
                    switch (type) {
                        case "BOOLEAN":
                            boolAnswerBlock.style.display = "none";
                            break;
                        case "INTEGER":
                            intAnswerBlock.style.display = "none";
                            break;
                        case "NUMERIC":
                            numAnswerBlock.style.display = "none";
                            break;
                        case "MCQ":
                            mcqAnswerBlock.style.display = "none";
                            break;
                        case "TEXT":
                            textAnswerBlock.style.display = "none";
                            break;
                    }
                    getQuestion();
                } else {
                    alert(jsonObject.message);
                    score();
                }
            } else {
                alert(jsonObject.errorMessages);
                //TODO - Handle error message-doing what?
            }
        });

}

function score() {
    fetch(`https://codecyprus.org/th/api/score?session=${sessionID}`)
        .then(result => result.json())
        .then(jsonifiedobject => {
            if (jsonifiedobject.status == "OK") {
                playerscore.innerHTML = `Your score:${jsonifiedobject.score}`;
            }
        })
}

function skipper() {
    if (confirm("Are you sure you want to skip this question? This will negatively impact your score")) {
        fetch(`https://codecyprus.org/th/api/skip?session=${sessionID}`)
            .then(response => response.json())
            .then(jsonObject => {
                if (jsonObject.status == "OK") {
                    boolAnswerBlock.style.display = "none";
                    intAnswerBlock.style.display = "none";
                    numAnswerBlock.style.display = "none";
                    mcqAnswerBlock.style.display = "none";
                    textAnswerBlock.style.display = "none";
                    getQuestion();
                } else {
                    alert(jsonObject.errorMessages);
                }
            })
    }
}

function set_scoreboard() { //this function only runs once to create the appropriate number of span objects and populate them with the appropriate players and their scores.
    fetch(`https://codecyprus.org/th/api/leaderboard?session=${sessionID}&sorted&limit=5`)//on the actual question page only the top 5 will be displayed
        .then(response => response.json())
        .then(jsonobject => {
            if (jsonobject.status == "OK") {
                scoreboardlink.style.display="flex";
                for (let i = 0; i < jsonobject.leaderboard.length; i++) {

                    let full_name = jsonobject.leaderboard[i].player;
                    let trunc_name = full_name.substring(0, 15); //since some people seemed to find it funny to spam the API with long names, this will ensure the scoreboard remains uniform in composition by truncating the players' name strings. Should probably have implemented checks for other strings the API returns as well but they were considered 'trusted'.
                    scorespan = document.createElement("span");
                    scorespan.className = "scorespans";
                    scorespan.id = "scorespan" + i;
                    scorespan.style.margin = "2px";
                    scorespan.innerText = `${i + 1}: Player name: ${trunc_name}, Score:${jsonobject.leaderboard[i].score} `;
                    scoreboard.appendChild(scorespan);
                }
            }
        });

}

function update_scoreboard() { //this function runs every time a new question is requested and updates the previously created spans in the scoreboard with the new, appropriate scores.
    fetch(`https://codecyprus.org/th/api/leaderboard?session=${sessionID}&sorted&limit=5`)
        .then(response => response.json())
        .then(jsonobject => {
            for (let i = 0; i < jsonobject.leaderboard.length; i++) {
                let updated_span = document.getElementById(`scorespan${i}`);
                let full_name = jsonobject.leaderboard[i].player;
                let trunc_name = full_name.substring(0, 15);
                updated_span.innerText = `${i + 1}: Player name: ${trunc_name}, Score:${jsonobject.leaderboard[i].score}`;
            }
        });

}

set_scoreboard();
getQuestion();

//TODO:4)Implement location functionality
//TODO:5)QRCode Reader