import '../../components/column-configuration';

import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-engagement-column-configuration', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-engagement-column-configuration');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-engagement-column-configuration></d2l-insights-engagement-column-configuration>`);
			await expect(el).to.be.accessible({
				ignoredRules: [
					'aria-allowed-attr' // Requires d2l-list-item component fix
				]
			});
		});
	});

	describe('render', () => {
		it('should show predicted grade option if s3 is enabled', async() => {
			const el = await fixture(html`
				<d2l-insights-engagement-column-configuration student-success-system-enabled>
				</d2l-insights-engagement-column-configuration>
			`);

			const listItem = el.shadowRoot.querySelector('d2l-list-item[key="showPredictedGradeCol"]');
			expect(listItem).to.not.be.null;
		});

		it('should hide predicted grade option if s3 is not enabled', async() => {
			const el = await fixture(html`<d2l-insights-engagement-column-configuration></d2l-insights-engagement-column-configuration>`);
			const listItem = el.shadowRoot.querySelector('d2l-list-item[key="showPredictedGradeCol"]');
			expect(listItem).to.be.null;
		});
	});

	describe('card selection', () => {

		const testCases = [
			'showTicCol',
			'showGradeCol',
			// 'showCoursesCol', // NB: showing/hiding the courses column isn't configurable.
			'showLastAccessCol',
			'showDiscussionsCol',
			'showPredictedGradeCol'
		];

		testCases.forEach(column => {
			it(`should update properties when ${column} is selected or deselected`, async() => {
				const el = await fixture(html`
					<d2l-insights-engagement-column-configuration student-success-system-enabled>
					</d2l-insights-engagement-column-configuration>
				`);

				const listItem = el.shadowRoot.querySelector(`d2l-list-item[key="${column}"]`);
				const otherColumns = testCases.filter(testCase => testCase !== column);

				listItem.setSelected(true);
				await el.updateComplete;

				expect(el[column]).to.be.true;
				otherColumns.forEach(otherColumn => {
					expect(el[otherColumn]).to.be.false;
				});

				listItem.setSelected(false);
				await el.updateComplete;

				expect(el[column]).to.be.false;
				otherColumns.forEach(otherColumn => {
					expect(el[otherColumn]).to.be.false;
				});
			});
		});
	});
});
