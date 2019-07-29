'use strict';
var _ = require('ramda');
var Structs = require('./structures.js');

var curry = Structs.curry;
var either = Structs.either;
var map = Structs.map;
var prop = Structs.prop;
var compose = Structs.compose;
var identity = Structs.identity;
var chain = Structs.chain;

var Task = Structs.Task;
var Left = Structs.Left;
var Right = Structs.Right;
var Maybe = Structs.Maybe;

// Exercise 1
// ==========
// Write a natural transformation that converts `Either b a` to `Maybe a`

// SOLUTION
console.log("Exercise 1");

// eitherToMaybe :: Either b a -> Maybe a
const eitherToMaybe = either(Maybe.of, Maybe.of);

console.log(eitherToMaybe(Left.of("Derp"))); // Just("Derp")
console.log(eitherToMaybe(Right.of("Derp"))); // Just("Derp")
console.log(eitherToMaybe(Right.of(null))); // Nothing


// Exercise 2
// ==========
// Using `eitherToTask`, simplify `findNameById` to remove the nested `Either`.

// eitherToTask :: Either a b -> Task a b
const eitherToTask = either(Task.rejected, Task.of);

const albert = {
  id: 1,
  active: true,
  name: 'Albert',
  address: {
    street: {
      number: 22,
      name: 'Walnut St',
    },
  },
};

const gary = {
  id: 2,
  active: false,
  name: 'Gary',
  address: {
    street: {
      number: 14,
    },
  },
};

const theresa = {
  id: 3,
  active: true,
  name: 'Theresa',
};

const findUserById = function findUserById(id) {
  switch (id) {
    case 1:
      return Task.of(Right.of(albert));
    case 2:
      return Task.of(Right.of(gary));
    case 3:
      return Task.of(Right.of(theresa));
    default:
      return Task.of(Left.of('not found'));
  }
};

// SOLUTION
console.log("\nExercise 2");

// findNameById :: Number -> Task Error (Either Error User)
const findNameById = compose(map(map(prop('name'))), findUserById);
console.log(findNameById(1).fork(identity, identity)); // Right("Albert")
console.log(findNameById(4).fork(identity, identity)); // Left("not found")


const findNameByIdNew = compose(map(prop('name')), chain(eitherToTask), findUserById);
console.log(findNameByIdNew(1).fork(identity, identity)); // Albert
console.log(findNameByIdNew(4).fork(identity, identity)); // Nothing

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
const strToList = split("");

// listToStr :: [Char] -> String
const listToStr = (list) => intercalate("", list);

const x = "123";
const y = ["a", "b", "c"];
console.log(listToStr(strToList(x))); // "123"
console.log(strToList(listToStr(y))); // ["a", "b", "c"]
