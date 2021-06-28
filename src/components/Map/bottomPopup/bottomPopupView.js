import React, { Component } from 'react';
import { Text, View, Image, FlatList, TouchableOpacity, Dimensions, ScrollView, Linking } from 'react-native';
import styles from './styles';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import ImageView from 'react-native-image-viewing';
import mushroom from '../../../services/mushroom.api.def';
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';
import RNBackgroundDownloader from 'react-native-background-downloader'



export default class BottomPopupView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listImageMarkers: [],
      openDetailImage: false,
      imageIndex: 0,
      listNotis: []
    }
  }
  async componentDidMount() {
    const { maker_id, id } = this.props;
    await this.getNotification(id);
    await this.getAlarmImages(maker_id);
  }

  async getAlarmImages(maker_id) {
    console.log(maker_id);
    try {
      const response = await mushroom.alarm_images.listAsync({
        // fields: "id,name,url,maker_id,created_at,is_deleted"
        filters: [`maker_id=${maker_id}`, `is_deleted=${false}`]
      });
      console.log("Các alarm_images thỏa mãn: %o, info: %o", response);
      if (response.result.length > 0) {
        this.setState({
          listImageMarkers: response.result
        })
      }
    }
    catch (e) {
      console.error("Có lỗi: %o", e);
    }
  }

  async getNotification(id) {
    const idUser = await mushroom.$auth.meAsync();
    console.log('MEASync', idUser);
    try {
      const response = await mushroom.notification.listAsync({
        fields: "id,body,title,key,sender_id,created_at,receiver_id,maker_id,is_read,read_at",
        filters: [`maker_id=${id}`, `receiver_id=${idUser.result.id}`], // or "your filters" ,
        sort: "-created_at",
        limit: 11,
      });
      console.log("Các notification thỏa mãn: %o, info: %o", response);
      if (response.result.length > 0) {
        this.setState({
          listNotis: response.result
        })
      }
    }
    catch (e) {
      console.error("Có lỗi: %o", e);
    }
  }

  getUrlImages() {
    let dataImage = [];
    if (this.state.listImageMarkers.length > 0) {
      this.state.listImageMarkers.forEach(element => {
        let obj = {
          uri: element.url
        }
        dataImage.push(obj);
        // dataImage.push(severConfig.UrlImage + element)
      });
      return dataImage;
    }
    return dataImage;
  }

  renderImage() {
    let listImageDes = this.getUrlImages();
    return (
      <View>
        <FlatList
          data={listImageDes}
          keyExtractor={(item, index) => item.index}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={(data) => this.renderRowImageDes(data)}
          removeClippedSubviews={false}
          enableEmptySections
          contentContainerStyle={styles.viewListImgeDes}
        />
      </View>
    )
  }

  renderRowImageDes(data) {
    console.log(data, 'listImageUrL');
    return (
      <TouchableOpacity key={data.item.index} onPress={() => {
        this.setState({
          imageIndex: data.index,
          openDetailImage: true
        }), () => { console.log(this.state.openDetailImage, 'openDetailImage'); }
      }
      }>
        <Image
          style={styles.viewChildImage}
          source={{ uri: data.item.uri }}
        />
      </TouchableOpacity>
    )
  }

  detailImage = () => {
    const { imageIndex } = this.state;
    let listImageDes = this.getUrlImages();
    return (
      this.state.openDetailImage && listImageDes.length > 0 ?
        <ImageView
          animationType={'fade'}
          images={listImageDes}
          imageIndex={imageIndex}
          visible={this.state.openDetailImage}
          onRequestClose={() => this.setState({
            openDetailImage: false
          })}
        />
        : null
    )
  }

  renderNotification(name) {
    return (
      <View>
        <View style={{
          width: Dimensions.get('screen').width - 50,
        }}>
          <Text style={[styles.textContent], { color: 'gray' }}>Cảnh báo gần nhất:</Text>
        </View>
        <View style={{
        }}>
          <Text style={[styles.textContent, { fontWeight: "bold", paddingHorizontal: 10 }]}>
            {`- ${this.state.listNotis[0].body.replace('<maker.name>', name)}`}

          </Text>
          <Text style={styles.textTime}>
            {`${moment(this.state.listNotis[0].created_at, 'YYYY-MM-DDTHH:mm:ss.SSSZZ').format('HH:mm DD-MM-YYYY')}`}

            {this.state.listNotis[0].is_read ? < AntDesign
              name='eyeo'
              size={14}
              style={{ marginRight: 20 }}
            />
              : null
            }
          </Text>
          <View style={styles.bottomLine}></View>

        </View>
        {this.state.listNotis.length > 1

          ?
          <View>
            <View style={{
              width: Dimensions.get('screen').width - 50,
              marginTop: 10
            }}>
              <Text style={[styles.textContent], { color: 'gray' }}>Cảnh báo cũ:</Text>

            </View>
            <View >
              {this.state.listNotis.map((e, idx) => {
                if (idx > 0) {
                  return (
                    <View style={{
                    }}>
                      <Text style={[styles.textContent, { paddingHorizontal: 10 }]}>
                        {`- ${e.body.replace('<maker.name>', name)}`}
                      </Text>
                      <Text style={styles.textTime}>
                        {`${moment(e.created_at, 'YYYY-MM-DDTHH:mm:ss.SSSZZ').format('HH:mm DD-MM-YYYY')}`}
                        {e.is_read ? < AntDesign
                          name='eyeo'
                          size={14}
                          style={{ marginVertical: 20 }}

                        />
                          : null
                        }
                      </Text>
                      <View style={styles.bottomLine}></View>
                    </View>
                  )
                }
              })}
            </View>
          </View>
          : null
        }
      </View>
    )
  }

  downloadFile = (urlFile) => {
    // console.log(urlFile, 'urlfile');
    // let task = RNBackgroundDownloader.download({
    //   id: 111,
    //   url: 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4',
    //   destination: `${RNBackgroundDownloader.directories.documents}`
    // }).begin((expectedBytes) => {
    //   console.log(`Going to download ${expectedBytes} bytes!`);
    // }).progress((percent) => {
    //   console.log(`Downloaded: ${percent * 100}%`);
    // }).done(() => {
    //   console.log('Download is done!');
    // }).error((error) => {
    //   console.log('Download canceled due to error: ', error);
    // });
    Linking.openURL(urlFile);
  }

  render() {
    const { name, desc, lat, lng, code, videos } = this.props;
    return (
      <View style={styles.container}>
        <View
          style={{
            width: '90%',
            //  height: 100,
            flexDirection: 'row',
          }}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.textContent, { fontSize: 28, fontWeight: 'bold' }]}>{name}</Text>
            <Text style={styles.textContent}>{desc}</Text>
            <Text style={[styles.textContent, { color: 'gray' }]}>Mã:</Text>
            <Text style={styles.textContent, { color: 'black' }}>{`${code}`}</Text>
            <View style={{ paddingVertical: 5 }}></View>

            <Text style={[styles.textContent, { color: 'gray' }]}>Vị trí:</Text>
            <Text style={styles.textContent, { color: 'black' }}>{`${lat}, ${lng}`}</Text>
            <View style={{ paddingVertical: 5 }}></View>
            {videos.length > 0
              ? <View >
                <Text style={[styles.textContent, { color: 'gray' }]}>{`Videos: `}</Text>
                <View >
                  {videos.map((e, index) => {
                    return (
                      <View style={{ flexDirection: 'row', flex: 1 }}>
                        <TouchableOpacity onPress={() => this.downloadFile(e)}>
                          <Text key={index} numberOfLines={2} style={[styles.textContent, { flex: 9 , color : 'rgb(6,69,173)' }]}>{`${e}`}</Text>
                        </TouchableOpacity>
                        {/* <AntDesign
                          name='download'
                          size={17}
                          style={{ alignSelf: 'center', paddingLeft: 10, flex: 1 }}
                          // onPress={() => this.downloadFile(e)}
                        /> */}
                      </View>
                    )
                  })}
                </View>
              </View>
              : null
            }
          </View>
        </View>
        <View>
          {
            this.state.listNotis.length > 0
              ? <View>
                <View style={{ paddingVertical: 5 }}></View>
                {this.renderNotification(name)}
              </View>
              : null
          }

        </View>
        <View style={styles.noticeContent}>
          {this.state.listImageMarkers.length > 0
            ?
            <View>
              <View style={{ paddingVertical: 5 }}></View>
              <Text style={[styles.textContent], { color: 'gray' }}>Hình ảnh cảnh báo gần nhất: </Text>
              {this.renderImage()}
            </View>
            :
             <View>
              <Text style={[styles.textContent], { color: 'gray' }}>Hình ảnh cảnh báo gần nhất: </Text>
              <Text>Chưa có thông tin</Text>
            </View>
          }
        </View>
        {this.detailImage()}
      </View>
    )
  }
}





