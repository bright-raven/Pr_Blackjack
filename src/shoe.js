//shoe.js
//the shoe deals, shuffles, and accepts discards

var root_dir = 'http://localhost:8080/';

var marker_data =  {
    "suit": "x",
    "value": "x"
};

var card_data = [
  {
    "suit": "h",
    "value": 2
  },
  {
    "suit": "h",
    "value": 3
  },
  {
    "suit": "h",
    "value": 4
  },
  {
    "suit": "h",
    "value": 5
  },
  {
    "suit": "h",
    "value": 6
  },
  {
    "suit": "h",
    "value": 7
  },
  {
    "suit": "h",
    "value": 8
  },
  {
    "suit": "h",
    "value": 9
  },
  {
    "suit": "h",
    "value": 10
  },
  {
    "suit": "h",
    "value": "J"
  },
  {
    "suit": "h",
    "value": "Q"
  },
  {
    "suit": "h",
    "value": "K"
  },
  {
    "suit": "h",
    "value": "A"
  },
  {
    "suit": "d",
    "value": 2
  },
  {
    "suit": "d",
    "value": 3
  },
  {
    "suit": "d",
    "value": 4
  },
  {
    "suit": "d",
    "value": 5
  },
  {
    "suit": "d",
    "value": 6
  },
  {
    "suit": "d",
    "value": 7
  },
  {
    "suit": "d",
    "value": 8
  },
  {
    "suit": "d",
    "value": 9
  },
  {
    "suit": "d",
    "value": 10
  },
  {
    "suit": "d",
    "value": "J"
  },
  {
    "suit": "d",
    "value": "Q"
  },
  {
    "suit": "d",
    "value": "K"
  },
  {
    "suit": "d",
    "value": "A"
  },
  {
    "suit": "c",
    "value": 2
  },
  {
    "suit": "c",
    "value": 3
  },
  {
    "suit": "c",
    "value": 4
  },
  {
    "suit": "c",
    "value": 5
  },
  {
    "suit": "c",
    "value": 6
  },
  {
    "suit": "c",
    "value": 7
  },
  {
    "suit": "c",
    "value": 8
  },
  {
    "suit": "c",
    "value": 9
  },
  {
    "suit": "c",
    "value": 10
  },
  {
    "suit": "c",
    "value": "J"
  },
  {
    "suit": "c",
    "value": "Q"
  },
  {
    "suit": "c",
    "value": "K"
  },
  {
    "suit": "c",
    "value": "A"
  },
  {
    "suit": "s",
    "value": 2
  },
  {
    "suit": "s",
    "value": 3
  },
  {
    "suit": "s",
    "value": 4
  },
  {
    "suit": "s",
    "value": 5
  },
  {
    "suit": "s",
    "value": 6
  },
  {
    "suit": "s",
    "value": 7
  },
  {
    "suit": "s",
    "value": 8
  },
  {
    "suit": "s",
    "value": 9
  },
  {
    "suit": "s",
    "value": 10
  },
  {
    "suit": "s",
    "value": "J"
  },
  {
    "suit": "s",
    "value": "Q"
  },
  {
    "suit": "s",
    "value": "K"
  },
  {
    "suit": "s",
    "value": "A"
  }
];

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
	
    }

    shuffle() {
	
	let new_stack=Array.from({length: 312}, (_, i) => i + 1)
	let min = Math.ceil(65);
	let max = Math.floor(75);
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
	this.discards=[];
	
    }
    
    create_decks(number=6){
	//create the marker
	let marker_card=new Card(marker_data['value'],marker_data['suit'],0,this);
	this.cards[marker_card.index]=marker_card;
	this.cardstack.push(marker_card.index);
	for (let j = 0; j < number; j++){
	    
	    for (let i = 0; i < card_data.length; i++) {
		
		let new_card=new Card(card_data[i]['value'],card_data[i]['suit'],(52*j)+(i+1),this);
		//add new_card to stack and dict
		this.cards[new_card.index]=new_card;
		this.cardstack.push(new_card.index);
	    }
	}
	this.shuffle();
    }

    deal(plr) {
	/*this should never enter a state where there are no cards left
	  because shuffle() should always happen at the marker*/
	let drawn_card = this.cards[this.cardstack.shift()];
	if (drawn_card.is_marker) {
	    this.game.shuffle_flag=true;
	    drawn_card.discard();
	    drawn_card = this.cards[this.cardstack.shift()];
	}
	drawn_card.dealt(plr);
    }
}
