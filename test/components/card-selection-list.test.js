import '../../components/card-selection-list';

import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-engagement-card-selection-list', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-engagement-card-selection-list');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-engagement-card-selection-list></d2l-insights-engagement-card-selection-list>`);
			await expect(el).to.be.accessible({
				ignoredRules: [
					'aria-allowed-attr' // Requires d2l-list-item component fix
				]
			});
		});
	});

	describe('get settings', () => {
		const defaultSettingsTemplate = {
			showResultsCard: false,
			showOverdueCard: false,
			showDiscussionsCard: false,
			showSystemAccessCard: false,
			showGradesCard: false,
			showTicGradesCard: false,
			showContentViewCard: false,
			showCourseAccessCard: false,
			lastAccessThresholdDays: 14
		};

		describe('defaults', () => {
			it('should return defaults if no properties are passed', async() => {
				const el = await fixture(html`<d2l-insights-engagement-card-selection-list></d2l-insights-engagement-card-selection-list>`);

				expect(el.settings).to.deep.equal(defaultSettingsTemplate);
			});

			it('should return values if properties are passed', async() => {
				const el = await fixture(html`<d2l-insights-engagement-card-selection-list
					content-view-card
					course-access-card
					discussions-card
					grades-card
					overdue-card
					results-card
					system-access-card
					tic-grades-card
					last-access-threshold-days="21"
				></d2l-insights-engagement-card-selection-list>`);

				expect(el.settings).to.deep.equal({
					showContentViewCard: true,
					showResultsCard: true,
					showOverdueCard: true,
					showDiscussionsCard: true,
					showSystemAccessCard: true,
					showGradesCard: true,
					showTicGradesCard: true,
					showCourseAccessCard: true,
					lastAccessThresholdDays: 21
				});
			});
		});

		describe('card selection', () => {
			it('should return modified settings if settings have been changed', async() => {
				const el = await fixture(html`<d2l-insights-engagement-card-selection-list></d2l-insights-engagement-card-selection-list>`);
				const listItem = el.shadowRoot.querySelector('d2l-list-item[key="showGradesCard"]');

				listItem.setSelected(true);
				await el.updateComplete;
				expect(el.settings).to.deep.equal({ ...defaultSettingsTemplate, showGradesCard: true });

				listItem.setSelected(false);
				await el.updateComplete;
				expect(el.settings).to.deep.equal(defaultSettingsTemplate);
			});
		});

		describe('lastAccessThreshold field', () => {
			it('should return modified lastAccessThreshold if the new value is valid', async() => {
				const el = await fixture(html`<d2l-insights-engagement-card-selection-list></d2l-insights-engagement-card-selection-list>`);
				const thresholdInput = el.shadowRoot.querySelector('d2l-input-number');
				await thresholdInput.updateComplete;
				const textInput = thresholdInput.shadowRoot.querySelector('d2l-input-text');
				await textInput.updateComplete;
				const innerInput = textInput.shadowRoot.querySelector('input');

				innerInput.value = '21';
				innerInput.dispatchEvent(new Event('input'));
				innerInput.dispatchEvent(new Event('change'));
				await thresholdInput.updateComplete;

				expect(el.settings).to.deep.equal({ ...defaultSettingsTemplate, lastAccessThresholdDays: 21 });
				expect(el.isInvalidSystemAccessValue()).to.equal(false);
			});

			it('should set isInvalidSystemAccessValue to true if the new value is invalid', async() => {
				const el = await fixture(html`<d2l-insights-engagement-card-selection-list></d2l-insights-engagement-card-selection-list>`);
				const thresholdInput = el.shadowRoot.querySelector('d2l-input-number');
				await thresholdInput.updateComplete;
				const textInput = thresholdInput.shadowRoot.querySelector('d2l-input-text');
				await textInput.updateComplete;
				const innerInput = textInput.shadowRoot.querySelector('input');

				// not a number
				innerInput.value = 'asdf';
				innerInput.dispatchEvent(new Event('input'));
				innerInput.dispatchEvent(new Event('change'));
				await thresholdInput.updateComplete;

				expect(el.isInvalidSystemAccessValue()).to.equal(true);

				// less than valid range
				innerInput.value = '0';
				innerInput.dispatchEvent(new Event('input'));
				innerInput.dispatchEvent(new Event('change'));
				await thresholdInput.updateComplete;

				expect(el.isInvalidSystemAccessValue()).to.equal(true);

				// more than valid range
				innerInput.value = '31';
				innerInput.dispatchEvent(new Event('input'));
				innerInput.dispatchEvent(new Event('change'));
				await thresholdInput.updateComplete;

				expect(el.isInvalidSystemAccessValue()).to.equal(true);
			});
		});
	});
});
