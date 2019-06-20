'use strict';
var _ = require('ramda');
var Structs = require('./structures.js');

var Maybe = Structs.Maybe;
var IO = Structs.IO;
var Task = Structs.Task;

var identity = Structs.identity;
var chain = Structs.chain;
var map = Structs.map;

// Exercise 1
// ==========
// Use safeProp and map/join or chain to safely get the street name when given
// a user.

var safeProp = _.curry(function(x, o) {
  return Maybe.of(o[x]);
});
var user = {
  id: 2,
  name: 'albert',
  address: {
    street: {
      number: 22,
      name: 'Walnut St',
    },
  },
};

// SOLUTION
console.log("Exercise 1");
var ex1 = _.compose(
  chain(safeProp("name")),
  chain(safeProp("street")),
  safeProp("address")
  );

console.log(ex1(user)); // Just('Walnut St')
console.log(ex1({})); // Nothing
console.log(ex1({address: {}})); // Nothing
console.log(ex1({address: {street: {}}})); // Nothing
console.log(ex1({address: {street: {name: "Spokane"}}})); // Just('Spokane')


// Exercise 2
// ==========
// Use getFile to get the filename, remove the directory so it's just the file,
// then purely log it.

var getFile = function() {
  return new IO(function() {
    return __filename;
  });
};

var pureLog = function(x) {
  return new IO(function() {
    console.log(x);
    return 'logged ' + x;
  });
};

// SOLUTION
console.log("Exercise 2");
var ex2 = _.compose(
  chain(pureLog),
  map(_.last),
  map(_.split("/")),
  getFile
  );

console.log(ex2().unsafePerformIO()); // chapter8.js \n logged chapter8.js


// Exercise 3
// ==========
// Use getPost() then pass the post's id to getComments().
//
var getPost = function(i) {
  return new Task(function(rej, res) {
    setTimeout(function() {
      res({
        id: i,
        title: 'Love them tasks',
      });
    }, 300);
  });
};

var getComments = function(i) {
  return new Task(function(rej, res) {
    setTimeout(function() {
      res([{
        post_id: i,
        body: 'This book should be illegal',
      }, {
        post_id: i,
        body: 'Monads are like smelly shallots',
      }]);
    }, 300);
  });
};


// SOLUTION
console.log("Exercise 3");
var ex3 = _.compose(
  map(console.log),
  chain(getComments),
  map(_.prop("id")),
  getPost
  );

ex3(7).fork(identity, identity); // [{post_id: 7, body: 'This book should be illegal'}, <second item>]


// Exercise 4
// ==========
// Use validateEmail, addToMailingList, and emailBlast to implement ex4's type
// signature.

//  addToMailingList :: Email -> IO([Email])
var addToMailingList = (function(list) {
  return function(email) {
    return new IO(function() {
      list.push(email);
      return list;
    });
  };
})([]);

function emailBlast(list) {
  return new IO(function() {
    return 'emailed: ' + list.join(',');
  });
}

var validateEmail = function(x) {
  return x.match(/\S+@\S+\.\S+/) ? (new Right(x)) : (new Left('invalid email'));
};

//  ex4 :: Email -> Either String (IO String)
var ex4 = undefined;
