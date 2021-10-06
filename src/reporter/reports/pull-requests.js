import { graphql, GraphqlResponseError } from '@octokit/graphql'

import { getAuthenticationParameters } from './lib'

const pullRequestsReporter = async (options) => {
  const authParams = getAuthenticationParameters(options)
  // authParams.log = console // DEBUG
  const graphqlWithAuth = graphql.defaults(authParams)
  
  try {
    const result = await graphqlWithAuth(`query { viewer {
      login
    } }`)
    console.log(result)
  }
  catch (error) {
    if (error instanceof GraphqlResponseError) {
      console.log("Request failed:", error.request); // { query, variables: {}, headers: { authorization: 'token secret123' } }
      console.log(error.message); // Field 'bioHtml' doesn't exist on type 'User'
    }
    else {
      console.log("Non-graphql error")
      console.log(error)
    }
  }
}

export { pullRequestsReporter }
