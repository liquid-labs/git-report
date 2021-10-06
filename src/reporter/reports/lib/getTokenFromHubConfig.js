import * as fs from 'fs'
import YAML from 'yaml'

const getTokenFromHubConfig = () => {
  let hubConfigString
  const configFile = `${process.env.HOME}/.config/hub`
  try {
    hubConfigString = fs.readFileSync(configFile, { encoding: 'utf8' })
  }
  catch (e) {
    throw new Error(`Could not infer access token from '${configFile}'. Try setting the '--token' or '--token-file' parameters. (${e.message})`)
  }
  let hubConfig
  try {
    hubConfig = YAML.parse(hubConfigString)
  }
  catch (e) {
    throw new Error(`Found hub config at '${configFile}' but could not procsess as YAML.`)
  }
  
  // TODO: let's be smarter about selecting the token if there are multiples...
  const token = hubConfig['github.com']?.[0]?.oauth_token
  if (token === undefined) {
    throw new Error(`Found hub config at '${configFile}', but no 'oauth_token' present.`)
  }
  else {
    return token
  }
}

export { getTokenFromHubConfig }
