document.addEventListener("DOMContentLoaded", function () {
    const board = document.querySelector(".card-board");
    const playerState = document.querySelector(".health-avatar img");
    const imgStack = [
        "https://picsum.photos/200",
        "https://picsum.photos/210",
        "https://picsum.photos/220",
        "https://picsum.photos/230",
        "https://picsum.photos/240",
        "https://picsum.photos/250",
        "https://picsum.photos/260",
        "https://picsum.photos/270"
    ];
    const imgStackResponse = [];

    // Declaring global variables to change later
    let player;
    let fullHealth;
    let firstCard;
    let secondCard;
    let cardBoard;
    let challenge = false;
    let waiting = true;

    // Waiting the number of "ms" (milliseconds) passed as an argument
    const sleep = function(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

    // Creating an array of number pairs from 1 to "number"/2
    // For example: createDeck(4) => [1,1,2,2]
    const createDeck = function(number) {
        console.log(`Creating ${number} cards!`);
        const deck = new Array(number);
        for (let i = 0; i < number / 2; i++) {
            deck[i * 2] = i;
            deck[i * 2 + 1] = i;
        }
        return deck;
    };

    // Changing the player state depending on the wrong guess he make
    // If user choose "Challenging Mode" the he can lose the game and die
    const changePlayerState = function () {
        if (player.health <= 0 && challenge) {
            playerState.src = "assets/images/Dead Face.png";
            playerState.style.backgroundColor = "#999";
            player.rating = "☆☆☆";
            endGame("lose");
        } else if (player.health <= fullHealth * 0.2) {
            playerState.src = "assets/images/Scary Face.png";
            playerState.style.background = "#FB000D";
            player.rating = "★☆☆";
        } else if (player.health <= fullHealth * 0.5) {
            playerState.src = "assets/images/Worried Face.png";
            playerState.style.background = "#FF8500";
            player.rating = "★★☆";
        } else {
            playerState.src = "assets/images/Happy Face.png";
            playerState.style.background = "#22aa66";
        }
    };

    // Gets an array and return a shuffled one
    // That's how I generate different card board every time.
    const shuffleDeck = function (array) {
        console.log(`Shuffling ${array.length} cards!`);
        let currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    };

    // Creating and appending the cards into th card-board (the document).
    const createCards = function (deck) {
        const fragment = document.createDocumentFragment()
        for (let i = 0; i < deck.length; i++) {
            const div = document.createElement("div");
            div.classList.add("play-card");
            div.id = `${i}`;

            fragment.appendChild(div);
        }
        board.appendChild(fragment);
    };

    // Creating and HTTP GET request to get the images from the array "imgStack"
    // I save the reposed images as binaries blob to save them in memory.
    // That way we avoid the multiple GET requests every the user flips a card.
    // Other reason is that the images may change from time to time and can be
    // change during the game.
    const downloadImages = function () {
        for (const img of imgStack) {
            const oReq = new XMLHttpRequest();
            oReq.open("GET", img, true);
            oReq.responseType = "blob";

            oReq.onload = function () {
                imgStackResponse.push(oReq.response);
            };

            oReq.send();
        }
    };

    // Flips the card
    const flipCard = function (card) {
        if (card.className.includes("selected") &&
            !player.foundCards.includes((card))) {
            card.classList.remove("selected");
            card.style = null;

        } else {
            card.classList.add("selected");
            const imgUrl = window.URL.createObjectURL(imgStackResponse[cardBoard[card.id]]);
            card.style.backgroundImage = `url(${imgUrl})`;
            card.style.backgroundRepeat = "no-repeat";
            card.style.backgroundSize = "cover";
            card.style.backgroundPosition = "center";
        }
    };

    // Compare the two cards if matched add cards to foundCards
    // if not matched flip cards over and lose life. Cards will stay visible
    // For one second. While card are visible user can't flip other cards.
    const compereCards = async function () {
        if (cardBoard[secondCard.id] === cardBoard[firstCard.id]) {
            firstCard.classList.add("matched");
            secondCard.classList.add("matched");
            player.foundCards.push(firstCard, secondCard);
            if (player.foundCards.length >= cardBoard.length) {
                return endGame("win");
            }
        } else {
            player.health -= 1;
            changePlayerState();
            waiting = false;
            await sleep(1000);
            waiting = true;
            flipCard(firstCard);
            flipCard(secondCard);
        }
        player.moves += 1;
        changePlayerState();
        document.querySelector(".moves span").innerHTML = player.moves;
        [firstCard, secondCard] = [null, null]
    };

    // Clearing the interval, rising winning and losing pop-up and clear the card board.
    const endGame = function (type) {
        clearInterval(player.time);
        for (const card of document.querySelectorAll(".card-board .play-card")) {
            board.removeChild(card);
        }
        player.time = document.querySelector(".timer span").innerHTML;
        const playerRating = document.querySelector(`.${type} .rating`);
        const winMassage = document.querySelector(".win .massage");

        playerRating.innerHTML = `Your Rating: ${player.rating}`;
        winMassage.innerHTML = `You can walk free now. You did it in <span>${player.moves}</span> moves and it took ${player.time}. Good Job!`;
        document.querySelector(`.${type}`).classList.remove("hidden");
    };

    const cardBoardGenerator = function (size) {
        // Create the cards deck, shuffle it and pu into the global "cardBoard" variable.
        cardBoard = shuffleDeck(createDeck(size));
        // Creating cards as the length of card board.
        createCards(cardBoard);
    };


    //////////////////
    // Timer
    /////////////////

    const startTimer = function (losingHealth) {
        const timer = document.querySelector(".timer span");
        let timerSeconds = 0;
        return setInterval(async function () {
            timerSeconds += 1;
            let M = Math.floor(timerSeconds / 60);
            let S = timerSeconds % 60;

            // Formatting the timer to be like: 01:05 instead of 1:5
            if (S < 10) S = `0${S}`;
            if (M < 10) M = `0${M}`;
            timer.innerText = `${M}:${S}`;

            // Player losing health every "losingHealth" seconds
            if (S % losingHealth === 0) {
                for (let i = 0; i <= 4; i++) {
                    timer.style.color = "#1a1a1a";
                    await sleep(200);
                    timer.style.color = null;
                    await sleep(200);
                }
                player.health -= 1;
                changePlayerState();
            }
        }, 1000);
    };

    //
    // Event Listeners
    //

    board.addEventListener("click", function (event) {
        const card = event.target;
        if (card.className.includes("play-card")
            && waiting
            && card !== firstCard
            && card !== secondCard) {
            flipCard(card);
            if (firstCard == null) {
                firstCard = card
            } else if (secondCard == null) {
                secondCard = card;
                compereCards();
            } else {
                console.log("Too Many Clicks!");
            }
        }
    });

    document.querySelector("#username").addEventListener("focus", function (event) {
        if (event.target.value.includes("Enter")) {
            event.target.value = "";
        }
    });

    document.querySelector("#username").addEventListener("blur", function (event) {
        if (event.target.value === "") {
            event.target.value = "Enter your name...";
        }
    });

    document.querySelector(".start-game-button").addEventListener("click", function () {
        document.querySelector(".pop-up.start").classList.add("hidden");
        if (document.querySelector("#username").value === "Enter your name...") {
            main("Guest");
        } else {
            main(document.querySelector("#username").value);
        }
    });

    // Resets the game: timer, avatar, timer, move count, clear card-board and pop-ups
    // Rises back the "Start Game" pop-up.
    document.querySelector("#restart-game").addEventListener("click", function () {
        clearInterval(player.time);
        player.health = fullHealth;
        document.querySelector(".timer span").innerHTML = "00:00";
        document.querySelector(".moves span").innerHTML = "0";
        changePlayerState();
        for (const card of document.querySelectorAll(".card-board .play-card")) {
            board.removeChild(card);
        }
        for (const popup of document.querySelectorAll(".card-board .pop-up")) {
            popup.classList.add("hidden");
        }
        document.querySelector(".pop-up.start").classList.remove("hidden");
        [firstCard, secondCard] = [null, null];
    });

    //////////////
    // Main
    /////////////

    function main(name) {
        player = new Player(name);
        fullHealth = player.health;
        if (document.querySelector("#challenge").checked) {
            challenge = true;
        }
        document.querySelector("#usernameDisplay").innerHTML = player.name;
        cardBoardGenerator(16);
        player.time = startTimer(player.losingHealth);
    }

    downloadImages();
});