import {Octokit} from '@octokit/rest'
import * as core from '@actions/core'
import * as github from '@actions/github'
import yarnOutdated from './yarnOutdated'

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('token')
    const octokit = new Octokit({auth: `token ${token}`})

    const {number: issue_number} = github.context.issue || {}
    const {owner, repo} = github.context.repo
    core.info(`issueNumber: ${issue_number}`)

    // get yarn outdated
    const body = await yarnOutdated()
    core.info(`body: ${body}`)
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
