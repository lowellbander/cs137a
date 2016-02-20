'use strict';

function trans(ast) {
  debugger;
  return ast.trans();
}

Program.prototype.trans = function() {
  var statements = this.ss.map(statement => statement.trans()).join('\n');

  function last(arr) {
    if (!(arr instanceof Array)) throw "last expects an array";
    return (arr.length === 0) ? null : arr[arr.length - 1];
  }

  if (!(last(this.ss) instanceof ExpStmt)) statements += "null;";

  return statements;
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

VarDecl.prototype.trans = function() {
  return "var " + this.x + " = " + this.e.trans() + ";";
}

