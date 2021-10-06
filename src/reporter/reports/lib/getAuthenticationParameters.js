import * as fs from 'fs'

import { getTokenFromHubConfig } from './getTokenFromHubConfig'

const authorizationHeaders = (token) => ({
  headers: {
    authorization: `token ${token}`
  }
})

let authenticationParameters
const getAuthenticationParameters = ({ token, 'token file': tokenFile }) => {
  if (authenticationParameters === undefined) {
    if (token === undefined) {
      if (tokenFile !== undefined) {
        token = fs.readFileSync(tokenFile, { encoding: 'utf8' })
      }
      else { // let's see if we can find an auth token in any hub config
        token = getTokenFromHubConfig()
      }
      
      authenticationParameters = authorizationHeaders(token)
    }
  }
  
  return authenticationParameters
}

export { getAuthenticationParameters }
