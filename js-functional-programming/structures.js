'use strict';
var _ = require('ramda');
var util = require('util');

// Data structures needed for exercises
// From https://github.com/MostlyAdequate/mostly-adequate-guide/blob/1c65a735a99cb66be6f502a6dd3dff0f66160490/support/index.js


// exported utils

// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
var curry = function(fn) {
  const arity = fn.length;

  return function $curry(...args) {
    if (args.length < arity) {
      return $curry.bind(null, ...args);
    }

    return fn.call(null, ...args);
  };
};

// identity :: x -> x
var identity = x => x;

// map :: Functor f => (a -> b) -> f a -> f b
var map = curry((fn, f) => f.map(fn));

// from chapter 7, NOT "index.js"
var either = curry(function(f, g, e) {
  switch (e.constructor) {
    case Left:
      return f(e.__value);
    case Right:
      return g(e.__value);
  }
});

//  chain :: Monad m => (a -> m b) -> m a -> m b
var chain = curry(function(f, m){
  return m.map(f).join(); // or compose(join, map(f))(m)
});

const liftA2 = curry((g, f1, f2) => f1.map(g).ap(f2));

// prop :: String -> Object -> a
const prop = curry((p, obj) => obj[p]);

// compose :: ((a -> b), (b -> c),  ..., (y -> z)) -> a -> z
var compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

const always = curry(function always(a, b) { return a; });

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
  static of(x) {
    return new Maybe(x);
  }

  get isNothing() {
    return this.$value === null || this.$value === undefined;
  }

  get isJust() {
    return !this.isNothing;
  }

  constructor(x) {
    this.$value = x;
  }

  ap(f) {
    return this.isNothing ? this : f.map(this.$value);
  }

  chain(fn) {
    return this.map(fn).join();
  }

  inspect() {
    return this.isNothing ? 'Nothing' : `Just(${inspect(this.$value)})`;
  }

  getType() {
    return `(Maybe ${this.isJust ? getType(this.$value) : '?'})`;
  }

  join() {
    return this.isNothing ? this : this.$value;
  }

  map(fn) {
    return this.isNothing ? this : Maybe.of(fn(this.$value));
  }

  sequence(of) {
    return this.traverse(of, x => x);
  }

  traverse(of, fn) {
    return this.isNothing ? of(this) : fn(this.$value).map(Maybe.of);
  }
}

class IO {
  constructor(fn) {
    this.unsafePerformIO = fn;
  }

  [util.inspect.custom]() {
    return 'IO(?)';
  }

  // ----- Pointed IO
  static of(x) {
    return new IO(() => x);
  }

  // ----- Functor IO
  map(fn) {
    return new IO(compose(fn, this.unsafePerformIO));
  }

  // ----- Applicative IO
  ap(f) {
    return this.chain(fn => f.map(fn));
  }

  // ----- Monad IO
  chain(fn) {
    return this.map(fn).join();
  }

  join() {
    return new IO(() => this.unsafePerformIO().unsafePerformIO());
  }
}

const capitalize = s => `${s[0].toUpperCase()}${s.substring(1)}`;

const getType = (x) => {
  if (x === null) {
    return 'Null';
  }

  if (typeof x === 'undefined') {
    return '()';
  }

  if (Array.isArray(x)) {
    return `[${x[0] ? getType(x[0]) : '?'}]`;
  }

  if (typeof x.getType === 'function') {
    return x.getType();
  }

  if (x.constructor && x.constructor.name) {
    return x.constructor.name;
  }

  return capitalize(typeof x);
};

class Map {
  constructor(x) {
    this.$value = x;
  }

  inspect() {
    return `Map(${inspect(this.$value)})`;
  }

  getType() {
    const sample = this.$value[Object.keys(this.$value)[0]];

    return `(Map String ${sample ? getType(sample) : '?'})`;
  }

  insert(k, v) {
    const singleton = {};
    singleton[k] = v;
    return new Map(Object.assign({}, this.$value, singleton));
  }

  reduce(fn, zero) {
    return this.reduceWithKeys((acc, _, k) => fn(acc, k), zero);
  }

  reduceWithKeys(fn, zero) {
    return Object.keys(this.$value)
      .reduce((acc, k) => fn(acc, this.$value[k], k), zero);
  }

  map(fn) {
    return new Map(this.reduceWithKeys((obj, v, k) => {
      obj[k] = fn(v); // eslint-disable-line no-param-reassign
      return obj;
    }, {}));
  }

  sequence(of) {
    return this.traverse(of, x => x);
  }

  traverse(of, fn) {
    return this.reduceWithKeys(
      (f, a, k) => fn(a).map(b => m => m.insert(k, b)).ap(f),
      of(new Map({}))
    );
  }
}


// The chapter 7 exercises use the simple in-chapter "Left" and "Right"
// impementations, and don't work the fancy ones given in the "support" folder

var Left = function(x) {
  this.__value = x;
  // I added this
  this[util.inspect.custom] = () => `Left(${inspect(this.__value)})`;
};

Left.of = function(x) {
  return new Left(x);
};

Left.prototype.map = function(f) {
  return this;
};

var Right = function(x) {
  this.__value = x;
  // I added this
  this[util.inspect.custom] = () => `Right(${inspect(this.__value)})`;
};

Right.of = function(x) {
  return new Right(x);
};

Right.prototype.map = function(f) {
  return Right.of(f(this.__value));
};


// internal utils

function namedAs(value, fn) {
  Object.defineProperty(fn, 'name', { value });
  return fn;
}

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

// depend on class declaration first

const safeHead = namedAs('safeHead', compose(Maybe.of, _.head));

module.exports = {curry, identity, either, chain, map, liftA2, prop, compose, always, safeHead, Task, Identity, Maybe, Left, Right, IO, Map};
