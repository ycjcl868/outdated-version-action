# 🌈 Outdated Version Github Action

![](https://user-images.githubusercontent.com/13595509/105183580-35b40b80-5ae3-11eb-8e43-b24b9bdcbcb9.png)

![](https://user-images.githubusercontent.com/13595509/105187164-53836f80-5ae7-11eb-9ae9-40cb5044a89e.png)

## Usage

### Inputs

| Name | Desc | Type | Required |
| -- | -- | -- | -- |
| token | GitHub Token | string | ✔ |

### Example

create github action in `.github/workflows/outdated.yml`

```yml
name: Outdated Version Action

on:
  pull_request:
    types: [opened, edited]

jobs:
  outdated-version:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: install
        run: yarn --ignore-engines
      - name: outdated version
        uses: ycjcl868/outdated-version-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```

Or you can comment `/version` to trigger:

```yml
name: Outdated Version Action

on:
  issue_comment:
    types: [created]

jobs:
  outdated-version:
    name: Outdated Version
    if: github.event.issue.pull_request != '' && contains(github.event.comment.body, '/version')
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: install
        run: yarn --ignore-engines
      - name: outdated version
        uses: ycjcl868/outdated-version-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```
