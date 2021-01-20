# 🌈 Outdated Version Github Action

<p align="center">
  <a href="https://github.com/ycjcl868/outdated-version-action/actions"><img alt="typescript-action status" src="https://github.com/ycjcl868/outdated-version-action/workflows/build-test/badge.svg"></a>
</p>

## Usage

### Inputs

| Name | Desc | Type | Required |
| -- | -- | -- | -- |
| token | GitHub Token | string | ✔ |

### Example

create github action in `.github/workflows/outdated.yml`

```yml
name: Outdated Version Action

on: push

jobs:
  release-helper:
    runs-on: ubuntu-latest
    steps:
      - name: make release
        uses: ycjcl868@outdated-version-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```
