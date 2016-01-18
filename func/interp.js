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
  frame[this.x] = this.e1.evaluate();
  env.push(frame);
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
  debugger;
  return {
    xs: this.xs,
    e: this.e,
  };
}

Call.prototype.evaluate = function() {
  var fun = this.ef.evaluate();
  var frame = {};
  for (var i = 0; i < fun.xs.length; ++i) {
    frame[fun.xs[i]] = this.es[i].evaluate();
  }
  env.push(frame);
  var result = fun.e.evaluate();
  env.pop();
  return result;
}

Val.prototype.evaluate = function() {
  return this.primValue;
}

BinOp.prototype.evaluate = function() {
  switch (this.op) {
    case '*':
      return this.e1.evaluate() * this.e2.evaluate();
    case '+':
      return this.e1.evaluate() + this.e2.evaluate();
    case '-':
      return this.e1.evaluate() - this.e2.evaluate();
    case '/':
      return this.e1.evaluate() / this.e2.evaluate();
    case '<':
      return this.e1.evaluate() < this.e2.evaluate();
    case '>':
      return this.e1.evaluate() > this.e2.evaluate();
    case '=':
      return this.e1.evaluate() === this.e2.evaluate();
    case '!=':
      return this.e1.evaluate() !== this.e2.evaluate();
    case '||':
      return this.e1.evaluate() || this.e2.evaluate();
    case '&&':
      return this.e1.evaluate() && this.e2.evaluate();
    case '%':
      return this.e1.evaluate() % this.e2.evaluate();
    default:
      throw "unidentified binomial operator";
  }
}

If.prototype.evaluate = function() {
  return this.e1.evaluate() ? this.e2.evaluate() : this.e3.evaluate();
}

