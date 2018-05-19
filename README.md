# Vulture
Helps you find code that is dead so you can eliminate it!

## TODO
Decide between these two strategies

### Look at Every File
- [ ] given a directory go through each file and
  - [ ] search all the other files in the directory are importing this file
    - [ ] return true if you find a reference
    - [ ] return false if you don't
- [ ] once all files have been searched, use built up data to display to user

### Follow From Roots
- [ ] given a set of roots, go through each file and
  - [ ] follow all imports, collecting file names as you go
- [ ] once all files have been traversed, compare file list to all files in src

