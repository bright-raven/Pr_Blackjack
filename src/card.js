class Card {
    constructor(value, suit, index, shoe, doc_element=null, is_marker=false){
	this.table=globalThis;
	this.value=value;
	this.suit=suit;
	this.index=index;
	this.shoe=shoe;
	this.face_up=false;
	this.doc_element=doc_element;
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
}

module.exports=Card;
