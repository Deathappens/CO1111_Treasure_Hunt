let quizcontainer = document.getElementById('quizcontainer')
var uname = document.getElementById("pname");
var appname = document.getElementById("appname");

function getquizlist(event) {
    event.preventDefault();
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
                    let qid = treasurearray[i].uuid;
                    let qenddate = new Date(treasurearray[i].endsOn);

                    let bigbox = document.createElement('div');
                    bigbox.className = "quizbox";

                    let boxheader = document.createElement('div');
                    boxheader.className = "quizboxheader";
                    boxheader.textContent = qname;
                    bigbox.appendChild(boxheader);

                    let content = document.createElement('div');
                    content.innerHTML = qdesc + "<br>" + "This quiz's start date is: " + "<br>" + qstartdate+ "<br>"  + "This quiz's end date is:" + "<br>" + qenddate;
                    bigbox.appendChild(content);

                    let startlink = document.createElement('span');
                    if (!(qenddate < today) && !(qstartdate > today)) {  //if the quiz ended before the current date or is set to start after the current date, the start link isn't clickable
                        startlink.innerHTML = "<a href='https://codecyprus.org/th/api/start?player=" + uname + "&app=" + appname + "&treasure-hunt-id=" + qid + "'>Click here to start</a>";
                    } else {
                        startlink.style.color = "grey";
                        startlink.style.textDecoration = "underline";
                        startlink.style.cursor = "default";
                        startlink.textContent="This quiz cannot be started yet or has already ended."
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



