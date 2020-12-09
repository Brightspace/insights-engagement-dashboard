# d2l-insights-engagement-dashboard

[![Build Status](https://travis-ci.com/Brightspace/insights-engagement-dashboard.svg?branch=master)](https://travis-ci.com/Brightspace/insights-engagement-dashboard)
[![Dependabot badge](https://flat.badgen.net/dependabot/Brightspace/insights-engagement-dashboard?icon=dependabot)](https://app.dependabot.com/)

> Note: this is a ["labs" component](https://github.com/BrightspaceUI/guide/wiki/Component-Tiers). While functional, these tasks are prerequisites to promotion to BrightspaceUI "official" status:
>
> - [ ] [Design organization buy-in](https://github.com/BrightspaceUI/guide/wiki/Before-you-build#working-with-design)
> - [ ] [design.d2l entry](http://design.d2l/)
> - [ ] [Architectural sign-off](https://github.com/BrightspaceUI/guide/wiki/Before-you-build#web-component-architecture)
> - [ ] [Continuous integration](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-continuously-with-travis-ci)
> - [ ] [Cross-browser testing](https://github.com/BrightspaceUI/guide/wiki/Testing#cross-browser-testing-with-sauce-labs)
> - [ ] [Unit tests](https://github.com/BrightspaceUI/guide/wiki/Testing#testing-with-polymer-test) (if applicable)
> - [ ] [Accessibility tests](https://github.com/BrightspaceUI/guide/wiki/Testing#automated-accessibility-testing-with-axe)
> - [ ] [Visual diff tests](https://github.com/BrightspaceUI/visual-diff)
> - [ ] [Localization](https://github.com/BrightspaceUI/guide/wiki/Localization) with Serge (if applicable)
> - [ ] Demo page
> - [ ] README documentation

D2L Insights Engagement Dashboard

## Usage

```html
<script type="module">
    import '@brightspace/d2l-engagement-dashboard/engagement-dashboard.js';
</script>
<d2l-insights-engagement-dashboard>My element</d2l-insights-engagement-dashboard>
```

**Properties:**

| Property | Type | Description |
|--|--|--|
| | | |

**Accessibility:**

To make your usage of `d2l-insights-engagement-dashboard` accessible, use the following properties when applicable:

| Attribute | Description |
|--|--|
| | |

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

#### Releasing and Versioning

To make a release, update the version number in package.json and
make a release in github. BSI and LMS changes will be handled by
automation (master branch only: release branches of the LMS
have to be handled manually).

This repo uses the following versioning scheme for both package.json
and release tags:
- major: always 1, so BSI automatically picks up every update
- minor: the minor and patch LMS version with zero-padding; e.g. 2012 for 2020 December, 2101 for the January release, etc.
- patch: increment as needed

### Running the demos

To start an [es-dev-server](https://open-wc.org/developing/es-dev-server.html) that hosts the demo page and tests:

```shell
npm start
```

### Linting

```shell
# eslint and lit-analyzer
npm run lint

# eslint only
npm run lint:eslint

# lit-analyzer only
npm run lint:lit
```

### Testing

```shell
# lint, unit test and visual-diff test
npm test

# lint only
npm run lint

# unit tests only
npm run test:headless

# debug or run a subset of local unit tests
# then navigate to `http://localhost:9876/debug.html`
npm run test:headless:watch
```

#### Note on Sauce Labs tests

Pull requests run cross-browser tests using Sauce. For troubleshooting,
see https://wiki.saucelabs.com/pages/viewpage.action?pageId=70072943.

### Visual Diff Testing

This repo uses the [@brightspace-ui/visual-diff utility](https://github.com/BrightspaceUI/visual-diff/) to compare current snapshots against a set of golden snapshots stored in source control.

The visual diff action uses aws secrets that are generated in the [iam-build-tokens repo](https://github.com/Brightspace/iam-build-tokens/blob/master/terraform/roles/insights-dashboards.tf)

```shell
# run visual-diff tests
npm run test:diff

# subset of visual-diff tests:
npm run test:diff -- -g some-pattern

# update visual-diff goldens
npm run test:diff:golden
```

Golden snapshots are stored in your repo so only generate new goldens if you are sure you want to keep them. Commiting and pushing them will overwrite the goldens other members will compare against.

The github bot may create a new pull request to merge new goldens into your PR. You can check the difference between the goldens and the new snapshots by
1. Going into the pr, changes, and finding the report.html file of the test you want to observe.
2. Save the file to your computer or copy the contents into an online html viewer.
3. Differences will be highlighted in red. If you approve these changes accept the bots pr.

Note: Place all visual tests in the ./test/visual-diff folder or they will be ignored by the Github Action.

## Versioning, Releasing & Deploying

All version changes should obey [semantic versioning](https://semver.org/) rules.

Include either `[increment major]`, `[increment minor]` or `[increment patch]` in your merge commit message to automatically increment the `package.json` version and create a tag.

## Telemetry

This app gathers performance and usage telemetry. You can find more details [here](https://desire2learn.atlassian.net/wiki/spaces/DRACO/pages/1697317280/Engagement+Dashboard+Telemetry)
