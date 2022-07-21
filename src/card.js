class Card {
    constructor(value, suit, index, shoe, doc_element=null, is_marker=false){
	this.table=globalThis;
	this.value=value;
	this.suit=suit;
	//index is like a UUID for the card in the shoe
	this.index=index;
	this.shoe=shoe;
	this.face_up=false;
	this.doc_element=doc_element;
	this.image=null;
	this.is_marker=is_marker;
	//play_position is a string indicating the card's current position in play
	this.play_position='SHOE';
	//new_position is a string indicating where the card should be moved in the next transform() call
	this.new_position='';
    }

    toString(){
	return this.value+this.suit;
    }

    returnToShoe(){
	//shoe calls this upon shuffle
	//add code to flip face down and table.transform() back to the shoe position
	if (this.face_up) {
	    this.flip();
	}
	this.face_up=false;
	this.new_position='SHOE';
	table.transform(this);
	this.play_position='SHOE';
    }

    discard(){
	//add to the discard pile
	this.shoe.discards.push(this.index);
	this.new_position='DISCARD';
	table.transform(this);
	this.play_position='DISCARD';
	//tell the table to move the card to discard and render
    }

    dealt(player){
	let deal_index=player.hand.push(this);
	if !(player.is_dealer && deal_index==2){
	    this.face_up=true;
	}
	this.new_position=player.name+"_"+deal_index;
	table.transform(this);
	this.play_position=this.new_position;
    }

    flip(){
	//toggles the card state face/back
	this.face_up=!this.face_up;
	//change html element visibility accordingly
	if (this.face_up) { //hide card back image

	    this.image.style.visibility="hidden";
	    
	    this.doc_element.
	} else { //show card back image (is child so should shadow card type divs)
	    
	    this.image.style.visibility="visible";
	    
	}
}

module.exports=Card;
