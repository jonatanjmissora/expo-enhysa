export const watermarkStyles = `
	.watermark {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		flex-wrap: wrap;
		align-content: center;
		align-items: center;
		justify-content: center;
		gap: 40px;
		transform: rotate(-30deg);
		pointer-events: none;
		opacity: 0.12;
		z-index: 2;
		overflow: hidden;
	}
	.watermark span {
		font-size: 52px;
		font-weight: 700;
		color: #000000;
		white-space: nowrap;
		letter-spacing: 8px;
	}
`

export function renderWatermark(): string {
	const spans = Array.from({ length: 24 }, () => "<span>EnHySa</span>").join("")
	return `<div class="watermark">${spans}</div>`
}
