# git-report
by Liquid Labs

_**WARNING: This is prototype code. Much of it may be un-implemented and actual usage may differ from what is documented here.**_

Extends git with the 'report' command.

* [Installation](#installation)
* [Usage](#usage)
* [Command reference](#command-reference)
  * [Multi-repo reports](#multi-repo-reports)
  * [Reports](#reports)
    * [Changelog](#changelog)
    * [Pull-requests](#pull-requests)

## Installation

npm i -g @liquid-labs/git-report

## Usage

git report # lists available reports
git report changelog # git generated change log
git report hub-prs # list outstanding prs

## Command reference

### Common options

#### Scope

By default, the report will generate a report based on the current repository (working directory). If `--scope` (or `-s`) is set, then a report will be generated for all repos in the designated scope. Scope may be an org key, such as 'acme' or a repository key such as 'acme/tools'. If scoped to an org, then the report will include all visible repos in the org.

#### Format

The common `--format|-f` option accepts:
* `terminal` or `term` : (default) Generates a tabular report for display in a terminal.
* `markdown` or `md` : Generates a report in Mardown meant to be read by a human. In addition to the basic data, Markdown reports may contain additional content besides the basic data. E.g., graphs, context notes, indexes, etc.
* `tsv` : Generates report data in "tab separated values" format.
* `json` : Generates report data in JSON format.
* `summary` : Prints a one line summary of the report.

### Reports

#### Changelog

<code>git report changelog <a href="#format">[--format|-f &lt;format type&gt;]</a></code>

Generates a changelog based on the git log history. By default, we expect changes to come in as a feature branch and will use the feature branch commit message as the summary for the change. Individual workbranch change commits will be included in an expandable section. Commits directly to the main branch will be considered 'hotfixes' and labeled as such.

Note: The changelog report only supports the current working directory at this time. The use of `--scope` will cause an exit on error.

#### Pull-requests

<code>git report pull-requests <a href="#scope">[--scope|-s]</a> <a href="#format">[--format|-f &lt;format type&gt;]</a> [--open]</code>

Generates a report of a repository's pull-requests (PRs). By default, the report lists open PRs ranked by their "staleness".

`--open` will open a browser window for each PR in the report. This is useful for opening PRs for review with something like `git report pull-requests -f summary --open`

Report data:
- number : The number/ID of the PR in the repo.
- url : The PR URL.
- status : The status of the PR.
- summary : The PR summary.
- age : Age of the PR in days.

Summary format prints the total number of PRs found broken down by status, if any.

The Markdown report includes an opening summary showing mean, median, and mode ages overall. A list of PRs sorted by oldest-first follows, with PR details included. After that, an index of PRs by Organization is presented.
