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
    let cardBoard;


    function createDeck(number) {
        console.log(`Creating ${number} cards!`);
        const deck = new Array(number);
        for (let i = 0 ; i < number/2 ; i++) {
            deck[i * 2] = i +1;
            deck[i * 2 + 1] = i +1;
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
            div.classList.add("card");
            div.classList.add(cardBoard[i]);

            board.appendChild(div)
        }
    };

    const cardBoardGenerator = function(size) {
        let deck = createDeck(size);
        cardBoard = shuffleDeck(deck);
        createCards(size);
        console.log(`Board Generated`)
    };



    cardBoardGenerator(16);

    //
    // Event Listeners
    //

    board.addEventListener("click", function(event) {
        if (event.target.tagName === "DIV") {

        }
    })
});