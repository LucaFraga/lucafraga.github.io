/*	
 * Tris.js by Corigliano Luca
 * This code defines the game logic. Uses peer.js
 * For license details please see index.html or the project page <lucafraga.github.com/trisjs>.
*/

// These DOM elements are selected once and used through the game to animate it.
var overlay_dom = $("#overlay");
var overlay_dom_message = $("#overlay_message");
var cross_turn_dom = $("#cross_turn");
var circle_turn_dom = $("#circle_turn");
var circle_owner_dom = $("#circle_owner");
var cross_owner_dom = $("#cross_owner");
var circle_score_dom = $("#circle_score");
var cross_score_dom = $("#cross_score"); 


var hosting = false;									// This determines whether or not the client is hosting the game or joining it
var connection;											// This is the connection estabilished and used during the game (peer.js)
var symbols = {
	Empty : {value: 0, css_class: "empty", win_html : "Oh, it's a tie!"},
	Cross : {value: 1, css_class: "cross", win_html : "<span class='red_text'>X</span> won!"},
	Circle : {value: 2, css_class: "circle", win_html : "<span class='blue_text'>O</span> won!"},
}
symbols.byval = function(val) {
	switch(val) {
		case 0: return symbols.Empty;
		case 1: return symbols.Cross;
		case 2: return symbols.Circle;
	}
}
var fields = [];

var last_game_start_symbol = symbols.Empty;
var current_turn = symbols.Empty;
var own_symbol = symbols.Empty;
var cross_score = 0;
var circle_score = 0;

increase_score = function(symbol) {
	if(symbol.value == symbols.Circle.value) {
		circle_score_dom.text(++circle_score);
	} else if(symbol.value == symbols.Cross.value ) {
		cross_score_dom.text(++cross_score);		
	}		
}
set_owner = function(symbol) {
	cross_owner_dom.removeClass("symbol_owner_you symbol_owner_opp");
	circle_owner_dom.removeClass("symbol_owner_you symbol_owner_opp");
	own_symbol = symbol;
	if(symbol.value == symbols.Circle.value) {
		cross_owner_dom.addClass("symbol_owner_opp");
		circle_owner_dom.addClass("symbol_owner_you");
	} else {
		cross_owner_dom.addClass("symbol_owner_you");
		circle_owner_dom.addClass("symbol_owner_opp");		
	}	
}
set_turn = function(turn) {
	current_turn = turn;
	cross_turn_dom.removeClass("current_turn");
	circle_turn_dom.removeClass("current_turn");		
	if(turn.value == symbols.Circle.value) {
		circle_turn_dom.addClass("current_turn");
	} else if(turn.value == symbols.Cross.value) {
		cross_turn_dom.addClass("current_turn");		
	}
}
update_fields = function(send) {
	if(send) send_update_packet();
	for( i = 0; i < fields.length; i++) {
		$("#cell"+i).children().attr('style', '');
		$("#cell"+i).children().attr('class', fields[i].css_class);
	}
	var win = detect_win();
	if(win) {
		increase_score(win);
		set_turn(symbols.Empty);
		overlay_dom.show();
		overlay_dom_message.html(win.win_html);
		if(hosting)$("#restart").show();
	}
	tr_update_circle();
}

send_update_packet = function() {
	connection.send({"fields": fields, "turn": current_turn.value});
}
receive_update_packet = function(packet) {
	overlay_dom.hide();
	fields = packet.fields;
	set_turn(symbols.byval(packet.turn));
	update_fields(false);
	
}

detect_win = function() {
	// Tie
	var tie = true;
	for ( i = 0; i < fields.length; i++) {
		if (fields[i].value == symbols.Empty.value) {
			tie = false;
			break;
		}
	}
	if(tie) return symbols.Empty;
	// Win
	var p = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
	for( i = 0; i < p.length; i++) {
		
		var p0 = fields[p[i][0]]; 
		if(p0.value == symbols.Empty.value || p0 == 0) continue;
		var p1 = fields[p[i][1]];
		var p2 = fields[p[i][2]];
		if(p0.value == p1.value && p0.value == p2.value) {
			return p0;
		}
	}
	return false;
}



$(".game_cell").on("click touchend", function(e) {
	if(current_turn == own_symbol ) {
		var index = $(this).index() + ($(this).parent().index()*3);
		if($("#cell"+index).children().hasClass(symbols.Empty.css_class)) {
			set_turn((current_turn.value == symbols.Circle.value) ? symbols.Cross : symbols.Circle);
			fields[index] = own_symbol;
			update_fields(true);
		}
	}
});

var peer = new Peer({key: '89deh2affada38fr'});
overlay_dom_message.text("Connecting...");

peer.on("open", function(id) {
	var opp_peer_id = window.location.search.replace("?", "");
	
	if(opp_peer_id.length < 1 ||  !opp_peer_id.match(/^[0-9a-z]+$/)) { // Invalid peer_id
		hosting = true;
		overlay_dom_message.html("Give this link to your friend:<br/>lucafraga.github.io/tris?"+id)
		peer.on("connection", function(conn){
			if(connection != null) return;
			connection = conn;
			connection.on("open", start_connection);
		});		

	} else {
		connection = peer.connect(opp_peer_id);
		connection.on("open", start_connection);
	}
});

peer.on("disconnected error", function(e) {
	overlay_dom.show();
	overlay_dom_message.text("Connection lost :(");
});

var start_connection = function() {
	// Receive data
	connection.on('data', function(data) {
		receive_update_packet(data);
	});
	
	overlay_dom.hide();
	set_owner(hosting ? symbols.Cross : symbols.Circle);
	
	if(hosting) {
		start_game();
	} 
	
}
$("#restart").on("click touchend", function(e) {
	if (hosting) start_game();
});
var start_game = function() {
	$("#restart").hide();
	overlay_dom.hide();
	fields = [
		symbols.Empty, symbols.Empty, symbols.Empty,
		symbols.Empty, symbols.Empty, symbols.Empty,
		symbols.Empty, symbols.Empty, symbols.Empty
	];
	if(last_game_start_symbol.value == symbols.Empty.value || last_game_start_symbol.value == symbols.Circle.value) {
		set_turn(symbols.Cross);
		last_game_start_symbol = symbols.Cross;
	} else if(last_game_start_symbol.value == symbols.Cross.value) {
		set_turn(symbols.Circle);
		last_game_start_symbol = symbols.Circle;		
	}
	update_fields(true);
	
}




