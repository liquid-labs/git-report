#!/usr/bin/env bash

# 'strict' made enabled after sourcing git-sh-setup; see below

import echoerr
import lists
import options
import real_path

# The script must be executed through git. Let's give a helpful hint if user tries to execute directly.
[[ "${0}" != *'.sh' ]] \
  || echoerrandexit "This script cannot be executed directly. Try\n\nnpm i -g .\ngit report ""$@"

source ./lib.sh
source ./reports/index.sh

NONGIT_OK=true
SUBDIRECTORY_OK=true
source "$(git --exec-path)/git-sh-setup"

# We enable strict mode here because 'git-sh-setup' is not compatible with -e
import strict

# By putting our code in a function, we can declare local vars.
git-report() {
  # Gather options and arguments
  eval "$(setSimpleOptions FIELDS:F= FORMAT= ORIGIN:O= QUERY= REPORT= SCOPE= TOKEN= TOKEN_FILE:T= -- "$@")"
  [[ -n "${REPORT}" ]] || REPORT="${1:-}"
  
  # An internal flag
  local INITIATED_FROM_WORKING_REPO GITHUB_TARGET
  GITHUB_TARGET=true # until shown otherwise
  git-report-lib-validate-normalize-format
  git-report-lib-validate-normalize-origin
  git-report-lib-validate-normalize-scope
  git-report-lib-validate-normalize-report
  
  local REPORTER
  REPORTER="$(dirname "$(real_path "${0}")")/reporter.js"
  
  git-report-${REPORT}
}

git-report "$@"
