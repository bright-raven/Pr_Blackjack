//shoe.js
//the shoe deals, shuffles, and accepts discards

const root_dir = 'http://localhost:8080/'
const card_data = require(root_dir+'assets/cards.json');
const Card = require('./card.js')



class Shoe {
    constructor(game){
	this.game=game;
	this.cards={};
	//the cardstack represents the current shuffle by card id, whereas cards indexes the card objects themselves by id
	//ints are pop() off of cardstack and used to determine the next card dealt
	this.cardstack=[];
	//push() discarded cards here until shuffle()
	this.discards=[];
	//insert logic to fill cards{} from json and do an initial shuffle and cut.
	//i.e. prepare for the game object to request dealt cards
	this.create_decks();
	this.shuffle();
	
    }

    shuffle() {
	for (let i = this.cards.length - 1; i>0; i--){
	    const j = Math.floor(Math.random() * (i+1));
	    [cards[i], cards[j]] = [cards[j], cards[i]];
	}
	//reinsert the marker at pos len()-range(65-75)
	
    }
    
    //this is currently hardcoded to 6 decks
    create_decks(number=6){
	//thanks to https://helloacm.com/the-enumerate-function-in-javascript/ for the enumerate() snippet
	function *enumerate(array) {
	    for (let i = 0; i < array.length; i += 1) {
		yield [i, array[i]];
	    }
	}
	for (crd of enumerate(Object.values(card_data))) {
	    new_card=new Card(crd[1].value,crd[1].suit,crd[0],this);
	    if (new_card.value=='x') {
		new_card.is_marker=true;
	    }
	    //add new_card to stack and dict
	    this.cards.crd[0]=new_card;
	    this.cardstack.push(crd[0]);
	}
    }

    deal() {}
    discard(crd) {
	this.discards.push(crd.index);
    
	
}
