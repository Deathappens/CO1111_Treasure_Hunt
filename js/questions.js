let sessionID = getCookie("sessionID");
const questionTextElement = document.getElementById("questionText");
const skipbutton = document.getElementById("skipbutton");
const qNoHeader = document.getElementById("questionNo");
const textAnswerBlock = document.getElementById("textAnswerBlock");
const intAnswerBlock = document.getElementById("intAnswerBlock");
const numAnswerBlock = document.getElementById("numAnswerBlock");
const mcqAnswerBlock = document.getElementById("mcqAnswerBlock");
const boolAnswerBlock = document.getElementById("boolAnswerBlock");

function getQuestion() {
    fetch(`https://codecyprus.org/th/api/question?session=${sessionID}`)
        .then(response => response.json())
        .then(jsonObject => {
            console.log(jsonObject);
            if (jsonObject.completed == false) {
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


                if (jsonObject.canBeSkipped == true) {
                    skipbutton.style.visibility = "visible";
                }


            }else{

                questionTextElement.innerHTML="<h1>Congratulations! You have finished the quiz!</h1>"

            }
        });
}

function answer(type, ButtonInputResponse = null) { //TODO: Look again into hiding the input boxes
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
            answerValue = ButtonInputResponse;
            break;
        case "MCQ":
            answerValue = ButtonInputResponse;
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
                    getQuestion(); //TODO: check what happens if you getQuestion after completing the quiz
                } else {
                    alert(jsonObject.message);
                }
            } else {
                alert(jsonObject.errorMessages);
                //TODO - Handle error message-doing what?
            }
        });

}

function skipper() {
    fetch(`https://codecyprus.org/th/api/skip?session=${sessionID}`)
        .then(response => response.json())
        .then(jsonObject => {
            if (jsonObject.status === "OK") {
                getQuestion();
            } else {
                console.log(jsonObject);
                alert(jsonObject.errorMessages);
            }
        })
}


getQuestion();


//TODO:4)Implement location functionality