

var options = {
    continuous: true,
    video: document.getElementById('preview'),
    mirror: true,
    captureImage: false,
    backgroundScan: true,
    refractoryPeriod: 5000,
    scanPeriod: 1
};

var scanner = new Instascan.Scanner(options);

function start_scan() {
    let popupwindow= document.getElementById("popup");
    let scancontent=document.getElementById("scanned_content");
        popupwindow.style.display="flex";

    Instascan.Camera.getCameras().then(function (cameras) {
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
        scancontent.innerHTML=content;
    });
}

function stopScan(){

}
