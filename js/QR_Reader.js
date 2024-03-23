import * as secondScript from '/js/instascan.min.js';


var options = {
    continuous: true,
    video: document.getElementById('preview'),
    mirror: true,
    captureImage: false,
    backgroundScan: true,
    refractoryPeriod: 5000,
    scanPeriod: 1
};

var scanner = new secondScript.Scanner(options);

function start_scan() {
    secondScript.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
        } else {
            console.error('No cameras found.');
            alert("No cameras found.");
        }
    }).catch(function (e) {
        console.error(e);
    });
    scanner.addListener('scan', function (content) {
      let popupwindow= document.getElementById("popup").
           popupwindow.innerHTML = content;
         popupwindow.style.display=flex;
    });
}

function stopScan(){

}
