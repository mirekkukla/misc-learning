'use strict';
var _ = require('ramda');
var Structs = require('./structures.js');

var curry = Structs.curry;
var either = Structs.either;
var map = Structs.map;
var prop = Structs.prop;
var compose = Structs.compose;

var Task = Structs.Task;
var Either = Structs.Either;
var Maybe = Structs.Maybe;

// Exercise 1
// ==========
// Write a natural transformation that converts `Either b a` to `Maybe a`

// SOLUTION
console.log("Exercise 1");

// eitherToMaybe :: Either b a -> Maybe a
const eitherToMaybe = undefined;




// Exercise 2
// ==========
// Using `eitherToTask`, simplify `findNameById` to remove the nested `Either`.

// eitherToTask :: Either a b -> Task a b
const eitherToTask = either(Task.rejected, Task.of);

// SOLUTION
console.log("\nExercise 2");

// findNameById :: Number -> Task Error (Either Error User)
const findNameById = compose(map(map(prop('name'))), findUserById);


// Exercise 3
// ==========
// Write the isomorphisms between String and [Char].

// split :: String -> String -> [String]
const split = curry((sep, str) => str.split(sep));

// intercalate :: String -> [String] -> String
const intercalate = curry((str, xs) => xs.join(str));

// SOLUTION
console.log("\nExercise 3");

// strToList :: String -> [Char]
const strToList = undefined;

// listToStr :: [Char] -> String
const listToStr = undefined;
