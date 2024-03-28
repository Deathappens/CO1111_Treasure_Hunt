function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function checkCookie() {
    let username = getCookie("username");
    if (username != "") {
        alert("Welcome again " + username);
    } else {
        username = prompt("Please enter your name:", "");
        if (username != "" && username != null) {
            setCookie("username", username, 365);
        }
    }
}


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function delete_cookie(cname) {
    if (getCookie(cname) != "") {
        document.cookie = `${cname}=; Fri, 15 Aug 1969 09:00:00 UTC;path=/;`;
    }else{
        console.log("Could not delete cookie- cookie not set");
    }
}


function magicquestionbutton() {
    const qbutt = document.getElementById("questpagelink");
    if (getCookie("sessionID") === "") {
        qbutt.style.display = "none";
    } else {
        qbutt.style.display = "flex";
    }

}


magicquestionbutton();