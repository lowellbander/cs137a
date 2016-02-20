'use strict';

function trans(ast) {
  return ast.trans();
}

Program.prototype.trans = function() {
  var statements = "function Obj() {};\n"
  statements += this.ss.map(statement => statement.trans()).join('\n');

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

Var.prototype.trans = function() {
  return this.x;
}

MethodDecl.prototype.trans = function() {
  return this.C + ".prototype." + this.m + " = (" + this.xs.join(", ")
    + ") => {" + this.ss.map(s => s.trans()).join("\n") + "};";
}

Return.prototype.trans = function() {
  return "return " + this.e.trans() + ";";
}

New.prototype.trans = function() {
  return "(new " + this.C + "(" + this.es.map(e => e.trans()).join(", ") + "))";
}

Send.prototype.trans = function() {
  return this.erecv.trans() + "." + this.m
    + "(" + this.es.map(s=>s.trans()).join(", ") + ")";
}

