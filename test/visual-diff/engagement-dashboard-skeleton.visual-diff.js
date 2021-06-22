const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('engagement-dashboard-skeleton', () => {

	// default value is 0.1 but VisualDiff overrides it to 0
	const visualDiff = new VisualDiff('engagement-dashboard-skeleton', __dirname, { tolerance: 0.1 });

	let page, browser;

	beforeEach(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		page
			.on('console', message => console.log(`${message.type().substr(0, 3).toUpperCase()} ${message.text()}`))
			.on('pageerror', ({ message }) => console.log(message))
			.on('requestfailed', request => console.log(`${request.failure().errorText} ${request.url()}`));

		await page.setViewport({
			width: 1275,
			height: 5000,
			deviceScaleFactor: 1
		});
		await page.goto(
			`${visualDiff.getBaseUrl()}/test/visual-diff/d2l-insights-engagement-dashboard.visual-diff.html#delay=3000`,
			{ waitUntil: ['networkidle0', 'load'] }
		);
		await page.bringToFront();
	});

	afterEach(() => browser.close());

	it('Desktop', async function() {
		const rect = await visualDiff.getRect(page, 'd2l-insights-engagement-dashboard');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('Mobile', async function() {
		await page.setViewport({
			width: 682,
			height: 5000,
			deviceScaleFactor: 1
		});
		const rect = await visualDiff.getRect(page, 'd2l-insights-engagement-dashboard');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});
});
