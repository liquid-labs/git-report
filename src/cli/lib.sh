git-report-lib-reporter-data() {
  echo '{
    "report": "'${REPORT}'",
    "scope": "'${SCOPE}'",
    "format": "'${FORMAT}'",
    "initiated from working repo": '${INITIATED_FROM_WORKING_REPO}',
    "origin name": "'${ORIGIN}'",
    "query": "'${QUERY}'",
    "fields": "'${FIELDS}'"'$(test -n "${TOKEN_FILE}" && echo ',
    "token file": "'${TOKEN_FILE}'"')$(test -n "${TOKEN}" && echo ',
    "token": "'${TOKEN}'"')$(test -n "${OPEN}" && echo ',
    "open": true')',
    "openLimit": '$( [[ -n "${OPEN_LIMIT}" ]] && echo "${OPEN_LIMIT}" || echo 10)'
  }'
}

git-report-lib-require-github-access() {
  # if we don't supress the output, then we get noise even when successful
  ssh -qT git@github.com 2> /dev/null || if [ $? -ne 1 ]; then
    die "Could not connect to github; try to add add your GitHub key like:\nssh-add /example/path/to/key"
  fi
}

git-report-lib-validate-normalize-format() {
  local VALID_FORMAT="'terminal' ('term'), 'tsv', 'json', 'markedown' ('md'), or 'summary'"
  
  # Set default if empty and lowercase value
  [[ -n "${FORMAT}" ]] || FORMAT='terminal'
  FORMAT="$(echo "${FORMAT}" | tr '[[:upper:]]' '[[:lower:]]')"
  
  case "${FORMAT}" in
    md)
      FORMAT='markdown';;
    term)
      FORMAT='terminal';;
    terminal|markdown|tsv|json|summary)
      ;;
    csv)
      echoerr "Did you mean 'tsv'?";;
    *)
      die "Unsupported format '${FORMAT}'. Try ${VALID_FORMAT}.";;
  esac
}

git-report-lib-validate-normalize-origin() {
  [[ -n "${ORIGIN}" ]] || ORIGIN=origin
}

git-report-lib-validate-normalize-report() {
  local VALID_REPORT="'changelog', 'origin', or 'pull-requests' ('prs')"
  
  [[ -n "${REPORT}" ]] || die "No report specified. Try ${VALID_REPORTS}"
  
  # Lowercase value
  REPORT="$(echo "${REPORT}" | tr '[[:upper:]]' '[[:lower:]]')"
  
  case "${REPORT}" in
    prs)
      REPORT='pull-requests';;
    changelog|origin|pull-requests)
      ;;
    *)
      die "Invalid report '${REPORT}'. Try ${VALID_REPORT}.";;
  esac
}

git-report-lib-validate-normalize-scope() {
  if [[ -z "${SCOPE}" ]]; then
    git_dir_init # provided by git-sh-setup; sets 'GIT_DIR' and exits with err if not in a git DIR
    INITIATED_FROM_WORKING_REPO='true'
    local ORIGIN_URL_CONFIG="remote.${ORIGIN}.url"
    local ORIGIN_URL
    ORIGIN_URL="$(git config --get ${ORIGIN_URL_CONFIG})" \
      || die "Could not find config for ${ORIGIN_URL_CONFIG}. Do you need to specify an alternate origin name with '--origin <origin name>'"
    if [[ "${ORIGIN_URL}" != *github.com:* ]]; then
      unset GITHUB_TARGET
    else # it looks like a GitHub URL
      SCOPE="${ORIGIN_URL/%.git/}" # remove '.git' at the end
      SCOPE="$( shopt -s extglob; echo ${SCOPE/#*:?(\/\/)/} )" # remove everything upto ':' or '://'
      # TODO: verify form of scope == '<repo key' == '<org key>/<repo name>'
    fi
  else
    INITIATED_FROM_WORKING_REPO='false'
  fi
}
