const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

var mirrorTimer = document.getElementById('mir_t');
var grayTimer = document.getElementById('gray_t');


var image = new Image();
image.onload = start; //apelarea functiei cu etapele procesarii
let btn = document.getElementById('btnClick');

btn.onclick = function() {
    mirrorTimer.innerHTML = "";
    grayTimer.innerHTML = "";
    fetch("https://dog.ceo/api/breeds/image/random")
        .then(res => res.json())
        .then(result => {
            //console.log(result)
            image.src = result.message  //extragerea linkului din raspuns si atribuirea sa imaginii
            //console.log(image.src)
        })
        .catch(err=>console.log(err))
    
    image.crossOrigin = 'anonymous';
}


function oneSecondWait() {	//functie pentru utilizarea lui setTimeout
	return new Promise(resolve => {
		setTimeout(() => {
			resolve('resolved');
		}, 1000);	//delay 1s
	});
}

function mirrorImg() {
    var start = Date.now();
    let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    let i,j;
    var aux;
    var index;
    //console.log(imageData.data.length);
    console.log(canvas.width + " " + canvas.height);
    console.log();

    for(i = 0; i < canvas.height; i++){
        for(j = 0; j < canvas.width/2; j++){
            index = (i*canvas.width+ j)*4;

            aux = imageData.data[index];
            imageData.data[index] = imageData.data[((canvas.width*(i+1)-1)*4-j*4)];
            imageData.data[((canvas.width*(i+1)-1)*4-j*4)] = aux;

            aux = imageData.data[index+1];
            imageData.data[index+1] = imageData.data[((canvas.width*(i+1)-1)*4-j*4)+1];
            imageData.data[((canvas.width*(i+1)-1)*4-j*4)+1] = aux;

            aux = imageData.data[index+2];
            imageData.data[index+2] = imageData.data[((canvas.width*(i+1)-1)*4-j*4)+2];
            imageData.data[((canvas.width*(i+1)-1)*4-j*4)+2] = aux;

            aux = imageData.data[index+3];
            imageData.data[index+3] = imageData.data[((canvas.width*(i+1)-1)*4-j*4)+3];
            imageData.data[((canvas.width*(i+1)-1)*4-j*4)+3] = aux;
        }
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update the canvas with the new data
    ctx.putImageData(imageData, 0, 0);
    var stop = Date.now();
    var num = stop-start;
    mirrorTimer.innerHTML = "Mirror time: " + num + " ms";
}

function greyscaleImg(){
    var start = Date.now();
    
    const scannedImage = ctx.getImageData(0,0,canvas.width,canvas.height)
    const scannedData = scannedImage.data;  //scaneaza imaginea
    //console.log(image.src)

    for(let i =0; i < scannedData.length; i+=4){ //parcurge pixelii din 4 in 4 (r,g,b,a)
        const total = scannedData[i] + scannedData[i+1] + scannedData[i+2]; //suma
        const avaregeColoValue = total/3;   //media
        
        scannedData[i] = avaregeColoValue;
        scannedData[i+1] = avaregeColoValue;  //suprascrierea
        scannedData[i+2] = avaregeColoValue;
    }

    scannedImage.data = scannedData;
    ctx.putImageData(scannedImage, 0, 0); //afisarea in canvas

    var stop = Date.now();
    var num = stop-start;
    grayTimer.innerHTML= "Grayscale time: " + num + " ms";
}

async function start() {
    image.onload = "";
    canvas.width = image.width; 
    canvas.height = image.height; //marimea canvasului
    console.log(image.width + " " + image.height)
	
	await oneSecondWait();	//wait de o secunda

	ctx.drawImage(image, 0, 0, canvas.width, canvas.height);  //afisare imagine originala
    image.src = canvas.toDataURL();

	await oneSecondWait();		//wait de o secunda

	mirrorImg();

	await oneSecondWait();

    greyscaleImg()
    image.onload = start;
}

