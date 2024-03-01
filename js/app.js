let quizcontainer = document.getElementById('quizcontainer')
var uname;
var appname;

function formInputValidator(event) {
    event.preventDefault();
    if (true) { //form validation happens here
        uname = document.getElementById("pname");
        appname = document.getElementById("appname");
    }

    getQuizList();
}


function questFetcher(qid) {
    fetch("https://codecyprus.org/th/api/start?player=" + uname + "&app=" + appname + "&treasure-hunt-id=" + qid)
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

    fetch("https://codecyprus.org/th/api/list")
        .then(response => response.json())
        .then(treasureHuntObject => {
            if (treasureHuntObject.status === "OK") {
                const treasurearray = treasureHuntObject.treasureHunts;
                for (i = 0; i < treasurearray.length; i++) {
                    let qname = treasurearray[i].name;
                    let qdesc = treasurearray[i].description;
                    let qstartdate = new Date(treasurearray[i].startsOn);
                    let questid = treasurearray[i].uuid;
                    let qenddate = new Date(treasurearray[i].endsOn);
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

//TODO:Implement Form Validation techniques



