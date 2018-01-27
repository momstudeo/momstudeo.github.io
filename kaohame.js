var video = document.getElementById("video");
var medias = { audio:false, video:{}};
if(!!navigator.mediaDevices&&!!navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia(medias).then(function(stream) {
    //　video.srcObject にストリームを入れます。
    video.srcObject = stream;
  }).catch(function(err) {
    // カメラを許可してください。
    window.alert("カメラの使用が許可されませんでした");
  });
}
else {
  // カメラがないです。
    window.alert("非対応環境です");
}
var image = new Image();
image.crossOrigin = "Anonymous";
image.src = "superman_hero.png";

var canvas = document.getElementById("canvas");

video.addEventListener("loadedmetadata",function(e) {

  var ctx = canvas.getContext("2d");
  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  ctx.beginPath();
  ctx.rect((canvas.width-image.width)/2,(canvas.height-image.height)/2,image.width,image.height);
  ctx.clip();
  canvas.height = image.height;
  canvas.width = image.width;

  setInterval(function(e) {
    ctx.drawImage(video,0,0,canvas.width,canvas.height);
    ctx.drawImage(image,(canvas.width-image.width)/2,(canvas.height-image.height)/2);
  },33);
});

function chromaKey(){
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var imageData = ctx.getImageData(0, 0, 1, 1);
  data = imageData.data;
  var ch_red = data[0];
  var ch_green = data[1];
  var ch_blue = data[2];
  var output = ctx.createImageData(canvas.width, canvas.height);
  data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
  for (var i = 0, l = data.length; i < l; i += 4) {
    output.data[i]=data[i];
    output.data[i+1]=data[i+1];
    output.data[i+2]=data[i+2];
    if(output.data[i]==ch_red && output.data[i+1]==ch_green && output.data[i+2]==ch_blue){
      output.data[i+3]=0;
    }
    else{
      output.data[i+3]=data[i+3];
    }
  }
  //imageData.data = data;
  ctx.putImageData(output,0,0);
}


// canvas上のイメージを保存
function saveCanvas(saveType){
    chromaKey();
    var imageType = "image/png";
    var fileName = "sample.png";
    var canvas = document.getElementById('canvas');
    var base64 = canvas.toDataURL(imageType);
    var blob = Base64toBlob(base64);
    saveBlob(blob, fileName);
}

// Base64データをBlobデータに変換
function Base64toBlob(base64)
{
    var tmp = base64.split(',');
    var data = atob(tmp[1]);
    var mime = tmp[0].split(':')[1].split(';')[0];
    var buf = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
        buf[i] = data.charCodeAt(i);
    }
    // blobデータを作成
    var blob = new Blob([buf], { type: mime });
    return blob;
}

// 画像のダウンロード
function saveBlob(blob, fileName)
{
    var url = (window.URL || window.webkitURL);
    var dataUrl = url.createObjectURL(blob);
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    // a要素を作成
    var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    a.href = dataUrl;
    a.download = fileName;
    a.dispatchEvent(event);
}
