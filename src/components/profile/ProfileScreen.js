import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card, Input, ListItem, Icon, BottomSheet } from 'react-native-elements';
import styles from './styles';
import mushroom from '../../services/mushroom.api.def';
import TouchableScale from 'react-native-touchable-scale';
import { LinearGradient } from 'react-native-linear-gradient';
import Constant from './../../util/constant';
import { Button } from 'react-native-elements/dist/buttons/Button';
import moment from 'moment';
import Header from '../../componentComon/header';

const ProfileScreen = ({ navigation }) => {
  const [visable, setVisable] = useState(false);
  const [popupGender, setPopupGender] = useState(false);
  const [popupDate, setPopupDate] = useState(false);
  const [userData, setUserData] = useState('');
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [gender, setGender] = useState('');
  const [birth, setBirth] = useState('');
  const [address, setAddress] = useState('');

  const getUserInfo = async () => {
    const tokeUser = await mushroom.$auth.meAsync();
    console.log("tokeUserData", tokeUser);
    // console.log(tokeUser.result.id);
    if (tokeUser) {
      setUserData(tokeUser.result);
      try {
        const response = await mushroom.user_info.findByIdAsync({
          id: tokeUser.result.id, // required
        });
        console.log("responseData", response);
        if (response) {
          // setUrlImage(response.result.avatar_id);
          const full_name = response.result.full_name.full_name
            ? response.result.full_name.full_name
            : `${response.result.full_name.last_name} ${response.result.full_name.first_name}`;
          setFullname(full_name);
          setEmail(response.result.email);
          setPhone(response.result.phone_number);
          setGender(response.result.gender);
          const birthday = response.result.birthday.birthday
            ? moment(response.result.birthday.birthday).format('DD/MM/YYYY')
            : '';
          // !response.result.birthday.birthday
          //   ? `${response.result.birthday.day}/${response.result.birthday.month}/${response.result.birthday.year}`
          //   : response.result.birthday.birthday
          setBirth(birthday);
          setAddress(response.result.address);
        }
      } catch (error) {
        console.error('Có lỗi:' + error);
      }
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  const onchangVisable = () => {
    setVisable(!visable);
  };

  const BottomPopupChoiceGender = () => {
    return (
      <BottomSheet
        isVisible={popupGender}
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}>
        <View style={styles.popupView}>
          <TouchableOpacity
            style={[
              styles.btnPopup,
              { backgroundColor: Constant.COLOR.secondary },
            ]}
            onPress={() => {
              setGender(2);
              setPopupGender(false);
            }}>
            <Text style={styles.text}>Nam</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.btnPopup,
              { backgroundColor: Constant.COLOR.secondary },
            ]}
            onPress={() => {
              setGender(1);
              setPopupGender(false);
            }}>
            <Text style={styles.text}>Nữ</Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: '100%',
            height: 60,
            justifyContent: 'center',
            alignItems: 'center',
            // backgroundColor: '#fff',
          }}>
          <TouchableOpacity
            style={[styles.btnPopup, { backgroundColor: '#fff' }]}
            onPress={() => {
              setGender(3);
              setPopupGender(false);
            }}>
            <Text style={[styles.text, { color: '#000' }]}>Khác</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    );
  };

  const BottomPopupChoiceDate = () => {
    return (
      <BottomSheet
        isVisible={popupDate}
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}>
        <View
          style={{
            width: '100%',
            height: 300,
            backgroundColor: '#fff',
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }}>
          <View
            style={{
              width: '100%',
              height: 50,
              borderBottomWidth: 0.6,
            }}>
            <TouchableOpacity
              style={{
                width: 50,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                left: 20,
              }}
              onPress={() => {
                setPopupDate(false);
              }}>
              <Text
                style={{
                  fontSize: 18,
                }}>
                Hủy
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                width: 50,
                height: 40,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'absolute',
                right: 20,
              }}
              onPress={() => {
                setPopupDate(false);
              }}>
              <Text
                style={{
                  fontSize: 18,
                }}>
                Xong
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BottomSheet>
    );
  };

  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* <Header
          title="Thông tin tài khoản"
          onLeftPress={() => navigation.goBack()}
        /> */}
        <Header
          title={"Thông tin tài khoản".toLocaleUpperCase()}
          onClickIconLeft={() => navigation.goBack()}
        />
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Input
            label="Tên đăng nhập"
            inputStyle={{
              height: 40,
            }}
            value={userData.account}
            editable={false}
          />
          <Input
            inputStyle={{
              height: 40,
            }}
            label="Email"
            value={email ? email : null}
            editable={visable}
            onChangeText={text => setEmail(text)}
            rightIcon={
              visable ? (
                <Icon
                  type="material"
                  name="close"
                  size={24}
                  onPress={() => {
                    setEmail('');
                  }}
                />
              ) : null
            }
          />
          <Input
            label="Số điện thoại"
            inputStyle={{
              height: 40,
            }}
            value={phone ? phone : null}
            editable={visable}
            onChangeText={text => setPhone(text)}
            rightIcon={
              visable ? (
                <Icon
                  type="material"
                  name="close"
                  size={24}
                  onPress={() => {
                    setPhone('');
                  }}
                />
              ) : null
            }
          />
          <TouchableOpacity
            disabled={!visable}
            onPress={() => {
              visable ? setPopupGender(true) : null;
            }}>
            <Input
              label="Giới tính"
              inputStyle={{
                height: 40,
              }}
              value={
                gender === 1
                  ? 'Nữ'
                  : gender === 2
                    ? 'Nam'
                    : gender === 3
                      ? 'Khác'
                      : 'Chưa xác định'
              }
              editable={false}
              rightIcon={
                visable ? (
                  <Icon
                    type="material"
                    name="arrow-drop-down"
                    size={24}
                    onPress={() => {
                      setPopupGender(true);
                    }}
                  />
                ) : null
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            disabled={!visable}
            onPress={() => {
              setPopupDate(true);
            }}>
            <Input
              label="Ngày sinh"
              inputStyle={{
                height: 40,
              }}
              value={birth ? birth : null}
              editable={false}
              rightIcon={
                visable ? (
                  <Icon
                    type="material"
                    name="arrow-drop-down"
                    size={24}
                    onPress={() => {
                      setPopupDate(true);
                    }}
                  />
                ) : null
              }
            />
          </TouchableOpacity>
          <Input
            label="Địa chỉ"
            value={address ? address : null}
            editable={visable}
            multiline={true}
            onChangeText={text => setAddress(text)}
            rightIcon={
              visable ? (
                <Icon
                  type="material"
                  name="close"
                  size={24}
                  onPress={() => {
                    setAddress('');
                  }}
                />
              ) : null
            }
          />
        </ScrollView>
        {/* {visable ? (
          <View
            style={{
              width: '100%',
              height: 50,
              flexDirection: 'row',
              backgroundColor: '#fff',
              position: 'absolute',
              bottom: 90,
            }}>
            <Button
              buttonStyle={{
                width: 150,
                height: 40,
                backgroundColor: Constant.COLOR.primary,
                marginHorizontal: '10%',
              }}
              onPress={() => navigation.goBack()}
              title="Hủy"
              titleStyle={{
                color: '#fff',
              }}
              type="outline"
            />
            <Button
              buttonStyle={{
                width: 150,
                height: 40,
                backgroundColor: Constant.COLOR.secondary,
              }}
              onPress={() => {}}
              title="Đồng ý"
              titleStyle={{
                color: Constant.COLOR.primary,
              }}
              type="outline"
            />
          </View>
        ) : (
          <View
            style={{
              width: '100%',
              height: 50,
              flexDirection: 'row',
              backgroundColor: '#fff',
              position: 'absolute',
              bottom: 100,
            }}>
            {/* <Button
              buttonStyle={{
                width: 150,
                height: 40,
                backgroundColor: Constant.COLOR.primary,
                marginHorizontal: '30%',
              }}
              onPress={() => onchangVisable()}
              title="Thay đổi"
              titleStyle={{
                color: '#fff',
              }}
              type="outline"
            />
          </View>
        )} */}
        <View style={{ width: '100%', height: 40 }}></View>
      </SafeAreaView>
      {/* ----- popup choice gender */}
      <BottomPopupChoiceGender />
      <BottomPopupChoiceDate />
    </>
  );
};

export default ProfileScreen;
