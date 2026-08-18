import { Tabs } from 'expo-router';

import Ionicons from '@expo/vector-icons/Ionicons';


export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: 'orange',
    headerStyle: {
      backgroundColor: '#192b41ff',
    },
    headerShadowVisible: false,
    headerTransparent: true,
    headerTintColor: '#fff',
    headerTitleAlign: 'center',
    tabBarStyle: {
      backgroundColor: '#192b41ff',
	borderTopColor: '#e3e0ec20'
    }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Enhysa',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
          ),
        }}
      />
	<Tabs.Screen
        name="informes"
        options={{
          title: 'Informes',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'document-text' : 'document-text-outline'} color={color} size={24}/>
          ),
        }}
      />
      <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'person' : 'person-outline'} color={color} size={24}/>
          ),
        }}
      />
    <Tabs.Screen
        name="suscripcion"
        options={{
          title: 'Suscripción',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons name={focused ? 'shield' : 'shield-outline'} color={color} size={24}/>
          ),
        }}
      />
    </Tabs>
  );
}
