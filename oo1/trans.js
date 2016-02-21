'use strict';

var classes = {};

class Class {
  constructor(C, members) {
    if (!(typeof C === "string")) throw "classname must be string";
    if (!Array.isArray(members)) throw "members must be an array";
    for (var m in members) {
      if (!(typeof m === "string")) throw "members must be an array of strings";
    }

    this.C = C;
    this.members = members;
  }
}

classes.Obj = new Class("Obj", []);

function trans(ast) {
  return ast.trans();
}

Program.prototype.trans = function() {
  var statements = "function Obj() {};\n"
    + "Obj.prototype.init = () => {}\n";
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
  return (typeof this.primValue === "string")
    ? "\"" + this.primValue + "\""
    : this.primValue.toString();
}

VarDecl.prototype.trans = function() {
  return "var " + this.x + " = " + this.e.trans() + ";";
}

Var.prototype.trans = function() {
  return this.x;
}

MethodDecl.prototype.trans = function() {
  return this.C + ".prototype." + this.m + " = (" + this.xs.join(", ")
    + ") => {" + this.ss.map(s => s.trans()).join("\n")
    + ((this.m === "init") ? "return this;\n" : "") + "};";
}

ClassDecl.prototype.trans = function() {
  var superProperties = classes[this.S].members;
  var ownProperties = this.xs.filter(x => !(superProperties.includes(x)));
  return "function " + this.C + "("
    + superProperties.concat(ownProperties).join(", ") + ") {\n"
    + this.xs.map(x => "this." + x + " = " + x + ";\n").join("") + "}";
}

Return.prototype.trans = function() {
  return "return " + this.e.trans() + ";";
}

New.prototype.trans = function() {
  return "(() => {var foo = new " + this.C + "(); foo.init("
    + this.es.map(e => e.trans()).join(", ") +"); return foo;})()"
}

Send.prototype.trans = function() {
  return this.erecv.trans() + "." + this.m
    + "(" + this.es.map(s=>s.trans()).join(", ") + ")";
}

InstVarAssign.prototype.trans = function() {
  return "this." + this.x + " = " + this.e.trans() + ";";
}

InstVar.prototype.trans = function() {
  return "this." + this.x;
}

