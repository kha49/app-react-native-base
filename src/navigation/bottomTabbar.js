import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';
import { Dimensions, Text, View, Alert, Platform, BackHandler } from 'react-native';
import Notifications from './../components/notifications/Index';
import Utilities from './../components/utilities/Index';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Constant from './../util/constant';
import UtilitiesStack from './UtilitiesStack';
import MapStack from './MapStack';
import MapScreen from '../components/Map/map';

// ------------ import firebase
import mushroom from '../services/mushroom.api.def';
import messaging from '@react-native-firebase/messaging';
import severConfig from '../../src/api/LinkUrlRequest';
import { getUniqueId } from 'react-native-device-info';
import DataShare from '../../src/api/DataShare';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NotiStack from './NotiStack';

const Tab = createBottomTabNavigator();
const height = Dimensions.get('window').height;
const COLOR = Constant.COLOR;

export default function BottomTabbar({ navigation }) {
  useEffect(async () => {
    await getInforUser();
    await langNgheNoti();
    checkPermissionFireBase();
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);
  // ----------------- test get fcmTokenssss
  // const fcmTokenNew = await messaging().getToken();
  // console.log(fcmTokenNew);
  const backAction = () => {
    // Alert.alert("Hold on!", "Are you sure you want to go back?", [
    //   {
    //     text: "Cancel",
    //     onPress: () => null,
    //     style: "cancel"
    //   },
    //   { text: "YES", onPress: () => BackHandler.exitApp() }
    // ]);
    let isForcus = navigation.isFocused();
    if (!isForcus) {
      navigation.pop();
    }
    return true;
  };

  const getInforUser = async () => {
    console.log('Có váo getInforUser');
    try {
      let result = await mushroom.$auth.meAsync();
      DataShare.idUser = result.result.id;
      console.log("result.result", result);
    } catch (error) {
      console.log('Lỗidddddd', error);
    }
  };
  const checkPermissionFireBase = async () => {
    if (Platform.OS == 'ios') {
      const enabled = await messaging().hasPermission();
      console.log('queen', enabled);
      if (enabled == 1 || enabled == 2) {
        getTokenFirebase();
      } else {
        requestPermissionFireBase();
      }
    } else {
      getTokenFirebase();
    }
  };

  const requestPermissionFireBase = async () => {
    try {
      let per = await messaging().requestPermission();
      // User has authorised
      console.log('queen', per);
      getTokenFirebase();
    } catch (error) {
      // User has rejected permissions
      console.log('quyền bị từ chối');
    }
  };

  const getTokenFirebase = async () => {
    try {
      // const userToken = await AsyncStorage.getItem(
      //   'mushroom.tokens[' + severConfig.UrlApi + ']',
      // );
      let userToken = await AsyncStorage.getItem('token');
      // const userToken = "7NzVpDMC0SceIgBhSIH5RsJte59iqF47+SZYEJBUujg=";
      console.log('userToken', userToken);
      const fcmTokenNew = await messaging().getToken();

      console.log('gdgfdgdf', fcmTokenNew);
      // Alert.alert("tokenfirebase",fcmTokenNew)
      const url = severConfig.UrlApi + 'devices/save_device';
      const body = {
        device_token: fcmTokenNew,
        device_type: Platform.OS === 'ios' ? 'Ios' : 'Android',
        device_id: getUniqueId(),
        user_id: DataShare.idUser,
      };
      console.log("bodyvvvvvvvv", JSON.stringify(body));
      const response = await Axios.post(url, body, {
        headers: {
          token: userToken,
          'X-HTTP-Method-Override': 'save_device',
        },
      });
      // Alert.alert("responseSaveDevice",JSON.stringify(response.data))
      console.log('getTokenFireBase', JSON.stringify(response));
    } catch (error) {
      // Alert.alert("onRegisterfcmTokenNewerror",JSON.stringify(error));
      console.log('onRegisterfcmTokenNewerror', error);
    }
  };
  const handChangeStatus = async id => {
    const notification_object = {
      id: id, // required
      is_read: true,
    };
    try {
      const response = await mushroom.notification.partialUpdateAsync(
        notification_object,
      );
      // if (response) setHandle(!handle);
      console.log('dữ liệu trả về thành công', response.result);
    } catch (error) {
      console.log('Có lỗi: %o', error);
    }
  };
  const langNgheNoti = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log("Vào onNotificationOpenedApp");
      if (remoteMessage) {
        const noti = remoteMessage.data;
        xuLyNotification(noti, false, remoteMessage);
      }
    });
    messaging().onMessage(remoteMessage => {
      console.log("Vào onMessage");
      if (remoteMessage) {
        const noti = remoteMessage.data;
        xuLyNotification(noti, true, remoteMessage);
      }
    });
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        console.log("Vào getInitialNotification");
        if (remoteMessage) {
          const noti = remoteMessage.data;
          xuLyNotification(noti, false, remoteMessage);
        }
      });
  };

  const xuLyNotification = (noti, isOpenApp, remoteMessage) => {
    if (isOpenApp) {
      console.log("Vào popup noti");
      Alert.alert(
        'Thông báo',
        `Bạn có 1 cảnh báo!`,
        [
          {
            text: 'Hủy',
            onPress: () => { },
            style: 'cancel',
          },
          {
            text: 'Xem ngay',
            onPress: () => {
              DataShare.idNoti = noti.id;
              handChangeStatus(noti.id);
              navigation.navigate('DetailNotificationScreen');
            }
          },
        ],
      );
    } else {
      DataShare.idNoti = noti.id;
      handChangeStatus(noti.id);
      navigation.navigate('DetailNotificationScreen');
    }
  }
  return (
    <Tab.Navigator
      initialRouteName="MapStack"
      tabBarOptions={{
        activeTintColor: COLOR.secondary,
        showLabel: false,
        style: {
          height: height / 10,
        },
      }}>
      <Tab.Screen
        name="MapStack"
        component={MapScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <MaterialCommunityIcons
                name="map-marker"
                size={24}
                color={color}
              />
              <Text style={{ fontSize: 16, color: color }}>Bản đồ</Text>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="NotiStack"
        component={Notifications}
        options={{
          tabBarIcon: ({ color }) => (
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <MaterialIcons
                name="notifications-none"
                size={24}
                color={color}
              />
              <Text style={{ fontSize: 16, color: color }}>Thông báo</Text>
            </View>
          ),
          // tabBarBadge: 0,
        }}
      />
      <Tab.Screen
        name="Utilities"
        component={Utilities}
        options={{
          tabBarIcon: ({ color }) => (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <MaterialIcons name="menu" size={24} color={color} />
              <Text style={{ fontSize: 16, color: color }}>Tiện ích</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
