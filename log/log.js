// -----------------------------------------------------------------------------
// Part I: Rule.prototype.makeCopyWithFreshVarNames() and
//         {Clause, Var}.prototype.rewrite(subst)
// -----------------------------------------------------------------------------

function tag(name) {
  return name += "foo";
}

function freshen(term) {
  if (term instanceof Clause) {
    return new Clause(term.name, term.args.map(t => freshen(t)));
  } else if (term instanceof Var) {
    return new Var(tag(term.name));
  } else {
    throw "a term must either be a clause or a variable";
  }
}

Rule.prototype.makeCopyWithFreshVarNames = function() {
  return new Rule(freshen(this.head), this.body.map(t => freshen(t)));
};

Clause.prototype.rewrite = function(subst) {
  throw new TODO('Clause.prototype.rewrite not implemented');
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

Subst.prototype.unify = function(term1, term2) {
  throw new TODO('Subst.prototype.unify not implemented');
};

// -----------------------------------------------------------------------------
// Part III: Program.prototype.solve()
// -----------------------------------------------------------------------------

Program.prototype.solve = function() {
  throw new TODO('Program.prototype.solve not implemented');
};

