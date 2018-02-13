# tidy-repo

> 👷🏼 Better `git clone`. Keep repository directory neat and tidy.

- **Easy:** You can run `add` command anywhere
- **Agile:** Just writing simple rules once
- **Functional:** Provide hooks for easy extension




## Installation

Requires **node v7.6.0** or higher for ES2015 and async function support.

``` sh
$ npm i tidy-repo --global
```



## Usage

``` sh
$ repo

  Description
    Better git clone.
    Keep repository folders neat and tidy.

  Usage
    $ repo <command> [options]

  Available Commands
    init      Initial config files. (Location: /Users/ucweb/.tidy-repo/config.json)
    add       Add repository cleverly.
    import    Import repositories from existing directory.
    help      Show help message.

  For more info, run any command with the `--help` flag
    $ repo init --help
    $ repo add --help

  Options
    -v, --version    Displays current version
    -h, --help       Displays this message
```



## Config

``` sh
$ repo init
```

Then edit `hostMap` in `~/.tidy-repo/config.json` .

Example:
```json
{
  "hostMap": {
    "github.com": "~/Code/github",
    "gitlab.com": "~/Code/gitlab"
  }
}
```

## Lifecycle

Available lifecycle:

- [x] preadd
- [x] postadd
- [ ] preimport
- [ ] postimport

### Write lifecycle

Add `${lifecycle-name}.js` into `~/.tidy-repo/lifecycle/`, and write anything in javascript.

Example:

```js
// ~/.tidy-repo/lifecycle/postadd.js
console.log('hello', process.env.TIDY_REPO_TARGETPATH);
```

You can get some variable in `process.env`.

Available envionment variables:

| ` process.env`         | description                                      |
| ---------------------- | ------------------------------------------------ |
| `TIDY_REPO_CONFIG`     | stringify config from `~/.tidy-repo/config.json` |
| `TIDY_REPO_EVENTNAME`  | which lifecycle is running                       |
| `TIDY_REPO_TARGETPATH` | target directory, `add` command only             |
| `TIDY_REPO_CLONEURL`   | remote repository url, `add` command only        |


## License

[MIT License](https://opensource.org/licenses/MIT) © [viko16](https://github.com/viko16)
