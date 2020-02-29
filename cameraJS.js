
function startVideo() {
    console.info('入出力デバイスを確認してビデオを開始するよ！');

    Promise.resolve()
        .then(function () {
            return navigator.mediaDevices.enumerateDevices();
        })
        .then(function (mediaDeviceInfoList) {
            console.log('使える入出力デバイスs->', mediaDeviceInfoList);

            var videoDevices = mediaDeviceInfoList.filter(function (deviceInfo) {
                return deviceInfo.kind == 'videoinput';
            });
            if (videoDevices.length < 1) {
                throw new Error('ビデオの入力デバイスがない、、、、、。');
            }

            return navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    deviceId: videoDevices[0].deviceId
                }
            });
        })
        .then(function (mediaStream) {
            console.log('取得したMediaStream->', mediaStream);
            videoStreamInUse = mediaStream;
            //document.querySelector('video').src = window.URL.createObjectURL(mediaStream);
            // 対応していればこっちの方が良い
             document.querySelector('video').srcObject = mediaStream;


        })
        .catch(function (error) {
            console.error('ビデオの設定に失敗、、、、', error);
        });
}


//ビデオ停止！ボタンで走るやつ

function stopVideo() {
    console.info('ビデオを止めるよ！');

    videoStreamInUse.getVideoTracks()[0].stop();

    if (videoStreamInUse.active) {
        console.error('停止できかた、、、', videoStreamInUse);
    } else {
        console.log('停止できたよ！', videoStreamInUse);
    }
}

function snapshot() {
    console.info('10秒後スナップショットをとるよ！');

	sleepAndExecuteFunc(10, snapshotExecute);
}

var firstFlg = true;

var g_videoElement = document.querySelector('video');
var g_canvasElement1 = document.getElementById("canvas1");
var g_canvasElement2 = document.getElementById("canvas2");
var g_canvasElement3 = document.getElementById("canvas3");

var g_Width = g_videoElement.width;
var g_Height = g_videoElement.height;


function UnderDiff1(ImageData1, ImageData2){
	var context3 = g_canvasElement3.getContext('2d');
	var out_img = context3.getImageData(0,0, g_videoElement.width, g_videoElement.height);
    
    var pixels1 = ImageData1.data;
    var pixels2 = ImageData2.data;
    var outPixels = out_img.data;
    
    
    var firstY = g_Height * 0.5;
	
	var menseki = (g_Height - firstY) * g_Width;
	var Changed_Count = 0;
	
	// ピクセル単位で操作できる
	var base = 0;
	
	for(var y = 0; y < g_Height; ++y){
		for(var x =0; x<g_Width; ++x){
			base = (y * g_Width + x) * 4;
		    outPixels[base + 0] = 0;  // Red
		    outPixels[base + 1] = 0;  // Green
		    outPixels[base + 2] = 0;  // Blue
		    outPixels[base + 3] = 255;  // Alpha
		}
	}
	
	for (var y = firstY; y < g_Height; ++y) {
	  for (var x = 0; x < g_Width; ++x) {
	    base = (y * g_Width + x) * 4;
	    // なんかピクセルに書き込む
	    outPixels[base + 0] = Math.abs(pixels1[base + 0] - pixels2[base + 0]);  // Red
	    outPixels[base + 1] = Math.abs(pixels1[base + 1] - pixels2[base + 1]);  // Green
	    outPixels[base + 2] = Math.abs(pixels1[base + 2] - pixels2[base + 2]);  // Blue
	    outPixels[base + 3] = 255;  // Alpha
	    
	    if(outPixels[base + 0] >= 10 &&
	       outPixels[base + 1] >= 10 &&
	       outPixels[base + 2] >= 10 ){
	         Changed_Count++;
	    }else{
		    outPixels[base + 0] = 0;  // Red
		    outPixels[base + 1] = 0;  // Green
		    outPixels[base + 2] = 0;  // Blue
		    outPixels[base + 3] = 255;  // Alpha
	    }
	    
	  }
	}
	
	var retVal = new Object();
	retVal.changeRate = (Changed_Count / menseki) * 100.0;
	retVal.outImageData = out_img;
	
	return retVal;

}

function LeftUpperDiff(ImageData1, ImageData2){
	var context3 = g_canvasElement3.getContext('2d');	
	var out_img = context3.getImageData(0,0, g_videoElement.width, g_videoElement.height);
    
    var pixels1 = ImageData1.data;
    var pixels2 = ImageData2.data;
    var outPixels = out_img.data;
    
    
    var endY = g_Height * 0.5;
	var endX = g_Width * 0.5;
	
	var menseki = endY * endX;
	var Changed_Count = 0;
	
	// ピクセル単位で操作できる
	var base = 0;
	
	for(var y = 0; y < g_Height; ++y){
		for(var x =0; x<g_Width; ++x){
			base = (y * g_Width + x) * 4;
		    outPixels[base + 0] = 0;  // Red
		    outPixels[base + 1] = 0;  // Green
		    outPixels[base + 2] = 0;  // Blue
		    outPixels[base + 3] = 255;  // Alpha
		}
	}
	
	for (var y = 0; y < endY; ++y) {
	  for (var x = 0; x < endX; ++x) {
	    base = (y * g_Width + x) * 4;
	    // なんかピクセルに書き込む
	    outPixels[base + 0] = Math.abs(pixels1[base + 0] - pixels2[base + 0]);  // Red
	    outPixels[base + 1] = Math.abs(pixels1[base + 1] - pixels2[base + 1]);  // Green
	    outPixels[base + 2] = Math.abs(pixels1[base + 2] - pixels2[base + 2]);  // Blue
	    outPixels[base + 3] = 255;  // Alpha
	    
	    if(outPixels[base + 0] >= 10 &&
	       outPixels[base + 1] >= 10 &&
	       outPixels[base + 2] >= 10 ){
	         Changed_Count++;
	    }else{
		    outPixels[base + 0] = 0;  // Red
		    outPixels[base + 1] = 0;  // Green
		    outPixels[base + 2] = 0;  // Blue
		    outPixels[base + 3] = 255;  // Alpha
	    }
	    
	  }
	}
	
	var retVal = new Object();
	retVal.changeRate = (Changed_Count / menseki) * 100.0;
	retVal.outImageData = out_img;
	
	return retVal;


}

function RightUpperDiff(ImageData1, ImageData2){
	var context3 = g_canvasElement3.getContext('2d');
	var out_img = context3.getImageData(0,0, g_videoElement.width, g_videoElement.height);
    
    var pixels1 = ImageData1.data;
    var pixels2 = ImageData2.data;
    var outPixels = out_img.data;
    
    
    var endY = g_Height * 0.5;
	var startX = g_Width * 0.5;
	
	var menseki = endY * (g_Width - startX);
	var Changed_Count = 0;
	
	// ピクセル単位で操作できる
	var base = 0;
	
	for(var y = 0; y < g_Height; ++y){
		for(var x = 0; x<g_Width; ++x){
			base = (y * g_Width + x) * 4;
		    outPixels[base + 0] = 0;  // Red
		    outPixels[base + 1] = 0;  // Green
		    outPixels[base + 2] = 0;  // Blue
		    outPixels[base + 3] = 255;  // Alpha
		}
	}
	
	for (var y = 0; y < endY; ++y) {
	  for (var x = startX; x < g_Width; ++x) {
	    base = (y * g_Width + x) * 4;
	    // なんかピクセルに書き込む
	    outPixels[base + 0] = Math.abs(pixels1[base + 0] - pixels2[base + 0]);  // Red
	    outPixels[base + 1] = Math.abs(pixels1[base + 1] - pixels2[base + 1]);  // Green
	    outPixels[base + 2] = Math.abs(pixels1[base + 2] - pixels2[base + 2]);  // Blue
	    outPixels[base + 3] = 255;  // Alpha
	    
	    if(outPixels[base + 0] >= 10 &&
	       outPixels[base + 1] >= 10 &&
	       outPixels[base + 2] >= 10 ){
	         Changed_Count++;
	    }else{
		    outPixels[base + 0] = 0;  // Red
		    outPixels[base + 1] = 0;  // Green
		    outPixels[base + 2] = 0;  // Blue
		    outPixels[base + 3] = 255;  // Alpha
	    }
	    
	  }
	}
	
	var retVal = new Object();
	retVal.changeRate = (Changed_Count / menseki) * 100.0;
	retVal.outImageData = out_img;
	
	return retVal;
}

var g_Count = 0;

const ZENSIN = 1;
const LEFT_ROTATE = 2;
const RIGHT_ROTATE = 3;
const NO_OPE = 4;

function Test1(){
    //var videoElement = document.querySelector('video');
    //var canvasElement = document.getElementById("canvas2");
    var context1 = g_canvasElement1.getContext('2d');
    var context2 = g_canvasElement2.getContext('2d');
	var context3 = g_canvasElement3.getContext('2d');


	var img1 = context1.getImageData(0,0, g_videoElement.width, g_videoElement.height);
	var img2 = context2.getImageData(0,0, g_videoElement.width, g_videoElement.height);
    
    if(firstFlg == false){
    	//context2.drawImage(g_videoElement, 0, 0, g_videoElement.width, g_videoElement.height);
    	
    	outObj1 = UnderDiff1(img1, img2);
    	outObj2 = LeftUpperDiff(img1, img2);
    	outObj3 = RightUpperDiff(img1, img2);
		// 変更した内容をキャンバスに書き戻す
		context3.putImageData(outObj1.outImageData, 0, 0);
		
		var ope = JudgeZensinOrRotateLeftOrRotateRight(outObj2.changeRate, outObj3.changeRate, outObj1.changeRate);
		var ope_span = document.getElementById("Operation");
		if(ope == ZENSIN){
			ope_span.innerHTML = "前進";
		}else if(ope == LEFT_ROTATE){
			ope_span.innerHTML = "左回り";
		}else if(ope == RIGHT_ROTATE){
			ope_span.innerHTML = "右回り";
		}else if(ope == NO_OPE){
			ope_span.innerHTML = "操作なし";
		}
		
		var changeRate1 = document.getElementById("changeRate1");
		changeRate1.innerHTML = outObj1.changeRate;

		var changeRate2 = document.getElementById("changeRate2");
		changeRate2.innerHTML = outObj2.changeRate;
		
		var changeRate3 = document.getElementById("changeRate3");
		changeRate3.innerHTML = outObj3.changeRate;
				
		g_Count++;
		if(g_Count >= 200){
	    	context1.drawImage(g_videoElement, 0, 0, g_videoElement.width, g_videoElement.height);
	    	context2.drawImage(g_videoElement, 0, 0, g_videoElement.width, g_videoElement.height);
			g_Count = 0;
		}
		
		if((g_Count % 10) == 0){//1.0秒ごとに画面更新
			if( (g_Count % 20) == 0){
				context2.drawImage(g_videoElement, 0, 0, g_videoElement.width, g_videoElement.height);
			}else{
				context1.drawImage(g_videoElement, 0, 0, g_videoElement.width, g_videoElement.height);
			}
		}
		
		
		
    	//context1.drawImage(g_videoElement, 0, 0, g_videoElement.width, g_videoElement.height);
    	//0.1秒ごとに呼び出し
    	sleepAndExecuteFunc2(1, Test1);
    	

    }else{
    	firstFlg = false;
    	
    	context1.drawImage(g_videoElement, 0, 0, g_videoElement.width, g_videoElement.height);
    	context2.drawImage(g_videoElement, 0, 0, g_videoElement.width, g_videoElement.height);

    }
    
    
}



const ZENSIN_KIJUN = 10;
const ZENSIN_KIJUN_MAX = 50;
const ROTATE_KIJUN = 15;
function JudgeZensinOrRotateLeftOrRotateRight(UpperLeftChangeRate, UpperRightChangeRate, UnderChangeRate){

	if(UnderChangeRate >= ZENSIN_KIJUN && UnderChangeRate <= ZENSIN_KIJUN_MAX){
		return ZENSIN;
	}else if(UpperLeftChangeRate >= ROTATE_KIJUN && UpperRightChangeRate <= ROTATE_KIJUN){
		return LEFT_ROTATE;
	}else if(UpperLeftChangeRate <= ROTATE_KIJUN && UpperRightChangeRate >= ROTATE_KIJUN){
		return RIGHT_ROTATE;
	}else{
		return NO_OPE;
	}
}


function callback1(){
    var context1 = g_canvasElement1.getContext('2d');
    context1.drawImage(g_videoElement, 0, 0, g_videoElement.width, g_videoElement.height);
}

function callback2(){
    var context2 = g_canvasElement2.getContext('2d');
    context2.drawImage(g_videoElement, 0, 0, g_videoElement.width, g_videoElement.height);
}

function snapshotExecute(){
    var videoElement = document.querySelector('video');
    var canvasElement = document.getElementById("canvas1");
    var context = canvasElement.getContext('2d');

    context.drawImage(videoElement, 0, 0, videoElement.width, videoElement.height);
    //document.querySelector('img').src = canvasElement.toDataURL('image/png');
    //document.getElementById("img1").src = canvasElement.toDataURL('image/png');
}

function sleepAndExecuteFunc(waitSec, callbackFunc) {
 
  var spanedSec = 0;
 
  var waitFunc = function () {
 
      spanedSec++;
 
      if (spanedSec >= waitSec) {
          if (callbackFunc) callbackFunc();
          return;
      }
 
      clearTimeout(id);
      id = setTimeout(waitFunc, 1000);
  
  };
 
  var id = setTimeout(waitFunc, 1000);
 
}

function sleepAndExecuteFunc2(waitSec, callbackFunc) {
 
  var spanedSec = 0;
 
  var waitFunc = function () {
 
      spanedSec++;
 
      if (spanedSec >= waitSec) {
          if (callbackFunc) callbackFunc();
          return;
      }
 
      clearTimeout(id);
      id = setTimeout(waitFunc, 100);
  
  };
 
  var id = setTimeout(waitFunc, 100);
 
}
 