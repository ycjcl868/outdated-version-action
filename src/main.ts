import {Octokit} from '@octokit/rest'
import * as core from '@actions/core'
import * as github from '@actions/github'

import {COMMENT_FLAG} from './constant'
import {findExistedComment} from './github'
import yarnOutdated from './yarnOutdated'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('token')
    const octokit = new Octokit({auth: `token ${token}`})

    const {number: issue_number} =
      github.context.payload.pull_request || github.context.issue || {}
    const {owner, repo} = github.context.repo
    core.info(`issueNumber: ${issue_number}, owner: ${owner}, repo: ${repo}`)
    if (!issue_number) {
      return
    }

    // get yarn outdated
    const md = await yarnOutdated()
    const body = `${md}\n${COMMENT_FLAG}`
    core.info(`body: ${body}`)
    // find whether issueComment existed
    const comment = await findExistedComment(owner, repo, issue_number)
    core.info(`comment: ${JSON.stringify(comment)}`)
    if (comment) {
      // existed;
      core.info(`existedComment: ${comment.id}`)
      await octokit.issues.updateComment({
        owner,
        repo,
        comment_id: comment.id,
        body
      })
      return
    }

    const result = await octokit.issues.createComment({
      issue_number,
      owner,
      repo,
      body
    })

    if (result.status === 201) {
      core.setOutput('result', '✅')
    } else {
      throw new Error(`❌ ${JSON.stringify(result, null, 2)}`)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
