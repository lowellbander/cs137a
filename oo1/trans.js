'use strict';

var classes = {};

class Class {
  constructor(classname, superclass, members) {
    if (!(typeof classname === "string")) throw "classname must be string";
    if (!(typeof superclass === "string")) throw "superclass must be string";
    if (!Array.isArray(members)) throw "members must be an array";
    for (var m in members) {
      if (!(typeof m === "string")) throw "members must be an array of strings";
    }

    this.classname = classname;
    this.superclass = superclass;
    this.members = members;
  }
}

function addClass(classname, superclass, members) {
  var newClass = new Class(classname, superclass, members);
  classes[classname] = newClass;
}

function getSuper(classname) {
  return classes[classname].superclass;
}

addClass("Obj", "Obj", [])

function trans(ast) {
  return ast.trans();
}

Program.prototype.trans = function() {
  var statements = "function Obj() {};\n"
    + "Obj.prototype.init = () => {return this;}\n";
  statements += this.ss.map(statement => statement.trans()).join('\n');

  function last(arr) {
    if (!(arr instanceof Array)) throw "last expects an array";
    return (arr.length === 0) ? null : arr[arr.length - 1];
  }

  if (!(last(this.ss) instanceof ExpStmt)) statements += "null;";

  return statements;
}

ExpStmt.prototype.trans = function(classname) {
  return this.e.trans(classname) + ";";
}

BinOp.prototype.trans = function(classname) {
  return "(" + this.e1.trans(classname) + " " + this.op + " "
    + this.e2.trans(classname) + ")";
}

Lit.prototype.trans = function() {
  return (typeof this.primValue === "string")
    ? "\"" + this.primValue + "\""
    : this.primValue.toString();
}

VarDecl.prototype.trans = function(classname) {
  return "var " + this.x + " = " + this.e.trans(classname) + ";";
}

Var.prototype.trans = function() {
  return this.x;
}

MethodDecl.prototype.trans = function(classname) {
  var that = this;
  return this.C + ".prototype." + this.m + " = function(" + this.xs.join(", ")
    + ") {" + this.ss.map(s => s.trans(that.C)).join("\n") + "return this;};";
}

ClassDecl.prototype.trans = function(classname) {
  // var superProperties = classes[this.S].members;
  // var ownProperties = this.xs.filter(x => !(superProperties.includes(x)));

  addClass(this.C, this.S, this.xs);
  return "function " + this.C + "() {}; " +
    this.C + ".prototype = Object.create(" + this.S + ".prototype);";
}

Return.prototype.trans = function(classname) {
  return "return " + this.e.trans(classname) + ";";
}

New.prototype.trans = function(classname) {
  return "(() => {var foo = new " + this.C + "(); foo.init("
    + this.es.map(e => e.trans(classname)).join(", ") +"); return foo;})()"
}

Send.prototype.trans = function(classname) {
  return this.erecv.trans(classname) + "." + this.m
    + "(" + this.es.map(s=>s.trans(classname)).join(", ") + ")";
}

InstVarAssign.prototype.trans = function(classname) {
  return "this.m_" + this.x + " = " + this.e.trans(classname) + ";";
}

InstVar.prototype.trans = function() {
  return "((\"m_" + this.x + "\" in this) "
    + "? this.m_" + this.x
    + " : (() => {throw \"accessing non-existent var\";})())";
}

This.prototype.trans = function() {
  return "this";
}

SuperSend.prototype.trans = function(classname) {
  var superclass = getSuper(classname);
  return superclass + ".prototype." + this.m + ".call("
    + ["this"].concat(this.es.map(s=>s.trans(classname))).join(", ") + ")";
}

