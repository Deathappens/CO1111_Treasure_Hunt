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


