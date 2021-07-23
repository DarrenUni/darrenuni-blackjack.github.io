//To Do: Avoid duplicate cards | A = 11 / 1 (use max min) | Animations

var pcHand = [], pcMinHand = [];
var playerHand = [], playerMinHand = [];
var totals = [];    // PC total in item 0, player in item 1 of totals
var minTotals = [];
var hitCounter = 0;
var hitList = [];
var pcCardTwoSuit;  //To save card 2 to display
var isAce = false;
var balance = 1000;
var pot = 0, winnings = 0;

function loadPage(){
    //Display balance with formatting
    let balanceLabel = document.getElementById("lblBalance");
    balanceLabel.innerHTML = balance;
    balanceLabel.innerHTML = balanceLabel.innerHTML.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

//Generate a new PLAYER card
function drawCard(id, pcPlayer) {
    let card = document.getElementById(id);
    //const rSuits = ["♦", "♥"], bSuits = ["♣", "♠"];
    const suits = {
        SPADES: "♠",
        CLUBS: "♣",
        HEARTS: "♥",
        DIAMONDS: "♦",
    }
    let ranNum, ranSuit, result;

    //Generating random number and suit
    ranNum = Math.floor(Math.random() * 13);
    ranSuit = Math.floor(Math.random() * 4);

    //Converting nums to AJQK
    switch(ranNum){
        case 11:
            result = "A";
            isAce = true;
            break;
        case 1:
            result = "J";
            ranNum = 10;
            break;
        case 12:
            result = "Q"
            ranNum = 10;
            break;
        case 0:
            result = "K"
            ranNum = 10;
            break;
        default:
            result = ranNum.toString();
    }

    //Setting suit symbol and text colour
    switch(ranSuit){
        case 0:
            result += suits.DIAMONDS;
            card.style.color = 'red';
            break;
        case 1:
            result += suits.CLUBS;
            card.style.color = 'black';
            break;
        case 2:
            result += suits.HEARTS;
            card.style.color = 'red';
            break;
        case 3:
            result += suits.SPADES;
            card.style.color = 'black';
            break;
    }

    //Display generated card number and suit
    card.innerHTML = result;
    
    //Update PLAYER hand array
    switch(id){
        case "btnPC1":
            addCard(pcPlayer, ranNum);
            break;
        case "btnPC2":
            addCard(pcPlayer, ranNum);
            //Save suit of card 2 for future use
            pcCardTwoSuit = result;
            //Setting back of card to hide
            card.classList.add("pcTwo");
            card.innerHTML = "";
            break;
        case "btnP1":
        case "btnP2":
            addCard(pcPlayer, ranNum);
            break;
        case "hit0": //To do: Try declare hit counter to loop through all hit possibilities
        case "hit1":
        case "hit2":
        case "hit3":
        case "hit4":
        case "hit5":
        case "hit6":
        case "hit7":
            addCard(pcPlayer, ranNum);
            break;
    }

    //Recalculate and display player hand total
    handTotal();
}

//Add card number to array for total calculator
function addCard(id, num){
    if (id === 0){
        pcHand.push(num);
        if(isAce === true){
            pcMinHand.push(1);
        } else {
            pcMinHand.push(num);
        }
    } else {
        playerHand.push(num);
        if(isAce === true){
            playerMinHand.push(1);
        } else {
            playerMinHand.push(num);
        }
    }
    isAce = false;
}

// Calculate hand total
function handTotal(){
    let lblPC = document.getElementById("lblPC");
    let lblPlayer = document.getElementById("lblPlayer");

    let text = "";
    let amount = 0;

    lblPlayer.style.fontSize = "20px";
    lblPC.style.fontSize = "20px";

    //Calculate pcHand total
    for(let i = 0; i < pcHand.length; i++){
        amount += pcHand[i];
    }
    totals[0] = amount;
    amount = 0;

    //Calculate pcMinHand total
    for(let i = 0; i < pcMinHand.length; i++){
        amount += pcMinHand[i];
    }
    minTotals[0] = amount;
    // Reset amount counter
    amount = 0;

    //Calculate playerHand total
    for(let i = 0; i < playerHand.length; i++){
        amount += playerHand[i];
    }
    totals[1] = amount;
    amount = 0;
    
    //Calculate playerMinHand total
    for(let i = 0; i < playerMinHand.length; i++){
        amount += playerMinHand[i];
    }
    minTotals[1] = amount;

    //Displaying totals with or without min
    if(totals[0] > minTotals[0]){
        text = totals[0].toString() + " / " + minTotals[0].toString();
        lblPC.innerHTML = text;
    } else {
        text = totals[0];
        lblPC.innerHTML = text;
    }

    if(totals[1] === minTotals[1]){
        text = totals[1];
        lblPlayer.innerHTML = text;
    } else {
        text = totals[1].toString() + " / " + minTotals[1].toString();
        lblPlayer.innerHTML = text;
    }
}

//Pass true to show, false to hide buttons
function toggleButton(id, bool){
    let butt = document.getElementById(id);

    if(bool === true){
        butt.hidden = false;
    } else {
        butt.hidden = true;
    }
}

// Reset all values and objects to default
function resetGame(){
    let buttonIDs = ["btnP1", "btnP2", "btnPC1", "btnPC2"];
    let lblPC = document.getElementById("lblPC");
    let lblPlayer = document.getElementById("lblPlayer");
    let elem, winLoseLabel;
    let winningsLabel = document.getElementById("lblWinnings");
    
    playerHand = [];
    playerMinHand = [];
    pcHand = [];
    pcMinHand = [];
    totals = [];
    minTotals = [];
    // Reset winnings
    winnings = 0;

    // Resetting card buttons text
    for (let i = 0; i < buttonIDs.length; i++){
        elem = document.getElementById(buttonIDs[i]);
        elem.innerHTML = "+";
        elem.style.color = "black";

        if(buttonIDs[i] == "btnPC2"){
            elem.classList.remove("pcTwo");
        }
    }

    //Resetting label texts
    lblPlayer.innerHTML = "Player Hand";
    lblPlayer.style.fontSize = "16px";
    lblPC.innerHTML = "Computer Hand";
    lblPC.style.fontSize = "16px";
    winningsLabel.innerHTML = "";

    // Hide button after reset
    toggleButton("btnNewGame", false);
    // Show Start game button
    toggleButton("btnStartGame", true);
    toggleButton("btnHit", false);
    toggleButton("btnStand", false);

    // Remove cards and set hitCounter to 0
    while (hitCounter > 0){
        let cardName = hitList[hitCounter - 1];
        let card = document.getElementById(cardName);
        card.remove(cardName);
        hitCounter--;
    }

    //Resetting and hiding WinLose label
    winLoseLabel = document.getElementById("lblWinLose");
    winLoseLabel.innerHTML = "";
    winLoseLabel.hidden = true;

    //Hide PC hand total label
    let pcLabel = document.getElementById("lblPC");
    pcLabel.hidden = true;

    // Enable bet input
    document.getElementById("betAmount").disabled = false;
    
    // Set focus on input field and clear
    let input = document.getElementById("betAmount");
    input.value = '';
    input.focus();

    // Disable start game button until bet field has value
    let startButton = document.getElementById("btnStartGame");
    startButton.classList.add("disabled");
    startButton.disabled = false;
}

// Start new game by drawing 2 cards for PC & Player, 1 PC card hidden
function startGame(){
    placeBet();
    //Hide Start game Button
    toggleButton("btnStartGame", false);

    toggleButton("btnHit", true);
    toggleButton("btnStand", true);

    let buttonIDs = ["btnP1", "btnP2", "btnPC1", "btnPC2"];
    let pcPlayer = [1, 1, 0, 0];

    //Generate 4 cards
    for (let i = 0; i < buttonIDs.length; i++) {
        drawCard(buttonIDs[i], pcPlayer[i]);
    }

    winOrBust();

    // Set balance label with formatting
    let balanceLabel = document.getElementById("lblBalance");
    balanceLabel.innerHTML = balance;
    balanceLabel.innerHTML = balanceLabel.innerHTML.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Dissable bet input
    document.getElementById("betAmount").disabled = true;
}

// Draw new card, id = 0 for PC, id = 1 for Player
function hit(id){
    //Player or PC hit
    let parent;
    if(id === 0){
        parent = "pcCardArea";
    } else {
        parent = "playerCardArea";
    }

    // Create new button
    var btn = document.createElement("BUTTON");
    let cardID = "hit" + hitCounter.toString();
    btn.id = cardID;

    document.getElementById(parent).appendChild(btn);

    //Add to hitList
    hitList[hitCounter] = cardID;
    
    //Generate card
    drawCard(hitList[hitCounter], id);
    winOrBust();

    // Increment counter
    hitCounter++;
}

//Test for blackJack or Bust after hit
function winOrBust(stand){
    // IF - ELSE statements to avoid executing 2 if statements
    //Test for both blackjack = draw
    if((totals[1] === 21) && (totals[0] === 21)){
        payout(0);
        endGame("Draw! You both got BLACKJACK!");
    } else 
    //Test for player blackJack
    if(totals[1] === 21){
         if(playerHand.length === 2){
            payout(2);
            endGame("BLACKJACK! YOU WIN!");
         } else {
            payout(1);
            endGame("BLACKJACK! YOU WIN!");
         }           
    } else
    //Test for PC blackJack
    if(totals[0] === 21){
        endGame("You lose! PC got BLACKJACK!");
    } else
    //Test for player bust
    if(totals[1] > 21){
        if(minTotals[1] <= 21){
            convertAce(1);
            handTotal();
        } else {
            endGame("Bust!");
        }
    } else
    //Test for PC bust
    if(totals[0] > 21){
        if(minTotals[0] <= 21){
            convertAce(0);
            handTotal();
        } else {
            payout(1);
            endGame("You win! PC is bust!");
        }
    } else
    //If player is standing and less than PC total
    if((stand === true) && (totals[1] < totals[0])){
        endGame("PC wins!");
    } else
    //If player is standing and more than PC total
    if((stand === true) && (totals[0] < totals[1])){
        payout(1);
        endGame("Player wins!");
    } else
    //If player is standing and both hands are equal
    if((stand === true) && (totals[0] === totals[1])){
        payout(0);
        endGame("Draw, equal!");
    } else
    //PC has max 17 and Player is bigger
    if((stand === true) && (totals[0] >= 17) && (totals[1] > 17)){
        payout(1);
        endGame("You win!");
    } else
    //PC has max 17 and Player is smaller
    if((stand === true) && (totals[0] >= 17) && (totals[1] < 17)){
        endGame("You lose!");
    } else
    //PC has max 17 and player also has 17
    if((stand === true) && (totals[0] >= 17) && (totals[1] === totals[0])){
        payout(0);
        endGame("Draw!");
    }
}

// Main blackJack logic
function stand(){
    let pcTotal = totals[0];
    let playerTotal = totals[1];

    //Hide hit button
    toggleButton("btnHit", false);
    
    //Flip PC card 2 around
    flipCard();

    //Computer blackjack
    while ((pcTotal <= playerTotal) && (pcTotal < 17)){
        hit(0);       
        pcTotal = totals[0];
        playerTotal = totals[1];
    }

    winOrBust(true);

    //Show PC hand total
    let pcLabel = document.getElementById("lblPC");
    pcLabel.hidden = false;
}

//Flip PC card 2
function flipCard(){
    let card = document.getElementById("btnPC2");
    card.classList.remove("pcTwo");
    card.innerHTML = pcCardTwoSuit;
}

// Show PC total and winLose label
function endGame(message){
    let winLose = document.getElementById("lblWinLose");
    let pcLabel = document.getElementById("lblPC");

    flipCard();

    pcLabel.hidden = false;
    winLose.innerHTML = message;
    winLose.hidden = false;
    toggleButton("btnHit", false);
    toggleButton("btnStand", false);
    toggleButton("btnNewGame", true);
}

// Change Ace 11 to 1
function convertAce(id){
    let converted = false;

    if(id === 0){
        for(let i = 0; i < pcHand.length; i++){
            if(converted === false){
                if(pcHand[i] !== pcMinHand[i]){
                    pcHand[i] = pcMinHand[i];
                    converted = true;
                }
            }
        }
    } else {
        for(let i = 0; i < playerHand.length; i++){
            if(converted === false){
                if(playerHand[i] !== playerMinHand[i]){
                    playerHand[i] = playerMinHand[i];
                    converted = true;
                }
            }
        }
    } 
}

// Reduce Balance by bet amount
function placeBet(){
    let betAmount = document.getElementById("betAmount").value;
    let winningsLabel = document.getElementById("lblWinnings");

    // Display balance minus bet
    winningsLabel.innerHTML = "-" + betAmount.toString();
    winningsLabel.style.color = "red";

    // Set balance and pot
    balance = balance - betAmount;
    pot = betAmount;
}

// Return winnings to balance
// Pass 0 for draw, 1 for win, 2 for blackJack
function payout(type){
    if(winnings === 0){
        let balanceLabel = document.getElementById("lblBalance");
        let winningsLabel = document.getElementById("lblWinnings");
        let winningString = "";
    
        switch (type){
            case 0:
                winnings = Number(pot);
                break;
            case 1:
                winnings = pot * 2;
                break;
            case 2:
                winnings = ((pot * 2) + (pot * 0.5));
                break;
        }
        // Add winnings to balance and display balance with formatting
        balance = balance + winnings;
        balanceLabel.innerHTML = balance;
        balanceLabel.innerHTML = balanceLabel.innerHTML.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        winningString = "+" + winnings.toString();
        winningsLabel.style.color = "gold";
        winningsLabel.innerHTML = winningString;
    }
}

// Disabling / Enabling start game button if bet amount is input
function isEmpty(){
    let input = document.getElementById("betAmount");
    let startButton = document.getElementById("btnStartGame");
    if((input.value == 0) || (input.value > balance)){
        startButton.classList.add("disabled");
        input.style.color = "rgb(255, 74, 74)";
        //startButton.disabled = false;
    } else {
        startButton.classList.remove("disabled");
        input.style.color = "green";
    }
}