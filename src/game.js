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

    //this can be either 'deal', to signal
    game_state: 'deal',
    
    play_hand: function(invoker){

	//defines the per-round logic
	//NB THIS IS CURRENTLY SINGLE PLAYER HARDCODED (IN PLACES)

	//global win check
	if (this.player==null || this.dealer==null){
	    //a win condition has been reached
	    this.game_over=true;
	    console.log('win condition reached');
	    return;
	}

	if (this.game_state=='deal'){
	    //move all play logic previous to player decisions here
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
	    //console.log(this.shoe.cardstack);
	
	    this.player.current_high_score=0;
	    this.dealer.current_high_score=0;
	    this.player.hand=[];
	    this.dealer.hand=[];
	
	    //deal 1 card face up, CCW to players and dealer
	    this.shoe.deal(this.player);
	    this.shoe.deal(this.dealer);
	    //deal 1 card face up to players CCW, face down to dealer
	    this.shoe.deal(this.player);
	    //this deal to the dealer should trigger the facedown condition
	    this.shoe.deal(this.dealer);
	    this.print_hand(this.player);
	    //this.print_hand(this.dealer);
	    //if dealer shows 10 J Q K A, peek dealer for natural, if not show, remain blind
	    console.log('done with deal');
	    if ([10,'J','Q','K','A'].includes(cards[this.dealer.hand[0]].value)){
		if (this.dealer.check_score()==21) {
		    //should flip the card over
		    cards[this.dealer.hand[1]].flip();
		    //dealer natural. check players. if player has, return bet, otherwise forfeit all bets and deal
		    if (this.player.check_score()==21){
			//its a draw
		    
			this.player.tie();
			this.dealer.tie();		    
			console.log('both had naturals');
			this.game_state='deal';
			return;
		    } else {
			//HARDCODED
			this.dealer.win(this.player.lose());	
			if (this.player.lost){
			    //remove the player from the game
			    this.player=null;
			    this.game_over=true;
			    console.log('dealer natural, player lost');
			    this.table.end_game(this.dealer);
			    return;
			}
			console.log('dealer natural, win');
			this.game_state='deal';
			return;
		    }
		} else{
		    //dealer showed 10/11 card but didn't have natural
		    if (this.player.check_score()==21 && this.player.hand.length==2) { //player 1 has a natural and dealer does not
			this.dealer.lose(this.player.win('natural'));
			if (this.dealer.lost) {this.dealer=null; this.game_over=true; console.log('player beat house with a natural'); this.table.end_game(this.player); return;}
			console.log('player wins hand with natural');
			this.game_state='deal';
			return;
		    }
		    console.log('dealer showed but no natural');
		    this.game_state='player_turn';
		    return;
		}
  	    } else {
		
		//this means the dealer does not have a natural, check the players
		if (this.player.check_score()==21 && this.player.hand.length==2) { //player 1 has a natural and dealer does not
		    this.dealer.lose(this.player.win('natural'));
		    if (this.dealer.lost) {this.dealer=null; this.game_over=true; console.log('player beat house with a natural'); this.table.end_game(this.player); return;}
		    console.log('player wins hand with natural');
		    this.game_state='deal';
    		    return;
		}
		
		if (this.player==null) {
		    //only dealer remains
		    this.game_over=true;
		    console.log('all players busted');
		    this.table.end_game(this.dealer);
		    return;
		}
		this.game_state='player_turn';
		return;
	    }	
	    
	} else if (this.game_state=='player_turn') {
	    //move all play logic pertaining to player choices here
	    //TODO: INSERT CODE FOR SPLITTING PAIRS, DOUBLING DOWN ON 9,10,11, INSURANCE
 
	    //game enters normal player input condition
	    //do stuff to handle hits
	    if (invoker=='HIT') {

		console.log('player hits');
		this.shoe.deal(this.player);
		this.print_hand(this.player);
		//this.print_hand(this.dealer);
		if (this.player.check_score()>21){
		    //bust the player
		    this.dealer.win(this.player.lose());
		    //this condition should NOT BE HERE for multiplayer
		    if (this.player.lost) {this.player=null; this.game_over=true; console.log('player lost'); return;}
		    console.log('player busted');
		    this.game_state='deal';
		    return;
		} else {
		    //the player has hit and not busted
		    this.game_state='player_turn';
		    console.log('player successfully hit');
		    return;
		}
	    } else if (invoker=='STAND') {

		//the player has successfully stood, and we are now running the dealer algorithm
		//there would be another while loop here with the same condition if there were a player2
		console.log('player stands');
		this.print_hand(this.player);
		//this.print_hand(this.dealer);
		let stood_score=this.player.check_score();
		while (this.dealer.check_score()<stood_score && this.dealer.check_score()<17) { //dealer hits if under 17  //IMPLEMENTATION DETAIL: Dealer does not hit on soft 17.
		    this.shoe.deal(this.dealer);
		    this.print_hand(this.player);
		    //this.print_hand(this.dealer);
		    if (this.dealer.check_score()>21) { //dealer busts, finish payouts for everyone
			//HARDCODED
			this.dealer.lose(this.player.win('dealer_bust'));
			if (this.dealer.lost) {
			    this.dealer=null;
			    this.game_over=true;
			    console.log('dealer busted and lost');
			    return;
			}
			console.log('dealer bust');
			this.game_state='deal';
			return;
		    } else { //dealer has successfully hit. check if beaten player1 only
			let dealer_score=this.dealer.check_score();
			if (dealer_score>=stood_score) { 
			    if (dealer_score>stood_score) { //player1 loses
				this.dealer.win(this.player.lose());
				//HARDCODED
				if (this.player.lost) {this.player=null; this.game_over=true; console.log('player lost game on score'); return;}
				console.log('player lost on score');
				this.game_state='deal';
				return;
			    } else { //tie
				this.player.tie();
				this.dealer.tie();
				console.log('round ended in score tie')
				this.game_state='deal';
				return;
			    }
			}
		    }
		}
		//if we've reached this point, the dealer has drawn upto/past 17 and the player has won
		//player1 win
		console.log('dealer drawn to max');
		this.print_hand(this.player);
		//this.print_hand(this.dealer);
		this.dealer.lose(this.player.win('score'));
		if (this.dealer.lost) {this.dealer=null; this.game_over=true; console.log('house lost on score'); return;}
		console.log('player won on score');
		this.game_state='deal';
		return;
	    } else {
		//invoker is null, but game_state is player_turn. something is wrong.
		//there should be no other conditions
		console.log('unknown state in player_turn');
		return;
	    }
	    

	} else {
	    //there should be no other possible conditions
	    //the dealer doesn't take a 'turn' since all actions are deterministic
	    console.log("something has gone wrong, we've entered play_hand without proper game_state");
	}
	    
	   

    },

    print_hand: function (plr) {
	let hand_string='';
	for (let crd_id of plr.hand){
	    hand_string+=cards[crd_id].value+" ";
	}
	console.log(plr.name+": "+hand_string);
    },

   //TODO we still need to add an indicator for whose turn it is	    
    
}
