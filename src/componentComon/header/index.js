import React, {Component} from 'react';
import {View, Text, TouchableOpacity, SafeAreaView, Platform, StatusBar} from 'react-native';
import {Icon} from 'react-native-elements';
import styles from './styles';

function Header({title, onRightPress, onLeftPress}) {
  const checkBtnRight = () => {
    if (onRightPress === null) {
      return null;
    } else
      return (
        <TouchableOpacity style={styles.rightBtn} onPress={onRightPress}>
          <Icon type="material" name="search" size={30} />
        </TouchableOpacity>
      );
  };

  const checkBtnLeft = () => {
    if (onLeftPress === null) {
      return null;
    } else
      return (
        <TouchableOpacity style={styles.leftBtn} onPress={onLeftPress}>
          <Icon type="material" name="arrow-back" size={30} />
        </TouchableOpacity>
      );
  };

  return (
    <SafeAreaView style={styles.safeAreaView}>
      <View style={styles.container}>
        {checkBtnLeft()}
        <Text style={styles.title}>{title}</Text>
        {checkBtnRight()}
      </View>
    </SafeAreaView>
  );
}

Header.defaultProps = {
  title: '',
  onRightPress: null,
  onLeftPress: null,
};

export default Header;
