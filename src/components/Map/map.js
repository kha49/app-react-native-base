import React, { Component, forwardRef } from 'react';
import {
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  Alert,
  Text,
  Modal,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TextInput,
  StatusBar,
  DeviceEventEmitter
} from 'react-native';
import MapboxGL, { Logger } from '@react-native-mapbox-gl/maps';

import Constant from '../../util/constant';
import ModalBox from 'react-native-modalbox';
import mushroom from '../../services/mushroom.api.def';
import { FlatList } from 'react-native-gesture-handler';
// import { Root, Button } from 'native-base';
import BottomPopupView from '../Map/bottomPopup/bottomPopupView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../../componentComon/header';
import { Modalize } from 'react-native-modalize';
import { useIsFocused } from "@react-navigation/native";

MapboxGL.setAccessToken(
  'pk.eyJ1Ijoic2l0ZW4iLCJhIjoiY2s3MDZ3b28wMWU3ZTNscWFpN2dqOW5kbCJ9.GTDVHQl6N8Wck_9ZRQvdJw',
);

Logger.setLogCallback(log => {
  const { message, level } = log;
  if (
    message.match('Request failed due to a permanent error: Canceled') ||
    message.match('Request failed due to a permanent error: Socket Closed') ||
    message.match('[HTTP] Unable to parse resourceUrl') ||
    level === 'error'
  ) {
    return true;
  }
  return false;
});

export default class MapScreenScreen extends Component {
  modal = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      arrMarker: [],
      openModalbox: false,
      inforMarker: {
        name: '',
        desc: '',
        lat: '',
        lng: '',
        code: '',
        videos: '',
        id: '',
      },
    };
  }

  async componentDidMount() {
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor('transparent');
    StatusBar.setBarStyle('dark-content');
    MapboxGL.setTelemetryEnabled(false);
    this.zoomToPosition();
    await this.getMarkers();
    DeviceEventEmitter.addListener('goBackFromSearch', (e) => {
      console.log(e, 'eeeeeeeee');
      if (e?.item?.lat && e?.item?.lng) {
        this.flyCamera(e.item.lng, e.item.lat);
        setTimeout(() => {
          this.onPress(e.item);
        }, 3000);
      }
    });
    this.subs = this.props.navigation.addListener("focus", async () => {
      await this.getMarkers();
      console.log('didfocus');
    });
  }
  

  flyCamera(lng, lat) {
    if (this._mapCamera) {
      this._mapCamera.zoomTo(10, 1000);
      setTimeout(() => {
        if (this._mapCamera) {
          this._mapCamera.flyTo([parseFloat(lng), parseFloat(lat)], 1000);
          console.log(typeof lng, lat, 'lat');
        }
        setTimeout(() => {
          if (this._mapCamera) {
            this._mapCamera.zoomTo(15.67, 1000);
            console.log('flyy');
          }
        }, 1000);
      }, 1000);
    }
  }

  zoomToPosition() {
    setTimeout(() => {
      if (this._mapCamera) {
        this._mapCamera.zoomTo(15.67, 1000);
      }
    }, 1500);
  }

  async getMarkers() {
    let token = await AsyncStorage.getItem('token');
    console.log(token, 'token');
    try {
      const response = await mushroom.maker.get_maker_by_userAsync(token);
      console.log('Kết quả trả về, response: %o', response);
      if (response?.result?.makers.length > 0) {
        response.result.makers = response.result.makers.map(e => ({
          ...e,
          isPress: false
        }))
        this.setState({
          arrMarker: response.result.makers,
        }, () => {
          console.log(this.state.arrMarker, 'this.state.arrMarker');
        });
      }
    } catch (e) {
      console.error('Có lỗi: %o', e);
    }
  }

  _renderHeader = () => {
    const textTitleTour = 'Bản đồ';
    const { navigation } = this.props;
    return (
      <Header
        title={'Bản đồ'.toUpperCase()}
        // renderLeft={true}
        // onClickIconLeft={() => {
        //   navigation.goBack();
        // }}
        hideLeftIcon={true}
        rightIcon={require("../../assets/images/search.png")}
        onClickIconRight={() => navigation.navigate('SearchMap')}
      />
      // <Header
      //   title="Bản đồ"
      //   onRightPress={() => navigation.navigate('SearchMap')}
      // />

    );
  };

  onPress = e => {
    this.state.arrMarker.forEach(item => {
      if (item.id === e.id) {
        item.isPress = true;
      }
    })
    console.log('asdasdasd', e, this.state.arrMarker);
    this.setState({
      arrMarker: this.state.arrMarker
    })


    this.setState({
      inforMarker: e,
      openModalbox: true,
    }, () => {
      console.log(this.modal, 'modalize');
      if (this.modal?.current) {
        this.modal.current.open();
      }
    });
  };

  onCloesdModal() {

  }

  _renderMarkers = () => {
    const { arrMarker } = this.state;
    let featureCollection = this.buildFeatureCollection(arrMarker);
    return (
      <MapboxGL.ShapeSource
        id="symbolLocationSource"
        shape={featureCollection}
        onPress={(e) => this.onPress(e.nativeEvent.payload.properties.infor)}
        hitbox={{ width: 20, height: 20 }}
      >
        <MapboxGL.SymbolLayer
          id="pinnNomarl"
          filter={['==', 'isPressed', false]}
          style={{
            iconImage: require('../../assets/images/icon_location.png'),
            iconSize: 0.2,
            iconPadding: 10,
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            textField: '{title}',
            textFont: ['Open Sans Regular', 'Arial Unicode MS Regular'],
            textOffset: [.5, 1.5],
            textAllowOverlap: true,
            textSize: 10,
            textIgnorePlacement: false,
          }}
          minZoomLevel={12}
        >
        </MapboxGL.SymbolLayer>

        <MapboxGL.SymbolLayer
          id="pinPressed"
          filter={['==', 'isPressed', true]}
          style={{
            iconImage: require('../../assets/images/icon_location.png'),
            iconSize: 0.4,
            iconPadding: 10,
            iconAllowOverlap: true,
            iconIgnorePlacement: true,
            textField: '{title}',
            textFont: ['Open Sans Regular', 'Arial Unicode MS Regular'],
            textOffset: [.5, 2.5],
            textAllowOverlap: true,
            textSize: 14,
            textIgnorePlacement: false,
            textColor: 'red'
          }}
          minZoomLevel={12}
        >
        </MapboxGL.SymbolLayer>

      </MapboxGL.ShapeSource>
    );
  };

  buildFeatureCollection(items) {
    return {
      type: 'FeatureCollection',
      features: items.map(element => {
        return {
          type: 'Feature',
          properties: {
            infor: element,
            title: element.name,
            isPressed: element.isPress
          },
          geometry: {
            type: 'Point',
            coordinates: [element.lng, element.lat],

          },
        };
      }),
    };
  }

  _onRegionDidChange = async regionFeature => { };

  _renderMap = () => {
    const rasterSourceProps = {
      id: 'b232eb301471771069ab27b0715962f24a32055ad975464b',
      tileUrlTemplates: [''],
      tileSize: 256,
    };
    return (
      <View style={{ height: 300, flex: 1 }}>
        <MapboxGL.MapView
          ref={ref => {
            this.mapRef = ref;
          }}
          style={{ flex: 1 }}
          contentInset={[0, 0, 0, 0]}
          onRegionDidChange={this._onRegionDidChange}>
          <MapboxGL.Camera
            ref={c => (this._mapCamera = c)}
            defaultSettings={{
              centerCoordinate: [105.852172, 21.028835],
              zoomLevel: 10,
            }}
            followUserMode="course"
            followZoomLevel={15.67}
          />
          <MapboxGL.RasterSource {...rasterSourceProps}>
            <MapboxGL.RasterLayer
              id="b232eb301471771069ab27b0715962f24a32055ad975464b"
              sourceID="b232eb301471771069ab27b0715962f24a32055ad975464b"
              style={{ rasterOpacity: 1 }}
            />
          </MapboxGL.RasterSource>
          {this._renderMarkers()}
        </MapboxGL.MapView>
      </View>
    );
  };

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          {this._renderHeader()}
          {this._renderMap()}
          <Modalize
            ref={this.modal}
            scrollViewProps={{ showsVerticalScrollIndicator: true }}
            withHandle={false}
            modalHeight={(Dimensions.get('window').height / 5) * 4}
            snapPoint={300}
            onClosed={() => {
              console.log('cloessddd');
              this.state.arrMarker.map(e => {
                e.isPress = false;
              });
              this.setState({
                arrMarker: this.state.arrMarker
              })
            }}
          >
            <ScrollView >
              <View
                style={{
                  flex: 1,
                  borderTopLeftRadius: 30,
                  borderTopRightRadius: 30,
                  alignItems: 'center',
                }}>
                <View
                  style={{
                    width: '100%',
                    height: 30,
                    borderBottomWidth: 0.5,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>

                </View>
                <BottomPopupView
                  name={this.state.inforMarker.name}
                  desc={this.state.inforMarker.desc}
                  lat={this.state.inforMarker.lat}
                  lng={this.state.inforMarker.lng}
                  code={this.state.inforMarker.code}
                  videos={this.state.inforMarker.videos}
                  maker_id={this.state.inforMarker.maker_id}
                  id={this.state.inforMarker.id}></BottomPopupView>
              </View>
            </ScrollView>
          </Modalize >
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});
