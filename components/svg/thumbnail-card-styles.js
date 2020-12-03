import { css } from 'lit-element/lit-element';

export const thumbnailCardStyles = css`
	.d2l-insights-thumbnail-title {
		font-size: smaller;
		font-weight: bold;
		margin-left: 16px;
		margin-right: 0;
		margin-top: 5px;
		overflow: hidden;
		position: absolute;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 270px;
	}

	:host([dir="rtl"]) .d2l-insights-thumbnail-title {
		font-size: smaller;
		font-weight: bold;
		margin-left: 0;
		margin-right: 14px;
		margin-top: 5px;
		overflow: hidden;
		position: absolute;
		text-overflow: ellipsis;
		white-space: nowrap;
		width: 270px;
	}
`;
