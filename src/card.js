class Card {
    constructor(value, suit, index, shoe, doc_element=null, is_marker=false){
	this.value=value;
	this.suit=suit;
	this.index=index;
	this.shoe=shoe;
	this.face_up=false;
	this.doc_element=doc_element;
	this.is_marker=is_marker;
    }

    toString(){
	return this.value+this.suit;
    }

    discard(){
	//add to the discard pile
	this.shoe.discards.push(this.index);
	//card <div> position will be changed by game
    }
}
