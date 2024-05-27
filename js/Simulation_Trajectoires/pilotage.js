
var Pilotage = (function(container, parameters)
{
	parameters = parameters || {};
	var title = (typeof parameters.title === "undefined" ? "joystick" : parameters.title),
		width = (typeof parameters.width === "undefined" ? 0 : parameters.width),
		height = (typeof parameters.height === "undefined" ? 0 : parameters.height),
		internalFillColor = (typeof parameters.internalFillColor === "undefined" ? "#d73280" : parameters.internalFillColor),
		internalLineWidth = (typeof parameters.internalLineWidth === "undefined" ? 2 : parameters.internalLineWidth),
		internalStrokeColor = (typeof parameters.internalStrokeColor === "undefined" ? "#003300" : parameters.internalStrokeColor),
		externalLineWidth = (typeof parameters.externalLineWidth === "undefined" ? 2 : parameters.externalLineWidth),
		externalStrokeColor = (typeof parameters.externalStrokeColor ===  "undefined" ? "#d73280" : parameters.externalStrokeColor),
		autoReturnToCenter = (typeof parameters.autoReturnToCenter === "undefined" ? true : parameters.autoReturnToCenter);
	
	// Create canvasjoystick element and add it in the Container object
	var objContainer = document.getElementById(container);
	var canvasjoystick = document.createElement("canvas");

	canvasjoystick.id = title;
	if(width === 0) { width = objContainer.clientWidth; }
	if(height === 0) { height = objContainer.clientHeight; }
	canvasjoystick.width = width+50;
	canvasjoystick.height = height+50;
    canvasjoystick.style.position = "fixed";//On fixe la position pour que le joystick "sticks" a la page comme les manettes
    
	objContainer.appendChild(canvasjoystick);
	var contextjoystick=canvasjoystick.getContext("2d");
	var pressed = 0; // Bool - 1=Yes - 0=No
	var phiValue = 0;
    var circumference = 2 * Math.PI;
    var Radius = 20;
	var centerX = canvasjoystick.width / 2;
	var centerY = canvasjoystick.height / 2;
	// Used to save current position of stick

	canvasjoystick.addEventListener("mousedown",onMouseDown,false);
	canvasjoystick.addEventListener("mouseup",onMouseUp,false);
	
	// Draw the object
	drawTopButton();
	drawBottomButton();
	/******************************************************
	 * Private methods
	 *****************************************************/
	/**
	 * @desc Draw the external circle used as reference position
	 */
	
	function drawTopButton()
	{
		contextjoystick.beginPath();
		contextjoystick.fillStyle = "FireBrick";
		contextjoystick.arc(centerX,centerY-40,Radius,0,circumference);
		contextjoystick.lineWidth = internalLineWidth;
		contextjoystick.strokeStyle = internalStrokeColor;
		contextjoystick.stroke();
        contextjoystick.font = "bold 15px serif";
		contextjoystick.fillText("Vφ+",centerX-12,centerY-35);
	}
	function drawBottomButton()
	{
		contextjoystick.beginPath();
		contextjoystick.fillStyle = "FireBrick";
		contextjoystick.arc(centerX,centerY+15,Radius,0,circumference);
		contextjoystick.lineWidth = internalLineWidth;
		contextjoystick.strokeStyle = internalStrokeColor;
		contextjoystick.stroke();
        contextjoystick.font = "bold 15px serif";
		contextjoystick.fillText("Vφ-",centerX-10,centerY+20);
	}
	
	/**
	 * @desc Normalizzed value of Phi 
	 * @return Integer from -100 to +100
	 */
	this.GetPhi = function ()
	{
		return (phiValue).toFixed();
	};

	function isInsideTopButton(positionX,positionY)
	{
		return ((positionX<centerX+Radius)&&(positionX>centerX-Radius)&&(positionY<centerY-40+Radius)&&(positionY>centerY-40-Radius));
	}

	function isInsideBottomButton(positionX,positionY)
	{
		return ((positionX<centerX+Radius)&&(positionX>centerX-Radius)&&(positionY<centerY+15+Radius)&&(positionY>centerY+15-Radius));
	}

	
	function onMouseDown(event)
	{
		pressed = 1;
		posX = event.clientX;
		posX -= canvasjoystick.offsetLeft;
		posY = event.clientY;
		posY -= canvasjoystick.offsetTop;
		if(isInsideTopButton(posX,posY))
		{
			contextjoystick.beginPath();
			contextjoystick.fillStyle = "FireBrick";
			contextjoystick.arc(centerX,centerY-40,Radius,0,circumference);
			contextjoystick.lineWidth = internalLineWidth;
			contextjoystick.strokeStyle = internalStrokeColor;
			contextjoystick.fill();
			contextjoystick.fillStyle = "Black";
        	contextjoystick.font = "bold 15px serif";
			contextjoystick.fillText("Vφ+",centerX-12,centerY-35);
			drawBottomButton();
			incrPhiValue();
			console.log("pressed*:",pressed);
		}
		else if(isInsideBottomButton(posX,posY))			
		{
			contextjoystick.beginPath();
			contextjoystick.fillStyle = "FireBrick";
			contextjoystick.arc(centerX,centerY+15,Radius,0,circumference);
			contextjoystick.lineWidth = internalLineWidth;
			contextjoystick.strokeStyle = internalStrokeColor;
			contextjoystick.fill();
			contextjoystick.fillStyle = "Black";
        	contextjoystick.font = "bold 15px serif";
			contextjoystick.fillText("Vφ-",centerX-10,centerY+20);
			drawTopButton();
			decrPhiValue();
		}
		else 
		{
			console.log("dehors");
			//clique à l'extérieur des deux boutons
		}

	}

	function onMouseUp(event)
	{
		pressed = 0;
		phiValue = 0;
		contextjoystick.clearRect(0,0,canvas.width,canvas.height);
		drawTopButton();
	    drawBottomButton();
		console.log("j suis ds mousseup");

	}

	async function incrPhiValue()
	{
		press = pressed;
		for(var i = 0; (i < 500) && (press === 1); i++)
		{
			phiValue++;
			await sleepNow(1000);
			press = getPressed();
			
		}
		
	}

	async function decrPhiValue()
	{
		press = pressed;
		for(var i = 0; (i < 500) && (press === 1); i++)
		{
			phiValue--;
			await sleepNow(1000);
			press = getPressed();
		
		}

	}

	function sleep(millieseconds)
	{
		var start = new Date().getTime();
		for(var i = 0;i<1e7;i++)
		{
			let end = new Date();
			//if((new Date().getTime()-start)>millieseconds)
			//{
			//	break;
			//}
		}
	}
	
	const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve,delay))
	function getPressed()
	{
		return(pressed);
	}


	
});
