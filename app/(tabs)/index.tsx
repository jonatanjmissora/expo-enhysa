import ImageViewer from '@/components/ImageViewer';
import { ScrollView, Text, useWindowDimensions, View } from "react-native";

import HeroIcons from '@/components/Inicio/HeroIcons';
import HeroImage from '../../assets/images/hero.webp';

export default function Index() {

  const { width, height } = useWindowDimensions();

  return (
    <ScrollView
    contentContainerStyle={{
      minHeight: height * 1.5,
        marginTop: 130,
    }}
      style={{
        backgroundColor: "#152436ff",
      }}
    >
      <Hero width={width} height={height}/>

      <Intro />
      
    </ScrollView>
  );
}

function Hero({width, height}: {width: number, height: number}) {
  return (
<View >
        <Text style={{ color: "#ddd", fontSize: 32, textAlign: 'center', fontFamily: 'system-ui', letterSpacing: 1.5 }}>Selecciona tu nuevo informe.</Text>
        <ImageViewer 
          imgSource={HeroImage} 
          style={{
            width, 
            height: height * 0.66,
            opacity: 0.75 
          }}
        />
        <View style={{ position: 'absolute', bottom: 0, width: '100%', height: "42%" }} >
            <HeroIcons />
        </View>
      </View>
  )
}

function Intro() {
  return (
<Text style={{ paddingInline: 12, marginBlock: 60, color: "#ddd", fontSize: 14, textAlign: 'center', fontFamily: 'system-ui', letterSpacing: 1.5 }}>lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor.</Text>
  )
}