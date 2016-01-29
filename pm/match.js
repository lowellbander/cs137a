'use strict';

function match(value, ...theArgs /* pat1, fun1, pat2, fun2, ... */) {
  var patFuns = toPatFuns(theArgs);
  for (var i = 0; i < patFuns.length; ++i) {
    var patFun = patFuns[i];
    var bindings = doMatch(value, patFun.pat);
    if (bindings !== null) {
      return patFun.fun(...bindings);
    }
  }
  throw "match failed";
}

function doMatch(value, pattern) {
  function doMatch_aux(value, pattern, bindings) {
    if (pattern === _) {
      var newBindings = bindings.slice();
      newBindings.push(value);
      return newBindings;
    } else {
      throw "unhandled pattern";
    }
  }
  return doMatch_aux(value, pattern, []);
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
      accumulator.push(new PatFun(first(l), second(l)));
      return toPatFuns_aux(rest(rest(l)), accumulator);
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

