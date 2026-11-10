export const watermarkStyles = `
	.watermark {
		position: absolute;
		top: 300px;
		left: -400px;
		width: 150%;
		height: 130%;
		display: flex;
		flex-wrap: wrap;
		align-content: center;
		align-items: center;
		justify-content: center;
		gap: 40px;
		transform: rotate(-30deg);
		transform-origin: top left;
		pointer-events: none;
		opacity: 0.2;
		z-index: 2;
		overflow: hidden;
		border: 1px solid red;
	}
	.watermark span {
		font-size: 32px;
		font-weight: 700;
		color: #888;
		white-space: nowrap;
		letter-spacing: 8px;
	}
`

export function renderWatermark(): string {
	const spans = Array.from({ length: 100 }, () => "<span>EnHySa</span>").join(
		""
	)
	return `<div class="watermark">${spans}</div>`
}
