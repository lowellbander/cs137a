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
  return this.C + ".prototype." + this.m + " = function(" + this.xs.join(", ")
    + ") {" + this.ss.map(s => s.trans()).join("\n") + "return this;};";
}

ClassDecl.prototype.trans = function() {
  // var superProperties = classes[this.S].members;
  // var ownProperties = this.xs.filter(x => !(superProperties.includes(x)));
  // TODO: if this.m === init, call parent's init with "this" bound to the
  // new object i've just created

  // TODO: add class to hierarchy
  addClass(this.C, this.S, this.xs);
  debugger;

  return "function " + this.C + "() {};";
}

Return.prototype.trans = function() {
  return "return " + this.e.trans() + ";";
}

New.prototype.trans = function() {
  // TODO: instead of calling new, call Object.create(superclass)
  //var superclass = getSuper(this.C);
  //var s = "(() => {";
  //s += () "var foo = new " + this.C + "();" +
  //  + "foo.init(" + this.es.map(e => e.trans()).join(", ") +"); return foo;})()"

  return "(() => {var foo = new " + this.C + "(); foo.init("
    + this.es.map(e => e.trans()).join(", ") +"); return foo;})()"
}

Send.prototype.trans = function() {
  return this.erecv.trans() + "." + this.m
    + "(" + this.es.map(s=>s.trans()).join(", ") + ")";
}

InstVarAssign.prototype.trans = function() {
  return "this.m_" + this.x + " = " + this.e.trans() + ";";
}

InstVar.prototype.trans = function() {
  // TODO: verify this check actually works
  return "((\"m_" + this.x + "\" in this) "
    + "? this.m_" + this.x
    + " : (() => {throw \"accessing non-existent var\";})())";
}

This.prototype.trans = function() {
  return "this";
}

