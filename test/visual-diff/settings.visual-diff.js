const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('settings', () => {

	const visualDiff = new VisualDiff('settings', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({
			width: 1275,
			height: 2300,
			deviceScaleFactor: 1
		});
		await page.goto(
			`${visualDiff.getBaseUrl()}/test/visual-diff/d2l-insights-engagement-dashboard.visual-diff.html?v=settings%2C0&ouf=3`,
			{ waitUntil: ['networkidle0', 'load'] }
		);
		await page.bringToFront();
	});

	after(() => browser.close());

	it('Summary Metrics Desktop', async function() {
		const rect = await visualDiff.getRect(page, 'd2l-insights-engagement-dashboard');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('Summary Metrics Mobile', async function() {
		await page.setViewport({
			width: 682,
			height: 3300,
			deviceScaleFactor: 1
		});
		const rect = await visualDiff.getRect(page, 'd2l-insights-engagement-dashboard');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('Results Table Metrics Desktop', async function() {
		await page.evaluate(() => {
			document.querySelector('d2l-insights-engagement-dashboard')
				.shadowRoot.querySelector('d2l-insights-engagement-dashboard-settings')
				.shadowRoot.querySelector('d2l-tabs')
				.shadowRoot.querySelector('d2l-tab-internal[text="Results Table Metrics"]')
				.click();
		});
		await page.setViewport({
			width: 1275,
			height: 2300,
			deviceScaleFactor: 1
		});
		const rect = await visualDiff.getRect(page, 'd2l-insights-engagement-dashboard');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('Results Table Metrics Mobile', async function() {
		await page.setViewport({
			width: 682,
			height: 3300,
			deviceScaleFactor: 1
		});
		const rect = await visualDiff.getRect(page, 'd2l-insights-engagement-dashboard');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});
});
