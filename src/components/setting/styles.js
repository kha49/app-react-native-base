import React from 'react';
import {StyleSheet, Dimensions} from 'react-native';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: Width,
    height: Height,
  },
  content: {
    flex: 1,
  },
});

export default styles;
