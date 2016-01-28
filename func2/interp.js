'use strict';

// env is a stack of assignments
var env = [];

function interp(ast) {
  var result = ast.evaluate();
  env = [];
  return result;
}

Let.prototype.evaluate = function() {
  var frame = {};
  var e1 = this.e1.evaluate();
  frame[this.x] = e1;
  env.push(frame);
  if (e1 instanceof Closure) {
    env.push(e1.env);
  }
  var result = this.e2.evaluate();
  env.pop();
  return result;
}

Var.prototype.evaluate = function() {
  // find the value in the stack and return it if it exists
  for (var i = env.length - 1; i >= 0; --i) {
    if (this.x in env[i]) {
      return env[i][this.x];
    }
  }
  throw "undefined variable: " + this.x;
}

Fun.prototype.evaluate = function() {
  return {
    xs: this.xs,
    e: this.e,
  };
}

Datum.prototype.evaluate = function() {
  //debugger;
  var members = [];
  this.es.forEach(e => members.push(e.evaluate()));
  this.es = members;
  return this;
}

Call.prototype.evaluate = function() {
  var fun = this.ef.evaluate();
  if (this.es.length > fun.xs.length) {
    throw "passed too many args to function";
  }
  var frame = {};
  for (var i = 0; i < fun.xs.length; ++i) {
    frame[fun.xs[i]] = this.es[i].evaluate();
  }
  if (fun.e instanceof Fun) {
    var innerFun = fun.e;
    return new Closure(
      innerFun.xs,
      innerFun.e,
      frame
    );
  } else {
    env.push(frame);
    if (fun instanceof Closure) {
      env.push(fun.env);
    }
    var result = fun.e.evaluate();
    env.pop();
    return result;
  }
}

Closure.prototype.evaluate = function() {
  throw "Closure evaluation not yet implemented"
}

Val.prototype.evaluate = function() {
  return this.primValue;
}

BinOp.prototype.evaluate = function() {

  var e1 = this.e1.evaluate();
  var e2 = this.e2.evaluate();

  switch (this.op) {
    case '*':
    case '+':
    case '-':
    case '/':
    case '<':
    case '>':
    case '%':
      if (typeof e1 !== 'number' ||
          typeof e2 !== 'number') {
	throw "args to arithmetic and relational operators must be numbers"
      }
      break;
    case '||':
    case '&&':
      if (typeof e1 !== 'boolean' ||
          typeof e2 !== 'boolean') {
	throw "args to arithmetic and relational operators must be numbers"
      }
  }

  switch (this.op) {
    case '*':
      return e1 * e2;
    case '+':
      return e1 + e2;
    case '-':
      return e1 - e2;
    case '/':
      return e1 / e2;
    case '<':
      return e1 < e2;
    case '>':
      return e1 > e2;
    case '=':
      return e1 === e2;
    case '!=':
      return e1 !== e2;
    case '||':
      return e1 || e2;
    case '&&':
      return e1 && e2;
    case '%':
      return e1 % e2;
    default:
      throw "unidentified binomial operator";
  }
}

If.prototype.evaluate = function() {
  return this.e1.evaluate() ? this.e2.evaluate() : this.e3.evaluate();
}

var first = function(arr) {
  if (!(arr instanceof Array)) {throw "arr must be an array";}
  return (arr.length === 0) ? null : arr[0];
}

var second = function(arr) {
  if (!(arr instanceof Array)) throw "arr must be an array";
  if (arr.length < 2) throw "second must be called on an array of length >= 2";
  return (arr.length < 2) ? null : arr[1];
}

var rest = function(arr) {
  return arr.slice(1);
}

var consToArray = function(cons) {
  return (cons.C === "Nil")
    ? []
    : [first(cons.es)].concat(consToArray(second(cons.es)));
}

var arrayToCons = function(arr) {
  return (arr.length === 0)
    ? new Datum("Nil", [])
    : new Datum("Cons", [first(arr), arrayToCons(rest(arr))]);
};

var assign = function(name, value) {
  var frame = {};
  frame[name] = value;
  env.push(frame);
}

ListComp.prototype.evaluate = function() {
  var elist = consToArray(this.elist.evaluate());
  var values = [];
  elist.forEach(function(element) {
    assign(this.x, element);
    values.push(this.e.evaluate());
  }, this);
  return arrayToCons(values);
}

