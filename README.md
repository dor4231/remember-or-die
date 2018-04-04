# Remember or Die

A memory card game, with a great motivation to win, remember or die.

## How to play:
Read the story behind the game, put your name in the input field,
click on the Skull icon to enter the "Challenge mode".

#### Normal mode:
A game you cant lose and still get rated by the status avatar.

#### Challenge mode:
You have limited amount of incorrect guess to make before you lose
game and "die". Pay attention to the time, player will lose health
every 15 seconds.

## Technical Information:
While loading the page will download the images of the cards from "www.picsum.com"
and store the images in an array. If it fails to download the images please check 
your internet connection and refresh the page.

### Grunt:
#### Responsive Images:
Responsive Images is used to reduce the size of some images on the
project. Added to the default grunt configuration. Simply run 'grunt'
to generate the images in three sizes (large, medium and small).

In order to work you need to install "imagemagick" from [here](https://www.imagemagick.org/script/download.php).

*** Generated images add to the git repo. 

## Rating mechanism:
Based on the player avatar state the rating state changes.
 - Happy Face => 3 stars
 - Worried Face => 2 stars
 - Scary Face => 1 star
 - Dead Face => 0 stars - Available in Challenge mode only
 
## Known issues:
* Will look good only in landscape orientation.

## Browser support:

* Chrome - Recommended.
* IE - Not Supported.
