import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable, Text, View } from "react-native";

import LogoImage from "../assets/images/logo2.png"
import ImageViewer from "./ImageViewer";

type HeaderProps = {
  onPress?: () => void;
};

export default function Header({ onPress }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={{
        paddingTop: insets.top,
        backgroundColor: "#152436",
      }}
    >
       <Pressable
        onPress={onPress}
        style={{
          height: 70,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingHorizontal: 16,
        }}>
        <ImageViewer
          imgSource={LogoImage}
          style={{ width: 30, height: 30 }}
        />

        <Text
          style={{
            color: "white",
            fontSize: 30,
            letterSpacing: 2,
          }}
        >
          EnHySa
        </Text>
      </Pressable>
    </View>
  );
}