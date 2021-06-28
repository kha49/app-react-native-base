import {StyleSheet, Dimensions} from 'react-native';
import Constant from './../../../util/constant';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    width: Width,
    height: Height,
  },
  content: {
    flex: 1,
    marginTop: 5,
    backgroundColor: Constant.COLOR.third,
  },
});

export default styles;
