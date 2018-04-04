class Player {
    constructor(name) {
        this.name = name;
        this.health = 15;
        this.moves = 0;
        this.rating = "★★★";
        this.time = null;
        this.foundCards = [];
        this.losingHealth = 15;
    }
}