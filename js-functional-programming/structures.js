'use strict';
var util = require('util');

// Data structures needed for exercises
// From https://github.com/MostlyAdequate/mostly-adequate-guide/blob/1c65a735a99cb66be6f502a6dd3dff0f66160490/support/index.js

// exported utils

// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
function curry(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
}


// exported structures

class Identity {
  constructor(x) {
    this.$value = x;
  }

  [util.inspect.custom]() {
    return `Identity(${inspect(this.$value)})`;
  }

  // ----- Pointed Identity
  static of(x) {
    return new Identity(x);
  }

  // ----- Functor Identity
  map(fn) {
    return Identity.of(fn(this.$value));
  }

  // ----- Applicative Identity
  ap(f) {
    return f.map(this.$value);
  }

  // ----- Monad Identity
  chain(fn) {
    return this.map(fn).join();
  }

  join() {
    return this.$value;
  }

  // ----- Traversable Identity
  sequence(of) {
    return this.traverse(of, identity);
  }

  traverse(of, fn) {
    return fn(this.$value).map(Identity.of);
  }
}

class Task {
  constructor(fork) {
    this.fork = fork;
  }

  [util.inspect.custom]() {
    return 'Task(?)';
  }

  static rejected(x) {
    return new Task((reject_, _) => reject_(x));
  }

  // ----- Pointed (Task a)
  static of(x) {
    return new Task((_, resolve) => resolve(x));
  }

  // ----- Functor (Task a)
  map(fn) {
    return new Task((reject_, resolve) => this.fork(reject_, compose(resolve, fn)));
  }

  // ----- Applicative (Task a)
  ap(f) {
    return this.chain(fn => f.map(fn));
  }

  // ----- Monad (Task a)
  chain(fn) {
    return new Task((reject_, resolve) => this.fork(reject_, x => fn(x).fork(reject_, resolve)));
  }

  join() {
    return this.chain(identity);
  }
}

class Maybe {
  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  get isJust() {
    return !this.isNothing;
  }

  constructor(x) {
    this.$value = x;
  }

  [util.inspect.custom]() {
    return this.isNothing ? 'Nothing' : `Just(${inspect(this.$value)})`;
  }

  // ----- Pointed Maybe
  static of(x) {
    return new Maybe(x);
  }

  // ----- Functor Maybe
  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }

  // ----- Applicative Maybe
  ap(f) {
    return this.isNothing ? this : f.map(this.$value);
  }

  // ----- Monad Maybe
  chain(fn) {
    return this.map(fn).join();
  }

  join() {
    return this.isNothing ? this : this.$value;
  }

  // ----- Traversable Maybe
  sequence(of) {
    this.traverse(of, identity);
  }

  traverse(of, fn) {
    return this.isNothing ? of(this) : fn(this.$value).map(Maybe.of);
  }
}

// internal utils

// identity :: x -> x
var identity = x => x;

// compose :: ((a -> b), (b -> c),  ..., (y -> z)) -> a -> z
var compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

// inspect :: a -> String
let inspect = (x) => {
  if (x && typeof x.inspect === 'function') {
    return x.inspect();
  }

  function inspectFn(f) {
    return f.name ? f.name : f.toString();
  }

  function inspectTerm(t) {
    switch (typeof t) {
      case 'string':
        return `'${t}'`;
      case 'object': {
        const ts = Object.keys(t).map(k => [k, inspect(t[k])]);
        return `{${ts.map(kv => kv.join(': ')).join(', ')}}`;
      }
      default:
        return String(t);
    }
  }

  function inspectArgs(args) {
    return Array.isArray(args) ? `[${args.map(inspect).join(', ')}]` : inspectTerm(args);
  }

  return (typeof x === 'function') ? inspectFn(x) : inspectArgs(x);
};


module.exports = {curry, Task, Identity, Maybe};
