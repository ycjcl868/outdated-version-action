import * as core from '@actions/core'
import * as exec from '@actions/exec'
import Handlebars from 'handlebars'
import Formatter from 'yarn-outdated-formatter'
import parseYarnOutdatedJSON from 'yarn-outdated-formatter/lib/parseYarnOutdatedJSON'

class MarkdownFormatter {
  normalizePackages = (packages: any[]): any =>
    packages.map(pkg => {
      const hasWorkspace = pkg.length >= 8

      return {
        name: pkg[0],
        current: pkg[1],
        wanted: pkg[2],
        latest: pkg[3],
        workspace: hasWorkspace ? pkg[4] : '',
        type: hasWorkspace ? pkg[5] : pkg[4],
        url: hasWorkspace ? pkg[6] : pkg[5],
        changelog: hasWorkspace ? pkg[7] : pkg[6]
      }
    })

  packageTable = (
    packages: {workspace: boolean; [key: string]: unknown}[]
  ): string => {
    if (packages.length === 0) {
      return ''
    }

    const hasWorkspace = !!packages[0].workspace

    const result: string[] = []

    const headers = [
      'Package',
      'Current',
      'Wanted',
      'Latest',
      ...(hasWorkspace ? ['Workspace'] : []),
      'Type',
      'CHANGELOG'
    ]

    result.push(`| ${headers.join(' | ')} |`)
    result.push(`|${new Array(headers.length).fill(':----').join('|')}|`)

    // eslint-disable-next-line github/array-foreach
    packages.forEach(pkg => {
      const arr = [
        `[${pkg.name}](${pkg.url})`,
        `\`${pkg.current}\``,
        `\`${pkg.wanted}\``,
        `\`${pkg.latest}\``,
        ...(hasWorkspace ? [`\`${pkg.workspace}\``] : []),
        `\`${pkg.type}\``,
        pkg.changelog || '-'
      ]

      result.push(`| ${arr.join(' | ')} |`)
    })

    return result.join('\n')
  }

  toMarkdown(json: {[key: string]: any}): string {
    const tpl = Handlebars.compile(`## :recycle: Hi, It's time to update the npm package!

    **{{all.length}} npm packages** are outdated.
    Let's begin maintenance to maintain a fresh package!
    {{#if needsChangelog}}

    ---
    <details>
      <summary>Packages</summary>
      <ul>
        {{#each needsChangelog as |pkg|}}
        <li><a href="{{pkg.url}}">{{pkg.name}}</a></li>
        {{/each}}
      </ul>
    </details>
    {{/if}}
    ---
    {{#if outdated.major.packages}}


    ## :warning: Major ({{outdated.major.packages.length}} packages)

    {{{outdated.major.table}}}
    {{/if}}
    {{#if outdated.minor.packages}}


    ## :zap: Minor ({{outdated.minor.packages.length}} packages)

    {{{outdated.minor.table}}}
    {{/if}}
    {{#if outdated.patch.packages}}


    ## :beginner: Patch ({{outdated.patch.packages.length}} packages)

    {{{outdated.patch.table}}}
    {{/if}}`)

    const outdated: any = {}
    let all: any[] = []

    // eslint-disable-next-line github/array-foreach
    Object.keys(json).forEach((key: string) => {
      const packages = this.normalizePackages(json[key])

      outdated[key] = {
        packages,
        table: this.packageTable(packages)
      }

      all = [...all, ...packages]
    })

    const markdown = tpl({
      meta: {
        changelogs: '',
        excludes: '',
        template: ''
      },
      needsChangelog: all.filter(pkg => !pkg.changelog),
      outdated,
      all
    })

    return markdown
  }
}

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
  const yarnJson = parseYarnOutdatedJSON(myOutput)
  core.debug(yarnJson)
  if (!yarnJson) {
    core.setFailed('❌ JSON parse failed...')
    return ''
  }

  const formatter = new Formatter('json', [], {})
  const json = JSON.parse(formatter.run(yarnJson))
  if (!json) {
    return '### ✅ All packages are Fresh!'
  }
  core.debug(json)

  const mdFormatter = new MarkdownFormatter()
  return mdFormatter.toMarkdown(json)
}

export default yarnOutdated
