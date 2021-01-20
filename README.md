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
  push:
      paths-ignore:
        - '**/*.md'

jobs:
  outdated-version:
    runs-on: ubuntu-latest
    steps:
      - name: outdated version
        uses: ycjcl868/outdated-version-action@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
```
