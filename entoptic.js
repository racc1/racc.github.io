//////////////////////////////////////////////////////////
//TO DO: ATTRIBUTIONS; LINKS; LICENSES
//////////////////////////////////////////////////////////

const keepAliveInterval = 2 * 60 * 1000; //rML timeout is 2m

var pw = "";

var gan;
var upscaler;
var inpainting;

let initModelCompleted = false;


// I/O Elements

const reader = new FileReader();
const mask = "data:image/png;base64,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MS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIDIyLjIgKE1hY2ludG9zaCkiIHhtcDpDcmVhdGVEYXRlPSIyMDIxLTA2LTExVDEwOjQ4OjAzKzAxOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTA4LTA0VDEzOjIyOjE2KzAxOjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0wOC0wNFQxMzoyMjoxNiswMTowMCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpmNDBiMjUxNy03N2M1LTQxNjctYTg1MS05NTJhYzgwOTQ5NzUiIHhtcE1NOkRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDpiMzZiOWFjMS1mNjI2LWI4NDktOGIxYi1mODY1M2FkYzA0MWMiIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDo2NTE0NzZjNi0yMGRkLTQ1Y2QtYjJiNi1iMDExOTZhMzQxYTEiIGRjOmZvcm1hdD0iaW1hZ2UvcG5nIiBwaG90b3Nob3A6Q29sb3JNb2RlPSIzIiBwaG90b3Nob3A6SUNDUHJvZmlsZT0iRGlzcGxheSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NjUxNDc2YzYtMjBkZC00NWNkLWIyYjYtYjAxMTk2YTM0MWExIiBzdEV2dDp3aGVuPSIyMDIxLTA2LTExVDEwOjQ4OjAzKzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMiAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NzlhM2MwNjctMDZlYS00ZTM4LWEwYmQtYjg0OWFiODM0NTY1IiBzdEV2dDp3aGVuPSIyMDIxLTA2LTExVDEwOjQ4OjAzKzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMiAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZjQwYjI1MTctNzdjNS00MTY3LWE4NTEtOTUyYWM4MDk0OTc1IiBzdEV2dDp3aGVuPSIyMDIxLTA4LTA0VDEzOjIyOjE2KzAxOjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjIuMiAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz6AQW7iAAAB7ElEQVR42u3WwRGDIBBA0eB4ZKAAi7D/MizCAmA8S+iCbOa9A+fI7td8PgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAn0ixf31KpZR5GuQSY4ze+zzjPsIeegBz+6/rqrXaxSVaa+d5zlMAa2zbdhzHvu92cYmc8xxB7BWK/gl+nscirjIvP/T/n/ABgABAACAAEAAIAAQAAgABgABAACAAEAAIAAGAAEAAIAAQAAgABAACAAGAAEAAIAAQAAgABAACAAGAAEAAIAAQAAgABAACAAGAAEAAIAAQAAgABAACAAGAAEAAIAAQAAgABAACAAGAAEAAIAAQAAgABAACAAGAAEAAIAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAAYAAQAAgABAACAAEAAIAASAAV4AAQAAgABAACAAE8ONSSjlnU1xlXv4cQehH2EP/+vd97/uutdrFJVprcwSx36HRvwCllOgvobjGGL33eboKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGC5L8E8NDZl52k9AAAAAElFTkSuQmCC";

// UI Elements

const fileInput = document.getElementById('file-input');
const holdImg = document.getElementById('hold-img');
const startbutton = document.getElementById('startbutton');
const timeStamp = document.getElementById('timeStamp');
const section = document.getElementById('section');
const output = document.getElementById('output');
const main = document.getElementById('main');

const modeSelector = document.getElementById("check");
const modeSelectorBox = document.getElementById("mode-selector");
var manual;

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`);

//////////////////////////////////////////////////////////
// PASSWORD AND TOKEN DECRYPTION
//////////////////////////////////////////////////////////

const pwOver = document.getElementById('pw-over');
pwOver.addEventListener("submit", e => {
		e.preventDefault();
		var pw = document.getElementById('pwop').value;
		console.log('password entered: ' +  pw);
		Promise.all(
			[ganTokenCrypt, upscalerTokenCrypt, inpaintingTokenCrypt]
			.map(t => decryptWithPassword(t, pw))).then( decrypted => {
			pwOver.style.display = 'none';
			initModels(decrypted[0], decrypted[1], decrypted[2]);
		});
		
	}
, false);

if (pw.length == 0) {
	pwOver.style.display = 'flex';
}

async function decryptWithPassword(cryptext, pw) {
  
  const encryptedMessage = await openpgp.readMessage({
        armoredMessage: cryptext 
    });
  
  const { data: decrypted } = await openpgp.decrypt({
        message: encryptedMessage,
        passwords: [pw], // decrypt with password
        format: 'text' 
    });
    return decrypted;
}

//////////////////////////////////////////////////////////
// INITIALIZE RUNWAY MODELS AND CALL THEM
//////////////////////////////////////////////////////////

async function initModels(ganToken, upscalerToken, inpaintingToken) {

	gan = new rw.HostedModel({
	  url: "https://gan.hosted-models.runwayml.cloud/v1/",
	  token: ganToken
	});

	upscaler = new rw.HostedModel({
	  url: "https://upscaler.hosted-models.runwayml.cloud/v1/",
	  token: upscalerToken
	});

	inpainting = new rw.HostedModel({
	  url: "https://inpainting.hosted-models.runwayml.cloud/v1/",
	  token: inpaintingToken
	});

  Promise.all([gan.info(), upscaler.info(), inpainting.info()]).then((values) => {
    console.log("promises resolved");
    initModelCompleted = true;

    startbutton.classList.remove("progress_bar");
    holdImg.classList.remove("grid-notavailable");
    holdImg.classList.add("grid-automatic");
    fileInput.disabled = false;
    modeSelectorBox.style.visibility = 'visible';

    window.onload = init();
  });

	infoKeepAlive();
}

function infoKeepAlive() {
	gan.info().then(info => console.log(info));
	upscaler.info().then(info => console.log(info));
	inpainting.info().then(info => console.log(info));
	
	setTimeout(infoKeepAlive, keepAliveInterval);
}

//////////////////////////////////////////////////////////
// SETUP UI ELEMENTS
//////////////////////////////////////////////////////////

modeSelector.addEventListener('click', function(event) {
    manual = modeSelector.checked;
    console.log("manual mode is " + manual);
    if(manual) {
      holdImg.classList.add("grid-manual");
      holdImg.classList.remove("grid-automatic");
      output.src = "./assets/blank.svg";
    } else {
      holdImg.classList.add("grid-automatic");
      holdImg.classList.remove("grid-manual");
      output.src = "./assets/blank.svg";
    }
});

if(!initModelCompleted) {
  console.log("waiting");
  startbutton.classList.add("progress_bar");
  holdImg.classList.add("grid-notavailable");
  modeSelectorBox.style.visibility = 'hidden';
  fileInput.disabled = true;
} 

// handle viewport sizing
window.addEventListener("orientationchange", function() {
  
  //reset zoom level

  convertStyle();

  //reset flex-direction dependent on orientation
  if(window.orientation == 90 || window.orientation == -90) {
      main.setAttribute( "style", "flex-direction: row;");
      if(initModelCompleted) {
        modeSelectorBox.setAttribute( "style", "flex-direction: column;");
      }
  } else if (window.orientation == 0) {
      main.setAttribute( "style", "flex-direction: column;");
      if(initModelCompleted) {
        modeSelectorBox.setAttribute( "style", "flex-direction: row;");
      }
  }
}, false);

const convertStyle = () => {
    const viewportmeta = document.querySelector('meta[name=viewport]');
    viewportmeta.setAttribute('content', "initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0");
    
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
};

window.addEventListener("resize", convertStyle);
window.addEventListener("DOMContentLoaded", convertStyle);

// TOO DO RUNNING ORIENTATION CHECK ADD HORIZONTAL CLASS TO BODY

//////////////////////////////////////////////////////////
// INTERACTION MANAGEMENT
//////////////////////////////////////////////////////////

function init() {

  var file; 

  startbutton.style.setProperty("background-color", "#FF5733");

  fileInput.addEventListener('change', (e) => handleFiles(
    e.target.files
  ));

  function handleFiles(f) {
    file = f[0];

    reader.addEventListener("load", function () {

      prepareInputs(reader.result);
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }
}

function prepareInputs(i) {
  var inputImg = new Image();
  inputImg.onload = function() {
    var procImg = imageToDataUri(inputImg, 256, 256);
    triggerRunway(procImg);
  }
  inputImg.src = i.toString();
} 

function imageToDataUri(img, width, height) {
    // create an off-screen canvas
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    // set its dimension to target size
    canvas.width = width;
    canvas.height = height;

    // draw source image into the off-screen canvas:
    ctx.drawImage(img, 0, 0, width, height);

    // encode image to data-uri with base64 version of compressed image
    return canvas.toDataURL();
}

/////////////////////////////////////////////////////
//RUNWAY CALLS
/////////////////////////////////////////////////////


async function triggerRunway(inputImage) {

  console.log("runway triggered");

  startbutton.classList.add("progress_bar");
  holdImg.classList.add("grid-wait");
    /////////////////////////////////////////////////////
    //check modeSelector status
    /////////////////////////////////////////////////////

  if(manual) {
    /////////////////////////////////////////////////////
    //we are in manual mode, i.e. autocomplete/inpainting
    /////////////////////////////////////////////////////
    console.log("autocompleting");

    const inputs = {
      "image": inputImage.toString(),
      "mask": mask
    };

    if(typeof(inpainting) != 'undefined' && inputs) {
     await inpainting.query(inputs).then(outputs => {
        const { inpainted_image } = outputs;
        upscaleImg(inpainted_image);
      }).catch(console.error);
    }

  } else {
    //////////////////////////////////////////////////////////
    //we are in automatic mode, i.e. autocorrect/GAN + upscale
    //////////////////////////////////////////////////////////
    console.log("autocorrecting");

    const inputs = {
      "input_image": inputImage.toString()
    };

    if(typeof(gan) != 'undefined' && inputs) {
     await gan.query(inputs).then(outputs => {
        console.log("loaded");
        const { output_image } = outputs;
        upscaleImg(output_image);
      }).catch(console.error);
    }

  }
}

async function upscaleImg(runwayImage) {
  ////////////////////////////////////////////////////////////
  //we are upscaling 256x256 x4
  ////////////////////////////////////////////////////////////
  console.log("upscaling");

  var upScale = 512;
  var finalImg = new Image();

  finalImg.onload = function(){
      // create an off-screen canvas
    var canvas = document.createElement('canvas'),
        ctx = canvas.getContext('2d');

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    canvas.width = upScale;
    canvas.height = upScale;

    ctx.drawImage(finalImg, 0, 0, upScale, upScale);
    ctx.filter = "blur(5px)";
    sharpen(ctx, upScale, upScale, 1);

    output.src = canvas.toDataURL();
    
    startbutton.classList.remove("progress_bar");
    holdImg.classList.remove("grid-wait");

    if(!manual) {
      holdImg.classList.add("grid-automatic");
    } else {
      holdImg.classList.add("grid-manual");
    }
  }
  
  finalImg.src = runwayImage;
}

//image-processing experiment

function sharpen(ctx, w, h, mix) {
    var x, sx, sy, r, g, b, a, dstOff, srcOff, wt, cx, cy, scy, scx,
        weights = [0, -1, 0, -1, 5, -1, 0, -1, 0],
        katet = Math.round(Math.sqrt(weights.length)),
        half = (katet * 0.5) | 0,
        dstData = ctx.createImageData(w, h),
        dstBuff = dstData.data,
        srcBuff = ctx.getImageData(0, 0, w, h).data,
        y = h;

    while (y--) {
        x = w;
        while (x--) {
            sy = y;
            sx = x;
            dstOff = (y * w + x) * 4;
            r = 0;
            g = 0;
            b = 0;
            a = 0;

            for (cy = 0; cy < katet; cy++) {
                for (cx = 0; cx < katet; cx++) {
                    scy = sy + cy - half;
                    scx = sx + cx - half;

                    if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
                        srcOff = (scy * w + scx) * 4;
                        wt = weights[cy * katet + cx];

                        r += srcBuff[srcOff] * wt;
                        g += srcBuff[srcOff + 1] * wt;
                        b += srcBuff[srcOff + 2] * wt;
                        a += srcBuff[srcOff + 3] * wt;
                    }
                }
            }

            dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix);
            dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix);
            dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix);
            dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
        }
    }

    ctx.putImageData(dstData, 0, 0);
}