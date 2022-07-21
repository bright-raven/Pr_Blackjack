//game.js
//
//provides the main game logic and marshals the other game entities

const root_dir = 'http://localhost:8080/';


var Game = {

    /* the shoe object holds undealt cards and keeps track of shuffle state.
     all requests for cards to be dealt are directed at the shoe*/
    shoe: require(root_dir+'/src/Shoe.js'),

    //players are only removed from this list when their wallet goes to zero
    //when this list reaches len==1 by pops or shifts
    players: [],

    add_players: function(number) {
	
	let Players = require(root_dir+'/src/player.js');
	//add Dealer
	this.players.push(new Players.Dealer());
	//hardcoded to single player
	this.players.push(new Players.Player());
    }

    //DEPRECATED: table will be set to the browser window script when Game is loaded in index.html
    //this is set immediately to refer to the global object
    table: globalThis,
    
    // indicates that it is time to shuffle the shoe before the next hand when the marker card is reached during a round
    shuffle_flag: false,

    //indicates that the game has been won by someone
    game_over: false,

	//this signals that the dealer/game is ready for a button press from the user. Otherwise it ignores the buttons
    ready_for_input: false,
	
    
    play_hand: function(){

	//defines the per-round logic
	//NB THIS IS CURRENTLY SINGLE PLAYER HARDCODED (IN PLACES)

	//players_remaining holds players who are still active in the hand
	let players_remaining=this.players
	    
	if (this.shuffle_flag) {this.shoe.shuffle(); this.shoe.cut();}
	//deal 1 card face up, CCW to players and dealer
	this.shoe.deal(this.players[1]);
	this.shoe.deal(this.players[0]);
	//deal 1 card face up to players CCW, face down to dealer
	this.shoe.deal(this.players[1]);
	//this deal to the dealer should trigger the facedown condition
	this.shoe.deal(this.players[0]);
	//if dealer shows 10 J Q K A, peek dealer for natural, if not show, remain blind
	if ([10,'J','Q','K','A'].includes(this.players[0].hand[0].value)){
	    if (this.players[0].check_score()==21) {
		//dealer natural check players. if player has, return bet, otherwise forfeit all bets and deal
		if (this.players[1].check_score()==21){
		    //its a draw
		    for (const p of this.players) {
			p.tie();
			players_remaining.splice(p.position, 1);
		    }
		    return;
		} else {
		    this.players[0].win(this.players[1].lose());
		    for (const p of this.players) {
			players_remaining.splice(p.position, 1);
		    }	
		    if (players[1].lost){
			//remove the player from the game
			this.players.splice(players[1].position, 1); //remove player from players[]
			this.game_over=true;
			return;
		    }
		    return;
		}
	    }
	} else { //continue with play if no dealer natural
	    
	    //this means the dealer does not have a natural, check the players
	    if (players[1].check_score()==21) { //player 1 has a natural and dealer does not
		players[0].lose(players[1].win('natural'));
	    }

	    
	    
	}
	    
	//if not dealer natural, check players. if player natural, win 1.5 x bet and remove from lineup.
	//continue with other players
	//
	//
	//TODO: INSERT CODE FOR SPLITTING PAIRS, DOUBLING DOWN ON 9,10,11, INSURANCE
	//
	//
	//first player hits or stays
	//
	//if stay, next player, if hit, hit and loop. if bust, next player and remove from round, and forfeit bet
	//
	//once all players have played, dealer turns up 2nd card. if 17+, dealer stands, if 16- dealer hits until 17+.
	//if dealer holds Ace, and counts 17+ with the 11, count as 11 and stand.
	//
	//remaining win/loss conditions applied:
	//if player has busted, bet has been forfeit and they have been removed
	//
	//if dealer busts, dealer pays any standing player their bet.
	//
	//if dealer stands, any player with a lower score loses, higher score is paid wager, same score is a draw.
	//
	//when bets are settled, cards are collected face-up into discard.
	//
	//when marker has been reached in shoe, shuffle_flag has been set, and the shoe will be instructed
	//to gather the cards, shuffle them, and perform a simulated cut at pos 65-75 from the bottom.
	//
	//play_hand is now repeated from the top.
	//
	//remove any players who have been flagged to remove

	//global win check
	if (this.players.length==1){
	    //the win condition has been reached
	    this.game_over=true;
	}
	

    },

    //TODO for the following two functions, we would like to add an indicator so that it is apparent
    //whose turn it is
    //TODO
    //we also need to make sure that ready_for_input is properly gating this game logic so proper game flow isnt interrupted.

    hit: function(){
	if (this.ready_for_input){
	    //deal to current player
	}
    },

    stand: function(){
	if (this.ready_for_input){
	    //have current player stand and move on
	}
    }	    
    
}

module.exports = Game
