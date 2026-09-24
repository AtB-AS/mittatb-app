@AGENTS.md

# Comments

Write a comment only when the code cannot carry the information itself.
Before writing one, check:

- Locality: does this belong on THIS symbol? Constraints on how callers
  must behave belong at the call site or, better, in code that enforces
  them (a type, a flag the dispatcher reads, a test). A rule written
  where it can't be seen by the person who'd break it is not documentation.
- Volatility: will this be wrong in six months without anyone noticing?
  Incident history, lists of current upstream quirks, counts, dates and
  "we tried X" belong in the commit message or a linked issue, not in
  the file. Link, don't inline.
- Non-obviousness: if the comment restates the signature or the name,
  delete it.

Reasoning belongs in the commit message and PR description, not the source. 
Those are dated by construction; source comments are not.
