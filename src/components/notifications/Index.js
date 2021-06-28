import React, { useState, useEffect } from 'react';
import {
  View,
  Dimensions,
  Text,
  StatusBar,
  RefreshControl,
  FlatList,
  DeviceEventEmitter,
  Platform,
  SafeAreaView
} from 'react-native';
import moment from 'moment';
import { ListItem, Avatar, Icon } from 'react-native-elements';
import { SearchBar } from 'react-native-elements';
import Constant from '../../util/constant';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';
import { ScrollView } from 'react-native-gesture-handler';
import mushroom from './../../services/mushroom.api.def';
import { ActivityIndicator } from 'react-native-paper';
// import RenderItem from './renderItems';
import { Item } from 'react-native-paper/lib/typescript/components/List/List';
import DataShare from '../../api/DataShare';
import Header from '../../componentComon/header';
import Loading from '../../componentComon/Loading';

const STYLESEARCHBAR = Constant.STYLESEARCHBAR;

const Notifications = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [reloading, setReloading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [visable, setVisable] = useState(false);
  const [handle, setHandle] = useState(false);
  const [dataNoti, setdataNoti] = useState([]);

  // const setStatusBar = () => {
  //   if (Platform.OS == 'ios') {
  //     return;
  //   }
  //   StatusBar.setBarStyle('light-content');
  //   StatusBar.setTranslucent(false);
  //   StatusBar.setBackgroundColor("white");
  // }
  useEffect(async () => {
    // setStatusBar();
    await getNoti();
    DeviceEventEmitter.addListener('refreshNoti', () => { getNoti() });
    // setTimeout(() => {
    //   setLoading(false);
    // }, 5000);
  }, [reloading, handle]);
  const getNoti = async () => {
    try {
      const response = await mushroom.notification.listAsync({
        filters: ['receiver_id=' + DataShare.idUser],
        limit: 100
      });
      console.log("responseNotibbbbbbb",DataShare.idUser);
      if (response.result.length > 0) {
        setdataNoti(response.result);
      }
      setLoading(false);
      console.log('Các notification thỏa mãn: %o, info: %o', response.result);
    } catch (e) {
      setLoading(false);
      console.error('Có lỗi: %o', e);
    }
  };
  // --------------- reloading screen
  const onRefresh = React.useCallback(() => {
    getNoti();
    // debugger; 
    // setReloading(true);
    // setTimeout(() => {
    //   setReloading(false);
    // }, 2000);
    // setHandle(!handle);
  }, [reloading]);

  // --------------- change status is_read
  const handChangeStatus = async item => {
    console.log('có vào');
    if (item.is_read) return;
    const notification_object = {
      id: item.id, // required
      is_read: true,
    };
    try {
      const response = await mushroom.notification.partialUpdateAsync(
        notification_object,
      );
      // if (response) setHandle(!handle);
      console.log('dữ liệu trả về thành công', response.result);
    } catch (error) {
      console.error('Có lỗi: %o', error);
    }

    setHandle(!handle);
  };

  // --------------- load more data
  const renderFooter = () => {
    return loadingData ? (
      <View
        style={{
          width: '100%',
          height: 60,
          marginBottom: 0,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <ActivityIndicator size="small" color="blue" />
      </View>
    ) : null;
  };
  const loadmoreData = React.useCallback(() => {
    setLoadingData(true);
    setTimeout(() => {
      setLoadingData(false);
    }, 3000);
  }, [loadingData]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ backgroundColor: '#f8f8ff', flex: 1 }}>
        <Header
          title={"Thông báo".toLocaleUpperCase()}
          onClickIconLeft={() => navigation.navigate('MapScreen')}
          hideLeftIcon={true}
        />
        {/* <Header
        title="Thông báo"
        // onRightPress={() => setVisable(!visable)}
        onLeftPress={() => navigation.navigate('MapScreen')}></Header> */}
        {/* {visable ? (
        <SearchBar
          placeholder="Tìm kiếm thông báo..."
          onChangeText={value => setSearch(value)}
          value={search}
          searchIcon={(true, { size: 28 })}
          containerStyle={[STYLESEARCHBAR.containerSearchBarStyle]}
          inputContainerStyle={[STYLESEARCHBAR.inputContainerSearchBarStyle]}
        />
      ) : null} */}
        {loading ? (
          // <View
          //   style={{
          //     width: Dimensions.get('window').width,
          //     height: Dimensions.get('window').height,
          //     justifyContent: 'center',
          //     alignItems: 'center',
          //   }}>
          //   <ActivityIndicator size="small" color={Constant.COLOR.secondarys} />
          //   {/* <Text>Loading...</Text> */}
          // </View>
          <Loading />
        ) : (
          <>
            {dataNoti.length > 0 ? (
              <FlatList
                data={dataNoti}
                keyExtractor={(item, index) => index.toString()}
                showsVerticalScrollIndicator={false}
                // ----------- refreshing
                refreshing={reloading}
                onRefresh={onRefresh}
                // ----------- Loading
                ListFooterComponent={renderFooter}
                // onEndReached={loadmoreData}
                onEndReachedThreshold={0.1}
                renderItem={({ item }) => (
                  <ListItem
                    Component={TouchableScale}
                    friction={90}
                    tension={100}
                    activeScale={0.95}
                    bottomDivider
                    containerStyle={{
                      marginVertical: 5,
                      width: '100%',
                      backgroundColor: item.is_read ? '#fff' : '#cfd8dc',
                    }}
                    onPress={() => {
                      handChangeStatus(item);
                      console.log("itemhandChangeStatus", item);
                      DataShare.idNoti = item.id;
                      navigation.navigate('DetailNotificationScreen');
                    }}>
                    <Icon
                      type="material"
                      name="notifications"
                      size={50}
                      color={"#EF3B0E"}
                    />
                    <ListItem.Content>
                      <ListItem.Title
                        style={{ color: '#000', fontSize: 18 }}
                        numberOfLines={3}
                      >
                        {item.title}
                      </ListItem.Title>
                      {/* <ListItem.Subtitle style={{ color: '#000' }}>
                      {item.body}
                    </ListItem.Subtitle> */}
                      <ListItem.Subtitle style={{ color: '#a9a9a9', marginTop: 10 }}>
                        {moment(item.created_at).format('DD/MM/YYYY HH:mm:ss')}
                      </ListItem.Subtitle>
                    </ListItem.Content>
                    <ListItem.Chevron color="black" iconStyle={{ fontSize: 24 }} />
                  </ListItem>
                )}></FlatList>
            ) : (
              <View
                style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Không có thông báo</Text>
              </View>
            )}
          </>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Notifications;
