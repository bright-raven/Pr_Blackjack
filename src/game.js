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
	//Dealer should always be players[0], unless the player has beaten the house
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

    //error is meant to indicate that something has gone wrong in the game logic and the game has ended before a win condition
    error: false,

    //this signals that the dealer/game is ready for a button press from the user. Otherwise it ignores the buttons
    ready_for_input: false,

    //this signals that player1 has stood and allows game logic to continue
    stand_flag: false,

    //this signals that player1 has hit
    hit_flag: false,
    
    play_hand: function(){

	//defines the per-round logic
	//NB THIS IS CURRENTLY SINGLE PLAYER HARDCODED (IN PLACES)

	//GUARD THE PLAY FUNCTION WITH A CHECK FOR THE DEALER
	if (!this.players[0].is_dealer || this.players.length<2){ //dealer has been removed, or function has otherwise been improperly invoked
	    //most likely, a win condition has simply been forgotten in the play logic
	    this.game_over=true;
	    this.error=true;
	    console.log("IMPROPER PLAYER STRUCTURE FOR PLAY");
	    return;

	//players_remaining holds players who are still active in the hand
	let players_remaining=this.players;
	    
	if (this.shuffle_flag) {
	    //return all cards to shoe
	    for (const crd of this.shoe.cards.values()) {
		crd.returnToShoe();
	    }
	    this.shoe.shuffle();
	    this.shoe.cut();
	    this.shuffle_flag=false;
	}
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
		//should flip the card over
		this.players[0].hand[1].flip();
		//dealer natural. check players. if player has, return bet, otherwise forfeit all bets and deal
		if (this.players[1].check_score()==21){
		    //its a draw
		    for (const p of this.players) {
			p.tie();
			players_remaining.splice(p.position, 1);
		    }
		    return;
		} else {
		    //HARDCODED
		    this.players[0].win(this.players[1].lose());
		    players_remaining.splice(p.position, 1);
		    }	
		    if (players[1].lost){
			//remove the player from the game
			this.players.splice(this.players[1].position, 1); //remove player from players[]
			this.game_over=true;
			return;
		    }
		    return;
		}
  	    }
	} else { //continue with play if no dealer natural

	    //TODO: INSERT CODE FOR SPLITTING PAIRS, DOUBLING DOWN ON 9,10,11, INSURANCE
	    
	    //this means the dealer does not have a natural, check the players
	    if (players[1].check_score()==21) { //player 1 has a natural and dealer does not
		this.players[0].lose(this.players[1].win('natural'));
		if (this.players[0].lost) {this.players.shift(); this.game_over=true; return;}
		players_remaining.splice(this.players[1].position,1);
	    }
	}

	if (players_remaining.length<=1) {
	    //only dealer remains or no one remains
	    if (players_remaining[0].lost) {this.game_over=true;}
	    return;
	} else { //game enters normal condition with players facing dealer
	    this.ready_for_input=true;
	    while (!this.stand_flag){
		//do stuff to handle hits
		if (this.hit_flag) {
		    this.shoe.deal(this.players[1]);
		    this.hit_flag=false;;
		    if (this.players[1].check_score()>21){
			//bust the player
			this.ready_for_input=false;
			this.players[0].win(this.players[1].lose());
			players_remaining.splice(this.players[1].position,1);
			//this condition should NOT BE HERE for multiplayer
			if (this.players[1].lost) {this.players.pop(); this.game_over=true; return;}
		    } else {
			//the player has not yet busted
		    }
		}
	    }
	    //the player has successfully stood, and we are now running the dealer algorithm
	    //there would be another while loop here with the same condition if there were a player2
	    this.ready_for_input=false;
	    var stood_score=this.players[1].check_score();
	    while (this.players[0].check_score()<17) { //dealer hits if under 17  //IMPLEMENTATION DETAIL: Dealer does not hit on soft 17.
		this.shoe.deal(this.players[0]);
		if (this.players[0].check_score()>21) { //dealer busts, finish payouts for everyone
		    //HARDCODED
		    this.players[0].lose(this.players[1].win('dealer_bust'));
		    players_remaining.splice(this.players[1].position,1);
		    if (this.players[0].lost) {this.players.shift(); this.game_over=true; return;}
		} else { //dealer has successfully hit. check if beaten player1 only
		    let dealer_score=this.players[0].check_score();
		    if (dealer_score>=stood_score) { //dealer has outdrawn or tied player
			if (dealer_score>stood_score) { //player1 loses
			    this.players[0].win(this.players[1].lose());
			    players_remaining.splice(p.position, 1);
			    //HARDCODED
			    if (this.players[1].lost) {this.players.pop(); this.game_over=true; return;}
			} else { //tie
			    for (const p of players_remaining) {p.tie();}
			    return;
			}
		    }
		}
	    }
	    //if we've reached this point, the dealer has drawn upto/past 17 and the player has won
	    //player1 win
	    this.players[0].lose(this.players[1].win('score'));
	    players_remaining.splice(this.players[1].position,1);
	    if (this.players[0].lost) {this.players.shift(); this.game_over=true; return;}
	    return;
	} 

	//global win check
	if (this.players.length==1){
	    //a win condition has been reached
	    this.game_over=true;
	}

	//play now resumes from top if game has not ended

    },

    //TODO for the following two functions, we would like to add an indicator so that it is apparent
    //whose turn it is
    //TODO
    //we also need to make sure that ready_for_input is properly gating this game logic so proper game flow isnt interrupted.

    hit: function(){
	if (this.ready_for_input){
	    this.hit_flag=true;//deal to current player
	}
    },

    stand: function(){
	if (this.ready_for_input){
	    this.stand_flag=true; //have current player stand and move on
	}
    }	    
    
}

module.exports = Game
