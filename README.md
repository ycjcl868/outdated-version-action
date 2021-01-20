# 🌈 Outdated Version Github Action

![](https://user-images.githubusercontent.com/13595509/105183580-35b40b80-5ae3-11eb-8e43-b24b9bdcbcb9.png)

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
