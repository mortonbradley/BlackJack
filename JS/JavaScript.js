let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0; 
let hidden;
let deck;
let bet = 0;
let canHit = true;

// Load balance from localStorage, default to 1000 if not present
let balance = localStorage.getItem('balance') ? parseFloat(localStorage.getItem('balance')) : 1000;

window.onload = function() {
    document.getElementById("dealer-cards").style.display = "none";
    document.getElementById("your-cards").style.display = "none";
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;

    document.getElementById("Play-Hand").addEventListener("click", playHand);
	
	updateBalance();
	// Add event listeners to each chip
    document.getElementById("chip5").addEventListener("click", function() { increaseBet(5); });
    document.getElementById("chip10").addEventListener("click", function() { increaseBet(10); });
    document.getElementById("chip25").addEventListener("click", function() { increaseBet(25); });
    document.getElementById("chip50").addEventListener("click", function() { increaseBet(50); });
    document.getElementById("chip100").addEventListener("click", function() { increaseBet(100); });
}

function updateBalance() {
    // Update the balance display
    document.getElementById("balance-display").innerText = balance.toFixed(2); // Display balance with 2 decimal places
}

function increaseBet(amount) {
    // Check if the player has enough balance to place the bet
    if (balance >= amount) {
        // Check if the game is in progress
        if (gameInProgress()) {
            alert("Cannot increase bet while the game is in progress.");
            return;
        }
        
        // Decrease the balance by the bet amount
        balance -= amount;
        // Update the balance display
        updateBalance();
        // Increase the bet amount
        bet += amount;
        // Update the bet display on the page
        document.getElementById("bet-amount").innerText = bet;
    } else {
        alert("Insufficient balance!");
    }
}

function gameInProgress() {
    // Check if the hit button is enabled (indicating the game is in progress)
    return !document.getElementById("hit").disabled;
}

function winHand() {
    // Calculate winnings (double the bet)
    let winnings = bet * 2;
    
    // Update balance with winnings
    balance += winnings;

    // Save updated balance to localStorage
    localStorage.setItem('balance', balance.toFixed(2));

    // Update balance display
    updateBalance();
}

function playHand() {
    // Check if the bet is less than £5
    if (bet < 5) {
        alert("Minimum bet is £5. Please place a higher bet to play the hand.");
        return;
    }

    // Disable the "Play Hand" button to prevent multiple hands from being played
    document.getElementById("Play-Hand").disabled = true;

    // Disable betting
    disableBetting();

    // Build and shuffle the deck, start the game
    buildDeck();
    shuffleDeck();
    startGame();

    // Display dealer and player cards, enable hit and stay buttons, hide instructions
    document.getElementById("dealer-cards").style.display = "block";
    document.getElementById("your-cards").style.display = "block";
    document.getElementById("hit").disabled = false;
    document.getElementById("stay").disabled = false;
    document.getElementById("instructions").style.display = "none";
}

function disableBetting() {
    // Disable all chip buttons
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
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    // console.log(deck);
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    hidden = deck.pop(); // Store the hidden card
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    // Display one face-up card for the dealer
    let faceUpCardImg = document.createElement("img");
    let faceUpCard = deck.pop();
    faceUpCardImg.src = "./Images/" + faceUpCard + ".png";
    document.getElementById("dealer-cards").append(faceUpCardImg);


    // Deal two cards for the player
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

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
    }

}

function stay() {
    // Reveal the hidden card
    document.getElementById("hidden").src = "./Images/" + hidden + ".png";

    // Dealer hits until their total is at least 17
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./Images/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);

        // Reduce dealerSum if needed
        dealerSum = reduceAce(dealerSum, dealerAceCount);
    }

    // Determine the winner
    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
    } else if (dealerSum > 21 || yourSum > dealerSum) {
        message = "You Win!";
        winHand(); // Call winHand() when the player wins
    } else if (yourSum === dealerSum) {
        message = "Tie!";
        balance += bet; // Return the bet to the balance in case of a tie
        updateBalance();
    } else {
        message = "You Lose!";
    }

    // Update UI with results
    document.getElementById("results").innerText = message;
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;

    // Disable hit and stay buttons
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;

    // Reset the game after 5 seconds
    setTimeout(resetGame, 5000);

    // Save updated balance to localStorage after determining the result
    localStorage.setItem('balance', balance.toFixed(2));
}


function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
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
    // Reload the page
    location.reload();
}

