/*	
 * Tris.js by Corigliano Luca
 * This code makes this game "responsive" with jQuery and dirty workarounds
 * but that's the way web developement works, since no real standards are set.
 * For license details please see index.html or the project page <lucafraga.github.com/trisjs>.
*/
	
// Configuration
var GAME_TABLE_RATIO = 0.8;						// How big should the game field be in proportion to the page
var GAME_CELL_RATIO = 1/3;				// How big should a game cell be in proportion to the game field
var GAME_CELL_BORDER_RATIO = 0.06;				// How big should the game cell borders be in proportion to their size
var CIRCLE_THICKNESS = 0.09;						// How thick should the circle be in proportion to its parent
var CIRCLE_RATIO = 0.55;							// How big should the circle be in proportion to its parent
var SCORE_PANEL_RATIO = 0.1;						// How big should the turn panels be in proportion to the page
var SCORE_PANEL_FONT_RATIO = 0.8;				// How big should the turn panels font size be in proportion to the parent
var SCORE_PANEL_SYMBOL_OWNER_FONT_RATIO = 0.2;	// How big should the turn panels "YOU" and "OPP" be in proportion to the parent
var SCORE_PANEL_CURRENT_TURN_FONT_RATIO = 0.6;	// How big should the turn panels "^" character be in proportion to the parent
var SCORE_PANEL_MARGIN_RATIO = 0.1;				// How far from the sides should the turn panels be in proportion to their size

// Dom element get selected one time only to get better performance.
var game_table = $('#game_table');				// The game field
var game_cell = $('.game_cell');				// Each game cell
var circle_panel = $('#circle_panel');			// Circle score panel
var cross_panel = $('#cross_panel');			// Cross score panel
var symbol_owner = $('.symbol_owner');			// Score panels' symbol owner (YOU / OPP)
var turn = $('.turn');							// Score panels' turn indicator (^)
var empty = $('.empty');
var overlay_container = $('#overlay_container');

function tr_update_circle() {
	var circle = $('.circle');
	// Setup the circle size and thickness
	circle.css("border-width", circle.parent().width() * CIRCLE_THICKNESS);	
	circle.css("width", circle.parent().width() * CIRCLE_RATIO);	
	circle.css("height", circle.parent().width() * CIRCLE_RATIO);	
}

$("#overlay_title").fitText().fitText(1, { minFontSize: '2pt', maxFontSize: '80pt', useParent: true });;
$("#overlay_link").fitText().fitText(2, { minFontSize: '2pt', maxFontSize: '50pt', useParent: true });;
overlay_container.fitText().fitText(2, { minFontSize: '2pt', maxFontSize: '60pt' });;

$(window).on("resize orientationchange" ,function() {
	var width = window.innerWidth;
	var height = window.innerHeight;
	// This is how much space the game field will occupy
	var woh = width < height ;
	var guide = (woh ? width : height) * GAME_TABLE_RATIO;
	// Set the game field size
	game_table.height(guide);
	game_table.width(guide);
	game_table.css("top", height * 0.5 - (guide/2));	// Basic center calculation
	game_table.css("left", width * 0.5 - (guide/2));	// ''
	// Set the cells size and border width according to the specified ratio
	var cell_guide = guide * GAME_CELL_RATIO;
	game_cell.css("border-width", cell_guide * GAME_CELL_BORDER_RATIO);
	game_cell.css("width", cell_guide);
	game_cell.css("height", cell_guide);
	
	


	
	
	var turn_guide = (woh ? height : width ) * SCORE_PANEL_RATIO;
	var turn_font_size = turn_guide * SCORE_PANEL_FONT_RATIO;
	var turn_margin = turn_guide * SCORE_PANEL_MARGIN_RATIO;
	
	// Clear old position values 
	circle_panel.css('top', '').css('left', '').css('right', '').css('bottom', '');
	circle_panel.css("width", turn_guide);
	circle_panel.css("height", turn_guide);
	circle_panel.css("font-size", turn_font_size);
	cross_panel.css("width", turn_guide);
	cross_panel.css("height", turn_guide);
	cross_panel.css("font-size", turn_font_size);
	symbol_owner.css("font-size", turn_guide * SCORE_PANEL_SYMBOL_OWNER_FONT_RATIO);
	turn.css("font-size", turn_guide * SCORE_PANEL_CURRENT_TURN_FONT_RATIO);

	
	if(woh) { // Height
		var half_point = width * 0.5 - (turn_guide/2);
		cross_panel.css("top", turn_margin);
		cross_panel.css("left", half_point);
		circle_panel.css("bottom", turn_margin);
		circle_panel.css("left", half_point);

	} else {  // Width
		var half_point = height * 0.5 - (turn_guide/2);
		cross_panel.css("top", half_point);
		cross_panel.css("left", turn_margin);
		circle_panel.css("top", half_point);
		circle_panel.css("right", turn_margin);				
	}
	
	
	overlay_container.css("top", height * 0.5 - (overlay_container.height()/2));
	
	tr_update_circle();
	
});
$(window).trigger('resize');
