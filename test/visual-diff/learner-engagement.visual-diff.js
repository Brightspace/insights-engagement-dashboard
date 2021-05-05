const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('learner-engagement', () => {

	const visualDiff = new VisualDiff('learner-engagement', __dirname, { tolerance: 0.1 });

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
			`${visualDiff.getBaseUrl()}/test/visual-diff/d2l-insights-engagement-dashboard.visual-diff.html?v=userSelection%2C0&ouf=3`,
			{ waitUntil: ['networkidle0', 'load'] }
		);
		await new Promise(res => setTimeout(res, 300));
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
