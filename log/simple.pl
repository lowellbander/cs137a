

p(f(Y)) :- q(Y), r(Y).
p(b).
q(h(Z)) :- t(Z).
r(h(a)).
t(a).

/* resolution:

given a goal and a rule,
rewrite the rule with all fresh variables
unify the head of the rule with the goal
and produce a new set of goals

initial list of goals:  [p(X)]
unify p(X) with p(f(Y))
new list of goals: [q(Y), r(Y)]
unify q(Y) with q(h(Z))
new list of goals: [t(Z), r(Y)]
unify t(Z) with t(a)
new list of goals: [r(Y)]
unify r(Y) with r(h(a))
new list of goals: [] --> SOLUTION

*/