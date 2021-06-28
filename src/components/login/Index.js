import React, {useState, useEffect, useRef} from 'react';
import {
  TextInput,
  View,
  ImageBackground,
  Image,
  TouchableOpacity,
  Text,
  Alert,
  Dimensions,
  BackHandler
} from 'react-native';
import styles from './Style';
import Icon from 'react-native-vector-icons/AntDesign';
import mushroom from './../../services/mushroom.api.def';
import {ActivityIndicator} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import ModalBox from 'react-native-modalbox';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Input} from 'react-native-elements/dist/input/Input';
import Constant from './../../util/constant';
import AsyncStorage from '@react-native-async-storage/async-storage';

// const imageBg = require('../../assets/images/background.jpg');
const imagelogo = require('../../assets/images/logo.png');

const Login = ({navigation, route}) => {
  // --------------- fix cứng usename vs pass for dev
  const [name, setName] = useState('');
  const [pass, setPass] = useState('');
  const [visable, setVisable] = useState(true);
  const [visableErorr, setVisableErorr] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [enable, setEnable] = useState(false);

  useEffect(() => {
    setVisable(true);
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

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

  const handleLogin = async () => {
    if (!name) {
      setError('Vui lòng nhập tài khoản!');
      setVisableErorr(true);
      setTimeout(() => {
        setVisableErorr(false);
        setError('');
      }, 5000);
    } else if (!pass) {
      setError('Vui lòng nhập mật khẩu!');
      setVisableErorr(true);
      setTimeout(() => {
        setVisableErorr(false);
        setError('');
      }, 5000);
    } else {
      setLoading(false);
      setEnable(true);
      try {
        var response = await mushroom.$auth.loginAsync(name, pass, true);
        if (response) {
          console.log(response);
          await AsyncStorage.setItem('token', response.result.token);
          setTimeout(() => {
            setVisableErorr(false);
            setLoading(true);
            setEnable(false);
            setName('');
            setPass('');
          }, 3000);
          await navigation.navigate('Home');
        }
      } catch (error) {
        console.log('Thất bại' + error);
        setVisableErorr(true);  
        setError('Tài khoản hoặc mật khẩu không chính xác!')
        setTimeout(() => {
          setVisableErorr(false);
          setLoading(true);
          setEnable(false);
        }, 3000);
        // setVisableErorr(true);
        // setError('Tài khoản hoặc mật khẩu không chính xác!');
      }
      // setTimeout(() => {
      //   setVisableErorr(false);
      //   setLoading(true);
      //   setEnable(false);
      //   setName('');
      //   setPass('');
      // }, 3000);
    }
  };

  const onchangVisable = () => {
    if (!pass) return;
    else setVisable(!visable);
  };

  const onChangeUsename = text => {
    if (!text.trim()) {
      // setError('tài Khoản có chứa khoảng trắng!');
      // setVisableErorr(true);
      setTimeout(() => {
        setVisableErorr(false);
        setError('');
      }, 5000);
    }

    setName(text.trim());
  };
  const onChangePassword = text => {
    if (!text.trim()) {
      // setError('Mật khẩu có chứa khoảng trắng!');
      // setVisableErorr(true);
      setTimeout(() => {
        setVisableErorr(false);
        setError('');
      }, 5000);
    }

    setPass(text.trim());
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        <Image
          source={imagelogo}
          style={styles.imageLogo}
          resizeMode="contain"></Image>
        <View style={styles.input}>
          <Input
            // style={{fontFamily: 'material'}}
            placeholder="Tài Khoản"
            leftIcon={{
              type: 'material',
              name: 'person',
              color: '#778899',
              size: 30,
            }}
            disabled={enable}
            value={name}
            onChangeText={text => onChangeUsename(text)}
          />
        </View>
        <View style={styles.input}>
          <Input
            placeholder="Mật Khẩu"
            leftIcon={{
              type: 'material',
              name: 'lock',
              color: '#778899',
              size: 30,
            }}
            onChangeText={text => onChangePassword(text)}
            value={pass}
            disabled={enable}
            secureTextEntry={visable}
            rightIcon={{
              type: 'material',
              name: visable ? 'visibility-off' : 'visibility',
              color: '#778899',
              size: 24,
              onPress: () => onchangVisable(),
            }}
          />
        </View>
        {/* <View style={styles.options}>
          <TouchableOpacity
            style={{position: 'absolute', right: 10}}
            onPress={() => {}}>
            <Text style={styles.textCustom}>Quên Mật Khẩu?</Text>
          </TouchableOpacity>
        </View> */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.customBtnBG} onPress={handleLogin}>
            {loading ? (
              <Text style={styles.customBtnText}>Đăng nhập</Text>
            ) : (
              <ActivityIndicator size="small" color="#fff" />
            )}
          </TouchableOpacity>
        </View>
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
            backgroundColor: Constant.COLOR.secondary,
            position: 'absolute',
            top: 10,
            zIndex: 999,
          }}>
          <Text style={{fontSize: 18, color: '#fff'}}>{error}</Text>
        </View>
      ) : null}
    </>
  );
};

export default Login;
