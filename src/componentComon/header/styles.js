import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: '#fff',
  },
  container: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  rightBtn: {
    position: 'absolute',
    bottom: 10,
    right: 20,
  },
  leftBtn: {
    position: 'absolute',
    bottom: 10,
    left: 20,
  },
});

export default styles;
