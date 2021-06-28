import React, { Component } from 'react';
import { View, Image, Text, SafeAreaView, StyleSheet, DeviceEventEmitter, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mushroom from '../../services/mushroom.api.def';
import DataShare from '../../api/DataShare';
import Header from '../../componentComon/header';
import Loading from '../../componentComon/Loading';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default class DetailNotificationScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            idNoti: DataShare.idNoti,
            // idNoti: this.props.navigation.getParam("IdNoti"),
            loading: true,
            inforNoti: {},
            inforMacker: {},
            inforAlarm: {},
            imageUrl: '',
            imgAlarm: null,
            alarmInvalid: true
        }
    }

    async componentDidMount() {
        console.log("idNoti", this.state.idNoti);
        await this.handChangeStatus();
        DeviceEventEmitter.emit('refreshNoti');
        await this.getInforNoti();
        await this.getInforMarker();
        await this.getInforAlarm();
    }
    handChangeStatus = async () => {
        const notification_object = {
            id: this.state.idNoti, // required
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
    };
    getInforNoti = async () => {
        try {
            const response = await mushroom.notification.findByIdAsync({
                id: this.state.idNoti
            });
            if (response && response.result) {
                this.setState({
                    inforNoti: response.result
                })
            }
            console.log("Thông tin notification trả về: %o", response);
        }
        catch (e) {
            console.log("Có lỗi: %o", e);
        }
    }

    getInforMarker = async () => {
        const { inforNoti } = this.state;
        console.log("inforMarkerddddddd", inforNoti);
        try {
            const response = await mushroom.maker.findByIdAsync({
                id: inforNoti.maker_id, // required
            });
            if (response && response.result) {
                this.setState({
                    inforMacker: response.result
                })
            }
        }
        catch (e) {
            console.log("Có lỗi: %o", e);
        }
    }

    getInforAlarm = async () => {
        const { inforMacker } = this.state;
        console.log("inforNotiddddddd", inforMacker);
        try {
            const response = await mushroom.alarm_images.listAsync({
                filters: ["maker_id=" + inforMacker.maker_id], // or "your filters" ,
            });
            if (response.result && response.result.length > 0) {
                let img = null;
                if (response.result[0].img_url) {
                    img = response.result[0].img_url;
                }
                this.setState({
                    inforAlarm: response.result[0]
                })
            }
            this.setState({
                loading: false
            })
            console.log("Các alarm_images thỏa mãn: %o, info: %o", response);
        }
        catch (e) {
            console.log("Có lỗi: %o", e);
            this.setState({
                loading: false
            })
        }
    }
    _renderHeader = () => {
        const { navigation } = this.props;
        return (
            <Header
                title={"Chi tiết thông báo".toLocaleUpperCase()}
                onClickIconLeft={() => {
                    navigation.goBack();
                }}
            />
            // <Header
            //     title="Chi tiết thông báo"
            //     onLeftPress={() => {
            //         navigation.goBack();
            //     }}
            // />
        );
    };
    renderBody() {
        const { inforNoti, inforMacker, inforAlarm } = this.state;
        return (
            <ScrollView style={[styles.container, { paddingHorizontal: 20, paddingVertical: 10 }]}>
                <View
                    style={{
                        // width: '90%',
                        //  height: 100,
                        // flexDirection: 'row',
                    }}>
                    <View>
                        <Text style={[styles.textContent, { fontSize: 20, fontWeight: 'bold' }]}>{inforMacker.name}</Text>
                        {
                            inforMacker.desc ?
                                <View style={styles.marginBottom10}>
                                    <Text style={{ opacity: 0.5 }}>Miêu tả:</Text>
                                    <Text style={{ fontSize: 16 }}>{`${inforMacker.desc}`}</Text>
                                </View> : null
                        }

                        {/* this.state.inforMarker. */}
                        <View style={styles.marginBottom10}>
                            <Text style={{ opacity: 0.5 }}>Mã:</Text>
                            <Text style={{ fontSize: 16 }}>{`${inforMacker.code}`}</Text>
                        </View>
                        <View style={styles.marginBottom10}>
                            <Text style={{ opacity: 0.5 }}>Vị trí:</Text>
                            <Text style={{ fontSize: 16 }}>
                                {`+ Vĩ độ : ${inforMacker.lat}`}
                            </Text>
                            <Text style={{ fontSize: 16 }}>
                                {`+ Kinh độ: ${inforMacker.lng}`}
                            </Text>
                        </View>
                        <View style={styles.marginBottom10}>
                            <Text style={{ opacity: 0.5 }}>Cảnh báo:</Text>
                            <Text style={{ fontSize: 16 }}>{`${inforNoti.body}`}</Text>
                        </View>

                        {this.state.inforMacker && this.state.inforMacker.videos.length > 0

                            ?
                            <View style={styles.marginBottom10}>
                                <Text style={{ opacity: 0.5 }}>Video:</Text>
                                <View>
                                    <View>
                                        {this.state.inforMacker.videos.map((e, index) => {
                                            return (
                                                <View style={{ flexDirection: 'row', flex: 1 }}>
                                                    <Text key={index} numberOfLines={2} style={[styles.textContent, { flex: 9 }]}>
                                                        {e}
                                                    </Text>
                                                    <AntDesign
                                                        name='download'
                                                        size={14}
                                                        style={{ alignSelf: 'center', paddingLeft: 10, flex: 1 }}
                                                    />
                                                </View>
                                            )
                                        })}
                                    </View>
                                </View>
                            </View>
                            : null
                        }

                        {/* <Text style={[styles.textContent, { fontSize: 20, fontWeight: 'bold' }]}>{inforMacker.name}</Text>
                        <Text style={styles.textContent}>{`Địa chỉ: ${inforMacker.desc}`}</Text>
                        <Text style={styles.textContent}>{`Mã: ${inforMacker.code}`}</Text>
                        <Text style={styles.textContent}>{`Vị trí: ${inforMacker.lat}, ${inforMacker.lng}`}</Text>
                        <Text style={styles.textContent}>{`Cảnh báo: ${inforNoti.body}`}</Text> */}
                    </View>
                </View>
                {
                    inforNoti.img_url ?
                        <View style={styles.noticeContent}>
                            <Text style={[styles.textContent, { marginBottom: 10, opacity: 0.5 }]}>Hình ảnh cảnh báo: </Text>
                            <View>
                            </View>
                            <Image
                                source={this.state.alarmInvalid ? { uri: inforNoti.img_url } : require('./../../assets/images/no_image.jpg')}
                                onError={(e) => {
                                    // this.setState({s
                                    //     imgAlarm: require('./../../assets/images/userAvatar.png')
                                    //     // require('./../../assets/images/userAvatar.png');
                                    // })
                                    this.setState({
                                        alarmInvalid: false
                                    })
                                }}
                                resizeMode={'stretch'}
                                style={{
                                    width: "100%",
                                    height: 200,
                                    // alignSelf: 'center',
                                    marginRight: 9,
                                    alignSelf: "center"

                                }} />
                        </View>
                        : null
                }
            </ScrollView>
        );
    }
    //   getInforUser = async () => {};
    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={styles.container}>
                    {this._renderHeader()}
                    {
                        this.state.loading ?
                            <Loading /> :
                            this.renderBody()
                    }

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
    noticeContent: {
        flex: 1,
        // marginTop: 10,
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
        paddingVertical: 1,
        fontSize: 14,
        marginBottom: 5
    },
    marginBottom10: {
        marginBottom: 10,
    },
});
