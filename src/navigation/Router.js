import React from 'react';
import AuthStack from './authStack';
import AuthStack1 from './authStack1';
import {NavigationContainer} from '@react-navigation/native';

const Router = () => {
  return (
    <NavigationContainer>
      <AuthStack></AuthStack>
    </NavigationContainer>
  );
};

export default Router;
