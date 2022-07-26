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
	this.new_position='SHOE';
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
	this.table.animation_queue.push(this);
	this.play_position='SHOE';
    }

    discard(){
	//add to the discard pile
	if (!this.face_up){
	    this.flip();
	}
	this.face_up=true;
	this.shoe.discards.push(this.index);
	this.new_position='DISCARD';
	this.play_position='DISCARD';
	this.table.animation_queue.push(this);
    }

    dealt(plyr){
	//console.log(this.value+this.suit+' to '+ player.name);
	let deal_index=plyr.hand.length+1;
	plyr.hand.push(this.index);
	if (plyr.is_dealer){
	    if (deal_index==1){
		this.flip();
		this.face_up=true;
	    }
	} else if (!plyr.is_dealer) {
	    this.flip();
	    this.face_up=true;
	}
	this.new_position=plyr.name+"_"+deal_index;
	this.play_position=this.new_position;
	this.table.animation_queue.push(this);
    }

    flip(){
	//toggles the card state face/back
	this.face_up=!this.face_up;
	//change html element visibility accordingly
	if (this.face_up) { //hide card back image

	    this.image.style.visibility="hidden";
	    
	} else { //show card back image (is child so should shadow card type divs)
	    
	    this.image.style.visibility="visible";
	    
	}
    }
}
