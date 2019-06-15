'use strict';
var _ = require('ramda');
var Structs = require('./structures.js');

var curry = Structs.curry;
var Task = Structs.Task;
var Identity = Structs.Identity;
var Maybe = Structs.Maybe;


// Exercise 1
// ==========
// Use _.add(x,y) and _.map(f,x) to make a function that increments a value
// inside a functor.

// SOLUTION
var ex1 = function(functor) {
  return _.map(_.add(1), functor);
};

console.log("Exercise 1");
console.log(ex1(Identity.of(1))); // Identity(2)


// Exercise 2
// ==========
// Use _.head to get the first element of the list.
var xs = Identity.of(['do', 'ray', 'me', 'fa', 'so', 'la', 'ti', 'do']);

// SOLUTION
console.log("\nExercise 2");
console.log(xs.map(_.head)); // Identity('do')


// Exercise 3
// ==========
// Use safeProp and _.head to find the first initial of the user.
var safeProp = _.curry(function(x, o) {
  return Maybe.of(o[x]);
});

var user = {
  id: 2,
  name: 'Albert',
};

// SOLUTION
var firstInitial = (u) => safeProp('name', u).map(_.head);
console.log("\nExercise 3");
console.log(firstInitial(user)); // Just('A')
console.log(firstInitial({})); // Nothing


// Exercise 4
// ==========
// Use Maybe to rewrite ex4 without an if statement.

var ex4 = function(n) {
  if (n) {
    return parseInt(n);
  }
};

// SOLUTION
var ex4_s = (n) => Maybe.of(n).map(parseInt);

console.log("\nExercise 4");
console.log(ex4_s("2")); // Just(2)
console.log(ex4_s("a")); // Just(Nan)
console.log(ex4_s(null)); // Nothing


// Exercise 5
// ==========
// Write a function that will getPost then toUpperCase the post's title.

// getPost :: Int -> Future({id: Int, title: String})
var getPost = function(i) {
  return new Task(function(rej, res) {
    setTimeout(function() {
      res({
        id: i,
        title: 'Love them futures',
      });
    }, 300);
  });
};

var ex5 = undefined;

process.exit();


// Exercise 6
// ==========
// Write a function that uses checkActive() and showWelcome() to grant access
// or return the error.

var showWelcome = _.compose(_.concat( "Welcome "), _.prop('name'));

var checkActive = function(user) {
  return user.active ? Right.of(user) : Left.of('Your account is not active');
};

var ex6 = undefined;



// Exercise 7
// ==========
// Write a validation function that checks for a length > 3. It should return
// Right(x) if it is greater than 3 and Left("You need > 3") otherwise.

var ex7 = function(x) {
  return undefined; // <--- write me. (don't be pointfree)
};



// Exercise 8
// ==========
// Use ex7 above and Either as a functor to save the user if they are valid or
// return the error message string. Remember either's two arguments must return
// the same type.

var save = function(x) {
  return new IO(function() {
    console.log('SAVED USER!');
    return x + '-saved';
  });
};

var ex8 = undefined;
