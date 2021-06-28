import React, { Component, forwardRef } from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Dimensions,
    SafeAreaView,
    StyleSheet,
    FlatList,
    DeviceEventEmitter
} from 'react-native';
import mushroom from '../../services/mushroom.api.def';
import Header from "../../componentComon/header"
import Search from "../../componentComon/search"
import MethodService from '../../componentComon/MethodService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EvilIcons from 'react-native-vector-icons/EvilIcons';


export default class SearchMapScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isSearching: false,
            textSearch: '',
            listSafePlace: [],
            words: '',
            offset: 0,
            token: '',
            listSafePlaceFull: []
        };
    }

    async componentDidMount() {
        let token = await AsyncStorage.getItem('token');
        await this.setState({
            token: token
        })
        setTimeout(() => {
            this.setState({
                isSearching: true
            })
        }, 300);
        this.getMarker(token);
    }

    fetchingItem() {
        const { words } = this.state;
        console.log(words, 'words');
        let data = [];
        if (words) {
            let arrWords = [];
            arrWords = words.split(' ');
            console.log(arrWords, 'arrWords');
            this.state.listSafePlaceFull.forEach(e => {
                e.Mushroom_ExtraProperties.__text.forEach(k => {
                    arrWords.forEach(l => {
                        if (k.includes(MethodService.removeVietnameseTones(l.toLowerCase())) && l !== '') {
                            data.push(e);
                        }
                    })
                })
            })
        } else {
            data = this.state.listSafePlaceFull
        }
        let filterData = [];
        filterData = [...new Set(data)];
        console.log(filterData, 'filterData');
        this.setState({
            listSafePlace: filterData
        })
    }

    async getMarker(token) {
        try {
            const response = await mushroom.maker.get_maker_by_userAsync(token);
            console.log('Kết quả trả về, response: %o', response);
            if (response?.result?.makers.length > 0) {
                this.setState({
                    listSafePlaceFull: response.result.makers,
                    listSafePlace: response.result.makers
                });
            }
        } catch (e) {
            console.error('Có lỗi: %o', e);
        }

    }

    _renderHeader = () => {
        const textTitle = 'Tìm kiếm bản đồ';
        const { navigation } = this.props;
        const { isSearching } = this.state;
        if (isSearching) {
            return (
                <Header
                    renderTitle={this._renderSearchBar}
                    onClickIconLeft={() => {
                        navigation.goBack();
                    }}
                    rightWidth={0}
                />
            )
        } else {
            return (
                <Header
                    title={textTitle.toUpperCase()}
                    onClickIconLeft={() => {
                        navigation.goBack();
                    }}
                    rightIcon={require("../../assets/images/search.png")}
                    onClickIconRight={() => this._handleTapSearch()}
                />
            )
        }
    };

    _handleSearch(textSearch) {
        this.setState({
            textSearch: textSearch,
            listSafePlace: [],
            words: textSearch,
            offset: 0
        }, () => this.fetchingItem());
    }

    _renderSearchBar = () => (
        <Search
            keySearch={this.state.textSearch}
            placeholderSearch={'Tìm kiếm'}
            onChangeTextSearch={(textSearch) => this._handleSearch(textSearch)}
            onCancel={this._handleTapCancelSearch}
            isShowCancel={true}
        />
    )
    _handleTapCancelSearch = () => {
        const { isSearching } = this.state;
        this.setState({
            isSearching: false,
            textSearch: "",
            words: '',
            offset: 0,
            listSafePlace: []
        }, () => this.fetchingItem())
    }
    _handleTapSearch = () => {
        this.setState({ isSearching: true })
    }

    _onPressItem(item) {
        DeviceEventEmitter.emit('goBackFromSearch', { item })
        this.props.navigation.navigate('MapStack');
    }

    renderItem(data) {
        console.log(data, 'itemm');
        return (
            <TouchableOpacity style={styles.viewRowContent} onPress={() => this._onPressItem(data.item)}>
                <View style={styles.viewRowTourGuide}>
                    <View style={{ flexDirection: 'row' }}>
                        <EvilIcons
                            name='location'
                            size={20}
                            style={{ marginRight: 3 , paddingTop : 3 }}
                        >
                        </EvilIcons>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>{data.item.name}</Text>

                    </View>
                    <Text>{data.item.code}</Text>
                    <Text>{data.item.desc}</Text>
                </View>
                <View style={{ borderBottomWidth: 0.5, borderColor: 'gray', marginVertical: 10 }}></View>
            </TouchableOpacity>
        )


    }


    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    {this._renderHeader()}
                    <FlatList
                        data={this.state.listSafePlace}
                        keyExtractor={(item, index) => "list" + index}
                        renderItem={(data) => this.renderItem(data,)}
                        removeClippedSubviews={false}
                        showsVerticalScrollIndicator={false}
                        enableEmptySections
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 10 }}
                    >
                    </FlatList>
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
    viewRowContent: {
        width: Dimensions.get('window').width - 30,
        backgroundColor: '#fff',
    },
    viewRowTourGuide: {
        width: Dimensions.get('window').width - 30,
        height: 'auto',
        marginLeft: 15,
        backgroundColor: '#fff',
        alignItems: 'flex-start',
    },
});
