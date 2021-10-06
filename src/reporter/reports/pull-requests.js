import { graphql, GraphqlResponseError } from '@octokit/graphql'

import { getAuthenticationParameters } from './lib'

const pullRequestsReporter = async (options) => {
  const authParams = getAuthenticationParameters(options)
  const graphqlWithAuth = graphql.defaults(authParams)
  
  const { orgName, repoName } = options
  
  try {
    let endCursor = null
    let hasNextPage = true
    
    const prDecomposition = `pullRequests(states:OPEN, first:50, after:$endCursor) {
      edges {
        node {
          number
          permalink
          title
          state
          createdAt
        }
        cursor
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }`
    
    const orgQuery = ({ orgName }) => `query($orgName: String!, $endCursor: String) {
        organization(login: $orgName) {
          repositories {
            edges {
              ${prDecomposition}
            }
          }
        }
      }`
    
    const repoQuery = ({ orgName, repoName }) => `query($orgName: String!, $repoName: String!, $endCursor: String) {
        repository(owner: $orgName, name: $repoName) {
          ${prDecomposition}
        }
      }`
    
    while (hasNextPage) {
      const result = await graphqlWithAuth(
        repoName === undefined ? orgQuery(options) : repoQuery(options),
        {
          orgName,
          repoName,
          prCursor: null
        })
      console.log(result);
      ({ hasNextPage, endCursor } = result.repository.pullRequests.pageInfo)
    }
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
