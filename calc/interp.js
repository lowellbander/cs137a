'use strict';

var env = {};

function interp(ast) {
  var result;
  for (var i = 0; i < ast.es.length; ++i) {
    result = ast.es[i].evaluate();
  }
  env = {};
  return result;
}

Num.prototype.evaluate = function() {
  return this.n;
}

Add.prototype.evaluate = function() {
  return this.e1.evaluate() + this.e2.evaluate();
}

Sub.prototype.evaluate = function() {
  return this.e1.evaluate() - this.e2.evaluate();
}

Mul.prototype.evaluate = function() {
  return this.e1.evaluate() * this.e2.evaluate();
}

Div.prototype.evaluate = function() {
  return this.e1.evaluate() / this.e2.evaluate();
}

Pow.prototype.evaluate = function() {
  return Math.pow(this.e1.evaluate(), this.e2.evaluate());
}

Ref.prototype.evaluate = function() {
  if (this.x in env) {
    return env[this.x];
  } else {
    return 0;
  }
}

Assign.prototype.evaluate = function() {
  return env[this.x] = this.e.evaluate();
}

