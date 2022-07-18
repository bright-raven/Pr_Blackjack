/* Randomize array in-place using Durstenfeld shuffle algorithm
   Thanks, Laurens Holst @stackoverflow*/
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}


var Game = {

    /* the shoe object holds undealt cards and keeps track of shuffle state.
     all requests for cards to be dealt are directed at the shoe*/
    shoe: [],
    /* the discard object gives used cards a place to go physically before the shuffle*/
    discard: null
}

console.log("stringable object"); 

class Player {
    constructor(name, position=1){
	this.name=name;
	this.position=position;
	this.current_bet=0;
	this.wallet=0;
	this.current_score=0;
	this.hand=[];
	this.is_dealer=false;
	
    }
}

class Dealer extends Player {
    constructor(){
	super(name, 0);
	this.name='Dealer';
	this.is_dealer=true;
    }
}



class Shoe {
    constructor(game){
	this.game=game;
	this.cards=[];
	
    }

    shuffle() {
	for (let i = this.cards.length - 1; i>0; i--){
	    const j = Math.floor(Math.random() * (i+1));
	    [cards[i], cards[j]] = [cards[j], cards[i]];
	}
    }
}

    
	
    



class Car {
  constructor(make, model) {
    this.make = make;
    this.model = model;
  }
  
  start() {
    console.log('vroom');
  }
  
  toString() {
    console.log(`Car - ${this.make} - ${this.model}`);
  }
}


class SportsCar extends Car {
  constructor(make, model, turbocharged) {
    super(make, model);
    this.turbocharged = turbocharged;
  }
  
  start() {
    console.log('VROOOOM');
  }
}


// Actual usage remains the same
var car = new Car('Nissan', 'Sunny');
car.start(); // vroom
console.log(car.make); // Nissan

var sportsCar = new SportsCar('Subaru', 'BRZ', true);
sportsCar.start(); // VROOOOM
console.log(car.turbocharged); // true
