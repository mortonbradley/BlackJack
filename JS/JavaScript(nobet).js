let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0; 
let hidden;
let deck;
let canHit = true;

window.onload = function() {
    document.getElementById("dealer-cards").style.display = "none";
    document.getElementById("your-cards").style.display = "none";
    document.getElementById("hit").disabled = true;
    document.getElementById("stay").disabled = true;

    document.getElementById("Play-Hand").addEventListener("click", playHand);
}

function playHand() {
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
    // Disable all chip buttons (if any)
    let chips = document.getElementsByClassName("chip");
    for (let i = 0; i < chips.length; i++) {
        chips[i].disabled = true;
    }
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
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
}

function startGame() {
    hidden = deck.pop(); // Store the hidden card
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    // Display one face-up card for the dealer
    let faceUpCardImg = document.createElement("img");
    let faceUpCard = deck.pop();
    faceUpCardImg.src = "//nwh-file-02/FR$/bmorton1/My Documents/Bradley_uni/Web Tech/Black_Jack/Images/" + faceUpCard + ".png";
    document.getElementById("dealer-cards").append(faceUpCardImg);

    // Deal two cards for the player
    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "//nwh-file-02/FR$/bmorton1/My Documents/Bradley_uni/Web Tech/Black_Jack/Images/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "//nwh-file-02/FR$/bmorton1/My Documents/Bradley_uni/Web Tech/Black_Jack/Images/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
        stay();
    }
}

function stay() {
    // Reveal the hidden card
    document.getElementById("hidden").src = "//nwh-file-02/FR$/bmorton1/My Documents/Bradley_uni/Web Tech/Black_Jack/Images/" + hidden + ".png";

    // Dealer hits until their total is at least 17
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "//nwh-file-02/FR$/bmorton1/My Documents/Bradley_uni/Web Tech/Black_Jack/Images/" + card + ".png";
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
    } else if (yourSum === dealerSum) {
        message = "Tie!";
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
    // Reload the page
    location.reload();
}
