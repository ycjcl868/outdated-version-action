import {Octokit} from '@octokit/rest'
import * as core from '@actions/core'
import * as github from '@actions/github'
import yarnOutdated from './yarnOutdated'

const token: string = core.getInput('token')
const octokit = new Octokit({auth: `token ${token}`})

async function run(): Promise<void> {
  try {
    // const result = octokit.repos.listForOrg({
    //   org: 'umijs',
    //   type: 'public'
    // })
    // core.debug(`result: ${JSON.stringify(result, null, 2)}`)
    const {number: issue_number} = github.context.issue
    const {owner, repo} = github.context.repo
    // core.info(`owner: ${owner}, repo: ${repo}`)
    // core.debug(`Waiting ${token} ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    const body = await yarnOutdated()

    const result = await octokit.issues.createComment({
      issue_number,
      owner,
      repo,
      body
    })

    if (result.status === 201) {
      core.setOutput('result', '✅')
    } else {
      core.setFailed(`❌ ${JSON.stringify(result, null, 2)}`)
    }

    // let myOutput = ''
    // let myError = ''

    // const options: exec.ExecOptions = {
    //   cwd: process.cwd(),
    //   listeners: {
    //     stdout: (data: Buffer) => {
    //       myOutput += data.toString()
    //     },
    //     stderr: (data: Buffer) => {
    //       myError += data.toString()
    //     }
    //   }
    // }
    // core.debug(myError)
    // await exec.exec('yarn', ['outdated', '--json'], options)

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
