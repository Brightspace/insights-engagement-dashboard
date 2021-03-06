# d2l-insights-engagement-dashboard

[![Build Status](https://travis-ci.com/Brightspace/insights-engagement-dashboard.svg?branch=master)](https://travis-ci.com/Brightspace/insights-engagement-dashboard)
[![Dependabot badge](https://flat.badgen.net/dependabot/Brightspace/insights-engagement-dashboard?icon=dependabot)](https://app.dependabot.com/)

Displays engagement statistics and visualizations for Brightspace users. Part of the Insights Portal.

## Usage

```html
<script type="module">
    import '@brightspace/d2l-engagement-dashboard/engagement-dashboard.js';
</script>
<d2l-insights-engagement-dashboard></d2l-insights-engagement-dashboard>
```

**Properties:**

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| isDemo   | Boolean | false | Use demo data instead of real data. |
| orgUnitId | Number | 0 | The root org unit id. |
| telemetryEndpoint | String | {empty} | The URL of the telemetry service. |
| telemetryId | String | {empty} | The ID to use when sending telemetry info to the telemetry service. |
| metronEndpoint | String | {empty} | The metron API endpoint used to access data. |
| s3Enabled | Boolean | false | Whether student success system (S3) is enabled. |
| showCourseAccessCard | Boolean | true | Shows the course access card. |
| showDiscussionsCard | Boolean | true | Shows the discussion activity card. |
| showGradesCard | Boolean | true | Shows the grades card. |
| showOverdueCard | Boolean | true | Shows the overdue assignments card. |
| showResultsCard | Boolean | true | Shows the results card. |
| showSystemAccessCard | Boolean | true | Shows the system access card. |
| showAverageGradeSummaryCard | Boolean | true | (User Drill) Shows the average grade summary card. |
| showContentViewsTrendCard | Boolean | true | (User Drill) Shows the content views trend card. |
| showCourseAccessTrendCard | Boolean | true | (User Drill) Shows the course access trend card. |
| showGradesTrendCard | Boolean | true | (User Drill) Shows the grades trend card. |
| showCoursesCol | Boolean | true | No effect (the courses column is always shown). |
| showDiscussionsCol | Boolean | true | Shows the Discussion activity column in the users table and the user drill courses table. |
| showGradeCol | Boolean | true | Shows the Final Grade column in the users table and the Current Grade column in the user drill courses table. |
| showLastAccessCol | Boolean | true | Shows the System Last Access column in the users table, and the Course Last Access column in the user drill courses table. |
| showTicCol | Boolean | true | Shows the Time in Content column in the users table and the user drill courses table. |
| showPredictedGradeCol | Boolean | true | Shows the Predicted Grade column in the user drill courses table. |
| lastAccessThresholdDays | Number | 14 | The number of days since the last system access to show in the system access card. |
| includeRoles | String | {empty, i.e. all roles} | A list of role ids to include in the dashboard data. Roles that are not in the list will not be shown in the dashboard. |

## Developing, Testing and Contributing

After cloning the repo, run `npm install` to install dependencies.

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

A useful way to debug visual tests is to check the report that is created when the tests fail.

Golden snapshots generated locally will not replace the ones generated by the CI Action. Goldens generated by the CI action are stored in ./test/visual-diff/screenshots/ci/goldens. Locally created goldens will appear in ./test/visual-diff/screenshots and are ignored by git. The goldens generated by the ci are not ignored as they are used by the action for diffing.

If the action fails you can view the diff report by
1. Opening the failed visual test action in your PR (Not the bots PR)
2. Find the failed test in the action window
3. Click on the `Result:` link (should be soemthing like visual-diff.d2l.dev/)

When the action fails the github bot will open a pr with new snapshots. Merging this PR into your branch will replace the goldens with the snapshots from the previouse vs diff test. Use the steps above to evaluate the differences and if you want them to become the new goldens
1. Merge the bots PR into your PR
2. Merging will trigger another visual diff test which, hopefully, will pass now that it is using the new goldens.

Note: Place all visual tests in the ./test/visual-diff folder or they will be ignored by the Github Action.

To run diff tests locally

```
# install puppeteer and visual-diff locally
npm i mocha -g
npm i @brightspace-ui/visual-diff puppeteer --no-save

# for powershell
$Env:GITHUB_REPOSITORY="Brightspace/insights-engagement-dashboard"

# for bash
export GITHUB_REPOSITORY=Brightspace/insights-engagement-dashboard

npm run test:diff:golden
# make some changes
npm run test:diff
```

Once finished you can find the report in ./test/visual-diff/screenshots/current/\<test-name\>/report.html, VSCode users can use an html previewer extension for quick debugging.

### Releasing and Versioning

To make a release, update the version number in package.json and
make a release in github. BSI and LMS changes will be handled by
automation (master branch only: release branches of the LMS
have to be handled manually).

This repo uses the following versioning scheme for both package.json
and release tags:
- major: always 1, so BSI automatically picks up every update
- minor: the minor and patch LMS version with zero-padding; e.g. 2012 for 2020 December, 2101 for the January release, etc.
- patch: increment as needed

### Deploying

#### Before dev done
1. Decide which commit will be the cutoff for this release. Create a branch named "r20.xx.xx" off of that commit,
   where "x" is the corresponding LMS release, e.g. "r20.21.01"
2. In Github, go to "Releases > Draft a new release" to create a new release. Select the "r20.xx.xx" branch as the
   target. Tag according to the versioning scheme in [Releasing and Versioning](#releasing-and-versioning).
   * BSI should automatically pick up the new version if it has been tagged correctly.

#### After dev done (during cert)
1. Wait for the translations PR to arrive. This PR should target the master branch. It should arrive around 1-1.5 weeks
   after dev done. Check the [#serge_status](https://d2l.slack.com/archives/CA71JLR4H) channel in Slack for translations
   status updates.

2. Create a new branch off the r20.xx.xx branch. Cherry-pick the commits from the translations PR to this new branch.
   Create a second PR with r20.xx.xx as its target.

3. Using the r20.xx.xx-derived branch, verify that the translations don't cause any formatting issues.
	* NB: When testing on a local LMS, you may need to temporarily disable the OSLO langterms override for the langterms
	  to appear. In `localizer.js`, replace
```js
return await getLocalizeOverrideResources(
	lang,
	Object.assign(enTranslations.default, translations.default),
	getCollectionName
);
```
with
```js
return {
	language: lang,
	resources: Object.assign(enTranslations.default, translations.default)
};
```
DO NOT ship this change.

4. After making any desired changes, merge the second PR into r20.xx.xx. Cherry-pick any changes commits back onto the
   first PR's branch and merge that into master.

5. In Github, go to "Releases > Draft a new release" to create a new release. Select the "r20.xx.xx" branch as the
   target. Tag according to the versioning scheme in [Releasing and Versioning](#releasing-and-versioning).

6. Go to the brightspace-integration repo in Github. BSI should automatically pick up the new engagement dashboard tag
   and create a PR to merge that change into master. (To expedite this process, run the "BSI Update" Github action
   in the BSI repo).

7. Create a new branch off the 20.xx.xx branch of BSI. Copy the relevant changes from the auto-generated PR to the new
   branch and create a PR against the BSI 20.xx.xx branch.

8. After approval / merge, wait for the new BSI release to be created. It will be called something like "v20.xx.xx-xxx"
   and should correspond to the LMS version you're deploying to.

9. Create a new LMS branch off the "release/20.xx.xx" branch. Update
   `lp/_config/Infrastructure/D2L.LP.Web.UI.Html.Bsi.config.json` with the new BSI version. Create a PR and merge into
   the release/20.xx.xx branch.

## Telemetry

This app gathers performance and usage telemetry. You can find more details [here](https://desire2learn.atlassian.net/wiki/spaces/DRACO/pages/1697317280/Engagement+Dashboard+Telemetry)
