import '@brightspace-ui/core/components/alert/alert-toast.js';
import { html, LitElement } from 'lit-element/lit-element.js';
import { Localizer } from '../locales/localizer';
import { RtlMixin } from '@brightspace-ui/core/mixins/rtl-mixin';

class CustomToastMessage extends RtlMixin(Localizer(LitElement)) {

	render() {
		return html`
			<d2l-alert-toast type="critical"></d2l-alert-toast>
		`;
	}

	systemLastAccessError() {
		this.shadowRoot.querySelector('d2l-alert-toast').innerHTML = this.localize('settings:invalidSystemAccessValueToast');
		this.shadowRoot.querySelector('d2l-alert-toast').open = true;
	}
}

customElements.define('d2l-insights-custom-toast-message', CustomToastMessage);
