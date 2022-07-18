class Card {
    constructor(value, suit, doc_element, is_marker=false){
	this.value=value;
	this.suit=suit;
	this.face_up=false;
	this.doc_element=doc_element;
    }

    toString(){
	return value+suit[0];
    }

    is_marker=
}
