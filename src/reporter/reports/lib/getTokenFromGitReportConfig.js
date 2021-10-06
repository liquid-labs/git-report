import * as fs from 'fs'
import YAML from 'yaml'

const getTokenFromGitReportConfig = () => {
  let configString
  const configFile = `${process.env.HOME}/.config/git-report`
  try {
    configString = fs.readFileSync(configFile, { encoding: 'utf8' })
  }
  catch (e) {
    if (!fs.existsSync(configFile)) {
      // then there's no error; it's just there is no file to get a token from
      return null
    } // else
    throw e
  }
  let config
  try {
    config = YAML.parse(configString)
  }
  catch (e) {
    throw new Error(`Found git-report config at '${configFile}' but could not procsess as YAML.`)
  }
  
  const token = config.access_token
  if (token === undefined) {
    throw new Error(`Found git-report config at '${configFile}', but no 'access_token' present.`)
  }
  else {
    return token
  }
}

export { getTokenFromGitReportConfig }
