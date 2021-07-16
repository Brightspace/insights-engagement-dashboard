import { expect, fixture, html } from '@open-wc/testing';
import { assert } from 'sinon';
import shadowHash from '../../model/shadowHash';

describe('Shadow Hash', () => {

	it('Should register an element in the shadow hash', async() => {
		const id = 'test';
		const elm = await fixture(html`<div id="${id}"></div>`);
		shadowHash.register(elm);
		expect(shadowHash._store.has(id)).to.be.true;

	});

	it('Should fail to register an element in the shadow hash if there is no id', async() => {
		const elm = await fixture(html`<div id=""></div>`);
		try {
			shadowHash.register(elm);
			expect(false, 'The registration should have failed').to.be.true;
		} catch (_) {
			expect(true, 'The registration failed').to.be.true;
		}
	});

	it('Should query elements by id', async() => {
		const id = 'test';
		const elm = await fixture(html`<div id="${id}"></div>`);
		shadowHash.register(elm);
		expect(shadowHash.querySelector(`#${id}`)).to.exist;
	});

	it('Should query elements by class', async() => {
		const id = 'test';
		const className = 'test-class';
		const elm = await fixture(html`<div id="${id}" class="${className}"></div>`);
		shadowHash.register(elm);
		expect(shadowHash.querySelector(`.${className}`)).to.exist;
	});

	it('Should query elements by type', async() => {
		const id = 'test';
		const elm = await fixture(html`<div id="${id}"></div>`);
		shadowHash.register(elm);
		expect(shadowHash.querySelector('div')).to.exist;
	});
});
