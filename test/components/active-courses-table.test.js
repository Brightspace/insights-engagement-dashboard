import '../../components/active-courses-table';

import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-active-courses-table', () => {

	const userCourses = [
		[1, 100, 500, 1, 55, 1000, 1606506835387, 0, 0, 0],
		[2, 100, 500, 0, 60, 1100, null, 2, 4, 0]
	];

	const orgUnits = [
		[1, 'Course 1', 3, [3, 4], true],
		[2, 'Course 2', 3, [3, 10], true]
	];

	const isStudentSuccessSys = true;

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-active-courses-table');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-active-courses-table 
				.userCourses=${userCourses} 
				.orgUnits=${orgUnits}
				.isStudentSuccessSys=${isStudentSuccessSys}
				></d2l-insights-active-courses-table>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should render predicted grade column if isStudentSuccessSys true', async() => {
			const el = await fixture(html`<d2l-insights-active-courses-table
				.userCourses=${userCourses}
				.orgUnits=${orgUnits}
				.isStudentSuccessSys=${isStudentSuccessSys}
			></d2l-insights-active-courses-table>`);

			const userTable = el.shadowRoot.querySelector('d2l-insights-table');
			await new Promise(res => setTimeout(res, 10));
			const headers = [].slice.call(userTable.shadowRoot.querySelectorAll('th'));
			const headersArr = headers.map(e => { return e.innerText.trim(); });
			expect(headersArr).to.deep.equal(['Course Name', 'Current Grade', 'Predicted Grade', 'Time in Content (mins)', 'Discussion Activity', 'Course Last Access']);
		});

		it('should not render predicted grade column if isStudentSuccessSys false', async() => {
			const isStudSuccessSys = false;
			const el = await fixture(html`<d2l-insights-active-courses-table
				.userCourses=${userCourses}
				.orgUnits=${orgUnits}
				.isStudentSuccessSys=${isStudSuccessSys}
			></d2l-insights-active-courses-table>`);

			const userTable = el.shadowRoot.querySelector('d2l-insights-table');
			await new Promise(res => setTimeout(res, 10));
			const headers = [].slice.call(userTable.shadowRoot.querySelectorAll('th'));
			const headersArr = headers.map(e => { return e.innerText.trim(); });
			expect(headersArr).to.deep.equal(['Course Name', 'Current Grade', 'Time in Content (mins)', 'Discussion Activity', 'Course Last Access']);
		});
	});
});
