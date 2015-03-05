/**
	Trippy Snake - A 3D snake with silly lights.
	
	PLEASE don't use this as a reference for good code, I was just
	playing with three.js for the first time and came up with this.
	This code is awful, dirty and will eat your face if you ever 
	attempt to learn too much from this.
	Homwever, I release this code as ABSOLUTELY FREE and with no
	particular license, so do what the hell you want and credit me
	only if you feel like it. Goodbye :3
	
	@author Corigliano Luca <luca.corigliano@outlook.com>
*/
console.log("TrippySnake.events.js Loaded");

// Keyboard input
OnKeyDown = function(event) {
	var oldDirection = currentDirection;
	if(!canChangeDirection) return;
	
		switch(event.keyCode){
			case 37: // Left
			case 65:
				if(currentDirection == direction.Right) return;
				currentDirection = direction.Left;
				break;
			case 38: // Up
			case 87:
				if(currentDirection == direction.Down) return;
				currentDirection = direction.Up;
				break;
			case 39: // Right
			case 68:
				if(currentDirection == direction.Left) return;
				currentDirection = direction.Right;
				break;
			case 40: // Down
			case 83:
				if(currentDirection == direction.Up) return;
				currentDirection = direction.Down;
				break;
			case 70:
				OnFullscreenToggle();
				return;
			case 80:
				OnPauseToggle();
				return;
			case 76:
				OnLightsToggle();
				return;
			case 77:
				OnAudioToggle();
				return;
			case 82:
				OnResetGame();
				return;
	}
	if(!isPaused && !isGameOver && oldDirection != currentDirection){
		SnakeMovement(true);
	}
}
  
OnTouchStart = function(event) {
	if(!canChangeDirection) return;
	
	var touchX = event.touches[0].clientX;                                    
	
	if(touchX > document.documentElement.clientWidth/2) // Touched right side
	{
		console.log("right");
		switch(currentDirection)
		{
			case direction.Right:
				currentDirection = direction.Down;
				break;
			case direction.Down:
				currentDirection = direction.Left;
				break;
			case direction.Left:
				currentDirection = direction.Up;
				break;
			case direction.Up:
				currentDirection = direction.Right;
				break;
				
		}
	} else {
		console.log("left");
		switch(currentDirection)
		{
			case direction.Right:
				currentDirection = direction.Up;
				break;
			case direction.Down:
				currentDirection = direction.Right;
				break;
			case direction.Left:
				currentDirection = direction.Down;
				break;
			case direction.Up:
				currentDirection = direction.Left;
				break;
				
		}
	}
	canChangeDirection = false;
}	

OnResize = function() {
	UpdateRendererSize();
}

OnFullscreenToggle = function(event) {
	var state = document.fullScreen || document.mozFullScreen || document.webkitIsFullScreen;
    if(state)
		LeaveFullscreen();
	else
		GoToFullscreen(gameContainer);
	isPaused = true;
	UpdateScoreCounter();
}
OnAudioToggle = function(event){
	if(baseLoop.paused) baseLoop.play();
	else baseLoop.pause();
}
OnLightsToggle = function(event){
	if(isAmbientLight)
	{
		scene.remove(mobileAmbientLight);
	} else {
		scene.add(mobileAmbientLight);
	}
	isAmbientLight = !isAmbientLight;
}
OnPauseToggle = function(event){
	isPaused = !isPaused;
	UpdateScoreCounter();
}
OnResetGame = function(event){
	RestartGame();
}