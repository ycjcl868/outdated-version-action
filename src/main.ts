import * as core from '@actions/core'
import * as github from '@actions/github'
import * as exec from '@actions/exec'

async function run(): Promise<void> {
  try {
    const {owner, repo} = github.context.repo
    core.info(`owner: ${owner}, repo: ${repo}`)
    const token: string = core.getInput('token')
    core.debug(`Waiting ${token} milliseconds ...`) // debug is only output if you set the secret `ACTIONS_RUNNER_DEBUG` to true

    let myOutput = ''
    let myError = ''

    const options: exec.ExecOptions = {
      cwd: process.cwd(),
      listeners: {
        stdout: (data: Buffer) => {
          myOutput += data.toString()
        },
        stderr: (data: Buffer) => {
          myError += data.toString()
        }
      }
    }
    if (myError) {
      core.error(myError)
    }
    await exec.exec('yarn', ['outdated'], options)
    core.info(myOutput)

    core.setOutput('time', new Date().toTimeString())
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
