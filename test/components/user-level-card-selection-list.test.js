import '../../components/user-level-card-selection-list';

import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-engagement-user-card-selection-list', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-engagement-user-card-selection-list');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-engagement-user-card-selection-list></d2l-insights-engagement-user-card-selection-list>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('get settings', () => {
		const defaultSettingsTemplate = {
			showAvgGradeSummaryCard: false,
			showContentViewsTrendCard: false,
			showCourseAccessTrendCard: false,
			showGradesTrendCard: false
		};

		describe('defaults', () => {
			it('should return defaults if no properties are passed', async() => {
				const el = await fixture(html`<d2l-insights-engagement-user-card-selection-list></d2l-insights-engagement-user-card-selection-list>`);

				expect(el.settings).to.deep.equal(defaultSettingsTemplate);
			});

			it('should return values if properties are passed', async() => {
				const el = await fixture(html`<d2l-insights-engagement-user-card-selection-list
					average-grade-summary-card
					content-views-trend-card
					course-access-trend-card
					grades-trend-card
				></d2l-insights-engagement-user-card-selection-list>`);

				expect(el.settings).to.deep.equal({
					showAvgGradeSummaryCard: true,
					showContentViewsTrendCard: true,
					showCourseAccessTrendCard: true,
					showGradesTrendCard: true
				});
			});
		});

		describe('card selection', () => {
			it('should return modified settings if settings have been changed', async() => {
				const el = await fixture(html`<d2l-insights-engagement-user-card-selection-list></d2l-insights-engagement-user-card-selection-list>`);
				const listItem = el.shadowRoot.querySelector('d2l-list-item[key="showGradesTrendCard"]');

				listItem.setSelected(true);
				await el.updateComplete;
				expect(el.settings).to.deep.equal({ ...defaultSettingsTemplate, showGradesTrendCard: true });

				listItem.setSelected(false);
				await el.updateComplete;
				expect(el.settings).to.deep.equal(defaultSettingsTemplate);
			});
		});
	});
});
