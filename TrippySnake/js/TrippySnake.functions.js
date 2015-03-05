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
console.log("TrippySnake.functions.js Loaded");

// Random providers
function GetRandomFloat(min, max) {
  return Math.random() * (max - min) + min;
}	
function GetRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}		
function GetRandomFruitColor() {
	return fruitColors[GetRandomInt(0, fruitColors.length)];
}
function FloatLerp(start, end, factor) {
	return start + factor * (end - start);
}

// Cube creation and movement
function CreateCube(x, y, material) {
	var cube = new THREE.Mesh( cubeGeometry, material );
	cube.castShadow = true;
	cube.receiveShadow = true;
	
	MoveCube(cube, x, y);
	ground.add( cube );
	return cube;
}		
function CreateSphere(x, y, material) {
	var cube = new THREE.Mesh( sphereGeometry, material );
	cube.castShadow = true;
	cube.receiveShadow = true;
	
	MoveCube(cube, x, y);
	ground.add( cube );
	return cube;
}	
function MoveCube(cube, x, y)
{

	// Set position
	cube.position.set(x - halfFieldWidth + SNAKE_CUBE_SIZE, y - halfFieldHeight+ SNAKE_CUBE_SIZE, SNAKE_CUBE_SIZE/2);	
	cube.game_x = x;
	cube.game_y = y;
}

// Spotlight creation and movement
function CreateSpotlights()
{
	for(i = 0; i < SPOTLIGHT_COUNT; i++)
	{
		var spotLight = new THREE.SpotLight( GetRandomFruitColor(), GetRandomFloat(SPOTLIGHT_INTENSITY_MIN, SPOTLIGHT_INTENSITY_MAX)); // TODO Randomize stuff
		spotLight.position.set(-halfFieldWidth+10 ,halfFieldHeight, SPOTLIGHT_HEIGHT);
		spotLight.target.position.set( 0, 0, 0 );
		spotLight.shadowCameraNear	= 0.01;		
		spotLight.castShadow		= true;
		spotLight.receiveShadow		= false;
		spotLight.shadowDarkness	= SHADOW_DARKNESS;
		spotLight.shadowMapWidth 	= SHADOWMAP_SIZE;
		spotLight.shadowMapHeight 	= SHADOWMAP_SIZE;
		spotLight.shadowCameraVisible	= false;
		spotLight.game_currentAngle = cornerVectors[GetRandomInt(0, cornerVectors.length)];
		spotLight.game_targetIntensity = GetRandomFloat(SPOTLIGHT_INTENSITY_MIN, SPOTLIGHT_INTENSITY_MAX);
		ground.add(spotLight);
		ground.add(spotLight.target);
		spotLights[i] = spotLight;
	}
}
function AnimateSpotlights()
{
	for(i = 0; i < SPOTLIGHT_COUNT; i++)
	{
		var spotLight = spotLights[i];
		var nextCorner = spotLight.game_currentAngle;
		var nextLightIntensity = spotLight.game_targetIntensity;
		
		if(spotLight.intensity - nextLightIntensity <= SPOTLIGHT_INTENSITY_CHANGE_THRESHOLD)
		{
			nextLightIntensity = GetRandomFloat(SPOTLIGHT_INTENSITY_MIN, SPOTLIGHT_INTENSITY_MAX);
			spotLight.game_targetIntensity = nextLightIntensity;
		}
		if(HasPerk() && currentPerk == perks.Blind) 
			spotLight.intensity = PERK_BLINDNESS_INTENSITY; 
		else {
			if(spotLight.position.distanceTo(nextCorner) <= SPOTLIGHT_CORNER_SNAP_THRESHOLD) {
				nextCorner = cornerVectors[GetRandomInt(0, cornerVectors.length)];
				spotLight.game_currentAngle = nextCorner;
			}
			spotLight.position = spotLight.position.lerp( nextCorner, GetRandomFloat(SPOTLIGHT_MOV_MIN,SPOTLIGHT_MOV_MAX));
			spotLight.intensity = FloatLerp(spotLight.intensity, nextLightIntensity, SPOTLIGHT_INTENSITY_CHANGE_SPEED);
		}
	}				
}

// Game logic
function CreateFruit()
{
	if(fruits.length > 0)
		return;
	var FruitCount = GetRandomInt(FRUIT_IN_STAGE_MIN, FRUIT_IN_STAGE_MAX+1);
	for(i = 0; i < FruitCount; i++) {
		var candidateX, candidateY;
		var attempts = 0;
		
		// Try random spawn points, useful when the game is just started
		while(++attempts < RANDOM_FRUIT_SPAWN_ATTEMPTS) {
			candidateX = GetRandomInt(0, FIELD_WIDTH);
			candidateY = GetRandomInt(0, FIELD_HEIGHT);
			if(CollidesWithCubeGroup(candidateX, candidateY, snakeMembers) == -1 && CollidesWithCubeGroup(candidateX, candidateY, fruits) == -1)
				break;
		}
		// When the snake gets bigger and bigger, it's better to brute force
		// if the random attempt fails
		if(attempts >= RANDOM_FRUIT_SPAWN_ATTEMPTS)
		{
			for(candidateY = 0; candidateY < FIELD_HEIGHT; candidateY++)
			{
				for(candidateX = 0; candidateX < FIELD_WIDTH; candidateX++)
				{
					if(CollidesWithCubeGroup(candidateX, candidateY, snakeMembers) == -1 && CollidesWithCubeGroup(candidateX, candidateY, fruits) == -1)
						break;
					if(candidateX == FIELD_HEIGHT -1 && candidateY == FIELD_WIDTH -1) // Game successful
					{
						isGameOver = true;
						alert("Wow, you beat the game. *slowly claps*");	
						return;
					}
				}
			}
		}
		var color = GetRandomFruitColor();
		var isPowerup = GetRandomInt(0, FRUIT_POWERUP_PROB) == 1; 
		var material = new THREE.MeshPhongMaterial(  { ambient: GLOBAL_AMBIENT_COLOR, color: color, specular: GLOBAL_SPECULAR_COLOR, shininess: CUBE_SHININESS, shading: THREE.NoShading } );
		var cube = CreateCube(candidateX, candidateY, material);
		if(isPowerup) {
			cube.rotation.x = 0.9;
			cube.rotation.z = 0.9;
		}
		cube.game_isPowerup = isPowerup;
		cube.add(new THREE.PointLight(color, FRUIT_LIGHT_INTENSITY, FRUIT_LIGHT_RADIUS));
		fruits.push(cube);		
	}
}

function HasPerk() {
	return currentPerkDuration > 0;
}

function CollidesWithCubeGroup(x, y, group)
{
	for(i = 0; i < group.length; i++)
	{
		var member = group[i];
		if(member.game_x == x && member.game_y == y)
			return i;
	}
	return -1;
}
var skipNextMovement = false;
function SnakeMovement(force)
{
	var force = force === true;
	
	if(force) {
		skipNextMovement = true;
	} else {
		if(skipNextMovement) {
			skipNextMovement = false;
			return;
		}
	}
	// Game Logic
	
	// 1 . Determine the snake head target position
	var nextX = snakeMembers[0].game_x; 
	var nextY = snakeMembers[0].game_y; 
	switch(currentDirection) {
		case direction.Up:
			nextY++;
			break;
		case direction.Down:
			nextY--;
			break;
		case direction.Right:
			nextX++;
			break;
		case direction.Left:
			nextX--;
			break;
	}
	
	// 2 . Check what is in that spot
	// a . Check for a fruit
	if(nextX >= FIELD_WIDTH) nextX = 0;
	if(nextX < 0) nextX = FIELD_WIDTH;
	if(nextY >= FIELD_HEIGHT) nextY = 0;
	if(nextY < 0) nextY = FIELD_HEIGHT;
	var fruitCollide = CollidesWithCubeGroup(nextX, nextY, fruits);
	if(fruitCollide > -1) {
		if(HasPerk() && currentPerk == perks.Forth) nextScore *= 4;
		score+=nextScore;
		nextScore = SCORE_PER_FRUIT;
		currentMoveFrame = MOVE_FRAME - Math.floor(score/400);
		if(currentMoveFrame < MOVE_FRAME_MIN) currentMoveFrame = MOVE_FRAME_MIN;
		var fruit = fruits[fruitCollide];
		if(fruit.game_isPowerup && !HasPerk())
		{
			currentPerk = GetRandomInt(0, perkIcons.length);
			currentPerkDuration = POWERUP_DURATION;
			UpdatePerkDisplay(true);
		}
		ground.remove(fruit);
		fruits.splice(fruitCollide, 1);
		var lastMember = snakeMembers[snakeMembers.length-1];
		snakeMembers.push(CreateCube(lastMember.game_x, lastMember.game_y, snakeMaterial));
	
		CreateFruit();
		
		
	}
	// b . Check for a body part (also we will move the body to follow the snake)
	for(j = snakeMembers.length-1; j >= 1; j--)
	{
		var currentMember = snakeMembers[j];
		var followMember = snakeMembers[j-1];
		MoveCube(currentMember, followMember.game_x, followMember.game_y);
		if(followMember.game_x == nextX && followMember.game_y == nextY)
		{
			isGameOver = true;
		}
	}
	

	
	MoveCube(snakeMembers[0], nextX, nextY);
}

function UpdateRendererSize() {
	
	// Obtain full window info
	var windowWidth = gameContainer.offsetWidth ;
	upscaleFactor = Math.round(windowWidth/256);
	var windowHeight = Math.round(windowWidth * RENDERER_RATIO); 
	// Find closest resolution possible
	while(windowHeight > gameContainer.offsetHeight ) 
	{
		windowWidth --;
		windowHeight = Math.round(windowWidth * RENDERER_RATIO); 
	}
	
	windowWidth /= upscaleFactor;
	windowHeight /= upscaleFactor;	
	
	renderer.setSize( windowWidth, windowHeight );
	
	if(!isUpscaleWorkaround) {
		renderer.domElement.style.width = windowWidth*upscaleFactor;
		renderer.domElement.style.height = windowHeight*upscaleFactor;		
	} else {
		upscaledRenderer.width  = windowWidth*upscaleFactor;
		upscaledRenderer.height  = windowHeight*upscaleFactor;
		upscaledRendererCtx.webkitImageSmoothingEnabled = false;
		upscaledRendererCtx.mozImageSmoothingEnabled = false;
		upscaledRendererCtx.imageSmoothingEnabled = false;	
		upscaledRendererCtx.msImageSmoothingEnabled = false;	
	}
	renderer.clear();
}
// Find the right method, call on correct element
function GoToFullscreen(element) {
	if(element.requestFullscreen) {
		element.requestFullscreen();
	} else if(element.mozRequestFullScreen) {
		element.mozRequestFullScreen();
	} else if(element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();
	} else if(element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}
}
function LeaveFullscreen() {
	if(document.exitFullscreen) document.exitFullscreen();
	if(document.webkitExitFullscreen) document.webkitExitFullscreen();
	if(document.msExitFullscreen) document.msExitFullscreen();
	if(document.mozCancelFullScreen) document.mozCancelFullScreen();
}

function UpdateScoreCounter()
{
	var scoreText = "Score: " + score + " - " + nextScore ;
	if(isGameOver) scoreText += "<br />Game Over. R to Reset. <br /><br />- Credits - <br />Music by Kevin MacLeod <a href=\"http://incompetech.com/wordpress/\">Incompetech</a> - 8bit dungeon boss <br /><a href=\"http://threejs.org/\">Three.js</a> by mrdoob <br/>Game by <a href=\"https://www.facebook.com/drpuntofraga\">Corigliano Luca</a> - Copyleft 2015";
	if(isPaused) scoreText += "<br /> Paused. P to resume.";
	scoreContainer.innerHTML = scoreText;
}
function UpdatePerkDisplay(complete)
{
	if(currentPerkDuration-- == 0){ perkContainer.style.display = "none"; return; }
	perkLeft.innerHTML = currentPerkDuration;
	if(complete){
		perkContainer.style.display = "block";
		perkIcon.src = perkIcons[currentPerk];
	}
}
function RestartGame()
{
	isGameOver = false;
	for(i = 0; i < fruits.length; i++)
	{
		ground.remove(fruits[i]);
	}
	for(i = 0; i < snakeMembers.length; i++)
	{
		ground.remove(snakeMembers[i]);
	}
	currentPerk = -1;
	currentPerkDuration = 0;
	UpdatePerkDisplay(true);
	snakeMembers = [];
	fruits = [];
	score = 0;
	nextScore = SCORE_PER_FRUIT;
	currentMoveFrame = MOVE_FRAME;
	currentDirection = direction.Right;

	// Starting snake
	snakeMembers[0] = CreateCube(SNAKE_INITIAL_X, SNAKE_INITIAL_Y, snakeMaterial);
	snakeMembers[0].add(new THREE.PointLight(SNAKE_HEAD_LIGHT_COLOR, SNAKE_HEAD_LIGHT_INTENSITY, SNAKE_HEAD_LIGHT_RADIUS));
	for(i = 1; i < SNAKE_INITIAL_MEMBERS; i++)
	{
		snakeMembers[i] = CreateCube(SNAKE_INITIAL_X-i, SNAKE_INITIAL_Y, snakeMaterial);		
	}
	
	CreateFruit();
}

function GetChromeVersion() {
    var result = /Chrome\/([\d.]+)/.exec(navigator.userAgent);
    if (result) {
        return parseFloat(result[1]);
    }
    return 999;
}
function IsInternetExplorer() {
	return navigator.userAgent.indexOf("MSIE") > 0 || navigator.userAgent.indexOf("Trident") > 0; 
}

