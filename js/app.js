
function getquizlist() {
    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json())
        .then(treasureHuntObject => {
                const treasurearray = treasureHuntObject.treasureHunts;
           for (i=0;i<=treasurearray.length;i++){



               //create a box for the quiz and append to quizcontainer
           }

            }
        );
}
getquizlist(); //TODO: Consider not using a function and just running the script right away


