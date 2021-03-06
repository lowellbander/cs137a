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

function Block() {};
Block.prototype = Object.create(Obj.prototype);
Block.prototype.init = function(fun) {
  this.fun = fun;
  return this;
};
Block.prototype.call = function (...args) {
  return this.fun(...args);
}

function Boxed() {};
Boxed.prototype.init = function (x) {this.m_x = x;};
Boxed.prototype.unbox = function() {
  return this.m_x;
}

Boxed.prototype["+"] = function (other) {
  var result = this.m_x + other.m_x;
  return create(getClassForPrimitive(result), result);
}

Boxed.prototype["-"] = function (other) {
  var result = this.m_x - other.m_x;
  return create(getClassForPrimitive(result), result);
}

Boxed.prototype["*"] = function (other) {
  var result = this.m_x * other.m_x;
  return create(getClassForPrimitive(result), result);
}

Boxed.prototype["/"] = function (other) {
  var result = this.m_x / other.m_x;
  return create(getClassForPrimitive(result), result);
}

Boxed.prototype["%"] = function (other) {
  var result = this.m_x % other.m_x;
  return create(getClassForPrimitive(result), result);
}

Boxed.prototype["<"] = function (other) {
  return (this.m_x < other.m_x) ? new True() : new False();
}

Boxed.prototype[">"] = function (other) {
  return (this.m_x > other.m_x) ? new True() : new False();
}

Boxed.prototype["=="] = function (other) {
  return (this.m_x == other.m_x) ? new True() : new False();
}

Boxed.prototype["!="] = function (other) {
  return (this.m_x != other.m_x) ? new True() : new False();
}

function Null() {};
Null.prototype = Object.create(Boxed.prototype);

function Num() {};
Num.prototype = Object.create(Boxed.prototype);

Num.prototype.unbox = function() {
  return this.m_x;
}

function Str() {};
Str.prototype = Object.create(Boxed.prototype);

function Bool() {};
Bool.prototype = Object.create(Boxed.prototype);

function True() {};
True.prototype = Object.create(Bool.prototype);
True.prototype.unbox = function() {
  return true;
}

function False() {};
False.prototype = Object.create(Bool.prototype);
False.prototype.unbox = function() {
  return false;
}

function addUnboxing(str) {
  var arr = str.split(";");
  arr[arr.length - 2] += ".unbox()";
  return arr.join(";");
}

function last(arr) {
  if (!(arr instanceof Array)) throw "last expects an array";
  return (arr.length === 0) ? null : arr[arr.length - 1];
}

Program.prototype.trans = function() {
  var statements = this.ss.map(statement => statement.trans()).join("");
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

function getClassForPrimitive(primitive) {
  switch(typeof primitive) {
    case "number":
      return Num;
    case "string":
      return Str;
    case "boolean":
      return Bool;
  }
  if (primitive === null) {
    return Null;
  } else {
    throw "unsupported primitive: " + primitive;
  }
}

var quoteWrap = str => "\"" + str + "\"";

Lit.prototype.trans = function() {
  var c = getClassForPrimitive(this.primValue);
  switch (c.name) {
    case Num.name:
      return "create(" + [c.name, this.primValue].join(",") + ")";
    case Str.name:
      return "create(" + [c.name, quoteWrap(this.primValue)].join(",") + ")";
    case Bool.name:
      return "create(" + ((this.primValue) ? "True" : "False") +")";
    case Null.name:
      return "create(" + c.name + ")";
    default:
      throw "unsupported primitive: " + this.primValue;
  }
}

VarDecl.prototype.trans = function(classname) {
  return "var " + this.x + " = " + this.e.trans(classname) + ";";
}

Var.prototype.trans = function() {
  return this.x;
}

MethodDecl.prototype.trans = function(classname) {
  var that = this;
  if (last(this.ss) instanceof ExpStmt) {
    this.ss.splice(this.ss.length - 1, 1, new Return(last(this.ss)));
  }
  return this.C + ".prototype[\"" + this.m
    + "\"] = function(" + this.xs.join(", ")
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
}

Send.prototype.trans = function(classname) {
  return this.erecv.trans(classname) + "." + this.m
    + "(" + this.es.map(s=>s.trans(classname)).join(", ") + ")";
}

BlockLit.prototype.trans = function(classname) {
  if (last(this.ss) instanceof ExpStmt) {
    this.ss.splice(this.ss.length - 1, 1, new Return(last(this.ss)));
  }
  return "create(Block, "
    + "(" + this.xs + ") => {"
    + this.ss.map(s => s.trans())
    + "})";
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

