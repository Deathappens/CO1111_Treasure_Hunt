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
var scancontent = document.getElementById("scanned_content");
var active_cam = 0;

function start_scan() {
    let qrbutton=document.getElementById("qrstartbutton");
    let popupwindow = document.getElementById("popup");
    popupwindow.style.display = "flex";
    qrbutton.style.display="none";

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[active_cam]);
            console.log("I have detected"+cameras.length+" cameras");

            sessionStorage.camerastorage = cameras;
            console.log("I have detected"+cameras.length+" cameras");
        } else {
            console.log('No cameras found.');
            alert("No cameras found.");
        }
    }).catch(function (e) {
        console.error(e);
    });

    scanner.addListener('scan', function (content) {

        scancontent.innerHTML = "QR Code detected! Its output is:" + content;
    });

}

function stop_scan() {
    let popupwindow = document.getElementById("popup");
    let qrbutton=document.getElementById("qrstartbutton");
    scanner.stop(active_cam);
    popupwindow.style.display = "none";
    qrbutton.style.display="flex";

}

function camera_cycle() {
    scanner.stop(active_cam);
    console.log(sessionStorage.camerastorage);
    console.log("Session storage has saved"+sessionStorage.camerastorage.length+"cameras");
    if (active_cam < sessionStorage.camerastorage.length) {
        active_cam++;
        console.log("currently active cam is camera number"+active_cam);
    } else {
        active_cam=0;
    }
    start_scan();
}