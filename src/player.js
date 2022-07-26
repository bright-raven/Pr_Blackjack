class Player {
    constructor(name='PLAYER1', position=1){
	this.name=name;
	this.position=position;
	this.current_bet=10;
	this.wallet=1000;
	this.current_high_score=0;
	this.hand=[];
	this.is_dealer=false;
	//lost indicates the player has lost all their money and is removed from play altogether
	this.lost=false;
	
    }

    //check_score should be queried by the game whenever a card is dealt
    //if it returns a number over 21, bust the player and remove from round
    check_score(){
	let ace_bin=0;
	let ace_scores=[];
	let num_bin=0;
	let possible_scores=[];
	let best_score=0;
	//check for ace in hand, otherwise add cards
	for (let id of this.hand) {
	    if (cards[id].value=='A') {
		//insert code to deal with checking if A is 1 or 11;
		ace_bin+=1;
	    } else {
		//append value to num_bin
		if (['K','Q','J'].includes(cards[id].value)){
		    num_bin+=10;
		} else{
		    num_bin+=cards[id].value;
		}
	    }
	}
	switch(ace_bin) {
	case 0:
	    ace_scores=[0,0];
	    break;
	case 1:
	    ace_scores=[1,11];
	    break;
	case 2:
	    ace_scores=[2,12];
	    break;
	case 3:
	    ace_scores=[3,13]
	    break;
	case 4:
	    ace_scores=[4,14]
	    break;
	case 5:
	    //DAMN SON!
	    ace_scores=[5,15];
	    break;
	case 6:
	    ace_scores=[6,16];
	    break;
	case 7:
	    ace_scores=[7,17];
	    break;
	case 8:
	    ace_scores=[8,18];
	case 9:
	    ace_scores=[9,19];
	    break;
 	case 10:
	    ace_scores=[10,20];
	    break;
	case 11:
	    ace_scores=[11,21];
	    break;
	}
	possible_scores = ace_scores.map(x => x + num_bin);
	if (possible_scores[1]>21){
	    best_score=possible_scores[0];
	} else{
	    best_score=possible_scores[1];
	}
	this.current_high_score=best_score;
	return best_score;
    }

    win(type){
    
	this.discard();//take their cards
	let winnings=this.current_bet;
	//add their winnings based on win type
	//win types are natural, score, dealer_bust
	if (type=='natural') {
	    winnings=Math.floor(1.5*this.current_bet);
	    this.transact(winnings);
	}
	if (type=='score' || type=='dealer_bust'){
	    winnings=Math.floor(this.current_bet)
	    this.transact(winnings);
	}
	this.current_bet=10;
	this.current_high_score=0;
	return winnings
    }

    lose(){
	this.discard();
	let temp = this.current_bet;
	let rm=this.transact(-this.current_bet);
	if (rm) {this.lost=true;}
	this.current_bet=10;
	this.current_high_score=0;
	//return the amount deducted so that the house can be paid
	return temp;
    }

    tie(){
	this.discard();
	this.current_bet=10;
	this.current_high_score=0;
    }

    discard(){
	for (let crd_id of this.hand){
	    cards[crd_id].discard();
	}
	this.hand=[];
    }

    transact(amount){
	//adds or removes money from player wallet
	//if wallet goes below zero, remove_flag signals the game to remove them from play
	let remove_flag=false;
	this.wallet+=amount;
	if (this.wallet<=0){remove_flag=true;}
	return remove_flag;
    }

}

class Dealer extends Player {
    constructor(){
	super('DEALER', 0);
	this.is_dealer=true;
	this.wallet=10000;
	this.position=0;
	this.lose = function (amount){
	    //special dealer lose deducts player's winnings
	    this.discard();
	    this.current_high_score=0;
	    let rm=this.transact(-amount);
	    if (rm) {this.lost=true;}
	};
	this.win = function (amount){
	    //but the house only ever wins the player bet amount
	    this.discard();
	    this.current_high_score=0;
	    this.transact(amount);
	};
    }
}
