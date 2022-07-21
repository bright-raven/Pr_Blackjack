//shoe.js
//the shoe deals, shuffles, and accepts discards

const root_dir = 'http://localhost:8080/'
const card_data = require(root_dir+'assets/cards.json');
const Card = require('./card.js')



class Shoe {
    constructor(){
	this.game=globalThis.Game;
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
	
	let new_stack=Array.from({length: 312}, (_, i) => i + 1)
	min = Math.ceil(65);
	max = Math.floor(75);
	let marker_index=312-(Math.floor(Math.random() * (max - min + 1)) + min);
	
	//perform in-place shuffle
	for (let i = new_stack.length - 1; i>0; i--){
	    const j = Math.floor(Math.random() * (i+1));
	    [new_stack[i], new_stack[j]] = [new_stack[j], new_stack[i]];
	}
	//reinsert the marker at pos len()-range(65-75)
	//insert item in arr at index, deleting 0 items
	new_stack.splice(marker_index, 0, 0);
	this.cardstack=new_stack;
	
    }
    
    //this is currently hardcoded to 6 decks
    create_decks(number=6){
	//thanks to https://helloacm.com/the-enumerate-function-in-javascript/ for the enumerate() snippet
	//the strange loop variables are to account for the marker card being assigned the zero index at the end,
	//no matter whether the card_data comes in order or not.
	function *enumerate(array) {
	    for (let i = 1; i < array.length+2; i += 1) {
		yield [i, array[i]];
	    }
	}
	for (crd of enumerate(Object.values(card_data))) {
	    let new_card=new Card(crd[1].value,crd[1].suit,crd[0],this);
	    if (new_card.value=='x') {
		new_card.is_marker=true;
		new_card.index=0;
	    }
	    //add new_card to stack and dict
	    this.cards[new_card.index]=new_card;
	    this.cardstack.push(new_card.index);
	}
    }

    deal(player) {
	/*this should never enter a state where there are no cards left
	  because shuffle() should always happen at the marker*/
	let dealt_card = this.cards[this.cardstack.shift()];
	if (dealt_card.is_marker) {
	    this.game.shuffle_flag=true;
	    dealt_card.discard();
	    dealt_card = this.cards[this.cardstack.shift()];
	}
	dealt_card.dealt(player);
    }
}

module.exports=Shoe();
