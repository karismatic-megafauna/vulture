# Vulture
Helps you find dead files! 

🍖🦅Cawww 🦅🍖

## Installation
Clone this repo

I am working on getting the name of the package `vulture` from another package
of the same name that is no longer being worked on. Then it would be through NPM

## Usage
~~ IN PROGRESS, suspect to change ~~

Currently, you must pass in a configuration file that has these keys:

```js
module.exports = {
  project: process.cwd(), // path to project
  sourceDir: `${process.cwd()}/src` // path to source,
  entryPoints: [
    `${process.cwd()}/src/index.js`, // path(s) to mount points of application
  ],
  alternatePaths: ['src/_shared'],
}
```

In the future, this will be a `.vulturerc` file, similar to how babel or eslint
are configured.

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
