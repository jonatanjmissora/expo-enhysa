import { Image, ImageContentFit, ImageProps, ImageStyle } from "expo-image"

type Props = {
	imgSource: ImageProps["source"]
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

