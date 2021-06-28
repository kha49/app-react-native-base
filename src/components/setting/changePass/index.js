import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Dimensions,
  Alert,
} from 'react-native';
import styles from './styles';
import mushroom from './../../../services/mushroom.api.def';
import Header from '../../../componentComon/header';
import { Input, Card } from 'react-native-elements';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import Constant from './../../../util/constant';
import { Button } from 'react-native-elements/dist/buttons/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';

const LOGOUTMODE = [
  'invalidClientSession', //chỉ đăng xuất khỏi phiên làm việc của thiết bị hiện thời, không invalid token hiện thời
  'invalidServerSession', //đăng xuất khỏi tất cả các thiết bị sử dụng chung chung phiên làm việc của người dùng hiện tại (token hiện thời)
  'invalidAllSession', //đăng xuất khỏi tất cả các phiên làm việc của người dùng hiện tại
];

const ChangePassScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [currentPass, setCurrentPass] = useState('');
  const [password, setPassword] = useState('');
  const [confimPass, setConfimPass] = useState('');
  const [visableSeeCurrentPass, setVisableSeeCurrentPass] = useState(true);
  const [visableSeePass, setVisableSeePass] = useState(true);
  const [visableSeePassNew, setVisableSeePassNew] = useState(true);
  const [visableErorr, setViasbleError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [visable, setVisable] = useState(false);

  useEffect(async () => {
    try {
      const response = await mushroom.$auth.meAsync();
      console.log('Info: ' + JSON.stringify(response.result.id));
      setUserData(response.result);
    } catch (error) {
      console.error('Có lỗi: %o', error);
    }
  }, []);
  // -------------- handle change text
  const onChangeCrrentPassword = text => {
    if (!text.trim()) {
      setTimeout(() => {
        setViasbleError(false);
        setErrorMessage('');
      }, 5000);
    }
    setCurrentPass(text.trim());
  };
  const onChangeNewPassword = text => {
    if (!text.trim()) {
      setTimeout(() => {
        setViasbleError(false);
        setErrorMessage('');
      }, 5000);
    }
    setPassword(text.trim());
  };
  // --------------- onPress Save
  const handleSave = () => {
    if (!currentPass) {
      setViasbleError(true);
      setErrorMessage('Vui lòng nhập mật khẩu hiện tại!');
      setTimeout(() => {
        setViasbleError(false);
        setErrorMessage('');
      }, 3000);
    } else if (!password) {
      setViasbleError(true);
      setErrorMessage('Vui lòng nhập mật khẩu mới!');
      setTimeout(() => {
        setViasbleError(false);
        setErrorMessage('');
      }, 3000);
    } else if (!confimPass) {
      setViasbleError(true);
      setErrorMessage('Vui lòng nhập lại mật khẩu mới!');
      setTimeout(() => {
        setViasbleError(false);
        setErrorMessage('');
      }, 3000);
    } else if (password.length < 6) {
      setViasbleError(true);
      setErrorMessage('Mật khẩu mới phải có từ 6 ký tự trở lên!');
      setTimeout(() => {
        setViasbleError(false);
        setErrorMessage('');
      }, 3000);
    } else if (password !== confimPass) {
      setViasbleError(true);
      setErrorMessage(
        'Nhập lại mật khẩu mới và mật khẩu mới không trùng nhau!',
      );
      setTimeout(() => {
        setViasbleError(false);
        setErrorMessage('');
      }, 3000);
    } else {
      return Alert.alert('Cảnh Báo!', 'Bạn có chắc chắn muốn đổi mật khẩu?', [
        {
          text: 'Đồng ý',
          onPress: async () => {
            try {
              const reponse = await mushroom.$auth.changePasswordAsync(
                userData.account,
                currentPass,
                password,
              );
              setVisable(true);
              setViasbleError(true);
              setErrorMessage('Đổi mật khẩu thành công!');
              if (reponse) {
                try {
                  await removeDevice();
                  await mushroom.$auth.logoutAsync({ mode: LOGOUTMODE[1] });
                  await AsyncStorage.removeItem('token');
                  await navigation.navigate('MapScreen');
                  await navigation.navigate('Login');
                } catch (e) {
                  console.error('Có lỗi: %o', e);
                }
              }
              setTimeout(() => {
                setVisable(false);
                setViasbleError(false);
                setErrorMessage('');
              }, 3000);
            } catch (error) {
              console.error('Có lỗi: %o', error);
              setViasbleError(true);
              setErrorMessage('Mật khẩu hiện tại không đúng!');
              setTimeout(() => {
                setViasbleError(false);
                setErrorMessage('');
              }, 3000);
            }
          },
        },
        {
          text: 'Hủy',
          style: 'cancel',
        },
      ]);
    }
  };

  // -------------- onPress OK
  const removeDevice = async () => {
    try {
      let userToken = await AsyncStorage.getItem('token');
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

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* <Header title="Mật khẩu" onLeftPress={() => navigation.goBack()} /> */}
        <Header
          title={"Mật khẩu".toLocaleUpperCase()}
          onClickIconLeft={() => navigation.goBack()}
        />
        {visable ? (
          <ActivityIndicator
            size="small"
            color={Constant.COLOR.secondary}
            style={{ flex: 1 }}
          />
        ) : (
          <View style={styles.content}>
            <View style={{ width: '95%', marginHorizontal: '2%', marginTop: 10 }}>
              <Input
                label="Nhập mật khẩu hiện tại"
                placeholder="Nhập mật khẩu hiện tại"
                secureTextEntry={visableSeeCurrentPass}
                rightIcon={{
                  type: 'material',
                  name: visableSeeCurrentPass ? 'visibility-off' : 'visibility',
                  color: '#778899',
                  size: 24,
                  onPress: () => {
                    setVisableSeeCurrentPass(!visableSeeCurrentPass);
                  },
                }}
                onChangeText={text => onChangeCrrentPassword(text)}
              />
            </View>
            <View style={{ width: '95%', marginHorizontal: '2%' }}>
              <Input
                label="Nhập mật khẩu mới"
                placeholder="Nhập tối thiểu 6 ký tự"
                secureTextEntry={visableSeePass}
                rightIcon={{
                  type: 'material',
                  name: visableSeePass ? 'visibility-off' : 'visibility',
                  color: '#778899',
                  size: 24,
                  onPress: () => {
                    setVisableSeePass(!visableSeePass);
                  },
                }}
                onChangeText={text => onChangeNewPassword(text)}
              />
            </View>
            <View style={{ width: '95%', marginHorizontal: '2%' }}>
              <Input
                label="Nhập lại mật khẩu mới"
                placeholder="Nhập trùng với mật khẩu mới"
                secureTextEntry={visableSeePassNew}
                rightIcon={{
                  type: 'material',
                  name: visableSeePassNew ? 'visibility-off' : 'visibility',
                  color: '#778899',
                  size: 24,
                  onPress: () => {
                    setVisableSeePassNew(!visableSeePassNew);
                  },
                }}
                onChangeText={text => setConfimPass(text)}
              />
            </View>
            <View
              style={{
                width: '100%',
                height: 50,
                // marginHorizontal: '5%',
                position: 'absolute',
                // bottom: Dimensions.get('window').height / 8 + 10,
                bottom: 5,
                zIndex: 999,
                flexDirection: 'row',
              }}>
              <View style={{ width: "50%", justifyContent: "center", alignItems: "center" }}>
                <Button
                  buttonStyle={{
                    width: 150,
                    height: 40,
                    backgroundColor: Constant.COLOR.primary,
                    // marginHorizontal: 20,
                  }}
                  disabled={visable}
                  onPress={() => {
                    setCurrentPass('');
                    setPassword('');
                    setConfimPass('');
                    // setEnable(false);
                    navigation.navigate('SettingScreen');
                  }}
                  title="Hủy"
                  titleStyle={{
                    color: Constant.COLOR.third,
                  }}
                  type="outline"
                />
              </View>
              <View style={{ width: "50%", justifyContent: "center", alignItems: "center" }}>
                <Button
                  buttonStyle={{
                    width: 150,
                    height: 40,
                    backgroundColor: Constant.COLOR.secondary,
                    // marginHorizontal: 20,
                  }}
                  disabled={visable}
                  onPress={handleSave}
                  title="Đồng ý"
                  titleStyle={{
                    color: Constant.COLOR.primary,
                  }}
                  type="outline"
                />
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
      {/* thông báo lỗi */}
      {visableErorr ? (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            height: Dimensions.get('window').height / 12,
            width: Dimensions.get('window').width,
            backgroundColor: Constant.COLOR.primary,
            position: 'absolute',
            top: 10,
            zIndex: 999,
          }}>
          <Text style={{ fontSize: 18, color: '#fff', justifyContent: 'center' }}>
            {errorMessage}
          </Text>
        </View>
      ) : null}
    </>
  );
};

export default ChangePassScreen;
