import { Tabs } from 'expo-router';

import ImageViewer from '@/components/ImageViewer';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRouter } from 'expo-router';
import { Pressable, Text } from 'react-native';

import LogoImage from '../../assets/images/logo2.png';

export default function TabLayout() {
	const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'orange',
    headerStyle: {
      backgroundColor: '#152436ff',
    },
    headerShadowVisible: false,
    headerTransparent: true,
    headerTintColor: '#fff',
    headerTitleAlign: 'left',
    headerTitleContainerStyle: {
		width: '100%',
    margin: 0,
	},
	headerTitle: () => {
		return(
			<Pressable style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingBlock: 14 }} onPress={() => router.push("/")}>
        <ImageViewer imgSource={LogoImage} style={{width: 30, height: 30}}/>
				<Text style={{ color: "white", fontSize: 30, textAlign: 'center', fontFamily: 'system-ui', letterSpacing: 2 }}>EnHySa</Text>
			</Pressable>
		)
	},
    tabBarStyle: {
      backgroundColor: '#0e1824ff',
	borderTopColor: '#e3e0ec20'
    }
      }}
    >
      <Tabs.Screen
        name="iluminacion"
        options={{
          title: 'Iluminacion',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'bulb-sharp' : 'bulb-outline'} color={color} size={24} />
          ),
        }}
      />
        <Tabs.Screen
          name="nuevo"
          options={{
            title: 'Nuevo',
            tabBarIcon: ({ color, focused }) => (
              <Ionicons name={focused ? 'add-sharp' : 'add-outline'} color={color} size={24}/>
            ),
          }}
          />
	<Tabs.Screen
        name="informes"
        options={{
          title: 'Informes',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'document-sharp' : 'document-outline'} color={color} size={24}/>
          ),
        }}
      />
      
    </Tabs>
  );
}
