# Vulture
Helps you find code that is dead so you can eliminate it!

Development is ongoing so not posting anything very detailed about how to use,
but it is very likely that it will be the config file approach.

## Dead File Finding Strategy
At a high level, this is what we are doing...

### Follow From Roots
- given a set of roots, go through each file and
  - follow all imports, collecting file paths as you go
- once all files have been traversed, compare file list to all files in src


## Contributors Welcome!
