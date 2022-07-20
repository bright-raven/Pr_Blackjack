class Card {
    constructor(value, suit, index, shoe, doc_element=null, is_marker=false){
	this.value=value;
	this.suit=suit;
	this.index=index;
	this.shoe=shoe;
	this.face_up=false;
	this.doc_element=doc_element;
	this.is_marker=is_marker;
	//play_position is one of three things, 'in_shoe', 'in_discard', or a player object (the player whose hand it is in)
	this.play_position='in_shoe';
    }

    toString(){
	return this.value+this.suit;
    }

    discard(){
	//add to the discard pile
	this.shoe.discards.push(this.index);
	this.play_position='in_discard';
	//card <div> position will be changed by game
    }

    dealt(player){
	this.play_position=player;
	let deal_index=player.hand.push(this);
	if !(player.is_dealer && deal_index==2){
	    this.face_up=true;
	}
	    
	    
	
    }
}

module.exports=Card;
