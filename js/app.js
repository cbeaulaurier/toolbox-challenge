
"use strict";

var firstClicked;
var tileBack = 'img/tile-back.png';

$(document).ready(function() {
    var tiles = [];
    var idx;

    var matched;
    var missed;
    var remaining = 8;

    var matchedStats = $('#matched');
    var missedStats = $('#missed');
    var remainingStats = $('#remaining');

    // create tiles array
    for (idx = 1; idx <= 32; ++idx) {
        tiles.push({
            tileNum: idx,
            src: 'img/tile' + idx + '.jpg'
        });
    }

    // shuffle tiles
    console.log(tiles);
    var shuffledTiles = _.shuffle(tiles);
    console.log(shuffledTiles);

    // select first 8 tiles
    var selectedTiles = shuffledTiles.slice(0, 8);
    console.log(selectedTiles);

    // create pairs of selected tiles
    var tilePairs = [];
    _.forEach(selectedTiles, function(tile) {
        tilePairs.push(_.clone(tile));
        tilePairs.push(_.clone(tile));
    });
    tilePairs = _.shuffle(tilePairs);
    console.log(tilePairs);

    // add selected tile pairs to game board

    var gameBoard = $('#game-board');
    var row = $(document.createElement('div'));
    var img;
    _.forEach(tilePairs, function(tile, elemIndex) {
        if (elemIndex > 0 && !(elemIndex % 4)) {
            gameBoard.append(row);
            row = $(document.createElement('div'));
        }

        img = $(document.createElement('img'));
        img.attr({
            src: tileBack,
            alt: 'image of tile ' + tile.tileNum
        });
        img.data('tile', tile);
        row.append(img);
    });
    gameBoard.append(row);

    // on image click
    $('#game-board img').click(function() {
        var img = $(this);

        if (!this.flipped) {
            flipTile(img);
        }
        if (firstClicked) {     // if second phase of turn
            if (firstClicked == this.tileNum)  {  // matched case
                matched++;
                matchedStats.innerHTML = "Matches: " + matched;
                remaining--;
                remainingStats.innerHTML = "Remaining: " + remaining;
            } else {    // not matched
                missed++;
                missedStats.innerHTML = "Missed: " + missed;
                window.setTimeout(function() {
                    flipTile(img);
                    flipTile(firstClicked);
                }, 1000);
                    this.flipped = !this.flipped;
                }
        } else {    // first phase of turn
            this.flipped = !this.flipped;
        }
    }); // on click of gameboard images


    // create timer
    var startTime = _.now();
    var timer = window.setInterval(function() {
        var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
        $('#elapsed-seconds').text("Timer: " + elapsedSeconds + "s");
    }, 1000);
}); // jQuery ready function

function flipTile(img) {
    var tile = img.data('tile');
    img.fadeOut(100, function() {
        if (tile.flipped) {
            img.attr('src', tileBack);
            firstClicked = null;
        } else {
            img.attr('src', tile.src);
            firstClicked = tile;
        }
        img.fadeIn(100);
        });
}