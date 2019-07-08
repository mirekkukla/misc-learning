'use strict';
var _ = require('ramda');
var Structs = require('./structures.js');

var curry = Structs.curry;
var IO = Structs.IO;


// Exercise 1
// ==========
// Write a function that adds two possibly null numbers together using `Maybe` and `ap`.

// safeAdd :: Maybe Number -> Maybe Number -> Maybe Number
const safeAdd = undefined;


// Exercise 2
// ==========
// Rewrite `safeAdd` from exercise_b to use `liftA2` instead of `ap`.

// safeAdd :: Maybe Number -> Maybe Number -> Maybe Number
const safeAdd2 = undefined;


// Exercise 3
// ==========
// Write an IO that gets both player1 and player2 from the cache and starts the game.

const localStorage = {
  player1: { id:1, name: 'Albert' },
  player2: { id:2, name: 'Theresa' },
};

// getFromCache :: String -> IO User
const getFromCache = x => new IO(() => localStorage[x]);

// game :: User -> User -> String
const game = curry((p1, p2) => `${p1.name} vs ${p2.name}`);

// startGame :: IO String
const startGame = undefined;
