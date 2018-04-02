document.addEventListener("DOMContentLoaded", function() {
    const board = document.querySelector(".card-board");
    const playerState = document.querySelector(".health-avatar img");
    const imgStack = [
        "https://picsum.photos/200",
        "https://picsum.photos/201",
        "https://picsum.photos/202",
        "https://picsum.photos/203",
        "https://picsum.photos/204",
        "https://picsum.photos/205",
        "https://picsum.photos/206",
        "https://picsum.photos/207"
    ];
    const imgStackTemp = [];

    let player;
    let fullHealth;
    let firstCard;
    let secondCard;
    let cardBoard;
    let waiting = true;

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function createDeck(number) {
        console.log(`Creating ${number} cards!`);
        const deck = new Array(number);
        for (let i = 0 ; i < number/2 ; i++) {
            deck[i * 2] = i;
            deck[i * 2 + 1] = i;
        }
        return deck;
    }


    const changePlayerState = function() {
        if (player.health <= 0) {
            playerState.src = "assets/images/Dead Face.png";
            playerState.style.backgroundColor = "#999";
            endGame("lose");
        }else if (player.health <= fullHealth * 0.3) {
            playerState.src = "assets/images/Scary Face.png";
            playerState.style.background = "#FB000D";
        }else if (player.health <= fullHealth * 0.75) {
            playerState.src = "assets/images/Worried Face.png";
            playerState.style.background = "#FF8500";
        }else {
            playerState.src = "assets/images/Happy Face.png";
            playerState.style.background = "#22aa66";
        }
    };

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

    const createCards = function(number) {
        console.log(`Creating ${number} Cards!`);
        for (let i = 0; i < number ; i++) {
            const div = document.createElement("div");
            div.classList.add("play-card");
            div.id = `${i}`; // cardBoard[i]

            board.appendChild(div)
        }
    };

    const downloadImages = function() {
        for (const img of imgStack) {
            const oReq = new XMLHttpRequest();
            oReq.open("GET", img , true);
            oReq.responseType = "blob";

            oReq.onload = function() {
                imgStackTemp.push(oReq.response);
            };

            oReq.send();
        }
    };

    const cardBoardGenerator = function(size) {
        let deck = createDeck(size);
        cardBoard = shuffleDeck(deck);
        createCards(size);
        console.log(`Board Generated`)
    };

    const flipCard = function(card) {
        if (card.className.includes("selected") &&
            !player.foundCards.includes((card))) {
            card.classList.remove("selected");
            card.style = null;

        }else {
            card.classList.add("selected");
            const imgUrl = window.URL.createObjectURL(imgStackTemp[cardBoard[card.id]]);
            card.style.backgroundImage = `url(${imgUrl})`;
            card.style.backgroundRepeat = "no-repeat";
            card.style.backgroundSize = "cover";
            card.style.backgroundPosition = "center";
        }

    };


    const endGame = function(type) {
        clearInterval(player.time);
        for (const card of document.querySelectorAll(".card-board .play-card")){
            board.removeChild(card);
        }
        player.time = document.querySelector(".timer span").innerHTML;
        player.moves = document.querySelector(".moves span").innerHTML;
        document.querySelector(`.${type}`).classList.remove("hidden");
    };


    //////////////////
    // Timer
    /////////////////

    const startTimer = function() {
        const timer = document.querySelector(".timer span");
        let timerSeconds = 0;
        return setInterval(async function() {
            timerSeconds += 1;
            let M = Math.floor(timerSeconds / 60);
            let S = timerSeconds % 60;
            if (S < 10 && M < 10){
                timer.innerText = `0${M}:0${S}`
            }else if (S < 10){
                timer.innerText = `${M}:0${S}`
            }else if (M < 10) {
                timer.innerText = `0${M}:${S}`
            }else {
                timer.innerText = `${M}:${S}`
            }

            if (S % 15 === 0) {
                for (let i = 0; i <= 4 ; i++){
                    console.log("hit!");
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

    board.addEventListener("click", async function(event) {
        if (event.target.tagName === "DIV" &&
            event.target.className.includes("play-card") &&
            waiting) {
            const card = event.target;
            flipCard(card);
            if (firstCard == null){
                firstCard = card
            }else {
                secondCard = card;
                if (cardBoard[secondCard.id] === cardBoard[firstCard.id]) {
                    console.log("You found a match!");
                    firstCard.classList.add("matched");
                    secondCard.classList.add("matched");
                    player.foundCards.push(firstCard, secondCard);
                    if (player.foundCards.length >= 16) {
                        endGame("win");
                    }
                }else {
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
            }
        }
    });

    document.querySelector("#username").addEventListener("focus", function(event) {
        if(event.target.value.includes("Enter")) {
            event.target.value = "";
        }
    });

    document.querySelector("#username").addEventListener("blur", function(event) {
        if(event.target.value === "") {
            event.target.value = "Enter your name...";
        }
    });

    document.querySelector(".start-game-button").addEventListener("click", function() {
        document.querySelector(".pop-up.start").classList.add("hidden");
        if (document.querySelector("#username").value === "Enter your name..."){
            main("Guest");
        }else {
            main(document.querySelector("#username").value);
        }
    });

    document.querySelector("#restart-game").addEventListener("click", function() {
        clearInterval(player.time);
        for (const card of document.querySelectorAll(".card-board .play-card")){
            board.removeChild(card);
        }
        for (const popup of document.querySelectorAll(".card-board .pop-up")) {
            popup.classList.add("hidden");
        }
        document.querySelector(".pop-up.start").classList.remove("hidden");
    });

    //
    // Main
    //

    function main(name) {
        player = new Player(name);
        fullHealth = player.health;
        document.querySelector("#usernameDisplay").innerHTML = player.name;
        cardBoardGenerator(16);
        player.time = startTimer();
    }

    downloadImages();
});