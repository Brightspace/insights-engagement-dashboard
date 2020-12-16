const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('engagement-dashboard', () => {

	const visualDiff = new VisualDiff('engagement-dashboard', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({
			width: 1275,
			height: 2200,
			deviceScaleFactor: 1
		});
		await page.goto(
			`${visualDiff.getBaseUrl()}/test/visual-diff/d2l-insights-engagement-dashboard.visual-diff.html`,
			{ waitUntil: ['networkidle0', 'load'] }
		);
		// Accept the default view popup and close it.
		await page.keyboard.press('Tab');
		await page.keyboard.press('Enter');
		await page.bringToFront();
	});

	after(() => browser.close());

	it('Desktop', async function() {
		const rect = await visualDiff.getRect(page, 'd2l-insights-engagement-dashboard');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('Mobile', async function() {
		await page.setViewport({
			width: 682,
			height: 3000,
			deviceScaleFactor: 1
		});
		const rect = await visualDiff.getRect(page, 'd2l-insights-engagement-dashboard');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

});
