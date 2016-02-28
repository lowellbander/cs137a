'use strict';

var classHierarchy = {};

function addClass(classname, superclass) {
  classHierarchy[classname] = superclass;
}

function getSuper(classname) {
  return classHierarchy[classname];
}

addClass("Obj", "Obj")

function trans(ast) {
  return ast.trans();
}

function create(classname, ...args) {
  var foo =  new classname();
  foo.init(...args);
  return foo;
}

function Obj() {};
Obj.prototype.init = function() {
      return this;
};

function Boxed() {};
Boxed.prototype.init = function (x) {this.m_x = x;};
Boxed.prototype.unbox = function() {
  return this.m_x;
}

function getType(lhs, rhs) {
  if (lhs instanceof Num && rhs instanceof Num) {
    return Num;
  } else {
    throw "unsupported or unmatching primitives: " + lhs + " " + rhs;
  }
}

Boxed.prototype["+"] = function (other) {
  return create(getType(this, other), this.m_x + other.m_x);
}

Boxed.prototype["-"] = function (other) {
  return create(getType(this, other), this.m_x - other.m_x);
}

Boxed.prototype["*"] = function (other) {
  return create(getType(this, other), this.m_x * other.m_x);
}

function Null() {};
Null.prototype = Object.create(Obj.prototype);

function Num() {};
Num.prototype = Object.create(Boxed.prototype);

Num.prototype.unbox = function() {
  return this.m_x;
}

function Str() {};
Str.prototype = Object.create(Obj.prototype);

function Bool() {};
Bool.prototype = Object.create(Obj.prototype);

function True() {};
True.prototype = Object.create(Bool.prototype);

function False() {};
False.prototype = Object.create(Bool.prototype);

function addUnboxing(str) {
  var arr = str.split(";");
  arr[arr.length - 2] += ".unbox()";
  return arr.join(";");
}

Program.prototype.trans = function() {
  var statements = this.ss.map(statement => statement.trans()).join("");

  function last(arr) {
    if (!(arr instanceof Array)) throw "last expects an array";
    return (arr.length === 0) ? null : arr[arr.length - 1];
  }

  return (last(this.ss) instanceof ExpStmt)
    ? addUnboxing(statements)
    : statements + "null;";
}

ExpStmt.prototype.trans = function(classname) {
  return this.e.trans(classname) + ";";
}

BinOp.prototype.trans = function(classname) {
  return "(" + this.e1.trans(classname) + "[\"" + this.op + "\"]("
    + this.e2.trans(classname) + "))";
}

function getClassnameForPrimitive(primitive) {
  switch(typeof primitive) {
    case "number":
      return Num.name;
    default:
      throw "unsupported primitive: " + primitive;
  }
}

Lit.prototype.trans = function() {

  var classname = getClassnameForPrimitive(this.primValue);

  switch (classname) {
    case Num.name:
      return "create(" + [Num.name].concat([this.primValue]).join(",") + ")";
    default:
      throw "unsupported primitive: " + this.primValue;
  }


  switch (typeof this.primValue) {
    case "number":
      return "((_ => {var foo = new Num(); foo.init(" + this.primValue
        + "); return foo;})())";
      debugger;
  }
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
    + ") {" + this.ss.map(s => s.trans(that.C)).join("") + " return this;};";
}

ClassDecl.prototype.trans = function(classname) {
  addClass(this.C, this.S);
  return "function " + this.C + "() {}; " +
    this.C + ".prototype = Object.create(" + this.S + ".prototype);";
}

Return.prototype.trans = function(classname) {
  return "return " + this.e.trans(classname) + ";";
}

New.prototype.trans = function(classname) {
  return "create("
    + [this.C].concat(this.es.map(e=>e.trans(classname))).join(",") + ")";
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

