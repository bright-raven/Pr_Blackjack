//shoe.js
//the shoe deals, shuffles, and accepts discards

class Shoe {
    constructor(game){
	this.game=game;
	this.cards=[];
	this.discards=[];
	
    }

    shuffle() {
	for (let i = this.cards.length - 1; i>0; i--){
	    const j = Math.floor(Math.random() * (i+1));
	    [cards[i], cards[j]] = [cards[j], cards[i]];
	}
	//reinsert the marker at pos len()-range(65-75)
	
    }
}
