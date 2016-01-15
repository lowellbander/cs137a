'use strict';

function interp(ast) {
  return ast.evaluate();
}

// env is a stack of assignments
var env = [];

Let.prototype.evaluate = function() {
  var frame = {};
  frame[this.x] = this.e1.evaluate();
  env.push(frame);
  return this.e2.evaluate();
}

Var.prototype.evaluate = function() {
  // find the value in the stack and return it;
  for (var i = env.length - 1; i >= 0; --i) {
    if (this.x in env[i]) {
      return env[i][this.x];
    }
  }
}

Val.prototype.evaluate = function() {
  return this.primValue;
}

BinOp.prototype.evaluate = function() {
  debugger;
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

