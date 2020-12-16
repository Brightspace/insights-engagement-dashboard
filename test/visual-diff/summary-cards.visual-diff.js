const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('summary cards', () => {

	const visualDiff = new VisualDiff('summary-cards', __dirname);

	let browser, page;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({
			width: 1275,
			height: 1275,
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

	it('Summary Container All', async function() {

		const rect = await page.evaluate(() => {
			const elm = document.querySelector('d2l-insights-engagement-dashboard')
				.shadowRoot.querySelector('d2l-summary-cards-container');
			return {
				x: elm.offsetLeft - 5,
				y: elm.offsetTop - 5,
				width: elm.scrollWidth + 5,
				height: elm.scrollHeight,
			};
		});

		console.log(rect);
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});
});
