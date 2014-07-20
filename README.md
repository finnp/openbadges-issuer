# Open Badges Issuer

A command line tool for managing files for issuing badges.

Install with `npm install -g openbadges-issuer` and use it with the `issuer` command.

```
$ issuer -h

Usage: issuer <command>

command
  init       Issuer and class information
  add        Issue a badge to a person
  issuer     Create issuer information (issuer.json)
  class      Create class information (class.json)
```

This is the folder structure this tool uses. Each badge / class has their
own directory and the `issuer.json` lives in the root. Each receiver of a badge
gets their own `N.json` file.

```
issuer.json
  /badge-beginner-course
    class.json
    badge.png
    criteria.txt
    1.json
    2.json
  /badge-haskell-101
    class.json
    badge.png
    criteria.txt
    1.json
    2.json
    3.json
```