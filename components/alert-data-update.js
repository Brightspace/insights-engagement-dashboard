import '@brightspace-ui/core/components/alert/alert';
import { action, decorate, observable } from 'mobx';
import { css, html } from 'lit-element';
import { classMap } from 'lit-html/directives/class-map';
import { Localizer } from '../locales/localizer';
import { MobxLitElement } from '@adobe/lit-mobx';
import { repeat } from 'lit-html/directives/repeat';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

class FilterEvent {

	constructor(message, description) {
		this._message = message;
		this._description = description;
		this._isRendered = false;
		this._id = '';
		this._killTimeout = undefined;
		this._remove = () => {};
		this._finished = new Promise(res => this._remove = res);
		this.closing = false;
	}

	get message() {

		if (!this._isRendered) {
			this._isRendered = true;
			this._killTimeout = setTimeout(() => {
				this._remove();
			}, 4000);
		}

		return this._message;
	}

	get description() {
		return this._description;
	}

	get id() {
		if (this._id === '') {
			this._id = new Array(10).fill(0).map(() =>  Math.round(Math.random() * 9)).join('');
		}
		return this._id;
	}

	get finished() {
		return this._finished;
	}

	markForRemoval() {
		if (!this.closing) {
			clearTimeout(this._killTimeout);
			setTimeout(() => {
				this._remove();
			}, 300);
		}
		this.closing = true;
	}
}

class FilterEventQueue {
	constructor(limit = 2) {
		this._limit = limit; // allows for manual overrides when testing
		this._events = [];
		this._callback = () => {};
	}

	get events() {
		return this._events;
	}

	get limit() {
		const reducedMotion = window.matchMedia('(prefers-reduced-motion)').matches;
		const isMobile = window.matchMedia('(max-width: 660px)').matches;
		if (reducedMotion || isMobile) return 1;

		return this._limit;
	}

	add(message, description) {
		if (description === true) description = message;
		const event = new FilterEvent(message, description);
		this._events.push(event);
		event.finished.then(() => {
			this._events.shift();
		});
		if (this._events.length > this.limit) {
			for (let i = 0; i < this._events.length - this.limit; i++) {
				this._events[i].markForRemoval();
			}
		}
	}
}

decorate(FilterEventQueue, {
	_events: observable,
	add: action
});

class AlertDataUpdate extends SkeletonMixin(Localizer(MobxLitElement)) {

	static get properties() {
		return {
			dataEvents: { type: Object, attribute: false }
		};
	}

	static get styles() {
		return [
			css`
				.d2l-insights-event-container {
					bottom: 0;
					margin: auto;
					margin-left: 50vw;
					position: fixed;
					transform: translateX(-50%);
					width: 500px;
				}

				.d2l-insights-event {
					box-shadow: 0 5px 10px rgba(0.23, 0.23, 0.23, 0.2);
					display: block;
					transition: margin-bottom 0.2s, opacity 0.2s;
				}

				.d2l-insights-event.d2l-insights-event-close {
					animation: fade-out 0.2s 0s 1 both;
				}

				.d2l-insights-event.d2l-insights-event-standard {
					animation: move-in-fade-out 4s 0s 1 forwards;
				}

				.d2l-insights-hidden {
					height: 0;
					margin: 0;
					opacity: 0;
				}

				@keyframes move-in-fade-out {
					0% { opacity: 0; }
					10% { margin-bottom: 1rem; opacity: 1; }
					90% { margin-bottom: 1rem; opacity: 1; }
					100% { margin-bottom: 1rem; opacity: 0; }
				}

				@keyframes fade-out {
					from { margin-bottom: 1rem; opacity: 1; }
					to { margin-bottom: 1rem; opacity: 0; }
				}
			`
		];
	}

	constructor() {
		super();
		this.dataEvents = {};
	}

	_renderEvent(e) {
		const classes = {
			'd2l-insights-event': true,
			'd2l-insights-event-close': e.closing
		};
		return html`
			<d2l-alert class="${classMap(classes)}">${e.message}</d2l-alert>
			<div class="d2l-insights-hidden" role="alert">${e.description}</div>
		`;
	}

	render() {
		return html`
			<div class="d2l-insights-event-container">
				${repeat(this.dataEvents.events, (event) => event.id, (event) => this._renderEvent(event))}
			</div>
		`;
	}

	updated() {
		/*
		* Properly animate the moving up motion.
		* Timeout because we need to wait a small amount
		* of time for the text to render
		*/
		setTimeout(() => {
			const eventEls = this.shadowRoot.querySelectorAll('.d2l-insights-event');
			if (eventEls.length > 0) {
				const lastEvent = eventEls[eventEls.length - 1];
				const height = `-${lastEvent.offsetHeight}px`;
				lastEvent.style['marginBottom'] = height;
				lastEvent.classList.add('d2l-insights-event-standard');
			}
		}, 0);
	}
}

customElements.define('d2l-insights-alert-data-updated', AlertDataUpdate);
const filterEventQueue = new FilterEventQueue();

export {
	filterEventQueue,
	FilterEventQueue
};
