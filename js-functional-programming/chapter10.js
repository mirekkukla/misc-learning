'use strict';
var _ = require('ramda');
var Structs = require('./structures.js');

var curry = Structs.curry;
var liftA2 = Structs.liftA2;
var IO = Structs.IO;
var Maybe = Structs.Maybe;

// Exercise 1
// ==========
// Write a function that adds two possibly null numbers together using `Maybe` and `ap`.

// SOLUTION
console.log("Exercise 1");

// safeAdd :: Maybe Number -> Maybe Number -> Maybe Number
const safeAdd = function(a, b) {
  return Maybe.of(_.add).ap(Maybe.of(a)).ap(Maybe.of(b));
};

console.log(safeAdd(1, 2)); // Just(3)
console.log(safeAdd(1, null)); // Nothing


// Exercise 2
// ==========
// Rewrite `safeAdd` from exercise_b to use `liftA2` instead of `ap`.

// SOLUTION
console.log("\nExercise 2");

// safeAdd :: Maybe Number -> Maybe Number -> Maybe Number
const safeAdd2 = function(a, b) {
  return liftA2(_.add, Maybe.of(a), Maybe.of(b));
};

console.log(safeAdd2(2, 3)); // Just(5)
console.log(safeAdd2(null, 3)); // Nothing


// Exercise 3
// ==========
// Write an IO that gets both player1 and player2 from the cache and starts the game.

const localStorage = {
  player1: { id: 1, name: 'Albert' },
  player2: { id: 2, name: 'Theresa' },
};

// getFromCache :: String -> IO User
const getFromCache = x => new IO(() => localStorage[x]);

// game :: User -> User -> String
const game = curry((p1, p2) => `${p1.name} vs ${p2.name}`);

// SOLUTION
console.log("\nExercise 3");

// startGame :: IO String
const startGame = liftA2(game, getFromCache('player1'), getFromCache('player2'));

console.log(startGame.unsafePerformIO()); // Albert vs Theresa
process.exit();

