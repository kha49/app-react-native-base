import React, {Component} from 'react';
import {View, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mushroom from '../../services/mushroom.api.def';
import DataShare from '../../api/DataShare';

export default class SplashScreen extends Component {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    let userToken = await AsyncStorage.getItem('token');
    if (userToken) {
      await this.getInforUser();
      this.props.navigation.navigate('Home');
    } else {
      this.props.navigation.navigate('Login');
    }
  }

  getInforUser = async () => {
    console.log('Có váo getInforUser');
    try {
      let result = await mushroom.$auth.meAsync();
      console.log("resultSplash",result);
      DataShare.idUser = result.result.id;
    } catch (error) {
      console.log('Lỗi', error);
    }
  };
  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#fff',
        }}>
        <Image
          source={require('../../../src/assets/images/logo.png')}
          resizeMode={'contain'}
          style={{width: 200, height: 200}}></Image>
      </View>
    );
  }
}
