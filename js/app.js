let quizcontainer = document.getElementById('quizcontainer')
var username;
var appname;
var button=document.getElementById("submitbutton");

function formInputValidator(event) {
    event.preventDefault();
        username = document.getElementById("pname");
        appname = document.getElementById("appname");
    button.value = "Refresh the page if you wish to change your info!"; //TODO:implement actual validation (ensure name and appname are only text)
    button.disabled=true;
        getQuizList();
}


function questFetcher(qid) {
    fetch("https://codecyprus.org/th/api/start?player=" + username.value + "&app=" + appname.value + "&treasure-hunt-id=" + qid)
        .then(response => response.json())
        .then(quizobject => {
                if (quizobject.status === "ERROR") {
                    alert(quizobject.errorMessages[0]);
                }

            }
        );

}

function getQuizList() {
    let today = new Date();

    fetch("https://codecyprus.org/th/api/list")//send a query about the list of quests from the API
        .then(response => response.json()) //parse it
        .then(treasureHuntObject => {
            if (treasureHuntObject.status === "OK") { //check if the list was received correctly
                const treasurearray = treasureHuntObject.treasureHunts; //if so,take the array of quests
                for (i = 0; i < treasurearray.length; i++) {
                    let qname = treasurearray[i].name;
                    let qdesc = treasurearray[i].description;
                    let qstartdate = new Date(treasurearray[i].startsOn);
                    let questid = treasurearray[i].uuid;
                    let qenddate = new Date(treasurearray[i].endsOn);
                    //break down all the relevant information for each quest

                    let bigbox = document.createElement('div');
                    bigbox.className = "quizbox";

                    let boxheader = document.createElement('div');
                    boxheader.className = "quizboxheader";
                    boxheader.textContent = qname;
                    bigbox.appendChild(boxheader);

                    let content = document.createElement('div');
                    content.innerHTML = qdesc + "<br>" + "This quiz's start date is: " + "<br>" + qstartdate;
                    bigbox.appendChild(content);

                    let startlink = document.createElement('div');

                    if (!(qenddate < today) && !(qstartdate > today)) {  //if the quiz ended before the current date or is set to start in the future, the start link isn't clickable
                        startlink.innerHTML = "<button onclick='questFetcher(\"" + questid + "\")'>Click here to start</button>";
                    } else {
                        startlink.style.color = "grey";
                        startlink.style.textDecoration = "underline";
                        startlink.style.cursor = "default";
                        startlink.textContent = "This quest cannot be started yet or has already ended."
                    }
                    bigbox.appendChild(startlink);

                    quizcontainer.appendChild(bigbox);

                }

            } else {
                alert("There was a problem with the API response");
            }
        });
}




