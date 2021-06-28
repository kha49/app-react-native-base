import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Login from './../components/login/Index';
import SplashScreen from '../components/Splash/SplashScreen';
import BottomTabbar from './bottomTabbar';
import DetailNotificationScreen from '../components/DetailNotification/DetailNotificationScreen';
import SearchMap from '../components/Map/SearchMap';
import SettingScreen from '../components/setting';
import ChangePassScreen from './../components/setting/changePass/index';
import ProfileScreen from './../components/profile/ProfileScreen';
const Stack = createStackNavigator();

export default function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="Splash"
        component={SplashScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
          header: null, headerLeft: null, gestureEnabled: false
        }}
      />
      <Stack.Screen
        name="Home"
        component={BottomTabbar}
        options={{
          headerShown: false,
          header: null, headerLeft: null, gestureEnabled: false
        }}
      />
      <Stack.Screen
        name="DetailNotificationScreen"
        component={DetailNotificationScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SearchMap"
        component={SearchMap}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="ChangePassScreen"
        component={ChangePassScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
