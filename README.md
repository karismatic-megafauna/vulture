# Vulture
Helps you find code that is dead so you can eliminate it!

# TODO
Find all files that aren't used in a project (harder):
- [ ] given a directory go through each file and
  - [ ] search all the other files in the directory are importing this file
    - [ ] return true if you find a reference
    - [ ] return false if you don't
- [ ] once all files have been searched, use built up data to display to user

