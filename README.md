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

### Multi-repo reports

The common `--multi-base|-M` option can specify either:
* a directory containing git repos (hard or soft linked), or
* a GitHub organization, specified as `github://<GitHub org key>`

Where supported, the report will include each linked repository or all repos in the named org accessible by the user.

### Report format

The common `--format|-f` option accepts:
* `markdown` or `md` : (default) Generates a report in Mardown meant to be read by a human. In addition to the basic data, Markdown reports may contain additional content besides the basic data. E.g., graphs, context notes, indexes, etc.
* `tsv` : Generates report data in "tab separated values" format.
* `json` : Generates report data in JSON format.

### Reports

#### Changelog

<code>git report changelog  <a href="#multi-repo-reports">[--multi-base|-M]</a></code>

Generates a changelog based on the git log history. By default, we expect changes to come in as a feature branch and will use the feature branch commit message as the summary for the change. Individual workbranch change commits will be included in an expandable section. Commits directly to the main branch will be considered 'hotfixes' and labeled as such.

Note: The changelog report only supports a local directory link at this time.

#### Pull-requests

<code>git report pull-requests <a href="#multi-repo-reports">[--multi-base|-M]</a></code>

Generates a report of a repository's pull-requests (PRs). By default, the report lists open PRs ranked by their "staleness".

Report data:
- number : The number/ID of the PR in the repo.
- url : The PR URL.
- summary : The PR summary.
- age : Age of the PR in days.

The Markdown report includes an opening summary showing mean, median, and mode ages overall. A list of PRs sorted by oldest-first follows, with PR details included. After that, an index of PRs by Organization is presented.
