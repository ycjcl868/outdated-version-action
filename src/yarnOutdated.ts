import * as exec from '@actions/exec'
import parseYarnOutdatedJSON from 'yarn-outdated-formatter/lib/parseYarnOutdatedJSON'
import Formatter from 'yarn-outdated-formatter'

const yarnOutdated = async (): Promise<string> => {
  let myOutput = ''
  await exec.exec('yarn', ['outdated', '--json'], {
    ignoreReturnCode: true,
    listeners: {
      stdout: (data: Buffer) => {
        myOutput += data
      }
    }
  })
  const json = parseYarnOutdatedJSON(myOutput)
  const formatter = new Formatter('markdown', [], {})
  return formatter.run(json)
}

export default yarnOutdated
