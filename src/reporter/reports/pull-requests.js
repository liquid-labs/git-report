import { graphql, GraphqlResponseError } from '@octokit/graphql'

import { getAuthenticationParameters } from './lib'

const PAGE_SIZE = 50

const millisInDay = 24 * 60 * 60 * 1000
const daysBetween = (d1, d2) =>
  Math.round(Math.abs((d1 - d2) / millisInDay))

const processGraphQL = async ({ client, query, params }) => {
  try {
    return await client(query, params)
  }
  catch (e) {
    if (e instanceof GraphqlResponseError) {
      console.error("Request failed:", e.request)
      // console.error(error.message)
    }
    throw e
  }
}

const prDecomposition =
  `pullRequests(states: OPEN, first: ${PAGE_SIZE}, after: $lastPrCursor) {
    edges {
      node {
        number
        permalink
        title
        state
        createdAt
      }
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }`

const makeOrgQuery = () =>
  `query($orgName: String!, $lastRepoCursor: String, $lastPrCursor: String) {
    organization(login: $orgName) {
      repositories(first: ${PAGE_SIZE}, after: $lastRepoCursor) {
        edges {
          node {
            name
            ${prDecomposition}
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }`
  
const makeRepoQuery = () =>
  `query($orgName: String!, $repoName: String!, $lastPrCursor: String) {
    repository(owner: $orgName, name: $repoName) {
      name
      ${prDecomposition}
    }
  }`

const processOrgReport = async ({ client, params }) => {
  const query = makeOrgQuery(params)
  const records = params.records || []
  
  let hasMoreRepos = true
  let lastRepoCursor
  while (hasMoreRepos) {
    const result = await processGraphQL({ client, query, params })
    for (const repoData of result.organization.repositories.edges) {
      const repoName = repoData.node.name
      for (const prEdgeRecord of repoData.node.pullRequests.edges) {
        const prData = prEdgeRecord.node
        records.push(Object.assign(
          {
            "repo name": repoName,
            "age in days": daysBetween(params.now, new Date(prData.createdAt))
          },
          prData
        ))
      } // pr processing loop
      
      const { hasNextPage: hasMorePrs, endCursor: lastPrCursor } = repoData.node.pullRequests.pageInfo
      if (hasMorePrs) {
        // TODO: would be great to refactor to allow multiple in-flight requests; the problem is (I believe) if we didn't await here, then this 'processOrgReport' could return early why pages of PRs are still being resolved
        await processRepoReport({
          client,
          params: {
            orgName: params.orgName,
            repoName,
            lastPrCursor,
            records,
            now: params.now
          }
        })
      }
    } // repo processing loop
    
    ({ hasNextPage: hasMoreRepos, endCursor: lastRepoCursor } = result.organization.repositories.pageInfo)
    params.lastRepoCursor = lastRepoCursor
  } // page of repos loop
  
  return records
}

const processRepoReport = async ({ client, params }) => {
  const query = makeRepoQuery(params)
  const records = params.records || []
  
  let hasMorePrs = true
  let lastPrCursor
  while (hasMorePrs) {
    const result = await processGraphQL({ client, query, params })
    const repoName = result.repository.name
    for (const prEdgeRecord of result.repository.pullRequests.edges) {
      const prRecord = prEdgeRecord.node
      records.push(Object.assign(
        {
          "repo name": repoName,
          "age in days": daysBetween(params.now, new Date(prRecord.createdAt))
        },
        prRecord
      ))
    } // pr processing loop
    
    ({ hasNextPage: hasMorePrs, endCursor: lastPrCursor } = result.repository.pullRequests.pageInfo)
    params.lastPrCursor = lastPrCursor
  } // page of prs loop

  return records
}

const pullRequestsReporter = async (options) => {
  const authParams = getAuthenticationParameters(options)
  const graphqlWithAuth = graphql.defaults(authParams)
  
  // set up page tracker object which doubles as input params for the queries
  const { orgName, repoName } = options
  const params = {
    now: new Date(),
    orgName,
    repoName
  }
  
  const records = repoName === undefined
    ? await processOrgReport({ client: graphqlWithAuth, params })
    : await processRepoReport({ client: graphqlWithAuth, params })
    
  console.log(records)
}

export { pullRequestsReporter }
