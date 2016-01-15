'use strict';

function interp(ast) {
  return ast.evaluate();
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

