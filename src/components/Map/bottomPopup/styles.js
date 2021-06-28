import { Dimensions, StyleSheet, StatusBar } from 'react-native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const marginTopMap = StatusBar.currentHeight;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 10,
    paddingHorizontal : 15
  },
  noticeContent: {
    flex: 1,
    marginTop: 10,
  },
  viewChildImage: {
    marginRight: 12,
    width: 150,
    height: 150,
    borderRadius: 8
  },
  viewListImgeDes: {
    paddingBottom: 19,
    paddingTop: 12,
    // paddingHorizontal: 20
  },
  textContent: {
    paddingVertical: 3,
    fontSize: 14,
    fontFamily: 'Arial'
  },
  textTime: {
    fontSize: 12, opacity: 0.5, color: 'gray', alignSelf: 'flex-end', paddingRight: 10
  },
  bottomLine: {
    height: 0.5,
    backgroundColor: '#CCCCCC',
    marginVertical: 5
  }
});

export default styles;
