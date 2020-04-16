# Contribution

See full contribution guide on [AtB org repo](https://github.com/AtB-AS/org/blob/master/CONTRIBUTING.md) and
startup instructions on the [README](./README.md#getting-started).

## Conventional commits

To better be able to track changes relevant for the user, we do semantic commits. As we do a Pull Request approach, the important part is for the squashed and merged commits when completing a PR uses semantic commits, but it is encouraged for all commits to use it to easier be able to make a proper summary when merging pull requests and to track history.

We use [conventional-changelog](https://www.conventionalcommits.org/en/v1.0.0-beta.4/#summary) with [angular preset](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines). Read all details on the angular repo, but quick getting started:

### Format

```
<type>(<scope>): <subject>
<BLANK LINE>
<body>
<BLANK LINE>
<footer>
```

First line is mandatory, but `scope` is optional. `scope` can be anything to group multiple changes in the same section in the changelog.

`subject` is main commit message included in the changelog. This should be written in a way that makes sense for changelogs. Such as "Nearby departures now updates automatically". Sort summary. If more details are needed use `body`.

### Types

#### Included in changelog

- `fix:` Bug fixes and minor changes.
- `feat:` Introducing a new feature which is notable by the end-user in the app.
- `BREAKING CHANGE:` Cases where there are breaking changes as removed features, or required updates. Rare in our end-user application. Marking breaking changes by prefixing section `body` or `footer` with `BREAKING CHANGE:`

#### Not included in changelog

- `build:` Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
- `ci:` Changes to our CI configuration files and scripts (example scopes: Circle, BrowserStack, SauceLabs)
- `docs:` Documentation only changes
- `perf:` A code change that improves performance
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `style:` Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- `test:` Adding missing tests or correcting existing tests

**([from Angular preset](https://github.com/angular/angular/blob/master/CONTRIBUTING.md#type))**

### Examples

```
fix(nearby): Nearby departures now shows correct departure time
```

```
feat(overview): Overview now shows arrival time
```

```
chore: Adds eslint configuration
```

```
build: Adds eslint step to Github Actions

Adds eslint Github Actions to catch unnecessary errors on pull requests for contributors not using linting actively in their development flow.
```
