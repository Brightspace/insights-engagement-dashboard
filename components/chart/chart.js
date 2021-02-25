import 'highcharts';
import 'highcharts/modules/histogram-bellcurve';
import 'highcharts/modules/accessibility';
import '@brightspace-ui/core/components/loading-spinner/loading-spinner.js';
import '../overlay';

import { css, html, LitElement } from 'lit-element';
import { getDateTimeDescriptor } from '@brightspace-ui/intl/lib/dateTime';
import { getNumberDescriptor } from '@brightspace-ui/intl/lib/number';
import { Localizer } from '../../locales/localizer';
import { SkeletonMixin } from '@brightspace-ui/core/components/skeleton/skeleton-mixin.js';

const easeOut = (t) => (1 - (--t) * t * t * t);
const defaultAnimationOptions = {
	duration: 500,
	easing: easeOut,
};
// use default highcharts's template but with <h3> instead of <h4> to fix axe heading-order error
export const BEFORE_CHART_FORMAT = '<h3>{chartTitle}</h3>' +
	'<div>{typeDescription}</div>' +
	'<div>{chartSubtitle}</div>' +
	'<div>{chartLongdesc}</div>' +
	'<div>{playAsSoundButton}</div>' +
	'<div>{viewTableButton}</div>' +
	'<div>{xAxisDescription}</div>' +
	'<div>{yAxisDescription}</div>' +
	'<div>{annotationsTitle}{annotationsList}</div>';

/**
 * based on highcharts-webcomponent (npm) - main modifications: convert to plain .js, fix import, fix typing,
 * remove flag for suppressing updates, prevent unneeded update on first render
 * @element highcharts-chart
 */
class Chart extends SkeletonMixin(Localizer(LitElement)) {
	static get properties() {
		return {
			options: { type: Object, attribute: false },
			globalOptions: { type: Object, attribute: false },
			constructorType: { type: String },
			highcharts: { type: Object, attribute: false },
			immutable: { type: Boolean },
			updateArgs: { type: Array, attribute: false },
			doNotUseOverlay: { type: Boolean, attribute: 'do-not-use-overlay' }
		};
	}

	constructor() {
		super();
		/**
		 * String for constructor method. Official constructors:
		 *  - 'chart' for Highcharts charts
		 *  - 'stockChart' for Highstock charts
		 *  - 'mapChart' for Highmaps charts
		 *  - 'ganttChart' for Gantt charts
		 */
		this.constructorType = 'chart';
		/**
		 * Used to pass the Highcharts instance after modules are initialized.
		 * If not set the component will try to get the Highcharts from window.
		 */
		// Highcharts is an implicit global: importing it properly doesn't work with es-dev-server
		// eslint-disable-next-line no-undef
		this.highcharts = Highcharts;
		/**
		 * Reinitialises the chart on prop update (as oppose to chart.update())
		 * useful in some cases but slower than a regular update.
		 */
		this.immutable = false;
		/**
		 * Checks accessibility preferences and enables or disables them accordingly.
		 */
		this.showAnimations = !window.matchMedia('(prefers-reduced-motion: reduce)').matches ?
			defaultAnimationOptions : false;
		/**
		 * Array of update()'s function optional arguments.
		 * Parameters should be defined in the same order like in
		 * native Highcharts function: [redraw, oneToOne, animation].
		 * (Here)[https://api.highcharts.com/class-reference/Highcharts.Chart#update] is a more specific description of the parameters.
		 */
		this.updateArgs = [
			true,
			true,
			this.showAnimations
		];
		this.globalOptions = null;
	}

	static get styles() {
		return css`
			:host {
				display: inline-block;
				position: relative;
			}
			:host([hidden]) {
				display: none;
			}
		`;
	}

	setDefaultOptions() {
		// check for series and plotOptions because we could have a column instead.
		if (!this.options.plotOptions) {
			return;
		}
		else if (this.options.plotOptions.series) {
			this.options.plotOptions.series.animation = this.showAnimations;
		}
		else if (this.options.plotOptions.column) {
			this.options.plotOptions.column.animation = this.showAnimations;
		}
	}

	render() {
		if (this.globalOptions) {
			this.highcharts.setOptions(this.globalOptions);
		}

		return html`
			<div id="chart-container" tabindex="${this.skeleton ? -1 : 0}"></div>
			<d2l-insights-overlay spinner-size="150" ?skeleton="${this.skeleton && !this.doNotUseOverlay}"></d2l-insights-overlay>
		`;
	}

	updated() {
		if (!this.immutable && this.chart) {
			this.chart.update(this.options, ...(this.updateArgs || [true, true]));
		}
		else {
			this.createChart();
		}
	}

	createChart() {
		const H = this.highcharts;
		const constructorType = this.constructorType;
		if (!H) {
			console.warn('The "highcharts" property was not passed.');
		}
		else if (!H[constructorType]) {
			console.warn('The "constructorType" property is incorrect or some ' +
				'required module is not imported.');
		}
		else if (!this.options) {
			console.warn('The "options" property was not passed.');
		}
		else {
			// accessible options overload
			this.setDefaultOptions();

			const langAccessibility = {
				accessibility: {
					screenReaderSection: {
						// fixes axe error: Landmarks must have a unique role or role/label/title
						beforeRegionLabel: ''
					}
				}
			};

			// Create a chart
			H.setOptions({ lang: Object.assign({}, this._langOptions, langAccessibility) });
			this.chart = H[constructorType](this.chartContainer, this.options, this.chartCreated.bind(this));
			// force highcharts to recalculate the chart position incase the filter move the graph
			this.chartContainer.addEventListener('click', () => (delete this.chart.pointer.chartPosition));
		}
	}

	chartCreated(chart) {
		const e = new CustomEvent('load', {
			detail: chart
		});
		this.dispatchEvent(e);
	}

	disconnectedCallback() {
		if (this.chart) {
			this.chart.destroy();
			this.chart = null;
		}
	}

	get chartContainer() {
		return this.shadowRoot.querySelector('#chart-container');
	}

	get _langOptions() {
		const dateTimeDescriptor = getDateTimeDescriptor();
		const numberDescriptor = getNumberDescriptor();

		return {
			loading: this.localize('chart:loading'),
			months:  dateTimeDescriptor.calendar.months.long,
			shortMonths:  dateTimeDescriptor.calendar.months.short,
			weekdays: dateTimeDescriptor.calendar.days.long,

			decimalPoint: numberDescriptor.symbols.decimal,
			resetZoom: this.localize('chart:resetZoom'),
			resetZoomTitle: this.localize('chart:resetZoomTitle'),
			thousandsSep: numberDescriptor.symbols.group,
		};
	}
}
customElements.define('d2l-labs-chart', Chart);
