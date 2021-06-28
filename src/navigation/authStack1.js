// import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import Login from './../components/login/Index';
import SplashScreen from '../components/Splash/SplashScreen';
// import BottomTabbar from './bottomTabbar';
import Home from '../components/Home/HomeScreen';
import DetailNotificationScreen from '../components/DetailNotification/DetailNotificationScreen';
import MapScreenScreen from './../components/Map/map';
import MapStack from './MapStack';
import Notifications from '../components/notifications/Index';

import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';

// const Stack = createStackNavigator();
const HomeScreenStack = createStackNavigator({
    Home: {
        screen: Home,
        navigationOptions: ({ navigation }) => ({
            header: null,
        }),
    },
    Notification: {
        screen: Notifications,
        navigationOptions: ({ navigation }) => ({
            header: null,
        }),
    },
    DetailNotificationScreen: {
        screen: DetailNotificationScreen,
        navigationOptions: ({ navigation }) => ({
            header: null,
        }),
    },
})
const Router = createSwitchNavigator({
    Splash: SplashScreen,
    Login: Login,
    Home: Home,
    Notification: Notifications,
    DetailNotificationScreen: DetailNotificationScreen
});
const AppContainer = createAppContainer(Router);
export default () => (
    <AppContainer />
);


