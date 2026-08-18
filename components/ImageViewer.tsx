import { Image } from 'expo-image';
import { ImageSourcePropType, StyleSheet } from 'react-native';

type Props = {
  imgSource: ImageSourcePropType;
  width?: number;
};

export default function ImageViewer({ imgSource, width }: Props) {
  return <Image source={imgSource} style={width ? { width, height: width } : styles.image} />;
}

const styles = StyleSheet.create({
  image: {
    width: 320,
    height: 440,
    borderRadius: 18,
  },
});
