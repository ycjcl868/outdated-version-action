import {Octokit} from '@octokit/rest'
import * as core from '@actions/core'

import {COMMENT_FLAG} from './constant'

const token = core.getInput('token')
const octokit = new Octokit({auth: `token ${token}`})

type Await<T> = T extends {
  then(onfulfilled?: (value: infer U) => unknown): unknown
}
  ? U
  : T
type ResultItem = Await<
  ReturnType<typeof octokit.issues.listComments>
>['data'][number]

export async function findExistedComment(
  owner,
  repo,
  issueNumber
): Promise<ResultItem> {
  const res = await octokit.issues.listComments({
    owner,
    repo,
    issue_number: issueNumber
  })
  core.info(`Actions: [find-comments][${issueNumber}] success!`)
  const result = res.data.find(item => {
    if (item.body?.includes(COMMENT_FLAG)) {
      return item
    }
    return undefined
  }) as ResultItem
  return result
}
