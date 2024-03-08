    let sessionID = getCookie("sessionID");
    const questionTextElement = document.getElementById("questionText");
    const answerFieldElement = document.getElementById("answerField");


    function getQuestion() {
    fetch(`https://codecyprus.org/th/api/question?session=${sessionID}`)
        .then(response => response.json())
        .then(jsonObject => {
            console.log(jsonObject);
            questionTextElement.innerHTML = jsonObject.questionText;
        });
}

    function answer() {
    const answerText = answerFieldElement.value;
    fetch(`https://codecyprus.org/th/api/answer?session=${sessionID}&answer=${answerText}`)
    .then(response => response.json())
    .then(jsonObject => {
    answerFieldElement.value = "";
    console.log(jsonObject);
    if (jsonObject.status === "OK") {
    if (jsonObject.correct) {
    alert(jsonObject.message);
    getQuestion();
}
    else {
    alert(jsonObject.message);
}
}
    else {
    alert(jsonObject.errorMessages);
    //TODO - Handle error message
}
});
}

    getQuestion();


//TODO:1)Create different forms for different types of questions as per jsonObject.questionType.
    // TODO:2)Create and show question number/total questions(jsonObject.numofquestions, starts at 0),current score
    // TODO:3) Show whether question is skippable+ provide skip button
    //TODO:4)Implement location functionality