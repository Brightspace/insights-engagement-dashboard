const puppeteer = require('puppeteer');
const VisualDiff = require('@brightspace-ui/visual-diff');

describe('summary cards', () => {

	const visualDiff = new VisualDiff('summary-cards', __dirname, { tolerance: 0.05 });

	let browser, page, rect, removeCard;

	before(async() => {
		browser = await puppeteer.launch();
		page = await visualDiff.createPage(browser);
		await page.setViewport({
			width: 1275,
			height: 1275,
			deviceScaleFactor: 1
		});
		await page.goto(
			`${visualDiff.getBaseUrl()}/test/visual-diff/d2l-insights-engagement-dashboard.visual-diff.html?v=home%2C0&ouf=3`,
			{ waitUntil: ['networkidle0', 'load'] }
		);
		// Accept the default view popup and close it.
		await page.bringToFront();

		rect = await page.evaluate(() => {
			const elm = document.querySelector('d2l-insights-engagement-dashboard')
				.shadowRoot.querySelector('d2l-summary-cards-container');
			return {
				x: elm.offsetLeft - 5,
				y: elm.offsetTop - 5,
				width: elm.scrollWidth + 5,
				height: elm.scrollHeight,
			};
		});

		removeCard = async(name) => {
			await page.evaluate((name) => {
				document.querySelector('d2l-insights-engagement-dashboard').removeAttribute(name);
			}, name);
			// wait for dashboard to render changes
			await new Promise(res => setTimeout(res, 50));
		};
	});

	after(() => browser.close());

	it('Summary Container All', async function() {

		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('Summary Container (Overdue, Discussion, System Access)', async function() {

		await removeCard('results-card');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('Summary Container (Discussion, System Access)', async function() {

		await removeCard('overdue-card');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});

	it('Summary Container (System Access)', async function() {

		await removeCard('discussions-card');
		await visualDiff.screenshotAndCompare(page, this.test.fullTitle(), { clip: rect });
	});
});
