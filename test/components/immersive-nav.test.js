import '../../components/immersive-nav';

import { expect, fixture, html } from '@open-wc/testing';
import { runConstructor } from '@brightspace-ui/core/tools/constructor-test-helper.js';
import sinon from 'sinon/pkg/sinon-esm.js';

describe('d2l-insights-immersive-nav', () => {
	describe('constructor', () => {
		it('should construct', () => {
			runConstructor('d2l-insights-immersive-nav');
		});
	});

	describe('accessibility', () => {
		it('should pass all axe tests', async() => {
			const el = await fixture(html`<d2l-insights-immersive-nav></d2l-insights-immersive-nav>`);
			await expect(el).to.be.accessible();
		});
	});

	describe('render', () => {
		it('should render proper title and href for default view', async() => {
			const el = await fixture(html`<d2l-insights-immersive-nav></d2l-insights-immersive-nav>`);

			const titile = el.shadowRoot.querySelector('.d2l-insights-immersive-nav-title').innerText;
			expect(titile).to.equal('Engagement Dashboard');

			const href = el.shadowRoot.querySelector('d2l-navigation-link-back').href;
			expect(href).to.contain('/d2l/ap/insightsPortal/main.d2l?ou=0');
		});

		it('should render proper title for home view', async() => {
			const viewState = { currentView: 'home' };
			const el = await fixture(html`<d2l-insights-immersive-nav .viewState="${viewState}"></d2l-insights-immersive-nav>`);

			const titile = el.shadowRoot.querySelector('.d2l-insights-immersive-nav-title').innerText;
			expect(titile).to.equal('Engagement Dashboard');
		});

		it('should render proper title for user view', async() => {
			const viewState = { currentView: 'user' };
			const el = await fixture(html`<d2l-insights-immersive-nav .viewState="${viewState}"></d2l-insights-immersive-nav>`);

			const titile = el.shadowRoot.querySelector('.d2l-insights-immersive-nav-title').innerText;
			expect(titile).to.equal('Learner Engagement Dashboard');
		});

		it('should render proper href', async() => {
			const el = await fixture(html`<d2l-insights-immersive-nav org-unit-id="1201"></d2l-insights-immersive-nav>`);

			const href = el.shadowRoot.querySelector('d2l-navigation-link-back').href;
			expect(href).to.contain('/d2l/ap/insightsPortal/main.d2l?ou=1201');
		});
	});

	describe('interactions/eventing', () => {
		it('on user view, should navigate to the home view when component`s back button is hit', async() => {
			const viewStateSpy = sinon.spy({ currentView: 'user', setHomeView() {} });
			const el = await fixture(html`<d2l-insights-immersive-nav .viewState="${viewStateSpy}"></d2l-insights-immersive-nav>`);
			el.shadowRoot.querySelector('d2l-navigation-link-back').click();
			expect(viewStateSpy.setHomeView.called).to.be.true;
		});

		it('on home view, should NOT navigate to the home view when component`s back button is hit', async() => {
			const viewStateSpy = sinon.spy({ currentView: 'home', setHomeView() {} });
			const el = await fixture(html`<d2l-insights-immersive-nav .viewState="${viewStateSpy}"></d2l-insights-immersive-nav>`);
			el.shadowRoot.querySelector('d2l-navigation-link-back').click();

			expect(viewStateSpy.setHomeView.called).to.be.false;
		});
	});
});
