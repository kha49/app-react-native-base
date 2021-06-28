import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import SettingScreen from '../components/setting';
import Utilities from './../components/utilities/Index';
import ChangePassScreen from './../components/setting/changePass/index';
import ProfileScreen from './../components/profile/ProfileScreen';
import Login from './../components/login/Index';

const Stack = createStackNavigator();

export default function UtilitiesStack() {
  return (
    <Stack.Navigator initialRouteName="Utilities" headerMode="screen">
      <Stack.Screen
        name="Utilities"
        component={Utilities}
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
