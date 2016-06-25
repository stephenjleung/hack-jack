var values = [2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,6,6,6,6,
              7,7,7,7,8,8,8,8,9,9,9,9,10,10,10,10,
              10,10,10,10,
              10,10,10,10,
              10,10,10,10,
              11,11,11,11];
              
var textPics = ["2","2","2","2",
               "3","3","3","3",
               "4","4","4","4",
               "5","5","5","5",
               "6","6","6","6",
               "7","7","7","7",
               "8","8","8","8",
               "9","9","9","9",
               "10","10","10","10",
               "J","J","J","J",
               "Q","Q","Q","Q",
               "K","K","K","K",
               "A","A","A","A"];

var deckCount = 1;
var playDeck = [];

// returns an array with all the cards to be used
var initializeDeck = function() {
  var tempDeck = [];
  for (var i=0;i<52*deckCount;i++) {
    tempDeck.push(i%52);
  }
  return tempDeck;
}

// shuffles the Play Deck
var shufflePlayDeck = function() {
  
  var shuffledDeck = [];
  var x = 0;
  
  while (playDeck.length > 0) {
    x = Math.floor(Math.random()*(playDeck.length));
    shuffledDeck.push(playDeck[x]);
    playDeck.splice(x,1);
  }
  playDeck =  shuffledDeck.slice();
  
};

var cardValue = function(id) {
  return values[id];
};

// counts the number of Aces in the hand
var aceCount = function(hand) {
  var count = 0;
  for (var i=0;i<hand.length;i++) {
    if (hand[i] > 47)
      count++;
  }
  return count;
};

// calculates the current value of a hand (takes an array)
var calcHandValue = function(hand) {
  var numOfAce = 0;
  var total = 0;
  numOfAce = aceCount(hand);
  
  for (var i=0;i<hand.length;i++) {
    total+=cardValue(hand[i]);
  
    if ((numOfAce > 0) && total > 21) {
      total -= 10;
      numOfAce--;
    }
  }
  
  return total;
};

var cardsLeftInDeck = function(){
  return playDeck.length - deckPointer;
};

// returns a card from the playDeck; pointer moves 1 space forward
var dealCard = function(toWhom){
  var tempCard = playDeck[deckPointer];
  
  if (toWhom === "dealer") {
    dealerHand.push(tempCard);
    document.getElementById("dealer-row").insertAdjacentHTML("beforeend","<img src='./resources/images/" + (tempCard + 1) + ".png' />");
  }
  
  else if (toWhom === "player") {
    playerHand.push(tempCard);
    document.getElementById("player-row").insertAdjacentHTML("beforeend","<img src='./resources/images/" + (tempCard + 1) + ".png' />");
    document.getElementById("player-hand-value").innerHTML = (calcHandValue(playerHand));
    
    if (calcHandValue(playerHand) > 21){
      document.getElementById("status").innerHTML = "Busted!";
    }
    
  }
  deckPointer++;
  document.getElementById("cards-left").innerHTML = (cardsLeftInDeck());
  if (cardsLeftInDeck() < (playDeck.length / 4)) {
    needResetDeck = true;
    document.getElementById("needs-shuffle").innerHTML = "Deck will be shuffled next round.";
  }
};

var hit = function(toWhom){
  
  window.setTimeout(function(){
    dealCard(toWhom);
  },500);
  
  
};

// Helper function to empty html contents by element ID
  var emptyElementById = function(id) {
    var node = document.getElementById(id);
        while (node.hasChildNodes()) {
          node.removeChild(node.firstChild);
        }
  };

var resetBoard = function() {
  emptyElementById("dealer-row");
  emptyElementById("player-row");
  emptyElementById("status");
  emptyElementById("player-hand-value");
  emptyElementById("needs-shuffle");
  playerHand = [];
  dealerHand = [];
  handValue = 0;
};

// global variables regarding game state
var playerHand = [];
var dealerHand = [];
var handValue = 0;
var deckPointer = 0;
var needResetDeck = true;
var playing = false;


// starts a round; board reset; cards are dealt
var deal = function() {
  
  resetBoard();
  
  if (needResetDeck) {
    playDeck = initializeDeck();
    shufflePlayDeck();
    needResetDeck = false;
    deckPointer = 0;
  }
  
  window.setTimeout(function(){
    dealCard("player");
  },500);
  
  window.setTimeout(function(){
    dealCard("dealer");
  },1000);
  window.setTimeout(function(){
    dealCard("player");
  },1500);
  window.setTimeout(function(){
    dealCard("dealer");
  },2000);
  
  //showActions();
  
};


window.onload = function(){
    
  deal();
  //console.log(playDeck);
  
  document.getElementById("hit").onclick = function() {
    hit("player");
  };
  document.getElementById("deal").onclick = function() {
    deal();
  };
  
};