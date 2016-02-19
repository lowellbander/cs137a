// Tests for Part II

tests(O,
  {
    name: 'thenElse (1/2)',
    code: 'def True then: tb else: fb = tb.call();\n' +
          'def False then: tb else: fb = fb.call();\n' +
          '1 > 2 then: {111} else: {222}',
    expected: 222
  },
  {
    name: 'thenElse (2/2)',
    code: 'def True then: tb else: fb = tb.call();\n' +
          'def False then: tb else: fb = fb.call();\n' +
          '1 < 2 then: {111} else: {222}',
    expected: 111
  },
  {
    name: 'non-local return (1/2)',
    code: 'def True then: tb else: fb = tb.call();\n' +
          'def False then: tb else: fb = fb.call();\n\n' +
          'def Num.fact() {\n' +
          '  this == 0\n' +
          '    then: { return 1; }\n' +
          '    else: { return this * (this - 1).fact(); }\n' +
          '}\n\n' +
          '5.fact()',
    expected: 120
  },
  {
    name: 'non-local return (2/2)',
    code: 'def Obj.m() {\n' +
          '  var b = { return 5; };\n' +
          '  return this.n(b) * 2;\n' +
          '}\n\n' +
          'def Obj.n(aBlock) {\n' +
          '  aBlock.call();\n' +
          '  return 42;\n' +
          '}\n\n' +
          'new Obj().m()',
    expected: 5
  }
);

