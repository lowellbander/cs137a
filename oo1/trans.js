'use strict';

function trans(ast) {
  debugger;
  return ast.trans();
}

Program.prototype.trans = function() {
  return this.ss.map(statement => statement.trans()).join('\n');
}

ExpStmt.prototype.trans = function() {
  return this.e.trans() + ";";
}

BinOp.prototype.trans = function() {
  return "(" + this.e1.trans() + " " + this.op + " " + this.e2.trans() + ")";
}

Lit.prototype.trans = function() {
  return this.primValue.toString();
}

