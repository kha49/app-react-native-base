import React, { Component, forwardRef } from 'react';
import {
    View,
    KeyboardAvoidingView,
    TouchableOpacity,
    Alert,
    Text,
    Modal,
    Dimensions,
    ScrollView,
    SafeAreaView,
    StyleSheet,
    TextInput,
    StatusBar,
    DeviceEventEmitter
} from 'react-native';
import Constant from '../../util/constant';
import { Tab, Tabs, TabHeading, Toast, Root, Icon, Spinner } from 'native-base';
import MapScreen from '../../components/Map/map';
import Notifications from '../../components/notifications/Index';
import Utilities from '../../components/utilities/Index';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const COLOR = Constant.COLOR;

import mushroom from '../../services/mushroom.api.def';
import messaging from '@react-native-firebase/messaging';
import severConfig from '../../../src/api/LinkUrlRequest';
import { getUniqueId } from 'react-native-device-info';
import DataShare from '../../../src/api/DataShare';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
export default class HomeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentTab: 0,
        };
    }

    componentDidMount() {
        this.getInforUser();
        this.langNgheNoti();
        this.checkPermissionFireBase();
    }

    getInforUser = async () => {
        console.log('Có váo getInforUser');
        try {
            let result = await mushroom.$auth.meAsync();
            DataShare.idUser = result.result.id;
            console.log("result.result", result);
        } catch (error) {
            console.log('Lỗidddddd', error);
        }
    };
    checkPermissionFireBase = async () => {
        if (Platform.OS == 'ios') {
            const enabled = await messaging().hasPermission();
            console.log('queen', enabled);
            if (enabled == 1 || enabled == 2) {
                this.getTokenFirebase();
            } else {
                this.requestPermissionFireBase();
            }
        } else {
            this.getTokenFirebase();
        }
    };

    requestPermissionFireBase = async () => {
        try {
            let per = await messaging().requestPermission();
            // User has authorised
            console.log('queen', per);
            this.getTokenFirebase();
        } catch (error) {
            // User has rejected permissions
            console.log('quyền bị từ chối');
        }
    };

    getTokenFirebase = async () => {
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
    handChangeStatus = async id => {
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
    langNgheNoti = () => {
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log("Vào onNotificationOpenedApp");
            if (remoteMessage) {
                const noti = remoteMessage.data;
                this.xuLyNotification(noti, false, remoteMessage);
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
                    this.xuLyNotification(noti, false, remoteMessage);
                }
            });
    };

    xuLyNotification = (noti, isOpenApp, remoteMessage) => {
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
                            this.handChangeStatus(noti.id);
                            this.props.navigation.navigate('DetailNotificationScreen');
                        }
                    },
                ],
            );
        } else {
            DataShare.idNoti = noti.id;
            this.handChangeStatus(noti.id);
            this.props.navigation.navigate('DetailNotificationScreen');
        }
    }
    render() {
        const colorTab = '#636363';
        return (
            <Root>
                <SafeAreaView style={styles.container}>
                    <Tabs
                        page={this.state.currentTab}
                        ref={c => (this.tabs = c)}
                        locked={true}
                        tabBarUnderlineStyle={{ backgroundColor: '#fff' }}
                        tabBarPosition="bottom"
                        onChangeTab={({ i }) => this.setState({ currentTab: i })}>
                        <Tab
                            tabStyle={{ backgroundColor: '#ffffff', marginVertical: 5 }}
                            heading={
                                <TabHeading style={styles.styleTabHeader}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <MaterialCommunityIcons
                                            name="map-marker"
                                            size={24}
                                            color={this.state.currentTab == 0 ? COLOR.secondary : 'black'}
                                        />
                                        <Text style={{ fontSize: 16, color: this.state.currentTab == 0 ? COLOR.secondary : 'black' }}>Bản đồ</Text>
                                    </View>
                                </TabHeading>
                            }>
                            <MapScreen />
                        </Tab>
                        <Tab
                            tabStyle={{ backgroundColor: '#ffffff', marginVertical: 5 }}
                            heading={
                                <TabHeading style={styles.styleTabHeader}>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <MaterialIcons
                                            name="notifications-none"
                                            size={24}
                                            color={this.state.currentTab == 1 ? COLOR.secondary : 'black'}
                                        />
                                        <Text style={{
                                            fontSize: 16, color: this.state.currentTab == 1 ? COLOR.secondary : 'black'
                                        }}>Thông báo</Text>
                                    </View>
                                </TabHeading>
                            }>
                            <Notifications />
                        </Tab>
                        <Tab
                            tabStyle={{ backgroundColor: '#ffffff', marginVertical: 5 }}
                            heading={
                                <TabHeading style={styles.styleTabHeader}>
                                    <View
                                        style={{
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                        }}>
                                        <MaterialIcons name="menu" size={24} color={this.state.currentTab == 2 ? COLOR.secondary : 'black'} />
                                        <Text style={{ fontSize: 16, color: this.state.currentTab == 2 ? COLOR.secondary : 'black' }}>Tiện ích</Text>
                                    </View>
                                </TabHeading>
                            }>
                            <Utilities />
                        </Tab>
                    </Tabs>
                </SafeAreaView>
            </Root>
        );
    }

}

const styles = StyleSheet.create({
    textActiveTabs: {
        color: COLOR.secondary,
        fontSize: 11,
    },
    textTabsStyle: {
        color: 'black',
        fontSize: 11,
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    styleTabHeader: {
        backgroundColor: '#ffffff',
        borderTopWidth: 0.5,
        borderTopColor: '#ddd',
    },
});

