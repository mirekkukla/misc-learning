'use strict';
var _ = require('ramda');
var Structs = require('./structures.js');

var Task = Structs.Task;
var Left = Structs.Left;
var Right = Structs.Right;
var Maybe = Structs.Maybe;
var Map = Structs.Map;

var curry = Structs.curry;
var safeHead = Structs.safeHead;
var map = Structs.map;
var compose = Structs.compose;
var always = Structs.always;


// Exercise 1
// ==========
// Use the traversable interface to change the type signature of
// `getJsons` to Map Route Route → Task Error (Map Route JSON)

// httpGet :: Route -> Task Error JSON
const httpGet = function httpGet(route) { return Task.of(`json for ${route}`); };

// routes :: Map Route Route
const routes = new Map({ '/': '/', '/about': '/about' });

// getJsons :: Map Route Route -> Map Route (Task Error JSON)
const getJsons = map(httpGet);

// SOLUTION
console.log("Exercise 1");


// Exercise 2
// ==========
// Using traversable, and the `validate` function, update `startGame` (and its signature) to only start the game if all players are valid

// validate :: Player -> Either String Player
const validate = player => (player.name ? Right.of(player) : Left.of('must have name'));

// startGame :: [Player] -> [Either Error String]
const startGame = compose(map(map(always('game started!'))), map(validate));

// SOLUTION
console.log("\nExercise 2");


// Exercise 3
// ==========
// Use traversable to rearrange and flatten the nested Tasks & Maybe

// readfile :: String -> String -> Task Error String
const readdir = function readdir(dir) {
  return Task.of(['file1', 'file2', 'file3']);
};

// readdir :: String -> Task Error [String]
const readfile = curry(function readfile(encoding, file) {
  return Task.of(`content of ${file} (${encoding})`);
});

// readFirst :: String -> Task Error (Maybe (Task Error String))
const readFirst = compose(map(map(readfile('utf-8'))), map(safeHead), readdir);

// SOLUTION
console.log("\nExercise 3");
