import { html } from 'lit-element';

export const renderWarning = () => html`
	<svg width="22" height="22" xmlns="http://www.w3.org/2000/svg">
		<g fill="none" fill-rule="evenodd">
			<path fill="#FFF" d="M0 0h22v22H0z"/>
			<path d="M18.864 16.47L12.623 3.989a1.783 1.783 0 00-3.192 0L3.189 16.47a1.761 1.761 0 00.08 1.73c.325.525.898.798 1.516.799h12.483c.618 0 1.192-.273 1.516-.8.237-.335.265-1.37.08-1.73z" fill="#CD2026" fill-rule="nonzero"/>

			<path d="M11.027 17.264a1.337 1.337 0 110-2.675 1.337 1.337 0 010 2.675zM11.9 12.98a.892.892 0 01-1.747 0L9.27 8.52a.892.892 0 01.874-1.064h1.768a.892.892 0 01.874 1.065l-.886 4.458z" fill="#FFF"/>
		</g>
	</svg>
`;
