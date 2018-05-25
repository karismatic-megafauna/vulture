# Vulture
Helps you find dead files! Cawwww!

## Installation
Currently, it's a bit cumbersome as I am working on getting the name of the
package `vulture` from another package of the same name that is no longer being
worked on.

## Development
For local dev, follow these steps!

At the root of the package:

1. npm link
1. yarn start

You should now be able to use the `vulture` command.

## Dead File Finding Strategy
At a high level, this is what we are doing...

### Follow From Roots
- given a set of roots, go through each file and
  - follow all imports, collecting file paths as you go
- once all files have been traversed, compare file list to all files in src


Contributors Welcome!
