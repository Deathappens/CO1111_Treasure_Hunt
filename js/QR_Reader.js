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
var camerastorage;
function start_scan() {
    let qrbutton=document.getElementById("qrstartbutton");
    let popupwindow = document.getElementById("popup");
    popupwindow.style.display = "flex";
    qrbutton.style.display="none";

    Instascan.Camera.getCameras().then(function (cameras) {
        if (cameras.length > 0) {
            scanner.start(cameras[active_cam]);
            console.log("I have detected "+cameras.length+" cameras");
             camerastorage = cameras;
        } else {
            console.log('No cameras found.'); //this error doesn't seem to be firing, but might as well keep it just in case.
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
    scanner.stop(active_cam); //to be perfectly honest, I'm not sure why this works, but...it works.
    popupwindow.style.display = "none";
    qrbutton.style.display="flex";

}

function camera_cycle() {
    scanner.stop(active_cam);
    console.log(camerastorage);
    if (active_cam < camerastorage.length) {
        active_cam++;
        console.log("currently active cam is camera number"+active_cam);
    } else {
        active_cam=0;
    }
    start_scan();
}