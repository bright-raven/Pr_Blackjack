//game.js
//
//provides the main game logic and marshals the other game entities



var Game = {

    /* the shoe object holds undealt cards and keeps track of shuffle state.
     all requests for cards to be dealt are directed at the shoe*/
    shoe: [],
    
    // the discard object gives used cards a place to go physically before the shuffle*/
    discard_pile: [],

    // indicates that it is time to shuffle the shoe before the next hand when the marker card is reached during a round
    shuffle_flag: false,
    
    play_hand: function(){
	//defines the in-game logic
	//BEGIN GAME
	//
	//if (shuffle_flag) {shoe.shuffle(); shoe.cut()};
	//
	//deal 1 card face up, CCW to players and dealer
	//
	//deal 1 card face up to players CCW, face down to dealer
	//
	//if dealer shows 10 J Q K A, peek dealer for natural, if not show, remain blind
	//
	//if dealer natural, check players. if player has, return bet, otherwise forfeit all bets and deal
	//
	//if not dealer natural, check players. if player natural, win 1.5 x bet and remove from lineup.
	//continue with other players
	//
	//
	//NB: INSERT CODE FOR SPLITTING PAIRS, DOUBLING DOWN ON 9,10,11, INSURANCE
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
	//there should be a global win/loss condition and reset for the player/house when their wallet is empty
	

    }
    
}

while (true){Game.play_hand();}

console.log("test");



module.exports = Game