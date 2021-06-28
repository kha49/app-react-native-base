import {StyleSheet} from 'react-native';
import Constant from './../../util/constant';

const COLOR = Constant.COLOR;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'aliceblue',
  },
  input: {
    // justifyContent: 'center',
    height: 50,
    width: '80%',
    flexDirection: 'row',
    // borderBottomWidth: 0.6,
    margin: 10,
  },
  seePassword: {
    marginTop: 15,
    width: 40,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'aliceblue',
  },
  buttonContainer: {
    marginTop: 30,
    height: 40,
    justifyContent: 'center',
  },
  button: {
    padding: 30,
    width: 200,
    height: 50,
  },
  options: {
    width: '80%',
    height: 30,
    marginTop: 10,
  },
  textCustom: {
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'italic',
    shadowOffset: {width: 2, height: 5},
    color: COLOR.primary,
  },
  imageBg: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  imageLogo: {
    width: '70%',
    height: '20%',
    marginTop: -60,
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  customBtnText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLOR.third,
    textAlign: 'center',
  },
  Icon: {width: 30, height: 40, justifyContent: 'center', marginVertical: 6},
  inputText: {
    width: '80%',
    height: '100%',
    fontSize: 18,
    marginLeft: 10,
  },
  customBtnBG: {
    backgroundColor: COLOR.secondary,
    paddingHorizontal: 30,
    paddingVertical: 5,
    borderRadius: 10,
    width: 250,
    height: 50,
    justifyContent: 'center',
    textAlign: 'center',
    alignSelf: 'center',
  },
});

export default styles;
