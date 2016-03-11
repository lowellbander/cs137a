tests(
  JS,
  {
    name: 'unify(Var, Clause)',
    code: 'new Subst().unify(new Var("X"),\n' +
          '                  new Clause("foo", []));',
    expected: new Subst().bind("X", new Clause("foo", []))
  },
  {
    name: 'unify(Clause, Var)',
    code: 'new Subst().unify(new Clause("foo", []),\n' +
          '                  new Var("X"));',
    expected: new Subst().bind("X", new Clause("foo", []))
  },
  {
    name: 'unify(Var, Var)',
    code: 'var s = new Subst().unify(new Var("X"),\n' +
          '                          new Var("Y"));\n' +
          'var ans1 = new Subst().bind("X", new Var("Y"));\n' +
          'var ans2 = new Subst().bind("Y", new Var("X"));\n' +
          '__equals__(s, ans1) || __equals__(s, ans2);',
    expected: true
  },
  {
    name: 'unify(Clause, Clause) (1/5)',
    code: 'new Subst().unify(new Clause("foo", []),\n' +
          '                  new Clause("foo", []));',
    expected: new Subst()
  },
  {
    name: 'unify(Clause, Clause) (2/5)',
    code: 'new Subst().unify(new Clause("foo", []),\n' +
          '                  new Clause("bar", []));',
    shouldThrow: true
  },
  {
    name: 'unify(Clause, Clause) (3/5)',
    code: 'new Subst().unify(new Clause("foo", [new Var("X")]),\n' +
          '                  new Clause("foo", [new Clause("bar", [new Clause("baz", [])])]));',
    expected: new Subst().bind("X", new Clause("bar", [new Clause("baz", [])]))
  },
  {
    name: 'unify(Clause, Clause) (4/5)',
    code: 'new Subst().unify(new Clause("foo", [new Var("X"), new Clause("baz", [])]),\n' +
          '                  new Clause("foo", [new Clause("bar", []), new Var("Y")]));',
    expected: new Subst().bind("X", new Clause("bar", []))
                         .bind("Y", new Clause("baz", []))
  },
  {
    name: 'unify(Clause, Clause) (5/5)',
    code: 'new Subst().unify(new Clause("f", [new Var("X"), new Var("Y")]),\n' +
          '                  new Clause("f", [new Clause("a", []), new Var("X")]));',
    expected: new Subst().bind("X", new Clause("a", []))
                         .bind("Y", new Clause("a", []))
  },
  {
    name: 'unify(Clause, Clause) X->a, X->b',
    code: 'new Subst().unify(new Clause("f", [new Var("X"), new Var("X")]),\n' +
          '                  new Clause("f", [new Clause("a", []), new Clause("b", [])]));',
    shouldThrow: true
  },
  {
    name: 'unify(Clause, Clause) X->a[a,b], X->a[b,a]',
    code: 'new Subst().unify(new Clause("f", [new Var("X"), new Var("X")]),\n' +
          '                  new Clause("f", [new Clause("a", [new Clause("a", []), new Clause("b", [])]), new Clause("a", [new Clause("b", []), new Clause("a", [])])]));',
    shouldThrow: true
  },
  {
    name: 'unify(Clause, Clause) X->a[Y,b], X->a[b,a]',
    code: 'new Subst().unify(new Clause("f", [new Var("X"), new Var("X")]),\n' +
          '                  new Clause("f", [new Clause("a", [new Var("Y"), new Clause("b", [])]), new Clause("a", [new Clause("b", []), new Clause("a", [])])]));',
    expected: new Subst().bind("X", new Clause("a", [new Clause("b", []), new Clause("a", [])]))
                         .bind("Y", new Clause("b", []))
  },
  {
    name: 'unify(Clause, Clause) X->a, X->Y',
    code: 'new Subst().unify(new Clause("f", [new Var("X"), new Var("X")]),\n' +
          '                  new Clause("f", [new Clause("a", []), new Var("Y")]));',
    expected: new Subst().bind("X", new Clause("a", []))
                         .bind("Y", new Clause("a", []))
  },
  {
    name: 'unify(Clause, Clause) X->a, Y->X',
    code: 'new Subst().unify(new Clause("f", [new Var("X"), new Var("Y")]),\n' +
          '                  new Clause("f", [new Clause("a", []), new Var("X")]));',
    expected: new Subst().bind("X", new Clause("a", []))
                         .bind("Y", new Clause("a", []))
  },
  {
    name: 'unify(Clause, Clause) solvedForm',
    code: 'new Subst().unify(new Clause("f", [new Var("Z"), new Var("X"), new Var("Y")]),\n' +
          '                  new Clause("f", [new Var("Y"), new Clause("a", []), new Var("X")]));',
    expected: new Subst().bind("X", new Clause("a", []))
                         .bind("Y", new Clause("a", []))
                         .bind("Z", new Clause("a", []))
  },
  {
    name: 'unify(Clause, Clause) diff lengths',
    code: 'new Subst().unify(new Clause("f", [new Var("X")]),\n' +
          '                  new Clause("f", [new Clause("a", []), new Var("X")]));',
    shouldThrow: true
  }
);

