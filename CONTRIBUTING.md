# Contribution Guidelines

## Commit Message Format

```
<type>(<scope>): <short summary>
  │       │             │
  │       │             └─⫸ Summary in present tense, not capitalized, no period at the end
  │       │
  │       └─⫸ Commit Scope: api|ui|deps
  │
  └─⫸ Commit Type: fix|feat|chore|refactor|docs|ci|config|build|perf
```
The `type` and `summary` fields are mandatory, the `scope` field is optional

### Type
Must be one of the following:

| Type         | Description                                                                          |
| ------------ | ------------------------------------------------------------------------------------ |
| **fix**      | A bug fix                                                                            |
| **feat**     | A new feature                                                                        |
| **chore**    | Grunt tasks, no production code change (e.g.: formatting fixes, commenting code)     |
| **refactor** | A code change that neither fixes a bug nor adds a feature                            |
| **docs**     | Documentation only changes (e.g.: changes to .mdx files, README.md, CONTRIBUTING.md) |
| **ci**       | Changes to our CI configuration files and scripts such as GitHub Actions             |
| **config**   | Changes to configuration files                                                       |
| **build**    | Changes that affect the build system or external dependencies                        |
| **perf**     | A code change that improves performance                                              |

### Scope
Common scopes for this project include:

| Scope    | Description                     |
| -------- | ------------------------------- |
| **api**  | Changes to the api routes       |
| **ui**   | Changes to frontend components  |
| **deps** | Changes to project dependencies |


### Examples
```
fix(api): resolve error when creating timer

feat(ui): implement dark mode support

docs: update installation instructions

build(deps): bump next from 4.0.0 to 4.1.0
```

## Versioning
When to bump version numbers:

| Type  | Description                                                                                      |
| ----- | ------------------------------------------------------------------------------------------------ |
| Major | Breaking changes (API changes, UI overhauls, removed functionality)                              |
| Minor | New major features or functionality added or removed in a backwards compatible manner            |
| Patch | Backwards compatible bug fixes, performance improvements, UI adjustments, and new minor features |