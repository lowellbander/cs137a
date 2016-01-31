'use strict';

function pred(predicate) {
  return {
    type: 'predicate',
    predicate: predicate,
  };
}

function instof(c, ...pattern) {
  return {
    type: 'instance',
    class: c,
    pattern: pattern,
  };
}

Object.prototype.deconstruct = () => ([]);

function match(value, ...theArgs /* pat1, fun1, pat2, fun2, ... */) {
  var patFuns = toPatFuns(theArgs);
  for (var i = 0; i < patFuns.length; ++i) {
    var patFun = patFuns[i];
    var bindings = doMatch(value, patFun.pat);
    if (bindings !== null) {
      if (bindings.length !== patFun.fun.length)
        throw "arity mismatch: expected " + bindings.length
          + " but got " + patFun.fun.length;
      return patFun.fun(...bindings);
    }
  }
  throw "match failed";
}

function doMatch(value, pattern) {
  function doMatch_aux(value, pattern, bindings) {
    if (pattern === _) {
      return bindings.concat(value);
    } else if (pattern instanceof Array) {
      if (!(value instanceof Array)) return null;
      if (value.length === 0 && pattern.length === 0) return bindings;
      var firstBindings = doMatch_aux(first(value), first(pattern), bindings);
      if (firstBindings === null) return null;
      return doMatch_aux(rest(value), rest(pattern), firstBindings);
    } else if (pattern instanceof Object && 'type' in pattern) {
      switch (pattern.type) {
        case 'predicate':
          return pattern.predicate(value)
            ? bindings.concat(value)
            : null;
        case 'instance':
          var classBindings = doMatch(
            pattern.class.prototype.deconstruct.call(value),
            pattern.pattern
          );
          return (classBindings === null)
            ? null
            : bindings.concat(classBindings);
        default:
          throw "bad fun type: " + pattern.type;
      }
    } else {
      // assume pattern is literal
      return (value === pattern)
        ? bindings
        : null;
    }
  }
  return doMatch_aux(value, pattern, []);
}

function functionName(fun) {
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

function first(arr) {
  if (!(arr instanceof Array)) {throw "arr must be an array";}
  return (arr.length === 0) ? null : arr[0];
}

function second(arr) {
    if (!(arr instanceof Array)) throw "arr must be an array";
    if (arr.length < 2)
      throw "second must be called on an array of length >= 2";
    return (arr.length < 2) ? null : arr[1];
}

var rest = function(arr) {
  return arr.slice(1);
}

function toPatFuns(l) {
  if (l.length % 2 !== 0) throw "toPatFuns expects even input";
  function toPatFuns_aux(l, accumulator) {
    if (l.length === 0)
      return accumulator;
    else {
      return toPatFuns_aux(
        rest(rest(l)),
        accumulator.concat(new PatFun(first(l), second(l)))
      );
    }
  }
  return toPatFuns_aux(l, []);
}

class PatFun {
  constructor(pat, fun) {
    this.pat = pat;
    this.fun = fun;
  }
}

var _ = "wildcard";

