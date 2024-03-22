let sessionID = getCookie("sessionID");
const questionTextElement = document.getElementById("questionText");
const skipbutton = document.getElementById("skipbutton");
const qNoHeader = document.getElementById("questionNo");
const textAnswerBlock = document.getElementById("textAnswerBlock");
const intAnswerBlock = document.getElementById("intAnswerBlock");
const numAnswerBlock = document.getElementById("numAnswerBlock");
const mcqAnswerBlock = document.getElementById("mcqAnswerBlock");
const boolAnswerBlock = document.getElementById("boolAnswerBlock");
const playerscore=document.getElementById("playerscoreheading");
const scoreboard=document.getElementById("innerscoreboardiv");
function getQuestion() {
    fetch(`https://codecyprus.org/th/api/question?session=${sessionID}`)
        .then(response => response.json())
        .then(jsonObject => {
            console.log(jsonObject); //TODO:what if getquestion returns a status other than OK
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
                    score();
                    set_scoreboard();

                if (jsonObject.canBeSkipped == true) {
                    skipbutton.style.display = "flex";
                }else{
                    skipbutton.style.display="none";
                }


            }else{
                questionTextElement.innerHTML="<h1>Congratulations! You have finished the quiz!</h1>"
                skipbutton.style.display="none";
            }
        });
}

function answer(type, BoolButtonValue = null) {
    event.preventDefault();
    let answerValue;
    switch (type) {
        case "TEXT":
            const TextAnswerFieldElement = document.getElementById("textAnswerField");
            answerValue = TextAnswerFieldElement.value;
            TextAnswerFieldElement.value = "";

            break;
        case "INTEGER":
            const IntAnswerFieldElement = document.getElementById("intAnswerField");
            answerValue = IntAnswerFieldElement.value;
            IntAnswerFieldElement.value = "";
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
            console.log(jsonObject);
            if (jsonObject.status === "OK") {
                if (jsonObject.correct) {
                    alert(jsonObject.message);
                    switch(type){
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
                }
            } else {
                alert(jsonObject.errorMessages);
                //TODO - Handle error message-doing what?
            }
        });

}
function score(){
    fetch(`https://codecyprus.org/th/api/score?session=${sessionID}`)
        .then(result=>result.json())
        .then(jsonifiedobject=>{
            if(jsonifiedobject.status=="OK"){
                playerscore.innerHTML=`Your score:${jsonifiedobject.score}`;
            }
        })
}
function skipper() {
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
                console.log(jsonObject);
                alert(jsonObject.errorMessages);
            }
        })
}

function set_scoreboard(){
    fetch(`https://codecyprus.org/th/api/leaderboard?session=${sessionID}&sorted&limit=8`)
        .then(response=>response.json())
        .then(jsonobject=>{
            console.log(jsonobject);
            for (let i = 0; i < jsonobject.leaderboard.length; i++) {
                scorespan=document.createElement("span");
                scorespan.className="scorespans";
                scorespan.style.margin="2px";
                scorespan.innerText=`${i}: Player name: ${jsonobject.leaderboard[i].player}, Score:${jsonobject.leaderboard[i].score} `;
                scoreboard.appendChild(scorespan); //TODO: make this update the scoreboard rather than append to it after the first time
            }


        });


}


getQuestion();


//TODO:4)Implement location functionality
//TODO:5)QRCode Reader