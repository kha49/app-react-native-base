import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    TextInput,
    Text,
    TouchableOpacity,
    Image,
    Keyboard
} from 'react-native'
import PropTypes from 'prop-types'

class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isFocusing: false
        }
    }

    componentDidMount() {
        this.textInput.focus();
    }

    _handleCancelButton = () => {
        const { onCancel } = this.props
        Keyboard.dismiss()
        this.setState({ isFocusing: false })

        // Callback
        onCancel()
    }

    _renderCancelButton = () => {
        return (
            <TouchableOpacity style={styles.cancel}
                onPress={this._handleCancelButton}>
                <Text style={{ fontSize: 16, }}>Hủy</Text>
            </TouchableOpacity>
        )
    }

    render() {
        const { placeholderSearch, keySearch, stylesInput, mainSearchStyle, onChangeTextSearch, isShowCancel } = this.props
        const { isFocusing } = this.state
        return (
            <View style={[styles.mainSearch, mainSearchStyle]}>
                <View style={[styles.searchView, stylesInput]} >
                    <Image source={require('../assets/images/search.png')}
                        resizeMode="contain"
                        style={styles.icon} />
                    <TextInput style={styles.input}
                        ref={ref => this.textInput = ref}
                        placeholder={placeholderSearch || 'Search'}
                        underlineColorAndroid='rgba(255, 255, 255 ,0.0)'
                        placeholderTextColor={'#00000066'}
                        value={keySearch}
                        onChangeText={(text) => onChangeTextSearch(text)}
                        returnKeyType='search'
                        onFocus={() => this.setState({ isFocusing: true })}
                    />
                </View>
                {isFocusing && isShowCancel ? this._renderCancelButton() : null}
            </View>
        )
    }
}

Search.propTypes = {
    placeholderSearch: PropTypes.string,
    keySearch: PropTypes.string,
    stylesInput: PropTypes.any,
    mainSearchStyle: PropTypes.any,
    onChangeTextSearch: PropTypes.func,
    onCancel: PropTypes.func
}

const styles = StyleSheet.create({
    mainSearch: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    searchView: {
        flex: 1,
        height: 36,
        backgroundColor: 'rgba(142,142,147,0.12)',
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 11,
    },
    icon: {
        height: 15,
        width: 15,
        marginRight: 11
    },
    input: {
        flex: 1,
        paddingVertical: 0,
        fontSize: 15,
        // fontFamily: 'Roboto',
    },
    cancel: {
        marginLeft: 8
    },
    cancelText: {
        fontSize: 15
    }
})

export default Search