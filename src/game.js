//game.js
//
//provides the main game logic and marshals the other game entities

var Game = {

    root_dir: 'http://localhost:8080/',

    /* the shoe object holds undealt cards and keeps track of shuffle state.
     all requests for cards to be dealt are directed at the shoe*/
    shoe: new Shoe(),

    //players are only removed from this list when their wallet goes to zero
    //when this list reaches len==1 by pops or shifts
    player: new Player(),
    dealer: new Dealer(),

    //DEPRECATED: table will be set to the browser window script when Game is loaded in index.html
    //this is set immediately to refer to the global object
    table: globalThis,
    
    // indicates that it is time to shuffle the shoe before the next hand when the marker card is reached during a round
    shuffle_flag: true,

    //indicates that the game has been won by someone
    game_over: false,

    //this signals that the dealer/game is ready for a button press from the user. Otherwise it ignores the buttons
    ready_for_input: false,

    //this signals that player1 has stood and allows game logic to continue
    stand_flag: false,

    //this signals that player1 has hit
    hit_flag: false,
    
    play_hand: function(){

	//defines the per-round logic
	//NB THIS IS CURRENTLY SINGLE PLAYER HARDCODED (IN PLACES)

	//global win check
	if (this.player==null || this.dealer==null){
	    //a win condition has been reached
	    this.game_over=true;
	    console.log('win condition reached');
	    return;
	}
  
	if (this.shuffle_flag) {
	    //return all cards to shoe
	    console.log('shuffling');
	    for (const crd of Object.values(this.shoe.cards)) {
		crd.returnToShoe();
	    }
	    this.shoe.shuffle();
	    this.shuffle_flag=false;
	}
	console.log('beginning deal');
	
	//EMPTY BOTH PLAYER HANDS SINCE WE SEEM TO BE LEAKING CARDS EVERY ROUND
	this.player.current_high_score=0;
	this.dealer.current_high_score=0;
	//this.player.hand=[];
	//this.dealer.hand=[];
	
	//deal 1 card face up, CCW to players and dealer
	this.shoe.deal(this.player);
	this.shoe.deal(this.dealer);
	//deal 1 card face up to players CCW, face down to dealer
	this.shoe.deal(this.player);
	//this deal to the dealer should trigger the facedown condition
	this.shoe.deal(this.dealer);
	//if dealer shows 10 J Q K A, peek dealer for natural, if not show, remain blind
	console.log('done with deal');
	if ([10,'J','Q','K','A'].includes(cards[this.dealer.hand[0]].value)){
	    if (this.dealer.check_score()==21) {
		//should flip the card over
		cards[this.dealer.hand[1]].flip();
		//dealer natural. check players. if player has, return bet, otherwise forfeit all bets and deal
		if (this.player.check_score()==21){
		    //its a draw
		    
		    player.tie();
		    dealer.tie();		    
		    console.log('both had naturals');
		    return;
		} else {
		    //HARDCODED
		    this.dealer.win(this.player.lose());	
		    if (this.player.lost){
			//remove the player from the game
			this.player=null;
			this.game_over=true;
			console.log('dealer natural, player lost');
			return;
		    }
		    console.log('dealer natural, win');
		    return;
		}
	    } else{
		//dealer showed 10/11 card but didn't have natural
		console.log('dealer showed but no natural');
	    }
  	} else {
	    //continue with play if no dealer natural
	    console.log('no dealer natural');
	    //TODO: INSERT CODE FOR SPLITTING PAIRS, DOUBLING DOWN ON 9,10,11, INSURANCE
	    
	    //this means the dealer does not have a natural, check the players
	    if (this.player.check_score()==21 && this.player.hand.length==2) { //player 1 has a natural and dealer does not
		this.dealer.lose(this.player.win('natural'));
		if (this.dealer.lost) {this.dealer=null; this.game_over=true; console.log('player beat house with a natural'); return;}
		console.log('player wins hand with natural');
		return;
	    }
	    if (this.player==null) {
		//only dealer remains
		this.game_over=true;
		console.log('all players busted');
		return;
	    } else { //game enters normal condition with players facing dealer
		this.ready_for_input=true;
		while (!this.stand_flag && this.ready_for_input){
		    //do stuff to handle hits
		    if (this.hit_flag) {
			console.log('player hits');
			this.shoe.deal(this.player);
			this.hit_flag=false;
			if (this.player.check_score()>21){
			    //bust the player
			    this.ready_for_input=false;
			    this.hit_flag=false;
			    this.dealer.win(this.player.lose());
			    //this condition should NOT BE HERE for multiplayer
			    if (this.player.lost) {this.player=null; this.game_over=true; console.log('player lost'); return;}
			    console.log('player busted');
			    return;
			} else {
			    //the player has hit and not busted
			    this.hit_flag=false;
			}
		    }
		}
		this.ready_for_input=false;
		this.stand_flag=false;
		this.hit_flag=false;
	    }
	    //the player has successfully stood, and we are now running the dealer algorithm
	    //there would be another while loop here with the same condition if there were a player2
	    this.ready_for_input=false;
	    let stood_score=this.player.check_score();
	    while (this.dealer.check_score()<17) { //dealer hits if under 17  //IMPLEMENTATION DETAIL: Dealer does not hit on soft 17.
		this.shoe.deal(this.dealer);
		if (this.dealer.check_score()>21) { //dealer busts, finish payouts for everyone
		    //HARDCODED
		    this.dealer.lose(this.player.win('dealer_bust'));
		    if (this.dealer.lost) {
			this.dealer=null;
			this.game_over=true;
			console.log('dealer busted and lost');
			return;
		    }
		} else { //dealer has successfully hit. check if beaten player1 only
		    let dealer_score=this.dealer.check_score();
		    if (dealer_score>=stood_score) { 
			if (dealer_score>stood_score) { //player1 loses
			    this.dealer.win(this.player.lose());
			    //HARDCODED
			    if (this.player.lost) {this.player=null; this.game_over=true; console.log('player lost game on score'); return;}
			    console.log('player lost on score');
			    return;
			} else { //tie
			    this.player.tie();
			    this.dealer.tie();
			    console.log('round ended in score tie')
			    return;
			}
		    }
		}
	    }
	console.log('dealer drawn to max');
	//if we've reached this point, the dealer has drawn upto/past 17 and the player has won
	//player1 win
	this.dealer.lose(this.player.win('score'));
	if (this.dealer.lost) {this.dealer=null; this.game_over=true; console.log('house lost on score'); return;}
	console.log('player won on score');
	return;
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

//module.exports = Game
