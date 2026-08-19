import { Image, ImageSource, ImageStyle } from 'expo-image';
type Props = {
  imgSource: ImageSource;
  style?: ImageStyle;
};

export default function ImageViewer({ imgSource, style }: Props) {
  return <Image source={imgSource} style={style} />;
}
