import ImageViewer from '@/components/ImageViewer';
import { Text, View } from "react-native";

import HeroImage from '../../assets/images/hero.webp';
import LogoImage from '../../assets/images/logo2.png';

export default function Index() {

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#192b41ff",
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <ImageViewer imgSource={LogoImage} width={30}/>
        <Text style={{ color: "white", fontSize: 30, textAlign: 'center', fontFamily: 'system-ui', fontWeight: 'bold' }}>EnHySa</Text>
      </View>
      <Text style={{ color: "white", fontSize: 32, textAlign: 'center', fontFamily: 'system-ui' }}>Selecciona tu nuevo informe.</Text>
      <ImageViewer imgSource={HeroImage} />
    </View>
  );
}
