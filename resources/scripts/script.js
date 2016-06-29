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
    if (dealerHand.length === 1) {
      document.getElementById("dealer-row").insertAdjacentHTML("beforeend","<img src='./resources/images/playing-card-back.jpg' />");
    }
    else if ((dealerHand.length === 2) && (dealerHandRevealed === false)){
      document.getElementById("dealer-hand-value").innerHTML = (calcHandValue(dealerHand.slice(1,2)));
      document.getElementById("dealer-row").insertAdjacentHTML("beforeend","<img src='./resources/images/" + (tempCard + 1) + ".png' />");
    }
    else {
      document.getElementById("dealer-hand-value").innerHTML = (calcHandValue(dealerHand));
      document.getElementById("dealer-row").insertAdjacentHTML("beforeend","<img src='./resources/images/" + (tempCard + 1) + ".png' />");
    }
    
  }
  
  else if (toWhom === "player") {
    playerHand.push(tempCard);
    document.getElementById("player-row").insertAdjacentHTML("beforeend","<img src='./resources/images/" + (tempCard + 1) + ".png' />");
    document.getElementById("player-hand-value").innerHTML = (calcHandValue(playerHand));
    
    if (calcHandValue(playerHand) > 21){
      
      if (stash <= 0) {
        gameOver = true;
        document.getElementById("status").innerHTML = "Busted!  You're Out of Money.  Game Over!";
      }
      else {
        document.getElementById("status").innerHTML = "Busted!";
      }
        
      disableActions = true;
      
      showHide("hit","none");
      showHide("stand","none");
      
      //document.getElementById("hit").style.display = "none";
      //document.getElementById("stand").style.display = "none";
      
      disableDeal = false;
      showHide("deal","inline-block");
      showHide("bet-row","inline-block");
      //document.getElementById("deal").style.display = "inline-block";
      
      window.setTimeout(function(){
        revealDealerHand();
      },500);
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
  
    dealCard(toWhom);
  
};

// Helper function to empty html contents by element ID
var emptyElementById = function(id) {
  var node = document.getElementById(id);
      while (node.hasChildNodes()) {
        node.removeChild(node.firstChild);
      }
};

var revealDealerHand = function(){
  emptyElementById("dealer-row");
  dealerHand.forEach(function(tempCard){
    document.getElementById("dealer-row").insertAdjacentHTML("beforeend","<img src='./resources/images/" + (tempCard + 1) + ".png' />");
  });
  dealerHandRevealed = true;
  document.getElementById("dealer-hand-value").innerHTML = (calcHandValue(dealerHand));
};

var dealerPlay = function() {
  
  revealDealerHand();
    
  if (calcHandValue(dealerHand) > 16) {
    checkWin();
  }
  else {
    window.setTimeout(function(){
      
    hit("dealer");
    dealerPlay();
      
    },500);
  }
  
};

var checkWin = function() {
  if (calcHandValue(dealerHand) > 21) {
    document.getElementById("status").innerHTML = "Dealer Busts. You Won $" + (bet * 2) + "!";
    stash += bet * 2;
    updateHTML("stash");
  }
  else if (calcHandValue(dealerHand) > calcHandValue(playerHand)) {
    if (stash <= 0) {
      gameOver = true;
      document.getElementById("status").innerHTML = "Dealer Wins.  You're Out of Money.  Game Over!";
    }
    else {
      document.getElementById("status").innerHTML = "You Lose!";
    }
  }
  else if (calcHandValue(dealerHand) === calcHandValue(playerHand)) {
    document.getElementById("status").innerHTML = "Push!";
    stash += bet;
    updateHTML("stash");
  }
  else {
    document.getElementById("status").innerHTML = "You Won $" + (bet * 2) + "!";
    stash += bet * 2;
    updateHTML("stash");
  }
  disableActions = true;
  showHide("hit","none");
  showHide("stand","none");
  //document.getElementById("hit").style.display = "none";
  //document.getElementById("stand").style.display = "none";
  
  disableDeal = false;
  showHide("deal","inline-block");
  showHide("bet-row","inline-block");
  //document.getElementById("deal").style.display = "inline-block";
};

var changeBet = function(change, minOrMax){
  if (stash <= 0)
    return 0;
    
  if (arguments.length === 2) {
    if ((minOrMax === "max") && (bet + change <= stash))
      bet = change;
    else if ((minOrMax === "max") && (bet + change > stash) && (stash >= change) )
      bet = change;
    else if ((minOrMax === "max") && (bet + change > stash))
      bet = stash;
    else
      bet = change;
      
  }
  else if (bet + change <= stash) {
    if (bet + change > maxBet) {
      bet = maxBet;
    }
    else if (bet + change <= minBet) {
      bet = minBet;
    }
    else {
      bet += change;
    }
  }
  
  else if (bet + change > stash) {
    bet = stash;
  }
    
  updateHTML("bet");
};


var updateHTML = function(id){
  switch(id) {
    case "stash":
      document.getElementById("stash").innerHTML = stash;
      break;
    case "bet":
      document.getElementById("bet").innerHTML = bet;
      break;
    
  }
};

var showHide = function(id,display) {
  document.getElementById(id).style.display=display;
}

var placeBet = function(){
  stash = stash - bet;
  updateHTML("stash");
};

var resetBoard = function() {
  emptyElementById("dealer-row");
  emptyElementById("player-row");
  emptyElementById("status");
  emptyElementById("player-hand-value");
  emptyElementById("dealer-hand-value");
  emptyElementById("needs-shuffle");
  playerHand = [];
  dealerHand = [];
  playerHandValue = 0;
  dealerHandValue = 0;
  dealerHandRevealed = false;
};

// global variables regarding game state
var playerHand = [];
var dealerHand = [];
var playerHandValue = 0;
var dealerHandValue = 0;
var deckPointer = 0;
var needResetDeck = true;
var playing = false;
// Used to lock out user input during animations
var disableActions = true;
var disableDeal = false;
var dealerHandRevealed = false;

var stash = 1000;
var bet = 5;
var minBet = 5;
var maxBet = 1000;
var gameOver = false;


// starts a round; board reset; cards are dealt
var deal = function() {
  disableActions = true;

  
  disableDeal = true;
  showHide("deal","none");
  showHide("bet-row","none");
  
  //document.getElementById("deal").style.display = "none";
  resetBoard();
  
  placeBet();
  
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
    disableActions = false;
    
    showHide("hit","inline-block");
    showHide("stand","inline-block");
    
    //document.getElementById("hit").style.display = "inline-block";
    //document.getElementById("stand").style.display = "inline-block";
  },2000);
  
  //showActions();
  
};


window.onload = function(){
  
  
//  deal();
  //console.log(playDeck);
  document.getElementById("stash").innerHTML = stash;
  document.getElementById("bet").innerHTML = bet;
  
  document.getElementById("hit").onclick = function() {
    if (disableActions === false)
      hit("player");
  };
  document.getElementById("deal").onclick = function() {
    if ((disableDeal === false) && (gameOver === false))
      deal();
  };
  
  document.getElementById("stand").onclick = function() {
    if (disableActions === false)
      dealerPlay();
    //if (disableDeal === false)
    //  deal();
  };
  
  document.getElementById("bet-min").onclick = function() {changeBet(minBet,"min")};
  document.getElementById("bet-max").onclick = function() {changeBet(maxBet, "max")};
  document.getElementById("bet-add-5").onclick = function() {changeBet(5)};
  document.getElementById("bet-add-20").onclick = function() {changeBet(20)};
  document.getElementById("bet-add-100").onclick = function() {changeBet(100)};
  document.getElementById("bet-subtract-5").onclick = function() {changeBet(-5)};
  document.getElementById("bet-subtract-20").onclick = function() {changeBet(-20)};
  document.getElementById("bet-subtract-100").onclick = function() {changeBet(-100)};
  
};