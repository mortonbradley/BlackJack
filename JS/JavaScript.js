let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0; 
let hidden;
let deck;
let bet = 0;
let canHit = true;


let balance = localStorage.getItem('balance') ? parseFloat(localStorage.getItem('balance')) : 1000;

window.onload = function() {
    document.getElementById("dealer-cards").style.display = "none";
    document.getElementById("your-cards").style.display = "none";
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;

    document.getElementById("Play-Hand").addEventListener("click", playHand);
	
	updateBalance();
	
    document.getElementById("chip5").addEventListener("click", function() { increaseBet(5); });
    document.getElementById("chip10").addEventListener("click", function() { increaseBet(10); });
    document.getElementById("chip25").addEventListener("click", function() { increaseBet(25); });
    document.getElementById("chip50").addEventListener("click", function() { increaseBet(50); });
    document.getElementById("chip100").addEventListener("click", function() { increaseBet(100); });
}

function updateBalance() {
    
    document.getElementById("balance-display").innerText = balance.toFixed(2); 
}

function increaseBet(amount) {
    
    if (balance >= amount) {
        
        if (gameInProgress()) {
            alert("Cannot increase bet while the game is in progress.");
            return;
        }
        
       
        balance -= amount;
        
        updateBalance();
        
        bet += amount;
        
        document.getElementById("bet-amount").innerText = bet;
    } else {
        alert("Insufficient balance!");
    }
}

function gameInProgress() {
    
    return !document.getElementById("hit").disabled;
}

function winHand() {
    
    let winnings = bet * 2;
        
    balance += winnings;
  
    localStorage.setItem('balance', balance.toFixed(2));

    updateBalance();
}

function playHand() {
    
    if (bet < 5) {
        alert("Minimum bet is £5. Please place a higher bet to play the hand.");
        return;
    }

    
    document.getElementById("Play-Hand").disabled = true;
    
    disableBetting();
    
    buildDeck();
    shuffleDeck();
    startGame();

    
    document.getElementById("dealer-cards").style.display = "block";
    document.getElementById("your-cards").style.display = "block";
    document.getElementById("hit").disabled = false;
    document.getElementById("stay").disabled = false;
    document.getElementById("instructions").style.display = "none";
}

function disableBetting() {
    
    document.getElementById("chip5").disabled = true;
    document.getElementById("chip10").disabled = true;
    document.getElementById("chip25").disabled = true;
    document.getElementById("chip50").disabled = true;
    document.getElementById("chip100").disabled = true;
}


function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); 
        }
    }
    
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); 
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    hidden = deck.pop(); 
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    
    let faceUpCardImg = document.createElement("img");
    let faceUpCard = deck.pop();
    faceUpCardImg.src = "./Images/" + faceUpCard + ".png";
    document.getElementById("dealer-cards").append(faceUpCardImg);

    
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./Images/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    console.log(yourSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./Images/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) { 
        canHit = false;
    }

}

function stay() {
    
    document.getElementById("hidden").src = "./Images/" + hidden + ".png";

    
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./Images/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);

        
        dealerSum = reduceAce(dealerSum, dealerAceCount);
    }

    
    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
    } else if (dealerSum > 21 || yourSum > dealerSum) {
        message = "You Win!";
        winHand(); 
    } else if (yourSum === dealerSum) {
        message = "Tie!";
        balance += bet; 
        updateBalance();
    } else {
        message = "You Lose!";
    }

   
    document.getElementById("results").innerText = message;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;

    
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;

    
    setTimeout(resetGame, 5000);

    
    localStorage.setItem('balance', balance.toFixed(2));
}


function getValue(card) {
    let data = card.split("-"); 
    let value = data[0];

    if (isNaN(value)) { 
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

function resetGame() {
   
    location.reload();
}

