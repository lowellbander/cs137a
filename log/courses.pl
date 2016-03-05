
/* A set of facts about the CS department courses */

/* cs31 is an *atom*
   - uninterpreted symbol
   - like the constructors of Datums in hw2
     C
     
   an atom is a kind of *term*
*/

/* prereq is also an atom but is being treated
   as a predicate symbol */

/* prereq(cs31, cs32) is a *clause* */

prereq(cs31, cs32).   /* 1 */
prereq(cs32, cs33).   /* 2 */
prereq(cs31, cs35L).   /* 3 */
prereq(cs32, cs111).   /* 4 */
prereq(cs33, cs111).   /* 5 */
prereq(cs35L, cs111).   /* 6 */
prereq(cs32, cs118).   /* 7 */
prereq(cs33, cs118).   /* 8 */
prereq(cs35L, cs118).   /* 9 */
prereq(cs111, cs118).   /* 10 */
prereq(cs32, cs131).   /* 11 */
prereq(cs33, cs131).   /* 12 */
prereq(cs35L, cs131).   /* 13 */
prereq(cs32, cs132).   /* 14 */
prereq(cs35L, cs132).   /* 15 */
prereq(cs131, cs132).   /* 16 */
prereq(cs181, cs132).   /* 17 */

pre2(X,Y) :- prereq(X,Z), prereq(Z,Y).
pre2(X,Y) :- prereq(X,Y).

preTrans(X,Y) :- prereq(X,Y).
preTrans(X,Y) :- prereq(X,Z), preTrans(Z,Y).

/* term ::= var | atom | atom(term,...,term) */

/* example: lists

  cons(1, cons(2, nil))

  in our hw6 language, [1,2] is syntactic sugar

   example: integers in unary

   2 is sugar for succ(succ(zero))
*/

isList(nil).
isList(cons(_,Xs)) :- isList(Xs).

mylength(nil, zero).
mylength(cons(_,Xs), succ(L)) :- mylength(Xs, L).

/*

1. unification

takes two terms t1 and t2 and either
  - returns NO
  - returns a substitution s:
     mapping from variables to terms
     such that s(t1) is syntactically equal to
       s(t2)
     [s is the most general *unifier* of t1 and t2]

 a = a --> {}

 X = X --> {}

 X = t --> {X:t} if X does not appear in t

 t = X --> {X:t} if X does not appear in t

 [specialize to the case of a binary term]

 a(t1,t2) = a(t1',t2') -->
   let s1 be t1=t1'
   let s2 be t2=t2'
   return s1 U s2

 ELSE --> NO

 NOTE: the recursive case isn't exactly right

  - s1 U s2 may be contradictory
     f(X,a) = f(b,X)

     a solution: apply the partial substitution as
       you go

  - result should be in *solved form*:
    - any variable that appears in the domain of
      the resulting substitution 
      should not appear in the range

    f(X,a) = f(Y,Y)

    s1 = {X:Y}
    s2 = {Y:a}

    a solution: need to *chase* the constraints
    until things are in solved form


2. resolution

given a goal to be proven
 - initially the query

unify the goal with the head of a rule.
if it succeeds, replace the goal by the body
  of the rule
 - these are new goals to be proven using resolution


3. search order

when attempting resolution, try all rules in order from top to bottom

the overall search should be in depth-first order
(i.e., maintain a stack of goals to be proven)


*/
