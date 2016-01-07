'use strict';

function interp(ast) {
  var expression = ast.es[0];
  var result = expression.evaluate();
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

