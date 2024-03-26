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
    let popupwindow = document.getElementById("popup");
    popupwindow.style.display = "flex";

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[active_cam]);
            sessionStorage.camerastorage = cameras;
        } else {
            console.error('No cameras found.');
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
    scanner.stop(active_cam);
    popupwindow.style.display = "none";
}

function camera_cycle() {
    scanner.stop(active_cam);
    if (active_cam < sessionStorage.camerastorage.length) {
        active_cam++;
    } else {
        active_cam=0;
    }
    start_scan();
}