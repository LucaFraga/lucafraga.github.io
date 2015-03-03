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
console.log("TrippySnake.config.js Loaded");
// TODO Load some stuff from the url
var FIELD_WIDTH = 32;							// Game field width in game units
var FIELD_HEIGHT = 18;							// Game field height in game units
var FIELD_ADDITIONAL_MARGIN = 5;
var MOVE_FRAME = 10;								// How many frames should the game wait between logic cycles
var MOVE_FRAME_MIN = 4;								// How many frames should the game wait between logic cycles
var DOWNSCALE_ENABLED = true;
var RENDERER_RATIO = 9/16;
var RENDERER_RATIO_2 = 16/9;
var SHADOWMAP_SIZE = 256;
var SHADOW_DARKNESS = 0.6;
var SHADOWMAP_TYPE = THREE.PCFSoftShadowMap;
// Spotlights
var SPOTLIGHT_COUNT = 3;						// How many spotlights will be in the scene
var SPOTLIGHT_MOV_MIN = 0.02;					// How fast should the spotlights move at least
var SPOTLIGHT_MOV_MAX = 0.05;					// How fast should the spotlights move at maximum
var SPOTLIGHT_CORNER_SNAP_THRESHOLD = 1;		// How near to a corner should a spotlight be to switch to another
var SPOTLIGHT_HEIGHT = 3;
var SPOTLIGHT_INTENSITY_MIN = 0.5;
var SPOTLIGHT_INTENSITY_MAX = 2.7;
var SPOTLIGHT_INTENSITY_CHANGE_THRESHOLD = 0.2;
var SPOTLIGHT_INTENSITY_CHANGE_SPEED = 0.005;
var AMBIENT_LIGHT_ACTIVE = false;
// Colors
var MOBILE_AMBIENT_LIGHT_COLOR = 0x555555;
var GLOBAL_AMBIENT_COLOR = 0x555555;				// Cube ambient color (fruit and snake)
var GLOBAL_SPECULAR_COLOR = 0xFFFFFF;
var SNAKE_COLOR = 0xFF0000;						// Cube color (fruit and snake)
var GROUND_COLOR = 0x555555;
var CUBE_SPECULAR = 0xFFFFFF;					// Cube specular color (fruit and snake)
var CUBE_SHININESS = 50;
var GROUND_SHININESS = 50;
var SNAKE_HEAD_LIGHT_COLOR = 0xFF0000;
var SNAKE_HEAD_LIGHT_INTENSITY = 1.5;
var SNAKE_HEAD_LIGHT_RADIUS = 3;
var FRUIT_LIGHT_INTENSITY = 1;
var FRUIT_LIGHT_RADIUS = 1;
// Logic
var RANDOM_FRUIT_SPAWN_ATTEMPTS = 10;
var SCORE_PER_FRUIT = 100;
var SCORE_PER_FRUIT_MIN = 20;
var SCORE_REMOVE_PER_LOGIC_FRAME = 1;
var FRUIT_IN_STAGE_MIN = 1;
var FRUIT_IN_STAGE_MAX = 5;
var FRUIT_POWERUP_PROB = 10;
var POWERUP_DURATION = 50;
// Snake
var SNAKE_INITIAL_MEMBERS = 5;					// How much long should the snake be when the game starts
var SNAKE_INITIAL_X = 7;						// Where the game should place the snake when the game starts
var SNAKE_INITIAL_Y = 8;						// ''
var SNAKE_CUBE_SIZE = 0.6;						// How big should the initial snake be
var PERK_BLINDNESS_INTENSITY = 0.2;


