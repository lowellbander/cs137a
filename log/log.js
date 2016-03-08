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

var invariant = (condition, message) => {if (!condition) throw message};

Subst.prototype.unify = function(term1, term2) {
  // TODO: ensure result is in solved form (variables in domain not in range)
  // TODO: occurs check? is this the same thing?
  debugger;
  if (__equals__(term1, term2)) {
    return this;
  } else if (term1 instanceof Var) {
    return this.bind(term1.name, term2);
  } else if (term2 instanceof Var) {
    return this.bind(term2.name, term1);
  } else if (term1 instanceof Clause && term2 instanceof Clause) {
    // zip the args, map on the list.
    invariant(term1.args.length === term2.args.length, "differing args length");
    throw "not done yet";
  } else {
    throw "a term is either a clause or a variable";
  }
};

// -----------------------------------------------------------------------------
// Part III: Program.prototype.solve()
// -----------------------------------------------------------------------------

Program.prototype.solve = function() {
  throw new TODO('Program.prototype.solve not implemented');
};

