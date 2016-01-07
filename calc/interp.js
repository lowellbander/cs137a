'use strict';

function interp(ast) {
  var result;
  for (var i = 0; i < ast.es.length; ++i) {
    result = ast.es[i].evaluate();
  }
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

