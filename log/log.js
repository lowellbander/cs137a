// -----------------------------------------------------------------------------
// Part I: Rule.prototype.makeCopyWithFreshVarNames() and
//         {Clause, Var}.prototype.rewrite(subst)
// -----------------------------------------------------------------------------

function Term() {};
Term.prototype = Object.create(AST.prototype);
Var.prototype = Object.create(Term.prototype);
Clause.prototype = Object.create(Term.prototype);

Var.prototype.freshen = function() {
  var tag = name => name + "foo";
  return new Var(tag(this.name));
}

Clause.prototype.freshen = function() {
  return new Clause(this.name, this.args.map(t => t.freshen()));
}

Rule.prototype.makeCopyWithFreshVarNames = function() {
  return new Rule(this.head.freshen(), this.body.map(t => t.freshen()));
};

Clause.prototype.copy = function() {
  return new Clause(this.name, this.args);
}

Clause.prototype.rewrite = function(subst) {
  return (this.args.length === 0)
    ? this.copy()
    : new Clause(this.name, this.args.map(t => t.rewrite(subst)));
};

Var.prototype.copy = function() {
  return new Var(this.name);
}

Var.prototype.rewrite = function(subst) {
  var binding = subst.lookup(this.name);
  return (binding !== undefined) ? binding : this.copy();
};

// -----------------------------------------------------------------------------
// Part II: Subst.prototype.unify(term1, term2)
// -----------------------------------------------------------------------------

function invariant(condition, message) {
  if (message === undefined) message === "invariant violation";
  if (!condition) throw message;
}

function first(arr) {
  invariant(arr instanceof Array);
  return (arr.length === 0) ? null : arr[0];
}

function second(arr) {
  invariant(arr instanceof Array);
  invariant(arr.length >= 2);
  return arr[1];
}

function rest(arr) {
  invariant(arr instanceof Array);
  return arr.slice(1);
}

function zip(arr1, arr2) {
  invariant(arr1.length === arr2.length, "differing args length");
  return (arr1.length === 0)
    ? []
    : [[first(arr1), first(arr2)]].concat(zip(rest(arr1), rest(arr2)));
}

Subst.prototype.solvedForm = function() {
  for (var key in this.bindings) {
    this.bind(key, this.lookup(key).rewrite(this))
  }
  return this;
}

Subst.prototype.unify = function(term1, term2) {
  // TODO: ensure result is in solved form (variables in domain not in range)
  // TODO: occurs check? is this the same thing?
  // TODO: check against multiple bindings to same variable
  if (__equals__(term1, term2)) {
    return this;
  } else if (term1 instanceof Var) {
    this.bind(term1.name, term2);
  } else if (term2 instanceof Var) {
    this.bind(term2.name, term1);
  } else if (term1 instanceof Clause && term2 instanceof Clause) {
    invariant(term1.name === term2.name, "clauses with diff names cant unify");
    zip(term1.args, term2.args).map(t => this.unify(first(t), second(t)));
  } else {
    throw "a term is either a clause or a variable";
  }
  return this.solvedForm();
};

// -----------------------------------------------------------------------------
// Part III: Program.prototype.solve()
// -----------------------------------------------------------------------------

Program.prototype.solve = function() {
  throw new TODO('Program.prototype.solve not implemented');
};

