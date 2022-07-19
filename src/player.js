class Player {
    constructor(name, position=1){
	this.name=name;
	this.position=position;
	this.current_bet=0;
	this.wallet=0;
	this.current_score=0;
	this.hand=[];
	this.is_dealer=false;
	
    }
}

class Dealer extends Player {
    constructor(){
	super('Dealer', 0);
	this.is_dealer=true;
    }
}

module.exports = { Player, Dealer }
