import * as fs from 'fs'

import { getTokenFromHubConfig } from './getTokenFromHubConfig'
import { getTokenFromGitReportConfig } from './getTokenFromGitReportConfig'

const authorizationHeaders = (token) => ({
  headers: {
    authorization: `token ${token}`
  }
})

// TODO: assumes single threaded; maybe refactor getAuthenticationParameters as a closure
let authenticationParameters
const getAuthenticationParameters = ({ token, 'token file': tokenFile }) => {
  if (authenticationParameters === undefined) {
    if (token === undefined) {
      if (tokenFile !== undefined) {
        token = fs.readFileSync(tokenFile, { encoding: 'utf8' })
      }
      else { // let's see if we can find an auth token somewhere
        token = getTokenFromGitReportConfig() || getTokenFromHubConfig()
      }
    }
    
    if (token) {
      authenticationParameters = authorizationHeaders(token)
    }
  }
  
  return authenticationParameters
}

const requireAuthenticationParameters = (options) => {
  getAuthenticationParameters(options)
  if (authenticationParameters === undefined) {
    throw new Error("Could not find authentication parameters. You can obtain a personal access token from GitHub, and then create the file: '$HOME/.config/git-report'. This is a YAML file containing a single entry: 'access_token: <your access token>'.")
  }
  
  return authenticationParameters
}

export { getAuthenticationParameters, requireAuthenticationParameters }
