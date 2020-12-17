import '../../components/message-container';

import { expect, fixture, html, oneEvent } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';

describe('d2l-insights-message-container', () => {

	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-message-container');
		});
	});

	describe('default message', () => {
		let el;
		before(async() => {
			el = await fixture(html`
				<d2l-insights-message-container type="default" text="some text"></d2l-insights-message-container>
			`);
		});

		it('should pass all axe tests', async() => {
			await expect(el).to.be.accessible();
		});

		it('should render correctly', () => {
			const innerSpan = el.shadowRoot.querySelector('span');
			expect(innerSpan.innerText).to.equal('some text');
		});
	});

	describe('message with button', () => {
		let el;
		before(async() => {
			el = await fixture(html`
				<d2l-insights-message-container type="button" text="some text" button-text="button text"></d2l-insights-message-container>
			`);
		});

		it('should pass all axe tests', async() => {
			await expect(el).to.be.accessible();
		});

		it('should render correctly', () => {
			const innerSpan = el.shadowRoot.querySelector('span');
			expect(innerSpan.innerText).to.equal('some text');

			const button = el.shadowRoot.querySelector('d2l-button');
			expect(button.innerText).to.equal('button text');
		});

		it('should fire an event when clicked', async() => {
			const listener = oneEvent(el, 'd2l-insights-message-container-button-click');
			const button = el.shadowRoot.querySelector('d2l-button');
			button.click();
			await listener;
		});
	});

	describe('message with link', () => {
		let el;
		before(async() => {
			el = await fixture(html`
				<d2l-insights-message-container type="link" text="some text" href="https://www.example.com" link-text="link text"></d2l-insights-message-container>
			`);
		});

		it('should pass all axe tests', async() => {
			await expect(el).to.be.accessible();
		});

		it('should render correctly', () => {
			const innerSpan = el.shadowRoot.querySelector('span');
			// it adds a bunch of \n and \t characters which don't appear on-screen
			expect(innerSpan.innerText.trim().split('\n')[0]).to.equal('some text');

			const link = el.shadowRoot.querySelector('a');
			expect(link.innerText).to.equal('link text');
			expect(link.href).to.equal('https://www.example.com/');
		});
	});
});
