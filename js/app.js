
let quizcontainer=document.getElementById('quizcontainer')

function getquizlist() {
    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json())
        .then(treasureHuntObject => {
            if (treasureHuntObject.status === "OK") {
                const treasurearray = treasureHuntObject.treasureHunts;
                for (i = 0; i < treasurearray.length; i++) {
                    let qname = treasurearray[i].name;
                    let qdesc = treasurearray[i].description;
                    let qstartdate = new Date(treasurearray[i].startsOn);
                    //let qenddate = new Date(treasurearray[i].endsOn);

                let bigbox=document.createElement('div');
                bigbox.className="quizbox";

                let boxheader=document.createElement('div');
                boxheader.className="quizboxheader";
                boxheader.textContent=qname;
                bigbox.appendChild(boxheader);

                let content=document.createElement('div');
                    content.innerHTML = qdesc + "<br>" + "This quiz's start date is: " + "<br>" + qstartdate;
                bigbox.appendChild(content);

                quizcontainer.appendChild(bigbox);

                }

            } else {
                alert("There was a problem with the API response");
            }
        });
}


getquizlist(); //TODO: Add a player input box and call the quizlist function only after the player gives the mandatory data needed to start a quiz/onsubmit



