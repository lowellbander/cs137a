'use strict';

function interp(ast) {
  return ast.evaluate();
}

Val.prototype.evaluate = function() {
  return this.primValue;
}

BinOp.prototype.evaluate = function() {
  switch (this.op) {
    case '*':
      var result = this.e1.evaluate() * this.e2.evaluate();
      return result;
    case '+':
      var result = this.e1.evaluate() + this.e2.evaluate();
      return result;
    case '-':
      var result = this.e1.evaluate() - this.e2.evaluate();
      return result;
    case '/':
      var result = this.e1.evaluate() / this.e2.evaluate();
      return result;
    default:
      throw "unidentified binomial operator";
  }
}

