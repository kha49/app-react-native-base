import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, Alert, Image} from 'react-native';
import {Card, ListItem, Avatar, Icon, Input} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import TouchableScale from 'react-native-touchable-scale';
import {LinearGradient} from 'react-native-linear-gradient';
import mushroom from './../../services/mushroom.api.def';
import moduleName from './../../assets/images/userAvatar.png';
import {SafeAreaView} from 'react-native-safe-area-context';
import styles from './styles';
import Header from '../../componentComon/header/index';

const lstSetingAccount = [
  {
    name: 'Thông tin & liên hệ',
    iconName: 'question-answer',
    move: 'ProfileScreen',
  },
  {
    name: 'Đổi mật khẩu',
    iconName: 'settings',
    move: 'ChangePassScreen',
  },
];

const lstSetingApp = [
  {
    name: 'Cài đặt thông báo',
    iconName: 'question-answer',
    move: '',
  },
];

const SettingScreen = ({navigation}) => {
  // const [userData, setUserData] = useState({});
  const [visable, setVisable] = useState(true);

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Header
          title={"CÀI ĐẶT".toLocaleUpperCase()}
          onLeftPress={() => navigation.goBack()}></Header>
        <View style={styles.content}>
          <View style={{marginTop: 5}}>
            <Text
              style={{
                fontSize: 16,
                marginVertical: 5,
                marginLeft: 16,
                color: '#778899',
              }}>
              Cài đặt tài khoản
            </Text>
            {lstSetingAccount.map((l, i) => (
              <ListItem
                key={i}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.95}
                onPress={
                  l.move ? () => navigation.navigate(l.move, l.param) : null
                }
                Component={TouchableScale}
                ViewComponent={LinearGradient}>
                <ListItem.Content>
                  <ListItem.Title>{l.name}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron color="black" />
              </ListItem>
            ))}
          </View>
          <View style={{marginTop: 5}}>
            <Text
              style={{
                fontSize: 16,
                marginVertical: 5,
                marginLeft: 16,
                color: '#778899',
              }}>
              Cài đặt ứng dụng
            </Text>
            {lstSetingApp.map((l, i) => (
              <ListItem
                key={i}
                bottomDivider
                friction={90}
                tension={100}
                activeScale={0.95}
                onPress={l.move ? () => navigation.navigate(l.move) : null}
                Component={TouchableScale}
                ViewComponent={LinearGradient}>
                <ListItem.Content>
                  <ListItem.Title>{l.name}</ListItem.Title>
                </ListItem.Content>
                <ListItem.Chevron color="black" />
              </ListItem>
            ))}
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

export default SettingScreen;
