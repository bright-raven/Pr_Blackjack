class Player {
    constructor(name, position=1){
	this.name=name;
	this.position=position;
	this.current_bet=0;
	this.wallet=1000;
	this.current_score=0;
	this.hand=[];
	this.is_dealer=false;
	
    }

    check_score(){
	//check for ace in hand, otherwise add cards
	for (const card of this.hand) {
	    if (card.value=='A') {
		//insert code to deal with checking if A is 1 or 11;
	    } else {
		result = 'NOT positive';
	    }
	}
    }

    win(type){

	//win types are natural, score, dealer_bust
	
	//take their cards
	this.hand=[];
	// add their winnings based on win type
	//reset score to zero
    }

    lose(){
	//take their cards
	//deduct their bet
    }

    tie(){
	//take their cards
	//put their bet back in their wallet
    }

    transact(amount){
	//adds or removes money from player wallet
	//if wallet goes below zero, remove_flag signals the game to remove them from play
	let remove_flag=false;
	this.wallet+=amount;
	if (this.wallet<=0){remove_flag=true;}
	return remove_flag;
    }

class Dealer extends Player {
    constructor(){
	super('The House', 0);
	this.is_dealer=true;
	this.wallet=10000;
	this.position=0;
    }
}

module.exports = { Player, Dealer }
