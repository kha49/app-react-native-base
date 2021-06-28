import {StyleSheet, Dimensions} from 'react-native';
import Constant from './../../util/constant';

const Width = Dimensions.get('window').width;
const Height = Dimensions.get('window').height;

const styles = StyleSheet.create({
  headerContent: {
    width: Width,
    height: Height / 12,
    backgroundColor: 'rgb(250, 255, 255)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userAvatar: {
    width: Width,
    height: Height / 4.5,
    backgroundColor: 'rgb(250, 255, 255)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonContainer: {
    marginTop: 20,
    flex: 1,
    justifyContent: 'center',
  },
  customBtnText: {
    fontSize: 20,
    fontWeight: '400',
    color: Constant.COLOR.third,
    textAlign: 'center',
  },
  popupView: {
    width: '100%',
    height: 120,
    // backgroundColor: Constant.COLOR.third,
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnPopup: {
    width: '95%',
    height: 50,
    marginVertical: 2,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default styles;
