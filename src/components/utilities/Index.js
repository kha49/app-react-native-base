import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, Image } from 'react-native';
import { Card, ListItem, Avatar, Icon, BottomSheet } from 'react-native-elements';
import styles from './Style';
import mushroom from './../../services/mushroom.api.def';
import { ScrollView } from 'react-native-gesture-handler';
import TouchableScale from 'react-native-touchable-scale';
import { LinearGradient } from 'react-native-linear-gradient';
import moduleName from './../../assets/images/userAvatar.png';
import Modal from 'react-native-modalbox';
import Constant from './../../util/constant';
import severConfig from '../../api/LinkUrlRequest';
import Axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Device, { getUniqueId } from 'react-native-device-info';
import { StackActions } from '@react-navigation/native';

const list = [
  {
    name: 'Cài đặt',
    iconName: 'settings',
    move: 'SettingScreen',
  },
  // {
  //   name: 'Phiên bản',
  //   iconName: 'extension',
  //   move: '',
  // },
];
const Logout = [
  {
    name: 'Đăng xuất',
    iconName: 'logout',
  },
];

const BASE_AVATAR = require('./../../assets/images/userAvatar.png');

const LOGOUTMODE = [
  'invalidClientSession', //chỉ đăng xuất khỏi phiên làm việc của thiết bị hiện thời, không invalid token hiện thời
  'invalidServerSession', //đăng xuất khỏi tất cả các thiết bị sử dụng chung chung phiên làm việc của người dùng hiện tại (token hiện thời)
  'invalidAllSession', //đăng xuất khỏi tất cả các phiên làm việc của người dùng hiện tại
];

const Utilities = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [visable, setVisable] = useState(false);
  const [fullname, setFullname] = useState('');
  const [urlImage, setUrlImage] = useState('');
  const [version, setVersion] = useState(Device.getVersion())
  const getUuid = async () => {
    const tokeUser = await mushroom.$auth.meAsync();
    // console.log(tokeUser.result.id);
    if (tokeUser)
      try {
        const response = await mushroom.user_info.findByIdAsync({
          id: tokeUser.result.id, // required
        });
        if (response) {
          setUrlImage(response.result.avatar_id);
          setFullname(response.result.full_name.full_name);
          setUserData(response.result);
        }
      } catch (error) {
        console.error('Có lỗi:' + error);
      }
  };

  console.log(fullname);
  useEffect(() => {
    getUuid();
    // getUserInfo();
  }, []);

  const removeDevice = async () => {
    try {
      // let userToken = await AsyncStorage.getItem('token');
      const userToken = await AsyncStorage.getItem(
        'mushroom.tokens[' + severConfig.UrlApi + ']',
      );
      console.log('userTokenddddd', userToken);
      const url = severConfig.UrlApi + 'devices/delete_by_device_id';
      console.log('xoa', url);
      const body = {
        device_id: getUniqueId(),
      };
      const response = await Axios.post(url, body, {
        headers: {
          token: userToken,
          'X-HTTP-Method-Override': 'delete_by_device_id',
        },
      });
      console.log(response);
    } catch (err) {
      console.log('lỗi remove device', err);
    }
  };
  const handleLogout = () => {
    return Alert.alert('Cảnh Báo!', 'Bạn có chắc chắn muốn đăng xuất?', [
      {
        text: 'Đồng ý',
        onPress: async () => {
          try {
            await removeDevice();
            await mushroom.$auth.logoutAsync({ mode: LOGOUTMODE[0] });
            await AsyncStorage.removeItem('token');
            // await navigation.navigate('MapScreen');
            //   await navigation.navigate('Login');
            navigation.dispatch(
              StackActions.replace('Login')
            );

          } catch (e) {
            console.error('Có lỗi: %o', e);
          }
        },
      },
      {
        text: 'Hủy',
        style: 'cancel',
      },
    ]);
  };

  const PopupChoiceAvatar = () => {
    return (
      <BottomSheet
        isVisible={visable}
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}>
        <View style={styles.popupView}>
          <TouchableOpacity
            style={[
              styles.btnPopup,
              { backgroundColor: Constant.COLOR.secondary },
            ]}
            onPress={() => { }}>
            <Text style={styles.text}>Chọn ảnh từ thư viện</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btnPopup,
              { backgroundColor: Constant.COLOR.secondary },
            ]}
            onPress={() => { }}>
            <Text style={styles.text}>Chụp hình</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '100%',
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: '#fff',
          }}>
          <TouchableOpacity
            style={[styles.btnPopup, { backgroundColor: '#fff' }]}
            onPress={() => setVisable(false)}>
            <Text style={[styles.text, { color: '#000' }]}>Hủy</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    );
  };

  return (
    <>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* <Card.Title>Tiện ích</Card.Title>
      <Card.Divider /> */}
        <View style={styles.headerContent}>
          <Text style={{ fontSize: 20, fontWeight: '600', marginTop: 30 }}>Xin Chào!</Text>
        </View>
        <View style={styles.userAvatar}>
          <TouchableOpacity
            style={styles.btnAvatar}
            onPress={() => {
              setVisable(true);
            }}>
            {urlImage ? (
              <Avatar
                rounded
                source={{ uri: severConfig.UriImg + urlImage }}
                size={100}
              />
            ) : (
              <Avatar rounded source={BASE_AVATAR} size={100} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ProfileScreen');
            }}>
            <Text style={{ fontSize: 16, marginTop: 10 }}>{fullname}</Text>
          </TouchableOpacity>
        </View>
        <View style={{ marginTop: 8 }}>
          {list.map((l, i) => (
            <ListItem
              key={i}
              bottomDivider
              friction={90}
              tension={100}
              activeScale={0.95}
              onPress={l.move ? () => navigation.navigate(l.move) : null}
              Component={TouchableScale}
              ViewComponent={LinearGradient}>
              <Icon type="material" name={l.iconName}></Icon>
              <ListItem.Content>
                <ListItem.Title>{l.name}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron color="black" />
            </ListItem>
          ))}
        </View>
        <ListItem
          key={2}
          bottomDivider
          friction={90}
          tension={100}
          activeScale={0.95}
          // onPress={l.move ? () => navigation.navigate(l.move) : null}
          Component={TouchableScale}
          ViewComponent={LinearGradient}>
          <Icon type="material" name={"extension"}></Icon>
          <ListItem.Content>
            <ListItem.Title>{'Phiên bản'}</ListItem.Title>
          </ListItem.Content>
          <View style={{ position: "absolute", right: 15 }}>
            <Text>{version}</Text>
          </View>
          {/* <ListItem.Chevron color="red" /> */}
        </ListItem>
        <View style={{ marginTop: 8 }}>
          {Logout.map((l, i) => (
            <ListItem
              key={i}
              onPress={handleLogout}
              bottomDivider
              Component={TouchableScale}
              ViewComponent={LinearGradient}>
              <MaterialCommunityIcons name="logout" size={24} color="black" />
              {/* <Icon type="material" name={l.iconName}></Icon> */}
              <ListItem.Content>
                <ListItem.Title>{l.name}</ListItem.Title>
              </ListItem.Content>
              <ListItem.Chevron color="black" />
            </ListItem>
          ))}
        </View>
      </ScrollView>

      {/* ----- popup chosen Image */}
      {/* <PopupChoiceAvatar /> */}
    </>
  );
};

export default Utilities;
