git-report-pull-requests() {
  git-report-lib-require-github-access
  
  node "${REPORTER}" "$(git-report-lib-reporter-data)"
}
