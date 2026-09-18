const MAX_PHOTOS = 4

export function galleryBlock(images: string[], always = false): string {
	const photos = images.slice(0, MAX_PHOTOS)
	if (photos.length === 0 && !always) return ""

	const content =
		photos.length > 0
			? photos.map(src => `<img src="${src}" />`).join("")
			: `<div class="gallery-empty">Sin imágenes</div>`

	return `
		<div class="inst-gallery-block">
			<div class="gallery gallery-${photos.length}">${content}</div>
		</div>
	`
}

export { MAX_PHOTOS }
