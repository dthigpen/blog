# [Blog](https://dthigpen.github.io/blog)

A space to share my thoughts.

## Installation

Dependencies:

- [Pandoc](https://pandoc.org/) to convert plain Markdown files into HTML

The following dependencies do not need to be installed because they are already included in the scripts/lib folder:

- [Mo](https://github.com/tests-always-included/mo) for `{{Mustache}}`-style templating
- [Sqids](https://sqids.org/) is used to generate IDs.

## Usage

To rebuild the static pages run

```bash
$ ./scripts/build.sh
```

To deploy to github pages

```bash
$ ./scripts/deploy.sh
```
