import { Image, ImageContentFit, ImageSource, ImageStyle } from "expo-image"

type Props = {
	imgSource: ImageSource
	style?: ImageStyle
	contentFit?: ImageContentFit
}

export default function ImageViewer({
	imgSource,
	style,
	contentFit = "contain",
}: Props) {
	return <Image source={imgSource} contentFit={contentFit} style={style} />
}
