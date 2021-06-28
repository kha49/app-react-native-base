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
    marginTop: 8,
    backgroundColor: '#fff',
    paddingTop: 10,
    // justifyContent: 'center',
    // alignItems: 'center',
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
