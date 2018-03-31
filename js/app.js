document.addEventListener("DOMContentLoaded", function() {
    const board = document.querySelector(".card-board");
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
    const foundCards = [];

    let player;
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

    const cardBoardGenerator = function(size) {
        let deck = createDeck(size);
        cardBoard = shuffleDeck(deck);
        createCards(size);
        console.log(`Board Generated`)
    };

    const flipCard = function(card) {
        if (card.className.includes("selected") &&
            !foundCards.includes((card))) {
            console.log("backflip!");
            card.classList.remove("selected");
            card.style.backgroundImage = null;

        }else {
            card.classList.add("selected");
            card.style.backgroundImage = `url(${imgStack[cardBoard[card.id]]})`;
        }

    };


    const endGame = function(type) {
        document.querySelector(`.${type}`).classList.remove("hidden");
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
                    foundCards.push(firstCard, secondCard);
                    if (foundCards.length >= 16) {
                        endGame("win");
                    }
                }else {
                    player.health -= 1;
                    if (player.health <= 0){
                        endGame("lose");
                    }
                    waiting = false;
                    await sleep(1000);
                    waiting = true;
                    flipCard(firstCard);
                    flipCard(secondCard);

                }
                [firstCard, secondCard] = [null, null]
            }
        }
    });

    //
    // Main
    //

    function main() {
        player = new Player("dor");
        cardBoardGenerator(16);
    }

    main();


    //
    // Timer
    //
});