import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import DetailNotificationScreen from '../components/DetailNotification/DetailNotificationScreen';
import Notifications from '../components/notifications/Index';

const Stack = createStackNavigator();

export default function NotiStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Notification"
        component={Notifications}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DetailNotificationScreen"
        component={DetailNotificationScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
