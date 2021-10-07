# git-report
by Liquid Labs

_**WARNING: This is prototype code. Much of it may be un-implemented and actual usage may differ from what is documented here.**_

Extends git with the 'report' command.

* [Installation](#installation)
* [Usage](#usage)
* [Command reference](#command-reference)
  * [Common options](#common-options)
  * [Reports](#reports)
  
Core reports:
* [Changelog](#changelog)
* [Pull-requests](#pull-requests)

## Installation

``` bash
npm i -g @liquid-labs/git-report
```

You will also need [a GitHub personal access token](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token). To automate use of the token, create a file `~/.config/git-report` with the contents:
```yaml
access_token: XXXXXXXXX
```
Where 'XXXXXX' is your access token. Secure the file with:
```bash
chmod 600 ~/.config/git-report
```

## Usage

``` bash
git report # lists available reports
git report changelog # git generated change log
git report hub-prs # list outstanding prs
```

## Command reference

### Common options

#### Scope

By default, the report will generate a report based on the current repository (working directory). If `--scope` (or `-s`) is set, then a report will be generated for all repos in the designated scope. Scope may be an org key, such as 'acme' or a repository key such as 'acme/tools'. If scoped to an org, then the report will include all visible repos in the org.

#### Query

`--query` accepts a string of the form:
```
query particle: <key>: <value 1>[, <value 2>...n]
query statement: <query particle 1>[; <query particle 2>...n]
```

E.g.:
* `states: OPEN`
* `states: OPEN,MERGED`
* `states: OPEN,MERGED; age: >= 5`

Valid query particle keys and values are defined for each report.

#### Format

`--format|-f` accepts:
* `terminal` or `term` : (default) Generates a tabular report for display in a terminal.
* `tsv` : Generates report data in "tab separated values" format.
* `json` : Generates report data in JSON format.
* `summary` : Prints a one line summary of the report.

#### Fields

`--fields|-F` accepts a comma-separated list of field names, as defined in each report. If not specified, the report will generate a default set of fields (which  may vary depending on the report scope or other factors). If fields are specified, then only those fields are included in the report, in the order in which they are specified. The special value 'all' may also be given indicating that all supported fields should be included in the report.

#### Token file

For remote reports, `--token-file|-t` specifies a local file whose contents are your personal access token. This is considered safer than `--token` and should be preferred.

#### Token

For remote reports, `--token|-T` specifies your personal access token. If no token (nor token file) is specified, then git-report will check your hub config (if any) to see if a token can be found. Be careful using this option as your token may be slurped into your command history unless you take care.

#### Origin

For remote reports, `--origin` specifies the name of the (GitHub) remote to refer to when determining the report scope if scope is not provided. The standard 'origin' remote name is assumed if `--origin` is not specified.

### Reports

#### Changelog

<code>git report changelog <a href="#format">[--format|-f &lt;format type&gt;]</a></code>

Generates a changelog based on the git log history. By default, we expect changes to come in as a feature branch and will use the feature branch commit message as the summary for the change. Individual workbranch change commits will be included in an expandable section. Commits directly to the main branch will be considered 'hotfixes' and labeled as such.

Changelog is currently a local only report limited to the current working repo. Future support is planned, but the use of `--scope` will cause an exit on error.

#### Pull-requests

<code>git report pull-requests <a href="#scope">[--scope|-s]</a> <a href="#format">[--format|-f &lt;format type&gt;]</a> [--open]</code>

Generates a report of a repository's pull-requests (PRs). By default, the report lists open PRs sorted by:
* state (OPEN > MERGED > CLOSED)
* 'age in days',
* 'repo name'
The sort does not depend on the fields being included in the report.

Pull-requests is a purely remote report.

##### Report specific options

* `--open` will open a browser window for each PR in the report. This is useful for opening PRs for review with something like `git report pull-requests -f summary --open`
* `--query` accepts (key/value):
  * 'states' / one or more of 'OPEN', 'MERGED', and 'CLOSED'

##### Report fields and summary format

Default fields:
* title : The PR summary.
* repo name : (\*) The name of the repo. (\*: Included by default only if scope is organization wide.)
* number : The number/ID of the PR in the repo.
* permalink : The PR permalink URL.
* status : The status of the PR.
* age : Age of the PR in days.

Summary format prints the total number of PRs found and a count by each state in the search.
