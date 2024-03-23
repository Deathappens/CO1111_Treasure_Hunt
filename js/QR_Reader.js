//Code for QR Scanner taken primarily from Sem2Week4 lab worksheet

var options = {
    continuous: true,
    video: document.getElementById('preview'),
    mirror: false,
    captureImage: true,
    backgroundScan: true,
    refractoryPeriod: 5000,
    scanPeriod: 1
};

var scanner = new Instascan.Scanner(options);
var scancontent=document.getElementById("scanned_content");

function start_scan() {
    let popupwindow= document.getElementById("popup");
    popupwindow.style.visibility="visible";

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[0]);
            window.cameras = cameras;
        } else {
            console.error('No cameras found.');
            alert("No cameras found.");
        }
    }).catch(function (e) {
        console.error(e);
    });

    scanner.addListener('scan', function (content) {

        scancontent.innerHTML="QR Code detected! Its output is:"+content;
    });

}

function stop_scan(){
    let popupwindow= document.getElementById("popup");
    scanner.stop(window.cameras[0]);
    popupwindow.style.visibility="collapse";
}
