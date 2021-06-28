import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import MapScreen from '../components/Map/map';
import SearchMap from '../components/Map/SearchMap';
import BottomTabbar from './bottomTabbar';

const Stack = createStackNavigator();

export default function MapStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
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
    </Stack.Navigator>
  );
}
